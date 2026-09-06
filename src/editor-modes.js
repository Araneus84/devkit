/* One presentation preference for every connected editor; document state is never copied or converted. */
const EM_STORAGE='devkit:editor-mode-v1';
const EM_MODES={
 guided:{label:'Guided',description:'More room for blocks, next-step choices and explanations.'},
 standard:{label:'Standard',description:'A balanced view of blocks and editable code.'},
 expert:{label:'Expert',description:'More room for code with quieter block guidance.'}
};
let emMode=Object.hasOwn(EM_MODES,localStorage.getItem(EM_STORAGE))?localStorage.getItem(EM_STORAGE):'standard';
function emApply(){
 const viewports=typeof CE_EDITORS==='undefined'?[]:[...CE_EDITORS.values()].filter(item=>item.el.isConnected).map(item=>({item,scroll:item.cm.getScrollInfo()}));
 document.documentElement.dataset.editorMode=emMode;
 for(const root of document.querySelectorAll('#dk-root,#ab-dialog'))root.dataset.editorMode=emMode;
 for(const picker of document.querySelectorAll('.em-mode-picker')){
  for(const button of picker.querySelectorAll('button[data-mode]'))button.setAttribute('aria-pressed',String(button.dataset.mode===emMode));
  const status=picker.querySelector('.em-mode-description');if(status)status.textContent=EM_MODES[emMode].description;
 }
 requestAnimationFrame(()=>{for(const {item,scroll} of viewports)if(item.el.isConnected){item.cm.refresh();item.cm.scrollTo(scroll.left,scroll.top);}});
}
function emSetMode(mode){if(!Object.hasOwn(EM_MODES,mode))return false;emMode=mode;localStorage.setItem(EM_STORAGE,mode);emApply();return true;}
function emPicker(compact=false){
 const picker=dkEl('div','em-mode-picker'+(compact?' compact':''));picker.setAttribute('role','group');picker.setAttribute('aria-label','Editing experience');
 const label=dkEl('span','em-mode-label','Editor view');picker.append(label);
 for(const [id,def] of Object.entries(EM_MODES)){const button=dkBtn(def.label,()=>emSetMode(id),'em-mode-button');button.dataset.mode=id;button.title=def.description;picker.append(button);}
 const status=dkEl('span','em-mode-description');status.setAttribute('aria-live','polite');picker.append(status);return picker;
}
function emMount(host,compact=false){if(!host||host.querySelector(':scope > .em-mode-picker'))return;host.append(emPicker(compact));emApply();}

// Deep, Python, CI/CD and project-file editors all pass through this toolbar hook.
const emWorkspaceToolbar=ewEditorToolbar;ewEditorToolbar=function(){emWorkspaceToolbar();emMount(document.querySelector('#dk-root .dk-toolbar'));};
// Quick recipe and command/file builders use the same preference and document surface.
const emQuickRender=dkRender;dkRender=function(){emQuickRender();emMount(document.querySelector('#dk-root .dk-toolbar'));};
// Ansible has a specialized document tree but shares the same mode preference.
const emAnsibleRender=abRender;abRender=function(){emAnsibleRender();emMount(document.querySelector('#ab-dialog .ab-topbar'));};
// A command modal can mount CodeMirror without either workspace toolbar.
const emCodeAttach=ceAttach;ceAttach=function(el){emCodeAttach(el);const item=CE_EDITORS.get(el),scope=el.closest('#dk-root,#ab-dialog');if(item&&!scope?.querySelector('.em-mode-picker'))emMount(item.row,true);};
emApply();ceScan();
