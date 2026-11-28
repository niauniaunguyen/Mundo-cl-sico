// ============================================================ GATOS Y COMADREJAS (27/11)
// ¿Había gatos por la calle? En Atenas (386 a.C.), muy pocos: llegaron de Egipto y aún eran una rareza. La base de una estatua de
// hacia el 510 a.C. (Museo Arqueológico de Atenas) muestra a dos jóvenes que enfrentan a un perro y a un gato sujetos con correa.
// Para los ratones, las casas griegas tenían comadrejas (galê). En Roma (80 d.C.) los gatos ya eran más frecuentes: Plinio el Viejo
// describe cómo acechan a los pájaros y a los ratones (Historia natural X 202), y en Pompeya hay un mosaico de un gato con un pájaro.
// No había modelos CC0 realistas de gato (solo de muy pocos polígonos), así que el gato y la comadreja están esculpidos con código
// en herramientas/blender/criaturas.py (lote3 → modelos/criaturas3.glb → datos/glbcr3.txt): se cargan en segundo plano y sustituyen
// a las figuras sencillas de 052 (las 14 de gatos de Roma y las 8 comadrejas de Atenas), que siguen moviéndose igual.
// En Atenas se añaden solo dos gatos, raros, y quien se acerca puede leer por qué.
const GTS={tpl:null,loading:false,done:new WeakSet(),t:0,mats:new Map(),added:false};
function gtsLoad(){if(GTS.tpl||GTS.loading||typeof bpBytes!=='function')return;GTS.loading=true;
  bpBytes('glbcr3').then(buf=>{if(!buf)return;new THREE.GLTFLoader().parse(buf,'',gl=>{const T={};gl.scene.traverse(o=>{if(/^CR_/.test(o.name))T[o.name]=o;if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});gl.scene.updateMatrixWorld(true);GTS.tpl=T;},e=>console.warn('gatos',e));}).catch(e=>console.warn('gatos',e));}
function gtsPart(n){const T=GTS.tpl&&GTS.tpl[n];return T?T.clone(true):null;}
function gtsTint(o,hex){if(!hex)return;o.traverse(m=>{if(!m.isMesh)return;const k=m.material.uuid+hex;let M=GTS.mats.get(k);if(!M){M=m.material.clone();M.color=new THREE.Color(hex).lerp(new THREE.Color('#ffffff'),0.45);GTS.mats.set(k,M);}m.material=M;});}
function gtsModel(key,tint){const B=gtsPart('CR_'+key+'_cuerpo');if(!B)return null;const g=new THREE.Group();g.add(B);B.position.set(0,0,0);const legs=[];
  for(const k of['pDI','pDD','pTI','pTD']){const p=gtsPart('CR_'+key+'_'+k);if(!p)continue;const piv=new THREE.Group();piv.position.copy(p.position);p.position.set(0,0,0);piv.add(p);g.add(piv);legs.push(piv);}
  const t=gtsPart('CR_'+key+'_cola');let tail=null;if(t){tail=new THREE.Group();tail.position.copy(t.position);t.position.set(0,0,0);tail.add(t);g.add(tail);}
  gtsTint(g,tint);g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=false;}});return {g,legs,tail,body:B};}
// del gris atigrado del modelo a otras capas habituales (pardo, rojizo, casi negro, claro)
const GTS_TINT={cat:[null,'#d89a58','#5a504a','#e8dccb','#a08a70'],weasel:[null]};
function gtsUpgrade(F){if(GTS.done.has(F)||!F.A||!F.A.g)return;GTS.done.add(F);const key=F.sp==='cat'?'gato':'comadreja',L=GTS_TINT[F.sp],tint=L[Math.floor(((F.ph||0)*7)%L.length)];
  const M=gtsModel(key,tint);if(!M)return;const A=F.A,g=A.g;for(const c of g.children)c.visible=false;const s=g.scale.x||1;M.g.scale.setScalar(1/s);
  // la figura sencilla podía estar sentada o tumbada (faunaPose): la del modelo nuevo va de pie, quieta
  g.add(M.g);A.legs=M.legs;A.tail=M.tail;A.head=new THREE.Object3D();A.body=new THREE.Object3D();M.g.userData.gts=1;
  if(F.beh==='lie'){g.position.y=floorAt(g.position.x,g.position.z);F.beh='still';}if(F.beh==='sit'){F.beh='still';M.legs.forEach((l,i)=>{if(i>=2)l.rotation.x=0.25;});M.body.rotation.x=-0.06;}}
function gtsAthens(){if(GTS.added||MODE!=='atenas'||typeof faunaAdd!=='function'||typeof PLACES==='undefined')return;const P=[PLACES.find(p=>p.id==='mercado'),PLACES.find(p=>p.id==='ceramico')].filter(Boolean);if(!P.length)return;GTS.added=true;
  P.forEach((pl,i)=>{let x=pl.x+18-i*30,z=pl.z+14;try{const f=findFree(x,z,0.6);x=f[0];z=f[1];}catch(e){}faunaAdd('cat',x,z,{c:{coat:'#8a7a6a'},beh:i?'still':'wander',r:6,spd:0.8,info:'gatoA'});});}
try{if(typeof FAUNA_INFO!=='undefined'){FAUNA_INFO.gatoA={A:['Gato (aílouros)','Un gato, y es una rareza: casi nadie los tiene en Atenas. Vienen de Egipto, donde son sagrados; Heródoto cuenta que allí, cuando muere el gato de la casa, la familia se rapa las cejas en señal de duelo. Para cazar ratones, aquí se prefiere la comadreja.','Heródoto II 66-67; relieve de la base de un kurós (hacia 510 a.C.), Museo Arqueológico Nacional de Atenas']};
  if(FAUNA_INFO.cat&&!FAUNA_INFO.cat.A)FAUNA_INFO.cat.A=FAUNA_INFO.gatoA.A;}}catch(e){}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start')return r;GTS.t+=dt;if(GTS.t<1.5)return r;GTS.t=0;
  if(typeof FAUNA==='undefined'||!FAUNA.length)return r;GTS.nf=FAUNA.length;GTS.nc=FAUNA.filter(F=>F.sp==='cat'||F.sp==='weasel').length;gtsAthens();if(!FAUNA.some(F=>F.sp==='cat'||F.sp==='weasel'))return r;gtsLoad();if(!GTS.tpl)return r;
  for(const F of FAUNA)if((F.sp==='cat'||F.sp==='weasel')&&!GTS.done.has(F))gtsUpgrade(F);}catch(e){if(!GTS.err){GTS.err=1;console.warn('gts',e);}}return r;};}
GTS.all=function(){gtsAthens();gtsLoad();if(!GTS.tpl)return 0;let n=0;for(const F of FAUNA)if((F.sp==='cat'||F.sp==='weasel')&&!GTS.done.has(F)){gtsUpgrade(F);n++;}return n;};   // para las pruebas
