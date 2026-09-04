/* Guided Ansible blocks: the document is structured data, never hand-indented text. */
const AB_KEY='devkit_ansible_blocks_v2';
const abField=(type,help,example='',extra={})=>({type,help,example,...extra});
const AB_COMMON={
 become:abField('boolean','Run with elevated privileges.',true),
 become_user:abField('text','The account to become.','root'),
 vars:abField('map','Named values you can reuse in this scope.'),
 tags:abField('list','Labels used to select tasks at run time.'),
 environment:abField('map','Environment variables passed to tasks.'),
 no_log:abField('boolean','Hide sensitive task output.',true)
};
const AB_PLAY={
 name:abField('text','Give this play a readable name.','Configure web servers'),
 hosts:abField('text','Which inventory hosts or group should this play target?','webservers',{required:true}),
 tasks:abField('tasks','Add the actions this play will perform, in order.'),
 become:AB_COMMON.become,
 gather_facts:abField('boolean','Collect host information for facts and conditions.',true),
 vars:AB_COMMON.vars,
 handlers:abField('handlers','Actions that run when a changed task notifies them.'),
 roles:abField('roles','Reuse groups of tasks packaged as roles.'),
 vars_files:abField('list','Variable files to load, one filename per item.'),
 pre_tasks:abField('tasks','Tasks to perform before roles and normal tasks.'),
 post_tasks:abField('tasks','Tasks to perform after normal tasks.'),
 remote_user:abField('text','SSH login user.','deploy'),
 become_user:AB_COMMON.become_user,
 serial:abField('number','Process this many hosts in each batch.',1,{min:1}),
 strategy:abField('enum','How to schedule tasks across hosts.','linear',{choices:['linear','free']}),
 tags:AB_COMMON.tags,
 environment:AB_COMMON.environment
};
const AB_TASK={
 name:abField('text','Describe what this task does.','Install web packages'),
 when:abField('text','Run only when this expression is true; no {{ }} needed.',"ansible_facts['os_family'] == 'Debian'"),
 loop:abField('list','Repeat for each item. Refer to the current value as {{ item }}.'),
 register:abField('text','Store the task result in this variable.','result'),
 notify:abField('notify','Queue a handler when this task changes something.','Restart nginx'),
 tags:AB_COMMON.tags,
 become:AB_COMMON.become,
 become_user:AB_COMMON.become_user,
 changed_when:abField('expression','Decide when the task reports a change. Use false for a read-only command.','false'),
 failed_when:abField('expression','Decide when the task reports a failure.','result.rc != 0'),
 until:abField('text','Retry until this expression becomes true.','result.status == 200'),
 retries:abField('number','Maximum retry count.',5,{min:1}),
 delay:abField('number','Seconds between retries.',3,{min:0}),
 delegate_to:abField('text','Run this task on a different host.','localhost'),
 run_once:abField('boolean','Run once for the current host batch.',true),
 no_log:AB_COMMON.no_log,
 diff:abField('boolean','Include file changes in diff output.',false),
 vars:AB_COMMON.vars,
 environment:AB_COMMON.environment,
 ignore_errors:abField('boolean','Continue after a normal task failure.',false),
 check_mode:abField('boolean','Override check mode for this task.',true),
 loop_control:abField('map','Options for how the loop is displayed or named.')
};
const AB_BLOCK={name:AB_TASK.name,when:AB_TASK.when,become:AB_TASK.become,become_user:AB_TASK.become_user,tags:AB_TASK.tags,vars:AB_TASK.vars,environment:AB_TASK.environment,no_log:AB_TASK.no_log,rescue:abField('tasks','Tasks to run when a task in this block fails.'),always:abField('tasks','Tasks to run after the block, whether it succeeds or fails.')};
const AB_REQUIRED={package:['name'],apt:['name'],dnf:['name'],service:['name'],systemd_service:['name'],copy:['dest'],template:['src','dest'],file:['path'],user:['name'],group:['name'],lineinfile:['path'],git:['repo','dest'],uri:['url'],get_url:['url','dest'],pip:['name'],include_tasks:['file'],import_tasks:['file']};
const AB_MODULES={};
for(const [short,definition] of Object.entries(AN_MODULES)){
 if(short==='custom')continue;
 const fields={};for(const [key,[type,example,label]] of Object.entries(definition.fields))fields[key]=abField(type==='list'?'textlist':type.includes('|')?'enum':type,label,example,{choices:type.includes('|')?type.split('|'):undefined,required:(AB_REQUIRED[short]||[]).includes(key),min:0});
 AB_MODULES['ansible.builtin.'+short]={title:definition.label,help:definition.help,fields};
}
Object.assign(AB_MODULES['ansible.builtin.copy'].fields,{content:abField('multiline','Write this text instead of copying a source file.','port=8080\n'),backup:abField('boolean','Save a timestamped backup of an existing destination.',true)});
Object.assign(AB_MODULES['ansible.builtin.template'].fields,{validate:abField('text','Validate a temporary file before replacing the destination; %s is the filename.','nginx -t -c %s')});
Object.assign(AB_MODULES['ansible.builtin.command'].fields,{cmd:abField('text','A command string, as an alternative to argv.','/usr/bin/uptime'),removes:abField('text','Only run if this path exists.','/tmp/old-file')});
Object.assign(AB_MODULES['ansible.builtin.debug'].fields,{var:abField('text','A variable to inspect, as an alternative to msg.','result')});
AB_MODULES['ansible.builtin.pip']={title:'Python packages',help:'Manage Python packages on the target. Prefer a virtual environment.',fields:{name:abField('textlist','Package names, or use requirements instead.','requests'),requirements:abField('text','Path to requirements.txt on the target.','/opt/app/requirements.txt'),virtualenv:abField('text','Virtual environment path.','/opt/app/.venv'),virtualenv_command:abField('text','Command used to create the virtual environment.','python3 -m venv'),state:abField('enum','Desired package state.','present',{choices:['present','absent','latest']})}};
AB_MODULES['ansible.builtin.assert']={title:'Assert / validate inputs',help:'Stop with a helpful message if required conditions are not met.',fields:{that:abField('list','Expressions that must all be true.','',{required:true}),fail_msg:abField('text','Message when an assertion fails.','Check the supplied variables'),success_msg:abField('text','Message when assertions pass.','Inputs look correct')}};
AB_MODULES['ansible.builtin.set_fact']={title:'Set host variables',help:'Create variables for this host during execution.',fields:{},open:true};
AB_MODULES['ansible.builtin.fail']={title:'Stop with a message',help:'Explicitly stop execution for the current host.',fields:{msg:abField('text','Reason for the failure.','Deployment could not be completed')}};
for(const key of ['include_tasks','import_tasks'])AB_MODULES['ansible.builtin.'+key]={title:key==='include_tasks'?'Include a task file':'Import a task file',help:key==='include_tasks'?'Load a task list when execution reaches this point.':'Reuse a task list through a static import.',fields:{file:abField('text','Task file to load.','common.yml',{required:true})}};
AB_MODULES['ansible.builtin.meta']={title:'Ansible control action',help:'Control actions such as flushing queued handlers.',fields:{free_form:abField('enum','Control action.','flush_handlers',{required:true,choices:['flush_handlers','end_play','end_host','reset_connection','refresh_inventory']})}};
const AB_FILES={playbook:{label:'Playbook',filename:'site.yml',type:'plays'},tasks:{label:'Task file',filename:'tasks.yml',type:'tasks'},handlers:{label:'Handler file',filename:'handlers.yml',type:'handlers'},inventory:{label:'Inventory',filename:'inventory.yml',type:'inventory'},vars:{label:'Variables',filename:'vars.yml',type:'map'},requirements:{label:'Collections',filename:'requirements.yml',type:'requirements'}};
let abState=null,abUndo=[],abRedo=[],abFocus=null,abFilter='',abInputErrors=new Map();
const abOwn=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
const abSafeKey=key=>typeof key==='string'&&key.trim()&&!['__proto__','prototype','constructor'].includes(key);
const abGet=(path=abState.path)=>path.reduce((obj,key)=>obj?.[key],abState.doc);
const abSet=(path,value)=>{if(!path.length)abState.doc=value;else abGet(path.slice(0,-1))[path.at(-1)]=value;};
const abCopyObject=value=>JSON.parse(JSON.stringify(value));
const abDefault=kind=>({version:2,kind,doc:['playbook','tasks','handlers'].includes(kind)?[]:{},path:[],sxCode:'',sxSignature:['playbook','tasks','handlers'].includes(kind)?'[]':'{}'});
function abHistory(){abUndo.push(abCopyObject(abState));if(abUndo.length>60)abUndo.shift();abRedo=[];}
function abEdit(fn){abHistory();fn();abInputErrors.clear();abFilter='';abSave();abRender();}
function abSave(){try{localStorage.setItem(AB_KEY,JSON.stringify(abState));document.getElementById('ab-saved').textContent='Saved in this browser';}catch(e){document.getElementById('ab-saved').textContent='Memory only · download before closing';}}
function abModule(task){return Object.keys(task||{}).find(k=>k.includes('.')&&!abOwn(AB_TASK,k));}
function abType(path=abState.path){
 let type=AB_FILES[abState.kind].type,value=abState.doc;
 for(const key of path){
  if(Array.isArray(value)){type=type==='plays'?'play':type==='tasks'?'task':type==='handlers'?'handler':type==='roles'?'role':type==='collections'?'collection':'generic';}
  else if(type==='play'){type=AB_PLAY[key]?.type||'generic';}
  else if(type==='task'||type==='handler'){type=key==='block'||key==='rescue'||key==='always'?'tasks':key.includes('.')?'module:'+key:AB_TASK[key]?.type||'generic';}
  else if(type==='inventory'||type==='groups'){type='inventory-group';}
  else if(type==='inventory-group'){type=key==='children'?'groups':key==='hosts'?'hosts':key==='vars'?'map':'generic';}
  else if(type==='hosts'){type='host';}
  else if(type==='requirements'&&key==='collections'){type='collections';}
  else type='generic';
  value=value?.[key];
 }
 return type;
}
function abSchema(type=abType(),value=abGet()){
 if(type==='play')return AB_PLAY;
 if(type==='task'||type==='handler')return value?.block?AB_BLOCK:{...AB_TASK,...(type==='handler'?{listen:abField('textlist','Optional notification topic shared by handlers.','Restart services')}: {})};
 if(type.startsWith('module:'))return AB_MODULES[type.slice(7)]?.fields||{};
 if(type==='role')return {role:abField('text','Role name.','web',{required:true}),vars:AB_COMMON.vars,tags:AB_COMMON.tags,when:AB_TASK.when,become:AB_COMMON.become};
 if(type==='inventory-group')return {hosts:abField('hosts','Add named hosts to this group.'),children:abField('groups','Add nested groups.'),vars:abField('map','Variables shared by this group.')};
 if(type==='host')return {ansible_host:abField('text','The address used to connect to this host.','192.0.2.10'),ansible_user:abField('text','SSH username.','deploy'),ansible_port:abField('number','SSH port.',22,{min:1}),ansible_python_interpreter:abField('text','Remote Python path.','/usr/bin/python3'),ansible_connection:abField('enum','Connection type.','ssh',{choices:['ssh','local','winrm']}),ansible_ssh_private_key_file:abField('text','Private-key path on the control node.','~/.ssh/id_ed25519')};
 if(type==='requirements')return {collections:abField('collections','Collections to install on the control node.')};
 if(type==='collection')return {name:abField('text','Collection name.','community.general',{required:true}),version:abField('text','Version or supported version constraint.','>=1.0.0'),source:abField('text','Optional Galaxy server URL.','https://galaxy.ansible.com')};
 return {};
}
function abNewValue(field){
 if(['tasks','handlers','list','roles','collections'].includes(field.type))return [];
 if(['map','groups','hosts'].includes(field.type))return {};
 if(field.type==='boolean')return Boolean(field.example);
 if(field.type==='number')return typeof field.example==='number'?field.example:field.min||0;
 if(field.type==='enum')return field.example||field.choices[0];
 if(field.type==='expression'&&field.example==='false')return false;
 return '';
}
function abNode(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;}
function abButton(label,action,cls='ab-button'){const btn=abNode('button',cls,label);btn.type='button';btn.onclick=action;return btn;}
function abTitle(value,key,type){if(type==='play')return value.name||'Untitled play';if(type==='task'||type==='handler')return value.name||'Untitled '+type;if(type==='role')return value.role||'New role';if(type==='collection')return value.name||'New collection';return String(key);}
function abGo(path){abState.path=path;abFilter='';abInputErrors.clear();abSave();abRender();}
function abOpen(){
 abFocus=document.activeElement;
 if(!abState){try{const saved=JSON.parse(localStorage.getItem(AB_KEY));if(saved?.version===2&&AB_FILES[saved.kind]&&Array.isArray(saved.path)&&(anMap(saved.doc)||Array.isArray(saved.doc)))abState=saved;}catch(e){}if(!abState)abState=abDefault('playbook');}
 if(abGet()===undefined)abState.path=[];
 const dialog=document.getElementById('ab-dialog');if(!dialog.open)dialog.showModal();abRender();document.getElementById('ab-close').focus();
}
function abClose(){document.getElementById('ab-dialog').close();abFocus?.focus();}
function abReset(kind){abEdit(()=>{abState=abDefault(kind);});}
function abRender(){
 const type=abType(),value=abGet();if(value===undefined){abState.path=[];return abRender();}
 document.getElementById('ab-file-label').textContent=AB_FILES[abState.kind].filename;
 document.getElementById('ab-undo').disabled=!abUndo.length;document.getElementById('ab-redo').disabled=!abRedo.length;
 const crumbs=document.getElementById('ab-crumbs');crumbs.replaceChildren(abButton(AB_FILES[abState.kind].label,()=>abGo([]),'ab-crumb'));
 for(let i=0;i<abState.path.length;i++){const p=abState.path.slice(0,i+1);const k=abState.path[i];crumbs.append(abNode('span','','/'),abButton(typeof k==='number'?abTitle(abGet(p),k,abType(p)):k,()=>abGo(p),'ab-crumb'));}
 document.getElementById('ab-scope-title').textContent=type.startsWith('module:')?AB_MODULES[type.slice(7)]?.title||type.slice(7):({play:'Build this play',task:'Build this task',handler:'Build this handler',tasks:'Tasks · in execution order',handlers:'Handlers · run when notified',plays:'Plays · in execution order',map:'Named values',inventory:'Inventory groups',groups:'Nested groups',hosts:'Hosts',list:'List items',roles:'Roles',collections:'Collections'}[type]||'Build this block');
 document.getElementById('ab-scope-help').textContent=type.startsWith('module:')?(AB_MODULES[type.slice(7)]?.help||'Add parameters using named blocks. Check ansible-doc for this installed module.'):({play:'Start with a name, choose your hosts, then add tasks. Optional pieces stay available below.',task:'Give the task a name, then choose one module. Each module offers its own parameters.',handler:'Name this handler, then choose its module. A task can notify this exact name.',tasks:'Add tasks one at a time. Move them up or down to change their execution order.',inventory:'Add a group such as all or webservers, then add its hosts and variables.'}[type]||'Choose a piece below. Nesting, list markers and quoting are handled for you.');
 const canvas=document.getElementById('ab-fields');canvas.replaceChildren();
 if(Array.isArray(value))abRenderList(canvas,value,type);
 else if(anMap(value)){
  if(!Object.keys(value).length)canvas.append(abNode('div','ab-empty','No pieces yet. Choose the highlighted suggestion below to begin.'));
  const schema=abSchema();for(const [key,item] of Object.entries(value))canvas.append(abRenderField(key,item,schema[key]));
 }else canvas.append(abRenderField(abState.path.at(-1)||'value',value,null,true));
 abRenderPalette();abRenderTree();abRefresh();
}
function abRenderTree(){
 const target=document.getElementById('ab-tree');target.replaceChildren();
 function walk(value,path,key,depth){
  const type=abType(path),active=JSON.stringify(path)===JSON.stringify(abState.path);
  const label=path.length?abTitle(value,key,type):AB_FILES[abState.kind].label;
  const btn=abButton(label,()=>abGo(path),'ab-tree-row'+(active?' active':''));btn.style.paddingLeft=(10+depth*12)+'px';btn.title=label;btn.setAttribute('aria-current',active?'location':'false');target.append(btn);
  if(Array.isArray(value))value.forEach((v,i)=>{if(v!==null&&typeof v==='object')walk(v,[...path,i],i,depth+1);});
  else if(anMap(value))for(const [k,v] of Object.entries(value))if(v!==null&&typeof v==='object')walk(v,[...path,k],k,depth+1);
 }
 walk(abState.doc,[],'Document',0);
}
function abRemove(path){abEdit(()=>{const parent=abGet(path.slice(0,-1)),key=path.at(-1);if(Array.isArray(parent))parent.splice(key,1);else delete parent[key];if(JSON.stringify(abState.path).startsWith(JSON.stringify(path).slice(0,-1)))abState.path=path.slice(0,-1);});}
function abRenderField(key,value,definition,atCurrent=false){
 const path=atCurrent?[...abState.path]:[...abState.path,key];const row=abNode('div','ab-field');row.dataset.key=String(key);
 const top=abNode('div','ab-field-top');const label=abNode('label','ab-field-label',String(key));top.append(label);if(definition?.required)top.append(abNode('span','ab-required','required'));
 const remove=abButton('×',()=>abRemove(path),'ab-remove');remove.setAttribute('aria-label','Remove '+key);top.append(remove);row.append(top);
 if(definition?.help)row.append(abNode('p','ab-hint',definition.help));
 if(value!==null&&typeof value==='object'){
  const count=Array.isArray(value)?value.length:Object.keys(value).length;
  row.append(abButton('Edit '+key+'  ·  '+count+' '+(Array.isArray(value)?'items':'pieces')+'  →',()=>abGo(path),'ab-nested'));
 }else{
  const control=abControl(value,definition,path);label.htmlFor=control.id;row.append(control);
  if(definition?.type==='textlist'&&typeof value==='string')row.append(abButton('Use a list instead',()=>abEdit(()=>{const current=abGet(path);abSet(path,current?[current]:[]);abState.path=path;}),'ab-text-button'));
  if(definition?.type==='expression'&&typeof value==='boolean')row.append(abButton('Use an expression instead',()=>abEdit(()=>abSet(path,'')),'ab-text-button'));
 }
 const parentType=abType(path.slice(0,-1));
 if((parentType.startsWith('module:')&&['text','textlist','multiline'].includes(definition?.type))||key==='loop')row.append(abVariablePicker(path));
 return row;
}
function abVariablePicker(path){
 const picker=abNode('select','ab-input ab-variable-picker');picker.setAttribute('aria-label','Use variable for '+path.at(-1));
 const placeholder=abNode('option','','Use a variable…');placeholder.value='';picker.append(placeholder);
 const play=abState.kind==='playbook'?abState.doc[path[0]]:null;
 const variables=new Set(['inventory_hostname','item',...Object.keys(play?.vars||{})]);
 for(const name of variables){const option=abNode('option','',name);option.value=name;picker.append(option);}
 picker.onchange=()=>{if(!picker.value)return;abEdit(()=>abSet(path,'{{ '+picker.value+' }}'));};
 return picker;
}
let abControlId=0;
function abControl(value,definition,path){
 let input;const type=definition?.type;
 if(type==='boolean'||typeof value==='boolean'){
  input=abNode('select');for(const item of ['true','false']){const option=abNode('option','',item);option.value=item;input.append(option);}input.value=String(value);
 }else if(type==='enum'&&typeof value==='string'){
  input=abNode('select');for(const item of [...new Set([...(definition.choices||[]),value])]){const option=abNode('option','',item);option.value=item;input.append(option);}input.value=value;
 }else if(type==='multiline'||(typeof value==='string'&&value.includes('\n'))){input=abNode('textarea');input.rows=4;input.value=value??'';}
 else{input=abNode('input');input.type=typeof value==='number'||type==='number'?'number':'text';input.value=value??'';if(input.type==='number'){input.min=definition?.min??0;input.step='1';}}
 input.id='ab-input-'+(++abControlId);input.className='ab-input';input.setAttribute('aria-label',path.at(-1)+' value');input.dataset.path=JSON.stringify(path);input.spellcheck=false;
 input.placeholder=String(definition?.example??'');
 if(type==='notify'){
  const list=document.getElementById('ab-handler-names');list.replaceChildren();const plays=abState.kind==='playbook'?abState.doc:[];for(const play of plays)for(const handler of play.handlers||[])if(handler.name)list.append(abNode('option','',handler.name));input.setAttribute('list','ab-handler-names');
 }
 input.addEventListener('focus',()=>abHistory(),{once:true});
 input.addEventListener('input',()=>{
  const id=JSON.stringify(path);let result=input.value;
  if(type==='boolean'||typeof value==='boolean')result=input.value==='true';
  else if(input.type==='number'){
   if(!input.value.trim()||!Number.isInteger(Number(input.value))||Number(input.value)<Number(input.min||0)){abInputErrors.set(id,'Enter a whole number of at least '+input.min+'.');abRefresh();return;}result=Number(input.value);
  }
  if(type==='expression'&&['true','false'].includes(result))result=result==='true';
  abInputErrors.delete(id);abSet(path,result);abSave();abRefresh();
  if(path.at(-1)==='name'||path.at(-1)==='role')abRenderTree();
 });
 return input;
}
function abRenderList(canvas,list,type){
 if(!list.length)canvas.append(abNode('div','ab-empty','This list is empty. Add the first '+({plays:'play',tasks:'task',handlers:'handler',roles:'role',collections:'collection'}[type]||'item')+' below.'));
 list.forEach((value,index)=>{
  const path=[...abState.path,index],row=abNode('div','ab-list-item');row.dataset.index=index;
  const head=abNode('div','ab-field-top');head.append(abNode('span','ab-index',String(index+1).padStart(2,'0')));
  if(value!==null&&typeof value==='object')head.append(abButton(abTitle(value,index,abType(path))+' →',()=>abGo(path),'ab-item-name'));
  else head.append(abControl(value,null,path));
  for(const [label,offset] of [['↑',-1],['↓',1]]){const btn=abButton(label,()=>abEdit(()=>{[list[index],list[index+offset]]=[list[index+offset],list[index]];}),'ab-small');btn.disabled=index+offset<0||index+offset>=list.length;btn.setAttribute('aria-label','Move item '+(index+1)+(offset<0?' up':' down'));head.append(btn);}
  const duplicate=abButton('⧉',()=>abEdit(()=>{list.splice(index+1,0,abCopyObject(abGet(path)));}),'ab-small');duplicate.setAttribute('aria-label','Duplicate item '+(index+1));head.append(duplicate);
  const remove=abButton('×',()=>abRemove(path),'ab-remove');remove.setAttribute('aria-label','Remove item '+(index+1));head.append(remove);row.append(head);
  if(anMap(value)){const summary=Object.keys(value).filter(k=>k!=='name').join(' · ');row.append(abNode('p','ab-hint',summary||'Choose the next piece inside this block.'));}
  canvas.append(row);
 });
}
function abChoices(){
 const type=abType(),value=abGet(),choices=[];if(value===null||typeof value!=='object')return choices;
 if(Array.isArray(value)){
  const title={plays:'Play',tasks:'Task',handlers:'Handler',roles:'Role',collections:'Collection'}[type];
  if(title)choices.push({key:'$item',label:'+ '+title,help:'Add a new '+title.toLowerCase()+' and choose its pieces.',create:()=>{value.push({});abState.path.push(value.length-1);}});
  else for(const [key,initial,help] of [['Text','', 'A string, package name or expression.'],['Object',{},'An item with named fields, for example a user and shell.'],['Number',0,'A numeric value.'],['List',[],'A nested list of items.']])choices.push({key:'$'+key,label:'+ '+key+' item',help,create:()=>{value.push(initial);if(typeof initial==='object')abState.path.push(value.length-1);}});
  return choices;
 }
 const schema=abSchema();
 for(const [key,field] of Object.entries(schema))if(!abOwn(value,key)){
  if(type==='module:ansible.builtin.copy'&&((key==='src'&&abOwn(value,'content'))||(key==='content'&&abOwn(value,'src'))))continue;
  if(type==='module:ansible.builtin.debug'&&((key==='msg'&&abOwn(value,'var'))||(key==='var'&&abOwn(value,'msg'))))continue;
  if(type==='module:ansible.builtin.command'&&((key==='argv'&&abOwn(value,'cmd'))||(key==='cmd'&&abOwn(value,'argv'))))continue;
  if(type==='module:ansible.builtin.pip'&&((key==='name'&&abOwn(value,'requirements'))||(key==='requirements'&&abOwn(value,'name'))))continue;
  choices.push({key,label:'+ '+key,help:field.help,required:field.required,create:()=>{value[key]=abNewValue(field);if(typeof value[key]==='object')abState.path.push(key);},focus:key});
 }
 if((type==='task'||type==='handler')&&!abModule(value)&&!abOwn(value,'block')){
  choices.splice(abOwn(value,'name')?0:Math.min(1,choices.length),0,{key:'$module',label:'Choose a module →',help:'Pick the action: packages, services, files, commands and more.',modulePicker:true});
  if(type==='task')choices.push({key:'block',label:'+ block',help:'Group tasks, with optional rescue and always steps.',create:()=>{value.block=[];abState.path.push('block');}});
 }
 return choices;
}
function abRenderPalette(){
 const container=document.getElementById('ab-palette');container.replaceChildren();
 const type=abType(),value=abGet();const choices=abChoices();
 const currentModule=type.startsWith('module:')?type.slice(7):null;
 const recommended=choices.find(c=>c.required)||choices[0];
 const filtered=choices.filter(c=>(c.label+' '+c.help).toLowerCase().includes(abFilter));
 const heading=abNode('div','ab-palette-heading');heading.append(abNode('h3','','What comes next?'));container.append(heading);
 if(choices.length>6){const search=abNode('input','ab-input');search.id='ab-piece-search';search.placeholder='Find a piece…';search.value=abFilter;search.setAttribute('aria-label','Find a piece');search.oninput=()=>{const pos=search.selectionStart;abFilter=search.value.toLowerCase();abRenderPalette();const next=document.getElementById('ab-piece-search');next?.focus();next?.setSelectionRange(pos,pos);};container.append(search);}
 const grid=abNode('div','ab-pieces');
 // Guide name → hosts → tasks, then a task name → module → module parameters.
 let firstKey=recommended?.key;
 if(['play','task','handler'].includes(type)&&!abOwn(value,'name'))firstKey='name';
 if(type==='play'&&abOwn(value,'name'))firstKey=!abOwn(value,'hosts')?'hosts':!abOwn(value,'tasks')?'tasks':firstKey;
 for(const item of filtered){const button=abButton('',()=>{if(item.modulePicker){abShowModules();return;}const oldPath=[...abState.path];abEdit(item.create);if(item.focus&&JSON.stringify(oldPath)===JSON.stringify(abState.path)){const input=[...document.querySelectorAll('#ab-fields .ab-input')].find(el=>JSON.parse(el.dataset.path||'[]').at(-1)===item.focus);input?.focus();}},'ab-piece'+(item.key===firstKey?' suggested':''));button.dataset.piece=item.key;button.append(abNode('strong','',item.label),abNode('span','',item.help));if(item.key===firstKey)button.append(abNode('em','','Suggested next'));grid.append(button);}
 container.append(grid);
 const open=anMap(value)&&(['map','generic','inventory','groups','hosts','host'].includes(type)||(currentModule&&!AB_MODULES[currentModule])||AB_MODULES[currentModule]?.open);
 if(open)container.append(abNamedForm(type));
 if(anMap(value)&&!open) {
  const details=abNode('details','ab-extra');details.append(abNode('summary','','Other named field'));const help=abNode('p','ab-hint','For a documented parameter not listed above. Choose its value type; nesting is still automatic.');details.append(help,abNamedForm(type));container.append(details);
 }
 if(!choices.length&&!open)container.prepend(abNode('p','ab-hint','This piece is filled in. Use the breadcrumb above to return to its parent and continue.'));
 if(abState.path.length){const parent=abState.path.slice(0,-1);container.append(abButton('Done with this block · back ↑',()=>abGo(parent),'ab-done'));}
}
function abNamedForm(type){
 const form=abNode('form','ab-named-form');const noun={inventory:'group',groups:'group',hosts:'host',map:'variable'}[type]||'field';
 const name=abNode('input','ab-input');name.placeholder=noun+' name';name.setAttribute('aria-label','New '+noun+' name');name.required=true;name.autocomplete='off';
 const types=abNode('select','ab-input');types.setAttribute('aria-label','New value type');
 const choices=['inventory','groups','hosts'].includes(type)?['Object']:['Text','Number','Boolean','List','Object'];
 for(const label of choices){const option=abNode('option','',label);option.value=label;types.append(option);}
 const submit=abNode('button','ab-button','+ Add '+noun);submit.type='submit';const error=abNode('p','ab-inline-error');error.setAttribute('role','status');form.append(name,types,submit,error);
 form.onsubmit=e=>{e.preventDefault();const key=name.value.trim(),obj=abGet();if(!abSafeKey(key)){error.textContent='Enter a valid, nonempty field name.';return;}if(abOwn(obj,key)){error.textContent='That name already exists. Edit its block above.';return;}if(type==='map'&&!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)){error.textContent='Variable names use letters, digits and underscores, with no leading digit.';return;}
  if((type==='task'||type==='handler')&&key.includes('.')){error.textContent='Choose the module with the module picker so the task has only one action.';return;}
  const initial={Text:'',Number:0,Boolean:true,List:[],Object:{}}[types.value];abEdit(()=>{obj[key]=initial;if(initial!==null&&typeof initial==='object')abState.path.push(key);});
 };
 return form;
}
function abShowModules(){
 const container=document.getElementById('ab-palette');container.replaceChildren();container.append(abNode('h3','','Choose what this task does'));
 const search=abNode('input','ab-input');search.id='ab-module-search';search.placeholder='Find a module: packages, apt, copy…';search.setAttribute('aria-label','Find a module');container.append(search);
 const grid=abNode('div','ab-pieces ab-module-grid');container.append(grid);
 const render=()=>{grid.replaceChildren();for(const [name,definition] of Object.entries(AB_MODULES)){
  if(!(name+' '+definition.title+' '+definition.help).toLowerCase().includes(search.value.toLowerCase()))continue;
  const button=abButton('',()=>abChooseModule(name),'ab-piece');button.dataset.module=name;button.append(abNode('strong','',definition.title),abNode('code','',name),abNode('span','',definition.help));grid.append(button);
 }};search.oninput=render;render();
 const custom=abNode('form','ab-named-form');const name=abNode('input','ab-input');name.placeholder='namespace.collection.module';name.setAttribute('aria-label','Custom module name');const button=abNode('button','ab-button','Use custom module');button.type='submit';const error=abNode('p','ab-inline-error');custom.append(name,button,error);custom.onsubmit=e=>{e.preventDefault();if(!/^[a-zA-Z_][\w]*\.[a-zA-Z_][\w]*\.[a-zA-Z_][\w]*$/.test(name.value)){error.textContent='Use a fully qualified name: namespace.collection.module';return;}abChooseModule(name.value);};container.append(custom,abButton('← Back to task pieces',abRenderPalette,'ab-text-button'));search.focus();
}
function abChooseModule(name){abEdit(()=>{const task=abGet();if(abModule(task)||abOwn(task,'block'))throw Error('Task already has an action');task[name]={};abState.path.push(name);});}
function abValidate(){
 const problems=[...abInputErrors.values()],warnings=[];let count=0;
 const empty=v=>v===undefined||v===null||v===''||(Array.isArray(v)&&!v.length);
 const required=(obj,key,label)=>{if(empty(obj[key]))problems.push(label+': fill in '+key+'.');};
 const tasks=(list,label)=>{
  if(!Array.isArray(list)){problems.push(label+' must be a task list.');return;}
  list.forEach((task,i)=>{
   const where=label+' '+(i+1);if(!anMap(task)){problems.push(where+' must be a task block.');return;}count++;
   if(task.block!==undefined){if(abModule(task))problems.push(where+': a block cannot also call a module.');if(!Array.isArray(task.block)||!task.block.length)problems.push(where+': add a task inside block.');for(const key of ['block','rescue','always'])if(task[key])tasks(task[key],where+' / '+key);return;}
   const modules=Object.keys(task).filter(k=>k.includes('.'));if(modules.length!==1){problems.push(where+': choose one module.');return;}
   const module=modules[0],params=task[module],short=module.replace('ansible.builtin.','');
   if(!AB_MODULES[module])warnings.push('Custom module parameters are not checked: '+module+'.');
   if(anMap(params)){
    for(const [key,field] of Object.entries(AB_MODULES[module]?.fields||{}))if(field.required)required(params,key,where);
    if(short==='copy'&&empty(params.src)&&params.content===undefined)problems.push(where+': add src or content.');
    if(short==='command'&&empty(params.argv)&&empty(params.cmd)&&empty(params._raw_params))problems.push(where+': add argv or cmd.');
    if(short==='shell'&&empty(params.cmd)&&empty(params._raw_params))problems.push(where+': fill in cmd.');
    if(short==='pip'&&empty(params.name)&&empty(params.requirements))problems.push(where+': add name or requirements.');
    for(const pair of short==='copy'?[['src','content']]:short==='debug'?[['msg','var']]:short==='command'?[['argv','cmd']]:[])if(pair.every(k=>abOwn(params,k)))problems.push(where+': use '+pair.join(' or ')+', not both.');
    if(['command','shell'].includes(short)&&task.changed_when===undefined&&!params.creates&&!params.removes)warnings.push(where+': consider changed_when or creates/removes for repeatable command tasks.');
   }else if(empty(params)&&!['ping','debug'].includes(short))problems.push(where+': supply module parameters.');
   if(task.register!==undefined&&!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(task.register))problems.push(where+': register needs a valid variable name.');
   if(task.loop!==undefined&&!Array.isArray(task.loop)&&!(typeof task.loop==='string'&&task.loop.includes('{{')))problems.push(where+': loop needs a list or a list-variable expression.');
  });
 };
 if(abState.kind==='playbook'){
  if(!Array.isArray(abState.doc)||!abState.doc.length)problems.push('Add at least one play.');
  else abState.doc.forEach((play,i)=>{
   const label='Play '+(i+1);if(!anMap(play)){problems.push(label+' must be a mapping.');return;}
   required(play,'hosts',label);
   if(!['tasks','pre_tasks','post_tasks','roles'].some(k=>Array.isArray(play[k])&&play[k].length))problems.push(label+': add tasks or a role.');
   for(const key of ['tasks','handlers','pre_tasks','post_tasks'])if(play[key]!==undefined)tasks(play[key],label+' / '+key);
   const handlers=new Set((play.handlers||[]).flatMap(h=>[h.name,...(Array.isArray(h.listen)?h.listen:[h.listen])]).filter(Boolean));
   function checkNotify(list){for(const task of list||[]){if(!anMap(task))continue;for(const name of task.notify===undefined?[]:Array.isArray(task.notify)?task.notify:[task.notify])if(!handlers.has(name))warnings.push('No local handler named '+name+'. Add one under handlers; an imported handler may also supply it.');for(const key of ['block','rescue','always'])if(Array.isArray(task[key]))checkNotify(task[key]);}}
   for(const key of ['tasks','pre_tasks','post_tasks'])checkNotify(play[key]);
  });
 }else if(['tasks','handlers'].includes(abState.kind)){if(!abState.doc.length)problems.push('Add a '+(abState.kind==='tasks'?'task':'handler')+'.');tasks(abState.doc,'Task');}
 else if(!anMap(abState.doc)||!Object.keys(abState.doc).length)problems.push('Add the first named block.');
 return {problems:[...new Set(problems)],warnings:[...new Set(warnings)],count};
}
function abRefresh(){
 const output='---\n'+anDump(abState.doc);document.getElementById('ab-preview').value=output;
 const {problems,warnings,count}=abValidate();const status=document.getElementById('ab-validation');status.replaceChildren();
 status.className=problems.length?'ab-validation incomplete':'ab-validation ready';
 status.append(abNode('strong','',problems.length?'Keep building':'Ready to copy'));
 const items=problems.length?problems:warnings.length?warnings:['Structure checked. Review the target hosts and test with Ansible before running.'];
 items.slice(0,4).forEach(text=>status.append(abNode('p','',text)));if(items.length>4)status.append(abNode('p','',`+ ${items.length-4} more items to review`));
 document.getElementById('ab-copy').disabled=!!problems.length;document.getElementById('ab-download').disabled=!!problems.length;
 document.getElementById('ab-meta').textContent=output.trimEnd().split('\n').length+' lines'+(count?' · '+count+' task'+(count===1?'':'s'):'');
 document.getElementById('ab-undo').disabled=!abUndo.length;document.getElementById('ab-redo').disabled=!abRedo.length;
}
async function abCopy(){if(abValidate().problems.length)return;const output=document.getElementById('ab-preview').value;try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(output);else{const field=document.getElementById('ab-preview');field.focus();field.select();if(!document.execCommand('copy'))throw Error('Clipboard');}document.getElementById('ab-copy-status').textContent='Copied with indentation and line breaks.';}catch(e){const field=document.getElementById('ab-preview');field.focus();field.select();document.getElementById('ab-copy-status').textContent='Press Ctrl+C to copy the selected YAML.';}}
function abDownload(){if(abValidate().problems.length)return;const link=document.createElement('a');const url=URL.createObjectURL(new Blob([document.getElementById('ab-preview').value],{type:'application/yaml;charset=utf-8'}));link.href=url;link.download=AB_FILES[abState.kind].filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function abLoadExample(){abEdit(()=>{abState={version:2,kind:'playbook',doc:[abCopyObject(AN_STARTER)],path:[0]};});}
function abLegacy(){try{const old=JSON.parse(localStorage.getItem('devkit_ansible_draft_v1'));if(old?.play)abEdit(()=>{abState={version:2,kind:'playbook',doc:[old.play],path:[0]};});else document.getElementById('ab-copy-status').textContent='No draft from the previous builder was found.';}catch(e){document.getElementById('ab-copy-status').textContent='The previous draft could not be loaded.';}}
function abImportSnippet(item){
 let doc=anParse(item.cmd,'Example'),kind='playbook';
 if(item.platform==='Complete playbook')kind='playbook';
 else if(item.platform==='Task file')kind='tasks';
 else if(item.platform==='Inventory file')kind='inventory';
 else if(item.platform==='Collection requirements')kind='requirements';
 else kind='vars';
 const normalize=task=>{if(!anMap(task))return;for(const key of Object.keys(task)){if(AN_MODULES[key]&&key!=='custom'){task['ansible.builtin.'+key]=task[key];delete task[key];}if(['block','rescue','always'].includes(key)&&Array.isArray(task[key]))task[key].forEach(normalize);}};
 if(kind==='tasks')doc.forEach(normalize);if(kind==='playbook')doc.forEach(play=>['tasks','handlers','pre_tasks','post_tasks'].forEach(k=>(play[k]||[]).forEach(normalize)));
 abOpen();abEdit(()=>{abState={version:2,kind,doc,path:kind==='playbook'?[0]:[]};});
}

document.body.insertAdjacentHTML('beforeend',`<dialog id="ab-dialog" aria-labelledby="ab-title"><div class="ab-shell">
 <header class="ab-header"><div><span class="ab-eyebrow">ANSIBLE · BLOCK BUILDER</span><h2 id="ab-title">Build one piece at a time.</h2><p>Choose what comes next. Fill it in. The YAML takes care of itself.</p></div><button class="ab-button" id="ab-close">Close ✕</button></header>
 <div class="ab-topbar"><div class="ab-file"><span class="ab-file-dot"></span><strong id="ab-file-label">site.yml</strong><span id="ab-saved">Saved locally · avoid entering secrets</span></div><div class="ab-tools"><button class="ab-button" id="ab-undo">Undo</button><button class="ab-button" id="ab-redo">Redo</button><details id="ab-new-menu"><summary class="ab-button">New / examples ▾</summary><div id="ab-new-options"></div></details></div></div>
 <div class="ab-layout"><aside class="ab-outline"><h3>YOUR BLOCKS</h3><nav id="ab-tree" aria-label="Document blocks"></nav><p class="ab-hint">Select any block to edit it. Undo restores removed pieces.</p></aside>
 <section class="ab-canvas"><nav id="ab-crumbs" aria-label="Current block path"></nav><h2 id="ab-scope-title"></h2><p id="ab-scope-help" class="ab-help"></p><div id="ab-fields"></div><section id="ab-palette" aria-label="Available next pieces"></section></section>
 <section class="ab-output"><div class="ab-preview-heading"><strong>Live YAML</strong><span id="ab-meta"></span></div><textarea id="ab-preview" readonly spellcheck="false" aria-label="Generated YAML"></textarea><div id="ab-validation" role="status" aria-live="polite"></div><div class="ab-export"><button class="ab-button primary" id="ab-copy">Copy YAML</button><button class="ab-button" id="ab-download">Download .yml</button></div><p id="ab-copy-status" class="ab-hint" role="status"></p><details class="ab-check-help"><summary>How to check this file</summary><p>Save the YAML and your inventory, then check them on your control node. This builder does not execute Ansible.</p><code>ansible-playbook -i inventory.yml site.yml --syntax-check</code><p>Use --check --diff to preview supported changes. Inventory and task-only files need to be used in the appropriate project context.</p><a href="https://docs.ansible.com/projects/ansible/latest/reference_appendices/playbooks_keywords.html" target="_blank" rel="noopener">Ansible keyword reference ↗</a></details></section></div></div><datalist id="ab-handler-names"></datalist></dialog>`);
document.getElementById('ab-close').onclick=abClose;
document.getElementById('ab-dialog').addEventListener('cancel',e=>{e.preventDefault();abClose();});
document.getElementById('ab-copy').onclick=abCopy;document.getElementById('ab-download').onclick=abDownload;
document.getElementById('ab-undo').onclick=()=>{if(!abUndo.length)return;abRedo.push(abCopyObject(abState));abState=abUndo.pop();abInputErrors.clear();abSave();abRender();};
document.getElementById('ab-redo').onclick=()=>{if(!abRedo.length)return;abUndo.push(abCopyObject(abState));abState=abRedo.pop();abInputErrors.clear();abSave();abRender();};
const abMenu=document.getElementById('ab-new-options');for(const [kind,file] of Object.entries(AB_FILES))abMenu.append(abButton('New '+file.label.toLowerCase(),()=>{abReset(kind);document.getElementById('ab-new-menu').open=false;}));
abMenu.append(abButton('Load web-server example',()=>{abLoadExample();document.getElementById('ab-new-menu').open=false;}),abButton('Load previous builder draft',()=>{abLegacy();document.getElementById('ab-new-menu').open=false;}));
// Existing entry points now open the guided builder. The previous draft remains available above.
anOpen=abOpen;
BUILDERS['ansible::YAML playbook workbench'].name='Ansible block builder';
BUILDERS['ansible::YAML playbook workbench'].description='Build YAML like blocks: name → hosts → tasks → module → parameters. Suggested next pieces, automatic formatting, undo and copy.';
const abRenderSheetBefore=renderSheet;
renderSheet=function(key,q){abRenderSheetBefore(key,q);if(key==='ansible'){const button=document.querySelector('.an-banner button');if(button)button.textContent='Open block builder →';const title=document.querySelector('.an-banner h2');if(title)title.textContent='Build Ansible, one piece at a time.';}abAttachSnippetButtons();};
const abRenderSearchBefore=renderSearchResults;renderSearchResults=function(q){abRenderSearchBefore(q);abAttachSnippetButtons();};
function abAttachSnippetButtons(){
 const supported=new Set(['Task file','Complete playbook','Variables file','Inventory file','Collection requirements']);
 const items=SHEETS.ansible.sections.flatMap(s=>s.cmds).filter(item=>supported.has(item.platform));const byId=new Map(items.map(item=>[cmdId('ansible',item.cmd),item]));
 document.querySelectorAll('#main .cmd-item').forEach(row=>{const item=byId.get(row.dataset.id);if(!item||row.querySelector('.ab-use-example'))return;const button=abButton('Build',()=>abImportSnippet(item),'mini-btn ab-use-example');button.title='Open this example as editable blocks (Undo restores your draft)';row.querySelector('.cmd-actions')?.prepend(button);});
}
