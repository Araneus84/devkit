/* Progressive choices and explicit navigation for the Ansible block editor. */
const AU_LABELS={name:'Name',hosts:'Target hosts',tasks:'Tasks',become:'Use sudo',gather_facts:'Gather host facts',vars:'Variables',handlers:'Handlers',roles:'Roles',vars_files:'Variable files',pre_tasks:'Before tasks',post_tasks:'After tasks',remote_user:'SSH user',become_user:'Run as user',serial:'Hosts per batch',strategy:'Run strategy',tags:'Tags',environment:'Environment variables',when:'Run only when',loop:'Repeat for each item',register:'Save the result',notify:'Notify a handler',changed_when:'Report a change when',failed_when:'Report failure when',until:'Retry until',retries:'Retry count',delay:'Wait between retries',delegate_to:'Run on another host',run_once:'Run once',no_log:'Hide task output',diff:'Show file differences',listen:'Listen for a notification',block:'Task group',rescue:'On failure',always:'Always run',state:'Desired state',update_cache:'Refresh package index',cache_valid_time:'Cache lifetime',src:'Source file',dest:'Destination',mode:'Permissions',owner:'Owner',group:'Group',enabled:'Start at boot',path:'Path',content:'File contents',argv:'Command arguments',cmd:'Command',msg:'Message'};
const auLabel=key=>AU_LABELS[key]||String(key).replace(/_/g,' ');
function auScopeLabel(path){const type=abType(path),value=abGet(path);if(type.startsWith('module:'))return AB_MODULES[type.slice(7)]?.title||type.slice(7);if(typeof path.at(-1)==='number')return abTitle(value,path.at(-1),type);return path.length?auLabel(path.at(-1)):AB_FILES[abState.kind].label;}
function auPerform(item){
 if(item.modulePicker){abShowModules();return;}
 const oldPath=[...abState.path];abEdit(item.create);
 if(item.focus&&JSON.stringify(oldPath)===JSON.stringify(abState.path))auFocusField(item.focus);
 else document.querySelector('.ab-canvas').scrollTop=0;
}
function auFocusField(key){const input=[...document.querySelectorAll('#ab-fields .ab-input')].find(el=>el.dataset.path&&JSON.parse(el.dataset.path).at(-1)===key);if(input){input.focus();input.scrollIntoView({block:'nearest',behavior:'smooth'});input.closest('.ab-field')?.classList.add('au-attention');setTimeout(()=>input.closest('.ab-field')?.classList.remove('au-attention'),1000);}}
function auNext(){
 const value=abGet(),type=abType(),choices=abChoices();
 const add=key=>{const item=choices.find(c=>c.key===key);return item?{label:item.modulePicker?'Choose an action': 'Add '+auLabel(key).toLowerCase(),run:()=>auPerform(item)}:null;};
 if(anMap(value)){
  const required=['play','task','handler'].includes(type)?['name',...(type==='play'?['hosts']:[])]:Object.entries(abSchema()).filter(([,d])=>d.required).map(([k])=>k);
  for(const key of required){if(!abOwn(value,key))return add(key);if(value[key]===''||value[key]===null||(Array.isArray(value[key])&&!value[key].length))return {label:'Fill in '+auLabel(key).toLowerCase(),run:()=>Array.isArray(value[key])?abGo([...abState.path,key]):auFocusField(key)};}
  if(type.startsWith('module:')){
   const short=type.split('.').at(-1);const alternatives={copy:['src','content'],command:['argv','cmd'],shell:['cmd'],pip:['name','requirements'],service:['state','enabled'],systemd_service:['state','enabled'],debug:['msg','var']}[short];
   if(alternatives&&!alternatives.some(key=>abOwn(value,key)))return add(alternatives[0]);
   if(alternatives)for(const key of alternatives)if(abOwn(value,key)&&value[key]==='')return {label:'Fill in '+auLabel(key).toLowerCase(),run:()=>auFocusField(key)};
  }
  if(type==='play'){if(!abOwn(value,'tasks'))return add('tasks');return {label:value.tasks?.length?'Review tasks →':'Add your first task →',run:()=>abGo([...abState.path,'tasks'])};}
  if(type==='task'||type==='handler'){
   if(!abModule(value)&&!value.block)return add('$module');
   const module=abModule(value);
   if(module){const params=value[module],schema=AB_MODULES[module]?.fields||{};if(anMap(params)&&Object.entries(schema).some(([k,d])=>d.required&&(params[k]===undefined||params[k]===''||Array.isArray(params[k])&&!params[k].length)))return {label:'Complete action settings →',run:()=>abGo([...abState.path,module])};}
   return {label:'Done · back to '+(type==='handler'?'handlers':'tasks'),run:()=>abGo(abState.path.slice(0,-1))};
  }
 }
 if(Array.isArray(value)&&!value.length&&choices.length)return {label:choices[0].label.replace(/^\+ /,'Add '),run:()=>auPerform(choices[0])};
 if(abState.path.length)return {label:'Done · back to '+auScopeLabel(abState.path.slice(0,-1)),run:()=>abGo(abState.path.slice(0,-1))};
 return {label:'Review YAML →',run:auReview};
}
function auReview(){document.getElementById('ab-dialog').classList.add('au-show-yaml');document.querySelector('.ab-output').scrollIntoView({block:'nearest',behavior:'smooth'});document.getElementById('ab-preview').focus();auMobileTabs();}
function auMobileTabs(){const yaml=document.getElementById('ab-dialog').classList.contains('au-show-yaml');document.getElementById('au-edit-tab').setAttribute('aria-pressed',String(!yaml));document.getElementById('au-yaml-tab').setAttribute('aria-pressed',String(yaml));}
function auDrawNavigation(){
 const nav=document.getElementById('au-navigation');nav.replaceChildren();
 if(abState.path.length){const p=abState.path.slice(0,-1);nav.append(abButton('← '+auScopeLabel(p),()=>abGo(p),'au-back'));}
 const progress=abNode('div','au-progress');
 if(abState.kind==='playbook'&&abState.doc.length){
  const index=typeof abState.path[0]==='number'?abState.path[0]:0;const play=abState.doc[index];
  const step=abState.path.length>1?'tasks':'setup';
  for(const [id,label,done,action] of [['setup','1  Play setup',!!play.hosts,()=>abGo([index])],['tasks','2  Add tasks',!!play.tasks?.length,()=>{if(!play.tasks)abEdit(()=>{play.tasks=[];abState.path=[index,'tasks'];});else abGo([index,'tasks']);}],['review','3  Review YAML',false,auReview]]){const btn=abButton(label,action,'au-step'+(step===id?' active':'')+(done?' complete':''));if(step===id)btn.setAttribute('aria-current','step');progress.append(btn);}
 }
 nav.append(progress);
 const footer=document.getElementById('au-footer');footer.replaceChildren();const next=auNext();
 const context=abNode('div','au-footer-context');context.append(abNode('small','','YOU ARE EDITING'),abNode('strong','',auScopeLabel(abState.path)));footer.append(context);
 if(next){const button=abButton(next.label,next.run,'ab-button primary');button.id='au-next';footer.append(button);}
}
const auOldRender=abRender;
abRender=function(){auOldRender();document.getElementById('ab-dialog').classList.remove('au-show-yaml');auDrawNavigation();auMobileTabs();
 const type=abType();if(type==='task'||type==='handler')document.getElementById('ab-scope-help').textContent='Name this '+type+', choose what it does, then fill in its settings.';
 document.querySelectorAll('#ab-fields input').forEach(input=>input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.isComposing){event.preventDefault();auNext()?.run();}}));
};
const auOldRefresh=abRefresh;
abRefresh=function(){auOldRefresh();if(document.getElementById('au-navigation'))auDrawNavigation();};
const auOldGo=abGo;
abGo=function(path){auOldGo(path);document.querySelector('.ab-canvas').scrollTop=0;};
const auOldField=abRenderField;
abRenderField=function(key,value,definition,atCurrent=false){const row=auOldField(key,value,definition,atCurrent);const label=row.querySelector('.ab-field-label');if(label){const friendly=auLabel(key);label.textContent=friendly;if(friendly!==key){const code=abNode('code','au-key',key);label.after(code);}}
 const nested=row.querySelector('.ab-nested');if(nested){const count=Array.isArray(value)?value.length:Object.keys(value).length;nested.textContent=(count?'Open ':'Add to ')+auLabel(key).toLowerCase()+(count?' · '+count+' '+(Array.isArray(value)?'items':'fields'):'')+' →';}
 return row;
};
abRenderPalette=function(){
 const container=document.getElementById('ab-palette');container.replaceChildren();const type=abType(),value=abGet(),choices=abChoices();
 let preferred=choices.find(c=>c.required)?.key||choices[0]?.key;
 if(['play','task','handler'].includes(type)&&!abOwn(value,'name'))preferred='name';
 if(type==='play'&&abOwn(value,'name'))preferred=!abOwn(value,'hosts')?'hosts':!abOwn(value,'tasks')?'tasks':preferred;
 const essentials=type==='play'?['name','hosts','tasks']:['task','handler'].includes(type)?['name','$module']:choices.filter(c=>c.required).map(c=>c.key);
 const heading=abNode('h3','',Array.isArray(value)?'Add another piece':'Add a piece');container.append(heading);
 const make=item=>{const btn=abButton('',()=>auPerform(item),'ab-piece'+(item.key===preferred?' suggested':''));btn.dataset.piece=item.key;const title=item.modulePicker?'Choose an action':item.key.startsWith('$')?item.label:'+ '+auLabel(item.key);btn.append(abNode('strong','',title),abNode('span','',item.help));if(!item.key.startsWith('$'))btn.append(abNode('code','au-piece-key',item.key));if(item.key===preferred)btn.append(abNode('em','','Suggested next'));return btn;};
 const primary=choices.filter(c=>Array.isArray(value)||essentials.includes(c.key)||(type.startsWith('module:')&&['state','enabled','update_cache','mode','msg','argv','cmd','src','content'].includes(c.key)));
 if(!primary.length&&choices.length)primary.push(...choices.slice(0,Math.min(3,choices.length)));
 const grid=abNode('div','ab-pieces');primary.forEach(c=>grid.append(make(c)));container.append(grid);
 const extra=choices.filter(c=>!primary.includes(c));
 if(extra.length){const details=abNode('details','au-options');details.id='au-more-options';details.append(abNode('summary','',`More options (${extra.length})`));const search=abNode('input','ab-input');search.id='ab-piece-search';search.placeholder='Find an option…';search.setAttribute('aria-label','Find a piece');const results=abNode('div','ab-pieces');const draw=()=>{results.replaceChildren();const matches=extra.filter(c=>(c.key+' '+auLabel(c.key)+' '+c.help).toLowerCase().includes(search.value.toLowerCase()));matches.forEach(c=>results.append(make(c)));if(!matches.length)results.append(abNode('p','ab-hint','No matching options. Try a keyword such as sudo, notify or loop.'));};search.oninput=draw;draw();details.append(search,results);container.append(details);}
 const current=type.startsWith('module:')?type.slice(7):null;
 const open=anMap(value)&&(['map','generic','inventory','groups','hosts','host'].includes(type)||(current&&!AB_MODULES[current])||AB_MODULES[current]?.open);
 if(open)container.append(abNamedForm(type));
 else if(anMap(value)){const custom=abNode('details','ab-extra');custom.append(abNode('summary','','Advanced: add a named field'),abNode('p','ab-hint','Use this for an additional documented parameter.'),abNamedForm(type));container.append(custom);}
 if(!choices.length&&!open)container.prepend(abNode('p','ab-hint','This block is complete. Continue with the button below.'));
};
const AU_CATEGORIES={Packages:['package','apt','dnf','pip'],Files:['copy','template','file','lineinfile','get_url','git'],Services:['service','systemd_service','uri'],Users:['user','group'],Commands:['command','shell','debug','ping'],Logic:['assert','set_fact','fail','include_tasks','import_tasks','meta']};
abShowModules=function(){
 const container=document.getElementById('ab-palette');container.replaceChildren();container.append(abNode('h3','','What should this task do?'));
 const search=abNode('input','ab-input');search.id='ab-module-search';search.placeholder='Search actions, e.g. install packages…';search.setAttribute('aria-label','Find a module');container.append(search);
 const tabs=abNode('div','au-categories');let category='All';const grid=abNode('div','ab-pieces ab-module-grid');const tally=abNode('p','ab-hint');
 const draw=()=>{grid.replaceChildren();let count=0;for(const [name,definition] of Object.entries(AB_MODULES)){if(category!=='All'&&!AU_CATEGORIES[category].includes(name.split('.').at(-1)))continue;if(!(name+' '+definition.title+' '+definition.help+' '+(name.includes('apt')||name.includes('package')?'install packages':'')).toLowerCase().includes(search.value.toLowerCase()))continue;count++;const button=abButton('',()=>{abChooseModule(name);document.querySelector('.ab-canvas').scrollTop=0;},'ab-piece');button.dataset.module=name;button.append(abNode('strong','',definition.title),abNode('span','',definition.help),abNode('code','',name));grid.append(button);}tally.textContent=count?count+' actions available':'No actions found. Try a different category or search.';};
 for(const label of ['All',...Object.keys(AU_CATEGORIES)]){const button=abButton(label,()=>{category=label;for(const b of tabs.children)b.setAttribute('aria-pressed',String(b.textContent===label));draw();},'au-category');button.setAttribute('aria-pressed',String(label==='All'));tabs.append(button);}
 container.append(tabs,tally,grid);search.oninput=draw;draw();
 const custom=abNode('details','ab-extra');custom.append(abNode('summary','','Use a custom module'));const form=abNode('form','ab-named-form'),name=abNode('input','ab-input');name.placeholder='namespace.collection.module';name.setAttribute('aria-label','Custom module name');const button=abNode('button','ab-button','Use module');button.type='submit';const error=abNode('p','ab-inline-error');form.append(name,button,error);form.onsubmit=e=>{e.preventDefault();if(!/^[a-zA-Z_]\w*\.[a-zA-Z_]\w*\.[a-zA-Z_]\w*$/.test(name.value)){error.textContent='Enter namespace.collection.module';return;}abChooseModule(name.value);};custom.append(form);container.append(custom);
 document.getElementById('au-footer').replaceChildren(abButton('← Back to task options',()=>{abRenderPalette();auDrawNavigation();},'ab-button'));
 search.focus();search.scrollIntoView({block:'nearest',behavior:'smooth'});
};
document.querySelector('.ab-canvas').insertAdjacentHTML('afterbegin','<div id="au-navigation"></div>');
document.querySelector('.ab-canvas').insertAdjacentHTML('beforeend','<div id="au-footer"></div>');
document.querySelector('.ab-topbar').insertAdjacentHTML('afterend','<div class="au-mobile-tabs"><button id="au-edit-tab" aria-pressed="true">Build</button><button id="au-yaml-tab" aria-pressed="false">YAML preview</button></div>');
document.getElementById('au-edit-tab').onclick=()=>{document.getElementById('ab-dialog').classList.remove('au-show-yaml');auMobileTabs();};document.getElementById('au-yaml-tab').onclick=auReview;
document.querySelector('.ab-header h2').textContent='Your Ansible playbook, step by step.';
document.querySelector('.ab-header p').textContent='Add a piece, fill it in, then continue. No YAML formatting needed.';
document.querySelector('.ab-outline h3').textContent='PLAYBOOK OUTLINE';
