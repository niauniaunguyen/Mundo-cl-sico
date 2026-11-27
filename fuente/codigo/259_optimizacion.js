// ============================================================ OPTIMIZACIÓN: diez propuestas (27/11)
// A partir de la prueba del Chromebook (258) y de una medida en el navegador sin gráfica: en Atenas había 9.341 mallas con esqueleto
// (7.379 de las 344 figuras de Blender), 1.500-1.800 llamadas de dibujo y el sellado de paredes trabajando sin parar.
//  O1 figuras planas: los transeúntes a más de IMP.D metros se dibujan todos juntos, en UNA llamada, como figuras planas que miran
//     a la cámara (con el color de su ropa y un leve balanceo al andar). Antes se veían enteros hasta 150 m; ahora llegan hasta IMP.F.
//  O2 animación por distancia: las figuras de Blender a más de 20 m recalculan la postura cada 2 fotogramas, y a más de 45 m cada 4
//     (los animales con esqueleto, igual: 198).
//  O3 sellado de paredes: las pasadas repetidas ya no vuelven a estudiar las piezas estudiadas antes (era lo que lo tenía siempre ocupado).
//  O4 piezas repetidas: dentro de cada edificio quieto, las cajas y los cilindros iguales con el mismo material se juntan en una sola
//     malla con instancias (una llamada de dibujo para todas). Se desactiva con localStorage «nostos-noinst».
//  O5 memoria: los datos de los modelos (texto en base64) se sueltan en cuanto se han leído; en equipos modestos, las texturas de más
//     de 1024 px se reducen a la mitad.
//  O6 texturas: (comprimirlas en KTX2 exige otra cadena de herramientas; de momento, O5 las reduce en equipos modestos).
//  O7 materiales: se compilan todos al empezar (sin tirones luego); en equipos modestos, los «físicos» (MeshStandard) pasan a Lambert.
//  O8 sombras: el mapa de sombras se recalcula uno de cada dos fotogramas (el sol se mueve despacio).
//  O9 reparto del trabajo: en equipos modestos, como mucho 30 imágenes/s (se calientan menos y no se frenan) y algunas tareas
//     de fondo (estación, sonido de zona, rótulos) van a la mitad de ritmo.
//  O10 lo que tapan los muros: con la rejilla de colisiones se mira si hay un muro entre los ojos y cada transeúnte u objeto
//     pequeño; si lo hay y está lejos, no se dibuja. Solo a pie y a ras de suelo (desde la Acrópolis se ve todo).
const IMP={on:true,D:60,F:230,OC:22,max:700,mesh:null,n:0};
try{if(typeof ACC!=='undefined'&&ACC.lite){IMP.D=32;IMP.F=170;}if(typeof isTouch!=='undefined'&&isTouch&&!ACC.lite)IMP.D=45;}catch(e){}
const O9={t:0};
// ---------------------------------------------------------------- O1 figuras planas
function impTex(){const c=document.createElement('canvas');c.width=64;c.height=160;const x=c.getContext('2d');
  // rojo = ropa (se tiñe), verde = piel
  x.fillStyle='#00ff00';x.beginPath();x.ellipse(32,16,9,11,0,0,6.3);x.fill();x.fillRect(28,25,8,6);
  x.fillStyle='#ff0000';x.beginPath();x.moveTo(17,32);x.lineTo(47,32);x.lineTo(52,78);x.lineTo(50,150);x.lineTo(14,150);x.lineTo(12,78);x.closePath();x.fill();
  x.fillStyle='#00ff00';x.fillRect(9,40,6,34);x.fillRect(49,40,6,34);x.fillRect(22,150,8,10);x.fillRect(34,150,8,10);
  const t=new THREE.CanvasTexture(c);t.magFilter=THREE.LinearFilter;return t;}
function impInit(){if(IMP.mesh)return;const geo=new THREE.PlaneGeometry(0.62,1.72);geo.translate(0,0.86,0);
  const mat=new THREE.ShaderMaterial({fog:true,uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{map:{value:null},uDim:{value:1},uTime:{value:0}}]),
    vertexShader:'uniform float uTime;varying vec2 vUv;varying vec3 vCol;\n#include <fog_pars_vertex>\nvoid main(){vUv=uv;vCol=instanceColor;vec3 c=vec3(instanceMatrix[3]);float s=instanceMatrix[0][0];vec3 tc=cameraPosition-c;tc.y=0.0;vec3 r=normalize(vec3(-tc.z,0.0,tc.x)+1e-5);float bob=abs(sin(uTime*6.0+c.x*1.7+c.z))*0.035*instanceMatrix[1][1];vec3 wp=c+r*position.x*s+vec3(0.0,position.y*s+bob,0.0);vec4 mvPosition=viewMatrix*vec4(wp,1.0);gl_Position=projectionMatrix*mvPosition;\n#include <fog_vertex>\n}',
    fragmentShader:'uniform sampler2D map;uniform float uDim;varying vec2 vUv;varying vec3 vCol;\n#include <fog_pars_fragment>\nvoid main(){vec4 t=texture2D(map,vUv);if(t.a<0.5)discard;vec3 col=t.r>0.5?vCol:vec3(0.72,0.53,0.4);col*=(0.72+0.38*vUv.y)*uDim;gl_FragColor=vec4(col,1.0);\n#include <encodings_fragment>\n#include <fog_fragment>\n}'});
  mat.uniforms.map.value=impTex();const m=new THREE.InstancedMesh(geo,mat,IMP.max);m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  m.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(IMP.max*3),3);m.frustumCulled=false;m.count=0;m.userData.noSeal=1;m.userData.noCull=1;m.castShadow=false;m.receiveShadow=false;scene.add(m);IMP.mesh=m;}
const _impC=new THREE.Color(),_impM=new THREE.Matrix4();
function impCol(w){if(w.col)return w.col;const c=(w.g.userData&&w.g.userData.cfg)||{};let h=c.himation||c.chiton||c.palla||c.toga&&'#e8e2d0'||'#c8b89a';if(typeof h!=='string')h='#c8b89a';try{_impC.set(h);}catch(e){_impC.set('#c8b89a');}return w.col=[_impC.r,_impC.g,_impC.b];}
function impTick(dt){if(!IMP.on||typeof walkers==='undefined')return;impInit();const m=IMP.mesh,ok=ui!=='start'&&player.x<1e6;let n=0;
  if(ok)for(const w of walkers){if(!w.imp||!w.g||n>=IMP.max)continue;if(!w.g.parent&&!(typeof CULL!=='undefined'&&CULL.idx.get(w.g)&&CULL.idx.get(w.g).out))continue;
    const p=w.g.position,s=((w.g.userData.cfg&&w.g.userData.cfg.scale)||1)*(w.g.scale.y||1),mv=w.mode!=='idle'&&w.speed>0?1:0;
    _impM.makeScale(s,mv,s);_impM.setPosition(p.x,p.y,p.z);m.setMatrixAt(n,_impM);const c=impCol(w);m.instanceColor.setXYZ(n,c[0],c[1],c[2]);n++;}
  m.count=n;m.instanceMatrix.needsUpdate=true;m.instanceColor.needsUpdate=true;m.visible=n>0;IMP.n=n;
  const U=m.material.uniforms;U.uTime.value+=dt;let k=1;try{k=clamp(0.28+(sun.intensity||0)*0.55+(typeof hemi!=='undefined'?hemi.intensity*0.25:0),0.25,1.15);}catch(e){}U.uDim.value=k;}
// ---------------------------------------------------------------- O2 animación por distancia
if(typeof bpTick==='function'){bpTick=function(dt){if(!BP.list.length)return;const cx=camera.position.x,cz=camera.position.z,R2=BP.R*BP.R;O9.bpf=(O9.bpf||0)+1;
  for(const g of BP.list){const B=g.userData.bp;if(!g.visible||!g.parent)continue;const dx=g.position.x-cx,dz=g.position.z-cz,d2=dx*dx+dz*dz;if(d2>R2)continue;if(g.children[0]&&!g.children[0].visible)continue;
    B.t+=dt;const every=d2<400?1:d2<2025?2:4;if(every>1&&(O9.bpf+(B.sl||(B.sl=1+Math.floor(Math.random()*7))))%every)continue;const a=Math.min(1,Math.max(0,B.amp));
    if(B.walk){B.walk.setEffectiveWeight(a);const d=B.walk.getClip().duration;B.walk.time=((B.ph/TAU)%1+1)%1*d;}
    if(B.idle){B.idle.setEffectiveWeight(1-a);const d=B.idle.getClip().duration;B.idle.time=B.t%d;}
    B.mix.update(0);}};}
// ---------------------------------------------------------------- O3 sellado de paredes
if(typeof seal2Cands==='function'){const f=seal2Cands;seal2Cands=function(){const C=f.apply(this,arguments);SEAL2.known=SEAL2.known||new Set();
  if((SEAL2.runs||1)>1)for(const k of[...C.keys()])if(SEAL2.known.has(k))C.delete(k);SEAL2.pend=[...C.keys()];return C;};}
function o3Tick(){if(typeof SEAL2==='undefined'||!SEAL2.done||!SEAL2.pend)return;for(const k of SEAL2.pend)SEAL2.known.add(k);SEAL2.pend=null;}
// ---------------------------------------------------------------- O4 piezas repetidas → instancias
const INST={on:true,seen:new Map(),t:0,i:0,groups:0,meshes:0,saved:0};
try{if(localStorage.getItem('nostos-noinst'))INST.on=false;}catch(e){}
const _oBC=THREE.Material.prototype.onBeforeCompile;
function instMatOk(m){if(!m||Array.isArray(m)||m.transparent||m.isShaderMaterial||m.isRawShaderMaterial||m.isSpriteMaterial||m.wireframe)return false;
  if(m.onBeforeCompile!==_oBC&&!(m.userData&&(m.userData.mfx||m.userData.tpScale)))return false;   // solo sombreadores que ya saben de instancias (036, 181)
  if(m.emissive&&(m.emissive.r+m.emissive.g+m.emissive.b)>0.02)return false;if(m.isMeshBasicMaterial)return false;return true;}
function instGeoKey(g){const p=g&&g.parameters;if(!p||g.morphAttributes&&Object.keys(g.morphAttributes).length)return null;if(!g.boundingBox)g.computeBoundingBox();const bb=g.boundingBox;if(!bb||Math.abs(bb.min.x+bb.max.x)>2e-3||Math.abs(bb.min.y+bb.max.y)>2e-3||Math.abs(bb.min.z+bb.max.z)>2e-3)return null;   // movida con translate(): no es la de los parámetros
  if((g.type==='BoxGeometry'||g.type==='BoxBufferGeometry')&&(Math.abs(bb.max.x-bb.min.x-p.width)>2e-3||Math.abs(bb.max.y-bb.min.y-p.height)>2e-3||Math.abs(bb.max.z-bb.min.z-p.depth)>2e-3))return null;
  
  if(g.type==='BoxGeometry'||g.type==='BoxBufferGeometry'){if((p.widthSegments||1)>1||(p.heightSegments||1)>1||(p.depthSegments||1)>1)return null;return 'B';}
  if(/^Cylinder/.test(g.type))return 'C'+[p.radiusTop,p.radiusBottom,p.height,p.radialSegments,p.heightSegments,p.openEnded?1:0,p.thetaStart||0,p.thetaLength||6.2832].map(v=>(+v).toFixed(3)).join(',');
  return null;}
function instMeshOk(o){if(!o.isMesh||o.isInstancedMesh||o.isSkinnedMesh||o.name||o.children.length||!o.visible||o.renderOrder||o.morphTargetInfluences)return false;for(const k in o.userData)return false;
  if(o.onBeforeRender!==THREE.Object3D.prototype.onBeforeRender)return false;return true;}
function instMovers(){const S=new Set();try{for(const F of FAUNA)if(F.A&&F.A.g)S.add(F.A.g);}catch(e){}try{for(const g of QA.act||[])S.add(g);}catch(e){}try{for(const S2 of X3.ships)S.add(S2.g);}catch(e){}try{if(MOUNT.g)S.add(MOUNT.g);}catch(e){}try{for(const w of walkers)S.add(w.g);}catch(e){}return S;}
function instGroupOk(top){if(INSG.mv&&INSG.mv.has(top))return false;if(!top.isGroup&&top.type!=='Object3D')return false;if(top===scene||top.userData.chunk||top.userData.tlod||top.userData.bp||top.userData.pj||top.userData.qa||top.userData.noInst)return false;
  for(const k in top.userData)if(k!=='_cs'&&k!=='r23sh')return false;if(typeof walkers!=='undefined'&&walkers.some&&top.userData.cfg)return false;return true;}
function instDo(top){top.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(top.matrixWorld).invert(),B=new Map();
  top.traverse(o=>{if(o===top||o.parent!==top)return;if(!instMeshOk(o))return;   // solo piezas que cuelgan directamente del grupo: las que van dentro de un pivote (patas, brazos, velas) se mueven
   const gk=instGeoKey(o.geometry);if(!gk||!instMatOk(o.material))return;
    const key=gk+'|'+o.material.uuid+'|'+(o.castShadow?1:0)+(o.receiveShadow?1:0);let L=B.get(key);if(!L)B.set(key,L=[]);L.push(o);});
  let made=0;for(const[key,L]of B){if(L.length<4)continue;instBuild(L,key[0]==='B',top);made++;}
  if(made)INST.groups++;return made;}
// piezas sueltas en la escena (más de 11.000 en Atenas): se agrupan por casillas de 120 m y por forma y material
const INSL={st:new WeakMap(),i:0,b:new Map(),made:0};
function instLooseKey(o){if(!instMeshOk(o)||!instMatOk(o.material)||o.parent!==scene)return null;const g=o.geometry;let gk=instGeoKey(g);
  if(!gk){const p=g.parameters;if(!p||!/^(Sphere|Cone|Dodecahedron|Icosahedron|Octahedron|Lathe|Circle|Ring|Torus)/.test(g.type))return null;
    if(!g.boundingBox)g.computeBoundingBox();const bb=g.boundingBox;if(!bb||!isFinite(bb.min.x))return null;gk=g.type+':'+JSON.stringify(p,(k,v)=>typeof v==='number'?+v.toFixed(3):v)+':'+[bb.min.x+bb.max.x,bb.min.y+bb.max.y,bb.min.z+bb.max.z].map(v=>v.toFixed(2)).join(',');}
  return gk+'|'+o.material.uuid+'|'+(o.castShadow?1:0)+(o.receiveShadow?1:0)+'|'+Math.floor(o.position.x/120)+','+Math.floor(o.position.z/120);}
function instLoose(){const ch=scene.children,now=performance.now();let k=0;
  for(;k<2500&&ch.length;k++){INSL.i=(INSL.i+1)%ch.length;const o=ch[INSL.i];if(!o||!o.isMesh||o.isInstancedMesh||o.userData.instNo)continue;
    const e=o.matrixWorld.elements,h=e[12]*1.3+e[13]*2.1+e[14]*3.7+e[0]+e[5]*5+e[10]*7+e[2]*11+e[8]*13+(o.visible?17:0),S=INSL.st.get(o);
    if(!S||Math.abs(S.h-h)>1e-6){INSL.st.set(o,{h,t:now});continue;}if(now-S.t<8000||S.b)continue;const key=instLooseKey(o);if(!key){o.userData.instNo=1;INSL.st.delete(o);continue;}
    S.b=1;let L=INSL.b.get(key);if(!L)INSL.b.set(key,L=[]);L.push(o);}
  for(const[key,L]of INSL.b){const A=L.filter(o=>o.parent===scene);if(A.length<6){if(A.length!==L.length)INSL.b.set(key,A);continue;}INSL.b.delete(key);instBuild(A,key[0]==='B',null);INSL.made++;}}
function instBuild(L,box,top){const o0=L[0];const geo=box?new THREE.BoxGeometry(1,1,1):o0.geometry.clone();const im=new THREE.InstancedMesh(geo,o0.material,L.length);
  im.castShadow=o0.castShadow;im.receiveShadow=o0.receiveShadow;im.userData.inst=1;const inv=top?new THREE.Matrix4().copy(top.matrixWorld).invert():null,m=new THREE.Matrix4(),S=new THREE.Matrix4(),pts=[],v=new THREE.Vector3();
  if(!box){geo.computeBoundingBox();}const gb=box?null:geo.boundingBox;
  L.forEach((o,i)=>{o.updateMatrixWorld();if(inv)m.copy(inv).multiply(o.matrixWorld);else m.copy(o.matrixWorld);if(box){const p=o.geometry.parameters;S.makeScale(p.width,p.height,p.depth);m.multiply(S);}im.setMatrixAt(i,m);
    for(const c of[[0,0,0],[1,1,1],[0,1,1],[1,0,0],[0,0,1],[1,1,0]]){if(box)v.set(c[0]-.5,c[1]-.5,c[2]-.5);else v.set(c[0]?gb.max.x:gb.min.x,c[1]?gb.max.y:gb.min.y,c[2]?gb.max.z:gb.min.z);pts.push(v.clone().applyMatrix4(m));}});
  geo.boundingSphere=new THREE.Sphere().setFromPoints(pts);geo.boundingBox=new THREE.Box3().setFromPoints(pts);
  for(const o of L){o.parent.remove(o);try{o.geometry.dispose();}catch(e){}}(top||scene).add(im);INST.meshes+=L.length;INST.saved+=L.length-1;return im;}
const INSG={list:null,i:0,scan:0};
function instTick(dt){if(!INST.on||ui==='start')return;INST.t+=dt;if(INST.t<0.5)return;INST.t=0;try{instLoose();}catch(e){console.warn('instL',e);}
  const ch=scene.children;if(!INSG.list){INSG.list=[];INSG.scan=0;}
  if(!INSG.mv||(INSG.mvT=(INSG.mvT||0)+1)%20===0)INSG.mv=instMovers();
  if(INSG.scan<ch.length){const end=Math.min(ch.length,INSG.scan+3000);for(let i=INSG.scan;i<end;i++){const top=ch[i];if(top&&!top.isMesh&&!top.userData.instDone&&instGroupOk(top))INSG.list.push(top);}INSG.scan=end;}
  else if(INSG.list.length===0){INSG.scan=0;}
  let work=0;for(let k=0;k<40&&INSG.list.length&&work<4000;k++){INSG.i=(INSG.i+1)%INSG.list.length;const top=INSG.list[INSG.i];if(!top||!top.parent||top.userData.instDone){INSG.list.splice(INSG.i,1);continue;}
    let n=0;top.traverse(o=>{if(o.isMesh)n++;});work+=n;if(n<8){top.userData.instDone=1;INSG.list.splice(INSG.i,1);continue;}
    const h=mgHash(top),S=INST.seen.get(top);if(!S||Math.abs(S.h-h)>1e-6){INST.seen.set(top,{h,t:performance.now()});continue;}
    if(performance.now()-S.t<8000)continue;INST.seen.delete(top);top.userData.instDone=1;INSG.list.splice(INSG.i,1);try{instDo(top);}catch(e){console.warn('inst',e);}}
  if(INSG.scan>=ch.length&&INSG.list.length===0&&(INST.rs=(INST.rs||0)+1)%60===0){INSG.scan=0;}}   // cada medio minuto, busca edificios nuevos
// ---------------------------------------------------------------- O5 memoria
if(typeof bpBytes==='function'){const f=bpBytes;bpBytes=async function(id){const r=await f.apply(this,arguments);try{if(r&&!/^glbpj_/.test(id)){const el=document.getElementById(id);
  if(el&&el.textContent.length>200000){const web=!!(el.dataset&&el.dataset.src);el.textContent='';if(web)delete DATO.p[id];else DATO.p[id]=Promise.resolve('');O9.freed=(O9.freed||0)+1;}}}catch(e){}return r;};}
function o5Shrink(){if(!(typeof K8!=='undefined'&&k8On()))return;const seen=new Set();let n=0;
  scene.traverse(o=>{if(!o.material)return;for(const m of(Array.isArray(o.material)?o.material:[o.material]))for(const k of['map','normalMap','roughnessMap','aoMap','emissiveMap']){const t=m[k];if(!t||seen.has(t)||t.userData.o5)continue;seen.add(t);const im=t.image;
    if(!im||t.isDataTexture||t.isVideoTexture||t.isCompressedTexture||!im.width||im.width*im.height<=1024*1024)continue;if(t.userData.o5v===undefined){t.userData.o5v=t.version;continue;}if(t.userData.o5v!==t.version){t.userData.o5v=t.version;continue;}
    try{const c=document.createElement('canvas');c.width=Math.max(1,im.width>>1);c.height=Math.max(1,im.height>>1);c.getContext('2d').drawImage(im,0,0,c.width,c.height);t.image=c;t.needsUpdate=true;t.userData.o5=1;n++;}catch(e){t.userData.o5=1;}}});
  O9.shrunk=(O9.shrunk||0)+n;}
// ---------------------------------------------------------------- O7 materiales
const O7={done:false,map:new Map(),t:0};
function o7Lambert(m){if(O7.map.has(m))return O7.map.get(m);if(!m.isMeshStandardMaterial||m.onBeforeCompile!==_oBC){O7.map.set(m,m);return m;}
  const n=new THREE.MeshLambertMaterial({color:m.color.clone(),map:m.map,emissive:m.emissive?m.emissive.clone():undefined,emissiveMap:m.emissiveMap,emissiveIntensity:m.emissiveIntensity,transparent:m.transparent,opacity:m.opacity,alphaTest:m.alphaTest,side:m.side,vertexColors:m.vertexColors,skinning:m.skinning,fog:m.fog,depthWrite:m.depthWrite});
  n.name=m.name;n.userData.o7=m;O7.map.set(m,n);return n;}
function o7Tick(dt){O7.t+=dt;if(ui!=='play')return;
  if(!O7.done&&O7.t>3){O7.done=true;try{renderer.compile(scene,camera);}catch(e){}}
  if(!(typeof K8!=='undefined'&&k8On())||O7.t<5)return;O7.t=3.01;
  scene.traverse(o=>{if(!o.isMesh||!o.material||Array.isArray(o.material))return;const n=o7Lambert(o.material);if(n!==o.material)o.material=n;});
  for(const[a,b]of O7.map)if(a!==b){b.color.copy(a.color);b.opacity=a.opacity;b.visible=a.visible;}}
// ---------------------------------------------------------------- O8 sombras
const O8={f:0};
function o8Tick(){try{if(!renderer.shadowMap.enabled){renderer.shadowMap.autoUpdate=true;return;}renderer.shadowMap.autoUpdate=false;O8.f++;if(O8.f%2===0||O8.jump)renderer.shadowMap.needsUpdate=true;
  const p=player,j=O8.lx===undefined||Math.abs(p.x-O8.lx)+Math.abs(p.z-O8.lz)>8;O8.lx=p.x;O8.lz=p.z;if(j)renderer.shadowMap.needsUpdate=true;}catch(e){}}
// ---------------------------------------------------------------- O9 reparto del trabajo
{const f=frame;let lastRun=0;frame=function(now){if(typeof K8!=='undefined'&&k8On()&&now-lastRun<1000/30-3){requestAnimationFrame(frame);return;}lastRun=now;return f.apply(this,arguments);};}
for(const n of['seasonTick','zsTick','egxTick','eduTick']){try{const f=eval(n);if(typeof f!=='function')continue;let acc=0,c=0;const w=function(dt){acc+=dt||0;if(!(typeof K8!=='undefined'&&k8On())||(++c%2)===0){const a=acc;acc=0;return f.call(this,a);}};eval(n+'=w');}catch(e){}}
// ---------------------------------------------------------------- O10 lo que tapan los muros
function o10Blocked(x0,z0,x1,z1){const dx=x1-x0,dz=z1-z0,L=Math.hypot(dx,dz);if(L<4)return false;const st=Math.ceil(L/(CELL*0.5)),seen=new Set();
  for(let s=0;s<=st;s++){const x=x0+dx*s/st,z=z0+dz*s/st,key=ck(Math.floor(x/CELL),Math.floor(z/CELL));if(seen.has(key))continue;seen.add(key);const a=cgrid.get(key);if(!a)continue;
    for(const o of a){if(!o.s)continue;const ex=o.x2-o.x1,ez=o.z2-o.z1,sl=Math.hypot(ex,ez);if(sl<4)continue;const den=dx*ez-dz*ex;if(Math.abs(den)<1e-6)continue;
      const t=((o.x1-x0)*ez-(o.z1-z0)*ex)/den,u=((o.x1-x0)*dz-(o.z1-z0)*dx)/den;if(t>0.04&&t<0.96&&u>=0&&u<=1&&t*L>1.5&&(1-t)*L>2.5)return true;}}return false;}
const O10={i:0,j:0,on:true};
function o10Tick(){if(!O10.on||typeof walkers==='undefined')return;const ground=ui==='play'&&!FLY.on&&!BOAT.on&&camera.position.y-floorAt(player.x,player.z)<3.2&&mapaTierra();
  const px=camera.position.x,pz=camera.position.z,py=player.feet||0;
  for(let k=0;k<50&&walkers.length;k++){O10.i=(O10.i+1)%walkers.length;const w=walkers[O10.i];if(!w||!w.g){continue;}if(!ground){w.occ=false;continue;}const p=w.g.position,d=Math.hypot(p.x-px,p.z-pz);
    w.occ=d>IMP.OC&&Math.abs(p.y-py)<4&&o10Blocked(px,pz,p.x,p.z);}
  if(typeof CULL==='undefined')return;const R=CULL.reg;for(let k=0;k<160&&R.length;k++){O10.j=(O10.j+1)%R.length;const e=R[O10.j];if(!e)continue;if(!ground||e.r>6){e.occ=false;continue;}
    const cx=e.cx+(e.o.position.x-e.px),cz=e.cz+(e.o.position.z-e.pz),d=Math.hypot(cx-px,cz-pz);e.occ=d>70&&o10Blocked(px,pz,cx,cz)&&Math.abs((e.o.position.y||0)-py)<5;}}
// ---------------------------------------------------------------- bucle
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start')return r;impTick(dt);o3Tick();instTick(dt);o7Tick(dt);o8Tick();
  O9.t+=dt;if(O9.t>0.25){O9.t=0;o10Tick();O9.s5=(O9.s5||0)+1;if(O9.s5%40===0)o5Shrink();}}catch(e){if(!O9.err){O9.err=1;console.warn('o9',e);}}return r;};}
