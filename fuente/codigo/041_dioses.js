// ============================================================ dioses
// Fuera de las murallas, cada uno junto a un lugar ligado a su culto. Se distinguen por un brillo ligero en la piel.
// need: qué completa su encargo — visit (estela de un lugar), island, play (ver una obra), wedding (cortejo nupcial), captain (hablar con el armador del Pireo)
const GODS=[
{id:'hermes',name:'Hermes',gr:'ΕΡΜΗΣ',glyph:'Ε',title:'mensajero de los dioses',where:'en la encrucijada al salir del Dípilon',
 at:()=>gatePt(D,48,-16),look:{chiton:'#e9dfc8',himation:'#3f6a9a',hair:'#3b2a1e',attrs:['G_petasos','G_caduceus_hand','G_wings_feet']},raise:0.5,
 intro:'¡Por fin alguien que mira por dónde va! Hermes, para servirte, o para servirme de ti, ya veremos. Guardo los caminos, los mercados, los heraldos y, si me apuras, a los ladrones. Las encrucijadas son mías: aquí se cruzan los vivos, los muertos y las noticias.',
 topics:[['¿Es verdad que robaste a tu hermano el día que naciste?','Nací al amanecer, a mediodía ya tocaba la lira y por la noche le robé cincuenta vacas a Apolo. Las llevé andando hacia atrás para que las huellas engañaran a cualquiera. Cuando me pilló, le regalé la lira que había hecho con una tortuga. Se le pasó el enfado al instante. Moraleja: un buen regalo vale más que una buena excusa.'],
  ['¿Por qué hay hermas en todas las puertas?','Porque los atenienses son listos: un pilar con mi cara y nadie se equivoca de camino ni se le cuela un mal espíritu en casa. Hace treinta años, la noche antes de que zarpara la flota a Sicilia, alguien mutiló casi todas las hermas de la ciudad. Hubo pánico, denuncias, ejecuciones… y la expedición acabó en desastre. No digo que fuera cosa mía. Tampoco digo que no.'],
  ['¿Qué haces con los muertos?','Los acompaño hasta la barca de Caronte. Por eso os ponen un óbolo en la boca: el barquero cobra, como todo el mundo. Es el único viaje en el que nadie me pide descuento.']],
 quest:{need:{t:'captain'},reward:5,goal:'Habla con Hagnón, el armador del Pireo.',
  ask:'Tengo un recado para Hagnón, el armador del Pireo: que zarpe con el viento del norte y no antes, o perderá la carga en el cabo Sunion. Yo podría llevárselo en un suspiro, pero tengo otros cien recados de Zeus. Tú tienes piernas, y si no, ¡silba a un caballo! Ve a hablar con él.',
  wait:'¿Todavía no has visto a Hagnón? Sigue la carretera entre los Muros Largos hasta el Pireo. Los barcos no esperan, y yo tampoco.',
  done:'¿Se lo has dicho? ¡Perfecto! Ahora sabe algo que los demás armadores no saben, y venderá su vino antes que nadie. Así es el comercio, querido: la información vale más que la carga. Toma, te lo has ganado. Y no digas a nadie de dónde lo has sacado.'}},
{id:'hefesto',name:'Hefesto',gr:'ΗΦΑΙΣΤΟΣ',glyph:'Η',title:'dios del fuego y la forja',where:'entre los hornos del Cerámico, fuera del Dípilon',
 at:()=>gatePt(D,34,30),look:{chiton:'#8a7a62',himation:'#5a4a3a',hair:'#2a1e16',beard:true,noHimation:true,attrs:['G_pilos','G_hammer_hand']},raise:0.35,glow:'#ff9a50',
 intro:'Cuidado con el horno, que está a punto. Soy Hefesto. Sí, el cojo. El que hizo el trono de oro de mi madre, la armadura de Aquiles y la red en la que pillé a mi mujer con Ares. No me gustan los discursos; me gusta el trabajo bien hecho.',
 topics:[['¿Por qué cojeas?','Hera me tiró del Olimpo al nacer porque le parecí feo. Otra vez Zeus me tiró por defenderla. Caí un día entero, hasta Lemnos. Desde entonces camino así. Les mandé a cambio un trono precioso, del que nadie se podía levantar. Tuvieron que emborracharme para que la soltara. Ya ves: el rencor también se forja.'],
  ['¿Qué haces aquí, entre los alfareros?','Los alfareros, los herreros y los broncistas son mi gente. En las Calqueias, en otoño, los artesanos nos honran a Atenea y a mí juntos: ella pone la idea y yo el fuego. Ahí arriba, sobre el Ágora, está nuestro templo, rodeado de talleres. Es el único sitio de la ciudad donde huele a carbón y a respeto.'],
  ['¿Es verdad que hiciste a la primera mujer?','A Pandora, sí, con barro y agua, por encargo de Zeus. Atenea la vistió, Afrodita le dio gracia y Hermes, ese charlatán, le puso la curiosidad. Luego abrió la jarra y salieron todos los males. Yo solo hice la figura. Las instrucciones no eran mías.']],
 quest:{need:{t:'visit',place:'hefestion',r:16},reward:5,goal:'Visita el Hefestión, sobre el Ágora, y lee su estela.',
  ask:'Hace años que no subo a mi templo; con esta pierna, la colina se me hace larga. Sube tú al Hefestión, sobre el Ágora, y dime si las estatuas de bronce de Alcámenes siguen brillando o si los atenienses las tienen llenas de cagadas de paloma.',
  wait:'El Hefestión está en la colina al oeste del Ágora. No tiene pérdida: es el templo con más columnas de toda la plaza.',
  done:'¿Brillan? Bien. Alcámenes sabía lo que hacía: me hizo de pie, sin disimular la cojera, pero con dignidad. Toma. Y si alguna vez necesitas un buen cuchillo, ve a cualquier fragua y di que vas de mi parte.'}},
{id:'demeter',name:'Deméter',gr:'ΔΗΜΗΤΗΡ',glyph:'Δ',title:'señora del trigo',where:'en la Vía Sacra, camino de Eleusis',
 at:()=>gatePt(SG,72,9),look:{female:true,chiton:'#e8d9a8',himation:'#7a6a3a',hair:'#6b4a24',attrs:['G_wheat','G_torch_hand','G_diadem']},raise:0.45,
 intro:'Bienvenido al camino de Eleusis, extranjero. Por aquí pasa cada otoño la procesión de los iniciados. Soy Deméter. Todo el pan que comes en Atenas lo he hecho crecer yo, aunque los atenienses prefieren traerlo del Ponto.',
 topics:[['¿Qué le pasó a tu hija?','Hades se llevó a mi hija Core bajo la tierra mientras cogía flores. La busqué nueve días con antorchas, sin comer ni lavarme. Mientras yo lloraba, nada crecía: los hombres morían de hambre y los dioses se quedaban sin sacrificios. Al final Zeus cedió, pero ella había comido seis granos de granada en el reino de los muertos. Por eso pasa una parte del año abajo, conmigo enfadada, y a eso lo llamáis invierno.'],
  ['¿Qué pasa en los Misterios?','No te lo voy a contar. Ni a ti ni a nadie. Hace unos años condenaron a Alcibíades por parodiarlos en un banquete. Te diré solo esto: quien los ha visto no teme a la muerte igual que antes. Si quieres saber más, hazte iniciar.'],
  ['¿Cómo aprendieron los hombres a cultivar?','Se lo enseñé a Triptólemo, el hijo del rey de Eleusis, en agradecimiento por su hospitalidad cuando yo vagaba disfrazada de anciana. Le di un carro tirado por serpientes aladas y semillas para repartir por toda la tierra. Por eso los atenienses dicen que el trigo nació en el Ática. Les gusta creer que todo nació en el Ática.']],
 quest:{need:{t:'visit',place:'eleusinion',r:14},reward:5,goal:'Visita el Eleusinion de la ciudad, al sureste del Ágora.',
  ask:'Dentro de la ciudad, al pie de la Acrópolis, tengo un pequeño santuario: el Eleusinion. Allí se guardan los objetos sagrados antes de la procesión. Ve y comprueba que mis sacerdotes lo tienen en orden. Yo no puedo entrar en la ciudad sin que la cosecha lo note.',
  wait:'El Eleusinion está subiendo por la Vía Panatenaica, entre el Ágora y la Acrópolis.',
  done:'Gracias. Que no te falte nunca el pan en la mesa. Y cuando veas una espiga, recuerda que alguien lloró nueve días para que creciera.'}},
{id:'atenea',name:'Atenea',gr:'ΑΘΗΝΑ',glyph:'Α',title:'protectora de Atenas',where:'entre los olivos sagrados de la Academia',
 at:()=>[ACADEMY.x-DROMOS.ox*78-DROMOS.oz*18,ACADEMY.z-DROMOS.oz*78+DROMOS.ox*18],look:{female:true,chiton:'#e9e2d2',himation:'#6a7fa0',hair:'#5a3a22',helmet:'attic',attrs:['G_aegis','P_spear','P_spearhead','P_shield']},
 intro:'Estos olivos son míos: las moríai, hijas del primer olivo que planté en la Acrópolis. Su aceite se da como premio en mis Panateneas. Arrancar uno se castiga con el destierro. Soy Atenea, y esta ciudad lleva mi nombre por algo. Pregunta, pero pregunta bien.',
 topics:[['¿Cómo ganaste Atenas?','Poseidón golpeó la roca con el tridente e hizo brotar una fuente de agua salada. Muy espectacular, y muy inútil. Yo planté un olivo: aceite, madera, comida, luz. Los atenienses eligieron bien. Poseidón inundó la llanura de rabia; todavía hoy se enfada cuando se acuerda.'],
  ['¿Qué opinas de los atenienses?','Los quiero, pero me desesperan. Son capaces de levantar el Partenón y de condenar a Sócrates. Votan una guerra un día y se arrepienten al siguiente. Tienen la mejor flota del mundo y la perdieron por soberbia. Aun así, aquí se discute, se piensa y se aprende como en ninguna otra parte. Por eso sigo aquí.'],
  ['¿Es verdad que naciste de la cabeza de Zeus?','Armada y gritando. Mi padre se había tragado a mi madre, Metis, la prudencia, por miedo a que tuviera un hijo más fuerte que él. Le dolía tanto la cabeza que Hefesto se la abrió con un hacha. Desde entonces Zeus piensa un poco mejor. Yo soy su mejor idea.']],
 quest:{need:{t:'visit',place:'olivo',r:12},reward:5,goal:'Visita el olivo de Atenea, junto al Erecteion, en la Acrópolis.',
  ask:'Cuando los persas quemaron la Acrópolis, hace más de un siglo, mi olivo ardió. Al día siguiente ya tenía un brote nuevo de un codo de largo. Sube a la Acrópolis, busca mi olivo junto al Erecteion y dime si sigue verde. Aprenderás algo sobre esta ciudad.',
  wait:'El olivo está en el Pandroseion, el patio al oeste del Erecteion, en la Acrópolis.',
  done:'Sigue verde, claro. Esa es la lección: a Atenas la pueden quemar, sitiar o derrotar, y vuelve a brotar. Lo hizo tras los persas y lo ha hecho tras los Treinta. Toma, y recuerda que la inteligencia es también una forma de valor.'}},
{id:'apolo',name:'Apolo',gr:'ΑΠΟΛΛΩΝ',glyph:'Π',title:'dios de la música y la profecía',where:'junto al gimnasio del Liceo',
 at:()=>[LYCEUM.x+32,LYCEUM.z-24],look:{chiton:'#f3ecdc',himation:'#c9a24a',hair:'#c9a24a',leaf:'#5f8a3c',attrs:['G_wreath','G_lyre']},
 intro:'Saludos, mortal. Este gimnasio lleva mi nombre: Apolo Liceo, el de los lobos. Soy el dios de la música, de la luz y de la profecía. Ya sabía que vendrías. También sé lo que vas a preguntar, pero me gusta oíroslo decir.',
 topics:[['¿Qué significa «conócete a ti mismo»?','Está escrito en la entrada de mi templo en Delfos, junto a «nada en exceso». Significa que eres mortal y no un dios. Sócrates lo entendió a su manera: cuando mi Pitia dijo que nadie era más sabio que él, se pasó la vida intentando demostrar que me equivocaba. Al final entendió que su sabiduría consistía en saber que no sabía nada. No me equivoco nunca, pero me encanta que lo intenten.'],
  ['¿Es verdad lo de Marsias?','Un sátiro encontró la flauta doble que Atenea había tirado y se atrevió a desafiarme. Ganó quien tocara mejor tocando el instrumento al revés. Con la lira se puede; con el aulós, no. Lo colgué de un pino y lo desollé. Sí, fue cruel. La música es armonía, y la armonía exige medida. También en los castigos, supongo.'],
  ['¿Dónde naciste?','En Delos, una isla que flotaba a la deriva porque Hera había prohibido a toda tierra firme acoger a mi madre, Leto. Ella se agarró a una palmera y me dio a luz junto al lago sagrado. Desde entonces la isla está quieta, y nadie puede nacer ni morir en ella. Los atenienses la purificaron hace cuarenta años: sacaron todas las tumbas. Muy considerados.']],
 quest:{need:{t:'island',id:'delos'},reward:6,goal:'Viaja a Delos (en barco desde el Pireo).',
  ask:'Ve a Delos, mi isla. Busca la palmera de mi madre junto al lago sagrado y escucha a los cisnes. Quien no ha visto Delos no ha visto la luz del Egeo. Hagnón, en el Pireo, te llevará por una dracma.',
  wait:'Delos te espera en el centro de las Cícladas. El barco sale del Pireo.',
  done:'Lo has visto, ¿verdad? La luz de Delos no se parece a ninguna otra. Toma este pago y una profecía gratis: vivirás más de lo que crees y aprenderás menos de lo que quieres. Así es para todos.'}},
{id:'artemis',name:'Ártemis',gr:'ΑΡΤΕΜΙΣ',glyph:'Ρ',title:'señora de los animales',where:'en Agras, junto al río Iliso',
 at:()=>[CYNO.x+48,CYNO.z-38],look:{female:true,chiton:'#efe9da',himation:'#5f7a4a',hair:'#7a4a24',noHimation:true,attrs:['G_quiver','G_bow_hand']},raise:0.3,
 intro:'Quieto. Estabas a punto de pisar un nido. Soy Ártemis. Aquí, en Agras, junto al Iliso, me llaman Agrotera, la cazadora. No me gustan las ciudades ni los hombres que hablan demasiado. Tú tienes cara de escuchar, así que te concedo un momento.',
 topics:[['¿Qué es eso de las 500 cabras?','Antes de Maratón, los atenienses me prometieron una cabra por cada persa muerto. Murieron tantos que no había cabras suficientes en el Ática. Así que pactamos quinientas al año. Todavía me las traen, cada verano, aquí mismo. Es lo único en lo que los atenienses son puntuales.'],
  ['¿Qué hacen las niñas en Braurón?','Antes de casarse, algunas niñas atenienses me sirven en Braurón: las llaman osas. Corren desnudas, juegan, aprenden los ritos. Es su último tiempo libre antes de ser esposas. Yo nunca me casé. Le pedí a mi padre ser virgen para siempre, y tener arco y flechas como mi hermano. Me lo concedió todo.'],
  ['¿Es verdad lo de Acteón?','Me vio bañándome desnuda en una fuente. Lo convertí en ciervo y sus propios perros lo despedazaron. ¿Exagerado? Puede. Pero entendió, aunque tarde, que hay cosas que no se miran.']],
 quest:{need:{t:'visit',place:'brauronion',r:14},reward:5,goal:'Visita el santuario de Ártemis Brauronia, en la Acrópolis.',
  ask:'En la Acrópolis tengo un santuario, el de Ártemis Brauronia. Allí las mujeres dejan los vestidos de las que murieron de parto, y los de las que sobrevivieron. Ve, míralos y piensa en ellas. Nadie se acuerda de esas mujeres.',
  wait:'El Brauronion está en la Acrópolis, justo después de los Propileos, a la derecha.',
  done:'Lo has visto. Bien. Los hombres cuentan sus batallas; esas mujeres libraron otra, y muchas la perdieron. Toma, y respeta siempre a los animales y a las parturientas: ambos están bajo mi arco.'}},
{id:'afrodita',name:'Afrodita',gr:'ΑΦΡΟΔΙΤΗ',glyph:'Φ',title:'diosa del amor',where:'en los Jardines, junto al Iliso',
 at:()=>[CYNO.x-30,CYNO.z+38],look:{female:true,chiton:'#f1d9d0',himation:'#c9708a',hair:'#c9902f',leaf:'#4a7a4a',attrs:['G_diadem','G_mirror_hand']},raise:0.55,glow:'#ffc0b0',
 intro:'Oh, qué alegría, una visita. Aquí me llaman Afrodita de los Jardines. Los atenienses vienen a este rincón del Iliso a declararse, a lamentarse o a esconderse de sus mujeres. ¿Tú a qué vienes? No contestes: ya lo noto.',
 topics:[['¿Cómo naciste?','Hesíodo dice que nací de la espuma del mar, cuando Crono arrojó al mar lo que le cortó a su padre Urano. Homero dice que soy hija de Zeus y Dione. A mí me gusta más la versión de la espuma: es más poética y no le debo nada a nadie.'],
  ['¿Qué pasó con la manzana?','En la boda de Peleo y Tetis, la Discordia lanzó una manzana de oro con una inscripción: «para la más bella». Hera, Atenea y yo la reclamamos. Zeus, que no es tonto, pasó el problema a un pastor troyano, Paris. Hera le ofreció poder; Atenea, victoria. Yo le ofrecí a la mujer más bella del mundo. Ganó la mejor oferta. Lo malo es que Helena ya estaba casada… y luego vino la guerra. No fue culpa mía. Bueno, no del todo.'],
  ['¿Estás casada?','Con Hefesto. Zeus me casó con el más feo de los dioses para evitar peleas. Funcionó a medias. Ares es otra historia: más guapo, menos listo. Hefesto nos pilló con una red invisible y llamó a todos los dioses para que lo vieran. Los dioses se rieron. Hermes dijo que no le importaría estar en el lugar de Ares. Típico.']],
 quest:{need:{t:'island',id:'troya'},reward:6,goal:'Viaja a Troya (Ilión) en barco desde el Pireo.',
  ask:'Ve a Troya. Pasea por las murallas donde Helena miraba a los griegos y donde Paris eligió. Luego vuelve y dime si todavía merece la pena una ciudad por amor. Yo creo que sí. Atenea cree que no. Desempátanos.',
  wait:'Troya está al otro lado del Egeo. Hagnón, el armador del Pireo, va hasta allí.',
  done:'¿Lo ves? Diez años de guerra, una ciudad en ruinas, y aún así todo el mundo sigue cantando aquella historia. Eso es el amor: un desastre que nadie quiere olvidar. Toma, y que tengas suerte con quien tú sabes.'}},
{id:'dioniso',name:'Dioniso',gr:'ΔΙΟΝΥΣΟΣ',glyph:'Ι',title:'dios del vino y del teatro',where:'en el camino del norte, hacia Eleuteras',
 at:()=>gatePt(NG,62,11),look:{chiton:'#6f3a6e',himation:'#a85a8a',hair:'#3b2a1e',leaf:'#3f6a2a',attrs:['G_wreath','G_thyrsus']},glow:'#ffb0e0',
 intro:'¡Un forastero! ¿Has bebido? No importa, ya beberás. Soy Dioniso. Vengo de Eleuteras, en la frontera: de allí trajeron los atenienses mi vieja estatua de madera, y por eso celebran las Dionisias. El vino, el teatro, la locura sagrada… todo eso es mío. Y también lo que hay detrás de las máscaras.',
 topics:[['¿Por qué el teatro es tuyo?','Porque en el teatro dejáis de ser vosotros mismos. Un zapatero se pone una máscara y es Agamenón; un ciudadano canta en el coro y llora por Troya. Eso es mi don: salir de uno mismo. Empezó con cantos en mis fiestas y los atenienses lo convirtieron en tragedia. Por eso las obras se hacen en mi fiesta y en mi teatro.'],
  ['¿Qué les pasa a quienes no te reconocen?','Pregúntale a Penteo, el rey de Tebas. Me encerró, se burló de mis bacantes y quiso espiarlas. Su propia madre, poseída por mí, lo despedazó creyendo que era un león. Eurípides lo cuenta en Las bacantes; esta noche la representan. No soy cruel: solo soy lo que se niega. Y lo que se niega, vuelve.'],
  ['¿Es verdad lo de Ariadna?','Teseo la abandonó dormida en Naxos después de que ella lo salvara del laberinto. Típico ateniense: muy héroe, muy desagradecido. Yo la encontré llorando en la playa y me casé con ella. Le regalé una corona que ahora brilla en el cielo. Si vas a Naxos, brinda por ella.']],
 quest:{need:{t:'play'},reward:5,goal:'Asiste a una función en el teatro de Dioniso (siéntate en las gradas mientras se representa una obra).',
  ask:'Hoy reponen tres tragedias de Eurípides en mi teatro. Ve a ver una. Siéntate en las gradas, escucha al coro y no te vayas antes del final. Te prometo que saldrás siendo un poco otro.',
  wait:'Las funciones son por la mañana (Medea, de 8 a 11), por la tarde (Las troyanas, de 14 a 17) y por la noche (Las bacantes, de 20 a 23). Pulsa T para dejar pasar las horas.',
  done:'¿Has llorado? ¿Has sentido miedo? Entonces has estado conmigo. Toma, y la próxima vez que bebas vino, mézclalo con agua, como los civilizados… o no. Ya me entiendes.'}},
{id:'poseidon',name:'Poseidón',gr:'ΠΟΣΕΙΔΩΝ',glyph:'Ψ',title:'señor del mar',where:'en la playa del Falero',
 at:()=>{const p=shoreAlong(SGATE.x,SGATE.z,-0.52,0.85,2400);return[p[0]-6,p[1]-8];},look:{chiton:'#d8e3e6',himation:'#2f5f7a',hair:'#5a5a5a',beard:true,beardC:'#6b6b6b',attrs:['G_trident']},glow:'#a8e0ff',
 intro:'¡Ja! Un terrícola se acerca al mar. Soy Poseidón, el que sacude la tierra. Desde esta playa del Falero zarpó Teseo hacia Creta, y hasta aquí llega mi aliento cuando me enfado. ¿Has venido a rezar antes de embarcarte? Haces bien.',
 topics:[['¿Sigues enfadado por perder Atenas?','¿Enfadado? ¡Yo hice brotar una fuente en la roca de la Acrópolis! ¿Y qué eligieron? ¡Un arbolito! Inundé la llanura de Eleusis de pura indignación. Ahora los atenienses me rinden culto en el Erecteion, junto a ella, y viven del mar. Del mar, ¿entiendes? Su flota, su comercio, su trigo… todo viaja sobre mí. Gané yo, aunque no lo sepan.'],
  ['¿Por qué tiemblan las tierras?','Porque golpeo el suelo con el tridente. Hace cuarenta años, en Esparta, un terremoto mató a miles y los ilotas se sublevaron. Los espartanos aún tiemblan cuando lo recuerdan. Y bien que hacen.'],
  ['¿Qué tienes contra Odiseo?','¡Dejó ciego a mi hijo Polifemo! Le metió una estaca ardiendo en el ojo y luego se burló de él gritándole su nombre desde el barco. Diez años lo tuve dando vueltas por el mar. Si hubiera cerrado la boca, habría llegado a casa en una semana. Lección: nunca te burles del hijo de un dios desde un barco.']],
 quest:{need:{t:'visit',place:'tridente',r:12},reward:5,goal:'Busca en el Erecteion las marcas del tridente y el mar de Erecteo.',
  ask:'En el Erecteion, bajo el pórtico norte, quedan las marcas de mi tridente en la roca, y dentro hay un pozo de agua salada: el mar de Erecteo. Cuando sopla el viento del sur, se oyen las olas. Ve a verlo y dime si los atenienses lo cuidan como merece.',
  wait:'Busca el pórtico norte del Erecteion, en la Acrópolis: allí hay un agujero en el techo para que se vean las marcas desde el cielo.',
  done:'¿Lo has oído, el mar en lo alto de la roca? Eso es mío, aunque el templo sea de ella. Toma, y cuando embarques, vierte un poco de vino al mar. Me acordaré de ti.'}},
{id:'hera',name:'Hera',gr:'ΗΡΑ',glyph:'Ρ',title:'reina de los dioses',where:'en el altar del Falero, junto al mar',
 at:()=>{const a=shoreAlong(SGATE.x,SGATE.z,-0.52,0.85,2400),p=shoreAlong(a[0]+0.85*55+0.52*60,a[1]+0.52*55-0.85*60,-0.52,0.85,400);return[p[0]+5,p[1]-9];},look:{female:true,chiton:'#efe2c4',himation:'#8a2f3a',hair:'#3a2418',attrs:['G_diadem','G_scepter']},
 intro:'Inclínate un poco, mortal. Así, mejor. Soy Hera, esposa de Zeus y reina del Olimpo. Aquí, en el Falero, los atenienses me levantaron un altar. Protejo los matrimonios, cosa que en mi propia casa, ya ves, no siempre ha servido de mucho.',
 topics:[['¿Por qué persigues a las amantes de Zeus?','¿Y qué querías que hiciera? ¿Aplaudir? Ío, Sémele, Alcmena, Leto… cada vez que mi esposo se aburre, se convierte en toro, en cisne o en lluvia de oro. Yo no puedo castigarlo a él; es el rey. Así que castigo lo que puedo. No es justo, lo sé. El matrimonio tampoco lo es siempre.'],
  ['¿Qué pasa con Heracles?','Su nombre significa «gloria de Hera». Irónico, ¿no? Es hijo de Zeus y de Alcmena. Le mandé serpientes a la cuna y locura en la madurez. Él lo superó todo y al final subió al Olimpo. Nos hemos reconciliado: está casado con mi hija Hebe. En las familias pasan estas cosas.'],
  ['¿Cómo es una boda ateniense?','La novia ofrece sus juguetes a Ártemis, se baña con agua de la fuente sagrada y al atardecer viaja en carro a casa del novio, con antorchas, cantos de himeneo y flautas. La suegra la espera con una antorcha en la puerta. Os casáis en invierno, en el mes de Gamelión, que es mi mes. Pero hoy mismo hay una boda en la ciudad.']],
 quest:{need:{t:'wedding'},reward:5,goal:'Acompaña al cortejo nupcial en la ciudad, al atardecer (entre las 18 y las 20 h), al este del Eleusinion.',
  ask:'Esta tarde, al atardecer, una muchacha se casa en la ciudad. Su cortejo pasará al este del Eleusinion. Acércate al carro de la novia y acompáñala un trecho. Que una diosa vea a través de tus ojos cómo empieza un matrimonio, antes de que se estropee.',
  wait:'El cortejo sale entre las 18 y las 20 h, al este del Eleusinion. Pulsa T si quieres que pasen las horas.',
  done:'¿Iba contenta? Las novias siempre parecen contentas en el carro. Ojalá le dure. Toma, y si algún día te casas, sacrifica en mi altar: de alguna forma, todos los matrimonios pasan por mí.'}},
{id:'zeus',name:'Zeus',gr:'ΖΕΥΣ',glyph:'Ζ',title:'padre de dioses y hombres',where:'en la ladera del Licabeto',
 at:()=>[452,-790],look:{chiton:'#f1ead8',himation:'#4a4a7a',hair:'#d8d0c2',beard:true,beardC:'#e2dcd0',attrs:['G_scepter','G_thunderbolt_hand']},raise:0.6,glow:'#fff0b0',
 intro:'Así que eres tú el forastero que recorre mi ciudad favorita… bueno, una de ellas. Soy Zeus. Desde esta ladera veo la Acrópolis, el mar y los asuntos de todos. No te asustes por el rayo: hoy estoy de buen humor.',
 topics:[['¿Por qué proteges a los extranjeros?','Porque cualquier extranjero podría ser yo disfrazado. Así que más vale que os tratéis bien. Me llaman Zeus Xenios, el protector de los huéspedes: quien rompe la hospitalidad me ofende a mí. Paris lo hizo al robar a Helena de casa de su anfitrión, y ya sabes cómo terminó Troya.'],
  ['¿Qué pasa con el templo gigante sin terminar?','El Olimpieion. Lo empezaron los hijos de Pisístrato, los tiranos, hacia el 520: el templo más grande de Grecia. Cuando los echaron, la democracia lo dejó a medias porque le recordaba a los tiranos. Así que llevo ciento treinta años esperando un tejado. Los dioses tenemos paciencia, pero no infinita.'],
  ['¿Es cierto lo de Prometeo?','Robó el fuego del Olimpo y se lo dio a los hombres. Lo encadené a una roca y mi águila le come el hígado cada día. Sí, es duro. Pero el fuego en manos de los hombres… mira: con él hacéis pan, cerámica y bronce, y también incendiáis ciudades. Ya veremos quién tenía razón.']],
 quest:{need:{t:'visit',place:'olimpieion',r:22},reward:7,goal:'Visita el Olimpieion, el templo inacabado de Zeus.',
  ask:'Ve al Olimpieion, al sureste de la Acrópolis. Ponte entre esas columnas a medio hacer y mira qué grande podía haber sido. Luego vuelve y dime si los atenienses merecen que les siga mandando la lluvia.',
  wait:'El Olimpieion está al sureste de la Acrópolis, junto al río Iliso.',
  done:'Grande, ¿eh? Algún día alguien lo terminará… dentro de unos siglos, quizá un emperador extranjero. Te lo digo yo, que lo sé. Toma, y sé buen huésped en todas partes. Nunca sabes a quién tienes delante.'}},
{id:'ares',name:'Ares',gr:'ΑΡΗΣ',glyph:'Ϡ',title:'dios de la guerra',where:'junto a los Muros Largos',
 at:()=>[PG.x+LW_DIR[0]*62+LW_DIR[1]*14,PG.z+LW_DIR[1]*62-LW_DIR[0]*14],look:{chiton:'#7a2a1e',himation:'#4a1e18',hair:'#2a1a12',beard:true,spear:true},glow:'#ff9070',
 intro:'¿Qué miras? Soy Ares. Sí, ese Ares. El que los poetas pintan como un bruto. Me gusta estar junto a estas murallas: huelen a piedra nueva y a guerra por venir. Los atenienses las han reconstruido con oro persa. ¡Con oro persa! Ni la vergüenza les queda.',
 topics:[['¿Por qué la colina del tribunal lleva tu nombre?','Porque fui el primer acusado de la historia. Halirrotio, hijo de Poseidón, violó a mi hija Alcipe junto a una fuente. Lo maté, claro. Poseidón me llevó a juicio ante los dioses en esa colina, y me absolvieron. Desde entonces allí se juzgan los homicidios: el Areópago. Fíjate qué ironía: el dios de la guerra, fundador de los tribunales.'],
  ['¿Te gusta la guerra?','Me gusta la verdad. En la guerra nadie miente: o tienes valor o no lo tienes. En la Asamblea, en cambio, todos hablan de paz y votan la guerra; luego mandan a otros a morir. Los espartanos me entienden: antes de la batalla me sacrifican un perro, y luego no retroceden. Los atenienses prefieren a Atenea. Pues muy bien.'],
  ['¿Es cierto que te hirió un mortal?','Diomedes, en Troya, con la ayuda de Atenea, que siempre está en medio. Me clavó la lanza en el vientre y grité como diez mil hombres. Volví al Olimpo y mi propio padre me dijo que era el más odioso de los dioses. Familias.']],
 quest:{need:{t:'visit',place:'areopago',r:20},reward:5,goal:'Sube al Areópago, la colina de Ares, junto a la Acrópolis.',
  ask:'Sube a mi colina, el Areópago, y mira desde allí la Acrópolis. Allí arriba se juzgó a Orestes por matar a su madre, y Atenea desempató a su favor. Siempre ella. Ve y siente lo que es estar en el sitio donde se decide si alguien vive o muere.',
  wait:'El Areópago es la colina rocosa al noroeste de la Acrópolis, frente a los Propileos.',
  done:'¿Has sentido el peso? Allí no hay gloria, solo justicia. Y la justicia, créeme, también es una forma de guerra. Toma. Y si alguna vez tienes que luchar, que sea de frente.'}},
];
const godObjs=[];
const HALO_TEX=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,240,200,0.55)');g.addColorStop(0.35,'rgba(255,220,150,0.22)');g.addColorStop(1,'rgba(255,200,120,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);})();
if(!state.gods||!Array.isArray(state.gods.met))state.gods={met:[],q:{}};
function outsideSpot(x,z){for(let i=0;i<40&&insideWalls(x,z,-14);i++){const a=Math.atan2(z-WALLC.z,x-WALLC.x);x+=Math.cos(a)*8;z+=Math.sin(a)*8;}
  const h=INNER.size/2-45;x=clamp(x,INNER.x-h,INNER.x+h);z=clamp(z,INNER.z-h,INNER.z+h);return findFree(x,z,1.4);}   // dentro de la zona por la que se puede andar
// en Roma: fuera de la ciudad, en la campiña por la que se puede andar y nunca en el río
function romaGodSpot(x,z){const h=INNER.size/2-45;x=clamp(x,INNER.x-h,INNER.x+h);z=clamp(z,INNER.z-h,INNER.z+h);
  for(let i=0;i<30&&(romaInUrbs(x,z)||romaRiverDist(x,z)<romaRiverW(z)+14);i++)x+=x<romaRiverX(z)?-8:8;
  for(let i=0;i<12&&roadDist(x,z)<16;i++)z+=6;return findFree(x,z,1.4);}
function buildGods(){
  {const zi=GODS.findIndex(d=>d.id==='zeus'||d.id==='iuppiter');if(zi>=0)GODS.splice(zi,1);}   // Zeus/Júpiter solo en el Olimpo
  const C=MODE==='roma'?{x:-80,z:-150}:WALLC;
  for(const d of GODS){const[x,z]=MODE==='roma'?romaGodSpot(...d.at()):outsideSpot(...d.at());
    const g=makePerson(Object.assign({scale:1.28,glow:d.glow||'#ffd27a'},d.look));g.position.set(x,floorAt(x,z),z);g.rotation.y=Math.atan2(C.x-x,C.z-z);g.visible=false;scene.add(g);
    if(d.raise&&g.userData.arms)g.userData.arms[1].rotation.x=-d.raise;
    const gc=d.glow||'#ffd27a';
    const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:HALO_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0.8,fog:false,color:gc}));halo.scale.set(3.4,4.4,1);halo.position.y=1.05;g.add(halo);
    const halo2=new THREE.Sprite(new THREE.SpriteMaterial({map:HALO_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0.35,fog:false,color:gc}));halo2.scale.set(7,8,1);halo2.position.y=1.2;g.add(halo2);
    const ring=new THREE.Mesh(new THREE.CircleGeometry(1.4,32),new THREE.MeshBasicMaterial({map:HALO_TEX,color:gc,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0.9}));ring.rotation.x=-Math.PI/2;ring.position.y=0.04;g.add(ring);
    // motas de luz que suben alrededor del dios
    const motes=[];for(let i=0;i<10;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:gc,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0.8,fog:false}));s.scale.setScalar(0.12);g.add(s);motes.push({s,a:R()*TAU,ph:R(),r:rr(0.4,0.9)});}
    halo.userData.extra={halo2,ring,motes};
    const lb=labelSprite(d.name,d.title,false);lb.position.y=2.4;lb.visible=false;g.add(lb);
    const mk=markerSprite();mk.position.y=2.85;g.add(mk);
    addCirc(x,z,0.5);godObjs.push({kind:'god',data:d,g,lb,mk,halo,x,z,shown:false});}
}
function updateGods(dt,t){
  const home=regionOf(player.x)==='atenas';
  for(const o of godObjs){const d=Math.hypot(o.x-player.x,o.z-player.z),vis=home&&d<170;
    if(vis&&!o.shown){o.shown=true;o.g.scale.setScalar(0.01);if(d<120&&!state.gods.met.includes(o.data.id))toast('<span class="label">Una presencia divina</span><br>Algo brilla '+o.data.where+'.');}
    if(!vis)o.shown=false;o.g.visible=vis;if(!vis)continue;
    const s=o.g.scale.x;if(s<1)o.g.scale.setScalar(Math.min(1,s+dt*0.8));   // aparece creciendo desde la nada
    o.halo.material.opacity=0.75+0.2*Math.sin(t*1.7+o.x);o.lb.visible=d<16;
    {const ex=o.halo.userData.extra;ex.halo2.material.opacity=0.3+0.12*Math.sin(t*1.1+o.z);ex.ring.material.opacity=0.7+0.25*Math.sin(t*2.3);
     for(const m of ex.motes){const f=(t*0.25+m.ph)%1;m.s.position.set(Math.cos(m.a+t*0.6)*m.r,0.2+f*2.4,Math.sin(m.a+t*0.6)*m.r);m.s.material.opacity=0.9*Math.sin(f*Math.PI);}}
    const q=state.gods.q[o.data.id];o.mk.visible=!q||q==='ready';o.mk.position.y=2.85+Math.sin(t*2+o.x)*0.08;
    if(d<7){const ta=Math.atan2(player.x-o.x,player.z-o.z);o.g.rotation.y+=wrapA(ta-o.g.rotation.y)*Math.min(1,dt*3);}}
}
function godsDone(){return GODS.filter(d=>state.gods.q[d.id]==='done').length;}
function openGod(o){
  const d=o.data;dlg={n:null,god:d};ui='dialog';releasePointer();
  if(!state.gods.met.includes(d.id)){state.gods.met.push(d.id);qAdd('eu',1,'Los dioses se fijan en ti.');save();}
  $('dGlyph').textContent=d.glyph;setName(d.name);$('dTitle').textContent=d.gr+' · '+d.title+(d.native?' · divinidad romana':' · dios del Olimpo');
  $('dBody').innerHTML='<p>'+d.intro+'</p>';renderGodOpts(d);$('dialog').hidden=false;
}
function renderGodOpts(d){
  const o=$('dOpts');o.innerHTML='';let k=1;const add=(txt,fn,cls)=>{const b=document.createElement('button');if(cls)b.className=cls;b.innerHTML='<span class="n">'+(k++)+'</span><span>'+txt+'</span>';b.onclick=fn;o.appendChild(b);};
  const seen=state.seen['g:'+d.id]||[],q=state.gods.q[d.id],Q=d.quest;
  d.topics.forEach((t,i)=>add(t[0],()=>{state.seen['g:'+d.id]=Array.from(new Set(seen.concat(i)));save();$('dBody').innerHTML='<p>'+t[1]+'</p>';renderGodOpts(d);},seen.includes(i)?'seen':''));
  if(!q)add('¿Puedo hacer algo por ti?',()=>{state.gods.q[d.id]='on';save();$('dBody').innerHTML='<p>'+Q.ask+'</p><div class="verdict">Encargo de '+d.name+': '+Q.goal+'</div>';toast('<span class="label">Encargo divino</span><br>'+Q.goal);renderGodOpts(d);},'quiz');
  else if(q==='on')add('Sobre tu encargo…',()=>{$('dBody').innerHTML='<p>'+Q.wait+'</p><div class="verdict">'+Q.goal+'</div>';renderGodOpts(d);});
  else if(q==='ready')add('He cumplido tu encargo',()=>{state.gods.q[d.id]='done';state.obols+=Q.reward+(qLv('eu')>=3?1:0);qAdd('eu',3,'Has cumplido con un dios: tu piedad crece.');save();updateStats();sfxCoin();$('dBody').innerHTML='<p>'+Q.done+'</p><div class="verdict">Favor de '+d.name+' · +'+Q.reward+cur()+'</div>';toast('<span class="label">Favor divino</span><br>'+d.name+' · +'+Q.reward+cur());renderGodOpts(d);},'quiz');
  atalGodOpts(d,add);progGodOpts(d,add);add('Despedirse',closeDialog);
  setTimeout(()=>{const b=o.querySelector('button');b&&b.focus({preventScroll:true});},30);
}
function godReady(d){state.gods.q[d.id]='ready';save();sfxCoin();toast('<span class="label">Encargo cumplido</span><br>Vuelve con '+d.name+' ('+d.where+') para contárselo.');}
function godEvent(type){for(const d of GODS)if(state.gods.q[d.id]==='on'&&d.quest.need.t===type)godReady(d);}
function checkGodQuests(){
  for(const d of GODS){if(state.gods.q[d.id]!=='on')continue;const n=d.quest.need;let ok=false;
    if(n.t==='visit'){const p=PLACES.find(q=>q.id===n.place);ok=!!p&&regionOf(player.x)===regionOf(p.x)&&Math.hypot(player.x-p.x,player.z-p.z)<(n.r||12);}
    else if(n.t==='island')ok=regionOf(player.x)===n.id;
    else if(n.t==='lesson')ok=state.lessons.includes(n.id);
    else if(n.t==='play')ok=!!currentPlay()&&inCavea(player.x,player.z);
    else if(n.t==='wedding'){const W=SOCIAL.wedding;ok=!!(W&&W.on&&W.mem.length&&Math.hypot(player.x-W.mem[0].g.position.x,player.z-W.mem[0].g.position.z)<30);}
    if(ok)godReady(d);}
}

