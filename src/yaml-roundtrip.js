/* Comment-preserving YAML document reconciliation using the bundled CST parser. */
const YC_IDENTITY_KEYS=['name','id','key','stage','uses','run','path','host'];
const YC_CACHE={source:null,docs:null};
const ycMap=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
function ycSame(a,b){if(a===b)return true;try{return JSON.stringify(a)===JSON.stringify(b);}catch{return false;}}
function ycCheck(value){let count=0;const active=new Set();function visit(item,depth=0){if(++count>1500||depth>20)throw Error('Use at most 1,500 YAML values and 20 levels.');if(item&&typeof item==='object'){if(active.has(item))throw Error('Cyclic YAML aliases cannot become blocks.');active.add(item);Object.values(item).forEach(child=>visit(child,depth+1));active.delete(item);}}visit(value);return value;}
function ycDocuments(text){if(typeof DevKitYAML==='undefined')throw Error('The YAML document parser is unavailable.');if(text.length>1000000||text.includes('\0'))throw Error('Use UTF-8 YAML under 1 MB without null characters.');if(YC_CACHE.source===text&&YC_CACHE.docs)return YC_CACHE.docs.map(doc=>doc.clone());const docs=DevKitYAML.parseAllDocuments(text,{keepSourceTokens:true,prettyErrors:false,uniqueKeys:true,maxAliasCount:100});for(const doc of docs){if(doc.errors.length)throw Error(doc.errors[0].message);ycCheck(doc.toJS({maxAliasCount:100}));}if(!docs.length)throw Error('Add a YAML document value.');YC_CACHE.source=text;YC_CACHE.docs=docs.map(doc=>doc.clone());return docs;}
function ycTransfer(from,to){if(!from||!to)return to;for(const key of ['commentBefore','comment','spaceBefore','anchor'])if(from[key]!==undefined)to[key]=from[key];return to;}
function ycKey(pair){return DevKitYAML.isScalar(pair?.key)?String(pair.key.value):String(pair?.key?.toJSON?.()??'');}
function ycIdentity(value){if(!ycMap(value))return '';for(const key of YC_IDENTITY_KEYS)if(typeof value[key]==='string'||typeof value[key]==='number')return key+'\0'+value[key];return '';}
function ycMerge(doc,node,before,after){
 if(ycSame(before,after))return node;
 if(DevKitYAML.isMap(node)&&ycMap(before)&&ycMap(after)){
  const oldKeys=Object.keys(before),newKeys=Object.keys(after),pairs=new Map(node.items.map(pair=>[ycKey(pair),pair]));let rename=null;const removed=oldKeys.filter(key=>!Object.hasOwn(after,key)),added=newKeys.filter(key=>!Object.hasOwn(before,key));if(removed.length===1&&added.length===1&&oldKeys.indexOf(removed[0])===newKeys.indexOf(added[0]))rename={from:removed[0],to:added[0]};
  node.items=newKeys.map(key=>{let oldKey=key,pair=pairs.get(key);if(!pair&&rename?.to===key){oldKey=rename.from;pair=pairs.get(oldKey);if(DevKitYAML.isScalar(pair?.key))pair.key.value=key;else if(pair)pair.key=doc.createNode(key);}if(!pair)return new DevKitYAML.Pair(doc.createNode(key),doc.createNode(after[key]));pair.value=ycMerge(doc,pair.value,before[oldKey],after[key]);return pair;});return node;
 }
 if(DevKitYAML.isSeq(node)&&Array.isArray(before)&&Array.isArray(after)){
  const old=before.map((value,index)=>({value,index,node:node.items[index],used:false}));node.items=after.map((value,index)=>{let match=old.find(item=>!item.used&&ycSame(item.value,value));const identity=ycIdentity(value);if(!match&&identity)match=old.find(item=>!item.used&&ycIdentity(item.value)===identity);if(!match&&before.length===after.length&&!old[index].used)match=old[index];if(!match)return doc.createNode(value);match.used=true;return ycMerge(doc,match.node,match.value,value);});return node;
 }
 const beforeType=before===null?'null':typeof before,afterType=after===null?'null':typeof after;if(DevKitYAML.isScalar(node)&&beforeType===afterType){node.value=after;return node;}return ycTransfer(node,doc.createNode(after));
}
function ycRenderValues(source,values){const docs=ycDocuments(source),before=docs.map(doc=>doc.toJS({maxAliasCount:100}));values.forEach(ycCheck);const out=[];for(let index=0;index<values.length;index++){let doc=docs[index];if(!doc){doc=new DevKitYAML.Document(values[index]);doc.directives.docStart=index>0||values.length>1;}else doc.contents=ycMerge(doc,doc.contents,before[index],values[index]);if(values.length>1&&index>0)doc.directives.docStart=true;out.push(doc.toString({lineWidth:0}));}return out.join('');}
function ycProfile(profile){const schema=typeof dkSchemaGet==='function'&&dkSchemaGet(profile?.id);return schema?.editor?.preserveSyntax==='yaml-cst'||['yaml','github-actions','gitlab-ci'].includes(profile?.id);}
function ycRenderBlocks(source,profile,blocks){if(!ycProfile(profile))throw Error('This editor does not use YAML documents.');const generated=profile.generate(blocks),values=sxSafeData(generated);return ycRenderValues(source,values);}
function ycRenderDraft(draft){const profile=dkSchemaProfile(draft.profile)||DD_PROFILES[draft.profile];return ycRenderBlocks(draft.sxCode,profile,draft.blocks);}
