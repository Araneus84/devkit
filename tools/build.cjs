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
  assetPattern,
} = require('./lib/project.cjs');
const { writeCatalogs } = require('./lib/catalogs.cjs');

const NOTICE_FILES = [
  'LICENSE',
  'NOTICE',
  'vendor/LICENSE.js-yaml.txt',
  'vendor/LICENSE.yaml.txt',
  'vendor/LICENSE.lezer.txt',
  'vendor/codemirror/LICENSE',
  'vendor/codemirror/LICENSE.vim.txt',
];

function inlineScript(html, file) {
  const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
  new vm.Script(source, { filename: file });
  const inline = `<script>\n${source.replace(/<\/script/gi, '<\\/script')}\n</script>`;
  return html.replace(assetPattern(file), () => inline);
}

function inlineStyle(html, file) {
  const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const inline = `<style>\n${source}\n</style>`;
  return html.replace(assetPattern(file), () => inline);
}

function licenseNotice() {
  const text = NOTICE_FILES.map(
    (file) => `${file}\n\n${fs.readFileSync(path.join(ROOT, file), 'utf8')}`,
  ).join('\n\n');
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<template id="dk-license-notices">${escaped}</template>\n`;
}

function renderStandalone() {
  const { manifest } = validateProject();
  let html = fs.readFileSync(INDEX_PATH, 'utf8');
  assertIndexOrder(html, manifest);
  for (const file of manifest.javascript) html = inlineScript(html, file);
  for (const file of manifest.styles) html = inlineStyle(html, file);
  if (/<(?:script|link)[^>]+(?:src|href)="(?:src|styles|vendor)\//.test(html)) {
    throw new Error('The standalone build still contains an external application asset.');
  }
  return html.replace('</body>', () => `${licenseNotice()}</body>`);
}

function build() {
  writeCatalogs();
  const html = renderStandalone();
  fs.mkdirSync(path.dirname(DIST_PATH), { recursive: true });
  fs.writeFileSync(DIST_PATH, html);
  console.log(`Built ${path.relative(ROOT, DIST_PATH)} (${Buffer.byteLength(html)} bytes)`);
}

if (require.main === module) build();

module.exports = { NOTICE_FILES, renderStandalone, build };
