const {chromium}=require(process.env.DEVKIT_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.DEVKIT_CHROME?{executablePath:process.env.DEVKIT_CHROME}:{})});try{
 for(const entry of ['index.html','dist/devkit.html']){
  const page=await browser.newPage(),errors=[],network=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url());});
  await page.goto(pathToFileURL(path.resolve(__dirname,'..',entry)).href);
  const result=await page.evaluate(async()=>{
   const assert=(v,m)=>{if(!v)throw Error(m);};const fails=(fn)=>{try{fn();return false;}catch{return true;}};
   const attack='</textarea><img src="https://example.invalid/leak" onerror="window.__xss=1"><svg onload="window.__xss=1">';
   const key=Object.keys(SHEETS)[0],section=SHEETS[key].sections[0],id=key+'::'+section.cmds[0].cmd;
   state.notes[id]=attack;state.history=[{cmd:attack,time:Date.now()}];renderHistory();renderMain();
   dkDrafts={};ddOpen('dockerfile','docker');
   // Use the same source sync path as typing in the preview.
   const code=document.querySelector('[aria-label="Editable file preview"]');code.value='FROM alpine\nRUN echo '+attack+'\n';code.dispatchEvent(new Event('input',{bubbles:true}));
   await new Promise(resolve=>setTimeout(resolve,900));assert(ddState.blocks.some(n=>n.type==='run_shell'),'Docker parsing lost the known block');
   assert(!window.__xss,'Imported markup executed');assert(!document.querySelector('img[src*="example.invalid"]'),'Markup was inserted as HTML');
   assert(fails(()=>dkValidateBackup(JSON.parse('{"format":"devkit-backup","version":1,"data":{"devkit:notes":"{\\"__proto__\\":{\\"polluted\\":true}}"}}'))),'Prototype backup accepted');
   assert(fails(()=>dfParse('bad.yml','!!js/function "function(){return 1}"','blocks')),'Executable YAML tag accepted');
   assert(fails(()=>dfParse('cycle.yml','x: &x [*x]','blocks')),'Cyclic tree accepted');
   assert(fails(()=>dfParse('large.json',JSON.stringify(Array(1501).fill(0)),'blocks')),'Oversized tree accepted');
   assert(fails(()=>jsyaml.load('['.repeat(150)+'0'+']'.repeat(150))),'Parser depth limit missing');
   const merge='a: &a ['+Array(200).fill('{}').join(',')+']\nb:\n'+Array(200).fill('  - <<: *a').join('\n');
   assert(fails(()=>jsyaml.load(merge)),'Parser merge budget missing');
   const parsed=jsyaml.load('a: &a {__proto__: {polluted: true}}\nb: {<<: *a}');assert(!({}).polluted&&!parsed.b.polluted,'Prototype polluted');
   let binary=false;try{await dfRead(new File([new Uint8Array([255,254,65,0])],'bad.txt'));}catch{binary=true;}assert(binary,'UTF16 accepted');
   dkClose();dkTransfer();assert(document.querySelector('#dk-root').textContent.includes('not encrypted'),'Privacy notice missing');
   assert(document.querySelector('meta[http-equiv="Content-Security-Policy"]').content.includes("connect-src 'none'"),'Network policy missing');
   await new Promise((resolve,reject)=>{const url=URL.createObjectURL(new Blob(['onmessage=()=>postMessage(/hello/.test("hello"))'],{type:'text/javascript'}));const worker=new Worker(url);const timeout=setTimeout(()=>{worker.terminate();reject(Error('Local regex worker blocked'));},2000);worker.onmessage=e=>{clearTimeout(timeout);worker.terminate();URL.revokeObjectURL(url);e.data?resolve():reject(Error('Worker failed'));};worker.onerror=reject;worker.postMessage('test');});
   const notices=document.getElementById('dk-license-notices');if(notices)assert(notices.content.textContent.includes('DevKit Free Use License 1.0')&&notices.content.textContent.includes('Permission is hereby granted'),'Bundled license notices missing');
   return true;
  });assert(result);assert.deepEqual(errors,[]);assert.deepEqual(network,[]);await page.close();
 }
 console.log('PASS: markup stays inert, backup prototype rejection, unsafe/cyclic/oversized YAML rejection, parser depth/merge budgets, UTF16 rejection, privacy notices and no unexpected network requests in both editions.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
