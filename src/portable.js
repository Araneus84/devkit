/* Explicit backup/restore keeps this app independent of a browser or file location. */
const DK_BACKUP_KEYS=[...Object.values(STORAGE_KEYS),'devkit_ansible_draft_v1','devkit_ansible_blocks_v2',DK_STORAGE,'devkit:vim'];
function dkBackup(){const data={};for(const key of DK_BACKUP_KEYS){const value=localStorage.getItem(key);if(value!==null)data[key]=value;}return {format:'devkit-backup',version:1,createdAt:new Date().toISOString(),data};}
function dkValidateBackup(value){
 if(!value||value.format!=='devkit-backup'||value.version!==1||!anMap(value.data))throw Error('This is not a supported DevKit backup.');
 const known=new Set(DK_BACKUP_KEYS);const output={};
 function checkTree(v,depth=0){if(depth>100)throw Error('Backup is nested too deeply.');if(v&&typeof v==='object')for(const [k,x] of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(k))throw Error('Backup contains an unsupported key.');checkTree(x,depth+1);}}
 for(const [key,raw] of Object.entries(value.data)){
  if(!known.has(key))throw Error('Unknown backup setting: '+key);if(typeof raw!=='string'||raw.length>4000000)throw Error('Invalid backup entry.');
  if(['devkit:theme','devkit:activeSheet','devkit:activeSection','devkit:viewMode','devkit:fontSize','devkit:sidebarWidth'].includes(key)){
   if(key==='devkit:theme'&&!['dark','light'].includes(raw))throw Error('Invalid theme.');
   if(key==='devkit:activeSheet'&&!SHEETS[raw]&&!['__builder','__favorites'].includes(raw))throw Error('Unknown active sheet.');
   if(key==='devkit:fontSize'&&(!/^\d+$/.test(raw)||+raw<8||+raw>30))throw Error('Invalid font size.');
   if(key==='devkit:sidebarWidth'&&(!/^\d+$/.test(raw)||+raw<100||+raw>800))throw Error('Invalid sidebar width.');
  }else{
   let parsed;try{parsed=JSON.parse(raw);}catch(e){throw Error('Invalid saved data for '+key);}checkTree(parsed);
   if(['devkit:favorites','devkit:expandedSheets'].includes(key)&&(!Array.isArray(parsed)||parsed.some(x=>typeof x!=='string')))throw Error('Invalid list in backup.');
   if(key==='devkit:notes'&&(!anMap(parsed)||Object.values(parsed).some(x=>typeof x!=='string')))throw Error('Invalid notes in backup.');
   if(key==='devkit:history'&&(!Array.isArray(parsed)||parsed.some(x=>!x||typeof x.cmd!=='string'||typeof x.time!=='number')))throw Error('Invalid history in backup.');
   if(key===DK_STORAGE&&anMap(parsed))for(const [id,draft] of Object.entries(parsed))if((id.startsWith('deep:')||draft?.profile)&&(!ewValidDraft(draft)||draft.id!==id))throw Error('Invalid editor draft: '+(draft?.filename||id));
   if(key===DK_STORAGE&&(!anMap(parsed)||Object.values(parsed).some(x=>!x||typeof x.id!=='string'||!SHEETS[x.sheet]||!Array.isArray(x.blocks))))throw Error('Invalid workbench drafts.');
   if(key==='devkit_ansible_blocks_v2'&&(!anMap(parsed)||parsed.version!==2||!AB_FILES[parsed.kind]||!Array.isArray(parsed.path)||!(anMap(parsed.doc)||Array.isArray(parsed.doc))))throw Error('Invalid Ansible draft.');
  }
  output[key]=raw;
 }
 return output;
}
function dkRestore(data){const original={};for(const key of Object.keys(data))original[key]=localStorage.getItem(key);try{for(const [key,value] of Object.entries(data))localStorage.setItem(key,value);}catch(e){for(const [key,value] of Object.entries(original))try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}catch(ignored){}throw Error('Browser storage is full or unavailable. Import was not completed.');}}
function dkTransfer(){
 dkShow();const root=document.getElementById('dk-root');root.replaceChildren();const header=dkEl('header','dk-header');header.append(dkEl('h2','','Take your workspace with you'),dkBtn('Close ✕',dkClose));root.append(header);const body=dkEl('div','dk-transfer');
 body.append(dkEl('p','','DevKit runs from local files. Notes, favorites, history and drafts live in this browser. Export them before changing browser, computer or file location.'));
 body.append(dkBtn('Export notes, favorites & drafts',()=>dkDownloadText(JSON.stringify(dkBackup(),null,2),'devkit-backup.json','application/json'),'dk-btn primary'));
 body.append(dkEl('p','','Drafts, notes, history and backups are not encrypted. Use placeholders for passwords, tokens and private keys. Anyone with access to this browser profile or an exported backup may read its saved content. DevKit never runs the code you build; review and validate it before running it elsewhere.'));
 const terms=dkEl('p','dk-help','Free for personal and workplace use. Generated files are yours to use, including commercially. Selling DevKit or monetizing access to it or modified versions requires separate permission. ');const license=dkEl('a','','DevKit Free Use License');license.href='https://github.com/Araneus84/devkit/blob/main/LICENSE';license.target='_blank';license.rel='noopener noreferrer';terms.append(license);body.append(terms);
 const input=dkEl('input','dk-input');input.type='file';input.accept='.json,application/json';input.setAttribute('aria-label','Choose DevKit backup');const summary=dkEl('p');summary.setAttribute('role','status');let candidate=null;const restore=dkBtn('Import selected backup',()=>{try{dkRestore(candidate);location.reload();}catch(e){summary.textContent=e.message;}},'dk-btn');restore.disabled=true;
 input.onchange=async()=>{candidate=null;restore.disabled=true;try{const file=input.files[0];if(!file)return;if(file.size>5000000)throw Error('Use a backup smaller than 5 MB.');candidate=dkValidateBackup(JSON.parse(await file.text()));summary.textContent=Object.keys(candidate).length+' saved settings/data groups are ready to import. Matching local groups will be replaced; other local groups remain.';restore.disabled=false;}catch(e){summary.textContent=e.message;}};body.append(dkEl('h3','','Restore a backup'),input,summary,restore);
 body.append(dkEl('h3','','Run anywhere'),dkEl('p','','Windows, macOS or Linux: copy the entire DevKit folder and open index.html in a modern browser. No installation or server is needed. The dist/devkit.html file is the generated single-file edition. Commands still require their own tools on the computer where you run them.'));
 const bundledNotices=document.getElementById('dk-license-notices');if(bundledNotices)body.append(dkBtn('Read license and library notices offline',()=>{body.replaceChildren(dkBtn('← Back',dkTransfer));const text=dkEl('pre','',bundledNotices.content.textContent);text.style.whiteSpace='pre-wrap';body.append(text);}));
 root.append(body);
}
const dkHeaderButton=dkBtn('Backup / move',dkTransfer,'icon-btn builder-cta dk-backup');dkHeaderButton.title='Export and import notes, favorites and drafts';document.querySelector('.header')?.append(dkHeaderButton);
// Keep the primary action visible even when the original narrow-screen header hides builder buttons.
dkHeaderButton.classList.remove('builder-cta');
const dkInitialBuilder=renderBuilderPage;
renderBuilderPage=function(q){dkInitialBuilder(q);const header=document.querySelector('#main .page-header');if(header&&!document.getElementById('dk-library-note')){const note=dkEl('p','dk-help','Guided recipes cover common jobs. Every reference example also has Customize. All output stays local until you copy or download it.');note.id='dk-library-note';header.after(note);}};
