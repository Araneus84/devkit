const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),context=vm.createContext({console});
for(const file of ['vendor/js-yaml.min.js','src/command-definitions.js','src/reference-data.js','src/tool-guides.js','src/recipe-catalog.js','src/deep-model.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const results=vm.runInContext(`(()=>{
 const files=[];const check=(ok,msg)=>{if(!ok)throw Error(msg);};
 for(const p of Object.values(DD_PROFILES)){const seed=p.seed(p),out=ddGenerate(p,seed);check(!out.errors.length,p.id+': '+out.errors);files.push({name:'starter-'+p.filename,text:out.text});}
 for(const id of ['bash','powershell','python']){
  const p=DD_PROFILES[id],n=(type,v={},s={})=>ddNode(p,type,v,s);
  const tree=[n('variable',{name:'message',value:'literal \\n quotes " and dollar $HOME'}),n('arrayVariable'),n('function',{name:'main'},{body:[n('foreach',{source:'array variable',items:'items'},{body:[n('if',{left:'item',operator:'is not empty'},{then:[n('print',{mode:'variable',value:'item'})],else:[n('print',{value:'empty'})]})]}),n('return',id==='python'?{mode:'literal',value:'done'}:{value:'0'})]}),n('pipeline',{}, {commands:[n('command',{program:id==='powershell'?'Get-ChildItem':'echo'}, {args:[n(id==='powershell'?'parameter':'argument',id==='powershell'?{name:'Path',value:'.'}:{value:'hello world'})]}),n('command',{program:id==='powershell'?'Out-String':'cat'})]})];
  if(id!=='bash')tree.push(n('try',{}, {body:[n('print')],catch:[n('print',{value:'failed'})],finally:[n('print',{value:'finished'})]}));
  const out=ddGenerate(p,tree);check(!out.errors.length,id+': '+out.errors);files.push({name:p.filename,text:out.text});
  check(ddGenerate(p,[n('return')]).errors.length,'Top-level return accepted');
 }
 const p=DD_PROFILES.json,doc={name:'true',count:5,enabled:false,empty:null,multi:'first\\nsecond',items:[{name:'one'},'two']};const node=ddFromValue(p,doc);check(JSON.stringify(JSON.parse(ddGenerate(p,[node]).text))===JSON.stringify(doc),'JSON round-trip');
 node.slots.items.push(ddFromValue(p,'duplicate','name'));check(ddGenerate(p,[node]).errors.some(x=>x.includes('Duplicate')),'Duplicate key accepted');
 check(ddGenerate(p,[]).errors.length,'Empty JSON root accepted');check(ddGenerate(p,[ddNode(p,'number',{value:'NaN'})]).errors.length,'Invalid number accepted');
 const y=DD_PROFILES.yaml;const ys=[ddFromValue(y,doc),ddFromValue(y,[1,2])];check(jsyaml.loadAll(ddGenerate(y,ys).text).length===2,'YAML documents missing');
 const tf=DD_PROFILES.terraform,t=(type,v={},s={})=>ddNode(tf,type,v,s);const config=tf.seed(tf);config.push(t('resource',{kind:'terraform_data',label:'example'},{body:[t('text',{key:'input',value:'literal \\u0024{not_a_reference}'}),t('object',{key:'triggers_replace'},{items:[t('text',{key:'version',value:'v1'})]}),t('nested',{name:'lifecycle'},{body:[t('boolean',{key:'prevent_destroy',value:'true'})]})]}));const tfout=ddGenerate(tf,config);check(!tfout.errors.length,tfout.errors);check(tfout.text.includes('$'+'$'+'{not_a_reference}'),'HCL interpolation not escaped');files.push({name:'main.tf',text:tfout.text});
 const sql=DD_PROFILES.sql,q=(type,v={},s={})=>ddNode(sql,type,v,s);const query=q('select',{table:'users',limit:'20'},{columns:[q('column',{name:'users.name'})],joins:[q('join')],where:[q('group',{}, {conditions:[q('compare',{column:'users.active',kind:'boolean',value:'true'}),q('nullcheck',{column:'users.deleted_at'})]})],order:[q('sort',{column:'users.name'})]});const sout=ddGenerate(sql,[query]);check(!sout.errors.length,sout.errors);check(sout.text.includes(' OR '),'Filter grouping missing');files.push({name:'query.sql',text:sout.text});
 const cte=q('select',{table:'filtered'},{columns:[q('column',{name:'name'})],cte:[q('cte',{}, {query:sql.seed(sql)})]});files.push({name:'cte.sql',text:ddGenerate(sql,[cte]).text});
 const insert=q('insert',{}, {rows:[q('row',{}, {values:[q('sqlValue',{value:"O'Brien"}),q('sqlValue',{kind:'boolean',value:'true'})]})]});
 const update=q('update',{}, {assignments:[q('assignment',{value:'Changed'})],where:[q('compare',{column:'id',kind:'number',value:'1'})]});const del=q('delete',{}, {where:[q('nullcheck',{column:'name'})]});
 for(const [name,node] of [['insert',insert],['update',update],['delete',del]]){const out=ddGenerate(sql,[node]);check(!out.errors.length,out.errors);files.push({name:name+'.sql',text:out.text});}
 check(ddGenerate(sql,[q('delete')]).errors.length,'Empty filtered DELETE accepted');
 return files;
})()`,context);
for(const file of results)assert(file.text&&!file.text.includes('undefined'),file.name);
if(process.env.DEVKIT_TEST_OUTPUT){fs.mkdirSync(process.env.DEVKIT_TEST_OUTPUT,{recursive:true});for(const file of results)fs.writeFileSync(path.join(process.env.DEVKIT_TEST_OUTPUT,file.name),file.text);}
console.log('PASS: eight recursive editors, nested scripts, typed data, HCL escaping, SQL joins/CTEs and structural validation.');
