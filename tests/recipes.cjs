// Dependency-free catalog and source checks: node tests/recipes.cjs
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),context=vm.createContext({console});
for(const file of ['vendor/js-yaml.min.js','src/command-definitions.js','src/reference-data.js','src/tool-guides.js','src/recipe-catalog.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const report=vm.runInContext(`(()=>{
 const results=[];for(const recipe of Object.values(DK_RECIPES).filter(r=>!r.legacy)){
  const blocks=recipe.parts.map(p=>({key:p.key,values:Object.fromEntries(Object.entries(p.fields).map(([key,f])=>[key,JSON.parse(JSON.stringify(f.value))]))}));
  const values=Object.fromEntries(blocks.map(b=>[b.key,b.values]));const text=recipe.generate(values,blocks,{shell:'posix'});
  if(typeof text!=='string'||text.includes('undefined'))throw Error(recipe.id+' generated invalid output');
  if(recipe.filename.endsWith('.json'))JSON.parse(text);if(/\\.ya?ml$/.test(recipe.filename))jsyaml.loadAll(text);
  results.push({id:recipe.id,text,filename:recipe.filename});
 }
 return {tools:Object.keys(SHEETS),guides:Object.keys(DK_GUIDES),recipes:Object.values(DK_RECIPES).map(r=>({id:r.id,sheet:r.sheet})),results};
})()`,context);
assert.equal(report.tools.length,28);for(const tool of report.tools){assert(report.guides.includes(tool),'Missing guide '+tool);assert(report.recipes.some(r=>r.sheet===tool),'Missing builder '+tool);}
const text=id=>report.results.find(r=>r.id===id).text;
assert(text('sql:select').includes('\nFROM users'));assert(text('ssh:config').includes('HostName server.example.com'));
assert.equal(text('excel:lookup'),'=XLOOKUP(A2,D2:D100,E2:E100,"Not found",0)');
assert(text('cmd:copy').includes(' /L '));assert(text('juniper:interface-label').includes('commit check'));assert(!/^commit$/m.test(text('juniper:interface-label')));
assert.equal(new Set(report.recipes.map(r=>r.id)).size,report.recipes.length);
vm.runInContext(`(()=>{
 const generate=(name,args,flags=[])=>{const r=Object.values(DK_RECIPES).find(r=>r.legacy&&r.title===name+' · command');
  const blocks=[{key:'arguments',values:args},...r.parts.filter(p=>flags.includes(p.label)).map(p=>({key:p.key,values:{}}))];
  return r.generate(Object.fromEntries(blocks.map(b=>[b.key,b.values])),blocks,{shell:'posix'});};
 const check=(actual,expected)=>{if(actual!==expected)throw Error(actual+' != '+expected);};
 check(generate('tar',{mode:'-c',archive:'out.tar',target:'my folder'}),'tar -c -f '+dkQ('out.tar')+' '+dkQ('my folder'));
 check(generate('docker build',{tag:'app:latest',context:'.'}),'docker build -t '+dkQ('app:latest')+' '+dkQ('.'));
 check(generate('kubectl apply',{target:'app.yml'}),'kubectl apply -f '+dkQ('app.yml'));
 check(generate('kubectl scale',{resource:'deployment',name:'app',replicas:'3'}),'kubectl scale deployment '+dkQ('app')+' --replicas=3');
 check(generate('gam transfer drive',{src:'a@example.com',dest:'b@example.com'}),'gam user '+dkQ('a@example.com')+' transfer drive '+dkQ('b@example.com'));
 check(generate('az vm create',{rg:'rg',name:'vm'}),'az vm create --resource-group '+dkQ('rg')+' --name '+dkQ('vm'));
})()`,context);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'app-manifest.json'),'utf8'));for(const file of manifest.javascript)new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
for(const file of manifest.styles)assert(!/@import/.test(fs.readFileSync(path.join(root,file),'utf8')),'Remote CSS dependency');
console.log('PASS: '+report.tools.length+' tools, '+report.recipes.length+' recipes, '+report.results.length+' file/workflow recipes, YAML/JSON parsing, source syntax, no remote CSS dependencies.');
