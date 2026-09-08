#!/usr/bin/env node
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const yaml = require('../vendor/js-yaml.min.js');

const VERSION = '1.0.0';
const BODY_LIMIT = 1024 * 1024;
const OUTPUT_LIMIT = 256 * 1024;
const TIMEOUT_MS = 12000;
const TOOL_SPECS = Object.freeze({
  git: [['git'], ['--version']],
  node: [[process.execPath], ['--version']],
  python: [['python', 'python3'], ['--version']],
  bash: [['bash'], ['--version']],
  powershell: [
    ['pwsh', 'powershell'],
    ['-NoProfile', '-NonInteractive', '-Command', '$PSVersionTable.PSVersion.ToString()'],
  ],
  terraform: [['terraform'], ['version']],
  ansible: [['ansible'], ['--version']],
  docker: [['docker'], ['--version']],
  kubectl: [['kubectl'], ['version', '--client=true']],
  ruff: [['ruff'], ['--version']],
});

function safeText(value) {
  return String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
}
function limited(text) {
  const value = safeText(text);
  return value.length > OUTPUT_LIMIT
    ? value.slice(0, OUTPUT_LIMIT) + '\n… output truncated by DevKit Companion'
    : value;
}
function runFixed(command, args, options = {}) {
  return new Promise((resolve) => {
    let stdout = '',
      stderr = '',
      done = false,
      timedOut = false;
    let child;
    try {
      child = spawn(command, args, {
        cwd: options.cwd,
        env: options.env || process.env,
        shell: false,
        windowsHide: true,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (error) {
      resolve({
        code: null,
        signal: null,
        stdout: '',
        stderr: '',
        timedOut: false,
        error: error.message,
      });
      return;
    }
    const collect = (kind, chunk) => {
      if (stdout.length + stderr.length >= OUTPUT_LIMIT) return;
      if (kind === 'out') stdout += chunk;
      else stderr += chunk;
    };
    child.stdout.on('data', (chunk) => collect('out', chunk));
    child.stderr.on('data', (chunk) => collect('err', chunk));
    child.on('error', (error) => finish(null, error));
    child.on('close', (code, signal) =>
      finish({ code, signal, stdout: limited(stdout), stderr: limited(stderr), timedOut }),
    );
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, options.timeout || TIMEOUT_MS);
    function finish(result, error) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(
        error
          ? {
              code: null,
              signal: null,
              stdout: limited(stdout),
              stderr: limited(stderr),
              timedOut,
              error: error.message,
            }
          : result,
      );
    }
    if (options.stdin != null) child.stdin.end(String(options.stdin));
    else child.stdin.end();
  });
}
async function firstAvailable(names, args, options) {
  for (const command of names) {
    const result = await runFixed(command, args, options);
    if (!result.error) return { command, ...result };
  }
  return null;
}
async function detectCommand(names, args) {
  for (const command of names) {
    const result = await runFixed(command, args, { timeout: 4000 });
    if (!result.error && result.code === 0) return { command, ...result };
  }
  return null;
}
async function detectTools() {
  const entries = [];
  for (const [id, [names, args]] of Object.entries(TOOL_SPECS)) {
    if (id === 'node') {
      entries.push([id, { available: true, command: process.execPath, version: process.version }]);
      continue;
    }
    const result = await detectCommand(names, args);
    entries.push([
      id,
      result
        ? {
            available: true,
            command: result.command,
            version:
              limited((result.stdout || result.stderr).trim()).split(/\r?\n/)[0] || 'available',
          }
        : { available: false },
    ]);
  }
  return Object.fromEntries(entries);
}
function parseDocuments(content) {
  const docs = [];
  yaml.loadAll(content, (doc) => docs.push(doc));
  return docs.length;
}
function diagnosticFrom(error) {
  const mark = error && error.mark;
  return {
    message: safeText(error?.reason || error?.message || error),
    line: mark ? mark.line + 1 : null,
    column: mark ? mark.column + 1 : null,
  };
}
async function validateContent(language, content, tempDir) {
  const lang = String(language || '').toLowerCase();
  try {
    if (lang === 'json') {
      JSON.parse(content);
      return { ok: true, message: 'Valid JSON.' };
    }
    if (lang === 'yaml' || lang === 'yml' || lang === 'ansible') {
      const count = parseDocuments(content);
      return { ok: true, message: `Valid YAML (${count} document${count === 1 ? '' : 's'}).` };
    }
  } catch (error) {
    return { ok: false, message: 'Syntax error.', diagnostics: [diagnosticFrom(error)] };
  }
  const specs = {
    bash: { names: ['bash'], args: (file) => ['-n', file], ext: '.sh' },
    python: {
      names: ['python', 'python3'],
      args: (file) => ['-m', 'py_compile', file],
      ext: '.py',
    },
    powershell: {
      names: ['pwsh', 'powershell'],
      args: (file) => [
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        '$e=$null;$t=$null;[System.Management.Automation.Language.Parser]::ParseFile($args[0],[ref]$t,[ref]$e)|Out-Null;if($e.Count){$e|ForEach-Object{$_.ToString()};exit 1}',
        file,
      ],
      ext: '.ps1',
    },
    terraform: {
      names: ['terraform'],
      args: (file) => ['fmt', '-check', '-diff', file],
      ext: '.tf',
    },
  };
  const spec = specs[lang];
  if (!spec)
    return {
      ok: false,
      unsupported: true,
      message: 'This language is not available for controlled validation.',
    };
  const file = path.join(tempDir, 'input' + spec.ext);
  fs.writeFileSync(file, content, 'utf8');
  const env = { ...process.env, PYTHONPYCACHEPREFIX: path.join(tempDir, 'pycache') };
  const result = await firstAvailable(spec.names, spec.args(file), { cwd: tempDir, env });
  if (!result)
    return {
      ok: false,
      unavailable: true,
      message: `${spec.names.join(' or ')} is not installed.`,
    };
  const detail = limited((result.stderr || result.stdout).trim());
  return {
    ok: result.code === 0,
    message:
      result.code === 0
        ? 'Syntax check passed.'
        : result.timedOut
          ? 'Validation timed out.'
          : 'Syntax check failed.',
    detail,
    tool: result.command,
  };
}
async function formatContent(language, content, tempDir) {
  const lang = String(language || '').toLowerCase();
  try {
    if (lang === 'json')
      return {
        ok: true,
        content: JSON.stringify(JSON.parse(content), null, 2) + '\n',
        message: 'Formatted as two-space JSON.',
      };
    if (lang === 'yaml' || lang === 'yml' || lang === 'ansible') {
      const docs = [];
      yaml.loadAll(content, (d) => docs.push(d));
      return {
        ok: true,
        content: docs
          .map((d) => yaml.dump(d, { indent: 2, noRefs: false, lineWidth: 100 }))
          .join('---\n'),
        message: 'Formatted as two-space YAML. Comments are not retained by this formatter.',
      };
    }
  } catch (error) {
    return {
      ok: false,
      message: 'Cannot format invalid input.',
      diagnostics: [diagnosticFrom(error)],
    };
  }
  if (lang !== 'terraform')
    return {
      ok: false,
      unsupported: true,
      message: 'Controlled formatting is available for JSON, YAML, Ansible and Terraform.',
    };
  const result = await firstAvailable(['terraform'], ['fmt', '-'], {
    cwd: tempDir,
    stdin: content,
  });
  if (!result) return { ok: false, unavailable: true, message: 'terraform is not installed.' };
  return result.code === 0
    ? { ok: true, content: result.stdout, message: 'Formatted with terraform fmt.' }
    : {
        ok: false,
        message: 'terraform fmt failed.',
        detail: limited((result.stderr || result.stdout).trim()),
      };
}
function allowedOrigin(origin) {
  return (
    !origin ||
    origin === 'null' ||
    origin === 'https://araneus84.github.io' ||
    /^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/.test(origin)
  );
}
function loopbackHost(host) {
  return /^(?:127\.0\.0\.1|localhost)(?::\d+)?$/i.test(host || '');
}
function validToken(value, expected) {
  const left = Buffer.from(String(value || '')),
    right = Buffer.from(expected);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
function jsonResponse(res, status, value, origin) {
  const body = JSON.stringify(value);
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  };
  if (origin && allowedOrigin(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  res.writeHead(status, headers);
  res.end(body);
}
function readJson(req) {
  return new Promise((resolve, reject) => {
    let bytes = 0,
      chunks = [];
    req.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > BODY_LIMIT) {
        reject(Object.assign(Error('Request body exceeds 1 MB.'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {});
      } catch {
        reject(Object.assign(Error('Request body must be valid JSON.'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}
function createRateLimiter() {
  const clients = new Map();
  return (address) => {
    const now = Date.now(),
      prior = clients.get(address);
    if (!prior || now - prior.start >= 60000) {
      clients.set(address, { start: now, count: 1 });
      return true;
    }
    prior.count++;
    return prior.count <= 120;
  };
}
function createCompanion(options = {}) {
  const root = path.resolve(options.root || process.cwd()),
    token = options.token || crypto.randomBytes(24).toString('base64url'),
    port = Number.isInteger(options.port) ? options.port : Number(options.port || 3210),
    rate = createRateLimiter();
  let toolCache = null,
    toolCacheAt = 0;
  const server = http.createServer(async (req, res) => {
    const origin = req.headers.origin;
    if (!loopbackHost(req.headers.host))
      return jsonResponse(res, 403, { error: 'Loopback Host header required.' });
    if (!allowedOrigin(origin)) return jsonResponse(res, 403, { error: 'Origin is not allowed.' });
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': origin || 'null',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-DevKit-Token',
        'Access-Control-Allow-Private-Network': 'true',
        'Access-Control-Max-Age': '600',
        'Cache-Control': 'no-store',
      });
      return res.end();
    }
    if (!rate(req.socket.remoteAddress || 'local'))
      return jsonResponse(res, 429, { error: 'Rate limit exceeded.' }, origin);
    if (!validToken(req.headers['x-devkit-token'], token))
      return jsonResponse(
        res,
        401,
        { error: 'A valid DevKit Companion token is required.' },
        origin,
      );
    const url = new URL(req.url, 'http://127.0.0.1');
    try {
      if (req.method === 'GET' && url.pathname === '/health')
        return jsonResponse(
          res,
          200,
          {
            name: 'DevKit Companion',
            version: VERSION,
            root,
            capabilities: ['tools', 'git-status', 'validate', 'format'],
          },
          origin,
        );
      if (req.method === 'GET' && url.pathname === '/tools') {
        if (!toolCache || Date.now() - toolCacheAt > 30000) {
          toolCache = await detectTools();
          toolCacheAt = Date.now();
        }
        return jsonResponse(res, 200, { tools: toolCache }, origin);
      }
      if (req.method === 'GET' && url.pathname === '/git/status') {
        const result = await runFixed('git', ['-C', root, 'status', '--short', '--branch'], {
          cwd: root,
        });
        return jsonResponse(
          res,
          result.error ? 503 : 200,
          result.error
            ? { ok: false, message: 'git is not installed.' }
            : {
                ok: result.code === 0,
                output: limited((result.stdout || result.stderr).trim()),
                message: result.code === 0 ? 'Git status read successfully.' : 'Git status failed.',
              },
          origin,
        );
      }
      if (req.method === 'POST' && (url.pathname === '/validate' || url.pathname === '/format')) {
        const body = await readJson(req);
        if (typeof body.content !== 'string' || body.content.length > BODY_LIMIT)
          throw Object.assign(Error('content must be a string no larger than 1 MB.'), {
            status: 400,
          });
        if (typeof body.language !== 'string' || body.language.length > 32)
          throw Object.assign(Error('language must be a short string.'), { status: 400 });
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devkit-companion-'));
        try {
          const value =
            url.pathname === '/validate'
              ? await validateContent(body.language, body.content, tempDir)
              : await formatContent(body.language, body.content, tempDir);
          return jsonResponse(
            res,
            value.unsupported ? 422 : value.unavailable ? 503 : 200,
            value,
            origin,
          );
        } finally {
          try {
            fs.rmSync(tempDir, { recursive: true, force: true });
          } catch {}
        }
      }
      return jsonResponse(res, 404, { error: 'Unknown endpoint.' }, origin);
    } catch (error) {
      if (!res.writableEnded)
        jsonResponse(res, error.status || 500, { error: safeText(error.message || error) }, origin);
    }
  });
  return {
    server,
    root,
    token,
    port,
    start: () =>
      new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, '127.0.0.1', () => {
          server.off('error', reject);
          resolve(server.address());
        });
      }),
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}
function help() {
  return `DevKit Companion ${VERSION}\n\nUsage: node companion/devkit-companion.cjs [--root PATH] [--port NUMBER]\n\nBinds only to 127.0.0.1. DevKit connects with the one-time token printed here.\n`;
}
function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--root') options.root = argv[++i];
    else if (arg === '--port') options.port = Number(argv[++i]);
    else throw Error('Unknown option: ' + arg);
  }
  if (
    options.port != null &&
    (!Number.isInteger(options.port) || options.port < 0 || options.port > 65535)
  )
    throw Error('Port must be between 0 and 65535.');
  return options;
}
if (require.main === module) {
  (async () => {
    try {
      const options = parseArgs(process.argv.slice(2));
      if (options.help) {
        process.stdout.write(help());
        return;
      }
      const companion = createCompanion(options),
        address = await companion.start();
      console.log(`DevKit Companion ${VERSION}`);
      console.log(`Listening: http://127.0.0.1:${address.port}`);
      console.log(`Root: ${companion.root}`);
      console.log(`Token: ${companion.token}`);
      console.log('Keep this terminal open. Press Ctrl+C to stop.');
      const stop = async () => {
        await companion.close();
        process.exit(0);
      };
      process.once('SIGINT', stop);
      process.once('SIGTERM', stop);
    } catch (error) {
      console.error('DevKit Companion:', error.message);
      process.exitCode = 1;
    }
  })();
}

module.exports = {
  VERSION,
  TOOL_SPECS,
  runFixed,
  detectTools,
  validateContent,
  formatContent,
  allowedOrigin,
  loopbackHost,
  validToken,
  createCompanion,
  parseArgs,
};
