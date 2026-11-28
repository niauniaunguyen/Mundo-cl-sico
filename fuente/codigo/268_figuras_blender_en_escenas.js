// ============================================================ FIGURAS DE BLENDER EN LAS ESCENAS (27/11)
// Las personas de las escenas de la ciudad (267), de las parejas de repaso (262, 266) y de las actividades (260) eran figuras sencillas
// por piezas. Ahora son las figuras de Blender (184), con sus animaciones: quieto, hablar, sentado, agachado, coger, empujar, andar,
// correr, antorcha, bailar, solemne. Cada una toca la que corresponde a su escena. Si el modelo aún no ha cargado, se usa la sencilla.
// Los niños son la figura de trabajador a escala 0,62 (no hay modelo infantil todavía).
const BPF={list:[],t:0,n:0};
function bpfKind(c){c=c||{};const ro=MODE==='roma';if(c.female)return ro?'romana':'mujer';if(c.spear||c.helmet||c.soldier)return ro?'legionario':'hoplita';
  if(c.toga)return'togado';if(c.short||c.noHimation||c.exomis||(c.scale&&c.scale<0.8))return ro?'tunicado':'obrero';return ro?'togado':'ciudadano';}
function bpfMake(c,clip,speed){if(typeof bpMake!=='function'||typeof BP==='undefined'||!BP.tpl)return null;const k=bpfKind(c);if(!BP.tpl[k])return null;
  let g=null;try{g=bpMake(k,c);}catch(e){return null;}if(!g)return null;const B=g.userData.bp;g.userData.bpf={B,kind:k,cur:null};g.userData.noBlender=1;
  if(c&&c.scale)g.scale.setScalar(c.scale);g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.frustumCulled=false;}});
  bpfClip(g,clip||'quieto',speed);BPF.list.push(g);return g;}
function bpfClip(g,clip,speed){const F=g&&g.userData.bpf;if(!F)return;const T=BP.tpl[F.kind],B=F.B;if(!T)return;const a=T.anims.find(x=>x.name.endsWith('_'+clip))||T.anims.find(x=>x.name.endsWith('_quieto'));if(!a)return;
  if(F.cur&&F.cur.getClip()===a){F.cur.timeScale=speed||1;return;}
  if(B.walk)B.walk.setEffectiveWeight(0);if(B.idle)B.idle.setEffectiveWeight(0);if(F.cur)F.cur.stop();
  const act=B.mix.clipAction(a);act.reset();act.setEffectiveWeight(1);act.timeScale=speed||1;act.time=Math.random()*a.duration;act.play();F.cur=act;B.mix.update(0.01);}
function bpfHand(g,mesh,bone){let h=null;g.traverse(o=>{if(!h&&o.isBone&&o.name===(bone||'hand.R'))h=o;});if(h){h.add(mesh);return true;}return false;}
// la figura: de Blender si se puede; si no, la sencilla de antes
function vcFig(c,clip,speed){const g=bpfMake(c,clip,speed);return g||makePerson(Object.assign({},c));}
// ---------------------------------------------------------------- escenas (267): la misma vcP, con figura de Blender y animación
{const f=vcP;vcP=function(cfg,x,z,ry,pose,seat){const clip=pose==='sit'||pose==='ground'?'sentado':pose==='kneel'?'agachado':'quieto';const g=bpfMake(cfg,clip);
  if(!g)return f.apply(this,arguments);g.position.set(x,floorAt(x,z),z);g.rotation.y=ry||0;g.userData.vc=1;scene.add(g);return g;};}
// animaciones propias de cada escena, que se ponen después de construirla
const bpfP=L=>L.o.filter(o=>o.userData&&o.userData.bpf);
const BPF_SCENE={alfarero:L=>{const P=bpfP(L);if(P[1])bpfClip(P[1],'empujar');},herrero:L=>{const m=bpfP(L)[0];if(!m)return;bpfClip(m,'coger',1.4);const h=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.06,0.32),lam('#444'));h.position.set(0,0.08,0.12);bpfHand(m,h);},batanero:L=>{const m=L.o.find(o=>o.userData&&o.userData.bpf);bpfClip(m,'andar',0.6);},
  barberia:L=>{const P=L.o.filter(o=>o.userData&&o.userData.bpf);if(P[1])bpfClip(P[1],'coger',0.7);if(P[2])bpfClip(P[2],'hablar');if(P[3])bpfClip(P[3],'hablar',0.8);},
  escriba:L=>{const P=L.o.filter(o=>o.userData&&o.userData.bpf);if(P[1])bpfClip(P[1],'hablar');},
  puerto:L=>{const P=L.o.filter(o=>o.userData&&o.userData.bpf);P.slice(0,3).forEach(p=>bpfClip(p,'andar'));},
  patio:L=>{const p=L.o.find(o=>o.userData&&o.userData.bpf);if(!p)return;if(L.S.v===1)bpfClip(p,'coger',0.6);else if(L.S.v===0){bpfClip(p,'hablar',0.5);const st=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.8,5),lam('#6a4a30'));st.position.set(0,0.1,0);bpfHand(p,st,'hand.L');}},
  ninos:L=>{const P=L.o.filter(o=>o.userData&&o.userData.bpf);if(L.S.v===1)P.forEach(p=>bpfClip(p,'correr'));else if(L.S.v===2)P.forEach(p=>bpfClip(p,'coger',1.3));},
  fuente:L=>{const P=L.o.filter(o=>o.userData&&o.userData.bpf);if(P[0])bpfClip(P[0],'coger',0.5);if(P[2])bpfClip(P[2],'hablar');}};
{const f=vcBuild;vcBuild=function(S){const A=f.apply(this,arguments);try{A.S=S;const fn=BPF_SCENE[S.kind];if(fn)fn(A);}catch(e){}return A;};}
// pedagogo y boda: andan (los portadores de antorcha, con la animación de antorcha y la llama en la mano)
{const f=vcPedagogo;vcPedagogo=function(){const had=!!VC.ped;f.apply(this,arguments);if(VC.ped&&!had){bpfClip(VC.ped.ad,'andar');bpfClip(VC.ped.ch,'andar',1.3);}};}
{const f=vcEvents;vcEvents=function(){const had=!!VC.wed;f.apply(this,arguments);if(VC.wed&&!had){VC.wed.g.forEach((p,k)=>{if(k===0||k===6){bpfClip(p,'antorcha');const t=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.03,0.7,6),lam('#5a3e26'));t.position.set(0,0.05,0.25);t.rotation.x=1.2;bpfHand(p,t);}else bpfClip(p,k===2?'solemne':'andar');});}};}
// ---------------------------------------------------------------- parejas de repaso (262, 266) y actividades (260)
// En lugar de makePerson, vcFig: se cambian las figuras ya colocadas por las de Blender cuando el modelo está listo.
function bpfSwapGroup(par,old,clip){if(!old||!old.parent||old.userData.bpf)return old;const c=old.userData.cfg||{};const n=bpfMake(c,clip);if(!n)return old;n.position.copy(old.position);n.rotation.copy(old.rotation);n.userData.vc=old.userData.vc;
  old.parent.add(n);old.parent.remove(old);return n;}
function bpfUpgrade(){if(!BP||!BP.ready)return;
  try{for(const R of PRJ.on){if(R.bpf)continue;R.bpf=1;R.people=R.people.map((p,i)=>{const n=bpfSwapGroup(R.g,p,'hablar');return n;});}}catch(e){}
  try{for(let i=0;i<K10.gs.length;i++){const g=K10.gs[i];if(!g||g.isMesh||g.userData.bpf)continue;K10.gs[i]=bpfSwapGroup(scene,g,'quieto');}}catch(e){}}
// las parejas se turnan para hablar
function bpfPairs(){try{const t=performance.now()/1000;for(const R of PRJ.on){if(!R.bpf)continue;R.people.forEach((p,i)=>{const on=Math.sin(t*0.5+R.t)>0===(i===0);bpfClip(p,on?'hablar':'quieto');});}}catch(e){}}
// ---------------------------------------------------------------- bucle: animación (más espaciada lejos) y limpieza
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start')return r;BPF.n++;const cx=camera.position.x,cz=camera.position.z;
  BPF.list=BPF.list.filter(g=>{if(!g.parent)return false;let p=g.parent;while(p&&p!==scene)p=p.parent;if(!p)return false;const F=g.userData.bpf;const v=new THREE.Vector3();g.getWorldPosition(v);const d2=(v.x-cx)**2+(v.z-cz)**2;
    F.acc=(F.acc||0)+dt;const every=d2<900?1:d2<3600?2:4;if(d2<160*160&&(BPF.n+(F.sl||(F.sl=1+Math.floor(Math.random()*5))))%every===0){F.B.mix.update(F.acc);F.acc=0;}return true;});
  BPF.t+=dt;if(BPF.t>1){BPF.t=0;bpfUpgrade();bpfPairs();}}catch(e){if(!BPF.err){BPF.err=1;console.warn('bpf',e);}}return r;};}
