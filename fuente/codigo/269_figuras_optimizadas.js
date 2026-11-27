// ============================================================ FIGURAS DE BLENDER OPTIMIZADAS (27/11)
// Optimizar desde los buenos modelos, no cambiarlos por otros peores:
//  · cada figura de Blender en UNA malla y UN material (herramientas/blender/personajes_unir.py → personaje_<tipo>_uno.glb): antes,
//    21 mallas y 10 materiales, unas 20 llamadas de dibujo por persona; ahora, 1. Las mismas texturas, juntas en un atlas, y las
//    mismas 11 animaciones. El color de la ropa de cada persona se pone en el sombreador (el canal rojo del color de los vértices dice
//    qué pieza se tiñe: 0,5 himation/palla, 1 quitón/túnica), como hacía bpTint con los materiales separados.
//  · nivel de detalle: a más de BP1.near metros, la versión aligerada en Blender (≈3.200 triángulos en vez de ≈14.000), con el mismo
//    esqueleto; de cerca, la completa. Solo las cercanas proyectan sombra.
//  · como cuestan mucho menos, muchas más personas llevan la figura de Blender (BP.K y BP.VR más altos); la figura por piezas queda
//    solo para quien no tiene modelo (y de reserva si algo no carga).
// Las figuras de las leyendas (249, 251) y las estatuas (186) siguen con las piezas separadas: esconden o cambian piezas sueltas.
const BP1={tpl:{},low:{},loading:false,done:0,near:28,on:0,mats:new Map(),conv:0};
try{if(typeof ACC!=='undefined'&&ACC.lite)BP1.near=18;}catch(e){}
function bp1Mesh(root){let m=null;root.traverse(o=>{if(!m&&o.isSkinnedMesh)m=o;});return m;}
function bp1Load(){if(BP1.loading||typeof BP_MODE==='undefined'||typeof bpBytes!=='function')return;BP1.loading=true;const L=BP_MODE[MODE]||[];
  for(const k of L){bpBytes('glbpj_'+k+'_uno').then(buf=>{if(!buf)return;new THREE.GLTFLoader().parse(buf,'',gl=>{const m=bp1Mesh(gl.scene);if(!m)return;
      const map=m.material.map;if(map){map.encoding=THREE.sRGBEncoding||map.encoding;}m.userData.atlas=map;m.castShadow=true;m.frustumCulled=false;BP1.tpl[k]={scene:gl.scene,anims:gl.animations};BP1.done++;},e=>console.warn('bp1',k,e));}).catch(e=>console.warn('bp1',k,e));
    bpBytes('glbpj_'+k+'_unob').then(buf=>{if(!buf)return;new THREE.GLTFLoader().parse(buf,'',gl=>{const m=bp1Mesh(gl.scene);if(m)BP1.low[k]=m.geometry;},()=>{});}).catch(()=>{});}}
// material por persona: el atlas, y el color de su ropa en dos uniformes
function bp1Mat(kind,c){const T=BP1.tpl[kind],m0=bp1Mesh(T.scene),map=m0.userData.atlas;c=c||{};
  const hA=(c.himation||c.veil)?(typeof c.veil==='string'?c.veil:c.himation):null,hB=c.chiton||null,key=kind+'|'+hA+'|'+hB;if(BP1.mats.has(key))return BP1.mats.get(key);
  const A=hA?new THREE.Color(hA).multiplyScalar(1.25):new THREE.Color(1,1,1),B=hB?new THREE.Color(hB).multiplyScalar(1.08):new THREE.Color(1,1,1);
  const m=new THREE.MeshLambertMaterial({map,skinning:true,vertexColors:true});m.userData.uA={value:A};m.userData.uB={value:B};
  m.onBeforeCompile=sh=>{sh.uniforms.uA=m.userData.uA;sh.uniforms.uB=m.userData.uB;sh.fragmentShader='uniform vec3 uA;uniform vec3 uB;\n'+sh.fragmentShader.replace('#include <color_fragment>',
    '{float tid=vColor.r;vec3 tn=tid>0.75?uB:(tid>0.25?uA:vec3(1.0));diffuseColor.rgb*=tn;}');};
  m.customProgramCacheKey=()=>'bp1';BP1.mats.set(key,m);return m;}
function bp1Make(kind,c){const T=BP1.tpl[kind];if(!T)return null;const root=bpClone(T.scene),me=bp1Mesh(root);if(!me)return null;me.material=bp1Mat(kind,c);me.castShadow=true;me.frustumCulled=false;
  const g=new THREE.Group();g.add(root);const mix=new THREE.AnimationMixer(root),find=s=>T.anims.find(a=>a.name.endsWith(s));
  const wa=find('andar'),ia=find('quieto'),walk=wa?mix.clipAction(wa):null,idle=ia?mix.clipAction(ia):null;if(walk){walk.play();walk.setEffectiveWeight(0);}if(idle){idle.play();idle.setEffectiveWeight(1);}
  g.userData.bp={mix,walk,idle,ph:0,amp:0,t:Math.random()*3,kind};g.userData.pj=kind;g.userData.arms=[new THREE.Object3D(),new THREE.Object3D()];g.userData.bp1={me,full:me.geometry,low:false};mix.update(0.01);return g;}
// quién usa la figura en una malla: los paseantes (bpSwap, bpPatrol) y las escenas (268); el resto, la de piezas
{const f=bpMake;bpMake=function(kind,c){if(BP1.on&&BP1.tpl[kind]){const g=bp1Make(kind,c);if(g)return g;}return f.apply(this,arguments);};}
for(const n of['bpSwap','bpPatrol','bpfMake']){try{const f=eval(n);if(typeof f!=='function')continue;const w=function(){BP1.on++;try{return f.apply(this,arguments);}finally{BP1.on--;}};eval(n+'=w');}catch(e){}}
// los paseantes que ya tenían la figura de piezas pasan a la de una malla (poco a poco, para no dar tirones)
function bp1Convert(max){let n=0;for(const g of BP.list){if(n>=max)break;const B=g.userData.bp;if(!B||g.userData.bp1||!BP1.tpl[B.kind]||g.userData.noBlender||g.userData.statue)continue;
  const nu=bp1Make(B.kind,g.userData.cfg||{});if(!nu)continue;const old=g.children[0],root=nu.children[0];root.visible=old.visible;g.remove(old);g.add(root);g.children.splice(g.children.indexOf(root),1);g.children.unshift(root);
  const NB=nu.userData.bp;NB.ph=B.ph;NB.amp=B.amp;g.userData.bp=NB;g.userData.bp1=nu.userData.bp1;n++;BP1.conv++;}return n;}
// nivel de detalle: geometría completa de cerca, aligerada de lejos; sombra solo de cerca
function bp1Lod(){const cx=camera.position.x,cz=camera.position.z,N2=BP1.near*BP1.near,lists=[BP.list,(typeof BPF!=='undefined'?BPF.list:[])];
  for(const L of lists)for(const g of L){const U=g.userData.bp1;if(!U||!g.parent)continue;const p=g.getWorldPosition?g.position:null;if(!p)continue;let wx=p.x,wz=p.z;if(g.parent!==scene){const v=new THREE.Vector3();g.getWorldPosition(v);wx=v.x;wz=v.z;}
    const far=(wx-cx)**2+(wz-cz)**2>N2,lowG=BP1.low[g.userData.bp.kind];if(!lowG)continue;if(far!==U.low){U.low=far;U.me.geometry=far?lowG:U.full;U.me.castShadow=!far;}}}
// más figuras de Blender, ahora que cuestan una llamada de dibujo cada una
function bp1Budget(){const lite=typeof ACC!=='undefined'&&ACC.lite,touch=typeof isTouch!=='undefined'&&isTouch;const K=lite?30:touch?55:110,VR=lite?45:touch?60:75;
  BP.K=K;BP.VR=VR;try{if(typeof AQ!=='undefined'&&AQ.base){AQ.base.bpK=K;AQ.base.bpVR=VR;}}catch(e){}try{if(typeof IMP!=='undefined')IMP.D=Math.max(IMP.D,VR-5);}catch(e){}BP1.budget=1;}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start')return r;if(typeof BP!=='undefined'&&BP.ready)bp1Load();
  BP1.t=(BP1.t||0)+dt;if(BP1.t>0.35){BP1.t=0;if(Object.keys(BP1.tpl).length){if(!BP1.budget)bp1Budget();bp1Convert(6);}bp1Lod();}}catch(e){if(!BP1.err){BP1.err=1;console.warn('bp1',e);}}return r;};}
