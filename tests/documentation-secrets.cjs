'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pack = JSON.parse(
  fs.readFileSync(path.join(root, 'documentation-packs/docker-2026-11.json'), 'utf8'),
);
const joined = pack.pages.map((page) => page.text).join('\n');
assert.ok(
  joined.includes('<SWARM_JOIN_TOKEN>'),
  'Expected join-token placeholders in documentation.',
);
assert.ok(
  joined.includes('<SWARM_UNLOCK_KEY>'),
  'Expected unlock-key placeholders in documentation.',
);
assert.doesNotMatch(joined, /\bSWMTKN-1-[A-Za-z0-9]{50}-[A-Za-z0-9]{25}\b/);
assert.doesNotMatch(joined, /\bSWMKEY-1-[A-Za-z0-9+/=]{43}(?![A-Za-z0-9+/=])/);

const script = [
  'import importlib.util',
  'import sys',
  'sys.dont_write_bytecode = True',
  "spec = importlib.util.spec_from_file_location('docker_docs', 'tools/build-docker-doc-pack.py')",
  'mod = importlib.util.module_from_spec(spec)',
  'spec.loader.exec_module(mod)',
  "join = 'SWM' + 'TKN-1-' + 'a' * 50 + '-' + 'b' * 25",
  "unlock = 'SWM' + 'KEY-1-' + 'a+/=' * 10 + 'abc'",
  "assert mod.redact_example_tokens(join + ' ' + unlock) == '<SWARM_JOIN_TOKEN> <SWARM_UNLOCK_KEY>'",
  "assert mod.redact_example_tokens('ordinary example') == 'ordinary example'",
].join('\n');
const result = spawnSync(process.platform === 'win32' ? 'python' : 'python3', ['-c', script], {
  cwd: root,
  encoding: 'utf8',
});
assert.equal(result.status, 0, `Docker documentation redaction test failed: ${result.stderr}`);
console.log(
  'PASS: Docker documentation examples redact Swarm token shapes and retain placeholders.',
);
