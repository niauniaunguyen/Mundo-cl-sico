// ============================================================ GAME FEEL 2: caballo vivo, animales que reaccionan, huellas, agua, saludos,
// viento en los árboles, diálogos que se escriben, monedas que vuelan, luciérnagas y humo de los hogares
// ---- partículas genéricas (agua, humo, luciérnagas)
const PFX={pool:[]};
function pfx(x,y,z,o){let P=PFX.pool.find(p=>!p.on);if(!P){if(PFX.pool.length>=110)return;const m=new THREE.SpriteMaterial({map:dustTex(),transparent:true,depthWrite:false});P={sp:new THREE.Sprite(m),on:false};scene.add(P.sp);PFX.pool.push(P);}
  Object.assign(P,{on:true,t:0,life:o.life||1,vx:o.vx||0,vy:o.vy||0,vz:o.vz||0,g:o.g||0,s0:o.s||0.4,grow:o.grow===undefined?1.5:o.grow,a:o.a||0.6,blink:o.blink||0,ph:Math.random()*10});
  P.sp.material.color.set(o.col||'#ffffff');P.sp.material.blending=o.add?THREE.AdditiveBlending:THREE.NormalBlending;P.sp.position.set(x,y,z);P.sp.visible=true;}
function pfxTick(dt){for(const P of PFX.pool){if(!P.on)continue;P.t+=dt;const k=P.t/P.life;if(k>=1){P.on=false;P.sp.visible=false;continue;}
  P.vy-=P.g*dt;P.sp.position.x+=P.vx*dt;P.sp.position.y+=P.vy*dt;P.sp.position.z+=P.vz*dt;const sc=P.s0*(1+k*P.grow);P.sp.scale.set(sc,sc,1);
  let a=P.a*(1-k)*(k<0.1?k/0.1:1);if(P.blink)a*=0.35+0.65*Math.max(0,Math.sin(P.t*P.blink+P.ph));P.sp.material.opacity=a;}}
function splash(x,z,big){const y=floorAt(x,z)+0.1;for(let i=0;i<(big?10:5);i++){const a=Math.random()*TAU,v=0.6+Math.random()*(big?1.6:0.9);pfx(x,y,z,{col:'#e8f2f4',vx:Math.cos(a)*v,vz:Math.sin(a)*v,vy:1.6+Math.random()*(big?2.2:1.2),g:9,life:0.6,s:big?0.35:0.22,grow:0.8,a:0.8});}ripple(x,z,big?1.6:1);}
// ---- marcas en el suelo: huellas, cascos y ondas en el agua (planos que se desvanecen)
const MARKS={pool:[],geo:null};
function mark(x,z,a,kind,y){if(!MARKS.geo)MARKS.geo=new THREE.CircleGeometry(1,16);let M2=MARKS.pool.find(m=>!m.on);
  if(!M2){if(MARKS.pool.length>=140)M2=MARKS.pool.reduce((o,m)=>m.t>o.t?m:o);else{const m=new THREE.Mesh(MARKS.geo,new THREE.MeshBasicMaterial({color:0x000000,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));m.rotation.x=-Math.PI/2;scene.add(m);M2={m,on:false};MARKS.pool.push(M2);}}
  const m=M2.m;Object.assign(M2,{on:true,t:0,kind,life:kind==='ripple'?1.4:kind==='hoof'?28:22});m.visible=true;
  if(kind==='ripple'){m.geometry=MARKS.ring||(MARKS.ring=new THREE.RingGeometry(0.85,1,28));m.material.color.set('#e8f4f6');m.material.opacity=0.55;m.position.set(x,y!==undefined?y:floorAt(x,z)+0.06,z);m.scale.set(0.3,0.3,1);M2.s=y;}
  else{m.geometry=MARKS.geo;m.material.color.set('#3a2a1a');m.material.opacity=kind==='hoof'?0.3:0.24;m.position.set(x,floorAt(x,z)+0.03,z);m.rotation.z=a||0;if(kind==='hoof')m.scale.set(0.11,0.13,1);else m.scale.set(0.07,0.14,1);}}
function ripple(x,z,s){const fl=floorAt(x,z);mark(x,z,0,'ripple',fl+0.08);const M2=MARKS.pool.find(m=>m.on&&m.kind==='ripple'&&m.t===0);if(M2)M2.big=s||1;}
function marksTick(dt){for(const M2 of MARKS.pool){if(!M2.on)continue;M2.t+=dt;const k=M2.t/M2.life;if(k>=1){M2.on=false;M2.m.visible=false;continue;}
  if(M2.kind==='ripple'){const s=(0.3+k*1.8)*(M2.big||1);M2.m.scale.set(s,s,1);M2.m.material.opacity=0.55*(1-k);}else if(k>0.6)M2.m.material.opacity=(M2.kind==='hoof'?0.3:0.24)*(1-(k-0.6)/0.4);}}
let footSide=1;
function footStep(kind){const yaw=player.yaw,rx=Math.cos(yaw),rz=-Math.sin(yaw);footSide=-footSide;const x=player.x+rx*0.13*footSide,z=player.z+rz*0.13*footSide;
  if(kind==='water'){splash(x,z,false);return;}if(kind==='sand'||(kind==='earth'&&player.x>8000))mark(x,z,-yaw,'foot');}
// ---- 1. caballo vivo: ritmos de cascos según el aire, resoplidos, crin y cola, derrapes
const HB={t:0,last:0,idle:6,vPrev:0,parts:null};
const GAITS=[{max:3.5,n:'paso',T:1.15,b:[0,0.25,0.5,0.75],v:0.11},{max:10,n:'trote',T:0.6,b:[0,0.03,0.5,0.53],v:0.15},{max:19,n:'medio galope',T:0.62,b:[0,0.16,0.24,0.42],v:0.18},{max:1e9,n:'galope',T:0.46,b:[0,0.08,0.18,0.26],v:0.2}];
function sfxBeat(vol,water){if(!aOK())return;const t=AUD.ctx.currentTime;if(water){gfNoise(t,'lowpass',800,1,vol*0.9,0.01,0.18);return;}gfNoise(t,'bandpass',780+Math.random()*200,3.5,vol,0.003,0.06);gfNoise(t,'lowpass',200,0.8,vol*0.8,0.003,0.08);}
function sfxSnort(){if(!aOK())return;const t=AUD.ctx.currentTime;gfNoise(t,'bandpass',900,0.9,0.07,0.03,0.25);gfNoise(t+0.28,'bandpass',700,0.9,0.05,0.02,0.2);}
function sfxSkid(){if(!aOK())return;const c=AUD.ctx,t=c.currentTime,s=c.createBufferSource();s.buffer=AUD.noise;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(1600,t);f.frequency.exponentialRampToValueAtTime(400,t+0.5);s.connect(f).connect(envGain(t,0.12,0.02,0.5));s.start(t);s.stop(t+0.6);}
function horseAlive(dt){const g=MOUNT.g;if(!g||!g.visible)return;const v=MOUNT.riding?(MOUNT.v||0):0,now=performance.now()/1000;
  if(!HB.parts&&GLB.ok&&g.children.length>=3)HB.parts={mane:g.children[1],tail:g.children[2]};
  const P=HB.parts;if(P){P.tail.rotation.y=v<1?Math.sin(now*2.6)*0.07+Math.sin(now*7.3)*0.02:Math.sin(now*9)*0.03;P.tail.rotation.x=-Math.min(0.08,v*0.004);P.mane.rotation.z=Math.sin(now*(v>8?14:2))*Math.min(0.03,0.006+v*0.0015);}
  if(MOUNT.riding&&ui==='play'&&v>0.6){const G=GAITS.find(q=>v<q.max),T=G.T;HB.t+=dt;const c0=(HB.t-dt)%T,c1=HB.t%T;
    for(const b of G.b){const o=b*T;if((c0<o&&c1>=o)||(c1<c0&&(o>c0||o<=c1))){const water=inWaterK()<1;sfxBeat(G.v,water);
      const ry=g.rotation.y,side=(Math.random()-0.5)*0.4,hx=g.position.x+Math.sin(ry)*(b<0.3?-0.6:0.6)+Math.cos(ry)*side,hz=g.position.z+Math.cos(ry)*(b<0.3?-0.6:0.6)-Math.sin(ry)*side;
      if(water)splash(hx,hz,v>8);else if(gfSurface()==='sand')mark(hx,hz,0,'hoof');}}}
  else HB.t=0;
  // derrape: frenada brusca a galope
  if(MOUNT.riding){const dv=(HB.vPrev-v)/Math.max(dt,1e-3);if(dv>14&&HB.vPrev>12&&!HB.sk){HB.sk=1;sfxSkid();const col=dustSurfaceOK(player.x,player.z)||'#cdb88c';for(let k=0;k<12;k++)dustPuff(g.position.x+(Math.random()-0.5)*1.8,floorAt(g.position.x,g.position.z),g.position.z+(Math.random()-0.5)*1.8,1.4,col);}if(dv<4)HB.sk=0;}
  HB.vPrev=v;
  // parado: resopla y sacude la crin de vez en cuando
  if(v<0.4&&Math.hypot(g.position.x-player.x,g.position.z-player.z)<30){HB.idle-=dt;if(HB.idle<0){HB.idle=6+Math.random()*8;sfxSnort();HB.shake=0.6;}}
  if(HB.shake>0){HB.shake-=dt;if(P)P.mane.rotation.z+=Math.sin(HB.shake*30)*0.05*HB.shake;}}
// ---- 2. animales que reaccionan: gallinas y gansos huyen aleteando, cabras se apartan, palomas que levantan el vuelo
const FLEE={hen:1,rooster:1,goose:1,duck:1,quail:1};
function sfxCluck(){if(!aOK())return;const c=AUD.ctx;let t=c.currentTime+0.01;for(let i=0;i<3;i++){const o=c.createOscillator();o.type='square';const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1400;f.Q.value=3;o.frequency.setValueAtTime(700+Math.random()*200,t);o.frequency.exponentialRampToValueAtTime(450,t+0.07);o.connect(f).connect(envGain(t,0.025,0.004,0.07));o.start(t);o.stop(t+0.09);t+=0.09+Math.random()*0.05;}}
function animalsReact(dt){const ps=MOUNT.riding?(MOUNT.v||0):Math.hypot(GF.vx,GF.vz);if(ui!=='play')return;
  for(const F of FAUNA){const g=F.A.g;if(!g.visible||F.cur)continue;const dx=g.position.x-player.x,dz=g.position.z-player.z,d=Math.hypot(dx,dz);
    if(F.flee>0){F.flee-=dt;if(F.flee<=0&&F.spd0){F.spd=F.spd0;F.spd0=0;}if(F.flee>0.6&&FLEE[F.sp])g.position.y+=Math.abs(Math.sin(F.flee*22))*0.12;continue;}
    const scary=FLEE[F.sp]?(d<3.6&&ps>3.2)||(d<5&&MOUNT.riding):(F.sp==='goat'||F.sp==='sheep'||F.sp==='pig')?(d<2.4&&ps>2)||(d<4&&MOUNT.riding&&ps>6):false;
    if(scary&&(F.beh==='wander'||F.beh==='peck')){const l=d||1;F.tx=g.position.x+dx/l*rr(5,9)+rr(-2,2);F.tz=g.position.z+dz/l*rr(5,9)+rr(-2,2);F.w=0;F.spd0=F.spd0||F.spd;F.spd=F.spd0*(FLEE[F.sp]?4:2.2);F.flee=FLEE[F.sp]?1.6:1.2;if(FLEE[F.sp]&&Math.random()<0.7)sfxCluck();}}}
const DOVES={fl:[],t:8};
function doveFlock(x,z){const n=5+Math.floor(Math.random()*5),body=new THREE.SphereGeometry(0.13,8,6),m=lam(pick(['#8a8a90','#9a9aa2','#7a7a84'])),birds=[];
  for(let i=0;i<n;i++){const g=new THREE.Group();const b=new THREE.Mesh(body,m);b.scale.set(1,0.85,1.5);b.position.y=0.13;g.add(b);const h=new THREE.Mesh(body,m);h.scale.setScalar(0.6);h.position.set(0,0.27,0.17);g.add(h);
    const wl=box(0.32,0.02,0.16,m,-0.12,0.18,0,g),wr=box(0.32,0.02,0.16,m,0.12,0.18,0,g);wl.visible=wr.visible=false;
    const px=x+(Math.random()-0.5)*4,pz=z+(Math.random()-0.5)*4;g.position.set(px,floorAt(px,pz),pz);g.rotation.y=Math.random()*TAU;scene.add(g);birds.push({g,head:h,wl,wr,ph:Math.random()*10,vx:0,vy:0,vz:0});}
  DOVES.fl.push({x,z,birds,st:'peck',t:0});}
function sfxFlap(){if(!aOK())return;const t=AUD.ctx.currentTime;for(let i=0;i<6;i++)gfNoise(t+i*0.05,'bandpass',1100+Math.random()*500,1,0.05,0.005,0.04);}
function dovesTick(dt){{DOVES.t-=dt;
    if(DOVES.t<0){DOVES.t=12+Math.random()*10;const near=DOVES.fl.some(f=>Math.hypot(f.x-player.x,f.z-player.z)<70);
      if(!near&&ui==='play'&&DAYF>0.3){const a=player.yaw+Math.PI+(Math.random()-0.5)*1.2,d=18+Math.random()*12,x=player.x-Math.sin(player.yaw)*d+(Math.random()-0.5)*10,z=player.z-Math.cos(player.yaw)*d+(Math.random()-0.5)*10;
        if(isFree(x,z,1.5)&&inWaterK()===1&&Math.abs(floorAt(x,z)-player.feet)<3)doveFlock(x,z);}}}
  const ps=MOUNT.riding?(MOUNT.v||0):Math.hypot(GF.vx,GF.vz),T=performance.now()/1000;
  for(const F of DOVES.fl){F.t+=dt;const d=Math.hypot(F.x-player.x,F.z-player.z);
    if(F.st==='peck'){if(d<(ps>4?9:5.5)){F.st='fly';sfxFlap();for(const b of F.birds){const a=Math.atan2(b.g.position.x-player.x,b.g.position.z-player.z)+(Math.random()-0.5)*0.8;b.vx=Math.sin(a)*rr(4,7);b.vz=Math.cos(a)*rr(4,7);b.vy=rr(3,5);b.g.rotation.y=a;b.wl.visible=b.wr.visible=true;}}
      else for(const b of F.birds){b.head.position.y=0.27-Math.max(0,Math.sin(T*5+b.ph))*0.12;}
      if(d>140){F.dead=1;}}
    else{for(const b of F.birds){b.g.position.x+=b.vx*dt;b.g.position.y+=b.vy*dt;b.g.position.z+=b.vz*dt;b.vy=Math.max(1.2,b.vy-dt*0.8);const f=Math.sin(T*28+b.ph)*0.9;b.wl.rotation.z=f;b.wr.rotation.z=-f;}if(F.t>40||F.birds[0].g.position.y>floorAt(F.x,F.z)+45)F.dead=1;}
    if(F.st==='fly'&&!F.t0)F.t0=F.t;}
  for(const F of DOVES.fl)if(F.dead)F.birds.forEach(b=>scene.remove(b.g));DOVES.fl=DOVES.fl.filter(F=>!F.dead);}
// ---- 4. espuma en la orilla
const FOAM={t:0};
function foamTick(dt){FOAM.t-=dt;if(FOAM.t>0||ui!=='play')return;FOAM.t=0.35;const sea=SEA?SEA.position.y:-2.2;
  for(let k=0;k<10;k++){const a=Math.random()*TAU,d=4+Math.random()*44,x=player.x+Math.cos(a)*d,z=player.z+Math.sin(a)*d,h=terrainH(x,z);
    if(h>sea-0.7&&h<sea+0.5&&riverWater(x,z)===null){mark(x,z,0,'ripple',sea+0.05);pfx(x,sea+0.15,z,{col:'#f4f8f8',life:1.6,s:0.7,grow:1.2,a:0.45});break;}}}
// ---- 5. gente que saluda y vendedores que levantan el brazo al pregonar
const SAL={A:['¡Salud!','¡Alégrate!','Buenos días, forastero','¡Que los dioses te guarden!'],R:['¡Salve!','¡Ave!','Buenos días','¡Que te vaya bien!']};
function greetTick(dt){if(ui!=='play')return;const now=performance.now();
  for(const w of walkers){const g=w.g;if(w.home||!g.visible)continue;if(w.gr&&now<w.gr.until){if(now>w.gr.down&&!w.gr.dn){w.gr.dn=1;armUp(g,null,0);}continue;}
    if(w.gr&&w.gr.sp){scene.remove(w.gr.sp);w.gr.sp=null;}
    const d=Math.hypot(g.position.x-player.x,g.position.z-player.z);if(d>3.4||d<1)continue;if(w.grNext&&now<w.grNext)continue;w.grNext=now+60000;if(Math.random()>0.4)continue;
    armUp(g,null,-2.5);const sp=labelSprite(v2Greet(),'',false);sp.position.set(g.position.x,g.position.y+2.5,g.position.z);scene.add(sp);
    g.rotation.y=Math.atan2(player.x-g.position.x,player.z-g.position.z);w.gr={until:now+1900,down:now+1300,sp,dn:0};if(w.wait!==undefined)w.wait=Math.max(w.wait,1.5);}}
// ---- 6. viento: las copas de los árboles se mecen (sombreado en la GPU) con rachas
const WIND={u:{value:0},s:{value:1}};
function windMat(mat){if(mat.userData.wind)return mat.userData.wind;const w=mat.clone(),prev=mat.onBeforeCompile;
  w.onBeforeCompile=function(sh,r){if(prev)prev.call(this,sh,r);sh.uniforms.uWT=WIND.u;sh.uniforms.uWS=WIND.s;
    sh.vertexShader='uniform float uWT;uniform float uWS;\n'+sh.vertexShader.replace('#include <project_vertex>','{\n#ifdef USE_INSTANCING\nfloat wph=instanceMatrix[3].x*0.13+instanceMatrix[3].z*0.11;\n#else\nfloat wph=0.0;\n#endif\nfloat wk=max(0.0,position.y-0.8);transformed.x+=sin(uWT*1.3+wph)*0.03*wk*uWS+sin(uWT*3.7+wph*2.0)*0.008*wk*uWS;transformed.z+=cos(uWT*1.05+wph*1.4)*0.022*wk*uWS;}\n#include <project_vertex>');};
  w.customProgramCacheKey=()=>'viento'+(mat.customProgramCacheKey?mat.customProgramCacheKey():'');mat.userData.wind=w;return w;}
function windTick(dt){const t=performance.now()/1000;WIND.u.value=t;const gust=0.7+0.45*Math.sin(t*0.13)+0.25*Math.sin(t*0.41+1.3);WIND.s.value=GF.reduced?0.3:Math.max(0.3,gust);}
// ---- 7. diálogos que se escriben solos, con una nota de lira al abrirse
const TW={on:false,nodes:[],i:0,acc:0,skip:false};
function twStart(){const B=$('dBody');if(!B||GF.reduced)return;const nodes=[];const tw=document.createTreeWalker(B,NodeFilter.SHOW_TEXT);for(let n=tw.nextNode();n;n=tw.nextNode()){if(n.parentElement&&n.parentElement.closest('input,textarea,button'))continue;if(n.nodeValue.trim()){nodes.push({n,full:n.nodeValue});n.nodeValue='';}}
  if(!nodes.length)return;TW.on=true;TW.nodes=nodes;TW.i=0;TW.acc=0;TW.c=0;TW.lt=performance.now();}
function twFinish(){if(!TW.on)return;for(const o of TW.nodes)o.n.nodeValue=o.full;TW.on=false;TW.nodes=[];try{glossScan();}catch(e){}}
function twTick(dt){if(!TW.on)return;if($('dialog').hidden){twFinish();return;}const nw=performance.now();TW.acc+=Math.min(1,(nw-(TW.lt||nw))/1000)*110;TW.lt=nw;let k=Math.floor(TW.acc);TW.acc-=k;
  while(k>0&&TW.i<TW.nodes.length){const o=TW.nodes[TW.i],cur=o.n.nodeValue.length,rest=o.full.length-cur,take=Math.min(rest,k);o.n.nodeValue=o.full.slice(0,cur+take);k-=take;if(cur+take>=o.full.length)TW.i++;}
  if(TW.i>=TW.nodes.length){TW.on=false;try{glossScan();}catch(e){}}}
(function twObserve(){const B=$('dBody'),D=$('dialog');if(!B||!D)return;let wasHidden=D.hidden;
  new MutationObserver(()=>{if(TW.busy)return;TW.busy=true;twFinish();twStart();TW.busy=false;}).observe(B,{childList:true});
  new MutationObserver(()=>{if(wasHidden&&!D.hidden&&aOK()){const t=AUD.ctx.currentTime;pluck(LYRE[2+Math.floor(Math.random()*3)],t+0.01,0.045);}wasHidden=D.hidden;}).observe(D,{attributes:true,attributeFilter:['hidden']});
  B.addEventListener('click',()=>twFinish());})();
// ---- 8. monedas que vuelan hasta el contador
function coinFly(n){const tgt=$('sObols');if(!tgt||GF.reduced)return;const r=tgt.getBoundingClientRect(),k=Math.min(6,Math.max(1,Math.round(n/2)));
  for(let i=0;i<k;i++){const c=document.createElement('div');c.style.cssText='position:fixed;z-index:57;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff3c4,#e0b04a 45%,#9a6a1e);box-shadow:0 0 8px rgba(255,210,120,.7);pointer-events:none;left:'+(innerWidth/2-8+(Math.random()-0.5)*60)+'px;top:'+(innerHeight*0.55+(Math.random()-0.5)*40)+'px;transition:left .7s cubic-bezier(.5,-0.3,.6,1),top .7s cubic-bezier(.3,.6,.5,1),transform .7s,opacity .25s .6s';
    document.body.appendChild(c);setTimeout(()=>{c.style.left=(r.left+8)+'px';c.style.top=(r.top+2)+'px';c.style.transform='scale(.6)';c.style.opacity='0';},60+i*90);setTimeout(()=>c.remove(),1000+i*90);}
  setTimeout(()=>{tgt.animate&&tgt.animate([{transform:'scale(1)'},{transform:'scale(1.25)',color:'#ffd77a'},{transform:'scale(1)'}],{duration:350});},760);}
// ---- 9. luciérnagas en las noches de verano y humo de los hogares por la mañana y al atardecer
const NIGHT={ff:0,sm:0};
function nightTick(dt){if(ui!=='play'&&ui!=='dialog')return;const mo=calNow().mo,h=clock.h;
  const summer=mo>=4&&mo<=7,outside=!gfInCity();
  if(summer&&DAYF<0.22&&outside&&!FLY.on){NIGHT.ff-=dt;if(NIGHT.ff<0){NIGHT.ff=0.18;const a=Math.random()*TAU,d=3+Math.random()*16,x=player.x+Math.cos(a)*d,z=player.z+Math.sin(a)*d;if(inWaterK()===1)pfx(x,floorAt(x,z)+0.4+Math.random()*1.6,z,{col:'#d8ff6a',add:true,life:3+Math.random()*3,vx:(Math.random()-0.5)*0.5,vz:(Math.random()-0.5)*0.5,vy:(Math.random()-0.5)*0.2,s:0.18,grow:0,a:0.9,blink:3+Math.random()*3});}}
  if((h>=6&&h<9)||(h>=18&&h<20.5)){NIGHT.sm-=dt;if(NIGHT.sm<0){NIGHT.sm=0.5;const hs=footprints.filter(f=>f.house&&Math.abs(f.x-player.x)<140&&Math.abs(f.z-player.z)<140);if(hs.length){const f=hs[Math.floor(Math.random()*hs.length)];if(!f.smoke)f.smoke=Math.random()<0.45?1:-1;
      if(f.smoke>0){const y=floorAt(f.x,f.z)+4.4;pfx(f.x+(Math.random()-0.5)*0.6,y,f.z+(Math.random()-0.5)*0.6,{col:'#b8b2a8',life:5+Math.random()*3,vy:0.55,vx:0.25,vz:0.05,s:0.9,grow:3,a:0.32});}}}}}
// ---- tick común
const STEP={acc:0};
function gf2Tick(dt){if(ui==='play'&&!MOUNT.riding&&!FLY.on&&!BOAT.on&&player.grounded){const sp=Math.hypot(GF.vx,GF.vz);STEP.acc+=sp*dt;if(STEP.acc>(sp>7?1.3:0.8)){STEP.acc=0;footStep(gfSurface());}}horseAlive(dt);animalsReact(dt);dovesTick(dt);foamTick(dt);greetTick(dt);windTick(dt);twTick(dt);nightTick(dt);pfxTick(dt);marksTick(dt);}

