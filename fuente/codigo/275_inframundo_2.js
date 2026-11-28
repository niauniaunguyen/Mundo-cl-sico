// ============================================================ EL INFRAMUNDO, MÁS CREÍBLE (28/11)
// En las capturas del 27/11 el Inframundo (255) tenía el cielo azul del día de arriba, suelos lisos de un color, conos verdes por
// árboles en los Campos Elíseos y unas sombras de los muertos poco fantasmales. Ahora:
//  · luz propia: bajo tierra no hay sol. Bóveda casi negra, niebla gris azulada que se traga las paredes, luz fría y débil; la «tierra
//    sin sol» de la Odisea (XI 13-19: los cimerios viven en la niebla, sin que Helios los mire nunca);
//  · suelos con textura (tierra, roca, hierba gris en Asfódelos y verde en los Elíseos);
//  · los prados de Asfódelos con asfódelos de verdad: tallos altos sin hojas y espigas de flores blancas (Asphodelus ramosus), la planta
//    que crece en el prado de los muertos (Odisea XI 539 y XXIV 13);
//  · los Campos Elíseos con árboles de Blender (los de 005) y prados de rosas rojas, como los describe Píndaro (fr. 129: «prados de
//    rosas rojas, a la sombra de árboles de incienso y cargados de frutos de oro»); allí sí hay luz, más cálida;
//  · las sombras de los muertos, translúcidas y azuladas, que flotan un poco; el Piriflegetonte, de fuego, parpadea.
// Todo es barato: las flores van en tres mallas instanciadas, y la atmósfera solo cambia colores y la niebla.
const INF2={done:false,g:null,in:false,fog:null,ghosts:[],fire:null,ely:null};
function inf2In(){return typeof INF!=='undefined'&&INF.built&&Math.abs(player.feet-INF.Y)<60&&Math.hypot(player.x-INF.X,player.z-INF.Z)<420;}
function inf2Upgrade(){if(INF2.done||!INF.built)return;const g=scene.children.find(o=>o.isGroup&&Math.abs(o.position.x-INF.X)<1&&Math.abs(o.position.z-INF.Z)<1&&Math.abs(o.position.y-INF.Y)<1);if(!g)return;INF2.done=true;INF2.g=g;
  const tex=(col,t,s)=>{const m=new THREE.MeshLambertMaterial({color:col});try{triplanar(m,PTEX[t],s);}catch(e){}return m;};
  // suelos con textura; los conos de los Elíseos, fuera (los sustituyen árboles de Blender)
  const trees=[];g.traverse(o=>{if(!o.isMesh)return;const p=o.geometry&&o.geometry.type,c=o.material&&o.material.color&&o.material.color.getHexString();
    if(p==='PlaneGeometry'&&o.material.type==='MeshLambertMaterial'&&Math.abs(o.rotation.x+Math.PI/2)<0.01){
      o.material=c==='4f7a3e'?tex('#3c5530','grass',3.2):c==='4a4a50'?tex('#6a6c62','grass',3):tex('#'+c,'ground',5);}
    if(p==='ConeGeometry'&&c==='3f6a32'){o.visible=false;trees.push({x:INF.X+o.position.x,z:INF.Z+o.position.z,y:INF.Y,kind:trees.length%3?'plane':'olive',k:0.9+Math.random()*0.4});}
    if(o.material&&o.material.type==='MeshPhongMaterial'&&o.material.emissive&&o.material.emissive.getHexString()==='a03000')INF2.fire=o.material;});
  try{if(trees.length&&typeof treesGLB==='function')treesGLB(trees);}catch(e){console.warn('inf2 árboles',e);}
  // asfódelos: tallo, espiga de flores blancas y la mata de hojas de la base
  const R=(a,b)=>a+Math.random()*(b-a),N=420,m4=new THREE.Matrix4(),q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),sc=new THREE.Vector3(),ps=new THREE.Vector3();
  const stem=new THREE.CylinderGeometry(0.012,0.02,1,4);stem.translate(0,0.5,0);const spike=new THREE.SphereGeometry(1,6,5);spike.scale(0.06,0.22,0.06);spike.translate(0,1.05,0);
  const leaf=new THREE.ConeGeometry(0.18,0.35,5,1,true);leaf.translate(0,0.17,0);
  const ims=[[stem,new THREE.MeshLambertMaterial({color:'#7d8a5a'})],[spike,new THREE.MeshLambertMaterial({color:'#efe9df',emissive:new THREE.Color('#2a2a30')})],[leaf,new THREE.MeshLambertMaterial({color:'#5d6e44',side:THREE.DoubleSide})]].map(([ge,ma])=>{const im=new THREE.InstancedMesh(ge,ma,N);im.userData.noSeal=1;im.userData.noInst=1;return im;});
  for(let i=0;i<N;i++){const x=INF.X-120+R(-78,78),z=INF.Z-10+R(-68,68),h=R(0.7,1.2);q.setFromAxisAngle(up,R(0,6.28));ps.set(x,INF.Y,z);sc.set(1,h,1);m4.compose(ps,q,sc);ims[0].setMatrixAt(i,m4);ims[1].setMatrixAt(i,m4);sc.set(R(0.8,1.3),R(0.7,1.1),R(0.8,1.3));m4.compose(ps,q,sc);ims[2].setMatrixAt(i,m4);}
  // rosas rojas de los Elíseos
  const rose=new THREE.SphereGeometry(0.12,5,4);rose.translate(0,0.35,0);const bush=new THREE.SphereGeometry(0.4,6,5);bush.scale(1,0.7,1);bush.translate(0,0.25,0);const NR=260;
  const rIm=new THREE.InstancedMesh(rose,new THREE.MeshLambertMaterial({color:'#b3242c'}),NR*3),bIm=new THREE.InstancedMesh(bush,new THREE.MeshLambertMaterial({color:'#3e6a2e'}),NR);
  for(let i=0;i<NR;i++){const x=INF.X+120+R(-80,80),z=INF.Z-10+R(-70,70);ps.set(x,INF.Y,z);q.setFromAxisAngle(up,R(0,6.28));sc.set(1,1,1);m4.compose(ps,q,sc);bIm.setMatrixAt(i,m4);
    for(let k=0;k<3;k++){ps.set(x+R(-0.3,0.3),INF.Y+R(-0.05,0.1),z+R(-0.3,0.3));m4.compose(ps,q,sc);rIm.setMatrixAt(i*3+k,m4);}}
  for(const im of[...ims,rIm,bIm]){im.receiveShadow=true;im.geometry.computeBoundingSphere();im.geometry.boundingSphere=new THREE.Sphere(new THREE.Vector3(INF.X,INF.Y,INF.Z),260);im.frustumCulled=true;scene.add(im);}
  // sombras de los muertos: translúcidas, azuladas, sin escribir profundidad (no tapan lo de detrás)
  for(const p of INF.people){let ghost=false;p.traverse(o=>{if(o.isMesh&&o.material&&o.material.transparent&&o.material.opacity<0.9){ghost=true;o.material.opacity=0.42;o.material.depthWrite=false;if(o.material.emissive)o.material.emissive.set('#3a5682');}});
    if(ghost){INF2.ghosts.push({g:p,y0:p.position.y,ph:Math.random()*6});p.traverse(o=>{if(o.isMesh)o.castShadow=false;});}}}
// la luz: se cambia después de que updateSky ponga la del día de arriba
{const f=updateSky;updateSky=function(){const r=f.apply(this,arguments);try{if(!inf2In())return r;const U=SKY.uniforms;
  U.top.value.set('#07080d');U.mid.value.set('#141722');U.bot.value.set('#2b2e3a');U.glow.value=0;scene.fog.color.copy(U.bot.value);STARS.material.opacity=0;
  sun.intensity=0.6;sun.color.set('#a6b4d8');hemi.intensity=0.85;hemi.color.set('#6c789e');hemi.groundColor.set('#2a2730');
  // en los Elíseos, una luz más cálida (Píndaro, Olímpica II 61-62: allí brilla el sol por igual de día y de noche)
  const ex=player.x-INF.X-120,ez=player.z-INF.Z+10;if(Math.abs(ex)<85&&Math.abs(ez)<75){sun.intensity=0.7;sun.color.set('#ffe2a8');hemi.intensity=0.6;hemi.color.set('#c9b98a');U.bot.value.set('#3e3a30');scene.fog.color.copy(U.bot.value);}}catch(e){}return r;};}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(typeof INF==='undefined'||!INF.built)return r;inf2Upgrade();const inn=inf2In();
  if(inn&&!INF2.in){INF2.in=true;INF2.fog=[scene.fog.near,scene.fog.far];}
  if(inn){const lite=typeof ACC!=='undefined'&&ACC.lite;scene.fog.near=lite?25:40;scene.fog.far=lite?260:380;const t=performance.now()/1000;
    for(const G of INF2.ghosts)G.g.position.y=G.y0+0.12+Math.sin(t*0.9+G.ph)*0.1;
    if(INF2.fire)INF2.fire.emissive.setRGB(0.63+0.15*Math.sin(t*7.3)+0.08*Math.sin(t*13.1),0.19+0.05*Math.sin(t*5.1),0);}
  else if(INF2.in){INF2.in=false;if(INF2.fog){scene.fog.near=INF2.fog[0];scene.fog.far=INF2.fog[1];}}}catch(e){if(!INF2.err){INF2.err=1;console.warn('inf2',e);}}return r;};}
// justo antes de dibujar: la niebla del Inframundo manda (el tiempo, 090, y los biomas, 222, la cambian después de updateSky)
// y lo que vuela (pájaros) y las nubes del cielo (212, en el sombreador del cielo) no se dibujan mientras se está abajo
INF2.cand=[];
// lo que vuela: un grupo alto, los pájaros (avn) o un grupo pequeño con algún hijo en lo alto (bandadas con el grupo a ras de suelo)
function inf2Fly(o,top){if(o.userData.avn||o.position.y>top)return true;if(!o.isGroup||o===INF2.g)return false;const ch=o.children;if(ch.length>40)return false;for(const c of ch)if(c.position.y+o.position.y>top)return true;return false;}
function inf2Scan(){const top=INF.Y+4;INF2.cand=[];for(const o of scene.children){if(o===skyMesh||o.isLight||o===INF2.g||(o.isGroup&&o.children.length>40))continue;if(inf2Fly(o,top)||o.isGroup&&o.children.length<=40&&o.position.y<INF.Y-30)INF2.cand.push(o);}}
{const f=renderer.render.bind(renderer);renderer.render=function(s,c){if(s!==scene||!INF2.in)return f(s,c);let b=null;const hid=[],top=INF.Y+4;
  try{if(typeof BIO!=='undefined'){b=BIO.cur;BIO.cur=null;}scene.fog.color.copy(SKY.uniforms.bot.value);if(SKY.uniforms.cOn){INF2.cOn=SKY.uniforms.cOn.value;SKY.uniforms.cOn.value=0;}for(const o of INF2.cand)if(o.visible&&inf2Fly(o,top)){o.visible=false;hid.push(o);}}catch(e){}
  try{return f(s,c);}finally{for(const o of hid)o.visible=true;if(SKY.uniforms.cOn&&INF2.cOn!==undefined)SKY.uniforms.cOn.value=INF2.cOn;try{if(typeof BIO!=='undefined')BIO.cur=b;}catch(e){}}};}
{const f=gfTick;let t=9;gfTick=function(dt){const r=f.apply(this,arguments);try{if(INF2.in){t+=dt;if(t>2){t=0;inf2Scan();}}else{t=9;INF2.cand=[];}}catch(e){}return r;};}
// el Inframundo está a 4.200 m de altura (255) y checkZone lo tomaba por la Luna, que se reconoce solo por la altura
{const f=checkZone;checkZone=function(){try{if(inf2In()){if(curZone!=='inframundo'){curZone='inframundo';const ro=MODE==='roma';showZone(ro?'El Orco':'La casa de Hades',ro?'ORCVS':'ΔΟΜΟΣ ΑΪΔΟΥ',ro?'El reino de Plutón y Proserpina':'El reino de Hades y Perséfone');}return;}}catch(e){}return f.apply(this,arguments);};}
{const f=regionName;regionName=function(){try{if(inf2In())return MODE==='roma'?'El Orco':'El Inframundo';}catch(e){}return f.apply(this,arguments);};}
