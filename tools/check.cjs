#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {
  ROOT,
  INDEX_PATH,
  DIST_PATH,
  validateProject,
  assertIndexOrder,
} = require('./lib/project.cjs');
const { renderStandalone } = require('./build.cjs');
const { REFERENCE_OUTPUT, BUILDERS_OUTPUT, renderCatalogs } = require('./lib/catalogs.cjs');

function authoredFiles() {
  const roots = ['src', 'styles', 'tools', 'tests', 'companion', 'docs', 'data'];
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else files.push(file);
    }
  };
  for (const root of roots) visit(path.join(ROOT, root));
  return files;
}

function checkText(file) {
  const relative = path.relative(ROOT, file).replaceAll('\\', '/');
  const source = fs.readFileSync(file, 'utf8');
  if (source.charCodeAt(0) === 0xfeff)
    throw new Error(`${relative} starts with a byte-order mark.`);
  if (/[ \t]+$/m.test(source)) throw new Error(`${relative} contains trailing whitespace.`);
  if (!source.endsWith('\n')) throw new Error(`${relative} needs a final newline.`);
  if (/\.(?:js|cjs)$/.test(file)) new vm.Script(source, { filename: relative });
  if (/\.json$/.test(file)) JSON.parse(source);
}

function checkIgnoreFile() {
  const lines = fs
    .readFileSync(path.join(ROOT, '.gitignore'), 'utf8')
    .split(/\r?\n/)
    .filter(Boolean);
  const duplicate = lines.find((line, index) => lines.indexOf(line) !== index);
  if (duplicate) throw new Error(`.gitignore contains a duplicate entry: ${duplicate}`);
}

function check() {
  const { manifest } = validateProject();
  assertIndexOrder(fs.readFileSync(INDEX_PATH, 'utf8'), manifest);
  for (const file of authoredFiles()) checkText(file);
  checkIgnoreFile();
  const dockerPack = fs.readFileSync(
    path.join(ROOT, 'documentation-packs/docker-2026-11.json'),
    'utf8',
  );
  if (
    /\bSWMTKN-1-[A-Za-z0-9]{50}-[A-Za-z0-9]{25}\b/.test(dockerPack) ||
    /\bSWMKEY-1-[A-Za-z0-9+/=]{43}(?![A-Za-z0-9+/=])/.test(dockerPack)
  ) {
    throw new Error(
      'Docker documentation contains a Swarm token or unlock key. Regenerate the documentation pack.',
    );
  }
  const kubernetesPack = fs.readFileSync(
    path.join(ROOT, 'documentation-packs/kubernetes-2026-11.json'),
    'utf8',
  );
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(kubernetesPack)) {
    throw new Error(
      'Kubernetes documentation contains a private key marker. Regenerate the documentation pack.',
    );
  }
  const npmPack = fs.readFileSync(path.join(ROOT, 'documentation-packs/npm-12.2.2.json'), 'utf8');
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(npmPack)) {
    throw new Error(
      'npm documentation contains a private key marker. Regenerate the documentation pack.',
    );
  }
  const catalogs = renderCatalogs();
  if (fs.readFileSync(REFERENCE_OUTPUT, 'utf8') !== catalogs.reference) {
    throw new Error('src/reference-data.js is stale. Run npm run build and commit it.');
  }
  if (fs.readFileSync(BUILDERS_OUTPUT, 'utf8') !== catalogs.builders) {
    throw new Error('src/command-definitions.js is stale. Run npm run build and commit it.');
  }
  const expected = renderStandalone();
  const actual = fs.readFileSync(DIST_PATH, 'utf8');
  if (actual !== expected)
    throw new Error('dist/devkit.html is stale. Run npm run build and commit it.');
  console.log(
    `Project check passed: ${manifest.javascript.length} scripts, ${manifest.styles.length} styles, clean source text, current standalone build.`,
  );
}

try {
  check();
} catch (error) {
  console.error(`Project check failed: ${error.message}`);
  process.exitCode = 1;
}
