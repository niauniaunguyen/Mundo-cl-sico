// ============================================================ caballo
// H lo llama (llega al galope desde atrás); cerca de él, E para montar (como todo lo demás) y H para bajar. Montado se va al triple de velocidad.
const MOUNT={g:null,legs:[],st:'away',ph:0,riding:false,v:0,tc:0};
// la manta (ephippium) se ciñe al lomo: con rayos se mide la superficie del caballo en varios cortes y ángulos, y la manta se pega
// a ella 2 cm por fuera (antes era una losa plana que sobresalía por los lados)
function horseCloth(g){g.updateMatrixWorld(true);const ms=[];g.traverse(o=>{if(o.isMesh)ms.push(o);});if(!ms.length)throw 0;
  const bb=new THREE.Box3().setFromObject(g),rc=new THREE.Raycaster(),o=new THREE.Vector3(),d=new THREE.Vector3(),gi=new THREE.Matrix4().copy(g.matrixWorld).invert();
  const top=(z)=>{o.set(0,bb.max.y+1,z).applyMatrix4(g.matrixWorld);rc.set(o,d.set(0,-1,0));const h=rc.intersectObjects(ms,false)[0];return h?h.point.clone().applyMatrix4(gi).y:null;};
  const z0=0.1,ty=top(z0);if(ty===null)throw 0;const cy=ty-0.42,A=[],NA=15,NZ=6,amax=1.15,L=0.95;
  const surf=(a,z)=>{const dx=Math.sin(a),dy=Math.cos(a);const c=new THREE.Vector3(0,cy,z).applyMatrix4(g.matrixWorld),dir=new THREE.Vector3(dx,dy,0).transformDirection(g.matrixWorld);
    rc.set(c.clone().addScaledVector(dir,2),dir.clone().negate());const h=rc.intersectObjects(ms,false)[0];if(!h)return null;const p=h.point.applyMatrix4(gi);return [p.x+dx*0.02,p.y+dy*0.02,z];};
  const grid=(a0,a1,na,mat)=>{const pos=[],idx=[];for(let j=0;j<NZ;j++){const z=z0-L/2+L*j/(NZ-1);for(let i=0;i<na;i++){const a=a0+(a1-a0)*i/(na-1);let p=surf(a,z);if(!p)p=[Math.sin(a)*0.42,cy+Math.cos(a)*0.42,z];pos.push(...p);}}
    for(let j=0;j<NZ-1;j++)for(let i=0;i<na-1;i++){const k=j*na+i;idx.push(k,k+na,k+1,k+1,k+na,k+na+1);}
    const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));ge.setIndex(idx);ge.computeVertexNormals();const m=new THREE.Mesh(ge,mat);m.material.side=THREE.DoubleSide;m.castShadow=true;g.add(m);};
  grid(-amax,amax,NA,lam('#a8392b'));for(const sg of[-1,1])grid(sg>0?amax:-amax-0.1,sg>0?amax+0.1:-amax,2,lam('#d9a93a'));}   // la orla dorada, en los bordes de abajo
function buildMount(){
  const g=new THREE.Group();g.visible=false;scene.add(g);MOUNT.g=g;
  if(GLB.ok){MOUNT.legs=animalGLB('A_horse',g,'#5a3a22','#1e140e');
    try{horseCloth(g);}catch(e){box(0.8,0.05,0.95,lam('#a8392b'),0,1.76,0.1,g);}}   // manta con orla, ceñida al lomo
  else{const c=lam('#5a3a22'),dk=lam('#1e140e');box(0.75,0.8,1.95,c,0,1.55,0,g);box(0.35,0.9,0.35,c,0,2.2,0.95,g).rotation.x=0.5;box(0.33,0.36,0.8,c,0,2.6,1.3,g);box(0.8,0.06,0.9,lam('#a8392b'),0,1.98,0,g);
    MOUNT.legs=[[0.25,0.75],[-0.25,0.75],[0.25,-0.75],[-0.25,-0.75]].map(([x,z])=>{const p=new THREE.Group();p.position.set(x,1.2,z);box(0.15,1.2,0.15,dk,0,-0.6,0,p);g.add(p);return p;});}
}
function horseNear(){const g=MOUNT.g;return g&&g.visible&&!MOUNT.riding&&MOUNT.st==='idle'&&Math.hypot(g.position.x-player.x,g.position.z-player.z)<4.5;}
function callHorse(){
  if(ui!=='play'||!MOUNT.g)return;
  if(MOUNT.riding){dismount();return;}
  if(!hz().own){toast(MODE==='roma'?'Aún no tienes caballo. Félix, el auriga de los Verdes, te dará uno si le haces un favor.':'Aún no tienes caballo. Eudico de Larisa, el criador de caballos tesalio del Ágora, te dará uno si le haces un favor.');return;}
  if(horseNear()){toast('Tu caballo está a tu lado: pulsa <b>'+(isTouch?'la mano naranja':'E')+'</b> para montar.');return;}   // se monta con E, como todo lo demás
  let d=35,fx,fz;
  for(;d>4;d-=8){[fx,fz]=findFree(player.x+Math.sin(player.yaw)*d,player.z+Math.cos(player.yaw)*d,1.2);if(floorAt(fx,fz)>-0.5&&Math.abs(floorAt(fx,fz)-player.feet)<25)break;}
  MOUNT.g.position.set(fx,floorAt(fx,fz),fz);MOUNT.g.visible=true;MOUNT.st='coming';MOUNT.tc=0;sfxWhistle();
  toast('Silbas. A lo lejos se oye un galope.');
}
function mountHorse(){
  MOUNT.riding=true;MOUNT.st='ridden';player.eye=2.55;updateStats();
  toast('Montas a '+(hz().own?horseName():'caballo')+': vas al triple de velocidad (Shift para galopar). Pulsa <b>'+(isTouch?'el botón del caballo':'H')+'</b> para bajar.');
}
function dismount(){
  MOUNT.riding=false;MOUNT.st='idle';player.eye=1.62;updateStats();
  const rx=Math.cos(player.yaw),rz=-Math.sin(player.yaw);const p={x:player.x-rx*1.5,z:player.z-rz*1.5};resolve(p,0.35);
  if(Math.abs(floorAt(p.x,p.z)-player.feet)<0.7){player.x=p.x;player.z=p.z;}
}
function updateMount(dt){
  const M2=MOUNT,g=M2.g;if(!g||!g.visible)return;let sp=0;
  if(M2.riding){sp=Math.hypot(player.x-g.position.x,player.z-g.position.z)/Math.max(dt,1e-3);g.position.set(player.x,player.feet,player.z);g.rotation.y+=wrapA(player.yaw+Math.PI-g.rotation.y)*Math.min(1,dt*10);}
  else if(M2.st==='coming'){M2.tc+=dt;const dx=player.x-g.position.x,dz=player.z-g.position.z,d=Math.hypot(dx,dz);
    if(d<4.8||M2.tc>9){if(d>=4.8){const[fx,fz]=findFree(player.x+Math.sin(player.yaw)*3,player.z+Math.cos(player.yaw)*3,1);g.position.set(fx,floorAt(fx,fz),fz);}
      M2.st='idle';toast((hz().own?horseName():'El caballo')+' ha llegado. Pulsa <b>'+(isTouch?'la mano naranja':'E')+'</b> para montar.');}
    else{const st=Math.min(d-4,11*dt),p={x:g.position.x+dx/d*st,z:g.position.z+dz/d*st};resolve(p,0.6);g.position.set(p.x,floorAt(p.x,p.z),p.z);g.rotation.y+=wrapA(Math.atan2(dx,dz)-g.rotation.y)*Math.min(1,dt*6);sp=11;}}
  else g.position.y=floorAt(g.position.x,g.position.z);
  // patas en diagonal: paso, trote o galope según la velocidad
  M2.v=lerp(M2.v,Math.min(sp,40),1-Math.exp(-dt*6));const v=M2.v;M2.ph+=dt*(1.5+v*0.5);
  const amp=Math.min(0.6,v*0.05),s1=Math.sin(M2.ph)*amp;
  if(M2.legs.length===4){M2.legs[0].rotation.x=s1;M2.legs[3].rotation.x=s1;M2.legs[1].rotation.x=-s1;M2.legs[2].rotation.x=-s1;}
  g.position.y+=Math.abs(Math.sin(M2.ph))*Math.min(0.08,v*0.006);
}
// ------------------------------------------------------------ jinete, avatar y vista (V: primera o tercera persona)
// Montado se ven las piernas, el torso, los brazos y las riendas; en tercera persona, el jinete entero (o el avatar a pie).
const AVATAR={walk:null,rider:null,riderHead:[],view3:false,ph:0,lx:null,lz:null};
function playerLook(){if(pjFem())return MODE==='roma'?{female:true,chiton:'#e9dfcb',himation:'#7a3a5e',hair:'#3b2a1e',beard:false}:{female:true,chiton:'#e8dfcc',himation:'#8a5a3a',hair:'#3b2a1e',beard:false};return MODE==='roma'?(typeof fxEsCiu==='function'&&fxEsCiu()?{toga:true,chiton:'#efe9dc',himation:'#f3eee2',hair:'#3b2a1e',beard:false}:{chiton:'#e9dfcb',himation:'#9a3f2f',hair:'#3b2a1e',beard:false,short:true}):{chiton:'#e8dfcc',himation:'#4f6a7d',hair:'#3b2a1e',beard:true};}
function buildAvatar(){
  const L=playerLook();
  AVATAR.walk=makePerson(Object.assign({noVary:true,skin:'#c99a74'},L,MODE==='roma'?{short:true,noHimation:true}:{}));AVATAR.walk.visible=false;scene.add(AVATAR.walk);
  if(!GLB.ok||!MOUNT.g)return;
  const g=new THREE.Group(),ro={cloth:lam(L.chiton),skin:lam('#c99a74'),hair:lam(L.hair),eye:lam('#1a120c')};
  const add=n=>{const p=glbPart(n,ro);if(p)g.add(p);return p;};
  add('P_rider_body');add('P_rider_legs');
  AVATAR.riderHead=[add('P_head'),add('P_eyes'),add('P_hair_m'),L.beard?add('P_beard'):null].filter(Boolean);
  const hands=[];
  ['l','r'].forEach((k,i)=>{const a=glbPart('P_arm_'+k,ro),s=glbPart('P_sleeve_'+k,ro);s.position.set(0,0,0);a.add(s);a.rotation.x=-0.95;a.rotation.z=i?-0.18:0.18;g.add(a);
    const h=new THREE.Object3D();h.position.set(i?0.035:-0.035,-0.64,0.085);a.add(h);hands.push(h);});
  g.position.set(0,0.8,0.02);g.visible=false;MOUNT.g.add(g);AVATAR.rider=g;
  // riendas: de las manos al bocado del caballo
  MOUNT.g.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(MOUNT.g.matrixWorld).invert();
  const hp=hands.map(h=>h.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv));const mouth=new THREE.Vector3(0,1.72,1.38);
  const rg=new THREE.BufferGeometry().setFromPoints([hp[0],mouth,hp[1]]);const reins=new THREE.Line(rg,new THREE.LineBasicMaterial({color:'#3a2414'}));g.add(reins);reins.position.set(0,-0.8,-0.02);
}
// ------------------------------------------------------------ antorcha de mano (F): la luz está siempre en la escena, apagada, para no recompilar los materiales al encenderla
const TORCH={on:false,g:null,light:null,fl:null,hint:false};
function buildHandTorch(){
  const L=new THREE.PointLight(0xffa04a,0,34,1.3);scene.add(L);TORCH.light=L;
  const g=new THREE.Group();const st=new THREE.Mesh(new THREE.CylinderGeometry(0.022,0.032,0.6,6),lam('#4a3324'));st.position.y=-0.24;g.add(st);
  const hd=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.034,0.14,7),lam('#2a1d14'));hd.position.y=0.11;g.add(hd);
  const fl=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,fog:false}));fl.position.y=0.3;fl.scale.set(0.24,0.36,1);g.add(fl);TORCH.fl=fl;
  g.visible=false;scene.add(g);TORCH.g=g;
}
function toggleTorch(){if(ui!=='play'||!TORCH.g)return;TORCH.on=!TORCH.on;TORCH.hint=true;
  toast(TORCH.on?'Enciendes una antorcha de teas de pino untadas de resina. Pulsa <b>F</b> para apagarla.':'Apagas la antorcha.');}
const _tv=new THREE.Vector3();
function updateTorch(dt,t){
  if(!TORCH.g)return;const on=TORCH.on&&(ui==='play'||ui==='dialog');TORCH.g.visible=on;
  if(!TORCH.hint&&ui==='play'&&DAYF<0.25){TORCH.hint=true;toast('Se ha hecho de noche. Pulsa <b>'+(isTouch?'el botón de la antorcha':'F')+'</b> para encender una antorcha.');}
  if(!on){TORCH.light.intensity=0;return;}
  const f=1+Math.sin(t*11)*0.07+Math.sin(t*27+1.3)*0.05+Math.sin(t*4.1)*0.04;
  if(AVATAR.view3){   // tercera persona: en la mano del personaje (a pie o a caballo), no delante de la cámara
    const body=MOUNT.riding?AVATAR.rider:AVATAR.walk,arm=body&&body.visible!==false&&body.userData.arms&&body.userData.arms[1];
    if(arm){arm.rotation.x=-0.75;body.updateMatrixWorld(true);_tv.set(0,-0.55,0.06);arm.localToWorld(_tv);TORCH.g.position.copy(_tv);TORCH.g.rotation.set(0,player.yaw,0);TORCH.g.rotateX(-0.25);}
    else{const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw),rx=Math.cos(player.yaw),rz=-Math.sin(player.yaw);TORCH.g.position.set(player.x+rx*0.34+fx*0.28,player.feet+(MOUNT.riding?2.3:1.45),player.z+rz*0.34+fz*0.28);TORCH.g.rotation.set(0,0,0);}}
  else{camera.updateMatrixWorld();_tv.set(0.36,-0.34,-0.95);camera.localToWorld(_tv);TORCH.g.position.copy(_tv);TORCH.g.quaternion.copy(camera.quaternion);TORCH.g.rotateX(0.35);TORCH.g.rotateZ(-0.25);}
  TORCH.fl.scale.set(0.24*f,0.36*f,1);
  TORCH.g.getWorldPosition(_tv);TORCH.light.position.set(_tv.x,_tv.y+0.45,_tv.z);
  TORCH.light.intensity=(1.25+0.9*(1-DAYF))*f;
}
function toggleView(){AVATAR.view3=!AVATAR.view3;toast(AVATAR.view3?'Vista en tercera persona. Pulsa <b>V</b> para volver.':'Vista en primera persona.');}
function updateAvatar(dt,t){
  const mdx=AVATAR.lx===null?0:player.x-AVATAR.lx,mdz=AVATAR.lx===null?0:player.z-AVATAR.lz,moved=Math.hypot(mdx,mdz);AVATAR.lx=player.x;AVATAR.lz=player.z;
  const w=AVATAR.walk;if(w){w.visible=AVATAR.view3&&!MOUNT.riding&&ui!=='start'&&ui!=='episode';
    if(w.visible){w.position.set(player.x,player.feet,player.z);w.rotation.y=player.yaw+Math.PI;const v=moved/Math.max(dt,1e-3);if(v>0.3)AVATAR.ph+=Math.min(moved,1)*(keys.run?3.4:4.6);
      if(typeof FLY!=='undefined'&&FLY.on){// volando no se andan las piernas: el cuerpo se inclina hacia donde vas (adelante, atrás, a los lados)
        personWalk(w,0,0);const id=1/Math.max(dt,1e-3),fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw),rx=Math.cos(player.yaw),rz=-Math.sin(player.yaw);
        const vf=(mdx*fx+mdz*fz)*id,vr=(mdx*rx+mdz*rz)*id,tp=clamp(vf/14,-1,1)*0.75,tr=clamp(vr/14,-1,1)*0.5,k=Math.min(1,dt*4);
        AVATAR.pt=(AVATAR.pt||0)+(tp-(AVATAR.pt||0))*k;AVATAR.rl=(AVATAR.rl||0)+(tr-(AVATAR.rl||0))*k;
        w.rotation.order='YXZ';w.rotation.x=-AVATAR.pt;w.rotation.z=AVATAR.rl;w.position.y+=0.9*Math.abs(Math.sin(AVATAR.pt));}
      else{if(w.rotation.x||w.rotation.z){w.rotation.x=0;w.rotation.z=0;AVATAR.pt=0;AVATAR.rl=0;}
      personWalk(w,AVATAR.ph,v>0.3?(keys.run?1.25:1):0);w.position.y+=v>0.3?Math.abs(Math.sin(AVATAR.ph))*0.05:0;}}}
  if(AVATAR.rider){AVATAR.rider.visible=MOUNT.riding;for(const h of AVATAR.riderHead)h.visible=AVATAR.view3;}
}
// cámara de diálogo: al hablar con alguien, la cámara se acerca y encuadra a esa persona; al terminar, vuelve con suavidad
const TCAM={on:false,k:0,t0:0,tx:0,ty:0,tz:0,q:null,p:null};
function talkCamera(){const now=performance.now(),dt=Math.min(0.1,TCAM.t0?(now-TCAM.t0)/1000:0);TCAM.t0=now;
  if(ui==='dialog'&&!(typeof SET!=='undefined'&&SET&&SET.talkCam===false)){if(TCAM.on===false){const f=typeof focus!=='undefined'?focus:null;
      if(f&&isFinite(f.x)&&f.kind!=='sign'&&Math.hypot(f.x-player.x,f.z-player.z)<8){TCAM.on=true;TCAM.tx=f.x;TCAM.tz=f.z;TCAM.ty=(f.y!==undefined&&f.kind==='egx'?f.y:floorAt(f.x,f.z))+(f.kind==='god'?2.4:1.55);}else TCAM.on='no';}}
  else TCAM.on=false;
  const goal=TCAM.on===true?1:0;TCAM.k+=(goal-TCAM.k)*Math.min(1,dt*(goal?3.2:4.5));if(TCAM.k<0.002){TCAM.k=0;return;}
  let dx=player.x-TCAM.tx,dz=player.z-TCAM.tz,l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const sx=-dz,sz=dx;
  const px=TCAM.tx+dx*2.9+sx*0.9,pz=TCAM.tz+dz*2.9+sz*0.9,py=Math.max(TCAM.ty+0.05,floorAt(px,pz)+1.2);
  const k=sstep(TCAM.k),P=TCAM.p||(TCAM.p=new THREE.Vector3()),Q=TCAM.q||(TCAM.q=new THREE.Quaternion()),q0=camera.quaternion.clone();
  P.set(px,py,pz);camera.position.lerp(P,k);
  const m=new THREE.Matrix4().lookAt(P,new THREE.Vector3(TCAM.tx-sx*0.3,TCAM.ty-1.05,TCAM.tz-sz*0.3),camera.up);Q.setFromRotationMatrix(m);
  camera.quaternion.copy(q0).slerp(Q,k);}
function placeCamera(){
  placeCamera0();talkCamera();}
function placeCamera0(){
  const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw);
  if(AVATAR.view3&&ui!=='start'){const back=MOUNT.riding?7.5:5,up=MOUNT.riding?2.0:1.5;let bk=back;{for(let t=0.6;t<=back;t+=0.3){const qx=player.x-fx*t,qz=player.z-fz*t;if(!isFree(qx,qz,0.25)||floorAt(qx,qz)>player.camY+up-0.3){bk=Math.max(0.6,t-0.45);break;}}}TCAM.bk=TCAM.bk==null?bk:(bk<TCAM.bk?bk:TCAM.bk+(bk-TCAM.bk)*0.08);   // la cámara no se mete en las paredes ni en el monte: se acerca (y se aleja despacio)
    let cx=player.x-fx*TCAM.bk,cz=player.z-fz*TCAM.bk,cy=player.camY+up-player.pitch*3;
    cy=Math.max(cy,floorAt(cx,cz)+0.8);camera.position.set(cx,cy,cz);camera.lookAt(player.x+fx*2,player.camY-0.2+player.pitch*3,player.z+fz*2);gfCam(true);}
  else{const k=MOUNT.riding?0.24:0;camera.position.set(player.x+fx*k,player.camY,player.z+fz*k);camera.rotation.set(player.pitch,player.yaw,0);if(ui!=='start')gfCam(false);}
}

// ------------------------------------------------------------ minimapa (siempre visible mientras se juega)
const MINI_R=230;
function drawMini(){
  const c=$('mini');if(!c)return;const cb=typeof crtBand==='function'&&MODE==='atenas'&&crtBand(player.x,player.z),x=c.getContext('2d'),W=c.width,key=cb?'crt_'+crtSegOf(player.z):regionOf(player.x),B=cb?(()=>{const z0=crtSegZ(crtSegOf(player.z));return{x0:CRT.X-450,x1:CRT.X+450,z0:z0-450,z1:z0+450};})():regionBounds(key);   // los tramos del interior de Creta tienen su propio plano
  if(!MAPC[key]||mapStale(MAPC[key])){const old=MB;MB=B;MAPC[key]=buildMapBase(900,760);MB=old;}
  const base=MAPC[key],kx=base.width/(B.x1-B.x0),kz=base.height/(B.z1-B.z0),R0=key==='atenas'?MINI_R:MINI_R*0.8;
  const P=(wx,wz)=>[(wx-player.x)/R0*W/2+W/2,(wz-player.z)/R0*W/2+W/2];
  x.save();x.clearRect(0,0,W,W);x.beginPath();x.arc(W/2,W/2,W/2-3,0,TAU);x.clip();x.fillStyle='#3a6a80';x.fillRect(0,0,W,W);
  x.drawImage(base,(player.x-R0-B.x0)*kx,(player.z-R0-B.z0)*kz,2*R0*kx,2*R0*kz,0,0,W,W);
  const dot=(p,r,fill,stroke)=>{if(p[0]<-6||p[1]<-6||p[0]>W+6||p[1]>W+6)return;x.beginPath();x.arc(p[0],p[1],r,0,TAU);x.fillStyle=fill;x.fill();if(stroke){x.strokeStyle=stroke;x.lineWidth=1.5;x.stroke();}};
  for(const s of signObjs){const p=P(s.x,s.z),ok=state.places.includes(s.data.id);x.fillStyle=ok?'#d9874a':'rgba(22,16,12,.6)';x.beginPath();x.moveTo(p[0],p[1]-5);x.lineTo(p[0]+4,p[1]);x.lineTo(p[0],p[1]+5);x.lineTo(p[0]-4,p[1]);x.closePath();x.fill();}
  for(const n of npcObjs)if(!n.hidden)dot(P(n.x,n.z),4.5,state.lessons.includes(n.data.id)?'#6f8a4e':'#f0b45c','#16100c');
  for(const c2 of captains)dot(P(c2.x,c2.z),4,'#2f5a7a','#e9dcc0');
  for(const o of godObjs)if(state.gods.met.includes(o.data.id)||o.g.visible)dot(P(o.x,o.z),5,'#ffe08a','#7a5a1a');
  for(const s of EPI.spheres){const p=P(s.x,s.z);if(p[0]>-6&&p[1]>-6&&p[0]<W+6&&p[1]<W+6)sphereIcon(x,p,4.5,epiDone(s.data));}
  if(MOUNT.g&&MOUNT.g.visible&&!MOUNT.riding)dot(P(MOUNT.g.position.x,MOUNT.g.position.z),4.5,'#7a4a2a','#f1e8d8');
  x.save();x.translate(W/2,W/2);x.rotate(-player.yaw);x.fillStyle='#a8392b';x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.moveTo(0,-11);x.lineTo(7,8);x.lineTo(0,4);x.lineTo(-7,8);x.closePath();x.fill();x.stroke();x.restore();
  x.restore();
  x.beginPath();x.arc(W/2,W/2,W/2-3,0,TAU);x.strokeStyle='rgba(217,135,74,.9)';x.lineWidth=4;x.stroke();
  x.fillStyle='#16100c';x.beginPath();x.arc(W/2,14,11,0,TAU);x.fill();x.fillStyle='#f1e8d8';x.font='bold 14px Georgia';x.textAlign='center';x.textBaseline='middle';x.fillText('N',W/2,15);
}


// personajes de las polis nuevas (386 a.C.)
const GREECE_NPCS2=[
{id:'euclides_megara',name:'Euclides de Mégara',title:'Filósofo, discípulo de Sócrates',glyph:'Ε',look:{chiton:'#e8dfcc',himation:'#5a4a3a',beard:true,hair:'#8d8a85',beardC:'#9a968e',staff:true},
 cat:'Filosofía',lesson:'La escuela de Mégara',where:'En Mégara, bajo el pórtico de su escuela',
 summary:'Euclides de Mégara (c. 435-365 a.C.), discípulo de Sócrates, fundó la escuela megárica. Unió la búsqueda socrática del bien con la doctrina de Parménides: el bien es uno solo, aunque reciba muchos nombres (sabiduría, dios, inteligencia), y lo contrario del bien no existe. Sus seguidores se hicieron famosos por sus argumentos y paradojas lógicas. Tras la muerte de Sócrates, en el 399, Platón y otros discípulos se refugiaron en su casa.',
 intro:'Bienvenido a Mégara, forastero. Soy Euclides. Fui alumno de Sócrates. Cuando Atenas prohibió a los megarenses entrar en la ciudad, yo me disfrazaba de mujer y caminaba de noche veinte millas para oírlo, y volvía antes del amanecer. Ahora enseño aquí. Pregunta lo que quieras: aquí discutir es una forma de amistad.',
 topics:[
  ['¿Qué enseñas?','Que el bien es uno solo. Unos lo llaman sabiduría, otros dios, otros inteligencia: son nombres de lo mismo. Y lo que se opone al bien, sencillamente, no es. Parménides dijo que el ser es uno e inmóvil; Sócrates buscó toda su vida qué es el bien. Yo he juntado sus dos preguntas en una.'],
  ['¿Es verdad que Platón vivió aquí?','Cuando condenaron a Sócrates, sus amigos temimos por nuestras vidas. Platón y algunos más vinieron a mi casa y pasaron aquí una temporada. Platón ha viajado mucho desde entonces: Egipto, Italia, Sicilia. Ahora ha vuelto a Atenas y dicen que quiere enseñar en el bosque de Academo. Es un gran escritor; a mí me ha puesto a recitar uno de sus diálogos.'],
  ['¿Qué son esos argumentos de tus alumnos?','Les gusta poner a prueba las palabras. «Si dices que mientes y dices la verdad, mientes; si mientes, dices la verdad.» O: un grano de trigo no es un montón; dos tampoco; ¿cuándo empieza el montón? Algunos creen que son juegos. Yo creo que nos enseñan lo poco que sabemos sobre lo que decimos.']],
 quiz:{q:'¿Qué enseñaba Euclides de Mégara sobre el bien?',a:['Que es uno solo, aunque reciba muchos nombres','Que cada persona tiene su propio bien','Que el bien es el placer'],ko:'No. Euclides sostenía que el bien es uno solo, llámese sabiduría, dios o inteligencia.'}},
{id:'nicandro',name:'Nicandro',title:'Comerciante de Corinto',glyph:'Ν',look:{chiton:'#d8c9a8',himation:'#7a2a3a',beard:true,hair:'#3b2a1e'},
 cat:'Sociedad',lesson:'Corinto, la ciudad de los dos mares',where:'En Corinto, junto al pórtico del mercado',
 summary:'Corinto, en el istmo que une el Peloponeso con el resto de Grecia, tenía dos puertos: Lequeo, en el golfo de Corinto, y Cencreas, en el golfo Sarónico. Su riqueza venía del comercio, del diolkos y de sus artesanos, famosos por sus bronces y su cerámica. Fundó colonias como Siracusa y Corcira. En la guerra de Corinto (395-387/386) se alió con Atenas, Tebas y Argos contra Esparta y llegó a unirse con Argos; la paz del Rey deshizo esa unión.',
 intro:'Salud, ateniense. Soy Nicandro, comerciante. Compro en un golfo y vendo en el otro: el vino de Quíos sale por Cencreas hacia Italia, el trigo de Sicilia entra por Lequeo hacia Atenas. Si algo cruza Grecia, pasa por Corinto. Y paga.',
 topics:[
  ['¿Por qué es tan rica Corinto?','Por la geografía. Dos mares, dos puertos y un camino entre ellos, el diolkos, por el que se arrastran las cargas y hasta los barcos: rodear el Peloponeso por el cabo Malea es largo y peligroso. Cobramos peaje a todos. Además, nuestros antepasados fundaron Siracusa y Corcira, y nuestros talleres de bronce y de cerámica vendían en todo el mar. Ahora los vasos de Atenas se venden más, lo reconozco.'],
  ['¿Qué ha pasado con la unión con Argos?','Hace seis años, los demócratas de aquí se unieron a Argos: una sola ciudad, una sola ciudadanía. Los amigos de Esparta fueron asesinados o desterrados. Ahora la paz del Rey dice que cada ciudad debe ser autónoma, y los espartanos han obligado a deshacer la unión. Los desterrados vuelven. Mi cuñado era de los de Argos y se ha ido. No sé si volveré a verlo.'],
  ['¿Es verdad lo de Periandro?','Fue nuestro tirano hace doscientos años, y uno de los siete sabios, dicen. Construyó el diolkos y protegió a los poetas: a Arión, el citaredo, al que unos marineros tiraron al mar y un delfín lo trajo a tierra, como cuenta Heródoto. También fue cruel: dicen que su amigo, el tirano de Mileto, le aconsejó cortar las espigas más altas del campo. Entendió el mensaje y eliminó a los ciudadanos más destacados.']],
 quiz:{q:'¿Qué era el diolkos?',a:['Un camino empedrado para arrastrar barcos y cargas a través del Istmo','Un templo de Poseidón','La flota de guerra de Corinto'],ko:'No. El diolkos era un camino empedrado por el que se arrastraban cargas y barcos de un golfo a otro.'}},
{id:'eutiades',name:'Eutíades',title:'Plateense que vuelve a su tierra',glyph:'Ε',look:{chiton:'#c9b48b',himation:'#4f6a7d',beard:true,hair:'#5b4532',exomis:true},
 cat:'Historia',lesson:'Platea: destrucción y regreso',where:'En Platea, entre las casas que se reconstruyen',
 summary:'Platea, pequeña ciudad de Beocia, fue aliada fiel de Atenas desde finales del siglo VI y la única ciudad que luchó a su lado en Maratón (490). En su territorio se libró en el 479 la batalla que expulsó a los persas. En la guerra del Peloponeso, espartanos y tebanos la asediaron (429-427) y la destruyeron; los supervivientes recibieron la ciudadanía ateniense. Tras la paz del Rey (386), Esparta permitió reconstruirla, también para debilitar a Tebas.',
 intro:'Salud. Soy Eutíades. Nací en Atenas: mis padres escaparon de aquí durante el asedio. Toda mi vida he oído hablar de Platea como de un sueño. Y ahora estoy poniendo piedras en la casa de mi abuelo. Si es que era esta.',
 topics:[
  ['¿Qué pasó en el asedio?','Al empezar la guerra, una noche de primavera, los tebanos entraron por sorpresa; los nuestros los capturaron y los mataron. Luego vinieron los espartanos con un ejército entero. Levantaron un terraplén contra la muralla y un muro alrededor de la ciudad. Una noche de tormenta, doscientos doce de los nuestros escaparon trepando con escalas: entre ellos, mi padre. Los demás se rindieron. Los jueces espartanos preguntaron a cada uno: «¿Has hecho algún bien a los lacedemonios en esta guerra?». A los que dijeron que no, los mataron.'],
  ['¿Por qué os dejan volver ahora?','La paz del Rey dice que todas las ciudades deben ser autónomas. Los espartanos la usan para debilitar a Tebas, que quería mandar en toda Beocia: una Platea reconstruida es una espina en el costado de los tebanos. No nos hacemos ilusiones: no nos ayudan por amor. Los viejos temen que esto dure poco.'],
  ['¿Qué recordáis de la batalla contra los persas?','Que aquí se salvó Grecia. Los griegos juraron proteger nuestra tierra y nosotros juramos cuidar las tumbas de los que cayeron. Cada año, el arconte de Platea, vestido de púrpura, lleva una procesión hasta los túmulos, sacrifica un toro y llama a los muertos al banquete. Cuarenta años sin hacerlo. Este año lo volveremos a hacer.']],
 quiz:{q:'¿Qué ciudad fue la única que ayudó a Atenas en la batalla de Maratón?',a:['Platea','Esparta','Tebas'],ko:'No. Solo los plateenses lucharon junto a los atenienses en Maratón; los espartanos llegaron tarde.'}},
{id:'teodoro',name:'Teodoro',title:'Guía de los peregrinos de Delfos',glyph:'Θ',look:{chiton:'#efe6d4',himation:'#c9a24a',beard:true,hair:'#3b2a1e',staff:true},
 cat:'Religión',lesson:'El oráculo de Delfos',where:'En Delfos, ante el templo de Apolo',
 summary:'Delfos era el oráculo más famoso de Grecia. Ciudades y particulares consultaban a Apolo a través de la Pitia, una mujer de Delfos que hablaba en trance desde el ádyton del templo; los sacerdotes ponían sus respuestas por escrito, a veces en verso. Lo administraba la Anfictionía, una liga de pueblos vecinos. Respuestas célebres: a Creso (si atacaba a los persas, destruiría un gran imperio: el suyo) y a Atenas en el 480 (confiar en los «muros de madera», las naves).',
 intro:'Salud, peregrino. Teodoro, para servirte: llevo a los forasteros por la Vía Sagrada, les explico los tesoros, les digo qué ofrenda conviene y cuánto cuesta una consulta. Por un óbolo, te cuento además qué respondió el dios a tu ciudad la última vez.',
 topics:[
  ['¿Cómo se consulta al oráculo?','Primero pagas la tasa y la torta sagrada. Luego se sacrifica una cabra: le echan agua fría y, si tiembla, el dios acepta; si no, vuelve otro día. Antiguamente la Pitia solo profetizaba un día al año, el cumpleaños de Apolo; ahora, un día cada mes, salvo en invierno, cuando el dios se va con los hiperbóreos y Dioniso ocupa su lugar. Las ciudades preguntan antes, y los que tienen el privilegio de precedencia también. Tú esperas.'],
  ['¿Qué respuestas famosas ha dado?','Al rey Creso le dijo que, si atacaba a los persas, destruiría un gran imperio. Atacó, y destruyó el suyo. A vosotros, los atenienses, antes de la invasión de Jerjes, os dijo que confiarais en los muros de madera: Temístocles entendió que eran las naves, y vencisteis en Salamina. Y a Querefonte, amigo de Sócrates, que nadie era más sabio que Sócrates. Él se pasó la vida intentando entender qué quería decir.'],
  ['¿Quién manda en el santuario?','Los de Delfos sirven al dios, pero el santuario lo administra la Anfictionía: doce pueblos vecinos, tesalios, beocios, focidios, dorios, jonios… Cada cuatro años organizan los Juegos Píticos, con concursos de canto y de cítara además de carreras. Ya ha habido guerras sagradas por controlar Delfos, y por desgracia habrá más.']],
 quiz:{q:'¿Qué aconsejó el oráculo a los atenienses antes de la batalla de Salamina, según Heródoto?',a:['Confiar en los muros de madera','Huir a Sicilia','Rendirse a Jerjes'],ko:'No. La Pitia habló de los «muros de madera», que Temístocles interpretó como las naves.'}},
{id:'dionisodoro',name:'Dionisodoro',title:'Broncista de Argos',glyph:'Δ',look:{chiton:'#8a7a62',himation:'#5a4a3a',beard:true,hair:'#2a1e16',exomis:true},
 cat:'Cultura',lesson:'Policleto y el canon',where:'En Argos, junto al Ágora',
 summary:'Policleto de Argos (activo hacia el 460-410 a.C.) fue uno de los grandes escultores griegos. En su tratado, el Canon, fijó las proporciones ideales del cuerpo humano a partir de las relaciones entre sus partes, y lo ilustró con una estatua de bronce, el Doríforo (portador de lanza). Sus figuras muestran el contrapposto: el peso sobre una pierna y la otra relajada. Las conocemos sobre todo por copias romanas en mármol. Argos, democrática y enemiga de Esparta, tuvo una gran escuela de broncistas.',
 intro:'Cuidado con el horno, que estamos fundiendo. Soy Dionisodoro, broncista. Aprendí con los discípulos de los discípulos de Policleto. Aquí en Argos decimos que la belleza es una cuestión de números. ¿Te lo explico?',
 topics:[
  ['¿Qué es el Canon?','Policleto escribió un libro y lo llamó Canon, la regla. Decía que la belleza no está en las partes, sino en la relación entre ellas: del dedo a la falange, de la mano al antebrazo, del brazo al cuerpo entero. «La perfección nace, poco a poco, de muchos números.» Y luego hizo una estatua que lo demostraba: un joven con una lanza al hombro, con todo el peso en una pierna. Los escultores de toda Grecia la copian.'],
  ['¿Cómo se funde una estatua de bronce?','Primero se modela en arcilla, se cubre de cera y se hace el molde. Al calentar, la cera se derrite y deja un hueco, y por él se vierte el bronce. Una estatua grande se funde en piezas: cabeza, brazos, tronco. Luego se sueldan, se pulen y se añaden los ojos de piedra y de vidrio, los labios y los pezones de cobre, las pestañas de bronce. Una estatua bien hecha parece que respira.'],
  ['¿Cómo es la política en Argos?','Argos es una democracia y odia a Esparta desde siempre: hace casi un siglo, el rey Cleómenes mató a nuestros hombres en Sepea. No luchamos contra los persas por no luchar a sus órdenes. Hemos sido aliados de Atenas y, hace poco, hasta nos unimos con Corinto. Ahora el rey de Persia y los espartanos nos han obligado a separarnos. Esperaremos.']],
 quiz:{q:'¿Qué fijaba el Canon de Policleto?',a:['Las proporciones ideales del cuerpo humano','Las normas de los Juegos Olímpicos','El calendario de las fiestas de Hera'],ko:'No. El Canon establecía las proporciones del cuerpo humano ideal.'}},
{id:'sostrato',name:'Sóstrato',title:'Sacerdote de Asclepio',glyph:'Σ',look:{chiton:'#f4efe3',himation:'#efe6d4',beard:true,hair:'#8d8a85',beardC:'#9a968e',staff:true},
 cat:'Religión',lesson:'Asclepio y la medicina',where:'En Epidauro, junto al altar de Asclepio',
 summary:'Asclepio, hijo de Apolo, era el dios que curaba. En sus santuarios, como el de Epidauro, los enfermos practicaban la incubación: tras purificarse y ofrecer un sacrificio, dormían en un pórtico sagrado esperando que el dios se les apareciera en sueños y los curase o les indicase un remedio. Al mismo tiempo, médicos como Hipócrates de Cos (c. 460-370) explicaban las enfermedades por causas naturales, sin rechazar el culto.',
 intro:'Salud, y nunca mejor dicho. Soy Sóstrato, sacerdote de Asclepio. ¿Vienes enfermo o curioso? A los enfermos les pido paciencia; a los curiosos, respeto. Y a todos, una ofrenda.',
 topics:[
  ['¿Cómo se cura aquí?','El enfermo se baña, se purifica y sacrifica. Al anochecer se acuesta en el pórtico, sobre una piel. Apagamos las lámparas y pedimos silencio. Por la noche el dios viene, a veces con sus perros o su serpiente, y toca la herida, o da un consejo: un baño, una dieta, un ungüento. Por la mañana, el enfermo nos cuenta su sueño. Los curados dejan exvotos: ojos, piernas, manos de barro o de plata. Hace dos años, en Atenas, Aristófanes hizo reír a todo el teatro con una noche en un santuario de Asclepio, en su Pluto.'],
  ['¿Quién era Asclepio?','Hijo de Apolo y de una mortal, Corónide. El centauro Quirón le enseñó a curar con hierbas y cantos. Llegó a ser tan buen médico que devolvió la vida a un muerto, y Zeus, temiendo por el orden del mundo, lo fulminó con su rayo. Pero lo hizo dios. Sus hijas son Higía, la salud, y Panacea, la que todo lo cura.'],
  ['¿Y los médicos de Cos?','Hipócrates y los suyos también se llaman Asclepíadas, descendientes de Asclepio, y juran por Apolo y por Asclepio. Pero dicen que toda enfermedad tiene una causa natural: el aire, el agua, la dieta, el equilibrio de los humores. Escribieron que la llamada «enfermedad sagrada», la epilepsia, no es más sagrada que las otras. Aquí no nos peleamos con ellos: el dios también aconseja dietas.']],
 quiz:{q:'¿Qué hacían los enfermos en el santuario de Asclepio?',a:['Dormían en un pórtico sagrado esperando un sueño del dios','Bebían agua del mar','Se operaban en el templo con los sacerdotes'],ko:'No. Practicaban la incubación: dormían en el santuario esperando que el dios se les apareciera en sueños.'}},
{id:'calias_mantinea',name:'Calias de Mantinea',title:'Demócrata de Arcadia',glyph:'Κ',look:{chiton:'#d7c9ab',himation:'#5c6b3f',beard:true,hair:'#3b2a1e'},
 cat:'Política',lesson:'Esparta y la autonomía de las ciudades',where:'En Mantinea, junto a la sala del Consejo',
 summary:'La paz del Rey (387/386) proclamó que todas las ciudades griegas, salvo las de Asia, serían «autónomas». Esparta, encargada de vigilarla, la usó para disolver ligas rivales y castigar a aliados poco fieles. Mantinea, democrática, fue la primera víctima: en el 385 el rey Agesípolis la sitió, represó el río Ofis contra sus murallas de adobe y obligó a sus habitantes a dispersarse en aldeas. Mantinea se refundó en el 370, tras la derrota espartana en Leuctra.',
 intro:'Salud, forastero. Soy Calias. Si vienes de Esparta, no te molestes en darme recados: ya los conozco. Si vienes de Atenas, cuéntame si allí alguien se acuerda todavía de nosotros.',
 topics:[
  ['¿Qué os exige Esparta?','La tregua de treinta años que firmamos tras la batalla del 418 ya ha terminado. Ahora los espartanos nos acusan de haber vendido trigo a Argos durante la guerra, de no haber enviado soldados a sus campañas y de alegrarnos de sus derrotas. Exigen que derribemos nuestras murallas. Dicen que es por nuestra autonomía. Curiosa autonomía, la que se impone desde fuera.'],
  ['¿Cómo es vuestra democracia?','Aquí todos los ciudadanos votan en la asamblea, pero los cargos los elige un grupo de electores sacados de todo el pueblo. Así los campesinos no tienen que dejar el arado cada pocos días. A muchos les parece bien: la mayoría prefiere trabajar sus campos a pasar el día discutiendo.'],
  ['¿Qué pasará si no obedecéis?','Que vendrá su ejército. Nuestras murallas son de adobe sobre piedra: aguantan las flechas, pero no el agua. El Ofis atraviesa la ciudad. Si los espartanos lo represan, el agua deshará los ladrillos como si fueran pan mojado. Ojalá me equivoque.']],
 quiz:{q:'¿De qué estaban hechas las murallas de Mantinea en el 386 a.C.?',a:['De adobe sobre un zócalo de piedra','De mármol','De madera'],ko:'No. Eran de adobe sobre un zócalo de piedra, y el agua del río las deshizo en el 385.'}},
{id:'aristarco',name:'Aristarco de Élide',title:'Juez de los Juegos Olímpicos',glyph:'Α',look:{chiton:'#efe6d4',himation:'#6a2a5a',beard:true,hair:'#8d8a85',beardC:'#9a968e',staff:true},
 cat:'Cultura',lesson:'Los Juegos Olímpicos',where:'En Olimpia, ante el templo de Zeus',
 summary:'Los Juegos Olímpicos se celebraban cada cuatro años en honor de Zeus, desde el 776 a.C. según la tradición. Los organizaba la ciudad de Élide, y sus jueces, los helanódicas, vigilaban el cumplimiento de las reglas. Había carreras a pie, pentatlón, lucha, boxeo, pancracio y carreras de caballos y de carros. Durante los Juegos se proclamaba una tregua sagrada. Solo competían varones griegos libres; las mujeres casadas no podían asistir, aunque la espartana Cinisca ganó como propietaria de los caballos en el 396 y el 392. El premio era una corona de olivo silvestre.',
 intro:'Salud. Soy Aristarco, de Élide, uno de los helanódicas, los jueces de los Juegos. Llevo la túnica de púrpura y una vara, y no dudo en usarla con los tramposos. Faltan dos años para los próximos Juegos, pero aquí siempre hay trabajo.',
 topics:[
  ['¿Qué pruebas hay?','La más antigua es la carrera del estadio, un largo de pista. Luego vinieron la doble carrera y la de fondo, la lucha, el pentatlón (disco, jabalina, salto con pesas, carrera y lucha), el boxeo, el pancracio, en el que vale casi todo, y la carrera con armas. Y en el hipódromo, caballos y cuadrigas: allí gana el propietario, no el auriga. Por eso pudo vencer Cinisca. Los atletas compiten desnudos.'],
  ['¿Qué hacéis los jueces?','Comprobamos que los atletas son griegos y libres y que han entrenado diez meses. Un mes antes de los Juegos los tenemos en Élide, entrenando a nuestra vista. Durante las pruebas castigamos las faltas con la vara. Y si alguien soborna, paga una multa: con la de los últimos Juegos hemos levantado seis estatuas de Zeus, para que nadie lo olvide.'],
  ['¿Cuál es el premio?','Una corona de olivo silvestre, cortada con una hoz de oro por un niño cuyos padres vivan, del árbol que plantó Heracles. Nada más. Pero el vencedor es un héroe en su ciudad: le levantan estatuas, los poetas le escriben odas y, en Atenas, come gratis el resto de su vida en el Pritaneo.']],
 quiz:{q:'¿Qué premio recibían los vencedores en Olimpia?',a:['Una corona de olivo silvestre','Un trípode de oro','Mil dracmas'],ko:'No. En Olimpia el premio era una corona de olivo silvestre; las recompensas materiales las daban después sus ciudades.'}},
{id:'hegesias',name:'Hegesias de Maratón',title:'Campesino, nieto de un maratonómaco',glyph:'Η',look:{chiton:'#c9b48b',himation:'#6b5a3a',beard:true,hair:'#8d8a85',beardC:'#9a968e',staff:true},
 cat:'Historia',lesson:'La batalla de Maratón',where:'En Maratón, junto al Soros',
 summary:'En el verano del 490 a.C., una expedición persa enviada por Darío, mandada por Datis y Artafernes y guiada por el antiguo tirano Hipias, desembarcó en la llanura de Maratón después de arrasar Eretria. Unos nueve mil atenienses y mil plateenses, bajo el polemarca Calímaco y los diez estrategos, entre ellos Milcíades, atacaron a la carrera con las alas reforzadas a costa del centro. Las alas vencieron y envolvieron al centro persa. Según Heródoto murieron 6400 persas y 192 atenienses. La victoria se convirtió en el gran orgullo de la democracia ateniense.',
 intro:'Salud, forastero. Soy Hegesias, del demo de Maratón. Mi abuelo luchó aquí, en la tribu Ayántide, en el ala derecha. Lo contaba tantas veces que me sé la batalla mejor que mi propio campo. Pregunta.',
 topics:[
  ['¿Por qué vinieron los persas aquí?','Por Hipias. Era hijo de Pisístrato, el tirano, y los atenienses lo habían echado veinte años antes. Se refugió con el rey de Persia y le prometió Atenas. Su padre había desembarcado aquí para tomar el poder, y la llanura es buena para la caballería. Además, Atenas había ayudado a los jonios cuando se rebelaron contra Darío, y habían quemado Sardes. Darío no lo olvidó: dicen que mandó a un criado que le repitiera tres veces en cada comida: «Señor, acuérdate de los atenienses».'],
  ['¿Cómo fue la carga?','Eran unos diez mil con los plateenses; los persas, muchos más. Milcíades convenció al polemarca Calímaco de atacar. Alargaron la línea para igualar la de los persas: el centro quedó con pocas filas y las alas, fuertes. Y corrieron hacia el enemigo unos ocho estadios. Heródoto dice que fueron los primeros griegos que atacaron a la carrera y los primeros que no se asustaron al ver la ropa de los medos. Los persas pensaron que estaban locos.'],
  ['¿Y el corredor que llevó la noticia?','El que corrió fue Filípides, antes de la batalla: de Atenas a Esparta, unos mil doscientos estadios, en dos días, para pedir ayuda. Los espartanos no podían salir hasta la luna llena. Después de la batalla no corrió un hombre solo, sino todo el ejército: volvió a marchas forzadas a Atenas, porque la flota persa rodeaba el cabo Sunion para sorprender la ciudad. Cuando los persas llegaron al Falero, los nuestros ya estaban allí, esperándolos.']],
 quiz:{q:'¿Cuántos atenienses murieron en Maratón, según Heródoto?',a:['192','6400','Más de dos mil'],ko:'No. Heródoto da 192 atenienses muertos, frente a 6400 persas.'}},
{id:'lampon',name:'Lampón de Antela',title:'Guardián del santuario de Deméter Anfictiónide',glyph:'Λ',look:{chiton:'#efe6d4',himation:'#6a5a2a',beard:true,hair:'#8d8a85',beardC:'#9a968e',staff:true},
 cat:'Historia',lesson:'La batalla de las Termópilas',where:'En Antela, junto al santuario de Deméter',
 summary:'En el verano del 480 a.C., mientras la flota griega esperaba a la persa en el cabo Artemisio, el rey espartano Leónidas defendió el paso de las Termópilas con trescientos espartanos y unos seis o siete mil aliados contra el ejército de Jerjes. Durante dos días rechazó los ataques en el estrecho. Al tercero, los Inmortales lo rodearon por el sendero de Anopea, que les había enseñado Efialtes. Leónidas despidió a la mayoría de los aliados y se quedó con los espartanos, setecientos tespios y cuatrocientos tebanos. Murieron casi todos. La derrota se convirtió en un símbolo de valor y de obediencia a la ley.',
 intro:'Salud, forastero. Soy Lampón, guardián del santuario de Deméter. Cuando no hay reunión de los anfictiones, mi trabajo consiste en barrer y en contar a los viajeros lo que pasó aquí hace noventa y cuatro años. Todos vienen por lo mismo.',
 topics:[
  ['¿Por qué se luchó aquí?','Porque es la única puerta. Para bajar de Tesalia al centro de Grecia, un ejército tiene que pasar entre este monte y el mar, y aquí el camino es tan estrecho que en algunos sitios solo cabe un carro. Con pocos hombres se podía frenar a muchísimos. Y al mismo tiempo la flota griega cerraba el paso por mar en el Artemisio, al norte de Eubea. Si caía uno, caía el otro.'],
  ['¿De verdad eran solo trescientos?','Trescientos espartanos, escogidos entre los que tenían hijos vivos, para que ninguna familia se extinguiera. Pero con ellos venían unos seis o siete mil aliados del Peloponeso, de Beocia, de Fócide y de Lócride, y los ilotas que servían a los espartanos. El último día se quedaron con Leónidas setecientos tespios, que eligieron morir allí, y cuatrocientos tebanos, que se rindieron al final. De los tespios casi nadie se acuerda. Yo sí.'],
  ['¿Qué hicieron los persas con Leónidas?','Jerjes, furioso porque aquel puñado de hombres le había costado tantos muertos, mandó cortarle la cabeza y clavarla en un palo. Heródoto dice que los persas solían honrar a los enemigos valientes, y que eso demuestra cuánto odiaba Jerjes a Leónidas. Cuarenta años después, los espartanos se llevaron sus huesos a Esparta, y allí le celebran cada año unos juegos.']],
 quiz:{q:'¿Quién enseñó a los persas el sendero que rodeaba el paso?',a:['Efialtes, un hombre de la región','Demarato, el rey espartano desterrado','Temístocles'],ko:'No. Fue Efialtes, un malio de la región, que esperaba una recompensa de Jerjes.'}},
{id:'tisandro',name:'Tisandro',title:'Penesta, mozo de cuadra de los Aléuadas',glyph:'Τ',look:{exomis:true,chiton:'#a89070',beard:true,hair:'#3b2a1e'},
 cat:'Sociedad',lesson:'Tesalia: caballos, señores y penestas',where:'En Larisa, junto a la llegada',
 summary:'Tesalia era la gran llanura del norte de Grecia, famosa por sus caballos y su caballería. La gobernaban unas pocas familias aristocráticas, como los Aléuadas de Larisa o los Escópadas de Cranón, que en caso de guerra elegían un jefe común, el tago. Sus tierras las trabajaban los penestas, campesinos sometidos de forma hereditaria, parecidos a los hilotas de Esparta: no se los podía vender fuera del país ni matar sin más, pero tampoco eran libres.',
 intro:'Salud, forastero. Soy Tisandro, y cuido los caballos de los Aléuadas, los señores de Larisa. Mi padre los cuidaba, y su padre también. Esta llanura es de ellos; los caballos, también; y nosotros, un poco también.',
 topics:[
  ['¿Qué es un penesta?','Somos los que trabajamos la tierra de los señores, de padres a hijos. No somos esclavos de mercado: no pueden vendernos fuera de Tesalia ni matarnos sin juicio, y nos quedamos con una parte de la cosecha. Pero tampoco somos libres: no podemos irnos. Dicen que nuestros antepasados se rindieron a los tesalios a cambio de no ser vendidos. Hemos intentado sublevarnos más de una vez.'],
  ['¿Por qué son tan famosos los caballos tesalios?','Porque aquí hay pastos, agua y llanura, cosas que en el resto de Grecia escasean. Un señor tesalio puede reunir cientos de jinetes; en Atenas tienen caballo los cuatro ricos que pueden pagarlo. Por eso la caballería tesalia es la mejor de Grecia, y por eso los atenienses nos piden ayuda cuando la necesitan.'],
  ['¿Quién manda en Tesalia?','Unas pocas familias: los Aléuadas aquí, en Larisa; los Escópadas en Cranón, los que pagaron al poeta Simónides. En tiempos de guerra eligen un jefe para toda Tesalia, el tago. Pero en Feras, al sur, hay un señor nuevo que recluta mercenarios y quiere mandar sobre todos. Los Aléuadas no duermen tranquilos.']],
 quiz:{q:'¿Quiénes eran los penestas de Tesalia?',a:['Campesinos sometidos de forma hereditaria que trabajaban la tierra de los aristócratas','Los jinetes de la caballería tesalia','Los sacerdotes del templo de Apolo de Larisa'],ko:'No. Los penestas eran campesinos sometidos de padres a hijos, parecidos a los hilotas de Esparta, que trabajaban las tierras de los aristócratas tesalios.'}},
{id:'teodoto_pela',name:'Teodoto',title:'Pintor ateniense en la corte de Macedonia',glyph:'Θ',look:{chiton:'#e9dfc8',himation:'#7a3f2a',beard:true,hair:'#5b4532'},
 cat:'Historia',lesson:'Macedonia y la corte de Pela',where:'En Pela, junto a la llegada',
 summary:'Macedonia era un reino del norte, gobernado por la familia de los Teménidas, que decían descender de Heracles a través de los reyes de Argos. Los griegos del sur dudaban de que los macedonios fueran griegos de verdad, aunque Alejandro I fue admitido en los Juegos Olímpicos tras demostrar su origen argivo. Arquelao trasladó la capital a Pela y atrajo a artistas y poetas del sur, como Zeuxis y Eurípides. En el 386 reinaba Amintas III, padre de Filipo II, que nacería hacia el 382.',
 intro:'Salud, forastero. Me llamo Teodoto, de Atenas. Pinto paredes. Aquí me pagan el triple que en casa, aunque los inviernos son largos y el vino se bebe sin agua. ¿Has venido a ver cómo viven los bárbaros del norte? Te sorprenderás.',
 topics:[
  ['¿Son griegos los macedonios?','Depende de a quién preguntes. Los reyes dicen descender de Heracles a través de los reyes de Argos, y cuando Alejandro I quiso correr en Olimpia, los jueces lo admitieron tras comprobar su linaje. Hablan una lengua griega que en Atenas cuesta entender. Pero los atenienses los llaman bárbaros cuando les conviene, sobre todo cuando les venden madera para sus barcos.'],
  ['¿Cómo es la corte?','Los nobles, los compañeros del rey, cazan, beben y discuten de caballos. Aquí un hombre no puede recostarse en el banquete hasta que haya matado un jabalí sin red; antes come sentado, como los niños. El rey Amintas lo tiene difícil: los ilirios le quitaron el reino una vez y la liga de Olinto le ha arrebatado ciudades.'],
  ['¿Por qué vienen artistas del sur?','Porque el rey Arquelao, hace unos años, quiso que su corte se pareciera a Atenas. Pagó a Zeuxis por pintar su palacio y acogió a Eurípides, que escribió aquí Las bacantes y murió en Macedonia. Agatón, el poeta trágico, también vino. Yo soy menos famoso, pero mis paredes también aguantan.']],
 quiz:{q:'¿Qué costumbre tenían los nobles macedonios en los banquetes, según los antiguos?',a:['No podían recostarse hasta haber matado un jabalí sin red','Solo bebían agua delante del rey','Comían de pie durante toda la noche'],ko:'No. Según Ateneo, un macedonio no podía recostarse en el banquete hasta haber matado un jabalí sin red: antes comía sentado.'}},
{id:'anthis',name:'Antis',title:'Peleíade, profetisa de Dodona',glyph:'Α',look:{female:true,chiton:'#efe6d5',himation:'#4f5a4a',veil:true,hair:'#d8d0c2'},
 cat:'Religión',lesson:'El oráculo de Dodona',where:'En Dodona, junto a la encina sagrada',
 summary:'Dodona, en el Epiro, era según Heródoto el oráculo más antiguo de Grecia. Zeus respondía a través del rumor de las hojas de una encina sagrada, que interpretaban unas sacerdotisas ancianas, las peleíades («palomas»), y unos sacerdotes, los selos, que según la Ilíada dormían en el suelo y no se lavaban los pies. Los fieles escribían sus preguntas en láminas de plomo, de las que se han encontrado miles, con dudas sobre el matrimonio, los hijos, los viajes o los negocios.',
 intro:'Salud, forastero. Soy Antis, una de las palomas de la encina. No, no tengo alas; así nos llaman a las profetisas. Si traes una pregunta, escríbela en una lámina de plomo y dóblala. Zeus la escuchará en el viento.',
 topics:[
  ['¿Cómo habla Zeus?','Por la encina. Cuando el viento mueve sus hojas, nosotras escuchamos el rumor y lo interpretamos; también por el vuelo de las palomas que anidan en ella y por el sonido de los calderos de bronce, que pasa de uno a otro cuando alguien toca el primero. Los selos, los sacerdotes, duermen en el suelo y no se lavan los pies, como ya decía Homero.'],
  ['¿Qué preguntan los fieles?','De todo, pero sobre todo lo que les quita el sueño. Uno pregunta si le conviene casarse; otro, si el niño que espera su mujer es suyo; una ciudad, a qué dios debe sacrificar para tener buenas cosechas; un mercader, si le irá bien en el viaje. Escriben en plomo porque dura. Muchas veces la respuesta es solo sí o no.'],
  ['¿Por qué os llaman palomas?','Cuentan que dos palomas negras salieron volando de Tebas de Egipto: una fue a Libia, al oráculo de Amón, y la otra se posó en esta encina y dijo con voz humana que aquí debía haber un oráculo de Zeus. Heródoto, que lo preguntó en Egipto, cree que eran dos sacerdotisas extranjeras, y que las llamaron palomas porque su lengua sonaba como un arrullo.']],
 quiz:{q:'¿En qué material escribían sus preguntas los que consultaban el oráculo de Dodona?',a:['En láminas de plomo','En tablillas de cera','En hojas de la encina sagrada'],ko:'No. Escribían las preguntas en láminas de plomo, que se doblaban. Se han encontrado miles.'}},
{id:'laodoco',name:'Laódoco',title:'Cazador etolio',glyph:'Λ',look:{exomis:true,chiton:'#7a6a4a',beard:true,hair:'#2a1e16',staff:true},
 cat:'Historia',lesson:'Los etolios',where:'En Calidón, junto a la llegada',
 summary:'Los etolios vivían en el oeste de Grecia central, entre montañas y bosques, en buena parte en aldeas sin murallas. Los griegos de las ciudades los tenían por rústicos; Tucídides cuenta que algunos de ellos hablaban una lengua muy difícil de entender y comían la carne cruda. Eran temibles combatiendo con armas ligeras en su terreno: en el 426 a.C. derrotaron al general ateniense Demóstenes. Calidón, junto al golfo de Corinto, era la ciudad del mito del jabalí y del santuario de Ártemis Lafria.',
 intro:'Salud, forastero. Soy Laódoco. Cazo en estos montes, como cazaba Meleagro, aunque mis jabalíes son más pequeños. Si vienes de Atenas, no hables muy alto: aquí todavía se acuerdan de cuando vuestros hoplitas se perdieron en el bosque.',
 topics:[
  ['¿Cómo viven los etolios?','En aldeas, sin murallas, cada una en su monte. No nos hacen falta: nadie entra en estos bosques sin que lo sepamos. Criamos cabras, cazamos y, si hace falta, nos juntamos para la guerra. En las ciudades del sur nos llaman salvajes; dicen que en el interior algunos comen la carne cruda. Exageran, pero no mucho.'],
  ['¿Qué pasó con los atenienses?','Hace cuarenta años, el general Demóstenes subió por estos montes con sus hoplitas pensando que nos vencería aldea por aldea. Nosotros no esperamos en formación: los atacamos desde las alturas con jabalinas, nos retirábamos cuando avanzaban y volvíamos cuando se cansaban. Murió su guía, se perdieron en el bosque, y los quemamos dentro. Demóstenes no se atrevió a volver a Atenas.'],
  ['¿Quién es Ártemis Lafria?','La señora de Calidón: Ártemis cazadora, la de los animales salvajes. Fue ella quien envió el jabalí cuando el rey Eneo la olvidó en sus sacrificios. En su fiesta se hace una gran hoguera con animales vivos. Más vale no olvidarla dos veces.']],
 quiz:{q:'¿Cómo derrotaron los etolios a los atenienses de Demóstenes en el 426 a.C.?',a:['Con jabalinas y ataques desde las alturas, sin enfrentarse en formación','En una gran batalla naval en el golfo de Corinto','Con un asedio de diez años'],ko:'No. Según Tucídides, los etolios, con armas ligeras, atacaban desde las alturas y se retiraban cuando los hoplitas avanzaban, hasta agotarlos.'}},
{id:'xenias',name:'Jenias',title:'Pescador de Hélice',glyph:'Ξ',look:{exomis:true,chiton:'#8a7a5a',beard:true,hair:'#5b4532'},
 cat:'Historia',lesson:'Acaya y la liga de los aqueos',where:'En Egio, junto a la llegada',
 summary:'Acaya, en la costa norte del Peloponeso, estaba formada por doce pequeñas ciudades, unidas en una liga que se reunía en el santuario de Poseidón de Hélice. Heródoto cuenta que antes vivían allí los jonios, expulsados por los aqueos, y que por eso las ciudades de los jonios de Asia también eran doce. En el 373 a.C. un terremoto y una ola gigante destruyeron Hélice por completo; sus ruinas se vieron bajo el agua durante siglos.',
 intro:'Salud, forastero. Soy Jenias, de Hélice, aquí al lado. Pesco en el golfo y vengo a Egio a vender. Si quieres ver el Poseidón de bronce de nuestro santuario, ven a Hélice: no hay otro igual en todo el Peloponeso.',
 topics:[
  ['¿Qué es la liga de los aqueos?','Somos doce ciudades pequeñas a lo largo de esta costa: Pelene, Egira, Egas, Bura, Hélice, Egio y las demás. Solas no seríamos nada; juntas, por lo menos nos escuchan. Nos reunimos en el santuario de Poseidón Heliconio, en Hélice, para los sacrificios y para decidir lo que importa a todos.'],
  ['¿Cómo es la vida en el golfo?','Pescamos, sobre todo de noche, con lámparas. Cruzamos a Naupacto, en la otra orilla, cuando hace buen tiempo. La tierra es estrecha, entre el mar y los montes, y los ríos bajan con fuerza en invierno. A veces la tierra tiembla; los viejos dicen que es Poseidón, que se mueve en su santuario.'],
  ['¿Quiénes vivían aquí antes?','Los jonios. Cuentan que, cuando los dorios llegaron al Peloponeso, los aqueos que vivían en Argos y en Esparta fueron expulsados y vinieron aquí, y echaron a su vez a los jonios, que se fueron a Atenas y después a Asia. Por eso los jonios de Asia tienen doce ciudades, como nosotros: se acuerdan de cómo era su tierra.']],
 quiz:{q:'¿Dónde se reunían las ciudades de la liga aquea?',a:['En el santuario de Poseidón de Hélice','En el templo de Zeus de Olimpia','En la acrópolis de Corinto'],ko:'No. Las doce ciudades aqueas se reunían en el santuario de Poseidón Heliconio, en Hélice, hasta que la ciudad fue destruida en el 373 a.C.'}},
{id:'damon_itome',name:'Damón',title:'Hilota mesenio',glyph:'Δ',look:{exomis:true,chiton:'#7a6a4a',beard:true,hair:'#3b2a1e'},
 cat:'Sociedad',lesson:'Los hilotas de Mesenia',where:'En Itome, junto a la llegada',
 summary:'Los hilotas eran la población sometida que trabajaba las tierras de los espartanos en Laconia y, sobre todo, en Mesenia, conquistada por Esparta en los siglos VIII y VII a.C. Entregaban una parte fija de la cosecha (la mitad, según el poeta Tirteo), no podían ser vendidos fuera del país y vivían bajo vigilancia: los éforos les declaraban la guerra cada año para poder matarlos sin culpa. Se sublevaron varias veces; la gran rebelión del 464 resistió diez años en el monte Itome. Mesenia fue liberada por Epaminondas en el 369 a.C.',
 intro:'Habla bajo, forastero. Soy Damón. Labro esta tierra, que fue de mis abuelos y ahora es de un espartano que no la ha pisado nunca. Mira la montaña: Itome. Allí resistieron los nuestros diez años. Algún día volveremos a subir.',
 topics:[
  ['¿Cómo vive un hilota?','Trabajamos los campos y entregamos a nuestro amo una parte fija de la cosecha; lo demás es nuestro. No nos pueden vender fuera del país, pero tampoco podemos irnos. Nos obligan a llevar gorro de piel de perro, y en los banquetes de Esparta emborrachan a algunos de los nuestros para enseñar a sus hijos lo feo que es beber.'],
  ['¿Qué es la kripteia?','Cada año, los éforos de Esparta nos declaran la guerra, para que matar a un hilota no sea un crimen. Luego mandan a los jóvenes al campo, con un puñal y poca comida, y de noche matan a los hilotas que encuentran, sobre todo a los más fuertes. Así aprenden a ser espartanos, y nosotros, a tener miedo.'],
  ['¿Qué pasó en el monte Itome?','Después del gran terremoto de Esparta, hace setenta y ocho años, los nuestros se sublevaron y se hicieron fuertes en la cima. Los espartanos no pudieron tomarla ni con la ayuda de los atenienses, a los que acabaron despidiendo porque no se fiaban de ellos. Al cabo de diez años, los sitiados salieron con un pacto y los atenienses los instalaron en Naupacto. Siguen allí.']],
 quiz:{q:'¿Dónde resistieron diez años los hilotas sublevados tras el terremoto del 464 a.C.?',a:['En el monte Itome','En la acrópolis de Atenas','En las Termópilas'],ko:'No. Se hicieron fuertes en el monte Itome, en Mesenia, y al final salieron con un pacto; los atenienses los instalaron en Naupacto.'}},
{id:'lisimaco_calcis',name:'Lisímaco',title:'Broncista de Calcis',glyph:'Λ',look:{exomis:true,chiton:'#6b5a4a',beard:true,hair:'#3e2c1f'},
 cat:'Historia',lesson:'Calcis, ciudad de colonizadores',where:'En Calcis, junto a la llegada',
 summary:'Calcis, en la isla de Eubea, junto al estrecho del Euripo, fue en los siglos VIII y VII a.C. una de las grandes fundadoras de colonias griegas: con su vecina Eretria fundó Pitecusas y Cumas en Italia, y por su cuenta Naxos y Zancle en Sicilia, Regio en el estrecho de Mesina y numerosas ciudades en el norte del Egeo, en la península que por eso se llama Calcídica. Su nombre se relaciona con el bronce (chalkós). La guerra Lelantina con Eretria, por la llanura entre las dos ciudades, fue una de las primeras guerras griegas en las que intervinieron aliados de todas partes.',
 intro:'Salud, forastero. Soy Lisímaco, broncista, como mi padre. Dicen que el nombre de mi ciudad viene del bronce, y yo lo creo. ¿Has cruzado el puente? Espera un rato a la orilla y verás el agua cambiar de sentido, como si alguien la empujara.',
 topics:[
  ['¿Por qué fundó Calcis tantas colonias?','Porque había mucha gente y poca tierra, y porque nuestros marinos se atrevían a ir lejos. Hace siglos, con los de Eretria, fundamos Pitecusas y Cumas, allá en Italia, donde se enseñó a escribir a los etruscos y a los latinos. Luego Naxos y Zancle en Sicilia, Regio en el estrecho y tantas ciudades al norte que a esa tierra la llaman Calcídica.'],
  ['¿Qué fue la guerra Lelantina?','Una guerra antigua contra Eretria, nuestra vecina, por la llanura del río Lelanto, la mejor tierra de Eubea. Fue tan larga que medio mundo griego tomó partido: unos con nosotros y otros con ellos. Cuentan que acordaron no usar armas arrojadizas, solo lanzas y espadas. La ganamos nosotros, pero Eretria sigue ahí, desconfiando.'],
  ['¿Qué tiene de especial el Euripo?','Que el agua no se está quieta: corre hacia un lado, se para y corre hacia el otro, varias veces al día, y nadie sabe por qué. Los barcos esperan a que la corriente les sea favorable. Hace veinticinco años se construyó un puente para unir la isla con Beocia; ahora se puede venir a pie desde Tebas.']],
 quiz:{q:'¿Qué región del norte del Egeo debe su nombre a las colonias de Calcis?',a:['La Calcídica','La Tracia','La Magnesia'],ko:'No. La península de la Calcídica se llama así por las muchas colonias que fundó allí Calcis.'}},
{id:'ismenias',name:'Ismenias',title:'Jefe de los tebanos contrarios a Esparta',glyph:'Ι',look:{chiton:'#e6dcc4',himation:'#3f5a3a',beard:true,hair:'#5a4a3a',beardC:'#7a6a5a',staff:true},
 cat:'Política',lesson:'Ismenias y el orgullo de Tebas',where:'En Tebas, en la Cadmea',
 summary:'Ismenias fue el jefe de la facción tebana enemiga de Esparta en las décadas de 390 y 380. Era muy rico (Platón lo cita en el Menón como ejemplo de riqueza recibida). Según Jenofonte, en el 396/395 aceptó, con otros jefes de varias ciudades, el oro del rey de Persia que llevó el rodio Timócrates para empujar a Grecia a la guerra contra Esparta. Tebas había humillado a Agesilao en el 396, cuando los beotarcas interrumpieron el sacrificio que el rey hacía en Áulide antes de partir hacia Asia. En el 382, tras la ocupación de la Cadmea por el espartano Fébidas, Leontíadas lo hizo detener; los espartanos lo juzgaron por traición a Grecia y lo ejecutaron.',
 intro:'Soy Ismenias, hijo de Ismenias. Si buscas a los tebanos que dan las gracias a Esparta, ve a casa de Leontíadas. Yo no soy de esos. Dicen que tengo demasiado dinero y demasiado orgullo. Lo primero es verdad.',
 topics:[
  ['¿Por qué odias a Esparta?','Porque después de la guerra contra Atenas, que ganamos juntos, Esparta se lo quedó todo: el botín, las ciudades, los tributos. A nosotros, nada. Y porque trata a Grecia como a sus hilotas. Hace diez años, cuando Agesilao quiso sacrificar en Áulide como Agamenón antes de ir contra Troya, nuestros beotarcas mandaron jinetes, tiraron las víctimas del altar y lo echaron. No nos lo ha perdonado.'],
  ['¿Es verdad que aceptaste oro persa?','Un rodio, Timócrates, trajo oro del Gran Rey y lo repartió entre los jefes de varias ciudades que ya queríamos la guerra. Los espartanos lo cuentan como si nos hubieran comprado. Nadie compra lo que ya está decidido. Lo irónico es que ahora la paz también la firma el Gran Rey, y Esparta es la que la aplica.'],
  ['¿Qué pasará con Tebas ahora?','Hemos tenido que disolver la Liga Beocia y Leontíadas espera su momento. Si un día Esparta pone guarnición en la Cadmea, sus amigos le abrirán la puerta. Pero esta ciudad tiene siete puertas, y ninguna se ha quedado cerrada para siempre.']
 ],
 quiz:{q:'¿Qué hicieron los beotarcas tebanos con Agesilao en Áulide en el 396?',a:['Interrumpieron su sacrificio y tiraron las víctimas del altar','Le dieron el mando del ejército beocio','Le regalaron una corona de oro'],ko:'No. Los beotarcas mandaron jinetes que interrumpieron el sacrificio de Agesilao en Áulide, una humillación que el rey no olvidó.'}},
];
GREECE_NPCS2.forEach(n=>{NPCS.push(n);LESSONS[n.id]={title:n.lesson,cat:n.cat,summary:n.summary,where:n.where,who:n.name,fict:n.id!=='euclides_megara'};});
HIST.add('euclides_megara');LESSONS.ismenias.fict=false;HIST.add('ismenias');
Object.assign(SRC,{
 ismenias:{a:['Jenofonte, Helénicas III 4.3-4 (Áulide), III 5.1-2 (el oro de Timócrates) y V 2.25-36 (la Cadmea y la muerte de Ismenias)','Platón, Menón 90a','Plutarco, Agesilao 6 y Pelópidas 5'],m:['J. Buckler, The Theban Hegemony (1980)'],n:['Las palabras de Ismenias son inventadas; los hechos que cuenta están en Jenofonte. Las Helénicas de Oxirrinco dan otra versión del oro persa.']},
 tisandro:{a:['Aristóteles, Política II 1269a (los penestas)','Ateneo VI 264a-b','Jenofonte, Helénicas VI 1 (Jasón de Feras)'],m:['B. Helly, L\'État thessalien (1995)'],n:['Tisandro es inventado.']},
 teodoto_pela:{a:['Heródoto V 22 y VIII 137-139 (los reyes argéadas)','Eliano, Historias varias XIV 17 (Zeuxis y Arquelao)','Tucídides II 100 (las obras de Arquelao)'],m:['E. N. Borza, In the Shadow of Olympus (1990)'],n:['Teodoto es inventado. Eurípides y Zeuxis trabajaron para Arquelao.']},
 anthis:{a:['Heródoto II 52-57 (las palomas y las peleíades)','Homero, Ilíada XVI 233-235 (los selos)','Láminas de plomo con consultas del oráculo de Dodona'],m:['E. Eidinow, Oracles, Curses and Risk among the Ancient Greeks (2007)'],n:['Anthis es inventada.']},
 laodoco:{a:['Tucídides III 94-98 (Demóstenes en Etolia)','Homero, Ilíada IX 529-599 (Meleagro)','Jenofonte, Cinegético 10 (la caza del jabalí)'],m:['C. Antonetti, Les Étoliens (1990)'],n:['Laódoco es inventado.']},
 xenias:{a:['Heródoto I 145 (las doce ciudades aqueas)','Pausanias VII 1 y VII 24-25 (Hélice)','Estrabón VIII 7.2','Diodoro XV 48-49 (el terremoto del 373)'],m:['D. Katsonopoulou, Helike (proyecto arqueológico)'],n:['Xenias es inventado.']},
 damon_itome:{a:['Tucídides I 101-103 y IV 80 (los hilotas)','Plutarco, Licurgo 28 (la cripteia)','Tirteo, fr. 6-7','Pausanias IV 27 (la fundación de Mesene)'],m:['N. Luraghi, The Ancient Messenians (2008)'],n:['Damón es inventado.']},
 lisimaco_calcis:{a:['Tucídides I 15 (la guerra lelantina) y VI 3-5 (las colonias)','Estrabón X 1.8-12','Diodoro XIII 47 (el puente del Euripo)'],m:['I. Malkin, A Small Greek World (2011)'],n:['Lisímaco es inventado.']},
 euclides_megara:{a:['Diógenes Laercio II 106-112 (Euclides y sus discípulos) y III 6 (Platón en Mégara)','Aulo Gelio, Noches áticas VII 10 (el disfraz de mujer)','Platón, Teeteto 142a-143c'],m:['K. Döring, Die Megariker (1972)','R. Muller, Les Mégariques (1985)'],n:['Las paradojas del mentiroso y del montón se atribuyen a Eubúlides, discípulo de Euclides, algo posterior.']},
 nicandro:{a:['Tucídides I 13 (Corinto, centro de comercio)','Jenofonte, Helénicas IV 4.1-6 y V 1.34 (la unión con Argos y su fin)','Heródoto I 23-24 y V 92 (Periandro)','Estrabón VIII 6.20'],m:['J. B. Salmon, Wealthy Corinth (1984)','D. K. Pettegrew, The Isthmus of Corinth (2016)'],n:['Nicandro es inventado.']},
 eutiades:{a:['Heródoto VI 108-111 y IX (Platea en Maratón y la batalla)','Tucídides II 2-6 y III 20-24 y 52-68 (el asedio)','Plutarco, Arístides 21 (el sacrificio anual por los caídos)','Pausanias IX 1.4 (la reconstrucción)'],m:['P. Cartledge, After Thermopylae (2013)'],n:['Eutíades es inventado. En el 373 los tebanos volverán a destruir Platea.']},
 teodoro:{a:['Heródoto I 46-55 (Creso) y VII 140-143 (los muros de madera)','Platón, Apología 21a (Querefonte)','Plutarco, Sobre la E de Delfos y Cuestiones griegas 9','Plutarco, Sobre la desaparición de los oráculos 49 (la cabra)'],m:['M. Scott, Delphi (2014)','J. Fontenrose, The Delphic Oracle (1978)'],n:['Teodoro es inventado. Muchos detalles del rito los conocemos por Plutarco, sacerdote de Delfos hacia el 100 d.C.']},
 dionisodoro:{a:['Galeno, Sobre las doctrinas de Hipócrates y Platón V 3.15-16 (el Canon)','Filón de Bizancio, Belopoiika 50.5 (la frase sobre los números)','Plinio el Viejo, Historia natural XXXIV 55-56','Heródoto VI 76-83 (Sepea)'],m:['W. G. Moon (ed.), Polykleitos, the Doryphoros, and Tradition (1995)','R. A. Tomlinson, Argos and the Argolid (1972)'],n:['Dionisodoro es inventado.']},
 sostrato:{a:['Píndaro, Pítica III (Asclepio)','Aristófanes, Pluto 653-747 (estrenada en el 388)','Inscripciones de curaciones de Epidauro (IG IV² 1, 121-124)','Hipócrates, Sobre la enfermedad sagrada; Juramento'],m:['E. J. y L. Edelstein, Asclepius (1945)','L. R. LiDonnici, The Epidaurian Miracle Inscriptions (1995)'],n:['Sóstrato es inventado. Las estelas con curaciones son de la segunda mitad del siglo IV.']},
 calias_mantinea:{a:['Jenofonte, Helénicas V 2.1-7','Aristóteles, Política VI 1318b','Tucídides V 64-74'],m:['J. Roy, «Arkadia», en M. H. Hansen y T. H. Nielsen (eds.), An Inventory of Archaic and Classical Poleis (2004)'],n:['Calias es inventado.']},
 lampon:{a:['Heródoto VII 175-239','Diodoro XI 4-11','Estrabón IX 4.13-17 (Antela y las aguas calientes)','Pausanias III 14.1 (los huesos de Leónidas)'],m:['P. Cartledge, Thermopylae (2006)','J. Lazenby, The Defence of Greece (1993)'],n:['Lampón es inventado.','La respuesta «Ven a cogerlas» («Molón labé»), que Leónidas habría dado a Jerjes cuando le pidió las armas, la cuenta Plutarco cinco siglos después.']},
 hegesias:{a:['Heródoto VI 94-120','Pausanias I 15.3 y I 32.3-7','Cornelio Nepote, Milcíades 4-6','Plutarco, Sobre la gloria de los atenienses 3'],m:['P. Krentz, The Battle of Marathon (2010)','R. A. Billows, Marathon (2010)'],n:['Hegesias es inventado.','La leyenda del corredor que llega a Atenas y muere tras anunciar la victoria aparece mucho después, en Plutarco y Luciano; inspiró la carrera de maratón de los Juegos de 1896.']},
 aristarco:{a:['Pausanias V 8-21 y VI (Olimpia; los Zanes, V 21.2-4)','Píndaro, Olímpicas','Plutarco, Solón 23','Escolios a Píndaro, Olímpica III (la corona)'],m:['J. Swaddling, The Ancient Olympic Games (2015)','F. García Romero, Los Juegos Olímpicos y el deporte en Grecia (1992)'],n:['Aristarco es inventado.']}
});

function sfxWhistle(){if(!aOK())return;const c=AUD.ctx,t=c.currentTime;[[1600,2300,0],[1700,2600,0.32]].forEach(([a,b,d])=>{const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(a,t+d);o.frequency.exponentialRampToValueAtTime(b,t+d+0.22);o.connect(envGain(t+d,0.05,0.02,0.24));o.start(t+d);o.stop(t+d+0.3);});}
function sfxHoof(){if(!aOK())return;const c=AUD.ctx,t=c.currentTime;[[900,0],[650,0.07]].forEach(([f,d])=>{const s=c.createBufferSource();s.buffer=AUD.noise;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f;bp.Q.value=4;s.connect(bp).connect(envGain(t+d,0.16,0.003,0.06));s.start(t+d,Math.random()*2,0.08);});}

