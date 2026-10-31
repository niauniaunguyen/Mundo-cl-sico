# Nóstos — Atenas 386 a.C. y Roma 80 d.C. — documento de traspaso

Juego 3D en primera persona para el navegador, en español. Al empezar se elige la época: **Atenas en la primavera del 386 a.C.** o **Roma en el año 80 d.C.** Sirve para aprender política, filosofía, sociedad y mitos.

- **Archivo jugable:** `atenas.html` (unos 5,8 MB; `?modo=roma` o `?modo=atenas` en la dirección se salta el selector): HTML + CSS + JS y los modelos de Blender incrustados en base64.
- **Código fuente:** `fuente/atenas.src.html`, el mismo archivo con el marcador `@@GLB@@` en lugar de los modelos. **Se edita siempre el fuente** y luego se ejecuta `python fuente/construir.py`, que genera `atenas.html` incrustando `modelos/atenas_modelos.glb`.
- **Modelos:** `modelos/atenas_modelos.blend` (escena de Blender con todas las piezas) y `modelos/atenas_modelos.glb` (lo que carga el juego).
- **Publicado como artefacto:** https://claude.ai/artifact/HPMmRcZdwLro9kjKtCX2U9 (versión 84 del artefacto; notas de la versión 84). Para actualizarlo desde otra sesión, hay que leerlo primero con la acción `read` del artefacto y luego publicar pasando esa misma URL como `url`. Así se conserva el enlace.
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

### Tareas pendientes acordadas

- **Publicar el juego como web para los alumnos** (pendiente de decisión del usuario).
  - Opción recomendada: conectar el repositorio a Netlify o Cloudflare Pages, que admiten repositorios privados. GitHub Pages exigiría hacerlo público.
  - Cada vez que se suban cambios a la rama elegida (`main-djww2r` para actualizar al momento, o `main` para revisar antes), la web se actualiza sola.
  - Lo que hay que preparar en el repositorio:
    - `index.html` que lleve a `atenas.html`;
    - un aviso dentro del juego de «hay versión nueva, recarga», que consulte un `version.json` cada pocos minutos;
    - la configuración del servicio elegido;
    - una ficha breve para el alumnado sobre guardar y cargar partida.
  - Fuera de claude.ai no funcionan el modo libre en línea ni el diálogo con Platón por IA, porque usan las capacidades del artefacto. Todo lo demás sí.
  - No se recomienda guardar partidas en la nube con cuentas (datos de menores): se mantienen el guardado en el navegador y el archivo de partida.
- **Traducciones de los textos nuevos:** en pausa por decisión del usuario.

### Novedades de la versión 84: menús con iconos

- **Iconos SVG de trazo, hechos a mano** (clase `.ic`, 24×24, `stroke` = `currentColor`), sin dependencias. Se generaron con `iconos.py`; el SVG está escrito directamente en el HTML.
- **Barra superior:** solo iconos (`button.ib`). La tecla va en una esquina (`kbd`) y el nombre sale en un globo al pasar el ratón: es `aria-label`, mostrado con CSS `::after`, y se traduce con `i18nStatic`.
  - La fecha y el acontecimiento del día van en su propia línea, encima.
  - El icono de sonido muestra si está activado o silenciado (`aria-pressed`).
  - Botón nuevo `bKeys`: abre la tarjeta de controles.
- **Botones táctiles** (`#tbtns`): solo iconos grandes.
- **Diario:**
  - Las pestañas son iconos; el nombre solo aparece en la pestaña elegida (`.tl`). En el modo Historia, «Capítulos» cambia el `.tl`.
  - Guardar, cargar y cerrar son iconos.
- **Plano y biblioteca:** el botón de cerrar es una X. El del Mediterráneo es un globo, que se convierte en plano al cambiar (`setMed`).
- **Tarjeta de controles:** la barra de texto inferior (`#keys`) es ahora una tarjeta que aparece los primeros 12 s (`keysAutoTick`) y luego con el icono del teclado.
- **Sin cambios:** las opciones de los diálogos y la pantalla de inicio conservan su texto, porque es contenido.

### Novedades de la versión 83: game feel

Todo está en el módulo `GF`, antes de `startGame`. Los números para afinar están en `GF.k`.

1. **Movimiento:**
   - Inercia con `gfVel`: a pie se acelera en unos 0,2 s y se frena en 0,16 s; el caballo pesa (casi 1 s); al volar se planea (1,4 s).
   - Al chocar se pierde velocidad (`gfBlock`).
   - La subida y bajada en vuelo también se suaviza.
   - Golpe de cámara al aterrizar (`gfLand`, en la comprobación de suelo del bucle).
2. **Cámara** (`gfCam`, llamada al final de `placeCamera`):
   - Balanceo al andar, que sigue la longitud del paso, y vaivén lateral.
   - Inclinación al moverse de lado.
   - Inclinación en los giros: más fuerte volando y suave a caballo.
   - Balanceo de la barca.
   - Ángulo de visión más abierto al correr (+6), al galope (+8) y volando rápido (+11).
   - **Tecla K** o `prefers-reduced-motion`: quita el balanceo y los cambios de ángulo, para quien se marea. Se guarda en `localStorage` como `nostos-movcam`.
3. **Sonido:**
   - Pasos según el suelo con `gfStep` y `gfSurface`: piedra, tierra, arena, hierba y agua.
   - Ruido del aterrizaje (`sfxLand`) y un clic al interactuar (`sfxTap`).
   - Ambiente (`gfAudio`): cigarras en verano de día (junio a septiembre, lejos del mar), mochuelos de noche, gaviotas junto al mar y en el puerto, viento según la velocidad a caballo y en vuelo, y crujidos en la barca.
4. **Respuesta visual:**
   - Anillo en el centro al interactuar (`gfPulse`, en `interact`).
   - Cifras que suben al ganar óbolos (las detecta `gfTick`) o puntos de cualidad (`gfFloat`, en `qAdd`).
   - Resplandor dorado al subir de nivel (`gfGlow`).
   - Entrada suave del diálogo y del aviso de interacción (CSS `gfIn` y `gfPop`).
5. **Gente viva** (`gfPeople`): los paseantes parados te miran si pasas a menos de 4,5 m, y los que caminan se apartan (más si vas a caballo).

### Novedades de la versión 82: sacar partido a los diez destinos

Todo está en el módulo «sacar partido», justo antes de `startGame`. El estado se guarda en `state.m386` (`m386z()`). Las opciones de los personajes se añaden con `m386Opts(n,add)`, que se llama en `renderOpts` justo después de `egOpts`.

1. **Comercio por mar (`COM`, `comPrice`, `COM_EV`):**
   - Se compra a Teocrines (vino), a Protómaco (trigo y atún), a Cleóbula (tierra blanca de Melos, el pigmento) y a Polixena (madera). Se vende a Ctesón, el naviero del Pireo.
   - Los precios dependen de la estación (`calNow().mo`): el trigo, caro antes de la cosecha y en invierno; el atún, barato en otoño; el vino, caro en las Antesterias y las Dionisias; la madera, cara en primavera.
   - También dependen de una noticia del puerto que cambia cada día (`comEv`).
   - Caben 10 bultos con el barco propio y 4 sin él; sin barco se paga 1 óbolo de flete por bulto.
   - Ctesón explica el préstamo marítimo y la ley del trigo (Demóstenes XXXIV y XXXV; Lisias XXII).
   - Los precios están simplificados, y el juego lo dice.
2. **Dos sueños jugables en un lienzo propio** (`mgOpen`; bucle con `requestAnimationFrame` y teclado capturado):
   - `MG_SAL`, la batalla de Salamina, que se abre desde Carino. Hay que embestir de costado a más de 6 de velocidad. Los remeros se cansan. A los 40 s llega la brisa de Plutarco y las naves persas chocan entre sí. Gana quien hunde 5. Tienes 5 puntos de casco y 150 s, y un 35 % de las naves persas va a por ti.
   - `MG_ESF`, el buceador hilota de Esfacteria (Tucídides IV 26), que se abre desde Glauco. Faroles de las trirremes, aire limitado y 3 intentos.
   - La primera victoria da +3 óbolos, Sophía y Areté.
3. **El diálogo de los melios** (`MELOS_R`, `melosDlg`), desde Cleóbula: dos rondas con tres argumentos reales de los melios y la respuesta de Tucídides, una decisión final (resistir o rendirse), el desenlace y preguntas para pensar. Da +3 Lógos.
4. **Patrias nuevas para el forastero** (`ORIG.atenas`): Quíos, Rodas, Melos, Bizancio y Corcira, cada una con su próxeno, sus temas, sus frases y su reacción. También monedas nuevas (`FX_COINS`) para ellas y para Samos y Olinto.
5. **Modo Historia, capítulo 11: «La paz del Rey»** (`STORY_ATENAS.push`), con Eudemo, el padre:
   - Recorrido: Pireo, Bizancio (Protómaco), Quíos (Teocrines), Éfeso (Glauce) y vuelta al Pireo, viajando con `storyTravel`.
   - Incluye el texto de la paz (Jenofonte, Helénicas V 1.31) y tres preguntas.
   - Al final de la historia se menciona el viaje.
6. **Misiones** (`m386Opts` y objetos `EGX_OBJS` con `act` que empieza por `m:`; `egxAct` los pasa a `m386Act`; `m386Setup` va después de `egxSetup`):
   - **El escudo de Pilos:** Glauco pide que leas los escudos de la Stoa Poikile.
   - **Aristeas:** Cleóbula busca a su hermano, vendido de niño, que ahora es alfarero y liberto en el Cerámico.
   - **Las morías:** Eutifrón pide revisar los 5 olivos sagrados de Decelia, uno de ellos un tocón (Lisias VII).
   - Cada misión da 6 óbolos y Kléos.
- **Para las pruebas,** `__d` incluye ahora: `storyResume`, `storyFire`, `curStoryStep`, `regionOf`, `m386z`, `COM`, `comPrice`, `MG`, `MG_SAL`, `MG_ESF`, `mgOpen`, `mgStart`, `ORIG`, `FX_COINS` y `STORY_ATENAS`.

### Novedades de la versión 81: arreglo de las alas de cera

- **El fallo:** el laberinto de Creta está a 800 m de altura (`KNOS.y`), y la altura de vuelo se mide sobre `terrainH`. Al desplegar las alas junto a Dédalo, el juego creía que volabas a 800 m y fundía la cera al instante.
- **El arreglo:** `toggleWings` no deja volar si estás a más de 300 m sobre el terreno, es decir, en el laberinto o en la Gran Pirámide, y explica que hay que salir al aire libre. El aviso de Dédalo al entregar las alas lo dice también.
- **Por seguridad,** el tick de vuelo pliega las alas, sin fundirlas, si se da esa situación.

### Novedades de la versión 80: vida en los diez destinos del 386

Todo está en el módulo `VIDA386`, después del de los diez destinos. Cada función se encadena al `extra` de su entrada en `SIMPLE_GR`.

- **En todos los mapas** (`vidaComun`): vecinos con frases propias, perros, gallinas, cabras, cerdos o gatos (`faunaAdd`), y árboles (`destTrees`).
  - Los árboles se plantan al final y no crecen a menos de 9 m de ninguna estela (huellas con `reserve:true`, que no salen en el plano).
  - `o.pads` es una novedad de `defineSimple`: reserva sitios libres de los árboles que se plantan al crear el mapa.
- **Verdes:** Samos, Quíos, Corcira, Bizancio, Olinto y Pilos llevan `green:true`.
- **Escenas, cada una con su estela:**
  - Salamina: pescadores remendando redes.
  - Melos: telar de pesas junto a Cleóbula.
  - Samos: procesión al Hereo (las Tonaia).
  - Quíos: lagar con dos pisadores y un homérida recitando ante su público.
  - Rodas: dos barcos más en el puerto y púgiles entrenándose con su entrenador.
  - Corcira: el islote de la «nave de piedra» de los feacios.
  - Bizancio: atalaya del vigía de los atunes y puesto de pescado.
  - Olinto: mujeres hilando.
  - Pilos: Esfacteria (`rocaAlargada`) cerrando la bahía y pescadores hilotas.
  - Decelia: olivos jóvenes replantados (los olivos sagrados; Lisias VII).
- **Conversaciones** (`CONVS_ATENAS`), una por mapa: Artemisia en Salamina, los niños vendidos que vuelven a Melos, Pitágoras, el vino, la isla nueva de Rodas, la guerra civil de Corcira, el trigo que espera el viento, la liga de Olinto, los dos mil hilotas desaparecidos (Tucídides IV 80) y la vuelta a casa en Decelia.
- **Diez curiosidades** (`CURIOS`), leídas en las estelas.

### Novedades de la versión 79: diez destinos más del 386 a.C. (modo Atenas)

- **Islas** (solo en barco, puerto al oeste): Salamina, Melos, Samos, Quíos, Rodas y Corcira.
- **Costa** (barco y camino): Bizancio, Olinto y Pilos. Pilos se une a Itome por un camino (`WORLD_LINKS`).
- **Interior:** Decelia, con el arriero.
- **Dónde está el código:** en la lista `ISLANDS` van antes de Náucratis, para que desde Salamina no se vean las pirámides de Menfis. El módulo «diez destinos» está antes de la fauna: `SIMPLE_GR`, `MED_POS` y un personaje inventado con lección, test y fuentes por lugar (`destNPC`).
- **Elementos de cada mapa:**
  - Salamina: cueva de Eurípides y trofeo.
  - Melos: obsidiana.
  - Samos: Hereo (más pequeño que el real, y se avisa) y boca del túnel de Eupalino.
  - Quíos: viña y ánforas.
  - Rodas: estatua de bronce de Diágoras.
  - Corcira: templo de Ártemis.
  - Bizancio: aduana del diezmo.
  - Olinto: mosaico de guijarros.
  - Pilos: trofeo.
  - Decelia: recinto fortificado y estela de la fratría.
- **Ayudantes nuevos:** `tropaion`, `bronzeFigure`, `vinesAt` y `pebbleMosaic`.
- `buildSimple` ya no pone arriero en las islas sin camino (`I.land` falso).
- **Pendientes del mapa:** quedan sin mapa otros lugares (Egospótamos, Tasos, Lemnos, Citera, Ítaca…). Filipos, Filipópolis y Megalópolis todavía no existen en el 386.

### Novedades de la versión 78: Egipto vivido

Todo está en el módulo `jero*`/`egx*`, después del de Egipto.

- **Tu nombre en jeroglíficos:**
  - Lo escriben Padiset, Wennefer o Harsiesis (`egOpts`, `jeroDlg`).
  - `jeroSigns` traduce el nombre a signos de un solo sonido (`JERO`, con dígrafos ch, ll y qu; c y g suaves).
  - Se muestra en un cartucho (fuente Noto Sans Egyptian Hieroglyphs, cargada desde Google Fonts al abrir el diálogo) con la tabla de signos y la explicación de Champollion.
  - Se guarda en `state.jero` y aparece en el Diario, pestaña «Forastero».
- **Objetos `EGX_OBJS`** (de tipo `egx`, abren `egxAct`; solo son interactivos si estás a menos de 20 m de su altura).
- **La Gran Pirámide:**
  - Modo Roma: entrada por la cara norte (2 sestercios, según Estrabón). El interior (`egPyrInterior`, `PYR`) está a 900 m de altura, sobre la propia planta de la pirámide: corredor de entrada, Gran Galería con bóveda escalonada, antecámara y cámara del rey de granito con el sarcófago vacío. Hay un objeto para salir.
  - Modo Atenas: la entrada está cerrada y se cuenta la leyenda de Heródoto.
- **El Faro (modo Roma):** «Subir» lleva al segundo piso (una plataforma a 92 m, `EGX.faro`); «Bajar» devuelve a la entrada.
- **La crecida del Nilo:**
  - `egFields` crea unos 14 campos por mapa de Egipto que cambian según `egSeason(mo)`: inundados en ajet (julio a octubre), limo y luego verdes en peret, dorados en shemu.
  - Aviso al entrar en cada estación (`egxTick`).
  - **Nilómetro** en las dos Menfis: lectura en codos según el mes y el año, con su interpretación (el refrán de los codos en Roma; Heródoto en Atenas).

### Novedades de la versión 77: Egipto en los dos modos

Todo está en el módulo `eg*`, antes de `startGame`.

- **Red `eg` (`landDests`):** se llega por mar al puerto y desde allí se remonta el Nilo, como viaje «por tierra», hasta Menfis. El centro de la red es `naucratis` en el modo Atenas y `alejandria` en el modo Roma.
- **Banderas nuevas en los destinos:**
  - `flat`: el borde del mapa casi no sube (cambio en `islandBase`);
  - `desert`: sin los árboles por defecto (afecta al bucle de `buildIslands` y a `destTrees` de Roma) y `green` en falso.
- **Funciones auxiliares:**
  - `nileX` (el cauce del Nilo) y `egNile` (río ancho con cañas y barcos);
  - `egTint` (desierto lejos del río, verde cerca);
  - `egPalms` (palmeras instanciadas con 8 hojas);
  - `egPyramid`, a tamaño real: 230, 215 y 105 m de lado;
  - `egStepPyramid`, `egPylon`, `egTemple` (pilono, patio y sala hipóstila) y `egHouses` (casas de adobe de techo plano);
  - `egSphinx(…,buried)`, `egApis`, `egObelisks` (modelo `B_obelisk`) y `egPier` (muelle en la orilla).
  - `MED_POS` y `FX_COINS` ampliados.
- **Modo Atenas (386 a.C.):**
  - **Náucratis** (`padiset`, escriba e intérprete), con el Nilo, el Helenion, el templo de Apolo de los milesios, el de Afrodita y el recinto egipcio. Estelas: Amasis y el puerto, el regalo del río, el papiro, Hakor contra el Gran Rey, el Helenion y el recinto egipcio.
  - **Menfis** (`wennefer`, sacerdote de Ptah), con las pirámides, la Esfinge enterrada en la arena hasta el cuello (Heródoto no la menciona), la pirámide escalonada, el templo de Ptah y el buey Apis. Estelas: las pirámides según Heródoto, Ptah, Apis, Saqqara y el embalsamamiento.
- **Modo Roma (80 d.C.):**
  - **Alejandría** (`heron`, Herón de Alejandría, histórico, en `ROMA_HIST`), con el Faro de tres pisos y fuego, el Museo y la Biblioteca, el Soma, el Cesareo con dos obeliscos, el Serapeo y el lago Mareotis. Estelas: Faro, Museo, Soma, Cesareo, el trigo de Roma, los judíos y el Faro de cerca.
  - **Menfis** (`harsiesis`, sacerdote y guía), con la Esfinge desenterrada, su altar y su escalinata, y un nilómetro. Estelas: las pirámides para los viajeros (Plinio), la Esfinge, Tito y el buey Apis (Suetonio, *Tito* 5), el nilómetro y Memnón.

### Novedades de la versión 76: días de mercado

Todo está en el módulo `mkt*`, antes de `startGame`.

- **Puestos con vendedor y pregón:** los acontecimientos con `stalls:true` llaman ahora a `mktStalls`.
  - Hay 8 puestos por modo (`MKT_TIPOS`), cada uno con su mercancía modelada, un vendedor, un letrero y pregones (`mktTick`).
  - Roma: verduras, aves y huevos, quesos, cerámica, calzado, aceite y vino, miel y frutas.
  - Atenas: higos y aceitunas, ajos y cebollas, quesos, cerámica, lana, coronas, legumbres y miel del Himeto.
- **Atenas, mercado de la noumenia:** acontecimiento nuevo `noumenia`, el día 1 de cada mes del juego (cada 5 días), de 7 a 13 h. Está al final de `EVENTS_ATENAS`, así que los otros acontecimientos tienen prioridad.
- **Escenas** (`mktSetup`, con el motor de `vu*`):
  - campesinos que llegan por las 3 primeras `ROADS` con un burro cargado y cestas, de 6 a 9 h;
  - inspectores recorriendo los puestos de 8 a 12,5 h: en Roma, un edil con un esclavo público que lleva las pesas y otro ayudante; en Atenas, dos agoránomos y un ayudante con una medida (*Constitución de los atenienses* 51).
  - Solo aparecen los días de nundinas (Roma) o de noumenia (Atenas).

### Novedades de la versión 75: oficios con su trabajo, sus pregones y sus sonidos

Todo está en el módulo `ofic*`, antes de `startGame`.

- **Talleres y puestos:** se crean con `oficio({...})` y la lista está en `OFIC`.
  - Llevan figuras animadas: martillo, pisar en la tina, girar el molino (el burro es el modelo `donkey` de Blender) y brazos.
  - Al acercarse aparece su nombre; a menos de 9 m, una explicación una vez al día; a menos de 18 m, un pregón cada 30-55 s.
  - Abren de 6,5 a 18,5 h.
- **Sonidos sintetizados** (`sfxOficio`): yunque, campana del pescado y rumor del molino.
- **Roma:**
  - Subura: panadería con molino de burro y horno (Eurísaces), lavandería y tintorería (bataneros, la orina y el impuesto de Vespasiano, «el dinero no huele»), barbería y herrería.
  - Foro Boario: taberna de comidas (*thermopolium*).
  - Junto a las Termas de Tito: vendedor de salchichas (Séneca, Cartas 56).
- **Atenas, en el Ágora:**
  - zapatería (Simón y Sócrates);
  - puestos del pescado (la campana; Estrabón XIV 2.21);
  - barbería (los chismes; Lisias XXIV 20; Plutarco, *Nicias* 30);
  - fundición de bronce junto al Hefestion;
  - panaderas (*Las avispas*).

### Novedades de la versión 74: vida urbana, el ritmo del día y escenas públicas

Todo está en el módulo `vu*`, antes de `startGame`.

- **El ritmo del día** (`vuAct(h)`):
  - Cada paseante tiene un rango fijo `w.rk`. Si supera la actividad de la hora, está en casa (`w.home`): ni se ve ni se mueve.
  - Roma: noche 12 %, alba 45 %, mañana 100 %, siesta de las horas sexta y séptima 32 %, tarde de termas 72 %, anochecer 50 %.
  - Atenas: noche 10 %, alba 40 %, ágora llena 100 %, mediodía 55 %, tarde 60 %, anochecer 35 %.
  - Se actualiza con `performance.now()` cada 1,2 s, porque el tiempo de juego avanza poco en entornos lentos.
  - Los transeúntes dicen frases según la hora (`VU_BARKS`, `vuBark`, la mitad de las veces).
- **Escenas** (`vuMake` y `vuScene`): grupos en formación que recorren una polilínea a ciertas horas. Admiten `loop`, `arrive` (llegar y quedarse) y `stop`, y muestran un aviso al acercarse.
  - **Roma, el pretor:** un pretor con seis lictores y sus fasces, sin hacha dentro de la ciudad, más su séquito. Da vueltas por el Foro de 8 a 12 h.
  - **Roma, el funeral noble:** flautistas, plañideras, actores con las máscaras de los antepasados, el lecho a hombros y la familia de luto. Va por la Vía Sacra hasta los Rostra (Polibio VI 53), los días con día % 3 == 1, de 9 a 11,5 h.
  - **Roma, los carros de noche:** carros con mula por las 6 primeras `ROADS`, de 21 a 5 h (la ley de César).
  - **Atenas, ¡A la Pnyx!:** los días de asamblea, a las 6-8 h, los ciudadanos corren del Ágora a la Pnyx porque solo cobran los primeros. En la Pnyx, dos arqueros escitas.
  - La cuerda roja **no** se usa: es del 425 a.C. (*Los acarnienses*). En el 386 a.C. ya se pagaba la asistencia (*Las asambleístas*), y el aviso lo explica.

### Novedades de la versión 73: los fastos, el calendario romano

Basado en N. F. Marqués y J. A. Vizcaíno, *Un año en la antigua Roma* (2018). El texto extraído está en el scratchpad (`anyo_out/libro.txt`, y los encabezados por mes en `anyo_out/meses.txt`). Los textos del juego son propios: el libro se ha usado para elegir los días y comprobar los datos.

- **`FASTI_R`:** los días señalados de cada mes, de 5 a 8 por mes, con fecha real.
  - En el modo Roma aparecen al principio de la pestaña «Fiestas» del diario (`fastosHTML`), con el mes siguiente.
  - Al empezar cada mes sale un aviso de las Kalendas (`fastosTick`).
- **Fiestas en su mes:** `festOfDay` se envuelve en el modo Roma para que las fiestas del ciclo caigan en su mes real (`festMonth` lee el mes del campo `month`). Los meses sin fiesta del ciclo no tienen celebración.
- **Hora romana en el marcador:** `horaRomana`, de la hora prima a la duodécima, y la noche como vigilias.
- **Personaje nuevo `scriba`** (Sexto Verrio, escriba de los pontífices, junto a la Regia) con 6 temas:
  - cómo se cuentan los días (Kalendas, Nonas, Idus, cuenta inclusiva);
  - el calendario de Rómulo, Numa y César;
  - los días fastos, nefastos y comiciales y las nundinas;
  - las horas y el reloj de Catania;
  - los juegos seculares;
  - la semana planetaria.
- **Estela nueva:** `ro_fastos`, «Los fastos y la Regia».

### Novedades de la versión 72: el Capitolio con su forma real

- **Relieve:** `RHILLS` sustituye la antigua meseta única a 37 m por tres elevaciones:
  - el Capitolium, al sur (−228, 22; 32 m), con el templo de Júpiter, que ahora está ahí y mira al sur;
  - el Arx, al norte (−218, −108; 38 m), con Juno Moneta trasladado allí y el augur (el auguraculum);
  - el Asylum, una hondonada entre ambos (−214, −42; 21 m), detrás del Tabularium.
- **Clivus Capitolinus:** se excava y pavimenta en `romaH` y `romaPaved` siguiendo la polilínea `CLIVUS` (función `clivusAt`). Sale del Foro junto al templo de Saturno y llega al Capitolium. Tiene estela nueva, `ro_clivus`.
- **Otros cambios:**
  - La zona «Capitolio» abarca las dos cumbres.
  - La estela de Júpiter se ha movido delante del templo.
  - `romaCity` no pone casas en el Capitolio (prohibido desde Manlio, 384 a.C.).

### Novedades de la versión 71: el culto doméstico romano

Todo está en el módulo `cult*`, antes de `startGame`. El estado se guarda en `state.culto`: `n`, `ok`, `d`, `foc`, `corF`, `lem` y `avis`.

- **Calendario de los ritos:** cada mes del juego dura 5 días; el 1.º son las Kalendas, el 3.º las Nonas y el 5.º los Idus (`cultDia`).
- **Larario interactivo** (`CULT_OBJS`, de tipo `culto`, que abre `cultoAct`):
  - Está en la Domus del Celio (Filero te deja ofrecer como huésped) y en tu casa del Quirinal (la acción `altar` de `hogarAct`).
  - Hay cinco ofrendas posibles (`CULT_OFR`). En los días de fiesta lo propio es la guirnalda (Catón 143).
  - El hogar de la cocina (contexto `focus`) permite la porción para los Penates y la corona en los días de fiesta.
- **Rito de las Lemurias** (`lemuria`, `LEM_PASOS`, Ovidio, Fastos V): 7 pasos.
  - Solo cuenta de verdad en el mes Maius y a medianoche; en otro momento se puede practicar.
  - Avisos al empezar febrero (Parentales) y mayo (Lemurias) en `cultTick`.
- **Personaje nuevo `avia`** (Cecilia Paulina, en la domus) con 7 temas y 7 más en `MORE.avia`:
  - Lares, Penates, Genio y Juno, Vesta, Manes y Lemures, Parentales y Caristia, y los ritos de paso (bula, lúnula, toga viril).
  - Lo que se ve en la pintura del larario y las serpientes agathodaímones.
  - Las figurillas y los lararios de los oficios.
  - El altar de la cocina y quién dirige los ritos.
  - Los sueños de los muertos (Cicerón, Sobre la adivinación I 57) y las larvas de los banquetes (Petronio 34).
- **Estelas nuevas en la domus:** `domus_penates`, `domus_genio`, `domus_lemures`.
- Las fiestas de Parentalia y Compitalia ya existían: no se han duplicado.
- **Documentación:** N. F. Marqués González, *¡Que los dioses nos ayuden!* (2021), capítulo «Religión vivida en familia». El texto extraído está en el scratchpad, en `dioses_out/libro.txt`; tiene más capítulos útiles sobre religión pública, adivinación, magia y amuletos.

### Novedades de la versión 70: cuadernos de viaje para el profesorado

- **El alumno:**
  - En el Diario, pestaña «Forastero», el botón «Entregar mi cuaderno» descarga `cuaderno_Nombre.txt` (`fxEntregar`, que usa `offerDownload`). También hay un botón para copiar el texto.
  - El archivo es texto legible y, tras `---DATOS---`, el JSON para importarlo (`fxCuadData`, `fxCuadTxt`, `fxCuadFile`).
  - Incluye los dos modos si en ese navegador hay partida de ambos: el otro modo se lee de su clave de localStorage.
- **El profesor:**
  - En el panel (º, clave «mentor»), el botón «Cuadernos de viaje de los alumnos» abre `fxProfeCuadernos`.
  - Desde ahí se pueden abrir varios archivos a la vez, pegar uno, ver el del propio navegador o descargar todos en un solo archivo.
  - La lista (`FXCLASE`) solo vive en memoria y se ordena por nombre.
- La Guía (Para el profesorado) lo explica.

### Novedades de la versión 69: el protagonista es forastero

Todo está en el módulo `fx*`, insertado antes de `startGame`. El estado se guarda en `state.fx`, que crea `fxz()`: `st` ('xenos'/'meteco'), `prost`, `ciu`, `tes`, `cuad`, `coins`, `nostos` y `warn`.

- **Patria:**
  - Se elige al crear el personaje (`#pjOrig`) o después, en la pestaña nueva del Diario «Forastero» (`jTab==='fx'`, `fxJournal`). Queda bloqueada cuando ya eres meteco o ciudadano.
  - Patrias de Atenas (`ORIG.atenas`): Mileto, Siracusa, Tebas, Corinto, Tracia y Náucratis.
  - Patrias de Roma (`ORIG.roma`): Malaca, Massilia, Alejandría, Atenas, Britania y Lepcis Magna.
  - Cada patria tiene un paisano con su propia conversación, frases de los transeúntes (un 20 % de `bark`) y una reacción en el primer saludo (`pjGreet`).
- **El paisano** (`PAISANO`, id `paisano`, el mismo objeto en los dos modos):
  - Usa getters: su nombre, título y temas dependen de la patria.
  - Su posición es un getter en `NPC_POS`: en Atenas, junto a Lisias; en Roma, en las estaciones de los municipios, junto al Templo de la Paz.
  - `fxRelabel()` rehace su etiqueta al cambiar de patria.
- **Atenas, inscripción como meteco:**
  - El paisano hace de prostátes. El demarco de Mélite (`DEMARCO`, nuevo personaje) cobra el metoíkion: 72 óbolos, o 36 para las mujeres.
  - Avisos a los 4 días y aviso del sicofanta a los 10 (`fxTick`).
  - Para la casa de Formión ahora hace falta ser meteco.
  - Mensaje en la Pnyx (`fxZone`).
  - Xenelasía en Esparta: aviso a los 150 s y expulsión hasta la llegada a los 300 s.
  - Cambistas al llegar a las polis con moneda propia (`FX_COINS`, `fxArrive`): un óbolo y una explicación.
  - Dato de viaje sobre la pentekosté.
- **Roma, ciudadanía:**
  - El duunviro de Malaca (`MALACITANO`, en Corduba) ofrece el camino del derecho latino (Plinio III 30; ley Flavia municipal), por 200 sestercios.
  - El resultado: «Tito Flavio / Flavia + nombre» (`fxNombre`) y el avatar con toga (`playerLook`).
  - La vía de la casa (petición al emperador) también da `fx.ciu`, y la ciudadanía por derecho latino desbloquea la compra de la casa.
- **Hospitalidad:**
  - Con cualquier personaje de un destino aparece la opción «Pedir hospitalidad», que da un sýmbolon o una tésera.
  - `fareOf` envuelve a `fareOf0` y cobra la mitad saliendo de una ciudad donde tienes anfitrión.
- **Cuaderno «¿Y en tu tierra cómo es?»** (`FX_COMPARA`, seis personajes por modo): respuesta libre que se guarda en el diario y termina con la reflexión de Heródoto III 38.
- **Nóstos:** con 12 lecciones, o al ser meteco o ciudadano, el paisano ofrece volver o quedarse. Hay un epílogo según la patria, el estatus y los anfitriones (`fxEpi`).
- Pendiente: traducir los textos nuevos; quizá mostrar el cuaderno en el panel del profesor.

### Novedades de la versión 68: funciones en todos los teatros

- **Sistema genérico:**
  - `romaTheatres()` / `updateRomaTheatre()` valen ahora para cualquier teatro de `ROMA.theatres`, en ambos modos.
  - Cada obra de `ROMA_PLAYS` se asocia a su teatro por nombre (`thn`); las antiguas usan `th` 0/1 vía `ROMA_THN`.
  - `romaTheatres()` es idempotente. Se llama al construir Roma, después de `buildRomaDests()` y, en el modo Atenas, en `bootWorld`.
  - Opciones nuevas de cada obra: `chorus:{n,c,f,s}` para el coro griego en la orquesta, `dance` para la pantomima y un tercer elemento `true` en `cast` para personajes femeninos.
  - `THEA_NOTE[nombre]` es la explicación que sale en la estela del programa.
  - El programa de Pompeyo y Marcelo conserva su texto y su id (`ro_prog0/1`).
  - `noPlays` ya no tiene efecto.
- **Modo Roma (dos funciones al día, de 9 a 12 h y de 15 a 18 h):**
  - **Neápolis:** Menandro en griego, El misántropo y El escudo, con una nota sobre los Sebastá y Nerón.
  - **Saepinum:** atelanas (Papo derrotado, de Novio; Maco soldado, de Pomponio). Solo quedan los títulos; los argumentos están reconstruidos y se dice.
  - **Verona:** El que se atormenta a sí mismo, de Terencio, y la pantomima de los trabajos de Hércules.
  - **Tarraco:** Los cautivos, de Plauto, y un mimo, El cazador de herencias (reconstruido).
  - **Emerita:** la pantomima Dido abandonada (Eneida IV) y La maroma, de Plauto.
  - **Carthago Nova:** El cartaginés, de Plauto, con sus versos en púnico, y la pantomima de Perseo y Andrómeda.
  - **Lugdunum:** Edipo, de Séneca (con la duda de si se representaba o solo se recitaba), y la pantomima El juicio de Paris.
- **Modo Atenas:**
  - Nueva función `greekTheatre()`: gradas de tierra y madera, orquesta con thymele, escena de madera con paraskenia y un tablado bajo.
  - **Pireo:** teatro nuevo con Pluto y Las asambleístas, de Aristófanes (Dionisias del Pireo; Tucídides VIII 93).
  - **Corinto:** teatro nuevo con Edipo rey (con el mensajero corintio) y el drama satírico El Cíclope.
  - `fieldOk` no siembra dentro de los teatros.
- Pendiente: traducir las obras nuevas.

### Novedades de la versión 67: fidelidad histórica de las polis, de Roma y de las provincias

Se revisaron las estelas y los personajes de Tebas, Esparta, Corinto, Argos, Mégara, Delfos, Olimpia, Mantinea, Platea y Micenas, y en el modo Roma los de la propia Roma, Etruria (Tarquinii), Hispania y la Galia. Se cotejaron con Pausanias I-VI (el texto está en `geo_out`), Tucídides, Jenofonte (Helénicas y Constitución de los lacedemonios), Estrabón, Plinio, Livio y Dion Casio LXVI 24. Lo comprobado ya estaba bien: las fechas y las distancias al 386 y al 80 cuadran.

- **Anacronismos corregidos:**
  - La tumba de Leónidas estaba «frente al teatro»; Esparta no tiene teatro de piedra en el 386. Se aclara que los juegos en su honor los cuenta Pausanias para época romana.
  - El templo de Tarquinii se llamaba «Ara de la Reina», que es un nombre medieval. Ahora es «Gran templo de Tarquinii».
  - El Palatino ya no tiene «palacio flavio en obras»: el de Rabirio es de Domiciano.
  - Las manumisiones del muro poligonal de Delfos son de después del 200 a.C.
  - Erratas: «Atena» → «Atenea»; ahora Marcial «llama» a Corduba…
- **Incendio del año 80** (Dion Casio):
  - Nueva estela `ro_incendio80` en el Campo de Marte.
  - Se menciona también en el templo de Júpiter Capitolino y en la escena del teatro de Pompeyo.
  - Los Balbos de Gades remiten al teatro de Balbo quemado.
- **Grecia:**
  - **Esparta:** el Coro y las Gimnopedias, Cinadón y la escasez de Iguales, dos reyes y cinco éforos, la moneda de hierro.
  - **Tebas:** el Heracleo con las estatuas de Alcámenes dedicadas por Trasibulo (Pausanias IX 11), las anguilas del Copais. Nuevo personaje histórico, **Ismenias** (`ismenias`, con su entrada en SRC): Áulide 396, el oro de Timócrates, su muerte en el 382.
  - **Corinto:** los muros largos y la mora destruida por Ifícrates (390), los «potros» (monedas), la fuente de Glauce.
  - **Argos:** Apolo Licio (Dánao y el lobo).
  - **Olimpia:** el gran altar de ceniza, con modelo (Pausanias V 13).
  - **Delfos:** el pórtico de los atenienses.
- **Roma y provincias:**
  - **Etruria:** la lengua etrusca, los doce pueblos y el Fanum Voltumnae, las mujeres etruscas y Tanaquil.
  - **Gades:** los Balbos.
  - **Carthago Nova:** el campo del esparto.
  - **Massilia:** los seiscientos timucos y las dotes (Estrabón IV 1.5).
- **Segunda pasada:**
  - **Mégara:** Nisea y Minoa (Tucídides III 51 y IV 66-69); las colonias (Calcedonia y Bizancio, Heródoto IV 144) y Teognis.
  - **Mantinea:** Poseidón Hipio.
  - **Tarraco:** Galba, gobernador y emperador; los vinos y el lino.
  - **Corduba:** la primera colonia (Estrabón III 2.1).
  - **Nemausus:** la puerta de Augusto.
  - **Lugdunum:** el anfiteatro de las Tres Galias, del 19 d.C.
- **Pendiente:** los textos nuevos siguen sin traducir. Para Tebas, Delfos y Arcadia no hay Pausanias VIII-X en el material: se usaron Jenofonte y fuentes conocidas.

### Novedades de la versión 66: tipos de perro antiguos
- `modelos/blender/animales.py` → `dog()` genera cinco modelos: `A_moloss`, `A_laconian`, `A_cretan`, `A_melitan` (lanudo, con cola en penacho) y `A_umbrian` (orejas largas). `A_dog` queda como el callejero. Los hocicos son elipsoides, porque los cilindros horizontales se veían negros.
- `FAUNA_INFO` tiene fichas propias, con fuentes: moloso, laconio, cretense, melitense, umbro (solo Roma), británico (solo Roma, usa el modelo del moloso) y callejero.
- Reparto en `buildFauna`:
  - moloso: guardianes y perros de pastor (blancos, según Varrón);
  - británico: el 35 % de los guardianes de Roma;
  - melitense: falderos;
  - calles: callejeros, laconios y cretenses en Atenas; callejeros, laconios y umbros en Roma;
  - cazadores por los caminos, con una pareja de laconios, cretenses o umbros.

### Novedades de la versión 65: fauna (modelos de Blender propios)
- `modelos/animales.blend`: escena nueva. No se tocó `atenas_modelos.blend`, que está guardado con Blender 5.2.
  - Se genera con el script (`modelos/blender/animales.py`; se ejecuta con `bpy` 5.0) y se exporta a `modelos/animales.glb`.
  - `construir.py` incrusta ese archivo en el marcador `@@GLB2@@` (elemento `#glb2`), y `loadModels` lo carga después del GLB principal.
  - Contiene 14 especies, cada una por piezas: `A_<especie>_body`, `_head` (pivote en el cuello), `_tail`, y `_leg_fl/fr/bl/br` o `_leg_l/r` (pivote en la cadera). Además, `A_peacock_train`/`_fan`. Los materiales llevan el papel en el nombre (coat, feather, comb, beak, horn…; ver `ROLE_C`).
- Juego:
  - `animal(sp,{c,s,extra})` monta un animal; `faunaAdd` lo coloca con un comportamiento: `wander`, `peck`, `still`, `lie`, `sit`, `follow` o `road` (burros con serones y arriero).
  - `faunaTick` lo anima: patas, cabeceo, cola del perro y el gato, la cabeza que sigue al jugador, el pavo real que abre la cola, las codornices que saltan. Los animales lejanos (a más de 190 m) se ocultan.
  - `buildFauna` (en `bootWorld`) reparte:
    - en ambos modos: perros callejeros, guardianes tumbados y falderos que siguen a su dueña, gallos y gallinas, cerdos, cabras con los rebaños y burros por los caminos;
    - en Atenas, además: comadrejas, lechuzas en la Acrópolis, la pelea de codornices del Ágora (estela `codornices`), la pelea de gallos junto al teatro (`gallos`), pavos reales de una casa rica y un mono con su dueño;
    - en Roma, además: gatos, los gansos de Juno en el Capitolio (`gansos_capitolio`), los pollos sagrados junto a la Curia (`pollos_sagrados`), el perro de la domus, pavos reales en el Palatino y un loro en tu casa;
    - en los dos modos, una culebra doméstica en tu casa, y perros y gallinas en cada destino.
  - E sobre un animal: «Observar» (`faunaTalk`) muestra un dato con fuentes (`FAUNA_INFO`). La primera vez de cada especie da +1 so (`state.fauna`).
- El HTML pasa a pesar unos 8,1 MB.

### Novedades de la versión 64: Estagira, y Aristóteles solo allí
- Mapa nuevo `estagira` (modo Atenas, Calcídica): se llega por mar desde el Pireo y tiene puerto (`seaPort`).
  - Estelas: la colonia de Andros, la Liga de Olinto y lo que vendrá con Filipo.
  - La casa de Nicómaco, con el médico atendiendo a un paciente.
  - Pescadores con redes, cabras, colmenas de barro y un olivar con recolectores.
  - Personaje `clito_estagira` (pescador, inventado) con lección sobre la Calcídica y la Liga de Olinto.
- Aristóteles niño ya no está en Atenas. `NPC_POS.aristoteles_nino` se fija en el `extra` de Estagira, y `arisSpots()` devuelve `ARIS.spots` (médico, puerto, rebaño, abejas, campo).
  - `ARIS_OBS` tiene textos nuevos para la consulta de su padre y las abejas.
  - Su `where` y las notas de `SRC` dicen que está en Estagira.

### Novedades de la versión 63: la guerra del Peloponeso (Tucídides)
- Los 4 volúmenes de Tucídides se extrajeron en carpetas aisladas. El azw3 se convirtió con la biblioteca `mobi`, dándole sustitutos mínimos para `loguru` e `imghdr`. Solo se usaron datos, comprobados en el texto.
- `buildTucGR` (llamada justo después de `buildGeoGR`) añade seis estelas:
  - `demosion_sema`: el discurso fúnebre;
  - `peste_430`;
  - `muros_largos_tuc`: la estrategia de Pericles;
  - `debate_mitilene`: la segunda trirreme;
  - `flota_sicilia`;
  - `tesoro_atenea`.
- Personaje `nicandro_sicilia` (Nicandro de Acarnas, inventado), veterano de Sicilia, junto a la Stoa Poikile. Lección sobre la guerra según Tucídides; temas: la causa más verdadera, Sicilia, Melos y el final. `nicandro` ya era el comerciante de Corinto.
- `CONVS_ATENAS` tiene cuatro conversaciones nuevas con el tema «La guerra»: en el Cerámico (la peste), en el Pireo (la flota de Sicilia), en la Pnyx (Mitilene) y en el mercado (Decelia y el asedio).

### Novedades de la versión 62: Aristóteles niño
- `ARIS_NPC` (id `aristoteles_nino`, escala 0,66) es un personaje del modo Atenas que se considera histórico. Hay que tener en cuenta que es una licencia: nació en el 384, y está señalado en `SRC`.
- `arisTick` lo cambia de sitio cada 75 s, siempre que el jugador esté a más de 60 m y no esté en un diálogo. `arisMove` elige un sitio entre el alfarero, las yuntas, los campesinos, los rebaños, los caminantes del Ágora y el capitán del Pireo, y lo pone mirando hacia lo que observa.
- Su presentación (`intro`, que se calcula en el momento) cambia según lo que mira (`ARIS_OBS`): la cocción en tres fases, cuernos y dientes, ovejas y cabras, el barbecho, el «animal político», o los peces y el pulpo.
- Sus temas anticipan su método empírico; también hay lección y pregunta.

### Novedades de la versión 61: Asia Menor, Hispania y la Galia
- **Modo Atenas** (en `ISLANDS`, detrás de `GREECE_DESTS`; red `asia`, con centro en Éfeso):
  - Éfeso, Mileto y Halicarnaso: por mar desde el Pireo, con puerto (`seaPort`) y arriero.
  - Sardes: por tierra desde Éfeso.
  - Cada mapa está en `SIMPLE_GR` y tiene un personaje (`ASIA_NPCS`, metido en NPCS y LESSONS al cargar) con lección, temas, pregunta y fuentes. Son Glauce (melisa del Artemision), Areto (cartógrafo de Mileto), Ysaldomo (intérprete cario) y Bagadates (escriba del sátrapa).
  - Monumentos y lugares: Artemision gigante; leones del puerto de Mileto; fuente Salmacis; en Sardes, el Pactolo (`addRiver`), el palacio del sátrapa, el paraíso, los túmulos lidios y la estela de la lectura de la Paz del Rey.
- **Modo Roma** (en `ROMA_DESTS`):
  - Hispania: Gades y Carthago Nova (por mar); Corduba y Las Médulas (por tierra desde Tarraco).
  - Galia (red `gal`, con centro en Massilia): Massilia (por mar); Nemausus, Lugdunum y Alesia (por tierra).
  - Monumentos y lugares: piletas de garum en Gades; laguna y teatro en Carthago Nova; el Betis y su puente en Corduba; picos rojos (`tint`) y canal en Las Médulas; puente del Gard (`aqueductBridge`) sobre el Gardon; el Ródano, el Arar y el altar de las Tres Galias en Lugdunum; doble línea de empalizadas en Alesia.
  - Personajes en `ROMA_DEST_NPCS`; fuentes en `ROMA_DEST_SRC`. El salador de Gades es `himilcon_gades`, porque `himilcon` ya era el comerciante de Cartago.
- `defineSimple` admite tres opciones nuevas: `arr` (punto de llegada), `lake` y `tint`.
- `greekArrive` usa `PORTS[id+'_n']` en los mapas que también tienen puerto.
- `landDests` usa un centro distinto para cada red: hisp → Tarraco, gal → Massilia, asia → Éfeso.
- Los teatros de provincias deben llevar `noPlays`.

### Novedades de la versión 60: hermas completas
- `herm()` añade el falo esquemático, del mismo mármol y a media altura del pilar, como en las hermas reales (la estela «Hermas» ya lo explicaba).

### Novedades de la versión 59: brillo aguamarina de las Musas
- `divineFigure` admite un color de piel distinto del halo (`skinCol`).
- Las Musas tienen el halo aguamarina (#7fffd4, más intenso y algo mayor) y la piel con un brillo aguamarina suave (#a6eedc). Los dioses siguen en dorado y Mnemósine, en azul.

### Novedades de la versión 58: vestuario (Th. Hope, Costumes of the Greeks and Romans)
- El epub se extrajo en una carpeta aislada y solo se usaron datos.
- `personMat` admite tres opciones nuevas en el sombreado de la tela:
  - `clavus` ('lati'/'angusti'): franjas púrpura (`PURPURA`) en la túnica;
  - `praet`: borde púrpura de la toga pretexta, en diagonal sobre el pecho y en el bajo; solo se aplica en `drape` con toga;
  - `pat` ('spots'/'stars', color `patC`): estampado en los vestidos.
- `dressExtras` añade la clámide (capa abierta con fíbula dorada en el hombro derecho; lleva un atributo de color porque el material usa colores por vértice) y el pétaso (sombrero de fieltro sin alas; `petasos:'head'` o `'back'`, colgado a la espalda).
- `dressLook(look,title)` viste a los personajes con nombre según su oficio:
  - Atenas: viajeros, mensajeros, jinetes, pastores y arrieros llevan clámide y pétaso; algunas mujeres llevan estampado.
  - Roma: magistrados y sacerdotes llevan pretexta y laticlavio; los senadores, laticlavio; caballeros, procuradores y prefectos, angusticlavio; la toga es de color natural.
- Caminantes:
  - Atenas: en los caminos, la mitad de los hombres llevan clámide y pétaso, y un tercio de las mujeres, vestido estampado.
  - Roma: el 8 % de las togas son pretextas, otro 12 % lleva laticlavio y el 6 % de las túnicas cortas, angusticlavio.

### Novedades de la versión 57: ríos excavados y navegables, suelo igual a la malla, andar natural
- **Ríos.** `addRiver(pts,w,opt)` registra cada río en `CARVE` (rejilla de 24 m) y lo excava.
  - `carveH` actúa en `terrainH0` en el mapa de Atenas y en `islandBase` en los destinos. Perfil: lecho, orillas con pendiente 0,55 y nivel de agua `L` que siempre baja (mínimo acumulado de la orilla más baja de cada sección). El río se corta si el cauce queda más de 10 m por debajo.
  - Si la malla del destino ya existe, `recarveIsland` la excava y la pinta de barro.
  - `riverRibbon` llama ahora a `addRiver`, así que el Eurotas, el Escamandro, el Ofis, el Alfeo y los ríos de Roma están excavados. En Mantinea el Ofis queda bajo la explanada de la ciudad.
  - Los ríos de Atenas (`defineRiversGR`) se registran antes de `buildTerrain`, con coordenadas fijas.
  - El Eurotas ya no tiene paredes invisibles.
  - `floorAt` incluye `riverWater`: en lo hondo el suelo es el agua −1,25 m (se nada con la cabeza fuera). `inWaterK` frena al jugador en el agua.
  - `treesGLB` no planta árboles en el agua.
- **Barcas.** Los ríos de 16 m o más, el Cefiso y el Pamiso tienen embarcadero y barca (`buildDock`). `boatEnter`/`boatTick`/`boatExit`: W/S reman en la dirección en la que se mira, A/D llevan hacia una orilla, E baja a tierra. El bucle principal usa `BOAT.y` como suelo.
- **Suelo igual a la malla.** `buildIslandMesh` guarda la rejilla (`gridSet`), e `islandH` la interpola con los mismos triángulos (`gridH`). En Cartago la diferencia medida es 0,00 m. Además, la ciudad baja de Cartago ya no se solapa con la Byrsa.
- **Andar.**
  - `personLegs` parte `P_feet` y `P_legs` en izquierda y derecha (`splitGeo`) con la articulación en la cadera (`HIP_Y`), en `children[0]`.
  - `personWalk(g,fase,amp)` mueve piernas y brazos en contrafase y balancea un poco el cuerpo. La zancada es menor con ropa larga (`legAmp` 0,15 frente a 0,42).
  - La fase avanza con la distancia recorrida. Se aplica a los caminantes, al avatar en tercera persona y a los jugadores en línea.
- Accesibilidad: 264 objetivos en Atenas y 205 en Roma.

### Novedades de la versión 56: ríos y geografía (Pausanias I-VI y el Penguin Historical Atlas)
- Las fuentes se extrajeron en carpetas aisladas: Pausanias desde los epub; el atlas, que es un PDF escaneado sin texto, se consultó por sus páginas de mapas (Esparta y Tebas, 396-362).
- Atenas (`defineRiversGR`, antes de `buildTrees`):
  - `traceRiver` traza el Iliso (del Himeto al Falero, al sur del Liceo y junto al Olimpieion) y el Cefiso (de la Academia al mar) buscando el fondo de los valles y sin entrar en las murallas.
  - `GRIV.grid` (`nearRiver`) impide que haya cultivos, campos (`fieldOk`) o árboles sueltos en las orillas.
  - El Erídano va por el Cerámico (`polyPts` + `outsideWalls`).
  - `buildGeoGR` (después de `buildSocial`) dibuja el lecho y el agua (`ribbon`), las cañas y los plátanos (`riverBanks`) y las estelas `iliso`, `eridano` y `cefiso`.
- Destinos:
  - Olimpia: el Cladeo y estelas del `cladeo`, el `alfeo` (Aretusa, el monte Tipeo) y el `cronio` (los Básilas).
  - Argos: el Ínaco, con su cauce casi seco (`inaco`).
  - Itome: la fuente Clepsidra con su estela (`clepsidra`) y el Pamiso con la suya (`pamiso`).
  - Corinto: la estela `lequeo` en la orilla norte (Lequeo y Céncreas).
- El Eurotas, el Escamandro, el Ofis y el Alfeo ya existían como `riverRibbon`.
- La prueba de accesibilidad pasa: 264 objetivos.

### Novedades de la versión 55: árboles nuevos, cultivos con estaciones y vida en el campo
- `betterTrees()` se llama al cargar el GLB y sustituye `T_olive_*`, `T_cypress`, `T_pine_*`, `T_plane_*` y `T_bush` por geometría generada por código, con los mismos papeles (bark/foliage), así que `treesGLB` y `placeModules` no cambian.
  - Funciones: `blobGeo`, que crea masas de copa deformadas con ruido; `limbGeo`, que crea ramas torcidas y curvadas; y `mergeG`, que fusiona las piezas.
  - Olivo: tronco retorcido con tres ramas y copa en racimos. Ciprés: llama hecha con un torno. Pino piñonero: tronco alto inclinado y copa plana. Plátano: copa amplia.
- `buildCrops` se llama junto a `buildCountryside` en Atenas (INNER) y en Roma.
  - En las parcelas de tipo 1 (cereal) y 2 (hortalizas/legumbres) se colocan matas de tres planos cruzados con textura de tallos (`cropTex`, alphaTest). Los planos van duplicados con la normal hacia arriba en lugar de `DoubleSide`, para evitar caras negras. El shader las mece con el viento (uniforme `CROP.t`).
  - En las de tipo 3 hay surcos (caballones triangulares).
  - `cropSeason`: en primavera y verano se ven las matas altas, verdes o doradas; en otoño y en invierno, las bajas (rastrojo o brotes). Se alternan con `far` de sus entradas en CHUNKS (−1 las oculta).
- `buildVida`:
  - hasta 10 yuntas de bueyes con arado y arador, que recorren los surcos;
  - 16 campesinos trabajando en los cultivos;
  - 12 rebaños de 6 a 11 ovejas (`A_sheep`) con pastor, que pastan y se mueven con las patas animadas.
- `buildBirds`: cuatro bandadas de siete pájaros que vuelan en círculo cerca del jugador y lo siguen. Todo se anima en `vidaTick`, solo cerca del jugador.
- En el renderizado por software de las pruebas, la versión nueva es entre un 15 % y un 18 % más lenta. Los cultivos solo se dibujan a menos de 320 m.

### Novedades de la versión 54: barco propio y viaje a la Luna
- `buildPort` guarda la geometría de cada muelle en `PIERS[key]`. En el muelle principal (`PIERS.atenas`, que también existe en Roma) están:
  - el carpintero de ribera: Fanodemo en Atenas, Gayo Fabio Velox en Roma, ambos inventados;
  - un amarre con poste («Tu barco»);
  - un barco que solo es visible cuando es tuyo.
- Estado en `state.barco`. `st`: 0 nada; 1 adelanto de 150 pagado; 2 materiales entregados, a la espera de 3 días; 3 barco propio con nombre (`name`).
- Materiales (`BARCO.mats`, 20 monedas cada uno):
  - Atenas: madera de Pela, bronce de Calcis y velas del diolkos de Corinto.
  - Roma: madera de Genua, pez del estrecho de Regium y lino de Tarraco.
- Con barco propio, `fareOf` devuelve 0 en los viajes por mar.
- Desde el amarre, «Navegar más allá de las Columnas de Hércules» abre `moonVoyage`: cuatro pantallas narradas y llegada a la Luna (`buildMoon`, mapa perezoso en X=ISLANDS[0].x, Z=+15000, Y=3200).
  - En la Luna: cúpula oscura con estrellas, la Tierra en el cielo, cráteres, el palacio de cristal de Endimión, el espejo del pozo, tres hipogipos y selenitas.
  - Personajes: Luciano (con nota de anacronismo), Endimión (la guerra con Faetón) y un selenita (costumbres).
  - Volver: una pantalla narrada (la ballena) y llegada al muelle.
  - La primera visita da +5 kl y +3 so (`state.luna`).
- `regionName`/`checkZone` reconocen la Luna antes que la casa (Y 3200 > 2400). En el modo `tour`, Intro pulsa el botón `.nx` de `#tourSea`, que también usa la Luna.
- Panel del profesorado: destinos «La Luna de Luciano» y el carpintero, y atajo «Barco propio».

### Novedades de la versión 53: rutas de la Odisea y de la Eneida
- `TOUR_A`: Cleónimo, rapsoda homérida inventado, junto a la escuela de letras. `TOUR_R`: Sexto Cornelio, gramático inventado, junto a la escuela del gramático. La primera vez la ruta cuesta 30 monedas y da +4 so y +1 kl. Repetirla es gratis. Se guarda en `state.tours`.
- Paradas con `at` (`stAnchor`): el jugador y el guía se colocan en el punto más llano alrededor (`tourNext`) y se abre un diálogo. Paradas sin `at`: pantalla de mar narrada (`#tourSea`, ui `tour`; Intro o Espacio para seguir).
  - Odisea: Troya, cinco tramos de mar, Delos (la palmera de Nausícaa), Ítaca, Creta (las mentiras cretenses) y Esparta (el Menelaion).
  - Eneida: Troya, el Egeo, el estrecho de Regium, la tempestad, la Byrsa de Cartago, Cumas (tumba de Virgilio), el Lacio y el Lupercal.
- Al terminar o abandonar la ruta, se vuelve al punto de partida. «Quedarme aquí» deja al jugador en la parada.
- Fallo conocido en Cartago: en el borde de la zona allanada de la ciudad (`I.town`), el relieve visible no coincide con `floorAt`. La parada de Dido se ha llevado al foro de la Byrsa, que es llano.

### Novedades de la versión 52: nombre y sexo del personaje
- Al empezar una partida sin `state.pj`, `pjDlg` pide el nombre y si eres hombre o mujer, y lo guarda en `state.pj={name,g:'m'|'f'}`. El tutorial empieza después. El panel del profesorado tiene un atajo «Cambiar de personaje».
- El avatar se adapta: con `pjFem()`, `playerLook` da una figura femenina y el jinete pasa a llevar `P_hair_f` (`pjAvatar`).
- Primer encuentro con un personaje: «Te presentas: “Me llamo …”». Si eres mujer en Atenas, a veces te miran con curiosidad. En los encuentros siguientes, `pjGreet` saluda con tu nombre.
- Un `MutationObserver` sobre `#dBody` y `#dOpts` (`pjWalk`/`pjText`) adapta los textos:
  - los vocativos («, forastero.», «¡amigo!»…) pasan a femenino o, si ese personaje ya te conoce (`dlg.known`), se sustituyen por tu nombre;
  - pasan a femenino concordancias como «Bienvenido», «Eres meteco» o «Ya eres un iniciado».
  - Es una adaptación por patrones: algún texto puede escaparse.

### Novedades de la versión 51: Haloa, Misterios de Dioniso y panel del profesorado
- `FESTS_ATENAS` tiene dos fiestas nuevas:
  - **Haloa**, en el Eleusinion, con la sacerdotisa Timarete: banquete de mujeres, Yambe e Icario, y la prohibición del sacrificio de sangre según [Dem.] 59.116.
  - **Misterios de Dioniso**, una iniciación báquica privada de noche en el Cerámico, con Fanóstrata: el likno, «escapé del mal…», las laminillas de oro y Platón, *Fedón* 69c.
- Saturnales y Lupercales ya existían en `FESTS_ROMA`.
- **Panel del profesorado** (`profeOpen`): se abre con la tecla º (Backquote) y la clave «mentor», sin distinguir mayúsculas. La clave queda guardada en localStorage (`nostos-profe`) y figura en la Guía, en «Para el profesorado».
  - Buscador sin tildes de regiones (PORTS), lugares, personas, Musas, Mnemósine, el sendero, el Olimpo, el interior de la casa, Formión/Afranio y los carreteros. Intro o clic para ir (`profeGo`).
  - Atajos: amanecer, mediodía, noche, estación siguiente, próxima fiesta, +500 monedas, caballo, alas, llave del Olimpo y casa.

### Novedades de la versión 50: casa propia
- Un forastero no podía tener casa:
  - **Atenas.** Formión, el esclavo de confianza de Pasión, está junto a su mesa. Explica que un meteco necesita la énktesis, que se concede por decreto de la Asamblea. Requisitos: un amigo con «Confianza» (40 puntos o más) que proponga el decreto y una donación (epídosis) de 150 óbolos para las murallas. Hay que esperar 2 días.
  - **Roma.** Sexto Afranio, argentario inventado, cerca del Foro. Hace falta la ciudadanía, que concede el emperador a petición de un patrono. Se pagan 150 sestercios a los escribas y se esperan 3 días. Al obtenerla, el jugador toma el nombre de familia de Flavio.
  - En ambos casos, la casa cuesta 400 monedas. El estado se guarda en `state.casa` (`st`: 0 sin trámite, 1 en espera, 2 con permiso, 3 propietario).
- La puerta está junto al agente (`CASA.door`). El interior (`buildCasaInterior`) está en el cielo, en X=ISLANDS[0].x, Z=+9000, Y=2400, rodeado de un barrio de bloques. Al llegar a esa altura, `regionName`/`checkZone` muestran «Tu casa».
  - Atenas: patio con altar de Zeus Herkeios, hogar, dormitorio, almacén, telar, recuerdos y andrón.
  - Roma: atrio con impluvio y larario, cocina, cubículo, despensa, escritorio, recuerdos y triclinio.
- Acciones (`hogarAct`):
  - dormir hasta el alba;
  - ofrenda diaria (+1 eu);
  - comer, con un texto sobre la dieta;
  - banquete por 20 monedas (+2 kl, +1 lo y +3 de afinidad con el mejor amigo);
  - recuerdos, con el resumen de la partida.

### Novedades de la versión 49: estaciones, las Horas y título según la región
- Calendario (`calNow`): cada 5 días de juego pasa un mes y cada 15 cambia la estación. La partida empieza en abril (Muniquión en Atenas, Aprilis en Roma). El año avanza en enero: 386→385 a.C. en Atenas y 80→81 d.C. en Roma. El calendario del diario muestra el mes y la estación.
- `applySeason` tiñe el follaje, las viñas y el terreno (`TERR_MATS`). El efecto es suave, porque olivos y cipreses son de hoja perenne. En verano el campo amarillea y en invierno reverdece con las lluvias.
- La primera vez que cambia la estación aparece Filis (Atenas, vendedora de coronas) o Aulo (Roma, pintor de frescos) y explica las Horas: Hesíodo, Ilíada V, Talo y Carpo, Ovidio, Horacio IV 7. Al escuchar todos los temas se gana +3 en eu y +2 en so. Estado en `state.horas`.
- El título de arriba a la izquierda (`hudTitleTick`) muestra la región actual (`islandOf`, o El Olimpo), la estación y el año. En modo Historia se añade « · Historia» (`storyHud`).

### Novedades de la versión 48: las Musas, Mnemósine y el Olimpo; la estatua de Mégara
- Zeus y Júpiter ya no aparecen entre los dioses del mundo (`buildGods` los quita de `GODS`).
- Nueve Musas por modo (`MUSAS_ATENAS`, `MUSAS_ROMA`), cada una en el lugar que mejor le encaja. Su examen (`museExam`) exige haber recibido al menos dos lecciones de su lista `pre`, se puede intentar una vez al día, tiene cuatro preguntas y se aprueba con tres. Al aprobar, se obtiene el don (`state.musas.dons`) y +5 en la cualidad de la Musa.
- Con los nueve dones, Mnemósine (fuente Dirce en Tebas; Porta Capena en Roma) entrega la llave (`state.olyKey`). La puerta del Olimpo (llanura de Larisa; templo de Júpiter Capitolino) sube al palacio flotante (`buildOlympus`, Y=1600). Allí Zeus o Júpiter conversa y da su bendición (+6 en todas las cualidades y 20 monedas). Al volver se usa el cartel del fondo.
- `checkZone` muestra «El Olimpo» cuando el jugador está en el palacio.
- Mégara: dentro del Olimpieion está la estatua inacabada de Teocosmo, con el rostro de oro y marfil y el cuerpo de arcilla y yeso. Detrás del templo hay troncos a medio desbastar (Pausanias I 40.4).

### Novedades de la versión 47: nombre del caballo y carreteros
- **Nombre del caballo** (`hz().name`, `horseName`, `horseNameDlg`):
  - Se le pone nombre al recibirlo, y después se puede cambiar hablando con el criador o con el auriga.
  - El nombre aparece en los mensajes y en la barra mientras se cabalga. Por defecto se llama Céfiro en Atenas y Rayo en Roma.
- **Carreteros** (`CARTERS`, `buildCarters`, `carterTalk`, `cartRide`):
  - Hay uno por cada salida de cada mapa (45 en Grecia y 40 en Roma). En los destinos esperan al inicio del camino de la puerta; en Atenas y Roma, a un 30 % del trayecto entre el centro y la puerta.
  - Por 1 óbolo o 2–3 sestercios por kilómetro te llevan junto a la puerta hacia el mapa vecino. El viaje cuesta una hora de juego.
  - No se ponen si la puerta ya está a menos de 120 m.

### Novedades de la versión 46: conversaciones por la calle
- **Conversaciones** (`CONVS_ATENAS` con 18 y `CONVS_ROMA` con 14; `buildConvs`, `convTick`): grupos de dos o tres personas charlan cerca del lugar que corresponde a su tema (mercado, Pnyx, teatro, puertos, termas, Foro…).
- Al acercarse a menos de 8 m, la conversación aparece abajo, frase a frase y con el nombre de quien habla (`#conv`). El jugador no puede intervenir.
- Un bocadillo «…» sobre el grupo indica desde lejos que están hablando, y quien habla mueve el brazo.
- Escuchar una conversación entera la primera vez da +1 de sabiduría (`state.convs`).

### Novedades de la versión 45: dos admiradores cómicos
- **Platonákis** (Atenas, `FAN_PLATON`, en la Academia junto a Platón) y **Marcelo Aurelio** (Roma, `FAN_MARCO`, panadero estoico junto a Epicteto) son personajes inventados que hacen de alivio cómico.
- Tienen lección, pregunta y fuentes. El anacronismo de Marcelo es el chiste: Marco Aurelio aún no ha nacido en el 80 y él dice verlo en sueños.
- `fanLine()` añade una frase especial al saludo si el jugador es discípulo de Platón, Epicteto, Musonio o Dion; `openDialog` la muestra bajo la presentación.

### Novedades de la versión 44: las mujeres griegas
- **Fuente:** *Desperta Ferro Arqueología e Historia* n.º 11, *La mujer en Grecia* (2017), aportado por el usuario. Todo está redactado de nuevo y la revista se cita como referencia moderna.
- **Ensayo nuevo en la biblioteca** (`mujeres2`, «Mujeres griegas: leyes, ritos y Esparta»): ciudadanía (`politides`), boda y dote, las formas de divorcio, la epiclera frente a Esparta y Gortina, las espartanas, las sacerdotisas (Lisímaca, la llave, la *ololygé*), el luto y sus leyes, y heteras y *pornai*. Completa el ensayo `mujeres` sin repetirlo.
- **Temas nuevos de conversación** (en «Cuéntame más», objeto `MORE`):
  - Teano: la duración del sacerdocio y el sacrificio.
  - Mirrina: la edad de casarse y el divorcio.
  - Nicareta: cómo se acuerda una boda y los regalos de boda.
  - Glicera: qué aprenden las niñas.
  - Cinisca: Gorgo y la herencia de las espartanas.
- **Curiosidades nuevas:**
  - En estelas: Lisímaca, la sacerdotisa Crisis de Argos, las leyes contra el llanto, las carreras en honor de Helena y la dedicación de Nicandra de Naxos.
  - Al amanecer: las leyes de Gortina, el epínetro y el *sakkós*.

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
