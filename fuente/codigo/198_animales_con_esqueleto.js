// ============================================================ ANIMALES CON ESQUELETO (Quaternius, CC0)
// Los caballos, burros, bueyes, toros, perros, ciervos, lobos y zorros de animales.blend son figuras por piezas (cuerpo, cabeza y patas
// sueltas que se mueven por código). De cerca se cambian por los del pack «Ultimate Animated Animals» de Quaternius (CC0, dominio público;
// ver herramientas/blender/animales_quaternius.py): una sola malla con esqueleto y animaciones de verdad (andar, galope, quieto, comer).
// Perros: el moloso, el laconio, el cretense, el umbro y el maltés (meliteo) salen del mismo perro con la malla deformada por zonas y
// otros colores (animales_quaternius.py, BREEDS); comparten sus animaciones.
// Funciona sobre cualquier grupo que represente un animal: lo que crean animalGLB (caballos y burros), makeBeast (vacas, toros, lobos,
// caballos de los sueños) y animal() (la fauna de calles, casas y bosques). Las piezas siguen ahí (de lejos, o si el archivo no ha llegado).
// La animación sale de la velocidad del grupo en el mundo: quieto, al paso o al galope, y a veces pace cuando está quieto.
const QA={tpl:null,loading:0,hosts:[],act:[],N:22,R:70,SP:{horse:'horse',donkey:'donkey',dog:'dog',moloss:'moloss',laconian:'laconian',cretan:'cretan',melitan:'melitan',umbrian:'umbrian',deer:'deer',stag:'stag',wolf:'wolf',fox:'fox',vaca:'cow',toro:'bull',lobo:'wolf',caballo:'horse',cow:'cow',bull:'bull',ox:'bull'},
  SC:{moloss:1.25,laconian:1.0,cretan:0.9,melitan:0.45,umbrian:0.95}};
try{if(ACC.lite){QA.N=8;QA.R=40;}else if(typeof isTouch!=='undefined'&&isTouch){QA.N=12;QA.R=50;}}catch(e){}
function qaLoad(){if(QA.loading||typeof bpBytes!=='function'||!THREE.GLTFLoader)return;QA.loading=1;
  bpBytes('glbqa').then(buf=>{if(!buf)return;new THREE.GLTFLoader().parse(buf,'',gl=>{const T={};
    for(const o of gl.scene.children){const m=/^Q_([a-z]+)$/.exec(o.name);if(m){o.position.set(0,0,0);T[m[1]]={scene:o,anims:gl.animations.filter(a=>a.name.startsWith(m[1]+'|'))};}}
    // las razas de perro comparten esqueleto y animaciones con el perro; el cargador da nombres únicos a los huesos repetidos
    // (Body_8 en el perro, Body_5 en el moloso…), así que cada pista se pasa al hueso de la raza con el mismo nombre de base
    const base=n=>n.replace(/_\d+$/,''),bones=o=>{const M={};o.traverse(x=>{if(x.isBone)M[base(x.name)]=x.name;});return M;};
    if(T.dog){const DB=bones(T.dog.scene);for(const k in T){if(T[k].anims.length)continue;const BB=bones(T[k].scene),ren={};for(const b in DB)if(BB[b])ren[DB[b]]=BB[b];
      T[k].anims=T.dog.anims.map(c=>{const n=c.clone();n.name=k+'|'+c.name.split('|')[1];for(const t of n.tracks){const i=t.name.lastIndexOf('.'),nd=t.name.slice(0,i);if(ren[nd])t.name=ren[nd]+t.name.slice(i);}return n;});}}
    QA.tpl=T;},e=>console.warn('animales',e));}).catch(e=>console.warn('animales',e));}
// un grupo de animal: se apunta para cambiarlo de cerca
function qaHost(g,sp,o){try{const q=QA.SP[sp];if(!g||!q||g.userData.qa)return;g.userData.qa={q,sp,s:(o&&o.s)||QA.SC[sp]||1,tint:o&&o.tint,last:null,v:0,old:[...g.children]};QA.hosts.push(g);}catch(e){}}
{const f=animalGLB;animalGLB=function(prefix,g,coat,mane){const r=f.apply(this,arguments);qaHost(g,String(prefix).replace(/^A_/,''),{tint:coat});return r;};}
{const f=makeBeast;makeBeast=function(kind,parent,x,z,r){const b=f.apply(this,arguments);if(kind!=='caballo')qaHost(b,kind);return b;};}
{const f=animal;animal=function(sp,o){const A=f.apply(this,arguments);try{qaHost(A.g,(o&&o.model)||sp,{});}catch(e){}return A;};}
function qaMake(g){const H=g.userData.qa,T=QA.tpl&&QA.tpl[H.q];if(!T)return null;const root=bpClone(T.scene);
  // la caja de una malla con esqueleto no sigue a los huesos: three la daría por fuera de la vista; y el material, como el resto del juego
  root.traverse(o=>{if(!o.isMesh)return;o.frustumCulled=false;o.castShadow=true;const m=o.material,k='qa'+m.uuid;if(!QA.mats)QA.mats=new Map();
    if(!QA.mats.has(k))QA.mats.set(k,new THREE.MeshLambertMaterial({color:m.color,skinning:true}));o.material=QA.mats.get(k);});
  const ws=new THREE.Vector3();g.getWorldScale(ws);root.scale.multiplyScalar(H.s/(ws.x||1));   // tamaño real, sea cual sea la escala de la figura por piezas
  const mix=new THREE.AnimationMixer(root),A={};for(const a of T.anims){const k=a.name.split('|')[1];A[k]=mix.clipAction(a);A[k].play();A[k].setEffectiveWeight(0);}
  if(A.Idle)A.Idle.setEffectiveWeight(1);root.userData.qaMix={mix,A,t:Math.random()*5,eat:0};g.add(root);return root;}
function qaSetOld(g,vis){for(const c of g.userData.qa.old)c.visible=vis;}   // solo las piezas que tenía al crearse (no el jinete ni la carga que se le pongan después)
let _qaT=1;
function qaTick(dt){if(!QA.hosts.length)return;if(!QA.tpl){qaLoad();return;}_qaT+=dt;const cx=camera.position.x,cz=camera.position.z,v=new THREE.Vector3();
  if(_qaT>0.5){_qaT=0;   // quién está cerca: los N más cercanos a menos de R
    for(let i=QA.hosts.length-1;i>=0;i--){const g=QA.hosts[i];let r=g;while(r.parent)r=r.parent;if(r!==scene&&!g.userData.qaKeepOff){if(!g.parent){QA.hosts.splice(i,1);continue;}}}
    const L=[];for(const g of QA.hosts){if(!g.visible)continue;let r=g,ok=true;while(r.parent){if(!r.visible){ok=false;break;}r=r.parent;}if(!ok||r!==scene)continue;g.getWorldPosition(v);const d=(v.x-cx)**2+(v.z-cz)**2;if(d<QA.R*QA.R)L.push([d,g]);}
    L.sort((a,b)=>a[0]-b[0]);const on=new Set(L.slice(0,QA.N).map(x=>x[1]));
    for(const g of QA.hosts){const want=on.has(g);let root=g.userData.qaRoot;
      if(want&&!root){root=qaMake(g);if(!root)continue;g.userData.qaRoot=root;root.visible=false;}
      if(root&&root.visible!==want){root.visible=want;qaSetOld(g,!want);}}
    QA.act=[...on];}
  for(const g of QA.act){const root=g.userData.qaRoot;if(!root||!root.visible)continue;const H=g.userData.qa,M=root.userData.qaMix;g.getWorldPosition(v);
    if(H.last){const sp=Math.hypot(v.x-H.last.x,v.z-H.last.z)/Math.max(dt,1e-3);H.v+=(sp-H.v)*Math.min(1,dt*5);}H.last=H.last||new THREE.Vector3();H.last.copy(v);
    const s=H.v,run=H.q==='horse'||H.q==='donkey'?4.5:3,wW=s<0.15?0:s<run?1:Math.max(0,1-(s-run)/1.5),gW=s<run?0:Math.min(1,(s-run)/1.5);
    M.t+=dt;if(s<0.15){if(M.eat<=0&&Math.random()<dt*0.05)M.eat=4+Math.random()*6;}else M.eat=0;if(M.eat>0)M.eat-=dt;
    const eW=M.eat>0&&s<0.15?1:0,iW=Math.max(0,1-wW-gW-eW);const A=M.A;
    if(A.Walk){A.Walk.setEffectiveWeight(wW);A.Walk.timeScale=Math.max(0.4,Math.min(1.8,s/1.3));}if(A.Gallop){A.Gallop.setEffectiveWeight(gW);A.Gallop.timeScale=Math.max(0.6,Math.min(1.6,s/6));}
    if(A.Eating)A.Eating.setEffectiveWeight(eW);if(A.Idle)A.Idle.setEffectiveWeight(iW);
    M.mix.update(dt);}}
{const f=uxTick;uxTick=function(dt){f(dt);try{qaTick(dt);}catch(e){if(!QA.err){QA.err=String(e&&e.stack||e).slice(0,400);console.warn('animales',e);}}};}
