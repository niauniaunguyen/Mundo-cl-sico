// ============================================================ PERSONAJES HECHOS EN BLENDER (primera prueba en el juego: Atenas)
// Modelados con herramientas/blender/personajes.py: una sola malla con esqueleto, cara esculpida, ropa con caída y texturas pintadas.
// Atenas: ciudadano (quitón e himation), mujer (quitón jonio, himation, moño), obrero (exomis y pilos) y hoplita.
// Roma: togado (túnica y toga), romana (túnica, estola y palla) y legionario (lorica segmentata, galea, scutum, gladius).
// Van incrustados como #glbpj_<tipo>, comprimidos con gzip (versión ligera, ~11 000-13 000 triángulos); se descomprimen al cargar.
// Sustituyen a parte de los transeúntes de cada modo según su ropa (bpKind) y conservan su ruta; las prendas se tiñen con sus colores.
// La animación de andar va al compás de su paso (personWalk), y solo se anima a los que están cerca de la cámara.
const BP={tpl:{},ready:false,list:[],MAXC:36,MAXH:16,R:140,mats:new Map(),n:{},K:40,VR:140,MAXT:220};
try{if(ACC.lite){BP.MAXC=12;BP.MAXH=6;BP.R=60;BP.K=14;BP.VR=60;BP.MAXT=100;}}catch(e){}
if(typeof isTouch!=='undefined'&&isTouch){BP.MAXC=Math.min(BP.MAXC,18);BP.MAXH=Math.min(BP.MAXH,8);BP.R=90;BP.K=Math.min(BP.K,22);BP.VR=Math.min(BP.VR,90);BP.MAXT=Math.min(BP.MAXT,140);}
// recordar con qué datos se hizo cada persona (para saber a quién se puede sustituir)
{const f=makePerson;makePerson=function(c){const g=f.apply(this,arguments);try{if(g&&c)g.userData.cfg=c;}catch(e){}return g;};}
async function bpBytes(id){const t=(await datoGet(id)).trim();   // en atenas.html, el archivo datos/<id>.txt se trae ahora
  if(t.length<100)return null;
  const b=atob(t),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
  if(typeof DecompressionStream==='undefined')return bpGunzip(u).buffer;   // Safari antes de iOS 16.4 y navegadores viejos de Android
  const st=new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'));return await new Response(st).arrayBuffer();}
// gzip sin ayuda del navegador (inflado de RFC 1951: bloques guardados, fijos y dinámicos)
function bpGunzip(d){let p=10;const fl=d[3];if(fl&4)p+=2+(d[10]|d[11]<<8);if(fl&8)while(d[p++]);if(fl&16)while(d[p++]);if(fl&2)p+=2;
  const isz=d[d.length-4]|d[d.length-3]<<8|d[d.length-2]<<16|d[d.length-1]<<24>>>0,out=new Uint8Array(isz>>>0);let o=0,bb=0,bc=0;
  const bit=n=>{while(bc<n){bb|=d[p++]<<bc;bc+=8;}const v=bb&((1<<n)-1);bb>>>=n;bc-=n;return v;};
  const mk=L=>{const cnt=new Uint16Array(16),offs=new Uint16Array(16),sym=new Uint16Array(L.length);for(const l of L)cnt[l]++;cnt[0]=0;for(let i=1;i<16;i++)offs[i]=offs[i-1]+cnt[i-1];L.forEach((l,i)=>{if(l)sym[offs[l]++]=i;});return{cnt,sym};};
  const dec=h=>{let code=0,first=0,idx=0;for(let l=1;l<16;l++){code|=bit(1);const c=h.cnt[l];if(code-c<first)return h.sym[idx+(code-first)];idx+=c;first+=c;first<<=1;code<<=1;}throw new Error('inflate');};
  const LB=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],LE=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],
    DB=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],DE=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
  let fin=0;while(!fin){fin=bit(1);const ty=bit(2);
    if(ty===0){bb=0;bc=0;const len=d[p]|d[p+1]<<8;p+=4;out.set(d.subarray(p,p+len),o);p+=len;o+=len;continue;}
    let lt,dt;if(ty===1){const L=new Uint8Array(288);L.fill(8,0,144);L.fill(9,144,256);L.fill(7,256,280);L.fill(8,280);lt=mk(L);dt=mk(new Uint8Array(30).fill(5));}
    else{const hl=bit(5)+257,hd=bit(5)+1,hc=bit(4)+4,ord=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],cl=new Uint8Array(19);for(let i=0;i<hc;i++)cl[ord[i]]=bit(3);
      const ch=mk(cl),L=new Uint8Array(hl+hd);for(let i=0;i<hl+hd;){const v=dec(ch);if(v<16)L[i++]=v;else if(v===16){const r=L[i-1],n=3+bit(2);L.fill(r,i,i+n);i+=n;}else if(v===17)i+=3+bit(3);else i+=11+bit(7);}
      lt=mk(L.subarray(0,hl));dt=mk(L.subarray(hl));}
    for(;;){const v=dec(lt);if(v<256){out[o++]=v;continue;}if(v===256)break;const li=v-257,len=LB[li]+bit(LE[li]),di=dec(dt),dist=DB[di]+bit(DE[di]);for(let i=0;i<len;i++,o++)out[o]=out[o-dist];}}
  return out;}
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
    else if((nm==='quiton'||nm==='estola'||nm==='exomis'||nm==='tunica')&&c.chiton)o.material=bpTint(o.material,c.chiton,nm==='exomis'?1.15:1.08);});
  const g=new THREE.Group();g.add(root);const mix=new THREE.AnimationMixer(root),find=s=>T.anims.find(a=>a.name.endsWith(s));
  const wa=find('andar'),ia=find('quieto');const walk=wa?mix.clipAction(wa):null,idle=ia?mix.clipAction(ia):null;
  if(walk){walk.play();walk.setEffectiveWeight(0);}if(idle){idle.play();idle.setEffectiveWeight(1);}
  g.userData.bp={mix,walk,idle,ph:0,amp:0,t:Math.random()*3,kind};g.userData.pj=kind;
  g.userData.arms=[new THREE.Object3D(),new THREE.Object3D()];   // quien mueva «los brazos» de una persona no rompe nada
  mix.update(0.01);return g;}
// andar: el ciclo de la animación va con la fase del paso
{const f=personWalk;personWalk=function(g,ph,amp){const B=g&&g.userData&&g.userData.bp;if(B){B.ph=ph;B.amp=amp;const o=g.userData.old;if(o&&o.visible)f(o,ph,amp);return;}return f.apply(this,arguments);};}   // de lejos se ve la figura sencilla, que también anda
function bpTick(dt){if(!BP.list.length)return;const cx=camera.position.x,cz=camera.position.z,R2=BP.R*BP.R;
  for(const g of BP.list){const B=g.userData.bp;if(!g.visible||!g.parent)continue;const dx=g.position.x-cx,dz=g.position.z-cz;if(dx*dx+dz*dz>R2)continue;if(g.children[0]&&!g.children[0].visible)continue;
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
// Todos los transeúntes que lo admiten llevan las dos figuras: la de Blender (root) y la sencilla de antes (old, hija del mismo grupo).
// bpLod enseña la de Blender en los más cercanos (BP.K como mucho, a menos de BP.VR) y la sencilla en los demás: así cualquiera que
// se acerque se ve con el modelo nuevo, también en el móvil, que antes solo cambiaba la mitad (o un tercio en modo ligero) al cargar.
// bpSwap se repite cada pocos segundos: la gente que aparece después (destinos construidos al llegar, sucesos) también cambia.
function bpSwap(){if(!Object.keys(BP.tpl).length)return;const N=BP.n;let made=0;
  for(const w of walkers){const g=w.g;if(!g||!g.parent||g.userData.pj||g.userData.bpNo)continue;if(BP.list.length>=BP.MAXT)break;const k=bpKind(g.userData.cfg);if(!k||!BP.tpl[k]){g.userData.bpNo=1;continue;}
    const n=bpMake(k,g.userData.cfg);if(!n){g.userData.bpNo=1;continue;}
    for(const key in g.userData)if(!['arms','legs','cfg','pvFine','pvFar','pvDone','pvNoBeard','part'].includes(key)&&n.userData[key]===undefined)n.userData[key]=g.userData[key];
    n.userData.cfg=g.userData.cfg;n.position.copy(g.position);n.rotation.copy(g.rotation);n.visible=g.visible;g.parent.add(n);g.parent.remove(g);
    g.position.set(0,0,0);g.rotation.set(0,0,0);g.visible=false;n.add(g);n.userData.old=g;n.userData.arms=g.userData.arms||n.userData.arms;n.userData.legs=g.userData.legs;
    w.g=n;BP.list.push(n);N[k]=(N[k]||0)+1;made++;}
  if(made){try{if(typeof PV!=='undefined')PV.list=null;}catch(e){}try{bpLod();}catch(e){}}BP.nc=N.ciudadano||0;BP.nh=N.hoplita||0;return made;}
function bpLod(){BP.lodN=(BP.lodN||0)+1;if(typeof camera==='undefined')return;const cx=camera.position.x,cz=camera.position.z,VR2=BP.VR*BP.VR,A=[];
  for(const g of BP.list){if(!g.parent)continue;const o=g.userData.old,dx=g.position.x-cx,dz=g.position.z-cz,d2=dx*dx+dz*dz;if(!o){continue;}A.push([d2,g]);}
  A.sort((a,b)=>a[0]-b[0]);A.forEach(([d2,g],i)=>{const near=i<BP.K&&d2<VR2,root=g.children[0],o=g.userData.old;if(root.visible!==near){root.visible=near;o.visible=!near;}});}
{let acc=0,acc2=0;const f=uxTick;uxTick=function(dt){f(dt);if(!BP.ready)return;acc+=dt;acc2+=dt;try{for(const g of BP.list){const o=g.userData.old;if(o&&o.visible&&g.children[0].visible)o.visible=false;}   // el detalle por distancia vuelve a encender la figura sencilla
    if(acc>0.3){acc=0;bpLod();}if(acc2>4){acc2=0;bpSwap();}}catch(e){}};}
// patrulla de hoplitas por el ágora (en 386 a.C., Atenas está en guerra con Esparta: la guerra de Corinto)
function bpPatrol(){if(MODE!=='atenas'||!BP.tpl.hoplita||BP.patrol)return;BP.patrol=true;const R=mulberry32(390),b=[AG.x-30,AG.x+90,AG.z-70,AG.z+45];
  for(let i=0;i<4;i++){let x=0,z=0;for(let k=0;k<20;k++){x=b[0]+R()*(b[1]-b[0]);z=b[2]+R()*(b[3]-b[2]);if(isFree(x,z,0.8))break;}
    const g=bpMake('hoplita',{spear:true});if(!g)continue;g.position.set(x,terrainH(x,z),z);g.rotation.y=R()*TAU;scene.add(g);BP.list.push(g);
    walkers.push({g,mode:'agora',tx:x,tz:z,wait:R()*4,speed:0.9+R()*0.3,phase:R()*10,x,z});}}
const BP_MODE={atenas:['ciudadano','hoplita','mujer','obrero'],roma:['togado','romana','legionario']};
function bpSetup(){const L=BP_MODE[MODE]||[];let n=L.length;if(!n)return;const done=()=>{if(--n)return;BP.ready=true;try{bpSwap();bpPatrol();}catch(e){console.warn('bpSwap',e);}};
  for(const k of L)bpParse('glbpj_'+k,k,done);}
