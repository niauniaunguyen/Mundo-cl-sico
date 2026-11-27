// ============================================================ GRÁFICOS (7): diez propuestas (27/11)
//  GX1 sombra en la base de los muros (franjas oscuras en el suelo a lo largo de las paredes, con la rejilla de colisiones) ✓ ligero
//  GX2 manchas de sombra bajo personas, animales y figuras planas cuando no hay sombras de verdad ✓ ligero
//  GX3 de noche, luz de antorchas y faroles que LLEVA LA GENTE (en el 386 a.C. y en el 80 d.C. no había alumbrado público:
//     quien salía de noche llevaba antorcha o farol, o un esclavo se la llevaba) y lucernas en las puertas de tu casa ✓ ligero
//  GX4 puerto con vida: las velas de los barcos se inclinan y se hinchan con el viento; espuma que rompe en la orilla cercana
//  GX5 la hierba cambia de color con la estación (verde en primavera, dorada en verano, parda en otoño) ✓ ligero
//  GX6 paredes con vida: grafitis (en Roma, frases reales de Pompeya; en Atenas, aclamaciones «kalós» como las de los vasos)
//     y ropa tendida que se mueve con el viento
//  GX7 gestos: quien habla contigo mueve los brazos y asiente
//  GX8 el agua del impluvio de tu casa romana refleja el cielo y el atrio (un espejo de verdad, solo de cerca y fuera del modo ligero)
//  GX9 rayos de sol al amanecer y al atardecer, cuando hay nubes
//  GX10 color propio de cada momento: más cálido a mediodía en verano, más azul de noche, más gris con tormenta (fuera del modo ligero)
const GX7G={t:0,lite:false};
try{GX7G.lite=typeof ACC!=='undefined'&&!!ACC.lite;}catch(e){}
function gx7Grad(inner,outer,kind){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');let g;
  if(kind==='strip'){g=x.createLinearGradient(0,0,0,64);g.addColorStop(0,inner);g.addColorStop(1,outer);}else{g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,inner);g.addColorStop(1,outer);}
  x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);}
function gx7Inst(geo,mat,n){const m=new THREE.InstancedMesh(geo,mat,n);m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.count=0;m.frustumCulled=false;m.userData.noSeal=1;m.userData.noCull=1;m.userData.noInst=1;m.castShadow=m.receiveShadow=false;scene.add(m);return m;}
const _gx7M=new THREE.Matrix4(),_gx7Q=new THREE.Quaternion(),_gx7S=new THREE.Vector3(),_gx7P=new THREE.Vector3(),_gx7E=new THREE.Euler();
function gx7Set(m,i,x,y,z,ry,sx,sy,sz,rx){_gx7E.set(rx||0,ry,0,'YXZ');_gx7Q.setFromEuler(_gx7E);_gx7P.set(x,y,z);_gx7S.set(sx,sy,sz);_gx7M.compose(_gx7P,_gx7Q,_gx7S);m.setMatrixAt(i,_gx7M);}
// ---------------------------------------------------------------- GX1 base de los muros
const GX1={m:null,cx:1e9,cz:1e9};
function gx1Tick(){if(typeof cgrid==='undefined'||player.x>1e6)return;if(Math.hypot(player.x-GX1.cx,player.z-GX1.cz)<50)return;GX1.cx=player.x;GX1.cz=player.z;
  if(!GX1.m){const g=new THREE.PlaneGeometry(1,1);g.rotateX(-Math.PI/2);g.translate(0,0,0.5);GX1.m=gx7Inst(g,new THREE.MeshBasicMaterial({color:0x000000,alphaMap:gx7Grad('#ffffff','#000000','strip'),transparent:true,opacity:0.32,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,fog:true}),900);}
  const m=GX1.m,seen=new Set(),R=110,i0=Math.floor((player.x-R)/CELL),i1=Math.floor((player.x+R)/CELL),j0=Math.floor((player.z-R)/CELL),j1=Math.floor((player.z+R)/CELL);let n=0;
  for(let i=i0;i<=i1&&n<890;i++)for(let j=j0;j<=j1&&n<890;j++){const a=cgrid.get(ck(i,j));if(!a)continue;for(const o of a){if(!o.s||seen.has(o))continue;seen.add(o);const dx=o.x2-o.x1,dz=o.z2-o.z1,L=Math.hypot(dx,dz);if(L<1.5||L>60)continue;
    const mx=(o.x1+o.x2)/2,mz=(o.z1+o.z2)/2,ry=Math.atan2(-dz,dx),nx=-dz/L,nz=dx/L;for(const s of[-1,1]){if(n>=890)break;const px=mx+nx*s*(o.t+0.02),pz=mz+nz*s*(o.t+0.02),fy=floorAt(px+nx*s*0.5,pz+nz*s*0.5);if(!isFinite(fy))continue;
      gx7Set(m,n++,px,fy+0.03,pz,ry+(s<0?Math.PI:0),L,1,1.1);}}}
  m.count=n;m.instanceMatrix.needsUpdate=true;}
// ---------------------------------------------------------------- GX2 sombras de mancha
const GX2={m:null};
function gx2Tick(){if(!GX2.m){const g=new THREE.PlaneGeometry(1,1);g.rotateX(-Math.PI/2);GX2.m=gx7Inst(g,new THREE.MeshBasicMaterial({color:0x000000,alphaMap:gx7Grad('#ffffff','#000000'),transparent:true,opacity:0.42,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,fog:true}),400);}
  const m=GX2.m,noSh=!renderer.shadowMap.enabled;let n=0;const px=player.x,pz=player.z,add=(x,y,z,r)=>{if(n<400)gx7Set(m,n++,x,y+0.04,z,0,r,1,r);};
  if(typeof walkers!=='undefined')for(const w of walkers){if(!w.g)continue;const p=w.g.position,d=Math.abs(p.x-px)+Math.abs(p.z-pz);if(d>140)continue;if(w.imp||(noSh&&w.g.visible))add(p.x,p.y,p.z,0.9);}
  if(noSh){for(const o of npcObjs){if(!o.g||!o.g.visible)continue;const p=o.g.position;if(Math.abs(p.x-px)+Math.abs(p.z-pz)<80)add(p.x,p.y,p.z,0.9);}
    try{if(typeof QA!=='undefined'&&QA.act)for(const g of QA.act){const p=g.position;if(Math.abs(p.x-px)+Math.abs(p.z-pz)<80)add(p.x,p.y,p.z,1.4);}}catch(e){}
    try{if(typeof DOG!=='undefined'&&DOG.on){const p=DOG.on.A.g.position;add(p.x,p.y,p.z,0.7);}}catch(e){}
    try{if(typeof MOUNT!=='undefined'&&MOUNT.g&&MOUNT.g.visible){const p=MOUNT.g.position;add(p.x,p.y,p.z,1.8);}}catch(e){}
    if(ui==='play'&&!FLY.on&&!BOAT.on)add(player.x,player.feet,player.z,0.8);}
  m.count=n;m.instanceMatrix.needsUpdate=true;}
// ---------------------------------------------------------------- GX3 luz que lleva la gente de noche
const GX3={pts:null,glow:null,pos:null,lamps:null};
function gx3Night(){try{return sun.intensity<0.35&&(clock.h>18.5||clock.h<6.5);}catch(e){return false;}}
function gx3Tick(dt){const night=gx3Night();
  if(!GX3.pts){const N=160;GX3.pos=new Float32Array(N*3);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(GX3.pos,3));
    GX3.pts=new THREE.Points(g,new THREE.PointsMaterial({size:0.55,map:gx7Grad('rgba(255,236,170,1)','rgba(255,120,30,0)'),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));GX3.pts.frustumCulled=false;GX3.pts.userData.noSeal=1;GX3.pts.userData.noCull=1;scene.add(GX3.pts);
    const gg=new THREE.PlaneGeometry(1,1);gg.rotateX(-Math.PI/2);GX3.glow=gx7Inst(gg,new THREE.MeshBasicMaterial({color:0xffa040,alphaMap:gx7Grad('#ffffff','#000000'),transparent:true,opacity:0.5,depthWrite:false,blending:THREE.AdditiveBlending,fog:true}),160);}
  const P=GX3.pos,G=GX3.glow;let n=0;
  if(night&&typeof walkers!=='undefined'){const t=performance.now()/1000;for(const w of walkers){if(n>=150)break;if(!w.g||!(w.g.visible||w.imp)||w.home)continue;if(w.rk===undefined)w.rk=Math.random();if(((w.rk*997)%1)>0.35)continue;
      const p=w.g.position;if(Math.abs(p.x-player.x)+Math.abs(p.z-player.z)>220)continue;const a=w.g.rotation.y,hx=p.x+Math.cos(a)*0.35,hz=p.z-Math.sin(a)*0.35,fl=1+Math.sin(t*13+w.rk*40)*0.08;
      P[n*3]=hx;P[n*3+1]=p.y+1.75;P[n*3+2]=hz;gx7Set(G,n,hx,p.y+0.05,hz,0,7*fl,1,7*fl);n++;}}
  // lucernas en la puerta de casa
  try{if(night&&CASA&&CASA.X&&CASA.door&&n<158){const D=CASA.door;for(const s of[-1,1]){P[n*3]=D.x+s*1.4;P[n*3+1]=floorAt(D.x,D.z)+2.3;P[n*3+2]=D.z;gx7Set(G,n,D.x+s*1.4,floorAt(D.x,D.z)+0.05,D.z,0,5,1,5);n++;}}}catch(e){}
  GX3.pts.geometry.setDrawRange(0,n);GX3.pts.geometry.attributes.position.needsUpdate=true;GX3.pts.visible=n>0;G.count=n;G.instanceMatrix.needsUpdate=true;}
// ---------------------------------------------------------------- GX4 puerto con vida
const GX4={foam:null,pts:[],cx:1e9,cz:1e9,t:0,rings:[]};
function gx4Tick(dt){const w=(typeof WIND!=='undefined'&&WIND.s)?(WIND.s.value||0):0.5,t=performance.now()/1000;
  try{if(typeof X3!=='undefined')for(const S of X3.ships){if(!S.sail||!S.g.visible)continue;S.sail.scale.z=1+0.25*Math.min(1.5,w)+Math.sin(t*1.3+S.ph)*0.05;S.sail.rotation.x=Math.sin(t*0.9+S.ph)*0.05*w;}}catch(e){}
  if(GX7G.lite||player.x>1e6)return;
  if(Math.hypot(player.x-GX4.cx,player.z-GX4.cz)>80){GX4.cx=player.x;GX4.cz=player.z;GX4.pts=[];for(let k=0;k<160&&GX4.pts.length<40;k++){const a=k*2.399,r=20+(k%40)*5,x=player.x+Math.cos(a)*r,z=player.z+Math.sin(a)*r,h=terrainH(x,z);if(h>-0.6&&h<0.25&&terrainH(x+Math.cos(a)*6,z+Math.sin(a)*6)<-0.8)GX4.pts.push([x,z,a]);}}
  if(!GX4.foam){const g=new THREE.RingGeometry(0.6,1,24);g.rotateX(-Math.PI/2);GX4.foam=gx7Inst(g,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.35,depthWrite:false,fog:true}),60);}
  GX4.t+=dt;if(GX4.t>0.5&&GX4.pts.length){GX4.t=0;const p=GX4.pts[Math.floor(Math.random()*GX4.pts.length)];GX4.rings.push({x:p[0],z:p[1],a:0});if(GX4.rings.length>58)GX4.rings.shift();}
  let n=0;for(const R of GX4.rings){R.a+=dt;if(R.a>3)continue;const s=1+R.a*2.2;gx7Set(GX4.foam,n++,R.x,0.06,R.z,0,s,1,s*0.5);}
  GX4.rings=GX4.rings.filter(R=>R.a<=3);GX4.foam.count=n;GX4.foam.instanceMatrix.needsUpdate=true;GX4.foam.material.opacity=0.32;}
// ---------------------------------------------------------------- GX5 la hierba según la estación
const GX5={mo:-1};
function gx5Tick(){try{const mo=calNow().mo;if(mo===GX5.mo||!GR||!GR.mesh)return;GX5.mo=mo;const T={0:[0.92,0.98,0.88],1:[0.95,1.02,0.9],2:[1,1.05,0.95],3:[1,1.06,0.95],4:[1.04,1.03,0.86],5:[1.12,1.02,0.7],6:[1.18,1.0,0.62],7:[1.2,0.98,0.6],8:[1.12,0.95,0.68],9:[1.05,0.92,0.72],10:[0.98,0.95,0.8],11:[0.93,0.97,0.86]}[mo];
  const ms=Array.isArray(GR.mesh.material)?GR.mesh.material:[GR.mesh.material];for(const m of ms)if(m&&m.color)m.color.setRGB(T[0],T[1],T[2]);}catch(e){}}
// ---------------------------------------------------------------- GX6 grafitis y ropa tendida
const GX6={g:null,cx:1e9,cz:1e9,cloth:[],busy:false};
const V6_TXT={R:['ADMIROR · O · PARIES · TE · NON · CECIDISSE','QVISQVIS · AMAT · VALEAT','EPAPHRA · PILICREPVS · NON · ES','ROTAS · OPERA · TENET · AREPO · SATOR','FELICITER'],A:['ΚΑΛΟΣ','Ο · ΠΑΙΣ · ΚΑΛΟΣ','Η · ΠΑΙΣ · ΚΑΛΗ','ΧΑΙΡΕ']};
// Roma: grafitis reales de Pompeya (CIL IV 1904, 1173, 1926; el cuadrado SATOR, 8623); Atenas: aclamaciones «kalós/kalé» («es guapo/guapa»), frecuentes en vasos y paredes.
function gx6Tex(t){const c=document.createElement('canvas');c.width=512;c.height=64;const x=c.getContext('2d');x.font='bold 34px serif';x.fillStyle='rgba(60,30,20,0.85)';x.textBaseline='middle';x.fillText(t,8,34);
  x.globalCompositeOperation='destination-out';for(let i=0;i<300;i++){x.fillStyle='rgba(0,0,0,'+(Math.random()*0.6)+')';x.fillRect(Math.random()*512,Math.random()*64,2,2);}const tx=new THREE.CanvasTexture(c);return tx;}
function gx6Build(){if(GX6.busy||typeof cgrid==='undefined'||player.x>8000)return;if(Math.hypot(player.x-GX6.cx,player.z-GX6.cz)<70)return;GX6.cx=player.x;GX6.cz=player.z;
  if(GX6.g){scene.remove(GX6.g);GX6.cloth=[];}const g=new THREE.Group();g.userData.noSeal=1;g.userData.noInst=1;scene.add(g);GX6.g=g;const ro=MODE==='roma',L=V6_TXT[ro?'R':'A'];
  const near=(typeof CULL!=='undefined')?CULL.reg.filter(e=>e.o&&e.o.parent===scene&&Math.hypot(e.cx-player.x,e.cz-player.z)<90&&e.r>2&&e.r<40).map(e=>e.o):[];if(!near.length)return;
  const rc=new THREE.Raycaster(),seen=new Set();let ng=0,nc=0;const R=60;
  for(let i=Math.floor((player.x-R)/CELL);i<=Math.floor((player.x+R)/CELL);i++)for(let j=Math.floor((player.z-R)/CELL);j<=Math.floor((player.z+R)/CELL);j++){const a=cgrid.get(ck(i,j));if(!a)continue;
    for(const o of a){if(!o.s||seen.has(o)||ng+nc>=14)continue;seen.add(o);const dx=o.x2-o.x1,dz=o.z2-o.z1,Lg=Math.hypot(dx,dz);if(Lg<4||Lg>30)continue;const hsh=Math.abs(Math.sin(o.x1*12.9898+o.z1*78.233)*43758.5453)%1;if(hsh>0.12)continue;
      const mx=(o.x1+o.x2)/2,mz=(o.z1+o.z2)/2,nx=-dz/Lg,nz=dx/Lg,s=hsh<0.06?1:-1,fx=mx+nx*s*(o.t+1.2),fz=mz+nz*s*(o.t+1.2),fy=floorAt(fx,fz);
      rc.set(new THREE.Vector3(fx,fy+2.6,fz),new THREE.Vector3(-nx*s,0,-nz*s));rc.far=3;const hit=rc.intersectObjects(near,true)[0];if(!hit)continue;const wx=hit.point.x+nx*s*0.03,wz=hit.point.z+nz*s*0.03,ry=Math.atan2(nx*s,nz*s);
      if(hsh<0.07&&ng<8){const t=L[Math.floor(hsh*1000)%L.length],m=new THREE.Mesh(new THREE.PlaneGeometry(2.2,0.28),new THREE.MeshLambertMaterial({map:gx6Tex(t),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));m.position.set(wx,fy+1.5,wz);m.rotation.y=ry;g.add(m);ng++;}
      else if(nc<6){const rope=new THREE.Mesh(new THREE.BoxGeometry(Math.min(4,Lg*0.6),0.02,0.02),lam('#8a7a5a'));rope.position.set(wx+nx*s*0.25,fy+2.5,wz+nz*s*0.25);rope.rotation.y=ry+Math.PI/2;g.add(rope);
        for(let k=0;k<3;k++){const c=new THREE.Mesh(new THREE.PlaneGeometry(0.7,0.9),new THREE.MeshLambertMaterial({color:['#e8e0d0','#b8553d','#6a7a9a','#d9b44a'][(k+nc)%4],side:THREE.DoubleSide}));c.geometry.translate(0,-0.45,0);
          const off=(k-1)*Math.min(1.2,Lg*0.18);c.position.set(rope.position.x+Math.cos(ry)*off,fy+2.5,rope.position.z-Math.sin(ry)*off);c.rotation.y=ry;g.add(c);GX6.cloth.push(c);}nc++;}}}}
function gx6Tick(dt){const w=(typeof WIND!=='undefined'&&WIND.s)?(WIND.s.value||0):0.5,t=performance.now()/1000;let i=0;for(const c of GX6.cloth){c.rotation.x=0.12*w+Math.sin(t*2.2+i)*0.12*(0.3+w);i++;}}
// ---------------------------------------------------------------- GX7 gestos al hablar
const GX7={g:null,t:0,head:null};
function gx7Tick(dt){let g=null;try{if(ui==='dialog'&&focus&&focus.kind==='npc'&&focus.g)g=focus.g;}catch(e){}
  if(g!==GX7.g){if(GX7.g){const a=GX7.g.userData.arms;if(a&&a[0]){a[0].rotation.x=0;a[1].rotation.x=0;}if(GX7.head)GX7.head.rotation.x=GX7.h0||0;}GX7.g=g;GX7.t=0;GX7.head=null;
    if(g){g.traverse(o=>{if(!GX7.head&&o.isBone&&/head|cabeza/i.test(o.name))GX7.head=o;});if(GX7.head)GX7.h0=GX7.head.rotation.x;}}
  if(!g)return;GX7.t+=dt;const a=g.userData.arms,t=GX7.t;if(a&&a[0]&&a[0].rotation){a[0].rotation.x=-0.25-0.25*Math.max(0,Math.sin(t*2.1));a[1].rotation.x=-0.1*Math.max(0,Math.sin(t*1.3+1));}
  if(GX7.head)GX7.head.rotation.x=(GX7.h0||0)+Math.sin(t*3.1)*0.06+(Math.sin(t*0.7)>0.6?0.08:0);}
// ---------------------------------------------------------------- GX8 el impluvio refleja
const GX8={m:null,rt:null,cam:null,tm:new THREE.Matrix4(),f:0};
function gx8Find(){if(GX8.m!==null||MODE!=='roma'||!CASA||!CASA.X)return;GX8.m=false;const mat=typeof matCache!=='undefined'?matCache['#7fa6b4']:null;if(!mat)return;let best=null;
  scene.traverse(o=>{if(best||!o.isMesh||o.material!==mat)return;const p=new THREE.Vector3();o.getWorldPosition(p);if(Math.hypot(p.x-CASA.X,p.z-(CASA.Z+3))<1.5)best=o;});if(!best)return;
  GX8.rt=new THREE.WebGLRenderTarget(256,256);GX8.cam=new THREE.PerspectiveCamera();const geo=new THREE.PlaneGeometry(3.9,4.9);geo.rotateX(-Math.PI/2);
  const sm=new THREE.ShaderMaterial({uniforms:{tex:{value:GX8.rt.texture},tm:{value:GX8.tm},uT:{value:0}},vertexShader:'uniform mat4 tm;varying vec4 vU;varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;vU=tm*w;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader:'uniform sampler2D tex;uniform float uT;varying vec4 vU;varying vec3 vW;void main(){vec2 uv=vU.xy/vU.w;uv+=vec2(sin(vW.x*6.0+uT*1.5),cos(vW.z*7.0+uT*1.2))*0.004;vec3 c=texture2D(tex,uv).rgb;gl_FragColor=vec4(mix(c,vec3(0.35,0.5,0.55),0.35),1.0);\n#include <encodings_fragment>\n}'});
  const p=new THREE.Vector3();best.getWorldPosition(p);const m=new THREE.Mesh(geo,sm);m.position.set(p.x,p.y+0.105,p.z);m.userData.noSeal=1;m.userData.noInst=1;scene.add(m);GX8.m=m;}
function gx8Tick(dt){if(GX7G.lite)return;gx8Find();const m=GX8.m;if(!m)return;const d=Math.hypot(camera.position.x-m.position.x,camera.position.z-m.position.z);m.visible=d<60;if(d>22||(++GX8.f%2))return;
  const h=m.position.y,c=GX8.cam;c.copy(camera);c.position.y=2*h-camera.position.y;const dir=new THREE.Vector3();camera.getWorldDirection(dir);dir.y=-dir.y;c.up.set(0,-1,0);c.lookAt(c.position.clone().add(dir));c.up.set(0,1,0);
  c.aspect=camera.aspect;c.updateProjectionMatrix();c.updateMatrixWorld();GX8.tm.set(0.5,0,0,0.5,0,0.5,0,0.5,0,0,0.5,0.5,0,0,0,1).multiply(c.projectionMatrix).multiply(c.matrixWorldInverse);
  m.visible=false;const old=renderer.getRenderTarget(),sh=renderer.shadowMap.autoUpdate;renderer.shadowMap.autoUpdate=false;try{renderer.setRenderTarget(GX8.rt);renderer.clear();renderer.render(scene,c);}catch(e){}renderer.setRenderTarget(old);renderer.shadowMap.autoUpdate=sh;m.visible=true;m.material.uniforms.uT.value+=dt*2;}
// ---------------------------------------------------------------- GX9 rayos de sol
const GX9={s:null};
function gx9Tex(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.translate(128,128);for(let i=0;i<22;i++){const a=i/22*Math.PI*2+Math.random()*0.1,w=0.03+Math.random()*0.05;
  const g=x.createLinearGradient(0,0,Math.cos(a)*128,Math.sin(a)*128);g.addColorStop(0,'rgba(255,230,180,0.5)');g.addColorStop(1,'rgba(255,200,150,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,0);x.arc(0,0,128,a-w,a+w);x.fill();}return new THREE.CanvasTexture(c);}
function gx9Tick(){if(GX7G.lite)return;if(!GX9.s){GX9.s=new THREE.Sprite(new THREE.SpriteMaterial({map:gx9Tex(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false,opacity:0}));GX9.s.userData.noSeal=1;GX9.s.userData.noCull=1;GX9.s.frustumCulled=false;scene.add(GX9.s);}
  let e=0;try{e=SUNDIR.y;}catch(x){}const cl=(typeof WXS!=='undefined'?WXS.cl:0)||0,low=e>0.0&&e<0.28,k=low?(1-e/0.28)*(0.25+0.75*Math.min(1,cl+0.3))*(1-(WXS&&WXS.rain||0)):0;
  const s=GX9.s;s.visible=k>0.02;if(!s.visible)return;s.material.opacity=0.55*k;const d=900;s.position.set(camera.position.x+SUNDIR.x*d,camera.position.y+SUNDIR.y*d,camera.position.z+SUNDIR.z*d);s.scale.set(900,900,1);s.material.rotation+=0.0004;}
// ---------------------------------------------------------------- GX10 color de cada momento
const GX10={last:''};
function gx10Tick(){const el=renderer.domElement;if(GX7G.lite||ui==='start'){if(GX10.last){el.style.filter='';GX10.last='';}return;}let f;
  try{const h=clock.h,night=sun.intensity<0.3,rain=(typeof WXS!=='undefined'&&(WXS.rain>0.3||WXS.cl>0.7)),mo=calNow().mo,summer=mo>=5&&mo<=8,ro=MODE==='roma';
    if(night)f='saturate(0.88) hue-rotate(-6deg)';else if(rain)f='saturate(0.82) contrast(0.97)';else if(h>=17.5||h<8)f='saturate(1.1) sepia(0.1)';else if(summer&&h>11&&h<16)f='saturate(1.06) sepia('+(ro?0.07:0.05)+') contrast(1.03)';else f='saturate(1.04)';}catch(e){f='';}
  if(f!==GX10.last){GX10.last=f;el.style.filter=f;}}
// ---------------------------------------------------------------- bucle
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start'){gx10Tick();return r;}GX7G.t+=dt;
  gx2Tick();gx3Tick(dt);gx4Tick(dt);gx6Tick(dt);gx7Tick(dt);gx8Tick(dt);
  if(GX7G.t>0.5){GX7G.t=0;gx1Tick();gx5Tick();gx6Build();gx9Tick();gx10Tick();}}catch(e){if(!GX7G.err){GX7G.err=1;console.warn('v7',e);}}return r;};}
