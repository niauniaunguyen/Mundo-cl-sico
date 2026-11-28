// ============================================================ entrada
function requestPointer(){if(isTouch)return;try{const p=canvas.requestPointerLock&&canvas.requestPointerLock();if(p&&p.catch)p.catch(()=>{});}catch(e){}}
function releasePointer(){if(document.pointerLockElement)try{document.exitPointerLock();}catch(e){}keys.w=keys.a=keys.s=keys.d=false;}
// la cámara gira con solo mover el ratón: con el puntero capturado (clic) o sin capturar; sin captura, el cursor en el borde izquierdo o derecho sigue girando.
// Sin captura, el punto de mira (#cross) sigue al cursor y E apunta a lo que hay bajo él; con captura, vuelve al centro.
let dragging=false,lastMX=-1,lastMY=-1,mouseIn=false,crossT=0;
document.addEventListener('mouseleave',()=>{mouseIn=false;});
window.addEventListener('mouseout',e=>{if(!e.relatedTarget&&!e.toElement){mouseIn=false;lastMX=-1;}});window.addEventListener('blur',()=>{mouseIn=false;lastMX=-1;});   // el cursor sale de la ventana: que la cámara no siga girando sola
function freeAim(){return ui==='play'&&!isTouch&&!document.pointerLockElement&&lastMX>=0;}
function placeCross(){const c=$('cross');if(!c)return;const f=freeAim();c.style.left=f?lastMX+'px':'50%';c.style.top=f?lastMY+'px':'50%';canvas.classList.toggle('free',f);}
document.addEventListener('pointerlockchange',placeCross);
// dirección (yaw) a la que apunta el punto de mira: el centro de la pantalla o, sin captura, el cursor
function aimYaw(){if(!freeAim())return player.yaw;const nx=(lastMX/innerWidth)*2-1,t=Math.tan(camera.fov*Math.PI/360)*camera.aspect;return player.yaw-Math.atan(nx*t);}
canvas.addEventListener('mousedown',e=>{if(ui!=='play')return;if(!document.pointerLockElement)requestPointer();dragging=true;lastMX=e.clientX;lastMY=e.clientY;});
window.addEventListener('mouseup',()=>dragging=false);
window.addEventListener('mousemove',e=>{if(ui!=='play')return;let dx=0,dy=0;
  if(document.pointerLockElement===canvas){dx=e.movementX;dy=e.movementY;}
  else{mouseIn=true;if(lastMX>=0){dx=e.clientX-lastMX;dy=e.clientY-lastMY;}lastMX=e.clientX;lastMY=e.clientY;if(Math.abs(dx)>200||Math.abs(dy)>200)dx=dy=0;placeCross();}
  player.yaw-=dx*0.0024;player.pitch=clamp(player.pitch-dy*0.0024,-1.4,1.4);});
const KMAP={KeyW:'w',ArrowUp:'w',KeyS:'s',ArrowDown:'s',KeyA:'a',ArrowLeft:'a',KeyD:'d',ArrowRight:'d',ShiftLeft:'run',ShiftRight:'run',Space:'jump',KeyC:'down'};
// salto y doble salto: en el aire se puede dar un segundo impulso (sirve para salir de huecos y subir a bordes altos)
function jump(){if(ui!=='play'||FLY.on)return;const k=MOUNT.riding?horseJump():1;const ka=k*(qLv('ar')>=2?1.15:1);const nw=performance.now();if(player.grounded||(nw-(player.lastG||0)<120&&!(player.jumps>0))){player.vy=5.2*ka;player.grounded=false;player.jumps=1;player.jbuf=0;}else if((player.jumps||0)<2){player.vy=5.6*ka;player.jumps=2;player.jbuf=0;}else player.jbuf=nw;}   // margen de 0,12 s al dejar el suelo; si se pulsa en el aire sin saltos, se recuerda 0,15 s
window.addEventListener('keydown',e=>{
  if(AUD.ctx&&AUD.ctx.state==='suspended')AUD.ctx.resume();
  if(e.target&&e.target.tagName==='INPUT'){if(e.code==='Escape')closeModals();return;}
  if(ui==='library'){if(e.code==='KeyB'||e.code==='Escape')closeModals();return;}
  if(ui==='start'){return;}
  if(ui==='profe'){if(e.code==='Escape')profeClose();return;}
  if(ui==='tour'){if(e.code==='Enter'||e.code==='Space'){e.preventDefault();const b=document.querySelector('#tourSea .nx');if(b)b.click();}return;}
  if(ui==='sea'){seaKey(e,true);return;}
  if(ui==='episode'){epiKey(e);return;}
  if(ui==='dialog'){const n=parseInt(e.key,10);if(n>=1&&n<=9){const b=$('dOpts').querySelectorAll('button')[n-1];if(b){b.click();e.preventDefault();}}if(e.code==='Escape'){closeDialog();}return;}
  if(ui==='journal'){if(e.code==='KeyJ'||e.code==='Escape')closeModals();return;}
  if(ui==='map'){if(e.code==='KeyM'||e.code==='Escape')closeModals();return;}
  if(e.code==='Backspace'&&TUT.on){e.preventDefault();tutEnd(true);return;}   // saltar el tutorial sin soltar el ratón
  if(e.code==='KeyY'&&TLK.last&&TLK.last.d.isConnected){const L=TLK.last;TLK.last=null;L.d.remove();toastOpen(L.T);return;}   // abrir el último aviso
  if(KMAP[e.code]){keys[KMAP[e.code]]=true;e.preventDefault();}
  if(e.code==='Space'&&!e.repeat)jump();
  if(e.code==='KeyE'){if(BOAT.on)boatExit();else if(typeof horseNear==='function'&&horseNear()&&hz().own&&(!focus||Math.hypot(focus.x-player.x,focus.z-player.z)>2.5))mountHorse();else interact();}
  if(e.code==='Enter'&&NET.room){e.preventDefault();netChatOpen();return;}
  if(e.code==='KeyG'&&storyOn())storyGo();
  if(e.code==='KeyX')toggleWings();
  if(e.code==='KeyO')v2Sit();
  if(e.code==='KeyJ')openJournal();
  if(e.code==='Backquote'||e.key==='º'){e.preventDefault();profeOpen();}
  if(e.code==='KeyM')openMap();
  if(e.code==='KeyB')openLibrary();
  if(e.code==='KeyT')advanceTime();
  if(e.code==='KeyN')toggleSound();
  if(e.code==='KeyH')callHorse();
  if(e.code==='KeyV')toggleView();
  if(e.code==='KeyK')gfToggleMotion();
  if(e.code==='KeyF')toggleTorch();
});
window.addEventListener('pointerdown',()=>{if(AUD.ctx&&AUD.ctx.state==='suspended')AUD.ctx.resume();});
window.addEventListener('keyup',e=>{if(ui==='sea')seaKey(e,false);if(KMAP[e.code])keys[KMAP[e.code]]=false;});
window.addEventListener('blur',()=>{for(const k in keys)keys[k]=false;SEAG.kL=SEAG.kR=SEAG.ear=false;});

// táctil
if(isTouch){
  const jz=$('joy'),kn=$('knob');let jid=null,lookId=null,lx=0,ly=0;
  jz.addEventListener('touchstart',e=>{const t=e.changedTouches[0];jid=t.identifier;e.preventDefault();},{passive:false});
  jz.addEventListener('touchmove',e=>{for(const t of e.changedTouches)if(t.identifier===jid){const r=jz.getBoundingClientRect();let dx=t.clientX-(r.left+r.width/2),dy=t.clientY-(r.top+r.height/2);const L=Math.hypot(dx,dy),m=50;if(L>m){dx*=m/L;dy*=m/L;}joy.x=dx/m;joy.y=dy/m;kn.style.transform='translate('+dx+'px,'+dy+'px)';}e.preventDefault();},{passive:false});
  const endJ=e=>{for(const t of e.changedTouches)if(t.identifier===jid){jid=null;joy.x=joy.y=0;kn.style.transform='';}};
  jz.addEventListener('touchend',endJ);jz.addEventListener('touchcancel',endJ);
  // toque rápido en la zona de mirar (sin arrastrar) = saltar: con el otro pulgar en el joystick, se salta en la dirección en que vas
  let lt0=0,lmov=0;
  canvas.addEventListener('touchstart',e=>{if(ui!=='play')return;const t=e.changedTouches[0];lookId=t.identifier;lx=t.clientX;ly=t.clientY;lt0=performance.now();lmov=0;},{passive:true});
  canvas.addEventListener('touchmove',e=>{for(const t of e.changedTouches)if(t.identifier===lookId){lmov+=Math.abs(t.clientX-lx)+Math.abs(t.clientY-ly);player.yaw-=(t.clientX-lx)*0.005;player.pitch=clamp(player.pitch-(t.clientY-ly)*0.005,-1.3,1.3);lx=t.clientX;ly=t.clientY;}e.preventDefault();},{passive:false});
  canvas.addEventListener('touchend',e=>{for(const t of e.changedTouches)if(t.identifier===lookId){lookId=null;if(ui==='play'&&!FLY.on&&performance.now()-lt0<250&&lmov<12&&!(typeof AT!=='undefined'&&AT.on))jump();}});
  $('tTalk').onclick=()=>{if(ui==='play')interact();};$('tJump').onclick=()=>jump();
  $('tJournal').onclick=()=>{if(ui==='play')openJournal();};$('tMap').onclick=()=>{if(ui==='play')openMap();};
  $('keys').classList.remove('show');
}

// ============================================================ interacción
let focus=null;
function findFocus(){
  const ay=aimYaw(),fx=-Math.sin(ay),fz=-Math.cos(ay);let best=null,bs=0;
  const test=(o,x,z,range)=>{const dx=x-player.x,dz=z-player.z,d=Math.hypot(dx,dz);if(d>range)return;const dot=(dx*fx+dz*fz)/(d||1);if(dot<0.35&&d>1.2)return;const sc=dot*2-d/range;if(!best||sc>bs){best=o;bs=sc;}};
  for(const n of npcObjs)if(!n.hidden)test(n,n.x,n.z,3.6);for(const o of godObjs)if(o.g.visible)test(o,o.x,o.z,4.4);for(const r of reliefObjs)test(r,r.x,r.z,3.4);for(const c of captains)test(c,c.x,c.z,3.6);for(const s of signObjs)test(s,s.x,s.z,3.2);for(const s of EPI.spheres)if(s.g.visible)test(s,s.x,s.z,3.6);for(const a of storyActors)test(a,a.x,a.z,3.6);if(DAED.g&&Math.abs(player.feet-KNOS.y)<6)test(DAED,DAED.x,DAED.z,3.6);if(FEST_ACT.o)test(FEST_ACT.o,FEST_ACT.o.x,FEST_ACT.o.z,3.6);for(const c of CARTERS)test(c,c.x,c.z,4.2);for(const o of MUSE_OBJS)test(o,o.x,o.z,3.6);for(const o of[CASA.agent,CASA.door])if(o)test(o,o.x,o.z,3.4);if(TOUR.obj&&!TOUR.on)test(TOUR.obj,TOUR.obj.x,TOUR.obj.z,3.6);if(!BOAT.on)for(const o of BOAT.docks)test(o,o.x,o.z,6);for(const F of FAUNA)if(F.A.g.visible&&Math.abs(F.obj.x-player.x)<4&&Math.abs(F.obj.z-player.z)<4)test(F.obj,F.obj.x,F.obj.z,2.6*Math.max(1,F.A.g.scale.x));for(const o of[BARCO.wright,BARCO.post])if(o)test(o,o.x,o.z,3.2);for(const o of BARCO.mats)test(o,o.x,o.z,3.4);if(player.feet>MOON.y-50)for(const o of MOON.objs)test(o,o.x,o.z,o.act==='espejo'?4.5:3.6);if(player.feet>CASA.Y-50)for(const o of CASA.objs)test(o,o.x,o.z,o.r);if(MODE==='roma')for(const o of CULT_OBJS)test(o,o.x,o.z,o.r);for(const o of EGX_OBJS)if(o.y===undefined||Math.abs(player.feet-o.y)<20)test(o,o.x,o.z,o.r);for(const o of[OLYM.mnemo,OLYM.gate,OLYM.zeus,OLYM.back])if(o)test(o,o.x,o.z,o.kind==='zeus'?5:3.8);for(const w of walkers)test(Object.assign(w,{kind:'walker'}),w.g.position.x,w.g.position.z,2.6);
  return best;
}
function interact(){if(!focus)return;gfPulse();if(TUT.on&&focus.kind!=='sign')TUT.talked=true;if(focus.kind==='npc')openDialog(focus.data);else if(focus.kind==='god')openGod(focus);else if(focus.kind==='sign')readSign(focus);else if(focus.kind==='relief')openRelief(focus);else if(focus.kind==='captain')openVoyage(focus);else if(focus.kind==='sphere')openSphere(focus);else if(focus.kind==='story')storyHook('actor',focus.id);else if(focus.kind==='daedalo')daedalusTalk();else if(focus.kind==='fest')festDialog(focus.f);else if(focus.kind==='carro')carterTalk(focus);else if(focus.kind==='musa')museTalk(focus);else if(focus.kind==='mnemo')mnemoTalk();else if(focus.kind==='olygate')olyGateTalk();else if(focus.kind==='zeus')zeusTalk();else if(focus.kind==='olyback')olyTravel(false);else if(focus.kind==='casaAgente')casaAgentTalk();else if(focus.kind==='tour')tourTalk();else if(focus.kind==='barca')boatEnter(focus);else if(focus.kind==='fauna')faunaTalk(focus.F);else if(focus.kind==='barcoW')barcoWright();else if(focus.kind==='barcoMat')barcoMat(focus);else if(focus.kind==='barcoMio')barcoMio();else if(focus.kind==='luna')moonAct(focus);else if(focus.kind==='casaPuerta')casaDoor();else if(focus.kind==='hogar')hogarAct(focus);else if(focus.kind==='culto')cultoAct(focus);else if(focus.kind==='egx')egxAct(focus);else bark(focus);}

