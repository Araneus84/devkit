/* Python operations and offline source-to-block conversion. */
const PY_OPS={};
const pyP=DD_PROFILES.python,pyName=(label,value)=>ddName(label,value),pyExpr=(label,value)=>ddField(label,value,'expression');
function pyOp(id,label,group,hint,fields,emit,imports=[]){PY_OPS[id]={label,group,hint,emit,imports};pyP.types[id]=ddType(label,hint,fields);}
pyOp('py_import','Import a module','Modules','Enter an installed module name and an optional short alias.',{module:ddField('Module','numpy'),alias:ddField('Alias (optional)','np','text',{required:false})},v=>'import '+v.module+(v.alias?' as '+v.alias:''));
pyOp('py_from','Import from a module','Modules','Import a named function or class from an installed module.',{module:ddField('Module','pathlib'),member:ddField('Name to import','Path'),alias:ddField('Alias (optional)','','text',{required:false})},v=>'from '+v.module+' import '+v.member+(v.alias?' as '+v.alias:''));
pyOp('py_assign','Set a value / expression','Basics','Name the result, then enter a Python value or expression. For literal text use Set a variable.',{name:pyName('Save as','result'),expression:pyExpr('Python value or expression','42')},v=>v.name+' = '+v.expression);
pyOp('py_call','Call a function','Basics','Use the function name and one argument per block. No commas or parentheses to remember.',{function:ddField('Function','print'),result:ddField('Save result as (optional)','','name',{required:false})},()=>null);
pyP.types.py_call.slots={args:ddSlot('Arguments',['py_arg'])};
pyP.types.py_arg=ddType('Function argument','Choose literal text, an expression, or a variable. A keyword is optional.',{keyword:ddField('Keyword (optional)','','name',{required:false}),mode:ddChoice('Value kind','expression',['expression','literal','variable']),value:ddField('Value','message','multiline')});
pyOp('py_csv','Read CSV','pandas','Load a CSV file into a table called a DataFrame.',{path:ddField('CSV file','data.csv'),result:pyName('Save table as','df')},v=>v.result+' = pd.read_csv('+JSON.stringify(v.path)+')',['pandas']);
pyOp('py_excel_read','Read Excel table','Excel','Read an .xlsx worksheet using pandas and openpyxl.',{path:ddField('Excel file','input.xlsx'),sheet:ddField('Worksheet','Sheet1'),result:pyName('Save table as','df')},v=>v.result+' = pd.read_excel('+JSON.stringify(v.path)+', sheet_name='+JSON.stringify(v.sheet)+', engine="openpyxl")',['pandas','openpyxl']);
pyOp('py_excel_write','Write Excel table','Excel','Save a DataFrame to an .xlsx file.',{table:pyName('Table variable','df'),path:ddField('Output file','output.xlsx'),sheet:ddField('Worksheet','Results'),index:ddChoice('Include row index','False',['False','True'])},v=>v.table+'.to_excel('+JSON.stringify(v.path)+', sheet_name='+JSON.stringify(v.sheet)+', index='+v.index+', engine="openpyxl")',['pandas','openpyxl']);
pyOp('py_csv_write','Write CSV','pandas','Save a table to a CSV file.',{table:pyName('Table variable','df'),path:ddField('Output file','output.csv'),index:ddChoice('Include row index','False',['False','True'])},v=>v.table+'.to_csv('+JSON.stringify(v.path)+', index='+v.index+')',['pandas']);
pyOp('py_head','Preview table rows','pandas','Print the first rows of a table.',{table:pyName('Table variable','df'),rows:ddField('Number of rows','5','integer')},v=>'print('+v.table+'.head('+v.rows+'))',['pandas']);
pyOp('py_filter','Filter table rows','pandas','Keep rows that match a column comparison.',{table:pyName('Table variable','df'),column:ddField('Column','status'),operator:ddChoice('Comparison','==',['==','!=','>','>=','<','<=']),kind:ddChoice('Compare with','text',['text','number']),value:ddField('Value','active'),result:pyName('Save filtered table as','filtered')},v=>{if(v.kind==='number'&&!/^-?\d+(?:\.\d+)?$/.test(v.value))throw Error('Filter comparison requires a number.');return v.result+' = '+v.table+'['+v.table+'['+JSON.stringify(v.column)+'] '+v.operator+' '+(v.kind==='text'?JSON.stringify(v.value):v.value)+']';},['pandas']);
pyOp('py_dropna','Remove missing rows','pandas','Create a table without rows containing missing values.',{table:pyName('Table variable','df'),result:pyName('Save cleaned table as','clean')},v=>v.result+' = '+v.table+'.dropna()',['pandas']);
pyOp('py_array','Create NumPy array','NumPy','Enter numbers separated by spaces, commas or newlines.',{numbers:ddField('Numbers','1, 2, 3','multiline'),result:pyName('Save array as','values')},v=>{const a=v.numbers.trim().split(/[\s,]+/);if(!a.length||a.some(x=>!/^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(x)||!Number.isFinite(+x)))throw Error('Enter numeric array values.');return v.result+' = np.array(['+a.join(', ')+'])';},['numpy']);
pyOp('py_stats','Array statistic','NumPy','Choose the calculation to perform.',{array:pyName('Array variable','values'),operation:ddChoice('Calculation','mean',['mean','sum','min','max','std','median']),result:pyName('Save result as','average')},v=>v.result+' = np.'+v.operation+'('+v.array+')',['numpy']);
pyOp('py_workbook','Open Excel workbook','Excel','Open an .xlsx workbook for cell-level editing with openpyxl.',{path:ddField('Workbook file','input.xlsx'),result:pyName('Workbook variable','wb')},v=>v.result+' = openpyxl.load_workbook('+JSON.stringify(v.path)+')',['openpyxl']);
pyOp('py_cell','Set an Excel cell','Excel','Write a text value to a worksheet cell.',{book:pyName('Workbook variable','wb'),sheet:ddField('Worksheet','Sheet1'),cell:ddField('Cell address','A1'),value:ddField('Cell text','Hello')},v=>v.book+'['+JSON.stringify(v.sheet)+']['+JSON.stringify(v.cell)+'] = '+JSON.stringify(v.value),['openpyxl']);
pyOp('py_savebook','Save Excel workbook','Excel','Write your edited workbook to a file.',{book:pyName('Workbook variable','wb'),path:ddField('Output workbook','edited.xlsx')},v=>v.book+'.save('+JSON.stringify(v.path)+')',['openpyxl']);
pyOp('py_image','Read image','OpenCV','Load an image. Check that the result is not None before processing it.',{path:ddField('Image file','input.png'),result:pyName('Image variable','image')},v=>v.result+' = cv2.imread('+JSON.stringify(v.path)+')',['opencv']);
pyOp('py_gray','Convert image to grayscale','OpenCV','Convert an OpenCV BGR image into grayscale.',{image:pyName('Image variable','image'),result:pyName('Save image as','gray')},v=>v.result+' = cv2.cvtColor('+v.image+', cv2.COLOR_BGR2GRAY)',['opencv']);
pyOp('py_resize','Resize image','OpenCV','Choose the output width and height in pixels.',{image:pyName('Image variable','image'),width:ddField('Width','640','integer'),height:ddField('Height','480','integer'),result:pyName('Save image as','resized')},v=>{if(+v.width<1||+v.height<1)throw Error('Image dimensions must be positive.');return v.result+' = cv2.resize('+v.image+', ('+v.width+', '+v.height+'))';},['opencv']);
pyOp('py_imwrite','Write image','OpenCV','Save an image; the result reports whether writing succeeded.',{image:pyName('Image variable','image'),path:ddField('Output image','output.png'),result:pyName('Success variable','saved')},v=>v.result+' = cv2.imwrite('+JSON.stringify(v.path)+', '+v.image+')',['opencv']);
const PY_PACKAGES={numpy:{title:'NumPy',pip:'numpy',module:'numpy',alias:'np'},pandas:{title:'pandas',pip:'pandas',module:'pandas',alias:'pd'},openpyxl:{title:'Excel / openpyxl',pip:'openpyxl',module:'openpyxl',alias:''},opencv:{title:'OpenCV',pip:'opencv-python',module:'cv2',alias:''}};
const pyStatements=[...pyP.root.accept,...Object.keys(PY_OPS),'py_if','py_for','py_function','py_while'];
pyP.types.py_if=ddType('If / else condition','Type a condition, or use the guided If / else block from Basics.',{condition:pyExpr('Condition','image is not None')},{then:ddSlot('Then',pyStatements),else:ddSlot('Otherwise',pyStatements)});
pyP.types.py_for=ddType('For each / range','Loop over an iterable such as range(10), rows, or df.columns.',{target:pyExpr('Item variable','item'),iterable:pyExpr('Items / iterable','range(10)')},{body:ddSlot('Loop steps',pyStatements)});
pyP.types.py_while=ddType('While condition','Repeat steps while the condition is true.',{condition:pyExpr('Condition','running')},{body:ddSlot('Loop steps',pyStatements)});
pyP.types.py_function=ddType('Define a function','Create a reusable function; parameters can be left empty.',{name:pyName('Function name','main'),params:ddField('Parameters (optional)','','text',{required:false})},{body:ddSlot('Function steps',pyStatements)});
pyP.root.accept=pyStatements;
for(const def of Object.values(pyP.types))for(const slot of Object.values(def.slots))if(slot.accept.includes('variable'))slot.accept=pyStatements;
const pyLegacyGenerate=pyP.generate;
function pyEmit(n){const v=n.values,s=n.slots;
 if(n.type==='py_call')return (v.result?v.result+' = ':'')+v.function+'('+s.args.map(a=>(a.values.keyword?a.values.keyword+'=':'')+(a.values.mode==='literal'?JSON.stringify(a.values.value):a.values.value)).join(', ')+')';
 if(PY_OPS[n.type])return PY_OPS[n.type].emit(v);
 const body=nodes=>ddIndent(nodes.some(n=>n.type!=='comment')?pyBody(nodes):(nodes.length?pyBody(nodes)+'\n':'')+'pass',2);
 if(n.type==='py_if')return 'if '+v.condition+':\n'+body(s.then)+(s.else.length?'\nelse:\n'+body(s.else):'');
 if(n.type==='py_for')return 'for '+v.target+' in '+v.iterable+':\n'+body(s.body);
 if(n.type==='py_while')return 'while '+v.condition+':\n'+body(s.body);
 if(n.type==='py_function')return 'def '+v.name+'('+v.params+'):\n'+body(s.body);
 return null;
}
function pyBody(nodes){return nodes.map(n=>{const own=pyEmit(n);const text=own!==null?own:pyLegacyGenerate([n]).replace(/^#![^\n]*\nimport subprocess\n\n/,'').replace(/\n$/,'');return text+(n.pyComment?' '+n.pyComment:'');}).join('\n');}
function pyWalk(nodes,fn){for(const n of nodes){fn(n);Object.values(n.slots).forEach(children=>pyWalk(children,fn));}}
function pyRequirements(nodes){const used=new Set();pyWalk(nodes,n=>{for(const pkg of PY_OPS[n.type]?.imports||[])used.add(pkg);if(['py_import','py_from'].includes(n.type))for(const [id,p] of Object.entries(PY_PACKAGES))if(n.values.module===p.module)used.add(id);});return [...used];}
pyP.generate=nodes=>{const imports=[];const explicit=new Map();pyWalk(nodes,n=>{if(n.type==='py_import')explicit.set(n.values.alias||n.values.module,n.values.module);});for(const id of pyRequirements(nodes)){const p=PY_PACKAGES[id],binding=p.alias||p.module;if(explicit.has(binding)&&explicit.get(binding)!==p.module)throw Error('The name '+binding+' is already used by another module.');if(!explicit.has(binding))imports.push('import '+p.module+(p.alias?' as '+p.alias:''));}let subprocess=false;pyWalk(nodes,n=>{if(['command','pipeline'].includes(n.type))subprocess=true;});if(subprocess&&!explicit.has('subprocess')&&!imports.includes('import subprocess'))imports.push('import subprocess');let split=0;while(split<nodes.length&&(nodes[split].type==='comment'||(nodes[split].type==='raw'&&['String','ContinuedString'].includes(DP_PARSER.parse(nodes[split].values.text).topNode.firstChild?.firstChild?.name))||(nodes[split].type==='py_from'&&nodes[split].values.module==='__future__')))split++;return (split?pyBody(nodes.slice(0,split))+'\n':'')+(imports.length?imports.join('\n')+'\n\n':'')+pyBody(nodes.slice(split))+(nodes.length?'\n':'');};
pyP.title='Python workspace';pyP.description='Choose a task from the step library, or type Python on the right. Code and blocks stay connected.';pyP.check='Python syntax is checked locally. Libraries must be installed in the environment where you run the script. This app never runs your code.';
pyP.seed=p=>[ddNode(p,'print',{mode:'literal',value:'Hello from DevKit'})];
function pySignature(nodes){return JSON.stringify(nodes.map(n=>({type:n.type,values:n.values,slots:Object.fromEntries(Object.entries(n.slots).map(([k,v])=>[k,pySignature(v)])),comment:n.pyComment||''})));}
function pyMatchCall(fn,args,result){
 const pos=args.filter(a=>!a.values.keyword).map(a=>a.values),kw=Object.fromEntries(args.filter(a=>a.values.keyword).map(a=>[a.values.keyword,a.values]));const lit=v=>v?.mode==='literal'?v.value:null,expr=v=>v?.mode!=='literal'?v?.value:null,keys=(...expected)=>Object.keys(kw).every(k=>expected.includes(k)),make=(type,v)=>ddNode(pyP,type,v);let m;
 if(fn==='pd.read_excel'&&result&&pos.length===1&&lit(pos[0])!==null&&keys('sheet_name','engine')&&lit(kw.sheet_name)!==null&&lit(kw.engine)==='openpyxl')return make('py_excel_read',{path:lit(pos[0]),sheet:lit(kw.sheet_name),result});
 if((m=/^(\w+)\.to_excel$/.exec(fn))&&!result&&pos.length===1&&lit(pos[0])!==null&&keys('sheet_name','index','engine')&&lit(kw.sheet_name)!==null&&['True','False'].includes(expr(kw.index))&&lit(kw.engine)==='openpyxl')return make('py_excel_write',{table:m[1],path:lit(pos[0]),sheet:lit(kw.sheet_name),index:expr(kw.index)});
 if((m=/^(\w+)\.to_csv$/.exec(fn))&&!result&&pos.length===1&&lit(pos[0])!==null&&keys('index')&&['True','False'].includes(expr(kw.index)))return make('py_csv_write',{table:m[1],path:lit(pos[0]),index:expr(kw.index)});
 if((m=/^(\w+)\.dropna$/.exec(fn))&&result&&!args.length)return make('py_dropna',{table:m[1],result});
 if(fn==='openpyxl.load_workbook'&&result&&pos.length===1&&lit(pos[0])!==null&&keys())return make('py_workbook',{path:lit(pos[0]),result});
 if(fn==='cv2.cvtColor'&&result&&pos.length===2&&/^\w+$/.test(expr(pos[0])||'')&&expr(pos[1])==='cv2.COLOR_BGR2GRAY'&&keys())return make('py_gray',{image:expr(pos[0]),result});
 if(fn==='cv2.resize'&&result&&pos.length===2&&/^\w+$/.test(expr(pos[0])||'')&&(m=/^\(\s*(\d+)\s*,\s*(\d+)\s*\)$/.exec(expr(pos[1])||''))&&keys())return make('py_resize',{image:expr(pos[0]),width:m[1],height:m[2],result});
 if(fn==='cv2.imwrite'&&result&&pos.length===2&&lit(pos[0])!==null&&/^\w+$/.test(expr(pos[1])||'')&&keys())return make('py_imwrite',{path:lit(pos[0]),image:expr(pos[1]),result});
 return null;
}
function pyParse(source){if(source.length>1000000)throw Error('Python editing is limited to 1 MB.');const tree=DP_PARSER.parse(source);let problem=null;tree.iterate({enter:n=>{if(n.type.isError&&!problem)problem=n.from;}});if(problem!==null)throw Error('Check Python syntax near line '+(source.slice(0,problem).split('\n').length)+'. Your code is saved; blocks still show the last valid version.');
 const text=n=>source.slice(n.from,n.to),kids=n=>{const a=[];for(let c=n.firstChild;c;c=c.nextSibling)a.push(c);return a;},make=(t,v={},s={})=>ddNode(pyP,t,v,s);
 const stringValue=s=>{if(/^"(?:[^"\\]|\\.)*"$/.test(s))try{return JSON.parse(s);}catch(e){}if(/^'(?:[^'\\]|\\.)*'$/.test(s)&&!s.includes('\\'))return s.slice(1,-1);return null;};
 function dedent(n){const col=n.from-(source.lastIndexOf('\n',n.from-1)+1);return text(n).split('\n').map((l,i)=>i?l.replace(new RegExp('^[ \\t]{0,'+col+'}'),''):l).join('\n');}
 function block(n){const code=text(n),children=kids(n);let m;
  if(n.name==='Comment')return make('comment',{text:code.replace(/^# ?/,'')});
  if(n.name==='ImportStatement'){
   if((m=/^import ([\w.]+)(?: as (\w+))?$/.exec(code)))return make('py_import',{module:m[1],alias:m[2]||''});
   if((m=/^from ([\w.]+) import (\w+)(?: as (\w+))?$/.exec(code)))return make('py_from',{module:m[1],member:m[2],alias:m[3]||''});
  }
  if(n.name==='AssignStatement'&&(m=/^([A-Za-z_]\w*)\s*=\s*([^=][\s\S]*)$/.exec(code))&&!children.some(c=>c.name==='TypeDef')&&!children.filter(c=>c.name==='AssignOp').slice(1).length){const expr=m[2].trim(),known=recognize(expr,m[1]);if(known)return known;const literal=stringValue(expr);if(literal!==null)return make('variable',{name:m[1],mode:'literal',value:literal});return make('py_assign',{name:m[1],expression:expr});}
  if(n.name==='ExpressionStatement'){const known=recognize(code,'');if(known)return known;}
  const bodies=children.filter(c=>c.name==='Body');
  // Unsupported compound forms remain complete raw blocks, including their children.
  if(!/'''|"""/.test(code)){
   if(n.name==='IfStatement'&&!children.some(c=>c.name==='elif')&&bodies.length<=2){const condition=source.slice(n.from+2,bodies[0].from).trim();return make('py_if',{condition},{then:container(bodies[0]),else:bodies[1]?container(bodies[1]):[]});}
   if(n.name==='ForStatement'&&!/^async\b/.test(code)&&bodies.length===1&&(m=/^for ([\s\S]+?) in ([\s\S]+)$/.exec(source.slice(n.from,bodies[0].from).trim())))return make('py_for',{target:m[1],iterable:m[2]},{body:container(bodies[0])});
   if(n.name==='WhileStatement'&&bodies.length===1)return make('py_while',{condition:source.slice(n.from+5,bodies[0].from).trim()},{body:container(bodies[0])});
   if(n.name==='FunctionDefinition'&&(m=/^def (\w+)\(([^\n]*)\)$/.exec(source.slice(n.from,bodies[0].from).trim())))return make('py_function',{name:m[1],params:m[2]},{body:container(bodies[0])});
  }
  return make('raw',{text:dedent(n)});
 }
 function recognize(expr,result){let m;const unquote=s=>stringValue(s);const q='("(?:[^"\\\\]|\\\\.)*"|\'[^\']*\')';
  if((m=new RegExp('^pd\\.read_csv\\('+q+'\\)$').exec(expr))&&unquote(m[1])!==null&&result)return make('py_csv',{path:unquote(m[1]),result});
  if((m=/^np\.array\(\[([\d\s.,eE+\-]+)\]\)$/.exec(expr))&&result)return make('py_array',{numbers:m[1],result});
  if((m=/^np\.(mean|sum|min|max|std|median)\((\w+)\)$/.exec(expr))&&result)return make('py_stats',{operation:m[1],array:m[2],result});
  if((m=new RegExp('^cv2\\.imread\\('+q+'\\)$').exec(expr))&&result&&unquote(m[1])!==null)return make('py_image',{path:unquote(m[1]),result});
  if((m=/^print\((.*)\)$/.exec(expr))&&!result){const parsed=DP_PARSER.parse(expr).topNode.firstChild?.firstChild;const args=parsed?.getChild('ArgList');if(args){const list=kids(args).filter(c=>!['(',')',','].includes(c.name));if(list.length===1){const value=m[1],literal=unquote(value);return make('print',{mode:literal!==null?'literal':/^[A-Za-z_]\w*$/.test(value)?'variable':'expression',value:literal!==null?literal:value});}}}
  const call=DP_PARSER.parse(expr).topNode.firstChild?.firstChild;if(call?.name==='CallExpression'){const children=kids(call),args=children.find(n=>n.name==='ArgList');const fn=textOf(expr,children[0]);if(!/^[A-Za-z_]\w*(\.[A-Za-z_]\w*)*$/.test(fn))return null;const argChildren=kids(args).filter(c=>!['(',')',','].includes(c.name));const resultArgs=[];for(let i=0;i<argChildren.length;i++){let c=argChildren[i],keyword='';if(argChildren[i+1]?.name==='AssignOp'){keyword=textOf(expr,c);i+=2;c=argChildren[i];}if(!c||['*','**'].includes(c.name))return null;const value=textOf(expr,c),literal=unquote(value);resultArgs.push(make('py_arg',{keyword,mode:literal!==null?'literal':'expression',value:literal!==null?literal:value}));}return pyMatchCall(fn,resultArgs,result)||make('py_call',{function:fn,result},{args:resultArgs});}
  return null;
 }
 function textOf(s,n){return s.slice(n.from,n.to);}
 function container(parent){const nodes=[];for(const child of kids(parent)){if(child.name===':'||child.name==='⚠')continue;if(child.name==='Comment'&&nodes.length&&source.slice(0,child.from).split('\n').length===source.slice(0,(child.prevSibling?.to||0)).split('\n').length){nodes.at(-1).pyComment=text(child);continue;}if(child.type.is('Statement')||['Comment','AssignStatement','ExpressionStatement'].includes(child.name))nodes.push(block(child));}return nodes;}
 return container(tree.topNode);
}
