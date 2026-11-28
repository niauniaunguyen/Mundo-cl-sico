// ============================================================ GRÁFICOS (4): las diez propuestas del 22/11
// V1 Colinas mediterráneas: las laderas dejan de parecer dunas. Color por pendiente (roca caliza gris-ocre en lo empinado, matorral
//    verde oliva en las laderas medias, con manchas) y, por encima, matorral bajo (lentisco, coscoja, tomillo), olivos y afloramientos
//    de caliza. Más roca en los escarpes de la Acrópolis.
// V2 Casas distintas: junto a las paredes, tinajas (pithoi), macetas en la puerta, toldos de tela sobre la entrada y leña apilada.
// V3 Color: exposición según la hora (menos quemado a mediodía, más cálido al atardecer) y un ajuste suave de contraste y saturación.
//    No se cambia la gestión del color de todo el juego (todos los colores están ajustados a la forma actual de dibujar).
// V4 Luz baja: al amanecer y al atardecer la bruma se tiñe de dorado y se espesa un poco; de noche, azul.
// V5 Suelos con vida: rodadas de carro en los caminos, charcos tras la lluvia y paja y restos junto a los puestos del mercado.
// V6 Multitudes lejanas: la gente a más de 150 m (que antes no se dibujaba) se ve como figuritas planas: los mercados y las fiestas
//    se ven llenos desde lejos sin coste.
// V7 Aves: palomas en el suelo del Ágora / el Foro que levantan el vuelo cuando te acercas y vuelven a posarse.
// V8 Policromía: las estatuas tenían color (vestidos con cenefas, pelo y ojos pintados): se pintan, con colores gastados. Ofrendas
//    (guirnaldas, tortas, lucernas) a los pies de los altares.
// V9 Casas habitadas: de las casas sube el humo del hogar por el tejado (de día, poco; a la hora de cocinar, más).
// V10 Rendimiento: resolución dinámica. Si los FPS bajan de 40 un rato, se dibuja a menos resolución; si sobran, se sube.
const G4={done:{},t:0,fps:[],pr:null};
function g4R(x,z){const s=Math.sin(x*12.9898+z*78.233)*43758.5453;return s-Math.floor(s);}
function g4Center(){return MODE==='roma'?{x:0,z:0}:(typeof WALLC!=='undefined'?{x:WALLC.x,z:WALLC.z}:{x:0,z:0});}
// ---- V1a: color de las laderas
const G4_ROCK=new THREE.Color('#b3a68e'),G4_SCRUB=new THREE.Color('#7b7d4c'),G4_DARK=new THREE.Color('#5f6a3e'),G4_C=new THREE.Color();
function g4Slopes(){if(typeof TERR_MATS==='undefined')return;let n=0;scene.traverse(o=>{if(!o.isMesh||!o.geometry||o.geometry.userData.g4||!TERR_MATS.includes(o.material))return;const g=o.geometry,P=g.attributes.position,N=g.attributes.normal,C=g.attributes.color;
  if(!P||!N||!C)return;g.userData.g4=1;o.updateMatrixWorld();const e=o.matrixWorld.elements;
  for(let i=0;i<P.count;i++){const ny=N.getY(i);if(ny>0.985)continue;const x=P.getX(i)+e[12],z=P.getZ(i)+e[14],r=g4R(Math.floor(x/7),Math.floor(z/7));
    const rock=Math.min(1,Math.max(0,(0.9-ny)/0.2))*0.75,scrub=Math.min(1,Math.max(0,(0.985-ny)/0.09))*(0.25+0.4*r)*(1-rock);
    G4_C.setRGB(C.getX(i),C.getY(i),C.getZ(i));if(scrub>0)G4_C.lerp(r>0.6?G4_DARK:G4_SCRUB,scrub);if(rock>0)G4_C.lerp(G4_ROCK,rock*(0.7+0.3*g4R(x,z)));C.setXYZ(i,G4_C.r,G4_C.g,G4_C.b);}
  C.needsUpdate=true;n++;});return n;}
// celdas de 5 m pegadas a un camino (se calcula una vez)
function g4NearRoad(x,z){if(!G4.rg){G4.rg=new Set();try{for(const r of ROADS){const p=r.pts;for(let i=0;i<p.length-1;i++){const ax=p[i][0],az=p[i][1],bx=p[i+1][0],bz=p[i+1][1],L=Math.hypot(bx-ax,bz-az);for(let t=0;t<=L;t+=2.5){const px=ax+(bx-ax)*t/L,pz=az+(bz-az)*t/L;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)G4.rg.add(Math.floor(px/5+a)+','+Math.floor(pz/5+b));}}}}catch(e){}}return G4.rg.has(Math.floor(x/5)+','+Math.floor(z/5));}
// ---- V1b: matorral, olivos y caliza en las laderas
function g4Veg(){if(G4.done.veg||typeof chunked!=='function'||typeof terrainH!=='function')return;G4.done.veg=1;const c=g4Center(),R0=MODE==='roma'?1300:820,R1=R0+1000,M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(),V=new THREE.Vector3(),E=new THREE.Euler();
  const shrub=[],olive=[],rock=[],cliff=[];const slope=(x,z)=>{const a=terrainH(x+2,z)-terrainH(x-2,z),b=terrainH(x,z+2)-terrainH(x,z-2);return Math.hypot(a,b)/4;};
  for(let k=0;k<26000&&shrub.length<7000;k++){const a=g4R(k,1)*TAU,r=R0+Math.sqrt(g4R(k,2))*(R1-R0),x=c.x+Math.cos(a)*r,z=c.z+Math.sin(a)*r,y=terrainH(x,z);if(!isFinite(y)||y<0.6)continue;
    const s=slope(x,z);if(s<0.06)continue;try{if(!isFree(x,z,1.2))continue;if(g4NearRoad(x,z))continue;if(typeof riverWater==='function'&&riverWater(x,z)!==null)continue;}catch(e){}
    const q=g4R(x,z);if(s>0.55){if(q<0.35){E.set(q*3,q*7,q*2);Q.setFromEuler(E);const sc=1.5+q*4;S.set(sc*1.4,sc*0.7,sc);M.compose(V.set(x,y-sc*0.25,z),Q,S);cliff.push({m:M.clone(),c:new THREE.Color().setHSL(0.09,0.12,0.55+q*0.15)});}continue;}
    if(q<0.07&&s<0.4){E.set(0,q*90,0);Q.setFromEuler(E);const sc=0.8+q*5;S.set(sc,sc,sc);M.compose(V.set(x,y,z),Q,S);olive.push({m:M.clone()});continue;}
    if(q>0.93){E.set(q*2,q*9,q);Q.setFromEuler(E);const sc=0.5+(q-0.93)*25;S.set(sc*1.3,sc*0.6,sc);M.compose(V.set(x,y-sc*0.15,z),Q,S);rock.push({m:M.clone(),c:new THREE.Color().setHSL(0.1,0.1,0.6+(q-0.93)*3)});continue;}
    E.set(0,q*30,0);Q.setFromEuler(E);const sc=0.55+q*1.1;S.set(sc*1.3,sc*0.62,sc*1.2);M.compose(V.set(x,y+sc*0.15,z),Q,S);shrub.push({m:M.clone(),c:new THREE.Color().setHSL(0.17+q*0.06,0.28+q*0.15,0.22+q*0.1)});}
  // escarpes de la Acrópolis
  if(MODE!=='roma'&&typeof ACRO!=='undefined'){for(let i=0;i<260;i++){const a=i/260*TAU,j=g4R(i,7),rx=ACRO.rx*(1.02+j*0.18),rz=ACRO.rz*(1.02+j*0.18),x=ACRO.x+Math.cos(a)*rx,z=ACRO.z+Math.sin(a)*rz,y=terrainH(x,z);
      E.set(j*2,a,j);Q.setFromEuler(E);const sc=3+j*5;S.set(sc,sc*1.6,sc*0.9);M.compose(V.set(x,y-sc*0.4,z),Q,S);cliff.push({m:M.clone(),c:new THREE.Color().setHSL(0.09,0.14,0.5+j*0.12)});}}
  const mS=new THREE.MeshLambertMaterial({color:0xffffff}),mR=new THREE.MeshLambertMaterial({color:0xffffff,flatShading:true});
  if(shrub.length)chunked(new THREE.IcosahedronGeometry(0.9,0),mS,shrub,{veg:true,shadow:false});
  G4.rockL=rock;G4.cliffL=cliff;   // las rocas se ponen con los modelos escaneados (233), no con poliedros
  if(olive.length){const tg=new THREE.CylinderGeometry(0.12,0.2,2.2,5);tg.translate(0,1.1,0);const cg=new THREE.IcosahedronGeometry(1.5,0);cg.scale(1.3,0.8,1.3);cg.translate(0,2.7,0);
    chunked(tg,new THREE.MeshLambertMaterial({color:'#5b4a38'}),olive,{veg:true});chunked(cg,new THREE.MeshLambertMaterial({color:'#7d8a62'}),olive,{veg:true});}
  G4.vegN={shrub:shrub.length,olive:olive.length,rock:rock.length,cliff:cliff.length};}
// ---- V2: detalles junto a las casas
function g4Houses(){if(G4.done.house||typeof footprints==='undefined'||typeof chunked!=='function')return;G4.done.house=1;const M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(),V=new THREE.Vector3(),E=new THREE.Euler();
  const jars=[],pots=[],plants=[],awn=[],wood=[],AW=['#a8452c','#c9a24a','#4a6a8a','#e0d4b4','#7a3a4a','#6a7a3a'];
  for(const f of footprints){if(!f.house)continue;const q=g4R(f.x,f.z),ca=Math.cos(f.a),sa=Math.sin(f.a),W=(lx,lz)=>[f.x+lx*ca+lz*sa,f.z-lx*sa+lz*ca];
    if(q<0.35){const n=1+Math.floor(q*8);for(let i=0;i<n;i++){const [x,z]=W(-f.w/2+0.7+i*0.75,-f.d/2-0.45);const y=floorAt(x,z);S.setScalar(0.85+g4R(i,f.x)*0.4);M.compose(V.set(x,y,z),Q.identity(),S);jars.push({m:M.clone()});}}
    if(q>0.45&&q<0.75){const [x,z]=W(f.w*0.15+1.1,f.d/2+0.4);const y=floorAt(x,z);S.setScalar(1);M.compose(V.set(x,y,z),Q.identity(),S);pots.push({m:M.clone()});plants.push({m:M.clone(),c:new THREE.Color().setHSL(0.25+q*0.1,0.4,0.28)});}
    if(q>0.62&&q<0.85){const [x,z]=W(f.w*0.15,f.d/2+0.75);const y=floorAt(x,z);E.set(-0.35,f.a,0,'YXZ');Q.setFromEuler(E);S.set(2.4,1,1.4);M.compose(V.set(x,y+2.25,z),Q,S);awn.push({m:M.clone(),c:new THREE.Color(AW[Math.floor(q*97)%AW.length])});}
    if(q>0.88){const [x,z]=W(f.w/2+0.5,0);const y=floorAt(x,z);E.set(0,f.a,0);Q.setFromEuler(E);S.set(1,1,1);M.compose(V.set(x,y,z),Q,S);wood.push({m:M.clone()});}}
  const jg=new THREE.SphereGeometry(0.32,8,6);jg.scale(1,1.45,1);jg.translate(0,0.45,0);if(jars.length)chunked(jg,lam('#a8603a'),jars,{shadow:false});
  const pg=new THREE.CylinderGeometry(0.22,0.16,0.35,8);pg.translate(0,0.17,0);if(pots.length)chunked(pg,lam('#b4643c'),pots,{shadow:false});
  const lg=new THREE.IcosahedronGeometry(0.3,0);lg.translate(0,0.55,0);if(plants.length)chunked(lg,new THREE.MeshLambertMaterial({color:0xffffff}),plants,{veg:true,shadow:false});
  const ag=new THREE.PlaneGeometry(1,1);ag.rotateX(-Math.PI/2);if(awn.length)chunked(ag,new THREE.MeshLambertMaterial({color:0xffffff,side:THREE.DoubleSide}),awn,{shadow:true});
  const wg=new THREE.BoxGeometry(0.5,0.6,1.6);wg.translate(0,0.3,0);if(wood.length)chunked(wg,lam('#6a5038'),wood,{shadow:false});
  G4.houseN={jars:jars.length,pots:pots.length,awn:awn.length,wood:wood.length};}
// ---- V3 + V4: exposición, bruma y ajuste de color
function g4Light(){if(typeof SUNDIR==='undefined'||!scene.fog)return;const e=SUNDIR.y,low=Math.max(0,1-Math.abs(e-0.08)/0.22),night=Math.max(0,Math.min(1,(-e+0.02)/0.15));
  renderer.toneMappingExposure=1.0-0.07*Math.max(0,Math.min(1,(e-0.4)/0.4))+0.1*low;
  if(low>0.01){G4_C.set('#e9b27a');scene.fog.color.lerp(G4_C,0.35*low);}if(night>0.01){G4_C.set('#2a3550');scene.fog.color.lerp(G4_C,0.25*night);}
  if(scene.fog.density!==undefined){if(G4.fd==null)G4.fd=scene.fog.density;}}
{const f=updateSky;updateSky=function(){const r=f.apply(this,arguments);try{g4Light();}catch(e){}return r;};}
function g4Grade(){const c=renderer.domElement;if(c&&!c.style.filter&&!(typeof GFX!=='undefined'&&GFX.on))c.style.filter='saturate(1.07) contrast(1.04)';}
// ---- V5: rodadas, charcos y restos del mercado
function g4Ground(){if(G4.done.ground||typeof chunked!=='function')return;G4.done.ground=1;const M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(),V=new THREE.Vector3(),E=new THREE.Euler(),ruts=[],litter=[];
  try{for(const rd of ROADS){const P=rd.pts||rd;if(!P||P.length<2)continue;
      for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],ax=a[0]!==undefined?a[0]:a.x,az=a[1]!==undefined?a[1]:a.z,bx=b[0]!==undefined?b[0]:b.x,bz=b[1]!==undefined?b[1]:b.z,L=Math.hypot(bx-ax,bz-az);if(!(L>1))continue;const ang=Math.atan2(bx-ax,bz-az),nx=Math.cos(ang),nz=-Math.sin(ang);
        for(let t=0;t<L;t+=6){const x=ax+(bx-ax)*t/L,z=az+(bz-az)*t/L;if(ruts.length>9000)break;for(const s of[-0.75,0.75]){const px=x+nx*s,pz=z+nz*s,y=floorAt(px,pz);E.set(0,ang,0);Q.setFromEuler(E);S.set(0.22,1,6.2);M.compose(V.set(px,y+0.03,pz),Q,S);ruts.push({m:M.clone()});}}}}}catch(e){}
  if(ruts.length){const g=new THREE.PlaneGeometry(1,1);g.rotateX(-Math.PI/2);chunked(g,new THREE.MeshLambertMaterial({color:'#6a5640',transparent:true,opacity:0.35,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}),ruts,{shadow:false,receive:true});}
  const mk=MODE==='roma'?{x:0,z:-22,r:40}:(typeof AG!=='undefined'?{x:AG.x+30,z:AG.z-10,r:70}:null);
  if(mk)for(let i=0;i<500;i++){const a=g4R(i,3)*TAU,r=Math.sqrt(g4R(i,4))*mk.r,x=mk.x+Math.cos(a)*r,z=mk.z+Math.sin(a)*r;try{if(!isFree(x,z,0.3))continue;}catch(e){}const y=floorAt(x,z);E.set(0,a*5,0);Q.setFromEuler(E);const q=g4R(x,z);S.set(0.3+q*0.6,1,0.08+q*0.1);M.compose(V.set(x,y+0.02,z),Q,S);litter.push({m:M.clone(),c:new THREE.Color().setHSL(0.12,0.45,0.55+q*0.2)});}
  if(litter.length){const g=new THREE.PlaneGeometry(1,1);g.rotateX(-Math.PI/2);chunked(g,new THREE.MeshLambertMaterial({color:0xffffff,polygonOffset:true,polygonOffsetFactor:-2}),litter,{shadow:false});}
  G4.groundN={ruts:ruts.length,litter:litter.length};}
// charcos: tras la lluvia, en los puntos bajos cerca de ti; se secan en unas horas
function g4Puddles(dt){const wet=typeof WXS!=='undefined'&&WXS.rain>0.2;if(wet)G4.wetT=6;else G4.wetT=Math.max(0,(G4.wetT||0)-dt/60);
  if(!G4.pud){const g=new THREE.CircleGeometry(1,16);g.rotateX(-Math.PI/2);const m=new THREE.MeshPhongMaterial({color:'#5a6a78',shininess:90,specular:0x888888,transparent:true,opacity:0,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3});
    G4.pud=new THREE.InstancedMesh(g,m,40);G4.pud.frustumCulled=false;scene.add(G4.pud);G4.pudK='';}
  const op=Math.min(0.55,(G4.wetT||0)*0.15);G4.pud.material.opacity=op;G4.pud.visible=op>0.01;if(!G4.pud.visible)return;
  const k=Math.round(player.x/40)+','+Math.round(player.z/40);if(k===G4.pudK)return;G4.pudK=k;const M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(),V=new THREE.Vector3();let n=0;
  for(let i=0;i<300&&n<40;i++){const x=Math.round(player.x/40)*40+(g4R(i,k.length)-0.5)*80,z=Math.round(player.z/40)*40+(g4R(k.length,i)-0.5)*80;try{if(!isFree(x,z,1))continue;}catch(e){}const y=floorAt(x,z);if(terrainH(x+3,z)<y+0.04||terrainH(x-3,z)<y+0.04||terrainH(x,z+3)<y+0.04||terrainH(x,z-3)<y+0.04)continue;
    const s=0.6+g4R(x,z)*1.4;S.set(s*1.4,1,s);M.compose(V.set(x,y+0.03,z),Q,S);G4.pud.setMatrixAt(n++,M);}G4.pud.count=n;G4.pud.instanceMatrix.needsUpdate=true;}
// ---- V6: figuras planas para la gente lejana
function g4CrowdTex(){const c=document.createElement('canvas');c.width=32;c.height=64;const x=c.getContext('2d');x.fillStyle='#fff';x.beginPath();x.arc(16,9,6,0,7);x.fill();x.beginPath();x.moveTo(8,18);x.lineTo(24,18);x.lineTo(27,60);x.lineTo(5,60);x.closePath();x.fill();
  const t=new THREE.CanvasTexture(c);return t;}
function g4Crowd(){if(typeof walkers==='undefined')return;if(!G4.cr){const N=1200,g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(N*3),3));g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(N*3),3));
    const m=new THREE.PointsMaterial({size:1.9,map:g4CrowdTex(),vertexColors:true,transparent:true,alphaTest:0.5,sizeAttenuation:true});G4.cr=new THREE.Points(g,m);G4.cr.frustumCulled=false;scene.add(G4.cr);}
  const P=G4.cr.geometry.attributes.position,C=G4.cr.geometry.attributes.color,cx=camera.position.x,cz=camera.position.z;let n=0;
  for(const w of walkers){if(n>=1200)break;const g=w.g;if(!g||!g.parent||w.home)continue;const d=Math.hypot(g.position.x-cx,g.position.z-cz);if(d<148||d>480)continue;
    P.setXYZ(n,g.position.x,g.position.y+0.95,g.position.z);const cf=g.userData.cfg||{},col=G4_C.set(cf.himation||cf.chiton||'#c8b89a');C.setXYZ(n,col.r*0.85,col.g*0.85,col.b*0.85);n++;}
  G4.cr.geometry.setDrawRange(0,n);P.needsUpdate=true;C.needsUpdate=true;}
// ---- V7: palomas que se levantan
function g4Pigeons(dt){const mk=MODE==='roma'?{x:6,z:-30,r:22}:(typeof AG!=='undefined'?{x:AG.x+20,z:AG.z+10,r:40}:null);if(!mk)return;
  if(!G4.pg){const g=new THREE.Group(),m=new THREE.MeshLambertMaterial({color:'#8c8f96'}),bg=new THREE.SphereGeometry(0.11,6,4);bg.scale(1,0.8,1.5);const B=[];
    for(let i=0;i<18;i++){const b=new THREE.Mesh(bg,m);const a=g4R(i,11)*TAU,r=Math.sqrt(g4R(i,12))*mk.r,x=mk.x+Math.cos(a)*r,z=mk.z+Math.sin(a)*r;b.position.set(x,floorAt(x,z)+0.1,z);b.userData={hx:x,hz:z,st:0,t:0,vx:0,vy:0,vz:0};g.add(b);B.push(b);}
    scene.add(g);G4.pg=B;}
  if(Math.hypot(player.x-mk.x,player.z-mk.z)>mk.r+80)return;
  for(const b of G4.pg){const u=b.userData,d=Math.hypot(b.position.x-player.x,b.position.z-player.z);
    if(u.st===0){u.t-=dt;if(u.t<0){u.t=0.6+Math.random()*2;b.rotation.y=Math.random()*TAU;}b.position.y=floorAt(b.position.x,b.position.z)+0.1+(Math.random()<0.02?0.03:0);
      if(d<4.5){u.st=1;u.t=6+Math.random()*6;const a=Math.atan2(b.position.x-player.x,b.position.z-player.z)+(Math.random()-0.5);u.vx=Math.sin(a)*5;u.vz=Math.cos(a)*5;u.vy=4.5;try{if(aOK()&&!G4.flutter){G4.flutter=1;setTimeout(()=>G4.flutter=0,800);gfNoise(AUD.ctx.currentTime,'bandpass',900,0.8,0.05,0.01,0.5);}}catch(e){}}}
    else{u.t-=dt;b.position.x+=u.vx*dt;b.position.z+=u.vz*dt;b.position.y+=u.vy*dt;u.vy=Math.max(-1,u.vy-1.2*dt);b.rotation.y=Math.atan2(u.vx,u.vz);
      if(u.t<0){const dx=u.hx-b.position.x,dz=u.hz-b.position.z,dd=Math.hypot(dx,dz);if(dd<0.6){u.st=0;}else{u.vx=dx/dd*4;u.vz=dz/dd*4;u.vy=(floorAt(u.hx,u.hz)+0.1-b.position.y)*0.8;}}}}}
// ---- V8: policromía de las estatuas y ofrendas en los altares
function g4Poly(){if(typeof STB==='undefined'||!STB.list)return;for(const s of STB.list){const n=s.bp;if(!n||n.userData.g4p)continue;n.userData.g4p=1;const q=g4R(s.g.position.x,s.g.position.z),cols=['#8a4a3e','#4a6a8a','#7a6a3a','#6a4a6a'];
    n.traverse(o=>{if(!o.isMesh||!o.material||!o.material.color)return;const nm=(o.material.name||'').toLowerCase();let c=null;
      if(/himation|palla|manto/.test(nm))c=cols[Math.floor(q*4)];else if(/quiton|chiton|estola|tunica|exomis/.test(nm))c='#d8cdb4';else if(/pelo|hair|barba|beard/.test(nm))c='#6a4a30';
      if(c){o.material=o.material.clone();o.material.color.lerp(G4_C.set(c),0.32);}});}}
function g4Offer(){if(G4.done.offer||typeof PLACES==='undefined')return;G4.done.offer=1;const L=PLACES.filter(p=>/altar|ara |ara$|ara de|aras|bomós|bomos/i.test((p.name||'')+' '+(p.id||''))&&isFinite(p.x)&&Math.abs(p.x)<4000);
  const fl=new THREE.MeshLambertMaterial({color:'#c9a03a'}),gr=new THREE.MeshLambertMaterial({color:'#4f6a32'}),cake=new THREE.MeshLambertMaterial({color:'#d8b07a'}),lamp=new THREE.MeshLambertMaterial({color:'#a8603a'});
  for(const p of L){const g=new THREE.Group();const y=floorAt(p.x,p.z);g.position.set(p.x+1.6,y,p.z+1.2);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(0.28,0.06,5,12),gr);ring.rotation.x=Math.PI/2;ring.position.y=0.05;g.add(ring);
    for(let i=0;i<5;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.05,5,4),fl);f.position.set(Math.cos(i*1.25)*0.28,0.09,Math.sin(i*1.25)*0.28);g.add(f);}
    const c=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,0.05,10),cake);c.position.set(0.5,0.03,0.1);g.add(c);const l=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,5),lamp);l.scale.set(1.4,0.6,1);l.position.set(-0.45,0.05,0.2);g.add(l);scene.add(g);}
  G4.offerN=L.length;}
// ---- V9: humo del hogar
function g4Smoke(dt){if(!G4.sm){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),gr=x.createRadialGradient(32,32,2,32,32,30);gr.addColorStop(0,'rgba(210,205,198,.7)');gr.addColorStop(1,'rgba(210,205,198,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);
    G4.smT=new THREE.CanvasTexture(c);G4.sm=[];G4.smH=[];}
  const h=clock.h,cook=(h>=10&&h<12)||(h>=17&&h<20),want=cook?28:10;
  if(!G4.smH.length||G4.smK!==Math.round(player.x/80)+','+Math.round(player.z/80)){G4.smK=Math.round(player.x/80)+','+Math.round(player.z/80);G4.smH=[];
    for(const f of footprints){if(!f.house)continue;if(Math.hypot(f.x-player.x,f.z-player.z)>220)continue;if(g4R(f.x,f.z)<0.82)continue;G4.smH.push({x:f.x+(g4R(f.z,f.x)-0.5)*f.w*0.5,z:f.z,y:floorAt(f.x,f.z)+4.2});if(G4.smH.length>=30)break;}}
  while(G4.sm.length<want&&G4.smH.length){const H=G4.smH[G4.sm.length%G4.smH.length],s=new THREE.Sprite(new THREE.SpriteMaterial({map:G4.smT,transparent:true,depthWrite:false,opacity:0}));s.userData={H,t:Math.random()*6};scene.add(s);G4.sm.push(s);}
  while(G4.sm.length>want){scene.remove(G4.sm.pop());}
  for(const s of G4.sm){const u=s.userData;u.t+=dt;if(u.t>6)u.t=0;const k=u.t/6;s.position.set(u.H.x+k*1.5,u.H.y+k*6,u.H.z+k*0.8);const sc=0.8+k*3;s.scale.set(sc,sc,1);s.material.opacity=0.35*Math.sin(Math.PI*k)*(DAYF>0.1?1:0.4);}}
// ---- V10: resolución dinámica
function g4Res(dt){if(dt<=0)return;G4.fps.push(1/dt);if(G4.fps.length<90)return;const avg=G4.fps.reduce((a,b)=>a+b,0)/G4.fps.length;G4.fps.length=0;const base=Math.min(window.devicePixelRatio||1,2);
  if(G4.pr===null)G4.pr=renderer.getPixelRatio();let pr=G4.pr;if(avg<38)pr=Math.max(base*0.6,pr-0.1);else if(avg>56)pr=Math.min(base,pr+0.05);
  if(Math.abs(pr-renderer.getPixelRatio())>0.02){renderer.setPixelRatio(pr);G4.pr=pr;try{resize();}catch(e){}}}
// ---- arranque y ticks
function g4Build(){if(!state||G4.built)return;G4.built=1;const T=(k,f)=>{try{f();}catch(e){console.warn('g4 '+k,e);}};T('laderas',g4Slopes);T('veg',g4Veg);T('casas',g4Houses);T('suelo',g4Ground);T('ofrendas',g4Offer);}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start')return r;if(!G4.built&&ui==='play')g4Build();G4.t+=dt;g4Res(dt);g4Pigeons(dt);g4Smoke(dt);
  if(G4.t>0.5){G4.t=0;g4Crowd();g4Puddles(0.5);g4Grade();G4.t2=(G4.t2||0)+1;if(G4.t2%10===0){g4Slopes();g4Poly();}}}catch(e){}return r;};}
