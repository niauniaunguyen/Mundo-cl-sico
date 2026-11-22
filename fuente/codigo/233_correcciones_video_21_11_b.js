// ============================================================ CORRECCIONES DEL VÍDEO DE PRUEBA (21/11), SEGUNDA PARTE: el mundo y la gente
// D1 Casas enterradas: después de aplanar el terreno para caminos, ríos y edificios, algunas casas quedaban medio dentro de una ladera
//    (o torcidas). Ahora, si una casa queda hundida más de 1,6 m por el lado de arriba, se sube (recta, encajada 0,9 m en la cuesta)
//    con un zócalo de piedra por debajo en el lado bajo, como las casas en cuesta. Si para eso hiciera falta un zócalo de más de 6 m (un tajo de camino), la
//    casa se quita, con su choque.
// D2 Cielo roto: justo encima de la cabeza, la capa de nubes se estiraba en una estrella con una raya (es donde se cierra la foto del
//    cielo). Las nubes se desvanecen cerca del cénit: arriba del todo, cielo limpio.
// D3 Capitolio (y demás colinas empinadas dentro de las ciudades): las laderas eran planos lisos con triángulos a la vista. En los
//    escarpes salen ahora paredes de roca escaneada (en Roma, la toba de la roca Tarpeya), y se quitan los árboles plantados en
//    pendientes imposibles, que parecían atravesar la colina.
// D4 Rocas: todas las rocas nuevas de los gráficos (matorral de las laderas, escarpes de la Acrópolis) son ya rocas escaneadas, no
//    poliedros; y las bocas de las cuevas se hacen con paredes de roca escaneada en vez de piedras de juguete.
// C1 Cargas: quien lleva hidria, cesta o ánfora y pasa al modelo nuevo la sigue llevando, pegada al hueso (antes, por un camino,
//    el modelo nuevo salía sin la carga).
// C2 Niños pequeños (escala 0,36-0,6) también con el modelo nuevo.
const V21B={done:{},cave:[],slopeR:null};
function v21Slope(x,z){const a=terrainH(x+2,z)-terrainH(x-2,z),b=terrainH(x,z+2)-terrainH(x,z-2);return Math.hypot(a,b)/4;}
// altura del suelo tal como se dibuja (la malla cercana tiene un vértice cada 6-7 m: entre vértices, el suelo visible es la mezcla)
function v21MeshH(x,z){try{const G=terrainInner&&terrainInner.geometry&&terrainInner.geometry.parameters;if(!G)return terrainH(x,z);const st=G.width/G.widthSegments,x0=INNER.x-G.width/2,z0=INNER.z-G.height/2;
  const fx=(x-x0)/st,fz=(z-z0)/st,i=Math.floor(fx),j=Math.floor(fz),u=fx-i,v=fz-j,H=(a,b)=>displayH(x0+a*st,z0+b*st);
  return (H(i,j)*(1-u)+H(i+1,j)*u)*(1-v)+(H(i,j+1)*(1-u)+H(i+1,j+1)*u)*v;}catch(e){return terrainH(x,z);}}
// ---- D1: casas
{const f=housesGLB;housesGLB=function(list){const n0=CHUNKS.length;const r=f.apply(this,arguments);for(let i=n0;i<CHUNKS.length;i++)CHUNKS[i].im.userData.house=1;return r;};}
function v21Houses(){if(V21B.done.house)return;V21B.done.house=1;const M=new THREE.Matrix4(),P=new THREE.Vector3(),Q=new THREE.Quaternion(),S=new THREE.Vector3(),E=new THREE.Euler(),Z=new THREE.Matrix4().makeScale(0,0,0);
  const plan=new Map();let raised=0,removed=0,straight=0;
  for(const c of CHUNKS){const im=c.im;if(!im.userData.house)continue;const g=im.geometry;if(!g.boundingBox)g.computeBoundingBox();const bb=g.boundingBox;
    for(let i=0;i<im.count;i++){im.getMatrixAt(i,M);M.decompose(P,Q,S);if(S.x===0)continue;const key=Math.round(P.x*10)+','+Math.round(P.z*10);let p=plan.get(key);
      if(!p){E.setFromQuaternion(Q,'YXZ');const yaw=E.y,tilt=Math.abs(E.x)+Math.abs(E.z)>0.02;const hw=Math.max(Math.abs(bb.min.x),Math.abs(bb.max.x))*S.x,hd=Math.max(Math.abs(bb.min.z),Math.abs(bb.max.z))*S.z;
        const ca=Math.cos(yaw),sa=Math.sin(yaw);let hi=-1e9,lo=1e9;for(const[u,v]of[[-1,-1],[1,-1],[1,1],[-1,1],[0,0],[-1,0],[1,0],[0,-1],[0,1]]){const lx=u*hw*0.92,lz=v*hd*0.92,x=P.x+lx*ca+lz*sa,z=P.z-lx*sa+lz*ca,h=terrainH(x,z),hm=v21MeshH(x,z);hi=Math.max(hi,h,hm);lo=Math.min(lo,h,hm);V21B.dist=V21B.dist||[0,0,0,0,0];const dd=Math.max(h,hm)-P.y;V21B.dist[dd<0.6?0:dd<1.6?1:dd<3?2:dd<6?3:4]++;}
        let y=P.y,act='keep';if(hi-P.y>1.6){y=hi-0.9;act='raise';}if(y-lo>6.5)act='remove';p={y,act,yaw,tilt,hw,hd,lo,x:P.x,z:P.z};plan.set(key,p);
        if(act==='raise')raised++;else if(act==='remove')removed++;if(tilt)straight++;}
      if(p.act==='remove'){im.setMatrixAt(i,Z);continue;}if(p.act==='keep'&&!p.tilt)continue;
      E.set(0,p.yaw,0);Q.setFromEuler(E);P.y=p.y;M.compose(P,Q,S);im.setMatrixAt(i,M);}
    im.instanceMatrix.needsUpdate=true;}
  // zócalos de piedra bajo las casas levantadas
  const soc=[];for(const p of plan.values()){if(p.act!=='raise'||p.y-p.lo<0.3)continue;const h=p.y-p.lo+0.4;E.set(0,p.yaw,0);Q.setFromEuler(E);S.set(p.hw*2,h,p.hd*2);M.compose(P.set(p.x,p.lo-0.4+h/2,p.z),Q,S);soc.push({m:M.clone()});}
  if(soc.length)chunked(new THREE.BoxGeometry(1,1,1),lam('#a89a82'),soc,{shadow:true,receive:true});
  // las quitadas, sin choque
  for(const p of plan.values()){if(p.act!=='remove')continue;try{const C=[[-p.hw,-p.hd],[p.hw,-p.hd],[p.hw,p.hd],[-p.hw,p.hd]].map(q=>toW(q[0],q[1],p.x,p.z,p.yaw));
      for(const[k,a]of cgrid){for(let i=a.length-1;i>=0;i--){const o=a[i];if(!o.s)continue;const near=(x,z)=>C.some(c=>Math.abs(c[0]-x)<0.6&&Math.abs(c[1]-z)<0.6);if(near(o.x1,o.z1)&&near(o.x2,o.z2))a.splice(i,1);}}
      const fi=footprints.findIndex(f=>f.house&&Math.abs(f.x-p.x)<0.2&&Math.abs(f.z-p.z)<0.2);if(fi>=0)footprints.splice(fi,1);}catch(e){}}
  V21B.houses={raised,removed,straight,zocalos:soc.length,conPatio:v21Court()};}
// las casas con patio sueltas (barrios, Pireo, destinos): se guarda lo que añaden a la escena y se comprueba igual
V21B.ch=[];
{const f=courtyardHouse;courtyardHouse=function(x,z,a,w,d){const n0=scene.children.length;const r=f.apply(this,arguments);try{const objs=scene.children.slice(n0);if(objs.length)V21B.ch.push({objs,x,z,a:a||0,w,d});}catch(e){}return r;};}
function v21Court(){let up=0;const soc=[],M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(),P=new THREE.Vector3(),E=new THREE.Euler();
  for(const h of V21B.ch){if(h.ok)continue;h.ok=1;const y0=h.objs[0].position.y;let hi=-1e9,lo=1e9;
    for(const[u,v]of[[-1,-1],[1,-1],[1,1],[-1,1],[0,0],[-1,0],[1,0],[0,-1],[0,1]]){const q=toW(u*h.w*0.46,v*h.d*0.46,h.x,h.z,h.a),t=Math.max(terrainH(q[0],q[1]),v21MeshH(q[0],q[1]));hi=Math.max(hi,t);lo=Math.min(lo,t);}
    if(!(hi-y0>1.6)||hi-lo>6.5)continue;const dy=hi-0.9-y0;for(const o of h.objs)o.position.y+=dy;up++;
    E.set(0,h.a,0);Q.setFromEuler(E);const hh=hi-0.9-lo+0.4;S.set(h.w,hh,h.d);M.compose(P.set(h.x,lo-0.4+hh/2,h.z),Q,S);soc.push({m:M.clone()});}
  if(soc.length)chunked(new THREE.BoxGeometry(1,1,1),lam('#a89a82'),soc,{shadow:true,receive:true});return up;}
// ---- D2: nubes en el cénit
function v21Sky(){if(V21B.done.sky||typeof SKY==='undefined')return;const F=SKY.fragmentShader,k='a*=smoothstep(-0.02,0.1,vp.y);';if(F.indexOf(k)<0)return;V21B.done.sky=1;
  SKY.fragmentShader=F.replace(k,k+'a*=1.0-smoothstep(0.8,0.95,vp.y);');SKY.needsUpdate=true;}
// ---- D3: escarpes dentro de las ciudades y árboles en pendientes imposibles
function v21CityCliffs(){const c=typeof g4Center==='function'?g4Center():{x:0,z:0},R=MODE==='roma'?1300:820,L=[],M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(),V=new THREE.Vector3(),E=new THREE.Euler();
  for(let x=c.x-R;x<c.x+R&&L.length<700;x+=7)for(let z=c.z-R;z<c.z+R&&L.length<700;z+=7){if(Math.hypot(x-c.x,z-c.z)>R)continue;const s=v21Slope(x,z);if(s<0.75)continue;
    const j=g4R(x,z);if(j<0.35)continue;try{if(!isFree(x,z,1.5))continue;if(g4NearRoad(x,z))continue;}catch(e){}
    const a=Math.atan2(terrainH(x+2,z)-terrainH(x-2,z),terrainH(x,z+2)-terrainH(x,z-2));E.set(0,a+Math.PI,0);Q.setFromEuler(E);const sc=4+j*5;S.set(sc,sc*1.2,sc*0.8);M.compose(V.set(x,terrainH(x,z)-sc*0.35,z),Q,S);
    L.push({m:M.clone(),c:new THREE.Color().setHSL(MODE==='roma'?0.08:0.09,MODE==='roma'?0.22:0.12,0.5+j*0.12)});}
  return L;}
function v21Trees(){if(V21B.done.trees)return;V21B.done.trees=1;const M=new THREE.Matrix4(),P=new THREE.Vector3(),Z=new THREE.Matrix4().makeScale(0,0,0);let n=0;
  for(const c of CHUNKS){const im=c.im;if(!im.userData.veg)continue;let ch=false;for(let i=0;i<im.count;i++){im.getMatrixAt(i,M);P.setFromMatrixPosition(M);if(M.elements[0]===0&&M.elements[5]===0)continue;
      if(v21Slope(P.x,P.z)>1.15){im.setMatrixAt(i,Z);ch=true;n++;}}if(ch)im.instanceMatrix.needsUpdate=true;}V21B.trees=n;}
// ---- D4: rocas escaneadas para lo nuevo (escarpes, laderas, cuevas)
function v21RockMesh(items,names,isCliff){if(!items.length||!RK.tpl)return 0;const N=names.filter(k=>RK.tpl[k]);if(!N.length)return 0;const per={};
  const M=new THREE.Matrix4(),P=new THREE.Vector3(),Q=new THREE.Quaternion(),S=new THREE.Vector3();
  items.forEach((it,i)=>{const k=N[i%N.length],T=RK.tpl[k];it.m.decompose(P,Q,S);const k2=1/(T.max||1);S.multiplyScalar(k2*(isCliff?1.6:1.4));M.compose(P,Q,S);(per[k]||(per[k]=[])).push({m:M.clone(),c:it.c});});
  for(const k in per)chunked(RK.tpl[k].g,RK.tpl[k].m,per[k],{shadow:true,receive:true});return items.length;}
function v21Rocks(){if(V21B.done.rocks)return;if(typeof RK==='undefined')return;if(!RK.tpl){try{rkLoad();}catch(e){}return;}V21B.done.rocks=1;
  const cl=(typeof G4!=='undefined'&&G4.cliffL)||[],rk=(typeof G4!=='undefined'&&G4.rockL)||[],city=v21CityCliffs();
  V21B.rocks={laderas:v21RockMesh(rk,RK_PENA.concat(RK_PIEDRA),false),escarpes:v21RockMesh(cl.concat(city),RK_CLIFF.concat(RK_PARED),true),ciudad:city.length};
  for(const d of V21B.cave)v21CaveSwap(d);}
{const f=int2Door;int2Door=function(o){const r=f.apply(this,arguments);try{if(o&&o.cave&&o.g){V21B.cave.push(o);if(V21B.done.rocks)v21CaveSwap(o);}}catch(e){}return r;};}
function v21CaveSwap(o){if(o.v21||!RK.tpl||!o.g)return;o.v21=1;const g=o.g;for(const ch of g.children.slice())if(ch.isMesh&&ch.geometry&&ch.geometry.type==='DodecahedronGeometry')g.remove(ch);
  const K=RK_PARED.concat(RK_CLIFF).filter(k=>RK.tpl[k]);if(!K.length)return;
  [[-2.6,1.3,-1.2,0.4],[2.6,1.3,-1.2,-0.4],[0,3.4,-1.4,1.57]].forEach(([x,y,z,r],i)=>{const T=RK.tpl[K[i%K.length]],m=new THREE.Mesh(T.g,T.m);const s=3.6/(T.max||1);m.scale.setScalar(s);m.position.set(x,y-1.2,z);m.rotation.set(0,Math.PI+r*0.3,i===2?r:0);m.castShadow=m.receiveShadow=true;g.add(m);});}
// ---- C1 y C2: cargas y niños
{const f=bpMake;bpMake=function(k,c){const g=f.apply(this,arguments);try{if(g&&c&&c.carry&&typeof bpProp==='function')setTimeout(()=>{try{bpProp(g,c);}catch(e){}},0);}catch(e){}return g;};}
{const f=bpKind;bpKind=function(c){if(c&&c.scale&&c.scale<0.6&&c.scale>=0.36&&!c.statue&&!c.stKind){const r=f(Object.assign({},c,{scale:0.6}));if(r)return r;}return f(c);};}
{const f=bpMake;bpMake=function(k,c){const g=f.apply(this,arguments);try{if(g&&c&&c.scale&&c.scale<0.45&&c.scale>=0.36){g.scale.multiplyScalar(c.scale/0.45);g.userData.young=1;try{BP_YOUNG.add(g);}catch(e){}}}catch(e){}return g;};}
// ---- arranque
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(state&&ui==='play'){V21B.t=(V21B.t||0)+dt;if(V21B.t>1.5){V21B.t=0;v21Sky();if(typeof G4!=='undefined'&&G4.built){v21Houses();v21Trees();v21Rocks();if(V21B.ch.some(h=>!h.ok))v21Court();}}}}catch(e){console.warn('v21b',e);}return r;};}
// ---- D3 (Roma): el Clivus Capitolinus, la cuesta del Foro al Capitolio. Chocaba con la esquina del podio del templo de Saturno y,
// pasado el templo, el suelo allanado del Foro cortaba la rampa y dejaba una pared de 14 m («medio camino, medio pared»).
// El primer tramo pasa ahora junto al podio (por el sur) y la rampa manda sobre el allanado en todo su recorrido.
try{if(typeof CLIVUS!=='undefined'&&CLIVUS[1]){CLIVUS[1][0]=-121;CLIVUS[1][1]=2;}}catch(e){}
{const f=terrainH;terrainH=function(x,z){const h=f(x,z);if(MODE!=='roma'||x>-70||x<-215||z<-10||z>45)return h;try{const c=clivusAt(x,z);if(!(c.d<9))return h;
  const hc=lerp(0.6,33.8,sstep(c.t)*0.25+c.t*0.75);return c.d<4.5?hc:lerp(hc,h,sstep((c.d-4.5)/4.5));}catch(e){return h;}};}
