// ============================================================ GAME FEEL: inercia, cámara viva, aterrizajes, pasos según el suelo, ambiente,
// respuesta visual a cada gesto, gente que reacciona y un peso propio para caballo, vuelo y barca. Todos los números están en GF.k para afinarlos.
const GF={vx:0,vz:0,ph:0,dip:0,dipV:0,roll:0,fov:70,lastYaw:null,lastT:0,obols:null,
 k:{accWalk:11,decWalk:14,accHorse:2.6,decHorse:3.4,accFly:1.6,bob:0.045,bobRun:0.06,sway:0.022,fovRun:6,fovHorse:8,fovFly:11,bankFly:0.16,bankHorse:0.05,leanStrafe:0.006,landK:0.028,landMax:0.32},
 reduced:!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)};
try{const v=localStorage.getItem('nostos-movcam');if(v==='off')GF.reduced=true;if(v==='on')GF.reduced=false;}catch(e){}
function gfToggleMotion(){GF.reduced=!GF.reduced;try{localStorage.setItem('nostos-movcam',GF.reduced?'off':'on');}catch(e){}toast(GF.reduced?'Balanceo de cámara desactivado (para quien se marea).':'Balanceo de cámara activado.');}
// ---- 1. movimiento con inercia
function gfVel(tx,tz,dt,input){const K=GF.k,a=FLY.on?K.accFly:MOUNT.riding?(input?K.accHorse:K.decHorse):(input?K.accWalk:K.decWalk),k=1-Math.exp(-dt*a);
  GF.vx+=(tx-GF.vx)*k;GF.vz+=(tz-GF.vz)*k;if(!input&&Math.hypot(GF.vx,GF.vz)<0.05){GF.vx=0;GF.vz=0;}return[GF.vx,GF.vz];}
function gfBlock(a,b){if(!b){GF.vx*=0.15;GF.vz*=0.15;}else if(!a){GF.vx*=0.6;GF.vz*=0.6;}}
function gfLand(v){if(v<5)return;const K=GF.k;GF.dipV=Math.min(K.landMax,(v-4)*K.landK)*(FLY.on?0.5:1)*(MOUNT.riding?0.6:1);sfxLand(v);}
// ---- cámara: balanceo al andar, inclinación en los giros, golpe al aterrizar y campo de visión según la velocidad
function gfCam(view3){const now=performance.now(),dt=Math.min(0.05,(now-(GF.lastT||now))/1000);GF.lastT=now;const K=GF.k,red=GF.reduced||ui!=='play';
  const spd=Math.hypot(GF.vx,GF.vz),onFoot=!MOUNT.riding&&!FLY.on&&!BOAT.on;
  const yr=GF.lastYaw===null?0:wrapA(player.yaw-GF.lastYaw)/Math.max(dt,1e-3);GF.lastYaw=player.yaw;
  // golpe de aterrizaje: baja rápido y vuelve con un muelle
  GF.dip+=(GF.dipV-GF.dip)*Math.min(1,dt*30);GF.dipV*=Math.exp(-dt*9);
  let by=0,bx=0,roll=0;
  if(onFoot&&player.grounded&&spd>0.3){const stepLen=lerp(0.8,1.3,clamp((spd-4.8)/6.2,0,1));GF.ph+=spd*dt*Math.PI/stepLen;const a=lerp(K.bob,K.bobRun,clamp((spd-4.8)/6.2,0,1))*clamp(spd/4.8,0,1);by=(Math.abs(Math.sin(GF.ph))-0.5)*a*1.4;bx=Math.sin(GF.ph)*K.sway*clamp(spd/4.8,0,1);}
  else GF.ph*=0.9;
  if(FLY.on)roll=clamp(-yr*K.bankFly,-0.22,0.22)+Math.sin(now/900)*0.015;
  else if(MOUNT.riding)roll=clamp(-yr*K.bankHorse,-0.08,0.08);
  else if(BOAT.on)roll=Math.sin(now/770)*0.03;
  else{const rx=Math.cos(player.yaw),rz=-Math.sin(player.yaw);roll=-(GF.vx*rx+GF.vz*rz)*K.leanStrafe;}
  GF.roll+=(roll-GF.roll)*Math.min(1,dt*6);
  if(!red){const rx=Math.cos(player.yaw),rz=-Math.sin(player.yaw);camera.position.y+=by-GF.dip;camera.position.x+=rx*bx;camera.position.z+=rz*bx;
    if(!view3)camera.rotation.z=GF.roll+(BOAT.on?0:0);if(BOAT.on&&!view3)camera.rotation.x+=Math.sin(now/1100)*0.012;}
  else camera.position.y-=GF.dip*0.4;
  let fv=70;if(!GF.reduced){if(onFoot&&keys.run&&spd>6.5)fv+=K.fovRun*clamp((spd-6.5)/4,0,1);if(MOUNT.riding)fv+=K.fovHorse*clamp((spd-8)/20,0,1);if(FLY.on)fv+=K.fovFly*clamp((spd-8)/22,0,1);fv+=RW.fov;}if(typeof PH!=='undefined'&&PH.on&&PH.z)fv=PH.z;
  GF.fov+=(fv-GF.fov)*Math.min(1,dt*4);if(Math.abs(camera.fov-GF.fov)>0.05){camera.fov=GF.fov;camera.updateProjectionMatrix();}}
// ---- 2. sonido: pasos según el suelo, aterrizajes, ambiente por lugar, estación y hora
function gfInCity(){if(player.x>8000)return false;return MODE==='roma'?romaInUrbs(player.x,player.z):insideWalls(player.x,player.z);}
function gfSurface(){if(inWaterK()<1)return'water';const fl=floorAt(player.x,player.z),th=terrainH(player.x,player.z);if(fl>th+0.05)return'stone';
  if(player.x>8000){const I=islandOf(player.x);if(th<2.6&&!(I&&I.desert))return'sand';if(I&&I.desert)return'sand';if(I&&(I.green||MODE==='roma'))return'grass';return'earth';}
  if(MODE==='roma')return romaInUrbs(player.x,player.z)?'stone':'grass';   // en Roma, calles empedradas dentro de la ciudad
  if(insideWalls(player.x,player.z))return'earth';return fieldAt(player.x,player.z)?'grass':'earth';}
function gfNoise(t,type,freq,q,peak,att,dec,dest){const c=AUD.ctx,s=c.createBufferSource();s.buffer=AUD.noise;s.playbackRate.value=0.8+Math.random()*0.4;const f=c.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;s.connect(f).connect(envGain(t,peak,att,dec,dest));s.start(t,Math.random()*1.5);s.stop(t+att+dec+0.05);}
function gfStep(){if(!aOK())return;const t=AUD.ctx.currentTime,k=gfSurface(),v=keys.run?1.25:1;
  if(k==='stone')gfNoise(t,'bandpass',1900+Math.random()*300,1.3,0.08*v,0.004,0.07);
  else if(k==='earth')gfNoise(t,'lowpass',650+Math.random()*120,0.7,0.12*v,0.006,0.09);
  else if(k==='sand'){gfNoise(t,'bandpass',2600,0.5,0.05*v,0.02,0.16);gfNoise(t,'lowpass',400,0.7,0.06*v,0.01,0.08);}
  else if(k==='grass'){gfNoise(t,'bandpass',1300,0.8,0.05*v,0.01,0.06);gfNoise(t+0.035,'bandpass',2200,0.9,0.03*v,0.01,0.05);}
  else if(k==='water'){gfNoise(t,'lowpass',900,1.5,0.12*v,0.01,0.22);const o=AUD.ctx.createOscillator();o.type='sine';o.frequency.setValueAtTime(900,t);o.frequency.exponentialRampToValueAtTime(300,t+0.12);o.connect(envGain(t,0.02,0.005,0.12));o.start(t);o.stop(t+0.15);}}
function sfxLand(v){if(!aOK())return;const t=AUD.ctx.currentTime,g=clamp((v-4)/10,0.3,1);gfNoise(t,'lowpass',260,0.8,0.22*g,0.004,0.18);const k=gfSurface();if(k==='stone')gfNoise(t,'bandpass',1700,1.2,0.07*g,0.003,0.06);else if(k==='water')gfNoise(t,'lowpass',1100,1,0.2*g,0.01,0.35);}
function sfxTap(){if(!aOK())return;const c=AUD.ctx,t=c.currentTime,o=c.createOscillator();o.type='triangle';o.frequency.setValueAtTime(1320,t);o.frequency.exponentialRampToValueAtTime(990,t+0.08);o.connect(envGain(t,0.035,0.004,0.12));o.start(t);o.stop(t+0.15);}
const GFA={on:false,t:0,owl:20,gull:8,creak:6};
function gfAudioInit(){if(GFA.on||!AUD.ctx||!AUD.noise)return;const c=AUD.ctx;GFA.on=true;
  // cigarras: ruido muy agudo y estrecho, modulado a unas 30 pulsaciones por segundo
  const s=c.createBufferSource();s.buffer=AUD.noise;s.loop=true;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=5400;f.Q.value=9;const am=c.createGain();am.gain.value=0.5;const lfo=c.createOscillator();lfo.frequency.value=31;const lg=c.createGain();lg.gain.value=0.5;lfo.connect(lg).connect(am.gain);
  GFA.cic=c.createGain();GFA.cic.gain.value=0;s.connect(f).connect(am).connect(GFA.cic).connect(AUD.master);s.start();lfo.start();
  // viento de la velocidad (a caballo al galope y volando)
  const w=c.createBufferSource();w.buffer=AUD.noise;w.loop=true;const wf=c.createBiquadFilter();wf.type='lowpass';wf.frequency.value=700;GFA.wf=wf;GFA.wind=c.createGain();GFA.wind.gain.value=0;w.connect(wf).connect(GFA.wind).connect(AUD.master);w.start();}
function sfxOwl(){if(!aOK())return;const c=AUD.ctx;let t=c.currentTime+0.05;for(let i=0;i<2;i++){const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(i?520:600,t);o.frequency.exponentialRampToValueAtTime(i?480:560,t+0.35);o.connect(envGain(t,0.02,0.06,0.4));o.start(t);o.stop(t+0.5);t+=0.55;}}
function sfxGull(){if(!aOK())return;const c=AUD.ctx;let t=c.currentTime+0.05;const n=2+Math.floor(Math.random()*3);for(let i=0;i<n;i++){const o=c.createOscillator();o.type='sawtooth';const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1800;f.Q.value=2;o.frequency.setValueAtTime(1500,t);o.frequency.exponentialRampToValueAtTime(900,t+0.25);o.connect(f).connect(envGain(t,0.012,0.03,0.25));o.start(t);o.stop(t+0.3);t+=0.3+Math.random()*0.15;}}
function sfxCreak(){if(!aOK())return;const c=AUD.ctx,t=c.currentTime,o=c.createOscillator();o.type='sawtooth';const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=420;f.Q.value=6;o.frequency.setValueAtTime(70,t);o.frequency.linearRampToValueAtTime(95,t+0.4);o.connect(f).connect(envGain(t,0.025,0.08,0.45));o.start(t);o.stop(t+0.6);}
function gfAudio(dt){if(!aOK())return;gfAudioInit();if(!GFA.on)return;const now=AUD.ctx.currentTime;GFA.t+=dt;if(GFA.t<0.25)return;const st=GFA.t;GFA.t=0;
  const mo=calNow().mo,summer=mo>=5&&mo<=8,outside=!gfInCity(),inMap=ui==='play'||ui==='dialog';
  const th=terrainH(player.x,player.z),nearSea=th<4;
  // cigarras: solo en verano, fuera de la ciudad, en las horas de calor (de 10 a 18) y a tandas: cantan un rato, callan y vuelven a empezar
  GFA.cicT=(GFA.cicT||0)-st;if(GFA.cicT<=0){GFA.cicOn=!GFA.cicOn;GFA.cicT=GFA.cicOn?12+Math.random()*20:18+Math.random()*40;}
  const hh=clock.h,hot=hh>=10&&hh<=18;
  GFA.cic.gain.setTargetAtTime(inMap&&summer&&hot&&GFA.cicOn&&outside&&DAYF>0.55&&!nearSea&&!(typeof ACC!=='undefined'&&ACC.noAmb)?0.014:0,now,GFA.cicOn?2.5:1.2);
  const spd=Math.hypot(GF.vx,GF.vz),wv=FLY.on?clamp(spd/25,0,1)*0.09+0.02:MOUNT.riding?clamp((spd-10)/20,0,1)*0.05:0;GFA.wind.gain.setTargetAtTime(wv,now,0.4);GFA.wf.frequency.setTargetAtTime(500+spd*30,now,0.4);
  GFA.owl-=st;if(GFA.owl<0){GFA.owl=18+Math.random()*30;if(DAYF<0.25&&outside)sfxOwl();}
  GFA.gull-=st;if(GFA.gull<0){GFA.gull=7+Math.random()*14;if(DAYF>0.3&&(nearSea||BOAT.on||(typeof HARBOR!=='undefined'&&HARBOR.ok&&Math.hypot(player.x-HARBOR.x,player.z-HARBOR.z)<160)))sfxGull();}
  GFA.creak-=st;if(GFA.creak<0){GFA.creak=3+Math.random()*5;if(BOAT.on)sfxCreak();}}
// ---- 3. respuesta visual: pulso al interactuar, cifras que flotan al ganar algo y destello al subir de nivel
function gfCSS(){if($('gfCSS'))return;const s=document.createElement('style');s.id='gfCSS';s.textContent=
 '@keyframes gfIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%)}}@keyframes gfPop{0%{opacity:0;transform:translateX(-50%) scale(.8)}60%{opacity:1;transform:translateX(-50%) scale(1.04)}100%{transform:translateX(-50%) scale(1)}}'+
 '#dialog:not([hidden]){animation:gfIn .2s ease-out}#prompt:not([hidden]){animation:gfPop .18s ease-out}'+
 '.gfRing{position:fixed;left:50%;top:50%;width:18px;height:18px;margin:-9px 0 0 -9px;border:2px solid rgba(232,176,122,.9);border-radius:50%;pointer-events:none;z-index:55;animation:gfRing .45s ease-out forwards}@keyframes gfRing{to{transform:scale(4.5);opacity:0;border-width:1px}}'+
 '.gfFloat{position:fixed;pointer-events:none;z-index:56;font:600 16px Georgia,serif;text-shadow:0 1px 3px #000,0 0 8px rgba(0,0,0,.5);animation:gfFloat 1.6s ease-out forwards;white-space:nowrap}@keyframes gfFloat{0%{opacity:0;transform:translateY(8px)}15%{opacity:1}100%{opacity:0;transform:translateY(-38px)}}'+
 '.gfGlow{position:fixed;inset:0;pointer-events:none;z-index:54;box-shadow:inset 0 0 160px 40px rgba(232,176,90,.55);animation:gfGlow 1.4s ease-out forwards}@keyframes gfGlow{0%{opacity:0}20%{opacity:1}100%{opacity:0}}'+
 '@media (prefers-reduced-motion:reduce){.gfRing,.gfGlow{display:none}#dialog:not([hidden]),#prompt:not([hidden]){animation:none}}';document.head.appendChild(s);}
gfCSS();
function gfPulse(){gfCSS();sfxTap();const r=document.createElement('div');r.className='gfRing';document.body.appendChild(r);setTimeout(()=>r.remove(),500);}
let gfFloatN=0;
function gfFloat(txt,col){gfCSS();const e=document.createElement('div');e.className='gfFloat';e.textContent=txt;e.style.color=col||'#e8b07a';const st=$('stats')||document.querySelector('#hud');const b=st?st.getBoundingClientRect():{left:20,bottom:120};
  e.style.left=(b.left+18+(gfFloatN%3)*14)+'px';e.style.top=(b.bottom+6+(gfFloatN%3)*20)+'px';gfFloatN++;document.body.appendChild(e);setTimeout(()=>e.remove(),1700);}
function gfGlow(){gfCSS();const e=document.createElement('div');e.className='gfGlow';document.body.appendChild(e);setTimeout(()=>e.remove(),1500);}
// ---- 4. gente viva: los paseantes miran a quien pasa cerca y se apartan
function gfPeople(dt){const rid=MOUNT.riding,R0=rid?4.5:2.6;for(const w of walkers){const g=w.g;if(w.home||!g.visible)continue;const dx=g.position.x-player.x,dz=g.position.z-player.z,d=Math.hypot(dx,dz);if(d>6)continue;
   if(w.wait>0||!w.moving){if(d<4.5){const ta=Math.atan2(-dx,-dz);g.rotation.y+=wrapA(ta-g.rotation.y)*Math.min(1,dt*3);}}
   else if(d<R0){const mx=w.tx-g.position.x,mz=w.tz-g.position.z,ml=Math.hypot(mx,mz)||1,nx=-mz/ml,nz=mx/ml,side=Math.sign(dx*nx+dz*nz)||1,f=(R0-d)/R0*(rid?3:1.6);
     g.position.x+=nx*side*f*dt;g.position.z+=nz*side*f*dt;}}}
// ---- arranque y tick
function gfTick(dt){delterTick();cavTick(dt);atalTick();finTick(dt);dreamTick();artTick();urbTick(dt);progTick(dt);jrTick(dt);cvTick(dt);atTick(dt);hbTick(dt);spTick(dt);visTick(dt);wxTick(dt);uxTick(dt);mtTick(dt);mtBtnTick();clbTick(dt);natTick(dt);natAppTick(dt);rdTick(dt);cyTick(dt);objTick(dt);rcTick(dt);eduTick(dt);accTick(dt);seal2Tick(dt);ambTick(dt);amb2Tick(dt);swTick(dt);crtTick(dt);r7Tick(dt);isl3Tick(dt);tpTick(dt);colsTick(dt);cullTick(dt);mergeTick(dt);v2Tick(dt);rutTick(dt);zsTick(dt);gdTick();socTick(dt);dioTick(dt);pitTick(dt);herTick(dt);curTick(dt);n2Tick(dt);forTick(dt);wildTick(dt);gf4Tick(dt);gsTick(dt);gf5Tick(dt);wobTick(dt);fogTick(dt);faceTick(dt);arvTick(dt);capTick(dt);ilrTick(dt);sitTick(dt);psTick(dt);lauTick(dt);crxTick(dt);bvTick(dt);stTick(dt);memTick(dt);famTick(dt);needTick(dt);ruTick(dt);farmTick();gf2Tick(dt);dustGame(dt);cineTick(dt);tmTick();if(typeof keysAutoTick==='function')keysAutoTick();if(ui!=='play'){GF.vx*=0.5;GF.vz*=0.5;}gfAudio(dt);gfPeople(dt);
  rwTick(dt);}


function keysToggle(v){const k=$('keys');if(!k)return;k.classList.toggle('show',v===undefined?!k.classList.contains('show'):v);}
$('bKeys').onclick=()=>keysToggle();
let keysAuto=0;function keysAutoTick(){if(keysAuto===0&&ui==='play'&&!isTouch){keysAuto=performance.now();keysToggle(true);}else if(keysAuto>0&&performance.now()-keysAuto>12000){keysAuto=-1;keysToggle(false);}}


// ---- perros callejeros curiosos: a veces se acercan, te huelen, se sientan moviendo la cola y te siguen un rato
function sfxBark(n){if(!aOK())return;const c=AUD.ctx;let t=c.currentTime+0.02;for(let i=0;i<(n||1);i++){const o=c.createOscillator();o.type='sawtooth';const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=700;f.Q.value=1.4;o.frequency.setValueAtTime(330+Math.random()*60,t);o.frequency.exponentialRampToValueAtTime(170,t+0.13);o.connect(f).connect(envGain(t,0.05,0.006,0.13));o.start(t);o.stop(t+0.16);gfNoise(t,'bandpass',900,1,0.03,0.005,0.08);t+=0.22+Math.random()*0.1;}}
function sfxWhine(){if(!aOK())return;const c=AUD.ctx,t=c.currentTime+0.02,o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(900,t);o.frequency.linearRampToValueAtTime(1250,t+0.25);o.frequency.linearRampToValueAtTime(800,t+0.5);o.connect(envGain(t,0.018,0.05,0.45));o.start(t);o.stop(t+0.55);}
function dogEnd(F,cd){F.cur=null;F.friend=false;F.sat=false;F.cd=cd||rr(70,140);F.w=0;if(F.A.body)F.A.body.rotation.x=0;if(F.A.head)F.A.head.rotation.z=0;}
function dogCurious(F,dt,T){const g=F.A.g,A=F.A,dx=player.x-g.position.x,dz=player.z-g.position.z,d=Math.hypot(dx,dz);
  if(F.cd===undefined)F.cd=rr(5,40);F.cd-=dt;
  if(!F.cur){if(F.cd>0||d>14||ui!=='play'||MOUNT.riding||FLY.on||BOAT.on||R()>dt*0.5)return false;
    if(FAUNA.filter(q=>q.cur&&Math.hypot(q.A.g.position.x-player.x,q.A.g.position.z-player.z)<60).length>=2){F.cd=rr(20,40);return false;}
    F.cur='come';F.ct=rr(18,35);if(R()<0.6)sfxBark(1+Math.floor(R()*2));}
  if(MOUNT.riding||FLY.on||BOAT.on||d>40){if(MOUNT.riding&&d<20)sfxBark(2);dogEnd(F);return false;}
  F.ct-=dt;if(F.ct<=0){dogEnd(F);return false;}
  const keep=F.friend?2.4:1.7;
  if(d>keep+0.6){if(F.sat){F.sat=false;if(A.body)A.body.rotation.x=0;}
    const tx=player.x-dx/d*keep,tz=player.z-dz/d*keep,mx=tx-g.position.x,mz=tz-g.position.z,ml=Math.hypot(mx,mz)||1,v=Math.min(ml,dt*(d>6?3.2:1.5));
    const nx=g.position.x+mx/ml*v,nz=g.position.z+mz/ml*v;if(isFree(nx,nz,0.3)){g.position.x=nx;g.position.z=nz;}else{g.position.x+=mz/ml*v*0.7;g.position.z-=mx/ml*v*0.7;}
    g.position.y=floorAt(g.position.x,g.position.z);g.rotation.y+=wrapA(Math.atan2(mx,mz)-g.rotation.y)*Math.min(1,dt*7);
    F.ph+=v*9/(g.scale.x||1);const s=Math.sin(F.ph);if(A.legs.length===4){A.legs[0].rotation.x=s*0.5;A.legs[3].rotation.x=s*0.5;A.legs[1].rotation.x=-s*0.5;A.legs[2].rotation.x=-s*0.5;}
    if(A.head){A.head.rotation.x=-0.1;A.head.rotation.z=0;}}
  else{if(!F.sat){F.sat=true;faunaPose(F,'sit');if(R()<0.35)sfxWhine();}
    g.rotation.y+=wrapA(Math.atan2(dx,dz)-g.rotation.y)*Math.min(1,dt*4);
    if(A.head){A.head.rotation.z=Math.sin(T*1.1+F.ph)*0.28;A.head.rotation.y=Math.sin(T*0.6+F.ph)*0.15;A.head.rotation.x=-0.15;}
    if(d<1.1){g.position.x-=dx/d*dt*0.8;g.position.z-=dz/d*dt*0.8;}}
  if(A.tail)A.tail.rotation.y=Math.sin(T*(F.sat?16:12)+F.ph)*(F.friend?0.8:0.6);
  F.obj.x=g.position.x;F.obj.z=g.position.z;return true;}
function dogTalk(F){const ro=MODE==='roma',one=casaOpen('❦',F.friend?'Tu amigo de cuatro patas':'Un perro curioso',ro?'Animales de Roma':'Animales de Atenas'),B=$('dBody');
  B.innerHTML=F.friend?'<p>El perro levanta las orejas en cuanto le hablas y mueve la cola. No se separa de ti.</p>':'<p>Un perro de la calle, flaco y con una oreja mordida, se ha acercado a olerte. Ladea la cabeza y te mira, esperando a ver qué haces.</p>';
  if(!F.friend)one('Agacharte y dejar que te huela la mano',()=>{F.friend=true;F.ct=150;state.fauna=state.fauna||{};const first=!state.fauna.amigo;state.fauna.amigo=1;if(first)qAdd('eu',1);save();sfxWhine();
    B.innerHTML='<p>Te huele los dedos con cuidado y, de pronto, te da un lametón y se tumba panza arriba. Ya tienes amigo. Te seguirá un buen rato.</p><p class="sub">'+(ro?'Columela recomienda tener perros en el campo y en la casa, y Plinio el Viejo cuenta historias de perros fieles, como el que no se separó del cadáver de su amo, ejecutado en Roma, y nadó tras él por el Tíber.':'En la Odisea, cuando Ulises vuelve a Ítaca disfrazado de mendigo después de veinte años, nadie lo reconoce… salvo su viejo perro Argos, tumbado sobre un montón de estiércol, que levanta las orejas, mueve la cola y muere en ese momento.')+'</p><p class="sub">'+(ro?'Plinio, Historia natural VIII 142-145; Columela VII 12.':'Odisea XVII 290-327.')+'</p>';
    const o=$('dOpts');o.innerHTML='';one('Seguir paseando',closeDialog);},'quiz');
  one(F.friend?'Rascarle detrás de las orejas':'Darle unas palmadas',()=>{F.ct=Math.max(F.ct,40);B.innerHTML='<p>Cierra los ojos de gusto y te empuja la mano con el hocico para que no pares.</p>';const o=$('dOpts');o.innerHTML='';one('Seguir paseando',closeDialog);});
  one(F.friend?'Decirle que se vaya a casa':'Apartarlo',()=>{dogEnd(F,240);B.innerHTML='<p>'+(F.friend?'Te mira un momento, como si no entendiera, y se aleja trotando calle abajo.':'Se aparta con el rabo entre las patas y se va a husmear a otra parte.')+'</p>';const o=$('dOpts');o.innerHTML='';one('Seguir',closeDialog);});
  one('¿Qué perro es?',()=>{const I=faunaInfo(F.info)||['Perro',''];B.innerHTML='<p>'+I[1]+'</p>'+(I[2]?'<p class="sub">Fuentes: '+I[2]+'.</p>':'');const o=$('dOpts');o.innerHTML='';one('Volver',()=>dogTalk(F));});
  one('Dejarlo',closeDialog);}


// ============================================================ modo táctil: acción contextual, joystick flotante, menú en hoja
const TM={act:null,lastKind:'',lastName:''};
function tmIcon(k){const m={npc:'talk',god:'talk',story:'talk',captain:'talk',daedalo:'talk',fest:'talk',sign:'scroll',relief:'eye',sphere:'sphere',fauna:'hand',egx:'hand',horse:'horse'};return m[k]||'hand';}
const TM_IC={talk:'<path d="M4 5h16v10.5H10L5 19.5v-4H4z"/><path d="M8 9.5h8M8 12.5h5"/>',scroll:'<path d="M7 4h11a2 2 0 0 1 2 2v11"/><path d="M7 4a2 2 0 0 0-2 2v1.5h4V6a2 2 0 0 0-2-2z"/><path d="M9 7.5V18a2 2 0 0 0 2 2h8.5a1.5 1.5 0 0 0 1.5-1.5V17H11"/><path d="M12 9.5h5M12 12.5h5"/>',eye:'<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',sphere:'<circle cx="12" cy="12" r="6"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',hand:'<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M11 10V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 10.5V6a1.5 1.5 0 0 1 3 0v8c0 4-2.5 7-6.5 7-2.7 0-4.4-1.4-5.8-3.6L3 13.6a1.5 1.5 0 0 1 2.5-1.6L8 15"/>',horse:'<path d="M6 21v-4.5L3.5 14l1.8-3.6 4.2-1.9L11 5l1.6 2.6c3.4.8 6.4 4 6.4 8.4V21"/><path d="M11 5l-.6-2"/><circle cx="9.2" cy="10.6" r=".8" fill="currentColor" stroke="none"/>'};
function tmTick(){if(!isTouch)return;const tc=$('touch');if(!tc)return;tc.classList.toggle('off',ui!=='play');if(ui!=='play')return;
  const b=$('tTalk'),nm=$('tAName');let kind=null,name='';
  if(focus){kind=focus.kind;name=(focus.data&&focus.data.name)||'';if(kind==='fauna'&&focus.F){const I=faunaInfo(focus.F.info);name=I?I[0]:'';}}
  else if(typeof horseNear==='function'&&horseNear()&&!MOUNT.riding){kind='horse';name='Montar el caballo';}
  if(kind!==TM.lastKind){TM.lastKind=kind;b.hidden=!kind;if(kind)b.innerHTML='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">'+TM_IC[tmIcon(kind)]+'</svg>';}
  if(name!==TM.lastName){TM.lastName=name;nm.textContent=name;}nm.classList.toggle('on',!!kind&&!!name);
  const hs=hz();$('tHorse').hidden=!(hs&&hs.own)||kind==='horse';$('tFly').hidden=!(wz().own);$('tTorch').hidden=!(DAYF<0.3||TORCH.on);$('tDown').hidden=!FLY.on;
  keys.run=Math.hypot(joy.x,joy.y)>0.93;}
if(isTouch){document.body.classList.add('tm');
  const zone=$('joyZone'),jz=$('joy'),kn=$('knob');let zid=null,cx=0,cy=0;const home=()=>{jz.style.left='';jz.style.top='';jz.style.bottom='';jz.classList.remove('on');};
  zone.addEventListener('touchstart',e=>{if(ui!=='play'||zid!==null)return;const t=e.changedTouches[0];zid=t.identifier;cx=t.clientX;cy=t.clientY;const r=jz.getBoundingClientRect();jz.style.left=(cx-r.width/2)+'px';jz.style.top=(cy-r.height/2)+'px';jz.style.bottom='auto';jz.classList.add('on');e.preventDefault();},{passive:false});
  zone.addEventListener('touchmove',e=>{for(const t of e.changedTouches)if(t.identifier===zid){let dx=t.clientX-cx,dy=t.clientY-cy;const L=Math.hypot(dx,dy),m=52;if(L>m){dx*=m/L;dy*=m/L;}joy.x=dx/m;joy.y=dy/m;kn.style.transform='translate('+dx+'px,'+dy+'px)';}e.preventDefault();},{passive:false});
  const endZ=e=>{for(const t of e.changedTouches)if(t.identifier===zid){zid=null;joy.x=joy.y=0;kn.style.transform='';home();}};zone.addEventListener('touchend',endZ);zone.addEventListener('touchcancel',endZ);
  // saltar (y, volando, subir mientras se mantiene) y bajar
  const hold=(id,k,tap)=>{const el=$(id);el.onclick=null;el.addEventListener('pointerdown',e=>{e.preventDefault();if(FLY.on)keys[k]=true;else if(tap)tap();});for(const ev of['pointerup','pointerleave','pointercancel'])el.addEventListener(ev,()=>{keys[k]=false;});};
  hold('tJump','jump',()=>jump());hold('tDown','down');
  $('tFly').onclick=()=>{if(ui==='play')toggleWings();};$('tTalk').onclick=()=>{if(ui!=='play')return;if(focus)interact();else if(horseNear()&&hz().own)mountHorse();};$('tHorse').onclick=()=>{if(ui==='play')callHorse();};$('tTorch').onclick=()=>toggleTorch();$('mini').addEventListener('click',()=>{if(ui==='play')openMap();});
  $('stats').addEventListener('click',e=>{if(e.target.closest('button'))return;$('stats').classList.toggle('open');});
  const sheet=$('mSheet'),openS=()=>{if(ui!=='play')return;sheet.hidden=false;ui='sheet';const c=$('clock');$('mClock').textContent=c?c.textContent:'';const sb=sheet.querySelector('[data-m="sound"]');sb.setAttribute('aria-pressed',AUD_ON?'true':'false');sheet.querySelector('[data-m="cam"]').setAttribute('aria-pressed',GF.reduced?'false':'true');},closeS=()=>{sheet.hidden=true;if(ui==='sheet')ui='play';};
  $('tMenu').onclick=()=>gmOpen();$('mClose').onclick=closeS;sheet.addEventListener('click',e=>{if(e.target===sheet)closeS();});
  sheet.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const m=b.dataset.m;closeS();
    if(m==='journal')openJournal();else if(m==='map')openMap();else if(m==='lib')openLibrary();else if(m==='time')advanceTime();else if(m==='view')toggleView();else if(m==='torch')toggleTorch();else if(m==='horse')callHorse();
    else if(m==='sound'){initAudio();toggleSound();}else if(m==='cam')gfToggleMotion();else if(m==='era')$('bEra').click();
    else if(m==='full'){const d=document.documentElement;try{if(document.fullscreenElement)document.exitFullscreen();else(d.requestFullscreen||d.webkitRequestFullscreen).call(d);}catch(e){}}});}

