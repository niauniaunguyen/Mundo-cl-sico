# Nóstos — Atenas 386 a.C. y Roma 80 d.C. — documento de traspaso

Juego 3D en primera persona para el navegador, en español. Al empezar se elige la época: **Atenas en la primavera del 386 a.C.** o **Roma en el año 80 d.C.** Sirve para aprender política, filosofía, sociedad y mitos.

- **Archivo jugable:** `atenas.html` (unos 5,8 MB; `?modo=roma` o `?modo=atenas` en la dirección se salta el selector): HTML + CSS + JS y los modelos de Blender incrustados en base64.
- **Código fuente:** `fuente/atenas.src.html`, el mismo archivo con el marcador `@@GLB@@` en lugar de los modelos. **Se edita siempre el fuente** y luego se ejecuta `python fuente/construir.py`, que genera `atenas.html` incrustando `modelos/atenas_modelos.glb`.
- **Modelos:** `modelos/atenas_modelos.blend` (escena de Blender con todas las piezas) y `modelos/atenas_modelos.glb` (lo que carga el juego).
- **Publicado como artefacto:** https://claude.ai/artifact/HPMmRcZdwLro9kjKtCX2U9 (versión 43). Para actualizarlo desde otra sesión, hay que leerlo primero con la acción `read` del artefacto y luego publicar pasando esa misma URL como `url`. Así se conserva el enlace.
- **Motor:** Three.js r128 (UMD desde cdnjs) y `GLTFLoader` r128 desde jsDelivr (`three@0.128.0/examples/js/loaders/GLTFLoader.js`). Sin compilación: todo el código va inline, dentro de `(function(){ ... })();`.

## Qué contiene
- **Atenas a escala real** (distancias entre barrios comprimidas): Acrópolis con interiores (Partenón, Erecteion, Propileos, Atenea Niké, Calcoteca, Brauronion), Ágora, Pnyx, Areópago, Cerámico/Dípilon, teatro de Dioniso en cuenco sobre la ladera, Odeón, Academia, Liceo, Cinosarges, Olimpieion, murallas, Muros Largos y Pireo.
- **Ciclo día/noche:** 1 hora de juego = 60 s (`clock.h`). Sonido sintetizado con WebAudio: lira, aulós, multitud, viento, olas, cascos de caballo.
- **51 personajes** (array `NPCS`): lecciones, temas, quiz y fuentes. Los históricos van en `HIST`; los inventados se muestran en otro color.
- **Viajeros con árbol genealógico** (`gen`: `{n,d,s,myth,gap,now,w,c:[]}`; `s` = cónyuge, `w` = agrupa hijos por esposa): Esparta, Macedonia, Siracusa, Chipre, Tesalia, Epiro, Cirene (Aristipo), Troya y Tebas (Epaminondas).
- **Demofonte, el librero:** narra 17 mitos (`MYTHS`, `MYTH_CATS`).
- **Teatro con tres obras de Eurípides** (`PLAYS`): *Medea* de 8 a 11 h, *Las troyanas* de 14 a 17 h y *Las bacantes* de 20 a 23 h. Hay actores con máscara, coro, público y subtítulos (`#stage`).
- **Viajes:** en barco (Hagnón, en el Pireo) a Egina, Delos, Naxos, Creta, Lesbos y Troya (Ilión). Por tierra (Lisicles, en la puerta norte; `openLand`) a Tebas, Micenas y Esparta. Los destinos están en `ISLANDS`, en x = 12000 + i·3000; los de tierra tienen `land:true`.
- **Vida cotidiana** (basada en Hernández de la Fuente y López Melero, *Civilización griega*, 2014): nodriza, madre de la novia, maestro, vecina en la fuente, carnicero de sacrificios, inspector del mercado y naviero. Escenas según la hora en `buildSocial`/`updateSocial`: escuela por la mañana, sacrificio al amanecer y cortejo de boda de 18 a 20 h. También hay mojones de hipoteca.
- **Biblioteca (tecla B):** ensayos (`ESSAYS`), lecciones, mitos, lugares (`PLACES` y `PSRC`) y relieves míticos (`RELIEFS` y `RSRC`). Cada entrada tiene fuentes antiguas, estudios modernos y precisiones. El ensayo «Licencias históricas» recoge todo lo inventado.
- **Juicio jugable**, diario, plano y estelas con lugares.

### Novedades de la versión 10
- **Modelos de Blender** (`GLB`, `loadModels`, `glbPart`, `glbGeo`). Si el GLB no carga, todo vuelve a las primitivas de antes.
  - Personas (`makePersonGLB`): chiton masculino y peplo femenino con pliegues, himation, manto femenino, cabeza con cara, pelo, barba, brazos con mano (pivote en el hombro), mangas, sandalias, hidria, ánfora, cesta, bastón, lanza, escudo, yelmo corintio y máscara teatral. Las estatuas (Pártenos, Prómacos, cariátides, frontones) usan el mismo sistema con otros materiales.
  - Columnas dóricas (éntasis, 20 estrías, equino con anillos) y jónicas (basa ática, estrías con filete, capitel con volutas), instanciadas en `finishColumns`.
  - Tejas cobijas en todos los tejados y antefijas con palmeta en los templos (`ROOFS`, `finishRoofs`).
  - Caballo, burro y oveja con las patas articuladas (`animalGLB`).
  - Atributos de los dioses (`G_*`): rayo, cetro, tridente, lira, arco, carcaj, pétaso, caduceo, alas, trigo, antorcha, tirso, corona, diadema, égida, yelmo ático, martillo, pilos y espejo.
  - Cada pieza conserva el nombre del objeto de Blender (P_ persona, C_ columna, R_ tejado, A_ animal, G_ dios). El nombre del material indica su papel (`cloth`, `drape`, `skin`…) y el juego lo sustituye por el color de cada personaje (`ROLE_C`). Las piezas `*_hand` se modelaron en coordenadas del brazo derecho y van colgadas de él.
- **Caballo (tecla H):** `MOUNT`, `callHorse`, `mountHorse`, `dismount`, `updateMount`. Llega al galope desde atrás; con H se monta y se desmonta; montado, el jugador va al triple de velocidad y a 2,55 m de altura. Al embarcar, el caballo se queda en tierra.
- **Glosario lateral:** `GLOSS` (unos 150 términos con sus variantes). Un `MutationObserver` sobre `#dBody` marca cada término en el texto del diálogo y lo explica en `#gloss`, a la derecha (arriba en pantallas estrechas).
- **Doce dioses** (`GODS`, `buildGods`, `updateGods`, `openGod`), fuera de las murallas, junto a lugares de su culto. Tienen la piel con brillo (`glowSkin`) y un halo, aparecen creciendo cuando te acercas, y cada uno tiene tres temas de conversación y un encargo (`quest.need`: `visit` a una estela, `island`, `play`, `wedding` o `captain`). El progreso se guarda en `state.gods` y se ve en la pestaña «Dioses» del diario y como estrellas en el plano.
- Las personas a más de 180 m no se dibujan (`cullT`).

### Novedades de la versión 11
- **Selector de época** (`#modes`, `chooseMode`, variable `MODE`). Cada época guarda su progreso aparte (`SAVE_KEY`: `atenas-386-v1` y `roma-80-v1`). El botón «Época» vuelve al selector.
- **Modo Roma, año 80 d.C.** Todo su código está en dos bloques del fuente, antes del glosario: «ROMA, AÑO 80 d.C.: contenido» y «ROMA, AÑO 80 d.C.: relieve / constructores / construcción del mundo».
  - `romaSetup()` sustituye el contenido de Atenas antes de construir: 24 personajes (`ROMA_NPCS`; 14 históricos en `ROMA_HIST`: Marcial, Quintiliano, Flavio Josefo, Epicteto, Musonio Rufo, Frontino, Plinio el Joven, Tácito, Dion de Prusa, Sulpicia, Rabirio, Atrecto, Prisco, la vestal Cornelia), fuentes (`ROMA_SRC`), 6 leyendas de Roma (`ROMA_MYTHS`, las cuenta el librero Atrecto), 8 ensayos, cronología, 17 zonas, 35 lugares con estela (`ROMA_PLACES`) y un glosario romano de unos 150 términos (`ROMA_GLOSS`, con `rebuildGloss()`). Moneda: sestercios.
  - Relieve: `romaH` (colinas `RHILLS`, zonas llanas `RFLATS`, el Tíber `RIV`/`romaRiverX`/`romaRiverW`, isla Tiberina `ISLA`). `terrainH` llama a `romaH` en modo Roma. El río no se cruza a pie (`tryMove`): hay que usar los puentes.
  - `buildRome()`: Foro (Curia, Rostra, basílicas Julia y Emilia, templos de Saturno, Concordia, Cástor, Divino Julio y Vesta, Casa de las Vestales, Tabularium, estatuas), Capitolio (Júpiter Óptimo Máximo con tejado dorado, Juno Moneta), Palatino (casa de Tiberio, palacio flavio en obras con grúa, Apolo, casa de Augusto, cabaña de Rómulo), Anfiteatro Flavio (80 arcos por piso con las piezas `B_bay_*`, gradas con público, pasillos de entrada por los extremos, gladiadores animados), Coloso, Meta Sudans, Termas de Tito, Circo Máximo (gradas, espina con obelisco y metas, cuatro cuadrigas que corren), foros de César y Augusto, Templo de la Paz con la menorá, Campo de Marte (Panteón, teatros de Pompeyo y Marcelo, pórticos, Mausoleo de Augusto, Ara Pacis, reloj de sol), puentes, Emporio, Acueducto Claudio, Vía Apia con tumbas, Pirámide de Cestio, ínsulas y domus (`H_insa`, `H_insb`, `H_dom`) y campiña.
  - Constructores reutilizables: `romanTemple`, `roundTemple`, `basilica`, `porticus`, `theatre`, `bridge`, `ringGeo` (gradas y muros curvos), `menorah`. `updateRome` anima carreras y combates.
- **Rendimiento:** three r128 crea los `InstancedMesh` con `frustumCulled=false`, así que las zonas de `chunked()` nunca se descartaban por la vista; ahora sí (también en Atenas). Las columnas van por zonas, con un cilindro simple a partir de 260-340 m (`CHUNKS` tiene `near` y `far`). Medido en Roma: 5-16 ms por imagen según el punto.
- **Casas y campo de Atenas** hechos con módulos de Blender (`housesGLB`, `treesGLB`, `buildCountryside`); dioses con más brillo (halo doble, anillo en el suelo y motas).
- **Jinete visible** (`buildAvatar`, `updateAvatar`; tecla V para primera o tercera persona) y **minimapa** permanente (`drawMini`) en las dos épocas.
- **Teatro en Roma** (`ROMA_PLAYS`, `romaTheatres`, `updateRomaTheatre`): seis comedias con escenas por horas, actores con máscara, tañedor de tibia, público y senadores en la orquesta, y subtítulos en `#stage`. Teatro de Pompeyo, Plauto: *La olla* (8-11 h), *La comedia del fantasma* (12-15 h) y *Los Menecmos* (16-19 h). Teatro de Marcelo, Terencio: *Los hermanos*, *La suegra* y *Formión*, a las mismas horas. Se entra a la orquesta por los pasillos laterales. Hablan del tema Aurelia (Ovidio), Lucio Vibio (Tito Livio) y Ambivio (jefe de la compañía). Ensayo «El teatro en Roma».
- **Latinismos:** Tito Verrio, gramático, enseña bajo el pórtico de la Basílica Emilia y explica 103 latinismos (`LATIN`, `latinMenu`, opción `latinBrowser` del NPC); la lista sigue la de las PAU recogida en El Foc de Prometeu (elfocdeprometeu.cat/llatinismes), con explicaciones redactadas en castellano. También están en la biblioteca, en el ensayo «Latinismos». En total, Roma tiene 28 personajes.
- **Decoración según las reconstrucciones** (`romaDecor`, después de `romaCity`): pavimentos que siguen el terreno (`drape`: travertino en el Foro, los foros imperiales, el área Capitolina y otras plazas; mármoles de colores en el Foro de Augusto; anillo de travertino con mojones alrededor del anfiteatro), calzadas de basalto con aceras y bordillos en la ciudad (`romaRoadsDecor`), estatuas ligeras instanciadas (`STATUE_G`, `statue`, `flushStatues`) en frontones (`ROMA.peds`, lo rellena `romanTemple`), áticos de basílicas, arcos del anfiteatro y pórticos del Foro de Augusto, cuadrigas con caballos de Blender (`quadriga`), arcos de Augusto y de Tiberio (`arch`, perfil extruido), columnas rostrales, Miliario de Oro, Ombligo de Roma, Lacus Curtius, Lapis Niger, escudos y mástiles del velario en el anfiteatro, fuentes públicas, altares compitales, miliarios y balcones de madera en las ínsulas (`piece`/`pieceAt`, `flushPieces`). Siete estelas nuevas lo explican.
- **Punto de mira:** sin captura del puntero, el punto de mira (`#cross`) sigue al cursor (la flecha del sistema se oculta) y E apunta a lo que hay bajo él (`aimYaw`).
- **Doble salto:** Espacio otra vez en el aire (`jump()`, `player.jumps`).
- **Ratón:** la cámara gira con solo mover el ratón; con un clic se captura el puntero y gira sin límite. Sin captura, el cursor en el borde izquierdo o derecho sigue girando.

### Traducciones en pausa (desde la versión 33)
- Por decisión del usuario, **los textos nuevos no se traducen** hasta que lo pida. Lo pendiente se lista con `python3 fuente/i18n.py pendientes` (escribe `fuente/i18n/pendientes.md`); mientras tanto, en catalán e inglés esos textos salen en castellano.

### Novedades de la versión 43: fiestas y ritos
- **Calendario de fiestas** (`FESTS_ATENAS`, `FESTS_ROMA`):
  - Hay 19 fiestas en Grecia y 25 en Roma (los días de mercado, la inauguración, la naumaquia y las carreras siguen siendo acontecimientos aparte).
  - Además de las grandes fiestas cívicas, incluye ritos extraños o mistéricos:
    - **Grecia:** Panateneas, Misterios de Eleusis, Tesmoforias, Pianepsias, Apaturias, Leneas, Antesterias, Targelias, Plinterias, Bufonias, Arreforias, Adonias, Braurionias, las tíades del Parnaso, la iniciación órfica, Cronias, Diasias y, en Esparta, Carneas y Jacintias.
    - **Roma:** Saturnales, Lupercales, Parilias, Vestalia, Matronalia, Liberalia, Floralia, Lemurias, Compitalia, Juegos Romanos, Navigium Isidis, Mercuralia, Caballo de Octubre, *Mundus patet*, ritos de Baco (con el escándalo del 186 a.C.), Argeos, Bona Dea, Cerialia, Parentalia, Robigalia, Terminalia, Fontinalia y Regifugium.
- **Cómo funciona**:
  - El año religioso va condensado: los días pares libres de otro acontecimiento se celebra la siguiente fiesta del ciclo (`festOfDay`, `baseEvent`, `festNextDay`).
  - `todayEvent` devuelve la fiesta como si fuera un acontecimiento (`festEvent`), y `evCrowd` pone la multitud en su lugar y un oficiante (`festSpawn`, `FEST_ACT`).
  - El oficiante explica la fiesta y dos temas, y propone participar en el rito con una pregunta (`festDialog`). Si se acierta, da +3 de piedad, +1 de fama y 2 monedas, y queda anotado en `state.fest`.
- **Diario**: hay una pestaña nueva, **Fiestas** (`festsHTML`), con el mes real, el dios, el próximo día de celebración en el juego y las fuentes antiguas de las fiestas ya celebradas. La Guía las explica.

### Novedades de la versión 42: tutorial y barra más limpia
- **Tutorial de los primeros segundos** (`TUT`, `TUT_STEPS`, `tutStart`, `tutTick`, `tutEnd`):
  - Aparece la primera vez que se entra en cualquier modo; se guarda en `state.tut`.
  - Tiene cinco pasos que avanzan cuando el jugador hace de verdad la acción: mirar alrededor, caminar unos metros, fijarse 6 segundos en el objetivo y el rombo de la brújula, hablar con alguien (cualquier interacción salvo leer una estela) y abrir el diario.
  - Al abrir el diario, este muestra la pestaña Guía y el tutorial termina.
  - Se puede saltar.
- **Barra de estadísticas reducida**:
  - Solo muestra las monedas y un único «Progreso N %», que reúne lecciones, lugares, mitos y favores. Al pasar el ratón aparece el detalle, y al pulsarlo se abre la Ficha.
  - El nivel del caballo solo aparece mientras se cabalga.
  - Los contadores antiguos (`sLessons`, `sPlaces`, `sMyths`, `sGods`) siguen existiendo, pero ocultos.

### Novedades de la versión 41: más maestros y revisión como alumno
- **Cuatro maestros más** (`MASTERS`, en `masters2`):

  | Maestro | Época | Rivales |
  |---|---|---|
  | Epicteto | Roma | Dion, Marcial |
  | Frontino | Roma | el augur, Rabirio |
  | Ifícrates | Atenas | Cabrias, el enviado espartano |
  | Euclides de Mégara | Atenas | Isócrates, Eutidemo |

- **Revisión de mapeado** (pruebas en `scratchpad/t_reach.js` y `t_overlap.js`):
  - Se comprobó que todos los personajes, estelas y esferas de las dos épocas (253 en Atenas y 204 en Roma) son alcanzables a pie y tienen sitio delante. No había ninguno encerrado.
  - Las casas de los pueblos de destino se solapaban hasta 8 m (Atenas) y las domus romanas hasta 19 m. Ahora `courtyardHouse` y `destHouses` desplazan o descartan cualquier casa que caiga encima de otra. Solo quedan casas adosadas de la ciudad, con menos de 2 m de contacto.
- **Mejoras de claridad**:
  - Pantalla de inicio:
    - Los tres modos tienen el mismo estilo y Historia aparece como «Recomendado para empezar».
    - Cada modo tiene una descripción.
    - Los controles están al día: el caballo se consigue con una misión, y se explican G, X, C, F e Intro.
    - Intro ya no arranca el modo Libre sin querer.
  - Nueva pestaña **Guía** en el diario (`guideHTML`), con todos los sistemas del juego en pocas líneas.
  - Diálogos: cuando hay seis opciones o más se muestran en dos columnas, y el texto ya no queda tapado.

### Novedades de la versión 40: discípulos y rivalidades
- **Maestros** (`MASTERS`, `discMenu`, `state.disc`). Atenas tiene cuatro y Roma tres:

  | Maestro | Época | Rivales |
  |---|---|---|
  | Platón | Atenas | Isócrates, Antístenes, Aristipo |
  | Isócrates | Atenas | Platón, Alcidamante |
  | Antístenes | Atenas | Platón, Aristipo |
  | Aristipo | Atenas | Antístenes, Platón |
  | Musonio Rufo | Roma | Dion de Prusa, Quintiliano |
  | Quintiliano | Roma | Dion de Prusa, Musonio |
  | Dion de Prusa | Roma | Musonio, Quintiliano |

- **Cómo se entra:** hay que haber superado su lección, tener nivel en su cualidad y, si está entre las amistades, llegar a Confianza (afinidad 40).
- **La formación:**
  - Consta de una prueba de admisión y cuatro lecciones. Cada una tiene un encargo (`task`: superar una lección, leer una estela, hablar con alguien o llegar a un nivel de cualidad) y termina con una pregunta sobre la doctrina.
  - Hay una sola lección al día, y solo se puede tener un maestro a la vez.
  - Se puede abandonar al maestro, pero baja mucho la afinidad con él.
  - Al terminar, se obtiene el título de discípulo formado y un gran impulso a las cualidades.
- **Rivalidades** (`rivalOf`, `discRivals`, `rivalTaunt`, `debateMenu`). Si eres o fuiste discípulo de alguien, sus rivales:
  - pierden 15 de afinidad contigo;
  - te lanzan una pulla al saludarte;
  - exigen un nivel más para su amistad (`fNeed`);
  - nunca te aceptan como discípulo;
  - te retan una vez a debatir. Si ganas el debate con la doctrina de tu maestro, ganas palabra, fama y algo de su respeto; si lo pierdes, baja la afinidad.
- La ficha del diario muestra las escuelas, tu estado y el encargo en curso.

### Novedades de la versión 39: cualidades del personaje y amistades
- **Cinco cualidades** (`QUAL`, `state.qual`), con diez niveles cada una (`QLV`, `qLv`, `qAdd`). Atenas usa los nombres griegos y Roma los latinos:

  | Atenas | Roma | Qué mide |
  |---|---|---|
  | Sophía | Sapientia | Saber |
  | Lógos | Eloquentia | Palabra |
  | Areté | Virtus | Cuerpo y valor |
  | Eusébeia | Pietas | Piedad |
  | Kléos | Fama | Renombre |

- **Cómo suben**:
  - Conocer a un personaje da +1 a su cualidad y +1 a la fama. La cualidad de cada personaje la decide `npcQual`, según su categoría y la lista `Q_AR`.
  - Superar su lección da +2 a su cualidad y +1 a la fama.
  - Las estelas, las curiosidades y los mitos dan sabiduría.
  - Los sueños dan piedad y sabiduría; los dioses dan piedad.
  - Hacer de jurado da palabra.
  - Correr y cabalgar dan areté (`qualTick`), igual que subir de nivel el caballo y conseguir las alas.
  - Los capítulos de la Historia dan fama.
- **Efectos**:
  - La sabiduría da monedas extra en las lecciones.
  - La areté hace correr más deprisa.
  - La piedad da una moneda más con los dioses y los sueños.
  - Además, todas abren las amistades.
- **Ficha** en el diario (`qualHTML`): muestra las cualidades con su barra y las amistades.
- **Amistades** (`FRIENDS`, `friendMenu`, `state.friends`):
  - Hay 8 personalidades por época, con 5 encuentros cada una. Cada encuentro cuenta algo nuevo de su vida y de su saber y termina con una pregunta.
  - Una buena respuesta da +20 de afinidad y una torpe, +4, sin avanzar.
  - Cuesta subir: solo hay un encuentro al día por persona, hay que haber superado antes su lección, y cada encuentro exige más nivel en la cualidad de esa persona, en la fama y en una segunda cualidad (`fNeed`).
  - Al llegar a 100 se alcanza la philía o amicitia, que da un regalo y un gran impulso a las cualidades.

### Novedades de la versión 38: Nóstos, modo Historia, juego en línea, caballo con niveles y alas de Dédalo
- **Nombre:** el juego se llama ahora **Nóstos** (νόστος, «el regreso a casa»), en el selector de época y en el título de la pestaña.
- **Tres formas de jugar** en la pantalla de inicio de cada época: **Historia** (`startStory`), **Libre** (la de siempre) y **Libre en línea** (`netJoin`).
- **Modo Historia** (`STORY_ATENAS`, `STORY_ROMA`; motor en `storyResume`, `playScene`, `storyHook`, `storyTick`):
  - Son diez capítulos por época, cada uno sobre un ámbito.
  - Atenas, «La lechuza de bronce»: un padre dado por muerto en la guerra de Corinto.
  - Roma, «La tablilla de Tercia»: una hermana perdida tras el Vesubio.
  - Cada paso espera un gesto: hablar con un personaje (`npc`), con un actor propio de la historia (`actor`), leer una estela (`sign`), llegar a un sitio (`go`) o soñar una esfera (`dream`).
  - Las escenas admiten preguntas (`ask`) y elecciones (`choose`).
  - Se guarda aparte (`SAVE_KEY` + `-historia`).
  - En el juego, G hace que te lleven al objetivo y el diario (J) muestra los capítulos.
- **Libre en línea**:
  - Usa la capacidad `room`: hay salas con código (`mc-<época>-<código>`) y un máximo de 15 jugadores.
  - Cada jugador publica su presencia (nombre, color y posición) y se pinta como avatar (`netAvatar`).
  - El chat va por el tema `chat`, abierto a participantes (`capabilities: {room:{topics:{chat:'interact'}}}`); Intro abre el chat.
  - Solo funciona en claude.ai y con la página compartida.
- **Caballo**:
  - Ya no lo tienes al principio.
  - Te lo da Eudico de Larisa (Atenas) o el auriga Félix (Roma) si le traes una yegua escapada (`horseQuest`, `mareShow`).
  - Al cabalgar aparecen esferas doradas cada ~60 m (`horseTick`, `HORBS`). Dan experiencia, y cada nivel suma +2 % de velocidad (`horseMul`) y algo más de salto (`horseJump`).
  - Se guarda en `state.horse`.
- **Dédalo y las alas de cera** (solo en Atenas, `buildDaedalus`, `daedalusTalk`):
  - Dédalo está en el rincón noroeste del laberinto del sueño de Cnosos y pide siete plumas repartidas por el palacio.
  - Con las alas, X las despliega, Espacio sube, C baja y Shift vuela deprisa (`FLY`, `flyMove`).
  - Por encima de 125 m la cera se funde y hay que esperar 30 s, como le pasó a Ícaro.
  - Se guarda en `state.wings`.

### Novedades de la versión 37: los mapas nuevos con vida y el gabinete de curiosidades
- **Personajes en los 8 mapas de paso** (opción `npc` de `SIMPLE_GR`/`SIMPLE_RO`; `buildSimple` los coloca junto a la llegada): Tisandro (penesta, Larisa), Teodoto (pintor en Pela), Antis (peleíade, Dodona), Laódoco (cazador, Calidón), Jenias (pescador de Hélice, Egio), Damón (hilota, Itome), Lisímaco (broncista, Calcis) y Melanto (barquero, Regium). Todos inventados, con fuentes en `SRC` / `ROMA_DEST_SRC`.
- **8 esferas de sueño nuevas** junto a la estela de cada mapa: lápitas y centauros, Perdicas y el sol, el diluvio de Deucalión, la cacería de Calidón, los jonios dejan Acaya, la rebelión del Itome (histórica), Ifigenia en Áulide y la fundación de Regio (Roma).
- **Gabinete de curiosidades** (`CURIOS`, unas 100): anécdotas antiguas seleccionadas a partir de J. C. McKeown, *Gabinete de curiosidades griegas* (2014), redactadas de nuevo y con su fuente antigua. Las que tienen `at` aparecen en un recuadro al leer esa estela; las de `m` (a = Atenas, r = Roma, b = ambas) se desbloquean una cada amanecer (`newDay` → `curioDaily`). Nueva pestaña «Curiosidades» en el diario; se guardan en `state.curios`.
- Las curiosidades de Atenas evitan hechos posteriores al 386. No se tradujeron (traducciones en pausa).

### Novedades de la versión 35: partidas guardadas
- El progreso sigue guardándose solo en el navegador (`save`, `SAVE_KEY`), y ahora también la posición, la orientación y la hora (`state.pos`), cada 20 s y al cerrar la página; al entrar se vuelve adonde se dejó.
- **Guardar partida / Cargar partida** (botones en el diario y «Cargar partida» en la pantalla de inicio; `exportSave`, `importSave`, `loadSaveText`): se descarga un archivo .json o se copia el texto, y se carga desde un archivo o pegando el texto. El archivo dice su época (`modo`) y al cargarlo se abre esa época.

### Novedades de la versión 34: Grecia e Italia a pie
- **Caminos entre mapas** (`WORLD_LINKS`, `defineGates`, `buildGates`, `gatesTick`, `gateTravel`): cada mapa (la ciudad de partida y cada destino de tierra) se une a sus vecinos reales. La puerta está en el borde del mapa, en la dirección geográfica del vecino según `MED_POS`/`MED_POS_RO` (`bearing`), y dentro de un margen de ±50° busca el paso más llano. Un camino aplanado (pads con `road:true`, que mandan sobre los demás en `islandH`) va desde las afueras del pueblo hasta la puerta; `destHouses` no construye encima. Al llegar a la puerta se camina (unos 5 km por hora de juego, como mucho 30 h) hasta la puerta del mapa vecino que mira hacia el de origen. En la ciudad de partida, las puertas están al final de los caminos (`homeGate`): Atenas, Vía Sacra → Mégara, camino del norte → Platea, noreste → Maratón; Roma, Vía Aurelia → Etruria, Flaminia → Umbría, Salaria → Piceno, Labicana → Samnio, Apia → Campania. El plano marca las salidas («→ destino»).
- **Mapas nuevos** para completar la red (`SIMPLE_GR`, `SIMPLE_RO`, `defineSimple`, `buildSimple`): Larisa (Tesalia, con caballos), Pela (Macedonia), Dodona (Épiro, encina y calderos), Calidón (Etolia), Egio (Acaya), Itome (Mesenia) y Calcis (Eubea), y en Italia Regium (Brucio). Cada uno tiene pueblo, santuario y una estela. El arriero también llega a ellos.
- Red de Grecia: Atenas–Mégara–Corinto–Micenas–Argos (–Epidauro, –Mantinea–Esparta–Itome–Olimpia), Corinto–Egio–Olimpia, Mantinea–Olimpia, Atenas–Platea–Tebas (–Calcis, –Delfos–Termópilas–Larisa–Pela/Dodona), Delfos–Calidón–Dodona, Atenas–Maratón. Italia: Roma con Etruria, Umbría, Piceno, Samnio y Campania; Etruria–Liguria/Emilia, Umbría–Piceno/Emilia, Samnio–Campania/Apulia, Campania–Lucania–Regium, Apulia–Lucania, Emilia–Liguria/Transpadana/Venecia, Transpadana–Venecia/Liguria. Las islas, Hispania y África siguen siendo por mar.

### Novedades de la versión 33: días y acontecimientos
- **Días:** al pasar la medianoche empieza un día nuevo (`state.day`, `addHours`, `newDay`; la tecla T y los viajes también cuentan). El reloj muestra «día N» y, si lo hay, el acontecimiento del día.
- **Acontecimientos** (`EVENTS_ATENAS`, `EVENTS_ROMA`, `todayEvent`, `evCrowd`): cada uno tiene día, repetición (`every`) o `once`, horas y lugar; ese día aparece una multitud allí (y puestos de mercado en las nundinas) y un aviso al amanecer. Atenas: Asamblea en la Pnyx (día 3, cada 8) y Grandes Dionisias (día 5). Roma: nundinas en el Foro (día 3, cada 8), inauguración del Anfiteatro Flavio (día 5), batalla naval en la naumaquia (día 8, cada 9) y carreras en el Circo Máximo (día 11, cada 9).
- El diario, en «Primeros pasos», muestra el día, el acontecimiento de hoy con su explicación y el próximo (`calendarHTML`).

### Novedades de la versión 32: primeros pasos
- **Diez misiones de iniciación por época** (`STEPS_ATENAS`, `STEPS_ROMA`, `STEPS()`): política, estelas, lecciones, plano, religión, mitos o espectáculos, caballo, teatro, vida cotidiana y sueños. Cada una tiene `ok()` (se comprueba con el progreso normal del juego o con `state.steps`) y `at()` (hacia dónde apunta el rombo de la brújula).
- Mientras quedan misiones, el objetivo de arriba a la izquierda muestra la siguiente (`curStep`) y la brújula apunta a su destino (`guideTarget`, en lugar de `nextTarget`). `stepsTick` las comprueba cada medio segundo: +1 moneda por misión y +5 al completarlas. Las banderas nuevas son `state.steps.map` (`openMap`) y `state.steps.teatro` (`watchingPlay`); `ok:<id>` marca las ya recompensadas, y al empezar la partida lo hecho antes cuenta sin recompensa.
- Pestaña «Primeros pasos» en el diario (la primera, y la que se abre por defecto), con la opción de ocultarlas (`state.steps._off`).

### Novedades de la versión 31: cultos de Oriente en Roma
- **Iseo y Serapeo del Campo de Marte** (`romaIseum`, dentro de `romaCampus`): patio entre pórticos con obeliscos, esfinges, pilono, templo de Isis y exedra de Serapis; una procesión de fieles con sistros y el sacerdote con el agua del Nilo recorre el patio (`ROMA.isiacs`, en `updateRome`). Personaje: Sarapión, sacerdote de Isis (`sarapion`, inventado).
- **Templo de la Gran Madre en el Palatino** (`romaMagnaMater`, junto a la cabaña de Rómulo), con tres galos que bailan con tambores (`ROMA.galli`). Personaje: Licinia, devota (`licinia`, inventada).
- **Sinagoga del Trastévere** (en `romaQuarters`), inspirada en la de Ostia, con la menorá sobre la puerta y una pila. Personaje: Débora, tejedora judía (`debora`, inventada), que completa a Junia (cristianos) y a Flavio Josefo.
- Ensayo «Dioses venidos de Oriente» (Gran Madre, Isis y Serapis, judíos y cristianos, Diosa Siria, Ma-Belona y por qué no hay Mitra todavía), dos fechas en la cronología, siete términos en el glosario, la zona «Iseo y Serapeo» y cuatro estelas. El Panteón ya dice que el incendio de este año lo ha dañado, como el ensayo de contexto.

### Novedades de la versión 30: la boda romana
- **Pomponia, la pronuba** (`pomponia` en `ROMA_DEST_NPCS`, inventada), a la puerta de la **casa de los Valerios** (`DOMUS_NOVIA`, `buildDomusNovia`: la misma planta que la domus del Celio, 130 m al oeste en la misma calle, con otras pinturas; `buildDomus(true)` la construye sin estelas ni personajes). Enseña «La boda romana» (esponsales, días buenos y malos, divorcio) y ofrece asistir a la boda (`n.wedding`).
- **La boda de Valeria y Quinto** (`ROMA_BODA`): catorce escenas con el motor de las esferas, pero en la Roma real. `stageKit` acepta `E.origin` (aquí, la domus del Celio, casa del novio) y los episodios admiten `vt`, `vf`, `vtEnd`, `endLabel`, `exitLabel`, `onStart`, `onEnd` y `reward`. Escenas: la víspera ante el larario, el peinado y el flammeum, los auspicios con sacrificio, las tablillas nupciales, la dextrarum iunctio, el banquete en el triclinio (`bodaRecline`), el rapto fingido, el cortejo por la calle con antorchas y flautas (`BODA_RUTA`, `BODA_CORTEJO`, `bodaCortejo`), las nueces y las tres monedas junto al altar compital, las jambas untadas y «Ubi tu Gaius, ego Gaia», el umbral, el agua y el fuego con el lecho genial, el dormitorio y el día siguiente. `bodaLay` coloca a los personajes de cada escena y oculta a los demás; mientras dura se ocultan Filero, Pomponia, el cliente y las estelas cercanas. Las escenas de la tarde usan una luz de lámparas (`ROMA.bodaLight`, siempre en la escena para no recompilar materiales). Al terminarla: +3 sestercios la primera vez (`state.seen.boda`).

### Novedades de la versión 29: la domus visitable y una Roma más fiel
- **Domus a tamaño real** (`H_dom` escalado: huella de 26 × 42 m) y **domus visitable del Celio** (`buildDomus`, `DOMUS`): fauces con CAVE CANEM, tiendas a la calle, atrio con impluvio, larario, alas con máscaras de antepasados, tablino, cubículos, biblioteca, peristilo con jardín y fuente, triclinio con tres lechos, cocina y letrina. Pinturas del cuarto estilo (`domusWallTex`), suelos de mosaico, opus signinum y emblema (`domusFloorTex`), doce estelas `domus_*` y Filero, el atriense.
- **Barrios según la Roma del 80** (`RQUART`, `romaQuarter`, `romaCity`): cada zona tiene un tejido (`dense`, `rich`, `campus`, `horti`, `open`) y la orientación de sus calles. Las ínsulas van en manzanas continuas, dos filas espalda con espalda con la fachada a la calle y callejas de 5 a 10 m; cada fila de manzanas se desplaza al azar. Subura, Velabro, Vía Lata y Trastévere son densos (en la Subura, ínsulas más altas); Celio, Aventino y Quirinal mezclan domus con jardín e ínsulas; el centro del Campo de Marte tiene pocas ínsulas entre los monumentos y el norte es campo abierto; hay jardines de Mecenas, Lamia, Salustio y Lúculo. Fuera de esas zonas, ínsulas en los valles y barrio mixto en las colinas. La ocupación se marca en celdas de 2 m (`markRect`/`freeRect`), así que los edificios pueden tocarse sin solaparse. Hay unos 2.600 edificios (antes 1.084).
- **Muralla serviana** (`SERV`, `SERV_GATES`, `romaQuarters`, `portaServ`): tramos de toba de 5 m que se conservan a trozos (más enteros en el agger del Esquilino), con puertas de arco donde la cruzan las calles: Trigemina, Raudusculana, Capena, Caelimontana, Querquetulana, Esquilina, Viminalis, Collina y Fontinalis.
- **Edificios nuevos:** almacenes de Galba y de Lolio junto al Emporio (patio con celdas), Naumaquia de Augusto en el Trastévere (estanque con isla, naves y bosque sagrado) y el ala del Opio de la Casa Dorada.
- **Calles nuevas:** Vía Lata (la parte urbana de la Flaminia), Vico Patricio, Clivo Suburano, Vico Largo, Alta Semita, Vía Salaria y Vía Nomentana. El Argileto ahora termina en la Subura. Los índices 0-10 de `ROADS` no cambian (los usan los paseantes).
- **Estelas nuevas:** muralla serviana, Porta Capena, almacenes de Galba, Naumaquia de Augusto, Casa Dorada, las ínsulas y las catorce regiones. Hay nueve zonas nuevas (Velabro, Emporio, Quirinal, Viminal, los jardines, la Naumaquia y la Casa Dorada) y etiquetas nuevas en el plano. El suelo de la ciudad es ahora de tierra batida, salvo en los jardines.

### Novedades de la versión 28: Termópilas, Cartago y mapa ampliable
- **Termópilas** (Atenas; `termopilas` en `GREECE_DESTS`): el paso entre el monte y el mar. Tiene Antela y el santuario de Deméter Anfictiónide, las aguas calientes con vapor, el muro de los focidios, la colina con el león de Leónidas y el epigrama de Simónides, y el sendero de Anopea. Las estelas cuentan curiosidades: el mar que se alejará, los supervivientes y la frase de Dieneces. El personaje es Lampón (`lampon`, inventado). La esfera histórica tiene ocho escenas: «La batalla de las Termópilas».
- **Cartago** (Roma; `cartago`, `sea:true`, `net:'afr'`): se va en barco con el naviero del Emporio. Tiene la Byrsa con el Capitolio y el foro, el puerto circular (`I.lake`) con la isla del almirante, el tofet, el anfiteatro y estelas sobre Catón, la sal (un mito moderno) y el púnico que se sigue hablando. El personaje es Gayo Julio Himilcón (`himilcon`, inventado). La esfera histórica tiene siete escenas, «La tercera guerra púnica», desde los higos de Catón hasta Escipión llorando con Polibio.
- **El mapa del Mediterráneo se puede ampliar** igual que el plano: rueda, botones, pellizco y arrastre. La vista está en `MED.v`, y la gestionan `medZoom` y `medClamp`; `drawMed` redibuja en vectores. Al ampliar (×2 o más) aparecen más ciudades: las de importancia −1 en `MED_INFO`, que son los destinos del juego y otras menores.

### Novedades de la versión 27: Maratón
- **Maratón** (`maraton` en `GREECE_DESTS`, bloque en `buildGreece2`): por tierra con Lisicles. Tiene el Soros, el túmulo de los plateenses, el trofeo de mármol, el santuario de Heracles, la marisma y el demo. El personaje es Hegesias (`hegesias`, inventado), nieto de un combatiente.
- **Esfera histórica «La batalla de Maratón»** (`hist:true`): con ese campo, la esfera dice «momento histórico» en lugar de «mito». Tiene siete escenas: el desembarco, Filípides, el consejo de Milcíades y Calímaco, la carga a la carrera, el envolvimiento del centro persa, la lucha en las naves y el Soros.

### Novedades de la versión 26: Grecia continental, Italia, Hispania, dioses de Roma y el Mediterráneo
- **Polis de Grecia continental y del Peloponeso** (Atenas; `GREECE_DESTS`, `defineGreece2`, `buildGreece2`, `greekArrive`): Mégara, Corinto, Platea, Delfos, Argos, Epidauro, Mantinea y Olimpia, por tierra con Lisicles. Cada una tiene estelas, aldeanos con frases, casas y un personaje con lección (`GREECE_NPCS2`): Euclides de Mégara (histórico), Nicandro, Eutíades, Teodoro, Dionisodoro, Sóstrato, Calias y Aristarco. Todo está fechado en el 386 (paz del Rey, fin de la unión de Corinto y Argos, Platea reconstruida, Mantinea a punto de ser disuelta, los Zanes del 388…).
- **Roma: las once regiones de Augusto y cinco ciudades de Hispania** (`ROMA_DESTS`, `defineRomaDests`, `buildRomaDests`, `romaTravel`). Neápolis (Pompeya sepultada y el Vesubio), Brundisium, Paestum, Saepinum, Asculum, Ariminum, Tarquinii, Mutina, Genua, Verona y Comum se alcanzan con el cochero de la Vía Apia (`arriero`, `openRomaLand`). Tarraco, Barcino y Emporiae van en barco desde el Emporio (`buildPort`, `openRomaVoyage`). Ilerda y Emerita Augusta van por tierra desde Tarraco (`net:'hisp'`, `lfare`, `ldays`, `HISP_DRIVER`). Hay 16 personajes nuevos (`ROMA_DEST_NPCS`, fuentes en `ROMA_DEST_SRC`).
- **Terreno de los destinos:** `islandBase` admite costa por un lado (`coast`, `coastAt`) y lagos (`lake`); `buildIslandMesh` admite `step`, `green` y `tint`. Helpers comunes: `ringWall`, `rectWall`, `greekTheatre`, `stadiumG`, `tumulus`, `pool`, `plume`, `destHouses`, `romaVillagers`, `destTrees`, `amphi`, `forumR`, `crane`, `vineyard`.
- **Dioses de Roma fuera de la ciudad** (`ROMA_GODS`, `romaGodSpot`): Júpiter, Juno, Minerva, Marte, Venus, Neptuno, Mercurio y Vulcano (los griegos con nombre romano), y Jano, Quirino, Fauno, Silvano, Fortuna y Tiberino (los propiamente romanos, `native:true`, «divinidad romana»). Cada uno está junto a un lugar de su culto, con tres temas y un encargo. Hay un tipo de encargo nuevo: `lesson` (aprender la lección de un personaje). La pestaña «Dioses» del diario y el contador «Favores» funcionan ya en las dos épocas.
- **Ocho esferas de sueño nuevas:** Apolo y la serpiente Pitón (Delfos), Pélope e Hipodamía (Olimpia), Belerofonte y Pegaso (Corinto) y El nacimiento de Asclepio (Epidauro) en Atenas; Eneas y la Sibila de Cumas (Neápolis), Tages (Tarquinii), Faetón y el Erídano (Mutina) y Antenor y los vénetos (Verona) en Roma. Para montarlas hay helpers de escena: `epiSnake`/`snakeCoil`, `chariotK`/`chariotRun`/`raceX`, `pegasusK`/`pegFlap`.
- **Mapa del Mediterráneo** (botón «Mediterráneo» del plano; `MED`, `MED_SEA` y demás costas en [longitud, latitud], `MED_INFO`, `buildMed`, `drawMed`, `setMed`): proyección equirrectangular de 10° O a 42° E. En Atenas muestra el mundo del 386 (el Imperio persa tras la paz del Rey, Cartago, Egipto independiente, los dominios de Dionisio, los pueblos de Italia…); en Roma, el Imperio del 80 con sus provincias, los partos, los dacios, los sármatas y los nabateos. Una flecha marca dónde estás (`MED_POS`, `MED_POS_RO`).
- Arreglado un fallo antiguo de `stoa()`: el tejado a dos aguas tenía cambiados el largo y el fondo, y dejaba tejas flotando.

### Novedades de la versión 24: sueños míticos, Cnosos, antorcha, mar de Ulises y colisiones
- **Colisiones de edificios** (`sealFootprints`, al final de `bootWorld`): las huellas con nombre cuyo perímetro tiene menos de un 35 % de muro sólido se cierran con `addBox`, salvo los recintos abiertos (`OPEN_FP`: teatros, foros, templos…) o si hay alguien dentro. También se cierran las piezas macizas de la escena (cajas y modelos instanciados de 3 a 70 m de lado y más de 2,5 m de alto) que no tenían colisión. `__d.sealed` lista lo cerrado.
- **Antorcha (tecla F, botón «Antorcha»):** `TORCH`, `buildHandTorch`, `toggleTorch`, `updateTorch`. La `PointLight` está siempre en la escena con intensidad 0, para no recompilar los materiales al encenderla. Al anochecer sale un aviso. Ojo: los materiales Lambert calculan la luz en los vértices, así que en muros grandes de pocas caras la antorcha apenas se nota; donde importa (el laberinto) se usa `MeshPhongMaterial`.
- **El sueño de Ulises** (minijuego de los viajes en barco, solo en Atenas y nunca desde o hacia Egina; `seaEligible`): al zarpar se ofrece soñar o seguir. Es un lienzo 2D (`#sea`, `SEAG`, `seaCourse`, `seaTick`, `seaDraw`). Se gobierna con A/D o las flechas, y Espacio tapa los oídos (sin gobernar). Hay rocas, tres rocas de sirenas (canto con vibrato, corriente que arrastra y medidor de «hechizo»), y el estrecho con Escila (ataques avisados con sombras rojas) y Caribdis (remolino que sorbe y vomita cada 7 s). Empiezas con 6 compañeros. La primera vez que lo pasas, +3 óbolos (`state.seen.odisea`). En pantallas táctiles tiene botones ◀ ▶ y «Taparse los oídos».
- **Esferas de sueño** (`EPI`, `EPISODES`, `buildSpheres`, `openSphere`, `epiStart`, `epiBeat`, `epiTick`, `epiEnd`): flotan junto a lugares y se activan con E. Cada episodio monta un escenario a 3000 m sobre el jugador (`stageKit`: suelo, colinas, agua, árboles, personas, animales de cajas `makeBeast`, aves `flock`, lluvia, destellos) y avanza por escenas con E/Enter (← vuelve atrás, Esc despierta). Cada escena tiene texto, hora del día, cámara (`cam`, `cam2` o `camf`) y animación (`enter`/`upd`). La primera vez que se completa un episodio da +2 monedas (`state.seen['ep:'+id]`).
  - Roma: **Rómulo y Remo** (junto al Tíber, en el Foro Boario: la loba, los augurios con 6 y 12 buitres, el surco del pomerio y la muerte de Remo), **La muerte de Rómulo** (Campo de Marte: tormenta, nube, Próculo Julio y Quirino), **Las sabinas** (Foro, junto al Lacus Curtius) y **Horacio Cocles** (junto al Emporio).
  - Se ven en el plano (M) y en el minimapa como una esfera azul con un aro (`sphereIcon`); las ya soñadas, en gris azulado. Las de las islas solo aparecen en el plano de su región.
  - Atenas: **Atenea y Poseidón** (Acrópolis, junto al Erecteion), **El juicio de Orestes** (Areópago), **El caballo de Troya** (Troya) y **El palacio de Minos y el laberinto** (Creta).
- **Cnosos soñado** (`KNOS`, `buildKnossosDream`, `knossosTravel`, `updateKnossos`, `minotaurEncounter`): escenario fijo a 800 m sobre el mar, al sur de Creta. Tiene patio central con columnas minoicas rojas, cuernos de consagración, fresco del salto del toro, sala del trono con grifos, pithoi, Ariadna y cinco estelas. Al norte está el **laberinto**: 9×9 celdas de 5 m generadas con semilla fija y techado salvo la sala central; dentro no se ve sin antorcha de noche. El **hilo de Ariadna** es una línea roja que se va soltando a tu paso. En el centro está el Minotauro (Asterión): se lucha «como Teseo» o se huye. Al salir del laberinto con el Minotauro vencido se cobra la recompensa del episodio. En los escenarios de altura no se aplica el límite de la isla (`tryMove`, `player.feet>400`).

### Versión 21: catalán e inglés
Todo el juego está traducido (interfaz y contenido de las dos épocas). Si en el futuro falta alguna traducción, ese texto se muestra en español.
- **Selector de idioma:** botones Español · Català · English en la pantalla de épocas y en la de inicio, y un desplegable ES/CA/EN en la barra del juego. Se guarda en `localStorage` (`mundo-clasico-lang`) y en la dirección (`?lang=ca`); cambiarlo recarga la página en la misma época (`setLang`). `langQuery()` conserva el idioma al volver al selector de épocas.
- **Cómo funciona** (`fuente/i18n.py`, lo llama `construir.py`): un tokenizador de JavaScript en Python (comprobado contra acorn: encuentra los mismos 12.263 literales) localiza las cadenas del script principal. Las que tienen traducción se envuelven al construir: `'texto'` → `_t(id,'texto')` y las plantillas `` `Lecciones ${a}/${b}` `` → `_tt(id,["Lecciones ","/",""],a,b)` (clave del diccionario: `Lecciones {0}/{1}`). En tiempo de ejecución `_t` devuelve `I18N.tr[LANG][id]` o el español. Como se traduce cada literal donde aparece, valen igual para datos (NPCS, MORE…), avisos, canvas (plano, minimapa, etiquetas) y comparaciones entre literales. Los textos fijos del HTML (nodos de texto, `title`, `placeholder`, `aria-label`) los traduce `i18nStatic()` al arrancar con `I18N.html`.
- **No se traducen** las claves de objeto ni las palabras sueltas en minúsculas junto a `id:`, comparaciones o al principio de listas (`idlike`): son identificadores (lugares, estados) y el progreso guardado no depende del idioma.
- **Diccionarios:** `fuente/i18n/*.txt`, bloques de tres líneas separados por una línea en blanco: español (o `@clave`, los 8 primeros caracteres hexadecimales del SHA-1 del texto en español, para no repetir párrafos), catalán e inglés. `=` significa «igual que en español»; una línea entre comillas dobles se lee como JSON (**obligatorio si empieza o termina en espacio**: el editor borra los espacios finales). Las líneas que empiezan por `#` son comentarios.
  - `01_interfaz.txt` (interfaz), `02_nombres.txt` (personajes, cargos, lecciones, lugares, zonas, títulos), `10_npcs_atenas.txt` (diálogos de Atenas)…
  - `python fuente/i18n.py pendientes [grupo…]` escribe en `fuente/i18n/pendientes.md` lo que falta, agrupado por la declaración que lo contiene (NPCS, MORE, SRC…), con su clave @. Ahora da **0**: cualquier texto nuevo en español debe añadirse a un diccionario (el último es `44_suenos_mar.txt`). Los literales de código que parecen texto (ids, teclas, colores…) van en `fuente/i18n/no_traducir.lst`, una clave @ por línea. `python fuente/i18n.py huerfanas` lista las entradas que ya no corresponden a ningún texto (por ejemplo, si se ha cambiado el español). Al cargar los diccionarios se avisa si una clave está repetida con traducciones distintas.
  - Los textos fijos del HTML se pueden poner con clave literal o con clave @.
  - Una frase con valores intercalados se traduce mejor como plantilla: si el orden de las palabras cambia entre idiomas, conviene pasar la concatenación a `` `…${x}…` `` en el fuente.
- **Platón con IA** responde en el idioma elegido: `AI_LANG` se añade a las instrucciones (que siguen en español).
- **Glosario:** `glIndex()` indexa las variantes españolas y, en catalán e inglés, también el término traducido.
- Las inscripciones griegas y latinas de las estelas no se traducen.
- **Pruebas sin acceso a la CDN:** en este entorno Chromium no llega a cdnjs/jsDelivr; se instala `three@0.128.0` con npm y Playwright sirve `three.min.js` y `GLTFLoader.js` en local (`page.route`).

### Novedades de la versión 20: ropa más fiel
- `personMat(hex,kind,o)` admite variantes de sombreado sobre las mismas piezas: `o.bare='exo'` (exomis: hombro y pecho derechos de color piel), `'chest'` (sin quitón: torso desnudo por encima de 1,02 m y color del manto por debajo) y `o.border` (cenefa de dos franjas a `o.by` m del bajo; colores en `BORDER_C`, al azar en un 30 % de las personas).
- Opciones de `makePerson`: `exomis` (túnica corta, piernas al aire, sin manga derecha) y `himOnly` (solo himation, sin mangas). Las llevan Manes, Timócrates, Carión, el hilota y el pastor (exomis), Antístenes y Sócrates en el sueño (himation), y en los paseantes de Atenas un 24 % de los hombres (exomis) y un 12 % (himation).
- **Pilos:** los mortales con `spear` llevan un casco cónico de bronce (`PILOS_G`) y se les ve la cara; el corintio queda para los dioses o con `helmet:'corinth'`.

### Novedades de la versión 19: terreno bajo los edificios y personas
- **Explanadas** (`FLATS`, `flatAt`, `applyFlats`; `terrainH` envuelve a `terrainH0`): tras construir los edificios (Atenas: después de `buildMyHouse`; Roma: después de `romaDecor`), para cada solar con nombre (y para todos en Roma y en las islas) se lanzan rayos desde la malla del terreno hacia abajo. Si un suelo o peldaño queda tapado (hasta 1,3 m), el terreno se rebaja a esa altura con un rellano de 5 m y una transición de 7 m, y se recalculan los vértices de la malla interior y de las islas. Solo se rebaja; `noFlat` excluye un solar (tu casa).
- Comprobación con el censo por rayos: en Atenas, de 47 edificios afectados a 3, todos falsos positivos (cimientos enterrados a propósito bajo peldaños visibles); en Roma, de 12 a 1 (9 cm).
- **Personas** (`makePersonGLB`): oclusión ambiental horneada en los vértices de las piezas `P_` (`bakePersonAO`), materiales propios (`personMat`) con pliegues en la ropa y mechones en el pelo en el espacio de cada pieza, 7 tonos de piel (`PSKIN`), complexión variable (salvo niños y jugador, `noVary`), cejas y boca en una sola malla con colores por vértice (`faceGeo`, colocadas con un rayo contra la cabeza) y más variedad en los paseantes de Atenas (velos, trabajadores sin manto, más colores). Coste medido en el Ágora: 18,8 → 19,7 ms.

### Novedades de la versión 18: tu casa y clases de sofistas
- **Tu casa** (`buildMyHouse`, tras `buildAthensSchools`): casa ática con patio al suroeste del Ágora. Elige el primer solar de una lista sin calles que lo crucen, con la fachada hacia la calle más cercana y el suelo a la altura del punto más alto del terreno. Tiene altar de Zeus Herkeios, pozo, telar, pórtico, almacén, herma en la puerta y andrón con puerta descentrada, mosaico de guijarros, zócalo rojo y cuatro divanes. Estela `casa`.
- **Jantias** (`mayordomo`, ficticio) contrata a un sofista (`sophistHire`, `sophistMenu`). El elegido se guarda en `state.sophist`; `houseApply()` lo muestra en el andrón con cuatro alumnos y un pedagogo (`HOUSE.kids`) y oculta a los demás con `npcObj.hidden`, que respetan el culling, `findFocus`, `nextTarget`, el plano y el minimapa.
- **Sofistas** (`HOUSE_NPCS`, históricos): Pródico (sinónimos; Heracles en la encrucijada), Hipias (arte de la memoria; saber enciclopédico y «lo bello»), Alcidamante, discípulo de Gorgias (Encomio de Helena; estilo gorgiano e improvisación) y Eutidemo (sofismas del Eutidemo; Protágoras y los Discursos dobles). Cada uno tiene 3 temas, quiz, 2 clases con ejercicios (`classes`), 5 temas en `MORE` y fuentes en `SRC`.

### Novedades de la versión 17: «Cuéntame más», plano ampliable y Aristeo
- **«Cuéntame más»:** objeto `MORE={id:[[título,texto],…]}` (antes de `R_NPCS`), con 5 temas extra para cada uno de los 102 personajes (73 de Atenas, sueño, Esparta y Micenas incluidos; 29 de Roma). La opción aparece en `renderOpts` cuando se ha escuchado algún tema normal; `moreMenu(n)` muestra la lista y guarda lo escuchado en `state.seen['x:'+id]`.
- **Eudico de Larisa** tiene 6 temas extra, sobre caballos famosos: Janto y Balio (Aquiles), Bucéfalo (avisando de que es el futuro), Pegaso, Arión y otros, caballos tesalios y doma.
- **Aristeo de Metaponto** (`PITAGORICO`, ficticio), junto a la entrada de la Academia: dice ser Pitágoras reencarnado. Tiene 4 temas, quiz, fuentes en `SRC.pitagorico` y 6 temas extra (teorema, números, acusmata, leyendas, pitagóricos del siglo IV, carne y habas).
- **Plano (M) ampliable:** rueda, botones + / − / ◎ (centrar en mí) / ⤢ (ver todo), arrastrar y pellizcar (`MV`, `mapV`, `mapZoom`). A partir de ×1,5 usa un plano de alta resolución (`MAPHI`, ~1 s la primera vez); desde ×2,2 rotula personajes, lugares descubiertos y dioses, apartando las etiquetas que se pisan.

### Novedades de la versión 16: «La escuela de Atenas» y diálogo con IA
- **Biblioteca:** ensayo «La escuela de Atenas» de Rafael con el fresco y 15 puntos interactivos (`RAF_FIG`, `rfHTML`). La imagen (dominio público) está en `modelos/escuela_de_atenas.jpg` y `construir.py` la incrusta en el marcador `@@RAFAEL@@`.
- **El sueño de la Academia** (`buildRaphaelHall`, `poseDream`, `dreamTravel`, `DREAM`): la estela «Los olivos de Academo», junto a la Academia, te lleva a la sala del fresco, construida a 600 m de altura sobre los campos (bóveda de casetones, escalinata, hornacinas con Apolo y Atenea, suelo de mármoles). Trece filósofos del fresco son personajes con lección (ids `r_*`): Rafael, Platón, Aristóteles, Sócrates, Alcibíades, Pitágoras, Heráclito, Diógenes, Euclides, Ptolomeo, Zoroastro, Hipatia y Epicuro. La estela «Despertar» devuelve a la Academia. Las estelas con acción usan `pl.go`.
- **Discusión libre con Platón** (`aiChat`, `AI`, `AI_RULES`): en el Platón de la Academia y en el del sueño. Usa la capacidad `sample` del artefacto (se publica con `capabilities: {sample: {}}`): cada respuesta gasta la cuenta de Claude de quien juega, que debe dar permiso la primera vez. Si `claude.use('sample')` no responde (en local, por ejemplo), la opción no aparece. Terminar una discusión de al menos cuatro intervenciones da 2 óbolos una vez.

### Novedades de la versión 15: acabado
- **Texturas procedurales** (`PTEX`: sillería de mármol y de piedra, ladrillo, enlucido, tejas, madera, follaje, corteza y suelo), generadas en canvas al cargar y repetibles sin costuras (`pnoise`, `pfbm`, `procTex`, `ashlarTex`).
- **Proyección triplanar** (`triplanar(mat,tex,escala,flat)`): parchea un `MeshLambertMaterial` con `onBeforeCompile` para muestrear la textura según la posición en el mundo; funciona con instancias y con piezas sin UV. Se aplica a `M.marble`, `M.stone`, `M.limestone`, `M.tile`, `M.wood`, `TRAV`, `BRICK`, `PLAST`, `TUFA`, las gradas (`RING_M`), los enlucidos y, por papel, a las piezas de Blender (`whiteRole`, `roleMat` en `placeModules`). El terreno usa `terrainMat()` (proyección desde arriba y tinte cálido).
- **Luz:** mapeo tonal ACES (`renderer.toneMapping`, exposición 1,05), sol más intenso, luz del cielo ajustada en `updateSky`, sombras de 4096 px (2048 en móvil) que cubren 260 m.
- Ojo con la caché del navegador al probar en local: añade `&v=N` a la dirección para forzar la recarga.

### Novedades de las versiones 12 a 14
- **Escuelas y clases.** Motor genérico de clases: un NPC con `classes` (`{id,title,pages,ex}`) ofrece «Asistir a una clase» (`classMenu`, `classPage`, `classEx`); acertar todos los ejercicios da una moneda y se guarda en `state.seen['c:'+id]`. Salas con interior (`schoolRoom`, `seatKid`, `teacherChair`).
  - Atenas (`buildAthensSchools`, antes de `buildHouses`): escuela de letras (Cálias: letras, escritura, números áticos, Homero), escuela de música (Lisístrato: lira, modos, canto) y palestra (Cleómaco: lucha, pentatlón, aceite y estrígilo), con alumnos y pedagogos (`SOCIAL.school`, visibles de día y cerca).
  - Roma (`romaSchools`, antes de `romaCity`): pérgola del maestro Flavio en el Argileto (letras, cuentas, tablilla, Doce Tablas) y escuela del gramático Tito Verrio (Virgilio, partes de la oración, griego); Quintiliano da clases de retórica (cinco partes, suasoria, controversia, memoria).
- **Decoración de Atenas** (`athensDecor`, antes de `placeNPCs`): Ágora de tierra apisonada, calles de grava con desagües de piedra (`athensRoadsDecor`), 34 puestos de mercado con vendedores que pregonan, plátanos de Cimón, Tiranicidas, Conón y Evágoras, estelas con decretos, hermas y hecateos en los cruces, fuentes públicas y pozos.
- **Esparta y Micenas** (`defineGreeceLayout`, `buildSparta`, `buildMycenae`): Esparta sin murallas, con aldeas, acrópolis con Atenea Calcieco, Pórtico Persa con estatuas de persas, comidas comunes, tumba de Leónidas, Artemis Ortia, Platanistas, Menelaion y el Eurotas; personajes Agesilao, Cinisca (históricos), un hilota y un muchacho de la agogé. Micenas en ruinas: murallas ciclópeas, Puerta de los Leones, círculo de tumbas, palacio, Tesoro de Atreo (se entra por el corredor a la cúpula), fuente Perseia, aldea con pastor y Hereo de Argos con su sacerdotisa.
- **Roma (v12-13):** teatro (Plauto y Terencio), latinismos con Tito Verrio y decoración según las reconstrucciones (ver arriba).

## Convenciones del código
- **Coordenadas:** x = este, z = sur. `toW(lx,lz,x,z,a)` rota como `Object3D.rotation.y`. Hacia adelante del jugador = (−sin yaw, −cos yaw). Los modelos miran hacia +z (en Blender, hacia −Y).
- **Ágora:** `AG={x:-470,z:-330}` y `AL(lx,lz)` para posiciones relativas.
- **Terreno:** `terrainH`/`floorAt`. Colisiones con `addSeg`/`addCirc`/`addBox`/`resolve`. Para buscar un hueco libre: `findFree(x,z,r)`.
- **Construcción:** `buildWorld()` llama a buildAcropolis, buildSouthSlope, buildAgora, buildKerameikos, buildOutskirts, buildWalls, buildHarbor, buildIslands (Troya y Tebas incluidas), buildLandRoute, definePlaces, buildHouses, buildTrees, finishColumns, buildTorches, buildSocial, estelas, placeReliefs, placeNewNPCs, placeNPCs, buildPerformers, placeWalkers, buildGods, buildMount y finishRoofs. Antes, `loadModels` decodifica el GLB.
- **Posición de un NPC nuevo:** se añade en `NPC_POS` (en `placeNewNPCs` o en la función que construye su escena).
- **Guardado:** `localStorage`, claves `atenas-386-v1` y `roma-80-v1`.

## Cómo se ha probado
- Servidor local: `.claude/launch.json` lanza `python -m http.server 8386`. Se abre `atenas.html?modo=roma#debug` (o `?modo=atenas`): con `#debug`, el juego expone `window.__d` (jugador, caballo, dioses, estado, escena…).
- Para probar el respaldo sin modelos basta con abrir `fuente/atenas.src.html#debug`.
- Scripts de prueba con Playwright: en este entorno se dibujan pocos fotogramas por segundo, así que las animaciones avanzan despacio (dt máximo 0,05 s por fotograma). Para revisar un episodio, llamar a `__d.epiTick(0.05,t)` varias veces antes de la captura. Las transiciones con `setTimeout` también tardan más: mejor esperar con `waitForFunction(()=>__d.ui===…)`.
- Rendimiento medido con `renderer.render` más `readPixels` en una RTX 4070: Acrópolis 15,5 ms (v9: 14,8), Ágora 20,5 ms (v9: 26,2), campo 11,5 ms (v9: 8,9).
- En Blender, `modelos/atenas_modelos.blend` tiene las colecciones `people`, `arch`, `animals` y `gods`. Para cambiar una pieza: editarla, exportar la selección a GLB (sin UV, con normales, Y arriba, «aplicar modificadores») sobre `modelos/atenas_modelos.glb` y volver a ejecutar `construir.py`.

## Ideas para seguir
- Más esferas de sueño (Teseo y Egeo en el cabo Sunión, Prometeo, Eneas en el Lacio…) y un Minotauro que recorra el laberinto.
- Roma: interiores (Panteón, termas, basílicas), velario del anfiteatro, más escenas de vida cotidiana según la hora, y algún viaje, por ejemplo al puerto de Ostia.
- Triglifos y mútulos en relieve en los frisos dóricos (ahora son textura pintada).
- Más variedad de peinados y cuerpos; personas con nivel de detalle según la distancia.
- Trirreme y barco mercante modelados en Blender.
