/* DevKit Ansible workbench. Kept inline in the delivered HTML for offline use. */
const AN_DOC = 'https://docs.ansible.com/projects/ansible/latest/';
const AN_MODULES = {
  package: {label:'Packages · generic OS', help:'Uses the host package manager. Package names still differ between distributions. Use apt/dnf for manager-specific options.', fields:{name:['list','nginx\ncurl','Package names (one per line)'],state:['present|absent|latest','present','Desired state']}},
  apt: {label:'Packages · Debian / Ubuntu', help:'Debian-family hosts. Cache refresh is separate from upgrading packages; cache_valid_time avoids refreshing on every run.', fields:{name:['list','nginx\ncurl','Package names (one per line)'],state:['present|absent|latest','present','Desired state'],update_cache:['boolean',true,'Refresh package index'],cache_valid_time:['number',3600,'Cache lifetime (seconds)']}},
  dnf: {label:'Packages · Fedora / RHEL', help:'Use the DNF module for hosts with DNF and its required Python bindings. Generic package does not translate names such as apache2 to httpd.', fields:{name:['list','httpd\ncurl','Package names (one per line)'],state:['present|absent|latest','present','Desired state'],update_cache:['boolean',true,'Refresh metadata']}},
  service: {label:'Service', help:'started is idempotent. restarted requests a restart every time; use it in a handler notified by configuration changes.',fields:{name:['text','nginx','Service name'],state:['started|stopped|restarted|reloaded','started','State'],enabled:['boolean',true,'Start at boot']}},
  systemd_service: {label:'Systemd service',help:'For systemd hosts; daemon_reload rereads unit files. Notify a restart handler after deploying a changed unit.',fields:{name:['text','nginx','Unit name'],state:['started|stopped|restarted|reloaded','started','State'],enabled:['boolean',true,'Enable at boot'],daemon_reload:['boolean',false,'Reload unit definitions']}},
  copy: {label:'Copy a file',help:'src is a file on the control node by default. dest is on the managed host. Parent directories must already exist.',fields:{src:['text','files/app.conf','Local source'],dest:['text','/etc/app.conf','Remote destination'],owner:['text','root','Owner'],group:['text','root','Group'],mode:['text','0644','Mode (kept as a string)']}},
  template: {label:'Render Jinja2 template',help:'Renders a local .j2 file using Ansible variables. Add notify to reload/restart a service when the destination changes.',fields:{src:['text','templates/app.conf.j2','Local template'],dest:['text','/etc/app.conf','Remote destination'],owner:['text','root','Owner'],group:['text','root','Group'],mode:['text','0644','Mode (kept as a string)']}},
  file: {label:'Directory / file attributes',help:'directory creates a directory. file manages an existing file; touch creates/touches one. absent removes the target.',fields:{path:['text','/opt/app','Remote path'],state:['directory|file|touch|absent','directory','State'],owner:['text','root','Owner'],group:['text','root','Group'],mode:['text','0755','Mode (kept as a string)']}},
  user: {label:'User account',help:'append: true keeps existing supplementary groups. groups must exist on the host. Passwords require the OS-appropriate password hash.',fields:{name:['text','deploy','Username'],state:['present|absent','present','State'],shell:['text','/bin/bash','Login shell'],create_home:['boolean',true,'Create home'],groups:['list','','Supplementary groups (optional)'],append:['boolean',true,'Keep other groups']}},
  group: {label:'Unix group',help:'Create groups before assigning users to them.',fields:{name:['text','app','Group name'],state:['present|absent','present','State']}},
  lineinfile: {label:'Manage one line',help:'regexp should match both the old and intended line for repeatability. Use template when managing the whole file.',fields:{path:['text','/etc/app.conf','Remote file'],regexp:['text','^port=','Regex'],line:['text','port=8080','Replacement line'],create:['boolean',false,'Create if missing']}},
  command: {label:'Command (no shell)',help:'argv avoids shell quoting ambiguity. Pipes and redirects are not interpreted. For changes, set creates/removes or a meaningful changed_when.',fields:{argv:['list','/usr/bin/id\n-u','Arguments (one per line)'],creates:['text','','Skip if path exists (optional)'],chdir:['text','','Working directory (optional)']}},
  shell: {label:'Shell command',help:'Use only when shell features are needed. Quote untrusted variables with the Jinja quote filter. Use creates or changed_when for repeatability.',fields:{cmd:['multiline','set -o pipefail\ncat /var/log/app.log | tail -n 20','Shell script'],executable:['text','/bin/bash','Shell executable'],creates:['text','','Skip if path exists (optional)']}},
  git: {label:'Git checkout',help:'Requires Git on the target and access to the repository. Pin version to an intended tag or commit for reproducible deployment.',fields:{repo:['text','https://github.com/example/app.git','Repository URL'],dest:['text','/opt/app','Checkout directory'],version:['text','main','Branch, tag, or commit'],update:['boolean',true,'Update existing checkout']}},
  debug: {label:'Debug message',help:'Use msg for a message; use var in advanced parameters to inspect a variable (do not combine var and msg).',fields:{msg:['multiline','Hello from {{ inventory_hostname }}','Message']}},
  uri: {label:'HTTP health check',help:'Runs from the managed host unless delegate_to: localhost is set. Combine register and until for retries.',fields:{url:['text','http://127.0.0.1:8080/health','URL'],method:['GET|POST|PUT|DELETE|HEAD','GET','Method'],status_code:['number',200,'Expected status'],return_content:['boolean',false,'Return response body']}},
  get_url: {label:'Download file',help:'Downloads to the managed host. Set checksum to a trusted sha256 digest when available.',fields:{url:['text','https://example.com/app.tar.gz','URL'],dest:['text','/tmp/app.tar.gz','Destination'],mode:['text','0644','Mode'],checksum:['text','','Checksum (optional: sha256:...)']}},
  ping: {label:'Ansible connectivity',help:'Tests Ansible connectivity and a usable Python interpreter on POSIX hosts. This is not an ICMP ping.',fields:{}},
  custom: {label:'Other module / collection',help:'Enter a fully qualified module name and YAML parameters. Install its collection on the control node first.',fields:{}}
};

const AN_SECTIONS = [];
function anSection(id,title,items) { AN_SECTIONS.push({id:'an-deep-'+id,title,color:'#ee6666',cmds:items.map(([cmd,desc,platform])=>({cmd,desc,platform:platform||'Ansible reference'}))}); }
anSection('start','Start here · concepts & documentation',[
 ['ansible --version','Shows ansible-core version, Python, module paths and active configuration. The ansible distribution includes collections; ansible-core supplies the engine and builtin plugins.'],
 ['ansible-doc -l\nansible-doc ansible.builtin.apt\nansible-doc -s ansible.builtin.template','Local manual: list installed modules, read parameters/returns/examples, or print a task skeleton. Use docs matching your installed version.'],
 ['ansible-config dump --only-changed\nansible-config view','Inspect effective configuration overrides and the configuration file in use.'],
 ['ansible-galaxy collection list\nansible-galaxy collection install -r requirements.yml','Collections bundle modules, plugins and roles. Fully qualified names such as ansible.builtin.copy make the source explicit.'],
 ['# Control node → inventory → playbook → play → tasks → modules\n# A handler is a task triggered by a change.\n# A role groups related tasks, defaults, handlers and files.','A play targets a host pattern. Each task invokes one module. Modules describe desired state; idempotent tasks report no change when that state already exists. Windows users commonly run the control node in WSL/Linux; examples here target POSIX hosts.']
]);
anSection('yaml','YAML · indentation, types & file shapes',[
 ['---\n- name: Show a message\n  hosts: webservers\n  gather_facts: false\n  tasks:\n    - name: Say hello\n      ansible.builtin.debug:\n        msg: "Hello from {{ inventory_hostname }}"','Complete playbook (site.yml). The document is a list of plays; tasks is a list within a play. Use spaces, never tabs. Two spaces per level is a consistent convention.','Complete playbook'],
 ['---\n- name: Install required tools\n  ansible.builtin.package:\n    name:\n      - git\n      - curl\n    state: present','Task file (roles/common/tasks/main.yml), not a standalone playbook: starts with tasks and has no hosts key. Include it from a play or role.','Task file'],
 ['---\napp_port: 8080\napp_enabled: true\nfile_mode: "0644"\napp_name: "yes"\napp_url: "https://example.com:8443"\npackages:\n  - nginx\n  - curl\nconfig:\n  owner: root\n  retries: 3','Variables file is a mapping. Quote permission modes and strings that resemble booleans or numbers. Use true/false for booleans. A colon followed by a space or a comment marker in a value needs quoting.','Variables file'],
 ['---\napp_name: demo\nmessage: "{{ app_name }} is ready"\nconfig_text: |\n  port=8080\n  enabled=true\nlong_message: >-\n  This text is folded\n  into one line.','Quote a value beginning with {{ }}. The literal block | preserves line breaks; > folds them; the minus removes the final newline. Keep child lines indented.','Variables file'],
 ['# Wrong: module parameters alongside the module\n# Right: parameters nested beneath its name\n- name: Ensure a directory exists\n  ansible.builtin.file:\n    path: /opt/app\n    state: directory\n    mode: "0755"\n  become: true\n  tags:\n    - setup','Task keywords (become, when, loop, register, notify, tags) align with the module name. Module parameters (path, state, mode) sit one level deeper. Avoid duplicate mapping keys.','Task file']
]);
anSection('project','Project layout · inventory & roles',[
 ['ansible-project/\n├── ansible.cfg\n├── site.yml\n├── requirements.yml\n├── inventories/\n│   └── lab/\n│       ├── hosts.yml\n│       └── group_vars/\n│           └── webservers.yml\n└── roles/\n    └── web/\n        ├── defaults/main.yml\n        ├── tasks/main.yml\n        ├── handlers/main.yml\n        ├── templates/app.conf.j2\n        └── files/banner.txt','Example folder tree (not YAML). Keep environment inventory and group variables together. Role defaults are easy to override; role vars have higher precedence. Files are copied as-is; templates are rendered.','Folder tree'],
 ['[defaults]\ninventory = inventories/lab/hosts.yml\nroles_path = ./roles\n\n[privilege_escalation]\nbecome_ask_pass = True','ansible.cfg is INI, not YAML. This example prompts for privilege escalation credentials when become is used. Run from the project directory and inspect the active file with ansible --version.','ansible.cfg'],
 ['---\nall:\n  children:\n    webservers:\n      hosts:\n        web01:\n          ansible_host: 192.0.2.10\n        web02:\n          ansible_host: 192.0.2.11\n      vars:\n        ansible_user: deploy\n        ansible_python_interpreter: /usr/bin/python3','inventories/lab/hosts.yml. web01 is an inventory alias; ansible_host is its address. Replace documentation IPs with your hosts. Do not store plaintext passwords here.','Inventory file'],
 ['---\nweb_packages:\n  - nginx\n  - curl\nweb_service: nginx\napp_port: 8080','inventories/lab/group_vars/webservers.yml. The filename matches the group and values become available to its hosts. host_vars/web01.yml can hold host-specific values. Extra vars (-e) override ordinary play and inventory variables.','Variables file'],
 ['---\n- name: Configure web hosts\n  hosts: webservers\n  become: true\n  roles:\n    - role: web','site.yml invokes roles/web. Ansible loads the role tasks/main.yml; handlers/main.yml and defaults/main.yml are separate mappings/lists appropriate to their file type.','Complete playbook'],
 ['---\ncollections:\n  - name: community.general\n  - name: ansible.posix','requirements.yml for collections. Install with ansible-galaxy collection install -r requirements.yml. Add version constraints matching versions you have tested.','Collection requirements']
]);
const AN_STARTER = {name:'Configure web servers',hosts:'webservers',become:true,gather_facts:true,vars:{web_packages:['nginx','curl'],web_service:'nginx'},tasks:[
 {name:'Install web packages','ansible.builtin.apt':{name:'{{ web_packages }}',state:'present',update_cache:true,cache_valid_time:3600},when:"ansible_facts['os_family'] == 'Debian'",tags:['packages']},
 {name:'Create application directory','ansible.builtin.file':{path:'/opt/app',state:'directory',owner:'root',group:'root',mode:'0755'}},
 {name:'Write application settings','ansible.builtin.copy':{dest:'/opt/app/settings.conf',content:'environment=lab\n',owner:'root',group:'root',mode:'0644'},notify:'Restart web service'},
 {name:'Start and enable web service','ansible.builtin.service':{name:'{{ web_service }}',state:'started',enabled:true}}
],handlers:[{name:'Restart web service','ansible.builtin.service':{name:'{{ web_service }}',state:'restarted'}}]};
anSection('complete','Complete playbook · packages, files & handlers',[
 ['---\n'+jsyaml.dump([AN_STARTER],{lineWidth:-1,noRefs:true}),'site.yml: Debian/Ubuntu example with variables, packages, a directory, managed content, service startup, and a change-triggered handler. For other distributions choose the proper package task and names. /opt/app/settings.conf is an illustrative application file, not an nginx configuration.','Complete playbook'],
 ['ansible-inventory -i inventories/lab/hosts.yml --graph\nansible -i inventories/lab/hosts.yml webservers -m ansible.builtin.ping\nansible-playbook -i inventories/lab/hosts.yml site.yml --syntax-check\nansible-playbook -i inventories/lab/hosts.yml site.yml --list-hosts\nansible-playbook -i inventories/lab/hosts.yml site.yml --check --diff --limit web01\nansible-playbook -i inventories/lab/hosts.yml site.yml --limit web01 --ask-become-pass','Workflow: inspect inventory, test connectivity, check syntax and targets, preview one host, then apply to that host. Check mode is a simulation: unsupported modules and registered-result dependencies limit coverage; tasks can explicitly override check mode. Diff can reveal file contents.']
]);
anSection('packages','Packages · generic, apt, dnf & pip',[
 ['- name: Install common tools\n  ansible.builtin.package:\n    name: [git, curl]\n    state: present\n  become: true','Generic package selects the host manager. present ensures installed; absent removes; latest updates when supported. Names are not translated across distros. Pass a list instead of looping separate installations.','Task file'],
 ['- name: Install Debian packages\n  ansible.builtin.apt:\n    name:\n      - nginx\n      - python3-venv\n    state: present\n    update_cache: true\n    cache_valid_time: 3600\n  become: true\n  when: ansible_facts[\'os_family\'] == "Debian"','apt: name accepts package names and manager-specific version expressions; update_cache refreshes indexes. This condition requires gathered facts.','Task file'],
 ['- name: Install RHEL packages\n  ansible.builtin.dnf:\n    name: [httpd, python3]\n    state: present\n    update_cache: true\n  become: true\n  when: ansible_facts[\'os_family\'] == "RedHat"','dnf is for DNF-based systems with suitable Python bindings. httpd is a package-name difference; package does not automatically translate apache2.','Task file'],
 ['- name: Install Python requirements into a virtual environment\n  ansible.builtin.pip:\n    requirements: /opt/app/requirements.txt\n    virtualenv: /opt/app/.venv\n    virtualenv_command: python3 -m venv','pip manages Python packages, not OS packages. Ensure Python venv support and the requirements file exist on the target; pin dependencies in requirements.txt.','Task file']
]);
anSection('modules','Module cookbook · inputs & examples',Object.entries(AN_MODULES).filter(([k])=>!['custom','package','apt','dnf'].includes(k)).map(([key,def])=>{
 const params={}; Object.entries(def.fields).forEach(([k,[type,value]])=>{if(value==='')return;params[k]=type==='list'?String(value).split('\n'):value;});
 const task={name:def.label,['ansible.builtin.'+key]:params}; if(key==='command'||key==='shell')task.changed_when=false;
 return [jsyaml.dump([task],{lineWidth:-1,noRefs:true}),def.help+' Parameters: '+Object.keys(def.fields).join(', ')+'. Read ansible-doc ansible.builtin.'+key+' for the full parameter and return-value manual.','Task file'];
}));
anSection('flow','Variables, loops, conditions & registered results',[
 ['- name: Create application users\n  ansible.builtin.user:\n    name: "{{ item.name }}"\n    shell: "{{ item.shell | default(\'/bin/bash\') }}"\n    state: present\n  loop:\n    - name: alice\n    - name: bob\n      shell: /bin/sh\n  loop_control:\n    label: "{{ item.name }}"\n  become: true','loop repeats a task for list items. item is the current value; dictionaries let each item carry multiple settings. default supplies a missing value.','Task file'],
 ['- name: Read application version\n  ansible.builtin.command:\n    argv: [/opt/app/bin/app, --version]\n  register: app_version\n  changed_when: false\n\n- name: Show captured output\n  ansible.builtin.debug:\n    var: app_version.stdout\n  when: app_version.rc == 0','register captures module results. command returns stdout, stderr and rc. changed_when: false is appropriate here because this command only reads state. when expressions do not use {{ }}.','Task file'],
 ['- name: Wait for application health\n  ansible.builtin.uri:\n    url: http://127.0.0.1:8080/health\n    status_code: 200\n  register: health\n  until: health.status | default(0) == 200\n  retries: 10\n  delay: 3','Retry an HTTP check until the expression succeeds. The URL is contacted from each managed host unless delegate_to changes the execution host.','Task file'],
 ['- name: Confirm required input\n  ansible.builtin.assert:\n    that:\n      - app_port is defined\n      - app_port | int > 0\n      - app_port | int < 65536\n    fail_msg: Supply a valid app_port','Use assert to fail with a useful message before dependent tasks. Use set_fact to create a host variable during execution.','Task file'],
 ['- name: Try deployment with failure handling\n  block:\n    - name: Run deployment tool\n      ansible.builtin.command:\n        argv: [/opt/app/deploy]\n      register: deployment\n      changed_when: "\'updated\' in deployment.stdout"\n  rescue:\n    - name: Report deployment failure\n      ansible.builtin.fail:\n        msg: Deployment failed; inspect logs before retrying\n  always:\n    - name: Report attempt completion\n      ansible.builtin.debug:\n        msg: Deployment attempt finished','block groups tasks; rescue handles task failures; always executes after either outcome. Unreachable hosts and invalid task definitions do not behave like normal task failures.','Task file']
]);
anSection('handlers','Handlers, templates & reusable task files',[
 ['---\n- name: Deploy application configuration\n  hosts: webservers\n  become: true\n  vars:\n    app_port: 8080\n  tasks:\n    - name: Render configuration\n      ansible.builtin.template:\n        src: templates/app.conf.j2\n        dest: /etc/app.conf\n        mode: "0644"\n      notify: Restart app\n  handlers:\n    - name: Restart app\n      ansible.builtin.service:\n        name: app\n        state: restarted','Complete playbook; requires an existing app service and the template below. notify queues the named handler only when a task changes. Repeated notifications normally run that handler once per flush, in handler definition order.','Complete playbook'],
 ['# templates/app.conf.j2\nport={{ app_port }}\nhost={{ inventory_hostname }}','Jinja2 template, not YAML. The template module renders it on the control node before transferring the result.','Template file'],
 ['- name: Run queued handlers before health checks\n  ansible.builtin.meta: flush_handlers','Flush pending handlers at this point instead of waiting for the normal end-of-section flush. Handler names must match notify exactly.','Task file'],
 ['- name: Import common tasks\n  ansible.builtin.import_tasks: common.yml\n\n- name: Include distribution-specific tasks\n  ansible.builtin.include_tasks: "{{ ansible_facts[\'os_family\'] | lower }}.yml"','import_tasks is static reuse, processed before execution; include_tasks is dynamic, evaluated as execution reaches it. Included files contain a task list, not a play with hosts.','Task file']
]);
anSection('secrets','Secrets, troubleshooting & validation',[
 ['ansible-vault create group_vars/all/vault.yml\nansible-vault edit group_vars/all/vault.yml\nansible-playbook site.yml --ask-vault-pass','Vault encrypts data at rest. Create the parent folders first. Keep the vault password outside source control. no_log: true suppresses sensitive task output, but does not encrypt files or prevent every possible disclosure.'],
 ['- name: Deploy secret configuration\n  ansible.builtin.template:\n    src: templates/credentials.j2\n    dest: /etc/app-credentials\n    owner: root\n    group: root\n    mode: "0600"\n  become: true\n  no_log: true\n  diff: false','Task snippet: supply the template and vault-backed variables. Restrict file permissions and suppress diff for sensitive content.','Task file'],
 ['ansible -i inventories/lab/hosts.yml webservers -m ansible.builtin.ping -vvv','UNREACHABLE: check inventory address, SSH username, key, routing and Python availability. Ansible ping is an application-level connectivity test, not ICMP.'],
 ['ansible-playbook -i inventories/lab/hosts.yml site.yml --ask-become-pass\nansible-doc ansible.builtin.package\nansible-galaxy collection list','Permission denied: check become and sudo permissions. Module not found: check the FQCN and installed collection. Undefined variable: inspect vars scope, spelling and whether facts were gathered.'],
 ['ansible-playbook -i inventories/lab/hosts.yml site.yml --syntax-check\nansible-lint site.yml\nansible-playbook -i inventories/lab/hosts.yml site.yml --check --diff','YAML parsing checks structure; syntax-check checks Ansible syntax; lint checks conventions; check mode predicts supported changes. None proves a deployment will succeed. ansible-lint is installed separately.']
]);

SHEETS.ansible.sections.unshift(...AN_SECTIONS);
SHEETS.ansible.meta = 'CLI + practical manual';
SHEETS.ansible.subtitle = 'Searchable examples, module reference & YAML workbench';
SHEETS.ansible.sections.find(s=>s.id==='an-adhoc').cmds.find(c=>c.cmd==='ansible webservers -a "uptime"').desc='Run uptime with the command module (no shell interpretation)';
SHEETS.ansible.sections.find(s=>s.id==='an-control').cmds[0]={cmd:'when: ansible_facts["os_family"] == "Debian"',desc:'Run only on Debian-family hosts; requires gathered facts'};
BUILDERS['ansible::YAML playbook workbench']={name:'YAML playbook workbench',description:'Build complete playbooks, tasks, handlers and inventory YAML. Edit, reorder, validate, copy and download.',args:[],flags:[]};

let anDraft = null;
let anSelected = 0;
let anList = 'tasks';
let anPreviousFocus = null;
let anErrors = {};
const anClone = obj => JSON.parse(JSON.stringify(obj));
const anDump = obj => jsyaml.dump(obj,{indent:2,lineWidth:-1,noRefs:true,quotingType:'"'});
const anMap = obj => obj !== null && typeof obj==='object' && !Array.isArray(obj);
const anParse = (text,label) => {try{return jsyaml.load(text,{schema:jsyaml.CORE_SCHEMA});}catch(e){throw Error(label+': '+e.message);}};
function anValidateTask(task,label) {
 if(!anMap(task))throw Error(label+' must be a YAML mapping.');
 const keywords=new Set(['name','when','loop','loop_control','register','notify','tags','become','become_user','become_method','delegate_to','delegate_facts','run_once','changed_when','failed_when','ignore_errors','ignore_unreachable','no_log','diff','check_mode','until','retries','delay','environment','vars','args','timeout','async','poll','throttle','connection','collections','any_errors_fatal']);
 if(task.block){if(!Array.isArray(task.block))throw Error(label+' block must be a task list.');for(const key of ['block','rescue','always'])if(task[key]){if(!Array.isArray(task[key]))throw Error(key+' must be a list.');task[key].forEach((t,i)=>anValidateTask(t,label+' '+key+' '+(i+1)));}return;}
 const modules=Object.keys(task).filter(k=>!keywords.has(k));
 if(modules.length!==1)throw Error(label+' needs exactly one module (prefer its fully qualified name).');
}
function anValidatePlay(play) {
 if(!anMap(play)||typeof play.hosts!=='string'||!play.hosts.trim())throw Error('A play needs a nonempty hosts pattern.');
 for(const k of ['tasks','handlers','pre_tasks','post_tasks'])if(play[k]!==undefined){if(!Array.isArray(play[k]))throw Error(k+' must be a list.');play[k].forEach((t,i)=>anValidateTask(t,k+' '+(i+1)));}
 if(play.vars!==undefined&&!anMap(play.vars))throw Error('vars must be a mapping.');
 for(const k of ['become','gather_facts'])if(play[k]!==undefined&&typeof play[k]!=='boolean')throw Error(k+' must be true or false.');
}
function anDefaultDraft(){return {version:1,play:anClone(AN_STARTER),inventory:'---\nall:\n  children:\n    webservers:\n      hosts:\n        web01:\n          ansible_host: 192.0.2.10\n      vars:\n        ansible_user: deploy\n'};}
function anSave(){try{localStorage.setItem('devkit_ansible_draft_v1',JSON.stringify(anDraft));document.getElementById('an-save-status').textContent='Draft saved in this browser';}catch(e){document.getElementById('an-save-status').textContent='Draft is in memory only; download it before closing';}}
function anNotice(message,error=false){const el=document.getElementById('an-notice');el.textContent=message;el.style.color=error?'var(--red)':'var(--green)';}
function anInput(id,label,value,type='text') {return `<label class="an-field">${escapeHTML(label)}<input id="${id}" type="${type}" value="${escapeHTML(String(value)).replace(/"/g,'&quot;')}" ${type==='number'?'min="0"':''}></label>`;}
function anOpen(){
 anPreviousFocus=document.activeElement;
 if(!anDraft){try{const saved=JSON.parse(localStorage.getItem('devkit_ansible_draft_v1'));if(saved?.version===1){anValidatePlay(saved.play);if(typeof saved.inventory!=='string')throw Error('Invalid inventory');anDraft=saved;}}catch(e){}if(!anDraft)anDraft=anDefaultDraft();}
 const dialog=document.getElementById('an-dialog');if(!dialog.open)dialog.showModal();anRender();document.getElementById('an-close').focus();
}
function anClose(){document.getElementById('an-dialog').close();anPreviousFocus?.focus();}
function anRender(){
 anErrors = {};
 const p=anDraft.play;
 document.getElementById('an-workspace').innerHTML=`
 <div class="an-settings">
 ${anInput('an-name','Play name',p.name||'')}${anInput('an-hosts','Hosts / group pattern',p.hosts)}
 <label class="an-check"><input id="an-become" type="checkbox" ${p.become?'checked':''}> Become (sudo)</label>
 <label class="an-check"><input id="an-facts" type="checkbox" ${p.gather_facts!==false?'checked':''}> Gather facts</label>
 <label class="an-field an-wide">Play variables · YAML mapping<textarea id="an-vars" spellcheck="false" rows="4">${escapeHTML(anDump(p.vars||{}))}</textarea></label>
 </div>
 <div class="an-columns"><section class="an-compose">
 <div class="an-toolbar"><button class="btn ${anList==='tasks'?'primary':''}" id="an-show-tasks">Tasks (${(p.tasks||[]).length})</button><button class="btn ${anList==='handlers'?'primary':''}" id="an-show-handlers">Handlers (${(p.handlers||[]).length})</button><button class="btn" id="an-add">+ Add ${anList==='tasks'?'task':'handler'}</button></div>
 <div id="an-task-list" class="an-task-list"></div><div id="an-editor"></div>
 </section><section class="an-output">
 <div class="an-toolbar"><strong>Generated YAML</strong><select id="an-output-kind" aria-label="Output file"><option value="playbook">site.yml · complete playbook</option><option value="tasks">tasks/main.yml · task list</option><option value="handlers">handlers/main.yml · handlers</option><option value="inventory">inventory.yml · inventory</option></select></div>
 <textarea id="an-preview" readonly spellcheck="false" aria-label="Generated YAML output"></textarea>
 <div class="an-toolbar"><button class="btn primary" id="an-copy">Copy YAML</button><button class="btn" id="an-download">Download .yml</button><span id="an-lines"></span></div>
 <p class="an-help">Generated with a YAML serializer. Preview is read-only; use the fields or Advanced YAML below to edit. Paths, groups and installed modules must match your environment.</p>
 <div id="an-commands"></div>
 </section></div>
 <details class="an-advanced"><summary>Advanced YAML · edit the full playbook or inventory</summary>
 <p class="an-help">Paste or edit a single-play playbook here, then apply. Nested parameters, loops, blocks and additional play keywords are preserved. Applying a full playbook replaces the current draft. This builder supports one play per draft.</p>
 <label class="an-field">Complete playbook<textarea id="an-raw" rows="12" spellcheck="false">${escapeHTML('---\n'+anDump([p]))}</textarea></label>
 <button class="btn" id="an-apply-raw">Apply playbook YAML</button>
 <label class="an-field">Inventory YAML<textarea id="an-inventory" rows="9" spellcheck="false">${escapeHTML(anDraft.inventory)}</textarea></label><button class="btn" id="an-apply-inventory">Apply inventory YAML</button>
 </details>`;
 for(const id of ['an-name','an-hosts','an-become','an-facts','an-vars'])document.getElementById(id).addEventListener('input',anUpdateSettings);
 document.getElementById('an-show-tasks').onclick=()=>{anList='tasks';anSelected=0;anRender();};
 document.getElementById('an-show-handlers').onclick=()=>{anList='handlers';anSelected=0;anRender();};
 document.getElementById('an-add').onclick=()=>{const list=p[anList]||(p[anList]=[]);list.push(anList==='handlers'?{name:'Restart service','ansible.builtin.service':{name:'nginx',state:'restarted'}}:{name:'New task','ansible.builtin.debug':{msg:'Hello'}});anSelected=list.length-1;anRender();anSave();};
 document.getElementById('an-output-kind').onchange=anRefresh;
 document.getElementById('an-copy').onclick=anCopy;
 document.getElementById('an-download').onclick=anDownload;
 document.getElementById('an-apply-raw').onclick=()=>{try{const plays=anParse(document.getElementById('an-raw').value,'Playbook');if(!Array.isArray(plays)||plays.length!==1)throw Error('Supply a YAML list containing exactly one play.');anValidatePlay(plays[0]);anDraft.play=plays[0];anSelected=0;anList='tasks';anRender();anSave();anNotice('Playbook applied.');}catch(e){anNotice(e.message,true);}};
 document.getElementById('an-apply-inventory').onclick=()=>{try{const value=anParse(document.getElementById('an-inventory').value,'Inventory');if(!anMap(value))throw Error('Inventory must be a mapping of groups.');anDraft.inventory='---\n'+anDump(value);anSave();anRefresh();anNotice('Inventory applied.');}catch(e){anNotice(e.message,true);}};
 anRenderTasks();anRefresh();
}
function anUpdateSettings(){
 try{const vars=anParse(document.getElementById('an-vars').value,'Variables')??{};if(!anMap(vars))throw Error('Play variables must be a YAML mapping.');const hosts=document.getElementById('an-hosts').value.trim();if(!hosts)throw Error('Enter a hosts / group pattern.');Object.assign(anDraft.play,{name:document.getElementById('an-name').value,hosts,become:document.getElementById('an-become').checked,gather_facts:document.getElementById('an-facts').checked,vars});delete anErrors.settings;anRefresh();anSave();}
 catch(e){anErrors.settings=e.message;anBlock(e.message);}
}
function anRenderTasks(){
 const list=anDraft.play[anList]||[];anSelected=Math.max(0,Math.min(anSelected,list.length-1));
 const target=document.getElementById('an-task-list');target.innerHTML='';
 list.forEach((task,index)=>{const row=document.createElement('div');row.className='an-task-row'+(index===anSelected?' selected':'');const select=document.createElement('button');select.className='an-task-select';select.textContent=(index+1)+'. '+(task.name||Object.keys(task)[0]);select.onclick=()=>{anSelected=index;anRenderTasks();};row.append(select);
 for(const [label,delta] of [['↑',-1],['↓',1],['×',0]]){const button=document.createElement('button');button.className='btn';button.textContent=label;button.setAttribute('aria-label',delta?'Move '+(task.name||'task')+(delta<0?' up':' down'):'Remove '+(task.name||'task'));button.disabled=delta!==0&&(index+delta<0||index+delta>=list.length);button.onclick=()=>{if(delta){[list[index],list[index+delta]]=[list[index+delta],list[index]];anSelected=index+delta;}else list.splice(index,1);anRender();anSave();};row.append(button);}target.append(row);});
 anRenderEditor();
}
function anRenderEditor(){
 for(const key of Object.keys(anErrors))if(key!=='settings')delete anErrors[key];
 const task=(anDraft.play[anList]||[])[anSelected];const editor=document.getElementById('an-editor');
 if(!task){editor.innerHTML='<p class="an-help">Add a '+(anList==='handlers'?'handler and notify it by its exact name from a task.':'task to begin.')+'</p>';return;}
 const moduleName=Object.keys(task).find(k=>k.includes('.'));
 const short=moduleName?.replace(/^ansible\.builtin\./,'');const known=AN_MODULES[short]&&short!=='custom'&&moduleName==='ansible.builtin.'+short;
 editor.innerHTML=`${anInput('an-task-name','Task / handler name',task.name||'')}
 <label class="an-field">Module preset (choosing one replaces module parameters)<select id="an-module">${Object.entries(AN_MODULES).map(([k,d])=>`<option value="${k}" ${(known?short:'custom')===k?'selected':''}>${escapeHTML(d.label)}</option>`).join('')}</select></label>
 <p id="an-module-help" class="an-help"></p><div id="an-params" class="an-settings"></div>
 <details><summary>Advanced task YAML · parameters, loop, when, register, notify, tags</summary><p class="an-help">Edit this single task as a mapping (no leading dash), then apply. Advanced parameters are preserved when editing named fields above.</p><textarea id="an-task-raw" class="an-code" rows="12" spellcheck="false" aria-label="Single task YAML">${escapeHTML(anDump(task))}</textarea><button id="an-apply-task" class="btn">Apply task YAML</button></details>
 <div class="an-settings" style="margin-top:12px">${anInput('an-when','When expression (optional)',typeof task.when==='string'?task.when:'')}${anInput('an-register','Register result (optional)',task.register||'')}${anInput('an-notify','Notify handler (one name; optional)',typeof task.notify==='string'?task.notify:'')}</div>
 <p class="an-help">For lists of conditions/handlers, loops, tags, retries or blocks use Advanced task YAML. A handler only runs when notified by a changed task.</p>`;
 document.getElementById('an-module-help').textContent=AN_MODULES[known?short:'custom'].help;
 document.getElementById('an-task-name').oninput=e=>{task.name=e.target.value;anRefresh();anSave();const selected=document.querySelector('.an-task-row.selected .an-task-select');if(selected)selected.textContent=(anSelected+1)+'. '+task.name;};
 document.getElementById('an-module').onchange=e=>{const key=e.target.value;if(key==='custom'){document.getElementById('an-task-raw').closest('details').open=true;return;}const params={};for(const [k,[type,value]] of Object.entries(AN_MODULES[key].fields)){if(value!=='')params[k]=type==='list'?String(value).split('\n'):value;}const replacement={name:task.name,['ansible.builtin.'+key]:params};for(const k of ['when','register','notify','tags','become','no_log','diff','loop','loop_control','delegate_to','changed_when'])if(k in task)replacement[k]=task[k];if(key==='command'||key==='shell')replacement.changed_when=false;anDraft.play[anList][anSelected]=replacement;anRenderEditor();anRefresh();anSave();};
 if(known){const params=task[moduleName];if(anMap(params))for(const [key,[type,defaultValue,label]] of Object.entries(AN_MODULES[short].fields)){
 const field=document.createElement('label');field.className='an-field';field.textContent=label;let input;const value=params[key];
 if(type.includes('|')){input=document.createElement('select');const choices=type.split('|');if(value!==undefined&&!choices.includes(String(value)))choices.push(String(value));for(const option of choices){const el=document.createElement('option');el.value=option;el.textContent=option;input.append(el);}input.value=value??defaultValue;}
 else if(type==='boolean'){input=document.createElement('input');input.type='checkbox';input.checked=value===true;}
 else if(type==='list'||type==='multiline'){input=document.createElement('textarea');input.rows=3;input.value=Array.isArray(value)?value.join('\n'):value??'';}
 else {input=document.createElement('input');input.type=type==='number'?'number':'text';input.value=value??'';}
 input.setAttribute('data-param',key);input.setAttribute('aria-label',label);input.spellcheck=false;
 input.addEventListener('input',()=>{delete anErrors[key];if(type==='boolean')params[key]=input.checked;else if(type==='number'){if(!input.value.trim()||!Number.isFinite(Number(input.value))||Number(input.value)<0){anErrors[key]=label+' must be a nonnegative number.';anBlock(anErrors[key]);return;}params[key]=Number(input.value);}else if(!input.value.trim())delete params[key];else if(type==='list')params[key]=input.value.trim().startsWith('{{')?input.value.trim():input.value.split('\n').map(v=>v.trim()).filter(Boolean);else params[key]=input.value;anRefresh();anSave();});field.append(input);document.getElementById('an-params').append(field);
 }}
 for(const [id,key] of [['an-when','when'],['an-register','register'],['an-notify','notify']]){
 const el=document.getElementById(id);if(Array.isArray(task[key])){el.disabled=true;el.placeholder='List set in Advanced task YAML';}
 el.oninput=()=>{delete anErrors[key];if(key==='register'&&el.value&&!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(el.value)){anErrors[key]='Register must be a variable name: letters, digits and underscores; no leading digit.';anBlock(anErrors[key]);return;}if(el.value)task[key]=el.value;else delete task[key];anRefresh();anSave();};}
 document.getElementById('an-apply-task').onclick=()=>{try{const value=anParse(document.getElementById('an-task-raw').value,'Task');anValidateTask(value,'Task');anDraft.play[anList][anSelected]=value;anRenderTasks();anRefresh();anSave();anNotice('Task applied.');}catch(e){anNotice(e.message,true);}};
}
function anBlock(message){document.getElementById('an-copy').disabled=true;document.getElementById('an-download').disabled=true;anNotice(message+' Preview shows the last valid draft.',true);}
function anOutput(){const kind=document.getElementById('an-output-kind').value;return kind==='inventory'?anDraft.inventory:'---\n'+anDump(kind==='playbook'?[anDraft.play]:(anDraft.play[kind]||[]));}
function anRefresh(){
 if(Object.keys(anErrors).length){anBlock(Object.values(anErrors).join('\n'));return;}
 try{anValidatePlay(anDraft.play);const output=anOutput();document.getElementById('an-preview').value=output;document.getElementById('an-lines').textContent=output.trimEnd().split('\n').length+' lines';document.getElementById('an-copy').disabled=false;document.getElementById('an-download').disabled=false;
 const raw=document.getElementById('an-raw');if(raw&&document.activeElement!==raw)raw.value='---\n'+anDump([anDraft.play]);
 const taskRaw=document.getElementById('an-task-raw');if(taskRaw&&document.activeElement!==taskRaw)taskRaw.value=anDump(anDraft.play[anList][anSelected]);
 const names=new Set((anDraft.play.handlers||[]).map(t=>t.name));const missing=[];for(const task of anDraft.play.tasks||[])for(const name of task.notify===undefined?[]:Array.isArray(task.notify)?task.notify:[task.notify])if(!names.has(name))missing.push(name);
 anNotice(missing.length?'Review notify: no matching handler name for '+missing.join(', ')+'. A handler listen topic or imported handler may resolve this.':'YAML generated · Ansible execution is not performed here.');
 const cmd=document.getElementById('an-commands');cmd.innerHTML='<strong>Validate on your control node</strong><pre>ansible-playbook -i inventory.yml site.yml --syntax-check\nansible-playbook -i inventory.yml site.yml --list-hosts\nansible-playbook -i inventory.yml site.yml --check --diff</pre><p class="an-help">Save both site.yml and inventory.yml. Check mode depends on module support; review the selected hosts before applying.</p>';
 }catch(e){anBlock(e.message);}
}
async function anCopy(){try{const text=anOutput();if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);else{const area=document.getElementById('an-preview');area.focus();area.select();if(!document.execCommand('copy'))throw Error('Clipboard unavailable');}anNotice('YAML copied with indentation and line breaks.');}catch(e){const area=document.getElementById('an-preview');area.focus();area.select();anNotice('Clipboard unavailable. Output selected: press Ctrl+C to copy.',true);}}
function anDownload(){const kind=document.getElementById('an-output-kind').value;const names={playbook:'site.yml',tasks:'tasks.yml',handlers:'handlers.yml',inventory:'inventory.yml'};const url=URL.createObjectURL(new Blob([anOutput()],{type:'application/yaml;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=names[kind];link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);anNotice(names[kind]+' download requested.');}

document.body.insertAdjacentHTML('beforeend',`<dialog id="an-dialog" aria-labelledby="an-title"><div class="an-shell"><header class="an-header"><div><span class="an-eyebrow">ANSIBLE WORKBENCH</span><h2 id="an-title">Build a playbook</h2><p class="an-help">Tasks → modules → properly formatted YAML. Everything stays in this browser.</p></div><button class="btn" id="an-close" aria-label="Close YAML builder">Close ✕</button></header><div class="an-toolbar an-topbar"><button class="btn" id="an-starter">Load web-server example</button><button class="btn" id="an-empty">New blank playbook</button><span id="an-save-status">Draft restores in this browser · no secrets</span></div><p id="an-notice" role="status" aria-live="polite"></p><div id="an-workspace"></div></div></dialog>`);
document.getElementById('an-close').onclick=anClose;
document.getElementById('an-dialog').addEventListener('cancel',e=>{e.preventDefault();anClose();});
document.getElementById('an-starter').onclick=()=>{if(!confirm('Replace the current draft with the web-server example?'))return;anDraft=anDefaultDraft();anSelected=0;anList='tasks';anRender();anSave();};
document.getElementById('an-empty').onclick=()=>{if(!confirm('Replace the current draft with a blank playbook?'))return;anDraft={version:1,play:{name:'My playbook',hosts:'webservers',become:false,gather_facts:true,tasks:[]},inventory:anDraft.inventory};anSelected=0;anList='tasks';anRender();anSave();};
const anOriginalOpenBuilder=openBuilder;
openBuilder=function(key){if(key==='ansible::YAML playbook workbench')anOpen();else anOriginalOpenBuilder(key);};
const anOriginalRenderSheet=renderSheet;
renderSheet=function(key,q){anOriginalRenderSheet(key,q);if(key==='ansible'){
 const header=document.querySelector('#main .page-header');if(header)header.insertAdjacentHTML('afterend',`<div class="an-banner"><div><span class="an-eyebrow">FROM REFERENCE TO REAL FILES</span><h2>Ansible, beyond one-liners.</h2><p>Learn the structure, find a module, assemble your playbook.</p><div class="an-links"><a href="${AN_DOC}reference_appendices/YAMLSyntax.html" target="_blank" rel="noopener">YAML syntax ↗</a><a href="${AN_DOC}playbook_guide/index.html" target="_blank" rel="noopener">Playbook guide ↗</a><a href="${AN_DOC}collections/ansible/builtin/index.html" target="_blank" rel="noopener">Builtin modules ↗</a><a href="${AN_DOC}playbook_guide/playbooks_reuse_roles.html" target="_blank" rel="noopener">Roles ↗</a><a href="${AN_DOC}playbook_guide/playbooks_handlers.html" target="_blank" rel="noopener">Handlers ↗</a><a href="${AN_DOC}inventory_guide/intro_inventory.html" target="_blank" rel="noopener">Inventory ↗</a></div></div><button class="btn primary" onclick="anOpen()">Open YAML workbench →</button></div>`);
}};
