/* Reorder siblings only: moving a task never turns it into a module parameter. */
let adDrag=null;
function adRows(){return [...document.querySelectorAll('#ab-fields > .ab-field, #ab-fields > .ab-list-item')];}
function adMove(from,to){
 const scope=abGet(),size=Array.isArray(scope)?scope.length:anMap(scope)?Object.keys(scope).length:0;
 if(from===to||from<0||to<0||from>=size||to>=size)return false;
 abEdit(()=>{
  if(Array.isArray(scope)){const next=scope.slice();next.splice(to,0,next.splice(from,1)[0]);abSet(abState.path,next);}
  else {const entries=Object.entries(scope);entries.splice(to,0,entries.splice(from,1)[0]);abSet(abState.path,Object.fromEntries(entries));}
 });
 const handle=adRows()[to]?.querySelector('.ad-handle');handle?.focus({preventScroll:true});
 document.getElementById('ad-status').textContent='Block moved to position '+(to+1)+'. YAML updated. Undo restores the previous order.';
 return true;
}
function adCleanup(){
 if(!adDrag)return;const drag=adDrag;adDrag=null;cancelAnimationFrame(drag.frame);
 try{if(drag.handle.hasPointerCapture(drag.id))drag.handle.releasePointerCapture(drag.id);}catch(e){}
 drag.ghost?.remove();document.getElementById('ab-dialog').classList.remove('ad-dragging');
 for(const row of drag.rows)row.classList.remove('ad-source','ad-before','ad-after');
}
function adLocate(){
 const d=adDrag;if(!d?.active)return;
 const canvas=document.querySelector('.ab-canvas'),rect=canvas.getBoundingClientRect();
 const last=d.rows.at(-1)?.getBoundingClientRect(),first=d.rows[0]?.getBoundingClientRect();
 d.valid=d.x>=rect.left&&d.x<=rect.right&&d.y>=Math.max(rect.top,first.top-30)&&d.y<=Math.min(rect.bottom,last.bottom+35);
 for(const row of d.rows)row.classList.remove('ad-before','ad-after');
 if(!d.valid){d.slot=null;return;}
 d.slot=d.rows.findIndex(row=>{const r=row.getBoundingClientRect();return d.y<r.top+r.height/2;});
 if(d.slot<0)d.slot=d.rows.length;
 const dest=d.slot>d.from?d.slot-1:d.slot;
 if(dest!==d.from){if(d.slot===d.rows.length)d.rows.at(-1).classList.add('ad-after');else d.rows[d.slot].classList.add('ad-before');}
}
function adFrame(){
 const d=adDrag;if(!d?.active)return;
 const canvas=document.querySelector('.ab-canvas'),r=canvas.getBoundingClientRect();
 if(d.x>=r.left&&d.x<=r.right){const margin=55;const speed=d.y<r.top+margin?-Math.min(14,(r.top+margin-d.y)/4):d.y>r.bottom-margin?Math.min(14,(d.y-r.bottom+margin)/4):0;if(speed)canvas.scrollTop+=speed;}
 adLocate();d.frame=requestAnimationFrame(adFrame);
}
function adStart(event,handle,index){
 if(event.button!==0||event.isPrimary===false)return;
 adCleanup();event.preventDefault();handle.focus({preventScroll:true});
 adDrag={id:event.pointerId,handle,from:index,rows:adRows(),startX:event.clientX,startY:event.clientY,x:event.clientX,y:event.clientY,active:false,slot:null,valid:false,frame:0};
 handle.setPointerCapture(event.pointerId);
}
function adPointerMove(event){
 const d=adDrag;if(!d||d.id!==event.pointerId)return;
 d.x=event.clientX;d.y=event.clientY;
 if(!d.active&&Math.hypot(d.x-d.startX,d.y-d.startY)>5){d.active=true;d.rows[d.from].classList.add('ad-source');document.getElementById('ab-dialog').classList.add('ad-dragging');d.ghost=abNode('div','ad-ghost','↕ '+d.handle.dataset.label);document.getElementById('ab-dialog').append(d.ghost);d.frame=requestAnimationFrame(adFrame);}
 if(d.active){event.preventDefault();d.ghost.style.left=Math.min(d.x+15,window.innerWidth-190)+'px';d.ghost.style.top=(d.y+12)+'px';adLocate();}
}
function adEnd(event){const d=adDrag;if(!d||d.id!==event.pointerId)return;adLocate();const from=d.from,to=d.slot>d.from?d.slot-1:d.slot,commit=d.active&&d.valid&&d.slot!==null;adCleanup();if(commit)adMove(from,to);}
function adAttach(){
 const rows=adRows();const scope=abGet();if(rows.length<2||(!Array.isArray(scope)&&!anMap(scope)))return;
 const keys=Array.isArray(scope)?null:Object.keys(scope);
 // JavaScript enumerates integer-like mapping keys in numeric order. Do not offer a misleading drag affordance for those mappings.
 if(keys?.some(key=>/^(0|[1-9]\d*)$/.test(key)) )return;
 rows.forEach((row,index)=>{
  const label=keys?auLabel(keys[index]):abTitle(scope[index],index,abType([...abState.path,index]));
  const handle=abButton('⠿',()=>{},'ad-handle');handle.dataset.label=label;handle.setAttribute('aria-label','Reorder '+label);handle.title='Drag to reorder. Keyboard: ↑ / ↓. Escape cancels a drag.';
  handle.setAttribute('aria-describedby','ad-help');row.querySelector('.ab-field-top')?.prepend(handle);
  handle.addEventListener('pointerdown',event=>adStart(event,handle,index));handle.addEventListener('pointermove',adPointerMove);handle.addEventListener('pointerup',adEnd);handle.addEventListener('pointercancel',adCleanup);handle.addEventListener('lostpointercapture',()=>{if(adDrag?.handle===handle)adCleanup();});
  handle.addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();adMove(index,index+(event.key==='ArrowUp'?-1:1));}});
 });
 const help=abNode('p','ad-help','Drag ⠿ to reorder blocks at this level. Their order is copied into the YAML.');help.id='ad-help';document.getElementById('ab-fields').prepend(help);
}
const adPreviousRender=abRender;
abRender=function(){adCleanup();adPreviousRender();adAttach();};
document.getElementById('ab-dialog').insertAdjacentHTML('beforeend','<div id="ad-status" class="ad-status" role="status" aria-live="polite"></div>');
document.getElementById('ab-dialog').addEventListener('keydown',event=>{if(event.key==='Escape'&&adDrag){event.preventDefault();event.stopImmediatePropagation();adCleanup();}},true);
