// ============================================================ RENDIMIENTO: el relieve de los destinos se guarda tras la primera carga
// Medido en la carga: el relieve de los ~100 destinos (buildIslandMesh) es más de la mitad del tiempo de construir Atenas, y buena parte en Roma.
// La primera vez se calcula como siempre y se guarda (alturas y colores) en el almacén del navegador (IndexedDB), con la versión del juego en la clave.
// Las siguientes cargas reutilizan esos números: el mundo sale idéntico, pero mucho antes. Si el navegador no deja guardar, todo funciona como antes.
const ICACHE={map:null,dirty:false,db:null,hits:0,miss:0,ms:0};
function icKey(){return 'isl-'+(typeof NOSTOS_VER!=='undefined'?NOSTOS_VER:'dev')+'-'+MODE;}
function icOpen(){return new Promise(res=>{try{const r=indexedDB.open('nostos-cache',1);r.onupgradeneeded=()=>{try{r.result.createObjectStore('c');}catch(e){}};r.onsuccess=()=>res(r.result);r.onerror=()=>res(null);r.onblocked=()=>res(null);}catch(e){res(null);}});}
async function icLoad(){const db=await icOpen();if(!db){ICACHE.map={};return;}ICACHE.db=db;
  await new Promise(res=>{try{const g=db.transaction('c','readonly').objectStore('c').get(icKey());g.onsuccess=()=>{ICACHE.map=g.result||{};res();};g.onerror=()=>{ICACHE.map={};res();};}catch(e){ICACHE.map={};res();}});}
function icSave(){if(!ICACHE.dirty||!ICACHE.db)return;try{const st=ICACHE.db.transaction('c','readwrite').objectStore('c');st.clear();st.put(ICACHE.map,icKey());ICACHE.dirty=false;}catch(e){}}   // clear: solo se guarda la versión actual
{const f=buildIslandMesh;buildIslandMesh=function(I){const t0=performance.now();try{
  const S=I.R*2.9,seg=Math.round(S/(I.step||6)),c=ICACHE.map&&ICACHE.map[I.id];
  if(c&&c.seg===seg&&c.H&&c.C&&c.H.length===(seg+1)*(seg+1)){const g=new THREE.PlaneGeometry(S,S,seg,seg);g.rotateX(-Math.PI/2);const pos=g.attributes.position;
    for(let i=0;i<pos.count;i++)pos.setXYZ(i,pos.getX(i)+I.x,c.H[i],pos.getZ(i)+I.z);
    g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(c.C),3));g.computeVertexNormals();const m=new THREE.Mesh(g,terrainMat());m.receiveShadow=true;scene.add(m);I.mesh=m;gridSet(I,g,S,seg);ICACHE.hits++;return;}
  f(I);ICACHE.miss++;
  if(ICACHE.map&&I.mesh){const g=I.mesh.geometry,pos=g.attributes.position,H=new Float32Array(pos.count);for(let i=0;i<pos.count;i++)H[i]=pos.getY(i);ICACHE.map[I.id]={seg,H,C:new Float32Array(g.attributes.color.array)};ICACHE.dirty=true;}}
  finally{ICACHE.ms+=performance.now()-t0;}};}
// la carga espera (como mucho 1,5 s) a leer el almacén antes de empezar a construir, y guarda al terminar
{const f=ldRun;ldRun=function(steps,onErr,onDone){let started=false;const go=()=>{if(started)return;started=true;if(!ICACHE.map)ICACHE.map={};f(steps,onErr,function(){try{icSave();}catch(e){}return onDone&&onDone.apply(this,arguments);});};
  icLoad().then(go,go);setTimeout(go,1500);};}
addEventListener('pagehide',()=>{try{icSave();}catch(e){}});
// el terreno principal (las dos mallas, cercana y lejana) también se guarda tras la primera carga
{const f=buildTerrain;buildTerrain=function(size,seg,cx,cz,inner){const t0=performance.now();try{const k='T'+[size,seg,cx,cz,inner?1:0].join('_'),c=ICACHE.map&&ICACHE.map[k];
  if(c&&c.Y&&c.Y.length===(seg+1)*(seg+1)){if(inner)INNER.mesh=size;const g=new THREE.PlaneGeometry(size,size,seg,seg);g.rotateX(-Math.PI/2);const pos=g.attributes.position;
    for(let i=0;i<pos.count;i++)pos.setXYZ(i,pos.getX(i)+cx,c.Y[i],pos.getZ(i)+cz);g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(c.C),3));g.computeVertexNormals();
    const m=new THREE.Mesh(g,terrainMat());m.receiveShadow=inner;scene.add(m);ICACHE.hits++;return m;}
  const m=f.apply(this,arguments);ICACHE.miss++;
  if(ICACHE.map&&m&&m.geometry){const pos=m.geometry.attributes.position,Y=new Float32Array(pos.count);for(let i=0;i<pos.count;i++)Y[i]=pos.getY(i);ICACHE.map[k]={Y,C:new Float32Array(m.geometry.attributes.color.array)};ICACHE.dirty=true;}
  return m;}finally{ICACHE.ms+=performance.now()-t0;}};}
