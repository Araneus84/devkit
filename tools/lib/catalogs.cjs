'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('./project.cjs');

const DATA_ROOT = path.join(ROOT, 'data');
const CATALOG_MANIFEST_PATH = path.join(DATA_ROOT, 'catalog-manifest.json');
const REFERENCE_OUTPUT = path.join(ROOT, 'src', 'reference-data.js');
const BUILDERS_OUTPUT = path.join(ROOT, 'src', 'command-definitions.js');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function validateNames(names, label) {
  if (!Array.isArray(names) || !names.length)
    throw new Error(`${label} must be a non-empty array.`);
  const seen = new Set();
  for (const name of names) {
    if (typeof name !== 'string' || !/^[a-z0-9-]+$/.test(name))
      throw new Error(`${label} contains an invalid name.`);
    if (seen.has(name)) throw new Error(`${label} contains a duplicate: ${name}`);
    seen.add(name);
  }
}

function validateCatalogFiles(directory, names, label) {
  const expected = names.map((name) => `${name}.json`).sort();
  const actual = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label} files do not match data/catalog-manifest.json.`);
  }
}

function loadCatalogs() {
  const manifest = readJson(CATALOG_MANIFEST_PATH);
  validateNames(manifest.sheets, 'catalog sheets');
  validateNames(manifest.builderGroups, 'catalog builder groups');
  validateCatalogFiles(path.join(DATA_ROOT, 'reference'), manifest.sheets, 'Reference catalog');
  validateCatalogFiles(path.join(DATA_ROOT, 'builders'), manifest.builderGroups, 'Builder catalog');

  const sheets = {};
  for (const name of manifest.sheets) {
    const sheet = readJson(path.join(DATA_ROOT, 'reference', `${name}.json`));
    if (!sheet || typeof sheet !== 'object' || !Array.isArray(sheet.sections)) {
      throw new Error(`Reference catalog ${name} has an invalid shape.`);
    }
    sheets[name] = sheet;
  }

  const builders = {};
  for (const group of manifest.builderGroups) {
    const definitions = readJson(path.join(DATA_ROOT, 'builders', `${group}.json`));
    for (const [key, definition] of Object.entries(definitions)) {
      if (!key.startsWith(`${group}::`)) throw new Error(`Builder ${key} is in the wrong group.`);
      if (builders[key]) throw new Error(`Duplicate builder key: ${key}`);
      if (!definition || typeof definition !== 'object' || typeof definition.name !== 'string') {
        throw new Error(`Builder ${key} has an invalid shape.`);
      }
      builders[key] = definition;
    }
  }

  return { manifest, sheets, builders };
}

function generatedSource(name, value, sourceDirectory) {
  return [
    `/* Generated from ${sourceDirectory}. Edit the JSON source and run npm run build. */`,
    `const ${name} = ${JSON.stringify(value, null, 2)};`,
    '',
  ].join('\n');
}

function renderCatalogs() {
  const { sheets, builders } = loadCatalogs();
  return {
    reference: generatedSource('SHEETS', sheets, 'data/reference'),
    builders: generatedSource('BUILDERS', builders, 'data/builders'),
  };
}

function writeCatalogs() {
  const rendered = renderCatalogs();
  fs.writeFileSync(REFERENCE_OUTPUT, rendered.reference);
  fs.writeFileSync(BUILDERS_OUTPUT, rendered.builders);
  return rendered;
}

module.exports = {
  CATALOG_MANIFEST_PATH,
  REFERENCE_OUTPUT,
  BUILDERS_OUTPUT,
  loadCatalogs,
  renderCatalogs,
  writeCatalogs,
};
