// ============================================================ GRÁFICOS (6): cinco propuestas (24/11)
// G1 Agua viva: estela de espuma detrás de la barca, del barco y de quien nada, y salpicaduras al entrar en el agua (las olas, el brillo y la
//    espuma de la orilla ya estaban: 107, 212 y 217).
// G2 Vegetación que reacciona: la hierba se aparta también al paso del caballo, del perro y de la gente cercana (156: uQ), no solo del jugador;
//    el viento ya se refuerza con la tormenta (090).
// G3 Luz de interior: en los interiores y en tu casa, dos luces cálidas de lámpara de aceite que titilan (más de noche), y un haz de luz
//    que entra por la puerta de día, dorado al atardecer.
// G4 Atmósfera: neblina en los valles al amanecer (de 5 a 8 h, en las partes bajas), motas de polvo al sol en las plazas del mercado y
//    columnas de humo sobre los barrios de alfareros, herreros y hornos.
// G5 Huellas y ropa: huellas en la arena de la playa, en el barro cuando ha llovido y en la nieve; polvo al correr y al galopar por tierra seca
//    en verano; y los mantos, togas y pallas de las personas de Blender se mecen con el viento y al andar.
const G6={foam:[],fp:[],dust:[],mist:[],motes:[],smoke:[],lights:null,beam:null,t:0,lastStep:0,lx:0,lz:0};
const G6_FOAM_M=new THREE.SpriteMaterial({map:TORCH_TEX,color:'#f4f8fa',transparent:true,opacity:0.5,depthWrite:false});
function g6Sprite(col,op,add){return new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:col,transparent:true,opacity:op,depthWrite:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending}));}
// ---- G1 estela
function g6WaterY(){try{if(typeof BOAT!=='undefined'&&BOAT.on)return BOAT.y!==undefined?BOAT.y:null;if(typeof SW!=='undefined'&&(SW.seg||SW.swim)&&typeof SEA!=='undefined'&&SEA)return SEA.position.y;const w=riverWater(player.x,player.z);if(w!==null&&player.feet<w+0.6)return w;if(typeof SEA!=='undefined'&&SEA&&player.feet<SEA.position.y+0.5)return SEA.position.y;}catch(e){}return null;}
function g6Foam(dt){const wy=g6WaterY(),P=player,sp=Math.hypot(P.x-G6.lx,P.z-G6.lz)/Math.max(dt,1e-3);
  if(wy!==null&&sp>0.6&&G6.foam.length<60&&Math.random()<Math.min(1,sp*dt*3)){const s=new THREE.Sprite(G6_FOAM_M.clone());s.scale.set(0.8,0.8,1);s.position.set(P.x+(Math.random()-0.5)*0.8,wy+0.08,P.z+(Math.random()-0.5)*0.8);scene.add(s);G6.foam.push({s,t:2.2});}
  for(let i=G6.foam.length-1;i>=0;i--){const f=G6.foam[i];f.t-=dt;const k=1+(2.2-f.t)*1.3;f.s.scale.set(0.8*k,0.5*k,1);f.s.material.opacity=Math.max(0,f.t/2.2)*0.45;if(f.t<=0){scene.remove(f.s);f.s.material.dispose();G6.foam.splice(i,1);}}}
// ---- G2 hierba: quién la pisa
function g6Grass(){if(typeof GR==='undefined'||!GR.u||!GR.u.uQ)return;const Q=GR.u.uQ.value,P=player,L=[];
  try{if(MOUNT.g&&MOUNT.g.visible&&!MOUNT.riding)L.push([MOUNT.g.position,1.4]);else if(MOUNT.riding)L.push([new THREE.Vector3(P.x,P.feet,P.z),1.6]);}catch(e){}
  try{if(DOG.on&&DOG.on.A.g.visible)L.push([DOG.on.A.g.position,0.8]);}catch(e){}
  try{const W=[];for(const w of walkers){const g=w.g;if(!g||!g.visible)continue;const d=(g.position.x-P.x)**2+(g.position.z-P.z)**2;if(d<30*30)W.push([d,g.position]);}W.sort((a,b)=>a[0]-b[0]);for(const[,p]of W.slice(0,4-L.length))L.push([p,1.0]);}catch(e){}
  for(let i=0;i<4;i++){const it=L[i];if(it)Q[i].set(it[0].x,it[0].y,it[0].z,it[1]);else Q[i].set(0,-9999,0,1);}}
// ---- G3 luz de interior
function g6Indoor(dt){if(typeof ACC!=='undefined'&&ACC.lite)return;   // dos luces más encarecen cada píxel en los equipos modestos
if(!G6.lights){G6.lights=[0,1].map(()=>{const l=new THREE.PointLight('#ffb466',0,14,1.6);scene.add(l);return l;});}
  let C=null;try{if(INT2.in&&INT2.in.R&&!(typeof legIn==='function'&&legIn()))C={x:INT2.in.R.X,y:INT2.in.R.Y,z:INT2.in.R.Z,R:INT2.in.R};else if(typeof CASA!=='undefined'&&CASA.X&&Math.abs(player.feet-CASA.Y)<20)C={x:CASA.X,y:CASA.Y,z:CASA.Z};}catch(e){}
  const night=typeof DAYF!=='undefined'?1-DAYF:0.5,t=performance.now()/1000;
  G6.lights.forEach((l,i)=>{if(!C){l.intensity=0;return;}l.position.set(C.x+(i?-3:3),C.y+2.6,C.z+(i?2:-3));l.intensity=(0.55+1.2*night)*(0.85+0.15*Math.sin(t*11+i*3)+0.08*Math.sin(t*23+i));});
  // el haz de la puerta
  if(C&&C.R&&C.R.exit){if(!G6.beam){const m=new THREE.MeshBasicMaterial({color:'#ffe2a8',transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});G6.beam=new THREE.Mesh(new THREE.PlaneGeometry(2.2,7),m);scene.add(G6.beam);}
    const E=C.R.exit,day=typeof DAYF!=='undefined'?DAYF:1,eve=clock.h>=16&&clock.h<=19;G6.beam.visible=day>0.25;G6.beam.position.set(E.x-Math.sin(E.a)*2.8,C.y+1.6,E.z-Math.cos(E.a)*2.8);G6.beam.rotation.set(-1.1,E.a,0);G6.beam.material.color.set(eve?'#ffb870':'#fff0d0');G6.beam.material.opacity=day*0.12;}
  else if(G6.beam)G6.beam.visible=false;}
// ---- G4 atmósfera
const G6_SMOKE=/ceram|alfar|horno|forja|fragua|herrer|kiln|fabri|metal|vidri|panader/i,G6_MARKET=/agora|ágora|foro|forum|mercad|macellum|emporio/i;
function g6Atmos(dt){const P=player,t=performance.now()/1000,h=clock.h;
  // neblina del amanecer
  const dawn=h>=5&&h<8.2&&P.x<8000&&!(INT2&&INT2.in);let low=false;try{low=terrainH(P.x,P.z)<terrainH(P.x+60,P.z)-4||terrainH(P.x,P.z)<terrainH(P.x-60,P.z)-4;}catch(e){}
  if(dawn&&low&&G6.mist.length<14&&Math.random()<dt*3){const s=g6Sprite('#e8eef2',0,false);const a=Math.random()*TAU,r=10+Math.random()*40;s.scale.set(26,9,1);s.position.set(P.x+Math.cos(a)*r,floorAt(P.x+Math.cos(a)*r,P.z+Math.sin(a)*r)+1.5,P.z+Math.sin(a)*r);scene.add(s);G6.mist.push({s,t:0,life:14});}
  for(let i=G6.mist.length-1;i>=0;i--){const m=G6.mist[i];m.t+=dt;m.s.material.opacity=Math.sin(Math.min(1,m.t/m.life)*Math.PI)*0.28*(dawn?1:0.4);m.s.position.x+=dt*0.4;if(m.t>m.life||Math.hypot(m.s.position.x-P.x,m.s.position.z-P.z)>90){scene.remove(m.s);G6.mist.splice(i,1);}}
  // humo de los talleres (columnas fijas, hasta 6 cerca)
  G6.t-=dt;if(G6.t<=0){G6.t=3;const near=PLACES.filter(p=>G6_SMOKE.test(p.id+' '+p.name)&&Math.hypot(p.x-P.x,p.z-P.z)<260).slice(0,6);
    for(const s of G6.smoke)if(!near.includes(s.p)){for(const q of s.q)scene.remove(q.s);s.dead=1;}G6.smoke=G6.smoke.filter(s=>!s.dead);
    for(const p of near)if(!G6.smoke.some(s=>s.p===p)){const q=[];for(let k=0;k<7;k++){const sp=g6Sprite('#5a5650',0.0,false);sp.scale.set(3,3,1);scene.add(sp);q.push({s:sp,ph:k/7});}G6.smoke.push({p,q,y:floorAt(p.x,p.z)+5});}}
  for(const S of G6.smoke)for(const q of S.q){const u=(t*0.06+q.ph)%1;q.s.position.set(S.p.x+6+u*6*Math.sin(t*0.1),S.y+u*28,S.p.z+4+u*4);q.s.scale.set(3+u*9,3+u*9,1);q.s.material.opacity=0.32*(1-u)*(clock.h>6&&clock.h<20?1:0.5);}
  // polvo al sol en el mercado
  const mk=h>8&&h<18&&PLACES.some(p=>G6_MARKET.test(p.id+' '+p.name)&&Math.hypot(p.x-P.x,p.z-P.z)<60);
  if(mk&&G6.motes.length<40&&Math.random()<dt*20){const s=g6Sprite('#fff0c8',0,true);s.scale.set(0.12,0.12,1);s.position.set(P.x+(Math.random()-0.5)*16,P.feet+0.5+Math.random()*3,P.z+(Math.random()-0.5)*16);scene.add(s);G6.motes.push({s,t:0,life:4+Math.random()*4,v:(Math.random()-0.5)*0.3});}
  for(let i=G6.motes.length-1;i>=0;i--){const m=G6.motes[i];m.t+=dt;m.s.position.y+=dt*0.08;m.s.position.x+=m.v*dt;m.s.material.opacity=Math.sin(Math.min(1,m.t/m.life)*Math.PI)*0.6;if(m.t>m.life){scene.remove(m.s);G6.motes.splice(i,1);}}}
// ---- G5 huellas, polvo y ropa
const G6_FPG=new THREE.CircleGeometry(0.11,8);G6_FPG.scale(1,1.7,1);G6_FPG.rotateX(-Math.PI/2);
function g6Surface(){const P=player;if(P.x>8000||INT2&&INT2.in)return null;try{const sea=typeof SEA!=='undefined'&&SEA?SEA.position.y:0,y=P.feet;if(typeof WXS!=='undefined'&&WXS.snow>0.3)return 'nieve';
  if(y<sea+2.2&&y>sea-0.2)return 'arena';const w=wxz();if(w.k==='lluvia'||w.k==='tormenta'||(w.lastRain&&state.day-w.lastRain<1))return 'barro';if(calNow().season.id==='ver')return 'polvo';}catch(e){}return null;}
function g6Steps(dt){const P=player,moved=Math.hypot(P.x-G6.lx,P.z-G6.lz);G6.lastStep+=moved;
  if(G6.lastStep>(MOUNT.riding?1.6:0.75)&&P.grounded!==false&&!FLY.on){G6.lastStep=0;const s=g6Surface();
    if(s&&s!=='polvo'&&G6.fp.length<80){const col=s==='nieve'?'#9aa8b8':s==='arena'?'#a08a62':'#4a3a2a';const m=new THREE.Mesh(G6_FPG,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.45,depthWrite:false}));
      const side=(G6.side=!G6.side)?0.13:-0.13,a=P.yaw;m.position.set(P.x+Math.cos(a)*side,floorAt(P.x,P.z)+0.03,P.z-Math.sin(a)*side);m.rotation.y=a;if(MOUNT.riding)m.scale.setScalar(1.6);scene.add(m);G6.fp.push({m,t:s==='nieve'?60:25});}
    if((s==='polvo'||s==='arena')&&(keys.run||MOUNT.riding)&&G6.dust.length<30){const d=g6Sprite(s==='arena'?'#d8c8a0':'#c8b088',0.35,false);d.scale.set(1,1,1);d.position.set(P.x,floorAt(P.x,P.z)+0.3,P.z);scene.add(d);G6.dust.push({s:d,t:1.2});}}
  for(let i=G6.fp.length-1;i>=0;i--){const f=G6.fp[i];f.t-=dt;if(f.t<5)f.m.material.opacity=Math.max(0,f.t/5)*0.45;if(f.t<=0){scene.remove(f.m);f.m.material.dispose();G6.fp.splice(i,1);}}
  for(let i=G6.dust.length-1;i>=0;i--){const d=G6.dust[i];d.t-=dt;const k=1+(1.2-d.t)*2;d.s.scale.set(k,k*0.7,1);d.s.position.y+=dt*0.4;d.s.material.opacity=Math.max(0,d.t/1.2)*0.35;if(d.t<=0){scene.remove(d.s);G6.dust.splice(i,1);}}}
// la ropa que se mece: mantos, togas y pallas (personas de Blender), con el viento (WIND) y más en el bajo
const G6_CLOTH=/himation|palla|toga|manto|clamide|chlamys|peplo/i;
function g6ClothMat(m){if(!m||m.userData.g6)return;m.userData.g6=1;const prev=m.onBeforeCompile;m.onBeforeCompile=function(sh,r){if(prev&&prev!==THREE.Material.prototype.onBeforeCompile)prev.call(this,sh,r);sh.uniforms.uWT=WIND.u;sh.uniforms.uWS=WIND.s;
    sh.vertexShader='uniform float uWT;uniform float uWS;\n'+sh.vertexShader.replace('#include <skinning_vertex>','#include <skinning_vertex>\n{float lo=clamp((1.25-position.y)/1.1,0.0,1.0);float w=sin(uWT*2.3+position.y*4.0+position.x*3.0)*0.5+sin(uWT*3.7+position.z*5.0)*0.3;transformed.xz+=vec2(0.6,0.8)*w*0.022*lo*uWS;}');};
  const k=m.customProgramCacheKey?m.customProgramCacheKey.bind(m):null;m.customProgramCacheKey=()=>(k?k():'')+'g6c';m.needsUpdate=true;}
function g6Cloth(){try{for(const g of BP.list){if(g.userData.g6c)continue;g.userData.g6c=1;g.traverse(o=>{if(o.isSkinnedMesh&&o.material&&G6_CLOTH.test(o.material.name||''))g6ClothMat(o.material);});}}catch(e){}}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start')return r;g6Foam(dt);g6Grass();g6Indoor(dt);g6Atmos(dt);g6Steps(dt);G6.ct=(G6.ct||0)-dt;if(G6.ct<=0){G6.ct=2;g6Cloth();}G6.lx=player.x;G6.lz=player.z;}catch(e){if(!G6.err){G6.err=String(e).slice(0,200);console.warn('graficos6',e);}}return r;};}
