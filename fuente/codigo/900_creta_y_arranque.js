// ============================================================ EL INTERIOR DE CRETA (modo Atenas): tres tramos de tierra (camino del Ida, monte Ida, llanura de la Mesara)
// Están en una franja lejana del mapa (x de Creta, z ≈ +16000). Dentro de la franja, floorAt/terrainH dan el relieve propio (crtH); al cruzar el
// borde norte o sur de un tramo se pasa al siguiente con un fundido. Del mapa de Creta se entra por el poste «El camino del Ida».
// También: la cueva de Maya en el monte Cilene (junto al lago Estínfalo), donde nació Hermes.
const CRT={X:0,Z0:16000,DZ:2000,H:400,seg:null,built:false,objs:[],trail:null,percT:0,lyreT:0,cave:null,maia:null,saidCur:false,edgeT:0};
const CRT_SEGS={
 camino:{k:0,name:'El camino del Ida',gr:'ΟΔΟΣ ΙΔΑΙΑ',sub:'De Cnosos hacia el monte de Zeus, entre olivos y cipreses',n:'@creta',s:'ida',
  road:[[0,-400],[12,-220],[-18,-40],[14,160],[0,400]]},
 ida:{k:1,name:'El monte Ida',gr:'ΙΔΗ',sub:'La montaña de Zeus, en el centro de Creta',n:'camino',s:'mesara',
  road:[[0,-400],[40,-250],[120,-100],[200,80],[210,250],[150,400]],branch:[[40,-250],[-20,-140],[-58,-78]]},
 mesara:{k:2,name:'La llanura de la Mesara',gr:'ΜΕΣΑΡΑ',sub:'Festo y Gortina, en el sur de Creta',n:'ida',
  road:[[150,-400],[80,-220],[20,-60],[-200,40]],branch:[[20,-60],[190,-60]]}};
function crtSegZ(id){return CRT.Z0+CRT_SEGS[id].k*CRT.DZ;}
function crtBand(x,z){return CRT.X&&Math.abs(x-CRT.X)<CRT.H+350&&z>CRT.Z0-CRT.H-350&&z<CRT.Z0+2*CRT.DZ+CRT.H+350;}
function crtSegOf(z){let best=null,bd=1e9;for(const id in CRT_SEGS){const d=Math.abs(z-crtSegZ(id));if(d<bd){bd=d;best=id;}}return best;}
const _g=(x,z,cx,cz,s)=>Math.exp(-((x-cx)*(x-cx)+(z-cz)*(z-cz))/(2*s*s));
function crtHL(id,lx,lz){
  if(id==='camino')return 14+5*Math.sin(lx/70+1)*Math.cos(lz/90)+3*Math.sin((lx+lz)/40)+75*_g(lx,lz,270,-80,90)+30*_g(lx,lz,-300,150,120);
  if(id==='ida')return 16+150*_g(lx,lz,-70,120,170)+40*_g(lx,lz,330,0,100)+4*Math.sin(lx/50)*Math.cos(lz/60);
  return 8+2*Math.sin(lx/80)*Math.cos(lz/70)+14*_g(lx,lz,-220,60,70)+60*Math.exp(-((lz-430)*(lz-430))/(2*60*60))+30*Math.exp(-((lz+430)*(lz+430))/(2*80*80));}
function crtH(x,z){const id=crtSegOf(z);return crtHL(id,x-CRT.X,z-crtSegZ(id));}
function crtW(id,lx,lz){return[CRT.X+lx,crtSegZ(id)+lz];}
// cinta de camino que sigue el relieve
function crtRoad(id,pts,w,col){const P=[],I=[];let n=0;for(let i=0;i<pts.length-1;i++){const[a,b]=[pts[i],pts[i+1]],L=Math.hypot(b[0]-a[0],b[1]-a[1]),st=Math.ceil(L/4),dx=(b[0]-a[0])/L,dz=(b[1]-a[1])/L;
    for(let k=0;k<=st;k++){const lx=a[0]+dx*L*k/st,lz=a[1]+dz*L*k/st;for(const sd of[-1,1]){const px=lx-dz*w/2*sd,pz=lz+dx*w/2*sd,[wx,wz]=crtW(id,px,pz);P.push(wx,crtHL(id,px,pz)+0.08,wz);}if(k>0){const o=n-2;I.push(o,o+1,o+2,o+1,o+3,o+2);}n+=2;}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setIndex(I);g.computeVertexNormals();const m=new THREE.Mesh(g,lam(col||'#b49a72',{side:THREE.DoubleSide}));m.receiveShadow=true;scene.add(m);}
function crtTerrain(id){const S=900,N=110,g=new THREE.PlaneGeometry(S,S,N,N);g.rotateX(-Math.PI/2);const p=g.attributes.position,cz=crtSegZ(id),cols=[];
  const c=new THREE.Color(),grass=new THREE.Color('#6f8240'),dry=new THREE.Color('#9c8a52'),rock=new THREE.Color('#8a8072'),snow=new THREE.Color('#eef0f0');
  for(let i=0;i<p.count;i++){const lx=p.getX(i),lz=p.getZ(i),h=crtHL(id,lx,lz),hx=crtHL(id,lx+3,lz)-crtHL(id,lx-3,lz),hz=crtHL(id,lx,lz+3)-crtHL(id,lx,lz-3),sl=Math.hypot(hx,hz)/6;
    p.setXYZ(i,CRT.X+lx,h,cz+lz);c.copy(grass).lerp(dry,0.3+0.3*Math.sin(lx*0.02+lz*0.017));if(sl>0.35)c.lerp(rock,Math.min(1,(sl-0.35)*2.5));if(h>125)c.lerp(snow,Math.min(1,(h-125)/18));cols.push(c.r,c.g,c.b);}
  g.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));g.computeVertexNormals();const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true}));m.receiveShadow=true;scene.add(m);
  // montes lejanos alrededor (para que no se vea el mar en el horizonte)
  const r=mulberry32(70+CRT_SEGS[id].k);for(let i=0;i<16;i++){const a=i/16*TAU+r()*0.3,d=700+r()*500,h=120+r()*220;const mm=new THREE.Mesh(new THREE.ConeGeometry(320+r()*260,h,9,1),new THREE.MeshLambertMaterial({color:id==='ida'?'#7f8a80':'#8f8466'}));mm.position.set(CRT.X+Math.cos(a)*d,h/2-10,cz+Math.sin(a)*d);scene.add(mm);}}
function crtTree(id,lx,lz,kind){const[wx,wz]=crtW(id,lx,lz),y=crtHL(id,lx,lz),g=grp(wx,y,wz,0);
  if(kind==='cipres'){const c=new THREE.Mesh(new THREE.ConeGeometry(0.9,7,7),lam('#3e5a34'));c.position.y=3.8;g.add(c);}
  else if(kind==='olivo'){box(0.35,1.6,0.35,lam('#6a5a44'),0,0.8,0,g);const s=new THREE.Mesh(new THREE.SphereGeometry(1.6,7,5),lam('#8a9a6e'));s.scale.y=0.7;s.position.y=2.3;g.add(s);}
  else{box(0.5,2.4,0.5,lam('#5a4630'),0,1.2,0,g);const s=new THREE.Mesh(new THREE.SphereGeometry(2.6,7,5),lam('#55703a'));s.position.y=4;g.add(s);}addCirc(wx,wz,0.5);}
function crtGoat(id,lx,lz,col,broken){const[wx,wz]=crtW(id,lx,lz),g=grp(wx,crtHL(id,lx,lz),wz,Math.random()*TAU),m=lam(col||'#d8d0c0');box(0.45,0.45,0.9,m,0,0.7,0,g);box(0.25,0.3,0.35,m,0,0.95,0.55,g);for(const[a,b]of[[-0.15,-0.3],[0.15,-0.3],[-0.15,0.3],[0.15,0.3]])box(0.08,0.5,0.08,m,a,0.25,b,g);
  for(const s of[-1,1]){if(broken&&s>0){box(0.05,0.1,0.05,lam('#a89878'),s*0.08,1.15,0.5,g);continue;}const h=new THREE.Mesh(new THREE.ConeGeometry(0.04,0.35,5),lam('#a89878'));h.position.set(s*0.08,1.25,0.48);h.rotation.x=-0.6;g.add(h);}return g;}
function crtPerson(id,lx,lz,look,act,name,sub,r){const[wx,wz]=crtW(id,lx,lz),g=makePerson(look);g.position.set(wx,crtHL(id,lx,lz),wz);g.rotation.y=Math.random()*TAU;scene.add(g);const o=egxObj(wx,wz,crtHL(id,lx,lz),act,name,sub,r||3);o.g=g;CRT.objs.push(o);return g;}
function crtStele(id,lx,lz,pid,name,gr,txt,src){const[wx,wz]=crtW(id,lx,lz);place(pid,name,gr,txt,wx,wz,0);const pl=PLACES[PLACES.length-1],s=stele(wx,wz,0,pid);signObjs.push({kind:'sign',data:pl,g:s.g,mk:s.mk,x:wx,z:wz});if(src&&typeof PSRC!=='undefined')PSRC[pid]=src;}
function crtLawTex(){const c=document.createElement('canvas');c.width=1024;c.height=256;const x=c.getContext('2d');x.fillStyle='#cfc4ae';x.fillRect(0,0,1024,256);x.fillStyle='#5a4e3e';x.font='15px Georgia';const L='ΑΒΓΔΕΖΗΘΙΚΛΜΝΟΠΡΣΤΥΦΧ';
  for(let col=0;col<12;col++)for(let row=0;row<15;row++){let s='';for(let k=0;k<9;k++)s+=L[Math.floor(Math.random()*L.length)];x.fillText(row%2?s.split('').reverse().join(''):s,10+col*84,20+row*16);}const t=new THREE.CanvasTexture(c);return new THREE.MeshLambertMaterial({map:t});}
function crtBuild(){if(CRT.built)return;CRT.built=true;const r=mulberry32(123);
  for(const id in CRT_SEGS){crtTerrain(id);const S=CRT_SEGS[id];crtRoad(id,S.road,4.5,'#a08a64');if(S.branch)crtRoad(id,S.branch,3);}
  // ---- el camino del Ida: olivos, viñas, cipreses junto al camino (Platón, Leyes 625b), una aldea, el monte Yuctas
  {const id='camino';for(let i=0;i<140;i++){const lx=(r()-0.5)*760,lz=(r()-0.5)*760;if(Math.abs(lx-(lz>0?10:0))<14)continue;crtTree(id,lx,lz,r()<0.75?'olivo':'roble');}
   for(let lz=-380;lz<380;lz+=26)for(const s of[-1,1])crtTree(id,(lz<-40?6:lz<160?-4:6)+s*9+(lz<-220?6*(lz+400)/180:0),lz,'cipres');
   for(let row=0;row<8;row++)for(let k=0;k<14;k++){const lx=-200+k*4,lz=-150+row*5,[wx,wz]=crtW(id,lx,lz);box(0.25,1.1,0.25,lam('#5f6a34'),wx,crtHL(id,lx,lz)+0.55,wz);}   // viña
   for(let k=0;k<7;k++){const lx=-110+(k%4)*16,lz=80+Math.floor(k/4)*18,[wx,wz]=crtW(id,lx,lz);courtyardHouse(wx,wz,R()<0.5?0:Math.PI/2,rr(9,11),rr(9,11),3.2,false);}
   for(let k=0;k<6;k++)crtGoat(id,150+r()*30,-260+r()*30);
   crtPerson(id,160,-240,{female:true,chiton:'#8a7a5a',himation:'#6a5040',hair:'#3a2a1e'},'crt:pastora','Una pastora','con sus cabras',3);
   crtPerson(id,-60,-300,{chiton:'#8a6a4a',short:true,noHimation:true,hair:'#2a1e14',beard:true},'crt:arquero','Un arquero cretense','practicando con el arco',3);
   {const[wx,wz]=crtW(id,-60,-325);const tg=grp(wx,crtHL(id,-60,-325),wz,0);box(0.2,1.8,0.2,lam('#6a5a44'),0,0.9,0,tg);const d=new THREE.Mesh(new THREE.CylinderGeometry(0.7,0.7,0.12,16),lam('#d8c8a8'));d.rotation.x=Math.PI/2;d.position.y=1.7;tg.add(d);}
   crtStele(id,30,-360,'leyes_camino','El camino de las Leyes','ΝΟΜΟΙ','Este es el camino de Cnosos a la cueva de Zeus en el Ida. Platón situará aquí su último diálogo, Las leyes: un ateniense, un cretense y un espartano lo recorren a pie durante el día más largo del año, hablando de cómo deben ser las leyes de una ciudad. Dicen que el camino es largo, pero que tiene sombra de cipreses altísimos y prados para descansar.',{a:['Platón, Leyes I 625a-c'],n:['Platón escribe Las leyes hacia el 350 a.C., unos treinta años después de la época del juego.']});
   crtStele(id,200,-60,'tumba_zeus','El monte Yuctas','ΙΟΥΚΤΑΣ','Desde Cnosos se ve esta montaña con forma de cara tumbada: los cretenses dicen que es Zeus muerto y que en la cumbre está su tumba. Para los demás griegos era un escándalo: un dios no puede morir. Calímaco escribirá: «Los cretenses, siempre mentirosos: hasta te han hecho una tumba, señor, pero tú no moriste».',{a:['Calímaco, Himno a Zeus 8-9'],m:['En la cumbre hay un santuario de la Edad del Bronce.']});}
  // ---- el monte Ida: la cueva de Zeus, Amaltea y los curetes
  {const id='ida';for(let i=0;i<110;i++){const lx=(r()-0.5)*760,lz=(r()-0.5)*760;if(crtHL(id,lx,lz)>110)continue;crtTree(id,lx,lz,r()<0.4?'cipres':'roble');}
   const cx=-62,cz=-86,[wx,wz]=crtW(id,cx,cz),y=crtHL(id,cx,cz);const g=grp(wx,y,wz,Math.PI);   // la boca mira al norte
   {const hill=new THREE.Mesh(new THREE.SphereGeometry(13,12,8,0,TAU,0,Math.PI/2),lam('#7d766c'));hill.scale.set(1,0.75,0.9);hill.position.set(0,-1.5,-6);g.add(hill);}box(4.2,3.8,0.6,lam('#0d0a09'),0,1.7,5.3,g);for(let k=0;k<9;k++){const ro=new THREE.Mesh(new THREE.DodecahedronGeometry(1.2+r()*1.6,0),lam(k%2?'#7d766c':'#6f685e'));const a=-1.3+k*0.33;ro.position.set(Math.sin(a)*3.4,1.2+Math.cos(a)*3.2,5+r()*0.6);ro.rotation.set(r()*3,r()*3,r()*3);g.add(ro);}
   {const ay=crtHL(id,cx,cz-10)-y;box(1.4,1+Math.max(0,-ay)*0+0.6,1,M.marble,0,ay+0.5,10,g);box(1.8,Math.max(0.3,4-ay),1.4,lam('#7d766c'),0,ay-Math.max(0.3,4-ay)/2+0.1,10,g);}   // altar ante la cueva
   for(let k=0;k<5;k++){const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.6,0.08,18),lam('#a8743a'));sh.rotation.x=Math.PI/2;sh.position.set(-3+k*1.5,4.6,4.4);g.add(sh);}   // escudos de bronce ofrendados
   addCirc(wx,wz+6,10.5);CRT.cave={x:wx,z:wz};
   const am=crtGoat(id,-80,-104,'#f0ece4',true);am.scale.setScalar(1.25);CRT.amal=egxObj(am.position.x,am.position.z,crtHL(id,-80,-104),'crt:amaltea','Una cabra blanca','con un cuerno roto',3);CRT.amal.g=am;CRT.objs.push(CRT.amal);
   crtPerson(id,-44,-108,{chiton:'#7a6a50',himation:'#5a4a3a',beard:true,hair:'#d8d4c8'},'crt:viejo','Un viejo pastor del Ida','junto a la cueva',3.5);
   crtStele(id,-30,-120,'cueva_ida','La cueva del Ida','ΙΔΑΙΟΝ ΑΝΤΡΟΝ','Hesíodo cuenta que Rea dio a luz a Zeus en Creta y lo escondió en una cueva para que su padre Crono no se lo tragara, como a sus hermanos; a Crono le dio a tragar una piedra envuelta en pañales. Unos dicen que fue aquí, en el Ida, y otros que en el monte Dicte. Las ninfas criaron al niño con la leche de la cabra Amaltea, y los curetes, jóvenes guerreros, bailaban golpeando sus lanzas contra los escudos para que Crono no oyera su llanto. En la cueva se dejan como ofrenda escudos de bronce, y se cuenta que aquí bajaron, para iniciarse, Epiménides y Pitágoras.',{a:['Hesíodo, Teogonía 468-491','Apolodoro, Biblioteca I 1.6-7','Calímaco, Himno a Zeus 46-54','Diógenes Laercio VIII 3 (Pitágoras y Epiménides)'],m:['Escudos y ofrendas de bronce de los siglos VIII-VII a.C. hallados en la cueva']});
   crtStele(id,180,60,'ida_cumbre','La cumbre del Ida','ΙΔΗ','El Ida es la montaña más alta de Creta. En primavera aún tiene nieve en la cima. Desde aquí se ven los dos mares: al norte, el que lleva a las Cícladas; al sur, el que lleva a África.',null);}
  // ---- la Mesara: Festo y Gortina
  {const id='mesara';for(let i=0;i<120;i++){const lx=(r()-0.5)*760,lz=(r()-0.5)*700;crtTree(id,lx,lz,r()<0.6?'olivo':'cipres');}
   // Festo: ruinas del palacio sobre la loma, con la gran escalinata
   {const px=-220,pz=60,[wx,wz]=crtW(id,px,pz),y=crtHL(id,px,pz),g=grp(wx,y,wz,0),wm=lam('#cdbf9f');box(26,0.3,18,lam('#d8ccb0'),0,0.15,0,g);
    for(let i=-3;i<3;i++)for(let j=-3;j<3;j++){if(Math.abs(i+0.5)<1.5&&Math.abs(j+0.5)<1.5)continue;if(r()<0.6)box(0.8,rr(0.8,2.2),8,wm,i*9+4.5,0.8,j*8+4,g);if(r()<0.6)box(9,rr(0.8,2.2),0.8,wm,i*9,0.8,j*8+8,g);}
    for(let k=0;k<8;k++)box(16,0.35,1.1,wm,0,-0.2-k*0.35,-28-k*1.1,g);addBox(wx,wz,40,40,0);
    for(let k=0;k<6;k++){const lx=-160+(k%3)*16,lz=110+Math.floor(k/3)*16,[hx,hz]=crtW(id,lx,lz);courtyardHouse(hx,hz,0,rr(8,10),rr(8,10),3,false);}
    crtStele(id,-190,20,'festo','Festo','ΦΑΙΣΤΟΣ','Sobre esta loma, que domina la llanura de la Mesara, están las ruinas de un palacio muy antiguo, con una gran escalinata de piedra. Homero ya cita Festo entre las ciudades de Creta, y se decía que la fundó Minos. Hoy es una ciudad pequeña, vecina y rival de Gortina.',{a:['Homero, Ilíada II 648','Diodoro V 78'],m:['Palacio de la Edad del Bronce, destruido hacia el 1450 a.C.'],n:['Anacronismo señalado: en 1908 se encontró aquí el disco de Festo, un disco de arcilla con signos estampados que nadie ha conseguido leer.']});
    crtPerson(id,-175,40,{female:true,chiton:'#b8a888',himation:'#7a5a6a',hair:'#3a2a1e'},'crt:festo','Una vecina de Festo','junto a las ruinas',3);}
   // Gortina: la pared de las leyes y el plátano de Europa
   {const gx=190,gz=-60;for(let k=0;k<9;k++){const lx=gx-30+(k%3)*18,lz=gz-50+Math.floor(k/3)*16,[hx,hz]=crtW(id,lx,lz);courtyardHouse(hx,hz,Math.PI/2,rr(8,11),rr(8,11),3.2,false);}
    const[wx,wz]=crtW(id,gx,gz),y=crtHL(id,gx,gz),g=grp(wx,y,wz,0),lm=crtLawTex();for(let k=0;k<6;k++){const a=-0.5+k*0.2,seg=box(3.4,2.6,0.6,lm,Math.sin(a)*9,1.3,-Math.cos(a)*9+9,g);seg.rotation.y=-a;}
    addBox(wx,wz+1,18,3,0);
    crtStele(id,gx+12,gz+8,'leyes_gortina','Las leyes de Gortina','ΝΟΜΟΙ ΓΟΡΤΥΝΟΣ','En esta pared están grabadas las leyes de Gortina, en doce columnas que se leen en bustrofedon: una línea de izquierda a derecha y la siguiente al revés, como ara el buey. Hablan de matrimonios y divorcios, de herencias (las hijas heredan la mitad que cada hijo), de adopciones, de esclavos y de multas. Es la inscripción griega más larga que conocemos.',{a:['Código de Gortina (hacia el 450 a.C.), Inscriptiones Creticae IV 72','Homero, Ilíada II 646 (Gortina amurallada)']});
    crtPerson(id,gx+6,gz+14,{chiton:'#d8ccb0',himation:'#5a6a7a',beard:true,hair:'#3a2a1e'},'crt:gortina','Un ciudadano de Gortina','delante de la pared de las leyes',3);
    // el río Leteo y el plátano de Europa
    {const P=[],I=[];let n=0;for(let lz=-400;lz<=400;lz+=8){for(const sd of[-1,1]){const lx=280+Math.sin(lz/60)*12+sd*5,[ax,az]=crtW(id,lx,lz);P.push(ax,crtHL(id,lx,lz)+0.12,az);}if(n>0){const o=n-2;I.push(o,o+1,o+2,o+1,o+3,o+2);}n+=2;}const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.Float32BufferAttribute(P,3));rg.setIndex(I);rg.computeVertexNormals();const rm=new THREE.Mesh(rg,new THREE.MeshPhongMaterial({color:'#3f7f8c',shininess:90,side:THREE.DoubleSide}));scene.add(rm);if(typeof wtrApply==='function')wtrApply(rm.material,{str:0.35});}
    {const tx=262,tz=20,[ax,az]=crtW(id,tx,tz),g2=grp(ax,crtHL(id,tx,tz),az,0);box(1.2,6,1.2,lam('#7a6a54'),0,3,0,g2);for(let k=0;k<5;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(4.5,8,6),lam('#4f7a38'));s.position.set(Math.cos(k*1.3)*3,8+(k%2)*2,Math.sin(k*1.3)*3);g2.add(s);}addCirc(ax,az,1.2);
     crtStele(id,252,36,'platano_europa','El plátano de Europa','ΕΥΡΩΠΗ','Zeus, convertido en un toro blanco, raptó a la princesa Europa en una playa de Fenicia y la trajo a nado hasta Creta. Aquí, junto al río, bajo un plátano, nacieron sus hijos: Minos, Radamantis y Sarpedón. Desde entonces este plátano nunca pierde las hojas, ni en invierno. Las monedas de Gortina muestran a Europa sentada en el árbol.',{a:['Teofrasto, Historia de las plantas I 9.5','Plinio, Historia natural XII 11','Apolodoro, Biblioteca III 1.1-2'],m:['Monedas de Gortina del siglo IV a.C. con Europa en el árbol']});}}}
  // ---- el poste de entrada en el mapa de Creta
  const C=ISLANDS.find(I=>I.id==='creta');if(C){const f=findFree(C.x+40,C.z+90,1.5),g=grp(f[0],floorAt(f[0],f[1]),f[1],0),wd=lam('#6a5038');box(0.22,2.6,0.22,wd,0,1.3,0,g);const pl=box(1.6,0.4,0.08,wd,0.6,2.2,0,g);
   CRT.trail={x:f[0],z:f[1]};const o=egxObj(f[0],f[1],undefined,'crt:entrar','El camino del Ida','hacia el interior de la isla: el Ida, Festo y Gortina',3.5);o.g=g;CRT.objs.push(o);}
}
// la cueva de Maya en el monte Cilene, junto al lago Estínfalo
function crtMaia(){const I=ISLANDS.find(q=>q.id==='estinfalo'),P=PORTS.estinfalo;if(!I||!P)return;const f=findFree(P.x+70,P.z-50,2);caveMouth(f[0],f[1],Math.atan2(P.x-f[0],P.z-f[1]));
  CRT.maia={x:f[0],z:f[1]};const sx=f[0]+6,sz=f[1]+4;place('cueva_maya','La cueva de Maya','ΚΥΛΛΗΝΗ','En esta cueva sombría del monte Cilene, Maya, hija de Atlas, dio a luz a Hermes. El niño nació al amanecer; a mediodía ya tocaba la lira, que inventó con el caparazón de una tortuga, y por la tarde robó las vacas de su hermano Apolo. En la cumbre del Cilene hay un templo de Hermes.',sx,sz,0);
  const pl=PLACES[PLACES.length-1],s=stele(sx,sz,0,'cueva_maya');signObjs.push({kind:'sign',data:pl,g:s.g,mk:s.mk,x:sx,z:sz});if(typeof PSRC!=='undefined')PSRC.cueva_maya={a:['Himno homérico a Hermes 1-19 y 24-61','Pausanias VIII 17.1-2']};
  const tf=findFree(f[0]-5,f[1]+6,0.6),tg=grp(tf[0],floorAt(tf[0],tf[1]),tf[1],0);const sh=new THREE.Mesh(new THREE.SphereGeometry(0.32,10,6,0,TAU,0,Math.PI/2),lam('#6a5a34'));sh.scale.set(1,0.6,1.3);sh.position.y=0.08;tg.add(sh);const hd=new THREE.Mesh(new THREE.SphereGeometry(0.09,8,6),lam('#7a6a4a'));hd.position.set(0,0.08,0.42);tg.add(hd);
  const o=egxObj(tf[0],tf[1],undefined,'crt:tortuga','Una tortuga','junto a la cueva',2.5);o.g=tg;CRT.objs.push(o);}
function crtSetup(){if(MODE!=='atenas')return;const C=ISLANDS.find(I=>I.id==='creta');if(!C)return;CRT.X=C.x;CRT.built=false;CRT.objs=[];crtBuild();crtDetails();crtMaia();knDetails();
  if(state.pos&&crtBand(state.pos.x,state.pos.z)){/* se guardó dentro: se continúa allí */}}
// ---- sonidos: los curetes (percusión) junto a la cueva del Ida, y la lira junto a la cueva de Maya
function crtDrum(t,v){const c=AUD.ctx,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(55,t+0.25);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.5*v,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+0.35);o.connect(g).connect(AUD.master);o.start(t);o.stop(t+0.4);}
function crtTick(dt){if(MODE!=='atenas'||!CRT.built)return;knTick(dt);crdTick(dt);
  if(CRT.cave&&typeof aOK==='function'&&aOK()&&!(typeof ACC!=='undefined'&&ACC.noAmb)&&ui==='play'){const d=Math.hypot(player.x-CRT.cave.x,player.z-CRT.cave.z);
    if(d<90){CRT.percT-=dt;if(CRT.percT<0){CRT.percT=2.4;const v=Math.min(1,(90-d)/70),t0=AUD.ctx.currentTime+0.05,B=0.3;
      [[0,'d'],[B,'c'],[2*B,'d'],[2.5*B,'d'],[3*B,'c'],[3.5*B,'c'],[5*B,'d'],[6*B,'c']].forEach(([o,k])=>{if(k==='d')crtDrum(t0+o,v*0.6);else gfNoise(t0+o,'bandpass',3200,1.4,0.16*v,0.002,0.14);});}
      if(d<40&&!CRT.saidCur){CRT.saidCur=true;toast('<span class="label">Un viejo pastor</span><br>«¿Lo oyes? Tambores y bronce contra bronce… Son los curetes. Todavía golpean sus escudos para que Crono no oiga llorar al niño Zeus».');}}}
  if(CRT.maia&&typeof aOK==='function'&&aOK()&&ui==='play'&&Math.hypot(player.x-CRT.maia.x,player.z-CRT.maia.z)<45){CRT.lyreT-=dt;if(CRT.lyreT<0){CRT.lyreT=4+Math.random()*3;if(typeof playPhrase==='function')playPhrase();}}
  if(!crtBand(player.x,player.z)){CRT.seg=null;return;}
  const id=crtSegOf(player.z),S=CRT_SEGS[id],cz=crtSegZ(id),lx=player.x-CRT.X,lz=player.z-cz;
  if(id!==CRT.seg){CRT.seg=id;curZone='crt_'+id;showZone(S.name,S.gr,S.sub);}
  if(CRT.busy)return;
  const go=(to,nx,nz,msg)=>{CRT.busy=true;swFade(()=>{if(to==='@creta'){const T=CRT.trail;const f=findFree(T.x+4,T.z+4,0.6);player.x=f[0];player.z=f[1];}else{const w=crtW(to,nx,nz);player.x=w[0];player.z=w[1];}
    player.feet=floorAt(player.x,player.z);player.camY=player.feet+player.eye;player.vy=0;CRT.busy=false;if(to==='@creta')curZone=null;if(msg)toast(msg);});};
  if(lz<-CRT.H+2&&S.n)return go(S.n,lx,CRT.H-14,S.n==='@creta'?'Bajas del camino y vuelves a la costa, cerca de Cnosos.':null);
  if(lz>CRT.H-2&&S.s)return go(S.s,lx,-CRT.H+14,null);
  const ox=player.x,oz=player.z;player.x=clamp(player.x,CRT.X-CRT.H+3,CRT.X+CRT.H-3);player.z=clamp(player.z,cz-CRT.H+3,cz+CRT.H-3);
  CRT.edgeT=Math.max(0,CRT.edgeT-dt);if((ox!==player.x||oz!==player.z)&&!CRT.edgeT){CRT.edgeT=5;toast('Por ahí solo hay montes sin camino. Sigue el camino hacia el norte o hacia el sur.');}}
function crtAct(o){const a=String(o.act).slice(4);if(['fuente','colmenas','agrimi','altar','iniciado','quesero','aguila','era','juez','toro'].includes(a))return crdAct(a);if(['pithos','cuernos','fresco','hacha','ninos','pastorkn','andreion','agela','epimenides','alfarero','demeter','ovillo'].includes(a))return knAct(a);
  if(a==='entrar'){swFade(()=>{const w=crtW('camino',4,-CRT.H+16);player.x=w[0];player.z=w[1];player.feet=floorAt(w[0],w[1]);player.camY=player.feet+player.eye;player.yaw=Math.PI;
    toast('<span class="label">El camino del Ida</span><br>Hacia el sur, por el camino de cipreses, se sube al monte Ida y se baja a la llanura de Festo y Gortina. Al norte vuelves a Cnosos.');});return;}
  if(a==='pastora')return vmS('🐐','Una pastora','con sus cabras','<p>«¿Ves esa planta de hojas redondas y peludas? Es díctamo, solo crece en nuestros montes. Cuando a una cabra salvaje la hiere una flecha, busca díctamo, lo come y la flecha se le cae sola. Lo dicen los cazadores, y hasta los sabios de Atenas lo escriben».</p><p class="src">Aristóteles, Historia de los animales IX 6 (612a); Teofrasto, Historia de las plantas IX 16.1. Virgilio contará que Venus curó a Eneas con díctamo de Creta (Eneida XII 411-424).</p>',[vmBye]);
  if(a==='arquero')return vmS('🏹','Un arquero cretense','practicando con el arco','<p>«Los arqueros de Creta somos los mejores de Grecia, y lo sabe todo el mundo: nos contratan atenienses, espartanos y hasta el Gran Rey. Mi padre fue con los Diez Mil al corazón de Persia».</p><p class="src">Tucídides VI 25.2 (Atenas pide arqueros cretenses para Sicilia); Jenofonte, Anábasis I 2.9 (doscientos arqueros cretenses en el ejército de Ciro) y IV 2.28.</p>',[vmBye]);
  if(a==='viejo')return vmS('🥁','Un viejo pastor del Ida','junto a la cueva','<p>«¿Lo oyes? Tambores, y bronce contra bronce. Son los curetes. Cuando Rea escondió aquí al niño Zeus, ellos bailaban golpeando las lanzas contra los escudos para que su padre Crono no oyera el llanto. Mi abuelo los oía. Yo los oigo. Y tú también, ¿verdad?»</p><p>«Esa cabra blanca de ahí no se deja ordeñar por nadie. Yo creo que es nieta de Amaltea».</p><p class="src">Apolodoro, Biblioteca I 1.7; Calímaco, Himno a Zeus 52-54; Estrabón X 3.11.</p>',[vmBye]);
  if(a==='amaltea')return vmS('🐐','La cabra Amaltea','la nodriza de Zeus','<p>La cabra te mira con calma. Le falta un cuerno.</p><p>Amaltea era la cabra cuya leche alimentó a Zeus niño en la cueva. Un día se rompió un cuerno contra un árbol; la ninfa que cuidaba de Zeus lo llenó de hierbas y frutas, y se convirtió en el cuerno de la abundancia. Zeus, agradecido, subió la cabra al cielo, donde brilla como una estrella, la Cabra.</p><p class="src">Ovidio, Fastos V 115-128; Arato, Fenómenos 162-164; Calímaco, Himno a Zeus 47-49.</p>',[vmBye]);
  if(a==='festo')return vmS('🏛','Una vecina de Festo','junto a las ruinas','<p>«Estas piedras eran el palacio de un rey de antes de los reyes. Mi abuela decía que aquí juzgaba Radamantis, el hermano de Minos, el hombre más justo del mundo. Por eso, cuando murió, los dioses lo hicieron juez de los muertos».</p><p class="src">Homero, Odisea IV 564 (Radamantis en los Campos Elíseos); Platón, Gorgias 523e-524a (Radamantis, juez de los muertos).</p>',[vmBye]);
  if(a==='gortina'){const fin=t=>vmS('⚖','Un ciudadano de Gortina','delante de la pared de las leyes','<p>'+t+'</p><p class="src">Código de Gortina, columnas IV-V (herencias).</p>',[vmBye]);
    return vmS('⚖','Un ciudadano de Gortina','delante de la pared de las leyes','<p>«Aquí las leyes no las guarda un sacerdote ni un rey: están grabadas en la pared, para que cualquiera pueda leerlas. Dime, forastero: según nuestras leyes, ¿qué hereda una hija cuando muere su padre?»</p>',
      [['La mitad que cada hijo varón',()=>fin('«Exacto. Y si no hay hijos varones, ella lo hereda todo, aunque tenga que casarse con un pariente para que la tierra no salga de la familia».')],['Nada: todo es para los hijos',()=>fin('«No. Eso pasa en otras ciudades. Aquí la hija hereda la mitad que cada hijo, y eso está escrito en piedra».')],['Exactamente lo mismo que los hijos',()=>fin('«Casi, pero no: la mitad que cada hijo. Aun así, es más de lo que tienen las hijas en Atenas».')]]);}
  if(a==='cambista')return vmS('🪙','Un cambista de Cnosos','con monedas del laberinto','<p>«Mira esta moneda de plata: por un lado, la cabeza de una diosa; por el otro, el laberinto. Es nuestra marca: ¡aquí vivió Minos y aquí Dédalo lo construyó! En otras monedas sale el Minotauro corriendo. Te la cambio por dracmas atenienses, si quieres, pero te cobro un óbolo por el cambio».</p><p class="src">Monedas de plata de Cnosos con el laberinto (de meandro o cuadrado) y con el Minotauro, siglos V-IV a.C.</p>',[vmBye]);
  if(a==='tortuga')return vmS('🐢','Una tortuga','junto a la cueva de Maya','<p>Una tortuga avanza despacio entre las piedras.</p><p>El himno homérico cuenta que Hermes, recién nacido, salió de la cueva y encontró una tortuga. «¡Qué suerte!», le dijo, y se la llevó. Vació el caparazón, le puso un mástil de caña, una piel tensada y siete cuerdas de tripa de oveja: así inventó la lira, y esa misma tarde cantó la historia de sus padres. Después se la regaló a Apolo a cambio de las vacas que le había robado.</p><p class="src">Himno homérico a Hermes 24-61 y 490-512.</p>',[vmBye]);}
// ---- detalles de Cnosos: ruinas con huellas del palacio, costumbres cretenses, mitos visibles y ambiente sonoro
const KN={kids:[],agela:[],goats:[],fire:null,loomT:0,bellT:0,windT:0,loom:null};
function knTex(draw,w,h){const c=document.createElement('canvas');c.width=w||256;c.height=h||256;draw(c.getContext('2d'),c.width,c.height);const t=new THREE.CanvasTexture(c);return new THREE.MeshLambertMaterial({map:t});}
function knSign(id,name,gr,txt,x,z,src){place(id,name,gr,txt,x,z,0);const pl=PLACES[PLACES.length-1],s=stele(x,z,0,id);signObjs.push({kind:'sign',data:pl,g:s.g,mk:s.mk,x,z});if(src&&typeof PSRC!=='undefined')PSRC[id]=src;}
function knEgx(x,z,act,name,sub,g,r){const o=egxObj(x,z,undefined,'crt:'+act,name,sub,r||3);if(g)o.g=g;CRT.objs.push(o);return o;}
function knPerson(x,z,look,a){const f=findFree(x,z,0.5),g=makePerson(look);g.position.set(f[0],floorAt(f[0],f[1]),f[1]);g.rotation.y=a||0;scene.add(g);return {g,x:f[0],z:f[1]};}
function knDetails(){const C=ISLANDS.find(I=>I.id==='creta');if(!C||!C.palace||!C.polis)return;const p=C.palace,gy=p.h,c=C.polis,stone=lam('#9d927a');
  // 1 · una tinaja (pithos) asomando en los almacenes del oeste
  {const x=p.x-41,z=p.z+3,g=grp(x,gy,z,0),m=lam('#a8754a');const b=new THREE.Mesh(new THREE.CylinderGeometry(0.75,0.45,1.6,14,1,true),m);b.position.y=0.5;b.material.side=THREE.DoubleSide;g.add(b);
   const lip=new THREE.Mesh(new THREE.TorusGeometry(0.62,0.08,6,14,4.4),m);lip.rotation.x=Math.PI/2;lip.position.y=1.3;g.add(lip);for(let k=0;k<3;k++){const r=new THREE.Mesh(new THREE.TorusGeometry(0.74-k*0.04,0.04,4,16),lam('#8f6038'));r.rotation.x=Math.PI/2;r.position.y=0.2+k*0.35;g.add(r);}
   const earth=new THREE.Mesh(new THREE.SphereGeometry(1.4,10,5,0,TAU,0,Math.PI/2),lam('#6f7a3e'));earth.scale.y=0.3;g.add(earth);addCirc(x,z,0.9);knEgx(x+1.4,z,'pithos','Una tinaja enorme','medio enterrada',g);}
  // 2 · cuernos de consagración caídos
  {const x=p.x+16,z=p.z-30,g=grp(x,gy,z,0.5),m=lam('#c2b89e');box(1.6,0.45,0.5,m,0,0.22,0,g);for(const s of[-1,1]){const h=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.24,1,8),m);h.position.set(s*0.55,0.85,0);h.rotation.z=-s*0.35;g.add(h);}g.rotation.z=0.25;knEgx(x,z+1.2,'cuernos','Una piedra con dos cuernos','caída entre los muros',g);}
  // 3 · resto de fresco en un muro que aún se tiene en pie
  {const x=p.x+18,z=p.z+28,g=grp(x,gy,z,0);box(5,2.6,0.9,stone,0,1.3,0,g);addSeg(x-2.5,z,x+2.5,z,0.5);
   const fm=knTex((q,w,h)=>{q.fillStyle='#b9ad92';q.fillRect(0,0,w,h);q.globalAlpha=0.85;q.fillStyle='#9a3b2a';q.fillRect(0,h*0.55,w,h*0.12);q.fillStyle='#3d6a8a';q.beginPath();q.ellipse(w*0.42,h*0.35,w*0.16,h*0.12,0.3,0,TAU);q.fill();q.fillStyle='#c98a4a';q.beginPath();q.arc(w*0.7,h*0.3,w*0.06,0,TAU);q.fill();q.globalAlpha=1;q.fillStyle='#b9ad92';for(let k=0;k<140;k++)q.fillRect(Math.random()*w,Math.random()*h,4+Math.random()*16,3+Math.random()*10);},256,128);
   const pl=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.2),fm);pl.position.set(0.6,1.5,0.46);g.add(pl);knEgx(x,z+1.6,'fresco','Restos de color en un muro','rojo y azul, muy borrosos',g);}
  // 4 · hacha doble grabada en un sillar
  {const x=p.x-12,z=p.z+40,g=grp(x,gy,z,0.3),lm=knTex((q,w,h)=>{q.fillStyle='#a89c80';q.fillRect(0,0,w,h);q.strokeStyle='#5a4e3e';q.lineWidth=7;q.beginPath();q.moveTo(w/2,h*0.15);q.lineTo(w/2,h*0.85);q.moveTo(w/2,h*0.3);q.lineTo(w*0.22,h*0.18);q.lineTo(w*0.22,h*0.52);q.closePath();q.moveTo(w/2,h*0.3);q.lineTo(w*0.78,h*0.18);q.lineTo(w*0.78,h*0.52);q.closePath();q.stroke();},128,128);
   const b=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.8,0.8),[stone,stone,stone,stone,lm,stone]);b.position.y=0.4;b.castShadow=true;g.add(b);knEgx(x,z+1.2,'hacha','Un sillar con una marca','un hacha de dos filos',g,2.6);}
  // 5 · niños que juegan al Minotauro y un pastor con cabras entre las ruinas
  for(let k=0;k<3;k++){const P=knPerson(p.x-5+k*3,p.z+10,{chiton:k?'#d8ccb0':'#7a5a3a',hair:'#2a1e14',female:k===2,scale:0.6});KN.kids.push({g:P.g,ph:k*2.1,cx:p.x+2,cz:p.z+8,r:7+k*1.5,sp:0.55+k*0.05,mino:k===0});}
  {const k0=KN.kids[0].g,h=new THREE.Group();for(const s of[-1,1]){const c=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.3,5),lam('#e8dcc0'));c.position.set(s*0.12,1.12,0.02);c.rotation.z=-s*0.9;h.add(c);}k0.add(h);}
  knEgx(p.x+2,p.z+8,'ninos','Unos niños jugando','al Minotauro y Teseo',null,9);
  {const P=knPerson(p.x+40,p.z-40,{chiton:'#7a6a50',himation:'#5a4a3a',beard:true,hair:'#3a2a1e',staff:true},1);knEgx(P.x,P.z,'pastorkn','Un cabrero','con sus cabras entre las ruinas',P.g);
   for(let k=0;k<7;k++){const x=p.x+34+R()*16,z=p.z-48+R()*16,g=grp(x,gy,z,R()*TAU),m=lam(k%3?'#d8d0c0':'#5a4a3a');box(0.4,0.4,0.85,m,0,0.65,0,g);box(0.22,0.28,0.3,m,0,0.88,0.52,g);for(const[a,b]of[[-0.14,-0.28],[0.14,-0.28],[-0.14,0.28],[0.14,0.28]])box(0.07,0.45,0.07,m,a,0.22,b,g);KN.goats.push({g,x0:x,z0:z,ph:R()*9});}}
  // 6 · el comedor común (andreion)
  const an={x:c.x-30,z:c.z+20};{const gy2=minGround(an.x,an.z,18,10,0),g=grp(an.x,gy2,an.z,0),wm=lam('#e8dfcc');box(18,0.3,10,lam('#b3a684'),0,0.15,0,g);box(18,4,0.6,wm,0,2,-5,g);box(0.6,4,10,wm,-9,2,0,g);box(0.6,4,10,wm,9,2,0,g);
   for(let k=0;k<5;k++){const col=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,4,10),wm);col.position.set(-7.2+k*3.6,2,4.7);g.add(col);}box(19,0.4,11,lam('#a8542e'),0,4.2,0,g);
   for(const zz of[-2,1.5]){box(14,0.1,1,lam('#7a5a3a'),0,0.85,zz,g);for(const s of[-0.9,0.9])box(14,0.08,0.35,lam('#6a4a2a'),0,0.45,zz+s,g);}
   addSeg(an.x-9,an.z-5,an.x+9,an.z-5,0.4);addSeg(an.x-9,an.z-5,an.x-9,an.z+5,0.4);addSeg(an.x+9,an.z-5,an.x+9,an.z+5,0.4);
   const P=knPerson(an.x+2,an.z,{chiton:'#d8ccb0',himation:'#7a3a2a',beard:true,hair:'#d8d0c2'},Math.PI);knEgx(P.x,P.z,'andreion','El comedor común','de los ciudadanos de Cnosos',P.g);}
  // 7 · una manada (agéla) de muchachos corriendo detrás de su jefe
  for(let k=0;k<6;k++){const P=knPerson(c.x,c.z-40,{chiton:'#e8dfcc',hair:'#2a1e14',scale:0.85});KN.agela.push({g:P.g,i:k});}
  knEgx(c.x+40,c.z-40,'agela','Una manada de muchachos','corriendo detrás de su jefe',null,12);
  // 8 · un viejo que cuenta la paradoja de Epiménides
  {const P=knPerson(c.x-10,c.z-6,{chiton:'#cfc4ae',himation:'#4f5a6a',beard:true,hair:'#e0dcd2',staff:true},0.5);knEgx(P.x,P.z,'epimenides','Un viejo cretense','que sonríe con malicia',P.g);}
  // 9 · un alfarero con lámparas y figurillas para Deméter
  {const f=findFree(c.x+14,c.z+8,0.8),g=grp(f[0],floorAt(f[0],f[1]),f[1],0);box(2,0.8,0.9,lam('#7a5a3a'),0,0.4,0,g);
   for(let k=0;k<6;k++){const l=new THREE.Mesh(new THREE.SphereGeometry(0.1,8,5),lam('#b5764a'));l.scale.set(1.3,0.5,1);l.position.set(-0.75+k*0.3,0.86,-0.15);g.add(l);const fg=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.07,0.28,6),lam('#c08a5a'));fg.position.set(-0.75+k*0.3,0.94,0.22);g.add(fg);}
   const P=knPerson(f[0],f[1]+1.2,{chiton:'#b8a888',noHim:true,hair:'#3a2a1e',beard:true},Math.PI);knEgx(f[0],f[1],'alfarero','Un alfarero','lámparas y figurillas de barro',g);}
  {const sx=p.x+10,sz=p.z+75+30;knEgx(sx-4,sz-6,'demeter','El altar de Deméter','para dejar una ofrenda',null,3);}
  // 10 · tratado entre Cnosos y Tíliso
  knSign('tratado_tiliso','Un tratado grabado en piedra','ΚΝΩΣΙΟΙ ΚΑΙ ΤΥΛΙΣΙΟΙ','Aquí se copió el acuerdo entre Cnosos y su vecina Tíliso, con la ciudad de Argos como mediadora: cómo se reparten el botín cuando hacen la guerra juntas, qué fronteras tienen sus pastos y qué sacrificios ofrecen en común. Las ciudades griegas grababan sus tratados en piedra y los ponían en los santuarios, para que los dioses fueran testigos.',c.x+2,c.z-12,{a:['Tratado de Cnosos y Tíliso (hacia el 450 a.C.), copias halladas en Argos y en Tíliso; Meiggs y Lewis, Greek Historical Inscriptions 42'],n:['El tratado es unos sesenta años anterior a la época del juego; podía seguir expuesto.']});
  // 11 · la pista de baile de Ariadna
  {const ax=p.x-60,az=p.z-62,y=terrainH(ax,az),g=grp(ax,y,az,0);const d=new THREE.Mesh(new THREE.CylinderGeometry(7,7.2,0.3,28),lam('#bfb59a'));d.position.y=0.1;d.receiveShadow=true;g.add(d);
   for(let k=0;k<3;k++){const r=new THREE.Mesh(new THREE.TorusGeometry(2+k*1.8,0.07,4,40),lam('#8f8670'));r.rotation.x=Math.PI/2;r.position.y=0.27;g.add(r);}
   knSign('baile_ariadna','La pista de baile de Ariadna','ΧΟΡΟΣ ΑΡΙΑΔΝΗΣ','En la Ilíada, el dios Hefesto adorna el escudo de Aquiles con una pista de baile como la que Dédalo hizo en la gran Cnosos para Ariadna, la de los bellos cabellos: muchachos y muchachas se cogen de la mano y bailan en círculo, unas veces en rueda y otras en filas que se cruzan. Los de Cnosos enseñan este círculo de losas y dicen que es aquel.',ax+8,az+2,{a:['Homero, Ilíada XVIII 590-606'],n:['Plutarco (Teseo 21) cuenta que Teseo bailó en Delos la «danza de la grulla», que imitaba las vueltas del laberinto.']});}
  // 12 · un ovillo de hilo rojo a la entrada de las ruinas
  {const x=p.x+4,z=p.z-50,g=grp(x,gy,z,0);const b=new THREE.Mesh(new THREE.SphereGeometry(0.22,10,8),lam('#b0261c'));b.position.y=0.22;g.add(b);
   const th=[];for(let k=0;k<40;k++)th.push(new THREE.Vector3(Math.sin(k*0.4)*0.6,0.05,k*0.5));const tg=new THREE.BufferGeometry().setFromPoints(th);g.add(new THREE.Line(tg,new THREE.LineBasicMaterial({color:0xb0261c})));
   knEgx(x,z,'ovillo','Un ovillo de hilo rojo','el hilo se mete entre las ruinas',g,2.4);}
  // 13 · Talos
  knSign('talos','Talos, el gigante de bronce','ΤΑΛΩΣ','Los cretenses cuentan que Talos, un gigante de bronce, daba tres vueltas a la isla cada día para protegerla y tiraba piedras a los barcos enemigos. Tenía una sola vena, cerrada en el tobillo con un clavo de bronce. Cuando llegaron los argonautas, la hechicera Medea lo embrujó, el clavo saltó y el gigante se desangró. Las monedas de Festo lo muestran con alas, lanzando una piedra.',c.x-36,c.z-30,{a:['Apolonio de Rodas, Argonáuticas IV 1638-1688','Apolodoro, Biblioteca I 9.26','Platón, Minos 320c'],m:['Estáteras de Festo con Talos alado (hacia el 300 a.C.)']});
  // 15 · fuego de pastores entre las ruinas (solo de noche)
  {const x=p.x+38,z=p.z-34,g=grp(x,gy,z,0);for(let k=0;k<7;k++){const a=k/7*TAU;box(0.35,0.25,0.3,stone,Math.cos(a)*0.7,0.12,Math.sin(a)*0.7,g);}
   const fl=new THREE.Mesh(new THREE.ConeGeometry(0.28,0.75,7),new THREE.MeshBasicMaterial({color:0xff7a20,transparent:true,opacity:0.9}));fl.position.y=0.42;g.add(fl);const li=new THREE.PointLight(0xffa050,0,26);li.position.y=1.2;g.add(li);KN.fire={g,fl,li};}
  // 14 · lugares de los sonidos
  KN.loom={x:c.x+20,z:c.z+30};KN.ruins={x:p.x,z:p.z};KN.goatsAt={x:p.x+42,z:p.z-40};KN.agelaC={x:c.x,z:c.z};KN.anim=true;
}
function knTick(dt){if(!KN.anim)return;const t=performance.now()/1000,near=(o,r)=>Math.abs(player.x-o.x)<r&&Math.abs(player.z-o.z)<r;
  if(near(KN.ruins,260)){for(const k of KN.kids){const a=t*k.sp+k.ph,x=k.cx+Math.cos(a)*k.r,z=k.cz+Math.sin(a)*k.r;k.g.position.set(x,floorAt(x,z),z);k.g.rotation.y=-a;}
    for(const q of KN.goats){const x=q.x0+Math.sin(t*0.05+q.ph)*3,z=q.z0+Math.cos(t*0.04+q.ph)*3;q.g.position.x=x;q.g.position.z=z;q.g.rotation.y=t*0.05+q.ph;}
    if(KN.fire){const night=clock.h<6.5||clock.h>19.5;KN.fire.fl.visible=night;KN.fire.li.intensity=night?1.6+Math.sin(t*13)*0.25+Math.sin(t*7)*0.2:0;KN.fire.fl.scale.y=1+Math.sin(t*11)*0.15;}}
  if(near(KN.agelaC,200)){const C=KN.agelaC;for(const m of KN.agela){const a=t*0.22-m.i*0.09,x=C.x+Math.cos(a)*44,z=C.z-10+Math.sin(a)*34;m.g.position.set(x,floorAt(x,z),z);m.g.rotation.y=-a;}}
  if(!(typeof aOK==='function'&&aOK())||ui!=='play')return;const ac=AUD.ctx,t0=ac.currentTime+0.03;
  // telar: golpe del peine y chasquido de la lanzadera
  {const d=Math.hypot(player.x-KN.loom.x,player.z-KN.loom.z);if(d<40){KN.loomT-=dt;if(KN.loomT<0){KN.loomT=1.6;const v=(40-d)/40;crtDrum(t0,0.25*v);gfNoise(t0+0.55,'bandpass',1800,3,0.08*v,0.002,0.05);gfNoise(t0+0.8,'bandpass',2600,4,0.05*v,0.002,0.04);}}}
  // cencerros de las cabras
  {const d=Math.hypot(player.x-KN.goatsAt.x,player.z-KN.goatsAt.z);if(d<55){KN.bellT-=dt;if(KN.bellT<0){KN.bellT=0.5+Math.random()*1.4;const v=(55-d)/55,f=900+Math.random()*500;for(const[m,g]of[[1,1],[2.76,0.4],[5.4,0.2]]){const o=ac.createOscillator(),gg=ac.createGain();o.frequency.value=f*m;gg.gain.setValueAtTime(0.0001,t0);gg.gain.exponentialRampToValueAtTime(0.05*v*g,t0+0.005);gg.gain.exponentialRampToValueAtTime(0.0001,t0+0.4);o.connect(gg).connect(AUD.master);o.start(t0);o.stop(t0+0.45);}}}}
  // viento entre los muros
  {const d=Math.hypot(player.x-KN.ruins.x,player.z-KN.ruins.z);if(d<80){KN.windT-=dt;if(KN.windT<0){KN.windT=2.6;gfNoise(t0,'bandpass',420+Math.random()*300,0.8,0.05*(80-d)/80,1.1,1.6);}}}
}
function knAct(a){const S=(gl,n,sub,html)=>vmS(gl,n,sub,html,[vmBye]);
  if(a==='pithos')return S('🏺','Una tinaja enorme','medio enterrada','<p>La boca rota de una tinaja de barro asoma entre la tierra. Entera, sería más alta que tú. En los almacenes del palacio había cientos, en filas, llenas de aceite, vino y grano: la riqueza del rey se guardaba en tinajas.</p><p>Hay un mito cretense sobre una: Glauco, un hijo pequeño de Minos, persiguiendo un ratón, se cayó dentro de una tinaja de miel y se ahogó.</p><p class="src">Apolodoro, Biblioteca III 3.1. Los almacenes del oeste de Cnosos conservan todavía decenas de tinajas en su sitio.</p>');
  if(a==='cuernos')return S('🗿','Una piedra con dos cuernos','caída entre los muros','<p>Es un bloque de piedra tallado con dos puntas curvas, como los cuernos de un toro. Antes coronaba algún muro. Los cretenses de hoy no saben qué era; algunos dicen que tiene que ver con el toro de Minos.</p><p>Los arqueólogos los llaman «cuernos de consagración». Aparecen en muchos edificios minoicos, pero nadie sabe con seguridad qué significaban.</p><p class="src">Arthur Evans les dio ese nombre en 1901; su sentido sigue discutiéndose.</p>');
  if(a==='fresco')return S('🎨','Restos de color en un muro','rojo y azul, muy borrosos','<p>En este trozo de muro, protegido por la tierra, queda una mancha roja, algo azul y una forma redonda que podría ser una flor o un ojo. Cuando el palacio estaba en pie, sus paredes estaban pintadas: procesiones, flores, delfines, muchachos saltando sobre toros.</p><p class="src">Los frescos de Cnosos se pintaban sobre el yeso húmedo; los que se ven hoy en el museo de Heraclión son fragmentos completados por restauradores modernos.</p>');
  if(a==='hacha')return S('🪓','Un sillar con una marca','un hacha de dos filos','<p>Alguien grabó en esta piedra un hacha de dos filos. En los muros del palacio hay muchas marcas así: probablemente las hacían los canteros.</p><p>Una hipótesis antigua dice que «laberinto» viene de <i>labrys</i>, que en lidio era el hacha doble: el laberinto sería «la casa del hacha doble». No es seguro, pero explicaría por qué los griegos llamaron laberinto a este palacio inmenso, lleno de pasillos.</p><p class="src">Plutarco, Cuestiones griegas 45 (labrys, palabra lidia). La etimología sigue discutiéndose.</p>');
  if(a==='ninos')return S('🐂','Unos niños jugando','al Minotauro y Teseo','<p>Uno de los niños lleva unos cuernos de madera atados a la cabeza y persigue a los otros entre los muros, mugiendo.</p><p>«¡Soy el Minotauro! ¡Me como a los atenienses!» — «¡Y yo soy Teseo, y tengo el hilo!»</p><p>Para los niños de Cnosos, el laberinto es el mejor sitio del mundo para jugar al escondite.</p>');
  if(a==='pastorkn')return S('🐐','Un cabrero','con sus cabras entre las ruinas','<p>«Aquí crece buena hierba entre las piedras, y las cabras no tienen miedo de fantasmas. Yo un poco sí. De noche encendemos fuego aquí mismo, y a veces parece que se oye mugir algo debajo de la tierra… pero será el viento».</p>');
  if(a==='andreion')return S('🍞','El comedor común','de los ciudadanos de Cnosos','<p>«Aquí comemos juntos todos los ciudadanos, ricos y pobres. Lo paga la ciudad con lo que da la tierra pública y con lo que pagan los siervos que la trabajan. Así nadie pasa hambre y todos se conocen. Los niños se sientan en el suelo, al lado de sus padres, y escuchan hablar a los mayores: así aprenden».</p><p>«En Esparta lo hacen parecido, pero allí cada uno paga su parte, y el que no puede pagar pierde sus derechos. Aquí no».</p><p class="src">Aristóteles, Política II 10 (1272a); Estrabón X 4.18 y 4.20 (citando a Éforo).</p>');
  if(a==='agela')return S('🏃','Una manada de muchachos','corriendo detrás de su jefe','<p>En Creta, los muchachos se educan en grupos llamados «manadas» (<i>agélai</i>). Cada manada la reúne un chico de buena familia, y la dirige un hombre mayor, normalmente su padre. Corren, cazan, aprenden a soportar el calor y el frío, y luchan contra otras manadas con puños y palos, al son de la lira y la flauta.</p><p class="src">Estrabón X 4.20, citando a Éforo (siglo IV a.C.).</p>');
  if(a==='epimenides')return S('🤥','Un viejo cretense','que sonríe con malicia','<p>«¿Conoces a Epiménides, el sabio de Cnosos que durmió cincuenta y siete años en una cueva? Él dijo: "Los cretenses, siempre mentirosos". Pero Epiménides era cretense. Entonces, si dice la verdad, miente… y si miente, dice la verdad. ¿En qué quedamos?»</p><p>Se ríe. «Y ahora te digo yo, que también soy cretense: todo lo que te he contado es verdad».</p><p class="src">El verso de Epiménides lo cita Calímaco (Himno a Zeus 8) y, siglos después, la Carta a Tito 1.12. El sueño de 57 años: Diógenes Laercio I 109. La paradoja como problema lógico es posterior: la del «mentiroso» se atribuye a Eubúlides de Mileto, en el siglo IV a.C.</p>');
  if(a==='alfarero'){if(state.knOf)return S('🪔','Un alfarero','lámparas y figurillas de barro','<p>«Ya llevas una figurilla. Déjala en el altar de Deméter, en la colina, al sur de las ruinas».</p>');
    return vmS('🪔','Un alfarero','lámparas y figurillas de barro','<p>«Lámparas para alumbrar la casa y figurillas para la diosa. Esta es Deméter con una antorcha; esta otra, una mujer con un cerdito: a Deméter le gustan los cerditos. ¿Me compras una por un óbolo y se la llevas al santuario de la colina?»</p>',[['Comprar una figurilla (1 óbolo)',()=>{if(state.obols<1)return S('🪔','Un alfarero','','<p>«Sin óbolo no hay figurilla, amigo».</p>');state.obols-=1;state.knOf=1;save();updateStats();S('🪔','Un alfarero','','<p>«Que la diosa te dé buenas cosechas». Te da una figurilla de barro todavía tibia.</p>');}],vmBye]);}
  if(a==='demeter'){if(!state.knOf)return S('🌾','El altar de Deméter','para dejar una ofrenda','<p>Sobre el altar hay figurillas de barro, lamparitas y vasitos con granos de trigo. Las ofrendas se compran a los alfareros del ágora.</p>');state.knOf=0;state.knOfDone=(state.knOfDone||0)+1;if(typeof qAdd==='function')qAdd('eu',1);save();
    return S('🌾','El altar de Deméter','dejas tu ofrenda','<p>Dejas la figurilla en el altar, junto a muchas otras. Así se hacía: los santuarios se llenaban tanto de figurillas que de vez en cuando los sacerdotes las enterraban en fosas para hacer sitio. Gracias a esas fosas, los arqueólogos las encuentran hoy a miles.</p>');}
  if(a==='ovillo')return vmS('🧶','Un ovillo de hilo rojo','el hilo se mete entre las ruinas','<p>Alguien ha dejado aquí un ovillo de hilo rojo. El hilo se adentra entre los muros, como el que Ariadna dio a Teseo para salir del laberinto.</p>',[['Seguir el hilo',()=>knossosTravel('cnosos_sueno')],vmBye]);
}
// ---- detalles del interior de Creta: camino del Ida, monte Ida y Mesara
const CRD={mule:null,muleT:0,oxen:[],eagle:null,bees:[],kri:[],snd:{},sT:{}};
function crdBovine(id,lx,lz,col,s){const[wx,wz]=crtW(id,lx,lz),g=grp(wx,crtHL(id,lx,lz),wz,0),m=lam(col);box(0.9,0.9,2,m,0,1.2,0,g);box(0.5,0.55,0.7,m,0,1.35,1.25,g);for(const[a,b]of[[-0.3,-0.7],[0.3,-0.7],[-0.3,0.7],[0.3,0.7]])box(0.16,0.8,0.16,m,a,0.4,b,g);
  for(const sd of[-1,1]){const h=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.5,6),lam('#e8dcc0'));h.position.set(sd*0.32,1.68,1.3);h.rotation.z=-sd*1.1;g.add(h);}g.scale.setScalar(s||1);return g;}
function crdEgx(id,lx,lz,act,name,sub,g,r){const[wx,wz]=crtW(id,lx,lz);const o=egxObj(wx,wz,crtHL(id,lx,lz),'crt:'+act,name,sub,r||3);if(g)o.g=g;CRT.objs.push(o);return o;}
function crdStele(id,lx,lz,pid,name,gr,txt,src){crtStele(id,lx,lz,pid,name,gr,txt,src);}
function crtDetails(){const r=mulberry32(321);
  // ===== el camino del Ida
  {const id='camino';
   // fuente con abrevadero
   {const[wx,wz]=crtW(id,24,-100),g=grp(wx,crtHL(id,24,-100),wz,0.3);box(3,0.6,1,lam('#8f8670'),0,0.3,0,g);const w=box(2.7,0.05,0.75,new THREE.MeshPhongMaterial({color:'#3f7f8c',shininess:90}),0,0.56,0,g);box(1,1.6,0.6,lam('#9d927a'),0,0.8,-0.75,g);
    addBox(wx,wz,3,1.6,0.3);CRD.snd.fuente={x:wx,z:wz};crdEgx(id,24,-98,'fuente','Una fuente','con un abrevadero para el ganado',g);}
   // colmenas de barro tumbadas
   {const hx=-40,hz=40,gm=lam('#b5764a');for(let k=0;k<8;k++){const lx=hx+(k%4)*1.3,lz=hz+Math.floor(k/4)*1.4,[wx,wz]=crtW(id,lx,lz);const c=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.32,1,10),gm);c.rotation.x=Math.PI/2;c.position.set(wx,crtHL(id,lx,lz)+0.55+Math.floor(k/4)*0.0,wz);c.castShadow=true;scene.add(c);}
    const[bx,bz]=crtW(id,hx+2,hz+0.7);box(5.4,0.3,3,lam('#9d927a'),bx,crtHL(id,hx+2,hz+0.7)+0.15,bz);addBox(bx,bz,5.6,3.2,0);
    const pm=new THREE.PointsMaterial({color:0x2a2010,size:0.09});for(let k=0;k<3;k++){const P=new Float32Array(30*3);const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(P,3));const pts=new THREE.Points(pg,pm);scene.add(pts);CRD.bees.push({pts,x:bx-1.5+k*1.5,y:crtHL(id,hx,hz)+1,z:bz,ph:k});}
    CRD.snd.bees={x:bx,z:bz};const P=crtPerson(id,hx+2,hz+3.5,{chiton:'#b8a888',himation:'#6a5a3a',female:true,hair:'#2a1e14'},'crt:colmenas','Una apicultora','junto a sus colmenas',3.5);}
   // arriero con su mula y ánforas, que va y viene por el camino
   {const g=new THREE.Group(),m=lam('#6a5a4a');box(0.6,0.7,1.5,m,0,1.1,0,g);box(0.3,0.4,0.6,m,0,1.45,0.95,g);for(const[a,b]of[[-0.2,-0.5],[0.2,-0.5],[-0.2,0.5],[0.2,0.5]])box(0.1,0.8,0.1,m,a,0.4,b,g);
    for(const s of[-1,1]){const a=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.07,0.8,8),lam('#b5764a'));a.position.set(s*0.42,1.25,0);g.add(a);}scene.add(g);
    const man=makePerson({chiton:'#8a7a5a',hair:'#2a1e14',beard:true,staff:true});scene.add(man);CRD.mule={g,man,t:0.2};}
   // cabras salvajes (agrimi) en las laderas del Yuctas
   for(let k=0;k<3;k++){const lx=235+k*9,lz=-125+k*6,[wx,wz]=crtW(id,lx,lz),g=grp(wx,crtHL(id,lx,lz),wz,r()*TAU),m=lam('#8a6a44');box(0.4,0.45,0.9,m,0,0.7,0,g);box(0.22,0.28,0.35,m,0,0.95,0.55,g);for(const[a,b]of[[-0.14,-0.3],[0.14,-0.3],[-0.14,0.3],[0.14,0.3]])box(0.08,0.5,0.08,m,a,0.25,b,g);
    for(const s of[-1,1]){const h=new THREE.Mesh(new THREE.TorusGeometry(0.28,0.035,5,10,Math.PI*0.9),lam('#5a4a3a'));h.position.set(s*0.07,1.2,0.35);h.rotation.set(0,Math.PI/2,0.4);g.add(h);}CRD.kri.push({g,lx,lz,ph:k*2});}
   crdEgx(id,244,-118,'agrimi','Cabras salvajes','en las rocas del Yuctas',null,14);
   // altar rústico junto al camino
   {const[wx,wz]=crtW(id,-20,250),g=grp(wx,crtHL(id,-20,250),wz,0);for(let k=0;k<9;k++){const s=new THREE.Mesh(new THREE.DodecahedronGeometry(0.35+r()*0.2,0),lam('#8f8670'));s.position.set((r()-0.5)*1.2,0.3+Math.floor(k/4)*0.35,(r()-0.5)*1);g.add(s);}
    for(let k=0;k<4;k++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.09,6,5),lam(['#c9a24a','#8a3a2a','#e8dcc0','#6a8a3a'][k]));f.position.set(-0.3+k*0.2,1.1,0.1);g.add(f);}addCirc(wx,wz,0.9);crdEgx(id,-20,252,'altar','Un montón de piedras','con ofrendas encima',g);}}
  // ===== el monte Ida
  {const id='ida';
   crtPerson(id,-54,-98,{chiton:'#1e1a18',himation:'#1e1a18',beard:true,hair:'#2a1e14'},'crt:iniciado','Un hombre envuelto en lana negra','a la entrada de la cueva',3);
   // cabaña de piedra de pastores y quesos
   {const lx=90,lz=-160,[wx,wz]=crtW(id,lx,lz),g=grp(wx,crtHL(id,lx,lz),wz,0.6),sm=lam('#8f8670');const d=new THREE.Mesh(new THREE.SphereGeometry(2.6,10,6,0,TAU,0,Math.PI/2),sm);d.scale.y=0.9;g.add(d);box(1,1.6,0.5,lam('#1a1512'),0,0.8,2.5,g);
    box(1.8,0.08,0.6,lam('#6a5038'),3.2,1,0,g);for(let k=0;k<4;k++){const ch=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.17,0.12,10),lam('#ece2c8'));ch.position.set(2.6+k*0.4,1.1,0);g.add(ch);}addCirc(wx,wz,2.7);
    crtPerson(id,lx+4,lz+3,{chiton:'#7a6a50',himation:'#8a7a5a',hair:'#3a2a1e',beard:true,staff:true},'crt:quesero','Un pastor del Ida','haciendo queso',3.5);}
   // el águila de Zeus sobre la cueva
   {const g=new THREE.Group(),m=lam('#3a2c20');box(0.3,0.25,1,m,0,0,0,g);for(const s of[-1,1]){const w=box(1.6,0.05,0.55,m,s*0.9,0.05,0,g);w.rotation.z=s*0.15;}box(0.2,0.2,0.3,lam('#d8d0c0'),0,0.05,0.6,g);scene.add(g);CRD.eagle={g,c:CRT.cave};}
   crdEgx(id,-62,-60,'aguila','Un águila','da vueltas sobre la cueva',null,30);}
  // ===== la Mesara
  {const id='mesara';
   // era: bueyes trillando en círculo
   {const lx=40,lz=120,[wx,wz]=crtW(id,lx,lz),y=crtHL(id,lx,lz);const d=new THREE.Mesh(new THREE.CylinderGeometry(9,9,0.2,28),lam('#c9b27a'));d.position.set(wx,y+0.05,wz);d.receiveShadow=true;scene.add(d);
    for(let k=0;k<40;k++){const a=k/40*TAU;box(0.5,0.3,0.4,lam('#8f8670'),wx+Math.cos(a)*9.2,y+0.15,wz+Math.sin(a)*9.2);}
    const hay=new THREE.Mesh(new THREE.ConeGeometry(2,2.2,10),lam('#d8bf6a'));hay.position.set(wx+12,y+1.1,wz+3);scene.add(hay);addCirc(wx+12,wz+3,2);
    for(let k=0;k<2;k++)CRD.oxen.push({g:crdBovine(id,lx,lz,k?'#7a5a3a':'#a8875a',0.9),cx:wx,cz:wz,y,ph:k*0.5});
    CRD.snd.era={x:wx,z:wz};crtPerson(id,lx+11,lz-4,{chiton:'#b8a888',hair:'#3a2a1e',beard:true,staff:true},'crt:era','Un campesino','trillando el trigo con sus bueyes',4);}
   // tumbas redondas muy antiguas
   for(const[lx,lz]of[[-60,-250],[-30,-275]]){const[wx,wz]=crtW(id,lx,lz),g=grp(wx,crtHL(id,lx,lz),wz,0.8),sm=lam('#8f8670');for(let k=0;k<22;k++){if(k===5)continue;const a=k/22*TAU;box(1.6,0.5+r()*0.9,0.9,sm,Math.cos(a)*4.4,0.4,Math.sin(a)*4.4,g).rotation.y=-a;}
    box(1,0.6,4,sm,-1.1,0.3,6,g);box(1,0.6,4,sm,1.1,0.3,6,g);addCirc(wx,wz,4.6);}
   crdStele(id,-48,-262,'tolos_mesara','Las tumbas redondas','ΤΑΦΟΙ','Estos círculos de piedra son tumbas tan antiguas que nadie recuerda quién las construyó. Eran redondas, con una cúpula de piedra que ya se ha hundido, y en cada una se enterraba durante siglos a toda una familia o una aldea. Hoy sabemos que son de los primeros cretenses, mil años anteriores incluso al palacio de Cnosos.',{m:['Tumbas circulares (tholoi) de la Mesara, hacia el 3000-1700 a.C.']});
   // templo de Apolo Pitio en Gortina
   temple({name:'Templo de Apolo Pitio',x:crtW(id,140,-5)[0],z:crtW(id,140,-5)[1],rot:Math.PI/2,W:10,L:18,nW:4,nL:7,colD:0.6,colH:5,entH:1.1,pedH:0.9,steps:2,stepH:0.3,roofMat:M.marble});
   crdStele(id,150,10,'apolo_pitio','El templo de Apolo Pitio','ΑΠΟΛΛΩΝ ΠΥΘΙΟΣ','El templo más importante de Gortina. En sus muros también se grabaron leyes, aún más antiguas que las de la gran pared: las ciudades cretenses ponían sus leyes bajo la protección de los dioses.',{m:['Templo arcaico de Apolo Pitio en Gortina (siglo VII a.C.), con inscripciones legales en sus muros']});
   // un juez
   crtPerson(id,176,-44,{chiton:'#e8dfcc',himation:'#3a3a5a',beard:true,hair:'#d8d0c2',staff:true},'crt:juez','Un juez de Gortina','escuchando a dos vecinos',3);
   crtPerson(id,172,-40,{chiton:'#b8a888',beard:true,hair:'#2a1e14'},'crt:juez','Un vecino','que reclama una cabra',2);
   // un toro blanco junto al plátano de Europa
   {const g=crdBovine(id,236,72,'#f2eee4',1.25);g.rotation.y=2.3;addCirc(g.position.x,g.position.z,1.5);crdEgx(id,236,72,'toro','Un toro blanco','paciendo junto al río',g,3.5);}
   CRD.snd.ranas=crtW(id,280,20);CRD.snd.ranas={x:CRD.snd.ranas[0],z:CRD.snd.ranas[1]};}
}
function crdTick(dt){if(!CRT.built||!crtBand(player.x,player.z))return;const t=performance.now()/1000,id=crtSegOf(player.z);
  if(id==='camino'&&CRD.mule){const M=CRD.mule,road=CRT_SEGS.camino.road;M.t=(M.t+dt*0.006)%2;const u=M.t<1?M.t:2-M.t,f=u*(road.length-1),i=Math.min(road.length-2,Math.floor(f)),q=f-i,lx=road[i][0]+(road[i+1][0]-road[i][0])*q+2,lz=road[i][1]+(road[i+1][1]-road[i][1])*q,[wx,wz]=crtW('camino',lx,lz),dir=M.t<1?0:Math.PI;
    M.g.position.set(wx,crtHL('camino',lx,lz),wz);M.g.rotation.y=dir;M.man.position.set(wx-0.9,crtHL('camino',lx-0.9,lz),wz+(M.t<1?-1.6:1.6));M.man.rotation.y=dir;
    for(const b of CRD.bees){const P=b.pts.geometry.attributes.position;for(let k=0;k<30;k++){const a=t*(2+k%5)+k*1.7+b.ph;P.setXYZ(k,b.x+Math.cos(a)*(0.4+(k%7)*0.12),b.y+Math.sin(a*1.3)*0.4,b.z+Math.sin(a)*(0.4+(k%5)*0.12));}P.needsUpdate=true;}
    for(const k of CRD.kri){k.g.rotation.y=Math.sin(t*0.2+k.ph)*1.2;}}
  if(id==='ida'&&CRD.eagle){const E=CRD.eagle,a=t*0.15;E.g.position.set(E.c.x+Math.cos(a)*40,crtH(E.c.x,E.c.z)+55+Math.sin(t*0.3)*4,E.c.z+Math.sin(a)*40);E.g.rotation.set(0,-a,0.35);}
  if(id==='mesara')for(const o of CRD.oxen){const a=t*0.25+o.ph;o.g.position.set(o.cx+Math.cos(a)*5.5,o.y,o.cz+Math.sin(a)*5.5);o.g.rotation.y=-a;}
  if(!(typeof aOK==='function'&&aOK())||ui!=='play')return;const ac=AUD.ctx,t0=ac.currentTime+0.03,S=CRD.snd,T=CRD.sT;
  const near=(o,r)=>o?Math.max(0,1-Math.hypot(player.x-o.x,player.z-o.z)/r):0,tick=(k,v,per,fn)=>{if(v<=0)return;T[k]=(T[k]||0)-dt;if(T[k]<0){T[k]=per();fn(v);}};
  tick('fuente',near(S.fuente,25),()=>0.45,v=>gfNoise(t0,'lowpass',900,0.7,0.05*v,0.05,0.4));
  tick('bees',near(S.bees,18),()=>0.7,v=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sawtooth';o.frequency.value=200+Math.random()*40;g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(0.02*v,t0+0.15);g.gain.exponentialRampToValueAtTime(0.0001,t0+0.8);const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=420;o.connect(f).connect(g).connect(AUD.master);o.start(t0);o.stop(t0+0.85);});
  tick('aguila',id==='ida'?near(CRT.cave,140):0,()=>9+Math.random()*9,v=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(2400,t0);o.frequency.exponentialRampToValueAtTime(1500,t0+0.6);g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(0.03*v,t0+0.05);g.gain.exponentialRampToValueAtTime(0.0001,t0+0.65);o.connect(g).connect(AUD.master);o.start(t0);o.stop(t0+0.7);});
  tick('era',near(S.era,40),()=>1.1,v=>{crtDrum(t0,0.12*v);crtDrum(t0+0.5,0.1*v);});
  tick('ranas',near(S.ranas,45),()=>0.6+Math.random()*1.2,v=>{for(let k=0;k<2;k++){const o=ac.createOscillator(),g=ac.createGain(),tt=t0+k*0.12;o.type='square';o.frequency.setValueAtTime(300+Math.random()*80,tt);o.frequency.exponentialRampToValueAtTime(180,tt+0.08);g.gain.setValueAtTime(0.0001,tt);g.gain.exponentialRampToValueAtTime(0.025*v,tt+0.01);g.gain.exponentialRampToValueAtTime(0.0001,tt+0.09);o.connect(g).connect(AUD.master);o.start(tt);o.stop(tt+0.1);}});
}
function crdAct(a){const S=(gl,n,sub,html)=>vmS(gl,n,sub,html,[vmBye]);
  if(a==='fuente')return S('💧','Una fuente','con un abrevadero para el ganado','<p>Agua fría que baja del monte. Un buen sitio para descansar a la sombra, como hacen los tres viejos de Las leyes de Platón, que van parando en cada fuente y en cada prado del camino.</p><p>Bebes y te sientes con fuerzas para seguir subiendo.</p><p class="src">Platón, Leyes I 625b.</p>');
  if(a==='colmenas')return S('🐝','Una apicultora','junto a sus colmenas','<p>«Las abejas de Creta son sagradas. Cuando Zeus era un bebé escondido en la cueva, las abejas le traían miel para alimentarlo, y por eso él les dio el color dorado. Mis colmenas son de barro, tumbadas, para que no se calienten demasiado. La mejor miel sale del tomillo».</p><p class="src">Virgilio, Geórgicas IV 149-152; Antonino Liberal, Metamorfosis 19 (las abejas de la cueva). Aristóteles describe la vida de las abejas en Historia de los animales V 21-22 y IX 40. En Creta se han hallado colmenas de cerámica.</p>');
  if(a==='agrimi')return S('🐐','Cabras salvajes','en las rocas del Yuctas','<p>Tres cabras de pelo pardo y cuernos largos y curvos saltan de roca en roca. Son las cabras salvajes de Creta, las que buscan díctamo cuando las hiere una flecha. Los cazadores cretenses hacen arcos con sus cuernos.</p><p class="src">Homero, Ilíada IV 105-111 (el arco de Pándaro, hecho con cuernos de cabra salvaje). Hoy esta cabra (Capra aegagrus creticus) solo vive en algunos montes de Creta.</p>');
  if(a==='altar')return S('🪨','Un montón de piedras','con ofrendas encima','<p>Los caminantes que pasan por aquí añaden una piedra al montón y dejan algo encima: una flor, un higo, un mechón de lana. Así piden al dios del camino que les deje llegar bien.</p><p>Es una costumbre muy antigua. En Atenas se ponen hermes en los caminos; en el campo, a veces, basta con un montón de piedras.</p><p class="src">Los montones de piedras del camino (hermaia) se relacionaban con Hermes; los cita ya la Odisea (XVI 471, «la colina de Hermes»).</p>');
  if(a==='iniciado')return S('🖤','Un hombre envuelto en lana negra','a la entrada de la cueva','<p>«Vengo de Samos para bajar a la cueva. Me he purificado con una piedra de rayo, y ahora entraré envuelto en lana negra y me quedaré dentro tres veces nueve días, como hizo Pitágoras. Después ofreceré un sacrificio a Zeus en su trono, que está ahí dentro, y quizá entienda algo».</p><p class="src">Porfirio, Vida de Pitágoras 17 (siglo III d.C., pero recoge tradiciones antiguas). Diógenes Laercio VIII 3.</p>');
  if(a==='quesero')return S('🧀','Un pastor del Ida','haciendo queso','<p>«Ordeño las ovejas al atardecer, cuajo la leche con jugo de higuera y la dejo escurrir en cestas de mimbre. Mira: igual que el cíclope de Homero en su cueva, ¿te acuerdas? Cestas llenas de queso, cubos llenos de suero… Pero yo no me como a los viajeros. Toma, prueba».</p><p class="src">Homero, Odisea IX 219-249; Ilíada V 902 (el jugo de higuera que cuaja la leche).</p>');
  if(a==='aguila')return S('🦅','Un águila','da vueltas sobre la cueva','<p>Un águila planea en círculos muy alto, sobre la cueva. El águila es el ave de Zeus: le lleva sus rayos, y Zeus, convertido en águila, raptó al joven Ganimedes. Los pastores del Ida dicen que esta nunca se va de aquí.</p><p class="src">Píndaro, Pítica I 6-10 (el águila dormida sobre el cetro de Zeus); Apolodoro III 12.2 (Ganimedes).</p>');
  if(a==='era')return S('🌾','Un campesino','trillando el trigo con sus bueyes','<p>«La Mesara es la tierra más fértil de Creta. Ahora trillamos: los bueyes dan vueltas sobre las espigas y las pisan para que suelte el grano. Luego, cuando sople el viento, lanzaremos la paja al aire con la pala, y el grano, que pesa más, caerá al suelo».</p><p class="src">Homero, Ilíada XX 495-497 (bueyes trillando en la era) y XIII 588-590 (aventar). Hesíodo, Trabajos y días 597-599.</p>');
  if(a==='juez')return vmS('⚖','Un juez de Gortina','escuchando a dos vecinos','<p>«Este dice que la cabra es suya, y el otro, que la compró. Nuestra ley dice cuándo debo juzgar según los testigos y cuándo debo jurar yo mismo y decidir según lo que creo justo. Aquí hay testigos, así que decido por ellos».</p><p>¿Qué crees que hace el juez si ninguno de los dos tiene testigos?</p>',
    [['Jura y decide según su conciencia',()=>S('⚖','Un juez de Gortina','','<p>«Exacto. La ley lo dice: cuando no hay testigos, el juez jura y decide. Así de grande es nuestra confianza en los jueces… y en los dioses que castigan al que jura en falso».</p><p class="src">Código de Gortina, columna XI, líneas 26-31.</p>')],['Echa a suertes quién tiene razón',()=>S('⚖','Un juez de Gortina','','<p>«¡No! Eso sería dejarlo al azar. Cuando no hay testigos, el juez jura y decide según su conciencia».</p><p class="src">Código de Gortina, columna XI, líneas 26-31.</p>')],vmBye]);
  if(a==='toro')return S('🐂','Un toro blanco','paciendo junto al río','<p>Un toro enorme, blanco como la nieve, pace junto al río. Te mira con tranquilidad.</p><p>Así era el toro en que se convirtió Zeus para raptar a Europa: blanco, con los cuernos como una luna creciente, tan manso que ella se atrevió a subirse a su lomo. Entonces el toro entró en el mar y nadó hasta Creta.</p><p class="src">Mosco, Europa 80-130; Ovidio, Metamorfosis II 846-875.</p>');
}
// enganches
{const fa1=floorAt;floorAt=function(x,z){if(crtBand(x,z))return crtH(x,z);return fa1(x,z);};
 const th1=terrainH;terrainH=function(x,z){if(crtBand(x,z))return crtH(x,z);return th1(x,z);};
 const ck1=checkZone;checkZone=function(){if(crtBand(player.x,player.z))return;return ck1();};
 const rn1=regionName;regionName=function(){if(crtBand(player.x,player.z)){const id=crtSegOf(player.z);return 'Creta · '+CRT_SEGS[id].name;}return rn1();};}

function startGame(){
  initAudio();
  if(state.pos&&!startGame.done){const p=state.pos;if(Math.abs(p.x)<1e6&&floorAt(p.x,p.z)>-1){player.x=p.x;player.z=p.z;player.yaw=p.yaw||0;player.feet=floorAt(p.x,p.z);player.camY=player.feet+player.eye;clock.h=p.h||10;updateSky();setTimeout(()=>toast('<span class="label">Partida recuperada</span><br>Vuelves adonde lo dejaste: día '+(state.day||1)+', '+hourLabel()+'.'),2500);}}
  // partida nueva: empezar mirando hacia el primer objetivo, no hacia una pared
  if(!state.pos&&!startGame.done){try{const s=curStep(),a=s&&s.at&&s.at();if(a&&isFinite(a.x))player.yaw=Math.atan2(player.x-a.x,player.z-a.z);}catch(e){}}
  startGame.done=true;
  for(const s of STEPS())if(s.ok())state.steps['ok:'+s.id]=1;   // lo ya hecho en partidas anteriores cuenta sin recompensa
  $('start').hidden=true;$('hud').hidden=false;if(isTouch)$('touch').hidden=false;ui='play';updateStats();requestPointer();
  if(!pjInit.done){pjInit.done=1;pjInit();}
  if(!pjz())setTimeout(()=>pjDlg(()=>{if(!state.tut)setTimeout(tutStart,800);}),500);
  else if(!state.tut)setTimeout(tutStart,1200);
  else if(!storyOn()&&!state.places.length&&!state.lessons.length)setTimeout(()=>toast('Empieza por los <b>primeros pasos</b>: tu objetivo está arriba a la izquierda y el rombo ◆ de la brújula te indica hacia dónde ir. En el diario (<b>J</b>) tienes la lista completa.'),4500);
}
$('go').onclick=startGame;
$('tutSkip').onclick=()=>tutEnd(true);$('dX').onclick=()=>{if(ui==='dialog'||!$('dialog').hidden)closeDialog();};
$('sProg').onclick=()=>{if(ui==='play')openJournal('ficha');};
$('goStory').onclick=startStory;
$('goNet').onclick=()=>{$('netPanel').hidden=false;let n='';try{n=localStorage.getItem('mc-net-name')||'';}catch(e){}$('netName').value=n;$('netCode').value='';$('netMsg').textContent='';setTimeout(()=>$('netName').focus(),30);};
$('netCancel').onclick=()=>{$('netPanel').hidden=true;};
$('netGo').onclick=async()=>{$('netGo').disabled=true;const ok=await netJoin($('netName').value,$('netCode').value);$('netGo').disabled=false;if(ok){$('netPanel').hidden=true;startGame();}};
$('netIn').onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();const t=netClean($('netIn').value,200);$('netIn').hidden=true;$('netIn').value='';
  if(t&&NET.room)NET.room.emit('chat',{t}).catch(er=>netSay('',er&&er.code==='not_permitted'?'No tienes permiso para escribir en el chat: pide al dueño de la página acceso de participante.':'No se ha podido enviar el mensaje.'));requestPointer();}
  else if(e.key==='Escape'){$('netIn').hidden=true;requestPointer();}};
$('libStart').onclick=()=>openLibrary();$('loadStart').onclick=importSave;$('jSave').onclick=exportSave;$('jLoad').onclick=importSave;
setInterval(()=>{if(state&&ui==='play')save();},20000);addEventListener('beforeunload',()=>{if(state&&ui==='play')save();});
$('bLib').onclick=()=>{if(ui==='play')openLibrary();};
$('bJournal').onclick=()=>{if(ui==='play')openJournal();};
$('bMap').onclick=()=>{if(ui==='play')openMap();};
$('bTime').onclick=()=>{if(ui==='play')advanceTime();};
$('bSound').onclick=()=>{initAudio();toggleSound();};
$('bSound').setAttribute('aria-pressed',AUD_ON?'true':'false');
$('libQ').addEventListener('input',()=>renderLibNav($('libQ').value));
$('tLib').onclick=()=>{if(ui==='play')openLibrary();};
$('tTime').onclick=()=>{if(ui==='play')advanceTime();};
$('bHorse').onclick=()=>{if(ui==='play')callHorse();};
$('tHorse').onclick=()=>{if(ui==='play')callHorse();};
$('bView').onclick=()=>{if(ui==='play')toggleView();};$('bTorch').onclick=()=>toggleTorch();$('tTorch').onclick=()=>toggleTorch();$('tView').onclick=()=>{if(ui==='play')toggleView();};
$('bEra').onclick=()=>{location.href=location.pathname+langQuery()+(location.hash==='#debug'?'#debug':'');};
$('bBack').onclick=()=>{location.href=location.pathname+langQuery()+(location.hash==='#debug'?'#debug':'');};
initGloss();
resize();
// ---- medición de la carga (solo en #debug): cuánto tarda cada parte en construirse
const PROF={t0:performance.now(),m:{},marks:[]};
if(location.hash==='#debug'){
if(typeof amb2Setup==='function'){const _f=amb2Setup;amb2Setup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['amb2Setup']=(PROF.m['amb2Setup']||0)+performance.now()-t;return r;};}
if(typeof ambSetup==='function'){const _f=ambSetup;ambSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['ambSetup']=(PROF.m['ambSetup']||0)+performance.now()-t;return r;};}
if(typeof artSetup==='function'){const _f=artSetup;artSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['artSetup']=(PROF.m['artSetup']||0)+performance.now()-t;return r;};}
if(typeof atalSetup==='function'){const _f=atalSetup;atalSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['atalSetup']=(PROF.m['atalSetup']||0)+performance.now()-t;return r;};}
if(typeof buildBarco==='function'){const _f=buildBarco;buildBarco=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildBarco']=(PROF.m['buildBarco']||0)+performance.now()-t;return r;};}
if(typeof buildBirds==='function'){const _f=buildBirds;buildBirds=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildBirds']=(PROF.m['buildBirds']||0)+performance.now()-t;return r;};}
if(typeof buildCarters==='function'){const _f=buildCarters;buildCarters=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildCarters']=(PROF.m['buildCarters']||0)+performance.now()-t;return r;};}
if(typeof buildCasa==='function'){const _f=buildCasa;buildCasa=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildCasa']=(PROF.m['buildCasa']||0)+performance.now()-t;return r;};}
if(typeof buildConvs==='function'){const _f=buildConvs;buildConvs=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildConvs']=(PROF.m['buildConvs']||0)+performance.now()-t;return r;};}
if(typeof buildDaedalus==='function'){const _f=buildDaedalus;buildDaedalus=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildDaedalus']=(PROF.m['buildDaedalus']||0)+performance.now()-t;return r;};}
if(typeof buildFauna==='function'){const _f=buildFauna;buildFauna=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildFauna']=(PROF.m['buildFauna']||0)+performance.now()-t;return r;};}
if(typeof buildHandTorch==='function'){const _f=buildHandTorch;buildHandTorch=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildHandTorch']=(PROF.m['buildHandTorch']||0)+performance.now()-t;return r;};}
if(typeof buildMusas==='function'){const _f=buildMusas;buildMusas=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildMusas']=(PROF.m['buildMusas']||0)+performance.now()-t;return r;};}
if(typeof buildSpheres==='function'){const _f=buildSpheres;buildSpheres=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildSpheres']=(PROF.m['buildSpheres']||0)+performance.now()-t;return r;};}
if(typeof buildTour==='function'){const _f=buildTour;buildTour=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildTour']=(PROF.m['buildTour']||0)+performance.now()-t;return r;};}
if(typeof cvSetup==='function'){const _f=cvSetup;cvSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['cvSetup']=(PROF.m['cvSetup']||0)+performance.now()-t;return r;};}
if(typeof cySetup==='function'){const _f=cySetup;cySetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['cySetup']=(PROF.m['cySetup']||0)+performance.now()-t;return r;};}
if(typeof delfosPlus==='function'){const _f=delfosPlus;delfosPlus=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['delfosPlus']=(PROF.m['delfosPlus']||0)+performance.now()-t;return r;};}
if(typeof egxSetup==='function'){const _f=egxSetup;egxSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['egxSetup']=(PROF.m['egxSetup']||0)+performance.now()-t;return r;};}
if(typeof farmOfferSetup==='function'){const _f=farmOfferSetup;farmOfferSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['farmOfferSetup']=(PROF.m['farmOfferSetup']||0)+performance.now()-t;return r;};}
if(typeof farmSetup==='function'){const _f=farmSetup;farmSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['farmSetup']=(PROF.m['farmSetup']||0)+performance.now()-t;return r;};}
if(typeof finSetup==='function'){const _f=finSetup;finSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['finSetup']=(PROF.m['finSetup']||0)+performance.now()-t;return r;};}
if(typeof hbSetup==='function'){const _f=hbSetup;hbSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['hbSetup']=(PROF.m['hbSetup']||0)+performance.now()-t;return r;};}
if(typeof hdSetup==='function'){const _f=hdSetup;hdSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['hdSetup']=(PROF.m['hdSetup']||0)+performance.now()-t;return r;};}
if(typeof jrSetup==='function'){const _f=jrSetup;jrSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['jrSetup']=(PROF.m['jrSetup']||0)+performance.now()-t;return r;};}
if(typeof m386Setup==='function'){const _f=m386Setup;m386Setup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['m386Setup']=(PROF.m['m386Setup']||0)+performance.now()-t;return r;};}
if(typeof mareShow==='function'){const _f=mareShow;mareShow=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['mareShow']=(PROF.m['mareShow']||0)+performance.now()-t;return r;};}
if(typeof mktSetup==='function'){const _f=mktSetup;mktSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['mktSetup']=(PROF.m['mktSetup']||0)+performance.now()-t;return r;};}
if(typeof mtSetup==='function'){const _f=mtSetup;mtSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['mtSetup']=(PROF.m['mtSetup']||0)+performance.now()-t;return r;};}
if(typeof natSetup==='function'){const _f=natSetup;natSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['natSetup']=(PROF.m['natSetup']||0)+performance.now()-t;return r;};}
if(typeof ofSetup==='function'){const _f=ofSetup;ofSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['ofSetup']=(PROF.m['ofSetup']||0)+performance.now()-t;return r;};}
if(typeof ovidSetup==='function'){const _f=ovidSetup;ovidSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['ovidSetup']=(PROF.m['ovidSetup']||0)+performance.now()-t;return r;};}
if(typeof popSetup==='function'){const _f=popSetup;popSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['popSetup']=(PROF.m['popSetup']||0)+performance.now()-t;return r;};}
if(typeof progSetup==='function'){const _f=progSetup;progSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['progSetup']=(PROF.m['progSetup']||0)+performance.now()-t;return r;};}
if(typeof qcSetup==='function'){const _f=qcSetup;qcSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['qcSetup']=(PROF.m['qcSetup']||0)+performance.now()-t;return r;};}
if(typeof rcSetup==='function'){const _f=rcSetup;rcSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['rcSetup']=(PROF.m['rcSetup']||0)+performance.now()-t;return r;};}
if(typeof rdSetup==='function'){const _f=rdSetup;rdSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['rdSetup']=(PROF.m['rdSetup']||0)+performance.now()-t;return r;};}
if(typeof romaTheatres==='function'){const _f=romaTheatres;romaTheatres=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['romaTheatres']=(PROF.m['romaTheatres']||0)+performance.now()-t;return r;};}
if(typeof sealFootprints==='function'){const _f=sealFootprints;sealFootprints=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['sealFootprints']=(PROF.m['sealFootprints']||0)+performance.now()-t;return r;};}
if(typeof spSetup==='function'){const _f=spSetup;spSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['spSetup']=(PROF.m['spSetup']||0)+performance.now()-t;return r;};}
if(typeof termoPlus==='function'){const _f=termoPlus;termoPlus=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['termoPlus']=(PROF.m['termoPlus']||0)+performance.now()-t;return r;};}
if(typeof ttSetup==='function'){const _f=ttSetup;ttSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['ttSetup']=(PROF.m['ttSetup']||0)+performance.now()-t;return r;};}
if(typeof urbSetup==='function'){const _f=urbSetup;urbSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['urbSetup']=(PROF.m['urbSetup']||0)+performance.now()-t;return r;};}
if(typeof visSetup==='function'){const _f=visSetup;visSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['visSetup']=(PROF.m['visSetup']||0)+performance.now()-t;return r;};}
if(typeof vmSetup==='function'){const _f=vmSetup;vmSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['vmSetup']=(PROF.m['vmSetup']||0)+performance.now()-t;return r;};}
if(typeof vocSetup==='function'){const _f=vocSetup;vocSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['vocSetup']=(PROF.m['vocSetup']||0)+performance.now()-t;return r;};}
if(typeof vuSetup==='function'){const _f=vuSetup;vuSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['vuSetup']=(PROF.m['vuSetup']||0)+performance.now()-t;return r;};}
if(typeof warSetup==='function'){const _f=warSetup;warSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['warSetup']=(PROF.m['warSetup']||0)+performance.now()-t;return r;};}
if(typeof colSetup==='function'){const _f=colSetup;colSetup=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['colSetup']=(PROF.m['colSetup']||0)+performance.now()-t;return r;};}
if(typeof applyFlats==='function'){const _f=applyFlats;applyFlats=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['applyFlats']=(PROF.m['applyFlats']||0)+performance.now()-t;return r;};}
if(typeof athensDecor==='function'){const _f=athensDecor;athensDecor=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['athensDecor']=(PROF.m['athensDecor']||0)+performance.now()-t;return r;};}
if(typeof buildAcropolis==='function'){const _f=buildAcropolis;buildAcropolis=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildAcropolis']=(PROF.m['buildAcropolis']||0)+performance.now()-t;return r;};}
if(typeof buildAgora==='function'){const _f=buildAgora;buildAgora=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildAgora']=(PROF.m['buildAgora']||0)+performance.now()-t;return r;};}
if(typeof buildAthensSchools==='function'){const _f=buildAthensSchools;buildAthensSchools=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildAthensSchools']=(PROF.m['buildAthensSchools']||0)+performance.now()-t;return r;};}
if(typeof buildAvatar==='function'){const _f=buildAvatar;buildAvatar=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildAvatar']=(PROF.m['buildAvatar']||0)+performance.now()-t;return r;};}
if(typeof buildGeoGR==='function'){const _f=buildGeoGR;buildGeoGR=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildGeoGR']=(PROF.m['buildGeoGR']||0)+performance.now()-t;return r;};}
if(typeof buildGods==='function'){const _f=buildGods;buildGods=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildGods']=(PROF.m['buildGods']||0)+performance.now()-t;return r;};}
if(typeof buildHarbor==='function'){const _f=buildHarbor;buildHarbor=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildHarbor']=(PROF.m['buildHarbor']||0)+performance.now()-t;return r;};}
if(typeof buildHouses==='function'){const _f=buildHouses;buildHouses=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildHouses']=(PROF.m['buildHouses']||0)+performance.now()-t;return r;};}
if(typeof buildIslands==='function'){const _f=buildIslands;buildIslands=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildIslands']=(PROF.m['buildIslands']||0)+performance.now()-t;return r;};}
if(typeof buildKerameikos==='function'){const _f=buildKerameikos;buildKerameikos=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildKerameikos']=(PROF.m['buildKerameikos']||0)+performance.now()-t;return r;};}
if(typeof buildLandRoute==='function'){const _f=buildLandRoute;buildLandRoute=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildLandRoute']=(PROF.m['buildLandRoute']||0)+performance.now()-t;return r;};}
if(typeof buildMount==='function'){const _f=buildMount;buildMount=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildMount']=(PROF.m['buildMount']||0)+performance.now()-t;return r;};}
if(typeof buildMyHouse==='function'){const _f=buildMyHouse;buildMyHouse=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildMyHouse']=(PROF.m['buildMyHouse']||0)+performance.now()-t;return r;};}
if(typeof buildOutskirts==='function'){const _f=buildOutskirts;buildOutskirts=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildOutskirts']=(PROF.m['buildOutskirts']||0)+performance.now()-t;return r;};}
if(typeof buildPerformers==='function'){const _f=buildPerformers;buildPerformers=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildPerformers']=(PROF.m['buildPerformers']||0)+performance.now()-t;return r;};}
if(typeof buildRaphaelHall==='function'){const _f=buildRaphaelHall;buildRaphaelHall=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildRaphaelHall']=(PROF.m['buildRaphaelHall']||0)+performance.now()-t;return r;};}
if(typeof buildRome==='function'){const _f=buildRome;buildRome=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildRome']=(PROF.m['buildRome']||0)+performance.now()-t;return r;};}
if(typeof buildSocial==='function'){const _f=buildSocial;buildSocial=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildSocial']=(PROF.m['buildSocial']||0)+performance.now()-t;return r;};}
if(typeof buildSouthSlope==='function'){const _f=buildSouthSlope;buildSouthSlope=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildSouthSlope']=(PROF.m['buildSouthSlope']||0)+performance.now()-t;return r;};}
if(typeof buildTerrain==='function'){const _f=buildTerrain;buildTerrain=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildTerrain']=(PROF.m['buildTerrain']||0)+performance.now()-t;return r;};}
if(typeof buildTorches==='function'){const _f=buildTorches;buildTorches=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildTorches']=(PROF.m['buildTorches']||0)+performance.now()-t;return r;};}
if(typeof buildTrees==='function'){const _f=buildTrees;buildTrees=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildTrees']=(PROF.m['buildTrees']||0)+performance.now()-t;return r;};}
if(typeof buildTucGR==='function'){const _f=buildTucGR;buildTucGR=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildTucGR']=(PROF.m['buildTucGR']||0)+performance.now()-t;return r;};}
if(typeof buildWalls==='function'){const _f=buildWalls;buildWalls=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildWalls']=(PROF.m['buildWalls']||0)+performance.now()-t;return r;};}
if(typeof definePlaces==='function'){const _f=definePlaces;definePlaces=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['definePlaces']=(PROF.m['definePlaces']||0)+performance.now()-t;return r;};}
if(typeof defineRiversGR==='function'){const _f=defineRiversGR;defineRiversGR=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['defineRiversGR']=(PROF.m['defineRiversGR']||0)+performance.now()-t;return r;};}
if(typeof finishColumns==='function'){const _f=finishColumns;finishColumns=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['finishColumns']=(PROF.m['finishColumns']||0)+performance.now()-t;return r;};}
if(typeof finishRoofs==='function'){const _f=finishRoofs;finishRoofs=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['finishRoofs']=(PROF.m['finishRoofs']||0)+performance.now()-t;return r;};}
if(typeof houseApply==='function'){const _f=houseApply;houseApply=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['houseApply']=(PROF.m['houseApply']||0)+performance.now()-t;return r;};}
if(typeof placeNPCs==='function'){const _f=placeNPCs;placeNPCs=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['placeNPCs']=(PROF.m['placeNPCs']||0)+performance.now()-t;return r;};}
if(typeof placeNewNPCs==='function'){const _f=placeNewNPCs;placeNewNPCs=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['placeNewNPCs']=(PROF.m['placeNewNPCs']||0)+performance.now()-t;return r;};}
if(typeof placeReliefs==='function'){const _f=placeReliefs;placeReliefs=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['placeReliefs']=(PROF.m['placeReliefs']||0)+performance.now()-t;return r;};}
if(typeof placeWalkers==='function'){const _f=placeWalkers;placeWalkers=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['placeWalkers']=(PROF.m['placeWalkers']||0)+performance.now()-t;return r;};}
if(typeof poseDream==='function'){const _f=poseDream;poseDream=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['poseDream']=(PROF.m['poseDream']||0)+performance.now()-t;return r;};}
if(typeof buildWorld==='function'){const _f=buildWorld;buildWorld=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildWorld']=(PROF.m['buildWorld']||0)+performance.now()-t;return r;};}
if(typeof loadModels==='function'){const _f=loadModels;loadModels=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['loadModels']=(PROF.m['loadModels']||0)+performance.now()-t;return r;};}
}
if(location.hash==='#debug'){
if(typeof buildIslandMesh==='function'){const _f=buildIslandMesh;buildIslandMesh=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildIslandMesh']=(PROF.m['buildIslandMesh']||0)+performance.now()-t;PROF.c=PROF.c||{};PROF.c['buildIslandMesh']=(PROF.c['buildIslandMesh']||0)+1;return r;};}
if(typeof buildPort==='function'){const _f=buildPort;buildPort=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildPort']=(PROF.m['buildPort']||0)+performance.now()-t;PROF.c=PROF.c||{};PROF.c['buildPort']=(PROF.c['buildPort']||0)+1;return r;};}
if(typeof buildSimple==='function'){const _f=buildSimple;buildSimple=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['buildSimple']=(PROF.m['buildSimple']||0)+performance.now()-t;PROF.c=PROF.c||{};PROF.c['buildSimple']=(PROF.c['buildSimple']||0)+1;return r;};}
if(typeof defineSimple==='function'){const _f=defineSimple;defineSimple=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['defineSimple']=(PROF.m['defineSimple']||0)+performance.now()-t;PROF.c=PROF.c||{};PROF.c['defineSimple']=(PROF.c['defineSimple']||0)+1;return r;};}
if(typeof destHouses==='function'){const _f=destHouses;destHouses=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['destHouses']=(PROF.m['destHouses']||0)+performance.now()-t;PROF.c=PROF.c||{};PROF.c['destHouses']=(PROF.c['destHouses']||0)+1;return r;};}
if(typeof destTrees==='function'){const _f=destTrees;destTrees=function(){const t=performance.now();const r=_f.apply(this,arguments);PROF.m['destTrees']=(PROF.m['destTrees']||0)+performance.now()-t;PROF.c=PROF.c||{};PROF.c['destTrees']=(PROF.c['destTrees']||0)+1;return r;};}
}
// ---------- Pantalla de carga: un barco (trirreme ateniense / corbita romana) que navega hacia el puerto mientras se levanta la ciudad ----------
// La construcción va por etapas (bwSteps + setups); entre tandas de ~90 ms se cede el control para que la pantalla se dibuje.
// El peso de cada etapa sale de lo que tardó la última carga en este navegador (localStorage); la primera vez, de una tabla aproximada.
const LD={p:0,el:null,dur:{}};
const LD_W={buildIslands:50,buildTerrain:10,applyFlats:5,buildTrees:5,sello:5,buildHouses:2.5,amb2Setup:2,ambSetup:1.5,buildGeoGR:1.4,rcSetup:1.3,rdSetup:1.3,romaForum:8,romaCapitol:6,romaPalatine:6,romaColosseum:5,romaCircus:4,romaFora:5,romaCampus:5,romaRiver:3,romaTravel:15,buildRomaDests:12,romaCity:3};
function ldSvgShip(){
  if(MODE==='roma')return '<svg viewBox="0 0 120 60" class="ldBoat" aria-hidden="true">'+
   '<line x1="20" y1="34" x2="13" y2="52" stroke="#4a3220" stroke-width="2.2" stroke-linecap="round"/>'+
   '<path d="M12,32 L100,32 Q108,31 112,25 L115,23 L113,30 Q108,45 92,46 L28,46 Q14,44 12,32 Z" fill="#7a5434" stroke="#4a3220" stroke-width="1"/>'+
   '<rect x="16" y="35" width="90" height="2.4" fill="#c9a36a"/>'+
   '<path d="M16,32 Q5,24 9,13 Q12,6 19,9 Q16,12 13,13" fill="none" stroke="#4a3220" stroke-width="3" stroke-linecap="round"/>'+
   '<line x1="56" y1="32" x2="56" y2="2" stroke="#4a3220" stroke-width="2"/><line x1="34" y1="5" x2="78" y2="5" stroke="#4a3220" stroke-width="1.6"/>'+
   '<path class="ldSail" d="M36,6 L76,6 Q78,18 75,29 L37,29 Q34,18 36,6 Z" fill="#efe6d2" stroke="#b8a888" stroke-width=".8"/>'+
   '<path d="M37,15 L76,15 M37,22 L76,22" stroke="#c8b898" stroke-width=".6"/>'+
   '<line x1="104" y1="30" x2="117" y2="12" stroke="#4a3220" stroke-width="1.6"/><path class="ldSail" d="M106,14 L117,10 L118,22 L109,25 Z" fill="#efe6d2" stroke="#b8a888" stroke-width=".7"/></svg>';
  let oars='';for(let i=0;i<9;i++)oars+='<line x1="'+(30+i*8.5)+'" y1="40" x2="'+(26+i*8.5)+'" y2="54"/>';
  return '<svg viewBox="0 0 120 60" class="ldBoat" aria-hidden="true">'+
   '<g class="ldOars" stroke="#5a4532" stroke-width="1.3" stroke-linecap="round">'+oars+'</g>'+
   '<path d="M14,34 L104,34 L110,40 L119,45 L110,47.5 L104,46 L24,46 Q14,44 10,36 Q6,26 10,15 Q13,24 14,34 Z" fill="#2b2622" stroke="#151210" stroke-width=".8"/>'+
   '<rect x="22" y="36.5" width="80" height="3.2" fill="#8a3b2a"/>'+
   '<circle cx="101" cy="39" r="2.4" fill="#f4efe4"/><circle cx="101.6" cy="39" r="1.2" fill="#151210"/>'+
   '<line x1="58" y1="34" x2="58" y2="6" stroke="#3a2c22" stroke-width="1.8"/><line x1="40" y1="8" x2="76" y2="8" stroke="#3a2c22" stroke-width="1.4"/>'+
   '<path class="ldSail" d="M42,9 L74,9 Q76,19 73,29 L43,29 Q40,19 42,9 Z" fill="#efe6d2" stroke="#b8a888" stroke-width=".8"/></svg>';
}
function ldShipShow(){
  if(LD.el)return;const lm=$('loadmsg');if(!lm)return;
  if(!$('ldCSS')){const st=document.createElement('style');st.id='ldCSS';st.textContent=
   '#ldBox{box-sizing:border-box;position:fixed;right:16px;bottom:calc(14px + env(safe-area-inset-bottom,0px));width:min(330px,calc(100vw - 32px));z-index:60;pointer-events:none;background:rgba(24,19,15,.9);border:1px solid #c98a4e;border-radius:10px;padding:8px 12px 8px;box-shadow:0 6px 24px rgba(0,0,0,.45);transition:opacity .8s,transform .8s;text-align:center}'+
   '#ldBox.gone{opacity:0;transform:translate(0,20px);pointer-events:none}'+'@media (max-width:820px){#ldBox{right:auto;left:50%;transform:translateX(-50%);bottom:auto;top:calc(8px + env(safe-area-inset-top,0px));opacity:.94}#ldBox.gone{transform:translate(-50%,-20px)}#ldBox #ldShip{height:70px}}'+
   '#ldPct{font-size:.9rem;color:#efe6d2;margin-top:2px}'+
   '#ldShip{position:relative;width:100%;height:96px;overflow:hidden}'+
   '#ldShip .ldTrack{position:absolute;left:0;right:86px;top:27px;height:60px}'+
   '#ldShip .ldMove{position:absolute;inset:0;transition:transform .7s linear;will-change:transform}'+
   '#ldShip .ldBob{position:absolute;left:0;top:0;width:112px;height:56px;animation:ldBob 2.4s ease-in-out infinite}'+
   '#ldShip .ldBoat{width:112px;height:56px;display:block}'+
   '#ldShip .ldOars{transform-origin:50% 40px;animation:ldRow 1.1s ease-in-out infinite}'+
   '#ldShip .ldSea{position:absolute;left:0;bottom:4px;width:200%;height:30px;animation:ldWave 6s linear infinite}'+
   '#ldShip .ldSea2{bottom:0;opacity:.6;animation-duration:9s;animation-direction:reverse}'+
   '#ldShip .ldPort{position:absolute;right:2px;top:2px;font-size:.72rem;color:#cbbfa8;text-align:center;width:70px}'+
   '#ldShip .ldPort svg{display:block;margin:2px auto 0;width:54px;height:40px}'+
   '#ldShip.done .ldOars{animation:none}#ldShip.done .ldBob{animation-duration:4s}'+
   '#ldNote{font-size:.74rem;color:#cbbfa8;font-style:italic;margin:2px auto 0}'+
   '@keyframes ldBob{0%,100%{transform:translateY(0) rotate(-1.2deg)}50%{transform:translateY(3px) rotate(1.2deg)}}'+
   '@keyframes ldRow{0%,100%{transform:skewX(18deg)}50%{transform:skewX(-14deg)}}'+
   '@keyframes ldWave{from{transform:translateX(0)}to{transform:translateX(-50%)}}'+
   '@media (prefers-reduced-motion:reduce){#ldShip *{animation:none!important;transition:none!important}}';
   document.head.appendChild(st);}
  const R=MODE==='roma';let w='';for(let x=0;x<=880;x+=20)w+=(x?' ':'M')+x+','+(x%40?10:16)+(x?'':'');
  const wave=c=>'<svg class="ldSea'+(c?' ldSea2':'')+'" viewBox="0 0 880 30" preserveAspectRatio="none" aria-hidden="true"><path d="M0,14 '+Array.from({length:44},(_,i)=>'q10,'+(i%2?6:-6)+' 20,0').join(' ')+' V30 H0 Z" fill="'+(c?'#2f6a82':'#3a7891')+'"/></svg>';
  const port=R?'<svg viewBox="0 0 54 40" aria-hidden="true"><rect x="2" y="22" width="50" height="16" fill="#c9a36a"/><rect x="8" y="12" width="14" height="10" fill="#d8ccb0"/><path d="M6,12 L15,6 L24,12 Z" fill="#b4583b"/><rect x="30" y="16" width="16" height="6" fill="#d8ccb0"/><rect x="36" y="4" width="5" height="12" fill="#e8dfcc"/><circle cx="38.5" cy="3" r="2.2" fill="#ffb040"/></svg>':
   '<svg viewBox="0 0 54 40" aria-hidden="true"><path d="M2,38 L10,24 L22,20 L40,22 L52,38 Z" fill="#b9a27a"/><rect x="18" y="13" width="18" height="7" fill="#efe6d2"/><path d="M16,13 L27,8 L38,13 Z" fill="#d8ccb0"/><path d="M19,13 V20 M23,13 V20 M27,13 V20 M31,13 V20 M35,13 V20" stroke="#b8a888" stroke-width=".8"/></svg>';
  const d=document.createElement('div');d.id='ldShip';d.setAttribute('role','progressbar');d.setAttribute('aria-valuemin','0');d.setAttribute('aria-valuemax','100');d.setAttribute('aria-label','Carga del mundo');
  d.innerHTML=wave(0)+wave(1)+'<div class="ldPort">'+(R?'Ostia':'El Pireo')+port+'</div><div class="ldTrack"><div class="ldMove"><div class="ldBob">'+ldSvgShip()+'</div></div></div>';
  const box=document.createElement('div');box.id='ldBox';box.appendChild(d);const pc=document.createElement('div');pc.id='ldPct';box.appendChild(pc);document.body.appendChild(box);
  const n=document.createElement('div');n.id='ldNote';n.textContent=R?'Una corbita, el barco mercante romano de vela: llevaba grano, vino y aceite por todo el Mediterráneo hasta los puertos de Roma.'
   :'Una trirreme ateniense: unos 170 remeros en tres filas movían el barco; los ojos pintados en la proa «miraban» el camino.';
  box.appendChild(n);LD.el=d;LD.box=box;
}
function ldShipSet(p){
  LD.p=Math.max(LD.p,Math.min(1,p));if(!LD.el)return;
  LD.el.querySelector('.ldMove').style.transform='translateX('+(LD.p*100).toFixed(1)+'%)';LD.el.setAttribute('aria-valuenow',Math.round(LD.p*100));
  const t=LD.p<1?(MODE==='roma'?'Levantando Roma… ':'Levantando la ciudad… ')+Math.round(LD.p*100)+' %':(MODE==='roma'?'Roma está lista. ¡Bienvenido a puerto!':'La ciudad está lista. ¡Bienvenido a puerto!');
  $('ldPct').textContent=t;if(LD.p<1)$('loadmsg').textContent=t;
}
function ldShipDone(){if(!LD.el)return;LD.el.classList.add('done');const bx=LD.box,hide=()=>bx.classList.add('gone');document.addEventListener('pointerdown',hide,{once:true});document.addEventListener('keydown',hide,{once:true});setTimeout(hide,2600);setTimeout(()=>bx.remove(),3600);}
function ldShipFail(){if(LD.el){LD.el.classList.add('done');$('ldPct').textContent='Algo falló al construir la ciudad.';}}
function ldRun(steps,onErr,onDone){
  const key='nostos-carga-'+MODE;let prev={};try{prev=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){}
  const ids=steps.map((s,i)=>s[0]+'#'+i),w=ids.map((id,i)=>Math.max(0.1,prev[id]!=null?prev[id]/100:(LD_W[steps[i][0]]||0.3)));
  const tot=w.reduce((a,b)=>a+b,0);let i=0,acc=0;
  const go=()=>{const t0=performance.now();
    try{while(i<steps.length){const s=performance.now();steps[i][1]();LD.dur[ids[i]]=Math.round(performance.now()-s);acc+=w[i];i++;if(performance.now()-t0>90)break;}}
    catch(e){onErr(e);return;}
    ldShipSet(0.05+0.93*acc/tot);
    if(i<steps.length){setTimeout(go,0);return;}
    try{localStorage.setItem(key,JSON.stringify(LD.dur));}catch(e){}
    onDone();};
  setTimeout(go,0);
}
function bootWorld(){PROF.marks.push(['arranque',performance.now()]);ldShipShow();ldShipSet(0.02);setTimeout(()=>loadModels(()=>{PROF.marks.push(['modelos cargados',performance.now()]);ldShipSet(0.05);
  const steps=bwSteps().concat([
  ['sello',()=>{
  // three r128 descarta un InstancedMesh según la esfera de su geometría unitaria, en el origen: las columnas o tejas
  // repartidas por la ciudad desaparecían al mirar hacia otro lado. Las que no van por zonas se dibujan siempre.
  scene.traverse(o=>{if(o.isInstancedMesh&&!o.userData.chunk)o.frustumCulled=false;});
  SEALED=sealFootprints();}],
  ['buildHandTorch',()=>{buildHandTorch();}],
  ['buildSpheres',()=>{buildSpheres();}],
  ['mareShow',()=>{mareShow();}],
  ['buildDaedalus',()=>{buildDaedalus();}],
  ['buildConvs',()=>{buildConvs();}],
  ['buildCarters',()=>{buildCarters();}],
  ['buildMusas',()=>{buildMusas();}],
  ['buildCasa',()=>{buildCasa();}],
  ['buildTour',()=>{buildTour();}],
  ['buildBarco',()=>{buildBarco();}],
  ['buildBirds',()=>{buildBirds();}],
  ['buildFauna',()=>{buildFauna();}],
  ['romaTheatres2',()=>{if(MODE==='atenas')romaTheatres();}],
  ['vuSetup',()=>{vuSetup();}],
  ['ofSetup',()=>{ofSetup();}],
  ['mktSetup',()=>{mktSetup();}],
  ['egxSetup',()=>{egxSetup();}],
  ['m386Setup',()=>{m386Setup();}],
  ['farmSetup',()=>{farmSetup();}],
  ['farmOfferSetup',()=>{farmOfferSetup();}],
  ['delfosPlus',()=>{delfosPlus();}],
  ['termoPlus',()=>{termoPlus();}],
  ['atalSetup',()=>{atalSetup();}],
  ['finSetup',()=>{finSetup();}],
  ['artSetup',()=>{artSetup();}],
  ['urbSetup',()=>{urbSetup();}],
  ['ovidSetup',()=>{ovidSetup();}],
  ['progSetup',()=>{progSetup();}],
  ['vocSetup',()=>{vocSetup();}],
  ['jrSetup',()=>{jrSetup();}],
  ['tpSetup',()=>{tpSetup();TP_READY=true;}],
  ['v2Setup',()=>{v2VendorSetup();}],
  ['socSetup',()=>{socSetup();}],
  ['dioSetup',()=>{dioSetup();}],
  ['pitSetup',()=>{pitSetup();}],
  ['herSetup',()=>{herSetup();}],
  ['vegSnap',()=>{vegSnap();}],
  ['vmSetup',()=>{vmSetup();}],
  ['qcSetup',()=>{qcSetup();}],
  ['cvSetup',()=>{cvSetup();}],
  ['hdSetup',()=>{hdSetup();}],
  ['colSetup',()=>{colSetup();}],
  ['hbSetup',()=>{hbSetup();}],
  ['spSetup',()=>{spSetup();}],
  ['visSetup',()=>{visSetup();}],
  ['mtSetup',()=>{mtSetup();}],
  ['natSetup',()=>{natSetup();}],
  ['warSetup',()=>{warSetup();}],
  ['ttSetup',()=>{ttSetup();}],
  ['rdSetup',()=>{rdSetup();}],
  ['cySetup',()=>{cySetup();}],
  ['rcSetup',()=>{rcSetup();}],
  ['popSetup',()=>{popSetup();}],
  ['ambSetup',()=>{ambSetup();}],
  ['amb2Setup',()=>{amb2Setup();}],
  ['swSetup',()=>{swSetup();}],
  ['sw2Setup',()=>{sw2Setup();}],
  ['waterSetup',()=>{waterSetup();}],
  ['crtSetup',()=>{crtSetup();}],
  ['r5Setup',()=>{r5Setup();}],
  ['amSetup',()=>{amSetup();}],
  ['hecSetup',()=>{hecSetup();}],
  ['asSetup',()=>{asSetup();}],
  ['talSetup',()=>{talSetup();}],
  ['fxRostral',()=>{fxRostral();}],
  ['huntSetup',()=>{huntSetup();}],
  ['pvSetup',()=>{pvSetup();}],
  ['mgSetup',()=>{mgSetup();}],
  ['cpSetup',()=>{cpSetup();}],
  ['coSetup',()=>{coSetup();}],
  ['mfxSetup',()=>{mfxSetup();}],
  ['bpSetup',()=>{bpSetup();}]
  ]);
  ldRun(steps,err=>{console.error(err);ldShipFail();$('loadmsg').textContent='Algo falló al construir la ciudad: '+err.message;},()=>{
  PROF.marks.push(['mundo construido',performance.now()]);
  setTimeout(()=>{try{rfSetup();}catch(e){console.warn('rfSetup',e);}},1500);
  // marcadores ya completados
  npcObjs.forEach(n=>{n.mk.visible=!npcDone(n.data);});
  signObjs.forEach(s=>{if(state.places.includes(s.data.id))s.mk.visible=false;});
  {const p={x:player.x,z:player.z};resolve(p,0.35);player.x=p.x;player.z=p.z;}
  player.feet=floorAt(player.x,player.z);player.camY=player.feet+player.eye;
  curZone='agora';
  updateSky();
  PROF.marks.push(['listo',performance.now()]);$('go').disabled=false;$('goStory').disabled=false;$('goNet').disabled=false;$('loadmsg').textContent=(state.lessons.length||state.places.length)?'Tu progreso anterior se ha recuperado: '+state.lessons.length+' lecciones y '+state.places.length+' lugares.':'La ciudad está lista.';
  if(hot&&hot.data&&hot.data.state)startGame();
  ldShipSet(1);ldShipDone();
  requestAnimationFrame(frame);
  });
}),30);}
// selector de época: tarjetas en pantalla, o ?modo=roma|atenas en la dirección
function chooseMode(m){
  MODE=m;if(m==='roma')romaSetup();
  $('modes').hidden=true;$('start').hidden=false;
  // datos de esta época: los modelos y el relieve se esperan (sin ellos no se construye el mundo); los personajes se adelantan
  for(const k of(BP_MODE[m]||[]))datoGet('glbpj_'+k);
  const lm=$('loadmsg');if(lm)lm.textContent='Cargando modelos y relieve…';
  // dos fotogramas antes de construir: la animación del texto de la presentación tiene que llegar al compositor (si no, con los datos ya en
  // la caché del modo sin conexión, la construcción empieza en el acto, bloquea la página y el texto se queda quieto hasta el final)
  const frames=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(r,60))));
  Promise.all(['glb','glb2','demdata_'+m].map(datoGet)).then(frames).then(bootWorld);
}
document.querySelectorAll('.mcard').forEach(b=>b.onclick=()=>chooseMode(b.dataset.mode));
{const qm=new URLSearchParams(location.search).get('modo');if(qm==='roma'||qm==='atenas')chooseMode(qm);else setTimeout(()=>{const b=document.querySelector('.mcard');b&&b.focus();},50);}
// para las pruebas automáticas: abrir con #debug expone el estado interno
if(location.hash==="#debug")window.__d={RFX:()=>({RF,rfSurf,rfFloor,footprints,rfSetup,BOAT,CARVE,PLACES,MOUNT,callHorse,horseNear,camera,cityShow,cityHere,CITYB,RSW,TIBER,SC:scene,terrainH,terrainH0,makePerson,personWalk,personKnees,lrnSummary,lrnConcepts,lrnTimeline,lrnRouteStart,lrnRouteMenu,ACC,openDialog,NPCS,LESSONS,accMenu,lrnZ,AM,amTalk,amAmb,amPlay,amz,amCap,amLeft,amLock,AM_TOPICS,amEpisode,amSpot,epiStart,EPI,TP_OBJS,hecAct,spAct,ambAct,dzz,dzReport,dzCivic,dzCivicTick,dzExplored,DZ,dzUnderRoof,phCaption,renderOpts,sail,drawMap,openMap,asOpen,asStep,asz,AS_ISSUES,talOpen,talGame,ttz2,ptz,PT,ptText,ptSurvey,ptBrief,dzDownload,GR,grCell,grTick,OB,obz,obStart,obStage,obRoute,obTick,tutStart,GLB,glbPart,accSpeak,vzProfile,ICACHE:()=>ICACHE,terrainH,mvOpen,mfxScan,MFXR:()=>MFX,PTEXR:()=>PTEX,TLODR:()=>TLOD,RLVR:()=>RLV,BPR:()=>BP,bpMake,MVWR:()=>MVW,makePersonF:c=>c.animal?animal(c.animal).g:makePerson(c),exEnc,exDec,exStart,exOpen,exStat,exCreate,qzOpen,qzQuestions,capSay,a11yApply,gmRightF:d=>gmRight(d),ACCR:()=>ACC,clockR:()=>clock,answerF:ok=>answer(ok),coz,coinGive,coinRandom,coinAlbum,coinShop,cuadOpen,cuadTick,cuz,dogAdopt,dogTick,DOG,THF,athOpen,athRun,debOpen,teaOpen,cpz,tabRecognize,TAB_L:()=>TAB_L,mgPotter,mgSmith,mgBaker,mgCopy,tabOpen,cocOpen,walkersR:()=>walkers,pvFine,keysR:()=>keys,GFR:()=>GF,DYN,AGL,agTick,clProbe,thfSpawn,thfTick,circStart,circTick,runStart,fireStart,fireTick,taliOpen,huntAct,huntTick,dynz,dynNightTick,interactF:()=>interact(),toast:h=>toast(h),meshH:(x,z)=>meshH(x,z),INT,termTick,termz,NET:()=>NET,coopStatus,coopOpen,coopTick,cqz,asEndF:(I,v)=>asEnd(I,v,v),AS_ISSUES2:()=>AS_ISSUES,VT,vtProbe,vtGo,vtNear,vtTick,resolveP:q=>resolve(q,0.35),ATR:()=>ATR,tryMove,isFree,INNER:()=>INNER,openLibrary,uiNow:()=>ui,showArticle:id=>showArticle(id),fiBuild,fiList,FI_AUTH:()=>FI_AUTH,rvDue,rvOpen,rvz,renderOpts:()=>renderOpts(),dlgSet:n=>{openDialog(n);},atC:()=>atCands(),TURN,turnTick,npcObjs:()=>npcObjs,openDialog,pl:()=>player,pdOpen,pdData,pdParse,PD,pdRender,honScore,honRank,honPage,honz,honCheck,honParts}),PROF:()=>PROF,get TORCH(){return TORCH;},herz:()=>herz(),HRC:()=>HRC,herAct:a=>herAct({act:a}),herDuel:()=>herDuel(),pitz:()=>pitz(),PIT:()=>PIT,pitAct:a=>pitAct({act:a}),pitDuel:()=>pitDuel(),dioz:()=>dioz(),DIO:()=>DIO,dioAct:a=>dioAct({act:a}),dioDuel:()=>dioDuel(),socz:()=>socz(),SOC:()=>SOC,socAct:a=>socAct({act:a}),socDuel:()=>socDuel(),SUELO:()=>SUELO,PEOPLE:()=>PEOPLE,groundY:(x,z)=>groundY(x,z),meshH:(x,z)=>meshH(x,z),toggleTorch:()=>toggleTorch(),GD:()=>GD,vegSnap:()=>vegSnap(),RUT:()=>RUT,rutTick:t=>rutTick(t),zsT:()=>{initAudio();const r=[AUD.ctx&&AUD.ctx.state,aOK()];sfxPhrase(0.3,0.02);sfxClang(0.05);sfxKnock(0.05);zsTick(0.3);return r.concat([!!RUT.wat]);},VIV:()=>VIV,W:()=>walkers,v2C:t=>v2Circles(t),v2Act:o=>v2Act(o),v2Sit:()=>v2Sit(),EGXO:()=>EGX_OBJS,REN:()=>renderer,CHK:()=>CHUNKS,CULL:()=>CULL,MERGE:()=>MERGE,mgSize:()=>{const L=[];for(const g of scene.children){if(g.isMesh||g.isLight||g.userData.chunk)continue;if(Math.hypot(g.position.x-camera.position.x,g.position.z-camera.position.z)>500)continue;if(!mgOk(g))continue;let n=0,v=0;g.traverse(m=>{if(mgEligible(m)){n++;v+=m.geometry.attributes.position.count;}});L.push([n,v,Math.round(g.position.x),Math.round(g.position.z)]);}L.sort((a,b)=>b[1]-a[1]);return {grupos:L.length,mallas:L.reduce((a,b)=>a+b[0],0),vert:L.reduce((a,b)=>a+b[1],0),top:L.slice(0,8)};},mgDiag:()=>{const R={grupos:0,gruposNo:0,motivoGrupo:{},mallas:0,ok:0,motivo:{}};const add=(o,k)=>{o[k]=(o[k]||0)+1;};
  for(const g of scene.children){if(g.isMesh||g.isLight||g.userData.chunk)continue;if(Math.hypot(g.position.x-camera.position.x,g.position.z-camera.position.z)>500)continue;R.grupos++;
   let why=null,n=0;g.traverse(o=>{if(o.isLight)why='luz';else if(o.userData&&(o.userData.arms||o.userData.legs))why=why||'persona';if(o.isMesh&&!o.isInstancedMesh)n++;});if(n<8)why=why||'pocas';if(why){add(R.motivoGrupo,why);continue;}
   g.traverse(m=>{if(!m.isMesh||m.isInstancedMesh)return;R.mallas++;let w=null;if(!m.visible)w='oculta';else if(m.name)w='nombre';else if(Array.isArray(m.material))w='multimaterial';else if(Object.keys(m.userData).length)w='userData';else{const t=m.material;if(t.transparent)w='transparente';else if(t.type==='MeshBasicMaterial')w='basic';else if(t.type==='ShaderMaterial')w='shader';else if(t.emissive&&t.emissive.getHex()>0)w='emisivo';else{const G=m.geometry;if(Object.values(G.attributes).some(a=>a.isInterleavedBufferAttribute))w='interleaved';else if(G.groups&&G.groups.length>1)w='grupos';}}
     if(w)add(R.motivo,w);else R.ok++;});}
  return R;},mergeAll:(max)=>{let n=0;for(const o of [...scene.children]){if(max&&n>=max)break;if(Math.hypot(o.position.x-camera.position.x,o.position.z-camera.position.z)>500)continue;if(o.isMesh||o.isLight||MERGE.done.has(o)||o.userData.chunk)continue;MERGE.done.add(o);if(!mgOk(o))continue;try{MERGE.saved+=mgGroup(o);n++;}catch(e){}}return [n,MERGE.saved];},cullAll:on=>cullAll(on),cullNow:()=>{while(cullRegister(5000,true));cullEval();return CULL.reg.length;},TP:()=>TP_OBJS,tpAct:o=>tpAct(o),CRT:()=>CRT,SXR:()=>STORY_EXTRA_ROMA,storyFinale:()=>storyFinale(),storyResume:f=>storyResume(f),AUD3:()=>({footprints,isFree:(x,z,r)=>isFree(x,z,r),NPC_POS,PORTS,GATES_W}),r5z:()=>r5z(),R5:()=>R5,r5Vis:()=>r5Vis(),GW:()=>GATES_W,gateT:g=>gateTravel(g),r3:a=>r3Act({act:"r3:"+a}),isl3:a=>isl3Act({act:"isl3:"+a}),setH:h=>{clock.h=h;},ISL:()=>ISLANDS,PORTSd:()=>PORTS,floorAt:(x,z)=>floorAt(x,z),CAV2:()=>CAVEAS,ARV:()=>ARV,CRX:()=>CRX,mnVision,crAct,LAU:()=>LAU,PS:()=>PS,psTick,sfxAulos,sfxLechuza,psNearPlace,PS_TEMPLE,SIT:()=>SIT,personPose,sitShade,sitBuild,sitLowT:sitLow,kneelOrSit,ILR:()=>ILR,ilionRoad,capLvl,capOk,capNo,viaje,viajeHTML,capTick,arvBlock,arvTick,BV:()=>BV,atCands:()=>atCands(),RU:()=>RU,ruBuild,ruAct,MEM:()=>({log:memz(),fama:memFama()}),memSay,memGreet,memTick,needTick,famTick,setH:h=>{clock.h=h;},FAM:()=>FAM,famForm,NEED:()=>NEED,stFeats:()=>{const c={};for(const w of walkers)for(const k of (w.g&&w.g.userData.feat)||[])c[k]=(c[k]||0)+1;for(const o of npcObjs)for(const k of (o.g&&o.g.userData.feat)||[])c['npc '+k]=(c['npc '+k]||0)+1;return c;},bvAllN:()=>{for(const o of npcObjs)if(o.bv===undefined&&o.g)bvNpc(o);},bvAll:()=>{for(const w of walkers)if(w.bv===undefined&&w.g)bvWalker(w);},BVW:()=>walkers.map(w=>[w.g.userData.bt||'',w.g.userData.gait||'',w.g.userData.post||'']),GZ:()=>GZ,gzLook,gzBolt,gzTone,gzExpr,gzBrows,profReport:n=>profReport(n),profReset:()=>profReset(),gsTest:(i,n)=>{const o=npcObjs.filter(o=>!o.hidden&&!o.g.userData.pose)[i];const gs=gsRig(o.g);gsSet(gs,n,1);for(let k=0;k<40;k++)gsApply(o.g,gs,0.05);return [o.x,o.z,o.g.rotation.y,o.data.name,gs.fore?gs.fore.map(f=>!!f).join(','):'sin codo'];},WOB:()=>WOB,gfSeal:(a,b)=>gfSeal(a,b),ATR:()=>ATR,atCandsN:()=>{const t=performance.now();const n=atCands().length;return [n,performance.now()-t];},atGround:()=>atGround(),WFA:()=>WFA,WSP:()=>WSP,wMake:k=>wMake(k),FOREST_ON:()=>FOREST_ON,FORK:()=>FOR,NAT2:()=>NAT2,n2Place:k=>n2Place(k),n2Tick:dt=>n2Tick(dt),TOAST:h=>toast(h),TLK:()=>TLK,regionName:()=>regionName(),crtW:(i,x,z)=>crtW(i,x,z),crtAct:a=>crtAct({act:"crt:"+a}),crtTickF:dt=>crtTick(dt),SWNAV:()=>SWNAV,navTargets:()=>navTargets(),navTick:dt=>navTick(dt),AUDX:()=>({AUD,GFA,WXS,AMB,CY:typeof CY!=='undefined'?CY:null}),sw2Afro:()=>sw2Afro(),sw2AfTake:k=>sw2AfTake(k),SWAF:()=>SWAF,sw2OrbTickF:dt=>sw2OrbTick(dt),sw2TickF:dt=>sw2Tick(dt),SWORB:()=>SWORB,SW2:()=>SW2,sw2z:()=>sw2z(),swPeriplo:()=>swPeriplo(),swShortcut:()=>swShortcut(),sw2RollEnc:s=>sw2RollEnc(s),sw2EncTalk:()=>sw2EncTalk(),sw2ShipTalk:S=>sw2ShipTalk(S),SW:()=>SW,swz:()=>swz(),swBoard:()=>swBoard(),swEnterSeg:(a,b,c)=>swEnterSeg(a,b,c),swLand:i=>swLand(i),swAction:()=>swAction(),swE:()=>swE(),swAct:o=>swAct(o),swMoorOf:i=>swMoorOf(i),LD:()=>LD,ldDemo:p=>{LD.el=null;LD.p=0;ldShipShow();ldShipSet(p);},RWQ:()=>({AMB2,amb2Setup,ATGset:c=>atGlowSet(c),AMB,ambz,ambAct,ambSetup,vestz,vestMenu,VEST,vestWear,pjAvatar:()=>pjAvatar(),atShow:o=>atShow(o),ATG,POP,popAct,SEAL2,seal2Run,seal2Cands,seal2Profile,seal2Covered,seal2Near,cgrid,eduz,ACC,LOGROS,eduCodex,eduTrade,trPrice,RCX,rcAct,rcz,OBJ,objZurron,hbBar,hbAddCnt,hbCnt,objContext,CY,cyAct,RD,rdAct,TT_LIST,TT_SC,TT,ttStart,ttAct,ttClick,warAct,EPISODES,epiStart,epiBeat,epiEnd,NAT_APP,NAT,natAct,CLB,clbz,mtz,mtAsk,mtGoal,MTR,mtAct,RF,rfSetup,rfSurf,rfFloor,uxz,AVATAR,FLY,wxz,wxChange,WXS,wxCycle,GFX,gfxSet,aoSet,DOF,VIS,HBAR,hbSelect,hbUse,spz,SPC,keys,PH,phToggle,phShot,displayH:(x,z)=>displayH(x,z),ROADS,COLX,colAct,colEntrar,ROMA,reliefObjs,openRelief,reliefAnswer,cam:()=>camera,AT,atPick,atShow,atCardShow,atCands,infAct:o=>infAct(o),HD,hdz,hdAct,hdBuild,hdIn,cvSteps,cvPanel,cvServ,cvPetA,cvJuicio,cvAnona,cvVet,cvTick,fxz,cz,QC,qcz,qcGo,qcBack,qcIn,vmz,vmPanDaysTo,calNow,ACA,acaz,acaStart,acaMap,acaKnows,JR,jrTick,clock,horaRomana,VOC,VOCAB,vocz,vocToggle,vocWalk,MOUNT,HORBS,hz,horseXP:()=>horseXP(),rwDiscover,horbSpawn}),QA:()=>({PLACES,signObjs,readSign,godObjs,openGod,EPI,EPISODES,epiStart,epiEnd,ISLANDS,npcObjs,EGX_OBJS,ESSAYS,openLibrary,startStory,storyFire,curStoryStep,STORY,gmOpen,gmClose,openMap,closeDialog,NPCS,captains,MUSE_OBJS,museTalk,renderOpts,MODE,state,player,floorAt,terrainH,regionName,islandOf,islandBase,islandH,sqMount,RELIEF,regionSquare,bpMake,bpVary,STB,FV_TYPES,BP,bpStatue,bpGunzip,NPB,MED_POS,MED_POS_RO,BPH,PLH,TLOD,ARCH,AQ,LF,ENTD,TALLERES,tlRun,PROC,toast,todayEvent,festNextDay,FESTS,dzReport,readSign,signObjs,clock,EVC,bpCrowds,QA,OFIC,HELD,hbSelect,BPH,BP,bphSet,FG,fgz,fgHas,fgPanel,fgCount,AB,GD,abTBIms,INT2,int2Enter,int2Leave,int2Room,HM,hmz,hmTalk,hmStart,hmEnd,HM_M,RK,rkSlope,rkCliffs,SOL,solHoy,solCalc,LEY,leyStart,leyAddHead,leyShoot,leyTick,INT2,SU,TERR_U,PTEX,LEG,legTick,LEY_SH,RU,JM,JM_EV,jmz,jmNewDay,jmHaggle,mgMint,mgPress,jmFotoCheck,GQ,gqStarPos,gqApply,K2,kz,kjStart,kcStart,koOpen,korStart,kdbOpen,kdOpen,krOpen,kExPct,WG2,w2Interior}),OVID,OVID_OBJS,ovz,ovidAct,ovidCatalog,SC:()=>scene,TI:()=>terrainInner,terrainH,floorAt,rawH,SEA_:()=>SEA,placeXZ:id=>{const p=PLACES.find(q=>q.id===id);return p?[p.x,p.z]:null;},URB,PIR0,pirP,PIR_BAYS,ATH_DEMES,GATES,artz,artAct,artHouse,ART,CASA,dreamCount,dreamCheck,dreamFinale,dreamTick,EPI,epiReward,finz,FZ,RACE,race3d,gorgiasAct,juicioAct,eleusisAct,sibilaAct,decretoAct,coliseoAct,finAct,telBuild,infBuild,fzPut,egxAct,MG,atalAct,atz,MG_ATAL,MG_CAMILA,mgOpen,ATAL,cavEnter,cavz,somz,cavAct,CAV,cavIn,comModeT:()=>{comMode();return comPrice;},qualGreet,qLv,qAdd,fPrice,fMax,klBonus,startQuiz,openDialog,getS:()=>state,getW:()=>walkers,getP:()=>player,getNPCS:()=>NPCS,setUi:v=>{ui=v;},oracAct,gmOpen,gmClose,GM,qz,ESSAYS,nbs,nbz,nbTalk,frurNow,frur,FARM,farmz,farmAct,farmerTalk,farmOffer,farmDay,circPt,circS,MG_CIRCO,MG_MISENO,STORY_ROMA,COM_EV,COM,gfSurface,gfInCity,footprints,foamTick,seaY:()=>SEA?SEA.position.y:null,GF,animalsReact,GLB,DOVES,MARKS,PFX,WIND,TW,FAUNA2:()=>FAUNA,mareCine,CINE,hz,DUST,dogTalk,storyResume,storyFire,curStoryStep,regionOf,m386z,COM,comPrice,MG,MG_SAL,MG_ESF,mgOpen,mgStart,M386,ORIG,FX_COINS,STORY_ATENAS,EGX_OBJS,egxAct,jeroSigns,EGF,PYR,EGX,ROMA,RPERF,clock,VU_SCENES,OFIC,MKT,MKTC:()=>{const e=todayEvent();const q=e&&e.at();return q||{x:0,z:0};},vuAct,CULT_OBJS,cultoAct,FAUNA,faunaTalk,animal,ARIS,arisMove,personWalk,walkers,makePerson,CARVE,BOAT,boatEnter,boatExit,riverWater,carveH,gridH,addRiver,VIDA,CROP,cropSeason,GLB,CHUNKS,BARCO,bz,barcoWright,barcoMat,barcoMio,MOON,buildMoon,moonVoyage,moonAct,moonBack,fareOf:(a,b,l)=>fareOf(a,b,l),TOUR,tourTalk,tourNext,tourEnd,openDialog,pjDlg,pjText,pjz,AVATAR,profeOpen,profeClose,profeDests,profeGo,CASA,cz,casaAgentTalk,hogarAct,casaTravel,bestFriend,closeDialog,calNow,horasTalk,TERR_MATS,get sealed(){return SEALED;},MUSE_OBJS,OLYM,museTalk,mnemoTalk,olyGateTalk,zeusTalk,olyTravel,muz,GODS,CARTERS,carterTalk,horseNameDlg,CVG,FESTS,festOfDay,festDialog,FEST_ACT,evCrowd,todayEvent,TUT,tutStart,tryMove,npcObjs,INNER,isFree,dz,discMenu,debateMenu,MASTERS,rivalOf,renderOpts,qz,qLv,qAdd,fz,friendMenu,FRIENDS,openJournal,DAED,wz,daedalusTalk,FLY,toggleWings,FEATHERS,KNOS,knossosTravel,keys,hz,horseQuest,horseXP,HORBS,callHorse,mountHorse,MOUNT,ROMA_BODA,addHours,newDay,startStory,storyFire,curStoryStep,storyTarget,storyActors:()=>storyActors,NET,GATES_W,gateTravel,regionOf,captains,ISLANDS,openSphere,readSign,signObjs,minotaurEncounter,stageKit,epiTick,EPI,EPISODES,epiStart,epiBeat,epiEnd,KNOS,knossosTravel,updateSky,SEAG,seaStart,seaEnd,TORCH,cgrid,CELL,resolve,footprints,floorAt,terrainH,ROMA,ROADS,footprints,updateRome,findFocus,sail,PORTS,dreamTravel,DREAM,AI,aiChat,player,MOUNT,godObjs,GODS,GLB,get state(){return state;},get mode(){return MODE;},AVATAR,CHUNKS,clock,scene,camera,renderer,keys,openGod,callHorse,openDialog,NPCS,PLACES,startGame,get ui(){return ui;},platforms,INNER,get terrainInner(){return terrainInner;},minGround,displayH,makePerson};
})();
