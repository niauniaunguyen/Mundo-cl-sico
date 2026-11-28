// ============================================================ LOS PORTALES DE LEYENDA, MEJORADOS (28/11)
// Antes, en las 50 leyendas se hacía lo mismo: reunir 20 orbes de Niké esquivando. Ahora (veinte propuestas):
//  1 cada trabajo de Heracles, más como su mito: la cierva hay que alcanzarla sin asustarla (no se la podía herir); en las Hespérides,
//    tras las manzanas, se sostiene el cielo mientras Atlas vuelve; en Eritía, tras los orbes, se guían los bueyes rojos al corral; y los
//    dos trabajos que faltaban: los establos de Augías (desviar el Alfeo y el Peneo, en un solo día) y el cinturón de Hipólita (llegar
//    hasta la reina entre las amazonas que galopan; en el mito ella acepta dárselo: Apolodoro II 5,9);
//  2 ayudantes del mito: Molorco en Nemea, Yolao en Lerna, Atenea en el Estínfalo y en Élide, Hermes con Cerbero, Atlas en las Hespérides;
//  3 tres actos narrados por un rapsoda (llegada, prueba, desenlace) en los doce trabajos;
//  4 la Hidra, en dos versiones: muchas cabezas (el poeta Pisandro, Apolodoro) o una sola (Pausanias II 37,4, que no se lo creía);
//  5 cada 5 orbes, un fragmento del mito: al final se tiene el relato entero, guardado en Metas › Leyendas;
//  6 al vencer un trabajo: la pieza de museo que lo representa y dos preguntas, que dan honra;
//  7 el itinerario de los doce trabajos, en el orden de Apolodoro, con lo hecho;
//  8 para el profesorado: ficha de cada trabajo y «asignar a la clase» (sale como misión);
//  9 y 10 cada leyenda con su luz (la ciénaga verdosa de Lerna, la nieve del Erimanto, el ocaso de las Hespérides…);
// 11 la entrada: un fundido con el rapsoda, el lugar y la fuente;
// 13 «parada perfecta»: alzar el escudo justo a tiempo frena el tiempo un instante y devuelve aguante;
// 14 los ciclos (Heracles, Perseo, Teseo, Jasón, Odiseo, Troya, Tebas, dioses y monstruos) en Metas › Leyendas;
// 15 Euristeo, en Micenas, encarga los trabajos en orden y los da por buenos (o no: la Hidra y Augías no se los contó, Apolodoro II 5,2 y 5,5);
// 16 al llegar a un destino con portal, la gente cuenta su leyenda;
// 17 las leyendas suman honra (Metas);
// 18 por equipos: los orbes de los compañeros ya sumaban (211); ahora el portal lo explica;
// 19 la leyenda del día, con una regla especial y premio;
// 20 modo tranquilo: criaturas más lentas y cinco golpes de margen.
// (12, criaturas más vivas: no en esta tanda.)
const K12={act:null,actDone:false,upT:0,slow:0,frag:0,started:0,ov:null,hud:null,comp:[],nlast:0};
function k12z(){if(!state.ley2||typeof state.ley2!=='object')state.ley2={fr:{},quiz:{},calm:false,day:{},euri:{},rum:{},tarea:null,dayWins:0};const z=state.ley2;for(const k of['fr','quiz','day','euri','rum'])z[k]=z[k]||{};return z;}
function k12He(){return leyN('Heracles','Hércules');}
// ---------------------------------------------------------------- los doce trabajos
const K12_H=[
 {k:'leon',n:1,pl:'Nemea',re:'Argólide',dest:'nemea',sky:'#c9a46a',
  acts:['Llegas al valle de Nemea. Aquí un león de piel invulnerable aterroriza a los campesinos: ni el bronce ni el hierro lo hieren.','El león acecha entre las rocas. '+'Antes de venir, el héroe se alojó en Cleonas en la choza de Molorco, un jornalero pobre que le ofreció lo poco que tenía.','El león se aleja. En el mito, Heracles vistió desde entonces su piel, y Zeus puso al león en el cielo: la constelación de Leo.'],
  comp:{n:'Molorco',t:'jornalero de Cleonas',c:{chiton:'#9a8a6a',short:true,noHimation:true,beard:true,hair:'#9a9080'},say:['«Si vuelves en treinta días, te ofreceré un sacrificio como a un héroe; si no, como a un muerto», me dijo el héroe.','«No te acerques de frente: rodéalo.»','«¡Volverá a tiempo para mi sacrificio!»']},
  piece:'Una de las doce metopas del templo de Zeus en Olimpia (hacia 460 a.C.): Heracles, joven y cansado, con el pie sobre el león, entre Atenea y Hermes. Hoy, en el Museo de Olimpia.',
  q:[['¿Por qué no servían las flechas contra el león?',['Su piel no la atravesaba ningún arma','Era demasiado rápido','Vivía en una cueva sin luz'],0],['¿Quién acogió a Heracles en Cleonas?',['Molorco, un jornalero pobre','El rey de Argos','Una sacerdotisa de Hera'],0]],
  src:'Apolodoro II 5,1; Hesíodo, Teogonía 326-332'},
 {k:'hidra',n:2,pl:'Lerna',re:'Argólide',dest:'lerna',sky:'#6a8a5a',
  acts:['La ciénaga de Lerna, junto a la fuente Amimone. Bajo un plátano vive la Hidra, hija de Tifón y de Equidna.','Por cada cabeza cortada brotaban dos. Hera, que odiaba a Heracles, mandó además un cangrejo a morderle el pie.','Yolao quemó los cuellos con antorchas y la cabeza inmortal quedó bajo una roca. Euristeo no contó este trabajo: el héroe había tenido ayuda.'],
  comp:{n:'Yolao',t:'sobrino de Heracles',c:{chiton:'#b8862f',short:true,hair:'#3a2a1e'},say:['«Yo llevo las antorchas. Tú vigila las cabezas.»','«¡Cuidado con el cangrejo de Hera!»','«Lo hemos hecho entre los dos, digan lo que digan en Micenas.»']},
  piece:'Una hidria de Caere, en Etruria, pintada hacia el 525 a.C. por un taller griego: Heracles y Yolao frente a la Hidra, con el cangrejo. Hoy, en el Museo J. Paul Getty (Malibú). También en una de las metopas de Olimpia.',
  q:[['¿Quién ayudó a Heracles con la Hidra?',['Yolao, su sobrino','Teseo','Hermes'],0],['¿Qué animal mandó Hera para molestarle?',['Un cangrejo','Un escorpión','Un águila'],0]],
  src:'Apolodoro II 5,2; Hesíodo, Teogonía 313-318; Pausanias II 37,4'},
 {k:'cierva',n:3,pl:'Cerinea',re:'Arcadia',dest:null,sky:'#9ab07a',
  acts:['Los bosques de Arcadia. La cierva de cuernos de oro está consagrada a Ártemis: no se la puede herir.','Heracles la persiguió un año entero. Acércate despacio: si corres a su lado, huye.','Junto al río Ladón se dejó alcanzar. Ártemis y Apolo le salieron al paso, y el héroe les explicó que lo mandaba Euristeo.'],
  piece:'Una de las metopas del templo de Zeus en Olimpia (hacia 460 a.C.) y muchos vasos áticos: Heracles sujeta la cierva por los cuernos, a veces con Ártemis y Apolo delante.',
  q:[['¿A qué diosa estaba consagrada la cierva?',['Ártemis','Atenea','Deméter'],0],['¿Cuánto tiempo la persiguió Heracles?',['Un año entero','Tres días','Doce años'],0]],
  src:'Apolodoro II 5,3; Píndaro, Olímpica III 26-34'},
 {k:'jabali',n:4,pl:'Erimanto',re:'Arcadia',dest:null,sky:'#d8dde6',
  acts:['La nieve del monte Erimanto. Un jabalí enorme baja a destrozar los campos de Psófide.','Heracles lo hizo correr con sus gritos hasta la nieve profunda, donde se cansó.','Lo llevó vivo a Micenas, y Euristeo, del miedo, se escondió en una tinaja de bronce enterrada: es la escena favorita de los pintores de vasos.'],
  piece:'Muchos vasos de figuras negras del siglo VI a.C.: Heracles con el jabalí al hombro y Euristeo asomando, asustado, de una gran tinaja. También una metopa de Olimpia.',
  q:[['¿Dónde se escondió Euristeo al ver el jabalí?',['En una tinaja de bronce','En el templo de Hera','Detrás de su trono'],0],['¿Cómo cansó Heracles al jabalí?',['Lo hizo correr hasta la nieve profunda','Lo encerró en una cueva','Le dio de beber vino'],0]],
  src:'Apolodoro II 5,4; Diodoro IV 12'},
 {k:'augias',n:5,pl:'Élide',re:'Élide',dest:'olimpia',sky:'#b8a878',
  acts:['Los establos de Augías, rey de Élide: miles de reses y años de estiércol. Hay que limpiarlos en un solo día.','Heracles no usó la pala: abrió el muro y desvió dos ríos, el Alfeo y el Peneo, para que el agua lo arrastrara todo.','Los establos quedaron limpios antes del ocaso. Augías no quiso pagar lo prometido, y Euristeo tampoco contó el trabajo: había cobrado.'],
  comp:{n:'Atenea',t:'diosa de la astucia',c:{female:true,chiton:'#efe6d4',himation:'#6a7a8a',hair:'#3b2a1e'},say:['«No con la fuerza: con la cabeza. Mira por dónde bajan los ríos.»','«Dos compuertas llevan el agua a los establos; las otras, a los campos.»','«Así se hace: con ingenio.»']},
  piece:'La última de las doce metopas del templo de Zeus en Olimpia (hacia 460 a.C.): Atenea, con la lanza, le indica a Heracles dónde abrir el muro.',
  q:[['¿Qué ríos desvió Heracles?',['El Alfeo y el Peneo','El Nilo y el Éufrates','El Iliso y el Cefiso'],0],['¿En cuánto tiempo debía limpiar los establos?',['En un solo día','En un año','En treinta días'],0]],
  src:'Apolodoro II 5,5; Pausanias V 10,9'},
 {k:'aves',n:6,pl:'Estínfalo',re:'Arcadia',dest:'estinfalo',sky:'#8a96a2',
  acts:['El lago Estínfalo, entre bosques espesos. Miles de aves se han refugiado aquí y nadie puede acercarse.','Atenea le dio unos crótalos de bronce hechos por Hefesto: con su estruendo, las aves levantaron el vuelo.','Las aves huyeron del lago. Pausanias dice que en su tiempo aún se veían en el templo de Ártemis de Estínfalo imágenes de ellas.'],
  comp:{n:'Atenea',t:'diosa de la astucia',c:{female:true,chiton:'#efe6d4',himation:'#6a7a8a',hair:'#3b2a1e'},say:['«Toma los crótalos de Hefesto (R). El ruido las espantará.»','«Protégete de las plumas con el escudo.»','«Bien. El lago vuelve a ser de los pescadores.»']},
  piece:'Una de las metopas del templo de Zeus en Olimpia (hacia 460 a.C.): Heracles le entrega las aves a Atenea, sentada en una roca.',
  q:[['¿Quién le dio a Heracles los crótalos de bronce?',['Atenea (hechos por Hefesto)','Apolo','Su padre Anfitrión'],0],['¿Dónde vivían las aves?',['En el lago Estínfalo, en Arcadia','En la isla de Creta','En el monte Olimpo'],0]],
  src:'Apolodoro II 5,6; Pausanias VIII 22,4-7'},
 {k:'toro',n:7,pl:'Creta',re:'Creta',dest:null,sky:'#c8b48a',
  acts:['Creta. Poseidón regaló un toro a Minos para que se lo sacrificara; Minos se lo quedó y el dios enfureció al animal.','Heracles lo atrapó y lo llevó a Grecia, a través del mar.','Euristeo lo soltó, y el toro vagó hasta Maratón, en el Ática: allí lo atraparía Teseo.'],
  piece:'Una de las metopas del templo de Zeus en Olimpia (hacia 460 a.C.): el héroe y el toro en diagonal, empujándose. El tema se repite en muchos vasos áticos.',
  q:[['¿Quién le regaló el toro a Minos?',['Poseidón','Zeus','Dédalo'],0],['¿Adónde fue el toro cuando lo soltaron?',['A Maratón, en el Ática','A Egipto','Al monte Ida'],0]],
  src:'Apolodoro II 5,7; Pausanias I 27,9-10'},
 {k:'yeguas',n:8,pl:'Tracia',re:'Tracia',dest:null,sky:'#a89a7a',
  acts:['La costa de Tracia, tierra de los bistones. Su rey, Diomedes, tiene unas yeguas salvajes atadas con cadenas de bronce.','En el mito, eran feroces y comían carne: aquí solo galopan. Apártate de su camino.','Heracles se las llevó a Euristeo. En recuerdo de su compañero Abdero se fundó la ciudad de Abdera.'],
  piece:'Una de las metopas del templo de Zeus en Olimpia (hacia 460 a.C.) y algunos vasos áticos: Heracles sujeta a una de las yeguas.',
  q:[['¿De qué pueblo era rey Diomedes?',['De los bistones de Tracia','De los cretenses','De los lidios'],0],['¿Qué ciudad se fundó en recuerdo de Abdero?',['Abdera','Abidos','Atenas'],0]],
  src:'Apolodoro II 5,8; Eurípides, Alcestis 481-498'},
 {k:'hipolita',n:9,pl:'Temiscira',re:'Ponto',dest:'sinope',sky:'#c89a6a',
  acts:['Temiscira, junto al río Termodonte, a orillas del mar Negro: la tierra de las amazonas.','Admete, hija de Euristeo, quería el cinturón que Ares había dado a la reina Hipólita. Las amazonas galopan por la llanura.','Hipólita aceptó darle el cinturón. (En el mito, Hera sembró la discordia y todo acabó mal: aquí la reina cumple su palabra.)'],
  piece:'Una de las metopas del templo de Zeus en Olimpia (hacia 460 a.C.). Las luchas de griegos y amazonas, en las metopas del oeste del Partenón y en la Stoa Pintada del Ágora.',
  q:[['¿Para quién era el cinturón de Hipólita?',['Para Admete, hija de Euristeo','Para Hera','Para la mujer de Heracles'],0],['¿Junto a qué río vivían las amazonas?',['El Termodonte','El Nilo','El Tíber'],0]],
  src:'Apolodoro II 5,9; Eurípides, Heracles 408-418'},
 {k:'gerion',n:10,pl:'Eritía',re:'el Océano',dest:'siracusa',sky:'#d89a6a',
  acts:['Eritía, en el extremo occidental, junto al Océano. Allí pastan los bueyes rojos de Gerión, el gigante de tres cuerpos.','Para llegar, Heracles navegó en la copa de oro de Helios, y en el estrecho levantó dos columnas: las columnas de Heracles.','Llevó los bueyes por Iberia, la Galia e Italia hasta Grecia. En Roma contaban que, por el camino, Caco le robó algunos en el Aventino.'],
  piece:'Una de las metopas del templo de Zeus en Olimpia (hacia 460 a.C.). Y muchos vasos áticos con Gerión de tres cuerpos, con escudos y cascos.',
  q:[['¿En qué navegó Heracles hasta Eritía?',['En la copa de oro de Helios','En la nave Argo','A lomos de un delfín'],0],['¿Qué levantó en el estrecho del extremo occidental?',['Dos columnas','Un templo a Zeus','Un faro'],0]],
  src:'Apolodoro II 5,10; Hesíodo, Teogonía 287-294'},
 {k:'ladon',n:11,pl:'las Hespérides',re:'el extremo occidental',dest:null,sky:'#e0a070',
  acts:['El jardín de las Hespérides, donde se pone el sol. La serpiente Ladón, que nunca duerme, guarda el árbol de las manzanas de oro.','Las manzanas fueron el regalo de bodas de Gea a Hera. En una versión, el titán Atlas fue a buscarlas mientras Heracles sostenía el cielo por él.','Atlas volvió con las manzanas, y quiso dejarle el cielo para siempre; Heracles le pidió un momento para ponerse un cojín… y se fue con ellas.'],
  comp:{n:'Atlas',t:'el titán que sostiene el cielo',c:{chiton:'#6a5a4a',beard:true,hair:'#d8d0c2',scale:1.7},say:['«Sostén el cielo un momento y te traigo las manzanas.»','«¡Aguanta! Ya voy.»','«¿Un cojín? Bueno… pero vuelve.»']},
  piece:'La metopa más famosa del templo de Zeus en Olimpia (hacia 460 a.C.): Heracles sostiene el cielo, con un cojín sobre los hombros, mientras Atlas le trae las manzanas y Atenea le ayuda con una mano.',
  q:[['En una versión, ¿quién trajo las manzanas a Heracles?',['Atlas','Hermes','Prometeo'],0],['¿De quién eran las manzanas de oro?',['De Hera, regalo de bodas de Gea','De Afrodita','De Zeus'],0]],
  src:'Apolodoro II 5,11; Hesíodo, Teogonía 215-216 y 333-335'},
 {k:'cerbero',n:12,pl:'el Hades',re:'el cabo Ténaro',dest:'tenaro',sky:'#6a3a3a',
  acts:['El último trabajo: bajar al Hades por la cueva del cabo Ténaro y traer a Cerbero, el perro que guarda la puerta.','Hermes y Atenea le acompañaron. Hades le dejó llevárselo con una condición: sin usar armas.','Heracles se lo enseñó a Euristeo, que volvió a esconderse en su tinaja, y luego lo devolvió al Hades.'],
  comp:{n:'Hermes',t:'el que guía a las almas',c:{chiton:'#d8c8a0',himation:'#6a4a8a',hair:'#3a2a1e'},say:['«Hades te deja llevártelo, pero sin armas: solo el escudo.»','«Aguanta. Cerbero respeta al que no huye.»','«Ahora, a Micenas. Y luego, de vuelta aquí.»']},
  piece:'Una hidria de Caere pintada hacia el 525 a.C.: Heracles llega con Cerbero y Euristeo se mete de cabeza en su tinaja. Hoy, en el Museo del Louvre (París).',
  q:[['¿Por dónde bajó Heracles al Hades?',['Por la cueva del cabo Ténaro','Por el lago de Lerna','Por el monte Olimpo'],0],['¿Qué condición le puso Hades?',['Llevárselo sin usar armas','Volver en tres días','No mirar atrás'],0]],
  src:'Apolodoro II 5,12; Odisea XI 623-626'}];
const K12_HK=new Map(K12_H.map(h=>[h.k,h]));
// ---------------------------------------------------------------- los ciclos
const K12_CYC=[['Heracles',['leon','hidra','cierva','jabali','augias','aves','toro','yeguas','hipolita','gerion','ortro','ladon','cerbero','caco','ketos_troya']],
 ['Perseo y Belerofonte',['medusa','ketos_jope','pegaso','quimera']],['Teseo',['minotauro','cromion','escion']],['Jasón y los argonautas',['harpias','toros_bronce','dragon_colquide','talos']],
 ['Odiseo',['polifemo','lestrigones','escila','caribdis','sirenas']],['Troya',['diomedes','argiripa','laocoonte']],['Tebas y Cadmo',['dragon_ares','esfinge','teumeso']],
 ['Dioses y titanes',['tifon','gigantes','hecatonquiros','equidna','piton','ciclopes','argos']],['Otras leyendas',['calidon','centauros','grifos','fenix','empusa','erinias','triton','esculapio','bagradas','cata']]];
// ---------------------------------------------------------------- 1. los dos trabajos que faltaban
try{bestDef('augias',{t:'Los establos de Augías',at:['olimpia'],menuRo:true,c1:'#8a7a52',c2:'#6e6244',arena:{rocks:6,trees:10},zn:['Los establos de Augías','ΑΥΓΕΙΑΣ','Leyenda · Apolodoro, Biblioteca II 5,5'],
  rule:'No hay criatura: hay que <b>desviar los ríos</b>. Pisa las compuertas para abrirlas o cerrarlas; dos llevan el agua a los establos y dos, a los campos. Tienes hasta que se ponga el sol.',
  lose:'Se ha puesto el sol y los establos siguen sucios.',win:'«Los dos ríos atraviesan los establos y se llevan años de estiércol. Augías, mudo, mira su patio limpio.»',
  myth:'En el mito, Augías, rey de Élide, tenía miles de reses y nunca limpiaba sus establos. Heracles le prometió hacerlo en un solo día a cambio de la décima parte del ganado; abrió el muro y desvió el Alfeo y el Peneo. Augías no pagó, y Euristeo no contó el trabajo porque había cobrado (Apolodoro II 5,5). Es la última metopa del templo de Zeus en Olimpia.',
  extra:{reset(R){k12AugBuild(R);},tick(dt,t,act){k12AugTick(dt,t,act);}}});}catch(e){console.warn('augias',e);}
try{bestLanes('hipolita',{t:'El cinturón de Hipólita',who:'Las amazonas',at:['sinope'],menuRo:true,c1:'#9a8a5a',c2:'#7e7048',arena:{rocks:10,trees:6},zn:['Temiscira, junto al Termodonte','ΑΜΑΖΟΝΕΣ','Leyenda · Apolodoro, Biblioteca II 5,9'],
  mk(R){const Q=(typeof crbHas==='function'&&crbHas('yegua')&&crbQuad(R,'yegua',1.0))||herSimple(R,'#6a4a30',1.2,1.1);try{const h=bpfMake({female:true,chiton:'#8a3a2a',himation:'#c9a24a'},'quieto');if(h){h.position.set(0,0.95,0);h.scale.setScalar(0.9);Q.g.add(h);Q.human=h;}}catch(e){}return Q;},
  rule:'Las amazonas <b>galopan por la llanura en línea recta</b>: el polvo avisa por dónde. Reúne los orbes y luego <b>llega hasta la reina</b>.',win:'«Hipólita te tiende el cinturón de Ares. Ha cumplido su palabra.»',
  myth:'En el mito, Admete, hija de Euristeo, quería el cinturón que Ares había regalado a Hipólita, reina de las amazonas. Hipólita aceptó dárselo; pero Hera, disfrazada de amazona, hizo creer que querían raptar a la reina, y hubo batalla (Apolodoro II 5,9). Aquí la reina cumple su palabra.'});}catch(e){console.warn('hipolita',e);}
// ---------------------------------------------------------------- Augías: las compuertas
const K12A={};
function k12AugBuild(R){const g=R.g;if(K12A.R===R&&K12A.gates){for(const G of K12A.gates){G.open=false;k12AugPaint(G);}K12A.done=0;K12A.t=150;K12A.flood=0;return;}
  K12A.R=R;K12A.gates=[];K12A.t=150;K12A.done=0;K12A.flood=0;const wm=()=>new THREE.MeshLambertMaterial({color:'#6a5a40'});
  // los establos (al sur) con su estiércol, y los campos (a los lados)
  const st=new THREE.Mesh(new THREE.BoxGeometry(12,3,4),lam('#a88a62'));st.position.set(0,1.5,10.5);st.castShadow=true;g.add(st);
  K12A.mud=new THREE.Mesh(new THREE.PlaneGeometry(12,5),new THREE.MeshLambertMaterial({color:'#4a3a22'}));K12A.mud.rotation.x=-Math.PI/2;K12A.mud.position.set(0,0.04,7.2);g.add(K12A.mud);
  K12A.field=new THREE.Mesh(new THREE.PlaneGeometry(26,6),new THREE.MeshLambertMaterial({color:'#7a8a4a'}));K12A.field.rotation.x=-Math.PI/2;K12A.field.position.set(0,0.03,-2);g.add(K12A.field);
  // los dos ríos llegan del norte: el Alfeo por la izquierda, el Peneo por la derecha; cada uno con dos compuertas (a los establos / a los campos)
  for(const[x,name]of[[-6,'Alfeo'],[6,'Peneo']]){const rv=new THREE.Mesh(new THREE.PlaneGeometry(2.2,9),new THREE.MeshPhongMaterial({color:'#4a7a9a',shininess:80}));rv.rotation.x=-Math.PI/2;rv.position.set(x,0.05,-11);g.add(rv);
    for(const[dx,to]of[[x<0?2.5:-2.5,'establos'],[x<0?-2.5:2.5,'campos']]){const G={x:x+dx,z:-5,to,river:name,open:false};
      G.ch=new THREE.Mesh(new THREE.PlaneGeometry(1.6,to==='establos'?11:5),wm());G.ch.rotation.x=-Math.PI/2;G.ch.position.set(G.x,0.06,to==='establos'?1:-3);g.add(G.ch);
      G.m=new THREE.Mesh(new THREE.BoxGeometry(2,1.2,0.4),lam('#7a5a3a'));G.m.position.set(G.x,0.6,G.z);G.m.castShadow=true;g.add(G.m);
      G.ring=new THREE.Mesh(new THREE.RingGeometry(0.9,1.3,24),new THREE.MeshBasicMaterial({color:'#ffd25a',transparent:true,opacity:0.5,depthWrite:false}));G.ring.rotation.x=-Math.PI/2;G.ring.position.set(G.x,0.08,G.z+1.2);g.add(G.ring);
      K12A.gates.push(G);}}}
function k12AugPaint(G){G.m.position.y=G.open?1.7:0.6;G.ch.material.color.set(G.open?'#4a7a9a':'#6a5a40');}
function k12AugTick(dt,t,act){const R=LEY.R;if(!R||!K12A.gates||!LEY.on||ui!=='play')return;const P=player,lx=P.x-R.X,lz=P.z-R.Z;
  for(const G of K12A.gates){G.cd=Math.max(0,(G.cd||0)-dt);const inR=Math.hypot(lx-G.x,lz-(G.z+1.2))<1.3;if(inR&&!G.was&&G.cd<=0){G.open=!G.open;G.cd=0.8;k12AugPaint(G);try{legSfx('crot');}catch(e){}}G.was=inR;G.ring.material.opacity=0.35+0.25*Math.sin(t*4);}
  const toSt=K12A.gates.filter(G=>G.to==='establos'),toF=K12A.gates.filter(G=>G.to==='campos');const okSt=toSt.every(G=>G.open),fl=toF.some(G=>G.open);
  K12A.field.material.color.set(fl?'#5a8aa8':'#7a8a4a');if(fl&&!K12A.flood){K12A.flood=1;k12Say('Augías','«¡Me inundas los campos! El agua tiene que ir a los establos, no al trigo.»');}if(!fl)K12A.flood=0;
  if(okSt&&!fl){K12A.done+=dt;K12A.mud.material.color.lerp(new THREE.Color('#b8a070'),dt*0.6);if(K12A.done>4)k12ActDone();}else K12A.done=0;
  K12A.t-=dt;k12Hud('Sol: '+Math.max(0,Math.ceil(K12A.t))+' s · '+(okSt?(fl?'el agua se va a los campos':'¡el agua entra en los establos!'):'abre las compuertas que llevan a los establos'));
  if(K12A.t<=0&&LEY.on){LEY.hits=3;legLose();}}
// ---------------------------------------------------------------- los actos propios (1)
// 'sigilo' (desde el principio): acercarse a la cierva sin correr · 'cielo' (tras los orbes): sostener el cielo · 'rebano' (tras los orbes):
// guiar los bueyes al corral · 'reina' (tras los orbes): llegar hasta Hipólita · 'canales' (desde el principio): Augías
const K12_ACT={cierva:{when:'start',k:'sigilo'},augias:{when:'start',k:'canales'},ladon:{when:'end',k:'cielo'},gerion:{when:'end',k:'rebano'},hipolita:{when:'end',k:'reina'}};
function k12Hud(t){K12.hudT=t;try{const o=LEY.hud&&!LEY.hud.hidden&&LEY.hud.children[0];if(o&&o.textContent!==t)o.textContent=t;}catch(e){}}
// lo que se pide en cada leyenda con acto propio (sustituye al «Recoge 20 orbes» del diálogo de entrada)
const K12_OBJ={cierva:'<b>Acércate a la cierva sin asustarla</b>: camina, no corras, cuando pase cerca, hasta que confíe en ti.',augias:'<b>Desvía los ríos hacia los establos</b> antes de que se ponga el sol.',
  ladon:'<b>Recoge 20 manzanas de oro</b>; después, <b>sostén el cielo</b> mientras Atlas va a por las demás.',gerion:'<b>Recoge 20 orbes</b>; después, <b>guía los bueyes rojos al corral</b>.',hipolita:'<b>Recoge 20 orbes</b>; después, <b>llega hasta la reina Hipólita</b>.'};
function k12Say(who,txt){toast('<span class="label">'+who+'</span><br>'+txt);}
function k12HideOrbs(){for(const o of LEY.orbs){o.x=1e9;o.z=1e9;o.g.visible=false;}}
function k12ActStart(k){K12.act=k;K12.m=0;const R=LEY.R;k12HideOrbs();
  if(k==='cielo'){k12Say('Atlas','«Sostén el cielo (mantén Q o el botón derecho) mientras voy a por las manzanas.»');const A=K12.comp.find(c=>c.n==='Atlas');if(A)A.walk=1;}
  if(k==='rebano'){K12.ox=[];for(let i=0;i<5;i++){let o=null;try{o=(typeof crbHas==='function'&&crbHas('toro')&&crbQuad(R,'toro',0.8));}catch(e){}if(!o)o=herSimple(R,'#8a3a22',1.2,0.75);const a=i/5*TAU;o.g.position.set(Math.cos(a)*9,0,Math.sin(a)*6-3);R.g.add(o.g);K12.ox.push({o,in:false,v:{x:0,z:0}});}
    K12.pen=new THREE.Mesh(new THREE.RingGeometry(2.6,3.2,32),new THREE.MeshBasicMaterial({color:'#ffd25a',transparent:true,opacity:0.5,depthWrite:false}));K12.pen.rotation.x=-Math.PI/2;K12.pen.position.set(0,0.07,8.5);R.g.add(K12.pen);
    k12Say('Euritión, el pastor',"«Llévate los bueyes, si puedes: acércate por detrás y se mueven hacia el otro lado. El corral está junto a la salida.»");}
  if(k==='reina'){let h=null;try{h=bpfMake({female:true,chiton:'#e8dcc8',himation:'#8a2a2a',hair:'#2a1e14'},'hablar');}catch(e){}if(!h)h=makePerson({female:true,chiton:'#e8dcc8',himation:'#8a2a2a'});h.position.set(0,0,-11);R.g.add(h);K12.queen=h;
    k12Say('Hipólita','«Ven, griego. Lo que prometo, lo cumplo.»');}
  if(k==='sigilo')k12Say('El rapsoda','«No corras: acércate a la cierva despacio, cuando pase a tu lado. Si te ve llegar a la carrera, huye.»');}
function k12ActDone(){if(!K12.act)return;const R=LEY.R;K12.act=null;K12.actDone=true;
  if(K12.ox){for(const x of K12.ox)R.g.remove(x.o.g);K12.ox=null;}if(K12.pen){R.g.remove(K12.pen);K12.pen=null;}if(K12.queen){R.g.remove(K12.queen);K12.queen=null;}
  LEY.n=LEY.GOAL;legWin();}
function k12ActTick(dt){const R=LEY.R,P=player;if(!R||!K12.act||!LEY.on||ui!=='play')return;k12HideOrbs();const lx=P.x-R.X,lz=P.z-R.Z,sp=Math.hypot(LEY.pv.x,LEY.pv.z);
  if(K12.act!=='sigilo'&&K12.act!=='canales')LEY.grace=0.3;   // en los actos finales la criatura descansa
  if(K12.act==='sigilo'){const D=LEG.cierva&&LEG.cierva.D;if(!D)return;const p=D.g.position,d=Math.hypot(lx-p.x,lz-p.z);
    if(d<3.6&&sp<3.4)K12.m=Math.min(1,K12.m+dt*0.32);else if(d<7&&sp>4.8){if(!K12.scT||K12.scT<=0){K12.m=Math.max(0,K12.m-0.25);K12.scT=1.2;LEG.cierva.a+=1.2;k12Say('La cierva','se asusta y huye: más despacio.');}}
    K12.scT=(K12.scT||0)-dt;k12Hud('Confianza de la cierva '+Math.round(K12.m*100)+' %');if(K12.m>=1)k12ActDone();}
  if(K12.act==='cielo'){const hold=LEY_SH.key||LEY_SH.mouse||LEY_SH.btn;K12.m=hold?Math.min(1,K12.m+dt/12):Math.max(0,K12.m-dt/20);if(!hold&&!K12.warn){K12.warn=1;k12Say('Atlas','«¡No lo sueltes!»');}if(hold)K12.warn=0;
    k12Hud('Sostienes el cielo '+Math.round(K12.m*100)+' %');const A=K12.comp.find(c=>c.n==='Atlas');if(A&&A.g){A.g.position.z=K12.m<0.85?8.5-18*K12.m/0.85:-9.5+18*(K12.m-0.85)/0.15;}if(K12.m>=1){k12Say('Atlas','«Aquí tienes las manzanas. ¿Seguro que no quieres quedarte con el cielo?»');k12ActDone();}}
  if(K12.act==='rebano'){let n=0;for(const x of K12.ox){const g=x.o.g,p=g.position;if(x.in){n++;continue;}const dx=p.x-lx,dz=p.z-lz,d=Math.hypot(dx,dz);
      if(d<3.4){x.v.x=dx/d*2.6;x.v.z=dz/d*2.6;}else{x.v.x*=0.94;x.v.z*=0.94;}p.x+=x.v.x*dt;p.z+=x.v.z*dt;const r=Math.hypot(p.x,p.z);if(r>LEY_RA-1.5){p.x*=(LEY_RA-1.5)/r;p.z*=(LEY_RA-1.5)/r;}
      if(Math.hypot(x.v.x,x.v.z)>0.2)g.rotation.y=Math.atan2(x.v.x,x.v.z);if(x.o.legs)x.o.legs.forEach((l,j)=>{l.rotation.x=Math.sin(performance.now()/90+j)*0.5*Math.min(1,Math.hypot(x.v.x,x.v.z));});
      if(Math.hypot(p.x,p.z-8.5)<2.7){x.in=true;n++;}}
    k12Hud('Bueyes en el corral: '+n+'/5');if(n>=5)k12ActDone();}
  if(K12.act==='reina'&&K12.queen){const q=K12.queen.position;k12Hud('Llega hasta Hipólita');if(Math.hypot(lx-q.x,lz-q.z)<2.2)k12ActDone();}}
// ---------------------------------------------------------------- 2. ayudantes
function k12Companion(k){const R=LEY.R,H=K12_HK.get(k);for(const c of K12.comp)if(c.g&&c.g.parent)c.g.parent.remove(c.g);K12.comp=[];if(!H||!H.comp||!R)return;
  let g=null;try{g=bpfMake(H.comp.c,'quieto');}catch(e){}if(!g)g=makePerson(Object.assign({noBlender:true},H.comp.c));g.position.set(3.2,0,8.5);g.rotation.y=Math.PI;R.g.add(g);
  const lb=labelSprite(H.comp.n,H.comp.t,false);lb.position.y=2.4*(H.comp.c.scale||1);g.add(lb);K12.comp.push({n:H.comp.n,g,say:H.comp.say});}
// ---------------------------------------------------------------- 3 y 5. actos narrados y fragmentos
function k12Frags(k){const L=LEG[k];if(!L||!L.myth)return[];const t=String(L.myth).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();return t.split(/(?<=[.!?»])\s+(?=[A-ZÁÉÍÓÚ«(])/).filter(s=>s.length>25).slice(0,4);}
function k12OnOrb(n){const k=LEY.kind,H=K12_HK.get(k),z=k12z();
  if(n===10&&H){k12Say('El rapsoda','«'+H.acts[1]+'»');const c=K12.comp[0];if(c&&c.say[1])setTimeout(()=>k12Say(c.n,c.say[1]),3500);}
  if(n%5===0){const F=k12Frags(k),i=n/5-1;if(F[i]){z.fr[k]=Math.max(z.fr[k]||0,i+1);save();setTimeout(()=>toast('<span class="label">Fragmento '+(i+1)+'/'+F.length+' del mito</span><br>'+F[i]),n===10&&H?7000:0);}}}
// ---------------------------------------------------------------- 6. pieza de museo y preguntas
function k12Quiz(k){const H=K12_HK.get(k);if(!H)return;const z=k12z();let i=0,ok=0;const ask=()=>{const Q=H.q[i];if(!Q){const first=!z.quiz[k];if(ok===H.q.length&&first){z.quiz[k]=1;save();try{qAdd('so',1,'Conoces el mito de '+LEG[k].title()+'.');}catch(e){}}
      int2Dlg('Ν',leyN('Niké','Victoria'),'Repaso',(ok===H.q.length?'<p>¡Las dos bien!'+(first?' Ganas honra.':'')+'</p>':'<p>'+ok+' de '+H.q.length+'. Puedes repasarlo en Metas › Leyendas.</p>'));return;}
    const opts=Q[1].map((t,j)=>[t,j]).sort(()=>Math.random()-0.5);int2Dlg('Ν',leyN('Niké','Victoria'),'Pregunta '+(i+1)+' de '+H.q.length,'<p>'+Q[0]+'</p>');const box=$('dOpts');box.innerHTML='';
    opts.forEach(([t,j],m)=>{const b=document.createElement('button');b.innerHTML='<span class="n">'+(m+1)+'</span><span>'+t+'</span>';b.onclick=()=>{if(j===Q[2])ok++;toast(j===Q[2]?'<span class="label">¡Bien!</span>':'<span class="label">No</span><br>Era: '+Q[1][Q[2]]);i++;ask();};box.appendChild(b);});};ask();}
// ---------------------------------------------------------------- 11. la entrada
function k12Fade(lines){let d=K12.ov;if(!d){d=document.createElement('div');d.style.cssText='position:fixed;inset:0;z-index:400;background:#0b0807;color:#f3e6c8;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:24px;pointer-events:none;transition:opacity 1.2s;font-family:var(--f-display,Georgia)';document.body.appendChild(d);K12.ov=d;}
  d.innerHTML=lines.map((l,i)=>'<div style="font-size:'+(i===0?'1.6rem':i===1?'1.05rem':'.9rem')+';opacity:'+(i===2?0.75:1)+';max-width:40rem;line-height:1.5">'+l+'</div>').join('');d.style.transition='none';d.style.opacity=1;d.hidden=false;
  setTimeout(()=>{d.style.transition='opacity 1.4s';d.style.opacity=0;},1600);setTimeout(()=>{d.hidden=true;},3200);}
function k12Enter(k){const H=K12_HK.get(k),L=LEG[k];if(!L)return;const ro=leyRo();
  if(H)k12Fade(['Trabajo '+H.n+' de '+k12He()+': '+L.title(),'«'+H.acts[0]+'»','El rapsoda canta lo que cuenta '+H.src.split(';')[0]+'.']);
  else k12Fade([L.title(),'El rapsoda empieza a cantar…','Un mito, no historia: así lo contaban '+(ro?'griegos y romanos':'los griegos')+'.']);}
// ---------------------------------------------------------------- 19 y 20. la leyenda del día y el modo tranquilo
const K12_MOD=[['rápida','las criaturas van un 25 % más deprisa'],['a oscuras','cae la noche sobre la leyenda: se ve muy poco'],['escudo firme','el escudo no se cansa']];
function k12Day(){const d=state.day||1,L=LEG_ORDER.filter(k=>k!=='cata'&&LEG[k]&&legZ(k).tries>0);if(!L.length)return null;const h=(d*2654435761)>>>0;return{k:L[h%L.length],mod:K12_MOD[(h>>>8)%K12_MOD.length],d};}
function k12Mod(){const D=k12Day();return D&&D.k===LEY.kind?D.mod[0]:null;}
// ---------------------------------------------------------------- envolturas del motor (210, 208)
{const f=legStart;legStart=function(){K12.act=null;K12.actDone=false;K12.nlast=0;K12.hudT='';const r=f.apply(this,arguments);try{const k=LEY.kind,A=K12_ACT[k];k12Enter(k);k12Companion(k);
  const c=K12.comp[0];if(c)setTimeout(()=>k12Say(c.n,c.say[0]),3400);if(A&&A.when==='start')k12ActStart(A.k);
  // en el diálogo de entrada: modo tranquilo, leyenda del día y equipos
  try{const O=K12_OBJ[k],bd0=$('dBody');if(O&&bd0)bd0.innerHTML=bd0.innerHTML.replace(/<b>Recoge \d+ orbes de [^<]*<\/b>\./,O);}catch(e){}
  const box=$('dOpts'),z=k12z(),D=k12Day(),mod=k12Mod();if(box){const b=document.createElement('button');b.innerHTML='<span class="n">·</span><span>Modo tranquilo: '+(z.calm?'sí':'no')+' (criaturas más lentas, cinco golpes)</span>';b.onclick=()=>{z.calm=!z.calm;save();b.innerHTML='<span class="n">·</span><span>Modo tranquilo: '+(z.calm?'sí':'no')+' (criaturas más lentas, cinco golpes)</span>';};box.appendChild(b);}
  const bd=$('dBody');if(bd){if(mod)bd.insertAdjacentHTML('beforeend','<p><b>Leyenda del día</b> ('+mod+': '+D.mod[1]+'). Si la vences hoy: 15 '+(leyRo()?'sestercios':'óbolos')+' y honra.</p>');
    bd.insertAdjacentHTML('beforeend','<p class="sub">Por equipos: si tus compañeros están en la misma leyenda a la vez (Metas › Equipos), sus orbes también cuentan.</p>');}}catch(e){console.warn('k12',e);}return r;};}
{const f=legWin;legWin=function(){const k=LEY.kind,A=K12_ACT[k];if(A&&A.when==='end'&&!K12.actDone&&!K12.act){LEY.on=true;k12ActStart(A.k);return;}
  const r=f.apply(this,arguments);try{const H=K12_HK.get(k),z=k12z();if(H){const c=K12.comp[0];setTimeout(()=>{k12Say('El rapsoda','«'+H.acts[2]+'»');if(c&&c.say[2])setTimeout(()=>k12Say(c.n,c.say[2]),4000);},800);}
    const D=k12Day();if(D&&D.k===k&&!z.day[D.d]){z.day[D.d]=1;z.dayWins=(z.dayWins||0)+1;state.obols=(state.obols||0)+15;save();try{updateStats();}catch(e){}toast('<span class="label">Leyenda del día</span><br>+15 '+(leyRo()?'sestercios':'óbolos')+' y honra.');}
    const bd=$('dBody'),box=$('dOpts');if(H&&bd){bd.insertAdjacentHTML('beforeend','<p class="sub"><b>Trabajo '+H.n+' de los doce.</b> '+H.piece+'</p>');if(box){const b=document.createElement('button');b.innerHTML='<span class="n">?</span><span>Dos preguntas sobre el mito'+(z.quiz[k]?'':' (dan honra)')+'</span>';b.onclick=()=>k12Quiz(k);box.insertBefore(b,box.firstChild);}}}catch(e){console.warn('k12 win',e);}return r;};}
{const f=legTick;legTick=function(dt){let s=1;try{if(K12.slow>0){K12.slow-=dt;s=0.35;}if(k12z().calm)s*=0.75;if(k12Mod()==='rápida')s*=1.25;if(k12Mod()==='escudo firme')LEY_SH.st=1;}catch(e){}
  const r=f.call(this,dt*s);try{if(LEY.on&&LEY.n!==K12.nlast){if(LEY.n>K12.nlast)for(let n=K12.nlast+1;n<=LEY.n;n++)k12OnOrb(n);K12.nlast=LEY.n;}k12ActTick(dt);
    for(const c of K12.comp)if(c.g){c.g.rotation.y=Math.atan2(player.x-LEY.R.X-c.g.position.x,player.z-LEY.R.Z-c.g.position.z);}}catch(e){if(!K12.err){K12.err=1;console.warn('k12',e);}}return r;};}
{const f=legHurt;legHurt=function(msg){if(!k12z().calm)return f.apply(this,arguments);LEY.hits++;LEY.inv=1.6;try{leySfx('hit');}catch(e){}if(LEY.fl){LEY.fl.style.opacity=1;setTimeout(()=>LEY.fl&&(LEY.fl.style.opacity=0),280);}leyHud();if(LEY.hits>=5)legLose();};}
{const f=leyHud;leyHud=function(){const h=LEY.hits,calm=k12z().calm;if(calm)LEY.hits=Math.min(3,Math.round(h*3/5));try{f.apply(this,arguments);}finally{LEY.hits=h;}
  try{if(LEY.hud&&!LEY.hud.hidden){if(calm){const sp=[...LEY.hud.children].find(e=>/^Vida/.test(e.textContent));if(sp)sp.textContent='Vida '+'●'.repeat(Math.max(0,5-h))+'○'.repeat(Math.min(5,h));}
    if(K12.act&&K12.hudT){const o=LEY.hud.children[0];if(o)o.textContent=K12.hudT;}}}catch(e){}};}
{let lastUp=false;const f=legShieldTick;legShieldTick=function(dt){const r=f.apply(this,arguments);if(LEY_SH.up&&!lastUp)K12.upT=performance.now();lastUp=LEY_SH.up;return r;};}
{const f=legBlock;legBlock=function(s){const r=f.apply(this,arguments);try{if(r&&performance.now()-K12.upT<300){K12.slow=0.45;LEY_SH.st=Math.min(1,LEY_SH.st+0.35);try{legSfx('crot');}catch(e){}
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#ffe08a',transparent:true,opacity:1,blending:THREE.AdditiveBlending,depthWrite:false}));sp.position.copy(s.m.position);sp.scale.set(2.2,2.2,1);scene.add(sp);
  let t=0;const fade=()=>{t+=0.05;sp.material.opacity=1-t*2;sp.scale.multiplyScalar(1.06);if(t<0.5)requestAnimationFrame(fade);else{scene.remove(sp);sp.material.dispose();}};requestAnimationFrame(fade);
  toast('<span class="label">¡Parada perfecta!</span>');}}catch(e){}return r;};}
// la Hidra: versión, entrada, ayudante y fragmentos (su motor es el de 208)
{const f=leyStart;leyStart=function(){const self=this,a=arguments;if(K12.hv){const r=f.apply(self,a);k12HydraAfter();return r;}
  K12.hv=1;LEY.on=false;int2Dlg('Ν',leyN('Niké','Victoria'),'¿Qué Hidra?','<p>Los griegos no contaban la Hidra igual. Elige la versión:</p><p class="sub">Muchas cabezas: el poeta Pisandro y Apolodoro (por cada cabeza cortada brotan dos). Una sola: Pausanias, que vio la fuente de Lerna y pensaba que lo de las cabezas era invención de Pisandro (II 37,4).</p>');
  const box=$('dOpts');box.innerHTML='';for(const[t,v]of[['Muchas cabezas (Pisandro, Apolodoro)','muchas'],['Una sola cabeza (Pausanias)','una']]){const b=document.createElement('button');b.innerHTML='<span class="n">'+(v==='muchas'?1:2)+'</span><span>'+t+'</span>';b.onclick=()=>{K12.hyd=v;closeDialog();const m=LEY.MAXH;if(v==='una')LEY.MAXH=1;try{f.apply(self,a);}finally{LEY.MAXH=m;}k12HydraAfter();};box.appendChild(b);}};}
function k12HydraAfter(){K12.nlast=0;k12Enter('hidra');k12Companion('hidra');const c=K12.comp[0];if(c)setTimeout(()=>k12Say(c.n,c.say[0]),3400);
  if(K12.hyd==='una'){const bd=$('dBody');if(bd)bd.insertAdjacentHTML('beforeend','<p class="sub">Versión de Pausanias: una sola cabeza, que no se multiplica.</p>');}}
{const f=leyAddHead;leyAddHead=function(){if(K12.hyd==='una'&&LEY.heads.length>=1)return LEY.heads[0];return f.apply(this,arguments);};}
{const f=leyTick;leyTick=function(dt){const r=f.apply(this,arguments);try{if(!legIn()){K12.hv=0;K12.act=null;if(K12.comp.length){for(const c of K12.comp)if(c.g&&c.g.parent)c.g.parent.remove(c.g);K12.comp=[];}return r;}
  if(LEY.kind==='hidra'&&LEY.on&&LEY.n!==K12.nlast){if(LEY.n>K12.nlast)for(let n=K12.nlast+1;n<=LEY.n;n++)k12OnOrb(n);K12.nlast=LEY.n;}}catch(e){}return r;};}
{const f=leyWin;leyWin=function(){const r=f.apply(this,arguments);try{const H=K12_HK.get('hidra'),bd=$('dBody'),box=$('dOpts');setTimeout(()=>k12Say('El rapsoda','«'+H.acts[2]+'»'),800);
  if(bd)bd.insertAdjacentHTML('beforeend','<p class="sub"><b>Trabajo 2 de los doce.</b> '+H.piece+'</p>');if(box){const b=document.createElement('button');b.innerHTML='<span class="n">?</span><span>Dos preguntas sobre el mito</span>';b.onclick=()=>k12Quiz('hidra');box.insertBefore(b,box.firstChild);}}catch(e){}return r;};}
// ---------------------------------------------------------------- 9 y 10. la luz de cada leyenda (la niebla, justo antes de dibujar)
{const f=renderer.render.bind(renderer);renderer.render=function(s,c){if(s===scene&&typeof legIn==='function'&&legIn()&&scene.fog){try{const H=K12_HK.get(LEY.kind),mod=k12Mod();
  if(H&&H.sky){K12._c=K12._c||new THREE.Color();scene.fog.color.lerp(K12._c.set(H.sky),0.55);}if(mod==='a oscuras'){scene.fog.near=4;scene.fog.far=34;scene.fog.color.multiplyScalar(0.35);}}catch(e){}}return f(s,c);};}
// ---------------------------------------------------------------- 15. Euristeo en Micenas
function k12EuriNext(){const z=k12z();return K12_H.find(h=>!z.euri[h.k]&&LEG[h.k]);}
function k12Euri(){if(MODE==='roma')return;const z=k12z(),won=K12_H.filter(h=>LEG[h.k]&&legZ(h.k).won&&!z.euri[h.k]);let html='<p>«Soy Euristeo, rey de Micenas y de Tirinto. Hera quiso que '+k12He()+' me sirviera doce años. Yo le encargo los trabajos… desde aquí, que es más seguro.»</p>';
  for(const h of won){z.euri[h.k]=1;const cuenta=h.k!=='hidra'&&h.k!=='augias';if(cuenta){state.obols=(state.obols||0)+10;}html+='<p>'+(cuenta?'«¿'+LEG[h.k].title()+'? Bien… lo doy por bueno.» <b>+10 óbolos</b>.':'«¿'+LEG[h.k].title()+'? ¡Ese no cuenta! '+(h.k==='hidra'?'Te ayudó Yolao.':'Cobraste a Augías.')+'» (Apolodoro II 5,2 y 5,5). Te da igual: lo has hecho.')+'</p>';}
  if(won.length){save();try{updateStats();}catch(e){}}const nx=k12EuriNext();
  html+=nx?'<p>«Tu próximo trabajo: <b>'+LEG[nx.k].title()+'</b>, en '+nx.pl+' ('+nx.re+'). Vuelve cuando lo hayas hecho.»</p><p class="sub">Los portales de leyenda se abren al huir del laberinto de Cnosos con las alas de Dédalo.</p>':'<p>«¿Los doce? Ya no se me ocurre nada más difícil.»</p>';
  html+='<p class="sub">En los vasos, Euristeo aparece escondido en una gran tinaja cuando Heracles le trae el jabalí o a Cerbero (Apolodoro II 5,4 y 5,12).</p>';vmS('Ε','Euristeo','rey de Micenas',html,[vmBye]);}
function k12EuriPlace(){if(K12.euri||MODE==='roma'||typeof ISLANDS==='undefined'||typeof islandOf!=='function')return;const I=ISLANDS.find(i=>i.id==='micenas');if(!I||islandOf(player.x)!==I)return;   // solo estando allí: el terreno ya está hechoconst c=I.town||I;K12.euri=1;
  try{let x=c.x+14,z=c.z+8;try{const f=findFree(x,z,1.5);x=f[0];z=f[1];}catch(e){}const y=floorAt(x,z);let g=null;try{g=bpfMake({chiton:'#efe6d4',himation:'#8a2a5a',beard:true,hair:'#5a4a3a'},'hablar');}catch(e){}if(!g)g=makePerson({chiton:'#efe6d4',himation:'#8a2a5a',beard:true});
    g.position.set(x,y,z);scene.add(g);const p=new THREE.Mesh(new THREE.CylinderGeometry(0.75,0.5,1.5,14),lam('#8a6a3a'));p.position.set(x+1.4,y+0.75,z);p.castShadow=true;scene.add(p);
    egxObj(x,z,y,()=>k12Euri(),'Euristeo','rey de Micenas · los trabajos',2.6);}catch(e){console.warn('euristeo',e);}}
// ---------------------------------------------------------------- 16. rumores al llegar
function k12Rumor(){if(typeof islandOf!=='function')return;const I=islandOf(player.x);if(!I||I===K12.lastI)return;K12.lastI=I;const z=k12z();const L=(LEY_DEST[MODE==='roma'?'roma':'atenas']||[]).filter(([id])=>id===I.id).map(x=>x[1]).filter(k=>LEG[k]&&!z.rum[k]);
  if(!L.length)return;const k=L[0];z.rum[k]=1;save();const F=k12Frags(k);setTimeout(()=>toast('<span class="label">Lo que cuentan aquí</span><br>«'+(F[0]||LEG[k].title())+'»<br><span style="opacity:.8">'+(typeof leyOpen==='function'&&leyOpen()?'Dicen que hay un portal de leyenda cerca: '+LEG[k].title()+'.':'Se dice que, cuando se abren los portales de leyenda, aquí hay uno.')+'</span>'),2500);}
// ---------------------------------------------------------------- 17. honra
{const f=honParts;honParts=function(){const P=f.apply(this,arguments);let w=0;try{const Z=leyz();for(const k of LEG_ORDER)if(LEG[k]&&Z[k]&&Z[k].won)w++;}catch(e){}const z=k12z();P.push(['Leyendas vencidas',w,2],['Mitos repasados',Object.keys(z.quiz).length,1],['Leyendas del día',z.dayWins||0,1]);return P;};}
// ---------------------------------------------------------------- 7, 8, 14 y 5. En Metas › Leyendas: itinerario, ciclos, fragmentos y profesorado
function k12Itin(){const ro=MODE==='roma',He=k12He();let h='<h4 style="margin:14px 0 6px">Los doce trabajos de '+He+' (en el orden de Apolodoro)</h4><table class="ley">';
  for(const H of K12_H){const L=LEG[H.k],w=L&&legZ(H.k).won;h+='<tr><td>'+(w?'✓':H.n)+'</td><td>'+(L?L.title():H.k)+'</td><td>'+H.pl+' · '+H.re+'</td><td>'+(k12z().quiz[H.k]?'repasado':'')+'</td></tr>';}
  return h+'</table>'+(ro?'':'<p class="sub">Euristeo, en Micenas, los da por buenos. Las metopas del templo de Zeus en Olimpia los representan todos (Pausanias V 10,9).</p>');}
function k12Cycles(){const z=k12z();let h='<h4 style="margin:14px 0 6px">Por ciclos</h4>';for(const[n,L]of K12_CYC){const ks=L.filter(k=>LEG[k]);if(!ks.length)continue;const w=ks.filter(k=>legZ(k).won).length;
    h+='<details><summary><b>'+n+'</b> · '+w+'/'+ks.length+'</summary><p>'+ks.map(k=>{const fr=z.fr[k]||0,F=k12Frags(k);return (legZ(k).won?'✓ ':'· ')+LEG[k].title()+(fr?' <span class="sub">('+fr+'/'+F.length+' fragmentos)</span>':'');}).join('<br>')+'</p></details>';}
  const any=Object.keys(z.fr).filter(k=>LEG[k]);if(any.length)h+='<h4 style="margin:14px 0 6px">Los mitos que has reunido</h4>'+any.map(k=>{const F=k12Frags(k).slice(0,z.fr[k]);return '<details><summary>'+LEG[k].title()+'</summary><p>'+F.join(' ')+'</p></details>';}).join('');
  return h;}
function k12Teacher(){if(!(typeof PROFE!=='undefined'&&PROFE.ok))return '';const z=k12z();return '<h4 style="margin:14px 0 6px">Para el profesorado</h4><p class="sub">Cada trabajo: el mito, sus fuentes y una pieza de museo. «Asignar» lo pone como misión a quien juegue con esta partida.</p>'+
  K12_H.filter(H=>LEG[H.k]).map(H=>'<details><summary>'+H.n+'. '+LEG[H.k].title()+(z.tarea===H.k?' · <b>asignado</b>':'')+'</summary><p class="sub">'+H.acts.join(' ')+'</p><p class="sub">Fuentes: '+H.src+'. Pieza: '+H.piece+'</p><p class="sub">Para trabajar: mitología griega, geografía del Peloponeso y el Mediterráneo, lectura de fuentes que no coinciden, iconografía (vasos y metopas).</p><button class="bt" data-k12t="'+H.k+'">'+(z.tarea===H.k?'Quitar la tarea':'Asignar a la clase')+'</button></details>').join('');}
{const f=premHTML;premHTML=function(){return f.apply(this,arguments)+k12Itin()+k12Cycles()+k12Teacher();};}
if(typeof X4_TABS!=='undefined'&&X4_TABS.leyendas){const T=X4_TABS.leyendas,b0=T.bind;T.bind=function(d){if(b0)b0(d);d.querySelectorAll('[data-k12t]').forEach(b=>b.onclick=()=>{const z=k12z(),k=b.dataset.k12t;z.tarea=z.tarea===k?null:k;save();x4Diario('leyendas');});};}
// la tarea asignada, como misión
try{X4.extra.push(()=>{const z=k12z();if(!z.tarea||!LEG[z.tarea]||legZ(z.tarea).won)return null;const H=K12_HK.get(z.tarea);return{id:'tarea_ley',k:'Tarea de clase',t:'Entra en «'+LEG[z.tarea].title()+'»',s:H?H.pl+' ('+H.re+')':'',at:null};});}catch(e){}
// la leyenda del día, entre las maneras de ganar honra (Metas, 276)
{const f=metActions;metActions=function(){const A=f.apply(this,arguments);try{const D=k12Day();if(D&&typeof leyOpen==='function'&&leyOpen()&&!k12z().day[D.d]){A.push({v:2.4,t:'La leyenda del día: «'+LEG[D.k].title()+'»',s:D.mod[0]+': '+D.mod[1],hon:'+1 y 15 '+(leyRo()?'sestercios':'óbolos')});A.sort((a,b)=>b.v-a.v);A.length=Math.min(A.length,3);}}catch(e){}return A;};}
// ---------------------------------------------------------------- el bucle
{let t=0;const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start')return r;t+=dt;if(t<1)return r;t=0;k12EuriPlace();k12Rumor();}catch(e){if(!K12.err2){K12.err2=1;console.warn('k12',e);}}return r;};}
