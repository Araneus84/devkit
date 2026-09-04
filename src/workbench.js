/* Shared browser-only workbench. Generated text is never executed. */
const DK_STORAGE='devkit:workbench:v1';
let dkDrafts=loadJSON(DK_STORAGE,{}),dkActive=null,dkUndo=[],dkRedo=[],dkFocus=null,dkWorker=null;
const dkEl=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const dkBtn=(text,fn,cls='dk-btn')=>{const e=dkEl('button',cls,text);e.type='button';e.onclick=fn;return e;};
const dkClone=value=>JSON.parse(JSON.stringify(value));
const dkGetRecipe=()=>DK_RECIPES[dkActive?.id];
const dkPartValues=(definition)=>Object.fromEntries(Object.entries(definition.fields).map(([key,f])=>[key,dkClone(f.value??'')]));
function dkSave(){if(!dkActive)return;try{dkDrafts[dkActive.id]=dkClone(dkActive);localStorage.setItem(DK_STORAGE,JSON.stringify(dkDrafts));document.getElementById('dk-save').textContent='Draft saved on this browser';}catch(e){document.getElementById('dk-save').textContent='Draft in memory; export before closing';}}
function dkRemember(){if(!dkActive)return;dkUndo.push(dkClone(dkActive));if(dkUndo.length>50)dkUndo.shift();dkRedo=[];}
function dkChange(fn){dkRemember();fn();dkSave();dkRender();}
function dkStopTest(){if(dkWorker){dkWorker.terminate();dkWorker=null;}}
function dkClose(){dkStopTest();document.getElementById('dk-dialog').close();dkFocus?.focus();}
function dkShow(){dkFocus=document.activeElement;const dialog=document.getElementById('dk-dialog');if(!dialog.open)dialog.showModal();}
function dkHome(sheet){
 dkStopTest();dkShow();const root=document.getElementById('dk-root');root.replaceChildren();const g=DK_GUIDES[sheet],tools=Object.values(DK_RECIPES).filter(r=>r.sheet===sheet);
 const header=dkEl('header','dk-header');const title=dkEl('div');title.append(dkEl('span','dk-eyebrow','DEVKIT / '+SHEETS[sheet].name.toUpperCase()),dkEl('h2','',g[0]),dkEl('p','dk-help','Choose a guided recipe, or customize any example from the cheatsheet.'));header.append(title,dkBtn('Close ✕',dkClose));root.append(header);
 const body=dkEl('div','dk-home');const guide=dkEl('div','dk-guide');guide.append(dkEl('strong','','A useful starting point'),dkEl('p','',g[1]),dkEl('p','',g[2]));const link=dkEl('a','','Official reference ↗');link.href=g[4];link.target='_blank';link.rel='noopener';guide.append(link);body.append(guide);
 const search=dkEl('input','dk-input');search.placeholder='Find a recipe or command builder…';search.setAttribute('aria-label','Search recipes');body.append(search);const grid=dkEl('div','dk-recipes');body.append(grid);
 function draw(){grid.replaceChildren();const q=search.value.toLowerCase();if(sheet==='ansible'&&!q){grid.append(dkBtn('Open Ansible block builder →',()=>{dkClose();abOpen();},'dk-recipe'));}for(const recipe of tools.filter(r=>(r.title+' '+r.description).toLowerCase().includes(q))){const card=dkBtn('',()=>dkOpenRecipe(recipe.id),'dk-recipe');card.dataset.recipe=recipe.id;card.append(dkEl('strong','',recipe.title),dkEl('p','',recipe.description),dkEl('span','',recipe.legacy?'Command options →':'Guided recipe →'));grid.append(card);}if(!grid.children.length)grid.append(dkEl('p','dk-help','No recipes match. Try a shorter search.'));}search.oninput=draw;draw();
 body.append(dkBtn('Browse all '+SHEETS[sheet].name+' examples',()=>{dkClose();state.searchQuery='';state.activeSheet=sheet;state.activeSection=null;renderSidebar();renderMain();}));root.append(body);
}
function dkOpenRecipe(id){
 dkStopTest();const recipe=DK_RECIPES[id];if(!recipe)return;dkShow();dkUndo=[];dkRedo=[];
 const saved=dkDrafts[id];const keys=new Set(recipe.parts.map(p=>p.key));
 dkActive=saved&&Array.isArray(saved.blocks)&&saved.blocks.every(b=>b&&keys.has(b.key)&&anMap(b.values))?dkClone(saved):{id,sheet:recipe.sheet,shell:recipe.sheet==='powershell'?'powershell':'posix',blocks:recipe.parts.filter(p=>p.required).map(p=>({key:p.key,values:dkPartValues(p)}))};
 if(!dkActive.blocks.length&&recipe.parts.length)dkActive.blocks.push({key:recipe.parts[0].key,values:dkPartValues(recipe.parts[0])});
 dkRender();
}
function dkOpenExample(sheet,item){
 const aware=Object.values(DK_RECIPES).find(r=>r.legacy===sheet+'::'+item.cmd);if(aware){dkOpenRecipe(aware.id);return;}
 dkShow();dkUndo=[];dkRedo=[];const id='example:'+sheet+':'+cmdId(sheet,item.cmd);
 dkActive=dkDrafts[id]?dkClone(dkDrafts[id]):{id,sheet,example:{description:item.desc,original:item.cmd,platform:item.platform||''},blocks:item.cmd.split('\n').map(line=>({key:'line',values:{text:line}}))};dkRender();
}
function dkDefinition(block){if(dkActive.example)return dkP('line','Example line','The text is preserved exactly, including leading spaces.',{text:dkF('Text','multiline','')});return dkGetRecipe().parts.find(p=>p.key===block.key);}
function dkValidField(field,value){
 if(field.required===false&&(value===''||value===undefined))return '';
 if(field.type==='boolean')return typeof value==='boolean'?'':'Choose true or false.';
 if(field.type==='number')return Number.isFinite(value)&&Number.isInteger(value)&&value>=(field.min??0)&&value<=(field.max??Number.MAX_SAFE_INTEGER)?'':'Enter a whole number between '+(field.min??0)+' and '+(field.max??'the supported maximum')+'.';
 if(field.type==='list')return Array.isArray(value)&&value.length&&value.every(x=>typeof x==='string'&&x.trim())?'':'Add at least one nonempty item.';
 if(field.type==='pairs'){if(!Array.isArray(value))return 'Use key/value rows.';const keys=new Set();for(const row of value){if(!row||!row.key?.trim()||['__proto__','constructor','prototype'].includes(row.key))return 'Every row needs a valid key.';if(keys.has(row.key))return 'Keys must be unique.';keys.add(row.key);if(typeof row.value!=='string')return 'Values must be text.';}return '';}
 if(typeof value!=='string')return 'Enter text.';
 if(!value.trim()&&field.type!=='multiline')return 'Fill in this value.';
 if(field.type==='multiline')return '';
 if(/[\r\n\0]/.test(value))return 'Use a single-line value.';
 if(field.type==='choice')return field.choices?.some(c=>(typeof c==='object'?c.value:c)===value)?'':'Choose an available option.';
 if(field.type==='token'&&!/^[A-Za-z0-9_./:@+~%=-]+$/.test(value))return 'Use a name without spaces, quotes or shell operators.';
 if(field.type==='identifier'&&!/^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/.test(value))return 'Use an identifier such as users or schema.users.';
 if(field.type==='pyidentifier'&&(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)||['class','def','if','else','for','while','return','import','from','pass','True','False','None','try','with','as','in','is','not','and','or','lambda','global','yield','async','await'].includes(value)))return 'Use a Python identifier that is not a reserved word.';
 if(field.type==='dns'&&(!/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(value)||value.length>63))return 'Use lowercase letters, numbers and hyphens, up to 63 characters.';
 if(field.type==='package'&&!/^(?:@[a-z0-9._-]+\/)?[a-z0-9][a-z0-9._-]*$/.test(value))return 'Use a lowercase npm package name.';
 if(field.type==='cmdpath'&&/["%!?&|<>^]/.test(value))return 'This path builder excludes CMD expansion and operator characters.';
 return '';
}
function dkOutput(){
 const errors=[];if(dkActive.example)return {text:dkActive.blocks.map(b=>b.values.text).join('\n'),errors,filename:'example.txt'};
 const r=dkGetRecipe();const values={};for(const block of dkActive.blocks){const part=dkDefinition(block);if(!part){errors.push('Unknown block.');continue;}values[block.key]=block.values;for(const [key,f] of Object.entries(part.fields)){const error=dkValidField(f,block.values[key]);if(error)errors.push(part.label+' / '+f.label+': '+error);}}
 for(const part of r.parts)if(part.required&&!values[part.key])errors.push('Add '+part.label+'.');
 if(!dkActive.blocks.length)errors.push('Add the first block.');
 let text='';if(!errors.length)try{text=r.generate(values,dkActive.blocks,dkActive);if(typeof text!=='string'||text.includes('undefined'))throw Error('The recipe contains an incomplete value.');if(/\.json$/.test(r.filename))JSON.parse(text);if(/\.ya?ml$/.test(r.filename))jsyaml.loadAll(text);}catch(e){errors.push(e.message);}
 return {text,errors,filename:r.filename};
}
function dkRefresh(){
 const result=dkOutput(),preview=document.getElementById('dk-preview');preview.value=result.text||'# Complete the fields to generate your output.';
 const status=document.getElementById('dk-status');status.replaceChildren();status.className='dk-status'+(result.errors.length?' incomplete':' ready');status.append(dkEl('strong','',result.errors.length?'Keep building':dkActive.example?'Example ready to copy':'Ready to copy'));
 const msg=result.errors.length?result.errors.slice(0,4):[dkActive.example?'Example text is preserved. Tool syntax and runtime behavior are not validated here.':dkGetRecipe().check||'Review the generated text in the intended tool.'];msg.forEach(t=>status.append(dkEl('p','',t)));
 document.getElementById('dk-copy').disabled=!!result.errors.length;document.getElementById('dk-download').disabled=!!result.errors.length;document.getElementById('dk-undo').disabled=!dkUndo.length;document.getElementById('dk-redo').disabled=!dkRedo.length;
 document.getElementById('dk-output-title').textContent=result.filename;
}
function dkRender(){
 const r=dkGetRecipe(),example=dkActive.example,guide=DK_GUIDES[dkActive.sheet],root=document.getElementById('dk-root');root.replaceChildren();
 const header=dkEl('header','dk-header'),title=dkEl('div');title.append(dkEl('span','dk-eyebrow',SHEETS[dkActive.sheet].name.toUpperCase()+' / '+(example?'CUSTOMIZE EXAMPLE':'GUIDED BUILDER')),dkEl('h2','',example?'Make this example yours':r.title),dkEl('p','dk-help',example?example.description:r.description));header.append(title,dkBtn('Close ✕',dkClose));root.append(header);
 const toolbar=dkEl('div','dk-toolbar');toolbar.append(dkBtn('← Recipes',()=>dkHome(dkActive.sheet)),dkEl('span','dk-muted',''),dkEl('span','dk-muted',''));const saved=dkEl('span','dk-muted','Draft saved locally');saved.id='dk-save';toolbar.append(saved);
 const undo=dkBtn('Undo',()=>{if(!dkUndo.length)return;dkRedo.push(dkClone(dkActive));dkActive=dkUndo.pop();dkSave();dkRender();});undo.id='dk-undo';const redo=dkBtn('Redo',()=>{if(!dkRedo.length)return;dkUndo.push(dkClone(dkActive));dkActive=dkRedo.pop();dkSave();dkRender();});redo.id='dk-redo';toolbar.append(undo,redo);
 const reset=dkBtn('Start over',()=>dkChange(()=>{dkActive.blocks=example?example.original.split('\n').map(text=>({key:'line',values:{text}})):r.parts.filter(p=>p.required).map(p=>({key:p.key,values:dkPartValues(p)}));}));toolbar.append(reset);root.append(toolbar);
 const tabs=dkEl('div','dk-mobile-tabs');tabs.append(dkBtn('Build',()=>root.classList.remove('dk-preview-only')),dkBtn('Preview',()=>root.classList.add('dk-preview-only')));root.append(tabs);
 const layout=dkEl('div','dk-layout'),editor=dkEl('section','dk-editor'),output=dkEl('section','dk-output');layout.append(editor,output);root.append(layout);
 const helper=dkEl('details','dk-guide');helper.append(dkEl('summary','','How this tool works'),dkEl('p','',guide[1]),dkEl('p','',guide[2]));const doc=dkEl('a','','Official documentation ↗');doc.href=guide[4];doc.target='_blank';doc.rel='noopener';helper.append(doc);editor.append(helper);
 if(r?.shell){const label=dkEl('label','dk-field','Quoted values use');const select=dkEl('select','dk-input');select.setAttribute('aria-label','Shell quoting');for(const [value,text] of [['posix','POSIX shell (Bash / zsh)'],['powershell','PowerShell']]){const option=dkEl('option','',text);option.value=value;select.append(option);}select.value=dkActive.shell;select.onchange=()=>dkChange(()=>dkActive.shell=select.value);label.append(select,dkEl('small','','Only fields marked for quoting are escaped. Expressions and option syntax are kept as written.'));editor.append(label);}
 const blocks=dkEl('div','dk-blocks');blocks.id='dk-blocks';editor.append(blocks);
 dkActive.blocks.forEach((block,index)=>{
  const part=dkDefinition(block),card=dkEl('article','dk-block');card.dataset.block=block.key;card.dataset.index=index;const head=dkEl('div','dk-block-head');
  if(r?.reorder!==false&&dkActive.blocks.length>1){const handle=dkBtn('⠿',()=>{},'dk-grip');handle.setAttribute('aria-label','Reorder block '+(index+1));handle.title='Drag to reorder, or use the arrow buttons.';head.append(handle);}
  head.append(dkEl('span','dk-index',String(index+1).padStart(2,'0')),dkEl('strong','',example?'Line '+(index+1):part.label));
  if(r?.reorder!==false)for(const [label,offset] of [['↑',-1],['↓',1]]){const b=dkBtn(label,()=>dkMove(index,index+offset),'dk-small');b.disabled=index+offset<0||index+offset>=dkActive.blocks.length;b.setAttribute('aria-label','Move block '+(index+1)+(offset<0?' up':' down'));head.append(b);}
  if(!part.required){const remove=dkBtn('×',()=>dkChange(()=>dkActive.blocks.splice(index,1)),'dk-small');remove.setAttribute('aria-label','Remove block '+(index+1));head.append(remove);}else head.append(dkEl('span','dk-muted','required'));
  card.append(head);if(!example)card.append(dkEl('p','dk-help',part.hint));
  for(const [key,field] of Object.entries(part.fields))card.append(dkControl(field,block.values,key,index));blocks.append(card);
 });
 if(!dkActive.blocks.length)blocks.append(dkEl('p','dk-empty','Choose the first piece below.'));
 dkSortable(blocks);
 const palette=dkEl('section','dk-palette');palette.append(dkEl('h3','','What comes next?'));
 if(example){palette.append(dkBtn('+ Add a line',()=>dkChange(()=>dkActive.blocks.push({key:'line',values:{text:''}}))));}
 else {const remaining=r.parts.filter(p=>!dkActive.blocks.some(b=>b.key===p.key));const grid=dkEl('div','dk-pieces');remaining.forEach((part,i)=>{const button=dkBtn('',()=>dkChange(()=>dkActive.blocks.push({key:part.key,values:dkPartValues(part)})),'dk-piece'+(i===0?' suggested':''));button.dataset.part=part.key;button.append(dkEl('strong','','+ '+part.label),dkEl('span','',part.hint));grid.append(button);});palette.append(grid);if(!remaining.length)palette.append(dkEl('p','dk-help','All pieces are available above. Review the output when ready.'));if(r.reorder===false)palette.append(dkEl('p','dk-help','The output keeps the clause or setup order required by this format.'));}
 editor.append(palette);
 const outhead=dkEl('div','dk-output-head');const filename=dkEl('strong');filename.id='dk-output-title';outhead.append(filename,dkEl('span','dk-muted','LIVE OUTPUT'));output.append(outhead);const preview=dkEl('textarea');preview.id='dk-preview';preview.readOnly=true;preview.spellcheck=false;preview.setAttribute('aria-label','Generated output');output.append(preview);
 const status=dkEl('div');status.id='dk-status';status.setAttribute('role','status');output.append(status);const actions=dkEl('div','dk-actions');const copy=dkBtn('Copy',()=>dkCopy(),'dk-btn primary');copy.id='dk-copy';const download=dkBtn('Download',()=>{const value=dkOutput();if(!value.errors.length)dkDownloadText(value.text,value.filename);});download.id='dk-download';actions.append(copy,download);output.append(actions);const notice=dkEl('p','dk-help');notice.id='dk-notice';notice.setAttribute('role','status');output.append(notice);
 if(r?.regex)dkRegexPanel(output);dkRefresh();
}
function dkControl(field,values,key,index){
 const label=dkEl('label','dk-field');label.append(dkEl('span','',field.label+(field.required===false?' (optional)':'')));
 if(field.type==='pairs'){
  const box=dkEl('div','dk-pairs');const rows=values[key]||[];
  rows.forEach((row,i)=>{const line=dkEl('div','dk-pair');for(const column of ['key','value']){const input=dkEl('input','dk-input');input.value=row[column];input.placeholder=column;input.setAttribute('aria-label',field.label+' '+column+' '+(i+1));input.onfocus=()=>{dkRemember();input.onfocus=null;};input.oninput=()=>{row[column]=input.value;dkSave();dkRefresh();};line.append(input);}const remove=dkBtn('×',()=>dkChange(()=>rows.splice(i,1)),'dk-small');remove.setAttribute('aria-label','Remove '+field.label+' row '+(i+1));line.append(remove);box.append(line);});box.append(dkBtn('+ Add row',()=>dkChange(()=>{values[key]??=[];values[key].push({key:'',value:''});})));label.append(box);
 }else{
  let input;if(['choice','boolean'].includes(field.type)){input=dkEl('select','dk-input');const choices=field.type==='boolean'?[true,false]:field.choices||[];for(const choice of choices){const value=typeof choice==='object'?choice.value:choice;const option=dkEl('option','',typeof choice==='object'?choice.label:String(choice));option.value=String(value);input.append(option);}input.value=String(values[key]);}
  else if(['multiline','list'].includes(field.type)){input=dkEl('textarea','dk-input');input.rows=field.type==='list'?3:Math.min(8,Math.max(2,String(values[key]).split('\n').length));input.value=field.type==='list'?(values[key]||[]).join('\n'):values[key];}
  else{input=dkEl('input','dk-input');input.type=field.type==='number'?'number':'text';input.value=values[key]??'';if(field.type==='number'){input.min=field.min??0;if(field.max!==undefined)input.max=field.max;}}
  input.setAttribute('aria-label',field.label);input.dataset.field=key;input.spellcheck=false;input.onfocus=()=>{dkRemember();input.onfocus=null;};input.oninput=()=>{values[key]=field.type==='boolean'?input.value==='true':field.type==='number'?(input.value===''?null:Number(input.value)):field.type==='list'?input.value.split('\n').filter(x=>x.trim()):input.value;dkSave();dkRefresh();};label.append(input);
 }
 if(field.hint)label.append(dkEl('small','',field.hint));return label;
}
function dkMove(from,to){if(to<0||to>=dkActive.blocks.length||from===to)return;dkChange(()=>dkActive.blocks.splice(to,0,dkActive.blocks.splice(from,1)[0]));}
function dkSortable(container){
 let drag=null;
 function clean(){if(!drag)return;container.querySelectorAll('.dk-drop-before,.dk-drop-after,.dk-drag-source').forEach(e=>e.classList.remove('dk-drop-before','dk-drop-after','dk-drag-source'));try{drag.handle.releasePointerCapture(drag.id);}catch(e){}drag=null;}
 container.querySelectorAll('.dk-grip').forEach((handle,index)=>{
  handle.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();handle.setPointerCapture(e.pointerId);drag={handle,id:e.pointerId,index,start:e.clientY,slot:null};};
  handle.onpointermove=e=>{if(!drag||drag.id!==e.pointerId||Math.abs(e.clientY-drag.start)<5)return;e.preventDefault();const rows=[...container.children];rows.forEach(r=>r.classList.remove('dk-drop-before','dk-drop-after'));rows[index].classList.add('dk-drag-source');const bounds=container.getBoundingClientRect();if(e.clientX<bounds.left||e.clientX>bounds.right){drag.slot=null;return;}let slot=rows.findIndex(row=>{const r=row.getBoundingClientRect();return e.clientY<r.top+r.height/2;});if(slot<0)slot=rows.length;drag.slot=slot;const dest=slot>index?slot-1:slot;if(dest!==index){if(slot===rows.length)rows.at(-1).classList.add('dk-drop-after');else rows[slot].classList.add('dk-drop-before');}const editor=document.querySelector('.dk-editor'),r=editor.getBoundingClientRect();if(e.clientY<r.top+45)editor.scrollTop-=15;if(e.clientY>r.bottom-45)editor.scrollTop+=15;};
  handle.onpointerup=e=>{if(!drag)return;const slot=drag.slot,from=drag.index;clean();if(slot!==null)dkMove(from,slot>from?slot-1:slot);};handle.onpointercancel=clean;
  handle.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();clean();}if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();dkMove(index,index+(e.key==='ArrowUp'?-1:1));}};
 });
}
async function dkCopy(){const output=dkOutput();if(output.errors.length)return;await dkClipboard(output.text,document.getElementById('dk-preview'),document.getElementById('dk-notice'));}
async function dkClipboard(text,selection,notice){try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);else{selection.focus();selection.select();if(!document.execCommand('copy'))throw Error('Clipboard unavailable');}if(notice)notice.textContent='Copied exactly, with formatting preserved.';return true;}catch(e){if(selection){selection.focus();selection.select();}if(notice)notice.textContent='Press Ctrl+C to copy the selected output.';return false;}}
function dkDownloadText(text,name,type='text/plain'){const link=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type:type+';charset=utf-8'}));link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function dkRegexPanel(parent){const panel=dkEl('details','dk-regex');panel.open=true;panel.append(dkEl('summary','','Test against sample text'));const flags=dkEl('input','dk-input');flags.value='g';flags.setAttribute('aria-label','Regex flags');const input=dkEl('textarea','dk-input');input.rows=4;input.value='user42\nadmin7\nuser100';input.setAttribute('aria-label','Regex sample text');const result=dkEl('pre','dk-test-result');result.setAttribute('role','status');panel.append(dkEl('label','','Flags'),flags,input,dkBtn('Test pattern',()=>{
 dkStopTest();if(input.value.length>20000){result.textContent='Use a sample of at most 20,000 characters.';return;}const output=dkOutput();if(output.errors.length){result.textContent='Complete the pattern first.';return;}
 const source='onmessage=e=>{try{const d=e.data;const flags=d.flags.includes("g")?d.flags:d.flags+"g";const re=new RegExp(d.pattern,flags);const matches=[];for(const m of d.text.matchAll(re)){matches.push({index:m.index,match:m[0],groups:m.groups||null});if(matches.length>=200)break;}postMessage({matches});}catch(e){postMessage({error:e.message});}}';
 const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));let worker;try{worker=new Worker(url);dkWorker=worker;}catch(e){URL.revokeObjectURL(url);result.textContent='This browser does not allow the local regex worker. Pattern building still works.';return;}URL.revokeObjectURL(url);result.textContent='Testing…';const timeout=setTimeout(()=>{worker.terminate();if(dkWorker===worker)dkWorker=null;result.textContent='Stopped after 500 ms. Simplify the pattern or shorten the sample.';},500);worker.onmessage=e=>{clearTimeout(timeout);worker.terminate();if(dkWorker===worker)dkWorker=null;result.textContent=e.data.error||JSON.stringify(e.data.matches,null,2);};worker.onerror=()=>{clearTimeout(timeout);worker.terminate();result.textContent='Regex worker unavailable in this browser.';};worker.postMessage({pattern:output.text,flags:flags.value,text:input.value});
 }),result);parent.append(panel);}

document.body.insertAdjacentHTML('beforeend','<dialog id="dk-dialog" aria-label="DevKit workbench"><div id="dk-root"></div></dialog>');document.getElementById('dk-dialog').addEventListener('cancel',e=>{e.preventDefault();dkClose();});
const DK_LEGACY=new Map();for(const recipe of Object.values(DK_RECIPES)){if(recipe.legacy)DK_LEGACY.set(recipe.legacy,recipe.id);else BUILDERS[recipe.sheet+'::dk@'+recipe.id]={name:recipe.title,description:recipe.description,args:[],flags:[],dkRecipe:recipe.id};}
const dkOldOpenBuilder=openBuilder;openBuilder=function(key){const id=key.startsWith('sql::')?'sql:select':BUILDERS[key]?.dkRecipe||DK_LEGACY.get(key);if(id)dkOpenRecipe(id);else dkOldOpenBuilder(key);};
const DK_EXAMPLES=new Map();for(const [key,sheet] of Object.entries(SHEETS))for(const section of sheet.sections)for(const item of section.cmds)DK_EXAMPLES.set(cmdId(key,item.cmd),{sheet:key,item});
function dkAttachExamples(){document.querySelectorAll('#main .cmd-item').forEach(row=>{if(row.querySelector('.dk-customize'))return;const entry=DK_EXAMPLES.get(row.dataset.id);if(!entry)return;const button=dkBtn('Customize',()=>dkOpenExample(entry.sheet,entry.item),'mini-btn dk-customize');button.title='Edit this example or open its guided command recipe';row.querySelector('.cmd-actions')?.prepend(button);});}
function dkBanner(key){if(!DK_GUIDES[key]||key==='ansible')return;const header=document.querySelector('#main .page-header');if(!header)return;const g=DK_GUIDES[key],banner=dkEl('div','dk-banner');const title=dkEl('div');title.append(dkEl('span','dk-eyebrow','LEARN / BUILD / COPY'),dkEl('h2','',g[0]),dkEl('p','',g[1]));banner.append(title,dkBtn('Open '+SHEETS[key].name+' workbench →',()=>dkHome(key),'dk-btn primary'));header.after(banner);}
const dkOldSheet=renderSheet;renderSheet=function(key,q){dkOldSheet(key,q);dkBanner(key);dkAttachExamples();};
const dkOldSearch=renderSearchResults;renderSearchResults=function(q){dkOldSearch(q);dkAttachExamples();};
const dkOldFavorites=renderFavorites;renderFavorites=function(q){dkOldFavorites(q);dkAttachExamples();};
// Avoid interpreting backslashes a second time: strings were already decoded by the HTML handler.
copyCmd=async function(button,text){let area=document.getElementById('dk-copy-area');if(!area){area=document.createElement('textarea');area.id='dk-copy-area';area.style.position='fixed';area.style.left='-10000px';document.body.append(area);}area.value=text;if(await dkClipboard(text,area,null)){addToHistory(text);button.textContent='✓';setTimeout(()=>button.textContent='Copy',1200);}else{button.textContent='Select text';button.title='Clipboard unavailable; select and copy the example text.';}};
