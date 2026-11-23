// ============================================================ CRIATURAS DE LOS PORTALES, HECHAS EN BLENDER (23/11)
// «Modela todas las criaturas de los trabajos de Heracles en sus portales, en Blender, con mucho más realismo y detalle».
// Esculpidas con código en herramientas/blender/criaturas.py (→ modelos/criaturas.glb → datos/glbcr.txt, en segundo plano):
//  · el león de Nemea: tronco, cabeza y melena en una pieza; las cuatro patas y la cola, aparte, giran sobre el hombro y la cadera;
//  · las aves del Estínfalo: zancudas de bronce del tamaño de una grulla (Pausanias VIII 22,4), con las alas aparte para batir;
//  · el Minotauro: cuerpo humano de Blender (el del trabajador) con cabeza de toro, cuernos en lira, unida al hueso del cuello.
// La Hidra ya era de Blender (hidra.py). Caco es un gigante humano y ya usa el cuerpo de Blender del juego.
// Mientras el modelo no llega (o en un equipo que no lo carga), se ven las figuras de antes.
const CRB={tpl:null,loading:false,err:null};
function crbLoad(){if(CRB.loading||CRB.tpl||typeof bpBytes!=='function'||!THREE.GLTFLoader)return;CRB.loading=true;
  bpBytes('glbcr').then(buf=>{CRB.bytes=buf?buf.byteLength:0;if(!buf)return;new THREE.GLTFLoader().parse(buf,'',gl=>{const T={};gl.scene.traverse(o=>{if(/^CR_/.test(o.name))T[o.name]=o;});
    gl.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;const m=o.material;if(m&&m.name==='ave_bronce'){m.metalness=0.55;m.roughness=0.45;}}});CRB.tpl=T;},e=>{CRB.err=String(e);});}).catch(e=>{CRB.err=String(e);});}
function crbPart(n){const T=CRB.tpl&&CRB.tpl[n];return T?T.clone(true):null;}
// ---- el león: {g, legs, body}, como el de antes (210). body es un objeto «de mentira» cuya altura (1 normal, 0,78 agazapado) se pasa
// al cuerpo de verdad con menos recorrido, para que las patas no se hundan
function crbLion(R){const B=crbPart('CR_leon_cuerpo');if(!B)return null;const g=new THREE.Group(),real=new THREE.Group();g.add(real);
  real.add(B);B.position.set(0,0,0);const legs=[];
  for(const k of['pDI','pDD','pTI','pTD']){const p=crbPart('CR_leon_'+k);if(!p)continue;const piv=new THREE.Group();piv.position.copy(p.position);p.position.set(0,0,0);piv.add(p);real.add(piv);legs.push(piv);}
  const t=crbPart('CR_leon_cola');let tail=null;if(t){tail=new THREE.Group();tail.position.copy(t.position);t.position.set(0,0,0);tail.add(t);real.add(tail);}
  const S=1.1;g.scale.setScalar(S);   // algo más grande que un león de verdad: el del mito
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});R.g.add(g);return {g,legs,body:new THREE.Object3D(),real,tail,cr:true};}
{const f=LEG.leon.reset;LEG.leon.reset=function(R){try{if(CRB.tpl&&this.lion&&!this.lion.cr){R.g.remove(this.lion.g);this.lion=null;}if(CRB.tpl&&!this.lion){const L2=crbLion(R);if(L2){L2.body.position.y=1;this.lion=L2;}}}catch(e){CRB.err=String(e);}return f.apply(this,arguments);};}
{const f=LEG.leon.tick;LEG.leon.tick=function(dt,t,act){const r=f.apply(this,arguments);try{const L2=this.lion;if(L2&&L2.cr){const y=L2.body.position.y;L2.real.position.y=(y-1)*0.45;
    if(L2.tail)L2.tail.rotation.set(-0.2+Math.sin(t*2.2)*0.15,Math.sin(t*1.3)*0.35,0);}}catch(e){}return r;};}
// ---- las aves del Estínfalo
{const f=LEG.aves.add;LEG.aves.add=function(R){const r=f.apply(this,arguments);try{if(!CRB.tpl)return r;const b=this.birds[this.birds.length-1];crbBird(b);}catch(e){CRB.err=String(e);}return r;};}
function crbBird(b){if(!b||b.cr)return;const B=crbPart('CR_ave_cuerpo');if(!B)return;for(const c of b.g.children)c.visible=false;const m=new THREE.Group();m.add(B);B.position.set(0,0,0);
  const W=[];for(const k of['aI','aD']){const p=crbPart('CR_ave_'+k);if(!p)continue;const piv=new THREE.Group();piv.position.copy(p.position);p.position.set(0,0,0);piv.add(p);m.add(piv);W.push(piv);}
  m.scale.setScalar(1.25);b.g.add(m);if(W.length===2){b.wings[0]=W[0];b.wings[1]=W[1];}b.cr=true;}
// si las aves ya estaban creadas cuando llegó el modelo
{const f=LEG.aves.tick;LEG.aves.tick=function(dt,t,act){try{if(CRB.tpl&&this.birds)for(const b of this.birds)if(!b.cr)crbBird(b);}catch(e){}return f.apply(this,arguments);};}
// ---- el Minotauro: cuerpo humano de Blender y cabeza de toro
function crbMino(R){const H=crbPart('CR_mino_cabeza');if(!H||typeof bpMake!=='function'||!BP.tpl||!BP.tpl.obrero)return null;
  const g=bpMake('obrero',{chiton:'#3a2a20'});if(!g)return null;g.userData.noBlender=1;g.scale.setScalar(1.3);const root=g.children[0];
  root.traverse(o=>{if(o.isMesh&&/cabeza|pelo|barba|ojos|pilos/.test(o.name))o.visible=false;});
  let neck=null,head=null;root.traverse(o=>{if(o.isBone&&o.name==='neck')neck=o;if(o.isBone&&o.name==='head')head=o;});R.g.add(g);g.updateMatrixWorld(true);
  const bone=head||neck;if(bone){const wp=new THREE.Vector3();(neck||bone).getWorldPosition(wp);g.worldToLocal(wp);H.position.copy(wp);H.position.y-=0.02;H.scale.setScalar(0.78);g.add(H);g.updateMatrixWorld(true);bone.attach(H);}
  else{H.position.set(0,1.5,0);g.add(H);}
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});g.userData.arms=null;return {g,legs:[],body:new THREE.Object3D(),cr:true,head:H,bp:g.userData.bp};}
{const M=LEG.minotauro;if(M){const f=M.reset;M.reset=function(R){try{if(CRB.tpl&&this.lion&&!this.lion.cr){R.g.remove(this.lion.g);this.lion=null;this.head=null;}
    if(CRB.tpl&&!this.lion){const L2=crbMino(R);if(L2){this.lion=L2;this.head=new THREE.Object3D();}}}catch(e){CRB.err=String(e);}return f.apply(this,arguments);};
  const t0=M.tick;M.tick=function(dt,t,act){const r=t0.apply(this,arguments);try{const L2=this.lion;if(L2&&L2.cr&&L2.bp){const B=L2.bp,mv=this.st==='embiste'?1:this.st==='acecha'?0.6:0;
      if(B.walk){B.walk.setEffectiveWeight(mv);B.walk.timeScale=this.st==='embiste'?2.2:1;}if(B.idle)B.idle.setEffectiveWeight(1-mv);B.mix.update(dt);
      L2.g.rotation.x=this.st==='agazapa'?0.18:this.st==='embiste'?0.12:0;}}catch(e){}return r;};}}
// cargar el modelo al entrar en un portal de leyenda (y, si no, un rato después de empezar)
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!CRB.tpl&&!CRB.loading&&state&&ui!=='start'){CRB.t=(CRB.t||0)+dt;if(CRB.t>30||(typeof legIn==='function'&&legIn()))crbLoad();}}catch(e){}return r;};}
