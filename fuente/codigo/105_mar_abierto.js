// ============================================================ MAR ABIERTO: la barca sin dueño (Pireo / Emporio de Roma), los tramos de mar, el buceo y la misión del barquero
// Los tramos están en un corredor lejano del mapa (x de un destino, z muy al sur). Cada tramo mide 700 × 700 m; al cruzar un borde con
// vecino se pasa al tramo siguiente. Las costas e islas se ven dentro del tramo y, junto a su orilla, E = desembarcar. La barca usa el estado
// BOAT (BOAT.on con BOAT.sea) para que el resto del juego la trate como la barca de río. Los barcos de pasaje siguen llevando directos al destino.
// Dentro del corredor, floorAt devuelve el fondo marino (SW.BED) y no se anuncian zonas de tierra (checkZone).
const SW={uw:false,X:0,Z0:-16000,DZ:2000,H:350,BED:-38,seg:null,swim:false,depth:0,air:30,moor:{},bg:null,vx:0,vz:0,h:0,uw:false,built:false,objs:[],info:[],dol:[],spin:[],labels:[],items:{},hint:'',diveHold:false};
const SWD={
 atenas:{lane:'creta',coin:'óbolos',reward:15,
  segs:{
   saronico:{k:0,name:'El golfo Sarónico',gr:'ΣΑΡΩΝΙΚΟΣ ΚΟΛΠΟΣ',sub:'Entre el Ática, Egina y el Peloponeso',s:'cicladas',
    isl:[{id:'atenas',name:'El Pireo',sub:'Desembarcar en el puerto de Atenas',x:0,z:-430,rx:620,rz:130,h:26,town:1},
         {id:'egina',name:'Egina',sub:'La isla de Éaco',x:-250,z:40,rx:80,rz:70,h:40},
         {id:null,name:'Salamina',sub:'La isla de Áyax (se desembarca desde el puerto de pasaje)',x:-330,z:-250,rx:60,rz:50,h:26}],
    deco:[{t:'punto',x:-300,z:220,info:'diolkos',go:['corintio',280,60],goT:'Cruzar el Istmo por el díolkos'}]},
   cicladas:{k:1,name:'El mar de las Cícladas',gr:'ΚΥΚΛΑΔΕΣ',sub:'Las islas que forman un círculo alrededor de Delos',n:'saronico',s:'cretico',e:'icario',
    isl:[{id:'delos',name:'Delos',sub:'La isla sagrada de Apolo',x:230,z:-150,rx:45,rz:40,h:16},
         {id:'naxos',name:'Naxos',sub:'La isla de Ariadna',x:240,z:140,rx:90,rz:80,h:55},
         {id:'melos',name:'Melos',sub:'La isla dórica del sur',x:-250,z:170,rx:70,rz:60,h:40},
         {id:null,name:'La roca de Nereo',x:-60,z:-40,rx:8,rz:7,h:5,rock:1,giver:1}],
    wreck:{x:-40,z:120}},
   cretico:{k:2,name:'El mar de Creta',gr:'ΚΡΗΤΙΚΟΝ ΠΕΛΑΓΟΣ',sub:'Mar abierto hacia la isla de Minos',n:'cicladas',
    isl:[{id:'creta',name:'Creta',sub:'Desembarcar en la isla de Minos',x:0,z:470,rx:760,rz:150,h:90,big:1}]},
   icario:{k:3,name:'El mar Icario',gr:'ΙΚΑΡΙΟΝ ΠΕΛΑΓΟΣ',sub:'Donde cayó Ícaro, entre las Cícladas y la costa de Asia',w:'cicladas',n:'egeonorte',
    isl:[{id:'quios',name:'Quíos',sub:'La isla del mejor vino de Grecia',x:120,z:-460,rx:130,rz:100,h:60},
         {id:'efeso',name:'Éfeso',sub:'Jonia: la ciudad del templo de Ártemis',x:480,z:-230,rx:150,rz:140,h:30},
         {id:'samos',name:'Samos',sub:'La isla de Hera y de Pitágoras',x:220,z:-90,rx:110,rz:70,h:60},
         {id:'mileto',name:'Mileto',sub:'Jonia: la ciudad de los primeros filósofos',x:480,z:100,rx:150,rz:120,h:20},
         {id:'halicarnaso',name:'Halicarnaso',sub:'Caria: la ciudad de Heródoto',x:400,z:350,rx:130,rz:90,h:40},
         {id:null,name:'Icaria',sub:'La isla de Ícaro',x:-110,z:-120,rx:130,rz:45,h:50}],
    deco:[{t:'plumas',x:-80,z:-20,info:'icaro'},{t:'punto',x:90,z:-30,info:'policrates'}]},
   corintio:{k:4,name:'El golfo de Corinto',gr:'ΚΟΡΙΝΘΙΑΚΟΣ ΚΟΛΠΟΣ',sub:'Entre el Peloponeso y la Grecia central',w:'jonico',
    isl:[{id:'delfos',name:'Cirra, el puerto de Delfos',sub:'Subir a Delfos, bajo el Parnaso',x:-60,z:-440,rx:260,rz:120,h:70,port:'Cirra'},
         {id:'calidon',name:'Calidón',sub:'Etolia: la ciudad del jabalí',x:-460,z:-260,rx:130,rz:120,h:50},
         {id:'corinto',name:'Lequeo, el puerto de Corinto',sub:'Subir a Corinto',x:250,z:440,rx:260,rz:120,h:40,port:'Lequeo'},
         {id:'egio',name:'Egio',sub:'Acaya',x:-230,z:450,rx:180,rz:120,h:40},
         {id:null,name:'El Istmo de Corinto',sub:'La franja de tierra entre los dos golfos',x:490,z:0,rx:140,rz:300,h:30}],
    deco:[{t:'punto',x:320,z:60,info:'diolkos',go:['saronico',-260,220],goT:'Cruzar el Istmo hacia el golfo Sarónico'},{t:'punto',x:0,z:60,info:'arion'}]},
   jonico:{k:5,name:'El mar Jonio',gr:'ΙΟΝΙΟΝ ΠΕΛΑΓΟΣ',sub:'Las islas de Ulises, entre Grecia e Italia',e:'corintio',
    isl:[{id:'corcira',name:'Corcira',sub:'La isla de los feacios',x:-200,z:-430,rx:150,rz:120,h:60},
         {id:null,name:'Ítaca',sub:'La isla de Ulises',x:-60,z:-80,rx:60,rz:90,h:50},
         {id:null,name:'Cefalenia',sub:'La isla más grande del mar Jonio',x:-260,z:80,rx:110,rz:130,h:70},
         {id:'pilos',name:'Pilos',sub:'Mesenia: la bahía de Esfacteria',x:120,z:460,rx:220,rz:120,h:40}],
    deco:[{t:'punto',x:40,z:-80,info:'itaca'}]},
   egeonorte:{k:6,name:'El Egeo del norte',gr:'ΘΡΑΙΚΙΟΝ ΠΕΛΑΓΟΣ',sub:'El mar de Tracia: de la Calcídica al Helesponto',s:'icario',e:'helesponto',
    isl:[{id:'troya',name:'Troya (Ilión)',sub:'La Tróade, a la entrada del Helesponto',x:480,z:-260,rx:150,rz:160,h:30},
         {id:'lesbos',name:'Lesbos',sub:'La isla de Safo y de Alceo',x:430,z:230,rx:120,rz:100,h:60},
         {id:'olinto',name:'Olinto',sub:'La Calcídica',x:-400,z:-420,rx:140,rz:110,h:30},
         {id:'estagira',name:'Estagira',sub:'La patria de Aristóteles',x:-60,z:-470,rx:160,rz:110,h:40},
         {id:null,name:'El monte Atos',sub:'La península de la montaña sagrada',x:-210,z:-280,rx:40,rz:140,h:110},
         {id:null,name:'Lemnos',sub:'La isla de Hefesto',x:120,z:-40,rx:90,rz:70,h:40},
         {id:null,name:'Samotracia',sub:'La isla de los Misterios de los Grandes Dioses',x:250,z:-380,rx:60,rz:55,h:80},
         {id:'termopilas',name:'Las Termópilas',sub:'El golfo Malíaco: el paso entre el monte y el mar',x:-480,z:170,rx:130,rz:150,h:70}],
    deco:[{t:'punto',x:-150,z:-200,info:'atos'},{t:'punto',x:120,z:50,info:'lemnos'},{t:'punto',x:-300,z:230,info:'artemision'},{t:'punto',x:-180,z:100,info:'escilias'}]},
   helesponto:{k:7,name:'El Helesponto',gr:'ΕΛΛΗΣΠΟΝΤΟΣ',sub:'El estrecho entre Europa y Asia, camino del mar Negro',w:'egeonorte',
    isl:[{id:null,name:'Tracia: Sestos',sub:'La orilla de Europa',x:-60,z:-330,rx:620,rz:210,h:50},
         {id:null,name:'Asia: Ábidos',sub:'La orilla de Asia',x:-60,z:330,rx:620,rz:210,h:45},
         {id:'bizancio',name:'Bizancio',sub:'Tras cruzar la Propóntide, a la entrada del Bósforo',x:480,z:0,rx:120,rz:140,h:30}],
    deco:[{t:'punto',x:-200,z:0,info:'hele'},{t:'punto',x:50,z:0,info:'puente'},{t:'punto',x:230,z:0,info:'leandro'},{t:'punto',x:300,z:100,info:'bosforo',go:['ponto',-290,50],goT:'Remontar el Bósforo hacia el Ponto',goMsg:'Cruzas la Propóntide y remontas el Bósforo, el estrecho que vigila Bizancio. La corriente baja con fuerza desde el Ponto: tardas un día entero.'}]},
   ponto:{k:8,name:'El Ponto Euxino',gr:'ΠΟΝΤΟΣ ΕΥΞΕΙΝΟΣ',sub:'El mar Negro: las rutas del trigo y del vellocino de oro',e:'colquide',
    isl:[{id:null,name:'Tracia',sub:'La costa de Europa',x:-540,z:-260,rx:220,rz:210,h:40},
         {id:null,name:'Las Rocas Cianeas',sub:'Las Simplégades, a la salida del Bósforo',x:-390,z:-40,rx:26,rz:22,h:34},
         {id:null,name:'Las Rocas Cianeas',sub:'',x:-390,z:140,rx:26,rz:22,h:30},
         {id:null,name:'El Quersoneso Táurico',sub:'La tierra de los tauros (Crimea)',x:60,z:-460,rx:260,rz:130,h:60},
         {id:null,name:'Bitinia',sub:'La costa de Asia',x:0,z:480,rx:650,rz:140,h:50}],
    deco:[{t:'punto',x:-330,z:50,info:'bosforo',go:['helesponto',290,90],goT:'Volver por el Bósforo y la Propóntide',goMsg:'Bajas por el Bósforo con la corriente a favor y cruzas la Propóntide hasta el Helesponto.'},
          {t:'punto',x:-210,z:50,info:'simplegades'},{t:'punto',x:60,z:-280,info:'tauros'},{t:'punto',x:120,z:120,info:'euxino'}]},
   colquide:{k:9,name:'Hacia la Cólquide',gr:'ΚΟΛΧΙΣ',sub:'El Ponto oriental: Sinope, las amazonas, Trapezunte y el país del vellocino',w:'ponto',
    isl:[{id:null,name:'Sinope y la costa del Ponto',sub:'Las colonias de Mileto',x:-100,z:480,rx:520,rz:140,h:50},
         {id:null,name:'La Cólquide',sub:'El país del rey Eetes, junto al río Fasis',x:500,z:0,rx:150,rz:400,h:60},
         {id:null,name:'El Cáucaso',sub:'Los montes del fin del mundo',x:300,z:-480,rx:300,rz:130,h:200,big:1}],
    deco:[{t:'punto',x:-250,z:310,info:'sinope'},{t:'punto',x:0,z:300,info:'amazonas'},{t:'punto',x:240,z:300,info:'trapezunte'},{t:'punto',x:320,z:0,info:'vellocino'},{t:'punto',x:250,z:-290,info:'prometeo'}]}},
  entry:{atenas:['saronico',0,-250],egina:['saronico',-140,40],delos:['cicladas',160,-150],naxos:['cicladas',125,140],melos:['cicladas',-155,170],creta:['cretico',0,280],quios:['icario',100,-320],delfos:['corintio',-60,-280],calidon:['corintio',-320,-200],corinto:['corintio',250,280],egio:['corintio',-230,290],corcira:['jonico',-150,-280],pilos:['jonico',120,300],troya:['egeonorte',300,-200],lesbos:['egeonorte',280,180],olinto:['egeonorte',-260,-280],estagira:['egeonorte',-60,-320],termopilas:['egeonorte',-320,140],bizancio:['helesponto',320,0],efeso:['icario',300,-200],samos:['icario',130,-50],mileto:['icario',300,90],halicarnaso:['icario',250,240]},
  palace:{seg:'cicladas',x:80,z:70,name:'El palacio de Poseidón',sub:'en lo hondo del mar, de oro y brillante',figs:'nereidas y Anfitrite',
   txt:'<p>En la <i>Ilíada</i>, Poseidón baja a Egas, donde tiene su famosa casa en lo hondo del mar, de oro, brillante e imperecedera; allí unce a su carro los caballos de cascos de bronce y sale cabalgando sobre las olas (Ilíada XIII 17-31).</p><p>Homero no dice dónde está Egas: había lugares con ese nombre en Acaya y en Eubea. El juego pone el palacio en el fondo del Egeo, entre las Cícladas: <b>licencia del juego</b>. Las figuras son nereidas y Anfitrite, la esposa de Poseidón, como en el poema de Baquílides sobre Teseo.</p>'},
  giver:{name:'Nereo',sub:'el Viejo del Mar',gl:'🌊',look:{chiton:'#5e8a8a',himation:'#3f6e78',beard:true,hair:'#e8e4da'},tail:'#3f7a72',
   intro:'<p>Sobre la roca, un anciano de barba blanca como la espuma te observa. Donde deberían estar sus piernas, brilla una cola de pez.</p><p>«Remas bien para ser de tierra firme. ¿Qué quieres de un viejo?»</p>',
   who:'<p>Nereo es el hijo mayor del Mar (Ponto), el padre de las cincuenta nereidas que tuvo con Dóride. Hesíodo lo llama «el que no miente y dice la verdad», amable y justo (Teogonía 233-236). En los vasos griegos se le pinta como un anciano con cola de pez.</p><p>Cuando Heracles buscaba el camino al jardín de las Hespérides, lo sujetó mientras Nereo se convertía en agua, en fuego y en mil formas, hasta que se rindió y se lo dijo (Apolodoro, Biblioteca II 5.11).</p>',
   tell:'<p>«¿Tesoros? El mar guarda muchas cosas. Te diré tres, porque yo no miento».</p><p>«<b>El anillo de Minos</b>: Minos lo arrojó al agua para retar a Teseo. Está aquí debajo, en la casa de Poseidón. Tírate al agua y baja; no te quedes sin aire».</p><p>«<b>El clavo de Talos</b>: el gigante de bronce de Creta murió cuando le sacaron el clavo de su única vena. Busca en la playa, junto al puerto de Creta, al sur».</p><p>«<b>La corona de Ariadna</b>: Dioniso la subió al cielo, pero una flor de oro se quedó en Naxos, en una roca junto a la orilla, al este de aquí».</p>',
   codex:'Hijo del Mar y padre de las cincuenta nereidas. Hesíodo lo describe como el que no miente y dice la verdad (Teogonía 233-236). Heracles lo sujetó mientras cambiaba de forma para que le dijera el camino a las Hespérides (Apolodoro II 5.11).'},
  owner:{name:'Eudoro',sub:'barquero del Pireo',look:{chiton:'#8a6a4a',himation:'#5a4636',beard:true,hair:'#3a2e24'},
   first:'<p>Al saltar al muelle, un hombre curtido, con las manos llenas de marcas de cabos, se planta delante de ti.</p>',
   offer:'<p>«¡Eh! Esa barca es mía. La dejé un momento para ir a por cebo y cuando vuelvo, ni barca ni nada. Bueno… al menos la has traído entera, y se ve que sabes remar».</p><p>«Te propongo un trato. Mi abuelo me contaba historias de cosas que el mar se tragó y nunca devolvió. Tráeme tres tesoros de esas historias y la barca es tuya».</p>',
   go:'<p>«Así me gusta. No sé dónde están, pero sé quién lo sabe: Nereo, el Viejo del Mar. Los pescadores dicen que a veces se sienta en una roca en medio de las Cícladas. Hesíodo dice que nunca miente. Ve a preguntarle».</p><p class="src">Rema hacia el sur desde el puerto: golfo Sarónico y, después, mar de las Cícladas.</p>',
   hint:'«Primero busca a Nereo, en las Cícladas».',hint2:'«Ya sabes lo que te dijo Nereo: el palacio de Poseidón, Creta y Naxos».',
   later:'<p>«¿Qué tal navega tu barca? Cuida el casco: con brea cada primavera, como todo el mundo».</p>',
   done:'<p>Eudoro mira los tres tesoros uno por uno, en silencio. Toca el anillo, sopesa el clavo, acerca la flor de oro a la luz.</p><p>«Mi abuelo tenía razón… Trato es trato: la barca es tuya. Y toma 15 óbolos, que algo valdrá contarlo en las tabernas del puerto».</p><p class="src">Recibes 15 óbolos. La barca ya es tuya. En el códice (C), «Mitos del mar».</p>'},
  items:[
   {key:'anillo',where:'palace',kind:'ring',name:'El anillo de Minos',sub:'sobre un pequeño altar',short:'el anillo de Minos',gl:'💍',
    txt:'<p>Coges el anillo de oro del altar. Pesa más de lo que parece.</p><p>Baquílides (Ditirambo 17) cuenta que, en el barco que llevaba a Creta a los jóvenes atenienses, Minos arrojó su anillo al mar y retó a Teseo a demostrar que era hijo de Poseidón trayéndolo de vuelta. Teseo saltó al agua; los delfines lo llevaron a la casa de su padre, y Anfitrite le dio un manto de púrpura y una corona. Pausanias (I 17.3) dice que volvió con el anillo y con una corona de oro.</p>',
    codex:'Minos retó a Teseo a recuperar su anillo del fondo del mar; Teseo llegó a la casa de Poseidón y Anfitrite le regaló un manto y una corona (Baquílides, Ditirambo 17; Pausanias I 17.3).'},
   {key:'talos',where:'creta',kind:'nail',name:'Un clavo de bronce',sub:'medio enterrado en la arena',short:'el clavo de Talos',gl:'🔩',cname:'Talos',
    txt:'<p>Sacas de la arena un clavo de bronce grande como un brazo.</p><p>Talos, el gigante de bronce, guardaba Creta y daba tres vueltas a la isla cada día, apedreando a los barcos que se acercaban. Tenía una sola vena, del cuello al tobillo, cerrada con un clavo de bronce. Cuando llegaron los Argonautas, Medea lo hechizó y la vida se le escapó por el tobillo (Apolonio de Rodas, Argonáuticas IV 1638-1688; Apolodoro I 9.26). Que este sea su clavo es <b>licencia del juego</b>.</p>',
    codex:'Gigante de bronce que guardaba Creta. Murió cuando Medea le hizo perder el clavo que cerraba su única vena (Apolonio de Rodas IV 1638-1688; Apolodoro I 9.26).'},
   {key:'ariadna',where:'naxos',kind:'flower',name:'Una flor de oro',sub:'sobre una roca, junto a la orilla',short:'la flor de la corona de Ariadna',gl:'✿',cname:'La corona de Ariadna',
    txt:'<p>Sobre la roca brilla una pequeña flor de oro.</p><p>Teseo abandonó a Ariadna dormida en Naxos. Dioniso la encontró, se casó con ella y, para honrarla, subió su corona al cielo: es la constelación de la Corona Boreal (Ovidio, Fastos III 459-516; Higino, Astronomía II 5). La flor caída es <b>licencia del juego</b>.</p>',
    codex:'Dioniso subió al cielo la corona de Ariadna: la Corona Boreal (Ovidio, Fastos III 459-516; Higino, Astronomía II 5).'}],
  info:{
   escilias:['Escilias','el mejor buceador de Grecia','<p>Heródoto cuenta que Escilias de Escione era el mejor buceador de su tiempo: había rescatado para los persas tesoros de los barcos hundidos. Antes de la batalla de Artemisio se pasó a los griegos y, según se decía, nadó bajo el agua ochenta estadios, unos quince kilómetros, sin salir a respirar. Heródoto no se lo cree: piensa que fue en barca (VIII 8).</p><p>Los buceadores de esponjas del Egeo bajaban a pulmón, con una piedra para hundirse deprisa. Tú también puedes bajar a los pecios de cada mar a por ánforas.</p>'],
   bosforo:['El Bósforo','el «paso de la vaca»','<p>El Bósforo une la Propóntide con el Ponto Euxino. Su nombre significa «paso de la vaca»: por aquí cruzó a nado Ío, convertida en vaca por Zeus y perseguida por un tábano que le envió Hera (Esquilo, Prometeo encadenado 732-735).</p><p>Bizancio controla el paso, y por aquí bajan cada verano los barcos cargados con el trigo del Ponto del que vive Atenas. Quien domina el estrecho tiene a Atenas cogida por el estómago.</p>'],
   simplegades:['Las Rocas Cianeas','las Simplégades','<p>A la salida del Bósforo, dos rocas oscuras: las Cianeas, o Simplégades, «las que chocan». Apolonio de Rodas cuenta que se juntaban aplastando todo lo que pasaba entre ellas. Los Argonautas soltaron una paloma: las rocas se cerraron y solo le arrancaron las plumas de la cola. Entonces remaron con todas sus fuerzas y el Argo pasó, perdiendo solo el adorno de la popa. Desde ese día, las rocas quedaron quietas para siempre (Argonáuticas II 549-606).</p><p>Por eso ahora no se mueven… se supone.</p>'],
   euxino:['¿Por qué «Euxino»?','el mar hospitalario','<p>Los griegos llamaban a este mar Ponto Euxino, «el mar hospitalario». Estrabón cuenta que antes se llamaba Áxeno, «inhóspito», por sus tormentas y por los pueblos salvajes de sus costas; cuando los jonios fundaron colonias en sus orillas, le cambiaron el nombre por el contrario, para atraer la buena suerte (Estrabón VII 3.6).</p><p>Sus aguas son más dulces que las del Egeo, por los grandes ríos que desembocan en él, y en invierno sus tormentas son temibles.</p>'],
   tauros:['Los tauros y el trigo del Bósforo','al norte, la península Táurica','<p>Heródoto cuenta que los tauros sacrificaban a su diosa virgen a los náufragos y a los griegos que capturaban (IV 103). Allí sitúa Eurípides su tragedia <i>Ifigenia entre los tauros</i>: Ifigenia, salvada por Ártemis del sacrificio de Áulide, es sacerdotisa de esa diosa, hasta que su hermano Orestes llega y huyen juntos.</p><p>Al este de la península está el reino griego del Bósforo Cimerio. Su rey Leucón, que empieza a reinar por estos años, será el gran proveedor de trigo de Atenas: Demóstenes lo contará en el 355 a.C. (Contra Leptines 31-33).</p>'],
   sinope:['Sinope','la colonia de Mileto','<p>Sinope, en la costa sur del Ponto, es una colonia de Mileto y una de las ciudades más ricas del mar Negro; sus barcos llevan atún salado, madera y el ocre rojo de sus minas. Aquí nació, hacia el 412 a.C., Diógenes, el que llamarán «el Perro». Ahora es un joven; años después, desterrado, irá a Atenas, vivirá en una tinaja y se burlará de todo el mundo (Diógenes Laercio VI 20-21).</p>'],
   amazonas:['El Termodonte','el país de las amazonas','<p>Junto al río Termodonte estaba Temiscira, la tierra de las amazonas, el pueblo de mujeres guerreras (Heródoto IV 110; Apolonio de Rodas II 965-1000). Heracles vino hasta aquí en su noveno trabajo, a buscar el cinturón de su reina, Hipólita (Apolodoro II 5.9). Los Argonautas pasaron de largo sin desembarcar.</p>'],
   trapezunte:['Trapezunte','¡El mar, el mar!','<p>Hace solo catorce años, en el 400 a.C., diez mil mercenarios griegos que volvían de Persia después de perder a sus generales cruzaron las montañas nevadas de Armenia. Al subir al monte Teques vieron por fin el mar y empezaron a gritar «¡El mar, el mar!»; se abrazaron llorando y levantaron un gran montón de piedras. Poco después llegaron aquí, a Trapezunte, una ciudad griega (Jenofonte, Anábasis IV 7.21-26 y IV 8.22).</p><p>Jenofonte, que los guió, es ateniense; ahora vive desterrado cerca de Olimpia. Muchos de aquellos soldados viven hoy en Atenas.</p>'],
   vellocino:['La Cólquide','el país del vellocino de oro','<p>Al fondo del Ponto, junto al río Fasis, estaba la Cólquide, el reino de Eetes, hijo del Sol. Allí colgaba de una encina, en el bosque sagrado de Ares, el vellocino de oro, vigilado por una serpiente que nunca dormía. Medea, la hija del rey, la durmió con sus hechizos, y Jasón se llevó el vellocino al Argo (Apolonio de Rodas, Argonáuticas IV 123-182).</p>'],
   prometeo:['El Cáucaso','donde estaba encadenado Prometeo','<p>En las cumbres del Cáucaso estaba encadenado Prometeo, castigado por Zeus por haber dado el fuego a los hombres. Cada día un águila le devoraba el hígado, que volvía a crecer por la noche. Apolonio cuenta que los Argonautas vieron pasar el águila por encima del barco y oyeron los gritos del titán (Argonáuticas II 1246-1259). Heracles mató al águila y lo liberó (Hesíodo, Teogonía 526-531).</p>'],
   atos:['El canal de Jerjes','en el istmo del monte Atos','<p>En el 492 a.C., la flota persa de Mardonio naufragó al doblar el cabo del monte Atos: Heródoto habla de unas trescientas naves y veinte mil hombres perdidos (VI 44). Para que no volviera a pasar, Jerjes mandó excavar durante tres años un canal a través del istmo que une el Atos al continente, lo bastante ancho para que pasaran dos trirremes a la vez (Heródoto VII 22-24). Heródoto pensaba que lo hizo sobre todo por orgullo. Los arqueólogos han encontrado su trazado.</p>'],
   lemnos:['Lemnos','la isla de Hefesto','<p>En la <i>Ilíada</i>, Hefesto cuenta que Zeus, enfadado, lo agarró del pie y lo arrojó desde el Olimpo: cayó durante todo un día y, al ponerse el sol, aterrizó en Lemnos, medio muerto; allí lo cuidaron los sintios (Ilíada I 590-594). Desde entonces Lemnos fue la isla del dios herrero. También fue la primera escala de los Argonautas.</p>'],
   artemision:['Artemisio','el mar de la batalla','<p>En el verano del 480 a.C., mientras Leónidas defendía el paso de las Termópilas, la flota griega se enfrentaba a la persa aquí cerca, junto al cabo Artemisio, al norte de Eubea. Fueron tres días de combates sin vencedor; al saber que las Termópilas habían caído, los griegos se retiraron hacia Salamina (Heródoto VIII 1-23).</p><p class="src">Anacronismo señalado: en el fondo de este mar se encontró en 1928 una gran estatua de bronce de Zeus o Poseidón, hoy en el Museo Arqueológico de Atenas. En el 386 a.C. nadie sabía que estaba allí.</p>'],
   hele:['El mar de Hele','por qué se llama Helesponto','<p>Frixo y Hele, hijos del rey Atamante, iban a ser sacrificados por culpa de su madrastra Ino. Su madre les envió un carnero de vellón de oro que voló con ellos por encima del mar. Al cruzar este estrecho, Hele se cayó y se ahogó: por eso se llama Helesponto, «el mar de Hele». Frixo llegó a la Cólquide, y el vellón de oro es el que después fueron a buscar los Argonautas (Apolodoro I 9.1; Ovidio, Fastos III 851-876).</p>'],
   puente:['El puente de Jerjes','entre Ábidos y Sestos','<p>En el 480 a.C., Jerjes hizo tender dos puentes de barcos entre Ábidos, en Asia, y Sestos, en Europa, para que pasara su ejército. Una tempestad destrozó los primeros, y Jerjes, furioso, mandó dar trescientos latigazos al Helesponto y arrojar al agua un par de grilletes. Los nuevos puentes, de cientos de naves atadas con cables, aguantaron: el ejército tardó siete días y siete noches en cruzar (Heródoto VII 33-36 y 56).</p>'],
   leandro:['Hero y Leandro','una historia de amor del estrecho','<p>Leandro vivía en Ábidos y Hero, sacerdotisa de Afrodita, en Sestos, al otro lado del estrecho. Cada noche Leandro cruzaba a nado guiándose por la lámpara que Hero encendía en su torre. Una noche de tormenta el viento apagó la lámpara y Leandro se ahogó; al ver su cuerpo en la orilla, Hero se lanzó desde la torre (Ovidio, Heroidas 18-19; Museo, Hero y Leandro, poema de época romana tardía).</p><p class="src">Anacronismo señalado: en 1810, el poeta inglés Lord Byron cruzó el estrecho a nado para comprobar que se podía.</p>'],
   diolkos:['El díolkos','la calzada de los barcos','<p>Entre el golfo Sarónico y el de Corinto solo hay unos seis kilómetros de tierra: el Istmo. Hacia el 600 a.C. se construyó el díolkos, una calzada de losas de piedra con surcos por la que se arrastraban los barcos sobre carros de una orilla a otra, para no tener que rodear todo el Peloponeso por el peligroso cabo Malea. Tucídides cuenta que los espartanos y sus aliados lo usaron en la guerra (III 15; VIII 7-8); Estrabón explica que así se ahorraban el rodeo (VIII 2.1).</p><p>Corinto cobraba por todo lo que pasaba por el Istmo: de ahí su riqueza. Junto al díolkos estaba el santuario de Poseidón donde se celebraban los Juegos Ístmicos.</p><p class="src">En el juego, unos esclavos arrastran tu barca: tarda unas horas.</p>'],
   arion:['Arión y el delfín','una historia del golfo','<p>Heródoto cuenta que Arión, el mejor citaredo de su tiempo, vivía en Corinto junto al tirano Periandro. Al volver de Italia con una fortuna, los marineros decidieron matarlo para robársela. Arión les pidió cantar por última vez: se puso su traje de cantor, tocó la cítara de pie en la popa y se lanzó al mar. Un delfín lo recogió y lo llevó a hombros hasta el cabo Ténaro (Heródoto I 23-24).</p><p>Los delfines que saltan junto a tu barca no llevan a nadie… que sepamos.</p>'],
   itaca:['Ítaca','la isla de Ulises','<p>Ítaca, pequeña y escarpada, era el reino de Ulises. Al final de su viaje, los feacios lo llevaron dormido en una de sus naves y lo dejaron en la playa con sus regalos; al despertar, no reconoció su propia isla (Odisea XIII 70-125 y 187-196).</p><p>Los de Corcira, al norte, decían que su isla era la de los feacios, la Esqueria de la Odisea; Tucídides lo recoge (I 25.4).</p>'],
   icaro:['Plumas en el agua','el mar donde cayó Ícaro','<p>Dédalo e Ícaro escaparon de Creta con alas de plumas pegadas con cera. Ícaro, desobedeciendo a su padre, subió demasiado cerca del sol: la cera se derritió, perdió las plumas y cayó al mar, que desde entonces se llama Icario. Dédalo enterró a su hijo en la isla cercana, que también tomó su nombre: Icaria (Ovidio, Metamorfosis VIII 183-235; Estrabón XIV 1.19).</p><p>Si tienes las alas de Dédalo, ya sabes: ni muy alto ni muy bajo.</p>'],
   policrates:['El anillo de Polícrates','frente a Samos','<p>Heródoto cuenta que Polícrates, tirano de Samos, tenía tanta suerte que su amigo el faraón Amasis le aconsejó desprenderse de lo que más quería para no despertar la envidia de los dioses. Polícrates arrojó al mar, desde un barco, su sello de oro con una esmeralda, obra de Teodoro de Samos. Días después, un pescador le regaló un pez enorme… y en su vientre estaba el anillo. Amasis rompió la amistad: pensó que alguien con tanta suerte acabaría mal, y así fue (Heródoto III 40-43 y 120-125).</p>']}},
 roma:{lane:'cartago',coin:'sestercios',reward:20,
  segs:{
   ostia:{k:0,name:'El mar de Ostia',gr:'MARE TYRRHENVM',sub:'Frente a la desembocadura del Tíber y el puerto de Claudio',s:'crater',w:'tyrrn',
    isl:[{id:'atenas',name:'Ostia y el Puerto',sub:'Remontar el Tíber hasta el Emporio de Roma',x:0,z:-440,rx:640,rz:130,h:20,town:1},
         {id:null,name:'El monte Circeo',sub:'El promontorio de Circe',x:470,z:220,rx:110,rz:80,h:90}],
    deco:[{t:'faro',x:-110,z:-300,h:40,info:'portus'},{t:'punto',x:320,z:220,info:'circe'}],wreck:{x:120,z:-60}},
   tyrrn:{k:7,name:'El Tirreno del norte',gr:'MARE TYRRHENVM · ETRVRIA',sub:'La costa de Etruria y de Liguria, la isla del hierro y el puerto del mármol',e:'ostia',s:'sardum',
    isl:[{id:'etruria',name:'Graviscas, el puerto de Tarquinii',sub:'Etruria',x:470,z:150,rx:150,rz:220,h:40},
         {id:'lunae',name:'El puerto de Luna',sub:'Las canteras del mármol blanco',x:300,z:-470,rx:200,rz:120,h:70,port:'el puerto de Luna'},
         {id:'liguria',name:'Genua',sub:'Liguria',x:-300,z:-470,rx:200,rz:120,h:60},
         {id:null,name:'Ilva (Elba)',sub:'La isla del hierro',x:-60,z:60,rx:90,rz:50,h:70}],
    deco:[{t:'punto',x:-60,z:150,info:'ilva'},{t:'punto',x:200,z:-60,info:'piratas'},{t:'punto',x:300,z:-300,info:'marmol'}]},
   crater:{k:8,name:'El golfo de Neápolis',gr:'CRATER',sub:'Miseno, Bayas, Puteoli, Neápolis y el Vesubio, un año después de la erupción',n:'ostia',s:'eolias',
    isl:[{id:'campania',name:'Neápolis',sub:'Latium et Campania',x:420,z:-170,rx:120,rz:140,h:50},
         {id:null,name:'El Vesubio',sub:'Un año después de la erupción',x:530,z:70,rx:150,rz:150,h:120,col:'#6f6a64',smoke:1},
         {id:null,name:'El cabo Miseno',sub:'La base de la flota',x:-120,z:-430,rx:110,rz:90,h:50},
         {id:null,name:'Capreae (Capri)',sub:'La isla de Tiberio',x:100,z:390,rx:90,rz:50,h:90},
         {id:null,name:'Las Sirenusas',sub:'Las islas de las sirenas',x:280,z:290,rx:26,rz:20,h:18},
         {id:'lucania',name:'Paestum',sub:'Lucania: los templos griegos',x:480,z:340,rx:120,rz:90,h:30}],
    deco:[{t:'punto',x:-40,z:-190,info:'ostras'},{t:'punto',x:-120,z:-290,info:'miseno'},{t:'punto',x:330,z:60,info:'pompeya'},{t:'punto',x:100,z:290,info:'capri'},{t:'punto',x:210,z:250,info:'sirenas'}]},
   eolias:{k:9,name:'Las islas Eolias',gr:'AEOLIAE INSVLAE',sub:'Las islas de Eolo y la fragua de Vulcano',n:'crater',s:'fretum',
    isl:[{id:null,name:'Lipara',sub:'La mayor de las Eolias',x:-120,z:-60,rx:100,rz:80,h:60},
         {id:null,name:'Hiera (Vulcano)',sub:'La isla de la fragua',x:-80,z:220,rx:70,rz:60,h:70,col:'#6f6a64',smoke:1},
         {id:null,name:'Strongyle (Estrómboli)',sub:'«La redonda», siempre en llamas',x:260,z:-220,rx:60,rz:60,h:120,col:'#5f5a56',smoke:1},
         {id:null,name:'Sicilia',sub:'La costa norte',x:0,z:500,rx:700,rz:120,h:70}],
    deco:[{t:'punto',x:60,z:-60,info:'eolo'},{t:'punto',x:-80,z:110,info:'vulcano'},{t:'punto',x:260,z:-110,info:'strongyle'}]},
   ionium:{k:10,name:'El mar Jonio',gr:'MARE IONIVM',sub:'De la punta de Italia al canal de Otranto',n:'adriaticum',e:'aegaeum',
    isl:[{id:null,name:'El Brucio y Crotón',sub:'La costa de la Magna Grecia',x:-480,z:100,rx:150,rz:320,h:70},
         {id:'apulia',name:'Brundisium',sub:'Apulia et Calabria: el final de la Vía Apia',x:-150,z:-460,rx:300,rz:120,h:30,port:'el puerto de Brundisium'},
         {id:null,name:'Epiro y Corcira',sub:'La costa de Grecia',x:480,z:-100,rx:150,rz:300,h:80}],
    deco:[{t:'punto',x:-300,z:320,info:'brucio',go:['fretum',300,300],goT:'Volver por la punta de Italia hacia el estrecho',goMsg:'Bordeas otra vez la punta de Italia hasta el estrecho de Mesina. Un día de remo.'},
          {t:'punto',x:-300,z:0,info:'pitagoras'},{t:'punto',x:150,z:-200,info:'otranto'},{t:'punto',x:-150,z:-300,info:'brundisium'}]},
   adriaticum:{k:11,name:'El mar Adriático',gr:'MARE HADRIATICVM',sub:'El «mar de arriba»: de Ancona a las bocas del Po y Aquilea',s:'ionium',
    isl:[{id:'picenum',name:'Ancona',sub:'Picenum: el codo de la costa',x:-470,z:250,rx:130,rz:110,h:60,port:'el puerto de Ancona'},
         {id:'umbria',name:'Ariminum',sub:'Umbria: el final de la Vía Flaminia',x:-480,z:20,rx:130,rz:100,h:30},
         {id:'rubico',name:'La desembocadura del Rubicón',sub:'La antigua frontera de Italia',x:-470,z:-170,rx:120,rz:80,h:20,port:'la desembocadura del Rubicón'},
         {id:'padus',name:'Las bocas del Po',sub:'El delta y Ravenna',x:-330,z:-470,rx:200,rz:120,h:8,port:'las bocas del Po'},
         {id:'venetia',name:'Aquilea',sub:'Venetia et Histria',x:120,z:-480,rx:200,rz:110,h:20,port:'Aquilea'},
         {id:'salona',name:'Salona',sub:'La costa de Dalmacia y sus mil islas',x:500,z:0,rx:140,rz:420,h:80},
         {id:null,name:'Las islas de Diomedes',sub:'Donde viven las aves de Diomedes',x:-150,z:340,rx:30,rz:24,h:20}],
    deco:[{t:'punto',x:-250,z:-170,info:'rubicon'},{t:'punto',x:-330,z:-300,info:'ravenna'},{t:'punto',x:-120,z:-330,info:'faeton'},{t:'punto',x:-150,z:250,info:'diomedes'},{t:'punto',x:100,z:100,info:'superum'},{t:'punto',x:120,z:-320,info:'antenor'}]},
   siculum:{k:12,name:'El mar de Sicilia',gr:'MARE SICVLVM',sub:'La costa oriental de Sicilia, del Etna a Siracusa y Malta',n:'fretum',s:'africum',
    isl:[{id:'siracusa',name:'Siracusa',sub:'Desembarcar en Siracusa, la mayor ciudad de Sicilia',x:-470,z:0,rx:150,rz:520,h:60},
         {id:null,name:'El Etna',sub:'El volcán más alto de Europa',x:-420,z:-150,rx:130,rz:130,h:170,col:'#6f6a64',smoke:1},
         {id:'melita',name:'Melita (Malta)',sub:'La isla de la miel',x:300,z:380,rx:70,rz:45,h:40}],
    deco:[{t:'punto',x:-230,z:-150,info:'etna'},{t:'punto',x:-250,z:200,info:'siracusa'},{t:'punto',x:300,z:280,info:'melita'}]},
   aegaeum:{k:13,name:'El mar Egeo',gr:'MARE AEGAEVM · ACHAIA',sub:'La provincia de Acaya: Corinto, Atenas, Delos, Rodas y Éfeso',w:'ionium',
    isl:[{id:'corinthus',name:'Corinto',sub:'Desembarcar en Corinto, la capital de Acaya',x:-480,z:-50,rx:150,rz:220,h:60},
         {id:'athenae',name:'El Pireo',sub:'Desembarcar en el Pireo, el puerto de Atenas',x:-250,z:-430,rx:260,rz:120,h:50},
         {id:'delos',name:'Delos',sub:'La isla de Apolo, casi desierta',x:60,z:-20,rx:40,rz:35,h:16},
         {id:'rhodus',name:'Rodas',sub:'La isla del Coloso caído',x:450,z:380,rx:110,rz:70,h:60},
         {id:'ephesus',name:'Éfeso',sub:'Desembarcar en Éfeso, capital de Asia',x:480,z:-150,rx:140,rz:250,h:50}],
    deco:[{t:'punto',x:-300,z:-50,info:'corintoR'},{t:'punto',x:-250,z:-260,info:'atenasR'},{t:'punto',x:60,z:80,info:'delosR'},{t:'punto',x:320,z:330,info:'rodas'},{t:'punto',x:300,z:-150,info:'efesoR'},
          {t:'punto',x:150,z:-300,info:'helesponto',go:['pontus',-280,280],goT:'Navegar al Ponto por el Helesponto y el Bósforo',goMsg:'Subes por el Egeo, cruzas el Helesponto y la Propóntide y remontas el Bósforo hasta el Ponto Euxino. Varios días de navegación, que el juego resume.'}]},
   syria:{k:14,name:'El mar de Siria',gr:'MARE SYRIACVM · IVDAEA',sub:'Fenicia, Judea y Chipre, diez años después de la guerra judía',w:'aegyptium',
    isl:[{id:'antiochia',name:'Seleucia, el puerto de Antioquía',sub:'Desembarcar para ir a Antioquía',x:480,z:0,rx:150,rz:520,port:'el puerto de Seleucia',h:70},
         {id:'cyprus',name:'Pafos (Chipre)',sub:'La isla del cobre y de Venus',x:-150,z:-280,rx:160,rz:70,h:60}],
    deco:[{t:'punto',x:300,z:250,info:'cesarea'},{t:'punto',x:300,z:-250,info:'tiro'},{t:'punto',x:250,z:0,info:'jerusalen'},{t:'punto',x:-150,z:-170,info:'chipre'}]},
   oceanus:{k:15,name:'El Océano',gr:'OCEANVS',sub:'Más allá de las Columnas de Hércules: Lusitania y el camino de Britania',e:'gaditanum',
    isl:[{id:'olisipo',name:'Olisipo',sub:'Desembarcar en Olisipo, en la boca del Tajo',x:100,z:-470,rx:500,rz:130,h:60},
         {id:null,name:'Las Islas Afortunadas',sub:'Las Canarias',x:300,z:420,rx:60,rz:40,h:60}],
    deco:[{t:'punto',x:0,z:0,info:'mareas'},{t:'punto',x:-250,z:-150,info:'casiterides'},{t:'punto',x:200,z:-250,info:'britania'},{t:'punto',x:250,z:300,info:'afortunadas'}]},
   pontus:{k:16,name:'El Ponto Euxino',gr:'PONTVS EVXINVS',sub:'El mar Negro romano: Tomis, el Ponto y el reino del Bósforo',
    isl:[{id:null,name:'Mesia: Tomis',sub:'La costa del destierro de Ovidio',x:-480,z:0,rx:150,rz:500,h:40},
         {id:null,name:'Bitinia y el Ponto',sub:'La costa de Asia',x:0,z:480,rx:600,rz:130,h:60},
         {id:null,name:'El Bósforo Cimerio',sub:'El reino cliente de Roma (Crimea)',x:0,z:-480,rx:500,rz:130,h:50}],
    deco:[{t:'punto',x:-280,z:280,info:'bosforoR',go:['aegaeum',150,-250],goT:'Volver al Egeo por el Bósforo y el Helesponto',goMsg:'Bajas por el Bósforo con la corriente a favor, cruzas la Propóntide y el Helesponto y vuelves al Egeo.'},
          {t:'punto',x:-300,z:-50,info:'tomis'},{t:'punto',x:100,z:300,info:'mitridates'},{t:'punto',x:100,z:-300,info:'pontica'}]},
   fretum:{k:1,name:'El estrecho de Mesina',gr:'FRETVM SICVLVM',sub:'Entre Italia y Sicilia: el paso de Escila y Caribdis',n:'eolias',s:'siculum',
    isl:[{id:'regium',name:'Regium',sub:'Desembarcar en Rhegium, en la punta de Italia',x:470,z:0,rx:150,rz:520,h:70},
         {id:null,name:'Sicilia',sub:'La isla de Ceres y del Etna',x:-470,z:0,rx:150,rz:520,h:90},
         {id:null,name:'La roca de Glauco',x:-30,z:-60,rx:8,rz:7,h:5,rock:1,giver:1}],
    deco:[{t:'escila',x:290,z:-220,info:'escila'},{t:'remolino',x:-250,z:-190,r:45,info:'caribdis'},{t:'punto',x:300,z:330,info:'brucio',go:['ionium',-280,300],goT:'Rodear la punta de Italia hacia el mar Jonio',goMsg:'Bordeas la punta de la bota de Italia, pasas frente a Locros y llegas al mar Jonio. Un día de remo.'}]},
   africum:{k:2,name:'El mar de África',gr:'MARE AFRICVM',sub:'Hacia Cartago, la ciudad de Dido',n:'siculum',e:'aegyptium',
    isl:[{id:'cartago',name:'Carthago',sub:'Desembarcar en la colonia romana de Cartago',x:0,z:470,rx:760,rz:150,h:50,town:1}]},
   aegyptium:{k:3,name:'El mar de Egipto',gr:'MARE AEGYPTIVM',sub:'Ante la costa de Alejandría',w:'africum',e:'syria',
    isl:[{id:'alejandria',name:'Alejandría',sub:'Desembarcar en el gran puerto',x:0,z:470,rx:760,rz:150,h:14,town:1},
         {id:null,name:'La isla de Faros',sub:'',x:-160,z:250,rx:70,rz:28,h:6,flat:1}],
    deco:[{t:'faro',x:-190,z:250,h:95,info:'faro'}]},
   sardum:{k:4,name:'El mar de Cerdeña',gr:'MARE SARDOVM',sub:'Entre Italia y las grandes islas de Cerdeña y Córcega',n:'tyrrn',w:'baleares',
    isl:[{id:'caralis',name:'Caralis',sub:'Desembarcar en Caralis, en el sur de Cerdeña',x:-150,z:150,rx:170,rz:230,h:80},
         {id:'aleria',name:'Aleria',sub:'Desembarcar en Aleria, en la costa de Córcega',x:-120,z:-290,rx:120,rz:110,h:90}]},
   baleares:{k:5,name:'El mar Balear',gr:'MARE BALEARICVM',sub:'Hacia las costas de Hispania y de la Galia',e:'sardum',s:'gaditanum',
    isl:[{id:'massilia',name:'Massilia',sub:'La vieja colonia griega de la Galia',x:120,z:-470,rx:220,rz:140,h:40},
         {id:'emporiae',name:'Emporiae',sub:'Hispania Citerior',x:-260,z:-430,rx:120,rz:110,h:30},
         {id:'barcino',name:'Barcino',sub:'Hispania Citerior',x:-470,z:-200,rx:130,rz:110,h:30},
         {id:'tarraco',name:'Tarraco',sub:'La capital de la Hispania Citerior',x:-480,z:30,rx:130,rz:120,h:40},
         {id:'cartnova',name:'Carthago Nova',sub:'Hispania Citerior',x:-430,z:300,rx:130,rz:110,h:40},
         {id:null,name:'Las Baleares',sub:'Las islas de los honderos',x:90,z:150,rx:120,rz:80,h:40}]},
   gaditanum:{k:6,name:'Las Columnas de Hércules',gr:'FRETVM GADITANVM',sub:'El estrecho entre Europa y África, a la salida del Mediterráneo',n:'baleares',w:'oceanus',
    isl:[{id:'gades',name:'Gades',sub:'La ciudad de los fenicios, más allá del estrecho',x:-470,z:120,rx:140,rz:170,h:30},
         {id:null,name:'Calpe',sub:'Una de las Columnas de Hércules (hoy, Gibraltar)',x:60,z:-440,rx:110,rz:100,h:130},
         {id:null,name:'Abila',sub:'La otra Columna, en la orilla de África',x:60,z:440,rx:110,rz:100,h:110}],
    deco:[{t:'punto',x:60,z:-250,info:'columnas'}]}},
  entry:{atenas:['ostia',0,-270],salona:['adriaticum',330,0],melita:['siculum',200,380],corinthus:['aegaeum',-300,-50],athenae:['aegaeum',-250,-280],delos:['aegaeum',60,40],rhodus:['aegaeum',450,280],ephesus:['aegaeum',310,-150],antiochia:['syria',300,0],cyprus:['syria',-150,-180],olisipo:['oceanus',100,-310],siracusa:['siculum',-280,220],caralis:['sardum',60,170],aleria:['sardum',30,-290],campania:['crater',300,-150],lucania:['crater',340,250],apulia:['ionium',-120,-300],picenum:['adriaticum',-320,250],umbria:['adriaticum',-320,20],rubico:['adriaticum',-320,-140],padus:['adriaticum',-300,-310],venetia:['adriaticum',120,-330],etruria:['tyrrn',300,150],lunae:['tyrrn',300,-310],liguria:['tyrrn',-300,-310],regium:['fretum',290,0],cartago:['africum',0,280],alejandria:['aegyptium',0,280],massilia:['baleares',120,-300],emporiae:['baleares',-120,-300],barcino:['baleares',-310,-200],tarraco:['baleares',-320,30],cartnova:['baleares',-270,300],gades:['gaditanum',-300,120]},
  palace:{seg:'fretum',x:80,z:90,name:'El palacio de Neptuno',sub:'en lo hondo del mar, de oro y brillante',figs:'Tritón y las nereidas',
   txt:'<p>Los romanos identificaban a Neptuno con el Poseidón griego. En la <i>Ilíada</i>, su casa está en lo hondo del mar, en Egas: de oro, brillante e imperecedera (XIII 17-31). Virgilio lo muestra calmando la tempestad que Juno había desatado contra Eneas y recorriendo el mar en su carro, rodeado de tritones y nereidas (Eneida I 124-156; V 816-826).</p><p>Que el palacio esté aquí, bajo el estrecho de Mesina, es <b>licencia del juego</b>.</p>'},
  giver:{name:'Glauco',sub:'el pescador que se volvió dios del mar',gl:'🌊',look:{chiton:'#4f7f6a',himation:'#3a6a5a',beard:true,hair:'#6f9a7a'},tail:'#3a7a6a',
   intro:'<p>Sobre la roca, un hombre de barba verde como las algas y brazos azulados te saluda. De cintura para abajo es un pez.</p><p>«No te asustes. Yo también remaba, antes de ser lo que soy. ¿Qué te trae al estrecho?»</p>',
   who:'<p>Ovidio cuenta que Glauco era un pescador de Antedón, en Beocia. Un día vio cómo los peces que había pescado revivían al tocar una hierba y volvían al agua; la probó, sintió el deseo de vivir en el mar y saltó. Los dioses del mar lo acogieron: le salió una barba verde, los brazos se le volvieron azules y las piernas, una cola de pez (Metamorfosis XIII 904-968).</p><p>Se enamoró de la ninfa Escila y pidió ayuda a la hechicera Circe; Circe, celosa, envenenó el agua donde se bañaba Escila y la convirtió en un monstruo (Metamorfosis XIV 1-74).</p>',
   tell:'<p>«¿Tesoros? Los he visto todos. Te diré tres».</p><p>«<b>La caracola de Tritón</b>, el trompetero de Neptuno: está aquí debajo, en el palacio de mi señor. Tírate al agua y baja, pero no te quedes sin aire».</p><p>«<b>La rama dorada</b> que Eneas llevó al mundo de los muertos: búscala en Neápolis, en el golfo que hay al sur del mar de Ostia».</p><p>«<b>La piel de buey de Dido</b>: con ella midió la tierra de Cartago. Al sur, en el mar de África, junto al puerto».</p><p>«Y ten cuidado con Escila, a la derecha, y con Caribdis, a la izquierda. No te acerques al remolino».</p>',
   codex:'Pescador de Antedón que comió una hierba mágica y se convirtió en dios del mar, de barba verde y cola de pez. Por amor a Escila provocó, sin querer, que Circe la convirtiera en monstruo (Ovidio, Metamorfosis XIII 904-968 y XIV 1-74).'},
  owner:{name:'Fulvio',sub:'barquero del Tíber',look:{chiton:'#8a6a4a',himation:'#6a5040',beard:false,hair:'#2e241c'},
   first:'<p>Al saltar al muelle del Emporio, un barquero de brazos como troncos se te planta delante, con los brazos en jarras.</p>',
   offer:'<p>«¡Por Hércules! Esa barca es mía. Bajé a descargar un ánfora y, cuando vuelvo, ni barca ni nada. Al menos la has traído entera, y se ve que sabes remar».</p><p>«Te propongo un trato. Mi padre, que navegó con la flota de Miseno, me contaba historias de cosas que el mar se tragó. Tráeme tres tesoros de esas historias y la barca es tuya».</p>',
   go:'<p>«Bien dicho. No sé dónde están, pero sé quién lo sabe: Glauco, el pescador que se volvió dios del mar. Los marineros dicen que se sienta en una roca en medio del estrecho de Mesina. Ve a preguntarle».</p><p class="src">Baja por el Tíber hasta el mar y rema hacia el sur: el golfo de Neápolis, las islas Eolias y, después, el estrecho de Mesina.</p>',
   hint:'«Primero busca a Glauco, en el estrecho de Mesina».',hint2:'«Ya sabes lo que te dijo Glauco: el palacio de Neptuno, Neápolis y Cartago».',
   later:'<p>«¿Qué tal navega tu barca? Brea en el casco cada primavera, que el agua del Tíber pudre la madera».</p>',
   done:'<p>Fulvio mira los tres tesoros uno por uno, en silencio. Se acerca la caracola al oído, toca las hojas de oro de la rama, desenrolla la tira de piel.</p><p>«Mi padre tenía razón… Trato es trato: la barca es tuya. Y toma 20 sestercios, que algo valdrá contarlo en las tabernas de Ostia».</p><p class="src">Recibes 20 sestercios. La barca ya es tuya. En el códice (C), «Mitos del mar».</p>'},
  items:[
   {key:'caracola',where:'palace',kind:'conch',name:'La caracola de Tritón',sub:'sobre un pequeño altar',short:'la caracola de Tritón',gl:'🐚',
    txt:'<p>Coges la gran caracola del altar. Al soplarla suena grave, como un trueno lejano.</p><p>Tritón, hijo de Neptuno, sopla su caracola para calmar o levantar el mar (Ovidio, Metamorfosis I 330-342). Virgilio cuenta que Miseno, el trompetero de Eneas, se atrevió a desafiar a los dioses tocando una caracola, y Tritón, celoso, lo hundió entre las rocas; el cabo Miseno, junto a Neápolis, lleva su nombre (Eneida VI 162-174). Que esta sea la caracola de Tritón es <b>licencia del juego</b>.</p>',
    codex:'Tritón, hijo de Neptuno, calma el mar con su caracola (Ovidio, Metamorfosis I 330-342). Ahogó a Miseno, el trompetero de Eneas, por desafiar a los dioses con su caracola (Virgilio, Eneida VI 162-174).'},
   {key:'rama',where:'campania',kind:'bough',name:'Una rama de hojas de oro',sub:'entre las piedras, junto al camino',short:'la rama dorada',gl:'🌿',cname:'La rama dorada',
    txt:'<p>Entre las piedras brilla una rama con hojas de oro que suenan al moverlas.</p><p>La Sibila de Cumas le dijo a Eneas que, para bajar vivo al mundo de los muertos, debía arrancar una rama de oro escondida en un árbol del bosque, cerca del lago Averno, y llevársela como regalo a Proserpina. Dos palomas, las aves de su madre Venus, lo guiaron hasta ella (Virgilio, Eneida VI 136-148 y 190-211). El bosque está junto a Cumas, cerca de Neápolis; ponerla aquí es <b>licencia del juego</b>.</p>',
    codex:'Rama de oro que Eneas tuvo que arrancar, guiado por las palomas de Venus, para bajar vivo al mundo de los muertos (Virgilio, Eneida VI 136-148 y 190-211).'},
   {key:'piel',where:'cartago',kind:'hide',name:'Una tira de piel de buey',sub:'enrollada sobre una piedra',short:'la piel de buey de Dido',gl:'🐂',cname:'La piel de buey de Dido',
    txt:'<p>Encuentras una larguísima tira de piel de buey, cortada muy fina y enrollada.</p><p>Cuando Dido llegó a África huyendo de Tiro, compró tanta tierra como pudiera rodear la piel de un buey. Cortó la piel en tiras finísimas y con ellas rodeó una colina entera: allí fundó la ciudadela de Cartago, la Birsa (Virgilio, Eneida I 365-368; Justino XVIII 5). Que esta sea una de aquellas tiras es <b>licencia del juego</b>.</p>',
    codex:'Dido compró la tierra que pudiera rodear una piel de buey, la cortó en tiras finísimas y rodeó con ellas la colina de la Birsa, en Cartago (Virgilio, Eneida I 365-368; Justino XVIII 5).'}],
  info:{
   ostras:['Las ostras del Lucrino','los criaderos de Bayas','<p>Junto a Bayas, en el lago Lucrino, Sergio Orata inventó los criaderos de ostras: las cultivaba en estanques y ganó una fortuna vendiéndolas a los ricos de Roma; fue también el primero en dar a las ostras del Lucrino fama de ser las mejores (Plinio, Historia natural IX 168). Las villas de la costa de Bayas tienen estanques de peces junto al mar.</p><p>En el fondo de cada mar hay pecios con ánforas: puedes bucear para subirlas y venderlas en puerto.</p>'],
   etna:['El Etna','el volcán de Sicilia','<p>El Etna echa humo casi siempre. Ovidio cuenta que debajo de Sicilia está aplastado el gigante Tifeo, que lucha por levantarse: el Etna pesa sobre su cabeza y por su boca escupe fuego (Metamorfosis V 346-358). Otros decían que allí estaba la fragua de Vulcano. Y se contaba que el filósofo Empédocles se arrojó a su cráter para que lo creyeran un dios, pero el volcán devolvió una de sus sandalias de bronce (Diógenes Laercio VIII 69).</p>'],
   siracusa:['Siracusa','la ciudad de Arquímedes','<p>Cuando Marcelo sitió Siracusa en el 213-212 a.C., Arquímedes la defendió con máquinas que levantaban los barcos romanos con garfios y los volcaban (Tito Livio XXIV 34). Al tomar la ciudad, un soldado lo mató mientras dibujaba figuras en el polvo, contra las órdenes de Marcelo (Livio XXV 31). Más de un siglo después, Cicerón, cuestor en Sicilia, encontró su tumba olvidada entre zarzas, reconocible por una esfera y un cilindro esculpidos (Tusculanas V 64-66).</p>'],
   melita:['Melita','la isla de la miel','<p>Melita, la Malta de hoy, es famosa por su miel (de ahí, quizá, su nombre), por sus finos tejidos y por sus perritos falderos, que las damas romanas llevan en brazos (Diodoro V 12; Estrabón VI 2.11). Los Hechos de los Apóstoles cuentan que Pablo de Tarso naufragó aquí, hacia el año 60, cuando lo llevaban preso a Roma.</p>'],
   corintoR:['Corinto','destruida y refundada','<p>En el 146 a.C., el cónsul Mumio arrasó Corinto y mandó a Roma sus estatuas y pinturas (Pausanias VII 16.7-10). Un siglo después, Julio César la refundó como colonia romana, y hoy es la capital de la provincia de Acaya (Estrabón VIII 6.23). Hace solo trece años, en el 67, Nerón empezó a cortar el Istmo con un canal: dio el primer golpe con una pala de oro, pero la obra se abandonó (Suetonio, Nerón 19).</p>'],
   atenasR:['Atenas','la ciudad de los estudiantes','<p>Sila tomó y saqueó Atenas en el 86 a.C. (Plutarco, Sila 14), pero Roma la respetó como ciudad libre por su pasado. Hoy es sobre todo una ciudad de escuelas: los jóvenes romanos ricos van a estudiar filosofía y retórica, como hizo Cicerón y como cuenta Horacio, que estudió en «la Academia» (Epístolas II 2.43-45). Augusto le regaló un nuevo mercado, el Ágora romana.</p>'],
   delosR:['Delos','de gran mercado a ruina','<p>Hace doscientos años, Delos era el gran mercado de esclavos del Mediterráneo: Estrabón dice que en un día podían venderse diez mil (XIV 5.2). En el 88 a.C. la saquearon los soldados de Mitrídates, y en el 69 a.C., los piratas. Desde entonces está casi vacía: Pausanias dirá que, sin los guardianes del santuario, no viviría nadie (VIII 33.2).</p>'],
   rodas:['Rodas','el Coloso caído','<p>El Coloso, la gran estatua de bronce del Sol, una de las maravillas del mundo, cayó por un terremoto hacia el 226 a.C. y sigue en el suelo. Plinio cuenta que pocos pueden abrazar su pulgar y que sus dedos son más grandes que muchas estatuas (Historia natural XXXIV 41). Rodas tiene además una famosa escuela de retórica: allí estudió Cicerón (Bruto 316), y allí se retiró Tiberio varios años (Suetonio, Tiberio 11).</p>'],
   efesoR:['Éfeso','la capital de Asia','<p>Éfeso es la capital de la provincia de Asia y uno de los puertos más ricos del Imperio. Su templo de Ártemis, una de las maravillas del mundo, se reconstruyó después de que Eróstrato lo incendiara para hacerse famoso (Estrabón XIV 1.22). Los Hechos de los Apóstoles cuentan que los plateros que vendían figuritas del templo organizaron un tumulto contra Pablo al grito de «¡Grande es la Ártemis de los efesios!».</p>'],
   helesponto:['Hacia el Ponto','el camino del norte','<p>Al norte del Egeo, el Helesponto y el Bósforo llevan al Ponto Euxino, el mar Negro. Por aquí bajan los barcos de trigo y de pescado salado, y por aquí pasaron Jerjes, Alejandro y los Argonautas.</p>'],
   cesarea:['Cesarea Marítima','el puerto de Herodes','<p>Herodes el Grande construyó aquí, en una costa sin abrigo, un puerto artificial en mar abierto: echó al agua enormes bloques y creó un muelle con torres y almacenes, y llamó a la ciudad Cesarea, en honor de Augusto (Flavio Josefo, Guerra de los judíos I 408-415; Antigüedades XV 331-341). Hoy es la capital de la provincia de Judea.</p>'],
   tiro:['Tiro y Sidón','la púrpura y el vidrio','<p>Tiro y Sidón, las viejas ciudades fenicias, son famosas por la púrpura, el tinte más caro del mundo: se saca de un caracol de mar, el múrice, y hacen falta miles para teñir un manto; el olor de los talleres es terrible (Plinio, Historia natural IX 124-141). Sidón es famosa también por su vidrio soplado (Plinio XXXVI 190-193).</p>'],
   jerusalen:['Jerusalén','hace diez años','<p>En el 66 los judíos se rebelaron contra Roma. Vespasiano dirigió la guerra hasta que fue proclamado emperador, y su hijo Tito, el emperador de ahora, tomó Jerusalén en el año 70 tras un largo asedio: el Templo ardió y la ciudad fue destruida (Flavio Josefo, Guerra de los judíos VI). En el 71, Tito y Vespasiano celebraron en Roma un triunfo con el candelabro de siete brazos y la mesa de oro del Templo, que hoy se guardan en el Templo de la Paz (Josefo, Guerra VII 123-162).</p><p class="src">Anacronismo señalado: el Arco de Tito, que muestra ese botín, se levantará después de su muerte, en el 81.</p>'],
   chipre:['Chipre','la isla del cobre y de Venus','<p>De Chipre viene tanto cobre que los romanos lo llaman <i>aes Cyprium</i>, «bronce de Chipre», y de ahí viene la palabra cobre (Plinio XXXIV 2). En Pafos, Venus nació de la espuma del mar (Hesíodo, Teogonía 188-200). Tácito cuenta que Tito, de camino a la guerra de Judea en el 69, se detuvo a consultar el oráculo de su templo (Historias II 2-3).</p>'],
   mareas:['Las mareas','el mar que respira','<p>En el Mediterráneo apenas hay mareas, y los romanos se asombraban al ver el Océano subir y bajar dos veces al día. Posidonio fue a Gades a estudiarlas (Estrabón III 5.8-9), y Plinio explica que las causa la Luna (Historia natural II 212-218). César cuenta que una marea alta destrozó sus barcos en Britania porque nadie la esperaba (Guerra de las Galias IV 29).</p>'],
   casiterides:['Las Casitérides','las islas del estaño','<p>En algún lugar al noroeste estaban las Casitérides, las islas del estaño, un metal imprescindible para hacer bronce. Los fenicios de Gades guardaban el secreto de la ruta: Estrabón cuenta que un capitán, al ver que un barco romano lo seguía, encalló su propia nave a propósito para no revelar el camino, y su ciudad le pagó la carga perdida (III 5.11). Heródoto ni siquiera estaba seguro de que existieran (III 115).</p>'],
   britania:['Hacia Britania','la conquista de ahora','<p>Claudio empezó la conquista de Britania en el 43 (Suetonio, Claudio 17). Hace veinte años se rebeló la reina Boudica (Tácito, Anales XIV 31-37). Ahora, en el 80, el gobernador Agrícola avanza hacia el norte y llega este año hasta el estuario del río Taus, en Caledonia (Tácito, Agrícola 22).</p><p class="src">Anacronismo señalado: Tácito, yerno de Agrícola, escribirá su biografía en el 98.</p>'],
   afortunadas:['Las Islas Afortunadas','al fin del mundo','<p>Más allá de Gades, en el Océano, están las Islas Afortunadas, las Canarias de hoy. El rey Juba de Mauretania envió una expedición: una de las islas se llamaba Canaria por sus perros enormes, y le trajeron dos (Plinio, Historia natural VI 202-205). Muchos situaban por aquí, en el extremo de occidente, el jardín de las Hespérides.</p>'],
   bosforoR:['El Bósforo','la puerta del Ponto','<p>El Bósforo une el Ponto con la Propóntide y, por el Helesponto, con el Egeo. Bizancio, que vigila el paso, es ahora una ciudad aliada de Roma. Por aquí bajan cada año los barcos cargados de trigo, pescado salado y esclavos del mar Negro.</p>'],
   tomis:['Tomis','el destierro de Ovidio','<p>En el año 8, Augusto desterró al poeta Ovidio a Tomis, en la costa helada del Ponto, por «un poema y un error» que nunca explicó. Ovidio escribió aquí las <i>Tristes</i> y las <i>Cartas del Ponto</i>: se queja del frío, de las flechas de los getas y de que el vino se congela y conserva la forma de la jarra (Tristes III 10.23-24). Murió aquí hacia el año 17, sin volver a Roma.</p>'],
   mitridates:['Mitrídates','el rey del Ponto','<p>Mitrídates VI, rey del Ponto, fue el enemigo más tenaz de Roma: en el 88 a.C. mandó matar en un solo día a decenas de miles de romanos e italianos en Asia (Apiano, Guerras mitridáticas 22-23). Plinio cuenta que tomaba cada día pequeñas dosis de veneno para hacerse inmune, y que inventó un antídoto que lleva su nombre (Historia natural XXV 5-7). Pompeyo lo venció por fin en el 63 a.C.</p>'],
   pontica:['La flota del Ponto','Roma en el mar Negro','<p>Desde hace pocos años, Roma tiene en el mar Negro su propia flota, la <i>classis Pontica</i>, con base en Trapezunte (Tácito, Historias III 47). Al norte, el reino del Bósforo Cimerio es un aliado de Roma: sus reyes reciben el título de amigos del pueblo romano y envían trigo.</p>'],
   brucio:['La punta de Italia','el Brucio','<p>La punta de la «bota» de Italia es el Brucio, tierra de bosques de pinos para la brea de los barcos. Al doblarla se pasa por las viejas ciudades griegas de la costa: Locros y Crotón. Para ir de Roma a Grecia por mar hay que rodearla, salvo que se baje por tierra hasta Brundisium.</p>'],
   pitagoras:['Crotón','la ciudad de Pitágoras','<p>En Crotón, colonia griega, se instaló hacia el 530 a.C. Pitágoras de Samos, y allí fundó su comunidad de discípulos, que no comían carne y estudiaban los números y la armonía. Ovidio le da la palabra en el último libro de las <i>Metamorfosis</i>: Pitágoras explica que todo cambia y nada muere, y que por eso no hay que comer animales (Metamorfosis XV 60-478). De Crotón era también Milón, el luchador más famoso de Grecia (Estrabón VI 1.12).</p>'],
   otranto:['El canal de Otranto','el paso a Grecia','<p>Aquí Italia y Grecia están más cerca que en ningún otro sitio: unos setenta kilómetros de mar. Plinio cuenta que el rey Pirro y, después, Varrón pensaron unirlas con un puente de barcos, aunque nunca se hizo (Historia natural III 100-101). Por aquí pasan los barcos de Brundisium a Dyrrachium y Apolonia.</p>'],
   brundisium:['Brundisium','el final de la Vía Apia','<p>Brundisium es el gran puerto hacia Grecia y Oriente, al final de la Vía Apia. Horacio contó con mucha gracia su viaje desde Roma hasta aquí, con posadas llenas de mosquitos y ranas que no le dejaban dormir (Sátiras I 5). Y aquí murió Virgilio en el 19 a.C., al volver enfermo de Grecia, según su biografía antigua.</p>'],
   rubicon:['El Rubicón','la frontera que no se podía cruzar','<p>Este riachuelo marcaba la frontera entre la Galia Cisalpina e Italia: un general no podía cruzarlo con su ejército. En enero del 49 a.C., Julio César se detuvo en su orilla, dudó y, según Suetonio, dijo «<i>Iacta alea est</i>», «la suerte está echada»; Plutarco dice que lo dijo en griego. Lo cruzó y empezó la guerra civil (Suetonio, César 31-33).</p><p>Por eso, todavía hoy, «cruzar el Rubicón» significa tomar una decisión sin vuelta atrás.</p>'],
   ravenna:['Ravenna','la flota del Adriático','<p>Augusto instaló dos flotas para vigilar Italia: una en Miseno, para el mar de abajo, y otra en Ravenna, para el de arriba (Suetonio, Augusto 49; Tácito, Anales IV 5). Estrabón cuenta que Ravenna está construida sobre pilotes entre lagunas, y que se va por ella en barca y por puentes, como más tarde se hará en Venecia (V 1.7).</p>'],
   faeton:['El Erídano','Faetonte y el ámbar','<p>Faetonte, hijo del Sol, convenció a su padre de que le dejara conducir su carro. Perdió el control, incendió la tierra y Júpiter lo derribó con un rayo: cayó en el río Erídano, que los antiguos identificaban con el Po. Sus hermanas, las Helíades, lloraron tanto que se convirtieron en álamos, y sus lágrimas se endurecieron en ámbar (Ovidio, Metamorfosis II 319-366).</p><p>Plinio se burla de esa historia: el ámbar viene del Océano del norte, de las costas de Germania (Historia natural XXXVII 31-42). Tenía razón: viene del Báltico.</p>'],
   diomedes:['Las aves de Diomedes','las islas de Diomedes','<p>Diomedes, uno de los héroes de Troya, acabó sus días en Apulia. Sus compañeros fueron convertidos en aves por Venus, a la que Diomedes había herido en la guerra (Ovidio, Metamorfosis XIV 483-511; Virgilio, Eneida XI 271-274). Plinio cuenta que esas aves viven en estas islas, reciben con alegría a los griegos y atacan a los demás (Historia natural X 126-127).</p>'],
   superum:['El mar de arriba','por qué se llama Adriático','<p>Los romanos llamaban a este mar el <i>mare Superum</i>, «el mar de arriba», y al Tirreno, el <i>mare Inferum</i>, «el de abajo». Su otro nombre, Adriático, viene de Atria, una ciudad etrusca cerca de las bocas del Po que dio nombre al mar (Tito Livio V 33.7-8).</p><p>En invierno, el viento del nordeste lo vuelve peligroso: Horacio lo llama el Adriático «más bravo» (Odas III 9).</p>'],
   antenor:['Antenor','el troyano que fundó Patavium','<p>Tito Livio empieza su historia de Roma contando que, tras la caída de Troya, el troyano Antenor llegó al fondo del Adriático con los énetos y fundó allí la ciudad de Patavium, la Padua de hoy (I 1.1-3). Virgilio también lo recuerda (Eneida I 242-249). Livio, por cierto, era de Patavium.</p>'],
   circe:['El monte Circeo','el promontorio de Circe','<p>Los romanos creían que este promontorio, que parece una isla vista desde el mar, era Eea, la isla de la hechicera Circe, que convirtió en cerdos a los compañeros de Ulises (Odisea X 133-574). Plinio dice que de verdad había sido una isla (Historia natural III 57). Virgilio cuenta que la flota de Eneas pasó de noche junto a sus costas y oyó rugir a los leones y gruñir a los jabalíes encerrados por Circe (Eneida VII 10-24).</p>'],
   piratas:['Los piratas tirrenos','el mar de los etruscos','<p>Los griegos llamaban «tirrenos» a los etruscos, y a este mar, el mar Tirreno. Heródoto cuenta que venían de Lidia, en Asia (I 94). Tenían fama de piratas: un himno homérico cuenta que unos piratas tirrenos raptaron a un joven sin saber que era Dioniso. En el barco brotó una parra que trepó por el mástil, el dios se convirtió en león, y los marineros, aterrados, saltaron al agua y se convirtieron en delfines (Himno homérico a Dioniso; Ovidio, Metamorfosis III 582-691).</p><p>Por eso, dicen, los delfines siguen a los barcos.</p>'],
   ilva:['Ilva','la isla del hierro','<p>Ilva, la Elba de hoy, tiene minas de hierro que ya explotaban los etruscos; el mineral se fundía en Populonia, enfrente, en la costa (Estrabón V 2.6). Los griegos la llamaban Etalia, «la tiznada», por el humo de sus hornos (Diodoro V 13). Apolonio cuenta que los Argonautas pararon aquí y que los guijarros de la playa conservan el color de su sudor (Argonáuticas IV 654-658).</p>'],
   marmol:['El mármol de Luna','el blanco de Roma','<p>De las montañas que hay sobre Luna se saca un mármol blanquísimo, que Plinio compara con el de Paros (Historia natural XXXVI 14 y 48). Desde Augusto, que presumía de haber encontrado una Roma de ladrillo y haberla dejado de mármol (Suetonio, Augusto 28), los bloques bajan en barcos desde el puerto de Luna, uno de los más grandes y hermosos de Italia según Estrabón (V 2.5). Hoy esas canteras se llaman de Carrara.</p>'],
   miseno:['El cabo Miseno','la flota y la muerte de Plinio','<p>En Miseno está la base de la flota del Tirreno, fundada por Augusto. Hace un año, cuando estalló el Vesubio, su almirante era Plinio el Viejo, el autor de la Historia natural. Vio la nube con forma de pino, mandó salir las naves para rescatar a la gente de la costa y murió en Estabias, ahogado por los gases y la ceniza. Su sobrino, Plinio el Joven, lo contó en dos cartas al historiador Tácito (Cartas VI 16 y 20).</p><p>El cabo debe su nombre a Miseno, el trompetero de Eneas (Eneida VI 162-235).</p>'],
   pompeya:['Pompeya y Herculano','bajo la ceniza','<p>Hace solo un año, en el 79 (la fecha exacta se discute: agosto u octubre), el Vesubio entró en erupción. Pompeya quedó enterrada bajo metros de ceniza y piedra pómez; Herculano y Estabias, bajo los flujos de gas y roca ardiente. El emperador Tito, que reina ahora, nombró a dos antiguos cónsules para ayudar a la región y usó los bienes de los muertos sin herederos para reconstruir las ciudades (Suetonio, Tito 8.3-4).</p><p class="src">Anacronismo señalado: las excavaciones de Pompeya empezaron en 1748.</p>'],
   capri:['Capreae','la isla de Tiberio','<p>A Augusto le gustaba tanto esta isla que se la cambió a los napolitanos por la de Enaria (Suetonio, Augusto 92). Tiberio pasó en ella sus últimos diez años, entre doce villas, sin volver a Roma; desde aquí gobernaba el Imperio por carta (Suetonio, Tiberio 40-43; Tácito, Anales IV 67).</p>'],
   sirenas:['Las Sirenusas','las islas de las sirenas','<p>Frente a la península de Sorrento, tres islotes rocosos: las Sirenusas. Los romanos situaban aquí a las sirenas que intentaron atraer a Ulises con su canto, y en el cabo cercano había un templo dedicado a ellas (Estrabón I 2.12 y V 4.8; Odisea XII 39-54 y 158-200).</p><p>Si has soñado el sueño de Ulises en un viaje en barco, ya sabes cómo acaba.</p>'],
   eolo:['Eolo','el señor de los vientos','<p>En la <i>Odisea</i>, Eolo vive en una isla flotante rodeada por una muralla de bronce. Regaló a Ulises un odre de cuero con todos los vientos contrarios encerrados; cuando ya se veía Ítaca, los compañeros lo abrieron creyendo que era oro, y la tempestad los devolvió a la isla (Odisea X 1-79). Virgilio lo pone en una gran cueva, sujetando a los vientos con cadenas (Eneida I 50-63). Los antiguos situaban su reino en estas islas, que por eso se llaman Eolias.</p>'],
   vulcano:['Hiera','la fragua de Vulcano','<p>Junto a Lipara hay una isla que echa humo y fuego: los griegos la llamaban Hiera, «la sagrada», y los romanos, Vulcano. Tucídides cuenta que sus habitantes creían que allí tenía Hefesto su fragua, porque de noche se ve el fuego y de día el humo (III 88). Virgilio dice que en sus cuevas los cíclopes forjan los rayos de Júpiter y las armas de Eneas (Eneida VIII 416-453).</p>'],
   strongyle:['Strongyle','«la redonda»','<p>Strongyle, «la redonda» (el Estrómboli de hoy), es un volcán en forma de cono que siempre está activo: de noche se ven sus llamaradas desde el mar, y sirve de faro a los marineros. Estrabón dice que algunos colocaban aquí la morada de Eolo, y que los isleños predecían los vientos mirando su humo (VI 2.10-11).</p>'],
   portus:['El faro del Puerto de Claudio','sobre la nave del obelisco','<p>Ostia, en la desembocadura del Tíber, se llenaba de arena y los grandes barcos de grano no podían entrar. Claudio construyó un puerto nuevo al norte, con dos grandes muelles y un faro. Para la base del faro hundió, llena de hormigón, la enorme nave que había traído de Egipto el obelisco de Calígula (Suetonio, Claudio 20; Plinio, Historia natural XVI 201-202).</p>'],
   escila:['La roca de Escila','en la orilla de Italia','<p>En la <i>Odisea</i>, Escila vive en una cueva en lo alto de un acantilado: tiene doce pies y seis cuellos larguísimos, cada uno con una cabeza de tres filas de dientes, y arrebata a seis compañeros de Ulises (Odisea XII 73-100 y 234-259). Ovidio cuenta que había sido una ninfa, convertida en monstruo por Circe, y que al final se convirtió en roca (Metamorfosis XIV 1-74).</p>'],
   caribdis:['Caribdis','el remolino','<p>Frente a Escila, al alcance de una flecha, bajo una gran higuera, Caribdis sorbe el agua negra del mar tres veces al día y tres veces la devuelve. Ni el propio Poseidón podría salvar a quien estuviera allí cuando sorbe (Odisea XII 101-110). En el estrecho de Mesina hay corrientes fuertes de verdad, que quizá dieron origen al mito. Si te acercas demasiado, te arrastra.</p>'],
   faro:['El Faro de Alejandría','una de las maravillas del mundo','<p>En la isla de Faros, a la entrada del puerto, Sóstrato de Cnido levantó para los Ptolomeos una torre de mármol blanco de varios pisos, con un fuego en lo alto para guiar a los barcos de noche (Estrabón XVII 1.6; Plinio, Historia natural XXXVI 83). Era tan famosa que «faro» viene de su nombre.</p>'],
   columnas:['Las Columnas de Hércules','el fin del mundo conocido','<p>Los dos montes que cierran el estrecho, Calpe en Europa y Abila en África, eran las Columnas de Hércules: según el mito, las puso el héroe al llegar al extremo de occidente en su décimo trabajo, cuando fue a buscar los bueyes de Gerión. Más allá empezaba el Océano (Estrabón III 5.5; Plinio, Historia natural III 3-4).</p>']}}
};
function swD(){return SWD[MODE];}
function swz(){if(!state.sw||typeof state.sw!=='object')state.sw={at:'atenas',m:0,it:{},went:0,owner:0,mine:0};const z=state.sw;z.it=z.it||{};z.at=z.at||'atenas';return z;}
function swSeaY(){return SEA?SEA.position.y:-2.2;}
function swSegZ(id){return SW.Z0-swD().segs[id].k*SW.DZ;}
function swIn(){return !!(swD()&&SW.X&&Math.abs(player.x-SW.X)<SW.H+400&&player.z<SW.Z0+SW.H+400);}
function swSegAt(){if(!swIn())return null;const S=swD().segs;for(const id in S)if(Math.abs(player.z-swSegZ(id))<SW.DZ/2)return id;return null;}
// el punto de agua más cercano a un puerto, para amarrar la barca
function swMoorOf(id){if(id in SW.moor)return SW.moor[id];const P=PORTS[id];if(!P)return SW.moor[id]=null;const sy=swSeaY();let best=null;
  for(let r=4;r<=420&&!best;r+=r<170?3:8){const n=Math.max(8,Math.round(r*0.8));for(let k=0;k<n;k++){const a=k/n*TAU,x=P.x+Math.cos(a)*r,z=P.z+Math.sin(a)*r;if(terrainH(x,z)<sy-1.3&&terrainH(x+Math.cos(a)*4,z+Math.sin(a)*4)<sy-1.3&&isFree(x,z,3.5)){best={x,z,a,land:{x:P.x+Math.cos(a)*Math.max(0,r-6),z:P.z+Math.sin(a)*Math.max(0,r-6)}};break;}}}
  return SW.moor[id]=best;}
function swFaro(x,y,z,h){const g=grp(x,y,z,0),w=lam('#efe9dc');const a=h*0.5,b=h*0.3,c=h*0.2;box(a*0.36,a,a*0.36,w,0,a/2,0,g);const o=new THREE.Mesh(new THREE.CylinderGeometry(a*0.13,a*0.15,b,8),w);o.position.y=a+b/2;g.add(o);const t=new THREE.Mesh(new THREE.CylinderGeometry(a*0.08,a*0.09,c,12),w);t.position.y=a+b+c/2;g.add(t);
  const f=new THREE.Mesh(new THREE.SphereGeometry(a*0.07,10,8),new THREE.MeshBasicMaterial({color:'#ffb040'}));f.position.y=h+a*0.05;g.add(f);return g;}
function swBuild(){if(SW.built)return;SW.built=true;const D=swD(),sy=swSeaY(),sand=lam('#b8a57a'),grass=lam('#5f7a3e'),rockM=lam('#7d766c');
  for(const id in D.segs){const S=D.segs[id],cz=swSegZ(id);
    const bed=new THREE.Mesh(new THREE.PlaneGeometry(SW.H*2+200,SW.H*2+200,1,1),sand);bed.rotation.x=-Math.PI/2;bed.position.set(SW.X,SW.BED,cz);scene.add(bed);
    const r=mulberry32(40+S.k);
    for(let i=0;i<70;i++){const x=SW.X+(r()-0.5)*SW.H*2,z=cz+(r()-0.5)*SW.H*2;if(r()<0.5){const m=new THREE.Mesh(new THREE.DodecahedronGeometry(1+r()*3,0),rockM);m.position.set(x,SW.BED+0.5,z);m.rotation.set(r()*3,r()*3,r()*3);scene.add(m);}
      else for(let j=0;j<5;j++){const b=box(0.25,2+r()*3,0.08,grass,0,0,0);b.position.set(x+(r()-0.5)*2,SW.BED+1.4,z+(r()-0.5)*2);b.rotation.y=r()*3;b.rotation.z=(r()-0.5)*0.4;}}   // posidonia
    for(const I of S.isl){const g=new THREE.Mesh(I.rock?new THREE.DodecahedronGeometry(1,0):new THREE.SphereGeometry(1,32,12,0,TAU,0,Math.PI/2),lam(I.rock?'#5c564c':I.col||'#6c6242'));g.scale.set(I.rx,I.h,I.rz);g.position.set(SW.X+I.x,sy-1.5,cz+I.z);if(I.rock)g.rotation.y=0.7;scene.add(g);
      const be=new THREE.Mesh(new THREE.CylinderGeometry(1.03,1.06,1,32,1),lam('#cdb98a'));be.scale.set(I.rx,1.2,I.rz);be.position.set(SW.X+I.x,sy-0.45,cz+I.z);scene.add(be);
      if(!I.rock&&!I.flat){const rr=mulberry32(I.rx*7+I.rz),hAt=(u,v)=>sy-1.5+I.h*Math.sqrt(Math.max(0,1-u*u-v*v));
        // montes y matorral
        const pk=new THREE.Mesh(new THREE.ConeGeometry(Math.min(I.rx,I.rz)*0.55,I.h*(I.big?1.6:0.9),9,1),lam('#7d6f4c'));pk.position.set(SW.X+I.x+I.rx*0.15,sy-1.5+I.h+I.h*(I.big?0.6:0.3),cz+I.z);scene.add(pk);
        if(I.smoke){const sm=new THREE.MeshLambertMaterial({color:'#8a8682',transparent:true,opacity:0.5,depthWrite:false});for(let k=0;k<10;k++){const m=new THREE.Mesh(new THREE.SphereGeometry(6+k*1.2,8,6),sm.clone());const y0=sy-1.5+I.h*1.6;m.position.set(SW.X+I.x+I.rx*0.15,y0,cz+I.z);scene.add(m);SW.smoke.push({m,seg:id,y0,ph:k/10,x:SW.X+I.x+I.rx*0.15,z:cz+I.z});}}
        if(I.big)for(const dx of[-0.45,0.5]){const c=new THREE.Mesh(new THREE.ConeGeometry(I.rz*0.6,I.h*0.9,8,1),lam('#7d6f4c'));c.position.set(SW.X+I.x+I.rx*dx,sy-1.5+I.h*0.9,cz+I.z);scene.add(c);}
        for(let k=0;k<Math.min(160,(I.rx*I.rz)/90);k++){const u=(rr()*2-1)*0.92,v=(rr()*2-1)*0.92;if(u*u+v*v>0.85)continue;const sh=new THREE.Mesh(new THREE.SphereGeometry(1.6+rr()*2.4,6,4),lam(rr()<0.5?'#55682f':'#4a5a2a'));sh.scale.y=0.6;sh.position.set(SW.X+I.x+u*I.rx,hAt(u,v)+0.6,cz+I.z+v*I.rz);scene.add(sh);}
        // pueblo y muelle en la orilla que mira al centro del tramo (solo donde se desembarca)
        if(I.id){const dx=-I.x,dz=-I.z,l=Math.hypot(dx,dz)||1,ux=dx/l,uz=dz/l,e=1/Math.sqrt((ux/I.rx)**2+(uz/I.rz)**2),ex=I.x+ux*e,ez=I.z+uz*e,ang=Math.atan2(ux,uz);
          const pier=box(3,0.6,22,lam('#8a6a4a'),0,0,0);pier.position.set(SW.X+ex+ux*8,sy+0.3,cz+ez+uz*8);pier.rotation.y=ang;
          const nh=I.town?34:9;if(I.town){const mo=box(220,2.6,7,lam('#9a8f80'),0,0,0);mo.position.set(SW.X+ex+ux*12,sy+0.6,cz+ez+uz*12);mo.rotation.y=ang;}
          for(let k=0;k<nh;k++){const t=(k-nh/2)*(I.town?12:9),dd=14+rr()*16,hx=ex-ux*dd+uz*t,hz=ez-uz*dd-ux*t;const u2=(hx-I.x)/I.rx,v2=(hz-I.z)/I.rz;const hb=box(5+rr()*4,3.5+rr()*2,5+rr()*4,lam(MODE==='roma'?(rr()<0.5?'#e3c9a0':'#d8b48a'):(rr()<0.6?'#efe8da':'#e2d6be')),0,0,0);hb.position.set(SW.X+hx,hAt(u2,v2)+1.8,cz+hz);hb.rotation.y=ang;}}}
      if(!I.rock){const lb=labelSprite(I.name,I.sub||'',false);lb.userData.swSeg=id;SW.labels.push(lb);lb.position.set(SW.X+I.x,sy+I.h+14,cz+I.z+(I.z<-200?I.rz*0.7:I.z>200?-I.rz*0.7:0)+(Math.abs(I.x)>300&&Math.abs(I.z)<200?0:0));if(Math.abs(I.x)>300)lb.position.x-=Math.sign(I.x)*I.rx*0.7;lb.scale.multiplyScalar(2.2);scene.add(lb);}
      // la divinidad que informa, sentada en su roca: barba y cola de pez
      if(I.giver){const G=D.giver,x=SW.X+I.x,z=cz+I.z,gp=makePerson(G.look);gp.position.set(x,sy+I.h-0.6,z);gp.rotation.y=Math.PI*0.8;scene.add(gp);
        const tail=new THREE.Mesh(new THREE.ConeGeometry(0.42,2.6,8),lam(G.tail));tail.rotation.x=Math.PI/2;tail.position.set(x+0.4,sy+I.h-0.2,z+1.3);scene.add(tail);
        const fin=box(1.4,0.08,0.7,lam(G.tail),0,0,0);fin.position.set(x+0.4,sy+I.h-0.2,z+2.7);
        SW.giverObj=egxObj(x,z,sy+I.h-0.6,'sw:giver',G.name,G.sub,14);SW.objs.push(SW.giverObj);}}
    // decorados: faros, Escila, Caribdis y puntos con explicación
    for(const d of S.deco||[]){const x=SW.X+d.x,z=cz+d.z,inf=D.info[d.info];
      if(d.t==='faro'){swFaro(x,sy+(d.h>60?4:2),z,d.h);box(26,6,26,lam('#9a8f80'),0,0,0).position.set(x,sy+1,z);}
      if(d.t==='escila'){const c=new THREE.Mesh(new THREE.ConeGeometry(55,90,7,1),lam('#5a544a'));c.position.set(x+40,sy+40,z);scene.add(c);box(10,8,2,lam('#1a1612'),0,0,0).position.set(x+12,sy+55,z);}
      if(d.t==='plumas'){const fm=lam('#f4efe4',{side:THREE.DoubleSide});for(let k=0;k<26;k++){const f=new THREE.Mesh(new THREE.PlaneGeometry(0.25,0.9),fm);f.rotation.x=-Math.PI/2;f.rotation.z=Math.random()*TAU;f.position.set(x+(Math.random()-0.5)*16,sy+0.05,z+(Math.random()-0.5)*16);scene.add(f);}}
      if(d.t==='remolino'){for(let k=0;k<4;k++){const t=new THREE.Mesh(new THREE.TorusGeometry(d.r*(0.25+k*0.22),1.2,6,40),new THREE.MeshBasicMaterial({color:k%2?'#1d4a5c':'#2a6478',transparent:true,opacity:0.75}));t.rotation.x=Math.PI/2;t.position.set(x,sy+0.08,z);scene.add(t);SW.spin.push({m:t,v:0.6+k*0.25});}}
      if(inf){const o=egxObj(x,z,sy,'sw:info:'+d.info,inf[0],inf[1],d.t==='remolino'?d.r+30:d.t==='faro'?45:d.t==='escila'?90:d.t==='plumas'?25:60);o.seg=id;o.go=d.go;o.goT=d.goT;o.goMsg=d.goMsg;SW.info.push(o);SW.objs.push(o);if(d.t==='remolino')SW.whirl={seg:id,x,z,r:d.r};
        if(d.t!=='remolino'&&d.t!=='punto'&&d.t!=='plumas'){}else{const lb=labelSprite(inf[0],inf[1],false);lb.userData.swSeg=id;SW.labels.push(lb);lb.position.set(x,sy+14,z);lb.scale.multiplyScalar(1.6);scene.add(lb);}}}
    // pecio con ánforas
    if(S.wreck){const x=SW.X+S.wreck.x,z=cz+S.wreck.z,wood=lam('#4a3826'),am=lam('#b0643c');const g=grp(x,SW.BED+0.6,z,0.6);box(5,1.2,16,wood,0,0,0,g);for(let i=0;i<18;i++){const a=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.12,1.1,8),am);a.position.set((i%3-1)*1.3,0.9,-6+Math.floor(i/3)*2);a.rotation.z=1.2;g.add(a);}
      SW.objs.push(egxObj(x,z,SW.BED+1,'sw:pecio','Un pecio','un barco mercante hundido con su carga',8));}
    // costas lejanas en el horizonte (solo se ven en su tramo)
    for(let i=0;i<14;i++){const a=r()*TAU,d=2600+r()*900,h=90+r()*200;const m=new THREE.Mesh(new THREE.ConeGeometry(380+r()*420,h,9,1),new THREE.MeshLambertMaterial({color:'#9fb0b8',fog:false}));m.position.set(SW.X+Math.cos(a)*d,sy+h/2-30,cz+Math.sin(a)*d);m.userData.swSeg=id;m.visible=false;SW.labels.push(m);scene.add(m);}
    // delfines
    for(let i=0;i<4;i++){const d=new THREE.Group(),bm=lam('#5d6870');const b=new THREE.Mesh(new THREE.SphereGeometry(0.45,10,8),bm);b.scale.set(1,1,4);d.add(b);const f=new THREE.Mesh(new THREE.ConeGeometry(0.25,0.7,4),bm);f.position.set(0,0.55,-0.2);d.add(f);box(1.1,0.08,0.4,bm,0,0,-1.8,d);
      d.visible=false;scene.add(d);SW.dol.push({g:d,seg:id,t:r()*8,ph:0,x:0,z:0,a:0});}}
  // el palacio del dios del mar, en el fondo
  {const P=D.palace,cz=swSegZ(P.seg),x=SW.X+P.x,z=cz+P.z,y=SW.BED,g=grp(x,y,z,0),gold=M.gold,mar=M.marble;
   box(34,2,26,mar,0,1,0,g);box(30,1,22,mar,0,2.5,0,g);
   for(let i=0;i<8;i++)for(const s of[-1,1]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.7,9,12),gold);c.position.set(-13+i*26/7,7.5,s*10);g.add(c);}
   for(let i=1;i<4;i++)for(const s of[-1,1]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.7,9,12),gold);c.position.set(s*13,7.5,-10+i*5);g.add(c);}
   box(30,1.2,23,gold,0,12.6,0,g);const pd=new THREE.Mesh(new THREE.CylinderGeometry(0.01,1,1,3,1),gold);pd.scale.set(12,4,16);pd.rotation.z=Math.PI/2;pd.rotation.y=Math.PI/2;pd.position.set(0,15,0);g.add(pd);
   box(10,4,6,mar,0,5,-4,g);box(3,3.2,2.2,gold,0,4.6,-0.4,g);box(1.6,1.4,1.6,mar,0,3.7,5,g);
   for(const[dx,dz,c]of[[-6,6,'#4f7f9a'],[6,6,'#7a5a8a'],[0,-1,'#8a2a4a']]){const n=makePerson({chiton:c,himation:'#e8e0d0',hair:'#3a2a1e'});n.position.set(x+dx,y+3,z+dz);n.rotation.y=Math.PI;scene.add(n);}
   SW.objs.push(egxObj(x,z+9,y+3,'sw:palacio',P.name,P.sub,12));
   const it=D.items.find(q=>q.where==='palace');if(it){const m=swItemMesh(it.kind);m.position.set(x,y+4.4,z+5);scene.add(m);const o=egxObj(x,z+5,y+3,'sw:it:'+it.key,it.name,it.sub,3.2);o.g=m;SW.items[it.key]=o;SW.objs.push(o);}}
}
function swItemMesh(kind){const g=new THREE.Group(),glow=c=>new THREE.MeshLambertMaterial({color:c,emissive:'#604008'});
  if(kind==='ring'){const r=new THREE.Mesh(new THREE.TorusGeometry(0.32,0.08,10,24),glow('#ffd860'));r.rotation.x=Math.PI/2;r.position.y=0.35;g.add(r);}
  if(kind==='conch'){const c=new THREE.Mesh(new THREE.ConeGeometry(0.35,1.1,10,1,false),new THREE.MeshLambertMaterial({color:'#f2d8c4',emissive:'#40281a'}));c.rotation.z=1.4;c.position.y=0.4;g.add(c);const s=new THREE.Mesh(new THREE.SphereGeometry(0.36,10,8),new THREE.MeshLambertMaterial({color:'#e8b8a0'}));s.position.set(-0.5,0.42,0);g.add(s);}
  if(kind==='nail'){const b=lam('#a8743a');const c=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,1.1,8),b);c.rotation.z=1.3;c.position.y=0.25;g.add(c);const h=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.12,12),b);h.rotation.z=1.3;h.position.set(-0.55,0.37,0);g.add(h);}
  if(kind==='flower'){box(1.2,0.7,1,lam('#8a8378'),0,0.35,0,g);const f=new THREE.Mesh(new THREE.TorusGeometry(0.2,0.06,8,16),glow('#ffd860'));f.position.y=0.8;f.rotation.x=Math.PI/2;g.add(f);}
  if(kind==='bough'){const st=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.06,1.4,6),glow('#c8a040'));st.rotation.z=1.2;st.position.y=0.3;g.add(st);for(let i=0;i<9;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(0.11,6,4),glow('#ffd860'));l.scale.set(1,0.3,2);l.position.set(-0.55+i*0.13,0.18+i*0.04+(i%2)*0.06,(i%2?0.1:-0.1));g.add(l);}}
  if(kind==='hide'){box(0.9,0.45,0.7,lam('#8a8378'),0,0.22,0,g);const r=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.28,0.5,14),lam('#8a5a32'));r.rotation.z=Math.PI/2;r.position.y=0.72;g.add(r);}
  return g;}
// tesoros en tierra, cerca del puerto del destino
function swTreasures(){for(const it of swD().items){if(it.where==='palace')continue;const P=PORTS[it.where];if(!P)continue;
    const f=findFree(P.x+14*Math.cos(P.yaw||0),P.z-14*Math.sin(P.yaw||0),1),g=swItemMesh(it.kind);g.position.set(f[0],floorAt(f[0],f[1]),f[1]);scene.add(g);
    const o=egxObj(f[0],f[1],undefined,'sw:it:'+it.key,it.name,it.sub,3);o.g=g;SW.items[it.key]=o;}
  swTreasureVis();}
function swTreasureVis(){const z=swz();for(const it of swD().items){const o=SW.items[it.key];if(!o)continue;const on=z.m>=1&&z.m<3&&!z.it[it.key];o.g.visible=on||(it.where==='palace'&&!z.it[it.key]);o.r=on?(it.where==='palace'?3.2:3):0;}}
// barca de remos: casco con proa en punta, bancadas y dos remos
function swBoatMesh(){const g=new THREE.Group(),w=lam('#6e4b2c'),sh=new THREE.Shape();sh.moveTo(-0.85,-2.3);sh.lineTo(0.85,-2.3);sh.quadraticCurveTo(1.05,0.6,0,2.7);sh.quadraticCurveTo(-1.05,0.6,-0.85,-2.3);
  const hull=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:0.62,bevelEnabled:false}),w);hull.rotation.x=Math.PI/2;hull.position.y=0.62;g.add(hull);
  const fl=new THREE.Mesh(new THREE.ShapeGeometry(sh),lam('#4a3220',{side:THREE.DoubleSide}));fl.rotation.x=Math.PI/2;fl.scale.set(0.82,0.86,1);fl.position.y=0.64;g.add(fl);
  box(1.6,0.08,0.3,w,0,0.66,-0.3,g);box(1.4,0.08,0.28,w,0,0.66,-1.6,g);
  for(const s of[-1,1]){const oar=new THREE.Group(),om=lam('#8a6a44');box(0.07,0.07,3.2,om,0,0,0.6,oar);box(0.04,0.26,0.7,om,0,0,2.45,oar);oar.position.set(s*0.8,0.68,-0.4);oar.rotation.set(0.3,s*1.87,0,'YXZ');g.add(oar);}   // remo: barra y pala de una pieza, apoyado en la borda
  for(const sd of[-1,1]){const e=new THREE.Mesh(new THREE.CircleGeometry(0.13,12),lam('#f2ece0',{side:THREE.DoubleSide}));e.position.set(sd*0.47,0.42,1.85);e.rotation.y=sd*Math.PI/2+sd*0.35;g.add(e);const pu=new THREE.Mesh(new THREE.CircleGeometry(0.06,10),lam('#1a1410',{side:THREE.DoubleSide}));pu.position.set(sd*0.485,0.42,1.87);pu.rotation.y=e.rotation.y;g.add(pu);}   // ojos de la proa
  scene.add(g);return g;}
// adorno de popa y estatuilla protectora en la barca del jugador
function swBoatDeco(g){const ro=MODE==='roma',w=lam('#6e4b2c');
  if(ro){const c=new THREE.Mesh(new THREE.TorusGeometry(0.35,0.06,6,14,Math.PI*1.3),w);c.position.set(0,1.05,-2.45);c.rotation.y=Math.PI/2;c.rotation.z=-0.4;g.add(c);const hd=new THREE.Mesh(new THREE.SphereGeometry(0.09,8,6),w);hd.position.set(0,1.3,-2.15);g.add(hd);}   // cuello de cisne
  else{for(let i=0;i<5;i++){const f=box(0.05,0.7,0.06,w,(i-2)*0.09,1.05,-2.4,g);f.rotation.z=(i-2)*0.22;}}   // aflaston en abanico
  const st=new THREE.Group();box(0.22,0.14,0.22,lam('#d8ccb0'),0,0.07,0,st);const p=makePerson(ro?{chiton:'#6f8a9a',himation:'#3a5a6a',beard:true,hair:'#d8d4c8'}:{chiton:'#d8ccb0',himation:'#8a7a5a',hair:'#3a2e24'});p.scale.setScalar(0.17);p.position.y=0.14;st.add(p);
  const sp=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,0.42,4),lam(ro?'#c8a040':'#8a7a6a'));sp.position.set(0.07,0.32,0);st.add(sp);
  if(ro)for(const dx of[-0.02,0,0.02]){const t=new THREE.Mesh(new THREE.ConeGeometry(0.01,0.05,4),lam('#c8a040'));t.position.set(0.07+dx,0.55,0);st.add(t);}
  else{const sh=new THREE.Mesh(new THREE.CircleGeometry(0.06,10),lam('#c8a040',{side:THREE.DoubleSide}));sh.position.set(-0.05,0.2,0.04);st.add(sh);}
  st.position.set(0,0.7,-1.6);g.add(st);}
// la barca amarrada en el puerto donde la dejaste
function swPortOf(id){for(const k in swD().segs)for(const I of swD().segs[k].isl)if(I.id===id&&I.port)return I.port;return null;}
function swPlaceBoat(){const z=swz();let m=swMoorOf(z.at);if(!SW.bg){SW.bg=swBoatMesh();swBoatDeco(SW.bg);}
  if(!m&&swPortOf(z.at)&&PORTS[z.at]){SW.bg.visible=false;const P=PORTS[z.at],f=findFree(P.x+6,P.z+6,1),nm=(z.mine?'Tu barca':'La barca')+', en '+swPortOf(z.at);if(!SW.boatObj)SW.boatObj=egxObj(f[0],f[1],undefined,'sw:barca',nm,'bajar al puerto y salir al golfo',5);else Object.assign(SW.boatObj,{x:f[0],z:f[1]});SW.boatObj.data.name=nm;SW.boatObj.lb.position.set(f[0],floorAt(f[0],f[1])+2.8,f[1]);return;}
  if(!m){z.at='atenas';m=swMoorOf('atenas');}if(!m)return;SW.bg.visible=true;SW.bg.position.set(m.x,swSeaY()-0.15,m.z);SW.bg.rotation.set(0,m.a+Math.PI/2,0);
  const O=swD().owner,own=z.mine?'Tu barca':z.owner?'La barca de '+O.name:'Una barca amarrada',sub=z.mine?'subir y remar mar adentro':z.owner?O.name+' te deja usarla':'no hay nadie cerca: ¿de quién será?';
  if(!SW.boatObj){SW.boatObj=egxObj(m.land.x,m.land.z,undefined,'sw:barca',own,sub,5);}else Object.assign(SW.boatObj,{x:m.land.x,z:m.land.z});SW.boatObj.data.name=own;
  SW.boatObj.lb.position.set(m.land.x,floorAt(m.land.x,m.land.z)+2.8,m.land.z);}
function swOwnerSpawn(){if(SW.owner)return;const m=swMoorOf('atenas');if(!m)return;const O=swD().owner,f=findFree(m.land.x+3,m.land.z+3,1);SW.owner=artPerson(f,O.look,'sw:dueno',O.name,O.sub,3);}
function swSetup(){const D=swD();if(!D)return;const L=ISLANDS.find(I=>I.id===D.lane);if(!L)return;
  Object.assign(SW,{X:L.x,built:false,smoke:[],labels:[],objs:[],info:[],dol:[],spin:[],items:{},moor:{},bg:null,boatObj:null,owner:null,giverObj:null,whirl:null,seg:null,swim:false});
  swBuild();swTreasures();swPlaceBoat();if(swz().owner)swOwnerSpawn();
  if(state.pos&&Math.abs(state.pos.x-SW.X)<SW.H+400&&state.pos.z<SW.Z0+SW.H+400){const P=PORTS[swz().at]||PORTS.atenas;player.x=P.x;player.z=P.z;player.feet=floorAt(P.x,P.z);}   // guardado en alta mar: vuelves al puerto
  if(!$('swCSS')){const st=document.createElement('style');st.id='swCSS';st.textContent='#swUw{position:fixed;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 0%,rgba(90,170,200,.25),rgba(10,50,70,.55));opacity:0;transition:opacity .4s;z-index:3}#swUw.on{opacity:1}'+
   '#swHud{position:fixed;left:50%;bottom:calc(96px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:20;text-align:center;color:#f1e8d8;font-size:.9rem;text-shadow:0 1px 3px #000;pointer-events:none;max-width:92vw}#swHud .air{width:160px;height:8px;margin:4px auto 0;background:rgba(255,255,255,.2);border-radius:4px;overflow:hidden}#swHud .air i{display:block;height:100%;background:#8fd8ff}#swHud .dir{font-size:.8rem;opacity:.85}'+
   '#swHud button{pointer-events:auto;margin:4px;padding:8px 14px;border-radius:8px;border:1px solid #c98a4e;background:rgba(24,19,15,.85);color:#f1e8d8;font:inherit}#swFade{position:fixed;inset:0;background:#0b1820;opacity:0;pointer-events:none;transition:opacity .45s;z-index:40}#swFade.on{opacity:1}';document.head.appendChild(st);
   for(const id of['swUw','swHud','swFade']){const d=document.createElement('div');d.id=id;document.body.appendChild(d);}}
}
function swFade(fn){const f=$('swFade');f.classList.add('on');setTimeout(()=>{fn();setTimeout(()=>f.classList.remove('on'),120);},460);}
// subir a la barca
function swBoard(){const z=swz(),m=swMoorOf(z.at);if(!m){const E=swD().entry[z.at];if(!E||!swPortOf(z.at))return;if(MOUNT.riding)dismount();if(MOUNT.g){MOUNT.g.visible=false;MOUNT.st='away';}FLY.on=false;
    return swFade(()=>{Object.assign(BOAT,{on:true,sea:true,g:SW.bg});SW.bg.visible=true;SW.swim=false;SW.depth=0;SW.vx=SW.vz=0;player.feet=swSeaY()+0.4;swEnterSeg(E[0],E[1],E[2]);SW.h=Math.atan2(-E[1],-E[2]);toast('Bajas al puerto de '+swPortOf(z.at)+', subes a la barca y sales al golfo.');});}if(MOUNT.riding)dismount();if(MOUNT.g){MOUNT.g.visible=false;MOUNT.st='away';}FLY.on=false;
  Object.assign(BOAT,{on:true,sea:true,g:SW.bg});SW.seg=null;SW.swim=false;SW.depth=0;SW.vx=SW.vz=0;SW.h=SW.bg.rotation.y;player.x=m.x;player.z=m.z;
  toast('<span class="label">'+(z.mine?'Tu barca':'La barca')+'</span><br><b>W A S D</b>: remar hacia donde miras (Mayús: más fuerte) · sigue la flecha para salir a mar abierto · <b>E</b>: bajar a tierra · <b>Y</b>: ocultar o mostrar las flechas.');boatTick(0);}
function swLeaveBoat(){const z=swz(),m=swMoorOf(z.at);BOAT.on=false;BOAT.sea=false;SW.swim=false;swUnder(false);const L=m?findFree(m.land.x,m.land.z,0.6):[PORTS.atenas.x,PORTS.atenas.z];player.x=L[0];player.z=L[1];player.feet=floorAt(L[0],L[1]);player.vy=0;swPlaceBoat();$('swHud').innerHTML='';}
function swEnterSeg(id,lx,lz,quiet){SW.seg=id;const S=swD().segs[id];player.x=SW.X+lx;player.z=swSegZ(id)+lz;if(SW.bg)SW.bg.position.set(player.x,swSeaY()-0.15,player.z);player.camY=player.feet+player.eye;curZone='sw_'+id;showZone(S.name,S.gr,S.sub);const z=swz();
  if(!z.went){z.went=1;save();if(!quiet)setTimeout(()=>toast('<span class="label">Mar abierto</span><br>En una barca de remos, este viaje llevaría días: el juego lo acorta. Rema hacia las costas para desembarcar; al cruzar el borde del tramo pasas al siguiente. <b>E</b> lejos de la costa: tirarte al agua.'),900);}}
function swLand(id){if(!swMoorOf(id)&&!swPortOf(id)){toast('Aquí no hay un buen sitio para amarrar la barca. Prueba en otro puerto.');return;}
  swFade(()=>{const z=swz(),P=PORTS[id];z.at=id;save();BOAT.on=false;BOAT.sea=false;SW.seg=null;SW.swim=false;swUnder(false);player.x=P.x;player.z=P.z;player.feet=floorAt(P.x,P.z);player.camY=player.feet+player.eye;player.vy=0;player.yaw=P.yaw||0;curZone=null;
  updateSky();if(typeof fxArrive==='function')fxArrive(id);swPlaceBoat();$('swHud').innerHTML='';
  if(id==='atenas'&&z.went&&!z.owner){setTimeout(()=>{z.owner=1;save();swOwnerSpawn();swPlaceBoat();swOwnerTalk(true);},1300);}});}
function swIsleNear(x,z){const S=swD().segs[SW.seg];if(!S)return null;const cz=swSegZ(SW.seg);let best=null;for(const I of S.isl){const e=Math.hypot((x-SW.X-I.x)/I.rx,(z-cz-I.z)/I.rz),d=(e-1)*Math.min(I.rx,I.rz);if(!best||d<best.d)best={I,d};}return best;}
function swNear(o,r){return o&&Math.hypot(player.x-o.x,player.z-o.z)<r;}
// qué hace E ahora mismo
function swAction(){if(!BOAT.sea)return null;const sy=swSeaY();
  if(SW.swim){if(SW.depth<0.6&&Math.hypot(player.x-SW.bg.position.x,player.z-SW.bg.position.z)<5)return['Subir a la barca',()=>{SW.swim=false;SW.depth=0;}];
    for(const k in SW.items){const o=SW.items[k];if(o.y!==undefined&&o.r>0&&Math.hypot(player.x-o.x,player.z-o.z)<4&&player.feet<SW.BED+8)return['Coger: '+o.data.name,()=>egxAct(o)];}
    for(const o of SW.objs)if(o.y!==undefined&&o.y<sy-5&&!String(o.act).startsWith('sw:it:')&&Math.hypot(player.x-o.x,player.z-o.z)<o.r&&player.feet<o.y+10)return['Mirar: '+o.data.name,()=>egxAct(o)];
    return null;}
  if(!SW.seg)return['Bajar a tierra',swLeaveBoat];
  if(SW.giverObj&&swNear(SW.giverObj,28)&&Math.abs(player.z-SW.giverObj.z)<SW.DZ/2)return['Hablar con '+swD().giver.name,()=>egxAct(SW.giverObj)];
  const n=swIsleNear(player.x,player.z);if(n&&n.d<26&&n.I.id)return['Desembarcar en '+n.I.name.split(' y ')[0].replace(/^(El|La|Los|Las) /,m=>m.toLowerCase()),()=>swLand(n.I.id)];
  for(const o of SW.info)if(o.seg===SW.seg&&swNear(o,o.r))return[o.go?o.goT:'Mirar: '+o.data.name,()=>egxAct(o)];
  if(n&&n.d<26)return null;
  return['Tirarse al agua',()=>{SW.swim=true;SW.depth=0;SW.air=30;}];}
function swE(){const a=swAction();if(a)a[1]();}
function swUnder(on){on=!!on;if(on===!!SW.uw)return;SW.uw=on;$('swUw').classList.toggle('on',on);if(SEA)SEA.material.side=on?THREE.DoubleSide:THREE.FrontSide;if(!on)updateSky();}
function swRow(dt){
  const sy=swSeaY(),swim=SW.swim;let f=(keys.w?1:0)-(keys.s?1:0)-joy.y,s=(keys.d?1:0)-(keys.a?1:0)+joy.x;const L=Math.hypot(f,s);if(L>1){f/=L;s/=L;}
  const sp=swim?(keys.run?4:2.6):(keys.run?11:5.5)*(typeof sw2Mul==='function'?sw2Mul():1),fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw),rx=Math.cos(player.yaw),rz=-Math.sin(player.yaw);
  const tvx=(fx*f+rx*s)*sp+(swim?0:SW.dvx||0),tvz=(fz*f+rz*s)*sp+(swim?0:SW.dvz||0);SW.vx+=(tvx-SW.vx)*Math.min(1,dt*(swim?4:1.6));SW.vz+=(tvz-SW.vz)*Math.min(1,dt*(swim?4:1.6));
  // Caribdis: el remolino arrastra hacia el centro y hace girar la barca
  if(SW.whirl&&SW.whirl.seg===SW.seg&&!swim){const W=SW.whirl,px=SW.bg.position.x,pz=SW.bg.position.z,dx=W.x-px,dz=W.z-pz,d=Math.hypot(dx,dz)||1;
    if(d<W.r){const k=1-d/W.r;SW.vx+=(dx/d*5*k-dz/d*4*k)*dt*3;SW.vz+=(dz/d*5*k+dx/d*4*k)*dt*3;SW.h+=dt*2.5*k;
      if(d<6&&!SW.swallow){SW.swallow=1;swFade(()=>{SW.swallow=0;SW.vx=SW.vz=0;const nx=W.x+70,nz=W.z+70;player.x=nx;player.z=nz;SW.bg.position.set(nx,sy-0.15,nz);
        toast('<span class="label">Caribdis</span><br>El remolino se traga la barca, la hace girar y girar… y el mar la escupe un poco más allá. Ulises tuvo menos suerte: se agarró a la higuera hasta que Caribdis devolvió los restos de su balsa (Odisea XII 426-446).');});}}}
  let x=swim?player.x:SW.bg.position.x,z=swim?player.z:SW.bg.position.z,nx=x+SW.vx*dt,nz=z+SW.vz*dt;
  if(SW.seg){const cz=swSegZ(SW.seg),S=swD().segs[SW.seg];
    const n=swIsleNear(nx,nz);if(n&&n.d<(swim?2:6)){nx=x;nz=z;SW.vx*=-0.2;SW.vz*=-0.2;}
    const go=(dir,lx,lz)=>swFade(()=>{swEnterSeg(S[dir],lx,lz);addHours(2);});
    if(!swim){if(nz>cz+SW.H&&S.s)return go('s',nx-SW.X,-SW.H+8);if(nz<cz-SW.H&&S.n)return go('n',nx-SW.X,SW.H-8);if(nx>SW.X+SW.H&&S.e)return go('e',-SW.H+8,nz-cz);if(nx<SW.X-SW.H&&S.w)return go('w',SW.H-8,nz-cz);}
    const ox=nx,oz=nz;nx=clamp(nx,SW.X-SW.H,SW.X+SW.H);nz=clamp(nz,cz-SW.H,cz+SW.H);
    if((ox!==nx||oz!==nz)&&!swim&&!SW.edgeT){SW.edgeT=5;toast('Más allá solo hay mar abierto, sin costa a la vista. Mejor no perder el rumbo.');}}
  else{ // en el puerto: solo por el agua; lejos del amarre, a mar abierto
    const ok=(px,pz)=>terrainH(px,pz)<sy-1.1;if(!ok(nx,nz)){if(ok(nx,z))nz=z;else if(ok(x,nz))nx=x;else{nx=x;nz=z;}SW.vx*=0.3;SW.vz*=0.3;}
    const m=swMoorOf(swz().at);if(m&&Math.hypot(nx-m.x,nz-m.z)>110){const E=swD().entry[swz().at];if(E){return swFade(()=>{player.feet=sy+0.4;swEnterSeg(E[0],E[1],E[2]);addHours(1);});}nx=x;nz=z;}}
  SW.edgeT=Math.max(0,(SW.edgeT||0)-dt);
  const t=performance.now()/1000,spd=Math.hypot(SW.vx,SW.vz);
  if(!swim){if(spd>0.4){const ta=Math.atan2(SW.vx,SW.vz);SW.h+=wrapA(ta-SW.h)*Math.min(1,dt*2.5);}
    SW.bg.position.set(nx,sy-0.15+Math.sin(t*1.7)*0.05,nz);SW.bg.rotation.set(0,SW.h,Math.sin(t*1.3)*0.03);player.x=nx;player.z=nz;BOAT.y=sy+0.4;}
  else{SW.bg.position.y=sy-0.15+Math.sin(t*1.7)*0.05;const dive=keys.jump||SW.diveHold,maxD=sy-1.45-(SW.BED+0.3);
    if(dive&&SW.air>0)SW.depth=Math.min(maxD,SW.depth+3*dt);else SW.depth=Math.max(0,SW.depth-2*dt);
    player.x=nx;player.z=nz;BOAT.y=sy-1.45-SW.depth;
    if(player.camY<sy-0.1){SW.air-=dt;if(SW.air<=0){SW.air=30;SW.depth=0;SW.swim=false;toast('Te falta el aire… Unas manos te suben a la superficie y te dejan junto a la barca. ¿Una nereida?');}}else SW.air=Math.min(30,SW.air+dt*8);}
  player.feet=BOAT.y;player.vy=0;
}
function swTick(dt){if(!swD()||!SW.built)return;const sy=swSeaY();
  const uw=!!(BOAT.sea&&player.camY<sy-0.05);swUnder(uw);const inS=swIn();for(const lb of SW.labels)lb.visible=inS&&lb.userData.swSeg===SW.seg&&!uw;
  if(inS&&!uw&&scene.fog){scene.fog.near=Math.max(scene.fog.near,700);scene.fog.far=Math.max(scene.fog.far,4500);}
  if(uw&&scene.fog){scene.fog.color.set('#1d5a72');scene.fog.near=1;scene.fog.far=55;if(scene.background&&scene.background.isColor)scene.background.set('#1d5a72');}
  for(const s of SW.spin)s.m.rotation.z+=dt*s.v;
  for(const S of SW.smoke||[]){if(S.seg!==SW.seg){S.m.visible=false;continue;}S.m.visible=true;S.ph=(S.ph+dt*0.05)%1;S.m.position.set(S.x+S.ph*40,S.y0+S.ph*90,S.z-S.ph*20);S.m.scale.setScalar(0.6+S.ph*1.6);S.m.material.opacity=0.5*(1-S.ph);}
  // delfines que saltan cerca de la barca
  if(SW.seg)for(const D of SW.dol){if(D.seg!==SW.seg){D.g.visible=false;continue;}D.t-=dt;if(D.t<0&&!D.on){D.on=1;D.ph=0;const a=Math.random()*TAU,r=20+Math.random()*40;D.x=player.x+Math.cos(a)*r;D.z=player.z+Math.sin(a)*r;D.a=Math.random()*TAU;}
    if(D.on){D.ph+=dt*0.9;const p=D.ph;D.g.visible=true;D.g.position.set(D.x+Math.sin(D.a)*p*8,sy-1+Math.sin(p*Math.PI)*2.2,D.z+Math.cos(D.a)*p*8);D.g.rotation.set(-Math.cos(p*Math.PI)*0.9,D.a,0);if(p>=1){D.on=0;D.t=2+Math.random()*7;D.g.visible=false;}}}
  // indicaciones
  const H=$('swHud');if(!H)return;if(!BOAT.sea||ui!=='play'){if(H.innerHTML)H.innerHTML='';return;}
  let dir='';if(SW.seg&&!SW.swim){const S=swD().segs[SW.seg],cz=swSegZ(SW.seg),lx=player.x-SW.X,lz=player.z-cz,near=[];
    if(S.n&&lz<-SW.H+90)near.push('norte: '+swD().segs[S.n].name);if(S.s&&lz>SW.H-90)near.push('sur: '+swD().segs[S.s].name);if(S.e&&lx>SW.H-90)near.push('este: '+swD().segs[S.e].name);if(S.w&&lx<-SW.H+90)near.push('oeste: '+swD().segs[S.w].name);
    if(near.length)dir='<div class="dir">Rumbo '+near.join(' · ')+'</div>';}
  const a=swAction(),key=(a?a[0]:'')+'|'+(SW.swim?Math.round(SW.air):'')+'|'+isTouch+'|'+dir;if(key!==SW.hint){SW.hint=key;
    H.innerHTML=dir+(a?(isTouch?'<button id="swAct">'+a[0]+'</button>':'<b>E</b>: '+a[0]):'')+(SW.swim?(isTouch?'<button id="swDive">Bucear</button>':'<br><b>Espacio</b> (mantener): bucear')+'<div class="air"><i style="width:'+(SW.air/30*100).toFixed(0)+'%"></i></div>':'');
    const b=$('swAct');if(b)b.onclick=swE;const d=$('swDive');if(d){d.onpointerdown=()=>SW.diveHold=true;d.onpointerup=d.onpointerleave=()=>SW.diveHold=false;}}}
// diálogos y objetos
function swOwnerTalk(first){const D=swD(),O=D.owner,z=swz(),got=D.items.filter(it=>z.it[it.key]),done=got.length;
  if(z.m===0){vmS('⚓',O.name,O.sub,(first?O.first:'')+O.offer,
    [['Acepto el trato',()=>{z.m=1;save();swTreasureVis();vmS('⚓',O.name,O.sub,O.go,[vmBye]);}],['Ahora no',()=>vmS('⚓',O.name,O.sub,'<p>«Como quieras. Puedes usar la barca igualmente; si cambias de idea, aquí estaré, junto al amarre».</p>',[vmBye])]]);return;}
  if(z.m>=3){vmS('⚓',O.name,O.sub,O.later,[vmBye]);return;}
  if(done<D.items.length){vmS('⚓',O.name,O.sub,'<p>«¿Cómo va eso? Llevas '+done+' de '+D.items.length+'»'+(done?': '+got.map(it=>it.short).join(', '):'')+'.</p><p>'+(z.m<2?O.hint:O.hint2)+'</p>',[vmBye]);return;}
  z.m=3;z.mine=1;state.obols+=D.reward;save();updateStats();if(typeof sfxCoin==='function')sfxCoin();swPlaceBoat();swTreasureVis();if(typeof qAdd==='function')qAdd('ar',2);
  vmS('⚓',O.name,O.sub,O.done,[vmBye]);}
function swAct(o){const D=swD(),z=swz(),a=String(o.act).slice(3);
  if(a==='barca'){if(BOAT.on)return;return swBoard();}
  if(a==='dueno')return swOwnerTalk(false);
  if(a==='giver'){const G=D.giver,ask=['Pregúntale por los tesoros',()=>swAct({act:'sw:giverT'})];
    return vmS(G.gl,G.name,G.sub,G.intro,[['¿Quién eres?',()=>vmS(G.gl,G.name,G.sub,G.who,[...(z.m>=1?[ask]:[]),vmBye])],...(z.m>=1?[ask]:[]),vmBye]);}
  if(a==='giverT'){if(z.m<2){z.m=2;save();swTreasureVis();}const G=D.giver;return vmS(G.gl,G.name,G.sub,G.tell,[vmBye]);}
  if(a==='palacio')return vmS('🔱',D.palace.name,'en lo hondo del mar',D.palace.txt,[vmBye]);
  if(a==='pecio')return vmS('⚱','Un pecio','un barco mercante hundido','<p>Un barco de carga hundido con sus ánforas, que llevaban vino, aceite o salsa de pescado. Los arqueólogos submarinos han encontrado cientos de pecios así en el Mediterráneo; gracias a ellos sabemos cómo se construían los cascos y qué se transportaba.</p>',[vmBye]);
  if(a.startsWith('info:')){const I=D.info[a.slice(5)];if(!I)return;const go=o.go,btn=[];if(go&&BOAT.sea&&!SW.swim)btn.push([o.goT,()=>{closeDialog();swFade(()=>{swEnterSeg(go[0],go[1],go[2]);addHours(o.goMsg?24:5);toast(o.goMsg?'<span class="label">'+I[0]+'</span><br>'+o.goMsg:'<span class="label">El díolkos</span><br>En el puerto, unos esclavos suben tu barca a un carro y la arrastran por la calzada de piedra que cruza el Istmo. Unas horas después vuelves a estar en el agua, al otro lado.');});}]);btn.push(vmBye);return vmS('⚓',I[0],I[1],I[2],btn);}
  if(a.startsWith('it:')){const it=D.items.find(q=>q.key===a.slice(3));if(!it||z.it[it.key])return;
    if(z.m<1)return vmS(it.gl,it.name,it.sub,'<p>Algo brilla aquí, pero no sabes qué es ni a quién pertenece. Quizá alguien del puerto pueda contarte más.</p>',[vmBye]);
    z.it[it.key]=1;save();swTreasureVis();if(typeof sfxCoin==='function')sfxCoin();const n=D.items.filter(q=>z.it[q.key]).length;
    return vmS(it.gl,it.cname||it.name,n===1?'primer tesoro':n===2?'segundo tesoro':'tercer tesoro',it.txt+(n>=D.items.length?'<p class="src">Ya tienes los '+n+'. Vuelve con '+D.owner.name+' al puerto de '+(MODE==='roma'?'Roma':'Atenas')+'.</p>':'<p class="src">Llevas '+n+' de '+D.items.length+'.</p>'),[vmBye]);}
}
// enganches
{const bt0=boatTick;boatTick=function(dt){if(BOAT.sea)return swRow(dt);return bt0(dt);};
 const be0=boatExit;boatExit=function(){if(BOAT.sea)return swE();return be0();};
 const fa0=floorAt;floorAt=function(x,z){if(SW.X&&Math.abs(x-SW.X)<SW.H+400&&z<SW.Z0+SW.H+400&&SWD[MODE])return SW.BED;return fa0(x,z);};
 const ck0=checkZone;checkZone=function(){if(swIn())return;return ck0();};
 const rn0=regionName;regionName=function(){if(swIn()){const s=swSegAt();if(s)return swD().segs[s].name;}return rn0();};}
const eduEntriesSW=eduEntries;eduEntries=function(){const E=eduEntriesSW();const D=swD();if(!D||!state)return E;const z=swz();
  if(z.m>=2)E.push({c:'Mitos del mar',n:D.giver.name+', '+D.giver.sub,t:D.giver.codex});
  for(const it of D.items)if(z.it[it.key])E.push({c:'Mitos del mar',n:it.cname||it.name,t:it.codex});return E;};

