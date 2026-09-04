/* Suggestions add ordinary editable nodes; they never lock the document to a template. */
DD_SEEDS.terraform=['terraform:configuration'];
function ddSuggestions(parent,slot){
 const p=ddProfile(),found=parent?ddFind(parent):null,n=found?.node,list=ddLane(parent,slot),existing=new Set(list.map(x=>x.values.key));let values={};
 if(['yaml','json'].includes(p.id)&&n?.type==='object'){
  const path=[];let cursor=found;while(cursor){if(cursor.node.values.key)path.unshift(cursor.node.values.key);cursor=cursor.parent?ddFind(cursor.parent.id):null;}
  const k=n.values.key,up=found.parent?.values.key;
  if(ddState.sheet==='docker'){
   if(!found.parent)values={services:{web:{image:'nginx:stable'}},volumes:{app_data:{}},networks:{app_net:{}}};
   else if(up==='services')values={image:'nginx:stable',build:'.',ports:['8080:80'],environment:{APP_ENV:'development'},volumes:['app_data:/data'],restart:'unless-stopped',depends_on:['database'],command:['nginx','-g','daemon off;'],healthcheck:{test:['CMD','curl','-f','http://localhost'],interval:'30s',timeout:'5s',retries:3},networks:['app_net']};
   else if(k==='services')values={web:{image:'nginx:stable'},database:{image:'postgres:17',environment:{POSTGRES_DB:'app'}}};
  }
  if(ddState.sheet==='npm'&&!found.parent)values={name:'my-app',version:'1.0.0',private:true,type:'module',description:'My application',scripts:{start:'node index.js',test:'node --test'},dependencies:{},devDependencies:{},engines:{node:'>=22'},license:'UNLICENSED'};
  if(ddState.sheet==='k8s'){
   if(!found.parent)values={apiVersion:'apps/v1',kind:'Deployment',metadata:{name:'web',namespace:'default'},spec:{replicas:2,selector:{matchLabels:{app:'web'}},template:{metadata:{labels:{app:'web'}},spec:{containers:[{name:'web',image:'nginx:stable'}]}}}};
   else if(k==='metadata')values={name:'web',namespace:'default',labels:{app:'web'},annotations:{description:'Managed application'}};
   else if(k==='spec'&&up!=='template')values={replicas:2,selector:{matchLabels:{app:'web'}},template:{metadata:{labels:{app:'web'}},spec:{containers:[{name:'web',image:'nginx:stable'}]}}};
   else if(k==='spec'&&up==='template')values={containers:[{name:'web',image:'nginx:stable'}],volumes:[{name:'data',emptyDir:{}}],serviceAccountName:'default'};
   else if(found.parent?.type==='array'&&up==='containers')values={name:'web',image:'nginx:stable',ports:[{containerPort:80}],env:[{name:'APP_ENV',value:'development'}],resources:{requests:{cpu:'100m',memory:'64Mi'},limits:{cpu:'500m',memory:'256Mi'}},volumeMounts:[{name:'data',mountPath:'/data'}],readinessProbe:{httpGet:{path:'/',port:80},initialDelaySeconds:5}};
  }
  return Object.entries(values).filter(([key])=>!existing.has(key)).map(([key,value])=>({label:key,make:()=>ddFromValue(p,value,key)}));
 }
 if(p.id==='terraform'&&n&&slot==='body'){
  const examples={variable:{type:['expression','string'],description:['text','Describe this input'],default:['text','example'],sensitive:['boolean','false'],nullable:['boolean','true']},output:{value:['expression','var.region'],description:['text','Describe this output'],sensitive:['boolean','false']},provider:{region:['expression','var.region'],alias:['text','secondary']},module:{source:['text','./modules/example'],version:['text','~> 1.0'],for_each:['expression','var.instances']},resource:{count:['number','1'],for_each:['expression','var.instances'],depends_on:['array',null],tags:['object',null]},data:{},terraform:{required_version:['text','>= 1.5.0']},nested:{prevent_destroy:['boolean','true'],create_before_destroy:['boolean','true']}};
  const result=Object.entries(examples[n.type]||{}).filter(([key])=>!existing.has(key)).map(([key,[type,value]])=>({label:key,make:()=>ddNode(p,type,{key,...(value===null?{}:{value})})}));
  if(n.type==='terraform'&&!list.some(x=>x.type==='nested'&&x.values.name==='required_providers'))result.push({label:'required_providers',make:()=>ddNode(p,'nested',{name:'required_providers'}, {body:[ddNode(p,'object',{key:'aws'},{items:[ddNode(p,'text',{key:'source',value:'hashicorp/aws'}),ddNode(p,'text',{key:'version',value:'~> 6.0'})]})]})});
  if(n.type==='resource'&&!list.some(x=>x.type==='nested'&&x.values.name==='lifecycle'))result.push({label:'lifecycle',make:()=>ddNode(p,'nested',{name:'lifecycle'}, {body:[ddNode(p,'boolean',{key:'prevent_destroy',value:'true'})]})});return result;
 }
 return [];
}
