// ============================================================ AVES NUEVAS (vídeo del 22/11: «modelos antiguos, sobre todo de animales»)
// Las aves pequeñas eran bolas con dos triángulos por alas. Ahora usan las aves hechas en Blender (herramientas/blender/aves.py →
// modelos/aves.glb): paloma bravía, gaviota patiamarilla y gorrión común, con alas en dos tramos que baten.
//  · Palomas de las plazas (217): paloma; posadas, con las alas recogidas; al alzar el vuelo, las abren y baten.
//  · Gaviotas de la costa (217): gaviota.
//  · Bandadas del cielo (052) y grajillas/cornejas (104): paloma teñida de oscuro (de lejos solo se lee la silueta).
//  · Golondrinas de la primavera (102): la silueta de la gaviota (alas largas y puntiagudas) en pequeño y teñida de azul negruzco.
//  · Gorriones de las calles (104 y 236): gorrión.
// Las figuras viejas no se borran: se esconden dentro de su grupo, y el modelo nuevo se añade al lado. Así el código que las mueve sigue igual
// (las alas que antes giraban son ahora los brazos de las alas nuevas).
const AVN={pend:[],done:0,mats:new Map()};
function avnModel(kind,tint){const T=AV.tpl&&AV.tpl[kind];if(!T)return null;const g=T.clone(true);g.position.set(0,0,0);g.rotation.set(0,0,0);g.scale.setScalar(1);
  if(tint)g.traverse(o=>{if(!o.isMesh)return;const k=o.material.uuid+tint;let m=AVN.mats.get(k);if(!m){m=o.material.clone();m.color=new THREE.Color(tint);AVN.mats.set(k,m);}o.material=m;});
  const W={I:g.getObjectByName(kind+'_aI1'),D:g.getObjectByName(kind+'_aD1')};return {g,W};}
const AVN_LEN={paloma:0.32,gaviota:0.58,gorrion:0.15};
// cambia la figura vieja de un ave (grupo g con sus alas en wg) por el modelo nuevo, al tamaño real «len» en metros
function avnSwap(g,wg,kind,len,tint){const M=avnModel(kind,tint);if(!M||!M.W.I||!M.W.D)return false;for(const c of g.children)c.visible=false;
  const sc=Math.max(1e-3,(g.scale.x||1));M.g.scale.setScalar(len/(AVN_LEN[kind]||0.3)/sc);g.add(M.g);g.userData.avn=M;
  if(wg){wg[0]=M.W.I;wg[1]=M.W.D;}return true;}
function avnWings(M,on){if(!M)return;M.W.I.visible=on;M.W.D.visible=on;}
// ---- birdMesh (052): bandadas, golondrinas, gorriones y grajillas; se apuntan y se cambian cuando el modelo está cargado
{const f=birdMesh;birdMesh=function(col){const b=f.apply(this,arguments);try{AVN.pend.push({b,col:String(col||'').toLowerCase()});}catch(e){}return b;};}
function avnKindOf(col,sc){if(col==='#1d1a22')return ['gaviota',0.18,'#2a2c40'];if(col==='#7a6048')return ['gorrion',0.15,null];if(col==='#141218')return ['paloma',0.42,'#262428'];return ['paloma',0.32,col==='#3a3430'?'#4a4440':'#7a7470'];}
function avnTick(){if(!AV.tpl||!AV.tpl.paloma)return;
  if(AVN.pend.length){const L=AVN.pend.splice(0,AVN.pend.length);for(const p of L){const[k,len,t]=avnKindOf(p.col);if(!avnSwap(p.b.g,p.b.wg,k,len,t))AVN.pend.push(p);else AVN.done++;}}
  // palomas de las plazas y gaviotas de la costa (217)
  try{for(const B of X3.pig)if(!B.g.userData.avn&&avnSwap(B.g,null,'paloma',0.32,null)){B.g.children.forEach(c=>{if(c!==B.g.userData.avn.g)c.visible=false;});AVN.done++;}}catch(e){}
  try{for(const G of X3.gulls)if(!G.g.userData.avn&&avnSwap(G.g,null,'gaviota',0.58,null))AVN.done++;}catch(e){}}
// las palomas: alas recogidas en el suelo, abiertas y batiendo al volar
{const f=x3PigTick;x3PigTick=function(dt){const r=f.apply(this,arguments);try{const t=performance.now()/1000;for(const B of X3.pig){const M=B.g.userData.avn;if(!M)continue;const fly=B.st===1;avnWings(M,fly);
  if(fly){const a=Math.sin(t*24+B.hx)*0.8;M.W.I.rotation.z=-a;M.W.D.rotation.z=a;}else{M.g.rotation.x=0;}
  // la cabeza que picotea: la del modelo
  const h=M.g.children.find(o=>/_cabeza$/.test(o.name));if(h&&!fly)h.rotation.x=Math.max(0,Math.sin(t*3+B.hx))*0.5;}}catch(e){}return r;};}
// las gaviotas: batir lento y planeo
{const f=x3Gulls;x3Gulls=function(dt){const r=f.apply(this,arguments);try{const t=performance.now()/1000;for(const G of X3.gulls){const M=G.g.userData.avn;if(!M)continue;const fl=Math.sin(t*3+G.ph)*0.35*(Math.sin(t*0.4+G.ph)>0?1:0.25);M.W.I.rotation.z=-fl;M.W.D.rotation.z=fl;}}catch(e){}return r;};}
// los gorriones de las calles (236): el gorrión, con las alas recogidas mientras picotean y abiertas al salir volando
{const f=g5Sparrow;g5Sparrow=function(x,y,z){const s=f.apply(this,arguments);try{const M=avnModel('gorrion',null);if(M){scene.remove(s.m);const g=new THREE.Group();g.add(M.g);g.position.copy(s.m.position);g.rotation.y=s.m.rotation.y;scene.add(g);s.m=g;s.avn=M;avnWings(M,false);}}catch(e){}return s;};}
{const f=g5Tick;g5Tick=function(dt){const r=f.apply(this,arguments);try{const t=performance.now()/1000;for(const s of G5.sp){if(!s.avn)continue;const fly=s.fly>0;avnWings(s.avn,fly);if(fly){s.m.rotation.y=Math.atan2(s.vx,s.vz);const a=Math.sin(t*30)*0.9;s.avn.W.I.rotation.z=-a;s.avn.W.D.rotation.z=a;}}}catch(e){}return r;};}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{AVN.t=(AVN.t||0)-dt;if(AVN.t<=0){AVN.t=1;avnTick();}}catch(e){}return r;};}
