// ============================================================ RUTINAS Y SONIDO POR ZONAS
// Algunos personajes principales cambian de sitio según la hora, como en la vida real. Solo se «teletransportan»
// cuando no los ves; si estás cerca y el trayecto es corto, caminan. Al encontrarlos fuera de su sitio te explican por qué.
const RUT={t:0,seen:{},zt:0,hamT:0,dockT:0,babT:0};
// [desde, hasta, lugar (id de PLACES o [x,z]), desplazamiento x, z, explicación con fuente]
const RUT_A={
  dicasta:[[13.5,18,'mercado',10,14,'Por la tarde, cuando se levantan los tribunales, los jueces van a las tiendas del Ágora: barberías, perfumerías y zapaterías eran lugares de charla (Lisias 24.20; Aristófanes, Aves 1441).']],
  aristofanes:[[13,17.5,'mercado',-12,10,'Por la tarde Aristófanes baja al Ágora a escuchar a la gente: de allí saca a sus personajes (Aristófanes, Caballeros y Acarnienses, llenos de vendedores del mercado).']],
  mageiros:[[6.5,10,'mercado',16,-8,'De madrugada el cocinero compra pescado en el mercado: el pescado era caro y se acababa pronto, y los cómicos se burlaban de los pescaderos (Ateneo 6.224-228).']],
  manes:[[7,11,'krene',6,6,'Por la mañana, Manes va a por agua a la fuente: era trabajo de esclavos y de mujeres (Aristófanes, Lisístrata 327-335).']],
  lisias:[[14,18,'ceca',8,8,'Por la tarde Lisias visita a sus clientes cerca de la Ceca y los bancos: escribía discursos por encargo y cobraba por ellos (Dionisio de Halicarnaso, Lisias 1).']],
  naucleros:[[14,19,'pir_agora',10,6,'Por la tarde el armador va al Deigma, el «muestrario» del Pireo, donde se exhibían las mercancías y se cerraban los préstamos marítimos (Demóstenes 35.29).']],
  prodico:[[15,18.5,'poikile',8,4,'Por la tarde Pródico pasea por los pórticos del Ágora buscando alumnos; sus lecciones de pago, de una o de cincuenta dracmas, las daba en casas privadas (Platón, Crátilo 384b; Protágoras 314e-315d).']]
};
const RUT_R={
  marcial:[[5.5,8.5,[602,372],4,4,'Al alba, Marcial hace de cliente: la salutatio a su patrono, con la toga puesta (Marcial 3.36; 10.70).'],[13.5,16,'ro_termas',6,10,'A la octava hora, todos a las termas (Marcial 4.8; 10.48).']],
  cliente:[[9,12,'ro_basilica_julia',8,10,'Tras la salutatio, Lucio Fabio acompaña a su patrono al Foro: los clientes hacían de séquito (Carcopino, La vida cotidiana en Roma; Marcial 10.70).'],[13.5,16,'ro_termas',-8,8,'A la hora del baño, a las termas (Marcial 4.8).']],
  plinio:[[8,12.5,'ro_basilica_julia',-6,8,'Por la mañana Plinio defiende causas ante el tribunal de los centunviros, que se reunía en la Basílica Julia (Plinio, Cartas 6.33).']],
  tacito:[[13.5,16,'ro_termas',10,-6,'Por la tarde, al baño: hasta los senadores pasaban por las termas públicas (Séneca, Cartas 86; Marcial 4.8).']],
  quintiliano:[[14,17,'ro_termas',-10,-8,'Acabadas las clases de la mañana, Quintiliano va a las termas (Marcial 4.8, la jornada romana por horas).']],
  vigil:[[21,24,'ro_insulae',6,6,'De noche, los vigiles hacen la ronda por las insulae buscando fuegos: debían llevar cubos y hachas (Digesto 1.15.3).'],[0,5,'ro_insulae',6,6,'De noche, los vigiles hacen la ronda por las insulae buscando fuegos: debían llevar cubos y hachas (Digesto 1.15.3).']],
  mercader:[[14,18,'ro_horrea',8,8,'Por la tarde, el mercader revisa sus mercancías en los almacenes (horrea) junto al Emporio.']]
};
function rutSpot(n){const T=(MODE==='roma'?RUT_R:RUT_A)[n.data.id];if(!T)return null;const h=clock.h;
  for(const r of T)if(h>=r[0]&&h<r[1]){let p=r[2];if(typeof p==='string'){const q=PLACES.find(o=>o.id===p);if(!q)return null;p=[q.x,q.z];}
    if(!n.rtC)n.rtC={};const key=r[0]+'_'+r[1];if(!n.rtC[key])n.rtC[key]=findFree(p[0]+r[3],p[1]+r[4],0.8);return {x:n.rtC[key][0],z:n.rtC[key][1],why:r[5],key};}
  return {x:n.rx0,z:n.rz0,why:null,key:'home'};}
function rutPlace(n,x,z){n.x=x;n.z=z;n.g.position.set(x,floorAt(x,z),z);}
function rutTick(dt){if(!state||ui!=='play'||player.x>8000)return;RUT.t-=dt;
  for(const n of npcObjs){if(!n.rtWalk)continue;const dx=n.rtWalk.x-n.x,dz=n.rtWalk.z-n.z,d=Math.hypot(dx,dz);
    if(d<0.3){personWalk(n.g,0,0);n.rtWalk=null;continue;}const st=Math.min(d,1.25*dt),nx=n.x+dx/d*st,nz=n.z+dz/d*st;if(!isFree(nx,nz,0.3)&&isFree(n.x,n.z,0.3)){personWalk(n.g,0,0);if(Math.hypot(player.x-n.x,player.z-n.z)>30)rutPlace(n,n.rtWalk.x,n.rtWalk.z);n.rtWalk=null;continue;}rutPlace(n,nx,nz);n.rtPh=(n.rtPh||0)+st*4.6;personWalk(n.g,n.rtPh,1);n.g.rotation.y=Math.atan2(dx,dz);}
  if(RUT.t>0)return;RUT.t=1.5;
  for(const n of npcObjs){if(n.hidden||n.x>8000)continue;const T=(MODE==='roma'?RUT_R:RUT_A)[n.data.id];if(!T)continue;
    if(n.rx0===undefined){n.rx0=n.x;n.rz0=n.z;}
    const s=rutSpot(n);if(!s||n.rtWalk)continue;const d=Math.hypot(s.x-n.x,s.z-n.z);if(d<1){n.rtKey=s.key;continue;}
    if(typeof dlg!=='undefined'&&dlg&&dlg.n===n)continue;
    const pa=Math.hypot(player.x-n.x,player.z-n.z),pb=Math.hypot(player.x-s.x,player.z-s.z);
    if(pa>110&&pb>110){rutPlace(n,s.x,s.z);n.v2r=undefined;n.rtKey=s.key;}
    else if(d<70){n.rtWalk={x:s.x,z:s.z};n.rtKey=s.key;}}
  // si te encuentras a alguien fuera de su sitio habitual, te cuenta por qué
  for(const n of npcObjs){if(!n.rtKey||n.rtKey==='home'||n.rtWalk)continue;const d=Math.hypot(player.x-n.x,player.z-n.z);if(d>9)continue;
    const k=n.data.id+n.rtKey+(state.day||1);if(RUT.seen[k])continue;RUT.seen[k]=1;const s=rutSpot(n);if(s&&s.why)toast('<span class="label">'+n.data.name+'</span><br>'+s.why);}}
// ---- sonido por zonas: murmullo de voces donde hay gente, martillos en los talleres, agua en las fuentes, el puerto
const VOW=[[730,1090],[530,1840],[270,2290],[570,840],[300,870],[660,1700]];
function sfxSyll(t,f0,pan,vol){const c=AUD.ctx,v=VOW[Math.floor(Math.random()*VOW.length)],dur=0.07+Math.random()*0.13;let dest=AUD.master;
  if(c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=pan;p.connect(AUD.master);dest=p;}
  const o=c.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(f0,t);o.frequency.linearRampToValueAtTime(f0*(0.85+Math.random()*0.35),t+dur);
  const g=envGain(t,vol,0.02,dur,dest);for(const[fq,q,a]of[[v[0],6,1],[v[1],9,0.5]]){const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=fq;f.Q.value=q;const ga=c.createGain();ga.gain.value=a;o.connect(f).connect(ga).connect(g);}
  o.start(t);o.stop(t+dur+0.1);}
function sfxPhrase(pan,vol){if(!aOK())return;let t=AUD.ctx.currentTime+0.02;const f0=Math.random()<0.5?95+Math.random()*50:170+Math.random()*70,n=2+Math.floor(Math.random()*6);
  for(let i=0;i<n;i++){sfxSyll(t,f0*(1+(Math.random()-0.5)*0.12),pan,vol);t+=0.12+Math.random()*0.12;}}
function sfxClang(vol){if(!aOK())return;const c=AUD.ctx,t=c.currentTime,b=900+Math.random()*250;
  for(const[k,a,dc]of[[1,1,0.35],[2.76,0.5,0.22],[5.4,0.25,0.12]]){const o=c.createOscillator();o.type='sine';o.frequency.value=b*k;o.connect(envGain(t,vol*a,0.002,dc));o.start(t);o.stop(t+dc+0.05);}
  gfNoise(t,'bandpass',2500,1.5,vol*0.8,0.001,0.03);}
function sfxKnock(vol){if(!aOK())return;const t=AUD.ctx.currentTime;gfNoise(t,'bandpass',330+Math.random()*120,5,vol,0.002,0.09);}
function rutPts(ids){return ids.map(id=>PLACES.find(q=>q.id===id)).filter(Boolean);}
function zoneNear(ids,r){let best=1e9;for(const q of rutPts(ids)){const d=Math.hypot(q.x-player.x,q.z-player.z);if(d<best)best=d;}return clamp(1-best/r,0,1);}
const ZS_A={fra:['hefestion'],agua:['fuente','krene','fuente_ciudad_-270','ninfas'],puerto:['pireo','pir_agora','pir_zea']},
  ZS_R={fra:['ro_subura','ro_insulae'],agua:['ro_lacus','ro_acueducto','fuente_ciudad_724','ro_curtius'],puerto:['ro_emporio','ro_horrea']};
function zsInit(){if(RUT.wat||!AUD.ctx||!AUD.noise)return;const c=AUD.ctx,s=c.createBufferSource();s.buffer=AUD.noise;s.loop=true;s.playbackRate.value=1.3;
  const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=2300;f.Q.value=0.8;const am=c.createGain();am.gain.value=0.6;const lfo=c.createOscillator();lfo.frequency.value=5.3;const lg=c.createGain();lg.gain.value=0.35;lfo.connect(lg).connect(am.gain);
  RUT.wat=c.createGain();RUT.wat.gain.value=0;s.connect(f).connect(am).connect(RUT.wat).connect(AUD.master);s.start();lfo.start();}
function zsTick(dt){if(!aOK()||!state||ui==='start')return;zsInit();if(!RUT.wat)return;const now=AUD.ctx.currentTime,mute=typeof ACC!=='undefined'&&ACC.noAmb,inMap=player.x<8000,Z=MODE==='roma'?ZS_R:ZS_A;
  const day=DAYF>0.35&&clock.h>6&&clock.h<20;
  RUT.wat.gain.setTargetAtTime(!mute&&inMap?0.03*zoneNear(Z.agua,28):0,now,0.5);
  RUT.zt-=dt;if(RUT.zt>0||mute)return;const st=0.25-RUT.zt;RUT.zt=0.25;
  // voces: cuanta más gente cerca, más frases sueltas, que llegan desde donde está cada uno
  let n=0,pick1=null;for(const w of walkers){if(w.home||!w.g.visible)continue;const dx=w.g.position.x-player.x,dz=w.g.position.z-player.z,d=Math.hypot(dx,dz);if(d<24){n++;if(!pick1||Math.random()<1/n)pick1=[dx,dz,d];}}
  if(pick1&&Math.random()<st*Math.min(2.2,n*0.18)){const[dx,dz,d]=pick1,a=Math.atan2(dx,dz)-player.yaw;const pan=clamp(-Math.sin(a),-0.9,0.9);sfxPhrase(pan,0.012*clamp(1.4-d/20,0.3,1.2));}
  if(!inMap)return;
  // martillos en el barrio de los broncistas (las fundiciones excavadas junto al Hefestion) o en las tiendas de la Subura
  const fr=zoneNear(Z.fra,70);if(day&&fr>0){RUT.hamT-=st;if(RUT.hamT<0){RUT.hamT=Math.random()<0.25?2+Math.random()*4:0.45+Math.random()*0.25;sfxClang(0.05*fr);}}
  const pu=zoneNear(Z.puerto,MODE==='roma'?120:160);if(day&&pu>0){RUT.dockT-=st;if(RUT.dockT<0){RUT.dockT=0.8+Math.random()*3;if(Math.random()<0.6)sfxKnock(0.06*pu);else sfxPhrase(Math.random()*1.4-0.7,0.016*pu);}}}
// los árboles y plantas de los destinos se plantan antes de excavar ríos y caminos: al final de la carga
// se vuelven a posar en el suelo los que quedaron en el aire, y se quitan los que caen dentro del agua
function vegSnap(){const m4=new THREE.Matrix4(),v=new THREE.Vector3();let mov=0,del=0;
  for(const C of CHUNKS){const im=C.im;if(!im||!im.userData.veg||!im.isInstancedMesh||C.x<8000)continue;let ch=false;
    for(let i=0;i<im.count;i++){im.getMatrixAt(i,m4);v.setFromMatrixPosition(m4);if(v.y<-50)continue;
      const w=riverWater(v.x,v.z),t=terrainH(v.x,v.z);
      if(w!==null&&w>t+0.3){m4.makeScale(0,0,0);im.setMatrixAt(i,m4);ch=true;del++;continue;}
      const dy=v.y-t;if(dy>0.6&&dy<120){m4.elements[13]-=dy;im.setMatrixAt(i,m4);ch=true;mov++;}}
    if(ch)im.instanceMatrix.needsUpdate=true;}
  for(const c of CARTERS){if(!c.g)continue;const y=floorAt(c.x,c.z);if(Math.abs(c.g.position.y-y)>0.3){c.g.position.y=y;c.g.updateMatrixWorld(true);mov++;}}   // los carreteros, igual
  return[mov,del];}
// detalle del suelo en 3D alrededor del jugador: piedras sueltas (más en pendientes y pedregales) y matas de hierba,
// secas en el Ática y en los destinos áridos, verdes en Italia y en los destinos húmedos; nada dentro de las ciudades ni en los caminos.
// Cada celda de 3,5 m decide siempre lo mismo (según su posición), así que al andar el detalle se recoloca sin cambiar.
const GD={C:3.5,R:isTouch?42:56,cx:1e9,cz:1e9,rk:null,tf:null,cache:new Map(),on:true};
function gdInit(){const rg=new THREE.IcosahedronGeometry(0.5,0);{const P=rg.attributes.position;for(let i=0;i<P.count;i++){const k=0.78+hash(Math.round(P.getX(i)*97),Math.round(P.getZ(i)*89+P.getY(i)*53))*0.4;P.setXYZ(i,P.getX(i)*k,P.getY(i)*k,P.getZ(i)*k);}rg.computeVertexNormals();}
  // matorral bajo (tomillo, salvia, lentisco): más redondeado que antes (parecía una roca facetada): más caras, bultos suaves y normales de esfera
  const tg=new THREE.IcosahedronGeometry(0.5,2);{const P=tg.attributes.position,N=tg.attributes.normal,v=new THREE.Vector3();for(let k=0;k<P.count;k++){const x=P.getX(k),y=P.getY(k),z=P.getZ(k),n=0.9+0.12*Math.sin(x*9+z*5)*Math.cos(y*7+x*3);P.setXYZ(k,x*n,Math.max(-0.05,y)*n*0.75+0.1,z*n);v.set(x,y*0.9+0.08,z).normalize();N.setXYZ(k,v.x,v.y,v.z);}N.needsUpdate=true;}   // matorral bajo y redondeado (tomillo, salvia, lentisco), del mismo estilo facetado que árboles y arbustos
  const NR=isTouch?600:1100,NT=isTouch?1500:3000;
  GD.rk=new THREE.InstancedMesh(rg,triplanar(new THREE.MeshLambertMaterial({color:0xffffff}),PTEX.rock,1.6),NR);GD.tf=new THREE.InstancedMesh(tg,triplanar(new THREE.MeshLambertMaterial({color:0xffffff}),PTEX.leaf,1.2),NT);
  for(const im of[GD.rk,GD.tf]){im.count=0;im.frustumCulled=false;im.receiveShadow=true;im.userData.noCull=true;im.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(im.instanceMatrix.count*3),3);scene.add(im);}}
const GD_RC=['#a39b8c','#b3a993','#8f887b','#c2b59a','#9a8f80'].map(c=>new THREE.Color(c)),GD_DRY=['#8a8a58','#7d7f4e','#959060','#86865a','#9a9468'].map(c=>new THREE.Color(c)),GD_GRN=['#5f7438','#566b33','#6a7d40','#62763c','#74804a'].map(c=>new THREE.Color(c));
function gdCell(i,j){const k=i+','+j;let r=GD.cache.get(k);if(r!==undefined)return r;r=null;const C=GD.C,x=(i+hash(i,j*7+3))*C,z=(j+hash(i*5+1,j))*C;
  do{const t=terrainH(x,z);if(t<1.2)break;const w=riverWater(x,z);if(w!==null&&w>t-0.3)break;
    let green,desert=false;if(x>8000){const I=islandOf(x);if(!I)break;green=!!I.green;desert=!!I.desert;}else{if(MODE==='roma'?romaInUrbs(x,z):insideWalls(x,z))break;green=MODE==='roma';}
    if(!isFree(x,z,0.9))break;
    const sl=(Math.abs(terrainH(x+1.2,z)-terrainH(x-1.2,z))+Math.abs(terrainH(x,z+1.2)-terrainH(x,z-1.2)))/4.8,rocky=sl>0.32||fbm(x*0.02+5,z*0.02)>0.66,u=hash(i*3+7,j*11+5);
    if(x<8000&&!rocky&&u<0.9&&roadDist(x,z)<3.5)break;
    if(rocky?u<0.55:u<0.06){r={k:1,x,z,t,s:rocky?0.3+hash(i,j+9)*0.9:0.15+hash(i,j+9)*0.3,c:GD_RC[Math.floor(hash(i+2,j)*5)]};break;}
    const dens=desert?0.08:green?0.45:0.32;if(u>dens)break;const g=green?hash(j,i+4)<0.8:hash(j,i+4)<0.15;
    r={k:2,x,z,t,s:0.45+hash(i+5,j+5)*0.75,c:(g?GD_GRN:GD_DRY)[Math.floor(hash(i,j+2)*5)]};}while(false);
  if(GD.cache.size>60000)GD.cache.clear();GD.cache.set(k,r);return r;}
function gdTick(){if(!GD.on||!state||ui==='start')return;if(!GD.rk)gdInit();const P=player;if(P.feet>(P.x>8000?400:300)||Math.hypot(P.x-GD.cx,P.z-GD.cz)<6)return;GD.cx=P.x;GD.cz=P.z;
  const C=GD.C,R=GD.R,i0=Math.floor((P.x-R)/C),i1=Math.floor((P.x+R)/C),j0=Math.floor((P.z-R)/C),j1=Math.floor((P.z+R)/C),m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),sc=new THREE.Vector3(),p=new THREE.Vector3();
  let nr=0,nt=0;const MR=GD.rk.instanceMatrix.count,MT=GD.tf.instanceMatrix.count;
  for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const c=gdCell(i,j);if(!c)continue;const dx=c.x-P.x,dz=c.z-P.z;if(dx*dx+dz*dz>R*R)continue;
    if(c.k===1&&nr<MR){const n=c.s>0.6?2:1;for(let k=0;k<n&&nr<MR;k++){const ox=k?(hash(i,j+21)-0.5)*1.6:0,oz=k?(hash(i+21,j)-0.5)*1.6:0,s=k?c.s*0.6:c.s;e.set((hash(i,j+31)-0.5)*0.6,hash(i+31,j)*TAU,(hash(i+41,j)-0.5)*0.6);q.setFromEuler(e);sc.set(s*(0.8+hash(i,j+51)*0.6),s*(0.45+hash(i+51,j)*0.4),s*(0.8+hash(i+61,j)*0.5));p.set(c.x+ox,c.t-0.12*s,c.z+oz);
        m.compose(p,q,sc);GD.rk.setMatrixAt(nr,m);GD.rk.setColorAt(nr,c.c);nr++;}}
    else if(c.k===2&&nt<MT){e.set(0,hash(i+71,j)*TAU,0);q.setFromEuler(e);sc.set(c.s*(0.9+hash(i,j+91)*0.4),c.s*(0.7+hash(i,j+81)*0.5),c.s*(0.9+hash(i+91,j)*0.4));p.set(c.x,c.t-0.08*c.s,c.z);m.compose(p,q,sc);GD.tf.setMatrixAt(nt,m);GD.tf.setColorAt(nt,c.c);nt++;}}
  GD.rk.count=nr;GD.tf.count=nt;for(const im of[GD.rk,GD.tf]){im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;}}
