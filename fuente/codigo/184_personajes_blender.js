// ============================================================ PERSONAJES HECHOS EN BLENDER (primera prueba en el juego: Atenas)
// Modelados con herramientas/blender/personajes.py: una sola malla con esqueleto, cara esculpida, ropa con caída y texturas pintadas.
// Atenas: ciudadano (quitón e himation), mujer (quitón jonio, himation, moño), obrero (exomis y pilos) y hoplita.
// Roma: togado (túnica y toga), romana (túnica, estola y palla) y legionario (lorica segmentata, galea, scutum, gladius).
// Van incrustados como #glbpj_<tipo>, comprimidos con gzip (versión ligera, ~11 000-13 000 triángulos); se descomprimen al cargar.
// Sustituyen a parte de los transeúntes de cada modo según su ropa (bpKind) y conservan su ruta; las prendas se tiñen con sus colores.
// La animación de andar va al compás de su paso (personWalk), y solo se anima a los que están cerca de la cámara.
const BP={tpl:{},ready:false,list:[],MAXC:36,MAXH:16,R:70,mats:new Map(),n:{}};
try{if(ACC.lite){BP.MAXC=12;BP.MAXH=6;BP.R=40;}}catch(e){}
if(typeof isTouch!=='undefined'&&isTouch){BP.MAXC=Math.min(BP.MAXC,18);BP.MAXH=Math.min(BP.MAXH,8);BP.R=45;}
// recordar con qué datos se hizo cada persona (para saber a quién se puede sustituir)
{const f=makePerson;makePerson=function(c){const g=f.apply(this,arguments);try{if(g&&c)g.userData.cfg=c;}catch(e){}return g;};}
async function bpBytes(id){const el=document.getElementById(id),t=el?el.textContent.trim():'';if(t.length<100||typeof DecompressionStream==='undefined')return null;
  const b=atob(t),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
  const st=new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'));return await new Response(st).arrayBuffer();}
function bpParse(id,k,done){if(!THREE.GLTFLoader){done();return;}
  bpBytes(id).then(buf=>{if(!buf){done();return;}new THREE.GLTFLoader().parse(buf,'',gl=>{bpMats(gl.scene);BP.tpl[k]={scene:gl.scene,anims:gl.animations};done();},e=>{console.warn('personaje',k,e);done();});}).catch(e=>{console.warn('personaje',k,e);done();});}
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
    if((nm==='himation'||nm==='palla')&&(c.himation||c.veil))o.material=bpTint(o.material,typeof c.veil==='string'?c.veil:c.himation,1.25);
    else if((nm==='quiton'||nm==='estola'||nm==='exomis')&&c.chiton)o.material=bpTint(o.material,c.chiton,nm==='exomis'?1.15:1.08);});
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
const BP_CAP={ciudadano:36,mujer:24,obrero:20,hoplita:16,togado:30,romana:24,legionario:14};
function bpKind(c){if(!c||c.glow||c.mask||c.attrs||c.helmet||c.staff||(c.scale&&c.scale<0.95))return null;
  if(MODE==='roma'){if(c.soldier)return 'legionario';if(c.female)return c.carry?null:'romana';if(c.toga)return 'togado';return null;}
  if(c.female)return(c.carry||c.veil)?null:'mujer';if(c.spear)return 'hoplita';if(c.carry||c.toga||c.soldier)return null;
  if(c.exomis||c.short||c.noHimation)return 'obrero';if(c.himOnly)return null;return 'ciudadano';}
function bpSwap(){if(!Object.keys(BP.tpl).length)return;const N=BP.n;
  for(const w of walkers){const g=w.g;if(!g||!g.parent||g.userData.pj||g.position.x>8000)continue;const k=bpKind(g.userData.cfg);if(!k||!BP.tpl[k])continue;
    const cap=Math.round((BP_CAP[k]||10)*(BP.MAXC/36));if((N[k]||0)>=cap)continue;
    const n=bpMake(k,g.userData.cfg);if(!n)continue;
    for(const key in g.userData)if(!['arms','legs','cfg','pvFine','pvFar','pvDone','pvNoBeard','part'].includes(key)&&n.userData[key]===undefined)n.userData[key]=g.userData[key];
    n.userData.cfg=g.userData.cfg;n.position.copy(g.position);n.rotation.copy(g.rotation);n.visible=g.visible;g.parent.add(n);g.parent.remove(g);w.g=n;BP.list.push(n);N[k]=(N[k]||0)+1;}
  try{if(typeof PV!=='undefined')PV.list=null;}catch(e){}BP.nc=N.ciudadano||0;BP.nh=N.hoplita||0;}
// patrulla de hoplitas por el ágora (en 386 a.C., Atenas está en guerra con Esparta: la guerra de Corinto)
function bpPatrol(){if(MODE!=='atenas'||!BP.tpl.hoplita||BP.patrol)return;BP.patrol=true;const R=mulberry32(390),b=[AG.x-30,AG.x+90,AG.z-70,AG.z+45];
  for(let i=0;i<4&&BP.list.length<BP.MAXC+BP.MAXH;i++){let x=0,z=0;for(let k=0;k<20;k++){x=b[0]+R()*(b[1]-b[0]);z=b[2]+R()*(b[3]-b[2]);if(isFree(x,z,0.8))break;}
    const g=bpMake('hoplita',{spear:true});if(!g)continue;g.position.set(x,terrainH(x,z),z);g.rotation.y=R()*TAU;scene.add(g);BP.list.push(g);
    walkers.push({g,mode:'agora',tx:x,tz:z,wait:R()*4,speed:0.9+R()*0.3,phase:R()*10,x,z});}}
const BP_MODE={atenas:['ciudadano','hoplita','mujer','obrero'],roma:['togado','romana','legionario']};
function bpSetup(){const L=BP_MODE[MODE]||[];let n=L.length;if(!n)return;const done=()=>{if(--n)return;BP.ready=true;try{bpSwap();bpPatrol();}catch(e){console.warn('bpSwap',e);}};
  for(const k of L)bpParse('glbpj_'+k,k,done);}
