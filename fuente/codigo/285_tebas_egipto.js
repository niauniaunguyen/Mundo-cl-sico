// ============================================================ TEBAS DE EGIPTO: destino nuevo en las dos épocas (28/11)
// Las dos orillas del Nilo frente a la antigua capital: en la este, Karnak, Luxor y el camino entre los dos; en la oeste, los Colosos de
// Memnón, el Rameseo, Medinet Habu, Deir el-Bahari, la aldea abandonada de Deir el-Medina y las tumbas de los reyes en la montaña.
// Fuentes: Ilíada IX 381-384; Heródoto II 3, 42, 54-57 y 143; Diodoro I 45-49 (con Hecateo de Abdera, hacia el 300 a.C.); Estrabón
// XVII 1.46; Tácito, Anales II 61; J.-C. Golvin, Ciudades del mundo antiguo, pp. 36-41 (Tebas oriental en tiempos de Ramsés II y
// las dos orillas en el siglo II d.C.; Medinet Habu, Deir el-Bahari, Deir el-Medina).
// En el 386 a.C. reina Hakor, de la dinastía XXIX: Egipto es independiente de Persia, y Tebas, ya sin capital, es la ciudad santa de
// Amón. La avenida de esfinges entre Karnak y Luxor y el gran primer pilono de Karnak son de Nectanebo I (desde el 380): aquí no salen
// en el modo Atenas. En el 80 d.C. Tebas son aldeas entre ruinas (la arrasó Ptolomeo IX hacia el 85 a.C.; Cornelio Galo sofocó otra
// revuelta en el 29 a.C.), pero los templos siguen en uso y los viajeros romanos vienen a oír cantar al Coloso de Memnón.
// El id es tebas_eg (tebas ya es la Tebas de Beocia).
// ESCALA (28/11, segunda versión): los monumentos, a su tamaño real (Karnak, Luxor, el Rameseo, Medinet Habu, Deir el-Bahari, los
// Colosos); lo que se acorta son las distancias entre ellos (de Karnak a Luxor, unos 1,2 km en vez de 3) y el ancho del Nilo (220 m en
// vez de 500-700). El mapa es el mayor que cabe entre dos destinos (R = 1000: un cuadrado de 2,5 km).
const TB={nx:-120,built:false,K:[220,-760],L:[120,470],route:[[120,445],[250,-60],[250,-420],[380,-420]]};
// el Nilo de Tebas (nileX lo usan egNile, egFields y las casas)
{const f=nileX;nileX=function(I,z){if(I&&I.id==='tebas_eg')return I.x+TB.nx+Math.sin((z-I.z)*0.0016)*60;return f.apply(this,arguments);};}
const TB_ISL={id:'tebas_eg',R:1000,H:4,seed:39.4,net:'eg',land:true,step:8,desert:true,dir:[-1,0]};
// la montaña de Occidente, al oeste, con su cumbre (el Qurn) y el acantilado detrás de Deir el-Bahari
const TB_BLOBS=[[-1190,-1050,260,120],[-1180,-780,230,126],[-1110,-760,140,77],[-1160,-470,260,143],[-1190,-180,260,120],[-1170,100,250,110],[-1100,330,150,80],[-1190,560,250,100],[-1200,860,260,90]];
const TB_SAND=new THREE.Color('#d8c4a0'),TB_GREEN=new THREE.Color('#7a9a4a');
function tbTint(x,z,h,c){const I=destOf('tebas_eg');if(!I)return;const d=x-nileX(I,z),w=d<0?380:230,dd=Math.abs(d);if(dd<w)c.lerp(TB_GREEN,0.55*(1-dd/w));else c.lerp(TB_SAND,Math.min(0.85,(dd-w)/160));}
const TB_CFG={arr:[90,-150],blobs:TB_BLOBS,tx:200,tz:-150,tr:40,houses:-1,tint:(x,z,h,c)=>tbTint(x,z,h,c)};
// ---------------- en el modo Atenas
if(typeof crDest==='function')crDest({id:'tebas_eg',pos:[32.65,25.7],links:[],label:'Tebas',
 isl:Object.assign({},TB_ISL,{name:'Tebas de Egipto',gr:'ΘΗΒΑΙ · ΑΙΓΥΠΤΟΣ',sub:'La ciudad santa de Amón: Karnak, Luxor y las tumbas de los reyes al otro lado del río.',
   days:'en barco hasta Náucratis y unas dos semanas remontando el Nilo',ldays:'unas dos semanas remontando el Nilo en barca',fare:26,lfare:8}),
 cfg:Object.assign({},TB_CFG),
 steles:[['tebas_cien','Tebas de las cien puertas','ΘΗΒΑΙ ΕΚΑΤΟΜΠΥΛΟΙ','En la Ilíada, Aquiles dice que no cambiaría su ira ni por todas las riquezas de la Tebas de Egipto, la de las cien puertas, por cada una de las cuales salen doscientos hombres con caballos y carros. Los egipcios la llaman Uaset; los griegos, Tebas o Diospolis, «la ciudad de Zeus», porque su dios Amón es para ellos Zeus. Fue la capital de los grandes faraones hace mil años; ahora la capital está en el delta, y Tebas es la ciudad santa del dios.\n(Ilíada IX 381-384; Heródoto II 42)'],
  ['tebas_hecateo','Hecateo y los sacerdotes','ΕΚΑΤΑΙΟΣ','Heródoto cuenta que el historiador Hecateo de Mileto presumió aquí, ante los sacerdotes de Amón, de que su antepasado número dieciséis era un dios. Los sacerdotes lo llevaron a una gran sala con trescientas cuarenta y cinco estatuas de madera: cada sumo sacerdote había puesto la suya en vida, de padre a hijo, y ninguno era hijo de un dios. Los griegos, le dijeron, son como niños: no tienen historia antigua.\n(Heródoto II 143)']],
 npc:{id:'nesmin_tebas',name:'Nesmin',title:'Sacerdote lector de Amón',glyph:'Ν',look:{chiton:'#f3eee2',himation:'#f3eee2',hair:'#c9a87a',noHimation:true,short:true},
  cat:'Religión',lesson:'Tebas, la ciudad de Amón',where:'En Tebas de Egipto, junto al embarcadero',
  summary:'Tebas (Uaset) fue la capital de Egipto en el Imperio Medio y el Nuevo (hacia 2000-1070 a.C.). Su dios, Amón, se fundió con el sol, Ra, y fue el rey de los dioses; su templo de Karnak es el mayor conjunto religioso del mundo antiguo. Los griegos identificaron a Amón con Zeus, y Heródoto cuenta que el oráculo de Dodona venía de unas sacerdotisas de Tebas. En la orilla oeste se enterraban los reyes, en tumbas excavadas en la roca, y cada uno tenía su templo funerario en la llanura.',
  intro:'Que Amón te guarde. Soy Nesmin, sacerdote lector: leo los rollos sagrados en voz alta en los ritos. Has llegado a la ciudad del dios. Si buscas una ciudad viva, los reyes ahora están en el norte; si buscas a los dioses, este es su sitio.',
  topics:[['¿Quién es Amón?','El Oculto: el rey de los dioses, que se une al sol y se llama Amón-Ra. Su animal es el carnero. Tu pueblo lo llama Zeus, y tiene razón a medias: Zeus lanza rayos, Amón hace que todo exista. Cada año, en la fiesta de Opet, su estatua viaja en barca del templo de Karnak al de Luxor, y toda la ciudad lo acompaña.'],
   ['¿Por qué hay tumbas al otro lado del río?','Porque el sol muere por el oeste. Los vivos estamos en la orilla del este; los muertos, en la del poniente. En la montaña están las tumbas de los reyes antiguos, en un valle escondido, y en la llanura sus templos, donde se les hacían ofrendas. Muchas tumbas fueron saqueadas hace siglos: los ladrones conocen la montaña mejor que los sacerdotes.'],
   ['¿Y ahora quién manda en Egipto?','El faraón Hakor, que reina en el delta. Hace veinte años echamos a los persas, y Hakor tiene soldados griegos a sueldo, por si vuelven. Él está pagando una capilla para la barca de Amón aquí, delante de Karnak: los reyes de ahora quieren que los dioses de antes los conozcan.']],
  quiz:{q:'¿Con qué dios griego identificaban los griegos al Amón de Tebas?',a:['Zeus','Apolo','Hermes'],ko:'No. Para los griegos, Amón era Zeus: por eso llamaban a Tebas Diospolis, la ciudad de Zeus.'}},
 src:{a:['Heródoto II 3, 42, 54-57 y 143','Ilíada IX 381-384','Diodoro I 45-49'],m:['J.-C. Golvin, Ciudades del mundo antiguo, pp. 36-41','B. Kemp, Ancient Egypt: Anatomy of a Civilization (2006)'],n:['Nesmin es inventado. La capilla de Hakor en Karnak existe; su fecha exacta dentro del reinado es insegura.']},
 build(I){tbBuild(I);}});
// ---------------- en el modo Roma
if(typeof ROMA_DESTS!=='undefined'){ROMA_DESTS.push(Object.assign({},TB_ISL,{name:'Tebas y los Colosos de Memnón',gr:'AEGYPTVS · THEBAE',sub:'Aldeas entre ruinas gigantes: Karnak, Luxor, el Coloso que canta y las tumbas de los reyes.',
   days:'en barco hasta Alejandría y unas tres semanas por el Nilo',ldays:'unas tres semanas remontando el Nilo',fare:40,lfare:10,seed:39.9}));
 if(typeof MED_POS_RO!=='undefined')MED_POS_RO.tebas_eg=[32.65,25.7];
 SIMPLE_RO.tebas_eg=Object.assign({npc:'amenothes',label:'Tebas',roman:true},TB_CFG,{
  steles:[['thebae_ruinas','La Tebas de los romanos','THEBAE','Estrabón la vio hace cien años: los restos de su grandeza se extienden ochenta estadios, pero la ciudad son ahora aldeas sueltas, unas en esta orilla, con los templos, y otras en la de enfrente, con el Memnonio. La arrasó el rey Ptolomeo, hacia el 85 a.C., tras una revuelta, y Cornelio Galo, el primer prefecto de Egipto, aplastó otra en el 29 a.C. Los templos siguen en pie, y los sacerdotes tallan en sus muros a los emperadores vestidos de faraones.\n(Estrabón XVII 1.46; Pausanias I 9.3)'],
   ['thebae_viajeros','Los viajeros','PEREGRINATORES','Tebas es el final del gran viaje por Egipto: los romanos ricos suben el Nilo en barca para ver las tumbas de los reyes, que llaman «siringas» por su forma de flauta, y para oír cantar al Coloso al amanecer. Germánico, el sobrino de Tiberio, vino en el año 19; muchos graban su nombre en las piedras, como se hace hoy.\n(Tácito, Anales II 60-61)']],
  extra(I){tbBuild(I);}});
 ROMA_DEST_NPCS.push({id:'amenothes',name:'Amenotes',title:'Guía de los Colosos',glyph:'Α',look:{chiton:'#f3eee2',himation:'#c9a24a',hair:'#1f1610'},
  cat:'Viajes',lesson:'Tebas y el turismo en el Egipto romano',where:'En Tebas, junto al embarcadero',
  summary:'En época romana, Egipto atraía a viajeros que hacían el recorrido de Alejandría, las pirámides y Tebas. En Tebas visitaban las tumbas del Valle de los Reyes, donde hay más de dos mil grafitos griegos y latinos, y el Coloso de Memnón, una estatua del faraón Amenhotep III que, agrietada por un terremoto en el 27 a.C., emitía un sonido al amanecer. En sus piernas hay más de cien inscripciones de visitantes, algunas en verso. Septimio Severo la restauró hacia el 199 y dejó de sonar.',
  intro:'¡Salve, viajero! Soy Amenotes, y por unas monedas te llevo al otro lado del río para oír al Coloso. Hay que llegar antes del alba: Memnón saluda a su madre, la Aurora, solo con los primeros rayos.',
  topics:[['¿Por qué canta la estatua?','Los griegos dicen que es Memnón, el rey de los etíopes al que mató Aquiles en Troya, y que al amanecer saluda a su madre, la Aurora. Los sacerdotes saben que es la estatua del faraón Amenhotep, partida por la mitad en un terremoto hace cien años. Estrabón la oyó y no supo decir si el sonido salía de la piedra o de alguien escondido detrás.'],
   ['¿Quién viene a verla?','Gobernadores, soldados, señoras de Roma con sus esclavos. Graban sus nombres en las piernas del Coloso, y alguno hasta escribe un poema. Si un día no canta, dicen que el dios está enfadado con ellos.'],
   ['¿Qué hay en las siringas?','Galerías que se hunden en la montaña, con las paredes pintadas de dioses, barcas y estrellas: las tumbas de los reyes antiguos. Están vacías: los ladrones se llevaron el oro hace mil años. Pero los colores siguen ahí, y los visitantes bajan con antorchas.']],
  quiz:{q:'¿Por qué «cantaba» el Coloso de Memnón?',a:['Una grieta de un terremoto hacía sonar la piedra al calentarse al amanecer','Tenía un mecanismo de agua dentro','Un sacerdote tocaba la flauta escondido'],ko:'No: según la explicación más aceptada, la grieta abierta por el terremoto del 27 a.C. hacía que la piedra sonara con el cambio de temperatura del amanecer; Estrabón no supo explicarlo.'}});
 ROMA_DEST_SRC.amenothes={a:['Estrabón XVII 1.46','Tácito, Anales II 60-61','Pausanias I 42.3','Diodoro I 46-49'],m:['A. Bernand y É. Bernand, Les inscriptions grecques et latines du Colosse de Memnon (1960)','J.-C. Golvin, Ciudades del mundo antiguo, pp. 36-41'],n:['Amenotes es inventado.']};}
// ---------------- la construcción (las dos épocas)
// medidas reales: recinto de Amón (muralla de Nectanebo) unos 520 × 520 m; templo de Amón, del primer pilono al Akh-menu, unos 350 m;
// sala hipóstila 102 × 53 m con 134 columnas (12 centrales de 21 m, el resto de 15 m); lago sagrado 120 × 77 m; Luxor 260 m;
// Rameseo unos 180 m (recinto 270 × 175); Medinet Habu, recinto 210 × 315 m y templo de 150 m; Deir el-Bahari, unos 270 m con las rampas.
function tbBuild(I){const ro=MODE==='roma',X=x=>I.x+x,Z=z=>I.z+z,N=z=>nileX(I,Z(z))-I.x,Y=(x,z)=>floorAt(X(x),Z(z)),
  G0=tbGeo(),mud=tbMat('mud'),mud2=tbMat('mud2'),sand=tbMat('relief'),sand2=tbMat('stone'),qtz=tbMat('qtz'),gran=tbMat('gran'),gold=lam('#d8b050'),
  P=(id,name,gr,txt,x,z,rot)=>place(id,name,gr,txt,X(x),Z(z),rot||0),grR=(r,g)=>ro?r:g;
  const COLS=[],CAPS=[],BOX={},PUSH=(m,g,mt)=>{(BOX[m.uuid]=BOX[m.uuid]||{mat:m,L:[]}).L.push([g,mt]);},addB=(m,x,y,z,w,h,d,a)=>PUSH(m,boxUV(w,h,d,m.userData.s||4),new THREE.Matrix4().makeRotationY(a||0).setPosition(X(x),y,Z(z)));
  const colW=(wx,wz,r,h,open,coll)=>{const y=floorAt(wx,wz);COLS.push([wx,y,wz,r,h]);CAPS.push([wx,y+h,wz,r,open]);if(coll!==false)addCirc(wx,wz,r*1.05);},TCTX=n=>({push:PUSH,col:colW,name:n}),
    tbTemple=(wx,wz,a,sc,n)=>tbTempleParts(wx,floorAt(wx,wz),wz,a,sc,TCTX(n)),colossus=(x,z,a,H,m)=>{tbColossusParts(X(x),Y(x,z),Z(z),a,H,m,PUSH);addBox(X(x),Z(z),8*H/18,11*H/18,a);};
  const col=(x,z,r,h,open,coll)=>{const y=Y(x,z);COLS.push([X(x),y,Z(z),r,h]);CAPS.push([X(x),y+h,Z(z),r,open]);if(coll!==false)addCirc(X(x),Z(z),r*1.05);};
  const wall=(x1,z1,x2,z2,th,h,m)=>{const L=Math.hypot(x2-x1,z2-z1),a=Math.atan2(x2-x1,z2-z1),mx=(x1+x2)/2,mz=(z1+z2)/2,y=Math.min(Y(x1,z1),Y(x2,z2));addB(m,mx,y+h/2-1,mz,th,h+2,L,a);if(m===sand||m===sand2)addB(tbMat('corn'),mx,y+h+0.5,mz,th+0.9,1.1,L+0.9,a);
    const nx=Math.cos(a)*th/2,nz=-Math.sin(a)*th/2;addSeg(X(x1+nx),Z(z1+nz),X(x2+nx),Z(z2+nz),0.4);addSeg(X(x1-nx),Z(z1-nz),X(x2-nx),Z(z2-nz),0.4);};
  // recinto rectangular con huecos (puertas): sides = {n:[[x0,x1],...],...} huecos en coordenadas del lado
  const encl=(x0,z0,x1,z1,th,h,m,gaps)=>{const side=(ax,az,bx,bz,G)=>{const horiz=az===bz,a0=horiz?ax:az,b0=horiz?bx:bz,cuts=(G||[]).slice().sort((p,q)=>p[0]-q[0]);let s=Math.min(a0,b0);const e=Math.max(a0,b0);
      for(const[g0,g1]of cuts){if(g0>s)horiz?wall(s,az,g0,az,th,h,m):wall(ax,s,ax,g0,th,h,m);s=Math.max(s,g1);}if(e>s)horiz?wall(s,az,e,az,th,h,m):wall(ax,s,ax,e,th,h,m);};
    side(x0,z0,x1,z0,gaps.n);side(x0,z1,x1,z1,gaps.s);side(x0,z0,x0,z1,gaps.w);side(x1,z0,x1,z1,gaps.e);};
  const obel=(x,z,h)=>{const y=Y(x,z),b=h*0.1,g=new THREE.CylinderGeometry(b*0.62,b,h*0.92,4,1);g.rotateY(Math.PI/4);const m=new THREE.Mesh(g,tbMat('obel'));m.position.set(X(x),y+h*0.46+1.2,Z(z));m.castShadow=true;scene.add(m);
    const t=new THREE.Mesh(new THREE.ConeGeometry(b*0.62*0.75,h*0.08,4),gold);t.rotation.y=Math.PI/4;t.position.set(X(x),y+h*0.96+1.2,Z(z));scene.add(t);addB(sand2,x,y+0.6,z,b*1.8,1.2,b*1.8);addCirc(X(x),Z(z),b*0.8);};
  const pylon=(x,z,a,w,h)=>{const r=tbPylonParts(X(x),Y(x,z),Z(z),a,w,h,PUSH);for(const s of[-1,1]){const p=toW(s*w*0.29,0,X(x),Z(z),a);addBox(p[0],p[1],r.tw*0.95,r.td,a);}};
  // carnero sentado (esfinge criocéfala), para las avenidas
  const OSI=[],RAMS=[],SPHS=[],ram=(x,z,a)=>{RAMS.push([X(x),Y(x,z),Z(z),a]);addCirc(X(x),Z(z),1.6);};
  egNile(I,220);
  // ---------------- el embarcadero y la barca a la otra orilla
  {const z=-150;buildPort(I.id,'Tebas',X(N(z)+122),Z(z),-1,0);}
  {const z=40,e=[X(N(z)+140),Z(z)],w=[X(N(z)-140),Z(z)];
   egxObj(e[0],e[1],undefined,()=>egxTeleport(w[0],w[1],undefined,-Math.PI/2,ro?'El barquero te cruza entre barcas de trigo y de turistas. Enfrente, la llanura verde y, al fondo, la montaña de las tumbas.':'El barquero te cruza a la orilla de los muertos. Enfrente, los campos y, al fondo, la montaña.'),'La barca','cruzar a la orilla oeste',3);
   egxObj(w[0],w[1],undefined,()=>egxTeleport(e[0],e[1],undefined,Math.PI/2,'Vuelves en barca a la orilla de Karnak y Luxor.'),'La barca','volver a la orilla este',3);}
  // ================= KARNAK: el eje este-oeste, con la entrada hacia el río
  const[x0,zA]=TB.K;
  // el canal y el muelle, con la avenida de carneros (ramésida, anterior a los dos momentos del juego)
  addRiver([[N(zA)+100,zA],[x0-90,zA]].map(p=>[X(p[0]),Z(p[1])]),16,{name:'El canal de Karnak'});
  addB(sand2,x0-80,Y(x0-80,zA)+0.5,zA,10,2,60);
  for(let i=0;i<10;i++)for(const s of[-1,1])ram(x0-68+i*6.4,zA+s*9,s>0?Math.PI:0);
  if(!ro){const x=x0-34,z=zA-26,g=grp(X(x),Y(x,z),Z(z),0);for(let i=0;i<3;i++)for(const s of[-1,1]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.8,0.9,7,10),sand);c.position.set(-5+i*5,3.5,s*4);g.add(c);addCirc(X(x-5+i*5),Z(z+s*4),0.9);}box(14,0.9,10,sand,0,7.4,0,g);
    P('capilla_hakor','La capilla de Hakor','ΝΑΟΣ ΑΧΩΡΙΟΣ','Junto al muelle, el faraón Hakor levanta una capilla para la barca de Amón: un quiosco de columnas donde descansa la estatua del dios cuando sale en procesión hacia el río. Hakor reina en el delta, lejos, pero quiere que Amón lo reconozca como rey.',x+12,z-10);}
  // el primer pilono (Nectanebo I, después del 380: solo en el 80) y el primer patio, con los muros laterales de los reyes libios
  if(ro){pylon(x0,zA,Math.PI/2,113,31);P('pilono1_karnak','El primer pilono','PYLON','El más grande de Egipto: 113 m de ancho y más de 30 de alto. Lo empezó Nectanebo I, el penúltimo faraón egipcio, y nunca se terminó: todavía se ven las rampas de adobe que usaron para subir los bloques, y no lleva relieves.\n(Golvin, p. 37)',x0-18,zA+64,-Math.PI/2);}
  wall(x0+4,zA-52,x0+86,zA-52,4,11,sand);wall(x0+4,zA+52,x0+86,zA+52,4,11,sand);
  for(let i=0;i<5;i++)for(const s of[-1,1])col(x0+22+i*9,zA+s*7,1.5,21,true);   // el quiosco de Taharqa: diez columnas de 21 m
  tbTemple(X(x0+48),Z(zA+44),Math.PI,0.8,'Templo de Ramsés III (Karnak)');
  P('patio_karnak','El primer patio','ΑΥΛΗ',grR('Un patio de más de cien metros por lado. En medio, el quiosco del faraón nubio Taharqa: diez columnas de veintiún metros. A la derecha, el pequeño templo de Ramsés III, que se abre al patio.','El patio delante del segundo pilono, cerrado a los lados por los muros de los reyes libios. Todavía no tiene pilono delante: el gran pilono que se ve hoy lo empezará Nectanebo I dentro de unos años. En medio, el quiosco del faraón nubio Taharqa: diez columnas de veintiún metros.')+'\n(Golvin, p. 37)',x0+30,zA-30);
  // segundo pilono y la sala hipóstila
  pylon(x0+88,zA,Math.PI/2,98,28);
  {for(let i=0;i<6;i++)for(const s of[-1,1])col(x0+97+i*8.4,zA+s*5.6,1.8,21,true);
   for(let k=0;k<7;k++)for(let i=0;i<9;i++){if(k===0&&(i===0||i===8))continue;for(const s of[-1,1])col(x0+94.5+i*5.9,zA+s*(13+k*5.9),1.35,15,false);}
   const y=Y(x0+116,zA);addB(sand2,x0+116,y+24.6,zA,52,1.4,20);addB(tbMat('ceil'),x0+116,y+23.85,zA,52,0.1,20);for(const s2 of[-1,1])addB(tbMat('ceil'),x0+116,y+16.55,zA+s2*31,52,0.1,41);for(const s of[-1,1]){addB(sand2,x0+116,y+17.2,zA+s*31,52,1.2,41);addB(sand2,x0+116,y+20.6,zA+s*10.6,52,7,1.2);}
   wall(x0+91,zA-52,x0+143,zA-52,3,18,sand);wall(x0+91,zA+52,x0+143,zA+52,3,18,sand);}
  P('hipostila','La sala hipóstila','ΥΠΟΣΤΥΛΟΣ','Ciento treinta y cuatro columnas en forma de papiro sostienen el techo de una sala de 102 × 53 m: las doce del centro, de veintiún metros, con el capitel abierto, y las demás, de quince, cerrado. Por las celosías de piedra de la nave central entra una luz rasante. Las paredes y las columnas están pintadas y cubiertas de relieves: Seti I y Ramsés II ante los dioses, y sus guerras. La empezó Seti I y la terminó Ramsés II, hace más de novecientos años.\n(Golvin, p. 37, n.º 3)',x0+92,zA+20,-Math.PI/2);
  // tercer pilono, obeliscos, pilonos cuarto a sexto, santuario, patio del Imperio Medio y el Akh-menu
  pylon(x0+148,zA,Math.PI/2,100,26);obel(x0+157,zA-6,21.7);obel(x0+172,zA-9,29.5);obel(x0+172,zA+9,29.5);
  pylon(x0+165,zA,Math.PI/2,70,20);pylon(x0+182,zA,Math.PI/2,60,18);pylon(x0+194,zA,Math.PI/2,50,15);
  {const y=Y(x0+212,zA);addB(gran,x0+212,y+6,zA,18,12,9);addBox(X(x0+212),Z(zA),18,9,0);addB(sand2,x0+212,y+5,zA,30,10,26);addBox(X(x0+212),Z(zA),30,26,0);}
  {const y=Y(x0+300,zA);addB(sand,x0+300,y+6,zA,80,12,44);addBox(X(x0+300),Z(zA),80,44,0);for(let i=0;i<10;i++)col(x0+262+i*7.6,zA-24,0.9,8,false);}
  P('obeliscos_karnak','Los obeliscos','ΟΒΕΛΙΣΚΟΙ','Agujas de granito rosa de Asuán, de una sola pieza, con la punta forrada de oro y plata para que brillen al sol. El de Tutmosis I mide casi 22 m; los dos de la reina Hatshepsut, casi 30: su sucesor, que quiso borrar su memoria, los rodeó con un muro para que no se vieran.'+grR(' Augusto se llevó obeliscos de Heliópolis a Roma, y Calígula otro, que ahora está en el circo del Vaticano.','')+'\n(Golvin, p. 37)',x0+160,zA+22,-Math.PI/2);
  P('santuario_karnak','El santuario y el Akh-menu','ΑΔΥΤΟΝ','Al fondo, en penumbra, la capilla donde vive la estatua de Amón en su barca, que solo ven los sacerdotes.'+grR(' La capilla de granito que hay ahora la rehízo Filipo Arrideo, el hermanastro de Alejandro, hacia el 320 a.C.','')+' Más allá, la gran sala de fiestas de Tutmosis III, el Akh-menu, con columnas que imitan los postes de una tienda de campaña, y en sus paredes, las plantas y los animales que el rey trajo de Siria.\n(Golvin, p. 37)',x0+230,zA+30,-Math.PI/2);
  // el lago sagrado (120 × 77 m)
  {const x=X(x0+290),z=Z(zA+128),gy=Y(x0+290,zA+128);pool(x,z,120,77,gy-0.4);for(const[dx,dz,w,d]of[[0,-39,122,2],[0,39,122,2],[-61,0,2,80],[61,0,2,80]])box(w,1,d,M.limestone,x+dx,gy+0.2,z+dz);addBox(x,z,120,77,0);
   P('lago_sagrado','El lago sagrado','ΛΙΜΝΗ ΙΕΡΑ','Un estanque de piedra de 120 × 77 m, alimentado por el agua del Nilo que se filtra bajo tierra. Aquí se purifican los sacerdotes antes de los ritos, dos veces al día y dos veces cada noche, dice Heródoto de los sacerdotes egipcios, y aquí viven los gansos sagrados de Amón.\n(Heródoto II 37)',x0+225,zA+128,-Math.PI/2);}
  // el eje sur: pilonos séptimo a décimo, hacia el templo de Mut
  pylon(x0+175,zA+70,0,60,20);pylon(x0+175,zA+122,0,60,20);pylon(x0+175,zA+190,0,62,22);pylon(x0+175,zA+245,0,66,24);
  // el templo de Jonsu, en la esquina suroeste, y la puerta de Evérgetes (ptolemaica: solo en el 80)
  tbTemple(X(x0+50),Z(zA+170),0,1.3,'Templo de Jonsu');
  if(ro){const x=x0+50,z=zA+262,y=Y(x,z);addB(sand,x-8,y+10.5,z,9,21,14);addB(sand,x+8,y+10.5,z,9,21,14);addB(sand,x,y+19.5,z,7,3,14);addBox(X(x-8),Z(z),9,14,0);addBox(X(x+8),Z(z),9,14,0);}
  P('jonsu','El templo de Jonsu','ΧΩΝΣ','Jonsu, el dios luna, es el hijo de Amón y de Mut: los tres forman la familia divina de Tebas. Su templo, de Ramsés III, mira hacia el sur, hacia Luxor.'+grR(' Delante, en la muralla, la gran puerta que levantó el rey Ptolomeo III Evérgetes.','')+'\n(Golvin, p. 37, n.º 6)',x0+50,zA+232);
  // el recinto: en el 80, la gran muralla de adobe de Nectanebo I (520 × 520 m, 12 m de grueso); en el 386, uno menor y más antiguo
  if(ro){encl(x0-25,zA-260,x0+495,zA+260,12,18,mud,{w:[[zA-60,zA+60]],s:[[x0+30,x0+70],[x0+150,x0+200]],e:[[zA-20,zA+20]],n:[[x0+150,x0+190]]});
    P('recinto_karnak','La muralla de Nectanebo','PERIBOLOS','Una muralla de adobe de más de veinte metros de alto y doce de grueso rodea todo el recinto de Amón: más de dos kilómetros de perímetro. La levantó Nectanebo I; sus hiladas de ladrillo forman ondas, quizá para imitar las aguas del caos de las que nació el mundo.\n(Golvin, p. 37)',x0-40,zA-80,-Math.PI/2);}
  else{encl(x0+80,zA-120,x0+360,zA+175,5,9,mud2,{w:[[zA-40,zA+40]],s:[[x0+150,x0+200]],e:[[zA-15,zA+15]],n:[]});
    P('recinto_karnak','El recinto de Amón','PERIBOLOS','Un muro de adobe rodea el templo y el lago sagrado. Dentro de unos años, Nectanebo I lo sustituirá por una muralla enorme, de doce metros de grueso, que encerrará también el primer patio y el templo de Jonsu. Del muro anterior se sabe poco: su trazado aquí es aproximado.\n(Golvin, p. 37)',x0+40,zA-80,-Math.PI/2);}
  P('karnak',grR('Karnak, la casa de Amón','Karnak, la casa de Amón'),'ΙΠΕΤ ΣΟΥΤ',grR('El mayor templo del mundo: cada faraón, durante dos mil años, le añadió algo, un pilono, un patio, una sala, un obelisco. Diodoro dice que el más antiguo de los cuatro templos de Tebas medía trece estadios de perímetro. Los sacerdotes siguen celebrando los ritos, y en los muros más nuevos aparece Augusto vestido de faraón, ofreciendo a Amón.\n(Diodoro I 45-46; Estrabón XVII 1.46; Golvin, p. 37, n.º 3)',
      'Ipet-sut, «el más venerado de los lugares»: el templo de Amón-Ra, el más grande del mundo. Cada faraón, durante mil quinientos años, le ha añadido un pilono, un patio, una sala o un obelisco: del muelle al fondo hay más de trescientos cincuenta metros. Solo los sacerdotes entran en el santuario; la gente se queda en los patios.\n(Heródoto II 42; Diodoro I 45-46; Golvin, p. 37, n.º 3)'),x0-50,zA-34,-Math.PI/2);
  // ================= MUT: avenida de carneros desde el décimo pilono, el templo y su lago en media luna
  for(let i=0;i<14;i++)for(const s of[-1,1])ram(x0+175+s*9,zA+268+i*12,s>0?-Math.PI/2:Math.PI/2);
  {const mx=x0+175,mz=zA+620;encl(mx-120,mz-170,mx+120,mz+170,5,8,mud2,{n:[[mx-20,mx+20]],s:[],w:[[mz-15,mz+15]],e:[]});tbTemple(X(mx),Z(mz-90),Math.PI,1.2,'Templo de Mut');
   for(const[dx,dz,w,d]of[[-48,10,18,110],[48,10,18,110],[0,64,114,18]]){const x=X(mx+dx),z=Z(mz+dz);pool(x,z,w,d,Y(mx+dx,mz+dz)-0.4);addBox(x,z,w,d,0);}
   P('mut','El templo de Mut','ΜΟΥΤ','Mut, «la madre», es la esposa de Amón. Su templo está rodeado en tres lados por un lago en forma de media luna, el Isheru. En su patio hay cientos de estatuas de la diosa leona Sejmet, sentadas en fila: las puso Amenhotep III, quizá para calmar a la diosa del fuego y de las epidemias.\n(Golvin, p. 37, n.os 4-5)',mx+30,mz-150);}
  P('avenida_carneros','La avenida de los carneros','ΚΡΙΟΙ','El carnero es el animal de Amón: estas esfinges con cuerpo de león y cabeza de carnero, que protegen entre sus patas una pequeña estatua del rey, bordean el camino del templo de Amón al de Mut.\n(Golvin, p. 37)',x0+192,zA+330,-Math.PI/2);
  // ================= el camino de Luxor; en el 80, con las esfinges de Nectanebo I
  {const pts=TB.route,pv=[],sph=[];
   for(let s=0;s<pts.length-1;s++){const a=pts[s],b=pts[s+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]),ang=Math.atan2(b[0]-a[0],b[1]-a[1]),n=Math.ceil(L/6);
     for(let i=0;i<n;i++){const t=(i+0.5)/n,lx=a[0]+(b[0]-a[0])*t,lz=a[1]+(b[1]-a[1])*t;pv.push([new THREE.BoxGeometry(10,0.3,6.4),new THREE.Matrix4().makeRotationY(ang).setPosition(X(lx),Y(lx,lz)+0.1,Z(lz))]);
       if(ro&&i%2===0)for(const sd of[-1,1]){const sx=lx+Math.cos(ang)*sd*8,sz=lz-Math.sin(ang)*sd*8;SPHS.push([X(sx),Y(sx,sz),Z(sz),ang+(sd>0?-Math.PI/2:Math.PI/2)]);addCirc(X(sx),Z(sz),1.3);}}}
   const m=new THREE.Mesh(tbMerge(pv.map(([g,mt])=>[boxUV(10,0.3,6.4,4),mt])),tbMat('stone','#e8dcc0'));m.receiveShadow=true;scene.add(m);
   P('dromos',grR('La avenida de las esfinges','El camino de la procesión'),'ΔΡΟΜΟΣ',grR('Casi tres kilómetros de esfinges con cabeza humana, una frente a otra, unen Karnak con Luxor: las hizo poner Nectanebo I hace más de cuatrocientos años. Por aquí pasa cada año la procesión de Opet, con la barca de Amón a hombros de los sacerdotes. En el juego, el camino es más corto: unos mil doscientos metros.\n(Golvin, p. 37, n.º 2)',
      'Por este camino pasa cada año, en la fiesta de Opet, la procesión que lleva la barca de Amón de Karnak a Luxor, con música, danzas y comida para todos. Dentro de unos años, el faraón Nectanebo I lo bordeará con cientos de esfinges, una frente a otra. En el juego es más corto que el real, de casi tres kilómetros.\n(Golvin, p. 37, n.º 2)'),266,-200,Math.PI/2);}
  // ================= LUXOR: eje norte-sur, entrada al norte (260 m)
  {const[lx,lz]=TB.L;obel(lx-14,lz,25);obel(lx+14,lz,22.5);for(const s of[-1,1])colossus(lx+s*9,lz+3,Math.PI,8,gran);
   pylon(lx,lz+10,0,65,24);
   {const z0=lz+12,z1=lz+69;wall(lx-28,z0,lx-28,z1,3,12,sand);wall(lx+28,z0,lx+28,z1,3,12,sand);for(let i=0;i<9;i++)for(const s of[-1,1]){col(lx+s*24,z0+4+i*6.4,0.9,11,false);col(lx+s*19,z0+4+i*6.4,0.9,11,false);}}
   {const z0=lz+70,z1=lz+122;wall(lx-13,z0,lx-13,z1,3,20,sand);wall(lx+13,z0,lx+13,z1,3,20,sand);for(let i=0;i<7;i++)for(const s of[-1,1])col(lx+s*4.6,z0+4+i*7.4,1.6,19,true);
     const y=Y(lx,z0+26);addB(sand2,lx,y+20,z0+26,13,1.4,52);addB(tbMat('ceil'),lx,y+19.25,z0+26,13,0.1,52);}
   {const z0=lz+124,z1=lz+180;wall(lx-28,z0,lx-28,z1,3,12,sand);wall(lx+28,z0,lx+28,z1,3,12,sand);for(let i=0;i<8;i++)for(const s of[-1,1]){col(lx+s*24,z0+4+i*6.6,0.95,10,false);col(lx+s*19,z0+4+i*6.6,0.95,10,false);}
     for(let i=0;i<8;i++)col(lx-21+i*6,z1-4,0.95,10,false);}
   {for(let i=0;i<4;i++)for(let j=0;j<8;j++)col(lx-21+j*6,lz+184+i*5,0.9,9,false);const y=Y(lx,lz+192);addB(sand2,lx,y+9.6,lz+192,50,1.2,22);}
   {const y=Y(lx,lz+232);addB(sand,lx,y+6,lz+232,40,12,56);addBox(X(lx),Z(lz+232),40,56,0);}
   footprints.push({x:X(lx),z:Z(lz+130),w:60,d:270,a:0,c:'#e2d0a8',name:'Templo de Luxor'});
   if(ro)P('alejandro_luxor','La capilla de Alejandro','ALEXANDER','Al fondo del templo, Alejandro Magno hizo rehacer la capilla de la barca del dios, y en sus relieves aparece vestido de faraón, ofreciendo a Amón. Los egipcios lo aceptaron como hijo del dios: así se lo había dicho el oráculo de Amón en el oasis de Siwa.',lx+30,lz+225,-Math.PI/2);
   P('luxor','Luxor, el templo de Opet','ΙΠΕΤ ΡΕΣΥΤ','El «harén del sur» de Amón, de 260 m de largo: aquí viene el dios desde Karnak en la fiesta de Opet, para renovar cada año la fuerza del faraón. Delante del pilono de Ramsés II, dos obeliscos y sus estatuas; detrás, el patio de Ramsés, la gran columnata de Amenhotep III, con catorce columnas de diecinueve metros, el patio del sol y las salas del dios.'+grR(' Uno de los obeliscos está hoy en París, en la plaza de la Concordia.',' Uno de los dos obeliscos acabará en París, en la plaza de la Concordia, en 1836.')+'\n(Golvin, p. 37, n.os 1 y 7)',lx-40,lz-10,Math.PI/2);
   P('columnata_luxor','La columnata de Amenhotep III','ΣΤΟΑ',grR('Catorce columnas en forma de papiro abierto, de diecinueve metros, en dos filas: el pasillo por el que entra la procesión de Opet. En sus muros, Tutankamón y Horemheb mandaron tallar la fiesta, con los barcos, los músicos y los sacerdotes.','Catorce columnas en forma de papiro abierto, de diecinueve metros, en dos filas: el pasillo por el que entra la procesión de Opet. En sus muros está tallada la fiesta: los barcos, los músicos, los soldados y los sacerdotes.')+'\n(Golvin, p. 37)',lx+20,lz+96,-Math.PI/2);}
  // ================= la ciudad de la orilla este: barrios de casas de adobe de varios pisos (en el 80, aldeas)
  {const occ=[[x0-100,zA-270,x0+510,zA+800],[TB.L[0]-45,TB.L[1]-30,TB.L[0]+45,TB.L[1]+270],[230,-480,270,-40],[TB.L[0]-20,TB.L[1]-40,270,TB.L[1]],[x0+100,-530,x0+200,-470]];
   const segD=(x,z,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],t=clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz),0,1);return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t);},
     busy=(x,z,r)=>occ.some(o=>x>o[0]-r&&x<o[2]+r&&z>o[1]-r&&z<o[3]+r)||TB.route.some((p,i)=>i>0&&segD(x,z,TB.route[i-1],p)<r+12);
   const zones=ro?[[60,-560,190,-380,40],[40,300,230,440,40],[60,-260,220,-120,50],[200,780,420,900,30]]:[[30,-1000,190,-300,190],[30,-300,240,440,330],[520,-450,850,200,150],[60,780,520,950,110],[300,40,560,400,110]];
   const H=[],cols=['#ffffff','#f0e4d0','#e4d4b8','#f6ecdc','#dcc8a8'],BT=[[8,4,7],[9,7.5,8],[8,11,8],[11,3.6,9]];
   for(const[ax,az,bx,bz,n]of zones){let k=0;for(let t=0;t<n*8&&k<n;t++){const ty=ro?[0,3,0,1][Math.floor(R()*4)]:[0,1,1,2,2,3][Math.floor(R()*6)],f=rr(0.9,1.15),w=BT[ty][0]*f,d=BT[ty][2]*f,lx=rr(ax,bx),lz=rr(az,bz);if(busy(lx,lz,Math.max(w,d)/2+3))continue;const x=X(lx),z=Z(lz);
       if(Math.abs(x-nileX(I,z))<135||terrainH(x,z)<1.5||!isFree(x,z,Math.max(w,d)/2+1.5))continue;const a=R()<0.5?0:Math.PI/2,y=floorAt(x,z);
       H.push({x,y,z,ty,f,fy:rr(0.92,1.1),a,c:new THREE.Color(pick(cols))});addBox(x,z,w,d,a);footprints.push({x,z,w,d,a,c:'#b8956a',house:true});k++;}}
   const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),hm=tbMat('house');
   for(let ty=0;ty<4;ty++){const S=H.filter(h=>h.ty===ty);if(!S.length)continue;const im=new THREE.InstancedMesh(G0.house[ty],hm,S.length);S.forEach((h,i)=>{q.setFromAxisAngle(up,h.a);m4.compose(new THREE.Vector3(h.x,h.y,h.z),q,new THREE.Vector3(h.f,h.f*h.fy,h.f));im.setMatrixAt(i,m4);im.setColorAt(i,h.c);});im.castShadow=true;im.receiveShadow=true;scene.add(im);}

   TB.houses=H.length;
   if(!ro)P('ciudad_tebas','La ciudad','ΠΟΛΙΣ','Entre los templos y el río, barrios de casas de adobe apretadas, de varios pisos, con terrazas en el tejado donde se duerme en verano y se secan el grano y el pescado. Diodoro, siguiendo a autores antiguos, dirá que en la Tebas de los grandes reyes había casas de cuatro y cinco pisos. Ya no es la capital, pero sigue siendo una ciudad grande, llena de sacerdotes, escribas, artesanos de los templos y barqueros.\n(Diodoro I 45)',150,-320,Math.PI/2);}
  // ================= LA ORILLA OESTE
  // los Colosos de Memnón (18 m) y el campo de ruinas del templo de Amenhotep III detrás
  {const cx=-430,cz=150;for(const s2 of[-1,1])colossus(cx,cz+s2*12,Math.PI/2,18,qtz);
   for(let i=0;i<120;i++){const lx=cx-20-rr(0,520),lz=cz+rr(-110,110);const x=X(lx),z=Z(lz);if(!isFree(x,z,3))continue;addB(R()<0.3?qtz:sand2,lx,floorAt(x,z)+0.5,lz,rr(1.5,5),rr(0.8,2.6),rr(1.5,4),R()*TAU);addCirc(x,z,1.4);}
   for(let i=0;i<5;i++){const lx=cx-90-i*90,lz=cz+rr(-30,30);addB(qtz,lx,Y(lx,lz)+1.2,lz,2.5,2.4,8,R()*TAU);}   // estatuas caídas
   if(ro)for(let i=0;i<4;i++){const p=makePerson({chiton:pick(['#e8dfcc','#d7c9ab']),himation:pick(['#7a5a3a','#8a3f2f','#4f6a7d']),female:i%2===1,hair:'#3b2a1e'});const x=X(cx+16+i*2),z=Z(cz+rr(-6,6));p.position.set(x,floorAt(x,z),z);p.rotation.y=-Math.PI/2;scene.add(p);addCirc(x,z,0.4);}
   P('memnon',grR('El Coloso que canta','Los colosos de Amenhotep'),'ΜΕΜΝΩΝ',grR('Dos estatuas sentadas de dieciocho metros, del faraón Amenhotep III, guardan la entrada de un templo que ya no existe. Desde que un terremoto partió la del norte, en el 27 a.C., al amanecer suena: los griegos dicen que es Memnón, el hijo de la Aurora al que mató Aquiles, que saluda a su madre. Estrabón lo oyó y sospechó un truco; Germánico vino a oírlo en el año 19. En sus piernas hay grabados nombres y poemas de visitantes.\n(Estrabón XVII 1.46; Tácito, Anales II 61; Pausanias I 42.3)',
      'Dos estatuas sentadas de dieciocho metros, de cuarcita, del faraón Amenhotep III, que reinó hace más de mil años. Detrás, en más de quinientos metros, las ruinas de su templo funerario, el mayor de la orilla oeste: las crecidas del Nilo y los reyes posteriores, que se llevaron sus piedras, lo han dejado en un campo de bloques y estatuas caídas. Dentro de tres siglos y medio, un terremoto partirá una de las estatuas, y empezará a «cantar» al amanecer.\n(Golvin, p. 39, n.º 12)'),cx+18,cz+26,-Math.PI/2);}
  // el Rameseo (recinto 270 × 175 m, templo de unos 180 m), con sus almacenes abovedados y el coloso de Ramsés II
  {const cx=-700,cz=-250;encl(cx-150,cz-88,cx+120,cz+88,4,7,mud2,{e:[[cz-25,cz+25]],w:[],n:[],s:[]});
   pylon(cx+80,cz,-Math.PI/2,67,22);wall(cx+20,cz-32,cx+78,cz-32,3,9,sand);wall(cx+20,cz+32,cx+78,cz+32,3,9,sand);pylon(cx+20,cz,-Math.PI/2,60,18);
   for(let i=0;i<4;i++)for(const s of[-1,1])col(cx-5-i*6,cz+s*14,1.1,10,false);
   for(let i=0;i<6;i++)for(let j=0;j<8;j++)col(cx-35-i*6,cz-21+j*6,1.1,11+(j===3||j===4?3:0),j===3||j===4);
   for(let i=0;i<4;i++)for(const s2 of[-1,1])OSI.push([cx-5-i*6,Y(cx-5-i*6,cz+s2*12.4),cz+s2*12.4,s2>0?Math.PI:0,8]);   // Ramsés como Osiris, ante los pilares del segundo patio
   {const y=Y(cx-50,cz);addB(sand2,cx-50,y+12,cz,36,1.2,48);addB(sand,cx-92,y+5,cz,34,10,36);addBox(X(cx-92),Z(cz),34,36,0);}
   const vg=[];for(let i=0;i<10;i++)for(const s of[-1,1]){const lx=cx-140+i*14,lz=cz+s*62,y=Y(lx,lz),g=new THREE.CylinderGeometry(4.5,4.5,40,10,1,false,0,Math.PI);g.rotateZ(Math.PI/2);g.rotateY(Math.PI/2);vg.push([g,new THREE.Matrix4().makeTranslation(X(lx),y+3,Z(lz))]);addB(mud,lx,y+1.5,lz,9,3,40);addBox(X(lx),Z(lz),9,40,0);}
   const vm=new THREE.Mesh(tbMerge(vg),mud);vm.castShadow=true;scene.add(vm);
   {const x=cx+50,z=cz;if(ro){addB(gran,x,Y(x,z)+2,z+4,6,4,9,0.3);addB(gran,x-4,Y(x,z)+1.6,z-5,7,3.2,5,1.1);addB(gran,x+5,Y(x,z)+1,z-2,3,2,3,0.6);}
    else colossus(x,z,Math.PI/2,19,gran);}
   P('rameseo','El Rameseo','ΟΣΥΜΑΝΔΥΑΣ','El templo funerario de Ramsés II, de unos 180 m. Hecateo de Abdera, que lo vio hacia el 300 a.C., lo llamó la tumba de Osimandias y contó que en la entrada había la estatua más grande de Egipto, con una inscripción: «Soy Osimandias, rey de reyes; si alguien quiere saber lo grande que soy y dónde yazgo, que supere alguna de mis obras».'+grR(' Ahora el coloso está roto en el suelo; no se sabe cuándo cayó, quizá en el terremoto del 27 a.C.','')+' Alrededor, filas de almacenes de adobe con bóveda, para el grano y los tesoros del templo. Sus restos inspirarán en 1818 un poema famoso de Shelley.\n(Diodoro I 47-49; Golvin, p. 39, n.º 15)',cx+108,cz-40,-Math.PI/2);}
  // Medinet Habu: recinto de 210 × 315 m, la puerta alta en forma de fortaleza y el templo de 150 m
  {const cx=-750,cz=620;encl(cx-150,cz-157,cx+60,cz+157,6,18,mud,{e:[[cz-12,cz+12]],w:[[cz-10,cz+10]],n:[],s:[]});
   {const x=cx+66,y=Y(x,cz),st=tbMat('stone'),dk=tbMat('stone','#2a2018');   // la puerta alta: dos torres en talud con almenas redondeadas y ventanas, unidas por un puente, como un migdol sirio
    for(const s2 of[-1,1]){const g=boxUV(18,22,14,4),p2=g.attributes.position;for(let i=0;i<p2.count;i++)if(p2.getY(i)>0)p2.setX(i,p2.getX(i)*0.88);g.computeVertexNormals();PUSH(st,g,new THREE.Matrix4().makeTranslation(X(x),y+11,Z(cz+s2*11)));
      for(let m=0;m<6;m++)PUSH(st,boxUV(1.4,1.8,1.4,4),new THREE.Matrix4().makeTranslation(X(x+7.2),y+22.9,Z(cz+s2*11-6+m*2.4)));for(let m=0;m<6;m++)PUSH(st,boxUV(1.4,1.8,1.4,4),new THREE.Matrix4().makeTranslation(X(x-7.2),y+22.9,Z(cz+s2*11-6+m*2.4)));
      for(const wy of[12,17])PUSH(dk,boxUV(0.3,1.8,1.4,4),new THREE.Matrix4().makeTranslation(X(x+7.95-(wy-12)*0.12),y+wy,Z(cz+s2*11)));addBox(X(x),Z(cz+s2*11),18,14,0);}
    PUSH(st,boxUV(16,6,8,4),new THREE.Matrix4().makeTranslation(X(x),y+19,Z(cz)));PUSH(dk,boxUV(0.3,1.8,1.4,4),new THREE.Matrix4().makeTranslation(X(x+8.05),y+19,Z(cz)));
    for(let m=0;m<4;m++)PUSH(st,boxUV(1.4,1.6,1.4,4),new THREE.Matrix4().makeTranslation(X(x+7.2),y+22.8,Z(cz-3+m*2)));
    for(let m=0;m<12;m++)PUSH(st,boxUV(1.2,1.4,1.2,4),new THREE.Matrix4().makeTranslation(X(x+20),y+3.3,Z(cz-34+m*(m<6?2.4:2.4)+(m<6?0:40))));
    PUSH(st,boxUV(2,2.6,30,4),new THREE.Matrix4().makeTranslation(X(x+20),y+1.3,Z(cz-25)));PUSH(st,boxUV(2,2.6,30,4),new THREE.Matrix4().makeTranslation(X(x+20),y+1.3,Z(cz+25)));addBox(X(x+20),Z(cz-25),2,30,0);addBox(X(x+20),Z(cz+25),2,30,0);}
   pylon(cx+10,cz,-Math.PI/2,68,24);wall(cx-40,cz-38,cx+8,cz-38,3,12,sand);wall(cx-40,cz+38,cx+8,cz+38,3,12,sand);pylon(cx-42,cz,-Math.PI/2,56,20);
   for(let i=0;i<4;i++)for(let j=0;j<6;j++)col(cx-55-i*7,cz-17+j*6.8,1.2,12,false);
   {const y=Y(cx-80,cz);addB(sand2,cx-66,y+12.6,cz,28,1.2,44);addB(sand,cx-112,y+6,cz,46,12,44);addBox(X(cx-112),Z(cz),46,44,0);}
   tbTemple(X(cx+20),Z(cz-110),Math.PI/2,0.7,'Templo pequeño de Amón (Medinet Habu)');
   if(ro){for(let i=0;i<40;i++){const lx=cx+rr(-140,50),lz=cz+rr(-150,150);if(Math.abs(lz-cz)<50&&lx>cx-140)continue;const x=X(lx),z=Z(lz),w=rr(6,10),d=rr(6,10);if(!isFree(x,z,w/2+1))continue;addB(mud,lx,floorAt(x,z)+2,lz,w,4,d,R()<0.5?0:Math.PI/2);addBox(x,z,w,d,0);}}
   P('medinet_habu','Medinet Habu','ΤΖΑΜΕ','El templo funerario de Ramsés III, de 150 m, dentro de una muralla de adobe de 210 × 315 m y dieciocho de alto, con una puerta en forma de torre de fortaleza, a la manera de Siria. En sus muros, Ramsés cuenta su victoria sobre los Pueblos del Mar, que llegaron por mar y por tierra hacia el 1180 a.C. Junto a la entrada, un templo pequeño de Amón, mucho más antiguo, al que los reyes siguen añadiendo puertas y patios.'+grR(' Ahora el recinto es una aldea, Djeme, con casas apiñadas entre los muros.',' En tiempos de guerra, la gente de Tebas vive dentro de sus murallas.')+'\n(Golvin, p. 40)',cx+82,cz+30,-Math.PI/2);}
  // Deir el-Bahari: tres terrazas con pórticos de pilares y dos rampas, contra el acantilado (unos 270 m con el patio de abajo)
  {const cx=-890,cz=-780,c=tbMat('relief','#f4ecdc'),y0=Y(cx,cz);
   addB(c,cx-30,y0+3,cz,60,8,100);addB(c,cx-82,y0+8,cz,44,14,80);addB(c,cx-118,y0+13,cz,30,24,60);addBox(X(cx-60),Z(cz),120,100,0);
   addB(c,cx+12,y0+3.2,cz,26,0.8,10,0);addB(c,cx-46,y0+9.4,cz,26,0.8,10,0);
   const pl=[];for(let i=0;i<22;i++){for(const[xx,h,yy]of[[1.5,7,0],[-51,6,7]]){if(Math.abs(i-10.5)<1.2)continue;const pg=new THREE.BoxGeometry(1.4,h,1.4);pg.translate(0,h/2,0);pl.push([pg,new THREE.Matrix4().makeTranslation(X(cx+xx),y0+yy,Z(cz-46+i*4.4))]);}}
   const pm=new THREE.Mesh(tbMerge(pl),c);pm.castShadow=true;scene.add(pm);
   addB(c,cx+1.5,y0+7.2,cz,4,0.5,96);addB(c,cx-55,y0+13.2,cz,11,0.5,96);   // los techos de los pórticos
   for(let i=0;i<12;i++)OSI.push([cx-100,y0+15,cz-24+i*4.4,Math.PI/2,6.5]);   // los pilares osíricos de la terraza alta: la reina como Osiris
   for(let i=0;i<20;i++)for(const s of[-1,1])ram(cx+40+i*10,cz+s*9,s>0?Math.PI:0);
   P('deir_bahari','Deir el-Bahari','ΔΗΡ ΕΛ ΜΠΑΧΡΙ','Tres terrazas con pórticos de pilares, unidas por rampas, al pie del acantilado: el templo de la reina Hatshepsut, que gobernó Egipto como faraón hace unos mil cien años. Su arquitecto, Senenmut, lo encajó en el circo de roca. En sus relieves se ve la expedición que mandó al país del Punt, al sur del mar Rojo, a buscar incienso, mirra y árboles vivos en macetas.'+grR(' Ahora una de sus capillas es un santuario de Imhotep y de Amenhotep hijo de Hapu, dos sabios divinizados, adonde vienen enfermos a curarse.',' El templo está medio abandonado, y la reina, borrada de muchos muros por su sucesor.')+'\n(Golvin, p. 41)',cx+60,cz+40,-Math.PI/2);}
  // Deir el-Medina: la aldea de los artesanos de las tumbas, unas setenta casas en 130 × 50 m, en ruinas
  {const cx=-980,cz=300;for(let i=0;i<14;i++)for(const s of[-1,1]){const lz=cz-62+i*9,lx=cx+s*10;addB(mud,lx,Y(lx,lz)+0.5,lz,14,rr(0.6,1.8),0.7);}
   for(const s of[-1,1])addB(mud,cx+s*19,Y(cx,cz)+0.7,cz,1,1.6,132);
   P('deir_medina','Deir el-Medina','ΣΕΤ ΜΑΑΤ','Las ruinas de la aldea de los obreros que excavaban y pintaban las tumbas de los reyes: unas setenta casas a lo largo de una calle, dentro de un muro. Sabían leer y escribir, y dejaron miles de notas en trozos de cerámica: cuentas, quejas, cartas, hasta la primera huelga conocida, hacia el 1155 a.C., cuando no les pagaron el grano. Se abandonó hace más de mil años, al dejar de enterrarse aquí los reyes.\n(Golvin, p. 41)',cx+30,cz+70,-Math.PI/2);}
  // las tumbas de los reyes: entradas en la ladera de la montaña (en realidad, en un valle escondido detrás de ella)
  {const ent=[];for(let i=0;i<8;i++){const z=Z(-560+i*40);let x=X(-880);for(let k=0;k<120;k++){if(terrainH(x,z)>14)break;x-=2;}ent.push([x,z]);caveMouth(x,z,Math.PI/2);}
   const e=ent[3];P('valle_reyes',grR('Las siringas','Las tumbas de los reyes'),'ΣΥΡΙΓΓΕΣ',grR('Unas cuarenta tumbas de reyes, dice Estrabón, excavadas en la roca: galerías largas que bajan a la montaña, por eso los griegos las llaman siringas, «flautas». Están vacías desde hace mil años, pero las pinturas de dioses y estrellas siguen ahí, y los visitantes bajan con antorchas y dejan su nombre escrito en las paredes. En el juego las entradas están en la ladera; las de verdad, en un valle escondido detrás de la montaña.\n(Estrabón XVII 1.46; Diodoro I 46.7)',
      'Detrás de esta montaña, en un valle seco y escondido, están las tumbas de los grandes faraones, excavadas en la roca y decoradas con los textos del viaje del sol por la noche. Casi todas las saquearon los ladrones hace siglos. En el juego las entradas están en esta ladera; las de verdad, en el valle de detrás.\n(Diodoro I 46.7; Golvin, p. 39, n.º 18)'),e[0]-I.x+16,e[1]-I.z,Math.PI/2);}
  P('montana_occidental','La montaña de Occidente','ΤΟ ΔΥΤΙΚΟΝ ΟΡΟΣ','La montaña tebana, con su cumbre en forma de pirámide natural, el Qurn: quizá por eso los reyes dejaron de construir pirámides y se enterraron debajo de ella. La protege una diosa serpiente, Meretseger, «la que ama el silencio».\n(Golvin, p. 39, n.º 19)',-860,-430,Math.PI/2);
  // ---- columnas y bloques, instanciados o fundidos (cientos de piezas en pocas llamadas de dibujo)
  {const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),V3=(a,b,c)=>new THREE.Vector3(a,b,c);
   const sm=new THREE.InstancedMesh(G0.shaft,tbMat('colrel'),COLS.length);COLS.forEach((c,i)=>{m4.makeScale(c[3],c[4],c[3]).setPosition(c[0],c[1],c[2]);sm.setMatrixAt(i,m4);});sm.castShadow=true;sm.receiveShadow=true;scene.add(sm);
   const ab=new THREE.InstancedMesh(G0.abac,sand2,CAPS.length);let k=0;
   for(const[open,g]of[[true,G0.capO],[false,G0.capC]]){const Lc=CAPS.filter(c=>!!c[4]===open);if(!Lc.length)continue;const im=new THREE.InstancedMesh(g,tbMat('capt'),Lc.length);
     Lc.forEach((c,i)=>{const hc=c[3]*(open?1.5:1.3);m4.makeScale(c[3]*0.95,hc,c[3]*0.95).setPosition(c[0],c[1],c[2]);im.setMatrixAt(i,m4);m4.makeScale(c[3]*(open?0.8:1),c[3],c[3]*(open?0.8:1)).setPosition(c[0],c[1]+hc,c[2]);ab.setMatrixAt(k++,m4);});im.castShadow=true;scene.add(im);}
   ab.count=k;scene.add(ab);
   for(const[L2,g]of[[RAMS,G0.ram],[SPHS,G0.sph]]){if(!L2.length)continue;const im=new THREE.InstancedMesh(g,tbMat('stone','#e8dcc0'),L2.length);L2.forEach((r,i)=>{q.setFromAxisAngle(up,r[3]);m4.compose(V3(r[0],r[1],r[2]),q,V3(1,1,1));im.setMatrixAt(i,m4);});im.castShadow=true;scene.add(im);}}
  if(OSI.length){const L=[];for(const[x,y,z,a2,h]of OSI){const k=h/6.5,r=new THREE.Matrix4().makeRotationY(a2);const q=[[1.3,4.4,1,0,2.2,0],[1.7,0.7,1.1,0,4.6,0],[0.8,1,0.8,0,5.3,0],[0.9,1.1,0.7,0,6.1,-0.05],[0.25,0.7,0.25,0,4.9,0.45]];
     for(const[w,hh,d,ox,oy,oz]of q){const g=boxUV(w*k,hh*k,d*k,4);g.translate(ox*k,oy*k,oz*k+0.6*k);L.push([g,r.clone().setPosition(X(x),y,Z(z))]);}}
   const m=new THREE.Mesh(tbMerge(L),tbMat('stone','#f0e6d0'));m.castShadow=true;scene.add(m);}
  for(const k in BOX){const B=BOX[k],m=new THREE.Mesh(tbMerge(B.L),B.mat);m.castShadow=true;m.receiveShadow=true;scene.add(m);}
  // palmeras en las dos orillas
  {const pl=[];for(let i=0;i<320;i++){const z=I.z+rr(-I.R,I.R),s=R()<0.5?-1:1,x=nileX(I,z)+s*rr(125,230);if(isFree(x,z,3)&&terrainH(x,z)>1.5)pl.push([x,z]);}egPalms(pl);}
  TB.built=true;}
