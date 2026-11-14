// ============================================================ polvo bajo los cascos y la cinemática de la yegua recuperada
const DUST={pool:[],tex:null,acc:0,stepAcc:0};
function dustTex(){if(DUST.tex)return DUST.tex;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(0.5,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);DUST.tex=new THREE.CanvasTexture(c);return DUST.tex;}
function dustPuff(x,y,z,s,col){let P=DUST.pool.find(p=>!p.on);if(!P){if(DUST.pool.length>=70)return;const m=new THREE.SpriteMaterial({map:dustTex(),transparent:true,depthWrite:false,color:0xd8c49a});P={sp:new THREE.Sprite(m),on:false};scene.add(P.sp);DUST.pool.push(P);}
  P.on=true;P.t=0;P.life=1.1+Math.random()*0.6;P.s0=(s||1)*(0.5+Math.random()*0.4);P.vx=(Math.random()-0.5)*0.8;P.vz=(Math.random()-0.5)*0.8;P.vy=0.35+Math.random()*0.35;P.a=0.42+Math.random()*0.15;
  P.sp.material.color.set(col||'#d8c49a');P.sp.position.set(x,y+0.25,z);P.sp.visible=true;}
function dustTick(dt){for(const P of DUST.pool){if(!P.on)continue;P.t+=dt;const k=P.t/P.life;if(k>=1){P.on=false;P.sp.visible=false;continue;}
  P.sp.position.x+=P.vx*dt;P.sp.position.z+=P.vz*dt;P.sp.position.y+=P.vy*dt;P.vy*=0.97;const sc=P.s0*(1+k*2.2);P.sp.scale.set(sc,sc,1);P.sp.material.opacity=P.a*(1-k)*(k<0.15?k/0.15:1);}}
function dustSurfaceOK(x,z){if(inWaterK()<1)return null;const fl=floorAt(x,z),th=terrainH(x,z);if(fl>th+0.05)return null;   // sobre pavimento o tarima, nada
  if(MODE==='roma'&&x<8000&&romaInUrbs(x,z))return null;   // las calles de Roma están empedradas
  const I=player.x>8000?islandOf(x):null;if(I&&I.desert)return'#e2cf9e';if(I&&th<2.6)return'#e0d0a8';if(I&&(I.green||MODE==='roma'))return null;return'#cdb88c';}
function dustGame(dt){
  if(MOUNT.riding&&MOUNT.g&&ui==='play'){const v=MOUNT.v||0;if(v>7){const col=dustSurfaceOK(player.x,player.z);if(col){DUST.acc+=dt*v*0.22;while(DUST.acc>1){DUST.acc-=1;const g=MOUNT.g,ry=g.rotation.y,bx=-Math.sin(ry),bz=-Math.cos(ry),sd=(Math.random()-0.5)*0.8;
      dustPuff(g.position.x+bx*(0.9+Math.random()*0.6)+Math.cos(ry)*sd,floorAt(g.position.x,g.position.z),g.position.z+bz*(0.9+Math.random()*0.6)-Math.sin(ry)*sd,v>18?1.5:1.1,col);}}}}
  else if(ui==='play'&&!FLY.on&&!BOAT.on&&player.grounded&&keys.run){const sp=Math.hypot(GF.vx,GF.vz);if(sp>7){const col=dustSurfaceOK(player.x,player.z);if(col&&col!=='#cdb88c'){DUST.stepAcc+=dt*sp;if(DUST.stepAcc>2.6){DUST.stepAcc=0;dustPuff(player.x+GF.vx*-0.05,floorAt(player.x,player.z),player.z+GF.vz*-0.05,0.6,col);}}}}
  dustTick(dt);}
// ---- el relincho: una voz nasal que sube, tiembla y cae
function sfxNeigh(){if(!aOK())return;const c=AUD.ctx,t=c.currentTime+0.02;for(const[base,vol,typ]of[[620,0.05,'sawtooth'],[1240,0.018,'square']]){const o=c.createOscillator();o.type=typ;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1500;f.Q.value=2.2;
   const lfo=c.createOscillator();lfo.frequency.setValueAtTime(11,t);lfo.frequency.linearRampToValueAtTime(16,t+1.2);const lg=c.createGain();lg.gain.value=base*0.09;lfo.connect(lg).connect(o.frequency);
   o.frequency.setValueAtTime(base*0.8,t);o.frequency.linearRampToValueAtTime(base*1.45,t+0.25);o.frequency.linearRampToValueAtTime(base*1.2,t+0.7);o.frequency.exponentialRampToValueAtTime(base*0.55,t+1.35);
   const g=c.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.06);g.gain.setValueAtTime(vol,t+0.6);g.gain.exponentialRampToValueAtTime(0.0001,t+1.4);o.connect(f).connect(g).connect(AUD.master);o.start(t);o.stop(t+1.45);lfo.start(t);lfo.stop(t+1.45);}
  gfNoise(t+1.3,'lowpass',500,0.7,0.06,0.05,0.35);}   // el resoplido final
function sfxHoofThud(){if(!aOK())return;const t=AUD.ctx.currentTime;gfNoise(t,'lowpass',220,0.8,0.25,0.004,0.2);gfNoise(t+0.07,'lowpass',260,0.8,0.18,0.004,0.16);}
// ---- la yegua con un pivote en las patas traseras para poder encabritarse
function mareRig(x,z,coat){const g=grp(x,floorAt(x,z),z,0),piv=new THREE.Group(),inner=new THREE.Group();piv.position.z=-0.85;inner.position.z=0.85;piv.add(inner);g.add(piv);
  let legs=[];if(GLB.ok)legs=animalGLB('A_horse',inner,coat,'#2e2018');else{const c=lam(coat),dk=lam('#1e140e');box(0.75,0.8,1.95,c,0,1.55,0,inner);box(0.33,0.36,0.8,c,0,2.6,1.3,inner);for(const[px,pz]of[[0.25,0.75],[-0.25,0.75],[0.25,-0.75],[-0.25,-0.75]])legs.push(box(0.15,1.2,0.15,dk,px,0.6,pz,inner));}
  return{g,piv,legs};}
const CINE={on:false};
function cineCSS(){if($('cineCSS'))return;const s=document.createElement('style');s.id='cineCSS';s.textContent='#cine{position:fixed;inset:0;z-index:58;pointer-events:auto;cursor:pointer}#cine:before,#cine:after{content:"";position:absolute;left:0;right:0;height:0;background:#000;transition:height .5s ease}#cine:before{top:0}#cine:after{bottom:0}#cine.on:before,#cine.on:after{height:11vh}#cine .cap{position:absolute;left:50%;bottom:calc(11vh + 18px);transform:translateX(-50%);max-width:min(680px,90vw);text-align:center;color:#f1e8d8;font:italic 1.05rem Georgia,serif;text-shadow:0 1px 4px #000;opacity:0;transition:opacity .5s}#cine .cap.on{opacity:1}#cine .sk{position:absolute;right:16px;top:calc(11vh + 10px);font-size:.75rem;color:rgba(241,232,216,.6)}@media (prefers-reduced-motion:reduce){#cine:before,#cine:after,#cine .cap{transition:none}}';document.head.appendChild(s);}
function cineCap(t){const c=CINE.d&&CINE.d.querySelector('.cap');if(!c)return;c.classList.remove('on');setTimeout(()=>{c.textContent=t;c.classList.add('on');},t?180:0);}
function mareCine(){const h=hz(),ro=MODE==='roma',nm=ro?'la yegua blanca':'Aura';if(MARE.g){scene.remove(MARE.g);MARE.g=null;}
  if(MOUNT.riding)dismount();FLY.on=false;cineCSS();
  const R0=mareRig(h.mx,h.mz,ro?'#d8cfc0':'#8a6a4a'),g=R0.g;
  // de perfil respecto a quien juega
  const dx=h.mx-player.x,dz=h.mz-player.z,dl=Math.hypot(dx,dz)||1;g.rotation.y=Math.atan2(-dz/dl,dx/dl);
  const npc=npcAt(HORSE_NPC());
  const d=document.createElement('div');d.id='cine';d.innerHTML='<div class="cap"></div><div class="sk">'+(isTouch?'Toca para saltar':'Esc o clic para saltar')+'</div>';document.body.appendChild(d);requestAnimationFrame(()=>d.classList.add('on'));
  Object.assign(CINE,{on:true,t:0,R:R0,d,npc,phase:0,cam:{x:camera.position.x,y:camera.position.y,z:camera.position.z},ui0:ui});ui='cine';releasePointer();
  d.onclick=()=>cineEnd();cineCap('Coges la brida. '+(ro?'La yegua':'Aura')+' se asusta…');}
function cineEnd(){if(!CINE.on)return;CINE.on=false;const h=hz(),ro=MODE==='roma';if(CINE.R)scene.remove(CINE.R.g);CINE.R=null;
  const d=CINE.d;if(d){d.classList.remove('on');setTimeout(()=>d.remove(),500);}ui='play';mareShow();updateStats();
  toast('<span class="label">'+(ro?'La yegua vuelve a casa':'Aura vuelve a casa')+'</span><br>Se ha ido trotando con '+(ro?'Félix, el auriga':'Eudico de Larisa')+'. Ve a verle: te espera con tu potro.');}
function cineTick(dt){if(!CINE.on)return;CINE.t+=dt;const t=CINE.t,R0=CINE.R,g=R0.g,L=R0.legs,ease=k=>k<0?0:k>1?1:k*k*(3-2*k);
  const fx=Math.sin(g.rotation.y),fz=Math.cos(g.rotation.y),sx=fz,sz=-fx;   // adelante y costado de la yegua
  let rear=0;
  if(t>0.35&&!CINE.n){CINE.n=1;sfxNeigh();}
  if(t<2.2){rear=t<0.4?0:t<0.9?ease((t-0.4)/0.5)*0.85:t<1.6?0.85+Math.sin((t-0.9)*9)*0.05:0.85*(1-ease((t-1.6)/0.45));
    if(L.length===4){const kick=t>0.5&&t<1.8?Math.sin(t*15):0;L[0].rotation.x=-0.6*Math.min(1,rear/0.5)+kick*0.5;L[1].rotation.x=-0.6*Math.min(1,rear/0.5)-kick*0.5;L[2].rotation.x=rear*0.35;L[3].rotation.x=rear*0.35;}
    if(t>2.02&&!CINE.th){CINE.th=1;sfxHoofThud();for(let k=0;k<9;k++)dustPuff(g.position.x+fx*1.6+(Math.random()-0.5)*1.4,floorAt(g.position.x,g.position.z),g.position.z+fz*1.6+(Math.random()-0.5)*1.4,1.3);cineCap((MODE==='roma'?'La yegua':'Aura')+' se calma. Te huele la mano… pero quiere volver a casa.');}}
  else if(t<3.2){if(L.length===4)L.forEach(l=>l.rotation.x*=0.85);
    const n=CINE.npc;if(n){const want=Math.atan2(n.x-g.position.x,n.z-g.position.z);g.rotation.y+=wrapA(want-g.rotation.y)*Math.min(1,dt*3);}}
  else{const n=CINE.npc,want=n?Math.atan2(n.x-g.position.x,n.z-g.position.z):g.rotation.y;g.rotation.y+=wrapA(want-g.rotation.y)*Math.min(1,dt*3);
    const v=Math.min(7,(t-3.2)*5);g.position.x+=Math.sin(g.rotation.y)*v*dt;g.position.z+=Math.cos(g.rotation.y)*v*dt;g.position.y=floorAt(g.position.x,g.position.z)+Math.abs(Math.sin(t*9))*0.06;
    if(L.length===4){const s=Math.sin(t*9)*0.5;L[0].rotation.x=s;L[3].rotation.x=s;L[1].rotation.x=-s;L[2].rotation.x=-s;}
    CINE.da=(CINE.da||0)+dt*v*0.5;while(CINE.da>1){CINE.da-=1;const col=dustSurfaceOK(g.position.x,g.position.z);if(col)dustPuff(g.position.x-fx*1.1,floorAt(g.position.x,g.position.z),g.position.z-fz*1.1,1,col);}
    if(t>3.4&&!CINE.c2){CINE.c2=1;cineCap((MODE==='roma'?'La yegua':'Aura')+' se aleja trotando hacia '+(MODE==='roma'?'Félix':'Eudico')+'.');}}
  R0.piv.rotation.x=-rear;
  // cámara: de perfil durante el encabritamiento; luego, desde detrás de quien juega, siguiéndola
  const tgt=t<3.2?{x:g.position.x+sx*7+fx*1.2,y:floorAt(g.position.x,g.position.z)+1.7,z:g.position.z+sz*7+fz*1.2}:{x:player.x,y:player.camY+0.6,z:player.z};
  const k=1-Math.exp(-dt*(t<0.6?3:2));CINE.cam.x+=(tgt.x-CINE.cam.x)*k;CINE.cam.y+=(tgt.y-CINE.cam.y)*k;CINE.cam.z+=(tgt.z-CINE.cam.z)*k;
  camera.position.set(CINE.cam.x,CINE.cam.y,CINE.cam.z);camera.lookAt(g.position.x,floorAt(g.position.x,g.position.z)+1.3+rear*1.2,g.position.z);
  if(t>7.2)cineEnd();}
addEventListener('keydown',e=>{if(!CINE.on)return;e.stopImmediatePropagation();e.preventDefault();if(e.code==='Escape'||e.code==='Enter'||e.code==='Space')cineEnd();},true);

