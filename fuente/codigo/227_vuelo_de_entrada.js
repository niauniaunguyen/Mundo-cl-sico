// ============================================================ EL VUELO DE ENTRADA (22/11)
// Cada vez que se entra en el juego, antes de dar el control, la cámara va detrás de un ave que llega a la ciudad donde se dejó
// la partida, la sobrevuela y, cuando empieza a alejarse, la cámara la suelta y baja hasta el personaje.
// · Atenas: un mochuelo (Athene noctua, γλαῦξ), el ave de Atenea, la misma de los óbolos y las tetradracmas. A diferencia de
//   otras rapaces nocturnas, el mochuelo también sale de día (y por eso se veía a menudo en la ciudad).
// · Roma: un águila (aquila), el ave de Júpiter; los augures leían el vuelo de las aves para conocer la voluntad de los dioses.
// Se puede saltar en cualquier momento (botón «Saltar», Espacio, Intro o Esc) y quitar del todo («No volver a mostrar», o en
// Esc → Partida → Introducción al entrar). No se muestra en las pruebas automáticas (#debug) salvo con ?vuelo=1.
const VUELO={on:false,ph:'',t:0,T:0,pts:null,bird:null,el:null,after:[],cam:null,q0:null,p0:null,wind:null,flapT:0,left:0,seen:false,title:false};
function vueloOff(){try{return localStorage.getItem('nostos-vuelo-off')==='1';}catch(e){return false;}}
function vueloOK(){if(vueloOff())return false;const q=location.search+location.hash;if(/vuelo=1/.test(q))return true;if(/debug/.test(location.hash))return false;
  try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return false;}catch(e){}return true;}
// ---- el ave (geometría propia: cuerpo, cabeza, cola y alas en dos tramos que baten o planean)
function vueloTex(owl){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
  x.fillStyle=owl?'#7a5a3a':'#4a3220';x.fillRect(0,0,128,128);
  if(owl){for(let i=0;i<140;i++){x.fillStyle=Math.random()<0.75?'rgba(236,224,198,.85)':'rgba(60,40,24,.6)';x.beginPath();x.arc(Math.random()*128,Math.random()*128,1+Math.random()*2.6,0,7);x.fill();}
    for(let i=0;i<6;i++){x.fillStyle='rgba(230,214,180,.55)';x.fillRect(0,96+i*5,128,2);}}
  else{const g=x.createLinearGradient(0,0,0,128);g.addColorStop(0,'rgba(170,120,60,.75)');g.addColorStop(.45,'rgba(90,60,30,.3)');g.addColorStop(1,'rgba(20,12,6,.5)');x.fillStyle=g;x.fillRect(0,0,128,128);
    for(let i=0;i<10;i++){x.strokeStyle='rgba(20,12,6,.35)';x.beginPath();x.moveTo(i*13,60);x.lineTo(i*13+4,128);x.stroke();}}
  const t=new THREE.CanvasTexture(c);t.needsUpdate=true;return t;}
function vueloWingGeo(pts){const s=new THREE.Shape();s.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)s.lineTo(pts[i][0],pts[i][1]);s.closePath();
  const g=new THREE.ShapeGeometry(s);g.rotateX(Math.PI/2);g.computeBoundingBox();const b=g.boundingBox,p=g.attributes.position,uv=g.attributes.uv;
  for(let i=0;i<p.count;i++)uv.setXY(i,(p.getX(i)-b.min.x)/(b.max.x-b.min.x||1),(p.getZ(i)-b.min.z)/(b.max.z-b.min.z||1));uv.needsUpdate=true;g.computeVertexNormals();return g;}
function vueloBird(owl){const g=new THREE.Group(),tex=vueloTex(owl),k=owl?1:2.6;
  const mB=new THREE.MeshLambertMaterial({map:tex,side:THREE.DoubleSide}),mL=new THREE.MeshLambertMaterial({color:owl?0xe8dcc0:0xd8b070}),mY=new THREE.MeshLambertMaterial({color:0xe8c030}),mK=new THREE.MeshBasicMaterial({color:0x111111});
  const body=new THREE.Mesh(new THREE.SphereGeometry(0.1*k,12,8),mB);body.scale.set(owl?1:0.85,owl?0.95:0.8,owl?1.35:2.1);g.add(body);
  const belly=new THREE.Mesh(new THREE.SphereGeometry(0.092*k,10,6),mL);belly.scale.set(owl?0.9:0.75,0.8,owl?1.2:1.8);belly.position.y=-0.025*k;g.add(belly);
  const head=new THREE.Mesh(new THREE.SphereGeometry((owl?0.085:0.06)*k,12,8),owl?mB:new THREE.MeshLambertMaterial({color:0xb58440}));head.position.set(0,(owl?0.03:0.03)*k,(owl?0.13:0.2)*k);if(owl)head.scale.set(1.1,0.95,0.95);g.add(head);
  if(owl){const disc=new THREE.Mesh(new THREE.CircleGeometry(0.07,16),mL);disc.position.set(0,0.03,0.205);g.add(disc);
    for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(0.018,8,6),mY);e.position.set(s*0.03,0.04,0.215);g.add(e);const p=new THREE.Mesh(new THREE.SphereGeometry(0.009,6,4),mK);p.position.set(s*0.03,0.04,0.23);g.add(p);}}
  const beak=new THREE.Mesh(new THREE.ConeGeometry((owl?0.012:0.016)*k,(owl?0.035:0.05)*k,6),mY);beak.rotation.x=Math.PI/2+0.5;beak.position.set(0,(owl?0.012:0.02)*k,(owl?0.22:0.26)*k);g.add(beak);
  const tail=new THREE.Mesh(vueloWingGeo(owl?[[-0.05,0],[0.05,0],[0.06,-0.1],[-0.06,-0.1]]:[[-0.04,0],[0.04,0],[0.09,-0.16],[-0.09,-0.16]]),mB);tail.scale.setScalar(k);tail.position.set(0,0,-0.11*k*(owl?1:1.6));g.add(tail);
  const inner=owl?[[0,0.05],[0.16,0.05],[0.17,-0.1],[0,-0.08]]:[[0,0.05],[0.22,0.05],[0.24,-0.11],[0,-0.1]];
  const outer=owl?[[0,0.05],[0.1,0.03],[0.16,-0.02],[0.14,-0.08],[0,-0.1]]:[[0,0.05],[0.14,0.04],[0.24,0.02],[0.27,-0.02],[0.25,-0.05],[0.27,-0.07],[0.22,-0.09],[0.23,-0.11],[0.12,-0.12],[0,-0.11]];
  const gi=vueloWingGeo(inner),go=vueloWingGeo(outer),W=[];
  for(const s of[-1,1]){const sh=new THREE.Group();sh.position.set(s*0.06*k,0.03*k,0.02*k);sh.scale.set(s*k,k,k);const a=new THREE.Mesh(gi,mB);sh.add(a);
    const el=new THREE.Group();el.position.x=owl?0.16:0.22;sh.add(el);el.add(new THREE.Mesh(go,mB));g.add(sh);W.push({sh,el,s});}
  g.userData={W,owl,k};return g;}
function vueloFlap(b,t,dt,glide){const u=b.userData,f=u.owl?7.5:3.2;VUELO.flapT+=dt*f*(glide?0.25:1);const ph=VUELO.flapT;
  const amp=glide?0.06:(u.owl?0.75:0.55),a=Math.sin(ph)*amp+(glide?0.04:0.08),o=Math.sin(ph-0.9)*amp*0.7;
  for(const w of u.W){w.sh.rotation.z=a*w.s;w.el.rotation.z=(o*0.8+(glide?0.03:0))*w.s;w.sh.rotation.y=(glide?0:Math.sin(ph)*0.08)*w.s;}
  if(!glide&&Math.sin(ph)>0.97&&!VUELO.fw){VUELO.fw=1;vueloWhoosh(u.owl?0.012:0.03);}if(Math.sin(ph)<0)VUELO.fw=0;}
// ---- sonido: viento continuo y el aleteo
function vueloWind(on){if(!aOK())return;const c=AUD.ctx;if(on&&!VUELO.wind){const s=c.createBufferSource();s.buffer=AUD.noise;s.loop=true;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=500;f.Q.value=0.6;
    const g=c.createGain();g.gain.value=0.0001;s.connect(f).connect(g).connect(AUD.master||c.destination);s.start();g.gain.exponentialRampToValueAtTime(0.09,c.currentTime+1.5);VUELO.wind={s,f,g};}
  else if(!on&&VUELO.wind){const w=VUELO.wind;VUELO.wind=null;try{w.g.gain.cancelScheduledValues(c.currentTime);w.g.gain.setValueAtTime(w.g.gain.value,c.currentTime);w.g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+1.2);w.s.stop(c.currentTime+1.3);}catch(e){}}}
function vueloWhoosh(v){if(!aOK())return;try{gfNoise(AUD.ctx.currentTime,'bandpass',700,1.2,v,0.02,0.18);}catch(e){}}
// ---- la ruta: llega desde detrás del personaje, pasa sobre la ciudad y sigue hacia delante, ganando altura
function vueloPath(owl){const C=new THREE.Vector3(player.x,0,player.z),F=new THREE.Vector3(-Math.sin(player.yaw),0,-Math.cos(player.yaw)),S=new THREE.Vector3(F.z,0,-F.x);
  const D=owl?125:165,P=(f,s,h)=>new THREE.Vector3(C.x+F.x*f+S.x*s,h,C.z+F.z*f+S.z*s);const g0=floorAt(C.x,C.z);
  const ctrl=[P(-D,-40,g0+70),P(-D*0.55,-22,g0+48),P(-D*0.18,-8,g0+32),P(14,6,g0+28),P(70,22,g0+40),P(150,38,g0+62),P(260,40,g0+95),P(420,30,g0+130)];
  const cv=new THREE.CatmullRomCurve3(ctrl,false,'centripetal'),N=320,pts=[];
  for(let i=0;i<=N;i++){const p=cv.getPointAt(i/N);pts.push(p);}
  const ground=pts.map(p=>{let h=-1e9;for(const r of[0,6,12])for(let a=0;a<6;a+=2){const x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r;h=Math.max(h,floorAt(x,z));}return h;});
  for(let i=0;i<=N;i++){let m=-1e9;for(let j=Math.max(0,i-10);j<=Math.min(N,i+10);j++)m=Math.max(m,ground[j]+(owl?24:28));pts[i].y=Math.max(pts[i].y,m);}
  for(let it=0;it<3;it++)for(let i=1;i<N;i++)pts[i].y=Math.max(pts[i].y,(pts[i-1].y+pts[i+1].y)/2);
  let L=0;const cum=[0];for(let i=1;i<=N;i++){L+=pts[i].distanceTo(pts[i-1]);cum.push(L);}
  let iC=0,bd=1e9;for(let i=0;i<=N;i++){const d=Math.hypot(pts[i].x-C.x,pts[i].z-C.z);if(d<bd){bd=d;iC=i;}}
  return {pts,cum,L,sC:cum[iC],F,C};}
function vueloAt(s){const P=VUELO.pts,c=P.cum,n=c.length-1;s=Math.max(0,Math.min(P.L,s));let lo=0,hi=n;while(hi-lo>1){const m=(lo+hi)>>1;if(c[m]<=s)lo=m;else hi=m;}
  const k=(s-c[lo])/((c[hi]-c[lo])||1);return P.pts[lo].clone().lerp(P.pts[hi],k);}
// ---- pantalla: franjas de cine, nombre de la ciudad y el botón de saltar
function vueloCSS(){if($('vueloCSS'))return;const s=document.createElement('style');s.id='vueloCSS';s.textContent=
 'body.vuelo #hud,body.vuelo #hbar,body.vuelo #hbName,body.vuelo #touch,body.vuelo #msgBtn,body.vuelo #coinHud,body.vuelo #toast{visibility:hidden!important}'+
 '#vuelo{position:fixed;inset:0;z-index:90;pointer-events:none;font-family:var(--f-body)}'+
 '#vuelo .bar{position:absolute;left:0;right:0;height:9vh;background:#000;transition:transform 1s ease}#vuelo .bar.t{top:0;transform:translateY(-100%)}#vuelo .bar.b{bottom:0;transform:translateY(100%)}'+
 '#vuelo.in .bar{transform:none}'+
 '#vuelo .ttl{position:absolute;left:0;right:0;top:24%;text-align:center;color:#fff3df;opacity:0;transition:opacity 1.6s ease,letter-spacing 3s ease;letter-spacing:.3em;text-shadow:0 2px 18px rgba(0,0,0,.75),0 0 3px #000}'+
 '#vuelo .ttl.on{opacity:1;letter-spacing:.1em}#vuelo .ttl small{display:block;font:600 .85rem var(--f-display);letter-spacing:.4em;color:#f0c890;text-transform:uppercase}'+
 '#vuelo .ttl b{display:block;font:400 clamp(2.4rem,7vw,4.8rem)/1.1 var(--f-display);margin-top:6px}#vuelo .ttl em{display:block;font-size:1.05rem;margin-top:8px;color:#f1d2ae}'+
 '#vuelo .who{position:absolute;left:max(18px,env(safe-area-inset-left,0px));bottom:calc(9vh + 14px);color:#e8dcc4;font-size:.85rem;opacity:0;transition:opacity 1.2s ease;text-shadow:0 1px 3px #000;max-width:min(520px,70vw)}#vuelo.in .who{opacity:.85}'+
 '#vuelo .sk{position:absolute;right:max(18px,env(safe-area-inset-right,0px));bottom:calc(9vh + 12px);display:flex;flex-direction:column;align-items:flex-end;gap:6px;pointer-events:auto}'+
 '#vuelo .sk button{font:600 1rem var(--f-display);letter-spacing:.08em;padding:9px 18px;border-radius:999px;border:1px solid rgba(240,200,144,.7);background:rgba(16,12,9,.72);color:#fbe6c8;cursor:pointer}'+
 '#vuelo .sk button:hover{background:rgba(217,135,74,.35)}#vuelo .sk button kbd{font:inherit;font-size:.75rem;opacity:.75;margin-left:8px}'+
 '#vuelo .sk label{font-size:.8rem;color:#d8c6a8;display:flex;gap:6px;align-items:center;cursor:pointer;text-shadow:0 1px 2px #000}'+
 '@media (max-width:640px){#vuelo .who{display:none}#vuelo .bar{height:6vh}#vuelo .sk{bottom:calc(6vh + 10px)}}';document.head.appendChild(s);}
function vueloUI(){vueloCSS();const ro=MODE==='roma',d=document.createElement('div');d.id='vuelo';
  const ht=(($('hudTitle')||{}).textContent||'').split('·'),name=(ht[0]||(ro?'Roma':'Atenas')).trim(),when=(ht[1]||'').trim();
  d.innerHTML='<div class="bar t"></div><div class="bar b"></div><div class="ttl"><small>'+(ro?'NOSTOS':'ΝΟΣΤΟΣ')+'</small><b></b><em></em></div>'+
   '<div class="who"></div><div class="sk"><button type="button">Saltar <kbd>Espacio</kbd></button><label><input type="checkbox"> No volver a mostrar</label></div>';
  d.querySelector('.ttl b').textContent=name;d.querySelector('.ttl em').textContent=when;
  d.querySelector('.who').textContent=ro?'Un águila, el ave de Júpiter: los augures leían su vuelo.':'Un mochuelo, el ave de Atenea (γλαῦξ), el mismo de las monedas.';
  d.querySelector('.sk button').onclick=e=>{e.stopPropagation();vueloEnd(true);};
  d.querySelector('.sk input').onchange=e=>{try{localStorage.setItem('nostos-vuelo-off',e.target.checked?'1':'0');}catch(er){}};
  document.body.appendChild(d);requestAnimationFrame(()=>d.classList.add('in'));return d;}
// ---- arranque y final
function vueloStart(){if(VUELO.on||!state||typeof THREE==='undefined')return;const owl=MODE!=='roma';
  try{VUELO.pts=vueloPath(owl);}catch(e){VUELO.why='ruta: '+e;return;}
  VUELO.on=true;VUELO.owl=owl;VUELO.ph='fly';VUELO.t=0;VUELO.sp=owl?15:19;VUELO.s=0;VUELO.title=false;VUELO.left=0;VUELO.flapT=0;
  VUELO.sDet=VUELO.pts.sC+(owl?45:60);VUELO.cam=null;VUELO.ui0=ui;ui='vuelo';
  if(VUELO.bird){scene.remove(VUELO.bird);}VUELO.bird=vueloBird(owl);scene.add(VUELO.bird);
  document.body.classList.add('vuelo');VUELO.el=vueloUI();try{releasePointer();}catch(e){}vueloWind(true);}
function vueloEnd(skip){if(!VUELO.on)return;VUELO.why=(skip?'skip ':'end ')+(new Error().stack||'').split('\n').slice(2,4).join(' | ');VUELO.on=false;VUELO.ph='';ui='play';document.body.classList.remove('vuelo');vueloWind(false);
  const d=VUELO.el;VUELO.el=null;if(d){d.classList.remove('in');d.querySelector('.ttl').classList.remove('on');setTimeout(()=>d.remove(),900);}
  if(skip||!VUELO.bird){if(VUELO.bird)scene.remove(VUELO.bird);VUELO.bird=null;}else VUELO.left=6;   // el ave sigue su camino unos segundos y desaparece
  try{if(AVATAR.walk&&!AVATAR.view3)AVATAR.walk.visible=false;}catch(e){}
  try{requestPointer();}catch(e){}try{updateStats();}catch(e){}
  const a=VUELO.after.splice(0);a.forEach((f,i)=>setTimeout(f,300+i*200));}
// ---- cámara: se engancha a placeCamera (lo último que coloca la cámara en cada fotograma)
const VU_V=new THREE.Vector3(),VU_L=new THREE.Vector3(),VU_Q=new THREE.Quaternion(),VU_O=new THREE.Object3D();
function vueloLook(pos,look){VU_O.position.copy(pos);VU_O.up.set(0,1,0);VU_O.lookAt(look);VU_O.rotateY(Math.PI);return VU_O.quaternion.clone();}  // la cámara mira por -Z
function vueloTick(dt){const b=VUELO.bird;if(!b)return;const owl=VUELO.owl,k=owl?1:2.6;
  // el ave avanza por la ruta (y, al final, sigue hacia delante)
  VUELO.s+=VUELO.sp*dt;const p=vueloAt(VUELO.s),pn=vueloAt(VUELO.s+3);let fw=pn.clone().sub(p);if(VUELO.s>=VUELO.pts.L){fw=VUELO.pts.F.clone().setY(0.25);p.add(fw.clone().multiplyScalar(VUELO.s-VUELO.pts.L));}
  fw.normalize();const prev=b.userData.fw||fw.clone(),turn=prev.x*fw.z-prev.z*fw.x;b.userData.bank=(b.userData.bank||0)*0.92+Math.max(-0.6,Math.min(0.6,-turn*40))*0.08;b.userData.fw=fw.clone();
  b.position.copy(p);b.lookAt(p.clone().add(fw));b.rotateZ(b.userData.bank);
  const climbing=fw.y>0.08,glide=owl?(Math.sin(VUELO.t*0.9)>0.55&&!climbing):!(climbing||Math.sin(VUELO.t*0.5)>0.8);vueloFlap(b,VUELO.t,dt,glide);
  return {p,fw,k};}
{const f=placeCamera;placeCamera=function(){const r=f.apply(this,arguments);
  if(!VUELO.on){if(VUELO.bird&&VUELO.left>0){VUELO.left-=1/60;try{vueloTick(1/60);}catch(e){}if(VUELO.left<=0){scene.remove(VUELO.bird);VUELO.bird=null;}}return r;}
  try{const dt=Math.min(0.05,(performance.now()-(VUELO.lt||performance.now()))/1000)||0.016;VUELO.lt=performance.now();VUELO.t+=dt;
    const B=vueloTick(dt);if(!B)return r;const {p,fw,k}=B,side=new THREE.Vector3(fw.z,0,-fw.x).normalize();
    // la cámara del jugador, tal como la ha dejado placeCamera
    const pCam=camera.position.clone(),qCam=camera.quaternion.clone();
    // detrás del ave, un poco por encima; al pasar sobre la ciudad se abre hacia un lado para enseñarla
    const u=Math.max(0,Math.min(1,VUELO.s/VUELO.sDet)),sw=Math.sin(Math.PI*u)*0.55,back=(VUELO.owl?1.3:4.2),up=(VUELO.owl?0.6:1.9);
    const flat=new THREE.Vector3(fw.x,0,fw.z).normalize(),off=flat.clone().multiplyScalar(-Math.cos(sw)*back).add(side.clone().multiplyScalar(Math.sin(sw)*back));
    const want=p.clone().add(off).setY(p.y+up),look=p.clone().add(flat.clone().multiplyScalar(VUELO.owl?4:10)).setY(p.y-(VUELO.owl?1.5:3.6));
    const oW=want.clone().sub(p),lW=look.clone().sub(p);if(!VUELO.cam)VUELO.cam={o:oW.clone(),lo:lW.clone(),p:want.clone(),l:look.clone()};const c=VUELO.cam,a=1-Math.exp(-dt*4);
    if(VUELO.ph==='fly'){c.o.lerp(oW,a);c.lo.lerp(lW,a);c.p.copy(p).add(c.o);c.l.copy(p).add(c.lo);
      if(!VUELO.title&&VUELO.s>VUELO.pts.sC*0.35){VUELO.title=true;const tt=VUELO.el&&VUELO.el.querySelector('.ttl');if(tt){tt.classList.add('on');setTimeout(()=>tt.classList.remove('on'),4200);}try{rwChord();}catch(e){}}
      if(VUELO.s>=VUELO.sDet){VUELO.ph='land';VUELO.t2=0;VUELO.fromP=c.p.clone();VUELO.fromQ=vueloLook(c.p,c.l);}
      const fl=floorAt(c.p.x,c.p.z)+2;if(c.p.y<fl)c.p.y=fl;camera.position.copy(c.p);camera.quaternion.copy(vueloLook(c.p,c.l));}
    else{VUELO.t2+=dt;const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw);
      // plano en tercera persona: detrás del personaje, mirándolo
      let bk=4.6;for(let t=0.6;t<=4.6;t+=0.3){const qx=player.x-fx*t,qz=player.z-fz*t;if(!isFree(qx,qz,0.25)||floorAt(qx,qz)>player.feet+2.6){bk=Math.max(1.2,t-0.45);break;}}
      const tp=new THREE.Vector3(player.x-fx*bk,player.feet+2.1,player.z-fz*bk),tq=vueloLook(tp,new THREE.Vector3(player.x+fx*2,player.feet+1.3,player.z+fz*2));
      try{const w=AVATAR.walk;if(w&&!MOUNT.riding){w.visible=true;w.position.set(player.x,player.feet,player.z);w.rotation.y=player.yaw+Math.PI;}}catch(e){}
      const T1=3.4,T2=1.1,T3=1.2,sm=x=>x*x*x*(x*(x*6-15)+10);
      if(VUELO.t2<T1){const e=sm(Math.min(1,VUELO.t2/T1)),mid=VUELO.fromP.clone().lerp(tp,e);mid.y+=Math.sin(Math.PI*e)*6;camera.position.copy(mid);camera.quaternion.copy(VUELO.fromQ.clone().slerp(tq,e));}
      else if(VUELO.t2<T1+T2){camera.position.copy(tp);camera.quaternion.copy(tq);}
      else if(VUELO.t2<T1+T2+T3){const e=sm((VUELO.t2-T1-T2)/T3);camera.position.copy(tp.clone().lerp(pCam,e));camera.quaternion.copy(tq.clone().slerp(qCam,e));}
      else{camera.position.copy(pCam);camera.quaternion.copy(qCam);vueloEnd(false);}}
  }catch(e){window.__vuErr=String(e&&e.stack||e);vueloEnd(true);}return r;};}
// ---- teclas: durante el vuelo, Espacio / Intro / Esc lo saltan y no llega nada más al juego
addEventListener('keydown',e=>{if(!VUELO.on)return;e.stopPropagation();e.preventDefault();if(e.code==='Space'||e.code==='Enter'||e.code==='Escape'||e.code==='NumpadEnter')vueloEnd(true);},true);
// lo que normalmente aparece al empezar (elegir nombre, tutorial…) espera a que acabe el vuelo
{const f=pjDlg;pjDlg=function(){if(VUELO.on){const a=arguments;VUELO.after.push(()=>pjDlg.apply(this,a));return;}return f.apply(this,arguments);};}
{const f=tutStart;tutStart=function(){if(VUELO.on){VUELO.after.push(()=>tutStart());return;}return f.apply(this,arguments);};}
{const f=startGame;startGame=function(){const first=!VUELO.seen;const r=f.apply(this,arguments);if(first&&ui==='play'&&vueloOK()){VUELO.seen=true;let n=0;const go=()=>{VUELO.why='espera ui='+ui;if(ui==='play')vueloStart();else if(++n<40)setTimeout(go,100);};setTimeout(go,60);}return r;};}
// menú: Esc → Partida → Introducción al entrar (activar o quitar)
{const f=gmDo;gmDo=function(k){if(k==='vuelo'){const off=!vueloOff();try{localStorage.setItem('nostos-vuelo-off',off?'1':'0');}catch(e){}try{gmClose&&gmClose();}catch(e){}
  setTimeout(()=>toast('<span class="label">Introducción al entrar</span><br>'+(off?'Ya no se mostrará el vuelo del ave al entrar.':'Al entrar verás el vuelo del ave sobre la ciudad.')),300);return;}return f.apply(this,arguments);};}
// para las pruebas: coloca el vuelo en un punto (metros recorridos) y dibuja ya ese fotograma
function vueloShot(s,t2){VUELO.s=s;VUELO.cam=null;VUELO.lt=performance.now();if(t2!=null){VUELO.ph='land';VUELO.t2=t2;if(!VUELO.fromP){VUELO.fromP=camera.position.clone();VUELO.fromQ=camera.quaternion.clone();}}
  placeCamera();skyMesh.position.copy(camera.position);renderer.render(scene,camera);}
