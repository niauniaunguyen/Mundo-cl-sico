// ============================================================ VIDA EN EL CAMPO Y LOS CAMINOS (barata: solo alrededor del jugador, pocas llamadas de dibujo)
// matorral y flores que se mecen con las rachas (en la GPU), flores silvestres de temporada (más en los bordes de los caminos), mariposas de día,
// lagartijas al sol en las piedras, saltamontes que saltan al pasar y hojas secas que cruzan el camino en otoño.
const NAT2={on:true,cx:1e9,cz:1e9,sk:'',fl:null,st:null,pts:[],rocks:[],bf:[],bfL:null,bfR:null,lz:[],gh:[],lv:null,lvs:[],ghT:1,lp:null};
function n2Sway(m,amp,key){const prev=m.onBeforeCompile;m.onBeforeCompile=function(sh,r){if(prev)prev.call(this,sh,r);sh.uniforms.uWT=WIND.u;sh.uniforms.uWS=WIND.s;
  sh.vertexShader='uniform float uWT;uniform float uWS;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n{\n#ifdef USE_INSTANCING\nfloat wph=instanceMatrix[3].x*0.37+instanceMatrix[3].z*0.29;\n#else\nfloat wph=0.0;\n#endif\nfloat wk=max(0.0,position.y);transformed.x+=sin(uWT*1.7+wph)*'+amp.toFixed(3)+'*wk*uWS;transformed.z+=cos(uWT*1.3+wph*1.3)*'+(amp*0.7).toFixed(3)+'*wk*uWS;}');};
  const pk=m.customProgramCacheKey?m.customProgramCacheKey.bind(m):null;m.customProgramCacheKey=()=>(pk?pk():'')+key;m.needsUpdate=true;}
const N2_COL={pri:[['#c8302a',3],['#f2efe4',2],['#8a5ab0',1],['#e8c838',1]],ver:[['#e8c838',2],['#d9a83a',1],['#f2efe4',1],['#b07ad0',1]],oto:[['#b89ad8',2],['#f2efe4',1]],inv:[['#f5f0d8',2],['#e8d040',1]]};
const N2_DEN={pri:1,ver:0.45,oto:0.3,inv:0.2};
function n2Out(x,z){if(x>8000)return !!islandOf(x);return MODE==='roma'?!romaInUrbs(x,z):!insideWalls(x,z);}
function n2Day(){return clock.h>7&&clock.h<18.5&&!(WXS.rain>0.3)&&!(WXS.snow>0.3);}
function n2Init(){const NF=isTouch?900:1800;
  const st=new THREE.CylinderGeometry(0.007,0.011,0.3,4,1,true);st.translate(0,0.15,0);const hd=new THREE.IcosahedronGeometry(0.055,0);hd.scale(1,0.55,1);hd.translate(0,0.31,0);
  const sm=new THREE.MeshLambertMaterial({color:'#5d7a3a'}),hm=new THREE.MeshLambertMaterial({color:0xffffff});n2Sway(sm,0.28,'n2f');n2Sway(hm,0.28,'n2f');
  NAT2.st=new THREE.InstancedMesh(st,sm,NF);NAT2.fl=new THREE.InstancedMesh(hd,hm,NF);
  NAT2.fl.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(NF*3),3);
  for(const im of[NAT2.st,NAT2.fl]){im.count=0;im.frustumCulled=false;im.userData.noCull=true;scene.add(im);}
  if(GD.tf&&!GD.tf.material.userData.n2){n2Sway(GD.tf.material,0.07,'n2m');GD.tf.material.userData.n2=1;}   // el matorral bajo también se mece
  // mariposas: dos alas instanciadas (izquierda y derecha) que baten
  const NB=isTouch?6:10,wg=new THREE.PlaneGeometry(0.24,0.19);{const P=wg.attributes.position;for(let i=0;i<P.count;i++)if(P.getX(i)>0&&P.getY(i)<0)P.setY(i,P.getY(i)*0.45);}wg.rotateX(-Math.PI/2);wg.translate(0.12,0,0);const wg2=wg.clone();wg2.scale(-1,1,1);
  const wm=new THREE.MeshBasicMaterial({color:0xe8e2d6,side:THREE.DoubleSide});NAT2.bfR=new THREE.InstancedMesh(wg,wm,NB);NAT2.bfL=new THREE.InstancedMesh(wg2,wm,NB);
  const BC=['#f4f0e0','#f0d040','#e08a30','#f4f0e0','#9ab0e0'].map(c=>new THREE.Color(c));
  for(const im of[NAT2.bfR,NAT2.bfL]){im.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(NB*3),3);im.count=0;im.frustumCulled=false;im.userData.noCull=true;scene.add(im);}
  for(let i=0;i<NB;i++){const c=BC[i%BC.length];NAT2.bfR.setColorAt(i,c);NAT2.bfL.setColorAt(i,c);NAT2.bf.push({on:false,x:0,y:0,z:0,tx:0,tz:0,ph:Math.random()*9,fl:0,c});}
  // lagartijas
  const lm=lam('#7d7a4a');for(let i=0;i<3;i++){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.03,0.16),lm);g.add(b);const t=new THREE.Mesh(new THREE.ConeGeometry(0.018,0.17,4),lm);t.rotation.x=-Math.PI/2;t.position.z=0.16;g.add(t);
    const h=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.025,0.05),lm);h.position.z=-0.1;g.add(h);g.visible=false;scene.add(g);NAT2.lz.push({g,on:false,run:0});}
  // saltamontes
  const gm=lam('#7e8a3c');for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.03,0.11),gm);m.visible=false;scene.add(m);NAT2.gh.push({m,t:-1});}
  // hojas secas
  const lg=new THREE.PlaneGeometry(0.1,0.07);NAT2.lv=new THREE.InstancedMesh(lg,new THREE.MeshLambertMaterial({color:0xffffff,side:THREE.DoubleSide}),10);NAT2.lv.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(30),3);NAT2.lv.count=0;NAT2.lv.frustumCulled=false;scene.add(NAT2.lv);
  const LC=['#a8742e','#8a5a26','#c09040','#7a4a22'].map(c=>new THREE.Color(c));for(let i=0;i<10;i++){NAT2.lv.setColorAt(i,LC[i%4]);NAT2.lvs.push({on:false});}}
// colocar las flores (y buscar piedras para las lagartijas) cuando el jugador se ha movido
const N2C=new Map();
function n2Cell(i,j,x,z,u){const k=MODE+':'+i+','+j;if(N2C.has(k))return N2C.get(k);let r=null;
  do{const t=terrainH(x,z);if(t<1.2)break;if(!n2Out(x,z))break;const w=riverWater(x,z);if(w!==null&&w>t-0.3)break;const rd=x<8000?roadDist(x,z):9;if(rd<=2.6)break;const verge=rd<7;if(!verge&&u>0.2)break;if(!isFree(x,z,0.6))break;r={x,z,t,verge};}while(false);
  if(N2C.size>40000)N2C.clear();N2C.set(k,r);return r;}
function n2Place(sid){const P=player,C=3,R=isTouch?30:40,pal=N2_COL[sid],den=N2_DEN[sid],m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),sc=new THREE.Vector3(),p=new THREE.Vector3(),col=new THREE.Color();
  const tot=pal.reduce((a,b)=>a+b[1],0),MX=NAT2.fl.instanceMatrix.count;let n=0;NAT2.pts.length=0;
  for(let i=Math.floor((P.x-R)/C);i<=Math.floor((P.x+R)/C);i++)for(let j=Math.floor((P.z-R)/C);j<=Math.floor((P.z+R)/C);j++){if(n>=MX)break;
    const cx0=(i+hash(i*13+5,j*7+1))*C,cz0=(j+hash(i*3+2,j*17+9))*C,dx=cx0-P.x,dz=cz0-P.z;if(dx*dx+dz*dz>R*R)continue;const u=hash(i*29+3,j*31+7);if(u>0.75*den)continue;
    const ce=n2Cell(i,j,cx0,cz0,u);if(!ce)continue;const{x,z,t,verge}=ce;if(!verge&&u>0.2*den)continue;
    let pk=hash(i+7,j+3)*tot,ci=0;for(;ci<pal.length-1;ci++){pk-=pal[ci][1];if(pk<0)break;}col.set(pal[ci][0]);
    const k=4+Math.floor(hash(i,j*5)*4);NAT2.pts.push([x,z,t,pal[ci][0]]);
    for(let f=0;f<k&&n<MX;f++){const ox=(hash(i*7+f,j)-0.5)*1.6,oz=(hash(i,j*7+f)-0.5)*1.6,tt=terrainH(x+ox,z+oz),s=0.8+hash(i+f,j+f*3)*0.6;e.set((hash(f,i)-0.5)*0.3,hash(i,f)*TAU,(hash(j,f)-0.5)*0.3);q.setFromEuler(e);sc.set(s,s,s);p.set(x+ox,tt-0.03,z+oz);m.compose(p,q,sc);
      NAT2.fl.setMatrixAt(n,m);NAT2.st.setMatrixAt(n,m);NAT2.fl.setColorAt(n,col);n++;}}
  NAT2.fl.count=NAT2.st.count=n;NAT2.fl.instanceMatrix.needsUpdate=NAT2.st.instanceMatrix.needsUpdate=true;if(NAT2.fl.instanceColor)NAT2.fl.instanceColor.needsUpdate=true;
  NAT2.rocks.length=0;if(GD.rk){const GC=GD.C;for(let i=Math.floor((P.x-30)/GC);i<=Math.floor((P.x+30)/GC);i++)for(let j=Math.floor((P.z-30)/GC);j<=Math.floor((P.z+30)/GC);j++){const c=gdCell(i,j);if(c&&c.k===1&&c.s>0.45)NAT2.rocks.push(c);}}}
function n2Tick(dt){if(!NAT2.on||!state||ui==='start'||(typeof ACC!=='undefined'&&ACC.lite))return;if(!NAT2.fl)n2Init();const P=player;dt=Math.min(dt,0.1);
  const away=P.feet>(P.x>8000?400:300),sid=calNow().season.id;
  if(away){NAT2.fl.count=NAT2.st.count=0;NAT2.cx=1e9;}
  else if(Math.hypot(P.x-NAT2.cx,P.z-NAT2.cz)>7||NAT2.sk!==sid){NAT2.cx=P.x;NAT2.cz=P.z;NAT2.sk=sid;n2Place(sid);}
  const out=!away&&n2Out(P.x,P.z),day=n2Day(),t=performance.now()/1000,m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(0,0,0,'YXZ'),one=new THREE.Vector3(1,1,1),p=new THREE.Vector3();
  // mariposas
  {const want=out&&day&&sid!=='inv'&&NAT2.pts.length>0;let nb=0;for(let i=0;i<NAT2.bf.length;i++){const b=NAT2.bf[i];
    if(!want){b.on=false;continue;}
    if(!b.on||Math.hypot(b.x-P.x,b.z-P.z)>48){if(i>=(sid==='pri'?NAT2.bf.length:sid==='ver'?6:3)){b.on=false;continue;}const f=NAT2.pts[Math.floor(Math.random()*NAT2.pts.length)];b.on=true;b.x=f[0];b.z=f[1];b.y=f[2]+0.6;b.tx=f[0];b.tz=f[1];b.fl=0;}
    const dP=Math.hypot(b.x-P.x,b.z-P.z);if(dP<2.6&&b.fl<=0){b.fl=2.5;const a=Math.atan2(b.z-P.z,b.x-P.x);b.tx=b.x+Math.cos(a)*8;b.tz=b.z+Math.sin(a)*8;}
    if(Math.hypot(b.tx-b.x,b.tz-b.z)<0.4){const f=NAT2.pts[Math.floor(Math.random()*NAT2.pts.length)];if(Math.hypot(f[0]-b.x,f[1]-b.z)<14){b.tx=f[0]+(Math.random()-0.5);b.tz=f[1]+(Math.random()-0.5);}else{b.tx=b.x+(Math.random()-0.5)*5;b.tz=b.z+(Math.random()-0.5)*5;}}
    b.fl-=dt;const sp=b.fl>0?2.6:0.9,dx=b.tx-b.x,dz=b.tz-b.z,d=Math.hypot(dx,dz)||1,wob=Math.sin(t*3.1+b.ph)*0.8;b.x+=(dx/d+Math.cos(t*2+b.ph)*0.5)*sp*dt;b.z+=(dz/d+wob*0.5)*sp*dt;
    const gy=terrainH(b.x,b.z);b.y+=((gy+(b.fl>0?1.8:0.45+0.35*Math.abs(Math.sin(t*1.7+b.ph))))-b.y)*Math.min(1,dt*3);
    const yaw=Math.atan2(-dx,-dz),fa=0.15+1.1*Math.abs(Math.sin(t*(b.fl>0?26:17)+b.ph));p.set(b.x,b.y,b.z);
    e.set(0,yaw,fa);q.setFromEuler(e);m.compose(p,q,one);NAT2.bfR.setMatrixAt(nb,m);e.set(0,yaw,-fa);q.setFromEuler(e);m.compose(p,q,one);NAT2.bfL.setMatrixAt(nb,m);
    NAT2.bfR.setColorAt(nb,b.c);NAT2.bfL.setColorAt(nb,b.c);nb++;}
   NAT2.bfR.count=NAT2.bfL.count=nb;NAT2.bfR.instanceMatrix.needsUpdate=NAT2.bfL.instanceMatrix.needsUpdate=true;NAT2.bfR.instanceColor.needsUpdate=NAT2.bfL.instanceColor.needsUpdate=true;}
  // lagartijas: al sol, en primavera y verano; si te acercas, corren y se esconden
  {const want=out&&day&&clock.h>9&&clock.h<17.5&&(sid==='pri'||sid==='ver')&&!(WXS.cl>0.6);
   for(const L of NAT2.lz){if(!want){L.g.visible=false;L.on=false;continue;}
    if(!L.on){if(!NAT2.rocks.length||Math.random()>dt*0.5)continue;const c=NAT2.rocks[Math.floor(Math.random()*NAT2.rocks.length)];const dc=Math.hypot(c.x-P.x,c.z-P.z);if(dc<7||dc>28||NAT2.lz.some(o=>o.on&&o.c===c))continue;
      L.on=true;L.c=c;L.run=0;L.g.position.set(c.x,c.t+0.24*c.s,c.z);L.g.rotation.set(-0.15,Math.random()*TAU,0);L.g.visible=true;continue;}
    const d=Math.hypot(L.g.position.x-P.x,L.g.position.z-P.z);if(!L.run&&d<4.2){L.run=0.45;const a=Math.atan2(L.g.position.z-P.z,L.g.position.x-P.x);L.vx=Math.cos(a)*4.5;L.vz=Math.sin(a)*4.5;L.g.rotation.set(0,Math.atan2(-L.vx,-L.vz),0);}
    if(L.run){L.run-=dt;L.g.position.x+=L.vx*dt;L.g.position.z+=L.vz*dt;L.g.position.y=terrainH(L.g.position.x,L.g.position.z)+0.02;if(L.run<=0){L.on=false;L.g.visible=false;}}
    else if(d>40){L.on=false;L.g.visible=false;}}}
  // saltamontes: saltan delante de ti cuando andas por el campo (finales de primavera, verano y otoño)
  {const lp=NAT2.lp||(NAT2.lp={x:P.x,z:P.z});const v=Math.hypot(P.x-lp.x,P.z-lp.z)/Math.max(dt,1e-3);lp.x=P.x;lp.z=P.z;
   NAT2.ghT-=dt;if(out&&day&&sid!=='inv'&&v>1.2&&v<9&&!MOUNT.riding&&NAT2.ghT<=0){NAT2.ghT=0.7+Math.random()*1.6;const G=NAT2.gh.find(o=>o.t<0);
     if(G){const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),side=(Math.random()-0.5)*1.6,dd=1.3+Math.random()*1.2,sx=P.x+fx*dd-fz*side,sz=P.z+fz*dd+fx*side;
       if((P.x>8000||roadDist(sx,sz)>2.4)&&isFree(sx,sz,0.3)){const a=Math.atan2(sz-P.z,sx-P.x)+(Math.random()-0.5)*1.2,L=1.2+Math.random()*1.2;G.t=0;G.T=0.42+Math.random()*0.15;G.a=[sx,sz];G.b=[sx+Math.cos(a)*L,sz+Math.sin(a)*L];G.m.rotation.set(0,Math.atan2(-Math.cos(a),-Math.sin(a)),0);G.m.visible=true;}}}
   for(const G of NAT2.gh){if(G.t<0)continue;G.t+=dt;const k=Math.min(1,G.t/G.T),x=G.a[0]+(G.b[0]-G.a[0])*k,z=G.a[1]+(G.b[1]-G.a[1])*k;G.m.position.set(x,terrainH(x,z)+0.03+Math.sin(k*Math.PI)*0.55,z);G.m.rotation.x=-0.6+k*1.2;if(G.t>G.T+0.9){G.t=-1;G.m.visible=false;}}}
  // hojas secas que cruzan con las rachas, en otoño
  {const want=out&&sid==='oto'&&WIND.s.value>0.85;let nl=0;for(const L of NAT2.lvs){if(!want&&!L.on)continue;
    if(!L.on){if(Math.random()>dt*1.2)continue;const a=Math.random()*TAU,r=6+Math.random()*10;L.on=true;L.x=P.x-14;L.z=P.z+Math.sin(a)*r;L.y=terrainH(L.x,L.z)+0.2+Math.random()*1.5;L.v=2+Math.random()*2.5;L.ph=Math.random()*9;}
    L.x+=L.v*WIND.s.value*dt;L.z+=Math.sin(t*1.3+L.ph)*0.6*dt;const gy=terrainH(L.x,L.z)+0.05;L.y=Math.max(gy,L.y+Math.sin(t*2.2+L.ph)*0.5*dt-0.12*dt);
    if(L.x>P.x+16){L.on=false;continue;}e.set(t*3+L.ph,t*2.1+L.ph,t*4.3);q.setFromEuler(e);p.set(L.x,L.y,L.z);m.compose(p,q,one);NAT2.lv.setMatrixAt(nl++,m);}
   NAT2.lv.count=nl;NAT2.lv.instanceMatrix.needsUpdate=true;}}
