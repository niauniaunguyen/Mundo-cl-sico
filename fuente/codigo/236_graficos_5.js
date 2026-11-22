// ============================================================ GRÁFICOS (5): cielo de noche, aves según la estación, luz baja, sombrillas, grafitos y pétalos
// (Lo que ya había: barcos en el horizonte (217 X6), niebla del alba y golondrinas (102), destellos del sol en el agua (107), hojas con viento (214 W4),
//  palomas (217 X7), pintadas electorales de Roma (214 W7). Aquí, cosas distintas.)
//  V1 La Vía Láctea: una banda de estrellas tenues que cruza el cielo en las noches claras (el «camino de leche» de Hera, o de Juno).
//  V2 Estrellas fugaces de vez en cuando, de noche.
//  V3 Rayos de luz entre las nubes al salir y al ponerse el sol.
//  V4 Estorninos al atardecer en invierno: bandadas enormes que cambian de forma sobre la ciudad.
//  V5 Grullas en otoño, en formación de V y graznando. Hesíodo, Trabajos y días 448-451: su grito anuncia que llega la hora de arar.
//  V6 Murciélagos que revolotean al anochecer en verano.
//  V7 Gorriones que picotean en las calles y las plazas y salen volando cuando te acercas.
//  V8 Sombrillas: en verano, a mediodía, algunas mujeres llevan una (en Atenas la skiádeion, que en las procesiones llevaban las hijas de
//     los metecos, Eliano, Historias curiosas VI 1; en Roma el umbraculum, Ovidio, Arte de amar II 209).
//  V9 Grafitos rayados en las paredes de las casas: en Atenas, «Fulano es bello» (ΚΑΛΟΣ), como en los vasos y en los muros del Ágora;
//     en Roma, saludos y bromas como los de Pompeya (CIL IV), escritos con letra cursiva.
//  V10 Pétalos en primavera y hojas secas en otoño que caen cerca de ti (redondeados, pequeños y a poca altura: en el vídeo del 22/11 se veían como cuadrados flotando en el cielo).
const G5={t:0,on:false,mw:null,sh:null,shT:6,ray:null,mur:null,cr:null,bats:null,sp:[],spT:0,par:new Map(),pet:null,graf:false};
function g5Mo(){try{return calNow().mo;}catch(e){return 3;}}
function g5Dot(sz,col){const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d'),g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return new THREE.CanvasTexture(c);}
function g5Pts(n,size,col,opt){opt=opt||{};const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));
  const m=new THREE.PointsMaterial({size,color:col,map:opt.map||null,transparent:true,opacity:opt.op!==undefined?opt.op:1,depthWrite:false,sizeAttenuation:opt.att!==false,fog:opt.fog!==false,blending:opt.add?THREE.AdditiveBlending:THREE.NormalBlending});
  const p=new THREE.Points(g,m);p.frustumCulled=false;scene.add(p);return p;}
// ---- V1 Vía Láctea
function g5Milky(){const n=9000,P=G5.mw=g5Pts(n,5,0xdfe6ff,{map:g5Dot(0,'rgba(255,255,255,1)'),op:0,att:false,fog:false,add:true}),a=P.geometry.attributes.position.array,R=mulberry32(386);
  const ax=new THREE.Vector3(0.35,0.55,0.76).normalize(),u=new THREE.Vector3(1,0,0).cross(ax).normalize(),v=ax.clone().cross(u);
  for(let i=0;i<n;i++){const t=R()*TAU,core=Math.exp(-Math.pow((t-1.2+TAU)%TAU-Math.PI,2)*0.5),w=(R()+R()+R()-1.5)*(0.07+0.07*core),q=new THREE.Vector3().addScaledVector(u,Math.cos(t)).addScaledVector(v,Math.sin(t)).addScaledVector(ax,w).normalize();
    if(q.y<0)q.y=-q.y;a[i*3]=q.x*3300;a[i*3+1]=q.y*3300;a[i*3+2]=q.z*3300;}P.renderOrder=-1;}
// ---- V2 estrellas fugaces
function g5Shoot(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6),3));const m=new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0,fog:false,depthWrite:false});
  G5.sh={l:new THREE.Line(g,m),t:0,p:new THREE.Vector3(),d:new THREE.Vector3()};G5.sh.l.frustumCulled=false;scene.add(G5.sh.l);}
// ---- V3 rayos al alba y al ocaso
function g5Ray(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.translate(128,128);for(let i=0;i<26;i++){const a=i/26*TAU+Math.random()*0.1,w=0.03+Math.random()*0.05,g=x.createLinearGradient(0,0,Math.cos(a)*128,Math.sin(a)*128);
    g.addColorStop(0,'rgba(255,225,170,.55)');g.addColorStop(1,'rgba(255,200,140,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,0);x.arc(0,0,128,a-w,a+w);x.closePath();x.fill();}
  const s=G5.ray=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,opacity:0,depthWrite:false,fog:false,blending:THREE.AdditiveBlending}));s.scale.set(1400,1400,1);s.renderOrder=-1;scene.add(s);}
// ---- V4 estorninos, V5 grullas, V6 murciélagos
function g5Flocks(){G5.mur={p:g5Pts(420,0.9,0x1a1612,{op:0}),c:new THREE.Vector3(),ph:Math.random()*9,on:0};G5.cr={p:g5Pts(17,2.6,0x2a2622,{op:0}),x:0,z:0,dx:1,dz:0,on:0,t:0,cry:4};G5.bats={p:g5Pts(9,0.5,0x15110e,{op:0}),s:[...Array(9)].map(()=>({a:Math.random()*9,r:4+Math.random()*7,h:4+Math.random()*6,w:1+Math.random()}))};}
function g5Crane(){if(!aOK())return;const t=AUD.ctx.currentTime,o=AUD.ctx.createOscillator(),g=envGain(t,0.035,0.02,0.35,AUD.master);o.type='sawtooth';o.frequency.setValueAtTime(720,t);o.frequency.linearRampToValueAtTime(560,t+0.3);o.connect(g);o.start(t);o.stop(t+0.4);}
// ---- V7 gorriones (en el suelo: los tejados de los modelos no tienen una superficie medible para posarlos)
let G5_SPG=null,G5_SPM=null;
function g5Sparrow(x,y,z){if(!G5_SPG){G5_SPG=new THREE.SphereGeometry(0.07,6,4);G5_SPG.scale(1.4,1,1);G5_SPM=new THREE.MeshLambertMaterial({color:0x7a5a3c});}const m=new THREE.Mesh(G5_SPG,G5_SPM);m.position.set(x,y,z);m.rotation.y=Math.random()*TAU;scene.add(m);return {m,x,y,z,fly:0,vx:0,vy:0,vz:0,hop:Math.random()*3};}
function g5Sparrows(){for(const s of G5.sp)scene.remove(s.m);G5.sp=[];let n=0;
  for(let k=0;k<40&&n<5;k++){const t=Math.random()*TAU,r=10+Math.random()*25,x=player.x+Math.cos(t)*r,z=player.z+Math.sin(t)*r;if(!isFree(x,z,1.2))continue;const y0=floorAt(x,z);if(y0<-0.5||Math.abs(y0-player.feet)>6)continue;n++;
    const m=3+Math.floor(Math.random()*4);for(let i=0;i<m;i++){const px=x+(Math.random()-0.5)*2.2,pz=z+(Math.random()-0.5)*2.2;if(isFree(px,pz,0.2))G5.sp.push(g5Sparrow(px,floorAt(px,pz)+0.07,pz));}}}
function g5R(x,z){const s=Math.sin(x*12.9898+z*78.233)*43758.5453;return s-Math.floor(s);}
// ---- V8 sombrillas
let G5_PAR=null;
function g5Parasol(){if(!G5_PAR){const g=new THREE.Group(),A=MODE==='roma',cl=new THREE.MeshLambertMaterial({color:A?0xb8452c:0x6a8a5a,side:THREE.DoubleSide}),st=new THREE.MeshLambertMaterial({color:0x5a4030});
    const c=new THREE.Mesh(new THREE.ConeGeometry(0.62,0.26,10,1,true),cl);c.position.y=0.62;g.add(c);const s=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.78,5),st);s.position.y=0.3;g.add(s);G5_PAR=g;}return G5_PAR.clone();}
function g5Parasols(){const mo=g5Mo(),h=clock.h,on=mo>=5&&mo<=7&&h>10.5&&h<16&&!(typeof WXS!=='undefined'&&WXS.rain>0.2);
  for(const w of walkers){const g=w.g;if(!g||!g.parent)continue;const c=g.userData.cfg;if(!c||!c.female||c.carry||c.glow)continue;if(g5R(g.id*0.37,1.3)>0.4)continue;
    let p=G5.par.get(g);if(on&&!p){p=g5Parasol();p.position.set(0.22,1.32,0.08);p.rotation.z=-0.18;g.add(p);G5.par.set(g,p);}if(p)p.visible=on;}}
// ---- V9 grafitos
const G5_GRA={atenas:['ΚΑΛΟΣ','ΛΥΣΙΣ ΚΑΛΟΣ','ΧΑΙΡΕ','Ο ΠΑΙΣ ΚΑΛΟΣ','ΝΙΚΙΑΣ ΚΑΛΟΣ','ΑΓΑΘΗ ΤΥΧΗ'],roma:['VALE','SALVE','FELICITER','AMOR','VTERE FELIX','HIC FVI']};
function g5Graffiti(){if(G5.graf||typeof footprints==='undefined')return;G5.graf=true;const L=G5_GRA[MODE==='roma'?'roma':'atenas'],hs=footprints.filter(f=>f.house&&f.w>3&&f.d>3);if(!hs.length)return;
  L.forEach((t,k)=>{const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.strokeStyle=MODE==='roma'&&k%2?'rgba(140,40,30,.7)':'rgba(40,32,26,.55)';x.lineWidth=2.2;
      x.font=(MODE==='roma'?'italic 34px serif':'30px serif');x.textAlign='center';x.textBaseline='middle';x.save();x.translate(128,32);x.rotate((g5R(k,3)-0.5)*0.12);x.strokeText(t,0,0);x.restore();
      const m=new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}),sel=hs.filter((f,i)=>g5R(f.x+k*7.1,f.z)<0.09).slice(0,220);
      if(!sel.length)return;const im=new THREE.InstancedMesh(new THREE.PlaneGeometry(1.1,0.28),m,sel.length),d=new THREE.Object3D();
      sel.forEach((f,i)=>{const a=f.a||0,side=Math.floor(g5R(f.z,f.x+k)*4),u=(g5R(f.x,k)-0.5)*0.6;let lx,lz,ry;if(side===0){lx=u*f.w;lz=f.d/2+0.04;ry=0;}else if(side===1){lx=u*f.w;lz=-f.d/2-0.04;ry=Math.PI;}else if(side===2){lx=f.w/2+0.04;lz=u*f.d;ry=Math.PI/2;}else{lx=-f.w/2-0.04;lz=u*f.d;ry=-Math.PI/2;}
        const ca=Math.cos(a),sa=Math.sin(a),wx=f.x+lx*ca+lz*sa,wz=f.z-lx*sa+lz*ca;d.position.set(wx,floorAt(wx,wz)+1.35+g5R(wx,wz)*0.4,wz);d.rotation.set(0,a+ry,0);d.updateMatrix();im.setMatrixAt(i,d.matrix);});
      im.instanceMatrix.needsUpdate=true;scene.add(im);});}
// ---- V10 pétalos y hojas
function g5Petals(){const n=90;G5.pet={p:g5Pts(n,0.09,0xffffff,{op:0.9,map:g5Dot(0,'rgba(255,255,255,1)')}),v:[...Array(n)].map(()=>({x:0,y:-99,z:0,s:Math.random()*9}))};G5.pet.p.material.vertexColors=true;G5.pet.p.geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*3),3));}
function g5PetTick(dt,kind){const P=G5.pet,a=P.p.geometry.attributes.position.array,c=P.p.geometry.attributes.color.array;P.p.visible=!!kind;if(!kind)return;
  const wx=(typeof WXS!=='undefined'&&WXS.wind||0.3)*0.8+0.2;P.v.forEach((q,i)=>{if(q.y<floorAt(q.x,q.z)||Math.hypot(q.x-player.x,q.z-player.z)>22){const r=4+Math.random()*16,t=Math.random()*TAU;q.x=player.x+Math.cos(t)*r;q.z=player.z+Math.sin(t)*r;q.y=floorAt(q.x,q.z)+1.5+Math.random()*3.5;
      const col=kind==='p'?(Math.random()<0.5?[1,0.9,0.93]:[1,0.78,0.84]):(Math.random()<0.5?[0.72,0.45,0.18]:[0.6,0.5,0.22]);c[i*3]=col[0];c[i*3+1]=col[1];c[i*3+2]=col[2];}
    q.s+=dt;q.y-=dt*(0.5+0.3*Math.sin(q.s*2));q.x+=dt*(wx+Math.sin(q.s*1.7)*0.6);q.z+=dt*Math.cos(q.s*1.3)*0.5;a[i*3]=q.x;a[i*3+1]=q.y;a[i*3+2]=q.z;});
  P.p.geometry.attributes.position.needsUpdate=true;P.p.geometry.attributes.color.needsUpdate=true;}
// ---- bucle
function g5Init(){if(G5.on)return;G5.on=true;g5Milky();g5Shoot();g5Ray();g5Flocks();g5Petals();}
function g5Tick(dt){if(!state||ui==='start')return;g5Init();const cam=camera.position,night=clamp(1-DAYF*1.8,0,1),mo=g5Mo(),h=clock.h,cl=(typeof WXS!=='undefined'?WXS.cl||0:0),rain=(typeof WXS!=='undefined'?WXS.rain||0:0);
  // V1
  G5.mw.position.copy(cam);G5.mw.material.opacity=night*0.32*(1-cl*0.9);G5.mw.visible=G5.mw.material.opacity>0.01;
  // V2
  const S=G5.sh;if(S.t>0){S.t-=dt;S.p.addScaledVector(S.d,dt*900);const a=S.l.geometry.attributes.position.array;a[0]=S.p.x;a[1]=S.p.y;a[2]=S.p.z;a[3]=S.p.x-S.d.x*90;a[4]=S.p.y-S.d.y*90;a[5]=S.p.z-S.d.z*90;S.l.geometry.attributes.position.needsUpdate=true;S.l.material.opacity=Math.min(1,S.t*3)*night;}
  else{S.l.material.opacity=0;G5.shT-=dt;if(G5.shT<=0){G5.shT=8+Math.random()*25;if(night>0.7&&cl<0.5){const t=Math.random()*TAU;S.p.set(cam.x+Math.cos(t)*1500,cam.y+900+Math.random()*500,cam.z+Math.sin(t)*1500);S.d.set(-Math.cos(t)+Math.random()*0.6-0.3,-0.35,-Math.sin(t)+Math.random()*0.6-0.3).normalize();S.t=0.7;}}}
  // V3
  const e=SUNDIR.y,low=clamp(1-Math.abs(e-0.07)/0.11,0,1);G5.ray.position.set(cam.x+SUNDIR.x*1800,cam.y+SUNDIR.y*1800,cam.z+SUNDIR.z*1800);G5.ray.material.opacity=low*(0.25+cl*0.45)*(1-rain);G5.ray.material.rotation+=dt*0.004;G5.ray.visible=G5.ray.material.opacity>0.01;
  // V4 estorninos
  const M=G5.mur,mOn=(mo>=10||mo<=1)&&h>16.3&&h<18.6&&rain<0.3;M.on+=((mOn?1:0)-M.on)*Math.min(1,dt*0.5);M.p.visible=M.on>0.02;
  if(M.p.visible){if(!M.c.lengthSq()||M.c.distanceTo(cam)>260){const t=Math.random()*TAU;M.c.set(player.x+Math.cos(t)*120,0,player.z+Math.sin(t)*120);M.c.y=Math.max(floorAt(M.c.x,M.c.z),player.feet)+45;}
    M.ph+=dt*0.35;M.c.x+=Math.sin(M.ph*0.6)*dt*6;M.c.z+=Math.cos(M.ph*0.45)*dt*6;const a=M.p.geometry.attributes.position.array;
    for(let i=0;i<420;i++){const u=i/420*TAU*7,v=(i*0.618)%1*TAU,r=14+9*Math.sin(M.ph+u*0.3),s=0.5+0.5*Math.sin(M.ph*1.3+v);a[i*3]=M.c.x+Math.cos(u+M.ph)*r*(0.6+s*0.6);a[i*3+1]=M.c.y+Math.sin(v+M.ph*0.8)*r*0.35*(1.2-s*0.5);a[i*3+2]=M.c.z+Math.sin(u*1.1+M.ph)*r*(1.1-s*0.4);}
    M.p.geometry.attributes.position.needsUpdate=true;M.p.material.opacity=M.on;}
  // V5 grullas
  const C=G5.cr,cOn=(mo===9||mo===10)&&DAYF>0.5&&rain<0.3;if(cOn&&C.on<=0&&Math.random()<dt/40){const t=Math.random()*TAU;C.dx=-Math.cos(t);C.dz=-Math.sin(t);C.x=player.x+Math.cos(t)*260;C.z=player.z+Math.sin(t)*260;C.on=1;C.t=0;C.h=player.feet+110;}
  C.p.visible=C.on>0;if(C.on>0){C.t+=dt;C.x+=C.dx*dt*13;C.z+=C.dz*dt*13;const a=C.p.geometry.attributes.position.array,px=-C.dz,pz=C.dx;
    for(let i=0;i<17;i++){const k=Math.ceil(i/2)*(i%2?1:-1),b=Math.abs(k)*3.2;a[i*3]=C.x-C.dx*b+px*k*3+Math.sin(C.t*2+i)*0.3;a[i*3+1]=C.h+Math.sin(C.t*1.6+i*0.7)*0.5;a[i*3+2]=C.z-C.dz*b+pz*k*3;}
    C.p.geometry.attributes.position.needsUpdate=true;C.p.material.opacity=Math.min(1,C.t/3);C.cry-=dt;if(C.cry<=0){C.cry=2+Math.random()*4;if(Math.hypot(C.x-player.x,C.z-player.z)<220)g5Crane();}
    if(C.t>45)C.on=0;}
  // V6 murciélagos
  const B=G5.bats,bOn=mo>=4&&mo<=8&&((h>19.6&&h<21.5)||(h>4.6&&h<5.4))&&rain<0.2;B.p.visible=bOn;if(bOn){const a=B.p.geometry.attributes.position.array;B.s.forEach((q,i)=>{q.a+=dt*q.w*2.2;const j=Math.sin(q.a*3.1)*1.4;a[i*3]=player.x+Math.cos(q.a)*q.r+j;a[i*3+1]=player.feet+q.h+Math.sin(q.a*2.3)*1.2;a[i*3+2]=player.z+Math.sin(q.a*1.3)*q.r+Math.cos(q.a*2.7);});B.p.geometry.attributes.position.needsUpdate=true;B.p.material.opacity=1;}
  // V7 gorriones
  G5.spT-=dt;if(G5.spT<=0){G5.spT=12;if(DAYF>0.4&&rain<0.3&&(!G5.sp.length||Math.hypot(G5.sp[0].x-player.x,G5.sp[0].z-player.z)>55))g5Sparrows();if(DAYF<0.3){for(const s of G5.sp)scene.remove(s.m);G5.sp=[];}}
  for(const s of G5.sp){if(!s.fly){s.hop-=dt;if(s.hop<=0){s.hop=0.5+Math.random()*2;s.m.rotation.y+=Math.random()*2-1;s.m.position.y=s.y+0.05;}else s.m.position.y+=(s.y-s.m.position.y)*Math.min(1,dt*8);
      if(Math.hypot(s.x-player.x,s.z-player.z)<6&&Math.abs(s.y-player.feet)<9){s.fly=4;const t=Math.random()*TAU;s.vx=Math.cos(t)*6;s.vz=Math.sin(t)*6;s.vy=3;}}
    else{s.fly-=dt;s.m.position.x+=s.vx*dt;s.m.position.y+=s.vy*dt;s.m.position.z+=s.vz*dt;s.m.visible=s.fly>0;}}
  // V8, V9, V10
  G5.t-=dt;if(G5.t<=0){G5.t=1.5;try{g5Parasols();}catch(er){}try{g5Graffiti();}catch(er){}}
  g5PetTick(dt,DAYF>0.3&&rain<0.5?((mo>=1&&mo<=3)?'p':(mo>=8&&mo<=10)?'h':null):null);}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{g5Tick(Math.min(dt,0.1));}catch(e){if(!G5.err){G5.err=1;console.warn('g5',e);}}return r;};}
