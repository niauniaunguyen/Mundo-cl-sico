// ============================================================ MULTITUDES Y PROCESIONES CON LOS MODELOS DE BLENDER
// bpSwap (184) solo cambiaba a los transeúntes que andan (walkers): la gente de las fiestas y acontecimientos (evCrowd, 014) y la de las
// procesiones (194) seguía con la figura sencilla de antes. Ahora se cambian también, con el mismo detalle por distancia (bpLod: de cerca
// el modelo de Blender, de lejos la figura sencilla). Quien lleva bastón ya no se queda fuera (el bastón no se ve en el modelo).
// force: los de oficios, fiestas y procesiones cercanos entran aunque la lista esté llena (en el móvil, BP.MAXT es menor y los
// transeúntes la llenaban antes: los bataneros de la fullonica se quedaban con la figura antigua)
function bpNear(g,R){try{const v=new THREE.Vector3();g.getWorldPosition(v);return Math.hypot(v.x-camera.position.x,v.z-camera.position.z)<R;}catch(e){return false;}}
function bpConv(g,force){if(!g||!g.parent||g.userData.pj||g.userData.bpNo||!g.userData.cfg)return null;if(BP.list.length>=BP.MAXT&&!(force&&bpNear(g,150)))return null;
  const c=g.userData.cfg,k=bpKind(c.staff?Object.assign({},c,{staff:false}):c);if(!k||!BP.tpl[k]){g.userData.bpNo=1;return null;}
  const n=bpMake(k,c);if(!n){g.userData.bpNo=1;return null;}
  for(const key in g.userData)if(!['arms','legs','cfg','pvFine','pvFar','pvDone','pvNoBeard','part'].includes(key)&&n.userData[key]===undefined)n.userData[key]=g.userData[key];
  n.userData.cfg=c;n.position.copy(g.position);n.rotation.copy(g.rotation);n.visible=g.visible;const par=g.parent;par.add(n);par.remove(g);
  g.position.set(0,0,0);g.rotation.set(0,0,0);g.visible=false;n.add(g);n.userData.old=g;n.userData.arms=g.userData.arms||n.userData.arms;n.userData.legs=g.userData.legs;
  BP.list.push(n);BP.n[k]=(BP.n[k]||0)+1;return n;}
BP.MAXT+=ACC.lite?40:120;   // sitio para la multitud de una fiesta (solo los BP.K más cercanos se dibujan con el modelo de Blender)
{const f=bpKind;bpKind=function(c){const r=f(c&&c.staff?Object.assign({},c,{staff:false}):c);
  // en Roma, el hombre de túnica corta (artesanos, bataneros, mozos) tiene ahora su modelo: el «tunicado»
  if(!r&&MODE==='roma'&&c&&!c.female&&!c.toga&&!c.soldier&&!c.glow&&!c.mask&&!c.attrs&&!c.helmet&&!(c.scale&&c.scale<0.95)&&(c.short||c.noHimation||c.exomis))return 'tunicado';return r;};}
try{if(BP_MODE.roma.indexOf('tunicado')<0)BP_MODE.roma.push('tunicado');BP_CAP.tunicado=30;}catch(e){}
function bpCrowds(){if(!Object.keys(BP.tpl).length)return 0;let made=0;
  // quien se fue con la multitud de un día anterior (evCrowd quita el grupo de la escena) deja su sitio en la lista
  const live=g=>{let r=g;while(r.parent)r=r.parent;return r===scene;};for(let i=BP.list.length-1;i>=0;i--)if(!live(BP.list[i]))BP.list.splice(i,1);
  if(typeof EVC!=='undefined'&&EVC.g)for(const o of[...EVC.g.children])if(bpConv(o,true))made++;
  // la gente de los puestos de oficios (057: bataneros, herreros, alfareros…), que trabaja quieta en su sitio; su gesto sigue (personWalk)
  if(typeof OFIC!=='undefined')for(const O of OFIC)for(const p of O.ppl||[]){const n=bpConv(p.m,true);if(n){p.m=n;made++;}}
  if(typeof PROC!=='undefined'&&PROC.g)for(const m of PROC.ms){if(m.kind!=='p')continue;const n=bpConv(m.o,true);if(n){m.o=n;made++;}}
  return made;}
{const f=bpSwap;bpSwap=function(){let made=f.apply(this,arguments)||0;try{const k=bpCrowds();if(k){made+=k;bpLod();}}catch(e){console.warn('multitud',e);}return made;};}
// ---- nadie dentro de la cámara: si una persona queda a menos de medio metro, no se dibuja (si no, el plano cercano de la cámara la corta
// y se ve el interior de la cabeza —como una segunda cara— y la ropa en tiras)
const CAMHIDE={list:new Set()};
function camHideSet(root,hide){root.traverse(o=>{if(o.isMesh){if(hide){if(o.userData.camVis===undefined){o.userData.camVis=o.visible;o.visible=false;}}else if(o.userData.camVis!==undefined){o.visible=o.userData.camVis;delete o.userData.camVis;}}});}
function camHideTick(){if(typeof camera==='undefined')return;const c=camera.position,v=new THREE.Vector3(),R=[];
  for(const g of BP.list)if(g.parent&&g.children[0])R.push(g);try{for(const f of NPB.vis)if(f.root)R.push(f.root);}catch(e){}
  for(const r of R){r.getWorldPosition(v);const d=Math.hypot(v.x-c.x,v.z-c.z),inside=d<0.5&&c.y>v.y-0.2&&c.y<v.y+2.1;const root=r.userData&&r.userData.bp?r.children[0]:r;
    if(inside&&!CAMHIDE.list.has(root)){camHideSet(root,true);CAMHIDE.list.add(root);}}
  for(const root of [...CAMHIDE.list]){root.getWorldPosition(v);const d=Math.hypot(v.x-c.x,v.z-c.z);if(d>0.7||!(c.y>v.y-0.2&&c.y<v.y+2.1)){camHideSet(root,false);CAMHIDE.list.delete(root);}}}
{const f=uxTick;uxTick=function(dt){f(dt);try{camHideTick();}catch(e){}};}
const BP_YOUNG=new Set();
// niños y jóvenes (escala 0,6–0,95: Lisias, Gaya, los hijos de las casas): el modelo de adulto de su ropa, a su tamaño
{const f=bpKind;bpKind=function(c){if(c&&c.scale&&c.scale<0.95&&c.scale>=0.6){const r=f(Object.assign({},c,{scale:1}));return r;}return f(c);};}
{const f=bpMake;bpMake=function(k,c){const g=f.apply(this,arguments);try{if(g&&c&&c.scale&&c.scale<0.95&&c.scale>=0.6){g.scale.multiplyScalar(c.scale);if(c.scale<0.9){g.userData.young=1;BP_YOUNG.add(g);}}}catch(e){}/* un muchacho, sin barba */return g;};}
// el guía de la llegada (157) también: su cartel pasa al modelo nuevo
function bpGuide(){try{if(typeof OB==='undefined'||!OB.g||OB.g.userData.bp||OB.g.userData.bpNo)return;const old=OB.g,n=bpConv(old,true);if(!n)return;OB.g=n;
  if(OB.lb&&OB.lb.parent===old){old.remove(OB.lb);n.add(OB.lb);OB.lb.position.y=2.2/(n.scale.x||1);}}catch(e){}}
{const f=bpCrowds;bpCrowds=function(){const r=f.apply(this,arguments);bpGuide();return r;};}
// sin barba también después de cambiar a la cabeza de alta calidad (BPH, 186), que trae su propia barba
{let t=0;const f=uxTick;uxTick=function(dt){f(dt);t+=dt;if(t<0.3)return;t=0;try{for(const g of BP_YOUNG){let r=g;while(r.parent)r=r.parent;if(r!==scene){BP_YOUNG.delete(g);continue;}
  g.traverse(o=>{if(!o.isMesh)return;if(o.visible&&/barba|bigote/i.test(o.name))o.visible=false;else if(/cabeza/.test(o.name)&&o.material&&o.material.map&&!o.material.userData.young)o.material=bpBeardless(o.material);});}}catch(e){}};}
// la barba también va pintada en la textura de la cara: en los jóvenes, sus píxeles oscuros de la zona de la barba se pintan del color de su piel
const BP_BL=new Map();
function bpBeardless(m){const k=m.map.uuid;if(BP_BL.has(k))return BP_BL.get(k);const img=m.map.image;if(!img||!img.width)return m;
  const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.drawImage(img,0,0);const W=c.width,H=c.height,D=x.getImageData(0,0,W,H),d=D.data;
  const si=(Math.floor(H*0.9)*W+Math.floor(W*0.12))*4,sr=d[si],sg=d[si+1],sb=d[si+2],sl=sr+sg+sb;
  for(let y=Math.floor(H*0.42);y<H;y++)for(let xx=Math.floor(W*0.22);xx<Math.ceil(W*0.78);xx++){const i=(y*W+xx)*4,l=d[i]+d[i+1]+d[i+2];
    if(l<sl*0.72&&!(d[i]>d[i+2]*1.6&&d[i]>90)){const v=0.94+((xx*7+y*13)%9)/100;d[i]=sr*v;d[i+1]=sg*v;d[i+2]=sb*v;}}   // los labios (rojizos) se quedan
  x.putImageData(D,0,0);const t=new THREE.CanvasTexture(c);t.flipY=m.map.flipY;t.encoding=m.map.encoding;t.wrapS=m.map.wrapS;t.wrapT=m.map.wrapT;
  const n=m.clone();n.map=t;n.userData.young=1;n.needsUpdate=true;BP_BL.set(k,n);return n;}
// la gente con carga (aguadoras con su hidria en la cabeza, porteadores con ánfora, cestas), las mujeres con velo, los soldados de
// Atenas y quien solo lleva himation se quedaban con la figura sencilla de antes: ahora usan el modelo de Blender, y la carga va
// pegada al hueso de la cabeza (hidria y cesta, como se llevaban) o del hombro (ánfora), para que se mueva con la persona.
{const f=bpKind;bpKind=function(c){let r=f(c);if(r||!c||c.glow||c.mask||c.attrs||c.helmet||(c.scale&&c.scale<0.95))return r;
  const ro=MODE==='roma';if(c.female)return ro?'romana':'mujer';if(ro){if(c.carry)return 'tunicado';return r;}
  if(c.soldier)return 'hoplita';if(c.carry)return 'obrero';if(c.himOnly)return 'ciudadano';return r;};}
function bpProp(n,c){if(!c||!c.carry||n.userData.prop)return;let head=null,sh=null;n.traverse(o=>{if(o.isBone){if(o.name==='head')head=o;else if(o.name==='clavicle.R'||o.name==='clavicleR')sh=o;}});if(!head)return;
  const inv=1/((n.scale&&n.scale.x)||1);let m;
  if(c.carry==='hydria'){m=new THREE.Mesh(PGEO.jar,lam('#a8532f'));m.position.set(0,0.24,0);}
  else if(c.carry==='basket'){m=new THREE.Mesh(PGEO.basket,lam('#a8864f'));m.position.set(0,0.27,0);}
  else{m=new THREE.Mesh(PGEO.jar,lam('#b5603a'));m.scale.setScalar(1.3);const b=sh||head;if(b===head)m.position.set(-0.2,-0.12,0);else m.position.set(0,0.1,0);m.rotation.z=0.6;(b).add(m);n.userData.prop=m;return;}
  m.castShadow=true;head.add(m);n.userData.prop=m;}
{const f=bpConv;bpConv=function(g,force){const n=f.apply(this,arguments);try{if(n)bpProp(n,n.userData.cfg);}catch(e){}return n;};}
// la gente de los oficios del campo (132: cazador, pastor, leñador, resinero…) también con el modelo de Blender, cuando está de pie;
// la herramienta que tenía en la mano (ruHand) pasa a la mano derecha del modelo. Quien está arrodillado o sentado sigue como estaba.
function bpConvRU(){if(typeof RU==='undefined'||!Object.keys(BP.tpl).length)return;const P=player;
  for(const V of RU.live){if(!V.p)continue;for(let i=0;i<V.p.length;i++){const g=V.p[i];if(!g||g.userData.bp||g.userData.bpNo||g.userData.old||!g.parent)continue;
    if(g.userData.pose||Math.abs(g.rotation.x)>0.05||Math.hypot(g.position.x-P.x,g.position.z-P.z)>110)continue;
    const tools=[];(g.userData.arms||[]).forEach(a=>a&&a.traverse(o=>{if(o.userData&&o.userData.ruTool)tools.push(o);}));
    const n=bpConv(g,true);if(!n){g.userData.bpNo=1;continue;}V.p[i]=n;
    let hand=null;n.traverse(o=>{if(o.isBone&&o.name==='hand.R')hand=o;});
    if(hand)for(const t of tools){t.parent&&t.parent.remove(t);t.position.set(0,0.07,0);t.rotation.x+=Math.PI;hand.add(t);}}}}
{let t0=0;const f=uxTick;uxTick=function(dt){f(dt);const now=performance.now();if(now-t0<1500)return;t0=now;try{bpConvRU();}catch(e){}
  try{for(const g of BP.list){const c=g.userData.cfg;if(c&&c.carry&&!g.userData.prop)bpProp(g,c);}}catch(e){}};}   // la carga, en cuanto el modelo tiene esqueleto
