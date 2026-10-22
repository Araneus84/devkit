// Linux infrastructure pack: catalog shape, builder keys, recipe output and script syntax.
const fs = require('node:fs'),
  path = require('node:path'),
  vm = require('node:vm'),
  { spawnSync } = require('node:child_process'),
  assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..'),
  context = vm.createContext({ console });
for (const file of [
  'vendor/js-yaml.min.js',
  'src/command-definitions.js',
  'src/reference-data.js',
  'src/tool-guides.js',
  'src/recipe-catalog.js',
  'src/infra-recipes.js',
])
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });

const PACK = {
  dns: 60,
  lb: 50,
  tls: 40,
  netdiag: 60,
  perf: 70,
  storage: 60,
  secaudit: 70,
  patching: 45,
  puppet: 40,
  runbooks: 90,
};
const report = vm.runInContext(
  `(()=>{
  const out={sheets:{},recipes:{}};
  for(const id of ${JSON.stringify(Object.keys(PACK))}){
    const sheet=SHEETS[id];
    out.sheets[id]={
      exists:!!sheet,
      commands:sheet.sections.flatMap(s=>s.cmds.map(c=>c.cmd)),
      guide:!!DK_GUIDES[id],
      builders:Object.keys(BUILDERS).filter(k=>k.startsWith(id+'::')),
      recipes:Object.values(DK_RECIPES).filter(r=>r.sheet===id).map(r=>r.id)
    };
  }
  for(const recipe of Object.values(DK_RECIPES).filter(r=>${JSON.stringify(Object.keys(PACK))}.includes(r.sheet))){
    const blocks=recipe.parts.map(p=>({key:p.key,values:Object.fromEntries(Object.entries(p.fields).map(([k,f])=>[k,JSON.parse(JSON.stringify(f.value))]))}));
    const values=Object.fromEntries(blocks.map(b=>[b.key,b.values]));
    out.recipes[recipe.id]={text:recipe.generate(values,blocks,{shell:'posix'}),filename:recipe.filename};
  }
  return out;
})()`,
  context,
);

for (const [id, minimum] of Object.entries(PACK)) {
  const sheet = report.sheets[id];
  assert(sheet.exists, id + ' sheet missing');
  assert(sheet.commands.length >= minimum, id + ' has only ' + sheet.commands.length + ' commands');
  assert(sheet.guide, id + ' guide missing');
  assert(sheet.recipes.length >= 1, id + ' recipe missing');
  for (const key of sheet.builders)
    assert(
      sheet.commands.includes(key.slice(id.length + 2)),
      'builder ' + key + ' does not match a command in its sheet',
    );
}

const r = report.recipes;
assert(r['dns:triage'].text.includes('dig +nssearch'));
assert(r['lb:haproxy-config'].text.includes('stats socket /run/haproxy/admin.sock'));
assert(/server web1 10\.0\.0\.11:8080 check/.test(r['lb:haproxy-config'].text));
assert(r['lb:keepalived-config'].text.includes('vrrp_instance VI_1 {'));
assert(r['lb:keepalived-config'].text.includes('track_script'));
assert(r['tls:cert-check'].text.includes('Verify return code'));
assert(r['tls:cert-check'].text.includes('exit $status'));
assert(r['patching:rolling-reboot'].text.includes('serial: 1'));
assert(r['patching:rolling-reboot'].text.includes('ansible.builtin.reboot'));
assert(r['puppet:profile'].text.includes('class profile::webserver ('));
assert(r['runbooks:postmortem'].text.includes('## Action items'));

const yaml = vm.runInContext('jsyaml', context);
const play = yaml.load(r['patching:rolling-reboot'].text);
assert.equal(play[0].hosts, 'web');
assert.equal(play[0].tasks.length, 5);

// Every generated shell script must parse.
let scripts = 0;
for (const [id, recipe] of Object.entries(r)) {
  if (!recipe.filename.endsWith('.sh')) continue;
  const result = spawnSync('bash', ['-n'], { input: recipe.text, encoding: 'utf8' });
  assert.equal(result.status, 0, id + ' has a shell syntax error: ' + result.stderr);
  scripts++;
}
assert(scripts >= 6);

// Runbooks are ordered: numbered steps must be consecutive within each procedure.
for (const section of vm.runInContext('SHEETS.runbooks.sections', context)) {
  if (section.id === 'rb-quick' || section.id.startsWith('dk-guide')) continue;
  section.cmds.forEach((c, i) =>
    assert(
      c.desc.startsWith(i + 1 + '. '),
      section.id + ' step ' + (i + 1) + ' is not numbered: ' + c.desc.slice(0, 30),
    ),
  );
}

console.log(
  'PASS: ' +
    Object.keys(PACK).length +
    ' infrastructure sheets, guides, recipes, builder keys, ' +
    scripts +
    ' shell scripts and the patch playbook.',
);
