// ============================================================ SALTAR MURETES: «E · Saltar el murete» y un salto lateral ágil
// Las colisiones del juego son planas (paredes sin altura), así que un pilón, un murete o un banco cortaban el paso aunque saltaras.
// Ahora, si empujas contra algo bajo (entre 35 cm y 1,4 m), despejado por encima y con suelo libre al otro lado a menos de 2 m,
// aparece «E · Saltar el murete». Al pulsarlo el personaje lo salva de un salto de lado, apoyando una mano (la cámara se ladea un poco).
const VT={can:null,on:null,t:0,near:[],nearT:0,nearX:1e9,nearZ:1e9,ray:null,seen:false,side:1};
function vtNear(){const P=player;if(VT.nearT>0&&Math.hypot(P.x-VT.nearX,P.z-VT.nearZ)<8)return VT.near;VT.nearT=1;VT.nearX=P.x;VT.nearZ=P.z;const L=[],s=new THREE.Sphere(),v=new THREE.Vector3(),m=new THREE.Matrix4();
  scene.traverse(o=>{if(!o.isMesh||!o.visible||!o.geometry||o.userData.noVault)return;for(let q=o;q;q=q.parent){if(q.visible===false||q.userData&&(q.userData.walk||q.userData.arms||q.userData.anim))return;}
    const mt=Array.isArray(o.material)?o.material[0]:o.material;if(mt&&(mt.transparent&&mt.opacity<0.9))return;
    if(o.isInstancedMesh){if(o.count>4000)return;let b=o.userData.vtB;if(!b){let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;for(let i=0;i<o.count;i++){o.getMatrixAt(i,m);v.setFromMatrixPosition(m).applyMatrix4(o.matrixWorld);x0=Math.min(x0,v.x);x1=Math.max(x1,v.x);z0=Math.min(z0,v.z);z1=Math.max(z1,v.z);}
        b=o.userData.vtB={x:(x0+x1)/2,z:(z0+z1)/2,r:Math.hypot(x1-x0,z1-z0)/2+6};}if(Math.hypot(b.x-P.x,b.z-P.z)<b.r+16)L.push(o);return;}
    if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();const bx=VT.bb||(VT.bb=new THREE.Box3());bx.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);   // las piezas repetidas van juntas en mallas por zonas
    if(bx.max.x-bx.min.x>400||bx.max.z-bx.min.z>400)return;   // terreno y mar
    if(P.x>bx.min.x-16&&P.x<bx.max.x+16&&P.z>bx.min.z-16&&P.z<bx.max.z+16)L.push(o);});
  VT.near=L;return L;}
// rayo contra lo cercano. Las piezas repetidas (chunked) guardan su esfera envolvente ya en coordenadas del mundo y el raycast de
// three.js la vuelve a transformar por cada pieza, así que nunca acierta: para ellas se pasa el rayo a las coordenadas de cada pieza
// cercana y se prueba contra su caja (basta para saber la altura de un pilón o un murete).
const VT_M=new THREE.Matrix4(),VT_I=new THREE.Matrix4(),VT_P=new THREE.Vector3(),VT_R=new THREE.Ray(),VT_Q=new THREE.Vector3();
function vtHit(ox,oy,oz,dx,dy,dz,far){const R=VT.ray||(VT.ray=new THREE.Raycaster());const O=new THREE.Vector3(ox,oy,oz),D=new THREE.Vector3(dx,dy,dz).normalize();R.set(O,D);R.far=far;
  const plain=[],inst=[];for(const o of vtNear())(o.isInstancedMesh?inst:plain).push(o);let best=null;
  const h=R.intersectObjects(plain,false);if(h.length)best={point:h[0].point.clone(),distance:h[0].distance};
  for(const o of inst){const g=o.geometry;if(!g.boundingBox)g.computeBoundingBox();const bb=g.boundingBox,ext=Math.max(bb.max.x-bb.min.x,bb.max.y-bb.min.y,bb.max.z-bb.min.z);
    for(let i=0;i<o.count;i++){o.getMatrixAt(i,VT_M);VT_M.premultiply(o.matrixWorld);VT_P.setFromMatrixPosition(VT_M);const sc=Math.max(1,VT_Q.setFromMatrixScale(VT_M).x,VT_Q.y,VT_Q.z);
      if(Math.abs(VT_P.x-ox)>far+ext*sc+1||Math.abs(VT_P.z-oz)>far+ext*sc+1)continue;
      VT_I.copy(VT_M).invert();VT_R.origin.copy(O).applyMatrix4(VT_I);VT_R.direction.copy(D).transformDirection(VT_I);
      if(!VT_R.intersectBox(bb,VT_Q))continue;VT_Q.applyMatrix4(VT_M);const d=VT_Q.distanceTo(O);if(d<=far&&(!best||d<best.distance))best={point:VT_Q.clone(),distance:d};}}
  return best;}
function vtShift(x,z){const q={x,z};resolve(q,0.35);return Math.hypot(q.x-x,q.z-z);}
function vtProbe(){const P=player,fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),f0=P.feet;
  if(vtShift(P.x+fx*0.55,P.z+fz*0.55)<0.08)return null;   // delante no hay nada que corte el paso
  let dl=0;for(let d=0.7;d<=2.2;d+=0.1){if(vtShift(P.x+fx*d,P.z+fz*d)<0.02){dl=d+0.3;break;}}if(!dl)return null;   // demasiado grueso: es un edificio
  const lx=P.x+fx*dl,lz=P.z+fz*dl,fL=floorAt(lx,lz);if(!isFinite(fL)||fL-f0>0.8||f0-fL>2.5)return null;
  if(vtShift(lx,lz)>0.05)return null;
  let top=-1e9;for(let d=0.45;d<=dl-0.2;d+=0.15){const h=vtHit(P.x+fx*d,f0+2.4,P.z+fz*d,0,-1,0,2.6);if(h)top=Math.max(top,h.point.y);}
  const H=top-f0;if(!(H>=0.35&&H<=1.4))return null;
  if(vtHit(P.x,f0+1.75,P.z,fx,0,fz,dl))return null;   // a la altura del pecho hay pared: es una ventana o un muro alto
  return{lx,lz,top,fL,H};}
function vtGo(){const c=VT.can;if(!c||VT.on)return;const P=player,peak=c.top-P.feet+0.35,vy=Math.sqrt(2*16*Math.max(0.5,peak)),air=2*vy/16;
  VT.on={t:0,T:Math.max(0.42,air*0.82),sx:P.x,sz:P.z,lx:c.lx,lz:c.lz};VT.side=-VT.side;VT.can=null;P.vy=vy;P.grounded=false;P.jumps=1;
  try{gfPulse();}catch(e){}try{if(aOK())sfxTap();}catch(e){}
  if(!VT.seen){VT.seen=true;try{const z=state.vt||(state.vt={});if(!z.n){toast('<span class="label">Saltar</span><br>Apoyas una mano y pasas por encima de lado, sin perder el paso. Funciona con muretes, pilones y bancos bajos.');}z.n=(z.n||0)+1;}catch(e){}}}
// mientras dura el salto, el movimiento lo lleva el salto (las paredes planas no frenan)
{const f=tryMove;tryMove=function(nx,nz){if(VT.on)return true;return f(nx,nz);};}
{const f=interact;interact=function(){if(!focus&&VT.can&&ui==='play'){vtGo();return;}return f.apply(this,arguments);};}
{const f=uxTick;uxTick=function(dt){f(dt);try{vtTick(dt);}catch(e){}};}
function vtTick(dt){
  if(VT.on){const o=VT.on,P=player;o.t+=dt;const k=Math.min(1,o.t/o.T),e=k<0.5?2*k*k:1-Math.pow(-2*k+2,2)/2;P.x=o.sx+(o.lx-o.sx)*e;P.z=o.sz+(o.lz-o.sz)*e;
    const s=Math.sin(Math.PI*k);GF.roll=s*0.16*VT.side;const W=AVATAR.walk;if(W)W.rotation.z=-s*0.55*VT.side;
    if((k>=1&&P.grounded)||o.t>o.T+1.5){VT.on=null;if(W)W.rotation.z=0;try{if(state.vt&&state.vt.n%10===0)qAdd('ar',1,'Cada vez saltas con más soltura.');save();}catch(e){}}
    return;}
  VT.nearT-=dt;
  // en móvil, el botón de hablar también salta
  {const b=$('tTalk');if(b&&!b.dataset.vt){b.dataset.vt=1;const o=b.onclick;b.onclick=function(ev){if(ui==='play'&&!focus&&VT.can){vtGo();return;}return o&&o.call(this,ev);};}}
  VT.pt=(VT.pt||0)-dt;const mvd=Math.hypot(player.x-(VT.px||0),player.z-(VT.pz||0))>0.05||Math.abs(player.yaw-(VT.py||0))>0.06;   // quieto ante el mismo murete: no se vuelve a medir
  if(VT.pt<=0&&mvd){VT.pt=0.12;VT.px=player.x;VT.pz=player.z;VT.py=player.yaw;const ok=ui==='play'&&!FLY.on&&!BOAT.on&&!MOUNT.riding&&player.grounded&&!(typeof RF!=='undefined'&&RF.onRoof);VT.can=ok?vtProbe():null;}
  const p=$('prompt');if(VT.can&&!focus&&p){p.innerHTML='<kbd>E</kbd>Saltar el murete';p.hidden=false;}}
