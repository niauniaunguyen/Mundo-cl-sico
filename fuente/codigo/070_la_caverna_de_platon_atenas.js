// ============================================================ LA CAVERNA DE PLATÓN (Atenas) Y EL SUEÑO DE ESCIPIÓN (Roma)
// Recompensa final de la Sophía/Sapientia. Atenas: República VII 514a-521b, recorrida según los grados de la «línea dividida» (VI 509d-511e).
// Roma: Cicerón, República VI 9-29 (el Sueño de Escipión). Los dos son licencias del juego, y así se dice.
const CAV={built:false,X:0,Z:0,Y:4200,ovr:false,bear:[],shad:[],solids:[],rings:[],fire:null,light:null,blind:null,emerged:false};
function cavz(){if(!state.cav||typeof state.cav!=='object')state.cav={st:0,forms:{},ref:0,meno:0,done:0,visits:0};return state.cav;}
function somz(){if(!state.som||typeof state.som!=='object')state.som={seen:{},done:0};return state.som;}
const CAV_FORMS={caballo:'El Caballo',arbol:'El Árbol',templo:'Lo Bello',solidos:'Los cinco sólidos',ciudad:'La ciudad justa',lete:'La llanura del Olvido'};
const cavL=(lx,lz)=>[CAV.X+lx,CAV.Z+lz];
// ---- requisitos
function cavReq(){const ro=MODE==='roma',d=dz(),lack=[];
  if(qLv('so')<10)lack.push((ro?'Sapientia':'Sophía')+' 10 (tienes '+qLv('so')+')');
  if(ro){if(fz('epicteto').p<100)lack.push('amistad íntima con Epicteto (afinidad '+fz('epicteto').p+'/100)');if(!d.grad.includes('musonio')&&!d.grad.includes('epicteto'))lack.push('terminar como discípulo la escuela de Musonio Rufo o la de Epicteto');}
  else{if(fz('platon').p<100)lack.push('amistad íntima con Platón (afinidad '+fz('platon').p+'/100)');if(!d.grad.includes('platon'))lack.push('terminar como discípulo la Academia de Platón');}
  return lack;}
// ---- utilidades de construcción
const cavSp=(col,sx,sy,op,par,x,y,z)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:HALO_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:op,fog:false,color:col}));s.scale.set(sx,sy,1);s.position.set(x||0,y||0,z||0);(par||scene).add(s);return s;};
// siluetas: personas, caballo, templo, ánfora, árbol, perro (la misma forma sirve para la figura del porteador y para su sombra)
function cavShape(kind,mat){const g=new THREE.Group(),b=(w,h,d,x,y,z,rz)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);if(rz)m.rotation.z=rz;g.add(m);return m;};
  if(kind==='persona'){const h=new THREE.Mesh(new THREE.SphereGeometry(0.14,10,8),mat);h.position.y=1.62;g.add(h);b(0.46,0.75,0.12,0,1.12,0);b(0.56,0.5,0.12,0,0.55,0);b(0.12,0.55,0.12,-0.3,1.1,0,0.25);b(0.12,0.55,0.12,0.3,1.1,0,-0.25);b(0.13,0.3,0.12,-0.12,0.15,0);b(0.13,0.3,0.12,0.12,0.15,0);}
  else if(kind==='caballo'){b(1.3,0.5,0.12,0,1.0,0);b(0.25,0.7,0.12,0.72,1.35,0,-0.5);b(0.45,0.2,0.12,0.98,1.62,0,-0.3);for(const x of[-0.5,-0.35,0.4,0.55])b(0.1,0.75,0.12,x,0.4,0);b(0.1,0.5,0.12,-0.75,1.0,0,0.6);}
  else if(kind==='templo'){b(1.8,0.12,0.12,0,0.06,0);for(let i=0;i<6;i++)b(0.09,1.0,0.12,-0.75+i*0.3,0.62,0);b(1.8,0.14,0.12,0,1.19,0);const t=new THREE.Mesh(new THREE.CylinderGeometry(0,1.0,0.4,3,1),mat);t.rotation.z=Math.PI/2;t.rotation.y=Math.PI/2;t.scale.set(1,1,0.12);t.position.y=1.45;const tg=new THREE.Mesh(new THREE.BoxGeometry(1.9,0.01,0.12),mat);g.add(t);void tg;}
  else if(kind==='anfora'){const a=new THREE.Mesh(new THREE.SphereGeometry(0.35,10,8),mat);a.scale.set(1,1.4,0.3);a.position.y=0.6;g.add(a);b(0.14,0.35,0.12,0,1.15,0);b(0.06,0.3,0.12,-0.2,1.05,0,0.4);b(0.06,0.3,0.12,0.2,1.05,0,-0.4);}
  else if(kind==='arbol'){b(0.14,0.8,0.12,0,0.4,0);const c=new THREE.Mesh(new THREE.SphereGeometry(0.55,10,8),mat);c.scale.set(1,0.9,0.2);c.position.y=1.15;g.add(c);}
  else if(kind==='perro'){b(0.7,0.28,0.12,0,0.5,0);b(0.26,0.22,0.12,0.45,0.72,0);for(const x of[-0.25,0.25])b(0.08,0.36,0.12,x,0.18,0);b(0.06,0.3,0.12,-0.4,0.66,0,0.8);}
  return g;}
// ---- Atenas: la caverna
function buildCave(){if(CAV.built)return;CAV.built=true;CAV.X=9500;CAV.Z=-3000;const X=CAV.X,Z=CAV.Z,Y=CAV.Y;
  const rock=lam('#4a3d33'),rock2=lam('#5a4a3c'),dark=lam('#2c241e'),stone=lam('#b8a990'),g=grp(X,Y,Z,0);
  // la sala: suelo, pared del fondo (donde se proyectan las sombras), paredes y techo
  box(26,0.4,40,dark,0,-0.2,-15,g);addPlat(X,Z-15,26,40,0,Y);
  CAV.wallM=new THREE.MeshLambertMaterial({color:'#9a7a58',emissive:'#4a2c14'});box(26,12,0.8,CAV.wallM,0,6,-34.6,g);box(0.8,12,40,rock,-13.4,6,-15,g);box(0.8,12,40,rock,13.4,6,-15,g);box(27.6,0.8,41,rock,0,12.4,-15,g);
  box(11,12,0.8,rock,-7.5,6,5.4,g);box(11,12,0.8,rock,7.5,6,5.4,g);box(4,6,0.8,rock,0,9,5.4,g);
  for(const[a,b,c,d]of[[-13,-34.2,13,-34.2],[-13,-34.2,-13,5],[13,-34.2,13,5],[-13,5,-2,5],[2,5,13,5]])addSeg(X+a,Z+b,X+c,Z+d,0.4);
  for(let i=0;i<14;i++){const s=box(rr(1,2.5),rr(1.5,4),rr(1,2.5),rock2,(R()<0.5?-1:1)*rr(10.5,12.5),rr(0.6,2),rr(-32,3),g);s.rotation.y=R()*3;}
  // los prisioneros, encadenados desde niños, «sentados» tras un poyo de piedra y mirando a la pared
  box(17,0.7,0.6,stone,0,0.35,-20.4,g);box(17,0.1,0.1,lam('#2a2a2a'),0,1.5,-23.2,g);
  CAV.pris=[];for(const lx of[-7.5,-4.5,-1.6,1.6,4.5,7.5]){const p=makePerson({chiton:pick(['#6a5a48','#5a4c3e','#7a6650']),hair:'#2a1e16',beard:R()<0.6});p.position.set(X+lx,Y-0.55,Z-22);p.rotation.y=Math.PI;scene.add(p);CAV.pris.push(p);
    const ch=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,1.3,5),lam('#3a3a3a'));ch.position.set(X+lx,Y+1.5,Z-22.6);ch.rotation.x=Math.PI/2;scene.add(ch);}
  addSeg(X-8.5,Z-20.4,X+8.5,Z-20.4,0.35);
  // el murete y el camino de los porteadores, y el fuego detrás
  box(18,1.8,0.4,stone,0,0.9,-12,g);addSeg(X-9,Z-12,X+9,Z-12,0.3);
  const shM=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.82,depthWrite:false});
  const met=NPCS.filter(n=>state.seen&&state.seen['m:'+n.id]&&n.id!=='platon').slice(0,3).map(n=>n.name);CAV.names=met;
  const kinds=[['persona',met[0]||'un hombre'],['caballo',hz().own?horseName():'un caballo'],['templo','un templo'],['persona',met[1]||'una mujer'],['anfora','un ánfora'],['arbol','un olivo'],['perro','un perro'],['persona',met[2]||'un sabio']];
  CAV.bear=[];CAV.shad=[];kinds.forEach(([k,nm],i)=>{const b=makePerson({chiton:'#5a4a3a',hair:'#1e1610'});b.position.set(X,Y,Z-9);b.rotation.y=Math.PI/2;scene.add(b);
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,1.4,5),lam('#6a5038'));pole.position.set(0,2.4,0.35);b.add(pole);const fig=cavShape(k,stone);fig.scale.setScalar(0.5);fig.position.set(0,3.05,0.35);fig.rotation.y=-Math.PI/2;b.add(fig);
    const sh=cavShape(k,shM);sh.scale.set(2.4,2.4,0.05);sh.position.set(X,Y+3.2,Z-34.1);scene.add(sh);
    CAV.bear.push({g:b,ph:i/kinds.length,nm});CAV.shad.push(sh);});
  // el fuego
  for(let i=0;i<5;i++){const l=box(1.6,0.2,0.2,lam('#3a2414'),0,0.15,-4,g);l.rotation.y=i*0.63;}
  CAV.fire=cavSp('#ffb050',3.2,4.2,1,g,0,1.6,-4);CAV.fire2=cavSp('#ff7020',5,6,0.6,g,0,1.4,-4);addCirc(X,Z-4,1.3);
  CAV.light=new THREE.PointLight(0xff9a50,0,46,1.6);CAV.light.position.set(X,Y+2.4,Z-4);scene.add(CAV.light);
  // la subida: una cuesta áspera y empinada (515e), en escalones, hacia la luz
  for(let k=0;k<60;k++){const lz=5+k*1.5+0.75,h=0.5*(k+1);box(4.4,h,1.5,k%2?rock:rock2,0,h/2,lz,g);addPlat(X,Z+lz,4.4,1.5,0,Y+h);
    box(0.8,6,1.5,rock,-2.6,h+2,lz,g);box(0.8,6,1.5,rock,2.6,h+2,lz,g);if(k<44)box(6,0.8,1.5,rock,0,h+5.4,lz,g);}
  addSeg(X-2.2,Z+5,X-2.2,Z+95,0.3);addSeg(X+2.2,Z+5,X+2.2,Z+95,0.3);
  // fuera: un prado con olivos, un estanque y un dibujo en la arena
  const T=Y+30,grass=lam('#8aa860'),mC=[0,175];box(170,1,170,grass,0,29.5,180.5,g);addPlat(X,Z+180.5,170,170,0,T);
  {const d=new THREE.Mesh(new THREE.CircleGeometry(420,40),lam('#7f9e58'));d.rotation.x=-Math.PI/2;d.position.set(0,29.4,175);g.add(d);}
  for(let i=0;i<24;i++){const a=i/24*TAU;if(Math.sin(a+TAU/48)<-0.95)continue;addSeg(X+Math.cos(a)*78,Z+175+Math.sin(a)*78,X+Math.cos(a+TAU/24)*78,Z+175+Math.sin(a+TAU/24)*78,0.4);}
  for(let i=0;i<10;i++)box(rr(3,6),rr(3,9),rr(3,6),rock2,(i%2?-1:1)*rr(5.5,14),30+rr(1,4),rr(93,104),g);
  for(let i=0;i<26;i++){const a=R()*TAU,d=rr(30,75),x=Math.cos(a)*d,z=175+Math.sin(a)*d;if(Math.abs(x)<8&&z<130)continue;const tr=grp(X+x,T,Z+z,R()*3);box(0.4,2.4,0.4,lam('#6a5236'),0,1.2,0,tr);const c=new THREE.Mesh(new THREE.SphereGeometry(1.8,8,6),lam('#6f8a52'));c.position.y=3;c.scale.y=0.75;tr.add(c);addCirc(X+x,Z+z,0.4);}
  {const w=new THREE.Mesh(new THREE.CircleGeometry(7,28),new THREE.MeshPhongMaterial({color:'#6a8fae',shininess:90,specular:'#ffffff',transparent:true,opacity:0.92}));w.rotation.x=-Math.PI/2;w.position.set(-18,30.05,130);g.add(w);
   const rf=cavShape('arbol',new THREE.MeshBasicMaterial({color:'#4a6a5a',transparent:true,opacity:0.45,depthWrite:false}));rf.scale.set(2.6,-2.6,8);rf.rotation.x=-Math.PI/2*0;rf.position.set(-18,30.1,128);rf.rotation.x=Math.PI/2;g.add(rf);}
  {const ln=lam('#5a4630');for(const[w,d,x,z,ry]of[[4,0.08,0,-2,0],[4,0.08,0,2,0],[0.08,4,-2,0,0],[0.08,4,2,0,0],[5.66,0.08,0,0,Math.PI/4]]){const m=box(w,0.03,d,ln,18+x,30.02,130+z,g);m.rotation.y=ry;}}
  // la puerta de la luz y el mundo de las Ideas, más arriba
  {const gp=grp(X,T,Z+205,0);box(1,7,1,lam('#f4efe4'),-3,3.5,0,gp);box(1,7,1,lam('#f4efe4'),3,3.5,0,gp);box(7,0.8,1,lam('#f4efe4'),0,7.4,0,gp);CAV.gateGlow=cavSp('#fff6d0',6,8,0.25,gp,0,3.5,0);}
  const n0=scene.children.length,gn0=g.children.length;
  const IY=Y+60,iz=420,wM=lam('#fbf8f0'),gold=lam('#e8c868');box(130,1,130,wM,0,59.5,iz,g);addPlat(X,Z+iz,130,130,0,IY);
  for(const[a,b,c,d]of[[-60,iz-60,60,iz-60],[60,iz-60,60,iz+60],[60,iz+60,-60,iz+60],[-60,iz+60,-60,iz-60]])addSeg(X+a,Z+b,X+c,Z+d,0.4);
  {const d=new THREE.Mesh(new THREE.CircleGeometry(600,40),new THREE.MeshBasicMaterial({color:'#fffdf6'}));d.rotation.x=-Math.PI/2;d.position.set(0,59.3,iz);g.add(d);}
  // el Caballo: proporciones perfectas, sin una mancha
  {const h=grp(X-28,IY,Z+iz-12,Math.PI/2),m=wM;box(2.2,0.9,0.8,m,0,1.6,0,h);box(0.4,1.1,0.5,m,1.15,2.25,0,h).rotation.z=-0.5;box(0.8,0.4,0.4,m,1.6,2.7,0,h);for(const[x,z]of[[-0.8,-0.3],[-0.8,0.3],[0.8,-0.3],[0.8,0.3]])box(0.2,1.2,0.2,m,x,0.6,z,h);box(0.15,0.9,0.15,gold,-1.2,1.5,0,h).rotation.z=0.6;cavSp('#fff2c0',7,6,0.35,h,0,1.8,0);addCirc(X-28,Z+iz-12,1.6);}
  // el Árbol: simétrico, siempre verde
  {const t=grp(X+28,IY,Z+iz-12,0);box(0.5,3,0.5,gold,0,1.5,0,t);const c=new THREE.Mesh(new THREE.IcosahedronGeometry(2.4,1),new THREE.MeshLambertMaterial({color:'#b8e0a0',flatShading:true}));c.position.y=4.4;t.add(c);cavSp('#e8ffd0',8,9,0.3,t,0,4,0);addCirc(X+28,Z+iz-12,0.6);}
  // Lo Bello: un templo de proporciones exactas
  {const t=grp(X,IY,Z+iz-30,0);box(9,0.6,5,wM,0,0.3,0,t);for(let i=0;i<6;i++)for(const s of[-1,1]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.36,4,16),wM);c.position.set(-3.75+i*1.5,2.6,s*2);t.add(c);}box(9,0.6,5,gold,0,4.9,0,t);
   const pd=new THREE.Mesh(new THREE.CylinderGeometry(0,2.9,1.2,3,1),wM);pd.rotation.set(0,0,0);pd.scale.set(1.6,1,0.6);pd.position.y=5.8;t.add(pd);addBox(X,Z+iz-30,9,5,0);}
  // los cinco sólidos del Timeo, flotando
  CAV.solids=[];{const G=[new THREE.TetrahedronGeometry(0.9),new THREE.OctahedronGeometry(0.9),new THREE.IcosahedronGeometry(0.9),new THREE.BoxGeometry(1.2,1.2,1.2),new THREE.DodecahedronGeometry(0.9)],C=['#ff9a50','#d8ecff','#6aa8e8','#a88a5a','#c8a8ff'];
   G.forEach((ge,i)=>{const m=new THREE.Mesh(ge,new THREE.MeshLambertMaterial({color:C[i],flatShading:true,emissive:C[i],emissiveIntensity:0.25}));const a=i/5*TAU;m.position.set(X-28+Math.cos(a)*3,IY+2.6,Z+iz+18+Math.sin(a)*3);scene.add(m);CAV.solids.push(m);});}
  // la ciudad justa, en maqueta
  {const c=grp(X+28,IY,Z+iz+18,0);box(8,0.3,8,lam('#e8e0d0'),0,0.15,0,c);for(let i=0;i<18;i++){const a=i/18*TAU;box(0.7,0.7,0.7,lam('#d8cbb0'),Math.cos(a)*3,0.6,Math.sin(a)*3,c);}box(2,1.2,2,gold,0,0.9,0,c);addBox(X+28,Z+iz+18,8,8,0);}
  // la llanura del Olvido y el río Ameles (mito de Er)
  {const r=new THREE.Mesh(new THREE.PlaneGeometry(40,3),new THREE.MeshBasicMaterial({color:'#a8c8e8',transparent:true,opacity:0.8}));r.rotation.x=-Math.PI/2;r.position.set(X,IY+0.06,Z+iz+40);scene.add(r);}
  // el Sol, la Idea del Bien
  CAV.sun=cavSp('#fff4c0',90,90,1,null,X,IY+120,Z+iz+300);CAV.sun2=cavSp('#ffffff',36,36,1,null,X,IY+120,Z+iz+299);
  CAV.ideas=scene.children.slice(n0).concat(g.children.slice(gn0));CAV.ideasOn=true;
  // objetos con los que se interactúa
  const E=(lx,lz,y,act,nm,sub,r)=>{const p=cavL(lx,lz);return egxObj(p[0],p[1],y,act,nm,sub,r);};
  E(0,-22.4,Y,'c:cadenas','Las cadenas','no puedes girar la cabeza',1.6);E(0,-33,Y,'c:pared','La pared del fondo','las sombras',12);E(1.6,-21.4,Y,'c:prisioneros','Los prisioneros','tus compañeros',2.4);
  E(0,-6.5,Y,'c:fuego','El fuego','detrás de vosotros',3);E(-6,-10,Y,'c:porteadores','Los porteadores','tras el murete',3);E(0,96,T,'c:boca','La boca de la caverna','la luz',4);
  E(-18,124,T,'c:reflejo','El estanque','los reflejos',4);E(18,124,T,'c:menon','Un dibujo en la arena','un cuadrado',3.4);E(0,140,T,'c:linea','La línea dividida','una estela',3);
  {const p=cavL(0,140);stele(p[0],p[1],0,null).mk.visible=false;}E(0,201,T,'c:puerta','La puerta de la luz','',4);
  E(-28,iz-8,IY,'c:f:caballo','El Caballo','la Idea',4);E(28,iz-8,IY,'c:f:arbol','El Árbol','la Idea',4);E(0,iz-25,IY,'c:f:templo','Lo Bello','la Idea',5);
  E(-28,iz+14,IY,'c:f:solidos','Los cinco sólidos','del Timeo',4);E(28,iz+14,IY,'c:f:ciudad','La ciudad justa','la Calípolis',5);E(0,iz+37,IY,'c:f:lete','La llanura del Olvido','el río Ameles',5);
  E(0,iz+52,IY,'c:sol','Levantar la vista','el Sol',5);E(-8,iz-52,IY,'c:volver','Volver','a la boca de la caverna',3);}
// ---- Roma: el Sueño de Escipión
function buildSomnium(){if(CAV.built)return;CAV.built=true;CAV.X=9500;CAV.Z=-3000;const X=CAV.X,Z=CAV.Z,Y=CAV.Y,g=grp(X,Y,Z,0);
  // la Vía Láctea: un camino de luz entre las estrellas
  {const m=new THREE.Mesh(new THREE.PlaneGeometry(14,170),new THREE.MeshBasicMaterial({color:'#dfe6ff',transparent:true,opacity:0.18,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(0,0.02,40);g.add(m);}
  addPlat(X,Z+40,14,170,0,Y);for(const[a,b,c,d]of[[-7,-45,7,-45],[7,-45,7,125],[7,125,-7,125],[-7,125,-7,-45]])addSeg(X+a,Z+b,X+c,Z+d,0.3);
  for(let i=0;i<160;i++)cavSp(pick(['#ffffff','#dfe8ff','#fff2d8']),rr(1,4),rr(1,4),rr(0.3,0.8),g,rr(-7,7),rr(-0.4,0.6),rr(-44,124));
  {const N=1600,pos=new Float32Array(N*3);for(let i=0;i<N;i++){const u=R()*2-1,a=R()*TAU,r=900,s=Math.sqrt(1-u*u);pos[i*3]=X+Math.cos(a)*s*r;pos[i*3+1]=Y+u*r;pos[i*3+2]=Z+40+Math.sin(a)*s*r;}
   const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.BufferAttribute(pos,3));CAV.stars=new THREE.Points(ge,new THREE.PointsMaterial({color:'#ffffff',size:2.2,sizeAttenuation:false,fog:false}));scene.add(CAV.stars);}
  // la Tierra, inmóvil en el centro, con sus cinco zonas; y las esferas que giran a su alrededor (VI 17)
  const EX=X+95,EY=Y-40,EZ=Z+50;
  {const c=document.createElement('canvas');c.width=256;c.height=128;const x=c.getContext('2d');const B=[['#f4f8ff',0,18],['#5a8a4a',18,22],['#c86a3a',40,48],['#5a8a4a',88,22],['#f4f8ff',110,18]];for(const[col,y,h]of B){x.fillStyle=col;x.fillRect(0,y,256,h);}
   x.fillStyle='#ffd040';x.beginPath();x.arc(140,30,2.5,0,TAU);x.fill();
   const e=new THREE.Mesh(new THREE.SphereGeometry(9,32,20),new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(c),emissive:'#223344'}));e.position.set(EX,EY,EZ);scene.add(e);CAV.earth=e;}
  CAV.rings=[];[['Luna','#d8d8d8',16],['Mercurio','#b0a090',22],['Venus','#f0e0b0',28],['Sol','#ffe070',36],['Marte','#d05030',43],['Júpiter','#e8d0a0',50],['Saturno','#c8b880',57]].forEach(([n,col,r],i)=>{
    const t=new THREE.Mesh(new THREE.TorusGeometry(r,0.08,6,96),new THREE.MeshBasicMaterial({color:'#8090c0',transparent:true,opacity:0.35}));t.rotation.x=Math.PI/2;t.position.set(EX,EY,EZ);scene.add(t);
    const p=new THREE.Mesh(new THREE.SphereGeometry(n==='Sol'?3.4:1.3,16,12),new THREE.MeshBasicMaterial({color:col}));scene.add(p);if(n==='Sol')cavSp('#ffe8a0',16,16,0.8,p);CAV.rings.push({p,r,sp:0.5/(i+1),a:R()*TAU});});
  // el Africano y Paulo
    const A=divineFigure(X,Z+30,{chiton:'#f4efe4',himation:'#7a1c3a',beard:false,hair:'#d8d0c2'},'#cfe0ff','Escipión el Africano','tu guía en el sueño',1.25);A.g.rotation.y=Math.PI;A.lb.visible=false;A.mk.visible=false;
  const P=divineFigure(X+4,Z+70,{chiton:'#f4efe4',himation:'#3a4a7a',beard:false,hair:'#c8c0b2'},'#cfe0ff','Lucio Emilio Paulo','el padre del soñador',1.2);P.g.rotation.y=Math.PI;P.lb.visible=false;P.mk.visible=false;
  const E=(lx,lz,act,nm,sub,r)=>{const p=cavL(lx,lz);return egxObj(p[0],p[1],Y,act,nm,sub,r);};
  E(0,32,'sm:africano','Escipión el Africano','tu guía en el sueño',3);E(4,72,'sm:paulo','Lucio Emilio Paulo','el padre del soñador',3);E(6,50,'sm:tierra','Mirar la Tierra','allá abajo',4);
  E(-5,90,'sm:musica','Escuchar','la música de las esferas',4);E(-5,10,'sm:via','La Vía Láctea','el camino de las almas',4);E(0,118,'sm:despertar','Despertar','volver a Roma',3);}
// ---- viaje de ida y vuelta (la pantalla del viaje, como el Olimpo)
function cavTravel(t1,t2,fn){ui='voyage';if(MOUNT.riding)dismount();if(MOUNT.g){MOUNT.g.visible=false;MOUNT.st='away';}FLY.on=false;const v=$('voyage');v.classList.add('land');
  v.querySelector('.vt').textContent=t1;v.querySelector('.vs').textContent=t2;v.querySelector('.vf').textContent='';v.hidden=false;requestAnimationFrame(()=>v.classList.add('show'));
  setTimeout(()=>{fn();player.feet=floorAt(player.x,player.z);player.camY=player.feet+player.eye;player.vy=0;player.pitch=0;curZone=null;hudKey='';v.classList.remove('show');setTimeout(()=>{v.hidden=true;ui='play';},700);},2800);}
function cavPut(lx,lz,y,yaw){player.x=CAV.X+lx;player.z=CAV.Z+lz;player.yaw=yaw||0;if(GF){GF.vx=0;GF.vz=0;}void y;}
function cavEnter(){const ro=MODE==='roma';
  if(ro){cavTravel('Te duermes leyendo a Cicerón…','Ves en sueños a un hombre con la toga de los antiguos. Lo reconoces por las imágenes de cera de las casas nobles.',()=>{buildSomnium();cavPut(0,-38,0,Math.PI);
    setTimeout(()=>toast('<span class="label">El Sueño de Escipión</span><br>«Ten ánimo y no temas, y guarda en la memoria lo que voy a decirte». Acércate al Africano, que te espera en el camino de luz.'),900);});return;}
  const c=cavz();c.visits=(c.visits||0)+1;if(!c.done){c.st=0;}save();
  cavTravel('Platón te pide que cierres los ojos…','«Imagina una morada subterránea, en forma de caverna, con una entrada abierta a la luz a lo largo de toda ella…»',()=>{buildCave();
    if(c.done)cavPut(10,-16,0,0);else cavPut(0,-22,0,0);
    setTimeout(()=>toast(c.done?'<span class="label">La caverna</span><br>Vuelves a la caverna: ahora sabes lo que hay detrás del fuego y fuera de ella.':'<span class="label">La caverna</span><br>Estás encadenado de piernas y cuello. Solo puedes mirar la pared del fondo, donde pasan sombras. Pulsa <b>E</b> para examinar las cadenas.'),900);});}
function cavLeave(text){const ro=MODE==='roma',id=ro?'epicteto':'platon',o=npcObjs.find(q=>q.data&&q.data.id===id);
  cavTravel(ro?'Te despiertas…':'Abres los ojos…',text||(ro?'Estás otra vez en Roma, con el libro de Cicerón entre las manos.':'Estás otra vez en el bosque de la Academia, junto a Platón.'),()=>{if(o){player.x=o.x+2.5;player.z=o.z+2.5;}else{const I=ISLANDS[0];void I;player.x=INNER.x;player.z=INNER.z;}cavRestore();});}
// ---- luz: la caverna es oscura, la subida se aclara, fuera es de día y el mundo de las Ideas es blanco
function cavIn(){return CAV.built&&Math.abs(player.x-CAV.X)<400&&player.z>CAV.Z-120&&player.z<CAV.Z+700&&player.feet>CAV.Y-60&&player.feet<CAV.Y+400;}
function cavRestore(){if(!CAV.ovr)return;CAV.ovr=false;if(SEA)SEA.visible=true;scene.fog.near=260;scene.fog.far=2400;if(CAV.light)CAV.light.intensity=0;updateSky();}
function cavBlind(col,ms,txt){let b=CAV.blind;if(!b){b=document.createElement('div');b.style.cssText='position:fixed;inset:0;z-index:40;pointer-events:none;opacity:0;transition:opacity 0.4s;display:flex;align-items:center;justify-content:center;font:italic 22px Alegreya,Georgia,serif;color:#5a4a30;text-align:center;padding:24px';document.body.appendChild(b);CAV.blind=b;}
  b.style.background=col;b.textContent=txt||'';b.style.transition='opacity 0.3s';b.style.opacity='1';setTimeout(()=>{b.style.transition='opacity '+(ms/1000)+'s';b.style.opacity='0';},400);}
function cavTick(dt){if(!state||!CAV.built)return;const inside=cavIn();if(!inside){if(CAV.ovr)cavRestore();return;}CAV.ovr=true;const t=performance.now()/1000,lz=player.z-CAV.Z,F=scene.fog;
  if(MODE==='roma'){if(SEA&&SEA.visible)SEA.visible=false;sun.intensity=0.35;sun.color.set('#c8d4ff');hemi.intensity=0.45;hemi.color.set('#8090c0');hemi.groundColor.set('#202030');F.color.set('#02030a');F.near=300;F.far=3000;
    SKY.uniforms.top.value.set('#000004');SKY.uniforms.mid.value.set('#02030a');SKY.uniforms.bot.value.set('#050818');SKY.uniforms.glow.value=0;STARS.material.opacity=1;
    for(const r of CAV.rings){r.a+=dt*r.sp*0.4;r.p.position.set(CAV.X+95+Math.cos(r.a)*r.r,CAV.Y-40,CAV.Z+50+Math.sin(r.a)*r.r);}if(CAV.earth)CAV.earth.rotation.y+=dt*0.02;return;}
  const c=cavz();
  {const on=player.feet>CAV.Y+50;if(CAV.ideas&&on!==CAV.ideasOn){CAV.ideasOn=on;for(const o of CAV.ideas)o.visible=on;}}
  if(CAV.wallM)CAV.wallM.emissiveIntensity=0.85+Math.sin(t*9)*0.12+Math.sin(t*5.1)*0.08;
  // los porteadores van y vienen detrás del murete; sus figuras proyectan sombras en la pared
  CAV.bear.forEach((B,i)=>{const u=((t*0.035+B.ph)%1),x=-11+u*22;B.g.position.x=CAV.X+x;B.g.position.y=CAV.Y+Math.abs(Math.sin(t*3+i))*0.05;const S=CAV.shad[i];S.position.x=CAV.X+x*1.15;S.visible=Math.abs(x)<10.5;});
  if(CAV.fire){const f=0.85+Math.sin(t*13)*0.08+Math.sin(t*7.3)*0.07;CAV.fire.scale.set(3.2*f,4.2*f,1);CAV.fire2.material.opacity=0.45+0.15*f;}
  if(c.st===0&&!c.done&&lz<0){player.x=CAV.X;player.z=CAV.Z-22;if(GF){GF.vx=0;GF.vz=0;}}
  CAV.solids.forEach((m,i)=>{m.rotation.x+=dt*0.4;m.rotation.y+=dt*(0.3+i*0.07);m.position.y=CAV.Y+60+2.6+Math.sin(t+i)*0.3;});
  if(CAV.gateGlow)CAV.gateGlow.material.opacity=(c.ref&&c.meno)||c.done?0.85:0.2;
  if(lz<95){const k=lz<5?0:clamp((lz-5)/90,0,1),kk=k*k;CAV.light.intensity=lz<5?2.2*(0.9+Math.sin(t*11)*0.1):2.2*(1-k);
    sun.intensity=1.2*kk;hemi.intensity=0.08+0.5*kk;F.color.setRGB(0.02+0.75*kk,0.015+0.72*kk,0.01+0.66*kk);F.near=6+60*kk;F.far=70+470*kk;
    SKY.uniforms.top.value.copy(F.color);SKY.uniforms.mid.value.copy(F.color);SKY.uniforms.bot.value.copy(F.color);STARS.material.opacity=0;CAV.emerged=false;}
  else if(player.feet<CAV.Y+50){CAV.light.intensity=0;F.near=260;F.far=2400;if(!CAV.emerged){CAV.emerged=true;clock.h=9.5;updateSky();if(c.st<2&&!c.done){c.st=2;save();}
      cavBlind('#fffdf4',6000,'La luz te ciega. No puedes ver nada de lo que llaman real.');setTimeout(()=>toast('<span class="label">Fuera de la caverna</span><br>«Al principio verías mejor las sombras, y después las imágenes de los hombres y de las cosas reflejadas en el agua, y luego las cosas mismas» (República VII 516a). Busca el estanque.'),6500);}}
  else{CAV.light.intensity=0;sun.intensity=1.3;sun.color.set('#fffaf0');hemi.intensity=1.1;hemi.color.set('#ffffff');hemi.groundColor.set('#f0e8d8');F.color.set('#fffbf0');F.near=60;F.far=520;
    SKY.uniforms.top.value.set('#fff8e6');SKY.uniforms.mid.value.set('#fffbf0');SKY.uniforms.bot.value.set('#fffdf8');STARS.material.opacity=0;}}
// ---- diálogos de la caverna
function cavAct(o){const a=o.act,c=cavz(),ro=MODE==='roma';
  if(a.startsWith('sm:'))return somAct(o);
  const one=casaOpen('Π',o.data.name,a.startsWith('c:f:')?'El mundo de las Ideas':'La caverna · República, libro VII'),B=$('dBody'),fin=()=>{one('Cerrar',closeDialog);};
  const form=(k,html)=>{const first=!c.forms[k];c.forms[k]=1;if(first){qAdd('so',2);qAdd('eu',1);}save();const n=Object.keys(c.forms).length;
    B.innerHTML=html+'<p class="sub">Ideas contempladas: '+n+' de 6.'+(n>=4&&c.st<4?' Ya puedes intentar levantar la vista hacia el Sol, al fondo.':'')+'</p>';fin();};
  if(a==='c:cadenas'){
    if(c.st>0||c.done){B.innerHTML='<p>Las cadenas cuelgan sueltas de la barra. Aquí estuviste sentado toda la vida, creyendo que las sombras eran todo lo que existe.</p>';fin();return;}
    B.innerHTML='<p>Llevas aquí desde niño, con las piernas y el cuello encadenados: no puedes moverte ni girar la cabeza. Solo ves la pared del fondo. Detrás, más arriba, arde un fuego, y entre el fuego y vosotros pasa un camino con un murete, «como el tabique que los titiriteros ponen delante del público» (514b).</p><p>En la pared desfilan sombras. Tus compañeros les ponen nombre y se pasan el día discutiendo cuál vendrá después.</p>';
    one('Seguir mirando las sombras',()=>{cavAct({act:'c:pared',data:{name:'La pared del fondo'}});},'quiz');
    one('Romper las cadenas y darte la vuelta',()=>{c.st=1;save();closeDialog();cavBlind('rgba(255,150,60,0.92)',3000,'El fuego te deslumbra. Te duelen los ojos.');player.yaw=Math.PI;
      setTimeout(()=>toast('<span class="label">Liberado de las cadenas</span><br>«Si a uno lo liberasen y lo obligasen a levantarse, girar el cuello y mirar hacia la luz, sufriría» (515c). Mira el fuego y a los porteadores, y busca la salida, detrás.'),3200);},'quiz');
    one('Despertar en la Academia',()=>{closeDialog();cavLeave();});return;}
  if(a==='c:pared'){const L=CAV.bear.map(b=>b.nm);
    B.innerHTML='<p>Por la pared pasan, una tras otra, sombras enormes y temblorosas: '+L.slice(0,-1).join(', ')+' y '+L[L.length-1]+'. Los prisioneros dicen sus nombres en cuanto aparecen. Si alguien habla detrás del murete, el eco rebota en la pared, y creen que hablan las sombras (515b).</p>'+(CAV.names&&CAV.names.length?'<p>Son las mismas personas y cosas que has conocido en tu viaje. Pero aquí solo son sombras: copias de figuras que, a su vez, son copias.</p>':'')+'<p class="sub">Primer grado de la «línea dividida»: la <b>eikasía</b>, la conjetura que toma las imágenes por la realidad.</p>';fin();return;}
  if(a==='c:prisioneros'){
    if(c.done){B.innerHTML='<p>El prisionero más joven ha girado un poco la cabeza. Los demás siguen con la vista clavada en la pared.</p>';fin();return;}
    if(c.st<4){B.innerHTML=c.st===0?'<p>«¡Silencio! Ahora toca el caballo, siempre viene después del templo», dice tu vecino. «El que más acierta se lleva los honores» (516c).</p>':'<p>«¿Adónde vas? ¿Te has vuelto loco? ¡Siéntate, que te pierdes las sombras!»</p>';fin();return;}
    cavReturn();return;}
  if(a==='c:fuego'){if(c.st<1&&!c.done){B.innerHTML='<p>No puedes girar la cabeza: solo intuyes una luz detrás de ti.</p>';fin();return;}
    B.innerHTML='<p>Un fuego grande arde en lo alto, detrás de vosotros. De él viene toda la luz de la caverna. Después de tantos años mirando la pared, te hace daño a los ojos y tienes la tentación de volver a las sombras, que se ven mejor (515e).</p><p class="sub">Segundo grado: la <b>pístis</b>, la creencia en las cosas visibles. El fuego es, dice Platón, como el sol de este mundo.</p>';fin();return;}
  if(a==='c:porteadores'){if(c.st<1&&!c.done){B.innerHTML='<p>Oyes pasos y voces detrás del murete, pero no puedes girarte.</p>';fin();return;}
    B.innerHTML='<p>Detrás del murete pasan hombres que llevan sobre la cabeza figuras de hombres y animales hechas de piedra y de madera. Unos hablan, otros callan (514c-515a). Las sombras de la pared eran las sombras de estas figuras.</p><p>Si alguien te las enseñara y te preguntara qué es cada una, dudarías: creerías que lo que veías antes era más verdadero (515d).</p>';fin();return;}
  if(a==='c:boca'){
    if(c.st>=4&&!c.done){B.innerHTML='<p>Has visto el Sol. Platón no deja que te quedes fuera: «Hay que obligar a los mejores a bajar otra vez con los prisioneros, a compartir sus trabajos y sus honores» (519d-520c).</p>';one('Bajar otra vez a la caverna',()=>{closeDialog();cavPut(5,-18,0,0);player.feet=CAV.Y;player.camY=player.feet+player.eye;cavBlind('#000000',4000,'Vienes del sol: no ves nada en la oscuridad.');
      setTimeout(()=>toast('<span class="label">De vuelta en la caverna</span><br>Tus ojos tardan en acostumbrarse a la oscuridad (516e). Habla con los prisioneros.'),4200);},'quiz');fin();return;}
    B.innerHTML='<p>La boca de la caverna, abierta a la luz. '+(c.done?'Ya conoces el camino de arriba abajo.':'Abajo quedan el fuego, el murete y la pared de las sombras.')+'</p>';
    one('Bajar a la caverna',()=>{closeDialog();cavPut(0,-6,0,0);});one('Volver a la Academia',()=>{closeDialog();cavLeave();});fin();return;}
  if(a==='c:reflejo'){c.ref=1;save();B.innerHTML='<p>Todavía no puedes mirar las cosas a plena luz. Te inclinas sobre el estanque: en el agua ves, quietos, los olivos, las nubes, tu propia cara. Platón dice que así se empieza: primero las sombras, luego los reflejos en el agua y, al final, las cosas mismas (516a).</p><p class="sub">Tercer grado: la <b>diánoia</b>, el razonamiento que todavía se apoya en imágenes, como el geómetra que dibuja un cuadrado para pensar en el cuadrado.</p>'+(c.meno?'<p>Ya has resuelto el dibujo de la arena: tus ojos están preparados. Busca la puerta de la luz, al fondo del prado.</p>':'<p>Al otro lado del camino hay un dibujo en la arena.</p>');fin();return;}
  if(a==='c:menon'){if(c.meno){B.innerHTML='<p>El cuadrado grande, construido sobre la diagonal, tiene el doble de superficie que el pequeño. Lo «recordaste» sin que nadie te lo enseñara.</p>';fin();return;}
    B.innerHTML='<p>Alguien ha dibujado en la arena un cuadrado de dos pies de lado (cuatro pies cuadrados). Al lado, una pregunta: <b>¿sobre qué línea se construye un cuadrado del doble de superficie, de ocho pies?</b></p><p class="sub">Es la pregunta que Sócrates le hace a un esclavo en el <i>Menón</i> (82b-85b).</p>';
    const ans=[['Sobre un lado del doble, de cuatro pies',0,'Haces el dibujo: el cuadrado de cuatro pies de lado mide dieciséis, el cuádruple. Es lo primero que respondió el esclavo del Menón.'],['Sobre un lado de tres pies',0,'El de tres pies mide nueve: se pasa. Fue la segunda respuesta del esclavo, que entonces confesó que no sabía.'],['Sobre la diagonal del cuadrado pequeño',1,'Exacto. Las cuatro mitades de cuatro cuadrados pequeños forman un cuadrado de ocho pies. El esclavo llegó a la misma respuesta solo con preguntas: para Sócrates, eso demostraba que aprender es recordar (anámnesis).']].sort(()=>R()-0.5);
    ans.forEach(([t,ok,r])=>one(t,()=>{B.innerHTML='<p>'+r+'</p>';$('dOpts').innerHTML='';if(ok){c.meno=1;qAdd('so',3);save();B.innerHTML+=c.ref?'<p>Tus ojos ya se han acostumbrado. Busca la puerta de la luz, al fondo del prado.</p>':'<p>Ahora mira el estanque.</p>';}one(ok?'Seguir':'Volver a intentarlo',()=>ok?closeDialog():cavAct(o));},'quiz'));return;}
  if(a==='c:linea'){B.innerHTML='<p>En la estela, una línea cortada en cuatro tramos (República VI 509d-511e):</p><ol><li><b>Eikasía</b>, imaginación: sombras y reflejos.</li><li><b>Pístis</b>, creencia: las cosas visibles, los animales, las plantas, los objetos.</li><li><b>Diánoia</b>, razonamiento: la geometría y las matemáticas, que aún usan figuras.</li><li><b>Nóesis</b>, inteligencia: las Ideas mismas, sin imágenes, hasta llegar al Bien.</li></ol><p>Los dos primeros son el mundo de la opinión, la dóxa. Los dos últimos, el del conocimiento, la epistéme. La caverna los recorre en orden.</p>';fin();return;}
  if(a==='c:puerta'){if(!(c.ref&&c.meno)&&!c.done){B.innerHTML='<p>Una luz blanca sale entre las dos columnas. Todavía te ciega: tus ojos no se han acostumbrado. '+(!c.ref?'Mira primero los reflejos del estanque. ':'')+(!c.meno?'Resuelve el dibujo de la arena.':'')+'</p>';fin();return;}
    B.innerHTML='<p>La luz ya no te hace daño. Al otro lado no hay sombras ni reflejos: hay las cosas tal como son.</p><p class="sub">Esto es una licencia del juego. Platón no dice que exista un lugar al que se llegue andando: las Ideas solo se alcanzan con la razón. Pero él mismo, en el <i>Fedro</i>, imaginó un «lugar más allá del cielo» donde las almas las contemplan.</p>';
    one('Cruzar la puerta',()=>{closeDialog();cavBlind('#ffffff',3000,'');cavPut(0,370,0,Math.PI);player.feet=CAV.Y+60;player.camY=player.feet+player.eye;if(c.st<3){c.st=3;save();}setTimeout(()=>toast('<span class="label">El mundo de las Ideas</span><br>Nada envejece aquí, ni hay estaciones ni noche. Contempla las Ideas y, cuando estés preparado, levanta la vista hacia el Sol, al fondo.'),1200);},'quiz');fin();return;}
  if(a==='c:volver'){one('Volver al prado, junto a la boca de la caverna',()=>{closeDialog();cavPut(0,112,0,Math.PI);player.feet=CAV.Y+30;player.camY=player.feet+player.eye;},'quiz');B.innerHTML='<p>Puedes volver al prado cuando quieras.</p>';fin();return;}
  if(a==='c:f:caballo'){const hn=hz().own?horseName():null;
    form('caballo','<p>Un caballo blanco, inmóvil, perfecto. No es este caballo ni aquel: es lo que todos los caballos tienen en común, lo que hace que un caballo sea caballo. '+(hn?'Tu '+hn+', con sus manías y sus heridas, es solo una copia de esto. ':'')+'Los caballos que has visto nacen, envejecen y mueren; este no.</p><p>Antístenes se burlaba de Platón: «Veo un caballo, Platón, pero no veo la caballeidad». Y Platón le contestaba: «Porque tienes ojos para ver el caballo, pero todavía no tienes con qué ver la caballeidad» (Simplicio, Comentario a las Categorías).</p>');return;}
  if(a==='c:f:arbol')return form('arbol','<p>Un árbol simétrico, siempre verde, que no da sombra porque no hay nada que la proyecte. Las cosas de nuestro mundo cambian sin parar; lo que de verdad es, es siempre igual a sí mismo, «invisible, divino, inmortal» (<i>Fedón</i> 78c-80b).</p><p class="sub">Aristóteles, que ahora es un niño, discutirá todo esto de mayor: para él, la forma del árbol está en el árbol, no en otro mundo.</p>');
  if(a==='c:f:templo')return form('templo','<p>Un templo de proporciones exactas, más bello que el Partenón porque no es de mármol: es la Belleza misma. En el <i>Banquete</i>, la sacerdotisa Diotima enseña a Sócrates a subir por una escalera: de un cuerpo bello a todos los cuerpos bellos, de ahí a las almas bellas, a las leyes, a las ciencias, y por fin a «lo Bello en sí, puro, sin mezcla» (210a-212a).</p><p class="sub">El Banquete y la República se escribirán en los próximos años: Platón ya está pensando en ellos.</p>');
  if(a==='c:f:solidos')return form('solidos','<p>Cinco sólidos giran en el aire, con todas las caras y los ángulos iguales. En el <i>Timeo</i>, Platón explicará que el mundo está hecho con ellos: el fuego, de tetraedros (por eso quema, es puntiagudo); el aire, de octaedros; el agua, de icosaedros (por eso fluye, casi redonda); la tierra, de cubos (estable). El quinto, el dodecaedro, el dios lo usó «para el conjunto» (53c-56c).</p><p class="sub">Teeteto, el matemático de la Academia, estudia ahora mismo estos sólidos regulares. El Timeo es una obra de vejez de Platón.</p>');
  if(a==='c:f:ciudad')return form('ciudad','<p>Una maqueta de la ciudad justa, la que Platón describirá en la <i>República</i>: tres grupos, como las tres partes del alma. Los productores (el deseo), los guardianes (el ánimo) y los gobernantes (la razón), que deben ser filósofos: «hasta que los filósofos no reinen en las ciudades, no habrá fin de los males» (473c-d).</p><p>Los guardianes no tienen casa ni bienes propios. Y, cosa que escandaliza a los atenienses, las mujeres pueden ser guardianas y gobernantes, con la misma educación que los hombres (451c-457c).</p><p class="sub">Compárala con la Atenas que has recorrido: una democracia donde gobierna la Asamblea y que condenó a muerte a Sócrates. Platón nunca se lo perdonó.</p>');
  if(a==='c:f:lete')return form('lete','<p>Una llanura blanca, sin árboles, atravesada por un río: el Ameles, «el que no se preocupa». En el mito de Er, al final de la <i>República</i>, las almas eligen su próxima vida y luego beben de este río para olvidar. Quien no tiene sabiduría bebe sin medida y lo olvida todo (621a).</p><p>Por eso, para Platón, aprender es recordar: el alma ya vio las Ideas antes de nacer, y estudiar es ir recuperando lo que olvidó (<i>Menón</i> 81b-86b).</p>'+(state.olyKey?'<p class="sub">Tú bebiste del agua de Mnemósine, la Memoria: por eso puedes reconocer este lugar.</p>':''));
  if(a==='c:sol'){const n=Object.keys(c.forms).length;if(n<4&&!c.done){B.innerHTML='<p>Intentas levantar la vista, pero la luz es demasiado fuerte. Contempla antes más Ideas (llevas '+n+' de 6; necesitas al menos 4).</p>';fin();return;}
    B.innerHTML='<p>Levantas la vista. Al principio solo puedes mirar el cielo de noche, la luna y las estrellas (516a-b). Poco a poco te atreves con el Sol: no su reflejo, sino el Sol mismo, en su lugar.</p><p>Entiendes que es él quien da las estaciones y los años, quien gobierna todo lo visible y, en cierto modo, la causa de todo lo que veíais abajo (516b-c).</p><p>Platón dice que el Bien es al mundo de las Ideas lo que el Sol es al mundo visible: hace que las cosas se conozcan y que existan, y está «más allá del ser, por encima en dignidad y en poder» (VI 508e-509b).</p><p class="sub">Cuarto grado: la <b>nóesis</b>. Pero Platón no deja que el viaje acabe aquí. Vuelve a la boca de la caverna.</p>';
    if(c.st<4){c.st=4;qAdd('eu',3,'Has contemplado la Idea del Bien.');save();cavBlind('#ffffff',5000,'');}fin();return;}
  B.innerHTML='<p>…</p>';fin();}
// ---- el regreso: liberar a un prisionero
function cavReturn(){const c=cavz(),B=$('dBody'),o=$('dOpts'),lo=qLv('lo');let tries=0;
  const one=(t,fn,cl)=>{const b=document.createElement('button');if(cl)b.className=cl;b.innerHTML='<span class="n">'+(o.children.length+1)+'</span><span>'+t+'</span>';b.onclick=fn;o.appendChild(b);};
  const ask=msg=>{B.innerHTML=(msg||'<p>Te sientas otra vez entre ellos. Te miran con desconfianza: «Has vuelto con los ojos estropeados», dicen. ¿Cómo intentas liberar a alguno?</p>');o.innerHTML='';
    one('«Lo que veis son sombras: daos la vuelta y mirad el fuego»',()=>{tries++;ask('<p>Se ríen de ti. «Subió arriba y volvió con los ojos estropeados: no vale la pena intentar subir» (517a). Uno te escupe. La verdad, dicha de golpe, ciega como el sol.</p><p>¿Pruebas otra manera?</p>');},'quiz');
    one('«Os lo demostraré: veréis que adivino mejor que nadie la próxima sombra»',()=>{tries++;ask('<p>Lo intentas, pero tus ojos todavía no se han acostumbrado a la oscuridad: fallas una y otra vez. «¡Míralo! Fuera se le ha olvidado todo», se burlan (516e-517a). En su juego, tú ya no puedes ganar.</p><p>¿Pruebas otra manera?</p>');},'quiz');
    one('No obligar a nadie: hacer preguntas, como Sócrates, para que cada uno busque',()=>{const good=lo>=6;c.done=1;c.conv=good?1:0;
      qAdd('lo',4,'Has intentado liberar a los demás con preguntas.');qAdd('kl',5,'Te llaman philósophos.');qAdd('eu',2);state.obols+=10;updateStats();save();sfxCoin();
      B.innerHTML=(good?'<p>Le preguntas al más joven: «¿Por qué tiemblan las sombras cuando el fuego chisporrotea?». Calla. Al rato, despacio, gira un poco el cuello. Te duele verle sufrir con la luz, pero no te pide que pares.</p>':'<p>Haces preguntas, pero se te traba la lengua y nadie te sigue. Solo el más joven se queda pensativo, con la vista todavía en la pared. Quizá otro día.</p><p class="sub">Con más Lógos (nivel 6) habrías conseguido que se girara.</p>')+
        '<p>Platón lo dijo sin rodeos: si pudieran ponerle las manos encima al que intenta liberarlos y llevarlos arriba, lo matarían (517a). Pensaba en Sócrates. Aun así, el que ha visto la luz tiene que volver: la educación no es meter la vista en unos ojos ciegos, sino girar el alma entera hacia la luz (518b-d).</p>'+
        '<div class="curio"><span class="label">Philósophos</span><p>Has recorrido la caverna entera: las sombras, el fuego, la subida, las Ideas, el Sol y el regreso. Recibes el título de philósophos, «amante de la sabiduría», y diez óbolos de la Academia. Tu epigrama: <i>«Salió a la luz y volvió por los demás»</i>.</p></div>';
      o.innerHTML='';one('Volver a la Academia',()=>{closeDialog();cavLeave('Platón te mira largo rato. «Ahora ya sabes por qué no puedo dejar de enseñar», dice. «Algún día escribiré esto».');},'quiz');one('Quedarme un rato más',closeDialog);},'quiz');
    one('Dejarlo para más tarde',closeDialog);};
  ask();}
// ---- el Sueño de Escipión (Cicerón, República VI)
const SOM_T=[
 ['¿Quién eres?','Soy Publio Cornelio Escipión, el Africano: el que venció a Aníbal en Zama. Así me apareció en sueños mi nieto adoptivo, Escipión Emiliano, en el año 149 a.C., en la corte del rey Masinisa, en África. Le anuncié que él destruiría Cartago, la ciudad que yo solo había vencido. Lo cuenta Cicerón al final de su República, escrita hacia el 54-51 a.C. Lo que tú vives ahora es una licencia del juego: un sueño dentro del libro.'],
 ['¿Dónde estamos?','En el círculo que brilla entre las llamas de las estrellas, el que los griegos llaman galaxías: la Vía Láctea. Aquí viven las almas de los que salvaron, ayudaron o engrandecieron a su patria. Para ellos hay un lugar fijo en el cielo, donde disfrutan para siempre de una vida feliz (VI 13 y 16).'],
 ['¿Qué vale la gloria?','Mira la Tierra: tan pequeña que me avergüenza nuestro imperio, que apenas toca un punto de ella. Y de esa Tierra, solo unas pocas manchas están habitadas, separadas por desiertos; los de las otras zonas no oirán jamás tu nombre. Y aunque lo oyeran, las inundaciones y los incendios que llegan cada cierto tiempo lo borrarían. Cuando todas las estrellas vuelvan a su sitio, en el gran año, no quedará memoria de nadie (VI 20-24). No busques la fama: que la virtud te lleve por su propio atractivo al verdadero honor (VI 25).'],
 ['¿Qué soy yo, entonces?','Tú no eres mortal: lo es este cuerpo. Tú eres tu alma, que es como un dios que mueve el cuerpo. Lo que se mueve por sí mismo no puede dejar de moverse: por eso es eterno (VI 26-28). Cicerón traduce aquí, casi palabra por palabra, un pasaje del Fedro de Platón (245c-246a). Los romanos aprendieron a pensar con los griegos.']];
function somAct(o){const a=o.act,s=somz(),one=casaOpen('✦',o.data.name,'El Sueño de Escipión · Cicerón, República VI'),B=$('dBody'),fin=()=>one('Cerrar',closeDialog);
  const mark=k=>{if(!s.seen[k]){s.seen[k]=1;qAdd('so',1);save();}};
  if(a==='sm:africano'){const menu=()=>{$('dOpts').innerHTML='';SOM_T.forEach((t,i)=>one(t[0],()=>{mark('t'+i);B.innerHTML='<p>'+t[1]+'</p>';menu();},s.seen['t'+i]?'seen':'quiz'));fin();};
    B.innerHTML='<p>El Africano te mira con calma. «Ten ánimo y no temas, y guarda en la memoria lo que voy a decirte» (VI 10).</p>';menu();return;}
  if(a==='sm:paulo'){mark('paulo');B.innerHTML='<p>Lucio Emilio Paulo, el padre carnal de Escipión Emiliano, te abraza llorando. En el sueño, Escipión le pidió quedarse allí con él. Paulo le contestó: «No. Hasta que el dios cuyo templo es todo esto que ves no te libere de la custodia del cuerpo, no puedes venir aquí. Los hombres nacieron para guardar ese globo que ves en el centro, la Tierra. Cultiva la justicia y la piedad: esa vida es el camino al cielo» (VI 15-16).</p>';fin();return;}
  if(a==='sm:tierra'){mark('tierra');B.innerHTML='<p>Muy abajo, inmóvil en el centro de todo, está la Tierra, rodeada por las esferas que giran: la Luna, Mercurio, Venus, el Sol, Marte, Júpiter y Saturno, y por fuera de todas la esfera de las estrellas, que es el dios supremo (VI 17). Por debajo de la Luna todo es mortal; por encima, todo es eterno.</p><p>En la Tierra ves cinco franjas: dos heladas en los polos, una abrasada por el calor en el medio y dos templadas. En una de estas, en un rincón diminuto, está el imperio de Roma (VI 20-21). El punto dorado es Roma.</p>';fin();return;}
  if(a==='sm:musica'){mark('musica');cavMusic();B.innerHTML='<p>Un sonido grande y dulce llena el cielo: lo producen las esferas al girar. Las más rápidas suenan agudas; la de la Luna, la más lenta, grave. Son siete sonidos distintos, «número que es el nudo de casi todas las cosas». Los hombres sabios lo imitan con las cuerdas de la lira (VI 18).</p><p>Los hombres no lo oyen porque tienen los oídos llenos de él desde que nacen, como los que viven junto a las cataratas del Nilo, que se han quedado sordos por el estruendo (VI 19).</p><p class="sub">La idea de la armonía de las esferas viene de los pitagóricos y de Platón.</p>';fin();return;}
  if(a==='sm:via'){mark('via');B.innerHTML='<p>El camino de luz blanca por el que andas: la Vía Láctea. Cicerón, siguiendo a los pitagóricos, la imagina como la morada de las almas de los buenos gobernantes y de los que sirvieron a su patria. «Nada de lo que se hace en la tierra agrada más a aquel dios supremo que las reuniones de hombres unidos por el derecho, que llamamos ciudades» (VI 13).</p>';fin();return;}
  if(a==='sm:despertar'){const n=Object.keys(s.seen).length,need=6;
    if(s.done){B.innerHTML='<p>«Esfuérzate y ejercita tu alma en lo mejor», te dijo. Puedes despertar cuando quieras.</p>';one('Despertar',()=>{closeDialog();cavLeave();},'quiz');fin();return;}
    if(n<need){B.innerHTML='<p>Todavía no quieres despertar: hay más cosas que ver y oír en el sueño (llevas '+n+' de '+need+'). Escucha al Africano, a Paulo, la música de las esferas, mira la Tierra y la Vía Láctea.</p>';one('Despertar de todos modos',()=>{closeDialog();cavLeave();});fin();return;}
    s.done=1;qAdd('eu',4,'Has visto el orden del cielo.');qAdd('lo',3);state.obols+=10;updateStats();save();sfxCoin();
    B.innerHTML='<p>«Ejercita tu alma en lo mejor: en el cuidado de la patria. Así volará más deprisa a esta morada» (VI 29). El Africano se aleja, y te despiertas.</p><div class="curio"><span class="label">Sapiens</span><p>Has recorrido el Sueño de Escipión. Recibes diez sestercios y una lección que vale más que la Fama: vista desde el cielo, la gloria de los hombres es un punto. Tu epigrama: <i>«Vio la Tierra pequeña y siguió sirviendo a los suyos»</i>.</p></div>';
    one('Despertar',()=>{closeDialog();cavLeave('Te despiertas en Roma. Epicteto sonríe: «Ahora ya sabes lo que decía mi maestro: lo único que es tuyo es cómo usas tu alma».');},'quiz');return;}
  B.innerHTML='<p>…</p>';fin();}
function cavMusic(){if(!aOK())return;const c=AUD.ctx,t=c.currentTime;[196,220,247,262,294,330,392].forEach((f,i)=>{const o=c.createOscillator();o.type='sine';o.frequency.value=f;o.connect(envGain(t+i*0.5,0.035,0.6,5));o.start(t+i*0.5);o.stop(t+i*0.5+6);});}
// ---- opciones en los diálogos: Platón, Epicteto, Antístenes, Aristóteles niño
function cavOpts(n,add){const ro=MODE==='roma';
  if(!ro&&n.id==='platon'){const c=cavz();add(c.done?'Volver a la caverna':'¿Y si la caverna fuera algo más que una imagen?','quiz',()=>{const lack=cavReq();
      if(lack.length){$('dBody').innerHTML='<p>Platón sonríe. «Es una imagen, nada más. Todavía no la he escrito: la estoy buscando para un libro sobre la justicia. Pero a veces pienso que quien ha aprendido a mirar podría recorrerla de verdad…».</p><p class="sub">Para que Platón te guíe por la caverna necesitas: '+lack.join('; ')+'.</p>';renderOpts();return;}
      $('dBody').innerHTML='<p>Platón te mira largo rato. «Has aprendido a distinguir lo que sabes de lo que crees saber. Ven, siéntate. No es un lugar al que se llegue andando, pero quien ha aprendido a mirar puede recorrerlo. Cierra los ojos».</p><p class="sub">La República, donde está el mito, se escribirá hacia el 375 a.C. Aquí Platón todavía la está pensando: es una licencia del juego.</p>';
      const o=$('dOpts');o.innerHTML='';const b=document.createElement('button');b.className='quiz';b.innerHTML='<span class="n">1</span><span>'+(c.done?'Volver a la caverna':'Cerrar los ojos y entrar en la caverna')+'</span>';b.onclick=()=>{closeDialog();cavEnter();};o.appendChild(b);
      const b2=document.createElement('button');b2.innerHTML='<span class="n">2</span><span>Todavía no</span>';b2.onclick=()=>{$('dBody').innerHTML='<p>«Cuando quieras».</p>';renderOpts();};o.appendChild(b2);});}
  if(ro&&n.id==='epicteto'){const s=somz();add(s.done?'Volver al Sueño de Escipión':'¿Has leído el Sueño de Escipión?','quiz',()=>{const lack=cavReq();
      if(lack.length){$('dBody').innerHTML='<p>«Musonio nos lo hizo leer: es el final de la República de Cicerón. Un general sube en sueños hasta las estrellas y ve lo pequeña que es la Tierra. Algún día te lo prestaré, cuando estés preparado para leerlo de verdad».</p><p class="sub">Para que Epicteto te preste el libro necesitas: '+lack.join('; ')+'.</p>';renderOpts();return;}
      $('dBody').innerHTML='<p>Epicteto te da un rollo gastado. «Léelo esta noche, despacio. Cicerón dice que lo soñó otro; tú sueña que eres tú. Y mañana dime si la Fama sigue pareciéndote tan grande».</p><p class="sub">Es una licencia del juego: un sueño dentro del libro de Cicerón.</p>';
      const o=$('dOpts');o.innerHTML='';const b=document.createElement('button');b.className='quiz';b.innerHTML='<span class="n">1</span><span>Leer y dormirte</span>';b.onclick=()=>{closeDialog();cavEnter();};o.appendChild(b);
      const b2=document.createElement('button');b2.innerHTML='<span class="n">2</span><span>Otro día</span>';b2.onclick=()=>{$('dBody').innerHTML='<p>«Cuando quieras».</p>';renderOpts();};o.appendChild(b2);});}
  if(!ro&&n.id==='antistenes')add('¿Qué piensas de las Ideas de Platón?','quiz',()=>{const seen=cavz().forms.caballo;$('dBody').innerHTML='<p>Antístenes suelta una carcajada. «Se lo dije en la cara: “Veo un caballo, Platón, pero no veo la caballeidad”. ¿Sabes qué me contestó? Que tengo ojos para ver el caballo, pero no con qué ver la caballeidad. ¡Él, que vive en las nubes!».</p>'+(seen?'<p>Le cuentas que has visto el Caballo mismo, blanco e inmóvil. Te mira con lástima: «Lo que has visto es un sueño. La virtud se practica aquí abajo, con hambre y con frío».</p>':'')+'<p class="sub">La anécdota la cuenta Simplicio, en su comentario a las Categorías de Aristóteles. Diógenes Laercio (VI 53) le atribuye una parecida a Diógenes el Cínico, alumno de Antístenes.</p>';renderOpts();});
  if(!ro&&n.id==='aristoteles_nino'&&cavz().done)add('He salido de la caverna de Platón','quiz',()=>{$('dBody').innerHTML='<p>El niño frunce el ceño y piensa mucho. «¿Y por qué tendría que haber otro caballo, perfecto, en otro sitio? ¿No será que la forma del caballo está dentro de cada caballo, igual que la forma de la estatua está en el bronce?».</p><p class="sub">Es lo que Aristóteles defenderá de mayor, cuando estudie en la Academia y discuta con Platón: la forma está en las cosas. Aquí lo dice con ocho años: una licencia del juego.</p>';renderOpts();});}
// ---- pista en Delfos
function cavHint(){if(MODE!=='atenas'||cavz().done||qLv('so')<7)return '';return '<p>Al salir, lees otra vez la inscripción del pronaos: <b>«Conócete a ti mismo»</b>. Un profeta te dice en voz baja: «La Pitia ha añadido algo para ti: “Busca la luz bajo tierra, con el que enseña en el bosque de Academo”».</p>';}

