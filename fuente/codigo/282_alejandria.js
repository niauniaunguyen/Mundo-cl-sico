// ============================================================ ALEJANDRÍA, REHECHA CON ESTRABÓN Y GOLVIN (modo Roma, 80 d.C.) (28/11)
// Fuentes: Estrabón XVII 1.6-10 (visitó la ciudad hacia el 25 a.C.: es la descripción antigua más completa); J.-C. Golvin, Ciudades del
// mundo antiguo, p. 44 («Alejandría, en los márgenes de Egipto», siglo I a.C., con 16 lugares numerados). En el 80 d.C. la ciudad seguía
// siendo, en lo esencial, la que vio Estrabón.
// Escala: la ciudad real medía unos 30 estadios (5,5 km) de este a oeste y 7 u 8 (1,3 km) de norte a sur; aquí, unos 910 × 470 m. Se
// conservan el orden y la posición relativa de las cosas, no las distancias. Norte = −z (el mar); este = +x; coordenadas locales al mapa.
// Antes: 46 casas sueltas, el Faro en el agua junto a la orilla, sin isla ni dique, y el Museo, el Soma y el Cesareo sin orden.
const ALX={Y:2.4,XS:[-420,-350,-280,-210,-140,-70,0,70,140,210,280,350,420],ZS:[-160,-95,-30,30,95,160,225],W:455,N:-212,S:255,CZ:30,
  faro:[262,-352],occ:[],built:false};
function alxFaro(I){return[I.x+ALX.faro[0],I.z+ALX.faro[1]];}
// el suelo de la ciudad, llano a 2,4 m (antes, lomas de hasta 8 m), con una orilla casi recta; la dársena excavada del Kibotos
// (el mapa usa el relieve real, 188_relieve_real.js, que ignora la altura fija de pad() en tierra: aquí los solares se añaden directamente)
function alxPad(I,lx,lz,r,h){const p={x:I.x+lx,z:I.z+lz,r,h};I.pads.push(p);return p;}
{const f=defineSimple;defineSimple=function(I,o){if(I.id==='alejandria'){
    for(let x=-470;x<=390;x+=50)alxPad(I,x,-192,40,ALX.Y);for(const z of[-120,-40,40,120,200])for(let x=-440;x<=440;x+=80)alxPad(I,x,z,52,ALX.Y);
    alxPad(I,525,70,80,ALX.Y);}   // el hipódromo, fuera de la Puerta Canópica
  const d0=I.arrive,r=f.apply(this,arguments);
  // la llegada provisional de 028_roma.js (a −0,72 R) quedaba como solar suelto aunque el mapa tuviera otra: en Ostia, un islote en el mar
  if(o.arr&&d0&&d0!==I.arrive){const k=I.pads.indexOf(d0);if(k>=0)I.pads.splice(k,1);}
  if(I.id==='alejandria'){if(I.arrive)I.arrive.h=ALX.Y;if(I.town)I.town.h=ALX.Y;alxPad(I,-140,-220,15,-3);if(I.site)I.site.h=ALX.Y+6;}
  return r;};}
// la isla de Faros, el Heptastadio, el cabo Loquias, Antirrodos y el espigón del Timonio: tierra sobre el mar. Con montes («blobs») no salían,
// porque la costa del mapa rebaja todo lo que queda mar adentro; por eso se suman después, como cápsulas (segmento y medio ancho).
const ALX_LAND=[[-330,-350,240,-350,24,3.2],[240,-352,280,-352,20,3.6],[-70,-226,-70,-328,7,2.4],[400,-235,425,-300,24,3.2],[298,-285,312,-285,11,2.6],[205,-232,205,-276,5,2.2]];
{const f=islandBase;islandBase=function(I,x,z){let h=f(I,x,z);if(I.id!=='alejandria')return h;const lx=x-I.x,lz=z-I.z;if(lz>-200||lz<-390)return h;
  for(const[ax,az,bx,bz,hw,H]of ALX_LAND){const dx=bx-ax,dz=bz-az,t=clamp(((lx-ax)*dx+(lz-az)*dz)/(dx*dx+dz*dz||1),0,1),d=Math.hypot(lx-ax-dx*t,lz-az-dz*t);
    const v=d<hw?1.2+H*(1-(d/hw)*(d/hw)):1.2-(d-hw)*0.35;if(v>h)h=v;}return h;};}
// el suelo: tierra batida y arena clara en la ciudad y en la isla (antes, verde de hierba, como un prado)
const ALX_SAND=new THREE.Color('#d8c7a0');
function alxTint(x,z,h,c){const I=destOf('alejandria');if(!I)return;const lx=x-I.x,lz=z-I.z;const ex=Math.max(0,Math.abs(lx)-ALX.W-150),ez=Math.max(0,lz-ALX.S-30,ALX.N-lz-200);
  const k=clamp(1-Math.hypot(ex,ez)/80,0,1);if(k>0)c.lerp(ALX_SAND,0.8*k);}
// los campos del valle del Nilo no van en Alejandría (caían dentro de la ciudad)
{const f=egFields;egFields=function(I){if(I&&I.id==='alejandria')return;return f.apply(this,arguments);};}
function alxBuild(I){
  const X=x=>I.x+x,Z=z=>I.z+z,Y=ALX.Y,occ=(x0,z0,x1,z1)=>ALX.occ.push([Math.min(x0,x1),Math.min(z0,z1),Math.max(x0,x1),Math.max(z0,z1)]),
    stuc=lam('#efe7d6'),lime=M.limestone,marb=M.marble,P=(id,name,gr,txt,x,z,rot)=>place(id,name,gr,txt,X(x),Z(z),rot||0);
  ALX.occ.length=0;footprints.push({x:X(0),z:Z((ALX.N+ALX.S)/2),w:2*ALX.W,d:ALX.S-ALX.N,c:'#d3c29c',noFlat:true});   // el suelo de la ciudad, de tierra batida y no de hierba
  // ---------------- calles: la cuadrícula de Dinócrates, con las dos grandes avenidas de más de un pletro (30 m) que se cruzan en ángulo recto
  {const side=[],main=[];const add=(L,cx,cz,w,d)=>L.push([new THREE.BoxGeometry(w,0.12,d),new THREE.Matrix4().makeTranslation(X(cx),Y+(L===main?0.14:0.1),Z(cz))]);
   for(const x of ALX.XS)add(x===0?main:side,x,(ALX.N+ALX.S)/2,x===0?14:8,ALX.S-ALX.N);
   for(const z of ALX.ZS)add(z===ALX.CZ?main:side,0,z,2*ALX.W+40,z===ALX.CZ?16:8);
   for(const[L,c]of[[side,'#cdbf9f'],[main,'#ddd2ba']]){const m=new THREE.Mesh(mergeGeos(L),lam(c));m.receiveShadow=true;scene.add(m);}}
  // pórticos a los dos lados de la Vía Canópica y de la calle del Soma (columnas instanciadas; entablamento y tejadillo fundidos en una malla)
  {const ent=[],roof=[],run=(ax,az,bx,bz,out)=>{const L=Math.hypot(bx-ax,bz-az),n=Math.floor(L/9),ux=(bx-ax)/L,uz=(bz-az)/L;if(n<1)return;
      for(let i=0;i<=n;i++){const x=ax+ux*i*L/n,z=az+uz*i*L/n;addColumn(X(x),Y,Z(z),0.36,6,0,'ionic');}
      const a=Math.atan2(bx-ax,bz-az),mx=(ax+bx)/2,mz=(az+bz)/2;
      ent.push([new THREE.BoxGeometry(0.9,0.8,L+0.8),new THREE.Matrix4().makeRotationY(a).setPosition(X(mx),Y+6.4,Z(mz))]);
      roof.push([new THREE.BoxGeometry(5.2,0.3,L+0.8),new THREE.Matrix4().makeRotationY(a).setPosition(X(mx+out[0]*2.4),Y+6.75,Z(mz+out[1]*2.4))]);};
   const xs=[-ALX.W+6,...ALX.XS.filter(x=>Math.abs(x)<ALX.W),ALX.W-6];
   for(let i=0;i+1<xs.length;i++){const a=xs[i]+6,b=xs[i+1]-6;if(b-a<12)continue;run(a,ALX.CZ-10,b,ALX.CZ-10,[0,-1]);run(a,ALX.CZ+10,b,ALX.CZ+10,[0,1]);}
   const zs=[ALX.N+18,...ALX.ZS,ALX.S-4];
   for(let i=0;i+1<zs.length;i++){const a=zs[i]+(zs[i]===ALX.CZ?12:6),b=zs[i+1]-(zs[i+1]===ALX.CZ?12:6);if(b-a<12)continue;run(-9,a,-9,b,[-1,0]);run(9,a,9,b,[1,0]);}
   for(const[L,mt]of[[ent,marb],[roof,lam('#b8643f')]]){const m=new THREE.Mesh(mergeGeos(L),mt);m.castShadow=true;m.receiveShadow=true;scene.add(m);}}
  P('via_canopica','La Vía Canópica','VIA CANOPICA','La gran avenida atraviesa la ciudad de punta a punta, de la Necrópolis a la Puerta Canópica, por donde sale el camino de Canopo. Con la calle del Soma, que la corta en ángulo recto, son las dos calles de más de un pletro de ancho (unos 30 metros) que describe Estrabón; las demás también son anchas y caben carros y jinetes. A los dos lados, pórticos de columnas. El arquitecto Dinócrates de Rodas trazó la ciudad a cordel para Alejandro, como un manto macedonio extendido entre el mar y el lago, y orientó las calles para que la brisa del norte las refresque en verano.\n(Estrabón XVII 1.8; J.-C. Golvin, Ciudades del mundo antiguo, p. 44)',-30,ALX.CZ+5,Math.PI/2);
  P('cruce_soma','El cruce de las dos avenidas','QVADRIVIVM','Aquí se cruzan la Vía Canópica y la calle que baja del puerto al lago. Es el centro de la ciudad: al lado, el recinto del Soma, con la tumba de Alejandro. La ciudad tiene unos treinta estadios de largo, y Diodoro, que la visitó hacia el 60 a.C., dice que los registros contaban más de trescientos mil habitantes libres. Con los esclavos, quizá medio millón: la segunda ciudad del mundo después de Roma.\n(Diodoro XVII 52)',-18,ALX.CZ-16,0);
  occ(-ALX.W,ALX.CZ-14,ALX.W,ALX.CZ+14);occ(-13,ALX.N,13,ALX.S);
  // ---------------- la isla de Faros, el Faro y el templo de Isis Faria
  {const[fx,fz]=alxFaro(I),g=grp(fx,floorAt(fx,fz),fz,0),wm=lam('#ece4d0');
   box(30,62,30,wm,0,31,0,g);const o=new THREE.Mesh(new THREE.CylinderGeometry(10,11,30,8),wm);o.position.y=77;g.add(o);const c=new THREE.Mesh(new THREE.CylinderGeometry(6,6.5,14,16),wm);c.position.y=99;g.add(c);
   box(36,1.2,36,lime,0,0.6,0,g);for(const[sx,sz]of[[-1,-1],[1,-1],[-1,1],[1,1]])statue(fx+sx*14.5,floorAt(fx,fz)+62,fz+sz*14.5,Math.atan2(sx,sz),2.2,'bronze');   // los tritones de las esquinas
   const fire=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));fire.scale.set(10,14,1);fire.position.y=112;g.add(fire);statue(fx,floorAt(fx,fz)+106,fz,0,4,'bronze');addBox(fx,fz,30,30,0);
   place('faro','El Faro','PHARVS','En la punta de la isla de Faros se levanta la torre más alta del mundo: más de cien metros de piedra blanca en tres cuerpos, cuadrado, octogonal y redondo. La construyó Sóstrato de Cnido, amigo de los reyes, y se inauguró hacia el 280 a.C., con Ptolomeo II. Su inscripción la dedica a los dioses salvadores, por la salvación de los navegantes: la costa de Egipto es baja y sin señales, y llena de bajíos, y sin la torre los barcos no encontrarían la entrada del puerto. De noche arde un fuego en lo alto; en las esquinas de la terraza, tritones de bronce soplan sus caracolas. Su nombre, faro, servirá para todas las torres de luz.\n(Estrabón XVII 1.6; Golvin, p. 44, n.º 5)',fx-20,fz+22,0);
   place('faro_cerca','El Faro, de cerca','PHARVS','Tres pisos de piedra blanca: el primero, cuadrado, con cientos de habitaciones para los guardas y el combustible, que suben los burros por una rampa interior; el segundo, octogonal; el tercero, redondo, con el fuego. En lo alto, una estatua de bronce, quizá de Zeus Salvador. No queda nada de la torre: la derribaron los terremotos de la Edad Media, y en su sitio se levanta hoy un castillo del siglo XV. Sus bloques se han encontrado en el fondo del mar.\n(Golvin, p. 45)',fx+20,fz+24,0);}
  temple({x:X(140),z:Z(-352),rot:Math.PI/2,W:9,L:16,nW:4,nL:7,colD:0.8,colH:5.4,order:'ionic',cella:{w:5.6,l:9,door:2},name:'Templo de Isis Faria'});
  P('isis_faria','Isis Faria','ISIS PHARIA','Isis es aquí la señora del Faro y de los marinos: la pintan de pie, con una vela hinchada entre las manos, junto a la torre. Los alejandrinos le rezan antes de embarcar, y su culto ha viajado con los barcos del trigo hasta Puteoli, Ostia y la misma Roma, donde tiene templos en el Campo de Marte.',140,-330,0);
  P('isla_faros','La isla de Faros','PHAROS','Una isla larga y estrecha delante de la ciudad, que ya cita la Odisea: Menelao quedó atrapado en ella al volver de Troya. Julio César la saqueó en su guerra de Alejandría, en el 48 a.C., y desde entonces viven en ella pocos, sobre todo pescadores. Sus dos puntas cierran los dos puertos de la ciudad.\n(Odisea IV 354-359; César, Guerra civil III 112; Estrabón XVII 1.6; Golvin, p. 44, n.º 4)',-170,-336,0);
  for(let i=0;i<9;i++){const x=X(-300+i*26+rr(-4,4)),z=Z(-350+rr(-8,8));if(terrainH(x,z)>2&&isFree(x,z,7))courtyardHouse(x,z,R()<0.5?0:Math.PI/2,rr(8,10),rr(8,10),rr(3,3.6),false,true);}
  // ---------------- el Heptastadio, los dos puertos y el Kibotos
  {const L=[];for(let z=-236;z>=-322;z-=6){const x=X(-70),zz=Z(z);L.push([new THREE.BoxGeometry(10,0.3,6.4),new THREE.Matrix4().makeTranslation(x,floorAt(x,zz)+0.05,zz)]);}
   const m=new THREE.Mesh(mergeGeos(L),lam('#d2c5a8'));m.receiveShadow=true;scene.add(m);}
  P('heptastadio','El Heptastadio','HEPTASTADIVM','Un dique de siete estadios (más de un kilómetro) une la isla de Faros con la ciudad y parte el mar en dos puertos: el Gran Puerto al este y el de Eunostos, «el del buen regreso», al oeste. Tenía dos pasos para los barcos, cubiertos con puentes, que en el juego no se han abierto. Con los siglos, la arena se irá acumulando a sus lados y el dique se convertirá en el istmo ancho sobre el que está hoy el centro de la ciudad.\n(Estrabón XVII 1.6; Golvin, pp. 44-45, n.º 10)',-58,-262,Math.PI/2);
  P('gran_puerto','El Gran Puerto','PORTVS MAGNVS','A la derecha de quien entra, la isla y el Faro; a la izquierda, los escollos y el cabo Loquias, con un palacio real. El puerto es tan hondo junto a la orilla que los barcos más grandes atracan al pie de las escaleras. De aquí salen cada verano las naves del trigo hacia Puteoli y Ostia.\n(Estrabón XVII 1.6 y 1.9; Golvin, p. 44, n.º 3)',120,-206,0);
  P('eunostos','El puerto de Eunostos','EVNOSTOS','Al otro lado del Heptastadio está el puerto de Eunostos, «el del buen regreso». Dentro de él, una dársena excavada a mano y cerrada, el Kibotos («la caja»), con los astilleros. Del Kibotos sale un canal navegable hasta el lago Mareotis, de modo que las barcazas del Nilo pueden llegar al mar sin salir a mar abierto.\n(Estrabón XVII 1.10; Golvin, p. 44, n.os 11-12)',-190,-205,0);
  P('kibotos','El Kibotos','KIBOTOS','La dársena excavada del puerto de Eunostos, con astilleros. De aquí parte el canal que lleva al lago Mareotis; en el juego, el canal no se ha trazado.\n(Estrabón XVII 1.10; Golvin, p. 44, n.º 12)',-140,-198,0);
  for(const[x,z,a]of[[110,-262,0.3],[230,-252,-0.4],[40,-286,1.2],[-200,-262,0.2],[-320,-250,-0.6]])makeShip(X(x),Z(z),a);
  {const sh=shoreAlong(X(0),Z(-170),0,-1,140);buildPort(I.id,'Alejandría',sh[0],sh[1],0,-1);}
  occ(-12,ALX.N,22,-150);
  // ---------------- la orilla del Gran Puerto, de oeste a este: astilleros, almacenes, Emporio, Cesareo, Timonio, Poseidion, teatro, palacios
  for(let i=0;i<4;i++)blockBuilding({name:'Astilleros (Neoria)',x:X(-52+i*8.5),z:Z(-200),rot:0,w:6.8,d:24,h:5.5,mat:lam('#c9b48b')});
  P('neoria','Los astilleros','NEORIA','Naves cubiertas donde se construyen y se reparan los barcos, junto al arranque del Heptastadio. Las quillas se apoyan en rampas que bajan hasta el agua.\n(Estrabón XVII 1.9)',-36,-178,0);occ(-60,ALX.N,-18,-180);
  for(let i=0;i<3;i++)blockBuilding({name:'Almacenes del puerto',x:X(36+i*17),z:Z(-196),rot:0,w:14,d:28,h:7,mat:stuc});
  P('apostaseis','Los almacenes','APOSTASEIS','Almacenes para las mercancías que llegan por mar y por el Nilo: trigo, papiro, lino, vidrio, perfumes, especias de Arabia y de la India que suben por el mar Rojo. Alejandría es el mayor mercado del mundo conocido, dice Estrabón: exporta mucho más de lo que importa, y los barcos que llegan de Italia vuelven medio vacíos.\n(Estrabón XVII 1.7 y 1.9-13; Golvin, p. 44, n.º 9)',52,-176,0);occ(25,ALX.N,72,-178);
  stoa({name:'El Emporio',x:X(104),z:Z(-196),rot:Math.PI,len:44,depth:9,colH:6});
  P('emporio','El Emporio','EMPORIVM','La lonja del puerto: aquí se cierran los tratos, se pagan las aduanas y se fletan los barcos. Se oyen el griego de los mercaderes, el egipcio de los barqueros, el latín de los soldados y el arameo de los sirios y los judíos.\n(Estrabón XVII 1.9)',104,-176,0);occ(80,ALX.N,128,-182);
  romanTemple({x:X(160),z:Z(-148),rot:Math.PI,W:18,L:30,pod:3,colD:1.1,colH:11,nW:6,deep:2,name:'Cesareo'});
  for(const s of[-1,1])stoa({name:'Pórticos del Cesareo',x:X(160+s*24),z:Z(-140),rot:Math.PI/2,len:46,depth:6,colH:6});
  egObelisks([[X(148),Z(-205),0.55],[X(172),Z(-205),0.55]]);
  place('cesareo','El Cesareo y sus obeliscos','CAESAREVM','Cleopatra empezó este templo para Marco Antonio, y Augusto lo terminó para el culto del emperador. Filón, que lo vio, habla de pórticos, bibliotecas, bosques sagrados y propileos, frente a los puertos. Delante, junto al agua, Augusto hizo poner dos obeliscos traídos de Heliópolis, que el faraón Tutmosis III había levantado unos mil quinientos años antes. Dentro de diecinueve siglos, uno estará en Londres y otro en Nueva York, y los llamarán «las agujas de Cleopatra», aunque ella nunca los vio aquí.\n(Estrabón XVII 1.9; Filón, Embajada a Gayo 151)',X(160),Z(-190),0);occ(128,ALX.N,192,-108);
  {const x=X(205),z=Z(-272),gy=floorAt(x,z),r=new THREE.Mesh(new THREE.CylinderGeometry(5,5.4,6,16),stuc);r.position.set(x,gy+3,z);r.castShadow=true;scene.add(r);const cn=new THREE.Mesh(new THREE.ConeGeometry(6,3,16),lam('#b8643f'));cn.position.set(x,gy+7.5,z);scene.add(cn);addCirc(x,z,5.5);}
  P('timonio','El Timonio','TIMONIVM','Al final de este espigón, Marco Antonio se hizo una casita tras perder la batalla de Accio, en el 31 a.C., y la llamó Timonio, por Timón de Atenas, el que odiaba a todo el mundo: quería vivir solo, lejos de los amigos que lo habían abandonado. No le duró mucho: volvió al palacio con Cleopatra, y al año siguiente los dos estaban muertos.\n(Estrabón XVII 1.9; Plutarco, Antonio 69)',205,-252,0);
  temple({x:X(236),z:Z(-196),rot:Math.PI,W:9,L:14,nW:4,nL:6,colD:0.8,colH:5.4,cella:{w:5.6,l:8,door:2},name:'Templo de Poseidón (Poseidion)'});
  P('poseidion','El Poseidion','POSIDIVM','Un saliente de la orilla, como un codo, con un templo de Poseidón: los marinos le dejan ofrendas al llegar y al partir.\n(Estrabón XVII 1.9)',236,-178,0);occ(222,ALX.N,250,-182);
  greekTheatre({x:X(285),z:Z(-148),rot:Math.PI,R0:10,R1:36,H:12,name:'Teatro de Alejandría'});
  P('teatro_alex','El teatro','THEATRVM','Detrás del islote de Antirrodos, mirando al Gran Puerto. Los alejandrinos tienen fama de ser el público más ruidoso del mundo: aplauden, silban e inventan apodos para todos, también para los gobernantes. Dentro de unos años, el orador Dión de Prusa les echará en cara que solo piensan en el teatro y en las carreras de caballos.\n(Estrabón XVII 1.9; Dión de Prusa, Discurso XXXII)',260,-116,0);occ(245,-190,325,-108);
  // ---------------- los palacios, el cabo Loquias y Antirrodos (el barrio real, entre un cuarto y un tercio de la ciudad, según Estrabón)
  blockBuilding({name:'Palacio del cabo Loquias',x:X(418),z:Z(-284),rot:0,w:38,d:24,h:10,mat:stuc,socle:true});stoa({name:'Pórtico del palacio de Loquias',x:X(418),z:Z(-266),rot:0,len:38,depth:6,colH:6});
  blockBuilding({name:'Palacio de Antirrodos',x:X(305),z:Z(-287),rot:0,w:16,d:12,h:7,mat:stuc});
  {const cx=372,cz=-150;blockBuilding({name:'Palacio real',x:X(cx),z:Z(cz-30),rot:0,w:58,d:16,h:12,mat:stuc,socle:true});
   for(const[dx,dz,a,len]of[[0,26,0,58],[-26,0,Math.PI/2,44],[26,0,Math.PI/2,44]])stoa({name:'Peristilo del palacio',x:X(cx+dx),z:Z(cz+dz),rot:a,len,depth:6,colH:6.5});
   blockBuilding({name:'Palacio de los Ptolomeos',x:X(385),z:Z(-72),rot:0,w:50,d:24,h:10,mat:stuc,socle:true});}
  P('palacios','Los palacios','BASILEIA','El barrio de los palacios ocupa entre un cuarto y un tercio de la ciudad: cada rey quiso añadir el suyo, y así se fueron sumando unos a otros hasta el puerto. Ya no hay reyes: desde que Augusto venció a Cleopatra, en el 30 a.C., Egipto es del emperador, y en el palacio vive el prefecto, un caballero romano. Los jardines, los paseos y los salones siguen ahí.\n(Estrabón XVII 1.8; Golvin, p. 44, n.os 6-7)',372,-112,0);
  P('loquias','El cabo Loquias','LOCHIAS','El cabo que cierra el Gran Puerto por el este, con un palacio real. Debajo, un puerto pequeño y escondido, solo para los reyes.\n(Estrabón XVII 1.9)',405,-250,0);
  P('antirrodos','Antirrodos','ANTIRRHODVS','Un islote en el Gran Puerto con un palacio y un puerto pequeño. Su nombre es una broma: «la rival de Rodas». Allí murió Cleopatra, según una tradición; los arqueólogos lo encontrarán bajo el agua en los años noventa del siglo XX.\n(Estrabón XVII 1.9; Golvin, p. 44, n.º 8)',305,-262,0);
  occ(330,ALX.N,ALX.W,-45);
  // ---------------- el Museo y la Biblioteca
  blockBuilding({name:'El Museo',x:X(176),z:Z(-66),rot:0,w:50,d:20,h:11,mat:marb,door:true,socle:true});
  blockBuilding({name:'La Biblioteca',x:X(246),z:Z(-68),rot:0,w:44,d:18,h:12,mat:marb,door:true,socle:true});
  stoa({name:'Paseo del Museo (peripatos)',x:X(210),z:Z(-42),rot:0,len:118,depth:6,colH:6});
  {const x=X(210),z=Z(-86),gy=floorAt(x,z),e=new THREE.Mesh(new THREE.CylinderGeometry(9,9,7,20,1,true,Math.PI/2,Math.PI),marb);e.position.set(x,gy+3.5,z);e.material.side=THREE.DoubleSide;scene.add(e);addCirc(x,z+4,2);}   // la exedra
  place('museo','El Museo','MVSEVM','El Museo, la casa de las Musas, es parte de los palacios: tiene un paseo cubierto, una exedra con asientos y una gran sala donde comen juntos los sabios. Viven a costa del rey, y ahora del emperador, que nombra al sacerdote que lo dirige. Aquí Euclides ordenó la geometría, Eratóstenes midió la Tierra, Herófilo estudió por dentro el cuerpo humano y setenta y dos sabios tradujeron al griego la Ley de los judíos. El emperador Claudio le añadió un edificio nuevo.\n(Estrabón XVII 1.8; Suetonio, Claudio 42)',X(176),Z(-48),0);
  P('biblioteca','La Biblioteca','BIBLIOTHECA','Los Ptolomeos quisieron reunir todos los libros del mundo: los barcos que atracaban debían dejar copiar sus rollos, y se dice que llegó a tener cientos de miles. En la guerra de César, en el 48 a.C., ardieron muchos libros, quizá los de los almacenes del puerto. La Biblioteca sigue trabajando; la otra gran biblioteca de la ciudad está en el Serapeo.\n(Séneca, Sobre la tranquilidad del alma 9.5; Golvin, p. 45)',246,-48,0);
  occ(140,-100,282,-34);NPC_POS.heron=[X(210),Z(-50),0];
  // ---------------- el Soma: la tumba de Alejandro, en un recinto con las de los Ptolomeos
  {const x=X(36),z=Z(-2),gy=floorAt(x,z);rectWall(x,z,50,40,lime,3);const r=new THREE.Mesh(new THREE.CylinderGeometry(11,12,9,24),marb);r.position.set(x,gy+4.5,z);r.castShadow=true;scene.add(r);
   const cn=new THREE.Mesh(new THREE.ConeGeometry(12.5,8,24),lam('#d9cdb4'));cn.position.set(x,gy+13,z);scene.add(cn);addCirc(x,z,12.2);footprints.push({x,z,r:14,c:'#e2d6c0',name:'Soma'});}
  place('soma','La tumba de Alejandro','SOMA','En el Soma, «el Cuerpo», un recinto con las tumbas de los reyes, reposa Alejandro Magno, que fundó la ciudad en el 331 a.C. Su general Ptolomeo se llevó el cuerpo cuando lo trasladaban a Macedonia. El ataúd de oro lo fundió un rey posterior, y ahora el cuerpo está en uno de cristal. Augusto vino a verlo: le puso una corona de oro, le echó flores y, al tocarlo, se dice que le rompió un trozo de la nariz. Cuando le ofrecieron ver también a los Ptolomeos, respondió que había venido a ver a un rey, no a muertos. Nadie sabe hoy dónde estaba: la forma del edificio es una hipótesis.\n(Estrabón XVII 1.8; Suetonio, Augusto 18; Dion Casio LI 16)',X(36),Z(26),0);
  occ(9,-24,63,22);
  // ---------------- el gimnasio y los tribunales, en medio de la ciudad
  {const cx=240,cz=66;for(const[dx,dz,a,len]of[[-50,-22,Math.PI,70],[50,-22,Math.PI,70],[0,22,0,170],[-86,0,Math.PI/2,40],[86,0,-Math.PI/2,40]])stoa({name:'Pórticos del Gimnasio',x:X(cx+dx),z:Z(cz+dz),rot:a,len,depth:7,colH:6.5});
   const s=new THREE.Mesh(new THREE.PlaneGeometry(150,30),lam('#dcc596'));s.rotation.x=-Math.PI/2;s.position.set(X(cx),Y+0.1,Z(cz));s.receiveShadow=true;scene.add(s);}
  P('gimnasio','El Gimnasio','GYMNASIVM','El edificio más hermoso de la ciudad, dice Estrabón: sus pórticos miden más de un estadio. Aquí se entrenan los jóvenes de las familias griegas, y estar inscrito en el gimnasio es lo que distingue a un ciudadano de Alejandría de un simple egipcio. Al lado están los tribunales y unos bosquecillos.\n(Estrabón XVII 1.10)',240,44,0);occ(148,40,332,96);
  // ---------------- el Paneion: una colina artificial en forma de piña, con un camino en espiral
  {const x=X(105),z=Z(128),gy=floorAt(x,z),c=new THREE.Mesh(new THREE.ConeGeometry(27,24,28,6),lam('#b9a27a'));c.position.set(x,gy+12,z);c.castShadow=true;c.receiveShadow=true;scene.add(c);addCirc(x,z,26);
   const pts=[];for(let i=0;i<=140;i++){const t=i/140,a=t*TAU*3.2,r=26.5-t*24;pts.push(new THREE.Vector3(x+Math.cos(a)*r,gy+0.4+t*23.3,z+Math.sin(a)*r));}
   const tb=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),200,0.7,4,false),lam('#e0d2b2'));scene.add(tb);
   const sh=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,2.4,10),marb);sh.position.set(x,gy+25,z);scene.add(sh);}
  P('paneion','El Paneion','PANEION','Una colina hecha a mano, en forma de piña, que parece de roca: se sube por un camino en espiral, y desde arriba se ve la ciudad entera, el mar y el lago. Está dedicada a Pan. En el juego no se puede subir.\n(Estrabón XVII 1.10)',105,94,0);occ(74,96,136,160);
  // ---------------- el Serapeo (el templo lo levanta buildSimple en el montículo de o.site) y el barrio egipcio de Rhakotis
  {const s=I.site;for(const[dx,dz,a,len]of[[0,-40,0,86],[0,40,Math.PI,86],[-43,0,Math.PI/2,70],[43,-22,-Math.PI/2,26],[43,22,-Math.PI/2,26]])stoa({name:'Pórticos del Serapeo',x:s.x+dx,z:s.z+dz,rot:a,len,depth:6,colH:6});}
  P('serapeo','El Serapeo','SERAPEVM','Sobre una colina del barrio egipcio, el templo de Serapis, el dios que los primeros Ptolomeos crearon para griegos y egipcios a la vez: con barba y cara de Zeus, el cesto de grano en la cabeza y algo de Osiris y del buey Apis. Su estatua, de Briaxis, es de las más famosas del mundo. En el recinto, con pórticos, hay otra biblioteca, la «hija» de la grande. Vespasiano, el padre del emperador, vino aquí en el 69, al ser proclamado: dicen que curó a un ciego y a un cojo por consejo del dios.\n(Estrabón XVII 1.10; Tácito, Historias IV 81-84; Golvin, p. 44, n.º 14)',-300,98,0);
  occ(-352,92,-248,208);
  P('rhakotis','Rhakotis, el barrio egipcio','RHACOTIS','Antes de Alejandro aquí había una aldea egipcia, Rhakotis, y los egipcios siguen llamando así a la ciudad. En este barrio del oeste viven muchos de ellos: templos de sus dioses, talleres, mercados de papiro y de lino, y se habla egipcio. La ciudad tiene cinco barrios, con las cinco primeras letras del alfabeto griego por nombre.\n(Estrabón XVII 1.6; Filón, Contra Flaco 55)',-215,52,0);
  // ---------------- el barrio Delta y la gran sinagoga
  blockBuilding({name:'Gran sinagoga',x:X(392),z:Z(118),rot:Math.PI/2,w:44,d:26,h:13,mat:stuc,socle:true});
  place('judios_alex','Los judíos de Alejandría','IVDAEI','Alejandría es la ciudad con más judíos del mundo después de Jerusalén: dos de sus cinco barrios son sobre todo judíos, y el del noreste, junto a los palacios, se llama Delta. Tienen sinagogas, magistrados propios y hablan griego; aquí se tradujo la Biblia al griego. Una tradición recogida en el Talmud recuerda una sinagoga tan grande que el encargado agitaba un pañuelo para que los del fondo supieran cuándo responder «amén». Las peleas entre griegos y judíos acabaron en matanzas en el 38 y en el 66; la sinagoga será destruida en la gran revuelta del 115-117.\n(Filón, Contra Flaco 55; Josefo, Guerra II 487-498; Tosefta, Sukkah 4.6)',X(392),Z(90),0);
  occ(366,92,418,144);
  // ---------------- las murallas y las puertas
  {const segs=[[[-ALX.W,ALX.N+6],[-ALX.W,ALX.CZ-12]],[[-ALX.W,ALX.CZ+12],[-ALX.W,ALX.S]],[[ALX.W,ALX.N+30],[ALX.W,ALX.CZ-12]],[[ALX.W,ALX.CZ+12],[ALX.W,ALX.S]],[[-ALX.W,ALX.S],[-12,ALX.S]],[[12,ALX.S],[ALX.W,ALX.S]]];
   for(const[[ax,az],[bx,bz]]of segs){const L=Math.hypot(bx-ax,bz-az),n=Math.max(1,Math.round(L/62));for(let i=0;i<n;i++){const x0=ax+(bx-ax)*i/n,z0=az+(bz-az)*i/n,x1=ax+(bx-ax)*(i+1)/n,z1=az+(bz-az)*(i+1)/n,l=Math.hypot(x1-x0,z1-z0),g0=Math.min(terrainH(X(x0),Z(z0)),terrainH(X(x1),Z(z1)));
       box(2.8,12,l+0.4,lime,X((x0+x1)/2),g0+4.5,Z((z0+z1)/2)).rotation.y=Math.atan2(x1-x0,z1-z0);addSeg(X(x0),Z(z0),X(x1),Z(z1),1.4);
       if(i>0){box(7,15,7,lime,X(x0),terrainH(X(x0),Z(z0))+6,Z(z0));addCirc(X(x0),Z(z0),4);}}}
   for(const[gx,gz,a]of[[-ALX.W,ALX.CZ,0],[ALX.W,ALX.CZ,0],[0,ALX.S,Math.PI/2]])for(const s of[-1,1]){const x=gx+(a?s*15:0),z=gz+(a?0:s*15);box(10,18,10,lime,X(x),terrainH(X(x),Z(z))+7,Z(z));addBox(X(x),Z(z),10,10,0);}}
  P('puerta_canopica','La Puerta Canópica','PORTA CANOPICA','La puerta del este. Por ella sale la Vía Canópica hacia Canopo, la ciudad de los placeres en la boca del Nilo, y hacia Nicópolis, el suburbio que fundó Augusto donde venció a Antonio, con su anfiteatro y su estadio. Fuera, el hipódromo.\n(Estrabón XVII 1.10 y 1.16)',ALX.W-14,ALX.CZ+18,-Math.PI/2);
  P('puerta_necropolis','La puerta de la Necrópolis','PORTA OCCIDENTALIS','La puerta del oeste: al otro lado empieza la ciudad de los muertos.',-ALX.W+14,ALX.CZ+18,Math.PI/2);
  // ---------------- la Necrópolis, fuera de las murallas, al oeste
  {const L=[];for(let k=0,t=0;k<26&&t<300;t++){const x=-rr(478,600),z=rr(-150,200),wx=X(x),wz=Z(z);if(terrainH(wx,wz)<1.5||!isFree(wx,wz,6))continue;
     const w=rr(3,6),d=rr(3,6),h=rr(2.2,4.5),gy=minGround(wx,wz,w,d,0);box(w,h+2,d,R()<0.5?lime:stuc,wx,gy+h/2-1,wz);addBox(wx,wz,w,d,0);if(R()<0.4)box(w+0.6,0.5,d+0.6,lime,wx,gy+h+0.1,wz);k++;}
   for(let i=0;i<3;i++){const x=X(-560+i*30),z=Z(-60+i*55);if(terrainH(x,z)>1.5)tumulus(x,z,rr(5,7),rr(2.5,3.5),'#b9a27a');}
   blockBuilding({name:'Taller de los embalsamadores',x:X(-500),z:Z(150),rot:0,w:16,d:10,h:5,mat:lam('#c9b48b')});
   const pl=[];for(let i=0;i<40;i++){const x=X(-rr(470,620)),z=Z(rr(-150,220));if(terrainH(x,z)>1.5&&isFree(x,z,4))pl.push([x,z]);}egPalms(pl);}
  P('necropolis','La Necrópolis','NECROPOLIS','Al oeste, al otro lado del canal, la ciudad de los muertos: jardines, tumbas de todas clases y talleres donde se embalsama a los difuntos. Muchas tumbas son galerías excavadas en la roca, con nichos para muchos muertos y pinturas que mezclan dioses egipcios y ropas griegas.\n(Estrabón XVII 1.10; Golvin, p. 44, n.º 13)',-490,ALX.CZ-26,Math.PI/2);
  // ---------------- el hipódromo, fuera de la Puerta Canópica
  stadiumG(X(528),Z(72),Math.PI/2,128,34,'Hipódromo de Alejandría');
  P('hipodromo_alex','El hipódromo','HIPPODROMVS','Fuera de la Puerta Canópica, la pista de las carreras de carros. Los alejandrinos se apasionan tanto por los caballos que Dión de Prusa les dirá que en el hipódromo pierden la cabeza como borrachos.\n(Estrabón XVII 1.10; Dión de Prusa, Discurso XXXII 41-46; Golvin, p. 44, n.º 16)',528,44,0);
  // ---------------- el puerto del lago Mareotis
  {const sh=shoreAlong(X(0),Z(ALX.S+10),0,1,200);const qz=sh[1]-I.z;box(150,4,7,lime,X(0),0,sh[1]+1);addPlat(X(0),sh[1]+1,150,7,0,1.9);
   for(const[x,a]of[[-50,0.2],[30,-0.3]])makeShip(X(x),sh[1]+30,Math.PI/2+a);
   P('mareotis','El puerto del lago Mareotis','LACVS MAREOTIS','Al sur, el lago Mareotis, unido al Nilo por canales. Por él llegan las barcazas con el trigo, el papiro y la piedra de todo Egipto, y su puerto mueve más mercancía que el del mar, dice Estrabón. Como la crecida del Nilo lo llena en verano, el lago no se estanca y el aire de la ciudad es sano.\n(Estrabón XVII 1.7; Golvin, p. 44, n.º 2)',X(0)-I.x+26,qz-12,0);}
  // ---------------- palmeras en los jardines del palacio, del Museo y del Gimnasio
  {const pl=[];for(const[x0,z0,x1,z1,n]of[[330,-200,445,-40,26],[140,-100,282,-34,10],[160,50,320,82,12],[-440,-200,-80,-170,8]])for(let i=0;i<n*3&&pl.length<200;i++){const x=X(rr(x0,x1)),z=Z(rr(z0,z1));if(terrainH(x,z)>1.6&&isFree(x,z,4))pl.push([x,z]);}egPalms(pl);}
  alxHouses(I);ALX.built=true;}
// ---------------- las casas: cada manzana de la cuadrícula, llena de casas de dos y tres pisos (Estrabón: la ciudad está «llena de edificios
// públicos y sagrados», y el resto, de casas apretadas). Casas de Blender instanciadas; sin modelos, casas de patio sencillas.
function alxHouses(I){const X=x=>I.x+x,Z=z=>I.z+z,Y=ALX.Y,hit=(x0,z0,x1,z1)=>ALX.occ.some(o=>x0<o[2]&&x1>o[0]&&z0<o[3]&&z1>o[1]);
  const xs=[-ALX.W,...ALX.XS,ALX.W],zs=[ALX.N,...ALX.ZS,ALX.S],walls=['#f1ebde','#ebe2cf','#e4d8bf','#efe6d2','#dccfb2'],roofs=['#b0563a','#a24d33','#bf6a45','#9a4a35'];
  const G={H_insb:[],H_gra:[],H_grb:[]},hw=x=>x===0||x===ALX.CZ?9:5;let n=0;
  for(let i=0;i+1<xs.length;i++)for(let j=0;j+1<zs.length;j++){const x0=xs[i]+(i?hw(xs[i]):3),x1=xs[i+1]-(i+2<xs.length?hw(xs[i+1]):3),z0=zs[j]+(j?(zs[j]===ALX.CZ?12:5):6),z1=zs[j+1]-(j+2<zs.length?(zs[j+1]===ALX.CZ?12:5):4);
    if(x1-x0<14||z1-z0<12)continue;const nx=Math.max(1,Math.round((x1-x0)/19)),nz=Math.max(1,Math.round((z1-z0)/13)),cw=(x1-x0)/nx,cd=(z1-z0)/nz;
    for(let a=0;a<nx;a++)for(let b=0;b<nz;b++){if(R()<0.3)continue;   // patios, huertos y solares entre las casas (y menos triángulos)
      const cx=x0+cw*(a+0.5),cz=z0+cd*(b+0.5),w=cw-1.6,d=cd-1.4;if(hit(cx-cw/2,cz-cd/2,cx+cw/2,cz+cd/2))continue;
      const wx=X(cx),wz=Z(cz);if(PLACES.some(q=>Math.abs(q.x-wx)<w/2+5&&Math.abs(q.z-wz)<d/2+5))continue;
      let lo=1e9,hi=-1e9;for(const[u,v]of[[-1,-1],[1,-1],[-1,1],[1,1],[0,0]]){const h=terrainH(wx+u*w/2,wz+v*d/2);lo=Math.min(lo,h);hi=Math.max(hi,h);}if(lo<1.3||hi-lo>1.6)continue;
      if(!isFree(wx,wz,Math.min(w,d)/2))continue;
      const two=R()<0.6,ang=R()<0.5?0:Math.PI;
      if(GLB.ok&&GLB.parts.H_insa_brick){G.H_insb.push({x:wx,y:lo,z:wz,a:ang,sx:w/16,sy:two?rr(0.7,0.85):rr(0.55,0.65),sz:d/14,cw:new THREE.Color(pick(walls)),cp:new THREE.Color(pick(walls)),cr:new THREE.Color(pick(roofs))});}   // en modo Roma el GLB trae las casas romanas, no las griegas
      else if(GLB.ok&&GLB.parts.H_gra){G[two?'H_grb':'H_gra'].push({x:wx,y:lo,z:wz,a:ang,sx:w/12,sy:rr(1,1.35)*(two?1:1.15),sz:d/11,cw:new THREE.Color(pick(walls)),cr:new THREE.Color(pick(roofs))});}
      else if(n%2===0)courtyardHouse(wx,wz,ang,w,d,rr(3.6,4.4),two,true);
      addBox(wx,wz,w,d,0);footprints.push({x:wx,z:wz,w,d,a:0,c:'#cdb994',house:true});n++;}}
  for(const k in G)placeModules(k,G[k],{far:700,cell:180});ALX.houses=n;}
