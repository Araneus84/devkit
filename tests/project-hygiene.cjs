'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const {
  INDEX_PATH,
  DIST_PATH,
  loadProject,
  validateProject,
  assertIndexOrder,
} = require('../tools/lib/project.cjs');
const { renderStandalone } = require('../tools/build.cjs');

const project = validateProject(loadProject());
const index = fs.readFileSync(INDEX_PATH, 'utf8');

assert.doesNotThrow(() => assertIndexOrder(index, project.manifest));

const firstScript = project.manifest.javascript[0];
const firstTag = `<script defer src="${firstScript}"></script>`;
assert.throws(
  () => assertIndexOrder(index.replace(firstTag, ''), project.manifest),
  new RegExp(`does not load ${firstScript.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
);
assert.throws(
  () => assertIndexOrder(index.replace(firstTag, `${firstTag}\n${firstTag}`), project.manifest),
  /more than once/,
);

const standalone = renderStandalone();
assert.equal(standalone, fs.readFileSync(DIST_PATH, 'utf8'));
assert.ok(
  standalone.length > index.length,
  'The portable build should contain inlined application assets.',
);
assert.ok(
  !standalone.includes(firstTag),
  'The portable build should not retain manifest script tags.',
);
assert.ok(
  standalone.includes('"[^"$`\\\\]*"'),
  'Literal JavaScript replacement tokens must survive inlining.',
);

console.log('Project hygiene tests passed.');
