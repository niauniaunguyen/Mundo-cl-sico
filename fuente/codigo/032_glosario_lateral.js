// ============================================================ glosario lateral
// Cada vez que cambia el texto de un diálogo, se marcan los términos del mundo griego y se explican en el recuadro de la derecha.
// [término, variantes que se buscan en el texto, explicación]
const GLOSS=[
['Ágora',['ágora','ágoras'],'Plaza central de la ciudad: mercado, lugar de reunión y sede de los edificios del Consejo, los magistrados y los tribunales.'],
['Acrópolis',['acrópolis'],'La «ciudad alta»: la roca fortificada donde están los grandes templos de Atenea.'],
['Pnyx',['pnyx'],'Colina al oeste de la Acrópolis donde se reúne la Asamblea. Caben unos seis mil ciudadanos sentados en la ladera.'],
['Asamblea',['asamblea','asambleas','ekklesía'],'La ekklesía: reunión de todos los ciudadanos varones adultos, que votan leyes, la guerra y la paz a mano alzada.'],
['Consejo',['consejo','bulé'],'La Bulé: quinientos ciudadanos sorteados, cincuenta por tribu, que preparan los asuntos que vota la Asamblea.'],
['Prítano',['prítano','prítanos','pritanía','pritanías'],'Los cincuenta consejeros de una tribu que, por turnos de unas cinco semanas, dirigen el Consejo y comen juntos en la Tolos.'],
['Arconte',['arconte','arcontes'],'Los nueve magistrados principales, elegidos por sorteo cada año. El arconte epónimo da nombre al año.'],
['Polemarco',['polemarco'],'Uno de los nueve arcontes. Antiguamente mandaba el ejército; ahora se ocupa sobre todo de los pleitos de los metecos.'],
['Estratego',['estratego','estrategos'],'Los diez generales, elegidos a mano alzada y reelegibles. Son de los pocos cargos que no se sortean.'],
['Heliea',['heliea'],'El gran tribunal popular. Cada año se sortean seis mil jurados mayores de treinta años.'],
['Jurado',['jurado','jurados','dicasta','dicastas'],'El dicasta: ciudadano sorteado para juzgar. Cobra tres óbolos al día y vota en secreto con fichas de bronce.'],
['Kleroterion',['kleroterion','klerotérion'],'Máquina de sorteo de piedra con ranuras para las fichas de los ciudadanos y un tubo con bolas blancas y negras.'],
['Sorteo',['sorteo','sorteos','sorteado','sorteados'],'En la democracia ateniense casi todos los cargos se reparten por sorteo: se considera más igualitario que la elección.'],
['Óbolo',['óbolo','óbolos'],'Moneda pequeña de plata. Seis óbolos hacen una dracma. Un jurado cobra tres al día.'],
['Dracma',['dracma','dracmas'],'Moneda de plata de unos 4,3 gramos, con la lechuza de Atenea. Es más o menos el jornal de un artesano.'],
['Mina',['mina','minas'],'Unidad de cuenta: cien dracmas.'],
['Talento',['talento','talentos'],'Unidad de cuenta enorme: sesenta minas, seis mil dracmas, unos 26 kilos de plata. Con un talento se paga una trirreme un mes.'],
['Meteco',['meteco','metecos','meteca','metecas'],'Extranjero libre que vive en Atenas. Paga un impuesto especial, sirve en el ejército y no puede votar ni tener tierras.'],
['Ciudadano',['ciudadano','ciudadanos','ciudadanía'],'Varón libre, hijo de padre y madre atenienses e inscrito en su demo a los dieciocho años. Solo él vota y ocupa cargos.'],
['Demo',['demo','demos'],'Barrio o aldea del Ática (hay unos 139). Cada ciudadano lleva el nombre de su demo, por ejemplo «de Acarnas».'],
['Tribu',['tribu','tribus'],'Las diez tribus de Clístenes, cada una con demos de la costa, del interior y de la ciudad. Organizan el Consejo y el ejército.'],
['Fratría',['fratría','fratrías'],'Hermandad religiosa de familias. El padre presenta en ella a sus hijos durante las Apaturias.'],
['Oikos',['oikos'],'La casa en sentido amplio: la familia, los esclavos, las tierras y los bienes, bajo la autoridad del padre.'],
['Kyrios',['kyrios'],'El tutor legal de una mujer: su padre, su marido o su pariente varón más cercano. Ella no puede firmar contratos importantes.'],
['Dote',['dote','dotes'],'Bienes que la familia de la novia entrega al casarse. Si hay divorcio, el marido debe devolverla.'],
['Epiclera',['epiclera','epicleras'],'Hija sin hermanos varones que hereda la casa. Debe casarse con su pariente más próximo para que los bienes sigan en la familia.'],
['Gineceo',['gineceo'],'Las habitaciones de las mujeres, en la parte más reservada de la casa.'],
['Andrón',['andrón'],'La sala de los hombres, donde se celebran los banquetes con los invitados recostados en lechos.'],
['Banquete',['banquete','banquetes','simposio','symposion'],'El symposion: reunión de hombres para beber vino mezclado con agua, conversar, cantar y escuchar música, después de cenar.'],
['Hetera',['hetera','heteras'],'Compañera de banquetes, a menudo música y culta, que vive de su trato con los hombres. No es esposa ni ciudadana.'],
['Crátera',['crátera','cráteras'],'Vasija grande donde se mezcla el vino con agua en los banquetes. Beber el vino puro se considera cosa de bárbaros.'],
['Ánfora',['ánfora','ánforas'],'Vasija de dos asas para transportar y guardar vino, aceite o grano.'],
['Hidria',['hidria','hidrias'],'Vasija de tres asas para traer agua de la fuente. Ir por agua es tarea de las mujeres y las esclavas.'],
['Chiton',['chiton','quitón'],'Túnica de lino o lana, la prenda básica de hombres y mujeres.'],
['Himation',['himation'],'Manto de lana que se lleva sobre el chiton, envuelto en el cuerpo y echado sobre el hombro izquierdo.'],
['Peplo',['peplo','peplos'],'Vestido femenino de lana, con un pliegue doblado por arriba. En las Panateneas se ofrece un peplo nuevo a Atenea.'],
['Estela',['estela','estelas'],'Losa de piedra vertical con una inscripción o un relieve: leyes, decretos, tratados o lápidas funerarias.'],
['Stoa',['stoa','stoas','pórtico','pórticos'],'Edificio alargado con una columnata abierta delante: sombra, paseo, tiendas y oficinas públicas.'],
['Stoa Poikile',['stoa poikile','poikile'],'El «pórtico pintado» del Ágora, con grandes cuadros de la batalla de Maratón y de Troya.'],
['Bouleuterion',['bouleuterion'],'Sala de reuniones del Consejo de los Quinientos, en el Ágora.'],
['Metroon',['metroon'],'El antiguo Bouleuterion, dedicado a la Madre de los dioses, que ahora sirve de archivo de la ciudad.'],
['Tolos',['tolos','tholos'],'Edificio redondo del Ágora donde comen y duermen los prítanos de turno.'],
['Bema',['bema'],'Tribuna de piedra desde la que hablan los oradores en la Pnyx.'],
['Gimnasio',['gimnasio','gimnasios','palestra','palestras'],'Lugar de ejercicio al aire libre, con pistas y patios de lucha. También se conversa y se enseña allí.'],
['Academia',['academia'],'Gimnasio y bosque sagrado del héroe Academo, fuera de las murallas. Allí ha empezado Platón a reunir discípulos.'],
['Liceo',['liceo'],'Gimnasio de Apolo Liceo, al este de la ciudad, junto al río Iliso.'],
['Cinosarges',['cinosarges'],'Gimnasio de Heracles, fuera de las murallas, abierto a los hijos de madre extranjera. Allí enseña Antístenes.'],
['Efebo',['efebo','efebos','efebía'],'Joven de dieciocho a veinte años que se entrena como soldado y hace guardia en las fronteras.'],
['Pedagogo',['pedagogo','pedagogos'],'Esclavo que acompaña a los niños a la escuela y los vigila. No es el maestro.'],
['Nodriza',['nodriza','nodrizas'],'Mujer, a menudo esclava, que amamanta y cría a los niños de una familia.'],
['Paideia',['paideia'],'La educación completa de un griego: letras, música, gimnasia y formación del carácter.'],
['Sofista',['sofista','sofistas'],'Maestro ambulante que cobra por enseñar retórica y el arte de triunfar en política.'],
['Retórica',['retórica'],'El arte de hablar en público para convencer, imprescindible en la Asamblea y los tribunales.'],
['Logógrafo',['logógrafo','logógrafos'],'Quien escribe discursos para otros. En los juicios cada uno habla por sí mismo, pero puede comprar el texto.'],
['Sicofanta',['sicofanta','sicofantas'],'Denunciante profesional que acusa a otros para chantajearlos o cobrar una parte de la multa.'],
['Graphé',['graphé'],'Acusación pública: cualquier ciudadano puede presentarla en nombre de la ciudad, no solo la víctima.'],
['Ostracismo',['ostracismo','ostracon','óstraka'],'Votación en la que cada ciudadano escribía un nombre en un trozo de cerámica. El más votado era desterrado diez años.'],
['Liturgia',['liturgia','liturgias'],'Servicio público que pagan los ricos: equipar un coro, una trirreme o una fiesta.'],
['Corego',['corego','coregos','coregía'],'Ciudadano rico que paga y prepara un coro para los concursos de teatro, como liturgia.'],
['Trierarca',['trierarca','trierarcas','trierarquía'],'Ciudadano rico que paga el mantenimiento de una trirreme durante un año y la manda.'],
['Trirreme',['trirreme','trirremes'],'Barco de guerra con tres filas de remeros, unos 170, y un espolón de bronce. Base del poder naval ateniense.'],
['Hoplita',['hoplita','hoplitas'],'Soldado de infantería pesada con escudo redondo, lanza, yelmo y coraza, que se paga su propio equipo.'],
['Falange',['falange'],'Formación cerrada de hoplitas en filas, cada uno protegido por el escudo de su vecino.'],
['Metronomo',['metronomo','metronomos','agoránomo','agoránomos'],'Inspectores del mercado: comprueban pesas, medidas y la calidad de lo que se vende.'],
['Trapezita',['trapezita','trapezitas','cambista','cambistas'],'Banquero o cambista que trabaja en una mesa (trápeza) en el Ágora: cambia moneda, guarda depósitos y presta.'],
['Éranos',['éranos'],'Préstamo sin interés entre amigos, que ponen dinero entre todos para ayudar a uno.'],
['Horos',['horos','mojón','mojones'],'Mojón de piedra que marca un límite o indica que un terreno está hipotecado.'],
['Proxeno',['proxeno','proxenos','proxenía'],'Ciudadano que defiende en su ciudad los intereses de otra ciudad y atiende a sus viajeros.'],
['Xenía',['xenía','hospitalidad'],'El deber sagrado de hospitalidad entre anfitrión y huésped, protegido por Zeus.'],
['Polis',['polis'],'La ciudad-estado: una ciudad con su territorio, sus leyes, sus dioses y sus ciudadanos.'],
['Ática',['ática'],'La región de Atenas: unos 2.500 km² de llanuras, montes y costa, con sus demos.'],
['Muros Largos',['muros largos'],'Dos murallas de unos seis kilómetros que unen Atenas con el Pireo, para resistir un asedio por mar.'],
['Pireo',['pireo'],'El puerto de Atenas, con sus arsenales, mercados y barrios de marinos y metecos.'],
['Los Treinta',['los treinta','treinta tiranos'],'Oligarquía impuesta por Esparta en el 404 tras la derrota de Atenas. Mataron a unos 1.500 atenienses; la democracia volvió en el 403.'],
['Paz del Rey',['paz del rey'],'Tratado del 387-386 dictado por el rey de Persia: Jonia queda para Persia y las ciudades griegas deben ser autónomas.'],
['Gran Rey',['gran rey'],'Así llaman los griegos al rey de Persia, Artajerjes II en el 386.'],
['Sátrapa',['sátrapa','sátrapas'],'Gobernador de una provincia del imperio persa.'],
['Liga de Delos',['liga de delos'],'Alianza naval dirigida por Atenas desde el 478, que acabó siendo su imperio. Se disolvió con la derrota del 404.'],
['Esparta',['esparta','espartano','espartanos'],'La gran rival de Atenas, en el Peloponeso: una ciudad de soldados que vive del trabajo de los ilotas.'],
['Ilota',['ilota','ilotas'],'Siervos de Esparta, descendientes de pueblos conquistados, que cultivan la tierra de los espartiatas.'],
['Éforo',['éforo','éforos'],'Los cinco magistrados que gobiernan Esparta junto a sus dos reyes.'],
['Beocia',['beocia','beocio','beocios'],'Región al norte del Ática, con Tebas como ciudad principal.'],
['Tebas',['tebas','tebano','tebanos'],'La gran ciudad de Beocia, fundada según el mito por Cadmo. Patria de Edipo, Heracles y Píndaro.'],
['Corinto',['corinto'],'Rica ciudad comercial del istmo, entre dos mares. Ha luchado con Atenas contra Esparta en la última guerra.'],
['Persia',['persia','persas'],'El gran imperio del este, el de Darío y Jerjes. Ahora financia a unas ciudades griegas contra otras.'],
['Ponto',['ponto'],'El mar Negro, de donde llega gran parte del trigo que come Atenas.'],
['Cícladas',['cícladas'],'Las islas que forman un círculo alrededor de Delos, en el centro del Egeo.'],
['Delfos',['delfos'],'Santuario de Apolo con el oráculo más famoso de Grecia, donde la Pitia da las respuestas del dios.'],
['Oráculo',['oráculo','oráculos','pitia'],'Respuesta de un dios a una consulta, o el santuario donde se da. En Delfos habla la Pitia, sacerdotisa de Apolo.'],
['Eleusis',['eleusis','eleusinos'],'Ciudad del Ática con el santuario de Deméter y Core, donde se celebran los Misterios.'],
['Misterios',['misterios','iniciado','iniciados','iniciada','iniciadas'],'Ritos secretos de Eleusis. Los iniciados juran no revelarlos y esperan un destino mejor después de la muerte.'],
['Panateneas',['panateneas'],'La gran fiesta de Atenea, en el mes de Hecatombeón, con procesión, sacrificios, concursos y un peplo nuevo para la diosa.'],
['Dionisias',['dionisias'],'Fiesta de Dioniso en primavera, con concursos de tragedia, comedia y ditirambo en el teatro.'],
['Leneas',['leneas'],'Fiesta de Dioniso en invierno, también con concursos de teatro, sobre todo de comedia.'],
['Tesmoforias',['tesmoforias'],'Fiesta de Deméter reservada a las mujeres casadas, que pasan tres días juntas sin hombres.'],
['Apaturias',['apaturias'],'Fiesta de las fratrías, en otoño, en la que los padres presentan a sus hijos recién nacidos.'],
['Adonias',['adonias'],'Fiesta de mujeres que lloran la muerte de Adonis, el amante de Afrodita, en los tejados de las casas.'],
['Canéfora',['canéfora','canéforas'],'Doncella de buena familia que lleva en la cabeza la cesta sagrada en las procesiones.'],
['Libación',['libación','libaciones'],'Ofrenda de vino, leche o aceite que se vierte en el suelo o en el altar en honor de un dios.'],
['Hecatombe',['hecatombe'],'Sacrificio de cien bueyes; en la práctica, cualquier gran sacrificio público.'],
['Tragedia',['tragedia','tragedias'],'Obra teatral seria, con coro y máscaras, basada casi siempre en los mitos de los héroes.'],
['Comedia',['comedia','comedias'],'Obra teatral cómica que se burla de políticos, filósofos y de la propia ciudad.'],
['Ditirambo',['ditirambo','ditirambos'],'Canto coral en honor de Dioniso, interpretado por cincuenta hombres o niños.'],
['Orquestra',['orquestra'],'El espacio circular del teatro donde baila y canta el coro.'],
['Aulós',['aulós'],'Instrumento de viento con dos tubos y lengüeta doble, que suena fuerte y agudo. Acompaña al coro y los sacrificios.'],
['Lira',['lira','cítara','kithara'],'Instrumento de cuerda: la lira, hecha con un caparazón de tortuga; la cítara, más grande y de madera, para los profesionales.'],
['Naos',['naos','cella','pronaos','opistodomo'],'La sala del templo donde está la estatua del dios. Delante tiene un pórtico (pronaos) y detrás otro (opistodomo).'],
['Frontón',['frontón','frontones'],'El triángulo bajo el tejado a dos aguas en la fachada de un templo, lleno de esculturas.'],
['Metopa',['metopa','metopas','triglifo','triglifos'],'En el friso dórico se alternan triglifos (placas con tres estrías) y metopas (placas con relieves).'],
['Friso',['friso','frisos'],'Banda decorada bajo la cornisa. El del Partenón muestra la procesión de las Panateneas.'],
['Cariátide',['cariátide','cariátides'],'Estatua de mujer que sostiene el techo en lugar de una columna, como en el Erecteion.'],
['Kuros',['kuros','kouros','kore'],'Estatuas arcaicas de jóvenes desnudos (kuroi) y de muchachas vestidas (korai), de pie y sonrientes.'],
['Partenón',['partenón'],'El gran templo de Atenea Pártenos (la virgen) en la Acrópolis, terminado en el 432.'],
['Erecteion',['erecteion'],'Templo de la Acrópolis con varios cultos: Atenea Polias, Poseidón y los reyes míticos Erecteo y Cécrope.'],
['Propileos',['propileos'],'La gran entrada monumental de la Acrópolis.'],
['Areópago',['areópago'],'Colina de Ares, junto a la Acrópolis, y el antiguo consejo que se reúne allí para juzgar los homicidios.'],
['Hades',['hades'],'El dios de los muertos y, por extensión, el mundo subterráneo adonde van las almas.'],
['Olimpo',['olimpo','olímpicos'],'El monte más alto de Grecia, donde según el mito viven los doce dioses principales.'],
['Ninfa',['ninfa','ninfas'],'Divinidades menores de fuentes, árboles y montes, jóvenes y hermosas.'],
['Sátiro',['sátiro','sátiros','silenos'],'Seres del cortejo de Dioniso, mitad hombres mitad caballos o cabras, borrachos y juerguistas.'],
['Ménade',['ménade','ménades','bacante','bacantes'],'Mujeres poseídas por Dioniso que corren por los montes en éxtasis.'],
['Tirso',['tirso'],'Bastón de hinojo coronado con una piña y hojas de hiedra, emblema de Dioniso y las bacantes.'],
['Égida',['égida'],'La piel mágica de cabra que llevan Zeus y Atenea, bordeada de serpientes y con la cabeza de la Gorgona.'],
['Gorgona',['gorgona','medusa'],'Monstruo de cabellos de serpiente cuya mirada convierte en piedra. Perseo le cortó la cabeza a Medusa.'],
['Héroe',['héroe','héroes','heroína'],'Hijo de un dios y un mortal, o persona extraordinaria del pasado mítico, que recibe culto en su tumba.'],
['Heracles',['heracles'],'El mayor de los héroes, hijo de Zeus y Alcmena, famoso por sus doce trabajos. Al morir subió al Olimpo.'],
['Teseo',['teseo'],'Héroe y rey mítico de Atenas que mató al Minotauro y, según se dice, unió los pueblos del Ática.'],
['Zeus',['zeus'],'Rey de los dioses, señor del cielo y del rayo. Protege a los huéspedes, los juramentos y el orden.'],
['Hera',['hera'],'Esposa de Zeus y reina de los dioses, protectora del matrimonio.'],
['Atenea',['atenea','palas'],'Diosa de la sabiduría, la guerra ordenada y los oficios, protectora de Atenas.'],
['Poseidón',['poseidón'],'Dios del mar, de los terremotos y de los caballos. Perdió frente a Atenea el patronazgo de Atenas.'],
['Apolo',['apolo'],'Dios de la música, la profecía, la medicina y la luz. Su oráculo está en Delfos.'],
['Ártemis',['ártemis'],'Diosa virgen de la caza y de los animales salvajes, protectora de las muchachas y los partos.'],
['Hermes',['hermes'],'Mensajero de los dioses, protector de los caminos, el comercio, los ladrones y guía de las almas.'],
['Herma',['herma','hermas'],'Pilar de piedra con la cabeza de Hermes, que se pone en las puertas y las encrucijadas para protegerlas.'],
['Deméter',['deméter'],'Diosa de la agricultura y el trigo, madre de Perséfone. Sus Misterios se celebran en Eleusis.'],
['Perséfone',['perséfone','core'],'Hija de Deméter, raptada por Hades. Pasa una parte del año bajo tierra; por eso hay invierno.'],
['Dioniso',['dioniso','baco'],'Dios del vino, el éxtasis y el teatro.'],
['Afrodita',['afrodita'],'Diosa del amor y la belleza, nacida de la espuma del mar según Hesíodo.'],
['Ares',['ares'],'Dios de la guerra violenta. Los atenienses lo respetan pero lo quieren poco.'],
['Hefesto',['hefesto'],'Dios del fuego y la forja, cojo, protector de herreros y artesanos.'],
['Hefestión',['hefestión'],'Templo de Hefesto y Atenea sobre la colina que domina el Ágora, rodeado de talleres de bronce.'],
['Olimpieion',['olimpieion'],'Templo gigantesco de Zeus Olímpico, empezado por los tiranos hacia el 520 y abandonado sin terminar.'],
['Sócrates',['sócrates'],'Filósofo ateniense que preguntaba a todos qué es la justicia o la virtud. Fue condenado a muerte en el 399.'],
['Platón',['platón'],'Discípulo de Sócrates. Hacia el 387 empieza a enseñar en la Academia.'],
['Pericles',['pericles'],'Político que dirigió Atenas entre el 461 y el 429 y promovió las obras de la Acrópolis.'],
['Solón',['solón'],'Legislador del 594: abolió la esclavitud por deudas y repartió los derechos según la riqueza.'],
['Clístenes',['clístenes'],'Reformador del 508 que creó las diez tribus y el Consejo de los Quinientos: el inicio de la democracia.'],
['Isócrates',['isócrates'],'Maestro de retórica que dirige una escuela en Atenas y defiende la unión de los griegos contra Persia.'],
];
// En catalán e inglés las variantes en minúsculas sin acentos no se traducen: se indexa también el término
function glIndex(){const m=new Map();GLOSS.forEach((e,i)=>e[1].forEach(v=>m.set(v.toLowerCase(),i)));
  if(LANG!=='es')GLOSS.forEach((e,i)=>{const k=e[0].toLowerCase();if(!m.has(k))m.set(k,i);});return m;}
let GL_IDX=glIndex();
let GL_RE=new RegExp('(?<![\\p{L}\\p{N}])('+[...GL_IDX.keys()].sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?![\\p{L}\\p{N}])','giu');

// glosario del modo Roma: sustituye al de Atenas en romaSetup()
const ROMA_GLOSS=[
['Senado',['senado','senadores','senador','senatorial'],'El consejo de unos seiscientos antiguos magistrados, que sirven de por vida. En el Imperio conserva prestigio y algunas funciones, pero el poder real es del emperador.'],
['Curia',['curia'],'El edificio donde se reúne el Senado. La Curia Julia del Foro la empezó César y la terminó Augusto.'],
['Cónsul',['cónsul','cónsules','consulado'],'Los dos magistrados supremos, elegidos cada año. Dan nombre al año. En el Imperio, el emperador decide quién lo será.'],
['Pretor',['pretor','pretores'],'Magistrado encargado de la justicia, por debajo de los cónsules.'],
['Cuestor',['cuestor','cuestura'],'El primer cargo de la carrera senatorial: administra fondos públicos y da entrada en el Senado.'],
['Edil',['edil','ediles'],'Magistrado que cuida de calles, mercados, templos y juegos públicos.'],
['Tribuno de la plebe',['tribuno de la plebe'],'Magistrado creado para defender a la plebe frente a los patricios, con derecho de veto.'],
['Cursus honorum',['cursus honorum','carrera de los honores'],'La «carrera de los honores»: el orden fijo de cargos públicos (cuestor, edil o tribuno, pretor, cónsul) con edades mínimas.'],
['Príncipe',['príncipe','princeps'],'«El primero» de los ciudadanos: así se presentaba Augusto. Es el título oficioso del emperador.'],
['Emperador',['emperador','emperadores'],'En latín, imperator: el general victorioso. Desde Augusto, el gobernante único de Roma, aunque las instituciones de la República siguen existiendo.'],
['Pretorianos',['pretoriano','pretorianos','pretoriana','guardia pretoriana'],'La guardia del emperador, acampada en Roma. Cobraban mucho más que los legionarios y llegaron a poner y quitar emperadores.'],
['Legión',['legión','legiones','legionario','legionarios'],'Unidad de unos cinco mil ciudadanos de infantería pesada, dividida en diez cohortes. El Imperio tenía unas veintiocho.'],
['Centurión',['centurión','centuria','centurias'],'Oficial al mando de una centuria, unos ochenta hombres. Es la columna vertebral del ejército.'],
['Auxiliares',['auxiliares'],'Soldados que no eran ciudadanos romanos: caballería, arqueros, honderos. Recibían la ciudadanía al licenciarse.'],
['Vigiles',['vigiles','vigil'],'Las siete cohortes de libertos que patrullaban Roma de noche y apagaban los incendios. Las creó Augusto.'],
['Lictor',['lictor','lictores'],'Escolta de los magistrados, que llevaba las fasces: un haz de varas con un hacha, símbolo del poder de castigar.'],
['Triunfo',['triunfo','triunfos'],'El desfile del general victorioso por Roma hasta el Capitolio, con el botín y los prisioneros.'],
['Toga',['toga','togas'],'El manto de lana blanca del ciudadano romano, de forma semicircular y difícil de colocar. Era obligatoria en actos oficiales.'],
['Túnica',['túnica','túnicas'],'La prenda básica de hombres y mujeres, de lana o lino, con cinturón. Los senadores la llevaban con una franja púrpura.'],
['Foro',['foro','foros'],'La plaza pública de una ciudad romana: mercado, centro político, religioso y judicial.'],
['Basílica',['basílica','basílicas'],'Gran sala cubierta junto al foro para tribunales y negocios. Su forma la heredarán las iglesias cristianas.'],
['Rostra',['rostra'],'La tribuna de los oradores del Foro, adornada con espolones de naves enemigas.'],
['Anfiteatro',['anfiteatro','anfiteatros'],'Edificio elíptico para combates de gladiadores y cacerías de fieras. El Anfiteatro Flavio es el mayor.'],
['Gladiador',['gladiador','gladiadores'],'Luchador de los espectáculos, casi siempre esclavo, prisionero o condenado, entrenado en una escuela (ludus).'],
['Mirmilón',['mirmilón'],'Gladiador con casco de pez, escudo largo y espada corta.'],
['Reciario',['reciario'],'Gladiador con red, tridente y puñal, casi sin armadura.'],
['Tracio',['tracio'],'Gladiador con escudo pequeño y espada curva, al estilo de los guerreros de Tracia.'],
['Rudis',['rudis'],'La espada de madera que recibía el gladiador al ser liberado del combate.'],
['Editor',['editor'],'Quien paga y preside los juegos. Decide si un gladiador vencido vive o muere.'],
['Circo',['circo','circos'],'Pista alargada para las carreras de carros. El Circo Máximo es el mayor de Roma.'],
['Espina',['espina'],'El muro bajo que divide la pista del circo, con estatuas, obeliscos y contadores de vueltas.'],
['Cárceres',['cárceres'],'Las puertas de salida de los carros, en el extremo del circo.'],
['Auriga',['auriga','aurigas'],'El conductor de carros de carreras, normalmente esclavo o liberto. Los mejores eran ídolos ricos.'],
['Facciones',['facción','facciones'],'Las cuatro empresas de carreras: verdes, azules, rojos y blancos, con seguidores apasionados.'],
['Cuadriga',['cuadriga','cuadrigas','biga','bigas'],'Carro tirado por cuatro caballos (o dos, la biga).'],
['Termas',['termas','baños públicos'],'Baños públicos con palestra, piscinas y salas a distintas temperaturas. Eran centros sociales.'],
['Frigidario',['frigidario'],'La sala de agua fría de las termas.'],
['Tepidario',['tepidario'],'La sala templada de las termas.'],
['Caldario',['caldario'],'La sala caliente de las termas, con baño de agua caliente.'],
['Hipocausto',['hipocausto'],'Calefacción bajo el suelo: el aire caliente de un horno circula entre pilas de ladrillo.'],
['Estrígilo',['estrígilo'],'Rascador curvo de metal para quitarse de la piel el aceite, el sudor y la suciedad.'],
['Palestra',['palestra'],'Patio para el ejercicio y la lucha.'],
['Ínsula',['ínsula','ínsulas'],'Bloque de pisos de alquiler de varias plantas, con tiendas abajo. Vivienda de la mayoría de los romanos.'],
['Domus',['domus'],'La casa unifamiliar de los ricos, cerrada a la calle, con atrio y peristilo.'],
['Atrio',['atrio'],'La sala principal de la domus, con una abertura en el techo (compluvio) y un estanque debajo (impluvio).'],
['Impluvio',['impluvio','compluvio'],'El estanque del atrio que recoge la lluvia que entra por la abertura del techo (compluvio).'],
['Tablino',['tablino'],'La sala de recepción del señor de la casa, al fondo del atrio.'],
['Peristilo',['peristilo'],'Jardín rodeado de columnas en el interior de la casa.'],
['Patrono',['patrono','patronos'],'Hombre influyente que protege a sus clientes, o antiguo amo de un liberto.'],
['Cliente',['cliente','clientes'],'Persona que depende de un patrono: le saluda cada mañana, le acompaña y le apoya a cambio de protección y regalos.'],
['Salutatio',['salutatio'],'La visita matinal de los clientes a casa de su patrono para saludarle.'],
['Espórtula',['espórtula'],'El pequeño regalo en dinero o comida que el patrono da a sus clientes.'],
['Liberto',['liberto','libertos','liberta'],'Antiguo esclavo liberado. Si su amo era ciudadano, él también lo es, aunque con limitaciones.'],
['Manumisión',['manumisión'],'El acto legal de liberar a un esclavo.'],
['Peculio',['peculio'],'El dinero que un esclavo podía ahorrar y administrar, a veces para comprar su libertad.'],
['Annona',['annona'],'El abastecimiento de trigo de Roma y su reparto gratuito a los ciudadanos inscritos.'],
['Modio',['modio','modios'],'Medida de capacidad para el grano, de unos 8,7 litros.'],
['Sestercio',['sestercio','sestercios'],'La moneda de cuenta romana, de latón. Cuatro sestercios hacen un denario.'],
['Denario',['denario','denarios'],'Moneda de plata que vale cuatro sestercios.'],
['As',['as'],'Moneda de cobre que vale un cuarto de sestercio.'],
['Cuadrante',['cuadrante','cuadrantes'],'La moneda más pequeña: un cuarto de as. Es lo que cuesta entrar en unas termas.'],
['Vestales',['vestal','vestales'],'Las seis sacerdotisas de Vesta, que guardaban el fuego sagrado durante treinta años.'],
['Vesta',['vesta'],'Diosa del hogar y del fuego sagrado de Roma.'],
['Pontífice máximo',['pontífice máximo','pontífice'],'El jefe de la religión pública romana. Desde Augusto, el cargo lo tiene el emperador.'],
['Augur',['augur','augures','auspicios'],'Sacerdote que interpretaba la voluntad de los dioses observando el vuelo de las aves (los auspicios).'],
['Lituo',['lituo'],'El bastón curvo de los augures.'],
['Arúspice',['arúspice','arúspices'],'Adivino de origen etrusco que leía las entrañas de los animales sacrificados.'],
['Lares',['lares'],'Dioses protectores de la casa y de las encrucijadas.'],
['Penates',['penates'],'Dioses de la despensa y de la familia; también los dioses de Troya que trajo Eneas.'],
['Genio',['genio'],'El espíritu protector de cada hombre, especialmente del padre de familia.'],
['Pax deorum',['pax deorum'],'La paz con los dioses: la buena relación que los ritos públicos debían mantener.'],
['Júpiter',['júpiter'],'El dios supremo de Roma, señor del cielo, venerado en el Capitolio con Juno y Minerva.'],
['Juno',['juno'],'Esposa de Júpiter, diosa de las mujeres y del matrimonio.'],
['Minerva',['minerva'],'Diosa de la sabiduría y de los oficios, equivalente a la Atenea griega.'],
['Marte',['marte'],'Dios de la guerra y padre de Rómulo y Remo.'],
['Jano',['jano'],'Dios de las puertas y los comienzos, con dos caras. Las puertas de su templo se cerraban en tiempo de paz.'],
['Venus',['venus'],'Diosa del amor, madre de Eneas y antepasada de la familia de César.'],
['Esculapio',['esculapio'],'El dios médico, el Asclepio griego, traído de Epidauro a la isla del Tíber.'],
['Saturnales',['saturnales'],'Fiesta de diciembre en honor de Saturno: banquetes, regalos y esclavos sentados a la mesa con sus amos.'],
['Lupercales',['lupercales','lupercal'],'Fiesta de febrero en la que unos jóvenes corrían alrededor del Palatino azotando con tiras de piel de cabra.'],
['Libros sibilinos',['libros sibilinos'],'Colección de profecías que los romanos consultaban en momentos de crisis.'],
['Acueducto',['acueducto','acueductos'],'Conducción de agua por gravedad desde manantiales lejanos, casi siempre bajo tierra y sobre arcos en los valles.'],
['Specus',['specus'],'El canal cubierto por donde corre el agua de un acueducto.'],
['Curator aquarum',['curator aquarum'],'El senador encargado de los acueductos de Roma.'],
['Hormigón',['hormigón'],'El opus caementicium: cal, arena volcánica, agua y piedras. Permitió a los romanos construir bóvedas y puertos.'],
['Puteoli',['puteoli'],'Pozzuoli, puerto de Campania. Su arena volcánica (pozzolana) hacía fraguar el hormigón incluso bajo el agua.'],
['Bóveda',['bóveda','bóvedas','cúpula'],'Techo curvo que reparte el peso hacia los lados; la cúpula es una bóveda que gira sobre sí misma.'],
['Casa Dorada',['casa dorada','domus aurea'],'El gigantesco palacio de Nerón tras el incendio del 64, con un lago donde luego se construyó el anfiteatro.'],
['Vesubio',['vesubio'],'El volcán de Campania que en el 79 sepultó Pompeya, Herculano y Estabia.'],
['Pompeya',['pompeya','herculano','estabia'],'Ciudades de Campania sepultadas por la erupción del Vesubio del 79. Sus ruinas se excavan desde el siglo XVIII.'],
['Estoicismo',['estoicismo','estoico','estoicos','estoica'],'Filosofía fundada por Zenón en Atenas: vivir según la razón y la naturaleza y no dejarse dominar por lo que no depende de uno.'],
['Stoa',['stoa'],'El Pórtico Pintado de Atenas, donde enseñaba Zenón; de ahí el nombre de «estoicos».'],
['Lógos',['lógos'],'Para los estoicos, la razón que ordena el universo.'],
['Sofista',['sofista','sofistas'],'En época romana, conferenciante griego famoso por sus discursos improvisados.'],
['Retórica',['retórica'],'El arte de hablar en público para persuadir. Era la base de la educación superior romana.'],
['Centunviros',['centunviros'],'El tribunal de unos 180 jueces que decidía los pleitos de herencias en la Basílica Julia.'],
['Epigrama',['epigrama','epigramas'],'Poema breve e ingenioso, a menudo satírico, con remate final. Marcial es su gran maestro.'],
['Códice',['códice','códices','pergamino'],'Libro de hojas de pergamino cosidas, como los nuestros, que empezó a competir con el rollo en el siglo I.'],
['Papiro',['papiro'],'Material de escritura hecho con una planta del Nilo. Los libros eran rollos de papiro.'],
['Argileto',['argileto'],'Calle que sale del Foro hacia la Subura, famosa por sus librerías.'],
['Subura',['subura'],'El barrio más poblado y ruidoso de Roma, entre el Esquilino y el Viminal.'],
['Palatino',['palatino'],'La colina de Rómulo y de los palacios imperiales; de su nombre viene «palacio».'],
['Capitolio',['capitolio','capitolino'],'La colina sagrada de Roma, con el templo de Júpiter Óptimo Máximo.'],
['Campo de Marte',['campo de marte'],'La llanura junto al Tíber, antiguo campo de entrenamiento militar, llena de monumentos.'],
['Trastévere',['trastévere'],'El barrio «al otro lado del Tíber»: artesanos, marineros y extranjeros.'],
['Tíber',['tíber'],'El río de Roma. Lo llamaban «el rubio Tíber» por el color de sus aguas cargadas de limo.'],
['Ostia',['ostia'],'El puerto de Roma en la desembocadura del Tíber. Claudio construyó allí un gran puerto nuevo.'],
['Judea',['judea','jerusalén'],'La provincia judía del Imperio. La rebelión del 66 terminó con la destrucción de Jerusalén y su Templo en el 70.'],
['Menorá',['menorá','candelabro de siete brazos','candelabro'],'El candelabro de oro de siete brazos del Templo de Jerusalén, llevado a Roma como botín.'],
['Isis',['isis'],'Gran diosa egipcia, esposa de Osiris y madre de Horus, venerada en todo el Imperio como madre protectora.'],
['Serapis',['serapis'],'Dios creado en Alejandría que unía a Osiris con rasgos de Zeus; compañero de Isis.'],
['Sistro',['sistro','sistros'],'Sonajero de bronce con varillas que tocaban los sacerdotes y fieles de Isis.'],
['Gran Madre',['gran madre','magna mater','cibeles'],'Diosa frigia de la naturaleza y de las ciudades, traída a Roma en el 204 a.C.'],
['Megalesias',['megalesias'],'Juegos de la Gran Madre, del 4 al 10 de abril, con obras de teatro.'],
['Atis',['atis'],'Joven pastor amado por la Gran Madre, que murió y volvió a la vida.'],
['Iseo',['iseo'],'Templo de Isis. El de Roma estaba en el Campo de Marte.'],
['Sinagoga',['sinagoga','sinagogas'],'Lugar de reunión y oración de las comunidades judías.'],
['Cristianos',['cristianos','cristiana','cristiano'],'Seguidores de Jesús de Nazaret. En el 80 eran un grupo pequeño que se reunía en casas.'],
['Flavios',['flavios','flavia','flavio'],'La dinastía de Vespasiano y sus hijos Tito y Domiciano (69-96).'],
['Tito',['tito'],'Emperador del 79 al 81, hijo de Vespasiano. Tomó Jerusalén en el 70 e inauguró el anfiteatro.'],
['Vespasiano',['vespasiano'],'Emperador del 69 al 79, fundador de la dinastía Flavia. Restauró las finanzas y empezó el anfiteatro.'],
['Domiciano',['domiciano'],'Hermano de Tito, emperador del 81 al 96. Construyó el gran palacio del Palatino.'],
['Nerón',['nerón'],'Último emperador de la familia de Augusto (54-68). Tras el incendio del 64 construyó la Casa Dorada.'],
['Augusto',['augusto'],'Octavio, sobrino nieto de César, primer emperador (27 a.C.-14 d.C.).'],
['César',['césar','julio césar'],'Gayo Julio César, dictador asesinado en el 44 a.C. Su nombre se convirtió en título de los emperadores.'],
['Año de los cuatro emperadores',['año de los cuatro emperadores','galba','otón','vitelio'],'El 69 d.C.: tras la muerte de Nerón se sucedieron Galba, Otón y Vitelio, hasta que venció Vespasiano.'],
['Eneas',['eneas'],'Héroe troyano, hijo de Venus, que huyó de Troya y llegó al Lacio. Antepasado legendario de los romanos.'],
['Rómulo',['rómulo','remo'],'Los gemelos hijos de Marte amamantados por una loba. Rómulo fundó Roma en el 753 a.C., según la leyenda.'],
['Homero',['homero'],'El poeta griego de la Ilíada y la Odisea, base de la educación griega y modelo de Virgilio.'],
['Virgilio',['virgilio','eneida'],'El gran poeta de Augusto, autor de la Eneida. Los niños romanos aprendían a leer con él.'],
['Ovidio',['ovidio','metamorfosis'],'Poeta de época de Augusto, autor de las Metamorfosis y de poemas de amor. Murió desterrado en el mar Negro.'],
['Livio',['livio'],'Tito Livio, historiador de época de Augusto: contó la historia de Roma desde su fundación en 142 libros.'],
['Cicerón',['cicerón'],'El mayor orador de Roma (106-43 a.C.), cónsul, filósofo y autor de cientos de cartas.'],
['Séneca',['séneca'],'Filósofo estoico y maestro de Nerón, obligado a suicidarse en el 65.'],
['Hipócrates',['hipócrates','humores'],'El médico griego de Cos (siglo V a.C.). Según su escuela, la salud es el equilibrio de cuatro humores.'],
['Hispania',['hispania','bílbilis','calagurris'],'La península ibérica, provincia romana. De allí venían Marcial (Bílbilis), Quintiliano (Calagurris) y Séneca (Córdoba).'],
['Britania',['britania','caledonia'],'La provincia romana en la actual Inglaterra, conquistada desde el 43. Caledonia es la actual Escocia.'],
['Bitinia',['bitinia','prusa'],'Región griega del noroeste de Asia Menor, en la actual Turquía.'],
['Atenas',['atenas'],'La gran ciudad griega, en época romana una ciudad pequeña pero todavía la «escuela de Grecia».'],
['Safo',['safo'],'Poetisa griega de Lesbos (siglo VII-VI a.C.), la más famosa de la Antigüedad.'],
['Sabinas',['sabinas','sabinos'],'Pueblo vecino de Roma. Según la leyenda, Rómulo raptó a sus mujeres para poblar la ciudad.'],
['Gíaros',['gíaros'],'Isla rocosa y sin agua del Egeo, lugar de destierro.']
];
function rebuildGloss(){GL_IDX=glIndex();
  GL_RE=new RegExp('(?<![\\p{L}\\p{N}])('+[...GL_IDX.keys()].sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?![\\p{L}\\p{N}])','giu');}


// ------------------------------------------------------------ latinismos (Tito Verrio, gramático del Foro)
// Lista de latinismos de las PAU de Lengua y Cultura Latinas recogida en El Foc de Prometeu (elfocdeprometeu.cat/llatinismes);
// las explicaciones están redactadas aquí en castellano. [expresión, traducción literal, uso y origen]
const LATIN=[
['A posteriori','«a partir de lo posterior»','Conocimiento que se obtiene después de la experiencia o de los hechos. Viene de la filosofía; equivale a «posteriormente».'],
['A priori','«a partir de lo anterior»','Lo que se sabe o se supone antes de la experiencia. También de origen filosófico; equivale a «de antemano».'],
['a. m. (ante meridiem)','«antes del mediodía»','Indica las horas entre medianoche y mediodía en el reloj de doce horas.'],
['Ab illo tempore','«desde aquel tiempo»','Para hablar de un pasado muy lejano o de otra etapa de la vida.'],
['Accésit','«se ha acercado»','En un concurso, la distinción que se da a quien queda cerca de los premios principales.'],
['Ad hoc','«para esto»','Algo hecho expresamente para un caso concreto: un formulario ad hoc, una comisión ad hoc.'],
['Ad Kalendas Graecas','«para las calendas griegas»','Las calendas eran el primer día del mes romano (de ahí «calendario»), pero los griegos no las tenían. Aplazar algo hasta ellas es aplazarlo para nunca. Según Suetonio, era una expresión favorita de Augusto.'],
['Ad nauseam','«hasta la náusea»','Algo repetido tantas veces o tan largo que llega a hartar.'],
['Agenda','«las cosas que hay que hacer»','La lista de tareas o asuntos pendientes, y también la libreta donde se apuntan.'],
['Alea iacta est','«la suerte está echada» (literalmente, «el dado ha sido lanzado»)','Lo habría dicho Julio César al cruzar el río Rubicón con su ejército en el 49 a.C., empezando la guerra civil. Se usa cuando ya no hay vuelta atrás.'],
['Alias','«de otro modo»','Introduce el apodo con el que se conoce a alguien, a menudo a un delincuente.'],
['Alter ego','«otro yo»','Un amigo inseparable, o un personaje en el que un autor se refleja a sí mismo.'],
['Audaces fortuna iuvat','«la fortuna ayuda a los audaces»','Se dice para animar a alguien ante una empresa difícil. Aparece en Virgilio (Eneida X 284) y, en otra forma, en una carta de Plinio el Joven sobre su tío y el Vesubio. Equivale a «quien no arriesga no gana».'],
['Aurea mediocritas','«dorada medianía»','La virtud del término medio, sin excesos. La expresión es de Horacio (Odas II 10), que recoge el «nada en exceso» de Delfos.'],
['Beatus ille','«dichoso aquel»','Comienzo de un poema de Horacio (Epodos 2) que alaba la vida tranquila del campo, lejos de la ciudad y sus intrigas.'],
['Bis','«dos veces»','La repetición de una pieza que pide el público con sus aplausos; también un número de calle repetido: «número 12 bis».'],
['Casus belli','«motivo de guerra»','El hecho que provoca o sirve para justificar una guerra.'],
['Coitus interruptus','«coito interrumpido»','Término médico para un método anticonceptivo muy poco seguro.'],
['Conditio sine qua non','«condición sin la cual no»','Requisito imprescindible para que algo ocurra.'],
['Cum laude','«con alabanza»','Máxima calificación de una tesis doctoral o de unos estudios universitarios.'],
['Curriculum vitae','«carrera de la vida»','Documento con los estudios y la experiencia laboral de una persona. Para un romano, la carrera por excelencia era el cursus honorum.'],
['De facto','«de hecho»','Lo que ocurre en la realidad, aunque no sea legal o reconocido. Se opone a de iure.'],
['De gustibus non disputandum','«sobre gustos no hay que discutir»','Se dice para cerrar una discusión en la que cuenta solo el gusto de cada uno.'],
['De iure','«de derecho»','Lo que corresponde según la ley o sobre el papel, aunque la realidad sea otra. Se opone a de facto.'],
['Déficit','«falta»','Cuando los gastos superan los ingresos, o en general cuando algo no alcanza lo necesario.'],
['Delirium tremens','«delirio tembloroso»','Alucinaciones y temblores que sufre un alcohólico al dejar de beber.'],
['Dura lex, sed lex','«la ley es dura, pero es la ley»','Hay que cumplir las leyes aunque parezcan duras. Resume un principio del derecho romano recogido en el Digesto de Justiniano.'],
['Errare humanum est','«equivocarse es humano»','Invita a perdonar los errores, porque todos nos equivocamos alguna vez.'],
['Esnob','(del inglés snob)','Quien presume de gustos refinados para distinguirse de los demás. Se dice que viene de «s. nob.» (sine nobilitate, «sin nobleza»), una anotación de Oxford, pero lo más probable es que sea una palabra dialectal inglesa: un latinismo falso.'],
['Etcétera (etc.)','«y las demás cosas»','Abrevia una enumeración que podría continuar.'],
['Ex aequo','«desde lo igual»','Empate en un concurso o competición: dos premiados en el mismo puesto.'],
['Ex libris','«de entre los libros (de…)»','Sello o etiqueta que indica a quién pertenece un libro.'],
['Facta, non verba','«hechos, no palabras»','Se pide para exigir acciones y no promesas vacías.'],
['Honoris causa','«por causa de honor»','Título de doctor que concede una universidad por méritos extraordinarios, sin haber cursado allí el doctorado.'],
['Idem (id.)','«lo mismo»','Para no repetir algo ya dicho, por ejemplo una referencia bibliográfica.'],
['Ignorantia legis non excusat','«la ignorancia de la ley no exime»','Principio jurídico: nadie puede librarse de un delito diciendo que no conocía la ley.'],
['In albis','«en blanco»','Quedarse sin saber qué decir, por ejemplo en un examen.'],
['In articulo mortis','«en el momento de la muerte»','Se usa en derecho para lo que alguien hace o dispone a punto de morir.'],
['In crescendo','«creciendo»','Algo que aumenta poco a poco; en música, un sonido cada vez más intenso.'],
['In dubio pro reo','«en la duda, a favor del acusado»','Principio de la presunción de inocencia: si no hay pruebas suficientes, se absuelve.'],
['In extenso','«por extenso»','Explicado con todo detalle, sin resumir.'],
['In extremis','«en los últimos momentos»','Algo que se consigue en el último instante posible: un gol en el último minuto, un trámite al acabar el plazo.'],
['In fraganti (in flagranti)','«en flagrante (delito)»','Sorprender a alguien en el mismo momento en que comete una falta.'],
['In mente','«en la mente»','Tener algo pensado o pendiente.'],
['In situ','«en el lugar»','En el mismo sitio donde ocurre o se encuentra algo.'],
['In vitro','«en el vidrio»','Lo que se hace en un recipiente de laboratorio; se popularizó con la fecundación in vitro.'],
['In vivo','«en lo vivo»','Experimentos dentro de un organismo vivo, por oposición a in vitro.'],
['INRI (Iesus Nazarenus Rex Iudaeorum)','«Jesús Nazareno, rey de los judíos»','Las siglas del letrero burlesco que pusieron en la cruz de Jesús. Por eso «para más inri» significa «para colmo de males».'],
['Intelligenti pauca','«al inteligente, pocas (palabras)»','A buen entendedor, pocas palabras bastan.'],
['Inter nos','«entre nosotros»','Para pedir discreción sobre lo que se va a decir.'],
['Ínterim','«entretanto»','El tiempo intermedio entre dos situaciones; de ahí «interino», quien ocupa un puesto de forma provisional.'],
['Ipso facto','«por el hecho mismo»','Inmediatamente, en el acto.'],
['Lapsus','«resbalón»','Error involuntario, sobre todo al hablar (lapsus linguae) o al escribir (lapsus calami).'],
['Lato sensu','«en sentido amplio»','Entender un término de la manera más amplia. Se opone a stricto sensu.'],
['Maremágnum','«mar grande»','Confusión, desorden, abundancia caótica. Quizá viene de una bula papal llamada Mare magnum que dio privilegios a una orden religiosa y provocó muchas protestas.'],
['Mea culpa','«por mi culpa»','Frase de una oración cristiana; «entonar el mea culpa» es reconocer la propia culpa.'],
['Memorándum','«lo que hay que recordar»','Resumen de lo más importante de un asunto, o informe de una institución.'],
['Mens sana in corpore sano','«mente sana en cuerpo sano»','Verso de Juvenal (Sátiras X 356): lo que hay que pedir a los dioses es salud del cuerpo y del espíritu.'],
['Modus operandi','«modo de operar»','La manera de actuar de alguien, sobre todo de un delincuente.'],
['Modus vivendi','«modo de vivir»','La manera en que alguien se gana la vida o se organiza.'],
['Motu proprio','«por propio impulso»','Hacer algo por iniciativa propia, sin que nadie lo pida.'],
['Nihil novi sub sole','«nada nuevo bajo el sol»','Aunque parezca que todo cambia, en el fondo todo se repite. Viene de la traducción latina del Eclesiastés.'],
['Non plus ultra','«no más allá»','El límite máximo. Según la leyenda, estaba escrito en las columnas de Hércules, en el estrecho de Gibraltar, el fin del mundo conocido; tras el descubrimiento de América, Carlos V adoptó el lema Plus ultra, «más allá».'],
['Opera prima','«primera obra»','La primera obra de un artista, sobre todo la primera película de un director.'],
['p. m. (post meridiem)','«después del mediodía»','Indica las horas entre mediodía y medianoche en el reloj de doce horas.'],
['Pacta sunt servanda','«los pactos deben cumplirse»','Principio del derecho: lo acordado obliga a las partes.'],
['Patria potestas','«potestad del padre»','En Roma, el poder casi absoluto del padre de familia sobre sus hijos, incluso adultos. Hoy, «patria potestad» designa los derechos y deberes de los padres sobre los hijos menores.'],
['Peccata minuta','«pecados pequeños»','Algo de poca importancia comparado con otras cosas más graves.'],
['Per capita','«por cabeza»','Por persona; se usa sobre todo en estadística, como la renta per capita de un país.'],
['Per saecula saeculorum','«por los siglos de los siglos»','Fórmula final de muchas oraciones cristianas: para siempre.'],
['Per se','«por sí mismo»','Por su propia naturaleza, sin influencia externa.'],
['Persona non grata','«persona no grata»','Alguien que no es bien recibido por un gobierno o una institución.'],
['Placebo','«agradaré»','Sustancia sin efecto curativo que se da como si fuera un medicamento; el «efecto placebo» es la mejora que produce solo por creer que cura.'],
['Plus','«más»','Algo añadido; por ejemplo, una cantidad extra en el sueldo.'],
['Post scriptum (P. S.)','«después de lo escrito»','Lo que se añade al final de una carta, después de la firma.'],
['Posdata','«después de la fecha»','Los romanos fechaban sus cartas al final («dada el día…»). Lo que se añadía después de la fecha era la posdata.'],
['Primus inter pares','«el primero entre iguales»','Quien tiene un papel principal dentro de un grupo de iguales. Así quería presentarse Augusto: el princeps, el primer ciudadano.'],
['Quid','«qué»','En «el quid de la cuestión»: lo esencial de un asunto.'],
['Quid pro quo','«algo por algo»','Un intercambio de favores: doy esto a cambio de aquello.'],
['Quórum','«de los cuales»','Número mínimo de miembros presentes para que una votación sea válida. Viene de fórmulas como quorum praesentia sufficit, «la presencia de los cuales basta».'],
['Rara avis','«ave rara»','Persona excepcional o poco común. Juvenal (Sátiras VI 165) la usa para una mujer tan perfecta que sería como un cisne negro.'],
['Ratio','«cálculo, proporción»','Relación entre dos cantidades: la ratio de alumnos por profesor.'],
['Referéndum','«lo que debe ser consultado»','Votación en la que los ciudadanos deciden directamente sobre una cuestión.'],
['Réquiem','«descanso»','La misa de difuntos, que empieza con Requiem aeternam, y las obras musicales compuestas para ella, como el Réquiem de Mozart.'],
['Rictus','«abertura de la boca»','Gesto de la boca que muestra los dientes y expresa dolor, asco o burla.'],
['Rigor mortis','«rigidez de la muerte»','La rigidez que adquiere el cuerpo pocas horas después de morir.'],
['RIP (requiescat in pace)','«descanse en paz»','Fórmula de las lápidas cristianas; coincide con el inglés Rest In Peace.'],
['Sic','«así»','Se escribe entre paréntesis tras una cita para indicar que el error o lo sorprendente ya estaba en el original.'],
['Sine die','«sin día»','Aplazar algo sin fecha fija. A diferencia de ad Kalendas Graecas, se supone que algún día ocurrirá.'],
['Statu quo','«en el estado en que»','La situación tal como está. Viene de la diplomacia: status quo ante bellum, «la situación de antes de la guerra».'],
['Stricto sensu','«en sentido estricto»','Entender un término de la manera más precisa y limitada. Se opone a lato sensu.'],
['Sub iudice','«bajo el juez»','Un asunto pendiente de resolución judicial. Aparece ya en Horacio (Arte poética 78).'],
['Sui generis','«de su propio género»','Peculiar, distinto de los demás, a veces con un matiz de extrañeza.'],
['Súmmum','«lo más alto»','El grado máximo de algo: el súmmum de la elegancia.'],
['Superávit','«sobró»','Lo que sobra cuando los ingresos superan a los gastos.'],
['Ultimátum','«lo último»','La última advertencia antes de tomar medidas. Viene de la diplomacia.'],
['Veni, vidi, vici','«llegué, vi, vencí»','Según Suetonio, Julio César lo escribió tras vencer en un instante al rey Farnaces en Zela (47 a.C.). Sirve para algo conseguido con facilidad y rapidez.'],
['Verba volant, scripta manent','«las palabras vuelan, lo escrito permanece»','Mejor dejar por escrito los compromisos y lo que queremos que perdure.'],
['Viceversa','«cambiada la posición»','Al revés, intercambiando los papeles.'],
['Vis cómica','«fuerza cómica»','La capacidad de un actor o de una obra para hacer reír.'],
['Volens nolens','«queriendo o sin querer»','Quiera o no quiera.'],
['Vox populi','«voz del pueblo»','Algo que todo el mundo sabe o dice. También la voluntad popular, como en Vox populi, vox Dei.'],
['Urbi et orbi','«a la ciudad y al orbe»','Fórmula de la bendición papal a Roma y al mundo entero: algo que se difunde por todas partes.']
];
const LATIN_GROUPS=[['A','A'],['B-C','BC'],['D-E','DE'],['F-I','FGHI'],['J-N','JKLMN'],['O-P','OP'],['Q-R','QR'],['S','S'],['T-Z','TUVWXYZ']];
function latinMenu(gi,keep){
  const o=$('dOpts');o.innerHTML='';let k=1;const add=(txt,fn,cls)=>{const b=document.createElement('button');if(cls)b.className=cls;b.innerHTML='<span class="n">'+(k<10?k:'·')+'</span><span>'+txt+'</span>';k++;b.onclick=fn;o.appendChild(b);};
  const ini=s=>s.normalize('NFD').charAt(0).toUpperCase();
  if(gi===undefined){$('dBody').innerHTML='<p>Tengo '+LATIN.length+' expresiones apuntadas en mis tablillas, ordenadas por letras. ¿Por cuál empezamos?</p>';
    LATIN_GROUPS.forEach((g,i)=>add(g[0]+' ('+LATIN.filter(l=>g[1].includes(ini(l[0]))).length+')',()=>latinMenu(i),'quiz'));add('Volver',()=>{$('dBody').innerHTML='<p>Pregunta lo que quieras.</p>';renderOpts();});}
  else{const g=LATIN_GROUPS[gi];if(!keep)$('dBody').innerHTML='<p><span class="label">Latinismos · '+g[0]+'</span></p><p>Elige una expresión.</p>';
    LATIN.filter(l=>g[1].includes(ini(l[0]))).forEach(l=>add(l[0],()=>{state.seen['l:'+l[0]]=1;save();$('dBody').innerHTML='<p><span class="label">'+l[0]+'</span></p><p><i>'+l[1]+'</i></p><p>'+l[2]+'</p>';latinMenu(gi,true);$('dBody').scrollTop=0;},state.seen['l:'+l[0]]?'seen':''));
    add('Otras letras',()=>latinMenu());}
  setTimeout(()=>{const b=o.querySelector('button');b&&b.focus({preventScroll:true});},30);}
ROMA_NPCS.push(
{id:'verrio',name:'Tito Verrio',title:'Gramático y maestro de escuela',glyph:'V',look:{chiton:'#efe9dc',himation:'#4f6a7d',hair:'#8d8a85',beard:true,beardC:'#9a968e',staff:true},latinBrowser:true,
 cat:'Cultura',lesson:'Latinismos: el latín que no ha muerto',where:'Bajo los pórticos del Foro, junto a la Basílica Emilia',
 summary:'El latín, la lengua de Roma, dio origen a las lenguas romances (castellano, catalán, gallego, portugués, francés, italiano, rumano…) y fue durante siglos la lengua de la ciencia, el derecho y la Iglesia. Muchas expresiones latinas se siguen usando tal cual: son los latinismos, como ad hoc, statu quo, in situ o curriculum vitae. Algunos vienen de autores romanos (Horacio, Juvenal, Virgilio, Julio César) y otros se formaron mucho después, en el latín medieval, jurídico o científico.',
 intro:'¡Silencio, niños, que tenemos visita! Salve, forastero. Soy Tito Verrio, gramático. Aquí, bajo el pórtico, enseño a estos pequeños a leer y a hablar un latín correcto. Y te diré una cosa que les digo siempre: Roma caerá algún día, como cayó Troya, pero nuestras palabras no. Dentro de dos mil años, gentes que no conocemos seguirán diciendo ad hoc, statu quo o alea iacta est.',
 topics:[
  ['¿Qué es un latinismo?','Una palabra o una expresión latina que se usa dentro de otra lengua, tal cual o casi. Hay de dos clases: las que se toman enteras, sin cambiar nada, como in situ o ad hoc, y las que se adaptan a la lengua nueva y hasta llevan acentos, como déficit, réquiem o currículum. Se usan mucho en el derecho, en la medicina, en la ciencia y en la política, porque durante siglos el latín será la lengua de los sabios en toda Europa.'],
  ['¿De dónde salen?','Algunos los decimos ya ahora, aquí en Roma: alea iacta est lo dijo el divino Julio al cruzar el Rubicón, y Augusto aplazaba los pagos ad Kalendas Graecas. Otros salen de los poetas: aurea mediocritas y beatus ille son de Horacio; mens sana in corpore sano y rara avis, de un tal Juvenal que todavía es un muchacho. Y otros los inventarán juristas, médicos y monjes de siglos futuros, como in vitro o curriculum vitae. Sí, sí: un gramático también sabe soñar.'],
  ['¿Cómo se pronuncian?','Nosotros pronunciamos la c siempre como k: Kíkero, no Cicerón; la v casi como una u, y la ae como a y e seguidas. Los que vengan después lo pronunciarán cada uno a la manera de su lengua: en Hispania dirán Cicerón y en la Galia Siserón. No importa demasiado. Lo importante es saber qué significan y usarlos bien: un latinismo mal usado es peor que ninguno.']],
 quiz:{q:'¿Qué significa conditio sine qua non?',a:['Una condición imprescindible, sin la cual algo no puede ocurrir','Una condición que no tiene ninguna importancia','Una situación de guerra'],ko:'No. Conditio sine qua non significa «condición sin la cual no»: un requisito imprescindible.'}}
);
Object.assign(ROMA_SRC,{verrio:{a:['Suetonio, Augusto 87 (ad Kalendas Graecas) y César 32 y 37 (alea iacta est; veni, vidi, vici)','Horacio, Odas II 10 y Epodos 2','Juvenal, Sátiras VI 165 y X 356','Quintiliano, Institución oratoria I 4-7 (el gramático y la corrección del lenguaje)'],m:['Lista de latinismos de las PAU de Lengua y Cultura Latinas: El Foc de Prometeu, <a href="https://elfocdeprometeu.cat/llatinismes/" target="_blank" rel="noopener">elfocdeprometeu.cat/llatinismes</a>','J. Herrero Ingelmo y otros, Diccionario de latinismos y frases latinas'],n:['Tito Verrio es inventado; su nombre recuerda al gramático Verrio Flaco, maestro de los nietos de Augusto. Muchos latinismos de la lista se formaron siglos después del año 80: es una licencia que el personaje los «adivine».']}});
ROMA_ESSAYS.splice(6,0,{id:'latinismos',cat:'Contexto',title:'Latinismos',body:['Expresiones latinas que seguimos usando, con su traducción literal y su uso (lista de las PAU de Lengua y Cultura Latinas, según El Foc de Prometeu). Tito Verrio, el gramático del Foro, las explica una a una.','<dl class="qa">'+LATIN.map(l=>'<dt>'+l[0]+' · <i>'+l[1]+'</i></dt><dd>'+l[2]+'</dd>').join('')+'</dl>'],src:{a:[],m:['El Foc de Prometeu, <a href="https://elfocdeprometeu.cat/llatinismes/" target="_blank" rel="noopener">Llatinismes</a>'],n:['Las explicaciones están redactadas para el juego.']}});
ROMA_GLOSS.push(['Gramático',['gramático','gramáticos'],'Maestro de la escuela secundaria romana: enseñaba lengua y literatura, sobre todo a los poetas, a niños de entre doce y quince años.'],['Rubicón',['rubicón'],'Río que separaba la Galia Cisalpina de Italia. Cruzarlo con el ejército, como hizo César en el 49 a.C., era declarar la guerra civil.']);

// ------------------------------------------------------------ comedias en los teatros de Roma (Plauto y Terencio)
// Como PLAYS en Atenas: escenas repartidas por horas; pos de cada actor en metros sobre el escenario [x, z] (z>=9.5: fuera de escena)
const ROMA_PLAYS=[
 {id:'aulularia',th:0,title:'La olla',lat:'Aulularia',author:'Plauto',life:'c. 254-184 a.C.',start:8,end:11,cast:[['Euclión, viejo avaro','#8a7350'],['Megadoro · Licónides','#4f6a7d'],['Estáfila · Estróbilo','#a8392b']],
  scenes:[
   ['Prólogo del Lar','El dios Lar de la casa sale a escena y cuenta al público su secreto: el abuelo de Euclión enterró una olla llena de oro bajo el hogar. El Lar se la ha dejado encontrar a Euclión por cariño a su hija Fedria, que siempre le hace ofrendas. Pero Euclión, de pobre, se ha vuelto el hombre más tacaño del mundo.',[[0,10],[0,10],[0,10]]],
   ['Euclión echa a su criada','Euclión saca a empujones a la vieja criada Estáfila: teme que haya visto dónde guarda el oro. Le ordena no dejar entrar a nadie, ni siquiera a pedir fuego. «Si viene la Fortuna, dile que no estoy». El público ríe con cada desconfianza del viejo.',[[-1.5,0],[0,10],[1.5,0.5]]],
   ['Megadoro pide la mano de Fedria','El vecino rico, Megadoro, pide casarse con Fedria sin dote. Euclión está convencido de que en realidad sabe lo del oro y viene a robarlo. Al final acepta, con tal de que sea sin dote. Megadoro suelta un discurso contra las mujeres ricas que arruinan a sus maridos con caprichos.',[[-1.5,0],[1.5,0],[0,10]]],
   ['Los cocineros','Llegan cocineros alquilados para la boda. Euclión, al ver gente en su casa, cree que vienen por la olla y los echa a bastonazos. Decide sacar el oro de casa y esconderlo en el templo de la Fe: «Fe, a ti te lo confío».',[[0,0.5],[0,10],[-2,1]]],
   ['El esclavo Estróbilo','Estróbilo, esclavo del joven Licónides, ha visto esconder la olla. Euclión, que lo sorprende merodeando, le registra las manos una y otra vez: «Enséñame la otra mano… ¡la tercera!». Luego cambia el escondite al bosque de Silvano, pero Estróbilo lo sigue y roba la olla.',[[-1,0],[0,10],[1.5,0]]],
   ['«¡Estoy perdido!»','Euclión descubre el robo y sale desesperado, se dirige directamente al público: «¿Quién ha sido? ¿Tú? ¿Tú? Todos os reís…». Licónides llega a confesar otra cosa: fue él quien dejó embarazada a Fedria. Euclión cree que habla de la olla. El malentendido es el momento más famoso de la obra.',[[0,-1],[1.5,0],[0,10]]],
   ['El final perdido','Licónides obliga a su esclavo a devolver la olla y se casa con Fedria. El final del texto de Plauto se ha perdido, pero los resúmenes antiguos cuentan que Euclión, curado de su avaricia, regala el oro como dote y por fin duerme tranquilo. Los actores se quitan las máscaras y piden el aplauso: «Plaudite!».',[[-1,0.5],[1,0.5],[2.5,1]]]]},
 {id:'mostellaria',th:0,title:'La comedia del fantasma',lat:'Mostellaria',author:'Plauto',life:'c. 254-184 a.C.',start:12,end:15,cast:[['Tranión, el esclavo','#a8392b'],['Teoprópides, el padre','#6b5a3a'],['Filólaques · Simón','#c9a24a']],
  scenes:[
   ['La casa en fiesta','El viejo Teoprópides lleva tres años de viaje por negocios. Su hijo Filólaques ha pedido dinero prestado a un usurero, ha comprado la libertad de la cortesana que ama y ha convertido la casa en una fiesta continua. El astuto esclavo Tranión dirige el desorden.',[[1.5,0],[0,10],[-1,0.5]]],
   ['¡Vuelve el amo!','Tranión llega corriendo del puerto: el barco del padre acaba de atracar. Los jóvenes, borrachos, no saben qué hacer. Tranión los encierra a todos dentro, cierra la puerta con llave y promete: «Yo me encargo del viejo».',[[0,0],[0,10],[-1.5,0.5]]],
   ['La casa embrujada','Teoprópides quiere entrar en su casa. Tranión lo detiene aterrado: nadie vive allí desde hace siete meses, porque la casa está embrujada. Un huésped fue asesinado y enterrado dentro por el antiguo dueño, y su fantasma se aparece de noche. Desde dentro se oye un ruido. «¡No toques la puerta!».',[[-1,0],[1,0],[0,10]]],
   ['El usurero','Aparece el usurero reclamando a gritos los intereses. Tranión improvisa: el hijo pidió el dinero para comprar una casa nueva, la del vecino Simón. El padre, encantado con el negocio, promete pagar.',[[-1,0],[1,0],[2,0.6]]],
   ['Visita a la casa del vecino','Tranión tiene que enseñarle al viejo «la casa nueva» sin que el vecino se entere de la venta inventada. Lleva a uno y a otro de un lado para otro, diciendo a cada uno algo distinto. Es la escena de enredo más larga de la obra.',[[0,0.4],[-1.5,0],[1.5,0]]],
   ['Tranión en el altar','Al final un esclavo de la fiesta lo cuenta todo. Tranión se refugia en un altar, donde nadie puede tocarlo, y se burla de su amo desde allí. Un amigo del hijo consigue el perdón para todos: «Hoy ya ha hecho bastante; mañana volverá a hacer algo, y entonces lo castigas por las dos cosas». Plaudite!',[[2.2,0.8],[-0.5,0],[-2,0.4]]]]},
 {id:'menaechmi',th:0,title:'Los Menecmos',lat:'Menaechmi',author:'Plauto',life:'c. 254-184 a.C.',start:16,end:19,cast:[['Menecmo (los dos gemelos)','#c9a24a'],['Mesenión · Penículo','#8a7350'],['Erotia · la esposa','#8a3f5e']],
  scenes:[
   ['Prólogo','El prólogo explica el argumento al público: un mercader de Siracusa tenía dos gemelos idénticos. Uno se perdió de niño en una feria de Tarento y acabó adoptado en Epidamno. El otro, al que llamaron también Menecmo, lleva seis años buscándolo por todos los puertos. Hoy llega a Epidamno.',[[0,10],[0,10],[0,10]]],
   ['Menecmo de Epidamno','El Menecmo que vive en Epidamno sale huyendo de su mujer, celosa, con un manto de ella robado para regalárselo a la cortesana Erotia. Le acompaña el parásito Penículo, «el Cepillo», que barre todas las mesas donde haya comida gratis.',[[-1,0],[1.5,0.5],[0,10]]],
   ['Llega el gemelo','El otro Menecmo desembarca con su esclavo Mesenión, que le advierte: Epidamno está llena de estafadores y cortesanas. En ese momento Erotia lo invita a comer llamándolo por su nombre. Él no entiende nada, pero acepta la comida y el manto.',[[-1,0],[1,0.5],[2,0]]],
   ['Todos confundidos','Penículo, ofendido porque «Menecmo» ha comido sin él, se lo cuenta todo a la esposa. Ella acusa al gemelo equivocado, que nunca la ha visto. Erotia le reclama el manto al Menecmo de Epidamno, que tampoco entiende nada. Cada uno cree que el otro se ha vuelto loco.',[[0,0],[1.8,0.6],[-1.8,0.4]]],
   ['El médico','El suegro trae a un médico para curar la locura de Menecmo. El gemelo forastero se hace el loco para librarse: grita que Apolo le ordena quemarle los ojos al viejo. El médico receta eléboro durante veinte días. El público se ríe de la medicina y de los médicos griegos.',[[0,0],[2,0.8],[0,10]]],
   ['El reconocimiento','Mesenión ve por fin a los dos Menecmos juntos y descubre que son gemelos. Preguntas y respuestas: el nombre del padre, la patria, el día en que se perdió el niño. Los hermanos se abrazan. Menecmo de Epidamno decide volver a Siracusa y subastar todo lo que tiene, «incluida la esposa, si alguien la quiere».',[[-0.8,0],[1.6,0.6],[0,10]]]]},
 {id:'adelphoe',th:1,title:'Los hermanos',lat:'Adelphoe',author:'Terencio',life:'c. 190-159 a.C.',start:8,end:11,cast:[['Micio','#4f6a7d'],['Demea','#6b5a3a'],['Esquino · Siro','#a07a3a']],
  scenes:[
   ['Prólogo','Terencio no cuenta el argumento en el prólogo, como Plauto: lo usa para defenderse de sus críticos, que le acusan de mezclar comedias griegas de Menandro y de dejarse ayudar por nobles amigos. «Que el público juzgue».',[[0,10],[0,10],[0,10]]],
   ['Dos formas de educar','El viejo Micio, soltero y de ciudad, ha adoptado a su sobrino Esquino y lo educa con libertad y cariño. Su hermano Demea, campesino y severo, cría al otro hijo, Ctesifón, con disciplina. «Es mejor que un hijo obre bien por vergüenza que por miedo», dice Micio.',[[-1,0],[0,10],[0,10]]],
   ['El escándalo','Demea llega furioso: Esquino ha asaltado la casa de un traficante y se ha llevado a una joven citarista. ¡Esa es la educación de Micio! Demea pone como ejemplo a su Ctesifón, tan formal. Micio le responde con calma: cada uno se ocupe de su hijo.',[[-1,0],[1,0],[0,10]]],
   ['La verdad','En realidad Esquino ha raptado a la citarista para su hermano Ctesifón, que está enamorado y no se atreve a contarlo a su padre. El astuto esclavo Siro engaña a Demea y lo manda a buscar a su hijo por toda la ciudad, con indicaciones imposibles.',[[0,10],[1.5,0.5],[-1,0]]],
   ['Demea cambia','Cuando Demea descubre la verdad, comprende que su severidad solo ha conseguido que su hijo le mienta. Decide imitar a su hermano y volverse generoso… con el dinero de Micio: le obliga a casarse a su edad, a liberar a Siro y a regalar tierras.',[[-1.2,0],[1.2,0],[2.4,0.6]]],
   ['¿Quién tenía razón?','Demea explica al final que su generosidad repentina era una lección: la indulgencia de Micio no es sabiduría, solo comodidad. Terencio deja la pregunta al público: ¿es mejor educar con libertad o con firmeza? Plaudite!',[[-1,0.5],[1,0.5],[0,10]]]]},
 {id:'hecyra',th:1,title:'La suegra',lat:'Hecyra',author:'Terencio',life:'c. 190-159 a.C.',start:12,end:15,cast:[['Pánfilo','#4f6a7d'],['Láquete · Sóstrata, la suegra','#6b5a3a'],['Báquide','#8a3f5e']],
  scenes:[
   ['Un prólogo de fracasos','El jefe de la compañía pide paciencia: es la tercera vez que se intenta representar esta comedia. En el estreno, el público se fue a ver a unos funambulistas y unos púgiles; en el segundo intento, corrió el rumor de que iba a haber gladiadores y la gente invadió el teatro a empujones. «Dejadnos esta vez llegar al final».',[[0,10],[0,10],[0,10]]],
   ['Una boda sin ganas','El joven Pánfilo se casó con Filúmena para obedecer a su padre, aunque seguía enamorado de la cortesana Báquide. Con el tiempo empezó a querer a su esposa, pero tuvo que irse de viaje. Durante su ausencia, Filúmena volvió a casa de su madre y no quiere regresar.',[[0,10],[0,0],[1.5,0.4]]],
   ['La culpa es de la suegra','Todos culpan a Sóstrata, la suegra: dicen que las suegras siempre se llevan mal con las nueras. Ella, que adora a Filúmena, sufre en silencio y hasta se ofrece a irse a vivir al campo para que el matrimonio pueda arreglarse. Terencio da la vuelta al tópico de la suegra malvada.',[[0,10],[0,0],[0,10]]],
   ['El secreto de Filúmena','Pánfilo vuelve y descubre la verdad: Filúmena espera un niño que no puede ser suyo, por algo que le ocurrió una noche antes de la boda. Pánfilo, herido, se niega a recibirla, pero promete guardar el secreto para no deshonrarla.',[[-1,0],[1,0],[0,10]]],
   ['El anillo de Báquide','La solución la trae la cortesana Báquide: reconoce el anillo de Filúmena, que Pánfilo le regaló a ella hace meses. El desconocido de aquella noche era el propio Pánfilo. El niño es suyo y el matrimonio se salva.',[[-1,0],[1.2,0.4],[0.4,-0.6]]],
   ['Un final discreto','Báquide, la persona en quien nadie confiaba, es la que salva a todos, y Pánfilo decide que lo sucedido no debe contarse a nadie más: «no conviene que en esta comedia, como en otras, todos lo sepan todo». Plaudite!',[[-1,0],[0,10],[1,0]]]]},
 {id:'phormio',th:1,title:'Formión',lat:'Phormio',author:'Terencio',life:'c. 190-159 a.C.',start:16,end:19,cast:[['Formión, el parásito','#3f7a3a'],['Demifón · Cremes','#6b5a3a'],['Antifón · Geta','#c9a24a']],
  scenes:[
   ['Los padres están de viaje','Dos hermanos ancianos, Demifón y Cremes, se han ido de viaje dejando a sus hijos al cuidado del esclavo Geta. Antifón se ha enamorado de una huérfana pobre, Fanio. Su primo Fedria, de una tañedora de lira que un traficante quiere vender.',[[0,10],[0,10],[-1,0]]],
   ['El truco de Formión','El parásito Formión, experto en pleitos, ha ideado una trampa legal: según la ley ateniense, el pariente más cercano debe casarse con una huérfana. Formión jura que Antifón es su pariente, el tribunal lo obliga a casarse con Fanio… y Antifón, encantado, se deja «obligar».',[[-1,0],[0,10],[1,0]]],
   ['Vuelve Demifón','Demifón regresa y estalla: ¡su hijo casado con una mendiga sin dote! Formión se enfrenta a él con descaro y le recita la ley. Demifón consulta a tres abogados: uno dice que sí, otro que no y el tercero que hay que pensarlo más.',[[-1,0],[1,0],[2,0.5]]],
   ['Treinta minas','Geta y Formión engañan a los viejos: Formión se llevará a Fanio si le pagan treinta minas, justo lo que necesita Fedria para comprar a su tañedora. Los viejos pagan aliviados. Formión entrega el dinero a Fedria.',[[-1,0],[1,0],[0,0.8]]],
   ['El secreto de Lemnos','Sorpresa: Fanio es hija de Cremes, que durante años tuvo en secreto otra esposa en la isla de Lemnos. Ahora los viejos quieren que Antifón siga casado con ella… y recuperar el dinero de Formión.',[[0,10],[0,0],[1.5,0.5]]],
   ['Formión gana','Formión se niega a devolver nada y, cuando los viejos intentan arrastrarlo al tribunal, llama a gritos a Nausístrata, la esposa de Cremes, y le cuenta lo de Lemnos. Nausístrata perdona a su marido, pero le hace pagar invitando a Formión a cenar. Plaudite!',[[-1,0],[1,0],[0,10]]]]}
];
// ---- repertorio de los demás teatros (modo Roma: Italia y provincias; modo Atenas: el Pireo y Corinto). Mismo formato que arriba; thn = nombre del teatro
const THEA_NOTE={
 _roma:'Las comedias «palliatas», con personajes griegos con manto (pallium), se adaptaban de comedias griegas como las de Menandro. Entra por los pasillos laterales y quédate en la orquesta, junto a los senadores, para seguir la obra escena a escena.',
 'Teatro de Neápolis':'Neápolis sigue siendo una ciudad griega: se habla griego en la calle y en este teatro se representan comedias griegas en su lengua original, como las de Menandro (c. 342-290 a.C.), el gran autor de la Comedia Nueva al que imitaron Plauto y Terencio. Cada cuatro años se celebran aquí los Sebastá, unos juegos a la griega fundados en honor de Augusto, con concursos de música, poesía y teatro. Aquí actuó Nerón por primera vez en público, en el 64, y siguió cantando mientras un terremoto sacudía el teatro.',
 'Teatro de Saepinum':'Hoy se representan atelanas, las farsas más antiguas de Italia, nacidas entre los oscos de Atella, en Campania: obras cortas, a menudo improvisadas, con cuatro personajes fijos de máscara: Maco, el bobo glotón; Bucón, el fanfarrón charlatán; Papo, el viejo tacaño, y Doseno, el jorobado listo. En tiempos de Sila, Pomponio y Novio las escribieron en latín. Solo nos han llegado sus títulos y versos sueltos: los argumentos que ves aquí están reconstruidos a partir de los títulos, a la manera de las atelanas. En Roma se representan al final de las tragedias, como fin de fiesta.',
 'Teatro de Verona':'Por la mañana, una comedia de Terencio; por la tarde, el espectáculo de moda en todo el Imperio: la pantomima. Un solo bailarín, con máscara de boca cerrada, interpreta sin hablar a todos los personajes de un mito, cambiando de máscara, mientras un coro canta la historia y los músicos tocan tibias, címbalos y el scabellum, una tablilla que se pisa para marcar el ritmo. Los grandes pantomimos, como Pílades y Batilo en tiempos de Augusto, son tan famosos que sus seguidores llegan a pelearse en las gradas.',
 'Teatro de Tarraco':'Por la mañana, una comedia de Plauto distinta de las demás: sin enamorados ni cortesanas. Por la tarde, un mimo: los actores no llevan máscara, las mujeres actúan (en las demás obras los papeles femeninos los hacen hombres), y se representan escenas de la vida diaria, con muchos chistes y algo de improvisación. El mimo es, con la pantomima, lo que más gusta al público de hoy. Sus textos casi no se han conservado: lo que ves está reconstruido a partir de sus temas habituales.',
 'Teatro de Emerita':'Por la mañana, una pantomima basada en el libro IV de la Eneida de Virgilio: los poemas de Virgilio y de Ovidio se bailan en los teatros, y el público se sabe los versos de memoria. Por la tarde, una comedia de Plauto que pasa a la orilla del mar, para una colonia que vive lejos de él.',
 'Teatro de Carthago Nova':'En la ciudad que fundaron los cartagineses, una comedia de Plauto con un cartaginés como protagonista: es la única obra latina en la que se oyen frases en púnico, la lengua de Cartago, que todavía hablan algunos ancianos de la ciudad. Por la tarde, una pantomima de héroes y monstruos.',
 'Teatro de Lugdunum':'Por la mañana, una tragedia de Séneca, el filósofo de Corduba. No sabemos si sus tragedias se representaban enteras en los teatros o solo se leían en voz alta ante un público escogido, en las recitaciones: aquí, en la capital de las Galias, una compañía se ha atrevido con ella. Habla de una peste, como la que ha sufrido Roma este mismo año. Por la tarde, una pantomima.',
 'Teatro del Pireo':'El Pireo celebra cada invierno sus propias Dionisias, organizadas por el demarco, con procesión, sacrificio y concursos de comedia. Este teatro de madera, junto a la colina de Muniquia, ya existía en el 411: Tucídides cuenta que allí se reunieron armados los soldados que se rebelaron contra los Cuatrocientos. Hoy se reponen dos comedias recientes de Aristófanes, ya muy anciano: morirá por estos años. En estas últimas obras el coro casi no habla: canta y baila en los intermedios.',
 'Teatro de Corinto':'Corinto tiene teatro desde finales del siglo V, en la ladera junto al ágora: gradas de tierra y madera y una escena de madera. Las tragedias de los grandes poetas atenienses se representan ya por toda Grecia y por Sicilia, llevadas por compañías de actores que viajan de ciudad en ciudad. Hoy se representa una tragedia de Sófocles en la que tiene un papel un mensajero de Corinto, y después, como manda la costumbre, un drama satírico, con un coro de sátiros.'
};
ROMA_PLAYS.push(
 // ---------------- Neápolis: Menandro, en griego
 {id:'dyskolos',thn:'Teatro de Neápolis',title:'El misántropo',lat:'Dýskolos',author:'Menandro',life:'c. 342-290 a.C.',start:9,end:12,cast:[['Cnemón, el viejo huraño','#6b5a3a'],['Sóstrato · Gorgias','#4f6a7d'],['Sicón, el cocinero · Daos','#a8392b']],
  scenes:[
   ['Prólogo de Pan','El dios Pan sale de su gruta, en File, en el campo del Ática, y presenta al vecino: Cnemón, un viejo que odia a todo el mundo, vive solo con su hija y una vieja criada y no saluda a nadie. Su hija, en cambio, honra a las Ninfas, y Pan quiere premiarla: ha hecho que un joven rico, Sóstrato, se enamore de ella.',[[0,10],[0,10],[0,10]]],
   ['Cnemón ataca','Un esclavo de Sóstrato llega corriendo: se ha acercado a Cnemón y el viejo lo ha echado a pedradas y a terronazos. Sóstrato quiere intentarlo él mismo, pero Cnemón aparece gritando que ojalá fuera Perseo para convertir en piedra a todos los que se le acercan.',[[1.5,0.4],[-1.2,0],[0,10]]],
   ['El pozo','La criada deja caer el cubo al pozo, y luego la azada. Cnemón baja a sacarlos y se cae dentro. Gorgias, su hijastro, que vive pobremente en la casa de al lado, lo saca con una cuerda, ayudado por Sóstrato, que no deja de mirar a la muchacha.',[[0,0.8],[-1,0],[1.6,0.5]]],
   ['Nadie basta a sí mismo','Cnemón, magullado, reconoce su error: creía que podía vivir sin nadie, y casi muere solo. Adopta a Gorgias y le encarga casar a su hija; Gorgias se la da a Sóstrato. Pero el cocinero y el esclavo se vengan del viejo: lo sacan en brazos, lo marean a preguntas y se lo llevan a bailar a la fiesta. Es la única comedia de Menandro que conservamos casi entera, gracias a un papiro encontrado en Egipto en el siglo XX.',[[0,0],[-1.5,0.4],[1.5,0.4]]]]},
 {id:'aspis',thn:'Teatro de Neápolis',title:'El escudo',lat:'Aspís',author:'Menandro',life:'c. 342-290 a.C.',start:15,end:18,cast:[['Daos, el esclavo fiel','#8a7350'],['Esmícrines, el tío avaro','#4a4a3a'],['Querestrato · Cleóstrato','#4f6a7d']],
  scenes:[
   ['El escudo abollado','Daos vuelve de la guerra en Licia con el escudo abollado de su joven amo, Cleóstrato, al que cree muerto, y con el botín. Llora por él. Entonces aparece la diosa Fortuna y le cuenta al público un secreto: Cleóstrato está vivo; otro soldado cogió su escudo.',[[0,0],[0,10],[0,10]]],
   ['El tío avaro','El viejo Esmícrines solo piensa en el botín. Según la ley, como pariente más cercano, puede casarse con la hermana de Cleóstrato, que ahora es la heredera. Le da igual que ella esté prometida a otro joven. Daos, que lo desprecia, le responde con proverbios.',[[-1.2,0],[1.2,0],[0,10]]],
   ['El muerto fingido','Daos inventa un engaño: el hermano de Esmícrines, Querestrato, fingirá estar muerto, para que su propia hija se convierta en una heredera todavía más rica. Un amigo se disfraza de médico extranjero y habla con un acento griego muy raro que hace reír al público. Esmícrines cae en la trampa y deja en paz a la primera muchacha.',[[0,0.4],[-1.5,0],[1.5,0.6]]],
   ['Vuelve Cleóstrato','Llega Cleóstrato, vivo. El final del papiro se ha perdido, pero todo apunta a dos bodas y a un tío avaro burlado. Los actores bailan con antorchas y piden a la Victoria, amiga de la risa, que les sea favorable.',[[-1,0],[2,0.6],[0.4,0]]]]},
 // ---------------- Saepinum: atelanas
 {id:'pappus',thn:'Teatro de Saepinum',title:'Papo, derrotado en las elecciones',lat:'Pappus praeteritus',author:'Novio',life:'s. I a.C.',start:9,end:12,cast:[['Papo, el viejo','#6b5a3a'],['Maco · Bucón','#a8392b'],['Doseno, el jorobado','#3f7a3a']],
  scenes:[
   ['Papo quiere ser edil','El viejo Papo, el más tacaño de la ciudad, ha decidido presentarse a edil. Contrata a Doseno, que presume de saber cómo se ganan las elecciones: hay que sonreír, dar la mano a todos y, sobre todo, invitar a cenar.',[[-1,0],[0,10],[1,0]]],
   ['La campaña','Bucón va por las calles prometiendo a los votantes trigo, juegos y baños gratis, todo pagado por Papo. Papo, al oírlo, se desmaya. Maco, encargado del banquete electoral, se come él solo la cena de los votantes.',[[0,0],[1.5,0.5],[-1.5,0]]],
   ['El recuento','Se cuentan los votos: Papo ha perdido. El nuevo edil es… Maco, que ni siquiera se presentaba y estaba dormido debajo de una mesa. Los votantes agradecidos lo han elegido por la cena.',[[-1.5,0],[0,0.4],[1.5,0]]],
   ['El éxodo','Papo persigue a todos con un bastón alrededor del escenario. Las atelanas acaban así: con carreras, golpes y una canción final. En Roma se usan como fin de fiesta tras las tragedias, el exodium.',[[-2,0.5],[2,0.2],[0,0.8]]]]},
 {id:'maccus_miles',thn:'Teatro de Saepinum',title:'Maco, soldado',lat:'Maccus miles',author:'Pomponio',life:'s. I a.C.',start:15,end:18,cast:[['Maco','#a8392b'],['Bucón, el centurión fanfarrón','#8a3a2a'],['Papo · Doseno','#6b5a3a']],
  scenes:[
   ['Maco se alista','Maco se alista en la legión porque ha oído que a los soldados les dan de comer todos los días. El centurión Bucón le explica la disciplina: marchar veinte millas con cuarenta kilos a la espalda, cavar el foso, montar guardia. Maco pregunta a qué hora es la comida.',[[0,0],[-1.5,0],[0,10]]],
   ['La instrucción','La instrucción es un desastre: Maco confunde la izquierda y la derecha, se clava su propio pilo y, cuando Bucón grita «¡Formad la tortuga!», se tumba en el suelo boca arriba.',[[0.5,0],[-1.5,0.3],[0,10]]],
   ['La guardia','De guardia por la noche, Maco se come las provisiones del campamento y se duerme dentro de un tonel. El viejo Papo, vendedor de vino, viene a reclamar lo que se ha bebido. Doseno, el listo, lo convence de que ha sido un fantasma.',[[0,0.6],[0,10],[1.2,0]]],
   ['El héroe','Por la mañana, los enemigos han huido (en realidad, por el ruido de los ronquidos que salían del tonel). Bucón se atribuye la victoria; Maco, la cena. Todos cantan y bailan el éxodo.',[[-1,0],[1,0],[0,0.6]]]]},
 // ---------------- Verona: Terencio y una pantomima
 {id:'heauton',thn:'Teatro de Verona',title:'El que se atormenta a sí mismo',lat:'Heautontimorumenos',author:'Terencio',life:'c. 190-159 a.C.',start:9,end:12,cast:[['Menedemo','#6b5a3a'],['Cremes','#4f6a7d'],['Siro, el esclavo · Clinia','#a07a3a']],
  scenes:[
   ['«Soy hombre»','El viejo Menedemo trabaja su campo desde el alba hasta la noche, como un esclavo. Su vecino Cremes le pregunta por qué se castiga así. Menedemo le dice que no se meta en lo que no le importa. Cremes responde con la frase más famosa de Terencio: «Soy hombre, y nada de lo humano me es ajeno».',[[-1,0],[1,0],[0,10]]],
   ['El hijo perdido','Menedemo confiesa: fue tan duro con su hijo Clinia, enamorado de una muchacha pobre, que el joven se marchó a Asia a servir como soldado. Desde entonces el padre vive como un pobre para castigarse. Cremes le aconseja calma y perdón.',[[-1,0],[1,0],[0,10]]],
   ['Clinia vuelve','Clinia regresa en secreto y se esconde en casa de Cremes. El esclavo Siro aprovecha el lío para sacarle dinero a Cremes y ayudar al hijo de este, que también está enamorado. Cremes, que tan bien aconsejaba a los demás, no ve lo que pasa en su propia casa.',[[0,10],[-1,0],[1,0.4]]],
   ['El consejero engañado','Todo se descubre: la muchacha de Clinia resulta ser una hija de Cremes, abandonada al nacer. Menedemo recupera a su hijo y lo deja casarse. Cremes, burlado, se enfada con su hijo, pero acaba perdonándolo. Terencio enseña que es más fácil dar consejos que seguirlos. Plaudite!',[[-1.4,0],[1.2,0],[0,0.6]]]]},
 {id:'hercules_pant',thn:'Teatro de Verona',title:'Los trabajos de Hércules',lat:'pantomima',author:'un pantomimo y su compañía',life:'según los mitos',dance:true,start:15,end:18,cast:[['El pantomimo (Hércules · Euristeo · Deyanira)','#c9a24a'],['El cantor del coro','#4f6a7d'],['El músico del scabellum','#8a3f5e']],
  scenes:[
   ['El león de Nemea','El coro canta: Hera odia a Hércules, hijo de Zeus, y lo obliga a servir al rey Euristeo. El pantomimo, con máscara de héroe, lucha contra un león invisible: lo ahoga con los brazos, porque las flechas no atraviesan su piel. Se pone su piel como manto.',[[0,0],[-2,0.5],[2,0.6]]],
   ['La Hidra','Cambia de máscara y es la Hidra de Lerna: sus brazos se retuercen como nueve cabezas. Vuelve a ser Hércules y corta cabezas que vuelven a crecer, hasta que su sobrino Yolao quema los cuellos con una antorcha. Los gestos de las manos lo dicen todo: el público aplaude cada cambio.',[[0,0],[-2,0.5],[2,0.6]]],
   ['Los establos y Cerbero','Con un gesto de excavar, Hércules desvía dos ríos para limpiar en un día los establos de Augías. Luego baja al mundo de los muertos y sube encadenado a Cerbero, el perro de tres cabezas: el bailarín ladra con el cuerpo, sin decir una palabra. Euristeo, aterrado, se esconde en una tinaja.',[[0,0.3],[-2,0.5],[2,0.6]]],
   ['La túnica y el Eta','Ahora es Deyanira, la esposa celosa, que le envía una túnica teñida con la sangre del centauro Neso creyendo que es un filtro de amor. La túnica abrasa al héroe. En el monte Eta, Hércules se acuesta en una pira; las llamas lo suben al Olimpo, convertido en dios. El coro calla y el bailarín se queda inmóvil, con los brazos al cielo.',[[0,0],[-2,0.5],[2,0.6]]]]},
 // ---------------- Tarraco: Plauto y un mimo
 {id:'captivi',thn:'Teatro de Tarraco',title:'Los cautivos',lat:'Captivi',author:'Plauto',life:'c. 254-184 a.C.',start:9,end:12,cast:[['Hegión, el viejo','#6b5a3a'],['Tíndaro · Filócrates','#4f6a7d'],['Ergásilo, el parásito','#3f7a3a']],
  scenes:[
   ['Prólogo','El prólogo avisa: esta comedia no es como las otras, no tiene versos sucios ni personajes indecentes. Hegión, un anciano de Etolia, ha perdido a un hijo prisionero de los eleos; para recuperarlo, compra prisioneros eleos y espera cambiarlos por él.',[[0,10],[0,10],[0,10]]],
   ['El cambio de ropas','Entre los prisioneros hay un noble, Filócrates, y su esclavo Tíndaro. Se intercambian la ropa y el nombre: Hegión cree que el esclavo es el amo, y deja libre al verdadero amo para que vaya a Élide a negociar el canje.',[[-1,0],[1,0],[0,10]]],
   ['Descubierto','Otro prisionero reconoce a Tíndaro y lo delata. Hegión, furioso, lo condena a las canteras encadenado. Tíndaro no se arrepiente: «Quien muere por la virtud no muere». El público, que sabe más que los personajes, sufre con él.',[[-1,0],[1,0.4],[0,10]]],
   ['Ergásilo trae la noticia','El parásito Ergásilo, siempre hambriento, llega corriendo del puerto: Filócrates ha cumplido su palabra y vuelve con el hijo de Hegión. Y hay más: Tíndaro es el otro hijo de Hegión, robado de niño por un esclavo. El padre recupera a sus dos hijos. El epílogo pide aplausos para una comedia que hace mejores a los buenos.',[[-1.4,0],[1,0],[0.2,0.5]]]]},
 {id:'mimo_herencia',thn:'Teatro de Tarraco',title:'El cazador de herencias',lat:'mimus',author:'una compañía de mimos',life:'a la manera de Filistión',start:15,end:18,cast:[['El viejo rico','#6b5a3a'],['El cazador de herencias','#4f6a7d'],['La archimima, la esclava lista','#8a3f5e',true]],
  scenes:[
   ['El viejo enfermo','Un viejo rico, sin hijos, se hace el enfermo en la cama. Lo hace a propósito: así todos los que esperan heredar le traen regalos. Su esclava, la archimima, la actriz principal de la compañía, se lo cuenta al público guiñándole un ojo.',[[0,0.6],[0,10],[1.5,0]]],
   ['Los regalos','Llega el cazador de herencias con un tordo cebado, después con un ánfora de vino, después con un poema en honor del viejo. Cada vez que el viejo tose, el cazador sonríe; cada vez que mejora, se pone triste.',[[0,0.6],[-1.2,0],[1.5,0]]],
   ['El testamento','El viejo dicta su testamento delante del cazador, que ya se ve rico. La esclava escribe muy despacio y lee en voz alta: «A mi fiel esclava, la libertad y toda mi fortuna. Al cazador de herencias, el tordo que me trajo».',[[0,0.6],[-1.2,0],[1.5,0.2]]],
   ['La resurrección','El viejo salta de la cama, sano, y baila con su esclava. El cazador huye entre las risas del público. El poeta Horacio y el novelista Petronio se burlaron también de estos cazadores de herencias, un tipo muy conocido en las ciudades del Imperio.',[[-0.5,0],[2,0.6],[0.5,0]]]]},
 // ---------------- Emerita: pantomima de Dido y Plauto
 {id:'dido_pant',thn:'Teatro de Emerita',title:'Dido abandonada',lat:'pantomima',author:'un pantomimo y su compañía',life:'según Virgilio, Eneida IV',dance:true,start:9,end:12,cast:[['El pantomimo (Dido · Eneas · Mercurio)','#8a3f5e'],['El cantor del coro','#4f6a7d'],['El tañedor de tibias','#c9a24a']],
  scenes:[
   ['La reina de Cartago','El coro canta los versos de Virgilio: Dido, la reina que fundó Cartago, ha acogido a Eneas y a los troyanos náufragos. El pantomimo, con máscara de reina, escucha embelesada el relato de la caída de Troya.',[[0,0],[-2,0.5],[2,0.6]]],
   ['La tormenta y la cueva','Durante una cacería estalla una tormenta; Dido y Eneas se refugian en una cueva. El bailarín cambia de máscara de la reina al héroe y vuelve a la reina. El coro canta: «Aquel día fue el primero de su muerte».',[[0,0],[-2,0.5],[2,0.6]]],
   ['Mercurio','Ahora es Mercurio, con el sombrero alado, que baja del cielo y ordena a Eneas partir hacia Italia: su destino es fundar la estirpe de Roma, no reinar en Cartago. Eneas prepara las naves en secreto. Dido lo descubre y le suplica.',[[0,0.4],[-2,0.5],[2,0.6]]],
   ['La pira','Las naves se alejan. Dido sube a una pira con la espada de Eneas y maldice a los troyanos: entre Cartago y Roma no habrá nunca paz. Así explica Virgilio las guerras púnicas. El bailarín cae despacio y se queda inmóvil; el coro calla.',[[0,0],[-2,0.5],[2,0.6]]]]},
 {id:'rudens',thn:'Teatro de Emerita',title:'La maroma',lat:'Rudens',author:'Plauto',life:'c. 254-184 a.C.',start:15,end:18,cast:[['Démones, el viejo','#6b5a3a'],['Palestra · Ampelisca','#e6c8b8',true],['Gripo, el pescador · Tracalión','#3f6a7a']],
  scenes:[
   ['Prólogo de Arturo','La estrella Arturo cuenta que ha desencadenado una tormenta para castigar a un traficante sin escrúpulos que huía por mar con dos muchachas. El barco ha naufragado junto a la costa de Cirene, frente a la casa del viejo Démones y a un templo de Venus.',[[0,10],[0,10],[0,10]]],
   ['Las náufragas','Palestra y Ampelisca llegan a la playa, cada una por su lado, empapadas y muertas de miedo. Se encuentran, se abrazan y se refugian en el templo de Venus, donde la sacerdotisa las acoge.',[[0,10],[-0.6,0.3],[0,10]]],
   ['La maleta y la maroma','El pescador Gripo saca del mar con su red una maleta y sueña con hacerse rico. Tracalión, un esclavo, agarra la maroma de la red y no la suelta: discuten a tirones quién es el dueño de lo que trae el mar.',[[0,10],[0,10],[0,0]]],
   ['El reconocimiento','En la maleta están los juguetes de Palestra de cuando era niña: así descubre Démones que ella es su hija, robada hace años. El traficante es castigado, Palestra se casa con el joven que la buscaba y Gripo recibe una recompensa. Plaudite!',[[-1,0],[0.5,0],[2,0.6]]]]},
 // ---------------- Carthago Nova: el cartaginés de Plauto y una pantomima
 {id:'poenulus',thn:'Teatro de Carthago Nova',title:'El cartaginés',lat:'Poenulus',author:'Plauto',life:'c. 254-184 a.C.',start:9,end:12,cast:[['Hannón, el cartaginés','#7a2a5e'],['Agorastocles · Milfión','#4f6a7d'],['Adelfasia · Anterastila','#e6c8b8',true]],
  scenes:[
   ['Las hijas perdidas','En Calidón vive el joven Agorastocles, cartaginés de nacimiento, robado de niño y adoptado por un griego. Está enamorado de Adelfasia, una muchacha que un traficante tiene esclavizada con su hermana. Su esclavo Milfión prepara una trampa legal para liberarlas.',[[0,10],[-1,0],[1.5,0.4]]],
   ['Llega Hannón','Llega al puerto un viejo cartaginés, Hannón, con túnica larga y pendientes, que recorre el mundo buscando a sus dos hijas robadas. Saluda en su lengua: «Yth alonim ualonuth…». Milfión «traduce» el púnico con disparates y el público se ríe; los estudiosos modernos han conseguido leer esos versos.',[[0,0],[-1.5,0],[0,10]]],
   ['Parientes','Hannón y Agorastocles descubren que son tío y sobrino. Y entonces Hannón reconoce a las dos muchachas por las señales de cuando eran niñas: son sus hijas. Llora de alegría.',[[0,0],[-1.4,0],[1.4,0]]],
   ['El final','El traficante es llevado a juicio y pierde todo. Hannón promete a Agorastocles la mano de Adelfasia. Que esta comedia se represente en Carthago Nova tiene su gracia: la escribió Plauto unos veinte años después de que Escipión tomara la ciudad. Plaudite!',[[0,0],[-1.4,0],[1.4,0]]]]},
 {id:'perseo_pant',thn:'Teatro de Carthago Nova',title:'Perseo y Andrómeda',lat:'pantomima',author:'un pantomimo y su compañía',life:'según los mitos',dance:true,start:15,end:18,cast:[['El pantomimo (Perseo · Medusa · Andrómeda)','#3f6a7a'],['El cantor del coro','#4f6a7d'],['El músico del scabellum','#8a3f5e']],
  scenes:[
   ['La Gorgona','El coro canta: Perseo, hijo de Zeus y de Dánae, debe traer la cabeza de Medusa, cuya mirada convierte en piedra. Con sandalias aladas y un escudo pulido como un espejo, el bailarín avanza de espaldas, mirando solo el reflejo.',[[0,0],[-2,0.5],[2,0.6]]],
   ['La cabeza de Medusa','Cambio de máscara: ahora es Medusa, con serpientes en el pelo, que se retuerce dormida. Perseo corta la cabeza sin mirarla; de la sangre nace Pegaso, el caballo alado.',[[0,0],[-2,0.5],[2,0.6]]],
   ['Andrómeda en la roca','Volando sobre Etiopía, Perseo ve a una princesa encadenada a una roca junto al mar: Andrómeda, a la que sus padres ofrecen a un monstruo marino para salvar el reino. El bailarín es Andrómeda, con los brazos atados, mirando el mar con terror.',[[0,0],[-2,0.5],[2,0.6]]],
   ['El monstruo','Perseo baja del cielo, lucha con el monstruo y lo convierte en piedra con la cabeza de Medusa. Libera a Andrómeda y se casa con ella. El coro canta que sus estrellas brillan todavía en el cielo.',[[0,0],[-2,0.5],[2,0.6]]]]},
 // ---------------- Lugdunum: Séneca y una pantomima
 {id:'oedipus_sen',thn:'Teatro de Lugdunum',title:'Edipo',lat:'Oedipus',author:'Séneca',life:'c. 4 a.C.-65 d.C.',start:9,end:12,cast:[['Edipo','#7a2a2a'],['Yocasta · Creonte','#3a3a40'],['Tiresias · Manto · el anciano','#8d8a85']],
  scenes:[
   ['La peste','Edipo, rey de Tebas, abre la obra con un monólogo sombrío: una peste mata a hombres y animales, los campos están secos, las piras no dan abasto. Teme que la culpa sea suya: un oráculo le dijo que mataría a su padre. Séneca escribe con imágenes duras y frases cortantes, a la manera estoica.',[[0,0],[0,10],[0,10]]],
   ['El sacrificio de Tiresias','El adivino Tiresias, ciego, y su hija Manto leen las entrañas de un toro y una ternera, como harían los harúspices etruscos: todo sale al revés y anuncia un crimen terrible. Es una escena muy de Séneca: el público romano reconoce sus propios ritos.',[[-1.5,0],[0,10],[1,0]]],
   ['La voz de Layo','Creonte cuenta que ha visto en un bosque cómo se invocaba al fantasma del rey Layo: el muerto acusó a su asesino, que se sienta en su trono. Edipo no quiere creerlo y acusa a Creonte de conspirar.',[[-1.4,0],[1.2,0],[0,10]]],
   ['La verdad','Un anciano de Corinto y un pastor cuentan cómo un niño con los pies atravesados fue salvado en el monte: es Edipo. Edipo se arranca los ojos y Yocasta se quita la vida. El coro canta que nadie escapa del destino, y Edipo sale de Tebas llevándose la peste con él. Los estoicos decían que hay que aceptar lo que no depende de nosotros.',[[0,0],[1.6,0.6],[-1.4,0]]]]},
 {id:'paris_pant',thn:'Teatro de Lugdunum',title:'El juicio de Paris',lat:'pantomima',author:'un pantomimo y su compañía',life:'según los mitos',dance:true,start:15,end:18,cast:[['El pantomimo (Paris · Mercurio · las diosas)','#c9a24a'],['El cantor del coro','#4f6a7d'],['El tañedor de tibias','#8a3f5e']],
  scenes:[
   ['La manzana de oro','A la boda de Peleo y Tetis no invitaron a la Discordia, que arrojó entre los invitados una manzana de oro: «Para la más bella». Juno, Minerva y Venus se la disputan. El bailarín es Mercurio, que lleva la manzana volando hasta el monte Ida.',[[0,0],[-2,0.5],[2,0.6]]],
   ['El pastor del Ida','En el Ida vive un pastor, Paris, que en realidad es hijo del rey de Troya. El bailarín, con gorro frigio y cayado, cuida su rebaño. Mercurio le entrega la manzana: él será el juez.',[[0,0],[-2,0.5],[2,0.6]]],
   ['Tres promesas','Cada diosa intenta convencerlo. Juno, majestuosa, le promete reinar sobre Asia; Minerva, con casco y lanza, la victoria en la guerra; Venus, la mujer más hermosa del mundo, Helena de Esparta. El pantomimo cambia de máscara y de manera de moverse para cada una: es el número más aplaudido.',[[0,0],[-2,0.5],[2,0.6]]],
   ['La elección','Paris da la manzana a Venus. Las otras dos diosas se marchan furiosas: de esta elección nacerá la guerra de Troya, y de Troya, Eneas y Roma. El coro termina con un canto a Venus, madre de los romanos.',[[0,0],[-2,0.5],[2,0.6]]]]},
 // ---------------- modo Atenas: el Pireo (comedias de Aristófanes)
 {id:'pluto',thn:'Teatro del Pireo',title:'Pluto',lat:'Ploûtos',author:'Aristófanes',life:'c. 446-386 a.C.',start:9,end:12,chorus:{n:12,c:'#8a7350',s:true},cast:[['Crémilo, el campesino','#c9b48b'],['Pluto, el dios ciego · Carión','#c9a24a'],['Pobreza · Hermes','#5a5a60']],
  scenes:[
   ['El ciego','El campesino Crémilo y su esclavo Carión siguen a un viejo ciego y harapiento: el oráculo de Delfos le ha dicho que siga al primero que encuentre al salir. El viejo resulta ser Pluto, la Riqueza: Zeus lo dejó ciego para que no pueda distinguir a los honrados de los malvados, y por eso se va siempre con estos.',[[-1,0],[1,0],[0,10]]],
   ['La Pobreza','Crémilo decide curarle la vista. Aparece entonces una mujer pálida y terrible: la Pobreza. Discute con Crémilo: si todos fueran ricos, nadie trabajaría, nadie haría zapatos ni sembraría trigo; ella es la que obliga a los hombres a esforzarse. Crémilo no se deja convencer y la echa.',[[-1,0],[0,10],[1.2,0]]],
   ['Una noche en el santuario de Asclepio','Carión cuenta a la mujer de Crémilo la noche que han pasado en un santuario de Asclepio: el sacerdote recogía de noche las ofrendas del altar, y Carión se comió las gachas de una vieja. Luego llegó el dios, y dos serpientes lamieron los ojos de Pluto. ¡Ahora ve!',[[0,10],[0.5,0],[0,10]]],
   ['Todos honrados, todos ricos','Ahora los honrados son ricos y los malvados, pobres: un sicofanta se queja de que ya nadie lo teme. Hermes llega muerto de hambre, porque los hombres ya no ofrecen sacrificios a los dioses, y pide trabajo. Una procesión con antorchas lleva a Pluto a instalarse en el tesoro de Atenea, en la Acrópolis.',[[-1,0],[1,0.3],[1.6,0.6]]]]},
 {id:'ecclesiazusae',thn:'Teatro del Pireo',title:'Las asambleístas',lat:'Ekklesiázousai',author:'Aristófanes',life:'c. 446-386 a.C.',start:15,end:18,chorus:{n:12,c:'#6a4d7a',f:true},cast:[['Praxágora','#8a3f5e',true],['Blépiro, su marido · Cremes','#4f6a7d'],['El vecino desconfiado','#8a7350']],
  scenes:[
   ['Barbas postizas','Antes del alba, Praxágora reúne a las mujeres de Atenas con los mantos y los bastones de sus maridos y barbas postizas. Ensayan cómo hablar en la asamblea: a una se le escapa jurar por las dos diosas, como las mujeres; a otra, llamar «señoras» al público.',[[0,0],[0,10],[0,10]]],
   ['En la Pnyx','Blépiro sale de casa envuelto en el vestido de su mujer, porque ella se ha llevado su manto. Cremes vuelve de la asamblea y le cuenta lo ocurrido: un joven muy pálido ha convencido a todos de entregar el gobierno a las mujeres, «lo único que no hemos probado todavía».',[[0,10],[-1,0],[1,0]]],
   ['El nuevo orden','Praxágora explica su plan: todos los bienes serán comunes, la tierra, el dinero y las casas; se acabarán los pleitos y los robos, porque nadie tendrá nada propio; todos comerán juntos en comidas públicas. Blépiro hace preguntas y ella tiene respuesta para todo. Pocos años después, Platón discutirá ideas parecidas en la República.',[[0,0],[-1.4,0],[0,10]]],
   ['¿Y si nadie obedece?','Un ciudadano obediente saca sus muebles en procesión para entregarlos; su vecino se ríe y decide esperar a ver qué hacen los demás, pero no se pierde el banquete común. La comedia termina con una invitación a cenar un plato de nombre interminable, la palabra más larga de la lengua griega.',[[0,10],[-1,0],[1.4,0]]]]},
 // ---------------- modo Atenas: Corinto (Sófocles y un drama satírico)
 {id:'edipo_rey',thn:'Teatro de Corinto',title:'Edipo rey',lat:'Oidípous týrannos',author:'Sófocles',life:'c. 497-406 a.C.',start:9,end:12,chorus:{n:12,c:'#5a5048'},cast:[['Edipo','#7a2a2a'],['Creonte · Tiresias · Yocasta','#3a3a40'],['El mensajero de Corinto · el pastor','#8a7350']],
  scenes:[
   ['La peste de Tebas','Ante el palacio de Tebas, los suplicantes piden ayuda a su rey: una peste arrasa la ciudad. Edipo, que ya la salvó una vez resolviendo el enigma de la Esfinge, ha enviado a Creonte a Delfos. El oráculo responde: hay que expulsar al asesino del antiguo rey, Layo.',[[0,0],[0,10],[0,10]]],
   ['Tiresias','El adivino ciego Tiresias no quiere hablar. Edipo lo insulta y lo acusa de conspirar con Creonte, hasta que el anciano estalla: «El asesino que buscas eres tú». Edipo, que tiene ojos, no ve; Tiresias, ciego, lo ve todo.',[[-1,0],[1,0],[0,10]]],
   ['El mensajero de Corinto','Llega un mensajero de Corinto: ha muerto el rey Pólibo, al que Edipo cree su padre. El público de Corinto se agita: es un paisano. Para tranquilizar a Edipo, el mensajero le revela que Pólibo no era su padre: él mismo lo recibió de niño, con los pies atravesados, de manos de un pastor del Citerón.',[[-1,0],[1,0.4],[1.6,0]]],
   ['La verdad','El viejo pastor, obligado a hablar, confirma lo peor. Yocasta ha comprendido antes y se ha quitado la vida; Edipo se arranca los ojos con sus broches. El coro termina: no llamemos feliz a ningún mortal hasta que haya cruzado el último día de su vida sin sufrir. Aristóteles la pondrá como modelo de tragedia.',[[0,0],[0,10],[1.4,0]]]]},
 {id:'ciclope',thn:'Teatro de Corinto',title:'El Cíclope',lat:'Kýklops',author:'Eurípides',life:'480-406 a.C.',start:15,end:17,chorus:{n:12,c:'#7a5a3a',s:true},cast:[['Ulises','#4f6a7d'],['Polifemo, el Cíclope','#5a4a3a'],['Sileno','#8d8a85']],
  scenes:[
   ['Los sátiros esclavos','Después de la tragedia, la fiesta. Sileno, el viejo compañero de Dioniso, y sus hijos los sátiros, con orejas y colas de caballo, han naufragado en Sicilia y ahora son esclavos del Cíclope Polifemo: cuidan sus ovejas y echan de menos el vino.',[[0,10],[0,10],[0,0]]],
   ['Llega Ulises','Desembarca Ulises con sus compañeros, buscando comida. Ofrece vino a cambio de queso y corderos. Sileno, que no prueba el vino desde hace años, le vendería todo el rebaño de su amo por un trago.',[[-1,0],[0,10],[1,0]]],
   ['Polifemo','Vuelve el Cíclope y Sileno echa la culpa a los forasteros. Ulises le pide hospitalidad en nombre de los dioses; Polifemo se ríe: él solo adora a su estómago. Se lleva a la cueva a los compañeros de Ulises para cenárselos.',[[-1.2,0],[1,0],[0.4,0.6]]],
   ['«Nadie»','Ulises emborracha al Cíclope y le dice que se llama «Nadie». Cuando Polifemo cae dormido, le clava una estaca ardiendo en su único ojo. «¡Nadie me ha cegado!», grita el gigante, y nadie viene a ayudarle. Ulises y los sátiros, libres, se embarcan para volver a servir a Dioniso. Es el único drama satírico que conservamos entero.',[[-1.5,0],[1,0],[0.4,0.6]]]]}
);
// los teatros los construye theatre(); aquí, actores con máscara, músico, público y programa
const RPERF={actors:{},chorus:{},aud:[],cur:{},scene:{},tibia:4,shown:false};
const ROMA_THN=['Teatro de Pompeyo','Teatro de Marcelo'];
// romaTheatres() prepara los teatros que aún no tienen público: se llama al construir Roma y otra vez cuando ya están hechos los destinos (y en el modo Atenas para los teatros griegos de fuera de la ciudad)
function romaTheatres(){
  const mask=(g,c)=>{if(GLB.ok){const ro={mask:lam(c||'#efe5d4'),hair:lam('#2a1a12')};g.add(glbPart('P_mask',ro));g.add(glbPart('P_mask_hair',ro));}};
  ROMA.theatres.forEach((T,ti)=>{if(T.crowd)return;
    const plays=ROMA_PLAYS.filter(p=>(p.thn||ROMA_THN[p.th])===T.name);T.plays=plays;
    T.stageY=T.greek?0.5:1.2;T.stageZ=T.greek?T.R0+0.6:T.R0-1.2;
    for(const pl of plays){pl.ti=ti;
      RPERF.actors[pl.id]=pl.cast.map(([nm,col,fem],i)=>{const g=makePerson({chiton:col,himation:col,female:fem||/Estáfila|Erotia/.test(nm),hair:'#2a1a12'});g.scale.setScalar(1.08);mask(g,i===0?'#e9d8b8':'#efe5d4');g.visible=false;scene.add(g);return g;});
      RPERF.chorus[pl.id]=[];if(pl.chorus)for(let i=0;i<pl.chorus.n;i++){const g=makePerson({chiton:pl.chorus.c,himation:pl.chorus.c,female:!!pl.chorus.f,hair:'#2a1a12',short:!!pl.chorus.s});mask(g,'#e9dcc6');g.visible=false;scene.add(g);RPERF.chorus[pl.id].push(g);}}
    // tañedor de tibia o de aulós (la doble flauta que acompaña los cantos)
    const mu=makePerson({chiton:'#e9dfc8',himation:'#8a3f5e',hair:'#3a2a1e'});const mp=toW(T.R0*0.9,T.greek?T.R0*0.7:T.R0+0.2,T.x,T.z,T.a);mu.position.set(mp[0],T.gy+(T.greek?0:1.2),mp[1]);mu.rotation.y=T.a+Math.PI;mu.visible=false;scene.add(mu);T.mus=mu;
    // público en las gradas: solo durante la función
    const geo=new THREE.CylinderGeometry(0.2,0.26,1.15,5);geo.translate(0,0.58,0);const cols=['#efe8da','#e2d6c0','#a8392b','#4f6a7d','#c9a24a','#8a7350','#f4efe4','#6a4d7a'],mats=[],cl=[];
    const q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),p=new THREE.Vector3(),sc=new THREE.Vector3(1,1,1),steps=T.steps||24;
    for(let j=0;j<steps;j++){const r=T.R0+2+(T.R1-T.R0-6)*(j+0.5)/steps,y=1.2+(T.H-6)*(j+1)/steps,n=Math.round(Math.PI*r/1.5);
      for(let i=0;i<n;i++){if(R()<0.4)continue;const t=Math.PI+(i+rr(0.2,0.8))/n*Math.PI,lx=Math.cos(t)*r,lz=Math.sin(t)*r,w=toW(lx,lz,T.x,T.z,T.a);p.set(w[0],T.gy+y,w[1]);q.setFromAxisAngle(up,T.a+Math.atan2(-lx,-lz));mats.push(new THREE.Matrix4().compose(p,q,sc));cl.push(new THREE.Color(pick(cols)));}}
    const im=new THREE.InstancedMesh(geo,WHITE_M,mats.length);mats.forEach((m,i)=>{im.setMatrixAt(i,m);im.setColorAt(i,cl[i]);});im.frustumCulled=false;im.visible=false;scene.add(im);T.crowd=im;
    // senadores (o decuriones, en las colonias) en la orquesta; en los teatros griegos la orquesta es del coro
    T.sen=[];if(!T.greek)for(let i=0;i<8;i++){const t=Math.PI+0.35+i/7*(Math.PI-0.7),r=T.R0*0.55,w=toW(Math.cos(t)*r,Math.sin(t)*r,T.x,T.z,T.a);const s=makePerson({toga:true,chiton:'#efe9dc',himation:'#f3eee2',hair:pick(['#2b1f17','#8d8a85','#5b4532'])});s.position.set(w[0],T.gy,w[1]);s.rotation.y=T.a;s.visible=false;scene.add(s);T.sen.push(s);}
    if(!plays.length)return;
    const pw=toW(T.R0+4,-2,T.x,T.z,T.a);
    const sp=(lx,lz)=>{const w=toW(lx,lz,T.x,T.z,T.a);return[w[0],w[1],T.a];};
    if(T.name==='Teatro de Pompeyo')Object.assign(NPC_POS,{aurelia:sp(-T.R0*0.35,-T.R0*0.2),ambivio:sp(T.R0*1.2,T.R0-1)});else if(T.name==='Teatro de Marcelo')NPC_POS.vibio=sp(T.R0*0.35,-T.R0*0.2);
    const note=THEA_NOTE[T.name]||THEA_NOTE._roma,fmt=p=>/^(pantomima|mimus)$/.test(p.lat)?`${p.title} (${p.lat==='mimus'?'mimo':'pantomima'}, ${p.life}), de ${p.start} a ${p.end} h`:`${p.title} (${p.lat}), de ${p.author} (${p.life}), de ${p.start} a ${p.end} h`;
    const head=plays.every(p=>p.author===plays[0].author)&&plays.length===3?`Hoy se reponen en el ${T.name} tres comedias de ${plays[0].author} (${plays[0].life}): `+plays.map(p=>`${p.title} (${p.lat}), de ${p.start} a ${p.end} h`).join('; ')+'. ':`Hoy en el ${T.name}: `+plays.map(fmt).join('; ')+'. ';
    place(ti<2&&!T.greek?'ro_prog'+ti:'prog_'+T.name.toLowerCase().replace(/[^a-z]+/g,'_'),(T.greek?'Programa del teatro: ':'Programa de los juegos escénicos: ')+T.name,T.greek?'ΔΙΔΑΣΚΑΛΙΑΙ':'LVDI SCAENICI',head+note,pw[0],pw[1],T.a);
  });
}
function updateRomaTheatre(dt,t){
  const el=$('stage');let shown=false;
  ROMA.theatres.forEach((T,ti)=>{if(!T.crowd)return;
    const pl=T.plays.find(p=>clock.h>=p.start&&clock.h<p.end)||null;
    if(pl!==(RPERF.cur[ti]||null)){const old=RPERF.cur[ti];if(old){RPERF.actors[old.id].forEach(g=>g.visible=false);RPERF.chorus[old.id].forEach(g=>g.visible=false);}RPERF.cur[ti]=pl;RPERF.scene[ti]=-1;
      T.crowd.visible=!!pl;T.mus.visible=!!pl;T.sen.forEach(s=>s.visible=!!pl);if(pl)RPERF.chorus[pl.id].forEach(g=>g.visible=true);
      if(pl&&ui!=='start'&&Math.hypot(player.x-T.x,player.z-T.z)<400)toast(`<span class="label">${T.name}</span><br>Empieza ${pl.title}, de ${pl.author}.`);}
    if(!pl)return;
    const far=Math.hypot(player.x-T.x,player.z-T.z)>500;if(far)return;   // lejos no hace falta mover a nadie
    const n=pl.scenes.length,si=Math.min(n-1,Math.floor((clock.h-pl.start)/(pl.end-pl.start)*n)),sc=pl.scenes[si];RPERF.scene[ti]=si;
    pl.cast.forEach((c,i)=>{const g=RPERF.actors[pl.id][i],pos=sc[2][i],off=pos[1]>=9.5;g.visible=!off;if(off)return;
      const w=toW(pos[0]*2.2,T.stageZ+pos[1],T.x,T.z,T.a);if(Math.hypot(w[0]-g.position.x,w[1]-g.position.z)>15)g.position.set(w[0],T.gy+T.stageY,w[1]);g.position.x+=(w[0]-g.position.x)*Math.min(1,dt*1.5);g.position.z+=(w[1]-g.position.z)*Math.min(1,dt*1.5);g.position.y=T.gy+T.stageY;
      g.rotation.y=T.a+Math.PI+Math.sin(t*0.7+i)*0.3;const a=g.userData.arms;if(a){const k=pl.dance?1.6:1;a[1].rotation.x=-0.7*k+Math.sin(t*2.4*k+i)*0.5*k;a[0].rotation.x=Math.sin(t*1.7*k+i)*0.3*k;}});
    RPERF.chorus[pl.id].forEach((g,i,arr)=>{const ang=t*0.15+i/arr.length*TAU,r=T.R0*0.55,w=toW(Math.cos(ang)*r,Math.sin(ang)*r-T.R0*0.1,T.x,T.z,T.a);g.position.set(w[0],T.gy+0.03+Math.abs(Math.sin(t*3+i))*0.08,w[1]);g.rotation.y=T.a+Math.atan2(-Math.sin(ang),Math.cos(ang))+Math.PI/2;
      const a=g.userData.arms;if(a){a[0].rotation.x=Math.sin(t*2+i)*0.6;a[1].rotation.x=-Math.sin(t*2+i)*0.6;}});
    const a=T.mus.userData.arms;if(a){a[0].rotation.x=a[1].rotation.x=-1.2+Math.sin(t*3)*0.05;}
    const near=Math.hypot(player.x-T.x,player.z-T.z)<T.R1+10;
    if(near&&ui==='play'&&el){shown=true;el.hidden=false;el.querySelector('.st').textContent=pl.title+' ('+pl.lat+') · '+pl.author+' · escena '+(si+1)+' de '+n+': '+sc[0];el.querySelector('.sx').textContent=sc[1];
      RPERF.tibia-=dt;if(RPERF.tibia<0){RPERF.tibia=4+Math.random()*5;playAulos();}}
  });
  if(!shown&&RPERF.shown&&el)el.hidden=true;RPERF.shown=shown;
}
// teatro griego del siglo IV a.C.: gradas de tierra y madera en la ladera, orquesta redonda para el coro y una escena de madera con tres puertas
function greekTheatre(o){
  const a=o.rot||0,gy=terrainH(o.x,o.z),R0=o.R0,R1=o.R1,H=o.H,steps=14,N=36;
  const P=(u,k)=>{const t=Math.PI+u*Math.PI*0.94+Math.PI*0.03;let r,y;if(k===0){r=R0;y=0;}else if(k===1){r=R0;y=0.6;}else{const s=Math.floor((k-2)/2),e=(k-2)%2;r=R0+2+(R1-R0-6)*(s+e)/steps;y=0.6+(H-6)*(s+1)/steps+0.6;}return[Math.cos(t)*r,y,Math.sin(t)*r];};
  ringMesh(ringGeo(2+steps*2+1,N,P,null,k=>k%2?'#b89a6a':'#9c7f55'),o.x,gy,o.z,a);
  const back=ringGeo(2,N,(u,k)=>{const t=Math.PI+u*Math.PI*0.94+Math.PI*0.03;return[Math.cos(t)*(R1-4),k?H+0.6:-2,Math.sin(t)*(R1-4)];},null,()=>'#8a7a5a');ringMesh(back,o.x,gy,o.z,a);
  for(let i=0;i<N;i++){const t0=Math.PI*1.03+i/N*Math.PI*0.94,t1=Math.PI*1.03+(i+1)/N*Math.PI*0.94;wsegO(o,a,Math.cos(t0)*(R1-4),Math.sin(t0)*(R1-4),Math.cos(t1)*(R1-4),Math.sin(t1)*(R1-4),0.6);}
  const orch=new THREE.Mesh(new THREE.CircleGeometry(R0,36),lam('#cdb993'));orch.rotation.x=-Math.PI/2;orch.position.set(o.x,gy+0.04,o.z);scene.add(orch);
  box(1.2,0.9,1.2,M.marble,o.x,gy+0.45,o.z);addCirc(o.x,o.z,0.9);   // la thymele, el altar de Dioniso
  const g=grp(o.x,gy,o.z,a),sw=R0*2.6;box(sw,5.4,4,M.wood,0,2.7,R0+4.3,g);box(sw+1,0.4,4.6,lam('#6a4a2e'),0,5.6,R0+4.3,g);
  box(sw*0.8,0.5,3,lam('#8a6a44'),0,0.25,R0+0.8,g);   // tablado bajo delante de la escena
  for(const dx of[-R0*0.6,0,R0*0.6])box(dx?1.8:2.4,3,0.2,M.dark,dx,1.5+0.5,R0+2.25,g);
  for(const s of[-1,1])box(3,5.4,6,M.wood,s*(sw/2+1.2),2.7,R0+3.3,g);   // paraskenia
  wsegO(o,a,-sw/2-2.7,R0+2.3,sw/2+2.7,R0+2.3);
  ROMA.theatres.push({x:o.x,z:o.z,a,gy,R0,R1,H,name:o.name,greek:true,steps});
  footprints.push({x:o.x,z:o.z-R1*0.4,w:R1*2,d:R1*1.2,a,c:'#b8a07a',name:o.name});
  {const c=toW(0,R0*0.4,o.x,o.z,a);footprints.push({x:c[0],z:c[1],w:R0*3.4,d:R0*2.6,a,c:'#cdb993',name:o.name});}
  return g;
}

// espectadores con quienes hablar: una lectora de Ovidio, un paduano devoto de Tito Livio y el jefe de la compañía
ROMA_NPCS.push(
{id:'aurelia',name:'Aurelia',title:'Lectora apasionada de Ovidio',glyph:'A',look:{female:true,chiton:'#efe2d6',himation:'#6a4d7a',hair:'#3b2a1e'},
 cat:'Cultura',lesson:'Ovidio, el poeta desterrado',where:'En la orquesta del Teatro de Pompeyo',
 summary:'Publio Ovidio Nasón (43 a.C.-17/18 d.C.) fue el poeta más brillante de la época de Augusto: escribió poemas de amor (Amores, Arte de amar), las Heroidas, los Fastos sobre el calendario romano y las Metamorfosis, unos doscientos cincuenta mitos de transformaciones encadenados en quince libros. En el 8 d.C. Augusto lo desterró a Tomis, a orillas del mar Negro, por «un poema y un error»; allí escribió las Tristes y las Pónticas, y allí murió.',
 intro:'¡Por Venus, otra comedia de viejos avaros! Me llamo Aurelia. Vengo al teatro porque aquí está todo el mundo, pero yo prefiero a Ovidio. Me sé de memoria medio libro de las Metamorfosis. ¿Lo has leído? Siéntate, que antes de que vuelvan los actores te cuento algo.',
 topics:[
  ['¿Qué son las Metamorfosis?','Quince libros en verso con más de doscientos mitos, desde el caos del principio del mundo hasta César convertido en estrella. Todos tratan de cuerpos que cambian de forma: Dafne se convierte en laurel huyendo de Apolo, Narciso en flor, Aracne en araña por desafiar a Minerva, Ícaro cae al mar cuando el sol derrite la cera de sus alas. Y Ovidio los enlaza todos, uno detrás de otro, como si fuera una sola historia. Termina diciendo que, mientras se lea, vivirá.'],
  ['¿Por qué lo desterraron?','Nadie lo sabe del todo. Él mismo escribió que lo perdieron «un poema y un error». El poema sería el Arte de amar, que enseñaba a seducir justo cuando Augusto aprobaba leyes para proteger el matrimonio. El error… dicen que vio algo que no debía en la casa del emperador; quizá algo relacionado con Julia, la nieta de Augusto, desterrada el mismo año. Lo mandaron a Tomis, en el mar Negro, entre bárbaros que no hablaban latín.'],
  ['¿Qué escribió en el destierro?','Cartas en verso, las Tristes y las Pónticas, suplicando volver. Describe el frío, el Danubio helado por el que pasan los carros, los getas con flechas envenenadas, que no le entienden. Dice que hasta ha aprendido su lengua. Augusto murió sin perdonarlo, y Tiberio tampoco lo hizo. Murió allí, hace más de sesenta años. Es lo más triste que he leído nunca, y aun así no consigo dejar de leerlo.']],
 quiz:{q:'¿Adónde desterró Augusto a Ovidio?',a:['A Tomis, a orillas del mar Negro','A la isla de Capri','A Alejandría, en Egipto'],ko:'No. En el 8 d.C. Augusto desterró a Ovidio a Tomis (la actual Constanza, en Rumanía), a orillas del mar Negro, donde murió.'}},
{id:'vibio',name:'Lucio Vibio',title:'Paduano, admirador de Tito Livio',glyph:'L',look:{chiton:'#efe9dc',toga:true,himation:'#f3eee2',hair:'#8d8a85',beard:true,beardC:'#9a968e'},
 cat:'Historia',lesson:'Tito Livio y la historia de Roma',where:'En la orquesta del Teatro de Marcelo',
 summary:'Tito Livio (59 a.C.-17 d.C.), nacido en Patavium (Padua), escribió en 142 libros la historia de Roma desde su fundación (Ab urbe condita) hasta el 9 a.C. Se conservan 35. En su prefacio dice que la historia sirve para ver ejemplos de lo que hay que imitar y de lo que hay que evitar. Augusto lo trataba como amigo, aunque lo llamaba «pompeyano» por su simpatía hacia la República. Gracias a él conocemos la mayor parte de las leyendas de la Roma antigua.',
 intro:'Salve. Lucio Vibio, de Patavium, la misma ciudad que Tito Livio, el más grande historiador de Roma. Mi abuelo lo conoció de viejo, cuando volvió a morir a su tierra. Estas comedias están bien, pero si quieres historias de verdad, pregúntame por Livio.',
 topics:[
  ['¿Qué escribió Tito Livio?','La historia entera de Roma, desde la llegada de Eneas hasta los tiempos de Augusto: ciento cuarenta y dos libros. Trabajó en ella más de cuarenta años. Empieza con un prefacio famoso: dice que no sabe si vale la pena, pero que lo mejor de conocer la historia es tener ante los ojos ejemplos de todo tipo, para imitar lo bueno y evitar lo vergonzoso. Y confiesa que, mientras escribe sobre el pasado, se olvida de los males de su tiempo.'],
  ['Cuéntame una de sus historias','La de Aníbal, que es la mejor parte. Aníbal cruzó los Alpes con elefantes, en invierno, con nieve, y bajó a Italia. Venció en el Trasimeno y en Cannas, donde murieron en un solo día decenas de miles de romanos. Livio cuenta que Aníbal mandó a Cartago montones de anillos de oro de los caballeros muertos. Y aun así Roma no se rindió: cuando Aníbal acampó a las puertas de la ciudad, el terreno donde estaba su campamento se vendió en Roma, y se pagó el precio completo.'],
  ['¿Y cómo era Livio?','Un hombre de provincias que nunca hizo política, cosa rara en un historiador romano. Augusto lo apreciaba y le dejaba escribir con libertad, aunque lo llamaba «pompeyano» porque alababa a los defensores de la República. Hay una anécdota que me encanta: un hombre de Gades, en Hispania, viajó hasta Roma solo para ver a Livio, lo miró y se volvió a casa sin visitar nada más. Así era su fama.']],
 quiz:{q:'¿De qué trata la gran obra de Tito Livio?',a:['De la historia de Roma desde su fundación, en 142 libros','De la vida de los doce primeros emperadores','De la guerra de las Galias contada por César'],ko:'No. Tito Livio escribió Ab urbe condita, la historia de Roma desde su fundación, en 142 libros, de los que se conservan 35.'}},
{id:'ambivio',name:'Ambivio',title:'Jefe de una compañía de cómicos',glyph:'A',look:{chiton:'#c9a24a',himation:'#8a3f2f',hair:'#5b4532',beard:true,staff:true},
 cat:'Cultura',lesson:'El teatro en Roma: Plauto y Terencio',where:'Junto al escenario del Teatro de Pompeyo',
 summary:'La comedia romana adaptaba comedias griegas, sobre todo de Menandro, con personajes griegos con manto (palliata). Plauto (c. 254-184 a.C.) escribió muchas comedias, de las que se conservan 21, llenas de canciones, juegos de palabras y esclavos astutos. Terencio (c. 190-159 a.C.), un antiguo esclavo de Cartago, escribió seis comedias más refinadas y realistas. En época imperial el público prefería el mimo y la pantomima, pero las comedias antiguas se seguían leyendo en las escuelas y a veces se reponían.',
 intro:'¡Ah, un espectador! Soy Ambivio, y llevo el nombre de Lucio Ambivio Turpión, el gran actor que estrenó las comedias de Terencio hace casi doscientos cincuenta años. Mi compañía repone hoy a los clásicos. No es fácil: la gente de ahora prefiere el mimo y la pantomima, pero un buen esclavo de Plauto todavía hace reír a cualquiera.',
 topics:[
  ['¿Quién era Plauto?','Un umbro que llegó a Roma, trabajó en el teatro, perdió su dinero en negocios y, dicen, tuvo que trabajar en un molino de harina, donde escribía sus comedias. Se le atribuían unas ciento treinta, y el sabio Varrón aceptó veintiuna como seguras. Toma comedias griegas y las llena de chistes, canciones e insultos ingeniosos. Su gran personaje es el esclavo listo que engaña a su amo y lo arregla todo, como Tranión en La comedia del fantasma.'],
  ['¿Y Terencio?','Un esclavo africano, de Cartago, al que su amo, un senador, educó y liberó. Murió joven en un viaje a Grecia. Escribió solo seis comedias, más tranquilas y elegantes que las de Plauto, con personajes que piensan y dudan. Suya es la frase que todos citan: «Soy hombre, y nada humano me es ajeno». En la escuela se aprende latín con él. Pero ya le costaba llenar el teatro en vida: La suegra fracasó dos veces.'],
  ['¿Cómo se hace una función?','Los actores somos todos hombres, también los que hacen de mujeres, y casi todos esclavos o libertos. Llevamos máscara, peluca y el manto griego. Un tañedor de tibia, la doble flauta, acompaña las partes cantadas. El escenario representa una calle con dos o tres casas, y todo pasa delante de las puertas. Antes había que montar teatros de madera; desde Pompeyo tenemos teatros de piedra. Y al final, siempre lo mismo: «¡Aplaudid!».']],
 quiz:{q:'¿De dónde tomaban sus argumentos Plauto y Terencio?',a:['De comedias griegas, sobre todo de Menandro, que adaptaban al latín','De la historia de los reyes de Roma','De los mitos etruscos'],ko:'No. Plauto y Terencio adaptaban comedias griegas (la llamada comedia nueva, sobre todo de Menandro), con personajes griegos que vestían el manto o pallium.'}}
);
Object.assign(ROMA_SRC,{
 aurelia:{a:['Ovidio, Metamorfosis I 1-4 y XV 871-879','Ovidio, Tristes II 207 («un poema y un error») y III 10 (el Danubio helado)','Ovidio, Pónticas'],m:['P. Hardie (ed.), The Cambridge Companion to Ovid (2002)'],n:['Aurelia es inventada. La causa del destierro de Ovidio sigue sin conocerse.']},
 vibio:{a:['Tito Livio, prefacio; XXI 32-38 (Aníbal en los Alpes); XXIII 12 (los anillos de Cannas); XXVI 11 (el campo de Aníbal vendido en Roma)','Tácito, Anales IV 34 (Augusto lo llamaba pompeyano)','Plinio el Joven, Cartas II 3.8 (el hombre de Gades)'],m:['R. M. Ogilvie, A Commentary on Livy, Books 1-5 (1965)','J. D. Chaplin y C. S. Kraus (eds.), Livy (2009)'],n:['Lucio Vibio es inventado.']},
 ambivio:{a:['Terencio, prólogos de La suegra; El atormentador de sí mismo 77 («Homo sum, humani nihil a me alienum puto»)','Aulo Gelio, Noches áticas III 3 (Plauto y el molino; las obras auténticas según Varrón)','Suetonio, Vida de Terencio','Horacio, Epístolas II 1.170-176'],m:['E. Segal, Roman Laughter (1987)','R. C. Beacham, The Roman Theatre and Its Audience (1991)'],n:['Ambivio es inventado; toma el nombre del actor Lucio Ambivio Turpión. En el siglo I d.C. las comedias de Plauto y Terencio se representaban poco: el público prefería el mimo y la pantomima.']}
});
ROMA_ESSAYS.splice(5,0,{id:'teatro',cat:'Contexto',title:'El teatro en Roma',body:[
 'El teatro llegó a Roma desde Etruria y desde las ciudades griegas del sur de Italia. En el 240 a.C. Livio Andronico, un griego de Tarento, presentó la primera tragedia y la primera comedia en latín. Durante dos siglos las obras se representaron en escenarios de madera que se desmontaban después de los juegos: el Senado desconfiaba de los teatros permanentes.',
 'La comedia palliata, con personajes y escenarios griegos, adaptaba la comedia nueva griega, sobre todo a Menandro. Plauto (c. 254-184 a.C.) la llenó de música, juegos de palabras y esclavos tramposos; se conservan 21 obras suyas. Terencio (c. 190-159 a.C.), un antiguo esclavo cartaginés, escribió seis comedias de tono más contenido, con diálogos cuidados y personajes llenos de matices.',
 'Pompeyo construyó el primer teatro de piedra en el 55 a.C.; le siguieron el de Balbo y el de Marcelo. En el juego, el Teatro de Pompeyo repone comedias de Plauto (La olla, La comedia del fantasma y Los Menecmos) y el de Marcelo, de Terencio (Los hermanos, La suegra y Formión).',
 'En el siglo I d.C., sin embargo, lo que más gustaba eran el mimo (escenas cómicas sin máscara, con actrices) y la pantomima (un bailarín que representaba un mito con gestos, acompañado de música y coro). Las comedias de Plauto y Terencio se leían en las escuelas y solo a veces se reponían. Que el juego las ponga en escena el mismo día es una licencia.'],
 src:{a:['Tito Livio VII 2 (los orígenes del teatro en Roma)','Horacio, Epístolas II 1','Tácito, Anales XIV 20 (el teatro de Pompeyo)'],m:['R. C. Beacham, The Roman Theatre and Its Audience (1991)','E. Segal, Roman Laughter (1987)'],n:['La compañía y el calendario de funciones son inventados.']}});
ROMA_GLOSS.push(
['Plauto',['plauto'],'Tito Macio Plauto (c. 254-184 a.C.), el gran autor de comedias de Roma: 21 obras conservadas, llenas de canciones y esclavos astutos.'],
['Terencio',['terencio'],'Publio Terencio Afer (c. 190-159 a.C.), antiguo esclavo de Cartago, autor de seis comedias refinadas. «Soy hombre, y nada humano me es ajeno».'],
['Menandro',['menandro'],'Poeta cómico de Atenas (342-291 a.C.), maestro de la comedia nueva griega, que Plauto y Terencio adaptaron.'],
['Palliata',['palliata','palliatas','pallium'],'Comedia romana de argumento y personajes griegos, vestidos con el manto griego o pallium.'],
['Parásito',['parásito','parásitos'],'Personaje de comedia que vive de comer gratis en casa de otros a cambio de halagos y favores.'],
['Mimo',['mimo','pantomima'],'El mimo: escenas cómicas sin máscara, con actrices. La pantomima: un bailarín que representaba un mito con gestos. Eran los espectáculos favoritos del siglo I.'],
['Tibia',['tibia'],'La doble flauta de lengüeta, equivalente al aulós griego, que acompañaba las partes cantadas de las comedias.'],
['Plaudite',['plaudite'],'«¡Aplaudid!»: la petición con la que terminaban las comedias romanas.'],
['Tomis',['tomis'],'Ciudad griega a orillas del mar Negro (la actual Constanza, en Rumanía), donde murió desterrado Ovidio.'],
['Patavium',['patavium'],'Padua, en el norte de Italia, patria de Tito Livio.'],
['Aníbal',['aníbal','cannas'],'General cartaginés que cruzó los Alpes y derrotó a los romanos en Cannas (216 a.C.), en la segunda guerra púnica.'],
['Ab urbe condita',['ab urbe condita'],'«Desde la fundación de la ciudad»: el título de la historia de Roma de Tito Livio.']
);

