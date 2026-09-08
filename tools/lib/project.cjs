'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const MANIFEST_PATH = path.join(ROOT, 'app-manifest.json');
const INDEX_PATH = path.join(ROOT, 'index.html');
const DIST_PATH = path.join(ROOT, 'dist', 'devkit.html');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadProject() {
  const manifest = readJson(MANIFEST_PATH);
  const packageJson = readJson(path.join(ROOT, 'package.json'));
  return { root: ROOT, manifest, packageJson };
}

function assertUniqueFiles(files, label) {
  const seen = new Set();
  for (const file of files) {
    if (typeof file !== 'string' || !file || path.isAbsolute(file) || file.includes('..')) {
      throw new Error(`${label} contains an unsafe path: ${String(file)}`);
    }
    const normalized = file.replaceAll('\\', '/');
    if (seen.has(normalized)) throw new Error(`${label} contains a duplicate: ${file}`);
    seen.add(normalized);
    if (!fs.statSync(path.join(ROOT, file), { throwIfNoEntry: false })?.isFile()) {
      throw new Error(`${label} references a missing file: ${file}`);
    }
  }
}

function validateProject(project = loadProject()) {
  const { manifest, packageJson } = project;
  if (!manifest || manifest.name !== 'DevKit' || manifest.entry !== 'index.html') {
    throw new Error('app-manifest.json has an invalid application identity.');
  }
  if (manifest.version !== packageJson.version) {
    throw new Error(
      `Version mismatch: manifest ${manifest.version}, package ${packageJson.version}.`,
    );
  }
  if (!Array.isArray(manifest.javascript) || !Array.isArray(manifest.styles)) {
    throw new Error('The app manifest must define javascript and styles arrays.');
  }
  assertUniqueFiles(manifest.javascript, 'manifest.javascript');
  assertUniqueFiles(manifest.styles, 'manifest.styles');
  return project;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function assetPattern(file) {
  const target = escapeRegex(file);
  return file.endsWith('.css')
    ? new RegExp(
        `<link\\b(?=[^>]*\\brel=["']stylesheet["'])(?=[^>]*\\bhref=["']${target}["'])[^>]*>`,
        'gi',
      )
    : new RegExp(`<script\\b(?=[^>]*\\bsrc=["']${target}["'])[^>]*>\\s*</script>`, 'gi');
}

function assertIndexOrder(html, manifest) {
  const assets = [...manifest.styles, ...manifest.javascript];
  let cursor = -1;
  for (const file of assets) {
    const matches = [...html.matchAll(assetPattern(file))];
    if (!matches.length) throw new Error(`index.html does not load ${file}.`);
    if (matches.length > 1) {
      throw new Error(`index.html loads ${file} more than once.`);
    }
    if (matches[0].index <= cursor)
      throw new Error(`index.html loads ${file} out of manifest order.`);
    cursor = matches[0].index;
  }
}

module.exports = {
  ROOT,
  MANIFEST_PATH,
  INDEX_PATH,
  DIST_PATH,
  loadProject,
  validateProject,
  assertIndexOrder,
  assetPattern,
};
