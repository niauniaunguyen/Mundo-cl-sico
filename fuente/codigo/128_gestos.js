// ============================================================ GESTOS: los personajes hablan con las manos, mueven la cabeza, viven en reposo y conversan en corrillos
// Brazos: giran en el hombro hacia delante (x) y hacia fuera (z). Cabeza: se le crea un cuello (pivote a 1,55 m) con las piezas de encima.
// Estilo: en Atenas, el ciudadano con himation gesticula poco (el orador «decente» habla con el brazo dentro del manto);
// en Roma, con toga, la izquierda sujeta el manto y la derecha hace el gesto (Quintiliano, Institutio oratoria 11, 3); al exclamar, adlocutio.
const GS={dlgG:null,dlgT:0,mood:0,list:new Set(),flyT:0};
function gsRig(g){const u=g.userData;if(u.gs)return u.gs;const gs=u.gs={arms:u.arms||null,base:null,head:null,t:Math.random()*5,tgt:{lx:0,lz:0,rx:0,rz:0,hx:0,hy:0,hz:0},next:2+Math.random()*8,talk:0};
  if(gs.arms){gs.base=gs.arms.map(a=>({x:a.rotation.x,z:a.rotation.z}));gs.side=gs.arms.map(a=>{const b=new THREE.Box3().setFromObject(a);const c=new THREE.Vector3();b.getCenter(c);g.worldToLocal(c);return c.x>=0?1:-1;});}
  try{const H=1.55,pv=new THREE.Group();pv.position.set(0,H,0);const mv=[];g.updateMatrixWorld(true);
    for(const ch of g.children){if(gs.arms&&gs.arms.includes(ch))continue;if(!ch.isMesh&&!ch.isGroup)continue;const b=new THREE.Box3().setFromObject(ch);if(b.isEmpty())continue;const c=new THREE.Vector3();b.getCenter(c);g.worldToLocal(c);const sz=new THREE.Vector3();b.getSize(sz);
      if(c.y>H+0.03&&sz.y<0.9)mv.push(ch);}
    if(mv.length){for(const ch of mv){g.remove(ch);ch.position.y-=H;pv.add(ch);}g.add(pv);gs.head=pv;}}catch(e){}
  return gs;}
const lp=(a,b,k)=>a+(b-a)*k;
function gsApply(g,gs,dt){const k=Math.min(1,dt*7),T=gs.tgt,px=g.position.x,pz=g.position.z,mov=gs.lx!==undefined&&Math.hypot(px-gs.lx,pz-gs.lz)>0.004;gs.lx=px;gs.lz=pz;
  if(gs.arms&&gs.base&&!g.userData.pose&&!mov){for(let i=0;i<2;i++){const a=gs.arms[i],b=gs.base[i],s=gs.side[i],tx=i?T.rx:T.lx,tz=i?T.rz:T.lz;a.rotation.x=lp(a.rotation.x,b.x+tx,k);a.rotation.z=lp(a.rotation.z,b.z+s*tz,k);}}
  if(gs.head){const h=gs.head;h.rotation.x=lp(h.rotation.x,T.hx,k*0.8);h.rotation.y=lp(h.rotation.y,T.hy,k*0.6);h.rotation.z=lp(h.rotation.z,T.hz,k*0.6);}}
// repertorio: [izq. delante, izq. fuera, der. delante, der. fuera, cabeza abajo, ladeo]
const GSET={palmas:[-0.55,0.55,-0.55,0.55,0.05,0],senala:[0,0,-1.35,0.1,-0.05,0],pecho:[0,0,-0.95,-0.45,0.12,0],encoge:[-0.35,0.45,-0.35,0.45,0,0.18],ritmo:[0,0,-0.75,0.15,0,0],
  alto:[0,0,-1.9,0.15,-0.12,0],adlocutio:[-0.3,0,-1.55,0.25,-0.08,0],manto:[-0.25,0,-0.45,0.05,0,0],cabeza:[0,0,-2.5,0.55,0.1,0.15],espalda:[0.35,0.12,0.35,0.12,0,0],pecho2:[0,0,-0.9,-0.4,0.15,0.08],brazosArriba:[-2.3,0.35,-2.3,0.35,-0.25,0]};
function gsSet(gs,n,amp,keepHead){const G=GSET[n]||[0,0,0,0,0,0],a=amp===undefined?1:amp;Object.assign(gs.tgt,{lx:G[0]*a,lz:G[1]*a,rx:G[2]*a,rz:G[3]*a});if(!keepHead){gs.tgt.hx=G[4];gs.tgt.hz=G[5];}}
function gsRest(gs){Object.assign(gs.tgt,{lx:0,lz:0,rx:0,rz:0,hx:0,hz:0});}
function gsStyle(d){const L=(d&&d.look)||{};if(MODE==='roma'&&L.toga)return 'toga';if(MODE!=='roma'&&L.himation&&!L.female&&!L.short)return 'himation';return 'libre';}
function gsTick(dt){if(!state||ui==='start')return;const P=player,t=performance.now()/1000;
  // 1) quien te habla gesticula mientras se escribe su texto
  let dg=null,dd=null;if(ui==='dialog'&&typeof dlg!=='undefined'&&dlg&&dlg.n){const o=npcObjs.find(o=>o.data===dlg.n);if(o&&o.g){dg=o.g;dd=o.data;}}
  if(dg!==GS.dlgG){if(GS.dlgG&&GS.dlgG.userData.gs)gsRest(GS.dlgG.userData.gs);GS.dlgG=dg;GS.dlgT=0;}
  if(dg){const gs=gsRig(dg);GS.list.add(dg);const typing=typeof TW!=='undefined'&&TW.on,st=gsStyle(dd),amp=st==='himation'?0.45:1;
    // mira hacia ti
    const ang=Math.atan2(P.x-dg.position.x,P.z-dg.position.z)-dg.rotation.y;let a=((ang+Math.PI)%TAU+TAU)%TAU-Math.PI;gs.tgt.hy=Math.max(-0.9,Math.min(0.9,a));
    GS.dlgT-=dt;if(typing&&GS.dlgT<=0){GS.dlgT=0.9+Math.random()*0.9;const tx=($('dBody')&&$('dBody').innerText)||'',q=/\?/.test(tx),ex=/!/.test(tx),r=Math.random();
      let n=q&&r<0.45?'palmas':ex&&r<0.35?(st==='toga'?'adlocutio':'alto'):r<0.22?'pecho':r<0.38?'senala':r<0.5?'encoge':'ritmo';if(st==='toga'&&(n==='palmas'||n==='encoge'))n='ritmo';
      gsSet(gs,n,amp,true);if(st==='toga')Object.assign(gs.tgt,{lx:GSET.manto[0],lz:0});if(st==='himation')Object.assign(gs.tgt,{lx:-0.2,lz:0});
      gs.tgt.hx=Math.random()<0.4?0.12:0;gs.tgt.hz=(Math.random()-0.5)*0.15;}
    if(!typing&&GS.dlgT<=0){GS.dlgT=1.5;gsRest(gs);gs.tgt.hz=0.08*Math.sin(t*0.7);gs.tgt.hx=0.04;if(st==='toga')gs.tgt.lx=GSET.manto[0];}
    if(typing)gs.tgt.rx+=Math.sin(t*6)*0.04*amp;   // el compás de la mano al hablar
    gsApply(dg,gs,dt);}
  // 2) los demás personajes cercanos: te siguen con la mirada, gestos en reposo y sorpresa si vuelas
  GS.flyT-=dt;
  for(const o of npcObjs){if(o.hidden||!o.g||!o.g.visible||o.g===dg)continue;const dx=o.g.position.x-P.x,dz=o.g.position.z-P.z,d=Math.hypot(dx,dz);if(d>28)continue;const gs=gsRig(o.g);GS.list.add(o.g);
    gzLook(o,gs,dx,dz,d,dt);
    if(FLY.on&&d<16&&!gs.wow){gs.wow=2;gsSet(gs,'brazosArriba',1);gs.tgt.hx=-0.35;}
    if(gs.wow>0){gs.wow-=dt;if(gs.wow<=0){gs.wow=FLY.on?-6:0;gsRest(gs);}}else if(gs.wow<0)gs.wow=Math.min(0,gs.wow+dt);
    else{gs.next-=dt;if(gs.next<=0){gs.next=6+Math.random()*10;if(gs.cur){gs.cur=0;gsRest(gs);}else{const r=Math.random();const n=r<0.2?'cabeza':r<0.45?'espalda':r<0.6?'pecho2':null;if(n){gs.cur=1;gsSet(gs,n,1);gs.next=1.4+Math.random()*1.5;}else{gs.tgt.hy+=(Math.random()-0.5)*1.2;}}}}
    gsApply(o.g,gs,dt);}
  // 3) corrillos: paseantes parados cerca unos de otros conversan por turnos
  const near=[];for(const w of walkers){if(!w.g||!w.g.visible||!(w.wait>0)||w.fol)continue;const dx=w.g.position.x-P.x,dz=w.g.position.z-P.z;if(dx*dx+dz*dz<35*35)near.push(w);if(near.length>24)break;}
  for(const w of near){if(w.pal&&(!(w.pal.wait>0)||Math.hypot(w.pal.g.position.x-w.g.position.x,w.pal.g.position.z-w.g.position.z)>4)){w.pal=null;const gs0=w.g.userData.gs;if(gs0){gsRest(gs0);gs0.tgt.hy=0;}}
    if(!w.pal)for(const v of near){if(v===w||v.pal)continue;if(Math.hypot(v.g.position.x-w.g.position.x,v.g.position.z-w.g.position.z)<3.4){w.pal=v;v.pal=w;w.spk=true;v.spk=false;w.g.rotation.y=Math.atan2(v.g.position.x-w.g.position.x,v.g.position.z-w.g.position.z);v.g.rotation.y=w.g.rotation.y+Math.PI;break;}}
    if(!w.pal)continue;const gs=gsRig(w.g);GS.list.add(w.g);gs.ct=(gs.ct||0)-dt;if(gs.ct<=0){gs.ct=1+Math.random()*1.4;if(Math.random()<0.3)w.spk=!w.spk,w.pal.spk=!w.spk;
      if(w.spk){const r=Math.random();gsSet(gs,r<0.3?'palmas':r<0.55?'ritmo':r<0.75?'senala':'encoge',0.8);}else{gsRest(gs);gs.tgt.hx=Math.random()<0.5?0.1:0;gs.tgt.hz=(Math.random()-0.5)*0.2;}}
    if(w.spk)gs.tgt.rx+=Math.sin(t*5+w.phase)*0.03;gsApply(w.g,gs,dt);}}
// lo que se aprende sobre los gestos
function gsTopics(){const add=(id,q,a)=>{const n=(typeof NPCS!=='undefined'?NPCS:[]).find(n=>n.id===id);if(n&&n.topics&&!n.topics.some(t=>t[0]===q))n.topics.push([q,a]);};
 add('quintiliano','¿Cómo se mueven las manos al hablar?','«La mano derecha hace casi todo el trabajo; la izquierda sujeta la toga y casi nunca gesticula sola. El gesto debe acompañar el sentido, no imitar cada palabra como hacen los mimos. Empieza el gesto con la frase y termínalo con ella. No levantes la mano por encima de los ojos ni la bajes por debajo del pecho, y no te golpees el muslo ni la frente como un actor de comedia.» Lo escribirá en el libro 11 de su Institutio oratoria.');
 add('isocrates','¿Por qué los oradores apenas mueven los brazos?','«Los antiguos, Pericles, Temístocles, hablaban con el brazo recogido dentro del manto: mover los brazos les parecía descarado. En Salamina hay una estatua de Solón así. Ahora algunos se agitan, gritan y se arremangan el manto en la tribuna, como hacía Cleón.» (Lo dirá Esquines en el 346, en su discurso Contra Timarco 25; de Cleón lo cuenta la Constitución de los atenienses 28.)');}
{const g0=gsTick;gsTick=function(dt){if(state&&!GS.topics){GS.topics=1;try{gsTopics();}catch(e){}}return g0(dt);};}
// ============================================================ GAME FEEL 5: ceremonia al cumplir algo, sonido situado de los talleres, entrar en el agua
// Sello dorado con corona de laurel y fanfarria de lira al completar un capítulo, cumplir un encargo, acabar los primeros pasos o lograr algo;
// arpegio breve al aprender una lección; páginas al abrir el diario y al cambiar de pestaña. Los talleres suenan a izquierda o derecha y más flojos de lejos.
{const st=document.createElement('style');st.textContent='#gfSeal{position:fixed;left:50%;top:16%;transform:translateX(-50%) scale(.6);opacity:0;z-index:45;pointer-events:none;text-align:center;color:#f6dfa8;font-family:var(--f-display),Georgia,serif;text-shadow:0 2px 10px rgba(0,0,0,.75);transition:transform .45s cubic-bezier(.2,1.6,.4,1),opacity .35s}'+
 '#gfSeal.on{transform:translateX(-50%) scale(1);opacity:1}#gfSeal .lw{font-size:34px;color:#d9a94a;letter-spacing:.3em}#gfSeal b{display:block;font-size:30px;font-weight:400;letter-spacing:.06em;margin:2px 0}#gfSeal small{display:block;font:italic 16px Georgia,serif;color:#efe2c8}'+
 '#gfSeal .rule{height:1px;width:260px;margin:8px auto 0;background:linear-gradient(90deg,transparent,#d9a94a,transparent)}@media (prefers-reduced-motion:reduce){#gfSeal{transition:none}}';document.head.appendChild(st);}
function gfFanfare(big){if(!aOK())return;const t=AUD.ctx.currentTime+0.03;const N=big?[392,493.88,587.33,783.99,987.77,1174.66]:[587.33,739.99,880];
  N.forEach((f,i)=>rwPluck(f,t+i*(big?0.11:0.08),big?0.06:0.045,1.8));if(big){[392,493.88,587.33].forEach(f=>rwPluck(f,t+N.length*0.11+0.05,0.05,2.6));
   try{const c=AUD.ctx,o=c.createOscillator(),e=c.createGain();o.type='sine';o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(55,t+0.3);e.gain.setValueAtTime(0.0001,t);e.gain.exponentialRampToValueAtTime(0.18,t+0.01);e.gain.exponentialRampToValueAtTime(0.0001,t+0.45);o.connect(e);e.connect(AUD.master);o.start(t);o.stop(t+0.5);}catch(e){}}}
function gfSeal(title,sub){let d=$('gfSeal');if(d)d.remove();d=document.createElement('div');d.id='gfSeal';d.innerHTML='<div class="lw"><svg viewBox="0 0 120 44" width="120" height="44" aria-hidden="true"><g fill="#d9a94a"><ellipse cx="28" cy="30" rx="5" ry="2.2" transform="rotate(-30 28 30)"/><ellipse cx="22" cy="24" rx="5" ry="2.2" transform="rotate(-50 22 24)"/><ellipse cx="18" cy="16" rx="5" ry="2.2" transform="rotate(-70 18 16)"/><ellipse cx="17" cy="7" rx="5" ry="2.2" transform="rotate(-95 17 7)"/><ellipse cx="34" cy="34" rx="5" ry="2.2" transform="rotate(-12 34 34)"/><ellipse cx="41" cy="36" rx="5" ry="2.2" transform="rotate(0 41 36)"/><g transform="translate(120,0) scale(-1,1)"><ellipse cx="28" cy="30" rx="5" ry="2.2" transform="rotate(-30 28 30)"/><ellipse cx="22" cy="24" rx="5" ry="2.2" transform="rotate(-50 22 24)"/><ellipse cx="18" cy="16" rx="5" ry="2.2" transform="rotate(-70 18 16)"/><ellipse cx="17" cy="7" rx="5" ry="2.2" transform="rotate(-95 17 7)"/><ellipse cx="34" cy="34" rx="5" ry="2.2" transform="rotate(-12 34 34)"/><ellipse cx="41" cy="36" rx="5" ry="2.2" transform="rotate(0 41 36)"/></g><circle cx="60" cy="38" r="3"/></g><path d="M44 37 Q22 34 16 6 M76 37 Q98 34 104 6" stroke="#d9a94a" stroke-width="1.6" fill="none"/></svg></div><b></b><small></small><div class="rule"></div>';d.querySelector('b').textContent=title;d.querySelector('small').textContent=sub||'';document.body.appendChild(d);
  requestAnimationFrame(()=>d.classList.add('on'));setTimeout(()=>{d.classList.remove('on');setTimeout(()=>d.remove(),500);},3200);gfFanfare(true);}
{const t0=toast;toast=function(html){const r=t0.apply(this,arguments);try{const m=/<span class="label">([^<]*)<\/span>(?:<br>)?([^<]*)/.exec(html||'');if(m){const lb=m[1],tx=(m[2]||'').trim();
   if(/^★ Logro · /.test(lb))gfSeal(lb.replace(/^★ /,''),tx);
   else if(/^Encargo cumplido/.test(lb))gfSeal('Encargo cumplido',tx.split(/[.·]/)[0]);
   else if(/^Primeros pasos completados/.test(lb))gfSeal('Primeros pasos completados',MODE==='roma'?'Ya te mueves por Roma':'Ya te mueves por Atenas');
   else if(/^Lección aprendida/.test(lb))gfFanfare(false);}}catch(e){}return r;};}
{const sn=storyNext;storyNext=function(){const d0=state&&state.story?state.story.done||0:0;const r=sn.apply(this,arguments);try{const d1=state.story.done||0;if(d1>d0){const c=STORY[d1-1];gfSeal('Capítulo '+d1+' completado',c?c.title:'');}}catch(e){}return r;};}
{const oj=openJournal;openJournal=function(){const r=oj.apply(this,arguments);try{sfxRustle();}catch(e){}return r;};}
document.addEventListener('click',e=>{if(e.target&&e.target.closest&&e.target.closest('#journal .tabs button'))try{sfxRustle();}catch(err){}},true);
function gfAt(x,z,fn){if(!aOK()||!AUD.ctx.createStereoPanner)return fn();const c=AUD.ctx,P=player,dx=x-P.x,dz=z-P.z,d=Math.hypot(dx,dz);
  const pan=Math.max(-0.9,Math.min(0.9,(dx*Math.cos(P.yaw)-dz*Math.sin(P.yaw))/Math.max(d,1))),g=c.createGain();g.gain.value=Math.max(0.15,Math.min(1,1.25-d/30));const p=c.createStereoPanner();p.pan.value=pan;p.connect(g);g.connect(AUD.master);
  const m=AUD.master;AUD.master=p;try{fn();}finally{AUD.master=m;}}
{const so=sfxOficio;sfxOficio=function(k){const P=player;let best=null,bd=1e9;for(const o of (typeof OFIC!=='undefined'?OFIC:[]))if(o.sfx===k){const d=Math.hypot(o.x-P.x,o.z-P.z);if(d<bd){bd=d;best=o;}}
  if(!best)return so.apply(this,arguments);const a=arguments;return gfAt(best.x,best.z,()=>so.apply(this,a));};}
const GF5={wet:false,rT:0};
function sfxSplash(big){if(!aOK()||!AUD.noise)return;const c=AUD.ctx,t=c.currentTime,s=c.createBufferSource();s.buffer=AUD.noise;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(2600,t);lp.frequency.exponentialRampToValueAtTime(500,t+0.4);const e=c.createGain();e.gain.setValueAtTime(0.0001,t);e.gain.exponentialRampToValueAtTime(big?0.3:0.16,t+0.02);e.gain.exponentialRampToValueAtTime(0.0001,t+(big?0.6:0.35));s.connect(lp).connect(e).connect(AUD.master);s.start(t,Math.random()*2);s.stop(t+0.65);}
function gf5Tick(dt){if(!state||ui!=='play'||BOAT.on||FLY.on){GF5.wet=false;return;}const P=player,w=riverWater(P.x,P.z),t=terrainH(P.x,P.z),deep=w!==null&&w-t>0.3&&P.feet<w+0.2;
  if(deep&&!GF5.wet){sfxSplash(player.vy<-3||Math.hypot(GF.vx,GF.vz)>6);try{splash(P.x,P.z,true);}catch(e){}}GF5.wet=deep;
  if(deep){GF5.rT-=dt;if(GF5.rT<=0){GF5.rT=Math.hypot(GF.vx,GF.vz)>0.5?0.35:1.2;try{ripple(P.x,P.z,1.2);}catch(e){}}}}
// ============================================================ GESTOS (2): codos, y vasijas y cestos que se tambalean al rozarlos
// El brazo (una pieza que gira en el hombro) se parte a media altura cuando el personaje va a gesticular: el antebrazo cuelga de un pivote en el codo.
function gsElbow(arm){try{arm.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(arm.matrixWorld).invert(),meshes=[];arm.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.attributes.position&&!o.userData.keep)meshes.push(o);});if(!meshes.length)return null;
  let minY=0;const v=new THREE.Vector3();const geos=meshes.map(m=>{const mm=new THREE.Matrix4().multiplyMatrices(inv,m.matrixWorld),g=(m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone());g.applyMatrix4(mm);const P=g.attributes.position;for(let i=0;i<P.count;i++)if(P.getY(i)<minY)minY=P.getY(i);return{m,g};});
  if(minY>-0.25)return null;const ey=minY*0.47,fore=new THREE.Group();fore.position.set(0,ey,0);arm.add(fore);let rad=0,rn=0,ex=0,ez=0;
  for(const{m,g}of geos){const P=g.attributes.position,N=g.attributes.normal,U=g.attributes.uv,up=[],lo=[];for(let t=0;t<P.count;t+=3){const cy=(P.getY(t)+P.getY(t+1)+P.getY(t+2))/3;(cy<ey?lo:up).push(t);}
    const mk2=(list,dy)=>{if(!list.length)return null;const ng=new THREE.BufferGeometry();
      for(const nm in g.attributes){const A=g.attributes[nm],sz=A.itemSize,arr=new Float32Array(list.length*3*sz);let k=0;for(const t of list)for(let j2=0;j2<3;j2++){for(let c=0;c<sz;c++)arr[k*sz+c]=A.array[(t+j2)*sz+c]-(nm==='position'&&c===1?dy:0);k++;}ng.setAttribute(nm,new THREE.BufferAttribute(arr,sz));}
      for(const t of list)for(let j2=0;j2<3;j2++){const y=P.getY(t+j2);if(Math.abs(y-ey)<0.05){rad+=Math.hypot(P.getX(t+j2),P.getZ(t+j2));ex+=P.getX(t+j2);ez+=P.getZ(t+j2);rn++;}}
      if(!ng.attributes.normal)ng.computeVertexNormals();const me=new THREE.Mesh(ng,m.material);me.castShadow=true;return me;};
    const a=mk2(up,0),b=mk2(lo,ey);if(a)arm.add(a);if(b)fore.add(b);m.parent.remove(m);}
  for(const ch of[...arm.children])if(ch!==fore&&ch.isGroup&&!ch.children.length)arm.remove(ch);
  if(rn){const cx=ex/rn,cz=ez/rn;fore.position.x=cx;fore.position.z=cz;for(const ch of fore.children){ch.position.x=-cx;ch.position.z=-cz;}const lowM=fore.children[0]&&fore.children[0].material;const r0=Math.max(0.03,Math.min(0.07,rad/rn*0.8));const jg=new THREE.SphereGeometry(r0,8,6);jg.setAttribute('color',new THREE.BufferAttribute(new Float32Array(jg.attributes.position.count*3).fill(0.82),3));const j=new THREE.Mesh(jg,lowM);j.position.set(0,0,0);fore.add(j);}
  for(const ch of[...arm.children])if(ch!==fore&&ch.userData.keep&&ch.position.y<ey+0.05){arm.remove(ch);ch.position.x-=fore.position.x;ch.position.y-=fore.position.y;ch.position.z-=fore.position.z;fore.add(ch);}
  return fore;}catch(e){return null;}}
// los gestos con codo: [izq. delante, izq. fuera, der. delante, der. fuera, cabeza abajo, ladeo, codo izq., codo der.]
Object.assign(GSET,{palmas:[-0.35,0.45,-0.35,0.45,0.05,0,-0.9,-0.9],senala:[0,0,-1.35,0.1,-0.05,0,0,-0.1],pecho:[0,0,-0.45,-0.35,0.12,0,0,-1.9],encoge:[-0.15,0.35,-0.15,0.35,0,0.18,-1.2,-1.2],
 ritmo:[0,0,-0.35,0.15,0,0,0,-1.1],alto:[0,0,-1.9,0.15,-0.12,0,0,-0.2],adlocutio:[-0.3,0,-1.4,0.25,-0.08,0,-1.3,-0.4],cabeza:[0,0,-2.2,0.5,0.1,0.15,0,-1.6],pecho2:[0,0,-0.45,-0.35,0.15,0.08,0,-1.9],
 brazosArriba:[-2.3,0.35,-2.3,0.35,-0.25,0,-0.3,-0.3],barbilla:[0,0,-0.6,-0.25,0.12,0.1,0,-2.3],juntas:[-0.35,-0.2,-0.35,-0.2,0.08,0,-1.2,-1.2]});
{const r0=gsRig;gsRig=function(g){const had=g.userData.gs;const gs=r0(g);if(!had&&gs.arms&&!g.userData.pose)gs.fore=gs.arms.map(a=>gsElbow(a));return gs;};}
{const s0=gsSet;gsSet=function(gs,n,amp,keepHead){s0(gs,n,amp,keepHead);const G=GSET[n]||[],a=amp===undefined?1:amp;gs.tgt.lf=(G[6]||0)*a;gs.tgt.rf=(G[7]||0)*a;};}
{const r0=gsRest;gsRest=function(gs){r0(gs);gs.tgt.lf=0;gs.tgt.rf=0;};}
{const a0=gsApply;gsApply=function(g,gs,dt){a0(g,gs,dt);if(gs.fore&&!g.userData.pose){const k=Math.min(1,dt*7),mov=gs.lx!==undefined&&false;for(let i=0;i<2;i++){const f=gs.fore[i];if(!f)continue;const tg=(i?gs.tgt.rf:gs.tgt.lf)||0;f.rotation.x+=(tg-f.rotation.x)*k;}}};}
// en Roma, con toga, la izquierda sostiene el pliegue doblando el codo; quien escucha a veces se lleva la mano a la barbilla
{const t0=gsTick;gsTick=function(dt){t0(dt);try{const g=GS.dlgG;if(g&&g.userData.gs){const gs=g.userData.gs,st=gsStyle((npcObjs.find(o=>o.g===g)||{}).data);if(st==='toga')gs.tgt.lf=-1.3;
  if(!(typeof TW!=='undefined'&&TW.on)&&Math.random()<dt*0.15&&!gs.think){gs.think=2.5;gsSet(gs,'barbilla',1,true);}if(gs.think){gs.think-=dt;if(gs.think<=0){gs.think=0;gsRest(gs);}}}}catch(e){}};}
// ---- vasijas y cestos que se tambalean si los rozas
const WOB={items:null,grid:new Map(),scanX:1e9,t:0};
function wobScan(){WOB.grid.clear();const v=new THREE.Vector3();scene.traverse(o=>{if(!o.isMesh||(o.geometry!==PGEO.jar&&o.geometry!==PGEO.basket))return;o.getWorldPosition(v);const k=Math.floor(v.x/10)+','+Math.floor(v.z/10);let a=WOB.grid.get(k);if(!a){a=[];WOB.grid.set(k,a);}a.push({o,x:v.x,z:v.z,bx:o.rotation.x,bz:o.rotation.z,t:-1});});}
function sfxTok(){if(!aOK())return;const c=AUD.ctx,t=c.currentTime;[[620,0],[910,0.07]].forEach(([f,d])=>{const o=c.createOscillator(),e=c.createGain();o.type='triangle';o.frequency.setValueAtTime(f,t+d);o.frequency.exponentialRampToValueAtTime(f*0.7,t+d+0.08);e.gain.setValueAtTime(0.0001,t+d);e.gain.exponentialRampToValueAtTime(0.09,t+d+0.005);e.gain.exponentialRampToValueAtTime(0.0001,t+d+0.12);o.connect(e);e.connect(AUD.master);o.start(t+d);o.stop(t+d+0.15);});}
function wobTick(dt){if(!state||ui!=='play')return;const P=player;WOB.t-=dt;if(Math.abs(P.x-WOB.scanX)>400||(WOB.t<=0&&WOB.grid.size===0)){WOB.scanX=P.x;WOB.t=30;wobScan();}
  const sp=Math.hypot(GF.vx,GF.vz),R=MOUNT.riding?1.3:0.7,cx=Math.floor(P.x/10),cz=Math.floor(P.z/10);
  for(let i=cx-1;i<=cx+1;i++)for(let j=cz-1;j<=cz+1;j++){const a=WOB.grid.get(i+','+j);if(!a)continue;for(const w of a){const dx=w.x-P.x,dz=w.z-P.z,d=Math.hypot(dx,dz);
    if(d<R&&sp>0.6&&w.t<0){w.t=0;w.ax=dz/(d||1);w.az=-dx/(d||1);w.amp=Math.min(0.45,0.15+sp*0.05);sfxTok();}
    if(w.t>=0){w.t+=dt;const k=w.amp*Math.exp(-w.t*4)*Math.sin(w.t*16);w.o.rotation.x=w.bx+k*w.ax;w.o.rotation.z=w.bz+k*w.az;if(w.t>1.6){w.t=-1;w.o.rotation.x=w.bx;w.o.rotation.z=w.bz;}}}}}
// ============================================================ MEDIDOR DE TIRONES (solo con #debug o ?prof): tiempo de cada función del bucle, media, máximo y picos
const PROFT={on:/prof/.test(location.search)||/debug/.test(location.hash),m:{},frames:[],last:0};
if(PROFT.on){for(const fn of ['stepsTick','evTick','gatesTick','storyTick','netTick','horseTick','wingsTick','qualTick','tutTick','convTick','seasonTick','fxTick','cultTick','fastosTick','vuTick','ofTick','mktTick','egxTick','vidaTick','arisTick','faunaTick','delterTick','cavTick','atalTick','finTick','dreamTick','artTick','urbTick','progTick','jrTick','cvTick','atTick','hbTick','spTick','visTick','wxTick','uxTick','mtTick','mtBtnTick','clbTick','natTick','natAppTick','rdTick','cyTick','objTick','rcTick','eduTick','accTick','seal2Tick','ambTick','amb2Tick','swTick','crtTick','r7Tick','isl3Tick','tpTick','colsTick','cullTick','mergeTick','v2Tick','rutTick','zsTick','gdTick','socTick','dioTick','pitTick','herTick','curTick','n2Tick','forTick','wildTick','gf4Tick','gsTick','gf5Tick','wobTick','farmTick','gf2Tick','dustGame','cineTick','tmTick','keysAutoTick','gfAudio','gfPeople','audioTick','updateGods','updatePerformance','updateSocial','updateRome','updateMount','updateAvatar','placeCamera','updateTorch','findFocus','checkZone','updateSky']){try{const o=eval(fn);if(typeof o!=='function')continue;const w=function(){const t=performance.now();try{return o.apply(this,arguments);}finally{const d=performance.now()-t,r=PROFT.m[fn]||(PROFT.m[fn]={n:0,s:0,max:0,spk:0});r.n++;r.s+=d;if(d>r.max)r.max=d;if(d>8)r.spk++;}};eval(fn+'=w');}catch(e){}}}
function profReport(n){const a=Object.entries(PROFT.m).map(([k,r])=>[k,r.s/r.n,r.max,r.spk,r.n]).sort((x,y)=>y[2]-x[2]).slice(0,n||15);return a.map(r=>r[0]+': media '+r[1].toFixed(2)+' ms, máx '+r[2].toFixed(1)+' ms, picos>8ms '+r[3]).join('\n');}
function profReset(){PROFT.m={};}
// ============================================================ EL PLANO SE REVELA AL ANDAR, Y CARAS QUE PARPADEAN Y HABLAN
// Niebla suave sobre lo que no has pisado (rejilla de 40 m por región; se ve a 120 m a tu alrededor y queda guardado).
const FOGC={cv:{},dirty:{},t:0};
function fogZ(){state.fog=state.fog||{};return state.fog;}
function fogTick(dt){if(!state||ui==='start')return;FOGC.t-=dt;if(FOGC.t>0)return;FOGC.t=1;const P=player;if(P.feet>(P.x>8000?400:300))return;
  let key;try{key=regionOf(P.x);}catch(e){return;}const B=regionBounds(key);if(!B)return;const F=fogZ(),gx=Math.ceil((B.x1-B.x0)/40);let a=F[key];if(!a)a=F[key]=[];const set=FOGC['s_'+key]||(FOGC['s_'+key]=new Set(a));
  const ci=Math.floor((P.x-B.x0)/40),cj=Math.floor((P.z-B.z0)/40);let add=0;for(let i=ci-3;i<=ci+3;i++)for(let j=cj-3;j<=cj+3;j++){if((i-ci)*(i-ci)+(j-cj)*(j-cj)>10)continue;if(i<0||j<0||i>=gx)continue;const k=j*gx+i;if(!set.has(k)){set.add(k);a.push(k);add++;}}
  if(add){FOGC.dirty[key]=1;if(a.length%40<add)save();}}
function mapFog(x,key,v,W,H){if(!state)return;const B=regionBounds(key);if(!B)return;const gx=Math.ceil((B.x1-B.x0)/40),gz=Math.ceil((B.z1-B.z0)/40);let c=FOGC.cv[key];
  if(!c||FOGC.dirty[key]){c=FOGC.cv[key]||document.createElement('canvas');c.width=gx;c.height=gz;const g=c.getContext('2d'),im=g.createImageData(gx,gz),D=im.data;for(let k=0;k<gx*gz;k++){D[k*4]=28;D[k*4+1]=20;D[k*4+2]=14;D[k*4+3]=125;}
    for(const k of (fogZ()[key]||[])){if(k>=0&&k<gx*gz)D[k*4+3]=0;}g.putImageData(im,0,0);FOGC.cv[key]=c;FOGC.dirty[key]=0;}
  x.save();x.imageSmoothingEnabled=true;x.drawImage(c,(v.x0-B.x0)/40,(v.z0-B.z0)/40,v.w/40,v.h/40,0,0,W,H);x.restore();}
// caras: parpadeo de los cercanos y boca que se mueve al hablar
{const gp=glbPart;glbPart=function(name,roles){const p=gp(name,roles);if(p)p.userData.part=name;return p;};}
function gsEyes(gs){if(gs.eyes!==undefined)return gs.eyes;gs.eyes=null;if(!gs.head)return null;for(const ch of gs.head.children)if(ch.userData&&ch.userData.part==='P_eyes'){const b=new THREE.Box3().setFromObject(ch),c=new THREE.Vector3();b.getCenter(c);ch.parent.worldToLocal(c);gs.eyes={o:ch,y0:ch.position.y,cy:c.y-ch.position.y,t:2+Math.random()*4,b:0};break;}return gs.eyes;}
function gsMouth(gs){if(gs.mouth!==undefined)return gs.mouth;gs.mouth=null;const F=faceSpots();if(!gs.head||F.m==null)return null;const m=new THREE.Mesh(new THREE.BoxGeometry(0.034,0.007,0.006),lam('#3a1a16'));m.position.set(0,1.772-1.55-0.002,F.m+0.003);m.visible=false;gs.head.add(m);gs.mouth=m;return m;}
function faceTick(dt){if(!state||ui==='start')return;const P=player,t=performance.now()/1000;
  for(const g of GS.list){const gs=g.userData.gs;if(!gs||!gs.head||!g.visible)continue;const d=Math.hypot(g.position.x-P.x,g.position.z-P.z);if(d>16)continue;const E=gsEyes(gs);
    if(E){E.t-=dt;if(E.t<=0){E.b=0.13;E.t=2+Math.random()*5;}if(E.b>0){E.b-=dt;const s=E.b>0?0.12:1;E.o.scale.y=s;E.o.position.y=E.y0+E.cy*(1-s);}}}
  const g=GS.dlgG;if(g&&g.userData.gs){const gs=g.userData.gs,M=gsMouth(gs);if(M){const talk=typeof TW!=='undefined'&&TW.on;M.visible=talk;if(talk)M.scale.y=1+3.2*Math.abs(Math.sin(t*13)*Math.sin(t*5.3));}}
  for(const o of GS.list){const gs=o.userData.gs;if(gs&&gs.mouth&&o!==g)gs.mouth.visible=false;}}
