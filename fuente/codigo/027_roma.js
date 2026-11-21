// ============================================================ ROMA: destinos de viaje (año 80 d.C.)
// Las once regiones de Italia de Augusto (con el cochero, desde la Vía Apia) y cinco ciudades de Hispania (en barco desde el Emporio; a Ilerda y Emerita, por tierra desde Tarraco).
const ROMA_DESTS=[
 {id:'campania',name:'Latium et Campania · Neápolis',gr:'REGIO I · LATIVM ET CAMPANIA',sub:'Neápolis, la bahía y el Vesubio, un año después de la erupción.',R:520,H:12,seed:21.1,days:'cinco días por la Vía Apia',fare:8,coast:[0,1],coastAt:0.35},
 {id:'apulia',name:'Apulia et Calabria · Brundisium',gr:'REGIO II · APVLIA ET CALABRIA',sub:'El puerto de Brundisium, al final de la Vía Apia, frente a Grecia.',R:460,H:8,seed:21.7,days:'unos doce días por la Vía Apia',fare:20,coast:[1,0],coastAt:0.4},
 {id:'lucania',name:'Lucania et Bruttii · Paestum',gr:'REGIO III · LVCANIA ET BRVTTII',sub:'La vieja Posidonia de los griegos, con sus templos dóricos y sus rosas.',R:480,H:8,seed:22.3,days:'unos seis días por la Vía Apia y la Vía Popilia',fare:10,coast:[0,1],coastAt:0.55},
 {id:'samnium',name:'Samnium · Saepinum',gr:'REGIO IV · SAMNIVM',sub:'Un pueblo de montaña entre rebaños, en el país de los antiguos samnitas.',R:460,H:16,seed:22.9,days:'cinco días por la Vía Latina y los caminos de los rebaños',fare:8},
 {id:'picenum',name:'Picenum · Asculum',gr:'REGIO V · PICENVM',sub:'La ciudad de travertino entre dos ríos, donde empezó la guerra de los aliados.',R:440,H:14,seed:23.5,days:'cuatro días por la Vía Salaria',fare:7},
 {id:'umbria',name:'Umbria et Ager Gallicus · Ariminum',gr:'REGIO VI · VMBRIA ET AGER GALLICVS',sub:'Donde termina la Vía Flaminia y empieza la Emilia, junto al Adriático.',R:460,H:8,seed:24.1,days:'siete días por la Vía Flaminia',fare:11,coast:[0,-1],coastAt:0.45},
 {id:'etruria',name:'Etruria · Tarquinii',gr:'REGIO VII · ETRVRIA',sub:'La vieja ciudad etrusca de los Tarquinios y sus tumbas pintadas.',R:460,H:12,seed:24.7,days:'dos días por la Vía Aurelia',fare:4,coast:[0,1],coastAt:0.65},
 {id:'aemilia',name:'Aemilia · Mutina',gr:'REGIO VIII · AEMILIA',sub:'La llanura del Po, dividida en cuadros, a lo largo de la Vía Emilia.',R:480,H:3,seed:25.3,days:'ocho días por la Vía Flaminia y la Vía Emilia',fare:13},
 {id:'liguria',name:'Liguria · Genua',gr:'REGIO IX · LIGVRIA',sub:'Un puerto entre montañas, al pie de los Apeninos.',R:440,H:10,seed:25.9,days:'diez u once días por la Vía Aurelia, junto a la costa',fare:16,coast:[0,1],coastAt:0.3},
 {id:'venetia',name:'Venetia et Histria · Verona',gr:'REGIO X · VENETIA ET HISTRIA',sub:'La ciudad de Catulo, en un meandro del Atesis, con su gran anfiteatro.',R:480,H:8,seed:26.5,days:'diez días por la Vía Flaminia, la Emilia y la Postumia',fare:16},
 {id:'transpadana',name:'Transpadana · Comum',gr:'REGIO XI · TRANSPADANA',sub:'La ciudad de los Plinios, a orillas del lago Lario, al pie de los Alpes.',R:480,H:10,seed:27.1,days:'doce días por la Vía Flaminia y la Emilia, hasta Mediolanum y el lago Lario',fare:18},
 {id:'regium',name:'Bruttii · Regium',gr:'REGIO III · BRVTTII',sub:'La ciudad del estrecho, frente a Sicilia, entre Escila y Caribdis.',R:440,H:14,seed:31.3,days:'unos doce días por la Vía Apia y la Vía Popilia',fare:16,coast:[-1,0],coastAt:0.5},
 {id:'tarraco',name:'Tarraco',gr:'HISPANIA CITERIOR · TARRACO',sub:'La capital de la Hispania Citerior, sobre una colina junto al mar.',R:480,H:10,seed:27.7,days:'cuatro días de navegación desde Ostia, con buen viento',fare:20,coast:[0,1],coastAt:0.3,sea:true,net:'hisp'},
 {id:'barcino',name:'Barcino',gr:'HISPANIA CITERIOR · BARCINO',sub:'Una pequeña colonia amurallada de Augusto, entre viñas, junto al mar.',R:440,H:8,seed:28.3,days:'cuatro o cinco días de navegación',fare:20,coast:[0,1],coastAt:0.4,sea:true,net:'hisp'},
 {id:'emporiae',name:'Emporiae',gr:'HISPANIA CITERIOR · EMPORIAE',sub:'La vieja colonia griega donde desembarcaron los Escipiones.',R:420,H:6,seed:28.9,days:'tres o cuatro días de navegación, siguiendo la costa de la Galia',fare:18,coast:[0,1],coastAt:0.35,sea:true,net:'hisp'},
 {id:'ilerda',name:'Ilerda',gr:'HISPANIA CITERIOR · ILERDA',sub:'La ciudad de los ilergetes, sobre una colina junto al río Sicoris.',R:420,H:8,seed:29.5,days:'en barco hasta Tarraco y tres días de camino',ldays:'tres días de camino desde Tarraco, tierra adentro',fare:23,lfare:3,net:'hisp'},
 {id:'emerita',name:'Emerita Augusta',gr:'LVSITANIA · EMERITA AVGVSTA',sub:'La colonia de los veteranos de Augusto, capital de Lusitania, junto al río Anas.',R:480,H:6,seed:30.1,days:'en barco hasta Tarraco y unas tres semanas de camino',ldays:'unas tres semanas de camino por las calzadas de la Meseta',fare:32,lfare:12,net:'hisp'},
 {id:'cartago',name:'Carthago',gr:'AFRICA PROCONSVLARIS · CARTHAGO',sub:'La Cartago romana, capital de África, sobre las ruinas de la ciudad púnica.',R:520,H:10,seed:30.7,days:'dos o tres días de navegación desde Ostia, con buen viento',fare:16,coast:[1,0],coastAt:0.3,sea:true,net:'afr'},
 {id:'gades',name:'Gades',gr:'HISPANIA BAETICA · GADES',sub:'La vieja ciudad fenicia del templo de Hércules, al borde del Océano.',R:460,H:8,seed:32.3,days:'unos siete días de navegación desde Ostia',fare:24,coast:[-1,0],coastAt:0.35,sea:true,net:'hisp'},
 {id:'cartnova',name:'Carthago Nova',gr:'HISPANIA CITERIOR · CARTHAGO NOVA',sub:'La ciudad de los Barca, entre el mar y la laguna, junto a las minas de plata.',R:480,H:10,seed:32.9,days:'cinco días de navegación desde Ostia',fare:22,coast:[0,1],coastAt:0.35,sea:true,net:'hisp'},
 {id:'corduba',name:'Corduba',gr:'HISPANIA BAETICA · CORDVBA',sub:'La capital de la Bética, junto al Betis, entre olivares: la patria de los Séneca.',R:480,H:8,seed:33.5,days:'en barco hasta Tarraco y unas tres semanas de camino',ldays:'unas tres semanas de camino por la Vía Augusta',fare:34,lfare:12,net:'hisp'},
 {id:'medulas',name:'Las Médulas',gr:'HISPANIA CITERIOR · ASTVRIA',sub:'Las minas de oro del noroeste, donde los romanos derrumban montañas con agua.',R:460,H:20,seed:34.1,days:'en barco hasta Tarraco y casi un mes de camino',ldays:'casi un mes de camino hacia el noroeste',fare:36,lfare:14,net:'hisp'},
 {id:'massilia',name:'Massilia',gr:'GALLIA NARBONENSIS · MASSILIA',sub:'La ciudad griega de la Galia, fundada por los foceos.',R:460,H:10,seed:34.7,days:'cinco o seis días de navegación, bordeando Liguria',fare:18,coast:[-1,0],coastAt:0.4,sea:true,net:'gal'},
 {id:'nemausus',name:'Nemausus',gr:'GALLIA NARBONENSIS · NEMAVSVS',sub:'La colonia de los veteranos de Egipto, con su templo y su acueducto.',R:480,H:8,seed:35.3,days:'en barco hasta Massilia y tres días de camino',ldays:'tres días de camino por la Vía Domicia',fare:22,lfare:4,net:'gal'},
 {id:'lugdunum',name:'Lugdunum',gr:'GALLIA LVGDVNENSIS · LVGDVNVM',sub:'La capital de las Tres Galias, en la confluencia del Ródano y el Arar.',R:480,H:10,seed:35.9,days:'en barco hasta Massilia y una semana Ródano arriba',ldays:'una semana de camino Ródano arriba',fare:26,lfare:8,net:'gal'},
 {id:'alesia',name:'Alesia',gr:'GALLIA LVGDVNENSIS · ALESIA',sub:'El oppidum donde César venció a Vercingétorix.',R:480,H:10,seed:36.5,days:'en barco hasta Massilia y unas dos semanas de camino',ldays:'unas dos semanas de camino hacia el norte',fare:30,lfare:12,net:'gal'},
 {id:'alejandria',name:'Alejandría',gr:'AEGYPTVS · ALEXANDRIA',sub:'La capital de Egipto: el Faro, el Museo y la tumba de Alejandro.',R:500,H:6,seed:38.1,days:'unos diez o doce días de navegación desde Ostia; el regreso, contra el viento, el doble',fare:28,coast:[0,-1],coastAt:0.35,sea:true,net:'eg',flat:true,desert:true},
 {id:'menfis',name:'Menfis y las pirámides',gr:'AEGYPTVS · MEMPHIS',sub:'La ciudad del buey Apis y las pirámides: la gran visita de los viajeros romanos.',R:480,H:4,seed:38.7,days:'en barco hasta Alejandría y unos cinco días por el canal y el Nilo',ldays:'unos cinco días por el canal y el Nilo',fare:31,lfare:4,net:'eg',desert:true},
 {id:'nemi',name:'Nemus Dianae · El lago de Nemi',gr:'NEMVS DIANAE',sub:'El lago redondo en el bosque de Diana, junto a la Vía Apia, pasada Aricia.',R:440,H:26,seed:45.3,days:'un día por la Vía Apia',fare:2,net:'it'},
 {id:'soracte',name:'Mons Soracte',gr:'MONS SORACTE',sub:'El monte solitario de Apolo Sorano, al norte de Roma, junto a la Vía Flaminia.',R:440,H:12,seed:46.1,days:'un día por la Vía Flaminia',fare:2,net:'it'},
 {id:'clitumno',name:'Fontes Clitumni',gr:'FONTES CLITVMNI',sub:'Las fuentes del Clitumno, en Umbría: agua clara, un templo pequeño y bueyes blancos.',R:440,H:10,seed:46.9,days:'cuatro días por la Vía Flaminia',fare:5,net:'it'},
 {id:'sila',name:'Silva Sila',gr:'SILVA SILA · BRVTTII',sub:'El gran bosque de abetos y pinos de los brucios, de donde sale la mejor pez.',R:460,H:22,seed:47.7,days:'unos doce días por la Vía Popilia',fare:12,net:'it'},
 {id:'ciminia',name:'Silva Ciminia',gr:'SILVA CIMINIA',sub:'El bosque temido de Etruria, junto al lago Ciminio.',R:440,H:20,seed:52.5,days:'dos días por la Vía Cassia',fare:2,net:'it'},
 {id:'caudium',name:'Furculae Caudinae',gr:'FVRCVLAE CAVDINAE',sub:'El desfiladero donde los samnitas humillaron a un ejército romano.',R:440,H:18,seed:53.3,days:'cuatro días por la Vía Apia',fare:4,net:'it'},
 {id:'lunae',name:'Las canteras de Luna',gr:'MONTES LVNENSES',sub:'Los montes de mármol blanco junto al puerto de Luna.',R:440,H:26,seed:54.1,days:'ocho días por la Vía Aurelia',fare:8,net:'it'},
 {id:'padus',name:'El delta del Po',gr:'PADVS · ERIDANVS',sub:'Las bocas del Po, entre cañaverales, chopos y lagunas.',R:460,H:4,seed:54.9,days:'diez días por la Vía Flaminia y la Emilia',fare:10,net:'it'},
 {id:'rubico',name:'El Rubicón',gr:'RVBICO',sub:'El riachuelo que fue frontera de Italia y que César cruzó en el 49 a.C.',R:440,H:6,seed:55.7,days:'siete días por la Vía Flaminia',fare:7,net:'it'},
 {id:'siracusa',name:'Siracusa',gr:'SICILIA · SYRACVSAE',sub:'La mayor ciudad griega de Occidente: Arquímedes, la fuente de Aretusa y las canteras.',R:480,H:10,seed:56.3,days:'unos cinco días de navegación desde Ostia, por el estrecho de Mesina',fare:16,coast:[1,0],coastAt:0.3,sea:true,net:'sic'},
 {id:'aetna',name:'El Etna',gr:'SICILIA · AETNA',sub:'El volcán de Vulcano y los Cíclopes, sobre viñas de ceniza.',R:480,H:10,seed:56.9,days:'en barco hasta Siracusa y dos días de camino',ldays:'dos días de camino hacia el norte',fare:19,lfare:3,net:'sic'},
 {id:'caralis',name:'Caralis',gr:'SARDINIA · CARALIS',sub:'La capital de Cerdeña: trigo, salinas, flamencos y torres de piedra.',R:460,H:8,seed:57.5,days:'unos tres días de navegación desde Ostia',fare:12,coast:[0,1],coastAt:0.3,sea:true,net:'sar'},
 {id:'aleria',name:'Aleria',gr:'CORSICA · ALERIA',sub:'La vieja Alalia de los foceos, junto al estanque de las ostras.',R:440,H:10,seed:58.1,days:'dos o tres días de navegación desde Ostia',fare:10,coast:[1,0],coastAt:0.3,sea:true,net:'cor'}
];
ROMA_DESTS.forEach(I=>{I.dir=[-1,0];I.land=true;I.step=8;I.green=!I.desert;if(!I.net)I.net='it';});
const ROMA_LAND_FACTS=['Cada mil pasos, un miliario de piedra indica la distancia hasta Roma.','Las calzadas tienen capas de piedra y grava bajo las losas; algunas durarán dos mil años.','En las posadas del camino se cambia de mulas, se come mal y se duerme peor.','Los correos del emperador recorren hasta cincuenta millas al día cambiando de caballos.','Junto a las calzadas, a la salida de cada ciudad, se alinean las tumbas.'];
const ROMA_VOY_FACTS=['El puerto de Claudio, junto a Ostia, recibe las naves de trigo de Egipto y de África.','Una nave de carga puede llevar miles de ánforas en la bodega.','Se navega de primavera a otoño: en invierno el mar está cerrado.','Antes de zarpar, los marineros ofrecen un sacrificio y evitan los días de mal agüero.','El faro de Portus imita al de Alejandría.'];

// ------------------------------------------------------------ ROMA: piezas para los destinos
// anfiteatro elíptico: gradas, muro exterior con arcadas pintadas y arena con dos entradas en el eje mayor
function amphi(x,z,a,rx,rz,H,name){
  const gy=minGround(x,z,rx*2,rz*2,a)-0.1,ax=rx*0.5,az=rz*0.38,steps=18,N=48;
  const P=(u,k)=>{const t=u*TAU;if(k===0)return[Math.cos(t)*ax,0,Math.sin(t)*az];const s=Math.floor((k-1)/2),e=(k-1)%2,f=(s+e)/steps;return[Math.cos(t)*lerp(ax,rx,f),1.2+(s+1)*(H-2)/steps,Math.sin(t)*lerp(az,rz,f)];};
  ringMesh(ringGeo(1+steps*2,N,P,(u)=>Math.abs(Math.sin(u*TAU))<0.06,k=>k%4<2?'#e2d4bc':'#d4c4a8'),x,gy,z,a);
  const wall=ringGeo(2,N,(u,k)=>{const t=u*TAU;return[Math.cos(t)*rx,k?H:0,Math.sin(t)*rz];},(u)=>Math.abs(Math.sin(u*TAU))<0.06,()=>'#cdb38f');const wm=new THREE.Mesh(wall,new THREE.MeshLambertMaterial({map:RTEX.arcade,side:THREE.DoubleSide}));
  wall.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(wall.attributes.position.count*2).map((v,i)=>{const j=Math.floor(i/2),p=wall.attributes.position;return i%2?p.getY(j)/H:Math.atan2(p.getZ(j)/rz,p.getX(j)/rx)/TAU*20;}),2));
  wm.position.set(x,gy,z);wm.rotation.y=a;scene.add(wm);
  const fl=new THREE.Mesh(new THREE.CircleGeometry(1,32),lam('#d8c39a'));fl.rotation.x=-Math.PI/2;fl.scale.set(ax,az,1);fl.position.set(x,gy+0.1,z);scene.add(fl);
  for(const[sx,sz]of[[rx,rz],[ax+0.4,az+0.4]])for(let i=0;i<N;i++){const t0=i/N*TAU,t1=(i+1)/N*TAU,tm=(t0+t1)/2;if(Math.abs(Math.sin(tm))<0.06)continue;if(sx===rx&&Math.sin(tm)>0.97)continue;   // el hueco del rellano de la escalera
    const p=toW(Math.cos(t0)*sx,Math.sin(t0)*sz,x,z,a),q=toW(Math.cos(t1)*sx,Math.sin(t1)*sz,x,z,a);addSeg(p[0],p[1],q[0],q[1],0.6);}
  const CV={k:'a',x,z,a,gy,ax,az,rx,rz,H,steps,rr:Math.max(rx,rz)+1};CAVEAS.push(CV);   // las gradas se pisan y se suben
  // Debajo de las gradas no se ve nada: las cáveas se apoyaban en tierra o en bóvedas. Junto a las puertas de los ejes, la sección escalonada se cierra con muros, y sobre cada puerta, un dintel en la fachada.
  {const stn=new THREE.MeshLambertMaterial({color:'#c9b796',side:THREE.DoubleSide}),pos=[],g=grp(x,gy,z,a),s6=Math.asin(0.06);
   for(const t of[s6,-s6,Math.PI-s6,Math.PI+s6]){const pt=(f,y)=>[Math.cos(t)*lerp(ax,rx,f),y,Math.sin(t)*lerp(az,rz,f)],top=[[0,0]];
     for(let s=0;s<steps;s++){const y=1.2+(s+1)*(H-2)/steps;top.push([s/steps,y],[(s+1)/steps,y]);}top.push([1,H]);
     for(let i=0;i<top.length-1;i++){const[f0,y0]=top[i],[f1,y1]=top[i+1],A=pt(f0,0),B=pt(f1,0),Cc=pt(f1,y1),D=pt(f0,y0);pos.push(...A,...B,...Cc,...A,...Cc,...D);}
     const p=toW(Math.cos(t)*ax,Math.sin(t)*az,x,z,a),q=toW(Math.cos(t)*rx,Math.sin(t)*rz,x,z,a);addSeg(p[0],p[1],q[0],q[1],0.3);}
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.computeVertexNormals();const wm2=new THREE.Mesh(geo,stn);wm2.position.set(x,gy,z);wm2.rotation.y=a;wm2.receiveShadow=true;scene.add(wm2);
   for(const sg of[1,-1]){const w=2*Math.sin(s6)*rz+0.6;box(1.2,H-6,w,stn,sg*rx,6+(H-6)/2,0,g);box(1.4,0.5,w+0.4,stn,sg*rx,6,0,g);}
   // escalera exterior de doble tramo hasta lo alto de la cávea (Pompeya: dos rampas de escalones adosadas a la fachada)
   const top=H+0.05,hp=w=>{const p=toW(0,w,x,z,a);return caveaH(CV,p[0],p[1]);},hin=(hp(rz-1.8)||gy+H-1)-gy,nI=Math.max(1,Math.ceil((top-hin)/0.45));
   const P1=toW(0,rz+1.3,x,z,a);addPlat(P1[0],P1[1],3.4,3.4,a,gy+top);box(3.4,top+1,3.4,stn,0,(top-1)/2,rz+1.3,g);
   for(let i=1;i<=nI;i++){const y=top-(top-hin)*i/(nI+0.5),zc=rz-0.4-(i-0.5)*1.4/nI,w=toW(0,zc,x,z,a);addPlat(w[0],w[1],3.2,1.4/nI+0.08,a,gy+y);box(3.2,0.3,1.4/nI,stn,0,y-0.15,zc,g);}
   for(const sg of[-1,1]){for(let j=1;;j++){const y=top-j*0.45;if(y<0.2)break;const lx=sg*(1.7+(j-0.5)*0.7),w=toW(lx,rz+1.3,x,z,a),tg=terrainH(w[0],w[1])-gy;if(y<tg-0.1)break;addPlat(w[0],w[1],0.78,2.6,a,gy+y);box(0.7,y-tg+1.5,2.6,stn,lx,(y+tg-1.5)/2,rz+1.3,g);}
     const w0=toW(sg*1.7,rz+2.65,x,z,a),w1=toW(sg*(1.7+top/0.45*0.7),rz+2.65,x,z,a);addSeg(w0[0],w0[1],w1[0],w1[1],0.15);}}
  footprints.push({x,z,w:rx*2,d:rz*2,a,c:'#d8c39a',name,noFlat:true});
}
// foro: plaza enlosada con pórticos en los lados largos
function forumR(x,z,w,d,name){const gy=minGround(x,z,w,d,0)-0.05;box(w,0.4,d,TRAV2,x,gy+0.15,z);addPlat(x,z,w,d,0,gy+0.35);
  porticus(x-w/2,z-d/2-3,x+w/2,z-d/2-3,6,5.5,'tuscan',1,gy);porticus(x-w/2,z+d/2+3,x+w/2,z+d/2+3,6,5.5,'tuscan',-1,gy);
  footprints.push({x,z,w,d,a:0,c:'#d8ccb4',name});return gy;}
// grúa de madera (obras)
function crane(x,z,a){const g=grp(x,terrainH(x,z),z,a);const l1=box(0.35,13,0.35,M.wood,-2,6.2,0,g);l1.rotation.z=0.2;const l2=box(0.35,13,0.35,M.wood,2,6.2,0,g);l2.rotation.z=-0.2;box(0.25,0.25,10,M.wood,0,12.2,2.5,g);const w=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.4,0.6,16),M.wood);w.rotation.z=Math.PI/2;w.position.set(0,1.6,-1.2);g.add(w);addCirc(x,z,2.2);}
// ============================================================ HISPANIA URBANA: piezas para reconstruir las ciudades (acueductos, puentes largos, circos)
// Enjuta de arco: rectángulo con un semicírculo vaciado abajo, extruido en profundidad. Se reutiliza para cada vano.
function archGeo(s,r,bt,dep){const sh=new THREE.Shape();sh.moveTo(-s/2,0);sh.lineTo(-r,0);sh.absarc(0,0,r,Math.PI,0,true);sh.lineTo(s/2,0);sh.lineTo(s/2,r+bt);sh.lineTo(-s/2,r+bt);sh.lineTo(-s/2,0);
  const g=new THREE.ExtrudeGeometry(sh,{depth:dep,bevelEnabled:false,curveSegments:10});g.translate(0,0,-dep/2);return g;}
// arquería de acueducto entre dos puntos: pilares hasta el suelo, arcos en uno o varios pisos y el canal (specus) arriba
function arcadeLine(x1,z1,x2,z2,o){const dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz),a=Math.atan2(-dz,dx),mx=(x1+x2)/2,mz=(z1+z2)/2,m=o.mat,bm=o.band?lam(o.band):null,dep=o.dep||3,n=Math.max(1,Math.round(L/(o.span||8))),s=L/n,pw=o.pier||s*0.32;
  let top=-1e9;for(let i=0;i<=n;i++){const p=toW(-L/2+i*s,0,mx,mz,a);top=Math.max(top,terrainH(p[0],p[1]));}top+=o.H;
  const g=grp(mx,0,mz,a),r=(s-pw)/2,bt=Math.max(0.8,r*0.35),ag=archGeo(s,r,bt,dep);
  for(let i=0;i<=n;i++){const lx=-L/2+i*s,p=toW(lx,0,mx,mz,a),gy=terrainH(p[0],p[1])-1.5,h=top-gy;box(pw,h,dep,m,lx,gy+h/2,0,g);addCirc(p[0],p[1],Math.max(pw,dep)*0.55);
    if(bm)for(let y=gy+3.5;y<top-1.5;y+=3.4)box(pw+0.1,0.45,dep+0.1,bm,lx,y,0,g);}
  for(const f of o.levels||[1]){const yt=top-o.H*(1-f),y0=yt-r-bt;for(let i=0;i<n;i++){const lx=-L/2+(i+0.5)*s,p=toW(lx,0,mx,mz,a);if(y0<terrainH(p[0],p[1])+1.2)continue;const ar=new THREE.Mesh(ag,m);ar.position.set(lx,y0,0);ar.castShadow=true;g.add(ar);}}
  box(L+pw,1.6,dep*0.85,m,0,top+0.8,0,g);box(L+pw,0.5,dep*0.95,lam('#a8634a'),0,top+1.85,0,g);
  for(let i=0;i<=n;i+=2){const p=toW(-L/2+i*s,0,mx,mz,a);footprints.push({x:p[0],z:p[1],r:6,noFlat:true});}return{g,top};}
// puente de piedra largo con arcos, pretiles, rampas y su superficie para caminar
function stoneBridge(x1,z1,x2,z2,w,span,deck,mat){const dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz),a=Math.atan2(-dz,dx),mx=(x1+x2)/2,mz=(z1+z2)/2,n=Math.max(2,Math.round(L/span)),s=L/n,pw=s*0.3,r=(s-pw)/2,bt=0.9;
  const g=grp(mx,0,mz,a),ag=archGeo(s,r,bt,w);
  box(L,1.1,w,mat,0,deck-0.55,0,g);for(const sd of[-1,1]){box(L,1,0.45,mat,0,deck+0.5,sd*(w/2-0.22),g);const p=toW(-L/2,sd*(w/2-0.22),mx,mz,a),q=toW(L/2,sd*(w/2-0.22),mx,mz,a);addSeg(p[0],p[1],q[0],q[1],0.3);}
  addPlat(mx,mz,L,w,a,deck);
  for(let i=0;i<=n;i++){const lx=-L/2+i*s,p=toW(lx,0,mx,mz,a),gy=terrainH(p[0],p[1])-3,h=deck-1.1-gy;if(h>0.5)box(pw,h,w+1.2,mat,lx,gy+h/2,0,g);}
  const y0=deck-1.1-r-bt;for(let i=0;i<n;i++){const lx=-L/2+(i+0.5)*s,p=toW(lx,0,mx,mz,a);if(y0<terrainH(p[0],p[1])-2.5)continue;const ar=new THREE.Mesh(ag,mat);ar.position.set(lx,y0,0);g.add(ar);}
  for(const sg of[-1,1]){for(let k=1;k<=10;k++){const lx=sg*(L/2+k*2-1),p=toW(lx,0,mx,mz,a),t=deck-k*0.4;if(t<terrainH(p[0],p[1])-0.2)break;addPlat(p[0],p[1],2.1,w,a,t);box(2.1,1,w,mat,lx,t-0.5,0,g);}}
  return g;}
// circo de provincias: cavea en forma de U, arena, espina con sus metas y cárceres en el extremo recto
function circusH(x,z,a,Lh,R0,R1,H,name){const gy=minGround(x,z,2*(Lh+R1),2*R1,a)-0.1,ST=8;
  const st=(u,R)=>{if(u<0.35){const s=u/0.35;return[-Lh+2*Lh*s,-R];}if(u<0.5){const t=-Math.PI/2+(u-0.35)/0.15*Math.PI;return[Lh+Math.cos(t)*R,Math.sin(t)*R];}if(u<0.85){const s=(u-0.5)/0.35;return[Lh-2*Lh*s,R];}const t=Math.PI/2+(u-0.85)/0.15*Math.PI;return[-Lh+Math.cos(t)*R,Math.sin(t)*R];};
  const skip=u=>u>0.85;
  const P=(u,k)=>{let r,y;if(k===0){r=R0;y=0;}else if(k===1){r=R0;y=2.6;}else{const j=Math.floor((k-2)/2),e=(k-2)%2;r=R0+1.5+(R1-R0-3)*(j+e)/ST;y=2.6+(H-2.6)*(j+1)/ST;}const p=st(u,r);return[p[0],y,p[1]];};
  ringMesh(ringGeo(2+ST*2+1,120,P,skip,k=>k<2?'#e2d9c6':(k%2?'#ddd2bc':'#c4b79d')),x,gy,z,a);
  ringMesh(ringGeo(2,120,(u,k)=>{const p=st(u,R1);return[p[0],k?H:0,p[1]];},skip,()=>'#bdae92'),x,gy,z,a);
  const g=grp(x,gy,z,a),sm=lam('#d9cdb3');const ar=new THREE.Mesh(new THREE.PlaneGeometry(2*Lh+R0,2*R0),lam('#d8c39a'));ar.rotation.x=-Math.PI/2;ar.position.set(R0/2,0.08,0);g.add(ar);
  box(Lh*1.5,1.3,5,sm,0,0.65,0,g);for(const sx of[-1,1]){for(let i=-1;i<=1;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(0.9,6,8),sm);c.position.set(sx*Lh*0.76,3.2,i*1.4);g.add(c);}box(4,1.5,5,sm,sx*Lh*0.76,0.75,0,g);}
  const ob=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.75,10,4),lam('#b9a27f'));ob.position.set(0,6.3,0);g.add(ob);
  for(let i=0;i<12;i++){const zz=-R0+R0*2*(i+0.5)/12;box(0.9,4.5,0.9,sm,-Lh-1,2.25,zz,g);}box(1.2,1,2*R0,sm,-Lh-1,5,0,g);
  for(const R of[R0,R1])for(let i=0;i<102;i++){const u0=i/120,u1=(i+1)/120,p=st(u0,R),q=st(u1,R),pw=toW(p[0],p[1],x,z,a),qw=toW(q[0],q[1],x,z,a);addSeg(pw[0],pw[1],qw[0],qw[1],0.6);}
  footprints.push({x,z,w:2*(Lh+R1),d:2*R1,a,c:'#d8c39a',name,noFlat:true});return g;}
function romaArrive(I,label,who){const a=I.arrive;arriero(I.id,a.x+3,a.z+3,-Math.PI/2,who);PORTS[I.id+(I.sea?'_n':'')]={x:a.x-4,z:a.z,yaw:-Math.PI/2,label};}
const HISP_DRIVER={name:'Lucio Valerio',sub:'Cochero · caminos de Hispania',role:'el cochero',look:{chiton:'#9a8462',short:true,noHimation:true,hair:'#2a1a12'}};
function vineyard(x,z,w,d){const g=new THREE.BoxGeometry(0.5,1.1,0.5);g.translate(0,0.55,0);for(let i=0;i<w/2.5;i++)for(let j=0;j<d/3;j++){const px=x-w/2+i*2.5,pz=z-d/2+j*3;piece('vid',g,lam('#5e7a3a'),px,terrainH(px,pz),pz,0,1,rr(0.8,1.2),1);}}
