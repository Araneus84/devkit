const fs = require('node:fs'),
  path = require('node:path'),
  vm = require('node:vm'),
  assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..'),
  store = new Map(),
  context = vm.createContext({
    console,
    localStorage: {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
  });
for (const file of [
  'vendor/js-yaml.min.js',
  'src/command-definitions.js',
  'src/reference-data.js',
  'src/tool-guides.js',
  'src/recipe-catalog.js',
  'src/recipe-packs.js',
])
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
const report = vm.runInContext(
  `(()=>{const pack=rpValidatePack(RP_EXAMPLE_PACK);rpApplyPack(pack);const bash=DK_RECIPES['pack:example.devops:safe-backup'],powershell=DK_RECIPES['pack:example.devops:service-inventory'];const required={paths:{source:'source folder',destination:'/backup/app/'}};return{pack,withoutOptional:bash.generate(required,[],{shell:'posix'}),withOptional:bash.generate({...required,'dry-run':{}},[],{shell:'posix'}),powershell:powershell.generate({output:{path:"report's file.csv"},fields:{names:['Name','Status','StartType']}},[],{shell:'powershell'}),recipeId:bash.id};})()`,
  context,
);
assert.equal(report.pack.recipes.length, 2);
assert.equal(report.recipeId, 'pack:example.devops:safe-backup');
assert.match(report.withoutOptional, /'source folder'/);
assert(!report.withoutOptional.includes('--dry-run'));
assert(report.withOptional.includes('--dry-run'));
assert(
  report.powershell.includes('Name, Status, StartType') &&
    report.powershell.includes("'report''s file.csv'"),
);
const emptyName = JSON.parse(JSON.stringify(report.pack));
emptyName.name = '';
assert.throws(() => {
  context.value = emptyName;
  vm.runInContext('rpValidatePack(value)', context);
}, /cannot be empty/);
const invalid = [
  [
    'generator code',
    { ...JSON.parse(JSON.stringify(report.pack)), generate: 'alert(1)' },
    /unsupported key/,
  ],
  [
    'unknown module',
    (() => {
      const x = JSON.parse(JSON.stringify(report.pack));
      x.recipes[0].sheet = 'unknown';
      return x;
    })(),
    /unknown DevKit module/,
  ],
  [
    'unsafe filename',
    (() => {
      const x = JSON.parse(JSON.stringify(report.pack));
      x.recipes[0].filename = '../run.sh';
      return x;
    })(),
    /unsafe filename/,
  ],
  [
    'unknown placeholder',
    (() => {
      const x = JSON.parse(JSON.stringify(report.pack));
      x.recipes[0].output = [{ template: '<<missing.value>>' }];
      return x;
    })(),
    /unknown placeholder/,
  ],
  [
    'unknown filter',
    (() => {
      const x = JSON.parse(JSON.stringify(report.pack));
      x.recipes[0].output = [{ template: '<<paths.source|execute>>' }];
      return x;
    })(),
    /unsupported filter/,
  ],
  [
    'prototype key',
    JSON.parse(
      '{"format":"devkit-recipe-pack","version":1,"id":"bad.pack","name":"Bad","recipes":[],"__proto__":{}}',
    ),
    /unsupported key/,
  ],
];
for (const [label, value, pattern] of invalid)
  assert.throws(
    () => {
      context.value = value;
      vm.runInContext('rpValidatePack(value)', context);
    },
    pattern,
    label,
  );
context.value = [report.pack, report.pack];
assert.throws(() => vm.runInContext('rpValidateLibrary(value)', context), /Duplicate pack ID/);
const sources =
  fs.readFileSync(path.join(root, 'src/recipe-packs.js'), 'utf8') +
  fs.readFileSync(path.join(root, 'src/recipe-packs-ui.js'), 'utf8');
assert(!/\beval\s*\(|new Function|\.innerHTML\s*=|insertAdjacentHTML/.test(sources));
console.log(
  'PASS: JSON-only recipe packs validate bounded schemas, fixed placeholders, filters, optional segments, shell quoting, collision-safe IDs and reject code, traversal, unknown modules, filters, placeholders, duplicate packs and prototype keys.',
);
