// ============================================================ ÁRBOLES DE POLY HAVEN (CC0) para los árboles cercanos
// Modelos escaneados de https://polyhaven.com aligerados en Blender (herramientas/blender/arboles_polyhaven.py → #glbph, en segundo plano):
//   P_olivo  ← «Island Tree 02» (tronco retorcido y hoja lanceolada): sustituye a los olivos (T_olive), y por tanto también a encinas y laureles
//   P_frondo ← «Island Tree 01» (copa ancha): sustituye a los árboles de hoja ancha (T_plane): plátanos, robles, castaños y hayas
// Poly Haven no tiene cipreses ni pinos piñoneros: esos siguen con las copas de detalle de antes (182, plantas.py).
// Cómo funciona: los árboles se siguen colocando como siempre (tronco + copa sencillos, instanciados por trozos). A los más cercanos
// (radio PHT.R, como mucho PHT.max por especie) se les esconden tronco y copa y en su sitio se dibuja el modelo de Poly Haven, estirado a la
// altura y anchura del árbol que sustituye y con su giro. Al alejarse vuelven los sencillos. En los equipos modestos no se usa.
// Las hojas son tarjetas con la foto de una hoja: el fondo negro de la textura se recorta aquí (sin canal alfa, la textura pesa menos).
const PHT={tpl:null,loading:0,ready:false,R:60,max:30,t:0,sp:{T_olive:{m:'P_olivo',leaf:'#c4cbb0',crown:[],trunk:[]},T_plane:{m:'P_frondo',leaf:'#ffffff',crown:[],trunk:[]}},err:null};
try{if(typeof isTouch!=='undefined'&&isTouch){PHT.R=35;PHT.max=14;}if(ACC.lite)PHT.R=0;}catch(e){}
// registro de las piezas que se colocan con chunked(): copas (foliage) y troncos (bark) de olivos y plátanos
{const f=chunked;chunked=function(geo,mat,items,opt){const n0=CHUNKS.length;f.apply(this,arguments);try{if(!opt||!opt.veg||!PHT.R)return;
  for(const k in PHT.sp){for(const [part,list] of[[k+'_crown','crown'],[k+'_trunk','trunk']]){const P=GLB.parts[part];if(P&&P.meshes.some(m=>m.geo===geo)){for(let i=n0;i<CHUNKS.length;i++)PHT.sp[k][list].push(CHUNKS[i].im);}}}}catch(e){PHT.err=String(e);}};}
function phtLoad(){if(PHT.loading||typeof bpBytes!=='function'||!THREE.GLTFLoader)return;PHT.loading=1;
  bpBytes('glbph').then(buf=>{PHT.dbg='bytes '+(buf&&buf.byteLength);if(!buf)return;new THREE.GLTFLoader().parse(buf,'',gl=>{const T={};gl.scene.traverse(o=>{if(o.isMesh)T[o.name]=o;});PHT.tpl=T;PHT.dbg+=' ok '+Object.keys(T).join(',');},e=>{PHT.err=String(e);});}).catch(e=>{PHT.err=String(e);});}
// medidas del árbol sencillo (tronco + copa) en su espacio de módulo
function phtBox(k){const b=new THREE.Box3();for(const nm of[k+'_trunk',k+'_crown']){const P=GLB.parts[nm];if(!P)continue;for(const m of P.meshes){m.geo.computeBoundingBox();b.union(m.geo.boundingBox);}}return b;}
function phtLeafMat(src,tint,depth){const m=depth?new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:src.map}):new THREE.MeshLambertMaterial({map:src.map,color:tint,side:THREE.DoubleSide});
  m.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n{vec4 lt=texture2D(map,vUv);if(max(max(lt.r,lt.g),lt.b)<0.1)discard;}');};m.customProgramCacheKey=()=>'phleaf'+(depth?'d':'');return m;}
function phtBuild(k){const S=PHT.sp[k],T=PHT.tpl,b=phtBox(k);if(b.isEmpty())return false;const H=b.max.y-b.min.y,W=Math.max(b.max.x-b.min.x,b.max.z-b.min.z);
  S.hi=[];for(const part of['tronco','ramas','hojas']){const o=T[S.m+'_'+part];if(!o)continue;const g=o.geometry.clone();g.computeBoundingBox();const gb=g.boundingBox;
    const wNat=Math.max(gb.max.x-gb.min.x,gb.max.z-gb.min.z)||1,sxz=H*Math.min(1.3,Math.max(0.75,W/(wNat*H)));   // de pie: los modelos de Blender vienen con Z arriba ya convertida a Y
    g.scale(sxz,H,sxz);g.translate((b.min.x+b.max.x)/2,b.min.y,(b.min.z+b.max.z)/2);g.computeBoundingSphere();
    const src=o.material;if(src.map){src.map.encoding=THREE.LinearEncoding;src.map.anisotropy=4;src.map.needsUpdate=true;}
    let mat;if(part==='hojas'){mat=phtLeafMat(src,new THREE.Color(S.leaf));try{if(typeof windMat==='function')mat=windMat(mat);}catch(e){}}else mat=new THREE.MeshLambertMaterial({map:src.map||null,color:src.map?'#ffffff':'#6b5a48'});
    const im=new THREE.InstancedMesh(g,mat,PHT.max);im.count=0;im.castShadow=true;im.receiveShadow=true;im.frustumCulled=false;if(part==='hojas'){im.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(PHT.max*3).fill(1),3);im.customDepthMaterial=phtLeafMat(src,null,true);im.userData.veg=true;}
    scene.add(im);S.hi.push(im);}
  return S.hi.length>0;}
// al tener los modelos: las copas de detalle de 182 dejan de usarse para estas dos especies (se devuelven las que tuviera cambiadas)
function phtTakeOver(){if(typeof TLOD==='undefined')return;for(const [key,S] of [...TLOD.sets]){const c=key.split('|')[0];if(c!=='T_olive_crown'&&c!=='T_plane_crown')continue;
  for(const [kk,[im,i]] of S.near){const o=im.userData.tlodOrig;if(o&&o.has(i)){im.setMatrixAt(i,o.get(i));o.delete(i);im.instanceMatrix.needsUpdate=true;}}if(S.hi){S.hi.count=0;S.hi.visible=false;}TLOD.sets.delete(key);}}
const _phM=new THREE.Matrix4(),_phZ=new THREE.Matrix4().makeScale(0,0,0),_phC=new THREE.Color(),_phW=new THREE.Color(1,1,1);
function phtPosKey(x,z){return Math.round(x*4)+','+Math.round(z*4);}
function phtTick(){if(!PHT.ready){if(!PHT.tpl){if(PHT.sp.T_olive.crown.length||PHT.sp.T_plane.crown.length)phtLoad();return;}let ok=false;for(const k in PHT.sp)if(phtBuild(k))ok=true;PHT.ready=true;PHT.ok=ok;return;}
  if(PHT.ok)phtTakeOver();
  const cx=camera.position.x,cz=camera.position.z,R2=PHT.R*PHT.R;
  for(const k in PHT.sp){const S=PHT.sp[k];if(!S.hi)continue;
    if(!S.tmap||S.tn!==S.trunk.length){S.tn=S.trunk.length;S.tmap=new Map();for(const im of S.trunk){for(let i=0;i<im.count;i++){im.getMatrixAt(i,_phM);S.tmap.set(phtPosKey(_phM.elements[12],_phM.elements[14]),[im,i]);}}}
    const cand=[];for(const im of S.crown){if(!im.parent||!im.visible)continue;const sp=im.geometry.boundingSphere;const o=im.userData.phOrig;
      const A=im.instanceMatrix.array;for(let i=0;i<im.count;i++){const e=o&&o.has(i)?o.get(i).elements:null,x=e?e[12]:A[i*16+12],z=e?e[14]:A[i*16+14];const d=(x-cx)**2+(z-cz)**2;if(d<R2)cand.push([d,im,i,x,z]);}}
    cand.sort((a,b)=>a[0]-b[0]);const want=new Map();for(const c of cand.slice(0,PHT.max))want.set(c[1].uuid+':'+c[2],c);
    S.near=S.near||new Map();
    for(const [key,c] of S.near){if(want.has(key))continue;phtRestore(c[1],c[2]);const t=S.tmap.get(phtPosKey(c[3],c[4]));if(t)phtRestore(t[0],t[1]);S.near.delete(key);}
    let n=0;for(const [key,c] of want){const im=c[1],i=c[2];const M=phtHide(im,i);const t=S.tmap.get(phtPosKey(c[3],c[4]));if(t)phtHide(t[0],t[1]);S.near.set(key,c);
      for(const h of S.hi){h.setMatrixAt(n,M);}const L=S.hi[S.hi.length-1];if(im.instanceColor&&L.material.color){im.getColorAt(i,_phC);const mx=Math.max(_phC.r,_phC.g,_phC.b,1e-3);_phC.multiplyScalar(1/mx);_phC.lerp(_phW,0.6);L.setColorAt(n,_phC);}n++;}
    for(const h of S.hi){h.count=n;h.instanceMatrix.needsUpdate=true;if(h.instanceColor)h.instanceColor.needsUpdate=true;}}}
function phtHide(im,i){let o=im.userData.phOrig;if(!o)o=im.userData.phOrig=new Map();if(!o.has(i)){im.getMatrixAt(i,_phM);o.set(i,_phM.clone());im.setMatrixAt(i,_phZ);im.instanceMatrix.needsUpdate=true;}return o.get(i);}
function phtRestore(im,i){const o=im.userData.phOrig;if(o&&o.has(i)){im.setMatrixAt(i,o.get(i));o.delete(i);im.instanceMatrix.needsUpdate=true;}}
{const f=uxTick;uxTick=function(dt){f(dt);if(!PHT.R||!state||ui==='start')return;const now=performance.now();if(now-PHT.t<500)return;PHT.t=now;try{phtTick();}catch(e){if(!PHT.err){PHT.err=String(e&&e.stack||e).slice(0,300);console.warn('árboles PH',e);}}};}
