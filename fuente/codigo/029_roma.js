// ============================================================ ROMA: construcción del mundo
const ROMA={chariots:[],glad:[],crowd:null,theatres:[],peds:[],school:[]};
function romaRoads(){
  ROADS.length=0;
  const R2=(name,w,pts)=>ROADS.push({name,w,pts});
  R2('Vía Sacra',5,[[-55,-22],[40,-26],[100,-26],[200,10],[290,52]]);
  R2('Vico Tusco',3.5,[[23,30],[22,84],[-60,98],[-200,112],[-300,140]]);
  R2('Clivo Capitolino',3.5,[[-85,10],[-130,20],[-165,24],[-195,18]]);
  R2('Argileto',4,[[-42,-40],[-45,-105],[112,-108],[112,-262],[230,-380]]);
  R2('Vía Lata',5,[[-190,-110],[-320,-380],[-470,-760]]);
  R2('Vía Apia',5,[[330,180],[440,440],[700,680],[1000,900],[1300,1180]]);
  R2('Vía Ostiense',4.5,[[-200,420],[-260,560],[-180,760],[-80,900],[60,1300]]);
  R2('Puentes de la isla',3.5,[[-300,140],[-440,250],[-520,250],[-600,250],[-760,320],[-950,380]]);
  R2('Vía Labicana',4.5,[[500,60],[800,30],[1300,-30]]);
  R2('Vía Recta',4,[[-420,-640],[-560,-645],[-900,-652],[-1030,-650]]);   // al norte del Panteón y del estadio, hasta el puente de Nerón (Lanciani, láms. 14-15)
  R2('Calle del Velabro',3.5,[[-90,45],[-200,100],[-300,140],[-440,180],[-444,290],[-442,360],[-420,430],[-416,520],[-424,590],[-445,640]]);
  R2('Clivo de Escauro',3.5,[[300,140],[420,240],[560,300],[800,400]]);
  R2('Calle del Trastévere',3.5,[[-760,620],[-760,320],[-820,0],[-820,-60]]);
  // calles de los barrios del norte y del este (por su trazado conocido, comprimido como el resto)
  R2('Vía Flaminia',5,[[-470,-760],[-620,-1180],[-700,-1600]]);
  R2('Vico Patricio',3.5,[[230,-380],[300,-560],[420,-900],[560,-1400]]);
  R2('Clivo Suburano',3.5,[[230,-380],[400,-345],[600,-330],[820,-300],[1300,-330]]);
  R2('Vico Largo',3.5,[[-10,-262],[10,-480],[40,-700],[70,-775]]);
  R2('Alta Semita',3.5,[[-330,-470],[-200,-590],[-40,-700],[70,-775]]);
  R2('Vía Salaria',4.5,[[70,-775],[20,-1000],[-40,-1500]]);
  R2('Vía Nomentana',4.5,[[70,-775],[200,-1000],[380,-1500]]);
}
function buildRome(){romeSteps().forEach(st=>st[1]());}
function romeSteps(){
  return [
  ['romaRoads',()=>{romaRoads();
  }],
  ['buildTerrain',()=>{Object.assign(INNER,{x:0,z:-170,size:2800});edgeSlots._c={};   // Roma: un cuadrado mayor, con los montes y la Vía Apia
    terrainInner=buildTerrain(INNER.size+300,664,INNER.x,INNER.z,true);
  }],
  ['buildTerrain',()=>{buildTerrain(14000,350,INNER.x,INNER.z,false);
  }],
  ['mar',()=>{const sea=SEA=new THREE.Mesh(new THREE.PlaneGeometry(30000,30000),new THREE.MeshPhongMaterial({color:'#5d7f78',shininess:60,specular:'#8fa8a0'}));
  sea.rotation.x=-Math.PI/2;sea.position.y=-2.2;scene.add(sea);
  }],
  ['montes',()=>{{const mm=new THREE.MeshLambertMaterial({color:'#a9b4bd',fog:false});const r=mulberry32(80);   // montes Sabinos y Albanos a lo lejos
for(let i=0;i<36;i++){const a=r()*TAU;if(Math.abs(wrapA(a-2.6))<0.55)continue;const d=4800+r()*1500,h=200+r()*420;const m=new THREE.Mesh(new THREE.ConeGeometry(900+r()*900,h,10,1),mm);m.position.set(INNER.x+Math.cos(a)*d,h/2-60,INNER.z+Math.sin(a)*d);m.rotation.y=r()*TAU;scene.add(m);}}
  }],
  ['romaForum',()=>{romaForum();}],
  ['romaCapitol',()=>{romaCapitol();}],
  ['romaPalatine',()=>{romaPalatine();}],
  ['romaColosseum',()=>{romaColosseum();}],
  ['romaCircus',()=>{romaCircus();}],
  ['romaFora',()=>{romaFora();}],
  ['romaCampus',()=>{romaCampus();}],
  ['romaTheatres',()=>{romaTheatres();}],
  ['romaRiver',()=>{romaRiver();try{romaTiberDock();}catch(e){console.warn('tiber',e);}}],
  ['romaOutskirts',()=>{romaOutskirts();}],
  ['ROMA_PLACES',()=>{ROMA_PLACES.forEach(p=>place(p[0],p[1],p[2],p[3],p[4][0],p[4][1],p[5]));
  }],
  ['romaTravel',()=>{romaTravel();}],
  ...Array.from({length:8},(_,k)=>['relieve',()=>{romaReliefChunk(k,8);}]),
  ['buildRomaDests',()=>{buildRomaDests();R.seed(80080);}],   // semilla: los barrios de Roma ya no dependen del azar que gastan los destinos
  ['romaTheatres',()=>{romaTheatres();}],
  ['buildGods',()=>{buildGods();}],
  ['romaSchools',()=>{romaSchools();
  }],
  ['romaQuarters',()=>{romaQuarters();
  }],
  ['romaCity',()=>{romaCity();
  }],
  ['romaDecor',()=>{romaDecor();
  }],
  ['applyFlats',()=>{applyFlats();
  }],
  ['finishColumns',()=>{finishColumns();
  }],
  ['for',()=>{for(const p of[[-62,-14],[-62,4],[40,10],[60,-14],[292,48],[292,70],[508,48],[508,70],[-190,26],[-230,26],[450,-80],[510,-80],[-655,-575],[-625,-575],[-218,330],[-218,380],[175,-112],[60,-118]])addTorch(p[0],p[1]);
  }],
  ['TORCH_SPOTS',()=>{TORCH_SPOTS.slice(0,110).forEach(p=>addTorch(p[0],p[1],2.1));
  }],
  ['PLACES',()=>{PLACES.forEach(pl=>{const s=stele(pl.x,pl.z,pl.rot,pl.id);signObjs.push({kind:'sign',data:pl,g:s.g,mk:s.mk,x:pl.x,z:pl.z});});
  }],
  ['romaNPCs',()=>{romaNPCs();
  }],
  ['placeNPCs',()=>{placeNPCs();
  }],
  ['romaWalkers',()=>{romaWalkers();
  }],
  ['buildMount',()=>{buildMount();
  }],
  ['buildAvatar',()=>{buildAvatar();
  }],
  ['finishRoofs',()=>{finishRoofs();
  }]];
}
// viajes desde Roma: el cochero junto a la Vía Apia y el naviero en el Emporio
function romaTravel(){
  {const p=findFree(470,472,1.5);arriero('atenas',p[0],p[1],-Math.PI/2);PORTS.atenas_n={x:p[0]-4,z:p[1],yaw:-Math.PI/2,label:'Roma, Vía Apia'};
   place('ro_viajes','Viajar por Italia','ITINERA','Junto a la Vía Apia esperan los cocheros que alquilan carros para viajar por Italia: hacia el sur, por la Apia; hacia el norte, por la Flaminia; por la costa, por la Aurelia. Para ir a Hispania, en cambio, hay que bajar al Emporio y embarcar.',p[0]+6,p[1]+5,0);}
  {const z=720,sx=romaRiverX(z)+romaRiverW(z)+2;buildPort('atenas','El Emporio',sx,z,-1,0);}
}
const CURIA={o:null,on:false};
function romaForum(){
  footprints.push({x:0,z:0,w:236,d:120,a:0,c:'#d8ccb4',reserve:true});
  // Rostra: tribuna con espolones de bronce
  {const gy=romaH(-70,-8),g=grp(-70,gy,-8,Math.PI/2);box(24,3.6+2,11,TRAV,0,1.8-1,0,g);box(24.4,0.4,11.4,M.marble,0,3.7,0,g);
   for(let i=0;i<8;i++){const b=new THREE.Mesh(new THREE.ConeGeometry(0.35,1.6,6),BRONZE2);b.rotation.x=Math.PI/2;b.position.set(-10+i*2.85,2.2,5.9);g.add(b);}
   addBox(-70,-8,11,24,0);footprints.push({x:-70,z:-8,w:11,d:24,a:0,c:'#d8ccb0'});}
  // Curia Julia: hueca y visitable. Sala de unos 25 × 17 m, con tres gradas bajas a cada lado para los bancos de los senadores, el tribunal del magistrado al fondo y, detrás, la Victoria de Tarento con su altar (Augusto, 29 a.C.)
  {const o={x:-70,z:-62},gy=romaH(o.x,o.z)-0.1,g=grp(o.x,gy,o.z,0),F=1.6,t=1,dw=2.2,dt=F+8.4;CURIA.o=o;CURIA.gy=gy;
   for(const sg of[-1,1])box(t,24,27,PLAST,sg*(9-t/2),9,0,g);box(18,24,t,PLAST,0,9,-(13.5-t/2),g);
   for(const sg of[-1,1])box(9-dw,24,t,PLAST,sg*(dw+(9-dw)/2),9,13.5-t/2,g);box(2*dw,21-dt,t,PLAST,0,(21+dt)/2,13.5-t/2,g);box(2*dw,F+3,t,PLAST,0,(F-3)/2,13.5-t/2,g);
   for(const sg of[-1,1]){box(9-dw+0.3,4,0.15,BRICK,sg*(dw+(9-dw)/2+0.15),2,13.6,g);box(0.15,4,27.3,BRICK,sg*9.08,2,0,g);}box(18.3,4,0.15,BRICK,0,2,-13.6,g);
   gableRoof(g,18.8,27.8,21,4.2,M.tile,PLAST);box(16,0.3,25,lam('#8a6a48'),0,20.85,0,g);   // techo de madera por dentro
   for(const s of[-1,0,1])box(2.2,3.4,0.2,M.dark,s*5,15,13.6,g);
   for(const sg of[-1,1]){const l=box(0.15,8.4,dw,BRONZE2,sg*(dw-0.1),F+4.2,13-t-dw/2+0.4,g);const w0=[o.x+sg*(dw-0.1),o.z+13-t+0.4],w1=[o.x+sg*(dw-0.1),o.z+13-t+0.4-dw];addSeg(w0[0],w0[1],w1[0],w1[1],0.12);}   // las puertas de bronce, abiertas hacia dentro
   stairs(g,o,0,13.5,10,1.6,gy,0);
   for(const[a,b,c,d]of[[-9,-13.5,9,-13.5],[-9,-13.5,-9,13.5],[9,-13.5,9,13.5],[-9,13.5,-dw,13.5],[dw,13.5,9,13.5]])addSeg(o.x+a,o.z+b,o.x+c,o.z+d,0.6);
   box(16,0.3,25,M.marble,0,F-0.15,0,g);box(7,0.02,15,lam('#9c7f6a'),0,F+0.01,1.5,g);addPlat(o.x,o.z+0.25,16.2,26.5,0,gy+F);
   for(const sg of[-1,1])for(let k=0;k<3;k++){const h=0.3*(3-k),x=7.45-k*1.1;box(1.1,h,20,M.marble,sg*x,F+h/2,1,g);addPlat(o.x+sg*x,o.z+1,1.1,20,0,gy+F+h);box(0.45,0.42,19,M.wood,sg*(x+0.25),F+h+0.21,1,g);}   // gradas y bancos (subsellia)
   box(9,0.7,3,M.marble,0,F+0.35,-10.5,g);addPlat(o.x,o.z-10.5,9,3,0,gy+F+0.7);for(const sg of[-1,1])box(0.7,0.5,0.6,lam('#efe6d2'),sg*1.3,F+0.95,-10.9,g);   // tribunal y sillas curules
   const gold=M.gold||lam('#c9a24a');box(1.8,2.6,1.8,M.marble,0,F+0.7+1.3,-12.2,g);const gl=new THREE.Mesh(new THREE.SphereGeometry(0.75,18,12),gold);gl.position.set(0,F+0.7+2.6+0.7,-12.2);g.add(gl);
   const vy=F+0.7+2.6+1.4;const bd=new THREE.Mesh(new THREE.CylinderGeometry(0.26,0.55,2.4,10),gold);bd.position.set(0,vy+1.2,-12.2);g.add(bd);const hd=new THREE.Mesh(new THREE.SphereGeometry(0.22,12,8),gold);hd.position.set(0,vy+2.65,-12.2);g.add(hd);
   for(const sg of[-1,1]){const w=box(0.08,2.1,0.9,gold,sg*0.45,vy+2.2,-12.55,g);w.rotation.z=sg*0.5;w.rotation.y=sg*0.35;}const wr=new THREE.Mesh(new THREE.TorusGeometry(0.28,0.05,6,16),gold);wr.position.set(0.55,vy+2.9,-11.9);g.add(wr);   // la Victoria sobre el globo, con la corona
   const sh=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,0.12,32),gold);sh.rotation.x=Math.PI/2;sh.position.set(0,F+12.5,-12.9);g.add(sh);   // el escudo de oro (clupeus virtutis)
   box(1.6,1.1,1.0,M.marble,0,F+0.55,-7.6,g);box(1.85,0.16,1.25,M.marble,0,F+1.18,-7.6,g);const fl=new THREE.Mesh(new THREE.ConeGeometry(0.22,0.6,7),new THREE.MeshBasicMaterial({color:0xff8a30,transparent:true,opacity:0.9}));fl.position.set(0,F+1.56,-7.6);g.add(fl);CURIA.fl=fl;addBox(o.x,o.z-7.6,1.6,1.0,0,0.2);   // el altar, con incienso y fuego
   footprints.push({x:o.x,z:o.z,w:18,d:27,a:0,c:'#c79a7e',name:'Curia'});}
  if(GLB.ok){const br=lam('#7d6a3e'),gb=lam('#a07c44');for(const[x,z,a]of[[-40,-30,0],[-20,-32,0],[0,-33,0],[20,-32,0],[-35,26,Math.PI],[-10,28,Math.PI],[100,-30,0],[-45,8,Math.PI/2]]){const gy=romaH(x,z),g=grp(x,gy,z,a);box(1.6,2.6,2.2,M.marble,0,1.3,0,g);box(1.9,0.3,2.5,M.marble,0,2.6,0,g);
    const st=makePerson({toga:true,chiton:'#7d6a3e',himation:'#7d6a3e',hair:'#7d6a3e',beard:R()<0.4,attrRoles:{cloth:br,drape:br,skin:gb,hair:br,sandal:br,eye:br}});st.scale.setScalar(1.25);st.position.y=2.75;g.add(st);addBox(x,z,1.6,2.2,a);}}
  basilica({x:20,z:-62,rot:0,L:88,D:28,name:'Basílica Emilia'});
  basilica({x:-31,z:60,rot:Math.PI,L:101,D:49,name:'Basílica Julia',hollow:true});   // 101 × 49 m (planta conservada); el borde este sigue en el Vico Tusco
  romanTemple({x:-105,z:25,rot:Math.PI/2,W:22,L:40,pod:6,colD:1.4,colH:11,nW:6,deep:2,order:'ionic',pseudo:true,name:'Templo de Saturno'});
  romanTemple({x:-114,z:-28,rot:Math.PI/2,W:26,L:28,pod:4,colD:1.3,colH:12,nW:6,deep:1,name:'Templo de la Concordia'});
  romanTemple({x:45,z:40,rot:Math.PI,W:32,L:50,pod:6.5,colD:1.45,colH:12.5,nW:8,deep:3,peri:true,name:'Templo de Cástor y Pólux'});
  romanTemple({x:80,z:0,rot:-Math.PI/2,W:24,L:30,pod:5,colD:1.1,colH:10,nW:6,deep:2,order:'ionic',name:'Templo del Divino Julio'});
  roundTemple({x:75,z:42,r:7.5,colD:0.75,colH:9,n:20,pod:2.5,rot:-Math.PI/2,name:'Templo de Vesta'});
  // Casa de las Vestales: patio con pórticos y estanques
  {const cx=118,cz=50,g=grp(cx,romaH(cx,cz),cz,0);for(const s of[-1,1])box(56,9,0.9,PLAST,0,4.5,s*14,g);box(0.9,9,28,PLAST,28,4.5,0,g);box(0.9,9,10,PLAST,-28,4.5,-9,g);box(0.9,9,10,PLAST,-28,4.5,9,g);
   box(36,0.4,6,lam('#4f7f8a'),0,0.25,0,g);for(let i=0;i<9;i++)for(const s of[-1,1])addColumn(cx-22+i*5.5,romaH(cx,cz),cz+s*10.5,0.32,6,0,'ionic',true);
   addSeg(cx-28,cz-14,cx+28,cz-14);addSeg(cx-28,cz+14,cx+28,cz+14);addSeg(cx+28,cz-14,cx+28,cz+14);addSeg(cx-28,cz-14,cx-28,cz-4);addSeg(cx-28,cz+4,cx-28,cz+14);
   footprints.push({x:cx,z:cz,w:56,d:28,a:0,c:'#e2d6c0',name:'Casa de las Vestales'});
   for(let i=0;i<6;i++){const f=makePerson({female:true,chiton:'#f4efe4',himation:'#f4efe4',veil:'#f4efe4',skin:'#e9dcc8',scale:0.9});f.position.set(cx-18+i*7,romaH(cx,cz)+0.6,cz+(i%2?-10.5:10.5));f.rotation.y=i%2?0:Math.PI;scene.add(f);}}
  // Tabularium: muro de arcadas en la ladera del Capitolio
  {const gy=romaH(-132,-30)-2,top=romaH(-214,-42)+3,g=grp(-140,gy,-30,Math.PI/2);const w=new THREE.Mesh(new THREE.BoxGeometry(70,top-gy,14),[TUFA,TUFA,TRAV,TRAV,texMat(RTEX.arcade,9,3),TUFA]);w.position.set(0,(top-gy)/2,0);w.castShadow=true;g.add(w);
   addBox(-140,-30,14,70,0);footprints.push({x:-140,z:-30,w:14,d:70,a:0,c:'#bdb29a',name:'Tabularium'});}
  // librería de Atrecto en el Argileto
  {const g=grp(-28,romaH(-28,-90),-90,-Math.PI/2);box(8,5,6,PLAST,0,2.5,-3.2,g);box(8.4,0.3,6.4,M.tile,0,5.1,-3.2,g);for(const s of[-1,1]){box(0.5,3.2,0.5,M.wood,s*3,1.6,0.2,g);box(0.7,0.25,0.7,lam('#efe6d0'),s*3,2.4,0.3,g);}
   box(4,1,1.2,M.wood,0,0.5,1,g);for(let i=0;i<10;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.4,6),lam(pick(['#efe6d0','#d9c9a0','#c9b48b'])));c.rotation.z=Math.PI/2;c.position.set(-1.6+i*0.35,1.07,1+((i%3)-1)*0.25);g.add(c);}
   addBox(-28+3.2,-90,6,8,0);}
}
function romaCapitol(){
  const top=romaH(-228,22);
  romanTemple({x:-228,z:22,rot:0,W:53,L:62,pod:4,gy:top-0.4,colD:1.9,colH:15,nW:6,deep:3,peri:true,roofMat:lam('#c9a24a'),name:'Templo de Júpiter Óptimo Máximo'});
  romanTemple({x:-218,z:-108,rot:Math.PI/2,W:14,L:20,pod:2.5,gy:romaH(-218,-108)-0.3,colD:0.8,colH:8,nW:4,deep:2,name:'Templo de Juno Moneta'});
  const tr=[];for(let i=0;i<40;i++){const a=R()*TAU,r=rr(10,70),x=-220+Math.cos(a)*r*0.8,z=-40+Math.sin(a)*r*1.6;const h=romaH(x,z);if(h>18&&Math.hypot(x+228,z-22)>42&&Math.hypot(x+218,z+108)>16&&Math.abs(x+140)>12&&clivusAt(x,z).d>8)tr.push({x,z,kind:R()<0.6?'pine':'cypress'});}
  place('ro_clivus','Clivus Capitolinus','CLIVVS CAPITOLINVS','La única calle por la que suben los carros al Capitolio: una cuesta empinada y pavimentada que sale del Foro junto al templo de Saturno y gira hacia la cumbre de Júpiter. Por aquí suben los generales en el triunfo y los cónsules el día que toman posesión. El Capitolio tiene dos cumbres: el Capitolium, al sur, con el templo de Júpiter, y el Arx, la ciudadela, al norte, con el templo de Juno Moneta (donde se acuña la moneda) y el auguraculum, desde donde los augures observan el vuelo de las aves. Entre ambas, la hondonada del Asylum, donde según la leyenda Rómulo acogió a fugitivos para poblar Roma.',-150,24,0);
  if(GLB.ok)treesGLB(tr);
}
function romaPalatine(){
  const top=romaH(40,195);
  // palacio de Tiberio, al norte, sobre el Foro: bloques de varios pisos con ventanas
  {const g=grp(-45,top-0.3,150,0);const w=new THREE.Mesh(new THREE.BoxGeometry(110,24,50),[texMat(RTEX.windows,8,2),texMat(RTEX.windows,8,2),M.tile,M.tile,texMat(RTEX.windows,14,2),texMat(RTEX.windows,14,2)]);w.position.y=10;w.castShadow=true;g.add(w);
   gableRoof(g,112,52,22,5,M.tile,BRICK,true);addBox(-45,150,110,50,0);footprints.push({x:-45,z:150,w:110,d:50,a:0,c:'#c79a7e',name:'Casa de Tiberio'});}
  // palacio de los Flavios en obras: muros de ladrillo a medio levantar, andamios y una grúa de rueda
  {const cx=95,cz=215,gy=top-0.3,g=grp(cx,gy,cz,0),wm=texMat(RTEX.brick,6,3);
   const walls=[[-40,-30,80,1.6,14],[-40,30,80,1.6,9],[-40,-30,1.6,60,12],[40,-30,1.6,60,18],[-10,-30,1.6,40,7],[15,0,50,1.6,5]];
   for(const[x0,z0,w,d,h]of walls){box(w,h+1,d,wm,x0+w/2,(h+1)/2-1,z0+d/2,g);const p=toW(x0,z0,cx,cz,0),q=toW(x0+w,z0+d,cx,cz,0);if(w>d)addSeg(p[0],(p[1]+q[1])/2,q[0],(p[1]+q[1])/2,d/2);else addSeg((p[0]+q[0])/2,p[1],(p[0]+q[0])/2,q[1],w/2);}
   for(let i=0;i<14;i++){const px=-38+i*6;for(const pz of[-32,-27.5]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,16,5),M.wood);c.position.set(px,8,pz);g.add(c);}}
   for(const y of[4,8,12])box(84,0.12,4.6,M.wood,0,y,-29.7,g);
   const crane=grp(cx+5,gy,cz+10,0.4);const wheel=new THREE.Mesh(new THREE.TorusGeometry(2.4,0.18,6,20),M.wood);wheel.position.set(0,2.6,0);crane.add(wheel);ROMA.wheel=wheel;
   for(const s of[-1,1]){const l=box(0.3,16,0.3,M.wood,s*1.4,7.5,-1.5,crane);l.rotation.x=0.35;}const boom=box(0.3,0.3,10,M.wood,0,14.5,-5,crane);
   footprints.push({x:cx,z:cz,w:80,d:60,a:0,c:'#c79a7e',name:'Palacio en obras'});
   for(let i=0;i<5;i++){const w=makePerson({short:true,chiton:pick(['#a89070','#8a7350','#c9b48b']),hair:'#2a1e16',beard:R()<0.5,carry:i%2?'basket':null});w.position.set(cx-30+i*12,gy,cz-24);w.rotation.y=Math.PI;scene.add(w);}}
  romanTemple({x:0,z:240,rot:0,W:22,L:40,pod:4,gy:top-0.4,colD:1.2,colH:11,nW:6,deep:2,pseudo:true,name:'Templo de Apolo Palatino'});
  romaMagnaMater(top);
  // casa de Augusto (una domus grande) y cabaña de Rómulo
  if(GLB.ok)placeModules('H_dom',[{x:-38,y:top-0.3,z:232,a:Math.PI,sx:1.3,sy:1,sz:1,cp:new THREE.Color('#e6dcc6'),cr:new THREE.Color('#b0563a')}],{far:1800});
  addBox(-38,232,23,39,0);footprints.push({x:-38,z:232,w:23,d:39,a:0,c:'#d6c6a6',name:'Casa de Augusto'});   // entera sobre la cima: antes asomaba por el borde del Palatino
  {const g=grp(-72,romaH(-72,250),250,0);const w=new THREE.Mesh(new THREE.CylinderGeometry(2.6,2.8,2.2,12),lam('#8a6e4c'));w.position.y=1.1;g.add(w);const rf=new THREE.Mesh(new THREE.ConeGeometry(3.4,3.2,12),lam('#a8925a'));rf.position.y=3.7;g.add(rf);box(1,1.8,0.2,M.dark,0,0.9,2.65,g);addCirc(-72,250,2.8);}
  const tr=[];for(let i=0;i<80;i++){const x=rr(-115,195),z=rr(120,275);if(romaH(x,z)>top-4)tr.push({x,z,kind:pick(['pine','pine','cypress','plane'])});}
  if(GLB.ok)treesGLB(tr.filter(t=>isFree(t.x,t.z,2)));
}
function romaColosseum(){
  const C={x:400,z:60},gy=2,A=94,B=78;ROMA.col=C;
  footprints.push({x:C.x,z:C.z,r:86,c:'#d8ccb0',name:'Anfiteatro Flavio'});
  // fachada: 80 arcos por piso (toscano, jónico, corintio) y ático con ventanas
  const N=80,lv=[['B_bay_tus',0],['B_bay_ion',10.5],['B_bay_cor',22.3],['B_bay_att',34.1]],items=lv.map(()=>[]);
  let per=0;{let px=A,pz=0;for(let i=1;i<=400;i++){const t=i/400*TAU,x=A*Math.cos(t),z=B*Math.sin(t);per+=Math.hypot(x-px,z-pz);px=x;pz=z;}}
  for(let i=0;i<N;i++){const t=(i+0.5)/N*TAU,nx=Math.cos(t)/A,nz=Math.sin(t)/B,nl=Math.hypot(nx,nz),x=C.x+(A-1.2)*Math.cos(t),z=C.z+(B-1.2)*Math.sin(t),a=Math.atan2(nx/nl,nz/nl);
    lv.forEach((L,k)=>items[k].push({x,y:gy+L[1],z,a,sx:per/N/7.3}));
    const t2=i/N*TAU;addCirc(C.x+(A-1.2)*Math.cos(t2),C.z+(B-1.2)*Math.sin(t2),1.25);}
  if(GLB.ok&&GLB.parts.B_bay_tus)lv.forEach((L,k)=>placeModules(L[0],items[k],{far:2600}));
  else{const w=new THREE.Mesh(new THREE.CylinderGeometry(1,1,48,64,1,true),texMat(RTEX.arcade,40,4));w.material.side=THREE.DoubleSide;w.scale.set(A,1,B);w.position.set(C.x,gy+24,C.z);scene.add(w);}
  const tunnel=(u)=>{const t=u*TAU;return Math.abs(Math.sin(t))<0.13;};
  // muro interior del deambulatorio, gradas por sectores y podio de la arena
  ringMesh(ringGeo(2,96,(u,k)=>{const t=u*TAU;return[(A-7)*Math.cos(t),k?40:0,(B-7)*Math.sin(t)];},u=>tunnel(u),()=>'#bfb39a'),C.x,gy,C.z);
  const ST=30,ai=41.5,bi=24,ao=A-7,bo=B-7;
  const P=(u,k)=>{const t=u*TAU;let s,y;if(k===0){s=0;y=0;}else if(k===1){s=0;y=4.2;}else{const j=Math.floor((k-2)/2),e=(k-2)%2;s=(j+e)/ST;y=4.2+(40-4.2)*(j+1)/ST;}const a=lerp(ai,ao,s),b=lerp(bi,bo,s);return[a*Math.cos(t),y,b*Math.sin(t)];};
  ringMesh(ringGeo(2+ST*2+1,128,P,u=>tunnel(u),k=>k<2?'#e9e0cc':(k%2?(k<24?'#e6dccb':k<46?'#d8ccb4':'#c9b9a0'):'#bfb39b')),C.x,gy,C.z);
  {const ar=new THREE.Mesh(new THREE.CircleGeometry(1,64),lam('#b39a6c'));ar.rotation.x=-Math.PI/2;ar.scale.set(ai,bi,1);ar.position.set(C.x,gy+0.05,C.z);ar.receiveShadow=true;scene.add(ar);}
  // pasillos de entrada a la arena por los extremos del eje mayor
  for(const s of[-1,1]){const g=grp(C.x+s*(ai+ao)/2,gy,C.z,0),len=ao-ai+2;for(const w of[-1,1]){box(len,7,1,TRAV2,0,3.5,w*3.2,g);addSeg(C.x+s*(ai-1),C.z+w*3.2,C.x+s*(A+1),C.z+w*3.2,0.5);}box(len,0.8,7.4,TRAV2,0,7.4,0,g);}
  for(let i=0;i<96;i++){const t0=i/96*TAU,t1=(i+1)/96*TAU,tm=(t0+t1)/2,sn=Math.abs(Math.sin(tm));
    if(sn>0.13)addSeg(C.x+ai*Math.cos(t0),C.z+bi*Math.sin(t0),C.x+ai*Math.cos(t1),C.z+bi*Math.sin(t1),0.4);
    if(sn>0.045)addSeg(C.x+ao*Math.cos(t0),C.z+bo*Math.sin(t0),C.x+ao*Math.cos(t1),C.z+bo*Math.sin(t1),0.5);}
  // público en las gradas
  {const geo=new THREE.CylinderGeometry(0.2,0.26,1.15,5);geo.translate(0,0.58,0);const it=[],cols=['#efe8da','#e2d6c0','#a8392b','#4f6a7d','#c9a24a','#8a7350','#f4efe4','#6a4d7a','#3f7a3a'];const m=new THREE.Matrix4(),q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),sc=new THREE.Vector3(1,1,1),p=new THREE.Vector3();
   for(let j=0;j<ST;j++){const s=(j+0.5)/ST,a=lerp(ai,ao,s),b=lerp(bi,bo,s),y=gy+4.2+(40-4.2)*(j+1)/ST,n=Math.round(TAU*Math.sqrt((a*a+b*b)/2)/1.6);
     for(let i=0;i<n;i++){if(R()<0.35)continue;const t=(i+rr(-0.2,0.2))/n*TAU;if(Math.abs(Math.sin(t))<0.16)continue;p.set(C.x+a*Math.cos(t),y,C.z+b*Math.sin(t));q.setFromAxisAngle(up,Math.atan2(-Math.cos(t),-Math.sin(t)));sc.set(1,rr(0.9,1.1),1);it.push({m:new THREE.Matrix4().compose(p,q,sc),c:new THREE.Color(pick(cols))});}}
   chunked(geo,WHITE_M,it,{cell:90,far:700,shadow:false});}
  // el palco imperial (eje menor, lado sur) con un toldo rojo
  {const g=grp(C.x,gy,C.z+bi+5,0);box(14,1,6,M.marble,0,6,0,g);box(14,0.2,6,lam('#a8392b'),0,10,0,g);for(const s of[-1,1])box(0.4,4,0.4,M.gold,s*6.5,8,2.8,g);}
  // gladiadores combatiendo y un juez
  const mk=(look,x,z)=>{const g=makePerson(look);g.position.set(x,gy+0.05,z);scene.add(g);return g;};
  ROMA.glad=[mk({soldier:'nospear',chiton:'#8a2a1e',hair:'#2a1e16'},C.x+4,C.z-6),mk({short:true,chiton:'#c9b48b',hair:'#3a2a1e',spear:false,staff:true},C.x+8,C.z-4),mk({short:true,chiton:'#efe8da',hair:'#3a2a1e',staff:true},C.x+14,C.z-12)];
  // el Coloso (Nerón convertido en el Sol) sobre su basa
  {const bx=290,bz=-24,gb=romaH(bx,bz);const g=grp(bx,gb,bz,-0.3);box(12,9,12,TRAV,0,4.5,0,g);box(12.6,0.8,12.6,M.marble,0,9.2,0,g);addBox(bx,bz,12,12,-0.3);
   if(GLB.ok){const br=lam('#a07c44'),st=makePerson({chiton:'#a07c44',himation:'#8a6a3a',skin:'#b08a4a',hair:'#8a6a3a',attrRoles:{cloth:br,drape:lam('#8a6a3a'),skin:lam('#b08a4a'),hair:lam('#8a6a3a'),sandal:br,eye:br},staff:true});st.scale.setScalar(15);st.position.y=9.6;g.add(st);
     for(let i=0;i<7;i++){const r=new THREE.Mesh(new THREE.ConeGeometry(0.35,3.8,5),lam('#c9a24a'));const t=-1.2+i*0.4;r.position.set(Math.sin(t)*2.1,9.6+15*1.97,Math.cos(t)*0.6-0.5);r.rotation.z=-Math.sin(t)*0.5;g.add(r);}}
   footprints.push({x:bx,z:bz,w:12,d:12,a:-0.3,c:'#d8ccb0'});}
  // Meta Sudans, la fuente cónica junto al anfiteatro
  {const g=grp(300,romaH(300,90),90,0);const b=new THREE.Mesh(new THREE.CylinderGeometry(8,8,0.8,24),TRAV);b.position.y=0.4;g.add(b);const w=new THREE.Mesh(new THREE.CylinderGeometry(7.4,7.4,0.3,24),lam('#5d8a90'));w.position.y=0.75;g.add(w);
   const cn=new THREE.Mesh(new THREE.ConeGeometry(2.2,14,16),BRICK);cn.position.y=7.5;g.add(cn);addCirc(300,90,8);}
  // Termas de Tito, sobre una terraza al norte del anfiteatro
  {const cx=480,cz=-140,gy=romaH(cx,cz)-0.1,g=grp(cx,gy,cz,0);
   termasInterior(cx,cz,gy);for(const s of[-1,1])box(28,15+3,56,PLAST,s*47,(15+3)/2-3,-4,g);   // el bloque central se puede visitar (172_interiores_roma.js)
   const v=new THREE.Mesh(new THREE.CylinderGeometry(22,22,70,20,1,false,0,Math.PI),M.tile);v.rotation.z=Math.PI/2;v.scale.set(0.45,1,1);v.position.set(0,22,-4);g.add(v);
   const dm=new THREE.Mesh(new THREE.SphereGeometry(10,20,10,0,TAU,0,Math.PI/2),LEAD);dm.position.set(0,22,-4);g.add(dm);
   for(let i=0;i<8;i++){const lx=-28+i*8,wp=toW(lx,24,cx,cz,0);addColumn(wp[0],gy+0.6,wp[1],0.6,10,0,'corinthian');}
   box(70,1.4,7,M.marbleShade,0,11.3,23.5,g);gableRoof(g,72,8,12,3.4,M.tile,PLAST,true);box(72,0.6,9,TRAV,0,0.3,23.5,g);addPlat(cx,cz+23.5,72,9,0,gy+0.6);
   for(const s of[-1,1])addBox(cx+s*47,cz-4,28,56,0);footprints.push({x:cx,z:cz-4,w:124,d:56,a:0,c:'#e2d6c0',name:'Termas de Tito'});}
}
function romaCircus(){
  const C={x:65,z:405},gy=1,Lh=260,CA=CIRC_A,co=Math.cos(CA),si=Math.sin(CA),cr=(lx,lz)=>[C.x+lx*co+lz*si,C.z-lx*si+lz*co];ROMA.circ=C;   // girado como en la Forma Urbis de Lanciani (lám. 35): del Foro Boario hacia la Puerta Capena
  footprints.push({x:C.x+20,z:C.z,w:660,d:380,a:0,c:'#d8ccb0',reserve:true});
  const st=(u,R)=>{if(u<0.35){const s=u/0.35;return[-Lh+2*Lh*s,-R];}if(u<0.5){const t=-Math.PI/2+(u-0.35)/0.15*Math.PI;return[Lh+Math.cos(t)*R,Math.sin(t)*R];}if(u<0.85){const s=(u-0.5)/0.35;return[Lh-2*Lh*s,R];}const t=Math.PI/2+(u-0.85)/0.15*Math.PI;return[-Lh+Math.cos(t)*R,Math.sin(t)*R];};
  const skip=u=>u>0.85||Math.abs(u-0.425)<0.012;const ST=14,R0=43,R1=78;   // arena de unos 84-87 m de ancho (Platner-Ashby)
  const P=(u,k)=>{let r,y;if(k===0){r=R0;y=0;}else if(k===1){r=R0;y=3.2;}else{const j=Math.floor((k-2)/2),e=(k-2)%2;r=R0+2+(R1-R0-4)*(j+e)/ST;y=3.2+(26-3.2)*(j+1)/ST;}const p=st(u,r);return[p[0],y,p[1]];};
  ringMesh(ringGeo(2+ST*2+1,140,P,skip,k=>k<2?'#e2d9c6':(k%2?'#e0d6c2':'#c8bca4')),C.x,gy,C.z,CA);
  {const t=RTEX.arcade.clone();t.needsUpdate=true;t.repeat.set(1,1.5);const w=new THREE.Mesh(ringGeo(2,140,(u,k)=>{const p=st(u,R1+1);return[p[0],k?30:0,p[1]];},skip,()=>'#ffffff',Math.round((4*Lh+TAU*R1)/12)),new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide}));w.position.set(C.x,gy,C.z);w.rotation.y=CA;w.castShadow=true;scene.add(w);}
  for(let i=0;i<140;i++){const u0=i/140,u1=(i+1)/140;if(skip((u0+u1)/2))continue;for(const R of[R0,R1+1]){const a=st(u0,R),b=st(u1,R),A=cr(a[0],a[1]),B=cr(b[0],b[1]);addSeg(A[0],A[1],B[0],B[1],0.5);}}
  // las cárceres: doce puertas de salida en el extremo oeste
  {const cp=cr(-Lh-6,0),g=grp(cp[0],gy,cp[1],CA);box(12,11,2*R1,TRAV,0,5.5,0,g);for(let i=0;i<12;i++)box(0.2,6,4.4,M.dark,6.05,3,-34+i*6.2,g);for(const s of[-1,1])box(14,16,14,TRAV2,0,8,s*(R1-6),g);
   for(const[ax,az,bx,bz]of[[-Lh,-R1,-Lh,-6],[-Lh,6,-Lh,R1],[-Lh-12,-R1,-Lh-12,-6],[-Lh-12,6,-Lh-12,R1]]){const A=cr(ax,az),B=cr(bx,bz);addSeg(A[0],A[1],B[0],B[1],0.6);}}
  // la espina: muro bajo con estanques, metas y el obelisco de Augusto
  {const g=grp(C.x,gy,C.z,CA);box(344,2.2,8,M.marble,0,1.1,0,g);for(let i=0;i<6;i++)box(26,0.4,5,lam('#4f7f8a'),-150+i*60,2.3,0,g);addBox(C.x,C.z,344,8,CA);   // espina de unos 344 m
   if(GLB.ok&&GLB.parts.B_obelisk){placeModules('B_obelisk',[{x:C.x,y:gy+2.2,z:C.z,a:CA,sx:1}],{far:3000});const m1=cr(-176,0),m2=cr(176,0);placeModules('B_meta',[{x:m1[0],y:gy,z:m1[1],a:CA,sx:1.2},{x:m2[0],y:gy,z:m2[1],a:CA,sx:1.2}],{far:2400});}
   else{const ob=new THREE.Mesh(new THREE.CylinderGeometry(0.8,1.6,24,4),lam('#9a6a5e'));ob.position.set(0,14,0);g.add(ob);}
   for(let i=0;i<7;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(0.4,8,6),BRONZE2);d.scale.set(1,0.6,2);d.position.set(120+i*1.6,4.2,0);g.add(d);}
   {const m1=cr(-176,0),m2=cr(176,0);addCirc(m1[0],m1[1],3);addCirc(m2[0],m2[1],3);}}
  // público
  {const geo=new THREE.CylinderGeometry(0.2,0.26,1.15,5);geo.translate(0,0.58,0);const it=[],cols=['#efe8da','#e2d6c0','#3f7a3a','#2f4c86','#a8392b','#c9b48b','#f4efe4'],q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),p=new THREE.Vector3(),sc=new THREE.Vector3(1,1,1);
   for(let j=0;j<ST;j++){const r=R0+2+(R1-R0-4)*(j+0.5)/ST,y=gy+3.2+(26-3.2)*(j+1)/ST;for(let i=0;i<900;i++){if(R()<0.45)continue;const u=(i+R())/900;if(skip(u))continue;const a=st(u,r),b=st(u+0.001,r);{const A=cr(a[0],a[1]);p.set(A[0],y,A[1]);}q.setFromAxisAngle(up,Math.atan2(b[0]-a[0],b[1]-a[1])-Math.PI/2+CA);it.push({m:new THREE.Matrix4().compose(p,q,sc),c:new THREE.Color(pick(cols))});}}
   chunked(geo,WHITE_M,it,{cell:120,far:800,shadow:false});}
  // cuadrigas: verdes, azules, rojos y blancos
  const fac=[['#3f7a3a','Verdes'],['#2f4c86','Azules'],['#a8392b','Rojos'],['#efe8da','Blancos']];
  fac.forEach((f,i)=>{const g=new THREE.Group();scene.add(g);let legs=[];
    if(GLB.ok&&GLB.parts.B_chariot){const ch=glbPart('B_chariot',{chariotpaint:lam(f[0])});ch.position.set(0,0,0);g.add(ch);
      for(const s of[-1,1]){const h=new THREE.Group();h.position.set(s*0.55,0,2.4);h.scale.setScalar(0.92);legs=legs.concat(animalGLB('A_horse',h,pick(['#5a3a22','#3a2a1e','#8a6a4a','#d8d0c0']),'#1e140e'));g.add(h);}}
    else{box(1.2,1,1.4,lam(f[0]),0,0.7,0,g);box(1.4,1.4,2.4,lam('#5a3a22'),0,1.4,2.4,g);}
    const d=makePerson({short:true,chiton:f[0],hair:'#2a1e16'});d.position.set(0,0.25,-0.6);g.add(d);
    {const P0=cr(200-i*14,-22);g.position.set(P0[0],1.02,P0[1]);}g.rotation.y=-Math.PI/2+CA;ROMA.chariots.push({g,legs,s:i*14,v:13+i*0.6,lane:-6+i*4,ph:R()*6});});
  // Félix y unos mozos junto a las cárceres; caballos de repuesto
  ROMA.circus={C,Lh,cr,CA};if(typeof NPC_POS!=='undefined'){const a=cr(-300,-30);NPC_POS.auriga=[a[0],a[1],Math.PI/2+CA];}
}
function romaFora(){
  // Foro de César: plaza con pórticos y el templo de Venus Genetrix al fondo
  {const x0=-150,x1=-20,zN=-160,zS=-122,gy=romaH(-85,-140);porticus(x0+12,zN,x1,zN,8,8,'corinthian',1,gy);porticus(x0+12,zS,x1,zS,8,8,'corinthian',-1,gy);
   romanTemple({x:-140,z:-141,rot:Math.PI/2,W:22,L:30,pod:5,gy:gy-0.2,colD:1.3,colH:12,nW:8,deep:2,peri:true,name:'Templo de Venus Genetrix'});
   footprints.push({x:-85,z:-141,w:130,d:46,a:0,c:'#d8ccb4',reserve:true});}
  // Foro de Augusto: templo de Marte Vengador ante un gran muro cortafuegos
  {const gy=romaH(40,-195);romanTemple({x:40,z:-222,rot:0,W:36,L:46,pod:3.5,gy:gy-0.2,colD:1.75,colH:17.5,nW:8,deep:3,peri:true,name:'Templo de Marte Vengador'});
   const g=grp(40,gy,-258,0);box(130,33,3,TUFA,0,16.5-1,0,g);addSeg(-25,-258,105,-258,1.6);
   porticus(-18,-250,-18,-140,10,9,'corinthian',-1,gy);porticus(98,-250,98,-140,10,9,'corinthian',1,gy);
   for(const s of[-1,1]){const ex=ringGeo(2,20,(u,k)=>{const t=-Math.PI/2+u*Math.PI;return[Math.cos(t)*20*s,k?14:0,Math.sin(t)*20];},null,()=>'#bfb39a');ringMesh(ex,40+s*58,gy,-200);}
   footprints.push({x:40,z:-195,w:120,d:120,a:0,c:'#d8ccb4',reserve:true});}
  // Templo de la Paz: jardín con estanques y rosales entre pórticos; al fondo, la sala con el botín de Jerusalén
  {const cx=175,cz=-175,gy=romaH(cx,cz);porticus(cx-55,cz-55,cx+40,cz-55,8,9,'corinthian',1,gy);porticus(cx-55,cz+55,cx+40,cz+55,8,9,'corinthian',-1,gy);porticus(cx-55,cz-55,cx-55,cz+55,8,9,'corinthian',-1,gy);
   const g=grp(cx+52,gy,cz,0);box(24,18,110,PLAST,6,9,0,g);gableRoof(g,25,111,18,4,M.tile,PLAST);for(let i=0;i<6;i++){const wp=toW(-7,-15+i*6,cx+52,cz,0);addColumn(wp[0],gy+0.6,wp[1],0.7,13,0,'corinthian');}
   box(8,0.6,40,TRAV,-5,0.3,0,g);addPlat(cx+47,cz,8,40,0,gy+0.6);wsegO({x:cx+52,z:cz},0,-6,-55,-6,55);
   for(let r=0;r<3;r++)for(const s of[-1,1]){box(50,0.5,3,lam('#4f7f8a'),cx-8-(cx+52),0.25,cz+s*(10+r*13)-cz,g);}
   const roses=[];for(let i=0;i<220;i++){const x=cx+rr(-46,30),z=cz+rr(-46,46);if(Math.abs(Math.abs(z-cz)-10)%13<3)continue;roses.push({x,y:gy,z,a:R()*TAU,sx:rr(0.6,1),cf:new THREE.Color(pick(['#b8455a','#c96a7a','#6f8a45','#d88a9a']))});}
   placeModules('T_bush',roses,{far:700,shadow:false});
   menorah(cx+43,cz-4,-Math.PI/2);
   if(GLB.ok)treesGLB([[-40,-40],[-40,40],[20,-40],[20,40],[-10,-44],[-10,44]].map(p=>({x:cx+p[0],z:cz+p[1],kind:'plane',k:1.1,collide:true})));
   footprints.push({x:cx,z:cz,w:110,d:110,a:0,c:'#d8ccb4',reserve:true});}
}
function romaCampus(){
  // Panteón de Agripa: rotonda con cúpula y pórtico de ocho columnas hacia el norte
  {const cx=-640,cz=-540,gy=romaH(cx,cz)-0.2,g=grp(cx,gy,cz,Math.PI);
   const ro=new THREE.Mesh(new THREE.CylinderGeometry(26,26,24,40),texMat(RTEX.brick,20,4));ro.position.y=12;ro.castShadow=true;ro.userData.noCol=true;g.add(ro);
   const dm=new THREE.Mesh(new THREE.SphereGeometry(26,40,14,0,TAU,0,Math.PI/2),LEAD);dm.scale.y=0.62;dm.position.y=24;dm.castShadow=true;dm.userData.noCol=true;g.add(dm);
   for(const sx of[-1,1])box(14,22,10,PLAST,sx*10,11,28,g);box(6,11,10,PLAST,0,16.5,28,g);   // bloque entre pórtico y rotonda, con la puerta (6 m) en medio
   const o={x:cx,z:cz,rot:Math.PI};romanTemple({x:cx,z:cz-40,rot:Math.PI,W:34,L:16,pod:1.2,gy,colD:1.5,colH:12.5,nW:8,deep:3,fullPorch:true,name:'Panteón'});
   // muro de la rotonda: anillo de colisión con hueco frente a la puerta (al norte), y el bloque de la entrada con su paso
   {const N=48,gap=0.13;for(let i=0;i<N;i++){const a0=i/N*TAU,a1=(i+1)/N*TAU,m=(a0+a1)/2,d=Math.atan2(Math.sin(m+Math.PI/2),Math.cos(m+Math.PI/2));if(Math.abs(d)<gap)continue;
      addSeg(cx+Math.cos(a0)*26,cz+Math.sin(a0)*26,cx+Math.cos(a1)*26,cz+Math.sin(a1)*26,0.6);}
    for(const sx of[-1,1]){addBox(cx+sx*10,cz-28,14,10,0,0.25);}addPlat(cx,cz,36,36,0,gy+0.25);}
   pantheonInterior(cx,cz,gy);footprints.push({x:cx,z:cz,r:26,c:'#e2d6c0',name:'Panteón'});}
  // Saepta Julia y termas de Agripa
  porticus(-500,-600,-500,-430,9,8,'ionic',1);porticus(-445,-600,-445,-430,9,8,'ionic',-1);footprints.push({x:-472,z:-515,w:66,d:174,a:0,c:'#d8ccb4',name:'Saepta Julia'});   // la Saepta, alargada de norte a sur junto a la Vía Lata (Lanciani, láms. 15 y 21)
  {const g=grp(-640,romaH(-640,-468)-0.2,-468,0);box(70,16,46,PLAST,0,8,0,g);const dm=new THREE.Mesh(new THREE.SphereGeometry(13,20,10,0,TAU,0,Math.PI/2),LEAD);dm.position.y=16;g.add(dm);addBox(-640,-468,70,46,0);footprints.push({x:-640,z:-468,w:70,d:46,a:0,c:'#e2d6c0',name:'Termas de Agripa'});}   // pegadas al sur del Panteón (Lanciani, lám. 21)
  // Teatro de Pompeyo y su gran pórtico con plátanos
  theatre({x:-820,z:-300,rot:Math.PI/2,R0:22,R1:78,H:30,name:'Teatro de Pompeyo'});
  {const gy=romaH(-640,-300);porticus(-720,-360,-560,-360,9,8,'corinthian',1,gy);porticus(-720,-240,-560,-240,9,8,'corinthian',-1,gy);porticus(-560,-360,-560,-240,9,8,'corinthian',1,gy);
   const tr=[];for(let i=0;i<4;i++)for(let j=0;j<6;j++)tr.push({x:-700+j*24,z:-330+i*20,kind:'plane',k:1.05,collide:true});if(GLB.ok)treesGLB(tr);
   footprints.push({x:-640,z:-300,w:160,d:120,a:0,c:'#d8ccb4',reserve:true});}
  // Teatro de Marcelo y Pórtico de Octavia
  theatre({x:-370,z:60,rot:-Math.PI/2,R0:18,R1:62,H:22,name:'Teatro de Marcelo'});
  // Lanciani, FUR lám. XXI: el pórtico queda pegado al NO del teatro (antes estaba ~140 m más al norte)
  {const gy=romaH(-490,20);porticus(-540,-18,-442,-18,7,8,'corinthian',1,gy);porticus(-540,58,-442,58,7,8,'corinthian',-1,gy);
   romanTemple({x:-505,z:20,rot:-Math.PI/2,W:14,L:24,pod:2.5,gy:gy-0.2,colD:0.9,colH:9,nW:6,deep:2,peri:true,name:'Templo de Juno Regina'});
   romanTemple({x:-475,z:20,rot:-Math.PI/2,W:14,L:24,pod:2.5,gy:gy-0.2,colD:0.9,colH:9,nW:6,deep:2,peri:true,name:'Templo de Júpiter Estátor'});}
  // Mausoleo de Augusto: tambor, túmulo con cipreses y estatua
  {const cx=-700,cz=-1130,gy=romaH(cx,cz)-0.2,g=grp(cx,gy,cz,0);const d=new THREE.Mesh(new THREE.CylinderGeometry(45,45,12,96,1,false,0.075,TAU-0.15),TRAV);d.position.y=6;g.add(d);for(const s of[-1,1])box(1.4,12,3,TRAV,s*3.0,6,44.2,g);box(7.4,0.4,12,TRAV,0,11.8,39.5,g);   // el tambor, con el hueco de la puerta
   const m=new THREE.Mesh(new THREE.CylinderGeometry(16,40,22,40),lam('#6f7d48'));m.position.y=23;g.add(m);const t=new THREE.Mesh(new THREE.CylinderGeometry(12,12,8,32),TRAV);t.position.y=38;g.add(t);
   if(GLB.ok){const st=makePerson({chiton:'#8a6a3a',himation:'#7d6a3e',skin:'#9a7a46',hair:'#7d6a3e',toga:true,attrRoles:{cloth:BRONZE2,drape:BRONZE2,skin:lam('#9a7a46'),hair:BRONZE2,sandal:BRONZE2,eye:BRONZE2}});st.scale.setScalar(2.6);st.position.y=42;st.rotation.y=0;g.add(st);
     const cy=[];for(let i=0;i<22;i++){const a=i/22*TAU;cy.push({x:cx+Math.cos(a)*30,y:gy+12+(40-30)*0.9,z:cz+Math.sin(a)*30,kind:'cypress',k:1.2});}for(let i=0;i<14;i++){const a=i/14*TAU;cy.push({x:cx+Math.cos(a)*20,y:gy+29,z:cz+Math.sin(a)*20,kind:'cypress',k:1});}treesGLB(cy);
     placeModules('B_obelisk',[{x:cx-16,y:gy,z:cz+52,a:0,sx:0.62},{x:cx+16,y:gy,z:cz+52,a:0,sx:0.62}],{far:2400});}
   // se puede entrar (vídeo de Roma): puerta al sur, corredor (dromos) hasta la cámara central de las urnas. El muro exterior es un anillo
   // de segmentos con un hueco en la puerta (antes, un círculo macizo). Por dentro, paredes y techo propios: el tambor es un cilindro cerrado
   {const fl=romaH(cx,cz+40)-gy+0.1,dk=lam('#5a5246'),inn=lam('#b8ab92');inn.side=THREE.DoubleSide;dk.side=THREE.DoubleSide;
    for(const s of[-1,1]){box(0.8,6.4,1.2,TRAV,s*2.6,3.2,45.3,g);box(1.4,7.6,1.4,BRONZE2,s*4.6,3.8,46.6,g);}box(6,1,1.2,TRAV,0,6.5,45.3,g);box(6.2,5.2,1.6,TRAV,0,9.5,45.2,g);   // jambas, dintel (y el muro sobre él) y los pilares de bronce
    box(0.5,5.4,37,inn,-2.25,fl+2.7,26.5,g);box(0.5,5.4,37,inn,2.25,fl+2.7,26.5,g);box(5,0.5,37,dk,0,fl+5.6,26.5,g);   // el dromos
    const ch=new THREE.Mesh(new THREE.CylinderGeometry(7.5,7.5,9,32,1,true),inn);ch.position.y=fl+4.5;g.add(ch);const cp=new THREE.Mesh(new THREE.CircleGeometry(7.5,32),dk);cp.rotation.x=Math.PI/2;cp.position.y=fl+9;g.add(cp);
    const pil=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.2,9,20),TRAV);pil.position.y=fl+4.5;g.add(pil);   // el pilar central
    for(let i=0;i<6;i++){const a=i/6*TAU+0.5;box(1.1,1.4,0.6,M.marble,Math.sin(a)*6.9,fl+1.6,Math.cos(a)*6.9,g).rotation.y=a;}   // nichos con urnas
    for(let i=0;i<48;i++){const a0=i/48*TAU,a1=(i+1)/48*TAU,mx=Math.sin((a0+a1)/2)*45.2,mz=Math.cos((a0+a1)/2)*45.2;if(mz>0&&Math.abs(mx)<3.2)continue;addSeg(cx+Math.sin(a0)*45.3,cz+Math.cos(a0)*45.3,cx+Math.sin(a1)*45.3,cz+Math.cos(a1)*45.3,0.5);}
    for(const s of[-1,1])addSeg(cx+s*2.1,cz+44.6,cx+s*2.1,cz+7.6,0.3);
    for(let i=0;i<32;i++){const a0=i/32*TAU,a1=(i+1)/32*TAU;if(Math.cos((a0+a1)/2)>0.92)continue;addSeg(cx+Math.sin(a0)*7.6,cz+Math.cos(a0)*7.6,cx+Math.sin(a1)*7.6,cz+Math.cos(a1)*7.6,0.3);}
    addCirc(cx,cz,2.4);
    place('ro_res_gestae','Las Res Gestae','RES GESTAE DIVI AVGVSTI','A los lados de la puerta, en dos pilares de bronce, Augusto mandó grabar el relato de sus obras: las guerras, los repartos de dinero, los edificios, las tres veces que cerró el templo de Jano. Lo conocemos por la copia que los habitantes de Ancira (hoy Ankara) grabaron en su templo de Roma y Augusto (Suetonio, Augusto 101).',cx+7,cz+50,Math.PI);
    place('ro_mausoleo_camara','La cámara de las urnas','SEPVLCRVM AVGVSTI','En el centro, alrededor de un gran pilar, la cámara con los nichos de las urnas. Aquí descansan las cenizas de Augusto, de Livia, de su sobrino Marcelo (el primero en ser enterrado, en el 23 a.C.), de Agripa, de Octavia, de Druso y de Tiberio, de Germánico, de Calígula y de Claudio. A su hija Julia, desterrada, Augusto prohibió que la enterraran aquí (Suetonio, Augusto 101). Desde Nerón ya no cabe nadie más: Vespasiano, que murió el año pasado, tendrá su propia tumba.',cx+4,cz+9,Math.PI);}
   footprints.push({x:cx,z:cz,r:45,c:'#cfc3a8',name:'Mausoleo de Augusto'});}
  // Ara Pacis y el gran reloj de sol con su obelisco
  // situados como los originales: el Ara junto al lado oeste de la Vía Flaminia, unos 500 m al sur del Mausoleo, y el obelisco
  // del reloj unos 110 m al oeste del altar (la sombra apuntaba al Ara el día del cumpleaños de Augusto, el 23 de septiembre)
  {const cx=-538,cz=-900,gy=romaH(cx,cz)-0.1,g=grp(cx,gy,cz,Math.PI/2),fr=texMat(TEX.procession,2,1);
   for(const s of[-1,1]){box(11.6,4.6,0.6,M.marble,0,2.3,s*5.3,g);box(11.62,1.3,0.62,fr,0,3.5,s*5.3,g);}for(const s of[-1,1]){box(0.6,4.6,4,M.marble,s*5.8,2.3,-3.3,g);box(0.6,4.6,4,M.marble,s*5.8,2.3,3.3,g);}
   box(6,1.6,4,M.marble,0,0.8,0,g);addBox(cx,cz,10.6,11.6,0);footprints.push({x:cx,z:cz,w:11,d:12,a:0,c:'#efe7d8',name:'Ara Pacis'});}
  {const cx=-650,cz=-880,gy=romaH(cx,cz);const pv=new THREE.Mesh(new THREE.CircleGeometry(60,40),lam('#d8ccb0'));pv.rotation.x=-Math.PI/2;pv.position.set(cx,gy+0.06,cz+40);pv.receiveShadow=true;scene.add(pv);
   for(let i=-4;i<=4;i++){const l=box(0.25,0.03,55,BRONZE2,cx+Math.sin(i*0.18)*28,gy+0.09,cz+Math.cos(i*0.18)*28);l.rotation.y=i*0.18;}
   if(GLB.ok)placeModules('B_obelisk',[{x:cx,y:gy,z:cz,a:0,sx:1.1}],{far:3000});addCirc(cx,cz,2);}
  // Iseo y Serapeo: patio con obeliscos y esfinges entre pórticos, templo de Isis tras un pilono al norte y exedra de Serapis al sur
  romaIseum();
  try{romaLanciani();}catch(e){console.warn('lanciani',e);}try{romaTarpeya();}catch(e){console.warn('tarpeya',e);}
  // pinos y plátanos en el Campo
  const tr=[];for(let i=0;i<260;i++){const x=rr(-1050,-430),z=rr(-1300,-120);if(romaRiverDist(x,z)<romaRiverW(z)+20)continue;tr.push({x,z,kind:pick(['pine','pine','plane','cypress'])});}
  if(GLB.ok)treesGLB(tr.filter(t=>isFree(t.x,t.z,3)&&!footHit(t.x,t.z,6)));
}
function romaIseum(){
  const X=-525,Z=-350,gy=romaH(X,Z)-0.05,GR=lam('#4a4846'),RG=lam('#8a4a3a');
  drape(X,Z+6,30,84,0,'trav',6,0.05);
  porticus(X-20,-396,X-20,-306,6,6,'ionic',-1,gy);porticus(X+20,-396,X+20,-306,6,6,'ionic',1,gy);
  romanTemple({x:X,z:-382,rot:0,W:12,L:18,pod:2,gy:gy-0.2,colD:0.8,colH:7,nW:4,deep:2,order:'ionic',name:'Templo de Isis'});
  // pilono egipcio: dos torres en talud y un dintel
  for(const s of[-1,1]){const t=new THREE.Mesh(new THREE.CylinderGeometry(3.2,4.4,11,4,1),lam('#d8ccb0'));t.rotation.y=Math.PI/4;t.scale.set(1.2,1,0.55);t.position.set(X+s*6,gy+5.5,-367);t.castShadow=true;scene.add(t);addBox(X+s*6,-367,7,3.4,0);
    box(5.2,1.4,3,RG,X+s*6,gy+10.2,-367);}
  box(5.6,1.6,2.4,lam('#d8ccb0'),X,gy+7.6,-367);box(5.6,0.5,2.5,RG,X,gy+8.6,-367);
  // obeliscos y esfinges a lo largo del patio
  if(GLB.ok)placeModules('B_obelisk',[-356,-326].flatMap(z=>[{x:X-11,y:gy,z,a:0,sx:0.3},{x:X+11,y:gy,z,a:0,sx:0.3}]),{far:2000});
  for(const z of[-358,-344,-330,-316])for(const s of[-1,1]){const g=grp(X+s*6.5,gy,z,-s*Math.PI/2);box(1.2,0.7,2.8,GR,0,0.35,0,g);box(0.9,0.9,2.2,GR,0,1.15,-0.2,g);box(0.7,0.8,0.7,GR,0,1.9,0.8,g);
    const nm=new THREE.Mesh(new THREE.ConeGeometry(0.55,0.9,4),lam('#b8962f'));nm.position.set(0,2.05,0.65);nm.rotation.y=Math.PI/4;nm.scale.z=0.6;g.add(nm);addBox(X+s*6.5,z,1.2,2.8,0);}
  // exedra de Serapis
  {const ex=new THREE.Mesh(new THREE.CylinderGeometry(15,15,11,28,1,true,-Math.PI/2,Math.PI),new THREE.MeshLambertMaterial({color:'#e3d8c2',side:THREE.DoubleSide}));ex.position.set(X,gy+5.5,-312);ex.castShadow=true;scene.add(ex);
   for(let i=0;i<14;i++){const a0=-Math.PI/2+i/14*Math.PI,a1=a0+Math.PI/14;addSeg(X+Math.sin(a0)*15,-312+Math.cos(a0)*15,X+Math.sin(a1)*15,-312+Math.cos(a1)*15,0.4);}
   box(3,2.4,3,M.marble,X,gy+1.2,-301);addBox(X,-301,3,3,0);statue(X,gy+2.4,-301,Math.PI,2.1,'marble');}
  footprints.push({x:X,z:-348,w:46,d:104,a:0,c:'#e2d6c0',name:'Iseo y Serapeo'});
  // fieles de Isis: el sacerdote con el agua del Nilo delante, los demás con sistros
  ROMA.isiacs=[];for(let i=0;i<7;i++){const g=makePerson(i===0?{chiton:'#f3eee2',himation:'#f3eee2',hair:'#a07a5a',carry:'hydria'}:i<3?{chiton:'#f3eee2',himation:'#f3eee2',hair:'#a07a5a'}:{female:i%2===1,chiton:'#f3eee2',himation:pick(['#efe6d5','#d8c9a8','#e9dcc4']),veil:i===5,hair:pick(['#2b1f17','#5b4532'])});
    if(i>0){const s=new THREE.Group();const h2=new THREE.Mesh(new THREE.TorusGeometry(0.07,0.008,5,12,Math.PI*1.3),M.bronze);h2.rotation.z=-0.65;s.add(h2);const st=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,0.18,4),M.bronze);st.position.y=-0.1;s.add(st);s.position.set(0.38,1.35,0.25);g.add(s);}
    scene.add(g);ROMA.isiacs.push({g,k:i});}
  place('ro_iseo','El templo de Isis','ISEVM CAMPENSE','El mayor santuario de dioses egipcios de Roma, levantado probablemente en tiempos de Calígula. Un pilono a la egipcia da paso al templo de Isis; delante se abre un largo patio con obeliscos de granito rojo traídos de Egipto, esfinges y estatuas de dioses con cabeza de animal. Los sacerdotes, con la cabeza afeitada y vestidos de lino, abren el templo al amanecer con el agua del Nilo, que se guarda en una vasija sagrada. Vespasiano y Tito pasaron aquí la noche antes de su triunfo del 71. El incendio de este año lo ha dañado; Domiciano lo reconstruirá.',X+13,-362,-Math.PI/2);
  place('ro_serapeo','El Serapeo','SERAPEVM','En el extremo sur del patio, una gran exedra semicircular está dedicada a Serapis, el dios que los reyes griegos de Egipto crearon uniendo a Osiris y al buey Apis con rasgos de Zeus: barbudo, con un cesto de grano sobre la cabeza. Era el dios de Alejandría, sanador y señor del más allá. En Alejandría, cuentan Tácito y Suetonio, Vespasiano curó a un ciego y a un cojo siguiendo el consejo de Serapis.',X+11,-321,-Math.PI/2);
}
// templo de la Gran Madre en el Palatino, con sus galos tocando tambores delante
function romaMagnaMater(top){
  romanTemple({x:-88,z:200,rot:0,W:17,L:32,pod:3.5,gy:top-0.4,colD:1.0,colH:10,nW:6,deep:2,name:'Templo de la Gran Madre'});
  box(2.4,1.1,1.6,TRAV,-88,top+0.55,229);addBox(-88,229,2.4,1.6,0);
  ROMA.galli=[];for(let i=0;i<3;i++){const x=-92+i*4,z=231+(i%2)*1.2,g=makePerson({female:true,chiton:pick(['#c9a24a','#b0563a','#e8b84a']),himation:pick(['#8a3f5e','#6a4d7a','#3f6a5a']),veil:'#e8b84a',hair:'#4a3020'});
    const tp=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.28,0.06,16),lam('#c9b48b'));tp.rotation.x=Math.PI/2;tp.position.set(-0.3,1.5,0.35);g.add(tp);
    g.position.set(x,floorAt(x,z),z);g.rotation.y=Math.PI*(0.9+i*0.1);scene.add(g);addCirc(x,z,0.4);ROMA.galli.push({g,ph:i*1.7});}
  place('ro_magna_mater','El templo de la Gran Madre','MATER DEVM MAGNA IDAEA','La Gran Madre de los dioses, la Cibeles de Frigia, llegó a Roma en el 204 a.C., en plena guerra contra Aníbal, porque así lo aconsejaban los libros sibilinos: su imagen era una piedra negra traída de Pesinunte. Este templo se dedicó en el 191 a.C., junto a la cabaña de Rómulo, y Augusto lo reconstruyó tras un incendio. En abril, durante las Megalesias, se representan comedias delante de él, con el público sentado en la escalinata. Sus sacerdotes, los galos, son eunucos frigios que bailan al son de tambores y címbalos; a los ciudadanos romanos no se les permite serlo.',-103,226,0);
}
function romaRiver(){
  // isla Tiberina con el templo de Esculapio y la proa de piedra
  romanTemple({x:-520,z:225,rot:Math.PI/2,W:12,L:18,pod:1.6,gy:romaH(-520,225)-0.2,colD:0.7,colH:7,nW:4,deep:2,order:'ionic',name:'Templo de Esculapio'});
  {const g=grp(-520,-1.6,ISLA.z+ISLA.rz-14,0);const pr=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,3),TRAV);pr.rotation.y=Math.PI/2;pr.scale.set(16,5.2,9);pr.position.set(0,2.4,6);g.add(pr);
   if(GLB.ok)placeModules('B_obelisk',[{x:-520,y:romaH(-520,280),z:280,a:0,sx:0.45}],{far:2000});}
  // puentes
  const W=z=>romaRiverW(z),X=z=>romaRiverX(z);
  {const z=250,x=X(z);bridge(z,x+W(z)+10,x+ISLA.rx-2,7);bridge(z,x-ISLA.rx+2,x-W(z)-10,7);}
  for(const[z,wd]of[[120,false],[560,true],[-250,false],[-650,false]]){const x=X(z),w=W(z);bridge(z,x+w+12,x-w-12,wd?6:8,wd);}
  // barcas en el río
  for(const[z,dx]of[[480,-10],[520,14],[640,-6],[-80,8],[-700,-12]]){const x=X(z)+dx,g=grp(x,-2.0,z,0.05);box(4,1.2,14,M.wood,0,0.2,0,g);box(4.4,0.3,14.4,lam('#5a3d26'),0,0.85,0,g);for(let i=0;i<5;i++){const a=new THREE.Mesh(PGEO.jar,lam('#b5603a'));a.scale.setScalar(1.6);a.position.set(rr(-1,1),0.9,-4+i*2);g.add(a);}}
  // Emporio: almacenes de bóvedas en la orilla y el montón de ánforas rotas
  {const z0=650,x=-470,g=grp(x,romaH(x,z0+70),z0+70,0);for(let i=0;i<10;i++){box(16,9,13,BRICK,0,4.5,-60+i*13.5,g);const v=new THREE.Mesh(new THREE.CylinderGeometry(6.5,6.5,16,12,1,false,0,Math.PI),M.tile);v.rotation.z=Math.PI/2;v.position.set(0,9,-60+i*13.5);g.add(v);box(0.2,4,3.4,M.dark,-8.05,2,-60+i*13.5,g);}
   addBox(x,z0+70,16,135,0);footprints.push({x,z:z0+70,w:16,d:135,a:0,c:'#c79a7e',name:'Pórtico Emilio'});
   const t=new THREE.Mesh(new THREE.ConeGeometry(42,16,24),lam('#b5704a'));t.position.set(-330,romaH(-330,820)+6,820);scene.add(t);addCirc(-330,820,38);
   for(let i=0;i<40;i++){const a=new THREE.Mesh(PGEO.jar,lam(pick(['#b5603a','#a8532f','#c47a4a'])));a.scale.setScalar(1.6);const px=x-12+rr(-3,3),pz=z0+rr(0,140);a.position.set(px,romaH(px,pz),pz);a.rotation.z=R()<0.3?Math.PI/2:0;scene.add(a);}}
  // Templo de Hércules Vencedor en el Foro Boario, «ad Portam Trigeminam», y el de Portuno junto al puerto fluvial
  // (Lanciani, FUR lám. XXVIII; antes estaba frente a la punta norte de la isla, ~150 m demasiado al norte)
  romanTemple({x:-420,z:258,rot:Math.PI,W:11,L:19,pod:2.4,colD:0.75,colH:8,nW:4,deep:2,order:'ionic',name:'Templo de Portuno'});
  roundTemple({x:-428,z:300,r:7.4,colD:0.8,colH:10.5,n:20,pod:1.6,rot:Math.PI/2,roofMat:M.tile,name:'Templo de Hércules Vencedor'});
}
function romaOutskirts(){
  // Acueducto Claudio: arcos desde el este, por el Celio, hasta el Palatino
  const path=[[1300,-130],[1000,80],[760,220],[560,290],[400,270],[230,230]];ROMA.aq=[];
  const pts=[];for(let i=0;i<path.length-1;i++){const a=path[i],b=path[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.round(L/6);for(let k=0;k<n;k++){const t=(k+0.5)/n;pts.push([lerp(a[0],b[0],t),lerp(a[1],b[1],t),Math.atan2(b[0]-a[0],b[1]-a[1])+Math.PI/2,L/n]);}}
  let top=0;for(const p of pts)top=Math.max(top,romaH(p[0],p[1]));top+=10;
  const items=[];for(const p of pts){const h=romaH(p[0],p[1])-0.5;if(romaRiverDist(p[0],p[1])<10)continue;items.push({x:p[0],y:h,z:p[1],a:p[2],sx:p[3]/6,sy:Math.max(0.4,(top-h)/11.6),sz:1});addCirc(p[0]+Math.cos(p[2])*p[3]/2,p[1]-Math.sin(p[2])*p[3]/2,1.3);ROMA.aq.push(p);}
  if(GLB.ok&&GLB.parts.B_aqueduct)placeModules('B_aqueduct',items,{far:2600});
  else for(const it of items){const b=box(it.sx*6,top-it.y,2.4,TRAV,it.x,(top+it.y)/2,it.z);b.rotation.y=it.a;}
  // tumbas de la Vía Apia y Pirámide de Cestio
  const ap=ROADS.find(r=>r.name==='Vía Apia').pts;
  for(let i=0;i<26;i++){const s=1+Math.floor(R()*(ap.length-2)),t=R(),x=lerp(ap[s][0],ap[s+1][0],t),z=lerp(ap[s][1],ap[s+1][1],t),dx=ap[s+1][0]-ap[s][0],dz=ap[s+1][1]-ap[s][1],l=Math.hypot(dx,dz),side=R()<0.5?1:-1,ox=x-dz/l*side*rr(9,14),oz=z+dx/l*side*rr(9,14);
    if(!isFree(ox,oz,5))continue;const gy=romaH(ox,oz)-0.2,a=Math.atan2(dx,dz);
    if(R()<0.4){const g=grp(ox,gy,oz,a),r=rr(4,9);const c=new THREE.Mesh(new THREE.CylinderGeometry(r,r,rr(4,8),24),TRAV);c.position.y=c.geometry.parameters.height/2;g.add(c);const m=new THREE.Mesh(new THREE.ConeGeometry(r*0.9,r*0.5,20),lam('#6f7d48'));m.position.y=c.geometry.parameters.height+r*0.25;g.add(m);addCirc(ox,oz,r);}
    else{const g=grp(ox,gy,oz,a+(side>0?-Math.PI/2:Math.PI/2)),w=rr(4,7),h=rr(4,7);box(w,h,w,R()<0.5?TRAV:BRICK,0,h/2,0,g);gableRoof(g,w+0.3,w+0.3,h,w*0.2,M.tile,PLAST);addBox(ox,oz,w,w,a);}}
  {const cx=1000,cz=900,gy=romaH(cx,cz)-0.2,g=grp(cx+20,gy,cz-24,0);const c=new THREE.Mesh(new THREE.CylinderGeometry(14,14,12,32),TRAV);c.position.y=8;g.add(c);const b=box(30,4,30,TRAV2,0,2,0,g);addCirc(cx+20,cz-24,15);}
  {const cx=-60,cz=900,gy=romaH(cx,cz)-0.3,g=grp(cx,gy,cz,0);const py=new THREE.Mesh(new THREE.ConeGeometry(21.2,37,4),lam('#e6dccb'));py.rotation.y=Math.PI/4;py.position.y=18.5;py.castShadow=true;g.add(py);addBox(cx,cz,30,30,0);footprints.push({x:cx,z:cz,w:30,d:30,a:0,c:'#efe7d8',name:'Pirámide de Cestio'});}
  // templo del Divino Claudio en el Celio y domus del patrono
  romanTemple({x:420,z:262,rot:-Math.PI/2,W:22,L:34,pod:3,gy:romaH(420,262)-0.2,colD:1.2,colH:11,nW:6,deep:2,peri:true,name:'Templo del Divino Claudio'});
  // la domus visitable del Celio, con su cola de clientes
  buildDomus();buildDomusNovia();
  ROMA.bodaLight=new THREE.PointLight('#ffb070',0,34,1);scene.add(ROMA.bodaLight);   // lámparas de la boda (siempre en la escena, para no recompilar materiales)
  // campiña: campos, viñas, olivares y pinos
  const tr=buildCountryside(-1550,1300,-1500,1300,{grove:'olive'});buildCrops(-1550,1300,-1500,1300);buildVida(-1550,1300,-1500,1300);
  for(let i=0;i<420;i++){const x=rr(-1550,1300),z=rr(-1500,1300);if(romaInUrbs(x,z)||romaRiverDist(x,z)<romaRiverW(z)+18||roadDist(x,z)<5||fieldAt(x,z))continue;tr.push({x,z,kind:R()<0.55?'pine':(R()<0.5?'cypress':'olive')});}
  for(const r of ROADS){if(!/Apia|Flaminia|Ostiense|Labicana|Salaria|Nomentana/.test(r.name))continue;const p=r.pts;for(let i=0;i<p.length-1;i++){const L=Math.hypot(p[i+1][0]-p[i][0],p[i+1][1]-p[i][1]);for(let d=8;d<L;d+=26){const t=d/L,x=lerp(p[i][0],p[i+1][0],t),z=lerp(p[i][1],p[i+1][1],t),dx=(p[i+1][0]-p[i][0])/L,dz=(p[i+1][1]-p[i][1])/L;for(const s of[-1,1]){const tx=x-dz*s*8,tz=z+dx*s*8;if(!romaInUrbs(tx,tz))tr.push({x:tx,z:tz,kind:r.name.includes('Apia')?'cypress':'pine'});}}}}
  if(GLB.ok)treesGLB(tr.filter(t=>isFree(t.x,t.z,2.5)&&!footHit(t.x,t.z,4)));
}
function footHit(x,z,m){for(const f of footprints){if(f.r){if(Math.hypot(x-f.x,z-f.z)<f.r+m)return true;continue;}const dx=x-f.x,dz=z-f.z,c=Math.cos(f.a||0),s=Math.sin(f.a||0),lx=dx*c-dz*s,lz=dx*s+dz*c;if(Math.abs(lx)<f.w/2+m&&Math.abs(lz)<f.d/2+m)return true;}return false;}
