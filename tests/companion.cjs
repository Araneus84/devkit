const assert = require('node:assert/strict'),
  fs = require('node:fs'),
  path = require('node:path'),
  http = require('node:http');
const root = path.resolve(__dirname, '..'),
  companionModule = require('../companion/devkit-companion.cjs');
function request(
  port,
  pathname,
  { method = 'GET', token = 'qa-token', origin = 'null', host = `127.0.0.1:${port}`, body } = {},
) {
  return new Promise((resolve, reject) => {
    const text = body === undefined ? null : JSON.stringify(body),
      req = http.request(
        {
          host: '127.0.0.1',
          port,
          path: pathname,
          method,
          headers: {
            Host: host,
            Origin: origin,
            ...(token ? { 'X-DevKit-Token': token } : {}),
            ...(text
              ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(text) }
              : {}),
          },
        },
        (res) => {
          let chunks = '';
          res.setEncoding('utf8');
          res.on('data', (x) => (chunks += x));
          res.on('end', () =>
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: chunks ? JSON.parse(chunks) : null,
            }),
          );
        },
      );
    req.on('error', reject);
    if (text) req.end(text);
    else req.end();
  });
}
(async () => {
  const instance = companionModule.createCompanion({ root, port: 0, token: 'qa-token' }),
    address = await instance.start();
  try {
    const port = address.port;
    let response = await request(port, '/health');
    assert.equal(response.status, 200);
    assert.equal(response.body.version, '1.0.0');
    assert.equal(response.body.root, root);
    assert.equal(response.headers['access-control-allow-origin'], 'null');
    assert.equal((await request(port, '/health', { token: '' })).status, 401);
    assert.equal((await request(port, '/health', { host: 'example.com' })).status, 403);
    assert.equal((await request(port, '/health', { origin: 'https://evil.example' })).status, 403);
    response = await request(port, '/health', { method: 'OPTIONS', token: '' });
    assert.equal(response.status, 204);
    assert.equal(response.headers['access-control-allow-private-network'], 'true');
    response = await request(port, '/tools');
    assert.equal(response.status, 200);
    assert.equal(response.body.tools.node.available, true);
    assert.match(response.body.tools.node.version, /^v?\d+/);
    assert(Object.keys(response.body.tools).includes('terraform'));
    response = await request(port, '/git/status');
    assert.equal(response.status, 200);
    assert.equal(response.body.ok, true);
    assert.match(response.body.output, /^## /);
    response = await request(port, '/validate', {
      method: 'POST',
      body: { language: 'json', content: '{"ready":true}' },
    });
    assert.equal(response.body.ok, true);
    response = await request(port, '/validate', {
      method: 'POST',
      body: { language: 'json', content: '{"broken":}' },
    });
    assert.equal(response.body.ok, false);
    assert(response.body.diagnostics[0].message);
    response = await request(port, '/validate', {
      method: 'POST',
      body: { language: 'ansible', content: '- name: test\n  hosts: all\n  tasks: []\n' },
    });
    assert.equal(response.body.ok, true);
    response = await request(port, '/format', {
      method: 'POST',
      body: { language: 'json', content: '{"a":1}' },
    });
    assert.equal(response.body.content, '{\n  "a": 1\n}\n');
    response = await request(port, '/format', {
      method: 'POST',
      body: { language: 'yaml', content: 'name: test\nitems: [one, two]\n' },
    });
    assert.equal(response.body.ok, true);
    assert.match(response.body.content, /items:\n  - one/);
    response = await request(port, '/validate', {
      method: 'POST',
      body: { language: 'rm -rf', content: 'x' },
    });
    assert.equal(response.status, 422);
    assert.equal(response.body.unsupported, true);
    assert.equal((await request(port, '/files')).status, 404);
    assert.equal(
      (await request(port, '/execute', { method: 'POST', body: { command: 'whoami' } })).status,
      404,
    );
    const source = fs.readFileSync(path.join(root, 'companion/devkit-companion.cjs'), 'utf8');
    assert(!/\bexec(?:File|Sync)?\s*\(|shell\s*:\s*true|\beval\s*\(|new Function/.test(source));
    assert.equal(companionModule.allowedOrigin('https://araneus84.github.io'), true);
    assert.equal(companionModule.allowedOrigin('https://evil.example'), false);
    assert.equal(companionModule.loopbackHost('localhost:3210'), true);
    assert.equal(companionModule.validToken('qa-token', 'qa-token'), true);
    assert.equal(companionModule.validToken('bad', 'qa-token'), false);
    assert.throws(() => companionModule.parseArgs(['--port', '70000']), /between 0 and 65535/);
    console.log(
      'PASS: loopback companion enforces token, Host, Origin, fixed endpoints and bounded data; detects tools, reads Git status, validates/formats safe inputs, and exposes no shell, command or file API.',
    );
  } finally {
    await instance.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
