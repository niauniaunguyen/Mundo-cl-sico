// ============================================================ ROMA: dioses fuera de la ciudad
// Los dioses griegos con su nombre romano y los dioses propiamente romanos (native), cada uno junto a un lugar de su culto.
const ROMA_GODS=[
{id:'iuppiter',name:'Júpiter',gr:'IVPPITER',glyph:'I',title:'padre de los dioses, el Óptimo Máximo',where:'en la Vía Apia, camino de los montes Albanos',at:()=>[1150,1050],
 look:{chiton:'#fff4dc',himation:'#7a2a5a',hair:'#d8d0c2',beard:true,beardC:'#e0d8cc',attrs:['G_thunderbolt_hand','G_scepter']},raise:0.3,
 intro:'Salve, ciudadano. Soy Júpiter Óptimo Máximo, el más grande y el mejor. Los griegos me llaman Zeus, pero en Roma soy algo más: el garante de los juramentos, de los tratados y del propio Estado. Desde el Capitolio velo por la ciudad; desde el monte Albano, por todos los latinos.',
 topics:[['¿Por qué estás aquí, en el camino?','Porque esta calzada lleva al monte Albano, donde está mi santuario más antiguo, el de Júpiter Lacial. Cada año, en las Ferias Latinas, los cónsules suben allí con los representantes de las ciudades latinas, me sacrifican un toro blanco y reparten su carne entre todos, para recordar que los latinos son un solo pueblo. Mientras dura la fiesta, se suspenden las guerras.'],
  ['¿Qué es el triunfo?','Cuando un general vuelve victorioso, el Senado puede concederle el triunfo: entra en Roma en un carro, vestido como yo, con la cara pintada de rojo, y sube al Capitolio a ofrecerme los laureles. Detrás, dicen, un esclavo le susurra que recuerde que es mortal. Hace nueve años triunfaron aquí Vespasiano y Tito por la guerra de Judea, con el candelabro de oro del templo de Jerusalén.'],
  ['¿Es verdad que tu templo ardió?','Más de una vez. Ardió en tiempos de Sila, y hace once años, en la guerra civil, los partidarios de Vitelio lo incendiaron mientras se combatía en el Capitolio. Vespasiano lo reconstruyó, y él mismo cargó el primer cesto de escombros. El fuego y yo nos llevamos mal, aunque el rayo sea mío.']],
 quest:{need:{t:'visit',place:'ro_jupiter',r:30},reward:5,goal:'Sube al Capitolio y contempla el templo de Júpiter Óptimo Máximo.',
  ask:'Sube al Capitolio, a mi templo, el de las tejas de bronce dorado. Desde allí se ve toda Roma a tus pies, como la veo yo. Y mira bien: es la casa que los romanos levantan una y otra vez, por mucho que arda.',
  wait:'Mi templo corona el Capitolio, al oeste del Foro. Sube por el Clivo Capitolino.',
  done:'¿Lo has visto? Mientras ese templo esté en pie, Roma durará. Eso creen los romanos, y no seré yo quien les quite la idea. Toma, por tu piedad.'}},
{id:'iuno',name:'Juno',gr:'IVNO',glyph:'I',title:'reina de los dioses, protectora de las mujeres',where:'junto a la Vía Prenestina, camino de Gabii',at:()=>[1150,-700],
 look:{female:true,chiton:'#efe6d4',himation:'#2f4c86',hair:'#3b2a1e',attrs:['G_diadem','G_scepter']},raise:0.3,
 intro:'Salve. Soy Juno, esposa de Júpiter y reina del cielo. Las mujeres me invocan como Lucina cuando dan a luz, y en el Capitolio me llaman Moneta, la que avisa. En Gabii, al final de este camino, tengo un templo antiguo.',
 topics:[['¿Por qué te llaman Moneta?','Hace casi cinco siglos, los galos intentaron tomar el Capitolio de noche. Los centinelas dormían, y hasta los perros, pero mis ocas sagradas graznaron y despertaron a los defensores. Más tarde me dedicaron un templo como Moneta, «la que avisa», y junto a él se instaló la ceca donde se acuña el dinero. Por eso al dinero lo llamáis moneda.'],
  ['¿Qué son las Matronales?','El primer día de marzo, las mujeres casadas suben a mi santuario de Lucina, en el Esquilino, con flores en el pelo, y me piden partos felices. Ese día los maridos hacen regalos a sus esposas, y ellas sirven la comida a los esclavos de la casa. Es mi fiesta.'],
  ['¿Eres la misma que Hera?','Los griegos me llaman Hera y los etruscos, Uni. Cuando los romanos sitiaron Veyes, la ciudad etrusca, me rogaron que abandonara a sus enemigos y me fuera con ellos a Roma, y me prometieron un templo. Acepté: desde entonces soy Juno Reina en el Aventino. Un dios también sabe elegir bando.']],
 quest:{need:{t:'island',id:'lucania'},reward:5,goal:'Viaja a Paestum, en Lucania, donde los griegos levantaron templos a Hera.',
  ask:'Los griegos de Posidonia me levantaron en Lucania templos enormes, cuando me llamaban Hera. Hoy esa ciudad se llama Paestum y es romana. Ve a verlos y dime si mis columnas siguen en pie.',
  wait:'Paestum está en Lucania, al sur de Campania. El cochero de la Vía Apia te llevará.',
  done:'¡Siguen en pie! Los romanos son gente piadosa: cambian los nombres, pero no derriban las casas de los dioses. Toma, y que Lucina te proteja.'}},
{id:'minerva',name:'Minerva',gr:'MINERVA',glyph:'M',title:'diosa de la sabiduría y de los oficios',where:'junto a la Vía Nomentana',at:()=>[900,-1200],
 look:{female:true,chiton:'#efe6d4',himation:'#c9a24a',hair:'#5a3a22',helmet:'attic',attrs:['G_aegis','P_spear','P_spearhead','P_shield']},raise:0.2,
 intro:'Salve. Soy Minerva. En el Capitolio comparto templo con Júpiter y con Juno. Los griegos me llaman Atenea; los etruscos, Menrva. Protejo a los artesanos, a los médicos, a los maestros y a sus alumnos, y también a los que hacen la guerra con la cabeza.',
 topics:[['¿Qué fiesta te dedican?','Las Quincuatrias, en marzo, cinco días. Los artesanos (tejedores, bataneros, zapateros, pintores, escultores, médicos) me ofrecen sacrificios, y los niños no van a la escuela. Cuando vuelven, llevan al maestro su paga, el minerval. Así que, si algún niño te dice que no le gusta Minerva, no le creas.'],
  ['¿Qué es la tríada capitolina?','Júpiter, Juno y yo compartimos el gran templo del Capitolio, cada uno con su cella. Y cada colonia romana, de Hispania a Asia, levanta su propio Capitolio con los tres. Donde hay un Capitolio, hay Roma.'],
  ['¿Quién te venera más en Roma?','Ahora mismo, Domiciano, el hermano del emperador. Me tiene por su protectora y no hace nada sin pedirme permiso. Hay quien dice que es devoción y quien dice que es superstición. Yo prefiero no opinar sobre la familia imperial.']],
 quest:{need:{t:'lesson',id:'quintiliano'},reward:5,goal:'Aprende la lección de Quintiliano, el maestro de retórica, junto a la Basílica Julia.',
  ask:'Un buen discípulo mío es Quintiliano, el maestro de retórica que paga el emperador. Ve a escucharlo junto a la Basílica Julia y aprende lo que enseña. Luego vuelve y dime si has aprendido algo.',
  wait:'Quintiliano enseña junto a la Basílica Julia, en el Foro. Escúchalo y responde bien a su pregunta.',
  done:'Bien. El que aprende a hablar bien aprende a pensar bien, decía él. Y yo añado: y el que piensa bien, a veces calla. Toma.'}},
{id:'mars',name:'Marte',gr:'MARS',glyph:'M',title:'dios de la guerra, padre de Rómulo',where:'en la Vía Apia, junto a su templo',at:()=>[900,780],
 look:{chiton:'#a8392b',himation:'#6a1e1a',hair:'#3b2a1e',beard:true,spear:true},raise:0.4,glow:'#ff8a60',
 intro:'Salve, romano. Soy Marte, padre de Rómulo y Remo. En Grecia me llaman Ares y no me quieren mucho; aquí soy el padre del pueblo romano. De este templo, junto a la Vía Apia, salen los ejércitos hacia el sur, y aquí se reúnen los caballeros cada año antes de su desfile.',
 topics:[['¿Por qué tu mes abría el año?','Porque marzo, mi mes, era el primero del año romano: el de la primavera y el de las campañas. Mis sacerdotes, los salios, bailan por la ciudad con escudos sagrados. Uno cayó del cielo en tiempos del rey Numa, y para que nadie lo robara mandó hacer once iguales. Nadie sabe ya cuál es el verdadero.'],
  ['¿Qué es el Campo de Marte?','Mi llanura junto al Tíber. Allí se reunía el ejército y votaban los ciudadanos por centurias, como si formaran en batalla. En octubre se celebra una carrera de carros y se me sacrifica el caballo vencedor; los de dos barrios se pelean por su cabeza. Hoy el Campo está lleno de teatros y pórticos, pero sigue siendo mío.'],
  ['¿Qué es Marte Vengador?','Augusto me prometió un templo antes de la batalla de Filipos si lo ayudaba a vengar el asesinato de César. Venció y cumplió: el templo está en su foro, y allí guarda las enseñas que los partos arrebataron a Craso y que Augusto recuperó. Allí se reúne el Senado para decidir las guerras.']],
 quest:{need:{t:'visit',place:'ro_augusto',r:30},reward:5,goal:'Visita el Foro de Augusto y el templo de Marte Vengador.',
  ask:'Ve al foro de Augusto y entra en el recinto de mi templo de Marte Vengador. Mira las estatuas de los grandes generales de Roma en los pórticos, y piensa en lo que cuesta la gloria.',
  wait:'El Foro de Augusto está junto al de César, al norte del Foro Romano.',
  done:'¿Lo has visto? Columnas de mármol y estatuas de héroes. Detrás de cada una hay miles de muertos. No lo olvides cuando alguien te hable de gloria. Toma.'}},
{id:'venus',name:'Venus',gr:'VENVS',glyph:'V',title:'diosa del amor, madre de Eneas',where:'fuera de la Puerta Colina, junto a su templo',at:()=>[250,-1250],
 look:{female:true,chiton:'#f4efe3',himation:'#c96a8a',hair:'#c9a24a',attrs:['G_mirror_hand','G_diadem']},raise:0.5,glow:'#ffb6c8',
 intro:'Salve. Soy Venus. Los griegos me llaman Afrodita, pero para los romanos soy algo más que el amor: soy la madre de Eneas y, por él, de todo el pueblo romano. Los Julios, la familia de César, decían descender de mi nieto Iulo.',
 topics:[['¿Por qué eres madre de los romanos?','Me uní con un mortal, Anquises, y tuve a Eneas. Cuando ardió Troya, Eneas huyó con su padre a hombros y su hijo de la mano, y tras muchos viajes llegó al Lacio. De su hijo Iulo descienden los Julios; de sus descendientes, Rómulo y Remo. César me levantó un templo como Venus Madre en su foro, y Augusto no dejaba que nadie lo olvidara.'],
  ['¿Qué templo es este?','El de Venus Ericina, traída de la montaña de Érice, en Sicilia, durante la guerra contra Aníbal. Este segundo templo, fuera de la Puerta Colina, es el que visitan las prostitutas el día de las Vinalias, en abril: me ofrecen mirto, rosas y menta, y me piden belleza y clientes. Yo no juzgo.'],
  ['¿Y Venus Vencedora?','Pompeyo, que no quería ser menos que nadie, construyó el primer teatro de piedra de Roma y, para que no le acusaran de lujo, puso encima mi templo: las gradas eran, decía, la escalinata del santuario. Muy listo. Luego perdió contra César, que también era mío. No puedo ayudar a todos a la vez.']],
 quest:{need:{t:'visit',place:'ro_cesar',r:30},reward:5,goal:'Visita el Foro de César y el templo de Venus Madre.',
  ask:'Ve al foro de César y saluda a mi templo de Venus Madre. César puso dentro una estatua de oro de Cleopatra a mi lado, ¡a mi lado! Míralo y vuelve.',
  wait:'El Foro de César está junto a la Curia, al norte del Foro Romano.',
  done:'¿Has visto a Cleopatra a mi lado? Los hombres hacen cosas extrañas por amor. Yo lo sé mejor que nadie. Toma, y que el amor te sea favorable.'}},
{id:'neptunus',name:'Neptuno',gr:'NEPTVNVS',glyph:'N',title:'dios del mar y de las aguas',where:'río abajo, en la orilla del Tíber',at:()=>[-700,1250],
 look:{chiton:'#d8e4ee',himation:'#2f5f8a',hair:'#4a5a6a',beard:true,beardC:'#5a6a7a',attrs:['G_trident']},raise:0.3,glow:'#9fd0ff',
 intro:'Salve, marinero de tierra firme. Soy Neptuno. Los griegos me llaman Poseidón. Los romanos, al principio, no eran gente de mar: me honraban como dios de las aguas dulces, de las fuentes y los ríos. Luego vino Cartago y tuvieron que aprender a navegar.',
 topics:[['¿Cómo aprendieron los romanos a navegar?','En la primera guerra contra Cartago. Una nave cartaginesa encalló en la costa, los romanos la copiaron pieza a pieza y en pocos meses tenían una flota. Como no sabían maniobrar, inventaron un puente con un garfio para abordar a los enemigos y luchar como en tierra. Con él venció Duilio en el 260 a.C.: en el Foro tiene su columna adornada con los espolones de las naves enemigas.'],
  ['¿Qué fiesta te dedican?','Las Neptunalias, en julio, en lo peor del calor. Los romanos construyen cabañas de ramas a orillas del Tíber y pasan el día a la sombra, comiendo y bebiendo. Es una de mis fiestas más antiguas, de cuando yo era sobre todo el dios del agua que falta en verano.'],
  ['¿Y el puerto de Claudio?','Río abajo, junto a Ostia, Claudio construyó un puerto nuevo para las naves del trigo, con dos grandes escolleras. Para el faro, hundió como cimiento la nave gigantesca que había traído de Egipto el obelisco del circo del Vaticano. Me gustó el regalo.']],
 quest:{need:{t:'island',id:'apulia'},reward:5,goal:'Viaja a Brundisium, el gran puerto hacia Grecia.',
  ask:'Quiero que conozcas un puerto de verdad. Ve a Brundisium, en Apulia, al final de la Vía Apia: un brazo de mar con forma de cornamenta de ciervo, desde donde se cruza a Grecia en un día.',
  wait:'Brundisium está al final de la Vía Apia. Busca al cochero que espera junto a la calzada.',
  done:'¿Has visto las naves? Algunas cruzarán mañana el Adriático. Hónrame antes de embarcar y te llevaré a salvo. Toma.'}},
{id:'mercurius',name:'Mercurio',gr:'MERCVRIVS',glyph:'M',title:'mensajero de los dioses, protector de los mercaderes',where:'junto a la fuente de la Puerta Capena',at:()=>[650,650],
 look:{chiton:'#e9dfc8',himation:'#3f6a9a',hair:'#3b2a1e',attrs:['G_petasos','G_caduceus_hand','G_wings_feet']},raise:0.5,
 intro:'Salve, salve, que tengo prisa. Mercurio, mensajero de Júpiter y dios de los mercaderes: de merx, mercancía, ¿lo pillas? Los griegos me llaman Hermes. Aquí, junto a la Puerta Capena, hay una fuente que es mía.',
 topics:[['¿Qué es esa fuente?','Cada año, en mayo, el día de mi fiesta, los mercaderes vienen aquí, mojan una rama de laurel en el agua de mi fuente y se rocían a sí mismos y a sus mercancías. Y me piden que les perdone las mentiras que han dicho a sus clientes y que les deje seguir ganando. Ovidio lo contó con mucha gracia. Yo, por mi parte, siempre los perdono.'],
  ['¿Dónde está tu templo?','Junto al Circo Máximo, desde hace casi seis siglos. Cuando se construyó, los cónsules se pelearon por el honor de dedicarlo y al final el pueblo se lo dio a un centurión. Allí se reunía el gremio de los mercaderes. Muy apropiado.'],
  ['¿Llevas también a los muertos?','Los acompaño al inframundo, sí, con mi vara. Y llevo los mensajes de Júpiter. Uno de los más difíciles fue ir a Cartago a decirle a Eneas que dejara a la reina Dido y siguiera hacia Italia. Él obedeció. Ella no se lo tomó bien. Así es mi oficio: el mensajero no elige las noticias.']],
 quest:{need:{t:'visit',place:'ro_emporio',r:30},reward:5,goal:'Baja al Emporio, el puerto fluvial de Roma.',
  ask:'Baja al Emporio, a orillas del Tíber, bajo el Aventino. Allí se descargan el trigo, el aceite y el vino de todo el Imperio. Mira cómo se gana el dinero en Roma, y vuelve a contármelo.',
  wait:'El Emporio está junto al Tíber, al sur del Aventino.',
  done:'¿Has visto los almacenes y las montañas de ánforas? Todo eso pasa por mis manos, aunque los mercaderes crean que es mérito suyo. Toma, y que el negocio te vaya bien.'}},
{id:'vulcanus',name:'Vulcano',gr:'VOLCANVS',glyph:'V',title:'dios del fuego y de la forja',where:'junto a los hornos de la Vía Labicana',at:()=>[1250,-150],
 look:{chiton:'#8a7a62',himation:'#5a4a3a',hair:'#2a1e16',beard:true,noHimation:true,attrs:['G_pilos','G_hammer_hand']},raise:0.35,glow:'#ff9a50',
 intro:'Salve. Vulcano. En Grecia, Hefesto. Aquí en Roma me temen más de lo que me quieren: soy el fuego que forja las armas y el que quema los barrios. Por eso mis templos se construían fuera de la ciudad, y por eso me hablas aquí, entre hornos.',
 topics:[['¿Por qué te temen tanto?','Porque Roma es una ciudad de madera y de pisos estrechos: un brasero volcado y arde una manzana entera. Hace dieciséis años el incendio de Nerón quemó durante días casi toda la ciudad. En mi fiesta, las Volcanales, en agosto, la gente echa peces vivos al fuego para que me conforme con ellos y no me lleve vidas humanas.'],
  ['¿Es tuyo el Vesubio?','Mi fragua está bajo las islas de Lípari, bajo el Etna: allí, con los cíclopes, forjé el escudo de Eneas, como cuenta Virgilio. El Vesubio… digamos que el año pasado se me escapó. Si quieres ver lo que puede hacer el fuego de la tierra, ve a Campania.'],
  ['¿Qué es el Volcanal?','Mi altar en el Foro, junto al Comicio, el santuario más antiguo de Roma. Dicen que lo consagró el propio Rómulo, y que allí se reunían él y el rey sabino Tito Tacio para pactar. Hoy casi nadie se fija en él, entre tanto mármol.']],
 quest:{need:{t:'island',id:'campania'},reward:5,goal:'Viaja a Campania y mira el Vesubio.',
  ask:'Ve a Campania, a Neápolis, y mira el Vesubio, que todavía humea. Mira Pompeya, sepultada. Y luego vuelve y dime si los romanos tienen razón al temerme.',
  wait:'Neápolis está en la región del Lacio y la Campania. El cochero de la Vía Apia te llevará en cinco días.',
  done:'Lo has visto. No es castigo ni capricho: el fuego es así. Los hombres aprenden a vivir con él, o no. Toma, y ten cuidado con los braseros.'}},
{id:'ianus',name:'Jano',gr:'IANVS',glyph:'I',title:'dios de las puertas y de los comienzos',where:'en el Janículo, al otro lado del Tíber',at:()=>[-1350,180],native:true,
 look:{chiton:'#efe6d4',himation:'#8a6a3a',hair:'#d8d0c2',beard:true,beardC:'#e0d8cc',staff:true,attrs:['G_scepter']},raise:0.25,
 intro:'Salve. Soy Jano, el de las dos caras: una mira hacia atrás y otra hacia delante. Soy el dios de las puertas, de los pasos y de los comienzos. No tengo nombre griego: soy solo vuestro. Esta colina lleva mi nombre, el Janículo.',
 topics:[['¿Por qué tienes dos caras?','Porque una puerta mira hacia dentro y hacia fuera, y todo comienzo es también un final. Por eso el primer mes del año, enero, lleva mi nombre, y en todas las oraciones se me nombra primero, antes que al propio Júpiter: para entrar a hablar con los dioses hay que pasar por mi puerta.'],
  ['¿Qué es el templo de las puertas?','Un pequeño templo de bronce junto al Foro, con dos puertas. Cuando Roma está en guerra, las puertas están abiertas; cuando hay paz en todo el Imperio, se cierran. Antes de Augusto solo se habían cerrado dos veces en siete siglos. Augusto las cerró tres veces, y Vespasiano las cerró después de la guerra de Judea. Casi siempre están abiertas.'],
  ['¿Qué pasó en el Janículo?','Dicen que aquí fundé yo una ciudad, cuando reinaba en el Lacio y acogí a Saturno, que huía de Júpiter. Aquí está también la tumba del rey Numa: hace siglos, un campesino que araba encontró dos cofres de piedra, uno vacío y otro lleno de libros. El Senado los mandó quemar por si eran peligrosos.']],
 quest:{need:{t:'visit',place:'ro_curia',r:30},reward:5,goal:'Ve al Foro, junto a la Curia, donde está el templo de Jano.',
  ask:'Ve al Foro y busca mi templo de las puertas, junto a la Curia. Mira si las puertas están abiertas o cerradas. Y luego vuelve y dime en qué tiempo vive Roma.',
  wait:'Mi templo está en el Foro, junto a la Curia, al norte de la plaza.',
  done:'Abiertas, ¿verdad? Siempre hay una guerra en alguna frontera. Ojalá un día puedas verlas cerradas. Toma, y que tus comienzos sean buenos.'}},
{id:'quirinus',name:'Quirino',gr:'QVIRINVS',glyph:'Q',title:'Rómulo divinizado, dios de los ciudadanos',where:'al norte del Quirinal, junto a la Vía Salaria',at:()=>[-200,-1300],native:true,
 look:{chiton:'#efe6d4',himation:'#7a2a3a',hair:'#3b2a1e',beard:true,spear:true,attrs:['G_wreath']},raise:0.3,
 intro:'Salve, quirite. Así os llaman a los romanos en las asambleas: quirites, el pueblo de Quirino. Yo fui Rómulo, el fundador. Cuando desaparecí en la tormenta del Campo de Marte, subí al cielo y me convertí en Quirino. Mi templo está ahí arriba, en la colina que lleva mi nombre.',
 topics:[['¿Cómo te convertiste en dios?','Pasaba revista al ejército junto a la laguna de la Cabra cuando estalló una tormenta y una nube me envolvió. Los senadores dijeron que me había arrebatado el cielo. Luego me aparecí a Próculo Julio y le pedí que anunciara a los romanos que Roma sería la capital del mundo. Si quieres verlo con tus ojos, busca la esfera de sueño del Campo de Marte.'],
  ['¿Qué son las Quirinales?','Mi fiesta, en febrero. Coincide con la «fiesta de los tontos»: el último día para tostar el trigo en honor de la diosa de los hornos, para los que se despistaron y no lo hicieron con su curia. No es muy digno para un fundador, pero los romanos siempre han tenido sentido del humor.'],
  ['¿Quién te sirve?','Tengo mi propio sacerdote, el flamen quirinal, uno de los tres grandes flámines, con el de Júpiter y el de Marte. Mi templo del Quirinal lo reconstruyó Augusto con setenta y seis columnas. Augusto quiso que lo llamaran Rómulo, pero le pareció que sonaba a rey, y prefirió «Augusto».']],
 quest:{need:{t:'visit',place:'ro_romulo',r:25},reward:5,goal:'Visita la cabaña de Rómulo, en el Palatino.',
  ask:'Sube al Palatino y busca mi cabaña. La conservan desde hace ochocientos años: cada vez que se estropea, la reparan con paja y madera, igual que la construí yo. Mírala y piensa en lo pequeño que fue el principio.',
  wait:'La cabaña de Rómulo está en el Palatino, cerca del templo de Apolo.',
  done:'Pequeña, ¿verdad? De esa choza salió todo esto. Ningún romano debería olvidarlo. Toma.'}},
{id:'faunus',name:'Fauno',gr:'FAVNVS',glyph:'F',title:'dios de los bosques y de los rebaños',where:'en los bosques al norte del Janículo',at:()=>[-1300,-900],native:true,
 look:{chiton:'#8a7a5a',hair:'#5b4532',beard:true,exomis:true,attrs:['G_wreath']},raise:0.5,glow:'#c9e08a',
 intro:'Je, je. ¿Te has asustado? Soy Fauno. Hablo en los bosques con voces que nadie sabe de dónde vienen, protejo los rebaños y espanto a los lobos. Los griegos me confunden con Pan. Dicen que fui rey del Lacio antes de que llegara Eneas.',
 topics:[['¿Qué son las Lupercales?','Mi fiesta, en febrero. Los lupercos sacrifican una cabra y un perro en la cueva del Lupercal, se visten con tiras de piel y corren medio desnudos alrededor del Palatino golpeando a quien encuentran. Las mujeres se ponen en su camino, porque dicen que así tendrán hijos. Hace más de un siglo, en esta fiesta, Marco Antonio ofreció a César una diadema de rey. César la rechazó. Un mes después lo mataron.'],
  ['¿Es verdad que das oráculos?','En el bosque de Albunea, junto a una fuente sulfurosa. El que me consulta sacrifica una oveja, duerme sobre su piel y oye mi voz en sueños. Así consultó el rey Latino qué hacer con su hija Lavinia, y le dije que la casara con un extranjero. Ese extranjero era Eneas.'],
  ['¿Tienes familia?','Soy hijo de Pico, el pájaro carpintero, y nieto de Saturno. Mi hijo fue el rey Latino. Hay quien dice que hay muchos faunos y no uno solo, como hay muchos sátiros en Grecia. Nunca lo he aclarado. Un poco de misterio no le sienta mal a un dios del bosque.']],
 quest:{need:{t:'visit',place:'ro_lupercal',r:25},reward:5,goal:'Visita el Lupercal, la cueva de la loba, en la ladera del Palatino.',
  ask:'Ve al Lupercal, la cueva donde la loba amamantó a los gemelos, al pie del Palatino. Allí empiezan mis carreras. Escucha bien: a lo mejor oyes mi voz.',
  wait:'El Lupercal está en la ladera suroeste del Palatino, cerca del Circo Máximo.',
  done:'¿Has oído algo? ¿No? Pues yo sí te he oído a ti. Je, je. Toma.'}},
{id:'silvanus',name:'Silvano',gr:'SILVANVS',glyph:'S',title:'dios de los bosques y de los límites de los campos',where:'en el bosque, al este de la ciudad',at:()=>[1250,350],native:true,
 look:{chiton:'#6a7a3a',hair:'#5b4532',beard:true,beardC:'#8a7a5a',exomis:true,staff:true},raise:0.2,glow:'#b8e08a',
 intro:'Salve. Silvano, el de los bosques. No tengo templos grandes ni sacerdotes vestidos de púrpura: me honran los campesinos, los esclavos, los leñadores y los pastores con un poco de leche, uvas y una oración junto a un árbol. Y en mis ritos no se admiten mujeres, que conste.',
 topics:[['¿Quién te honra?','La gente humilde. Catón explicó cómo ofrecerme un sacrificio por la salud de los bueyes: en el bosque, de día, con harina, tocino y vino, y sin mujeres presentes. Muchos esclavos y libertos me dedican altares pequeños con su nombre. Soy un dios que no pide mucho, y por eso me piden mucho.'],
  ['¿Qué proteges?','Los bosques, los rebaños, los huertos y, sobre todo, los límites de los campos. Los agrimensores dicen que hay tres Silvanos: el de la casa, el del campo y el que guarda el límite entre dos fincas. Si mueves un mojón, te las verás conmigo y con Término.'],
  ['¿Eres como algún dios griego?','No del todo. A veces me comparan con Pan, por lo del bosque, pero yo soy más serio. Virgilio dice que los antiguos habitantes del Lacio me consagraron un bosque y un día de fiesta como «dios de los campos y del ganado». Soy tan viejo como los primeros árboles de Italia.']],
 quest:{need:{t:'island',id:'samnium'},reward:5,goal:'Viaja al Samnio, a Saepinum, entre montes y rebaños.',
  ask:'Ve a los montes del Samnio, a Saepinum, donde los pastores bajan sus rebaños por los caminos de hierba. Allí me ofrecen leche en los bosques. Míralos y vuelve.',
  wait:'Saepinum está en el Samnio, en los Apeninos. El cochero de la Vía Apia te llevará por la Vía Latina.',
  done:'¿Has visto los rebaños? Esa es la Italia que yo guardo, la que no sale en los libros. Toma.'}},
{id:'fortuna',name:'Fortuna',gr:'FORTVNA',glyph:'F',title:'diosa de la suerte',where:'junto a la Vía Portuense, al otro lado del Tíber',at:()=>[-900,1150],native:true,
 look:{female:true,chiton:'#efe6d4',himation:'#c9a24a',hair:'#5a3a22',attrs:['G_diadem','G_scepter']},raise:0.4,glow:'#ffe08a',
 intro:'Salve. Soy Fortuna, la que da y la que quita. Tengo cien nombres: Fortuna del Pueblo Romano, Fortuna de las Mujeres, Fortuna Primigenia en Praeneste… Aquí, junto al río, me levantó un templo el rey Servio Tulio, que nació esclavo y llegó a rey. ¿Quién mejor para venerarme?',
 topics:[['¿Qué es la fiesta de Fors Fortuna?','En junio, el pueblo baja por el Tíber en barcas adornadas con guirnaldas hasta mis templos de esta orilla, y vuelve cantando y bastante bebido. Es una fiesta de la gente sencilla, de los artesanos y de los esclavos, en recuerdo de Servio, el rey que nació esclavo. Ese día nadie se avergüenza de su origen.'],
  ['¿Qué hay en Praeneste?','Mi santuario más famoso, en el Lacio: una montaña entera convertida en terrazas, rampas y pórticos, hasta mi templo en lo alto. Allí doy oráculos con suertes: unas tablillas de roble con palabras antiguas que saca un niño de una caja. Mucha gente sube a preguntarme por su futuro. Yo respondo, pero no siempre con claridad.'],
  ['¿Eres la misma que Tique?','Los griegos me llaman Tique. Me pintan con un timón, porque gobierno la vida de los hombres; con un cuerno lleno de frutos, porque doy riqueza; y a veces con una rueda, porque todo gira: el que hoy está arriba, mañana estará abajo. Los emperadores me tienen mucho respeto. Hacen bien.']],
 quest:{need:{t:'island',id:'campania'},reward:5,goal:'Viaja a la región del Lacio y la Campania.',
  ask:'Viaja al sur, a la región del Lacio y la Campania, donde está mi santuario de Praeneste y donde este año la fortuna ha sido cruel con muchos. Míralo con tus ojos y vuelve.',
  wait:'El cochero de la Vía Apia te llevará a la región del Lacio y la Campania.',
  done:'¿Has visto a los que lo perdieron todo en Pompeya? Ayer eran ricos. Recuérdalo cuando te vaya bien. Toma: hoy te toca a ti.'}},
{id:'tiberinus',name:'Tiberino',gr:'TIBERINVS',glyph:'T',title:'el dios del río Tíber',where:'a orillas del Tíber, río arriba',at:()=>[-700,-1450],native:true,
 look:{chiton:'#d8e4ee',himation:'#4f7a6a',hair:'#8d8a85',beard:true,beardC:'#9a968e',staff:true,attrs:['G_wreath']},raise:0.2,glow:'#9fe0d0',
 intro:'Salve. Soy el padre Tiberino, el río. Antes me llamaban Álbula, por mis aguas blancas; cambié de nombre cuando se ahogó en mí Tiberino, rey de Alba. Traje en mi corriente la cesta de Rómulo y Remo y la dejé en la orilla. Todo lo que entra en Roma por agua pasa por mí.',
 topics:[['¿Fuiste tú quien salvó a los gemelos?','Iba crecido aquel día y los dejé al pie del Palatino, junto a la higuera. Desde entonces, los romanos me rezan como a un padre. Horacio Cocles me pidió que recibiera sus armas antes de tirarse al agua, y lo llevé a la orilla. Y a la joven Clelia, que escapó del campamento de Porsena con otras rehenes, la dejé cruzar a nado.'],
  ['¿Por qué te desbordas?','Porque me alimentan muchos ríos y mucha lluvia, y porque los hombres construyen cada vez más cerca de mí. Cuando crezco, inundo el Campo de Marte, el Foro Boario y los barrios bajos; los romanos suben en barcas por sus calles. Tiberio nombró unos curadores para vigilar mis orillas, pero yo sigo haciendo lo que quiero.'],
  ['¿Qué fiesta te dedican?','Las Tiberinales, en diciembre. Y una vez me aparecí en sueños a Eneas, viejo, coronado de cañas y con un manto verde, y le dije que siguiera río arriba, que encontraría una cerda blanca con treinta lechones: allí fundaría su hijo Alba. Lo cuenta Virgilio.']],
 quest:{need:{t:'visit',place:'ro_isla',r:30},reward:5,goal:'Visita la Isla Tiberina, en medio del río.',
  ask:'Ve a la isla que tengo en medio de la ciudad, la de Esculapio, con forma de barco. Allí cuidan a los enfermos. Mira cómo corro a los dos lados y vuelve.',
  wait:'La Isla Tiberina está en el Tíber, junto al Foro Boario. Se llega por dos puentes.',
  done:'¿Has visto la proa de piedra? La isla es la nave que trajo a Esculapio de Grecia, dicen. Yo la llevo en mis brazos desde entonces. Toma.'}}
];

// Cambia el juego al modo Roma antes de construir el mundo: contenido, textos, zonas, guardado y límites
function romaSetup(){
  NPCS.length=0;NPCS.push(...ROMA_NPCS,...ROMA_DEST_NPCS);
  HIST.clear();ROMA_HIST.forEach(h=>HIST.add(h));
  for(const k in LESSONS)delete LESSONS[k];
  NPCS.forEach(n=>{LESSONS[n.id]={title:n.lesson,cat:n.cat,summary:n.summary,where:n.where,who:n.name,fict:!HIST.has(n.id)};});
  Object.assign(SRC,ROMA_SRC,ROMA_DEST_SRC);
  ESSAYS.length=0;ESSAYS.push(...ROMA_ESSAYS);
  TIMELINE.length=0;TIMELINE.push(...ROMA_TIMELINE);
  RELIEFS.length=0;GODS.length=0;GODS.push(...ROMA_GODS);
  MYTHS.push(...ROMA_MYTHS);if(!MYTH_CATS.includes('Leyendas de Roma'))MYTH_CATS.unshift('Leyendas de Roma');
  ISLANDS.length=0;ISLANDS.push(...ROMA_DESTS);layoutDests();
  ZONES.length=0;ZONES.push(...ISLANDS.map(I=>({id:'isl_'+I.id,name:I.name,gr:I.gr,sub:I.sub,test:x=>regionOf(x)===I.id})),...ROMA_ZONES);
  Object.assign(INNER,{x:-150,z:-100,size:2900});
  Object.assign(MAPB,{x0:-1500,x1:1250,z0:-1450,z1:1250});
  Object.assign(AGORA,{x:0,z:0});
  Object.assign(player,{x:40,z:-8,yaw:Math.PI/2,pitch:0.02});
  SAVE_KEY='roma-80-v1';loadState();
  GLOSS.length=0;GLOSS.push(...ROMA_GLOSS);rebuildGloss();
  // textos de la interfaz
  document.title='Nóstos · Roma, 80 d.C.';
  $('hudTitle').textContent='Roma · año 80 d.C.';
  $('stH1').innerHTML='Roma<span>AÑO 80 d.C.</span>';try{stImgFill();}catch(e){}
  $('stIntro').innerHTML='<p>Tito, hijo de Vespasiano, es emperador desde hace un año. El Vesubio acaba de sepultar Pompeya, y Roma, que se reconstruye aún del incendio de Nerón, celebra cien días de juegos para inaugurar el Anfiteatro Flavio.</p><p>Llegas al Foro Romano. Habla con poetas, filósofos, senadores, gladiadores, libertos y vestales; lee las inscripciones y aprende cómo vive, gobierna y piensa la mayor ciudad del mundo. Cada lección que superes te dará tres sestercios.</p>';
  document.querySelector('#journal [data-tab="myths"]').hidden=true;
  $('libQ').placeholder='Buscar: Marcial, termas, Tíber…';
}


