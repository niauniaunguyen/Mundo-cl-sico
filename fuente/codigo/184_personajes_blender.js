// ============================================================ PERSONAJES HECHOS EN BLENDER (primera prueba en el juego: Atenas)
// Ciudadano (quitón e himation) y hoplita (coraza de lino, grebas, casco corintio, aspis y dory), modelados con
// herramientas/blender/personajes.py: una sola malla con esqueleto, cara esculpida, ropa con caída y texturas pintadas.
// Van incrustados como #glbpj1 y #glbpj2 (versión ligera, ~12 000 triángulos cada uno).
// En Atenas sustituyen a parte de los transeúntes: hombres con quitón e himation (hasta BP.MAXC) y los que llevan lanza
// (hasta BP.MAXH). Conservan su ruta; el manto y el quitón se tiñen con los colores de cada persona.
// La animación de andar va al compás de su paso (personWalk), y solo se anima a los que están cerca de la cámara.
const BP={tpl:{},ready:false,list:[],MAXC:36,MAXH:16,R:70,mats:new Map()};
try{if(ACC.lite){BP.MAXC=12;BP.MAXH=6;BP.R=40;}}catch(e){}
if(typeof isTouch!=='undefined'&&isTouch){BP.MAXC=Math.min(BP.MAXC,18);BP.MAXH=Math.min(BP.MAXH,8);BP.R=45;}
// recordar con qué datos se hizo cada persona (para saber a quién se puede sustituir)
{const f=makePerson;makePerson=function(c){const g=f.apply(this,arguments);try{if(g&&c)g.userData.cfg=c;}catch(e){}return g;};}
function bpParse(id,k,done){const el=document.getElementById(id),t=el?el.textContent.trim():'';if(!THREE.GLTFLoader||t.length<100){done();return;}
  try{const b=atob(t),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
    new THREE.GLTFLoader().parse(u.buffer,'',gl=>{bpMats(gl.scene);BP.tpl[k]={scene:gl.scene,anims:gl.animations};done();},e=>{console.warn('personaje',k,e);done();});}catch(e){console.warn('personaje',k,e);done();}}
// materiales como los del juego (Lambert; Phong con brillo para el metal), con esqueleto
function bpMats(root){root.traverse(o=>{if(!o.isMesh)return;const m=o.material,met=(m.metalness||0)>0.5;
  const n=met?new THREE.MeshPhongMaterial({map:m.map,shininess:60,specular:0xa89868,skinning:!!o.isSkinnedMesh}):new THREE.MeshLambertMaterial({map:m.map,skinning:!!o.isSkinnedMesh});
  n.name=m.name||'';o.material=n;o.castShadow=true;o.receiveShadow=false;o.frustumCulled=false;});}
// copia con su propio esqueleto (three r128 no lo hace con clone())
function bpClone(src){const c=src.clone(true),A=[],B=[];src.traverse(o=>A.push(o));c.traverse(o=>B.push(o));const map=new Map(A.map((o,i)=>[o,B[i]]));
  B.forEach((o,i)=>{if(!o.isSkinnedMesh)return;const so=A[i];o.bind(new THREE.Skeleton(so.skeleton.bones.map(b=>map.get(b)),so.skeleton.boneInverses),so.bindMatrix);});return c;}
function bpTint(m,hex,k){const key=m.uuid+hex+k;if(BP.mats.has(key))return BP.mats.get(key);const n=m.clone();n.color=new THREE.Color(hex).multiplyScalar(k);BP.mats.set(key,n);return n;}
function bpMake(kind,c){const T=BP.tpl[kind];if(!T)return null;const root=bpClone(T.scene);c=c||{};
  root.traverse(o=>{if(!o.isMesh)return;const nm=o.material.name||'';
    if(kind==='ciudadano'&&nm==='himation'&&c.himation)o.material=bpTint(o.material,c.himation,1.25);
    else if(kind==='ciudadano'&&nm==='quiton'&&c.chiton)o.material=bpTint(o.material,c.chiton,1.08);});
  const g=new THREE.Group();g.add(root);const mix=new THREE.AnimationMixer(root),find=s=>T.anims.find(a=>a.name.endsWith(s));
  const wa=find('andar'),ia=find('quieto');const walk=wa?mix.clipAction(wa):null,idle=ia?mix.clipAction(ia):null;
  if(walk){walk.play();walk.setEffectiveWeight(0);}if(idle){idle.play();idle.setEffectiveWeight(1);}
  g.userData.bp={mix,walk,idle,ph:0,amp:0,t:Math.random()*3,kind};g.userData.pj=kind;
  g.userData.arms=[new THREE.Object3D(),new THREE.Object3D()];   // quien mueva «los brazos» de una persona no rompe nada
  mix.update(0.01);return g;}
// andar: el ciclo de la animación va con la fase del paso
{const f=personWalk;personWalk=function(g,ph,amp){const B=g&&g.userData&&g.userData.bp;if(B){B.ph=ph;B.amp=amp;return;}return f.apply(this,arguments);};}
function bpTick(dt){if(!BP.list.length)return;const cx=camera.position.x,cz=camera.position.z,R2=BP.R*BP.R;
  for(const g of BP.list){const B=g.userData.bp;if(!g.visible||!g.parent)continue;const dx=g.position.x-cx,dz=g.position.z-cz;if(dx*dx+dz*dz>R2)continue;
    B.t+=dt;const a=Math.min(1,Math.max(0,B.amp));
    if(B.walk){B.walk.setEffectiveWeight(a);const d=B.walk.getClip().duration;B.walk.time=((B.ph/TAU)%1+1)%1*d;}
    if(B.idle){B.idle.setEffectiveWeight(1-a);const d=B.idle.getClip().duration;B.idle.time=B.t%d;}
    B.mix.update(0);}}
{const f=uxTick;uxTick=function(dt){f(dt);try{bpTick(dt);}catch(e){}};}
// quién se sustituye
function bpKind(c){if(!c||c.female||c.glow||c.mask||c.toga||c.veil||c.attrs||c.carry||c.staff||c.helmet||c.soldier||(c.scale&&c.scale<0.95))return null;
  if(c.spear)return 'hoplita';if(c.short||c.exomis||c.himOnly||c.noHimation)return null;return 'ciudadano';}
function bpSwap(){if(MODE!=='atenas'||!BP.tpl.ciudadano)return;let nc=0,nh=0;const R=mulberry32(386);
  for(const w of walkers){const g=w.g;if(!g||!g.parent||g.userData.pj||g.position.x>8000)continue;const k=bpKind(g.userData.cfg);if(!k)continue;
    if(k==='ciudadano'&&nc>=BP.MAXC)continue;if(k==='hoplita'&&nh>=BP.MAXH)continue;
    const n=bpMake(k,g.userData.cfg);if(!n)continue;
    for(const key in g.userData)if(!['arms','legs','cfg','pvFine','pvFar','pvDone','pvNoBeard','part'].includes(key)&&n.userData[key]===undefined)n.userData[key]=g.userData[key];
    n.userData.cfg=g.userData.cfg;n.position.copy(g.position);n.rotation.copy(g.rotation);n.visible=g.visible;g.parent.add(n);g.parent.remove(g);w.g=n;BP.list.push(n);
    if(k==='ciudadano')nc++;else nh++;}
  try{if(typeof PV!=='undefined')PV.list=null;}catch(e){}BP.nc=nc;BP.nh=nh;}
// patrulla de hoplitas por el ágora (en 386 a.C., Atenas está en guerra con Esparta: la guerra de Corinto)
function bpPatrol(){if(MODE!=='atenas'||!BP.tpl.hoplita||BP.patrol)return;BP.patrol=true;const R=mulberry32(390),b=[AG.x-30,AG.x+90,AG.z-70,AG.z+45];
  for(let i=0;i<4&&BP.list.length<BP.MAXC+BP.MAXH;i++){let x=0,z=0;for(let k=0;k<20;k++){x=b[0]+R()*(b[1]-b[0]);z=b[2]+R()*(b[3]-b[2]);if(isFree(x,z,0.8))break;}
    const g=bpMake('hoplita',{spear:true});if(!g)continue;g.position.set(x,terrainH(x,z),z);g.rotation.y=R()*TAU;scene.add(g);BP.list.push(g);
    walkers.push({g,mode:'agora',tx:x,tz:z,wait:R()*4,speed:0.9+R()*0.3,phase:R()*10,x,z});}}
function bpSetup(){let n=2;const done=()=>{if(--n)return;BP.ready=true;try{bpSwap();bpPatrol();}catch(e){console.warn('bpSwap',e);}};bpParse('glbpj1','ciudadano',done);bpParse('glbpj2','hoplita',done);}
