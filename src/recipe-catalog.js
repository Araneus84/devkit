/* Recipes are data + pure generators. Add a recipe here without changing the UI. */
const DK_RECIPES={};
const dkF=(label,type='text',value='',hint='',extra={})=>({label,type,value,hint,...extra});
const dkP=(key,label,hint,fields={},required=false)=>({key,label,hint,fields,required});
function dkRecipe(sheet,id,title,description,parts,generate,filename='commands.txt',check='',extra={}){const recipe={id:sheet+':'+id,sheet,title,description,parts,generate,filename,check,...extra};DK_RECIPES[recipe.id]=recipe;return recipe;}
const dkQ=value=>"'"+String(value).replace(/'/g,"'\\''")+"'";
const dkPS=value=>"'"+String(value).replace(/'/g,"''")+"'";
const dkJSON=value=>JSON.stringify(value);
const dkPairs=value=>Object.fromEntries((value||[]).map(item=>[item.key,item.value]));
const dkYaml=value=>'---\n'+jsyaml.dump(value,{indent:2,lineWidth:-1,noRefs:true,quotingType:'"'});
const dkToken=(label,value,hint='')=>dkF(label,'token',value,hint);
const dkPort=(label,value)=>dkF(label,'number',value,'TCP/UDP port.',{min:1,max:65535});
const dkText=(label,value='',hint='')=>dkF(label,'text',value,hint);
const dkList=(label,value=[],hint='One item per line.')=>dkF(label,'list',value,hint);
const dkChoice=(label,value,choices,hint='')=>dkF(label,'choice',value,hint,{choices});

dkRecipe('docker','compose','Compose application','Build a service with an image, ports, environment and persistent storage.',[
 dkP('service','Service & image','A Compose service describes one containerized component.',{name:dkToken('Service name','web'),image:dkToken('Container image','nginx:stable')},true),
 dkP('ports','Publish a port','Connect a host port to the container port.',{host:dkPort('Host port',8080),container:dkPort('Container port',80)}),
 dkP('environment','Environment variables','Values passed into the container.',{items:dkF('Variables','pairs',[{key:'APP_ENV',value:'development'}])}),
 dkP('storage','Persistent volume','A named volume retains data outside the container lifecycle.',{name:dkToken('Volume name','app_data'),target:dkText('Container mount path','/data')}),
 dkP('restart','Restart policy','Choose how Docker restarts the service.',{policy:dkChoice('Policy','unless-stopped',['no','always','on-failure','unless-stopped'])})
],p=>{const s={image:p.service.image},doc={services:{[p.service.name]:s}};for(const [key,v] of Object.entries(p)){if(key==='ports')s.ports=[v.host+':'+v.container];if(key==='environment')s.environment=dkPairs(v.items);if(key==='storage'){s.volumes=[v.name+':'+v.target];doc.volumes={[v.name]:{}};}if(key==='restart')s.restart=v.policy;}return dkYaml(doc);},'compose.yml','docker compose -f compose.yml config');
dkRecipe('k8s','deployment','Deployment & Service','Create matching workload labels, container settings and an optional Service.',[
 dkP('workload','Workload identity','The name also supplies the Pod label and Deployment selector.',{name:dkF('Name','dns','web'),namespace:dkF('Namespace','dns','default'),image:dkToken('Image','nginx:stable')},true),
 dkP('replicas','Replica count','How many Pods should be kept running?',{count:dkF('Replicas','number',2,'',{min:0,max:10000})}),
 dkP('port','Container port','Declare the port the application listens on.',{port:dkPort('Container port',80)}),
 dkP('environment','Environment variables','Non-secret key/value pairs for the application.',{items:dkF('Variables','pairs',[{key:'APP_ENV',value:'development'}])}),
 dkP('resources','Resource requests and limits','Scheduler requests and per-container limits.',{cpuRequest:dkToken('CPU request','100m'),memoryRequest:dkToken('Memory request','64Mi'),cpuLimit:dkToken('CPU limit','500m'),memoryLimit:dkToken('Memory limit','256Mi')}),
 dkP('service','ClusterIP Service','Expose the selected Pods inside the cluster.',{port:dkPort('Service port',80),target:dkPort('Target container port',80)})
],p=>{const w=p.workload,labels={app:w.name},container={name:w.name,image:w.image};const doc={apiVersion:'apps/v1',kind:'Deployment',metadata:{name:w.name,namespace:w.namespace},spec:{selector:{matchLabels:labels},template:{metadata:{labels},spec:{containers:[container]}}}};
 for(const [key,v] of Object.entries(p)){if(key==='replicas')doc.spec.replicas=v.count;if(key==='port')container.ports=[{containerPort:v.port}];if(key==='environment')container.env=v.items.map(e=>({name:e.key,value:e.value}));if(key==='resources')container.resources={requests:{cpu:v.cpuRequest,memory:v.memoryRequest},limits:{cpu:v.cpuLimit,memory:v.memoryLimit}};}
 return dkYaml(doc)+(p.service?dkYaml({apiVersion:'v1',kind:'Service',metadata:{name:w.name,namespace:w.namespace},spec:{type:'ClusterIP',selector:labels,ports:[{port:p.service.port,targetPort:p.service.target}]}}):'');},'deployment.yml','kubectl apply --dry-run=client -f deployment.yml');
dkRecipe('terraform','configuration','Terraform configuration','Create a portable .tf.json file with inputs, provider configuration and resource blocks.',[
 dkP('terraform','Terraform requirements','Choose a tested CLI version constraint.',{version:dkText('Required version','>= 1.5.0')},true),
 dkP('variables','Input variables','String defaults available as var.NAME.',{items:dkF('Variables','pairs',[{key:'region',value:'us-east-1'}])}),
 dkP('provider','Provider requirement & configuration','Install a provider and supply its region.',{name:dkToken('Local provider name','aws'),source:dkToken('Provider source','hashicorp/aws'),region:dkText('Region','us-east-1')}),
 dkP('resource','Resource declaration','Supply the resource type and string arguments from its provider documentation.',{type:dkToken('Resource type','aws_s3_bucket'),name:dkToken('Local resource name','example'),items:dkF('String arguments','pairs',[{key:'bucket',value:'replace-with-a-unique-bucket-name'}])}),
 dkP('output','Output value','An HCL expression such as aws_s3_bucket.example.id.',{name:dkToken('Output name','bucket_id'),expression:dkText('Expression','aws_s3_bucket.example.id')})
],p=>{const d={terraform:{required_version:p.terraform.version}};for(const [key,v] of Object.entries(p)){if(key==='variables')d.variable=Object.fromEntries(v.items.map(x=>[x.key,{type:'string',default:x.value}]));if(key==='provider'){d.terraform.required_providers={[v.name]:{source:v.source}};d.provider={[v.name]:{region:v.region}};}if(key==='resource')d.resource={[v.type]:{[v.name]:dkPairs(v.items)}};if(key==='output')d.output={[v.name]:{value:'${'+v.expression+'}'}};}return JSON.stringify(d,null,2)+'\n';},'main.tf.json','terraform init\nterraform validate\nterraform plan');
dkRecipe('npm','package','package.json','Describe a Node project and add scripts or versioned dependencies.',[
 dkP('project','Project details','The package name and entry file.',{name:dkF('Package name','package','my-helper'),version:dkText('Version','1.0.0'),main:dkText('Entry file','index.js'),private:dkF('Private project','boolean',true)},true),
 dkP('scripts','npm scripts','Commands available through npm run NAME.',{items:dkF('Scripts','pairs',[{key:'start',value:'node index.js'},{key:'test',value:'node --test'}])}),
 dkP('dependencies','Runtime dependencies','Pin or constrain versions appropriate to your project.',{items:dkF('Dependencies','pairs',[{key:'example-package',value:'1.0.0'}])}),
 dkP('engines','Node requirement','State the supported Node range.',{node:dkText('Node version range','>=20')})
],p=>{const d={...p.project};for(const [k,v] of Object.entries(p)){if(['scripts','dependencies'].includes(k))d[k]=dkPairs(v.items);if(k==='engines')d.engines={node:v.node};}return JSON.stringify(d,null,2)+'\n';},'package.json','node -e "JSON.parse(require(\'fs\').readFileSync(\'package.json\', \'utf8\'))"');
dkRecipe('sql','select','SELECT query','Build common clauses in their valid SQL order. Identifiers and expressions remain separate.',[
 dkP('source','Source & columns','Select from one table. Columns can include aggregate expressions.',{table:dkF('Table','identifier','users'),columns:dkList('Columns or expressions',['id','name'])},true),
 dkP('where','Filter rows','A SQL expression; use parameters in application code.',{expression:dkText('Condition','active = 1')}),
 dkP('group','Group rows','Columns or expressions to group by.',{columns:dkList('Group by',['id','name'])}),
 dkP('having','Filter groups','Use with grouped or aggregate queries.',{expression:dkText('Condition','COUNT(*) > 1')}),
 dkP('sort','Order results','Choose a column and direction.',{column:dkF('Column','identifier','name'),direction:dkChoice('Direction','ASC',['ASC','DESC'])}),
 dkP('limit','Limit results','SQLite/PostgreSQL-style limit and offset.',{limit:dkF('Maximum rows','number',100,'',{min:1}),offset:dkF('Skip rows','number',0,'',{min:0})})
],p=>'SELECT '+p.source.columns.join(', ')+'\nFROM '+p.source.table+(p.where?'\nWHERE '+p.where.expression:'')+(p.group?'\nGROUP BY '+p.group.columns.join(', '):'')+(p.having?'\nHAVING '+p.having.expression:'')+(p.sort?'\nORDER BY '+p.sort.column+' '+p.sort.direction:'')+(p.limit?'\nLIMIT '+p.limit.limit+' OFFSET '+p.limit.offset:'')+';\n','query.sql','Review in your database client; this recipe uses SQLite/PostgreSQL-style syntax.',{reorder:false});
dkRecipe('excel','lookup','Lookup formula','Build an XLOOKUP formula with explicit ranges and fallback text.',[
 dkP('lookup','Lookup inputs','The lookup and return ranges should have corresponding dimensions.',{value:dkText('Lookup cell or expression','A2'),keys:dkText('Lookup range','D2:D100'),values:dkText('Return range','E2:E100'),separator:dkChoice('Argument separator',',',[',',';'])},true),
 dkP('fallback','Not-found text','A text value; quotation marks are added automatically.',{text:dkText('Fallback text','Not found')}),
 dkP('match','Match behavior','0 is exact matching.',{mode:dkChoice('Match mode','0',['0','-1','1','2'])})
],p=>{const v=p.lookup,args=[v.value,v.keys,v.values];if(p.fallback||p.match)args.push('"'+(p.fallback?.text||'').replace(/"/g,'""')+'"');if(p.match)args.push(p.match.mode);return '=XLOOKUP('+args.join(v.separator)+')';},'formula.txt','Paste into a compatible Excel version and evaluate against sample rows.',{reorder:false});
dkRecipe('python','script','Python command-line helper','Create a small script with an argument, optional JSON input and logging.',[
 dkP('input','Command-line input','A named option with a default string value.',{option:dkF('Option name','pyidentifier','name'),default:dkText('Default value','world'),description:dkText('Help description','A small helper script')},true),
 dkP('logging','Logging','Log a message when the script starts.',{message:dkText('Startup message','Starting helper')}),
 dkP('json','Read JSON','Read a UTF-8 JSON file from a path.',{file:dkText('Input file','input.json')})
],p=>{const v=p.input;return 'import argparse\n'+(p.logging?'import logging\n':'')+(p.json?'import json\nfrom pathlib import Path\n':'')+'\n\ndef main():\n    parser = argparse.ArgumentParser(description='+dkJSON(v.description)+')\n    parser.add_argument('+dkJSON('--'+v.option)+', default='+dkJSON(v.default)+')\n    args = parser.parse_args()\n'+(p.logging?'    logging.basicConfig(level=logging.INFO)\n    logging.info('+dkJSON(p.logging.message)+')\n':'')+(p.json?'    data = json.loads(Path('+dkJSON(p.json.file)+').read_text(encoding="utf-8"))\n    print(data)\n':'')+'    print(args.'+v.option+')\n\n\nif __name__ == "__main__":\n    main()\n';},'helper.py','python -m py_compile helper.py');
dkRecipe('bash','script','Bash file-processing script','Create a quoted file loop with a configurable directory and suffix.',[
 dkP('input','Input directory','The script lists matching files; it does not alter them.',{directory:dkText('Directory','./input'),suffix:dkText('File suffix','.log')},true),
 dkP('strict','Strict error handling','Stop on unset variables or failed commands.',{}),
 dkP('count','Count lines','Print a line count for each selected file.',{})
],p=>'#!/usr/bin/env bash\n'+(p.strict?'set -euo pipefail\n':'')+'directory='+dkQ(p.input.directory)+'\nsuffix='+dkQ(p.input.suffix)+'\n\nfor file in "$directory"/*"$suffix"; do\n  [[ -f "$file" ]] || continue\n  printf \'%s\\n\' "$file"\n'+(p.count?'  wc -l < "$file"\n':'')+'done\n','helper.sh','bash -n helper.sh',{reorder:false});
dkRecipe('powershell','files','File report pipeline','List files, optionally recurse, and export selected properties to CSV.',[
 dkP('source','Folder','Use -LiteralPath so brackets are treated as ordinary characters.',{path:dkText('Folder','C:\\Logs'),filter:dkText('Filter','*.log')},true),
 dkP('recursive','Include subfolders','Add -Recurse.',{}),
 dkP('properties','Select properties','Keep structured objects until export.',{names:dkList('Properties',['Name','Length','LastWriteTime'])}),
 dkP('csv','CSV output','Write the result to a CSV file.',{path:dkText('Output path','report.csv')})
],p=>'Get-ChildItem -LiteralPath '+dkPS(p.source.path)+' -Filter '+dkPS(p.source.filter)+' -File'+(p.recursive?' -Recurse':'')+(p.properties?' |\n  Select-Object -Property '+p.properties.names.map(dkPS).join(', '):'')+(p.csv?' |\n  Export-Csv -LiteralPath '+dkPS(p.csv.path)+' -NoTypeInformation':'')+'\n','report.ps1','Get-Help Get-ChildItem -Full',{reorder:false});
dkRecipe('cmd','copy','Preview a Windows folder copy','Build a robocopy command that starts in listing mode.',[
 dkP('paths','Source & destination','Windows paths; quote characters and CMD expansion characters are rejected here.',{source:dkF('Source','cmdpath','C:\\Source'),destination:dkF('Destination','cmdpath','D:\\Backup')},true),
 dkP('subfolders','Include subfolders','/E includes empty subfolders.',{}),
 dkP('preview','List only','/L reports the files without copying them.',{},true),
 dkP('log','Log file','Write a copy log.',{path:dkF('Log path','cmdpath','copy.log')})
],p=>'robocopy "'+p.paths.source+'" "'+p.paths.destination+'"'+(p.subfolders?' /E':'')+' /L /R:1 /W:1'+(p.log?' /LOG:"'+p.log.path+'"':'')+'\r\n','copy-preview.cmd','Review the /L result. Remove /L manually only when ready to perform the copy.');
dkRecipe('git','review','Git review workflow','Assemble a review checklist before creating a commit.',[
 dkP('status','Working-tree status','See staged, modified and untracked files.',{},true),
 dkP('changes','Unstaged changes','Compare working files to the index.',{}),
 dkP('staged','Staged changes','Review exactly what the next commit would contain.',{}),
 dkP('history','Recent history','Review a limited number of recent commits.',{count:dkF('Commit count','number',10,'',{min:1,max:1000})})
],(p,blocks)=>blocks.map(b=>({status:'git status --short',changes:'git diff',staged:'git diff --staged',history:'git log --oneline -n '+p.history?.count}[b.key])).join('\n')+'\n','git-review.sh','Run in the intended repository.');
dkRecipe('linux','service','Inspect a Linux service','Build a systemd service diagnosis checklist.',[
 dkP('service','Service name','Run on a systemd host.',{name:dkToken('Unit name','nginx')},true),
 dkP('status','Current status','Display detailed service status.',{}),
 dkP('logs','Recent logs','Read a bounded journal window.',{lines:dkF('Lines','number',100,'',{min:1,max:10000}),since:dkText('Since','1 hour ago')}),
 dkP('definition','Unit definition','Show the unit file and drop-ins.',{})
],(p,blocks)=>blocks.map(b=>b.key==='service'?'systemctl is-active '+dkQ(p.service.name):b.key==='status'?'systemctl status --no-pager '+dkQ(p.service.name):b.key==='logs'?'journalctl -u '+dkQ(p.service.name)+' --no-pager -n '+p.logs.lines+' --since '+dkQ(p.logs.since):'systemctl cat '+dkQ(p.service.name)).join('\n')+'\n','service-check.sh','systemctl --version');
dkRecipe('ssh','config','SSH client configuration','Create a named host alias with optional key and local forwarding.',[
 dkP('host','Host alias','Save the result as part of ~/.ssh/config.',{alias:dkToken('Alias','my-server'),host:dkToken('Hostname','server.example.com'),user:dkToken('User','deploy'),port:dkPort('SSH port',22)},true),
 dkP('key','Identity file','Path to an existing private key on this client.',{path:dkF('Identity path','configtext','~/.ssh/id_ed25519')}),
 dkP('keepalive','Keepalive interval','Send a periodic server-alive message.',{seconds:dkF('Seconds','number',60,'',{min:1})}),
 dkP('forward','Local port forwarding','Forward a local TCP port to a host reachable from the SSH server.',{local:dkPort('Local port',8080),host:dkToken('Destination host','127.0.0.1'),remote:dkPort('Destination port',80)})
],p=>'Host '+p.host.alias+'\n    HostName '+p.host.host+'\n    User '+p.host.user+'\n    Port '+p.host.port+'\n'+(p.key?'    IdentityFile "'+p.key.path.replace(/\\/g,'\\\\').replace(/"/g,'\\"')+'"\n':'')+(p.keepalive?'    ServerAliveInterval '+p.keepalive.seconds+'\n':'')+(p.forward?'    LocalForward '+p.forward.local+' '+p.forward.host+':'+p.forward.remote+'\n':''),'ssh-config.txt','ssh -G my-server',{reorder:false});
dkRecipe('curl','request','HTTP request','Choose a URL and add request options. Output is quoted for a POSIX shell.',[
 dkP('request','URL & method','Only text is generated; no HTTP request is sent.',{url:dkText('URL','https://example.com/api'),method:dkChoice('Method','GET',['GET','POST','PUT','PATCH','DELETE','HEAD'])},true),
 dkP('headers','Request headers','Name/value header pairs.',{items:dkF('Headers','pairs',[{key:'Accept',value:'application/json'}])}),
 dkP('body','Request body','The body is treated as literal text.',{content:dkF('Body','multiline','{"message":"hello"}')}),
 dkP('output','Save response body','Write the server response to a file.',{path:dkText('Output file','response.json')}),
 dkP('timeout','Request timeout','Maximum number of seconds for the operation.',{seconds:dkF('Seconds','number',30,'',{min:1})})
],p=>'curl --show-error '+(p.request.method==='HEAD'?'--head':'--request '+p.request.method)+' '+dkQ(p.request.url)+(p.headers?p.headers.items.map(x=>' --header '+dkQ(x.key+': '+x.value)).join(''):'')+(p.body?' --data-raw '+dkQ(p.body.content):'')+(p.output?' --output '+dkQ(p.output.path):'')+(p.timeout?' --max-time '+p.timeout.seconds:'')+'\n','request.sh','curl --help all');
dkRecipe('net','dns','DNS investigation','Construct common DNS queries for a selected name.',[
 dkP('name','DNS name','The name to query.',{host:dkToken('Hostname','example.com')},true),
 dkP('server','DNS server','Query an explicit recursive server.',{address:dkToken('Server address','1.1.1.1')}),
 dkP('type','Record type','Choose the record family.',{type:dkChoice('Type','A',['A','AAAA','MX','TXT','NS','CNAME'])})
],p=>'nslookup -type='+(p.type?.type||'A')+' '+dkQ(p.name.host)+(p.server?' '+dkQ(p.server.address):'')+'\n','dns-check.sh','POSIX-shell syntax; nslookup must be installed.');
dkRecipe('vim','substitute','Vim search & replace','Build a substitution command with a range and confirmation option.',[
 dkP('replace','Search & replacement','Patterns and replacement expressions are Vim syntax. The delimiter is escaped automatically.',{pattern:dkText('Search pattern','old'),replacement:dkText('Replacement','new'),range:dkChoice('Range','%',['%','.'])},true),
 dkP('global','Every match on each line','Replace all matches rather than only the first.',{}),
 dkP('confirm','Confirm each replacement','Ask before replacing each match.',{},true),
 dkP('ignorecase','Ignore case','Add the i flag.',{})
],p=>':'+p.replace.range+'s/'+p.replace.pattern.replace(/\//g,'\\/')+'/'+p.replace.replacement.replace(/\//g,'\\/')+'/'+(p.global?'g':'')+'c'+(p.ignorecase?'i':''),'vim-command.txt',':help :substitute');
dkRecipe('tmux','session','tmux session layout','Create a detached session, optionally split it, then attach.',[
 dkP('session','Session name','A named tmux session.',{name:dkToken('Name','work'),directory:dkText('Working directory','.')},true),
 dkP('split','Split the first window','Add a second pane.',{direction:dkChoice('Direction','horizontal',['horizontal','vertical'])}),
 dkP('window','Additional window','Create another named window.',{name:dkToken('Window name','logs')})
],p=>'tmux new-session -d -s '+dkQ(p.session.name)+' -c '+dkQ(p.session.directory)+'\n'+(p.split?'tmux split-window '+(p.split.direction==='horizontal'?'-h':'-v')+' -t '+dkQ(p.session.name+':0')+'\n':'')+(p.window?'tmux new-window -t '+dkQ(p.session.name)+' -n '+dkQ(p.window.name)+'\n':'')+'tmux attach-session -t '+dkQ(p.session.name)+'\n','tmux-session.sh','tmux list-sessions',{reorder:false});
dkRecipe('regex','pattern','Regex pattern & tester','Assemble a JavaScript pattern and test it locally with a time limit.',[
 dkP('literal','Literal text','Special regex characters are escaped automatically.',{text:dkText('Text to match','user')}),
 dkP('digits','Digits','Match one or more digits.',{}),
 dkP('word','Word characters','Match letters, digits or underscore.',{}),
 dkP('whitespace','Whitespace','Match one or more whitespace characters.',{}),
 dkP('custom','Pattern fragment','An advanced JavaScript regular-expression fragment.',{pattern:dkText('Fragment','[a-z]+')})
],(p,blocks)=>blocks.map(b=>b.key==='literal'?p.literal.text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'):b.key==='digits'?'\\d+':b.key==='word'?'\\w+':b.key==='whitespace'?'\\s+':p.custom.pattern).join(''),'pattern.txt','Test in the JavaScript regex panel below.',{regex:true});

// Account checks are intentionally separate from operations that change resources.
for(const [sheet,id,title,base,fields,flags] of [
 ['gam7','users','Workspace user report','gam print users',{},[['fields','Report fields','fields',{value:dkText('Fields','primaryemail,name,orgunitpath')}]]],
 ['aws','identity','AWS identity & region','aws sts get-caller-identity',{},[['profile','Profile','--profile',{value:dkText('Profile','default')}],['region','Region','--region',{value:dkToken('Region','us-east-1')}],['format','Output format','--output',{value:dkChoice('Format','json',['json','table','text','yaml'])}]]],
 ['azure','account','Azure account inspection','az account show',{},[['subscription','Subscription','--subscription',{value:dkText('Subscription name or ID','my-subscription')}],['format','Output format','--output',{value:dkChoice('Format','json',['json','table','tsv','yaml'])}]]],
 ['gcloud','projects','Google Cloud project report','gcloud projects list',{},[['filter','Filter expression','--filter',{value:dkText('Filter','lifecycleState=ACTIVE')}],['format','Output format','--format',{value:dkChoice('Format','json',['json','table','yaml'])}]]]
])dkRecipe(sheet,id,title,'Build an inspection command with optional account scope and formatting.',[dkP('base','Operation','Uses your locally configured CLI credentials.',fields,true),...flags.map(([k,l,flag,f])=>dkP(k,l,'Adds '+flag+'.',f))],(p,blocks)=>base+blocks.filter(b=>b.key!=='base').map(b=>{const flag=flags.find(f=>f[0]===b.key)[2];return ' '+flag+' '+dkQ(p[b.key].value);}).join('')+'\n','report.sh','Check the active credentials and project/account first.');

const DK_NETWORK={
 cisco:[['version','Device version','show version'],['interfaces','Interface summary','show ip interface brief'],['vlans','VLAN summary','show vlan brief'],['neighbors','Neighbors','show cdp neighbors']],
 aruba:[['version','OS-Switch version','show version'],['interfaces','OS-Switch interfaces','show interfaces brief'],['vlans','OS-Switch VLANs','show vlans'],['neighbors','OS-Switch neighbors','show lldp info remote-device']],
 fortigate:[['version','FortiOS status','get system status'],['performance','Performance','get system performance status'],['interfaces','Interfaces','get system interface'],['routes','Routing table','get router info routing-table all']],
 juniper:[['version','Junos version','show version'],['interfaces','Interface summary','show interfaces terse'],['routes','Routing table','show route'],['alarms','Alarms','show system alarms']],
 netgear:[['version','ProSAFE version','show version'],['interfaces','ProSAFE interfaces','show interface all'],['vlans','ProSAFE VLANs','show vlan'],['neighbors','ProSAFE neighbors','show lldp neighbors']]
};
for(const [sheet,steps] of Object.entries(DK_NETWORK))dkRecipe(sheet,'diagnostics','Device inspection checklist','Add the checks you need and drag them into your preferred order. Commands run in the device CLI, not an OS shell.',steps.map(([key,label,command],i)=>dkP(key,label,command,{},i===0)),(p,blocks)=>blocks.map(b=>steps.find(x=>x[0]===b.key)[2]).join('\n')+'\n','device-checks.txt','Confirm the model, OS family and privilege context with the first command.');

// Bring every existing option-aware command definition into the common workbench.
// SQL has a dedicated clause builder above; the old SELECT definition omitted FROM.
for(const [key,def] of Object.entries(BUILDERS)){
 if(!def.base||key.startsWith('sql::'))continue;const sheet=key.split('::')[0];
 const fields={};for(const arg of def.args||[])fields[arg.key]=dkF(arg.label,arg.options?'choice':'text',arg.default||'',arg.placeholder||'',{required:arg.required!==false,choices:arg.options});
 const parts=[dkP('arguments','Arguments','Fill in command arguments; quoted values are escaped for the selected shell.',fields,true)];
 (def.flags||[]).filter(f=>!f.hidden).forEach((flag,i)=>parts.push(dkP('flag-'+i,flag.flag,flag.desc,flag.valuePrompt?{value:dkText(flag.valuePrompt,flag.valueDefault||'')}: {},!!flag.alwaysOn)));
 dkRecipe(sheet,'cli-'+Array.from(key).reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261).toString(36),def.name+' · command',def.description,parts,(p,blocks,context)=>{
  const q=context.shell==='powershell'?dkPS:dkQ;const pre=[],post=[];for(const arg of def.args||[]){const value=String(p.arguments[arg.key]||'').trim();if(!value&&arg.required===false)continue;(def.argsAfterFlags?post:pre).push(arg.quote?q(value):value);}
  const options=[],filters=[];for(const b of blocks.filter(x=>x.key.startsWith('flag-'))){const flag=(def.flags||[]).filter(f=>!f.hidden)[Number(b.key.slice(5))];const value=p[b.key].value;let text=flag.flag;if(value!==undefined&&value!=='')text+=(flag.join??' ')+(flag.quote?q(value):value);(flag.filterMode?filters:options).push(text);}
  const a=p.arguments,join=xs=>xs.filter(Boolean).join(' ');
  // These commands bind options to particular operands; preserve their grammar.
  if(def.name==='tar'){
   if(options.filter(x=>['-z','-j','-J'].includes(x)).length>1)throw Error('Choose only one compression format.');
   if(a.mode==='-c'&&!a.target.trim())throw Error('Add a source file or directory to create an archive.');
   return join(['tar',a.mode,...options,'-f',q(a.archive),a.target?q(a.target):'']);
  }
  if(def.name==='docker build')return join([def.base,...options,'-t',q(a.tag),q(a.context)]);
  if(def.name==='kubectl apply')return join([def.base,...options,options.includes('-k')?'':'-f',q(a.target)]);
  if(def.name==='kubectl scale')return join([def.base,a.resource,q(a.name),'--replicas='+a.replicas,...options]);
  if(def.name==='az vm create')return join([def.base,'--resource-group',q(a.rg),'--name',q(a.name),...options]);
  if(def.name==='gam print filelist')return join([def.base,q(a.user),'print filelist',...options]);
  if(def.name==='gam transfer drive')return join([def.base,q(a.src),'transfer drive',q(a.dest),...options]);
  if(['docker run','docker exec'].includes(def.name))return join([def.base,...options,...pre,...post]);
  return join([def.base,...pre,...options,...post,...(filters.length?[filters.join(' and ')]:[])]);
 },'command.txt','Use the installed tool’s help to confirm version-specific options.',{legacy:key,shell:true,reorder:true});
}

dkRecipe('docker','dockerfile','Dockerfile','Create an image recipe with JSON-form copy and startup arguments.',[
 dkP('image','Base image','Choose a compatible base image.',{image:dkToken('Image','python:3.12-slim')},true),
 dkP('directory','Working directory','Directory used by later instructions.',{path:dkToken('Container path','/app')}),
 dkP('copy','Copy application files','Paths are encoded as a JSON array.',{source:dkText('Source in build context','.'),destination:dkText('Destination in image','/app')}),
 dkP('run','Build command','Executable and arguments, one per line; no implicit shell.',{args:dkList('Arguments',['python','-m','pip','install','-r','/app/requirements.txt'])}),
 dkP('port','Document a container port','EXPOSE does not publish a host port.',{port:dkPort('Container port',8080)}),
 dkP('command','Startup command','Executable and arguments, one per line.',{args:dkList('Arguments',['python','/app/main.py'])})
],p=>'FROM '+p.image.image+'\n'+(p.directory?'WORKDIR '+p.directory.path+'\n':'')+(p.copy?'COPY '+JSON.stringify([p.copy.source,p.copy.destination])+'\n':'')+(p.run?'RUN '+JSON.stringify(p.run.args)+'\n':'')+(p.port?'EXPOSE '+p.port.port+'\n':'')+(p.command?'CMD '+JSON.stringify(p.command.args)+'\n':''),'Dockerfile','docker build --check .',{reorder:false});
dkRecipe('k8s','configmap','ConfigMap','Generate non-secret configuration as a Kubernetes object.',[
 dkP('identity','Name & namespace','Use a distinct name for this configuration.',{name:dkF('Name','dns','app-config'),namespace:dkF('Namespace','dns','default')},true),
 dkP('data','Configuration data','Values remain strings, including numbers and booleans.',{items:dkF('Configuration','pairs',[{key:'APP_ENV',value:'development'},{key:'APP_PORT',value:'8080'}])},true)
],p=>dkYaml({apiVersion:'v1',kind:'ConfigMap',metadata:p.identity,data:dkPairs(p.data.items)}),'configmap.yml','kubectl apply --dry-run=client -f configmap.yml');
dkRecipe('excel','conditional','IF / IFERROR formula','Build a conditional result and optional error fallback.',[
 dkP('condition','Condition & results','Results here are text, quoted automatically.',{expression:dkText('Condition','A2>100'),yes:dkText('If true','High'),no:dkText('If false','Low'),separator:dkChoice('Separator',',',[',',';'])},true),
 dkP('error','Error fallback','Wrap the expression in IFERROR.',{text:dkText('Fallback text','Check input')})
],p=>{const q=s=>'"'+s.replace(/"/g,'""')+'"',s=p.condition.separator;let formula='IF('+p.condition.expression+s+q(p.condition.yes)+s+q(p.condition.no)+')';if(p.error)formula='IFERROR('+formula+s+q(p.error.text)+')';return '='+formula;},'formula.txt','Check the condition and your locale’s argument separator.',{reorder:false});
dkRecipe('curl','jq','jq JSON filter','Filter an array of objects, then select fields. Output uses POSIX-shell quoting.',[
 dkP('input','Input JSON','A JSON file containing an array of objects.',{path:dkText('File','data.json')},true),
 dkP('filter','Filter objects','Match one top-level field to a literal string.',{field:dkF('Field','identifier','status'),value:dkText('Value','active')}),
 dkP('select','Select fields','Produce an object with these top-level keys.',{fields:dkList('Keys',['id','name'])}),
 dkP('array','Return an array','Wrap the stream of results in one JSON array.',{})
],p=>{let filter='.[]';if(p.filter)filter+=' | select(.['+JSON.stringify(p.filter.field)+'] == '+JSON.stringify(p.filter.value)+')';if(p.select)filter+=' | {'+p.select.fields.map(k=>JSON.stringify(k)+': .['+JSON.stringify(k)+']').join(', ')+'}';if(p.array)filter='['+filter+']';return 'jq '+dkQ(filter)+' '+dkQ(p.input.path)+'\n';},'filter.sh','jq --version',{reorder:false});
for(const [sheet,title,defaultPort,generate] of [
 ['cisco','IOS / IOS-XE interface label','GigabitEthernet0/1',p=>'enable\nconfigure terminal\ninterface '+p.target.port+'\n description '+p.target.description+'\nend\nshow interfaces '+p.target.port+'\n'],
 ['aruba','OS-Switch port label','1',p=>'configure\ninterface '+p.target.port+'\n name '+p.target.description+'\nexit\nexit\nshow interfaces '+p.target.port+'\n'],
 ['fortigate','FortiOS interface description','port1',p=>'config system interface\n    edit "'+p.target.port+'"\n        set description "'+p.target.description+'"\n    next\nend\nshow system interface '+p.target.port+'\n'],
 ['juniper','Junos candidate interface label','ge-0/0/0',p=>'configure\nset interfaces '+p.target.port+' description "'+p.target.description+'"\nshow | compare\ncommit check\n']
])dkRecipe(sheet,'interface-label',title,'Fill in a port and description. Context commands and indentation are supplied for this device family.',[dkP('target','Interface & label','This changes a description when run. The recipe does not save startup configuration or commit a Junos candidate.',{port:dkToken('Interface',defaultPort),description:dkToken('Description','SERVER_LINK')},true)],generate,'interface-label.txt','Confirm the device family and interface name. Commands are generated, not sent.',{reorder:false});
dkRecipe('netgear','vlan','ProSAFE VLAN declaration','Create and name a VLAN in the ProSAFE VLAN database context.',[
 dkP('vlan','VLAN identity','Verify that the ID is available on your switch.',{id:dkF('VLAN ID','number',10,'',{min:1,max:4094}),name:dkToken('VLAN name','SERVERS')},true)
],p=>'enable\nvlan database\nvlan '+p.vlan.id+'\nvlan name '+p.vlan.id+' '+p.vlan.name+'\nexit\nshow vlan\n','vlan.txt','Netgear ProSAFE syntax; not TP-Link Omada. This does not save startup configuration.',{reorder:false});
