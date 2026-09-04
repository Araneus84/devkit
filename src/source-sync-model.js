/* Offline source adapters. Unknown syntax remains explicit editable code. */
const SX_RAW='sx_code';
const sxSignature=nodes=>JSON.stringify(nodes,(k,v)=>k==='id'||k.startsWith('sx')?undefined:v);
const sxGenerators={};
for(const p of Object.values(DD_PROFILES)){
 if(p.id==='python')continue;
 sxGenerators[p.id]=p.generate;
 p.types[SX_RAW]=ddType('Custom code','Source preserved exactly. Edit this block or the code pane. Syntax inside custom code is not validated.',{text:ddField('Custom code','','multiline')});
 p.root.accept=[...p.root.accept,SX_RAW];
 p.generate=nodes=>{
  if(!nodes.some(n=>n.type===SX_RAW))return sxGenerators[p.id](nodes);
  if(nodes.length===1&&nodes[0].type===SX_RAW)return nodes[0].values.text;
  if(['bash','powershell'].includes(p.id)){
   const strip=code=>p.id==='bash'?code.replace(/^#![^\n]*\n(?:set -euo pipefail\n)?\n?/,''):code.replace(/^# PowerShell script\n\$ErrorActionPreference[^\n]*\n\n?/,'');
   return nodes.map(n=>n.type===SX_RAW?n.values.text:strip(sxGenerators[p.id]([n]))).join('\n');
  }
  if(p.id==='dockerfile')return nodes.map(n=>n.type===SX_RAW?n.values.text:n.type==='from'?sxGenerators[p.id]([n]):sxGenerators[p.id]([ddNode(p,'from'),n]).split('\n').slice(1).join('\n')).join('\n');
  return nodes.map(n=>n.type===SX_RAW?n.values.text:sxGenerators[p.id]([n])).join('\n');
 };
}
const sxRaw=(p,text)=>ddNode(p,SX_RAW,{text});
function sxSafeData(text,json=false){
 if(text.length>1000000)throw Error('Use a file under 1 MB.');
 const values=json?[JSON.parse(text)]:jsyaml.loadAll(text,{schema:jsyaml.JSON_SCHEMA});let count=0;const active=new Set();
 function visit(v,depth=0){if(++count>1500||depth>20)throw Error('Use at most 1,500 values and 20 levels.');if(v&&typeof v==='object'){if(active.has(v))throw Error('Cyclic YAML aliases cannot become blocks.');active.add(v);Object.values(v).forEach(x=>visit(x,depth+1));active.delete(v);}}
 values.forEach(v=>visit(v));if(!values.length||values.some(v=>v===undefined))throw Error('Add a document value.');return values;
}
/* Recover a direct field edit only when re-generation proves an exact match. */
function sxFieldEdit(p,blocks,text){
 if(text.length>200000)return null;
 let before;try{before=p.generate(blocks);}catch{return null;}if(before===text)return dkClone(blocks);
 let start=0;while(start<before.length&&start<text.length&&before[start]===text[start])start++;
 let end=before.length,newEnd=text.length;while(end>start&&newEnd>start&&before[end-1]===text[newEnd-1]){end--;newEnd--;}
 const copy=dkClone(blocks),fields=[];function visit(nodes){for(const n of nodes){for(const [key,value] of Object.entries(n.values))if(typeof value==='string')fields.push({n,key,value});Object.values(n.slots).forEach(visit);}}visit(copy);
 const codecs=[{encode:JSON.stringify,decode:JSON.parse},{encode:ddHCLText,decode:s=>JSON.parse(s).replace(/\$\$\{/g,'${').replace(/%%\{/g,'%{')},{encode:dkQ,decode:s=>{if(!s.startsWith("'")||!s.endsWith("'"))throw Error();return s.slice(1,-1).replace(/'"'"'/g,"'");}},{encode:dkPS,decode:s=>{if(!s.startsWith("'")||!s.endsWith("'"))throw Error();return s.slice(1,-1).replace(/''/g,"'");}},{encode:s=>s,decode:s=>s}];
 for(const field of fields)for(const codec of codecs){const token=codec.encode(field.value);if(!token)continue;let pos=before.indexOf(token);while(pos>=0){if(pos<=start&&pos+token.length>=end){const changed=before.slice(pos,start)+text.slice(start,newEnd)+before.slice(end,pos+token.length);try{field.n.values[field.key]=codec.decode(changed);if(p.generate(copy)===text&&!ddValidate(p,copy).length)return copy;}catch{}field.n.values[field.key]=field.value;}pos=before.indexOf(token,pos+1);}}
 return null;
}
/* HCL scanner treats strings, comments and heredocs as indivisible tokens. */
function sxHclTokens(text){const tokens=[];let i=0;while(i<text.length){const start=i,c=text[i];if(/\s/.test(c)){i++;continue;}if(c==='#'||text.startsWith('//',i)){while(i<text.length&&text[i]!=='\n')i++;tokens.push({kind:'comment',text:text.slice(start,i),start,end:i});continue;}if(text.startsWith('/*',i)){const end=text.indexOf('*/',i+2);if(end<0)throw Error('Finish the block comment with */.');i=end+2;tokens.push({kind:'comment',text:text.slice(start,i),start,end:i});continue;}
 if(c==='"'){i++;let closed=false;while(i<text.length){if(text[i]==='\\'){i+=2;continue;}if(text[i++]==='"'){closed=true;break;}}if(!closed)throw Error('Finish the quoted string.');tokens.push({kind:'string',text:text.slice(start,i),start,end:i});continue;}
 if(text.startsWith('<<',i)){const m=/^<<(-?)([A-Za-z_][\w-]*)[^\S\n]*\r?\n/.exec(text.slice(i));if(m){i+=m[0].length;const lines=text.slice(i).split(/(?<=\n)/);let closed=false;for(const line of lines){i+=line.length;if((m[1]?line.trim():line.replace(/\r?\n$/,''))===m[2]){closed=true;break;}}if(!closed)throw Error('Finish the heredoc with '+m[2]+'.');tokens.push({kind:'heredoc',text:text.slice(start,i).trimEnd(),start,end:i});continue;}}
 const word=/^[A-Za-z_][A-Za-z0-9_-]*/.exec(text.slice(i));if(word){i+=word[0].length;tokens.push({kind:'word',text:word[0],start,end:i});}else{tokens.push({kind:c,text:c,start,end:++i});}}
 const stack=[];for(const t of tokens){if(['{','[','('].includes(t.kind))stack.push(t.kind);if(['}',']',')'].includes(t.kind)&&stack.pop()!=={'}':'{',']':'[',')':'('}[t.kind])throw Error('Check matching braces, brackets and parentheses.');}if(stack.length)throw Error('Finish the open brace, bracket or parenthesis.');return tokens;
}
function sxHclLiteral(value){if(typeof value==='string')return value.replace(/\$\$\{/g,'${').replace(/%%\{/g,'%{');if(Array.isArray(value))return value.map(sxHclLiteral);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,sxHclLiteral(v)]));return value;}
function sxTerraform(text){
 const p=DD_PROFILES.terraform,tokens=sxHclTokens(text);let i=0,count=0;
 function node(type,values,slots){if(++count>1500)throw Error('Too many blocks.');return ddNode(p,type,values,slots);}
 function value(key,raw){if(/(?<!\$)\$\{|(?<!%)%\{/.test(raw))return node('expression',{key,value:raw});try{if(/^"/.test(raw)){return node('text',{key,value:JSON.parse(raw).replace(/\$\$\{/g,'${').replace(/%%\{/g,'%{')});}const parsed=sxHclLiteral(JSON.parse(raw));return ddFromValue(p,parsed,key);}catch{}return node('expression',{key,value:raw});}
 function body(root=false,depth=0){if(depth>20)throw Error('Use at most 20 nested levels.');const out=[];while(i<tokens.length&&tokens[i].kind!=='}'){
 const first=tokens[i];if(first.kind==='comment'){out.push(node(SX_RAW,{text:first.text}));i++;continue;}
 const start=i;let j=i+1;while(j<tokens.length&&!['{','=','}','comment'].includes(tokens[j].kind)&&!text.slice(tokens[j-1].end,tokens[j].start).includes('\n'))j++;
 if(first.kind==='word'&&tokens[j]?.kind==='{'&&tokens.slice(i+1,j).every(t=>['word','string'].includes(t.kind))){const labels=tokens.slice(i+1,j).map(t=>t.kind==='string'?JSON.parse(t.text):t.text);i=j+1;const children=body(false,depth+1);if(tokens[i]?.kind!=='}')throw Error('Finish '+first.text+' with }.');i++;const known=root&&['terraform','provider','variable','output','locals','resource','data','module'].includes(first.text);const type=known?first.text:'nested',expected=['resource','data'].includes(type)?2:['provider','variable','output','module'].includes(type)?1:0;
 if(known&&labels.length!==expected||root&&tokens.slice(start,i).some(t=>t.kind==='heredoc')){out.push(node(SX_RAW,{text:text.slice(first.start,tokens[i-1].end)}));continue;}
 out.push(node(type,type==='nested'?{name:first.text,labels:labels.join('\n')}:expected===2?{kind:labels[0],label:labels[1]}:expected===1?{label:labels[0]}:{},{body:children}));continue;}
 if(!root&&first.kind==='word'&&tokens[i+1]?.kind==='='){i+=2;const begin=i;let nesting=0;while(i<tokens.length){const t=tokens[i];if(!nesting&&(t.kind==='}'||t.kind==='comment'||(i>begin&&text.slice(tokens[i-1].end,t.start).includes('\n'))))break;if(['{','[','('].includes(t.kind))nesting++;if(['}',']',')'].includes(t.kind))nesting--;i++;}if(begin===i)throw Error('Add a value for '+first.text+'.');out.push(value(first.text,text.slice(tokens[begin].start,tokens[i-1].end)));continue;}
 i=start+1;while(i<tokens.length&&tokens[i].kind!=='}'&&!text.slice(tokens[i-1].end,tokens[i].start).includes('\n'))i++;out.push(node(SX_RAW,{text:text.slice(first.start,tokens[i-1].end)}));
 }return out;}
 const nodes=body(true);if(i!==tokens.length)throw Error('Unexpected closing brace.');return nodes;
}
{
 const p=DD_PROFILES.terraform;p.types.expression.fields.value.type='multiline';p.root.accept.push('nested');for(const t of Object.values(p.types))if(t.slots.body&&!t.slots.body.accept.includes(SX_RAW))t.slots.body.accept.push(SX_RAW);
 function val(n){if(n.type==='expression')return n.values.value;if(n.type==='text')return ddHCLText(n.values.value);if(n.type==='object')return '{\n'+ddIndent(n.slots.items.map(x=>ddHCLText(x.values.key)+' = '+val(x)).join('\n'))+'\n}';if(n.type==='array')return '['+n.slots.items.map(val).join(', ')+']';return JSON.stringify(ddValue(n));}
 function emit(n){if(n.type===SX_RAW)return n.values.text;if(DD_VALUE_TYPES.includes(n.type)||n.type==='expression')return ddIdent(n.values.key)+' = '+val(n);const names=new Set();for(const child of n.slots.body){if(DD_VALUE_TYPES.includes(child.type)||child.type==='expression'){if(names.has(child.values.key))throw Error('Duplicate argument: '+child.values.key);names.add(child.values.key);}}const v=n.values,labels=n.type==='nested'?v.labels.split('\n').filter(Boolean):[v.kind,v.label].filter(Boolean);return (n.type==='nested'?v.name:n.type)+(labels.length?' '+labels.map(ddHCLText).join(' '):'')+' {\n'+ddIndent(n.slots.body.map(emit).join('\n'))+'\n}';}
 p.generate=nodes=>nodes.map(emit).join('\n\n')+'\n';
}
function sxDocker(text){const p=DD_PROFILES.dockerfile,n=(t,v={},s={})=>ddNode(p,t,v,s);return text.split(/(?<=\n)/).filter(Boolean).map(line=>{const s=line.trim(),m=/^(\w+)\s+([\s\S]*)$/.exec(s);if(s.startsWith('#'))return n('comment',{text:s.replace(/^#\s?/,'')});if(!m)return sxRaw(p,line);const type=m[1].toLowerCase(),v=m[2];try{if(type==='from'){const [image,alias='']=v.split(/\s+AS\s+/i);return n(type,{image,alias});}if(['workdir','user','expose'].includes(type))return n(type,{[type==='workdir'?'path':type==='user'?'name':'port']:v});if(['run','cmd','entrypoint'].includes(type)){const args=JSON.parse(v);if(Array.isArray(args)&&args.length&&args.every(x=>typeof x==='string'))return n(type,{program:args[0]},{args:args.slice(1).map(value=>n('arg',{value}))});}if(type==='copy'){const match=/^(?:--from=(\S+)\s+)?(\[.*\])$/.exec(v);if(match){const a=JSON.parse(match[2]);if(a.length===2)return n(type,{from:match[1]||'',source:a[0],destination:a[1]});}}}catch{}return sxRaw(p,line);});}
function sxScript(p,text,previous){
 // Existing complete top-level blocks remain structured wherever their emitted text is unchanged.
 const fragments=[];for(const block of previous.filter(n=>n.type!==SX_RAW)){try{let code=sxGenerators[p.id]([block]);if(p.id==='bash')code=code.replace(/^#![^\n]*\n(?:set -euo pipefail\n)?\n?/,'');if(p.id==='powershell')code=code.replace(/^# PowerShell script\n\$ErrorActionPreference[^\n]*\n\n?/,'');code=code.trim();if(code)fragments.push({code,block});}catch{}}
 const nodes=[];let offset=0;while(offset<text.length){let best=null;for(const f of fragments){const pos=text.indexOf(f.code,offset);if(pos>=0&&(!best||pos<best.pos||pos===best.pos&&f.code.length>best.code.length))best={...f,pos};}if(!best){if(text.slice(offset).trim())nodes.push(...sxScriptPieces(p,text.slice(offset)));break;}if(text.slice(offset,best.pos).trim())nodes.push(...sxScriptPieces(p,text.slice(offset,best.pos)));nodes.push(ddFreshIds(dkClone(best.block)));offset=best.pos+best.code.length;}
 return nodes;
}
function sxScriptPieces(p,text){
 const n=(t,v={},s={})=>ddNode(p,t,v,s);
 if(p.id==='sql'){
  const match=/^\s*SELECT\s+([\w".*,\s]+)\s+FROM\s+([\w".]+)(?:\s+LIMIT\s+(\d+))?\s*;?\s*$/i.exec(text);
  if(match){const unquote=s=>s.trim().replace(/"/g,'');return [n('select',{table:unquote(match[2]),limit:match[3]||''},{columns:match[1].split(',').map(name=>n('column',{name:unquote(name)}))})];}return [sxRaw(p,text)];
 }
 if(!['bash','powershell'].includes(p.id)||/\b(if|then|fi|for|while|case|function|try|catch|switch)\b|[{}]|<<|`|\\\r?\n/.test(text))return [sxRaw(p,text)];
 function scalar(s){if(/^'[^']*'$/.test(s))return s.slice(1,-1);if(/^"[^"$`\\]*"$/.test(s))return s.slice(1,-1);if(/^[\w./:@%+,=-]+$/.test(s))return s;throw Error('Expression');}
 return text.split(/(?<=\n)/).filter(line=>line.trim()).map(line=>{const s=line.trim();try{if(s.startsWith('#')&&!s.startsWith('#!'))return n('comment',{text:s.replace(/^#\s?/,'')});const variable=p.id==='bash'?/^([A-Za-z_]\w*)=(.+)$/.exec(s):/^\$([A-Za-z_]\w*)\s*=\s*(.+)$/.exec(s);if(variable)return n('variable',{name:variable[1],mode:'literal',value:scalar(variable[2])});if(p.id==='powershell'){const print=/^Write-Output\s+(?:\((.*)\)|(.*))$/i.exec(s);if(print)return n('print',{mode:'literal',value:scalar(print[1]??print[2])});return sxRaw(p,line);}
 const words=s.match(/'[^']*'|"[^"$`\\]*"|[^\s]+/g)||[];const values=words.map(scalar);if(values.length&&words.join(' ')===s.replace(/\s+/g,' ')&&!['set','export','source','eval','exec'].includes(values[0]))return n('command',{program:values[0]},{args:values.slice(1).map(value=>n('argument',{mode:'literal',value}))});
 }catch{}return sxRaw(p,line);});
}
function sxParse(p,text,previous=[]){
 if(text.length>1000000||text.includes('\0'))throw Error('Use UTF-8 text under 1 MB without null characters.');
 if(p.id==='yaml'||p.id==='json')return sxSafeData(text,p.id==='json').map(v=>ddFromValue(p,v));
 if(p.id==='terraform')return sxTerraform(text);
 const edited=sxFieldEdit(p,previous,text);if(edited)return edited;
 if(p.id==='dockerfile')return sxDocker(text);
 if(p.id==='source')return [ddNode(p,'source',{text})];
 if(['bash','powershell','sql'].includes(p.id))return sxScript(p,text,previous);
 if(['github-actions','gitlab-ci'].includes(p.id))return sxSafeData(text).map(v=>ddFromValue(p,v));
 return [sxRaw(p,text)];
}
for(const id of ['github-actions','gitlab-ci']){const p=DD_PROFILES[id],generate=p.generate;Object.assign(p.types,ddValueTypes());p.root.accept.push(...DD_VALUE_TYPES);p.generate=nodes=>nodes.length===1&&DD_VALUE_TYPES.includes(nodes[0].type)?dkYaml(ddValue(nodes[0])):generate(nodes);}
