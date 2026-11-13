# Nóstos — Atenas 386 a.C. y Roma 80 d.C. — documento de traspaso

Juego 3D en primera persona para el navegador, en español. Al empezar se elige la época: **Atenas en la primavera del 386 a.C.** o **Roma en el año 80 d.C.** Sirve para aprender política, filosofía, sociedad y mitos.

- **Archivo jugable:** `atenas.html` (unos 5,8 MB; `?modo=roma` o `?modo=atenas` en la dirección se salta el selector): HTML + CSS + JS y los modelos de Blender incrustados en base64.
- **Código fuente:** `fuente/atenas.src.html`, el mismo archivo con el marcador `@@GLB@@` en lugar de los modelos. **Se edita siempre el fuente** y luego se ejecuta `python fuente/construir.py`, que genera `atenas.html` incrustando `modelos/atenas_modelos.glb`.
- **Modelos:** `modelos/atenas_modelos.blend` (escena de Blender con todas las piezas) y `modelos/atenas_modelos.glb` (lo que carga el juego).
- **Publicado como artefacto:** https://claude.ai/artifact/HPMmRcZdwLro9kjKtCX2U9 (versión 117 del artefacto; notas de la versión 117). Para actualizarlo desde otra sesión, hay que leerlo primero con la acción `read` del artefacto y luego publicar pasando esa misma URL como `url`. Así se conserva el enlace.
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

- **Granja: plagas y malas cosechas** (pendiente por decisión de la usuaria). La idea: la roya (robigo) en el cereal, la langosta, la sequía, el granizo y los pájaros que se comen la simiente, con remedios de la época: las Robigalia, el espantapájaros de Príapo, los consejos de Catón y Columela, y la Ambarvalia como protección. Se colgaría de `farmDay` (un suceso al azar según el mes) y del estado de cada parcela.

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

### Novedades de la versión 117: ciudades de Hispania reconstruidas y rayas de la iluminación realzada
- **Rayas en ventanas y molduras** con la iluminación realzada: el render target del EffectComposer tenía profundidad de 16 bits (z-fighting). Ahora usa `stencilBuffer:true` (profundidad de 24 bits) y multimuestreo con WebGL2 (`gfxBuild`).
- **Piezas nuevas** (módulo «HISPANIA URBANA», antes de `romaArrive`): `archGeo` (enjuta de arco extruida), `arcadeLine` (acueducto entre dos puntos, varios pisos, hiladas de ladrillo opcionales), `stoneBridge` (puente largo con arcos, pretiles, rampas y plataforma) y `circusH` (circo de provincias con espina, metas y cárceres; se entra a la arena por los cárceres).
- **Tarraco:** el foro provincial ya no está «en obras»: lo terminaron los Flavios. Tiene un recinto porticado del templo, una plaza del concilio con pórticos y los pedestales de los flamines. Se añade el acueducto de les Ferreres (dos pisos, acercado a la ciudad, con nota). En una estela se explica que el circo (Domiciano) y el anfiteatro (siglo II) aún no existen en el 80.
- **Emerita:** el Anas tiene dos brazos y una isla; el puente es de 170 m con unos 20 arcos, acortado (con nota). Se añaden el circo (más de 400 m en la realidad), el acueducto de Los Milagros (granito y ladrillo, tres pisos, fecha discutida) sobre el Albarregas y el «templo de Diana», rebautizado como templo del culto imperial, con nota sobre el pórtico de mármol del foro.
- **Carthago Nova:** cinco colinas (Polibio X), con el teatro excavado en la ladera (gradas hacia la colina), y el foro con su Capitolio.
- **Corduba:** el puente del Betis (Vía Augusta), el teatro augusteo, el foro de la colonia y el gran templo del culto imperial (fecha discutida, Claudio o los Flavios).
- **Gades:** el teatro de Balbo y la Neápolis, que Estrabón llama Dídime, y el Herakleion de Melqart, sin estatua, con el fuego perpetuo y las dos columnas de bronce. Una nota aclara que el templo real estaba en Sancti Petri.
- **Barra de objetos** (módulo «LA BARRA DE OBJETOS», objeto `HBAR`, estado `state.hb`). Ojo: `HB` ya lo usa la animación del caballo.
  - Nueve casillas abajo (en móvil, arriba). Se eligen con la rueda o las teclas 1-9 y se usan con R o con el clic derecho; en el móvil, tocando la casilla elegida.
  - Casillas: antorcha, tablilla de cera, bolsa, odre, estrígilo, caballo, alas, itinerario o periplo, y amuleto (en Roma, las figurillas de los Lares; en Atenas, la ramita de espino o la laminilla órfica).
  - Cómo se consiguen (`hbGive`, `hbTick`): la tablilla, en la primera lección (`startQuiz` envuelta); en cada pregunta, los apuntes tachan una respuesta falsa si la Sophía es menor que 4. El odre y el rollo, en el primer destino (el rollo solo si se llega por mar). El estrígilo, en las termas o la palestra.
- **Espíritus** (módulo «LOS ESPÍRITUS», `state.sp`).
  - Presencias pálidas (`spTick`): en Roma, de noche en Maius si no se ha hecho el rito de las Lemurias (`cultz().lem`); en Atenas, en Antesterión si no se ha hecho el rito contra las Keres. Casi no se ven sin antorcha. Si te tocan, −1 Eusébeia o Pietas.
  - `spMenu` (amuleto): en Roma, el Genio o la Juno el día del cumpleaños (`sp.bd`, de 1 a 60) y los Manes en Februarius. En Atenas, el Agathós Daímon a diario, la cena de Hécate en luna nueva (primer día del mes) y el rito de las Keres (`spKeres`).
  - Objetos en el mapa (`spSetup`, prefijo `sp:`): tres altares de los Lares de las encrucijadas en Roma (Compitalia en Ianuarius) y un hekataion de Hécate junto al ágora.
- **Mejoras visuales 2** (módulo «MEJORAS VISUALES 2», objetos `VIS` y `DOF`):
  - **Luna con fases:** uniforme `mph` en el shader del cielo; `visMoonPhase` vale `cultDia().i*0.125` (Kalendas: luna nueva; Idus: luna llena).
  - **Niebla según la hora:** `updateSky` envuelta; ajusta near y far (bruma al alba, polvo dorado al atardecer, noche cerrada). No actúa si `CAV.ovr` o `FZ.ovr`.
  - **Ventanas encendidas de noche:** un InstancedMesh sobre las fachadas de los `footprints` con `house`.
  - **Incienso:** `pfx` en los lararios (`CULT_OBJS`), los compita y el hekataion.
  - **Desenfoque en el modo foto:** BokehPass; botones «Desenfoque» y «Enfocar» (`dofFocus` lanza un rayo al centro de la pantalla). `gfxRender` le da prioridad mientras está activo.
  - **Sombras de contacto:** SSAOPass dentro de la iluminación realzada; opción `ao` del menú (localStorage `nostos-ao`).
- **El tiempo** (módulo «EL TIEMPO», `WX_T`, `WXS`, `state.wx`):
  - **Tipos y cambio:** sol, nubes, niebla (solo por la mañana), viento, lluvia, tormenta, calor y nieve. Se eligen con pesos según el mes (`wxPick`) y duran unas horas de juego.
  - **Menú:** la opción «Tiempo» (`wxCycle`) lo fija o lo devuelve a automático (`state.wx.man`).
  - **Aspecto:** `updateSky` envuelta (cielo gris, menos sol, niebla más cerrada). Las partículas de lluvia (LineSegments) y de nieve (Points) siguen a la cámara. Hay sonido de lluvia y truenos sintetizados, relámpagos y arco iris al escampar. El HUD añade el tiempo a la hora.
  - **Juego:**
    - La lluvia apaga la antorcha y no deja encenderla (envoltura de `toggleTorch`).
    - El barro y la nieve frenan (`wxSpeed` en la línea de velocidad).
    - Tras unas 3 horas de juego al sol con calor, cansancio que se quita bebiendo del odre.
    - Con tormenta no se zarpa (envoltura de `sail`), y en invierno el pasaje cuesta la mitad más (envoltura de `fareOf`; mare clausum).
    - Con tormenta se disuelve la Asamblea (`pg:asamblea`).
    - Granja: `farmRain` es cierto si llueve y falso si hay sequía.
  - **Sequía:** 6 días sin lluvia; contador en `newDay`. El rito para pedir lluvia aparece en el amuleto (`wxRite`): Zeus Ombrios en el Himeto (Pausanias I 32, 2) o el aquaelicium (Festo; Petronio 44).
- **Para qué sirven los objetos** (módulo «PARA QUÉ SIRVEN LOS OBJETOS», `uxz`, `uxTick`):
  - **Antorcha:** se gasta. Cada una dura unas 3 horas de juego (`hb.burn`); empiezas con 3 de repuesto (`hb.antor`); se compran 2 por 1 moneda con la bolsa.
  - **Ladrones de noche:** sin antorcha, en la ciudad, un 30 % por hora de juego, un robo por noche. Una ofrenda hecha ese día protege (`uxProt`). Fuentes: Juvenal III; Aristófanes, Las aves 493-498.
  - **Bolsa** (`hbBolsa` reescrita): limosna (+1 de piedad, una al día), antorchas, posca o vino aguado para el odre, y un guía (2 monedas) que te lleva a `nextTarget()`.
  - **Odre:** su contenido está en `hb.odreC`. El vino o la posca quitan el freno de la nieve durante 2 horas (`WXS.warm`). En los viajes por tierra de 2 o más días (envolturas de `sail` con `land` y de `gateTravel`) se bebe un trago; sin agua llegas agotado.
  - **Estrígilo:** si lo usaste ayer u hoy, cada lección nueva da +1 moneda (envoltura de `answer`); si llevas 4 días sin usarlo, aviso de que hueles a sudor.
  - **Tablilla:** notas propias (`hb.notas`, con un textarea que corta la propagación de las teclas) y el álbum de las inscripciones leídas (`state.places`).
  - **Periplo o itinerario:** `hbRollo` muestra las rutas, los días, los precios y los peligros (el Malea según Estrabón VIII 6, 20; los piratas; el mar cerrado). Con él, los pasajes cuestan un 10 % menos (envoltura de `fareOf`).
  - **Amuleto:** ofrenda en una herma (Atenas) o a los Lares Viales (Roma); protege ese día.
  - **Alas:** visibles en la espalda en tercera persona (`uxWingMesh`, hijo de `AVATAR.walk`; aletean). El derretimiento por subir demasiado (`FLY.melt`) ya existía.
- **Tejados** (módulo «TEJADOS Y CORNISAS», `RF`):
  - `rfSetup` (1,5 s después de las otras preparaciones) hace una rejilla de 16 m con las cajas de todas las mallas opacas. Quedan fuera: personas, avatar, caballo, mallas transparentes o Basic, y las de más de 300 m, como el terreno.
  - `rfFloor` sustituye a `floorAt` en la gravedad: si estás 0,9 m o más por encima del suelo normal, un rayo hacia abajo encuentra la superficie.
  - `tryMove` pasa a `rfMove` si `RF.onRoof` o si estás 2,6 m o más por encima: no usa las paredes 2D, pero sí un rayo horizontal (`rfWall`). `flyMove` también usa `rfWall`, así que ya no se atraviesan edificios volando.
- **Ayuda** (módulo «AYUDA SIN LLEVAR DE LA MANO», `MTR`; ojo, `MT` ya existía; estado en `state.mt`):
  - **Pedagogo con G** (en el modo Historia, G sigue siendo «llévame») o con el botón «?» en el móvil. Es Zópiro en Atenas (Platón, Alcibíades I 122b) y Antíoco en Roma.
  - **Pistas en tres niveles por objetivo** (`asks`): la idea, la dirección y distancia, y una columna de luz dorada (`mtBeacon`).
  - **Objetivo** (`mtGoal`): el paso de «Primeros pasos» pendiente; si ya están todos, la persona más cercana del camino elegido.
  - **Tres caminos** (`MT_PATHS`): se preguntan a los 25 s de juego libre.
  - **Ofrecimiento si estás perdido:** sin progreso (`mtSig`) durante 90 s (ayuda «mucha») o 180 s («poca»), y habiendo caminado al menos 80 m. Si dices que no, 10 minutos de silencio.
  - **Tras dos fallos en la misma pregunta**, otra explicación (envoltura de `answer`).
  - **Tablón de anuncios** (`mt:board`) junto a los Rostra o en el ágora: encargos fácil, medio y difícil.
  - **Menú:** opción «Ayuda» con los valores mucha, poca o solo si la pido.
- **Trepar** (módulo «TREPAR», `CLB`): en `tryMove`, una pendiente por encima del límite (1,15, o 2,2 con Areté 8 o más) ya no bloquea; frena hasta un 20 % (`clbSlow`). Con el caballo sí bloquea. Polvo y piedrecitas con `pfx`; el avatar se inclina (`rotation.x`); en las bajadas de más de 1,4 de pendiente se resbala mientras te mueves. Cada 30 m de desnivel, +1 de Areté (máximo 3 al día, `state.clb`).
- **Mapas naturales** (módulo «LA NATURALEZA ENTRE LAS CIUDADES»):
  - **Destinos:** cinco nuevos en `GREECE_DESTS` (citeron, nemea, liceo, tempe, parnaso) y cuatro en `ROMA_DESTS` (nemi, soracte, clitumno, sila). Coordenadas en `MED_POS` y `MED_POS_RO`, entradas en `SIMPLE_GR` y `SIMPLE_RO` con `extra` (bosque `NAT_FOREST`, cuevas, fuentes `natSpring`, altar de ceniza, hornos de pez, ríos, cañas).
  - **Caminos:** los `WORLD_LINKS` se parten para intercalar los nuevos mapas, y `homeGate` tiene citeron, soracte y nemi.
  - **Animales salvajes** hechos con primitivas (`WILD` y `wildBuild`, con envoltura de `animal`): ciervo, jabalí, lobo, oso, liebre y buey blanco. Sus textos están en `FAUNA_INFO`.
  - **Ninfas y divinidades** (`NAT_NY`, creadas en `natSetup`, prefijo `nat:`): Esfragítide, Nemea, Siringe, Dafne, Coricia, Egeria, Feronia, la náyade del Clitumno y Silvano. La primera ofrenda da +1 Sophía y +1 Eusébeia.
- **Segunda tanda de mapas de transición:**
  - **Grecia:** pentelico (Atenas–Maratón), eta (Delfos–Termópilas), achelous (Dodona–Calidón), taigeto (Esparta–Itome) y escironides (Megara–Corinto).
  - **Italia:** ciminia (Roma–Etruria), caudium (Samnium–Campania), lunae (Etruria–Liguria), padus (Emilia–Venetia) y rubico (Umbría–Emilia).
  - **Ojo con los nombres:** los identificadores achelous, padus y rubico evitan chocar con los lugares `aqueloo`, `eridano` y `rubicon`, que ya existían.
  - **Piezas nuevas:** `natBlocks` (cantera), `natHives`, `natPyre` y `natPoplars`.
- **El camino en los mapas de transición** (`NAT_ROAD`, que envuelve los `extra`, y `NAT_TRAV`):
  - **En Grecia:** herma de Hiparco en el Pentélico y el Citerón; montones de Hermes; fortín de Énoe en el Citerón (Tucídides II 18-19); posadas (pandokeîon) en Nemea, el Tempe y el Aqueloo (Aristófanes, Las ranas 549-578).
  - **En Italia:** miliarios en todos los mapas; tumbas junto a la Vía Apia en Nemi y Caudio; posadas de Aricia y Caudio según Horacio (Sátiras I 5); la Vía Flaminia y el túnel del Furlo (76-77 d.C.) en el Soracte.
  - **Viajeros:** uno por mapa (`artPerson`, acción `nat:tr_<id>`), con frases basadas en las fuentes.
- **Mitos en su sitio** (al final del módulo de naturaleza):
  - **Fragmentos de Ovidio trasladados** a los mapas de transición: Acteón y Penteo al Citerón; Licaón y Calisto al Liceo; Dafne al Tempe; el diluvio al Parnaso; Hércules al Eta; Aqueloo a su río; Ino a las rocas Escironias; las Helíades al delta del Po; Egeria e Hipólito a Nemi. La Puerta Capena y Epidauro dejan de tener esos fragmentos.
  - **Seis esferas de sueño nuevas** (`NAT_EPIS`, con `push` a `EPISODES`): el león de Nemea, la pira del Eta, Pan y Siringe, Teseo y Escirón, Numa y Egeria, y César en el Rubicón.
  - **Animal nuevo:** `WILD.lion`, con melena (envoltura de `wildBuild`).
  - **Apariciones** (`natAppTick`): ménades en el Citerón en invierno de noche, Pan en el Liceo al atardecer y Ártemis con dos ciervos en el Taigeto de noche. Cada una tiene su ficha de fuentes, que se ve una sola vez (`state.nat.ap_*`).
- **Los doce trabajos de Heracles** (`HER_EPIS`, basados en Apolodoro II 5):
  - **Mapas de transición nuevos:** lerna (Argos–Mantinea), erimanto (Egio–Olimpia), estinfalo (camino nuevo Corinto–Mantinea) y tenaro (fondo de saco desde Esparta). Cada uno con su ninfa o figura (Amimone, el centauro Folo, Ártemis Estinfalia, una sombra en la cueva), fauna y viajero.
  - **Esferas, modo Atenas:** el león en Nemea; la Hidra en Lerna; la cierva en Egio; el jabalí en el Erimanto; Augías en Olimpia; las aves en el Estínfalo; el toro en Creta; las yeguas en Pela (Tracia no tiene mapa); Hipólita en Éfeso; Cerbero en el Ténaro.
  - **Esferas, modo Roma:** Gerión en Gades y las Hespérides en Cartago.
- **La guerra en el horizonte** (`WAR_A`, `WAR_R`, `warSetup`, prefijo `war:`; la primera conversación da +1 Sophía):
  - **Atenas:** tabla con la Paz del Rey (paráfrasis de Jenofonte, Helénicas V 1, 31); un veterano del Lequeo y de los Muros Largos; un peltasta tracio de Ifícrates; una refugiada de Regio (Diodoro XIV 106-112); un marino chipriota con lo de Evágoras.
  - **Roma:** la madre de un legionario de Agrícola en Britania (Tácito, Agrícola 22); un veterano de la X Fretensis junto al Templo de la Paz (Josefo); un mercader de Britania en el Emporio (Juvenal IV 141; Estrabón IV 5, 2; Tácito, Agrícola 21); el rumor del falso Nerón (Dión Casio LXVI 19, 3).
- **Pettéia y latrunculi** (módulo «PETTÉIA Y LUDUS LATRUNCULORUM», `TT`, `TT_SC`, `ui='board'`):
  - **Reglas:** reconstruidas. Movimiento de torre y captura por custodia. IA codiciosa (capturas, riesgo, amenaza).
  - **Escenarios del modo Atenas:** partida libre, Maratón, Termópilas (aguantar; Efialtes en el turno 12), Salamina y el Lequeo (hoplitas lentos).
  - **Escenarios del modo Roma:** partida libre, Cannas, Pidna (terreno quebrado) y Alesia (aguantar).
  - **Maestros:** Arquelao (inventado) en el ágora; Frontino (licencia del juego) junto a la Basílica Julia, donde había tableros grabados en las escaleras.
  - **Recompensa:** la primera victoria de cada escenario da +1 Lógos y +1 Sophía (`state.tt.w`).
- **Veinte batallas por modo** (generadas con un script de Python a `TT_SC` y `TT_LIST`; solo batallas anteriores al año de cada modo):
  - **Atenas:** Maratón, Termópilas, Salamina, el Lequeo, Hímera, Platea, Mícala, Eurimedonte, Pilos, Delio, Anfípolis, Mantinea (418), el Gran Puerto de Siracusa, Cícico, Arginusas, Egospótamos, Cunaxa, Nemea (394), Coronea y Cnido.
  - **Roma:** Cannas, Pidna, Alesia, el lago Regilo, las Horcas Caudinas, Heraclea, Milas, las Égates, Trasimeno, el Metauro, Zama, Cinoscéfalas, Aquae Sextiae, Carras, Farsalia, Accio, Teutoburgo, Boudica, Bedriaco y Jerusalén.
  - **Campos nuevos de cada escenario:** `h` (qué pasó de verdad) y `ev.side` (refuerzos propios, como en Cícico y Aquae Sextiae).
- **Los caminos, más vivos** (módulo «LOS CAMINOS, MÁS VIVOS», `RD`, prefijo `rd:`; se aplica a los mapas de `RD_MAPS` usando las rutas de `GATES_W` con `from` igual al mapa):
  - **Firme:** calzada romana con bordillos, o rodadas griegas (`rdStrip`, que sigue el terreno).
  - **Tráfico** en ida y vuelta por cada ruta: carro de bueyes y recua en los dos modos; en Roma, además, correo a caballo, litera y soldados; en Grecia, peregrinos y rebaño.
  - **Paradas y control:** abrevadero (rellena el odre y entra en `PLACES` como `fuente_<id>`); tumbas con epitafio (Frasiclea y Creso; Claudia y NFFNSNC); mutatio en seis mapas romanos; aduana (portorium) en Luna y el delta del Po; peripolo de frontera en el Citerón y el Pentélico.
  - **Campo:** un campo con dos campesinos que cambia de color según el mes (arar, verde, siega, rastrojo).
  - **Peligros:** bandoleros (15 % cada 2 horas de juego, uno al día, se evitan a caballo o con protección) y perros pastores junto a los rebaños.
  - **Sonido:** cigarras de junio a septiembre, de día; ranas junto al agua por la noche.
  - **Extras:** el trofeo de Maratón y un viajero de Gades con un vaso de Vicarello.
- **La ciudad, más viva** (módulo «LA CIUDAD, MÁS VIVA», `CY`, prefijo `cy:`):
  - **Minijuego de destreza** (`cyMini`, aguja y zona buena), con pago una vez al día. Oficios: el alfarero (figuras rojas) y el herrero en Atenas; el panadero (Eurísaces y el pan sellado) y la fullonica (Vespasiano y «pecunia non olet») en Roma.
  - **Atenas:** klērōtḗrion (Aristóteles, Constitución de los atenienses 63-66), cambista y la fuente de las Nueve Bocas (rellena el odre).
  - **Roma:** centúnviros (Plinio VI 33), Res Gestae junto al Mausoleo, grafitis de Pompeya en paráfrasis (CIL IV 1904, 8408, 429 y 1842), escuela al aire libre (Marcial IX 68), forica (Marcial XI 77; Séneca, Cartas 70, 20), castellum aquae, argentarius y apuestas en el Circo (Plinio IX 6).
  - **Roma de noche:** carros por las vías de `ROADS` (Juvenal III 236-238) y una patrulla de vigiles.
  - **Ambiente:** rumor de ciudad en los dos modos.
- **Zurrón y objetos del viaje** (módulo «EL ZURRÓN Y LOS OBJETOS DEL VIAJE»):
  - **Barra configurable:** `state.hb.bar` (9 claves; `hbSlots` sustituye a `HB_ITEMS` en la barra). El zurrón se abre con I o desde el menú (`objZurron`).
  - **Contexto** (`objContext` y `OBJ.ctx`): la casilla útil brilla en verde (odre junto al agua, antorcha de noche, tablilla junto a una estela sin leer, estrígilo en la palestra, amuleto junto a un altar, exvoto en un Asclepieo, siringa junto a un rebaño). Si el objeto está en el zurrón, aparece una pista.
  - **Objetos nuevos:** pétaso (el calor cansa la mitad), capa (la lluvia frena menos), cayado (trepar más deprisa), siringa (calma perros; de noche, ninfas), aceite (necesario para el estrígilo; contador en `hb.cnt`), tésera (viajes un 20 % más baratos), óbolo (Caronte, `hd:caronte`), rama dorada (`fi:rama`), tortas de miel (Cerbero), pinákion (jurado con pago en el klērōtḗrion), diploma (viajes por tierra gratis en Roma), anillo de sello, exvoto (Epidauro o isla Tiberina), lira y honda.
  - **Cómo se consiguen:** comprando con la bolsa, de los pastores de los caminos, de los viajeros (la tésera), de Siringe, de la sombra del Ténaro, o automáticamente por ciudadanía o Fama.
  - **Encargo:** dar agua del odre a los viajeros (+1 Eusébeia, +1 Kléos).
- **El campo** (módulo «EL CAMPO», `RCX`; ojo, `RC` ya existía; estado en `state.rc`):
  - **Caza:** botón en `faunaTalk` para liebre, ciervo y jabalí en los mapas de transición. Minijuego `cyMini`; vender da 2, 4 o 6 monedas.
  - **Pesca:** pescador en los mapas con agua (`RC_FISH`).
  - **Recolección por estaciones y herbario:** `RC_HERB`; la miel da una torta.
  - **Fiestas rurales en su mes** (`RC_FEST`): Dionisias rurales y la trilla en Atenas; Parilias, Terminalia y Vinalia en Roma.
  - **Piezas en cada mapa:** árbol sagrado con cintas, o mojón de Término en algunos mapas romanos; carboneros; mirador en la cumbre (`RC_VIEW`); ruinas (`RC_RUIN`); una moneda perdida por mapa.
  - **Clima de montaña:** `wxPick` envuelta (más nieve en invierno, niebla matinal).
  - **Fuentes que se secan** en julio y agosto (50 %).
- **Lebadea:** mapa nuevo entre Tebas y el Parnaso, con el río Hercina, dos fuentes (Olvido y Memoria) y la cueva de Trofonio (`rc:trofonio`, gasta 2 tortas; Pausanias IX 39).
- **Para aprender y enseñar** (módulo `edu`, estado `state.edu`; entradas nuevas en el menú de juego):
  - **Códice** (tecla C): todo lo visto, con buscador (lugares, lecciones, herbario, batallas, ninfas, objetos, animales), línea del tiempo de las batallas y **logros** con nombre antiguo (`LOGROS`, comprobados cada 3 s en `eduTick`).
  - **Accesibilidad** (`ACC`, en `localStorage` `nostos-acc`): botón 🔊 de lectura en voz alta en cada diálogo (speechSynthesis, es-ES) y opción de lectura automática; letra grande; fuente Atkinson Hyperlegible (Google Fonts); alto contraste; modo ligero (pixel ratio 1, sin sombras).
  - **Panel del profesor**: resumen del progreso, código de partida, informe descargable (.txt), preguntas propias del profesor (`localStorage` `nostos-preguntas`) y repaso de 5 preguntas mezclando lecciones aprendidas y preguntas del profesor.
  - **Música antigua**: lira sintetizada. Epitafio de Seikilos y un fragmento del himno délfico a Apolo, **aproximaciones simplificadas de transcripciones modernas** (y posteriores al 386 a.C.: se avisa en el modo Atenas); modos dorio, frigio y lidio con la opinión de Platón (República III 398e-399c) y de Aristóteles (Política VIII 1342b).
  - **Comercio entre ciudades** (`TRADE`): cada mercancía es barata en su tierra de origen; precios con estación; carga 8 (16 con caballo); piratas en el Egeo (modo Atenas, 15 % al navegar con carga) y portorium al vender (modo Roma).
  - **Sucesos en la ciudad** (`EV_A`/`EV_R`): invitación a simposio o cena, testigo, barco con noticias, incendio con los vigiles, préstamo a un vecino (que puede no devolverlo).
  - **Plagas en la granja** (envoltorio de `farmDay`): langosta, tizón (con las Robigalia, Ovidio, Fastos IV 901-942), sequía y granizo (vigilantes del granizo de Cleonas, Séneca, Cuestiones naturales IV b 6); la piedad reduce la probabilidad. **Opcionales y desactivadas por defecto** (decisión del usuario): se activan o desactivan con un botón que aparece en cualquier diálogo de la granja propia (`f.plagas`).
- **Paredes sólidas en todos los edificios** (`SEAL2`, `seal2Tick` en el bucle, `seal2Job` repartido en ~6 ms por fotograma): segunda pasada de colisiones tras `sealFootprints()`, que no veía lo construido después (destinos, aldeas, caminos, mapas de transición, casa, granja), los muros de menos de 3 m ni las columnas. Corta cada pieza vertical a la altura de la rodilla con rayos (perfil por geometría): puertas, arcos y porches quedan libres. Tramos → `addSeg`, bloques macizos → `addBox`, columnas → `addCirc`. No sella vegetación (`userData.veg`, puesto en `placeModules` para `T_*` salvo rocas y `V_*`, palmeras y árboles antiguos), muretes de piedra seca (`userData.low`), lo que se mueve (foto a 1 s y sellado a 2 s), lo invisible ni lo transparente. Nunca cierra el eje de un camino (donde un camino cruza un muro hay paso) ni encierra personajes u objetos con E. Se repite si cambia el número de hijos de la escena (como mucho cada 30 s). Pruebas: ningún camino ni personaje nuevo bloqueado; 30 de 30 muros nuevos no se atraviesan en cada modo.
- **Mirar con atención en azul claro** (`ATG`): lo que elige la mira brilla. Personas, dioses, animales y transeúntes llevan una capa azul translúcida y un halo (copias de sus mallas con `ATG.mat`/`ATG.rim`). Edificios y lugares llevan una caja azul con aristas gruesas sobre su planta (busca la huella por nombre y, si no, la más cercana a menos de 30 m). Objetos y carteles llevan un anillo en el suelo. Los candidatos de `atCands` llevan `obj` (el `g` de cada cosa); `artPerson` guarda su figura en el objeto E.
- **Población** (`POP`, `pop:`): Lisícrates, escribiente junto a los Héroes Epónimos (Atenas), y Tito Apronio, escriba del Tabularium (Roma). Dan cifras con su margen y sus fuentes (Hansen, Scheidel, Res Gestae 15, catálogos regionarios, Juvenal III 62) y desbloquean la entrada «Población» del códice.
- **Roma frente a las posiciones reales** de 36 monumentos (latitud y longitud de los restos, ajuste de semejanza por zonas): el Foro y el Capitolio están bien. Se han movido el Ara Pacis (al lado oeste de la Vía Flaminia), el obelisco del reloj solar (a 110 m al oeste del Ara), el Lupercal (al pie del Palatino, bajo la cabaña de Rómulo), la Roca Tarpeya (en el borde sur del Capitolio) y la Casa de Augusto (entera sobre la cima). El Aventino y el Emporio siguen comprimidos hacia el norte por el trazado del río.
- **Terreno**: ya no se levantan ínsulas donde el desnivel bajo la planta pasa de 4 m, ni domus en los destinos romanos donde pasa de 3 m en toda la planta. Las herramientas de auditoría (`terraudit.js`, `shots.js`) están en el scratchpad de la sesión.
- **Otros arreglos**: estatuas con proporciones humanas (de lejos parecían gallinas); fuera el ruido continuo de la ciudad (solo golpes sueltos de carros de noche en Roma); los animales eligen destinos al mismo nivel que su sitio y ya no trepan.
- **Vestuario** (`VEST`, `state.vest`, menú «Vestuario»): túnica, manto, color del manto y de la túnica (tintes con precio: sin teñir, pardo, glasto, azafrán, rubia, púrpura de Tiro), pelo, corona y, en Roma, calzado y anillo. Cada pieza se compra una vez y se ve en tercera persona (la corona es una pieza propia, `vestCrown`). Reglas: en Atenas, ropa libre para todos (Pseudo-Jenofonte 1.10); en Roma, toga, estola y calcei solo para ciudadanos (`fxEsCiu`); el clavus y el anillo de oro, de caballeros, y la corona de laurel, del triunfo, no se pueden comprar; las coronas de olivo y de laurel de los juegos griegos solo se ganan. Con la púrpura, la melena espartana o la barba en Roma, la gente comenta. Las prendas aparecen en el códice.
- **Zócalos automáticos**: la pasada `seal2Job` detecta las piezas fijas que quedan en el aire por su lado de abajo y les pone un zócalo de piedra hasta el terreno (cajas instanciadas con `chunked()`, como las casas; una malla única hacía caer el navegador en algunos equipos). Además, posadas, estaciones de posta, torres, bocas de cueva y gradas de cantera se apoyan en el punto más bajo de su planta.
- **Ambientación** (`AMB`, `amb:`, `ambSetup`, `ambTick`): detalles pequeños y documentados, cada uno con su ficha (también en el códice, sección «Ambiente»).
  - **Atenas:** hóroi del Ágora (IG I³ 1087-1088); hecateos junto a las puertas; «cenas de Hécate» en los cruces, solo en luna nueva (`cultDia().i===0`); corona de olivo (niño), cinta de lana (niña) y vaso de agua lustral (duelo) en algunas puertas; humo del Cerámico y de las forjas junto al Hefestión; pesas oficiales y losas del pescado.
  - **Roma:** miliarium aureum junto al templo de Saturno; 16 compita de los Lares; ropa tendida, macetas, toldos y rótulos en las ínsulas; mosaicos *cave canem* en las domus; la campana de las termas hacia la hora octava (Marcial XIV 163); gritos de vendedores (Séneca, Cartas 56).
  - **Mapas de naturaleza:** eras, chozas con redil, colmenas y exvotos en las fuentes; las fichas de los exvotos se crean en `ambSetup` porque `egxSetup` vacía la lista después de construir el mundo.
  - **Ambiente:** luciérnagas en las noches de verano, niebla al alba junto a los ríos, motas de polvo dentro de casa, golondrinas en primavera, flores de temporada, gallo al alba, perros y lechuzas de noche. La calima ya la pone el tiempo (`WXS.heat`).
- **Cámara:** tras un salto de más de 3 m va directa a su altura y nunca baja del suelo. Las pruebas que lanzaban el sellado de golpe (unos 12 s de bloqueo) hacían caer el renderizador por software de la máquina de pruebas; en el juego el sellado va por fotogramas.
- **Mirar con atención para todo lo interactivo:** cada objeto con E brilla (su figura `o.g` o, si no la tiene, las piezas de la escena a menos de 2,6 m de su sitio, `atGlowNear`; el anillo queda como último recurso) y recibe su definición (`atDescOf`). La definición sale, por este orden, de `AT_DEF` (escritas a mano, para lo que te lleva a otro sitio o empieza un juego: pirámide, faro, oráculos, Sibila, Atalanta/Camila, arcos del anfiteatro, maestros del tablero, granja, recolección), de las tablas de los módulos (`AMB_TXT`, `POP`, `NAT_NY`, `NAT_TRAV`, `RC_VIEW`, `RC_RUIN`), de `state.atDesc` (lo ya leído) o de una «prueba en seco» (`atProbe`): abre el diálogo de forma invisible con `toast`, `save`, `qAdd`, sonidos y temporizadores anulados, copia las primeras frases y restaura el estado, la posición, la interfaz, el diálogo y los objetos añadidos. Comprobado: 83 objetos en Atenas y 98 en Roma, todos con brillo y definición, y el estado igual antes y después.
- **Ambientación 2** (`AMB2`, `amb2Setup`, `amb2Tick`; fichas en `AMB_TXT`, acción `amb:`):
  - **Atenas:** pilares de Apolo Agieo, grafitos de «kalós», tablillas de maldición junto al Cerámico, pozos, ánforas selladas en el Pireo y telares con tejedora.
  - **Roma:** *Acta diurna* junto a los Rostra, popinas con *dolia*, librería del Argileto, molino con burro (beh `mill`), falo de la suerte (marcado como atestiguado sobre todo en Pompeya), y una litera con porteadores y un magistrado con lictores recorriendo el Foro.
  - **En las dos ciudades:** niños jugando (uno con aro), hilanderas, mendigos en las escaleras de los templos, gorriones que huyen si te acercas, musgo y hierbas al pie de las casas (`veg`).
  - **Costa:** redes, barcas varadas, secaderos y salinas.
  - **Campo:** prensas de aceite, vareo de la aceituna en otoño, cabreros con siringa (suena) y cuervos.
  - **Efectos:** abejas junto a las colmenas, moscas en el pescado y las popinas, charcos tras la lluvia que se secan poco a poco, y sonidos de taller (martillo, telar, muela).
- **Sonido de fondo, más limpio:**
  - el «viento» ya no suena siempre: solo en lo alto o fuera de las murallas, a ráfagas;
  - fuera el «murmullo» de ruido blanco del Ágora;
  - olas solo junto a la orilla;
  - nueva opción de Accesibilidad «Sin sonido de ambiente» (`ACC.noAmb`), que apaga viento, olas, cigarras, ranas, animales y talleres.
- **Móvil en vertical:** la barra de objetos va en columna a la izquierda, centrada en altura, y la brújula baja por encima de los botones para no tapar el título.
- v123 · Carga más rápida al elegir Atenas o Roma. `buildIslandMesh` calculaba 5 alturas (`islandH`) por vértice para la pendiente; ahora calcula una y saca la pendiente de los vértices vecinos de la malla. El terreno lejano bajo la ciudad (`buildTerrain`) usa 5×5 muestras en vez de 9×9 para quedar por debajo del cercano. En la máquina de pruebas (render por software, muy lenta): Atenas de 18,9 s a 10,2 s; Roma de 18,1 s a 12,4 s. Medidor `PROF` solo con `#debug` (marcas en `bootWorld`, `__d.PROF()`); lo que queda en Roma: `buildTerrain` ~2,6 s, `buildIslandMesh` ~2,3 s.
- v124 · Pantalla de carga con barco: trirreme ateniense (ojos en la proa, espolón, remos) o corbita romana (cuello de cisne en popa, artemón) que navega hacia El Pireo / Ostia mientras se construye el mundo. `buildWorld`/`buildRome` se convirtieron en listas de etapas (`bwSteps`, `romeSteps`); `bootWorld` las ejecuta con `ldRun` en tandas de ~90 ms, cediendo para que la pantalla se dibuje. Los pesos salen de la última carga (localStorage `nostos-carga-<modo>`) o de `LD_W`. Panel fijo abajo (`#ldBox`), se oculta solo al terminar. Depuración: `__d.LD()`, `__d.ldDemo(p)`.
- v124 · Teatros romanos (`theatre`): la huella era un rectángulo sin girar, desplazado al lado contrario en los teatros con `rot:π` o `±π/2`, y `destHouses` metía casas en la cávea (Neápolis, Tarraco). Ahora es un círculo `r:R1+1` en el centro. Escena de ladrillo (`RTEX.brick`) con cornisa de mármol en vez de caja blanca. En ladera (Verona, Lugdunum, Carthago Nova) subestructura de piedra bajo cávea, orquesta y escena hasta el punto más bajo del terreno.
- v125 · Mar abierto (módulo `SW`, solo modo Atenas por ahora). Barca sin dueño amarrada en el Pireo (`swMoorOf`: el punto de agua más cercano a `PORTS[id]`). Se sube con E y se rema con WASD hacia donde se mira; a 110 m del amarre se sale a mar abierto. Tramos de 700 m en un corredor lejano (x de Creta, z = −16000 − k·2000): golfo Sarónico (Pireo, Egina, Salamina de adorno), mar de las Cícladas (Delos, Naxos, Melos, roca de Nereo, palacio de Poseidón en el fondo, pecio) y mar de Creta (Creta). Al cruzar el borde norte o sur se pasa al tramo vecino (+2 h); junto a una isla, E = desembarcar (`swLand` → `PORTS[id]`; la barca queda amarrada allí, `swz().at`). Lejos de la costa, E = tirarse al agua; Espacio mantenido = bucear (aire 30 s; sin aire, «una nereida» te sube). La barca reutiliza `BOAT` con `BOAT.sea` (envolturas de `boatTick`/`boatExit`); `floorAt` devuelve `SW.BED` (−38) en el corredor; `checkZone` se omite allí y `regionName` da el nombre del tramo. Misión de Eudoro (barquero, inventado): al volver al Pireo por primera vez tras salir al mar aparece y propone el trato → Nereo (Hesíodo, Teogonía 233-236; Apolodoro II 5.11) → anillo de Minos en el palacio (Baquílides 17; Pausanias I 17.3; palacio en Egas, Ilíada XIII 17-31, ubicado en las Cícladas como licencia), clavo de Talos en la playa de Creta (Apolonio IV 1638-1688; Apolodoro I 9.26) y flor de la corona de Ariadna en Naxos (Ovidio, Fastos III 459-516; Higino, Astronomía II 5) → 15 óbolos y la barca es tuya. Códice: «Mitos del mar». Pendiente: Roma (Ostia → Sicilia, África, Hispania) y más tramos (Asia Menor).
- v126 · Mar abierto también en Roma. El módulo `SW` ahora lee sus datos de `SWD[MODE]` (tramos, entradas, palacio, divinidad que informa, dueño, tesoros, puntos con explicación). Los tramos admiten salidas por los cuatro bordes (`n/s/e/w`). Roma (corredor en la x de Cartago): barca en el Emporio; mar de Ostia (Ostia y el Puerto, faro de Claudio, Neápolis, pecio) → al sur, estrecho de Mesina (Regium; Sicilia de adorno; Glauco en su roca, Ovidio, Metamorfosis XIII 904-968 y XIV 1-74; Escila, Odisea XII 73-100; Caribdis, remolino que arrastra y escupe la barca, Odisea XII 101-110; palacio de Neptuno en el fondo, licencia) → mar de África (Cartago) → al este, mar de Egipto (Alejandría y el Faro, Estrabón XVII 1.6). Al oeste de Ostia: mar de Cerdeña → mar Balear (Massilia, Emporiae, Barcino, Tarraco, Carthago Nova; Baleares de adorno) → al sur, Columnas de Hércules (Gades; Calpe y Abila, Estrabón III 5.5). Misión de Fulvio, barquero del Tíber (inventado): Glauco → caracola de Tritón en el palacio (Ovidio, Met. I 330-342; Eneida VI 162-174), rama dorada en Neápolis (Eneida VI 136-148, 190-211) y tira de la piel de buey de Dido en Cartago (Eneida I 365-368; Justino XVIII 5) → 20 sestercios y la barca. `swMoorOf` busca agua libre (`isFree`) hasta 420 m del puerto. El HUD indica el rumbo hacia los tramos vecinos cerca de los bordes.
- v127 · Mar Icario (Atenas), al este de las Cícladas (`cicladas.e`): Quíos, Éfeso, Samos, Mileto y Halicarnaso para desembarcar; Icaria de adorno; plumas flotando con la historia de Ícaro (Ovidio, Metamorfosis VIII 183-235; Estrabón XIV 1.19) y el anillo de Polícrates frente a Samos (Heródoto III 40-43 y 120-125). Nuevo decorado `plumas`.
- v128 · Golfo de Corinto y mar Jonio (Atenas). Del Sarónico al golfo se pasa por el díolkos: punto con paso (`deco.go`/`goT`) en ambos lados del Istmo, +5 h (Tucídides III 15, VIII 7-8; Estrabón VIII 2.1). Golfo: Cirra (Delfos), Calidón, Lequeo (Corinto), Egio; Istmo de adorno; Arión y el delfín (Heródoto I 23-24). Al oeste, mar Jonio: Corcira, Pilos; Ítaca y Cefalenia de adorno (Odisea XIII 70-125; Tucídides I 25.4). Puertos sin agua junto a `PORTS` (Lequeo, Cirra: `isl.port`): la barca queda «en el puerto», invisible, y al subir se sale directo al tramo (`swPortOf`).
- v129 · Egeo del norte (al norte del mar Icario, `icario.n`): Troya, Lesbos, Olinto, Estagira y Termópilas por mar; monte Atos, Lemnos y Samotracia de adorno; canal de Jerjes (Heródoto VI 44, VII 22-24), Hefesto en Lemnos (Ilíada I 590-594), Artemisio (Heródoto VIII 1-23; el bronce de 1928, anacronismo señalado). Al este, el Helesponto: orillas de Sestos y Ábidos, Bizancio al fondo; Hele (Apolodoro I 9.1; Ovidio, Fastos III 851-876), el puente de Jerjes (Heródoto VII 33-36, 56), Hero y Leandro (Ovidio, Heroidas 18-19; Museo; Byron 1810, anacronismo señalado).
- v130 · Mar Negro (Atenas), sin destinos: se explora. Desde el Helesponto, punto «Remontar el Bósforo» (+24 h, `deco.goMsg`). Ponto Euxino: Tracia, Rocas Cianeas (Apolonio II 549-606), Quersoneso Táurico (Heródoto IV 103; Eurípides, Ifigenia entre los tauros; Leucón y el trigo, Demóstenes 20.31-33), Bitinia, el nombre «Euxino» (Estrabón VII 3.6). Al este, «Hacia la Cólquide»: Sinope y Diógenes (Diógenes Laercio VI 20-21), el Termodonte y las amazonas (Heródoto IV 110; Apolodoro II 5.9), Trapezunte y los Diez Mil (Jenofonte, Anábasis IV 7.21-26), el vellocino (Apolonio IV 123-182), Prometeo en el Cáucaso (Apolonio II 1246-1259; Hesíodo, Teogonía 526-531). Arreglado: las cenas de Hécate fuera de luna nueva ponían `x=NaN` y la mira las elegía en cualquier sitio; ahora `r=0`.
- v131 · Mar Tirreno (Roma). Rutas: Ostia →O→ Tirreno del norte (Graviscas/Tarquinii, puerto de Luna sin agua → `port`, Genua; Elba; piratas tirrenos, Himno homérico a Dioniso y Ovidio, Met. III 582-691; mármol de Luna, Plinio XXXVI 14 y 48, Estrabón V 2.5) →S→ mar de Cerdeña →O→ Baleares. Ostia →S→ golfo de Neápolis («Crater»: Neápolis, Vesubio humeante, Miseno y Plinio el Viejo, Cartas VI 16 y 20; Pompeya, Suetonio, Tito 8.3-4, fecha discutida; Capri, Suetonio, Tiberio 40-43; Sirenusas, Estrabón I 2.12 y V 4.8; Paestum) →S→ islas Eolias (Eolo, Odisea X 1-79; Hiera/Vulcano, Tucídides III 88, Eneida VIII 416-453; Strongyle, Estrabón VI 2.10-11) →S→ estrecho de Mesina. Monte Circeo en el mar de Ostia (Odisea X; Eneida VII 10-24; Plinio III 57). Islas con `col` y `smoke` (humo animado en `SW.smoke`). Textos de Glauco y Fulvio actualizados a la nueva ruta.
- v132 · Mar Jonio y Adriático (Roma). Desde el estrecho, punto «Rodear la punta de Italia» (+24 h) → mar Jonio (Brucio y Crotón, Pitágoras, Ovidio, Met. XV 60-478; canal de Otranto, Plinio III 100-101; Brundisium por su puerto, Horacio, Sátiras I 5) →N→ Adriático (Ancona, Ariminum, desembocadura del Rubicón, bocas del Po y Aquilea; los cuatro sin agua junto a `PORTS` usan `port`). Historias: Rubicón (Suetonio, César 31-33), Ravenna (Suetonio, Augusto 49; Estrabón V 1.7), Faetonte y el ámbar (Ovidio, Met. II 319-366; Plinio XXXVII 31-42), aves de Diomedes (Ovidio, Met. XIV 483-511; Plinio X 126-127), «mar de arriba» (Livio V 33.7-8), Antenor (Livio I 1.1-3). «Desembarcar en» pone en minúscula el artículo del nombre.
- v133 · Cinco mares más en Roma, sin destinos (se exploran): mar de Sicilia entre el estrecho y África (Etna, Ovidio Met. V 346-358 y Diógenes Laercio VIII 69; Siracusa y Arquímedes, Livio XXIV 34, XXV 31, Cicerón Tusculanas V 64-66; Melita, Diodoro V 12, Estrabón VI 2.11, Hechos 28); Egeo al este del Jonio (Corinto, Pausanias VII 16, Estrabón VIII 6.23, canal de Nerón, Suetonio Nerón 19; Atenas, Plutarco Sila 14, Horacio Epístolas II 2.43-45; Delos, Estrabón XIV 5.2; Rodas y el Coloso, Plinio XXXIV 41; Éfeso, Estrabón XIV 1.22); mar de Siria al este del de Egipto (Cesarea, Josefo Guerra I 408-415; Tiro y Sidón, Plinio IX 124-141; Jerusalén y el triunfo, Josefo Guerra VI-VII, Arco de Tito como anacronismo; Chipre, Plinio XXXIV 2, Tácito Historias II 2-3); Océano al oeste de Gades (mareas, Estrabón III 5.8-9, César BG IV 29; Casitérides, Estrabón III 5.11; Britania y Agrícola, Tácito Agrícola 22; Afortunadas, Plinio VI 202-205); Ponto Euxino romano desde el Egeo por punto «go» (Tomis y Ovidio, Tristes III 10; Mitrídates, Apiano 22-23, Plinio XXV 5-7; classis Pontica, Tácito Historias III 47).
- v134 · Vida en el mar (módulo `SW2`, capa sobre `SW`). Periplo (L): cada historia leída (`sw2Read`) queda en `swz().per`, en el códice («Periplo») y en el panel del profesor (`eduReport.periplo`); completar un mar paga. Barcos (pescador, mercante con encargos entre puertos, trirreme/liburna) con textos de fuentes; piratas en Atenas que persiguen la barca (Isócrates, Panegírico 115). Viento del día con nombre antiguo (`sw2wind`), vela con Z (`SW.dvx/dvz` en `swRow`), tormentas: refugio a <60 m de costa o se pierde la carga. Libación antes de zarpar (Tucídides VI 32.1; Horacio, Odas I 3). Osa Mayor de noche (Odisea V 270-277). Encuentros (Leucótea, Tetis, Tritón, Proteo, sirenas → sueño de Ulises). Pecio con 3 ánforas en cada tramo, se venden en puerto; Escilias (Heródoto VIII 8) y ostras del Lucrino (Plinio IX 168). Rumbo conocido (U) entre mares y puertos ya visitados. Esferas de espuma turquesa (`SWORB`, las del caballo son doradas): +8 % de velocidad por nivel hasta 10; al nivel 10, cinemática de Afrodita/Venus que nace de la espuma y aclara que en realidad nació junto a Citera (Hesíodo, Teogonía 188-200); misión de tres regalos (manzana, cinturón bajo el agua, paloma) → bendición Euploia: con vela, viento siempre a favor (Pausanias I 1.3). Barca decorada: ojos en la proa (ojos de mármol del puerto de Zea), aflaston (Ilíada XV 716-717) o cuello de cisne, estatuilla protectora (Atenea / Neptuno, tutela: Ovidio, Tristes I 10.1-2); «Mirar la barca» lo explica. Remos de una pieza.
- v135 · Arreglos tras el vídeo de la usuaria. (1) Tinte azul en todo el juego desde la v125: `BOAT.sea` empieza como `undefined`, `swUnder(undefined)` hacía `classList.toggle('on',undefined)`, que *alterna* y encendía el filtro de bajo el agua para siempre. Ahora `uw` se fuerza a booleano y `SW.uw` empieza en `false`. (2) Ruido agudo constante (~5 kHz) en el campo: en `rdSound` el LFO iba conectado directamente a `g.gain`, así que «gain = 0» no apagaba nada (sonaba con amplitud 0,5 en cualquier estación y aun con el ambiente desactivado). Ahora el LFO modula una etapa `am` y `g` es el volumen real. Medido en Ilerda: −81 dB.
- v136 · Andamios del incendio del 80 (`urbScaffold`, `romaUrbPlus`): cada poste baja hasta el suelo que tiene debajo, y el andamio busca alrededor del punto previsto el sitio más llano de su planta (el del templo de Júpiter colgaba 18 m sobre la ladera sur del Capitolio); los escombros, cada uno a la altura de su suelo. Modo atención en el mar (envoltura de `atCands`): la barca, encuentros, barcos y piratas, esferas de espuma, regalos de Afrodita/Venus, ánforas (buceando) e islas y costas del tramo.
- v137 · Agua más realista (`WTR`, `wtrApply`, `waterSetup`): mapa de normales generado en un canvas (suma de ondas periódicas, sin imágenes externas), muestreado dos veces en coordenadas del mundo (escalas 14 y 37,5 m, desplazándose en direcciones distintas) para el oleaje; reflejo del cielo según el ángulo (Fresnel, color de la niebla del horizonte mezclado con azul, máximo 55 %); color más profundo, brillo del sol más concentrado (shininess 420). Se aplica al mar y a los ríos (`CARVE.rivers`). El oleaje se atenúa con la distancia para que no centellee.
- v138 · Guía de navegación (`SWNAV`, `navTargets`, `navTick`): flechas planas sobre el agua alrededor de la barca, con rótulo actualizable (nombre y distancia). En el puerto, «Mar abierto». En un tramo: puertos donde desembarcar, tramos vecinos (Norte/Sur/Este/Oeste) y pasos (`deco.go`). En dorado, el objetivo de la misión, de Afrodita o del encargo; si está en otro mar, el primer paso de la ruta más corta entre tramos (`navRoute`, búsqueda en anchura sobre bordes y pasos). Máximo 7 flechas; Y (o el botón «Guía» en táctil) las oculta, y se recuerda en localStorage `nostos-guia`.
- v139 · Mar en el modo Historia: «El cuaderno del naviero» (Atenas) y «Una carta de Neápolis» (Roma) terminan con un paso nuevo hacia la barca sin dueño (`go` como función: `swMoorOf('atenas').land`); Ctesón y Plinio la presentan, salir al mar es opcional y el texto final del capítulo lo recuerda.
- Guion del modo Historia: `docs/guion_historia_atenas.md` y `docs/guion_historia_roma.md`, generados a partir de los datos del juego (`STORY_ATENAS`, `STORY_ROMA`, `STORY_FIN_*`, nombres de NPC y lugares) en la v139. Si se cambian los capítulos, hay que regenerarlos.
- v140 · Interior de Creta (módulo `CRT`, modo Atenas). Tres tramos de tierra de 800 m en una franja lejana (x de Creta, z≈16000+k·2000) con relieve propio `crtH` (floorAt/terrainH envueltos): «El camino del Ida» (cipreses de Platón, Leyes 625b; Yuctas «tumba de Zeus», Calímaco; pastora del díctamo; arquero cretense), «El monte Ida» (cueva con escudos de bronce, altar, cabra Amaltea con un cuerno roto, viejo pastor; percusión de los curetes que sube al acercarse a <90 m y aviso del pastor a <40 m) y «La llanura de la Mesara» (ruinas de Festo con escalinata —disco de Festo marcado como anacronismo—, pared de las leyes de Gortina en bustrofedon con pregunta sobre herencias, río Leteo y plátano de Europa). Entrada: poste «El camino del Ida» en el mapa de Creta; bordes norte/sur pasan de tramo con fundido. La cueva de Maya (nacimiento de Hermes) va en el lago Estínfalo, al pie del Cilene (Arcadia, no Creta), con tortuga y frases de lira. Actos `crt:`.
- v141 · Cnosos rehecho para el 386 a.C.: ruinas del palacio a escala real (≈150 m, pad de r 112 en -0.30R,-0.26R), patio central 25×50, almacenes del oeste, muros arrasados a trozos con montículos de tierra, basas sin columnas (se quitaron las columnas rojas: eran la reconstrucción de Evans, marcada como anacronismo en la estela «El palacio que no se ve»). Ciudad griega viva al norte (`C.polis`): ágora, stoa, templo de Apolo Delfinio, ~26 casas, aldeanos, cambista con monedas del laberinto (`crt:cambista`). Cimientos de la casa de Rea en un bosque de cipreses (Diodoro V 66.1) y santuario de Deméter en Gipsades.
- v142 · Detalles de Cnosos (`knDetails`/`knTick`/`knAct`, actos `crt:`): pithos medio enterrado (Glauco en la miel), cuernos de consagración caídos, resto de fresco, sillar con hacha doble (labrys), niños jugando al Minotauro, cabrero y cabras entre las ruinas, fuego de pastores de noche, andreion (comedor común) con anciano, agéla de muchachos corriendo, viejo con la paradoja de Epiménides, alfarero (figurilla 1 óbolo → altar de Deméter, +1 Eusébeia; `state.knOf`), tratado Cnosos–Tíliso, pista de baile de Ariadna (Il. XVIII 590), ovillo rojo que lleva al sueño del laberinto, estela de Talos; sonidos de telar, cencerros y viento.
- v143 · Detalles del interior de Creta (`crtDetails`/`crdTick`/`crdAct`): camino — fuente con abrevadero, colmenas de barro con abejas y apicultora, arriero con mula y ánforas que recorre el camino, cabras salvajes (agrimi) en el Yuctas, montón de piedras con ofrendas (hermaion); Ida — iniciado en lana negra (Porfirio, VPyth 17), cabaña de pastor con quesos (Od. IX), águila de Zeus en círculos; Mesara — era con bueyes trillando, tumbas redondas (tholoi), templo de Apolo Pitio en Gortina, juez con pregunta (Código XI 26-31), toro blanco junto al plátano. Sonidos: agua, abejas, águila, trilla, ranas del Leteo. Altar de la cueva del Ida apoyado en el suelo.
- v144 · Modo Roma: cuatro destinos nuevos al final de ROMA_DESTS (no mueven los anteriores): `siracusa` (sea, net 'sic': templo de Atenea, teatro, anfiteatro, altar de Hierón, latomías y «oreja» como anacronismo de Caravaggio, tumba de Arquímedes, fuente de Aretusa; NPC Filón, mistagogo), `aetna` (tierra desde Siracusa: cono de ceniza con nieve y humo `isl3Smoke`, sandalia de Empédocles, boca de los Cíclopes, viñas; NPC Brontes), `caralis` (net 'sar': foro, nuraga, salinas con flamencos, anfiteatro; NPC Bodmilcar), `aleria` (net 'cor': estanque de ostras, colmenas de la cera, tumbas antiguas; NPC Cirno). Desembarco desde los tramos `siculum` y `sardum`; hubs nuevos en `landDests`. Actos `isl3:`. El `tint` de los destinos ya funcionaba; se oscureció el del Etna.
- v145 · Modo Roma: 33 destinos más (bloque `R3_DESTS`, empujados a ROMA_DESTS al cargar; configuración en SIMPLE_RO, personajes en `R3_NPC`, fuentes en `R3_SRC`, actos `r3:`). Italia (red 'it', con WORLD_LINKS y puertas de Roma para Ostia, Tibur y Praeneste): Ostia, Tibur, Praeneste, Capua, Cumas y Bayas, Pompeya sepultada, Tarento, Aquilea, Rávena, Mediolanum, Augusta Praetoria; Sicilia: Agrigento, Segesta; Acaya: Corinto, Atenas, Delos; Asia: Éfeso, Pérgamo, Rodas; Siria y Judea: Antioquía, Jerusalén (año 80, tras la destrucción); Chipre (Pafos), Melita, Cirene, Olisipo; Britania: Londinium y el campamento de Agrícola (año 80, Agr. 22); Germania: Colonia, Mogontiacum; Carnuntum (por tierra desde Aquilea), Salona, Cesarea de Mauritania, Cirta. Desembarco desde los tramos de mar (Egeo, Siria, Océano, Adriático, Sicilia). Ayudas: `r3Camp`, `r3Ruins`, `r3Lighthouse`, `r3Tower`, `r3Terraces`. La carga del mundo en Roma tarda más (≈23 s en SwiftShader).
- v146 · Modo Roma: 10 mapas de transición (`R4_DESTS`, SIMPLE_RO + NAT_NY + NAT_FA + RD_MAPS): Alpes Julios/Emona, Henna y Pérgusa, ruinas de Selinunte, Eleusis, Esmirna, Tiro, lago de Galilea, Eburacum, Augusta Treverorum, llanura de Zama. WORLD_LINKS nuevos (puertas a pie en ambos sentidos): Aquilea–Emona–Carnuntum (sustituye el enlace directo), Siracusa–Etna, Siracusa–Henna–Agrigento–Selinunte–Segesta, Corinto–Eleusis–Atenas, Éfeso–Esmirna–Pérgamo, Antioquía–Tiro–Galilea–Jerusalén, Londinium–Eburacum–Campamento de Agrícola, Massilia–Nemausus–Lugdunum–(Alesia)–Tréveris–Mogontiacum–Colonia, Cartago–Zama–Cirta, y en Hispania Tarraco–Barcino–Emporiae, Tarraco–Ilerda–Médulas, Corduba–Emerita y Corduba–Gades. `__d.GW()` devuelve GATES_W (ojo: `__d.GATES` es otra cosa).
- v147 · Lo que faltaba a los mapas nuevos de Roma (bloque r5): 11 esferas de sueño (`R5_EP`: Sibila de Cumas, Vesubio, muerte de Arquímedes, rapto de Proserpina, Zama, caída del Coloso, Belerofonte y Pegaso, Europa, Boudica, Espartaco, Deméter en Eleusis); segunda misión del barquero Fulvio (tras terminar la primera: copa del Alfeo en Siracusa, brida de Pegaso en Corinto, cinturón de Afrodita en Pafos, rayo del Coloso en Rodas; estado `swz().m2/it2`, objetos `r5:it:`, paga doble + 2 Kléos; `swOwnerTalk` envuelto); casas de tejado plano con pretil y escalera (`r5FlatHouses`) en Galilea, Tiro y Jerusalén, con estela. Pendiente: el modo Historia no tiene capítulos en los mapas nuevos.
- v148-150 · Carga: `padIndex` (allanamientos indexados por celdas de 48 m en `islandH`, mismo resultado) y relieve de los destinos de Roma en 8 tandas (`romaReliefChunk`, `ROMA_DEF`): Roma 21→15 s y Atenas 14,5→9,3 s en SwiftShader. QA: los mapas nuevos (`early:true` en SIMPLE_RO) levantan sus edificios antes que las casas y `destHouses` evita lo ocupado (`I.chkFree`); placas y espíritus reservan sitio; script de QA en scratchpad (`t_qa3.js`). Modo Historia de Roma: capítulo extra «Las historias de Tácito» (`STORY_EXTRA_ROMA`, se ofrece en el final; `state.story.extra/extraDone`). Profesorado: `state.mapas` (mapas visitados), informe y código ampliados (capítulos, mapas, esferas), «Hoja de la clase» que descodifica códigos y exporta CSV. Publicación: `.github/workflows/pages.yml` (GitHub Pages; hay que activar Pages → GitHub Actions), `construir.py` escribe la versión (`@@VER@@`) y `version.json`, aviso de versión nueva en web (`r7VersionCheck`). Documentos: `docs/publicar.md`, `docs/guia_docente.md`, guion de Roma regenerado.
- v151 · Provincias más propias: casas redondas de los britanos (`r8RoundHouses`) en el campamento de Agrícola, Eburacum y las afueras de Londinium; casas de terraza en Cirta y Zama; estelas que lo explican. Tercer tema de conversación para los 33 personajes de `R3_NPC` (`R8_T3`). Minimapa propio en los tramos del interior de Creta. Revisión de citas y fechas: Masada cayó en el 73/74 (corregido), Decébalo aún no es rey en el 80, Áquila de Corinto es real (Hechos 18; añadido a ROMA_HIST), tratado Cnosos–Tíliso = Meiggs-Lewis 42, tributo corso de 200.000 libras de cera (Livio XLII 7), Seplasia en Cicerón (Pis. 24), Batón en Dion LVI 16, Ptolomeo en Suetonio (Cal. 35). Pendientes de verdad: Lanciani y traducciones del contenido nuevo (en pausa).
- v152 · Revisión con la *Forma Urbis* de Lanciani (Synopsis y láminas 30 y 35; método y tabla en `docs/revision_lanciani.md`, herramientas `fit.py`/`fit2.py` en el scratchpad). Campo de Marte y centro dentro de 20-100 m tras el ajuste por zonas. Corregido: el Circo Máximo, que era este-oeste, girado `CIRC_A` = −0,349 rad (gradas, muro, espina, metas, cárceres, colisiones, público, `RFLATS` con 7.º valor de giro, cuadrigas en `updateRome` con `ROMA.circus.cr/CA`, auriga junto a las cárceres). Sin casas ni calzadas dentro.
- v153 (Lanciani, 2.ª revisión, `docs/revision_lanciani.md`): el Pórtico de Octavia, con Juno Reina y Júpiter Estátor, pasa de (−470,−90) a (−491,20), pegado al NO del Teatro de Marcelo, con `markRect` para su patio. Hércules Vencedor pasa a (−428,300), junto a la Porta Trigemina; se añade el Templo de Portuno en (−420,258) con su cartel `ro_portuno`; nueva zona llana en `RFLATS` [−410,250,58,95] y `markRect` para la plaza. Sin cambiar: Palatino estrecho (palacio, Casa de Augusto, Circo) y el río al sur de la isla, que debería torcer al este; ambas cosas son reordenaciones grandes que habría que proponer.
- v154: Palatino en `RHILLS` [40,195,160,82,34,0.7]; edificios: Tiberio (−45,150), palacio (95,215), Apolo (0,240), Casa de Augusto (−38,232), Gran Madre (−88,200), cabaña de Rómulo (−72,250); carteles `ro_apolo` (0,270), `ro_romulo` (−72,262), `ro_circo` (−165,350). Circo: C=(65,405) en `romaCircus` y en `RFLATS`; el color de arena de la arena (en `romaH`) ahora también gira. `SERV` …[175,620],[410,575],[440,440]… `markRect(40,198,290,150)`: sin ínsulas en la cima. Región «Palatino»: superD(40,195,180,108). Pendiente: la curva del Tíber al sur de la isla.
- v155: curva del Tíber. `RIV` …[235,-520],[350,-515],[470,-468],[580,-478],[700,-600]…; calle del Velabro por la orilla hasta (−445,640); `SERV` [−405,425],[−398,560],[−372,690]; Porta Trigemina en (−440,372); Pórtico Emilio fijo en x=−470, z0=650.
- v156 (templos por dentro): módulo TP antes de «EL INTERIOR DE CRETA». `tpRules()` asocia el nombre del templo (regex) con su dios, la estatua de culto (`lk` y material g/m/b/w/s), el tesoro (`tr`, `tk`: coins/vessels/tripods/arms/standards/votives/books/art), el sacerdote (`pr`, `pt`) y las fuentes (`src`). La primera regla excluye templos (Partenón, que ya lo tenía, Isis, Panteón, Segesta, Agrigento…). `romanTemple` hace la cella hueca, con puerta de bronce abierta, solo en los templos con regla; `temple()` griego decora la naos; `roundTemple` solo pone sacerdote (Vesta: vestal, sin estatua). Los sacerdotes se crean en el paso `tpSetup` y en `tpTick` para los mapas que se construyen después; `tp:` en `egxAct0`; ofrenda diaria (1 moneda) en `state.tp`. Depuración: `__d.TP()`, `__d.tpAct`.
- v157 (Atenas, `docs/revision_atenas.md`): con Judeich (fig. 9), Curtius y Kaupert y Travlos, `GATE_ANG.este` pasa de 0 a −0,6 (Diocares al nordeste; camino del Liceo rehecho) y `melitides` de 2,9 a 1,88 (suroeste, colina de las Musas). Pendiente: el Dípilon y el Cerámico (del noroeste, no del norte). Las fuentes nuevas están en el scratchpad, `atenas/src`.
- v158 (Ágora, Agora XIV lám. 5): Epónimos en AL(-82,37), altar de los Doce Dioses en AL(-55,-98) (también el sacrificio), TRIAL_H en AL(-65,60), fuente en AL(38,76), Ceca nueva (`enclosure`) en AL(64,80) con su cartel `ceca`, Tiranicidas en AL(-59,-26), cartel de las hermas en AL(-83,-135). Herramientas: `atenas/agora.py` y `atenas/ov.py` en el scratchpad.
- v159 (Dípilon y Cerámico): `GATE_ANG.dipylon` −2,62 y `sagrada` −2,70. `ACADEMY` fijo en (−1146,−1219); `DROMOS` (marco del camino Dípilon→Academia, usable con `gatePt`) para las tumbas, los túmulos, el cartel `ceramico` y la diosa de la Academia. Vía Panatenaica rehecha desde el Dípilon. Barrio `kerameis` en (−735,−470). Erídano: `ce=[SG.x-90,SG.z-70]` en `defineRiversGR`; la franja de agua de la Puerta Sagrada va en un `grp` girado `a2`.
- v160 (Acrópolis y Ágora): `AG` pasa de (−470,−330) a (−370,−330) (todo lo que usa `AL` se mueve); `ELEUS` en (−198,−175); se quita el punto fijo [−300,−185] de la Vía Panatenaica y el camino del Liceo arranca en (−228,−128). Ojo: las coordenadas absolutas del Ágora en notas anteriores (v157-v158) están ahora 100 m más al este.
- v161 (errores visuales del vídeo y las capturas):
  - Columnas tardías: `finishColumns` ahora solo dibuja las nuevas (`COL_DONE`) y `colsTick` la llama si hay pendientes. Antes todo templo construido después de la carga (el Bendideion del Pireo, los mapas que se levantan al llegar) se quedaba sin columnas y su entablamento flotaba.
  - Bendideion: `BEND` = cima de Muniquia +(10,−10), del lado de tierra, con explanada en `pirCarve`. Antes colgaba sobre la dársena.
  - Odeón: terraza a 8 m en `rawH`; la «ladera sur» se suaviza a su alrededor (`superD(165,100,52,62)`). Antes estaba medio enterrado y por el sur tenía muros de más de 25 m.
  - Sueño de la Academia: `DREAM.g` oculto salvo durante el sueño. Era la «caja gris» que flotaba en el cielo.
  - Casas: `courtyardHouse(...,keep)` busca un sitio más llano si la parcela tiene más de 2,5 m de desnivel, o no se construye. Las casas con nombre pasan `keep=true`.
  - `destHouses` deja libre la franja de las estelas junto a la llegada y no construye encima de ningún cartel.
- v162: cámara de diálogo (`TCAM`, `talkCamera()` tras `placeCamera0()`): al entrar en `ui==='dialog'` con un `focus` a menos de 8 m (no estelas), la cámara se coloca a 2,9 m de la persona, de tres cuartos, mirando a la cintura para que la cara quede sobre el cuadro; transición suave de ida y vuelta. Se desactiva con `SET.talkCam=false`.
- v163 (rendimiento): medido con `__d.REN().info` (prueba `t_perf.js`, M=roma para Roma).
  - **Culling por celdas** (`CULL`, `cullTick`): cada objeto de primer nivel se registra (800 por fotograma) con su centro y su radio, y se saca de la escena si la cámara está lejos: radio <1,5 m → 300 m; <6 → 750; <30 → 1500; si no, 2600. Se recalcula al cambiar de celda de 120 m o cada 1,5 s, usando la posición actual de lo que se mueve.
  - `scene.remove`/`scene.add` están envueltos para que lo que el juego borra no vuelva. No se registran las luces (ni los grupos que las contienen: cambiar el número de luces recompila los materiales), el cielo, `DREAM.g` ni los trozos instanciados.
  - Resultado en el Ágora: de 70.800 a 17.100 objetos en escena, de 49.500 a 9.500 que proyectan sombra y de 4.645 a 2.998 llamadas de dibujo. En el Pireo, de 1.651 a 638 llamadas.
  - `chunked`: celdas de al menos 420 m (Roma pasa de 19.333 a 10.579 grupos), `matrixAutoUpdate=false` y distancia ×0,7 en móvil (`CHUNK_FAR_K`).
  - Sombra del sol a 2048 (antes 4096 en escritorio). Personas y PNJ visibles hasta 150 m (antes 180).
  - Fusión de piezas estáticas (`MERGE`, `mgGroup`): escrita pero **apagada**. Ahorra solo un ~10 % de llamadas y en la prueba disparaba la memoria. Diagnóstico con `__d.mgDiag()` y `__d.mgSize()`.
- v164 (escenarios cuadrados, antes de `defineGates`):
  - `regionSquare(k)`: la ciudad usa el cuadrado de `INNER`. En Roma, `INNER` pasa a {0,−170,2800} justo antes de `buildTerrain` (antes Roma se cortaba en x=780 y no se llegaba a las puertas de Tíbur ni de Nemi). Los destinos de tierra firme usan 1,25·R; las islas, 1,4·R.
  - `edgeSlots(f)`: cada vecino por tierra (de `WORLD_LINKS`) va al lado que mira hacia él según `bearing`; si en un lado hay varios, se reparten. Las puertas quedan a 26 m del borde, porque el paso se corta a 20 (`tryMove`, `flyMove`, tejados; `sqClamp` en los destinos).
  - `sqMount`: montes más allá del borde, solo en tierra (el mar sigue siendo mar), con un paso abierto de unos 40 m en cada salida. Se aplica en `islandBase` y envolviendo `terrainH0` para la ciudad.
  - En tierra firme, fuera del círculo R el terreno ya no se empina (pendiente 0,06), así que todo el cuadrado es jugable.
  - En la ciudad, el camino de tierra va de la antigua puerta (`homeGate`) a la del borde.
  - El viaje sigue en `gateTravel`: días y coste, y llegada 14 m hacia dentro de la puerta opuesta. Por mar, puertos como antes.
  - Plano y minimapa: `regionBounds` cubre el cuadrado entero (el Pireo salía azul porque `MAPB` acababa en z=470). `buildMapBase` pinta los campos de `fieldAt` (Atenas), oscurece lo de fuera y marca el borde. `mapStale()` rehace la imagen si cambia el número de edificios (como mucho cada 15 s).
- v165 · Módulo VIDA (`VIV`, prefijo `v2`): corros de conversación con gestos; quejas si chocas corriendo y saludo por el nombre cuando ya eres conocido; los personajes principales respiran y se giran hacia ti; sucesos espontáneos de día (ladrón al que puedes atrapar, pregonero con noticias de 386 a.C./80 d.C., riña, mensajero); pájaros que huyen; sentarse con O (el tiempo pasa más rápido); vendedores de comida (1 óbolo/as, más velocidad 3 min) y trabajo de porteador de ánforas (3 monedas). Gente que carga ánforas y cestas. Pendiente: horarios por hora de los PNJ principales, sonido por zonas y pasos según el suelo.
- v166 · Rutinas y sonido por zonas (`RUT`, `rutTick`, `zsTick`). Horarios por hora para PNJ principales (`RUT_A`: dicasta, Aristófanes, cocinero, Manes, Lisias, armador, Pródico; `RUT_R`: Marcial y el cliente —salutatio al alba y termas a la octava hora—, Plinio en la Basílica Julia, Tácito, Quintiliano, vigil de ronda nocturna, mercader). Cambian de sitio solo si no los ves; si estás cerca y es corto, caminan. Al encontrarlos fuera de su sitio, aviso con la explicación y la fuente. Sonido: frases sueltas sintetizadas (formantes) desde donde hay gente, martillos junto al Hefestion / Subura, agua junto a fuentes, golpes de madera y voces en el puerto. Pasos sobre hierba en los campos del Ática.
- v167 · Salidas y caminos. (1) La malla cercana de la ciudad (Atenas y Roma) pasa 150 m del borde del cuadrado (`INNER.mesh`); antes los triángulos de la malla lejana (~116 m) asomaban sobre los pasos de las salidas como un monte sin colisión (Roma → Samnium, Picenum, Ostia, Tíbur, Nemi, Ciminia). (2) `drapeStrip()`: franjas que siguen el relieve; sustituye a losas planas largas que el terreno atravesaba: el *tratturo* de Saepinum, la Vía Emilia de Mutina y las lindes de la centuriación. Pendiente menor: la pista de un estadio (`noFlat`) en un destino del modo Atenas, x≈47960.
- v168 · Barrido visual automático en `herramientas/qa_visual/` (ver su LEEME): relieve visto≠suelo, objetos flotando/enterrados, vegetación, personas. Primer hallazgo arreglado: el bema de la Pnyx estaba a la altura nominal de la colina (45 m) y quedaba 5 m bajo el terreno real; ahora se asienta en `terrainH`. Ciudades de Atenas y Roma barridas; los destinos, pendientes.
- v169 · Barrido visual de los 142 destinos (`herramientas/qa_visual`). Arreglado: (1) árboles flotando sobre ríos excavados después de plantarlos (~30 destinos: Carnuntum, Londinium, Tempe, Padus…) → paso final `vegSnap()` que los posa en el suelo y quita los que caen en el agua; (2) carreteros de las salidas enterrados hasta 6 m tras `applyFlats` → también los repone `vegSnap()`; (3) relieve visto≠suelo en teatros y edificios excavados en ladera de los destinos (Olisipo, Cirene, Quíos, Corcira, Lebadea…): la malla de los destinos (6-8 m) no puede dibujar un corte estrecho → tras `applyFlats` el suelo físico de cada destino es la propia malla (`I.flatMesh`, `I.grid.H` sincronizado; `terrainH` no aplica `flatAt` ahí). Probado y descartado: ensanchar los allanamientos (dejaba objetos flotando 30 m). Pendiente menor: una figura suelta medio enterrada en Ténaro y Liceo (parece un personaje ambiental que se mueve).
- v170 · Suelo con detalle por zonas. (1) `terrainMat()` tiene sombreado propio (`terr2`): textura base a dos escalas giradas (sin repetición cada 9 m), roca triplanar en pendientes, hierba donde el color del vértice es verde, grava y tierra cuarteada a manchas en lo seco, y manchas grandes de luz y de tierra rojiza; texturas nuevas `PTEX.rock/grass/gravel/cracks`. (2) `GD`/`gdTick()`: piedras sueltas y matas de hierba en 3D alrededor del jugador (radio 56 m, 42 en táctil; celdas de 3,5 m deterministas, se recolocan al moverse 6 m): piedras en pendientes y pedregales, matas verdes (Italia, destinos `green`), secas (Ática), escasas en desiertos; nunca dentro de murallas/Urbs, caminos, edificios ni agua.
- v171 · Antorcha en los muros: `MeshLambertMaterial` (r128) calcula las luces en los vértices; en muros largos (murallas de Saepinum) los vértices quedan fuera del alcance de la antorcha y el muro salía oscuro o a triángulos. Ahora las luces puntuales se calculan por píxel: se quita el bucle de `NUM_POINT_LIGHTS` de `ShaderChunk.lights_lambert_vertex` y se añade en `ShaderLib.lambert` (varyings `vPlPos`/`vPlNor`). El sol y el cielo siguen por vértice.
- v172 · Montes del fondo sin cortes: (1) la malla lejana conserva la altura real junto al borde de la cercana (antes se rebajaba y se veía la montaña «partida»); (2) malla lejana más fina (Atenas 12000/300, Roma 14000/350: ~40 m en vez de ~116 m); (3) `sqMount` sube de forma suave hasta una sierra de ~260 m (`260·(1−e^(−0,75·d/260))`) en lugar de cortar a pico a 700 m del borde, y baja muy lejos (>3000 m); (4) el paso de cada salida se abre en valle al alejarse del borde (ancho 9+0,4·d, rampa 31+0,9·d) en vez de un cañón de 80 m.
- v173 · Las matas de hierba puntiagudas (`GD.tf`) chocaban con el estilo del juego: ahora son matorral bajo y redondeado (icosaedro facetado aplastado, textura de hoja, verdes apagados), como tomillo, salvia o lentisco; menos densas (0,45 verde / 0,32 seco / 0,08 desierto).
- v174 · Herreros (herrería de la Subura y fundición junto al Hefestion): llevan martillo (`G_hammer_hand`), animación `forja` (bajada rápida hasta la cara del yunque, subida lenta; la izquierda sujeta la pieza), yunque con tocón, cara y bigornia (`anvilAt`), y en cada golpe chispas (`forjaChispas`/`forjaTick`, un único `THREE.Points` de 90 partículas con gravedad) y sonido metálico. El zapatero sigue con la animación `martillo` antigua.
- v175 · Veinte destinos más en el modo Atenas (regiones que faltaban): Dóride, Anfisa (Lócride Ozolia), Opunte (Lócride Opuntia), Sición; Ítaca, Cefalenia, Léucade, Zacinto; Tasos, Lemnos, Samotracia; Cos; Cime (Eólide), Cnido (Dóride de Asia); Siracusa (`siracusa386`, para no chocar con la de Roma), Tarento; Cirene; Olbia, Panticapeo, Sinope. Datos en `D386B` (antes de «EL INTERIOR DE CRETA»): entradas al final de `ISLANDS` (al final, para no mover las coordenadas de las partidas guardadas), `MED_POS`, caminos en `WORLD_LINKS` (Dóride–Eta/Parnaso/Anfisa, Anfisa–Delfos, Opunte–Termópilas, Sición–Corinto/Egio), `SIMPLE_GR` (dos estelas, templo, casas, puerto si es costa, vida) y un personaje con lección y prueba por destino (históricos: Pólibo, Ctesias, Arquitas). En el mar del minijuego, Ítaca, Cefalenia, Lemnos, Samotracia y Sinope pasan a ser puertos.
- v176 · Personas en el suelo: módulo SUELO (`PEOPLE` registra cada `makePerson`; `sueloTick` en `scene.onBeforeRender`): cada imagen coloca a las personas cercanas (parent=scene, no `noSnap`) sobre el suelo visible: plataforma si están encima de una, si no la malla del terreno (`meshH`), que junto a los edificios puede diferir hasta ~1 m del suelo físico (caso: neócoro del Hefestion flotando 1,1 m). Nadie queda por debajo del suelo visible; por encima solo se baja a quien está en el suelo físico (las estatuas sobre pedestales no se tocan; las de bronce llevan `noSnap`). Caminos: el muro curvo de la Pnyx se abre donde lo cruza el camino al Pireo; `courtyardHouse` y la cuadrícula del Pireo no levantan casas sobre un camino; los puestos de `oficio` se apartan del camino (el del pescado estaba en la Vía Panatenaica). Herramienta `herramientas/qa_visual/caminos.js`. (Revisado en v177: el tramo del Pireo es el camino que entra en el agua.)
- v177 · Misión «El tábano» (módulo SOC, modo Atenas): Jantipa junto a la cárcel (`soc:jantipa`) → ofrecer un gallo a Asclepio en un altar junto al Asklepieion (`soc:altar`, 2 óbolos; Fedón 118a) → de noche (21-4,5 h) cerca de la cárcel aparece la sombra de Sócrates, que te sigue revoloteando, te suelta pullas cada 20-40 s y te levanta si te sientas. Duelo (`socDuel`, una vez por día): tres rondas (valor, Laques; piedad, Eutifrón; paradoja de Menón). Las definiciones se refutan; se gana (≥2 puntos) reconociendo la ignorancia, devolviéndole la pregunta de Eutifrón 10a y comprometiéndose a examinar (Apología 38a). Premio: lección `socrates_tabano`, +3 Sophía, +2 Lógos, +1 Kléos, 3 óbolos. Revisado lo pendiente: el tramo del camino del Pireo (-1169,699) no es un error, es el final del camino que entra en el agua del puerto.
- v178 · Misión «El perro» (módulo DIO, modo Roma), gemela de «El tábano»: Primigenio, acomodador del teatro de Pompeyo (`dio:acomodador`; cuenta el cínico Diógenes azotado en el 75 por insultar a Tito, Dión Casio LXVI 15) → beber con las manos en la fuente pública (`dio:fuente`, Diógenes Laercio VI 37) → de noche (21-4,5 h, como Sócrates, a petición) en el Foro aparece la sombra de Diógenes con su lámpara: te sigue, ladra (`sfxBark`) y suelta pullas (se burla del dinero si llevas más de 40 sestercios). Duelo (`dioDuel`, una vez por día): riquezas (autarquía), qué es un hombre (cosmopolitismo, el gallo desplumado) y «pídeme lo que quieras» (se gana con «Apártate, que me tapas el sol»). Premio: lección `diogenes_perro`, +2 Sophía, +2 Lógos, +1 Areté, +1 Kléos, 3 sestercios. Las lecciones y fuentes de Sócrates y Diógenes se registran en `socSetup`/`dioSetup`, porque en Roma `LESSONS` se rehace al arrancar.
- v179 · Destino nuevo Crotona (en `D386B` y al final de `ISLANDS`; personaje Glaucias, entrenador; estelas de los atletas y de Hera Lacinia) y misión «El silencio» (módulo PIT, modo Atenas), gemela de las de Sócrates y Diógenes: Éurito, viejo pitagórico histórico (`pit:eurito`) → de noche, juramento de la tetractys en las ruinas de la casa de Milón (`pit:ruinas`, elegir el triángulo 1-2-3-4) → la sombra de Pitágoras (lino blanco, corona de oro, calzones, Eliano XII 32) te sigue por Crotona de noche y te riñe con los akúsmata, y además si corres, comes o te sientas. Duelo de cuatro rondas (`pitDuel`, una por día, se gana con ≥3): lo más sabio (el número), la octava 2:1, el perrito apaleado (metempsícosis) y, al final, guardar silencio (echemythía). Premio: lección `pitagoras_crotona`, +3 Sophía, +1 Eusébeia, +1 Kléos, 3 óbolos.
- v180 · Misión «El oscuro» (módulo HER, objeto `HRC` porque `HER` ya existía; modo Atenas, Éfeso): Melita, una «abeja» de Ártemis (`her:melita`) → de noche, jugar a las tabas en el patio del Artemision (`her:tabas`; la tirada de Afrodita o tres tiradas; fr. 52) → la sombra de Heráclito, oscura y con brasas que se encienden y apagan, te sigue por Éfeso y suelta fragmentos (y otros según lo que hagas: sentarte, antorcha, agua, correr). Al hablarle te lleva al río Caístro (nuevo, por el valle llano del sur, z≈+360, `HRC.rio`); dentro del agua te explica el cambio en cinco frases (fr. 12, 126, 49a, 91, 84a; con tiempo real, no dt) y allí empieza el duelo de cuatro rondas (≥3): el río, la guerra y la paz (fr. 51/53), el camino arriba y abajo (fr. 60), «me he buscado a mí mismo» (fr. 101). Premio: lección `heraclito_efeso`, +3 Sophía, +1 Lógos, +1 Kléos, 3 óbolos.
- v181 · Antorcha: se enciende al seleccionarla en la barra y se apaga al cambiar de objeto; la F salta a ella y vuelve al objeto anterior; al empezar, el cursor no está en la antorcha. NPC que atravesaban edificios: `npcStep()` (paso libre con `isFree`, rodeo de ±0,5/1/1,5 rad; si ya estaba dentro, le deja salir) en paseantes, ladrón de los sucesos; los destinos del Ágora se eligen libres; los personajes con horario no cruzan edificios (si están lejos del jugador, se colocan en el destino). Herramienta `herramientas/qa_visual/atraviesan.js` (Ágora y Foro: 0 casos tras el cambio).
- v182 · Gradas que se pisan: `CAVEAS` (registro) y `caveaH()` entran en `floorAt`. Teatros (`theatre()`, tipo 't': rampa suave del borde de la orquesta, pendiente continua por los peldaños y pasillo de arriba), anfiteatros de destino (`amphi()`, tipo 'a': las puertas de los ejes siguen a ras de suelo y junto a ellas las gradas suben en rampa) y Coliseo (tipo 'c': elipse por bisección sobre el podio de 7,8 m, sin los túneles de los ejes; ya no se encierra al jugador en una caja de 2,8 m al salir del vomitorio). En `tryMove`, desde lo alto de unas gradas no se salta al vacío (>2,5 m). Probado: Marcelo 1,2→18,4 m; Capua, de la puerta a la arena y 11,5 m de cavea; Coliseo, 21,7→41,9 m y a lo largo de la fila, y abajo frena en el podio.
- v183 · Bajo las gradas no se ve nada (fiel a la arquitectura: las cáveas griegas se apoyaban en la ladera y se cerraban por los lados con muros de contención, *analémmata*; las romanas, sobre bóvedas, con el muro de los *tribunalia* sobre los *aditus*). `theatre()`: muro de piedra en cada extremo de la cávea que sigue el perfil de los peldaños hasta el muro exterior, con colisión. `amphi()`: muros a ambos lados de cada puerta de los ejes (antes se veía la sección hueca) y dintel en la fachada sobre la puerta; se quita la rampa falsa junto a las puertas (el jugador andaba por dentro de la malla); a las gradas se sube por una escalera exterior de dos tramos adosada a la fachada, como la del anfiteatro de Pompeya, con rellano y peldaños hasta lo alto de la cávea; desde la arena no se sube (podio). Probado en Capua: del pie de la escalera (1,3 m) al rellano (16,1 m) y bajada por la cávea, 0 fallos. `__d.CAV2()` expone las cáveas.
- v184 · Avisos que se abren: `toastTarget()` reconoce por la etiqueta los avisos con sitio propio (Curiosidad → Diario/Curiosidades; Lección aprendida → Lecciones; Mito reconocido → Mitos; Primeros pasos, Misión y Encargo → Primeros pasos; Copias la inscripción → Lugares; Llega el… → Fiestas; ★ Logro → Códice, sección Logros). Esos avisos llevan la pista «[Y] Abrir en el Diario» (en móvil, «Toca para abrirlo»); con Y o tocándolos se abre la pestaña y se resalta la entrada (`.jHit`). El tutorial se salta con la tecla Retroceso (sin soltar el ratón). Diálogo en móvil: tras aprobar un «Ponme a prueba», el resumen largo dejaba los botones a 0 px y no había forma de salir; ahora los botones no encogen (máx. 45vh, con desplazamiento), el texto se desplaza y hay un botón ✕ fijo en la cabecera (`#dX`, como Esc).
- v185 · Curia Julia visitable (en `romaForum`): muros huecos de 1 m con colisión y la puerta abierta (hojas de bronce giradas hacia dentro), suelo de mármol a 1,6 m (el de la escalinata), tres gradas bajas con bancos (*subsellia*) a cada lado, tribunal con dos sillas curules al fondo, la Victoria de oro sobre el globo con su corona (la de Tarento, puesta por Octavio al inaugurar la Curia el 28-VIII-29 a.C., tras Accio: Dion Casio 51,22), su altar con fuego e incienso (Suetonio, *Aug.* 35,3: incienso y vino antes de cada sesión) y el escudo de oro (*clupeus virtutis*, *Res Gestae* 34). Objetos `cur:altar` (tres textos: la Victoria y su altar, con la retirada del 382 y el debate Símaco-Ambrosio marcados como futuro; el escudo; cómo se vota, *pedibus in sententiam ire*) y `cur:sala` (aviso: el edificio conservado es la reconstrucción de Diocleciano, tras el 283). Se registran envolviendo `colSetup`. La luz: se reutiliza `ROMA.bodaLight` (sin luces nuevas en la escena) sobre el altar mientras el jugador está dentro (`curTick`).
- v186 · Menú de Esc reorganizado (la izquierda, cualidades y resumen, no cambia). Derecha (`gmRight`): «Volver al juego»; CONSULTAR, seis botones grandes con su tecla (Diario J, Plano M, Biblioteca B, Códice C, Zurrón I y **Ayuda**, destacada); EN EL CAMINO, ocho acciones pequeñas (pasar horas, antorcha, caballo, vista, foto, comercio, vestuario, música); y dos botones anchos que abren su página: **Ajustes** (sonido, cámara, palabras griegas/latinas, iluminación, sombras, tiempo, accesibilidad, controles, pantalla completa) y **Partida** (guardar, cargar, cambiar de época, panel del profesor). La página de Ayuda reúne la pista del pedagogo (G), el nivel de ayuda, los controles y la accesibilidad. `GM.page` guarda la página; Esc en una página vuelve al menú, no lo cierra. Iconos nuevos: help, cog, hint, disk.
- v187 · Vida en el campo y los caminos (`NAT2`, `n2Tick` en la cadena): todo alrededor del jugador y fuera de murallas/Urbs, desactivado en modo ligero de accesibilidad. (1) El matorral bajo de GD y las flores se mecen con las rachas (`n2Sway`, en el sombreador, con el mismo `WIND`). (2) Flores silvestres de temporada en dos InstancedMesh (tallo y flor), más densas en los bordes de los caminos (2,6–7 m del eje) que en el campo: primavera amapolas, manzanillas, anémonas y crisantemos; verano amarillas y cardos; otoño azafrán silvestre; invierno narcisos. Caché por celda (`N2C`): recolocar al andar cuesta ~5 ms cada 7 m. (3) Mariposas de día (no en invierno ni con lluvia), alas instanciadas que baten, de flor en flor; huyen si te acercas. (4) Lagartijas al sol sobre las piedras de GD (primavera y verano, de 9 a 17,5 h, sin nubes); corren y se esconden a 4 m. (5) Saltamontes que saltan delante al andar por el campo (no en los caminos ni a caballo). (6) Hojas secas que cruzan con las rachas en otoño. Coste por fotograma < 0,5 ms; llamadas de dibujo nuevas: 5 instanciadas + 3 lagartijas + 4 saltamontes.
- Pendiente: revisión lámina a lámina de calles y manzanas con la *Forma Urbis*.

### Novedades de la versión 116: iluminación realzada (opcional) y vuelo sobre el Tíber

- **Vuelo sobre el río** (el temblor del vídeo del Emporio):
  - Volando bajo sobre el Tíber se aplicaba la regla «el Tíber no se cruza a pie» (`tryMove`, `hN<-1.2`). `flyMove` quedaba bloqueado y deslizaba alternando ejes, y la cámara temblaba. Ahora la regla no se aplica con `FLY.on`.
  - Volando, los pies no bajan de `riverWater+0.4`: se roza el agua sin hundirse.
- **Iluminación realzada** (menú → «Iluminación: normal/realzada»; módulo «ILUMINACIÓN REALZADA», `GFX`):
  - Al activarla carga desde jsDelivr (three@0.128.0/examples/js) `EffectComposer`, `RenderPass`, `ShaderPass` y `UnrealBloomPass`.
  - Cadena de efectos: bloom; un pase de color según la hora (`gfxTick`: dorado al alba y al atardecer, azulado de noche, saturación); viñeta. Usa un render target multisample si hay WebGL2.
  - El bucle de dibujo y `phShot` usan `gfxRender()` cuando está activa.
  - Se recuerda en `localStorage` (`nostos-gfx`). Está pensada para ordenadores potentes.
- `page.js` (pruebas) sirve los `examples/js` de three desde `node_modules`.

### Novedades de la versión 115: anfiteatro por dentro, modo foto y arreglos (móvil, Celio, alas)

- **Diálogos cortados en el móvil:** el glosario (`glossScan`) sustituía nodos de texto mientras el efecto de máquina de escribir (`TW`) los iba rellenando, y lo visible se quedaba congelado a medias.
  - Ahora `glossScan` no actúa mientras `TW.on`, y se lanza al terminar la escritura (`twTick`, `twFinish`).
  - El botón 👁 se oculta cuando hay un diálogo abierto.
  - `vmS` siempre muestra el diálogo, porque antes, llamado después de `closeDialog`, quedaba oculto.
- **Anfiteatro Flavio** (módulo «EL ANFITEATRO FLAVIO POR DENTRO», `romaColosseum` envuelto con `colPlus`; `colSetup` en la cadena de setups):
  - Muro interior y gradas por encima de los túneles de los ejes, más el muro a los lados de los túneles. Antes, por los arcos se veía la parte de atrás de las gradas.
  - Techos de los deambulatorios a 10,3, 22,1 y 33,9 m, y cubierta a 46 m.
  - Vomitoria (bocas oscuras) en tres menianos.
  - Cuatro entradas del público (`col:entrada`, arcos IX, XXIV, LIII y LXVII) con su tésera: ARCVS, CVNEVS, GRADVS y LOCVS.
  - El asiento se decide según quién eres (`colSeat`): mujeres arriba, en las gradas de madera (Augusto); ciudadanos varones en el segundo meniano; peregrinos y plebe en la parte alta.
  - Deambulatorio y vomitorio narrados; el asiento es una plataforma con bordes; se sale con `col:salir`.
- **Modo foto** (P o F2, o el menú; prefijo `ph`):
  - Oculta la interfaz; zoom con la rueda, +/− o botones (`PH.z` se aplica en el cálculo del campo de visión de `gfCam`).
  - Pie de foto opcional con época, lugar, coordenadas, día y hora (útil para informes de errores).
  - Vista previa; se guarda con la capacidad `downloads` del visor y, si no está, con un enlace.
- **Celio:** el anillo de travertino alrededor del anfiteatro tenía solo dos filas a 18 m. En la cuesta flotaba sobre el terreno; ahora tiene 7 filas de 3 m y 240 segmentos.
- **Alas de Ícaro:** volar (y navegar) ya no suma distancia para la Areté de «correr», y ponerse las alas ya no da +2 Areté (sigue dando Kléos).
- Pendiente: el «temblor» del río en el Emporio no se reproduce quieto ni empujando contra la orilla. Los fotogramas del vídeo muestran movimiento de cámara y centelleo de la hierba, no del agua.

### Novedades de la versión 114: mirar con atención (θεωρία / animadversio) y el entierro de Miseno

- **Modo atención** (módulo «MIRAR CON ATENCIÓN», prefijo `at`):
  - Mientras se mantiene **Q** (en pantallas táctiles, el botón 👁 `#atBtn`), aparece una mira con el nombre de lo que tienes delante (`atPick`): personajes, dioses, objetos `egx` (`egxObj` está envuelto para guardar el subtítulo), fauna, transeúntes, el caballo y los lugares de `PLACES`.
  - Con **E** sale una ficha breve (`atCardShow`). Un listener en fase de captura corta la interacción normal mientras el modo está activo.
  - Al soltar Q, o al perder el foco, el modo se apaga.
  - En móvil, la ficha sale sola tras 0,8 s mirando lo mismo.
  - Cada 15 cosas distintas miradas: +1 Sophía (`state.atSeen`).
- **Roma: el entierro de Miseno** (*Eneida* VI 149-235): `infBuild` e `infAct` están envueltos.
  - El cuerpo de Miseno (`fi:miseno`) está en la entrada del bosque. Caronte no deja cruzar sin haberlo enterrado (`finz().misen`).
  - Los ritos: pira, palomas que guían a la rama de oro, cenizas, urna, purificación y túmulo. Si se vio el funeral de la Vía Apia, se recuerda.
  - Al cruzar aparece Palinuro (`f.palin`).
- Prueba en `scratchpad/tools/t_at.js`.

### Novedades de la versión 113: el Hades griego (la bajada órfica, en Atenas)

Módulo «EL HADES GRIEGO» (prefijo `hd:`, estado en `state.hades`: `st` para la estación, `lam` para la laminilla, `done`). Repite la idea de los Infiernos romanos de la Eneida —un camino largo de estaciones— en una zona propia (`HD`: X 9500, Z 12000, Y 4200; `hdBuild`) para no chocar con el Telesterion.
- **Requisitos:**
  - la iniciación órfica (`state.fest.orficos`);
  - la laminilla de oro, que da Arcesilao (`hdOpts`): sus instrucciones resumen las de las laminillas, como la de Hiponio, de hacia el 400;
  - Eusébeia 8.
- **Entrada:** el oráculo de los muertos junto al Aqueronte (`hd:entrada`), colocado en el destino de Dodona (Epiro). Incluye la consulta de Periandro según Heródoto.
- **Estaciones:**
  - la fosa de Odiseo (*Odisea* XI);
  - Caronte, que cobra un óbolo (enlaza con el funeral del Cerámico si se hizo);
  - Cerbero y la torta de miel (Aristófanes, *Lisístrata*);
  - los tres jueces del *Gorgias*, con una pregunta;
  - el Tártaro: Sísifo, Tántalo, Ticio y las Danaides;
  - la fuente del ciprés blanco: si bebes, olvidas y vuelves a los jueces;
  - el lago de Mnemósine, con la fórmula de las laminillas;
  - Hades y Perséfone (enlaza con Eleusis);
  - la sombra de Aquiles;
  - la llanura del Olvido y la elección de vidas del mito de Er (enlaza con la Academia).
- **Recompensa:** la primera vez, +5 Eusébeia, +2 Sophía, +2 Kléos y 10 óbolos. Una tarjeta final explica en qué se diferencia del Averno romano.
- `regionName` envuelto: «El Hades» y «Los Campos Elíseos».
- Prueba en `scratchpad/tools/t_hd.js`.

### Novedades de la versión 112: el camino del forastero a la ciudadanía (10 pasos en cada modo)

Módulo «EL CAMINO DEL FORASTERO» (prefijo `cv`). Une lo que ya existía (prostátes, metoíkion, énktesis por decreto, ciudadanía por el emperador o por Malaca, hospitalidad) y añade los pasos que faltaban. Cada modo guarda su partida, así que `fxz().ciu` es la ciudadanía ateniense en Atenas y la romana en Roma.
- **Diario, pestaña «Forastero»:** nueva entrada «Tu camino a la ciudadanía», con los 10 pasos marcados (`cvSteps`, `cvPanel`). `fxJournal` está envuelto.
- **Atenas:**
  - **Metoíkion cada año** (`cvTick`): aviso al empezar el año. Ocho días después llega la denuncia ante el polemarco (`f.mkLate`) y hay que pagar el doble al demarco.
  - **Servicios a la ciudad** (`cvServ`), hacen falta 3:
    - la eisphorá (30 óbolos, con el demarco);
    - la flota (con Ifícrates);
    - las Panateneas como portador de bandejas (se toma de `vmz().once.pan`);
    - una donación (queda como opción para más adelante).
  - **Isotéleia:** el paisano la gestiona con 3 servicios y Kléos 5.
  - **Petición de ciudadanía** (`cvPetA`): pide énktesis, isotéleia, Kléos 8, Lógos 6 y un amigo con «Confianza». Primera votación a mano alzada; segunda con 6.000 votos secretos (al azar, ayuda el Kléos). Luego, el juicio por ilegalidad (`cvJuicio`, tres preguntas más un plus de Lógos).
  - Si gana: demo de Mélite, tribu Cecrópide y fratría. Puede hablar en la Pnyx y desfila como ciudadano en las Panateneas (`vmPanRole` ya miraba `state.fx.ciu`).
  - **Personaje femenino:** termina en «benefactora» (`f.hon`, decreto con corona de olivo), porque las mujeres no tenían derechos políticos.
  - **Asamblea de la progresión** (`progAct` envuelto): si no eres ciudadano, en lugar de hablar escribes el discurso para un amigo, como Lisias.
- **Roma:**
  - **Veterano** Tiberio Claudio Dases (`cv:vet`, en `ro_paz`), con su diploma militar.
  - **Vía del trigo** (`cvAnona`, botón añadido a `vmFrum`): solo para latinos (origen Malaca) con barco propio. Seis viajes, uno por mes del juego. El hombre obtiene la ciudadanía (`f.via='anona'`); la mujer, el privilegio de las madres de cuatro hijos (`f.liber`), según Suetonio.
  - **Malaca:** la magistratura ya no se ofrece a personajes femeninos; hay una explicación en su lugar.
  - `f.via` registra la vía: `municipio`, `emperador` o `anona`.
- Comprobado: la casa en Atenas ya exigía énktesis por decreto, y la granja ya era un arriendo a nombre del sobrino de Lamprias. No hacía falta tocarlas.
- Prueba en `scratchpad/tools/t_cv.js`.

### Novedades de la versión 111: canteras (cómo se sacaba la piedra) y pigmentos

Módulo «CANTERAS Y PIGMENTOS» (prefijo `qc:`, estado en `state.qc`).
- **La cantera** es una zona aparte (`QC`: X 9500, Z 9000, Y 4200), como el estadio o el Telesterion. Se construye la primera vez que se visita (`qcBuild`).
  - Tiene un suelo de 150 × 150 m con paredes, el frente de la cantera en cinco bancos, bloques a medio sacar, obreros y montañas alrededor.
  - `regionName` está envuelto para que la zona tenga nombre.
  - Se va con `qcGo` y se vuelve con `qcBack`, al punto de salida.
- **Atenas: el Pentélico.** Se llega con Mnesíteo, el transportista de mármol, en el Cerámico.
  - El frente, con los canales a pico siguiendo el lecho de la piedra.
  - Las cuñas de hierro: un minijuego en el que hay que golpearlas todas por igual. Pagan un jornal de una dracma, como en las cuentas del Erecteion, y +1 Areté una vez al día.
  - La rampa (*lithagogía*) con el trineo, frenado con cuerdas y postes.
  - El carro con yuntas de bueyes, como en las cuentas de Eleusis.
- **Roma: el travertino de Tíbur**, la piedra de la fachada del anfiteatro de Tito. Se llega con Félix, el marmolista del muelle de los mármoles, junto al Emporio; allí se habla de los mármoles de colores del imperio y de las marcas de cantera.
  - La grúa de rueda (Vitruvio; relieve de los Haterios, posterior).
  - La sierra que corta con agua y arena.
  - La barcaza por el Anio (Estrabón).
  - Una nota sobre la toba, el ladrillo y el polvo de Puteoli del hormigón.
- **Taller de pigmentos.** En Atenas lo lleva Calias, el que según Teofrasto sacó el cinabrio del mineral de Laurio hacia el 405. En Roma, Vestorino, en los talleres de cinabrio que Plinio sitúa entre los templos de Flora y Quirino.
  - Siete colores, cada uno con su origen: azul egipcio (y Vestorio en Puteoli, según Vitruvio), bermellón (de Sisapo, monopolio del Estado), ocres (los de Ceos), blanco de plomo, malaquita y azurita, negro de hollín y púrpura.
  - Ver los siete da +2 Sophía.
  - «Ayudar a pintar una estatua» explica los aglutinantes y la cera. Da +1 Kléos.
- Prueba en `scratchpad/tools/t_qc.js`.

### Novedades de la versión 110: funerales, medicina, Panateneas y reparto de trigo, infancia y juegos

Módulo «VIDA Y MUERTE» (prefijo `vm:`, `vmSetup`, `vmAct`; estado en `state.vm`: `d` para lo diario, `once` para lo que se hace una vez, `nuts` para las nueces). Las pantallas se arman con `vmS(glifo, nombre, subtítulo, html, botones)`.
- **Funerales** (+2 Eusébeia la primera vez):
  - Atenas (Arquipe, en el Cerámico): la prótesis, con el óbolo de Caronte y el lamento; el cortejo antes del alba (ley de Solón); la tumba, con libaciones, lécitos y la estela del apretón de manos; las comidas del tercer y noveno día y las Genesias.
  - Roma (Quinto Vibio, en la Vía Apia): la pompa con las máscaras de cera de los antepasados; la *laudatio* en los Rostra (Polibio); la pira fuera de la ciudad (las Doce Tablas), el hueso cortado y el banquete del noveno día; el colegio funerario y el columbario de los pobres; las Parentalia y las Lemuria.
- **Medicina:**
  - Médico (Eurífon, de Cos, en Atenas; Hermógenes, griego, en la Subura). Hay un caso al día:
    - fiebre terciana junto a las marismas;
    - tos de herrero;
    - fractura de una niña.
  - En cada caso se pregunta primero y luego se elige tratamiento. Acertar da +1 Sophía al día. Hay una opción con el juramento hipocrático, y en Roma salen Catón, Plinio y el instrumental de la Casa del Cirujano de Pompeya.
  - Incubación (Asklepieion de Atenas, fundado en el 420/19, con Sófocles y el gallo de Sócrates; isla Tiberina en Roma, con el decreto de Claudio sobre los esclavos abandonados): solo de noche, con un sueño al azar y un exvoto de barro. +2 Eusébeia la primera vez.
- **Grandes Panateneas** (Atenas; Licurgo, en el Pompeion):
  - El verano del 386 es el tercer año de la 98.ª Olimpiada, así que tocan las Grandes. Se celebran en Hecatombeón (`calNow().mo===6`).
  - Si aún no es Hecatombeón, se puede esperar: `state.day` avanza los días que faltan (`vmPanDaysTo`).
  - El papel en la procesión depende de si el personaje es hombre o mujer y de si tiene la ciudadanía ateniense (`state.fx.ciu`): canéfora, portadora de sombrilla, portador de ramos o portador de bandejas (meteco).
  - Después, la hecatombe y la carrera de antorchas desde el altar de Eros de la Academia. Ganar depende de la Areté y de cuidar la llama; el premio es un ánfora panatenaica (12 óbolos y +3 Kléos).
- **Reparto de trigo** (Roma; Cayo Atilio, en el Campo de Marte):
  - El ciudadano varón (`fxEsCiu`) recoge con su tessera 5 modios una vez al mes, y puede llevarlos a la panadería o venderlos.
  - Las mujeres y los no ciudadanos no tienen derecho (nota según Carcopino); en su lugar pueden descargar en el Emporio, una vez al día.
  - Explicación de la anona: Alejandría, Puteoli y el puerto de Claudio, las barcazas del Tíber, los horrea y la diosa Annona.
- **Infancia** (Nicarete en Atenas, Pomponia Rufa en Roma): la Anfidromía y el décimo día en Atenas; el *dies lustricus* y la bula en Roma; una nota sobre la exposición de recién nacidos. El regalo al bebé da +1 Eusébeia.
- **Juegos de niños** (junto al Ágora / junto al Circo):
  - Tabas en los dos modos: valores 1, 3, 4 y 6; la tirada de Venus y la del perro; se apuestan nueces.
  - El castillo de nueces en Roma.
  - Explicación del aro, la peonza, la ostrakinda y las muñecas.
- Prueba en `scratchpad/tools/t_vm.js`.

### Novedades de la versión 109: una sesión de la Academia en directo

Módulo «LA ACADEMIA EN DIRECTO» (prefijo `aca`, estado en `state.aca`), solo en Atenas. Se entra desde Platón con la opción «Asistir a una sesión de la Academia, en directo» (`acaOpts`, enganchada en `renderOpts`). Funciona de la hora 7 a la 17.
- **Escena** (`acaScene`): seis oyentes alrededor de Platón. Se retiran al terminar o al cerrar el diálogo; para eso `closeDialog` está envuelto.
- **Motor en directo** (`acaNext`):
  - Las frases se añaden a `#acaLog`, que no es hijo directo de `#dBody`. Así la máquina de escribir no reescribe toda la conversación.
  - Las intervenciones avanzan solas (1,8 s más 32 ms por carácter), con botones Seguir, Pausa y Salir.
  - Las preguntas de Platón detienen la sesión hasta que el jugador responde.
  - Las palabras griegas aprendidas aparecen en las frases de los personajes (`vocWalk` sobre cada línea).
- **Guion** (`acaScript`), con las ideas de los diálogos de Platón en texto propio del juego:
  - opinión verdadera y saber (el camino a Larisa y las estatuas de Dédalo);
  - el cuadrado doble del *Menón*, con figuras SVG (`acaFig`), y los inconmensurables de Teeteto;
  - aprender es recordar y la inmortalidad del alma;
  - lo Bello mismo y las Ideas (*Hipias mayor*), la imitación y Heráclito;
  - el anillo de Giges y el alma en tres partes (*República*);
  - el sol y el Bien.
- **Enlaces con lo que ha hecho el jugador** (`acaKnows`): solo aparecen si es verdad. Teeteto, Isócrates, ἀλήθεια, los sueños, Eleusis, los órficos, Dédalo, Cefisodoto, el teatro, las metamorfosis de Ovidio, la Pnix, Gorgias y la caverna.
- Si el personaje es femenino, una nota recuerda a Axiotea de Fliunte y Lastenia de Mantinea.
- **Mapa del conocimiento** (`acaMap`): un SVG con las Ideas en el centro y ocho nodos que se encienden según lo enlazado. Avisa de que el *Menón* y la *República* se escribirán después y de que la inscripción sobre la geometría es una leyenda tardía.
- **Recompensa:** la primera vez, +3 Sophía, +2 Lógos y +1 Kléos; después, +1 Sophía al día.
- **Arreglo de paso:** el glosario (`glossScan`) y el vocabulario (`vocWalk`) ya no tocan el texto que hay dentro de un `svg`. Metían un `span` HTML que hacía desaparecer etiquetas como «Retórica».
- Prueba en `scratchpad/tools/t_aca.js` y `t_acamap.js`.

### Novedades de la versión 108: el terreno lejano ya no asoma en la ciudad

- **Fallo que se veía:** en Roma, junto al templo de Saturno (entre el Foro y el Velabro), un terreno arenoso tapaba personas y objetos, y se atravesaba al andar.
- **Causa:** era la malla lejana del terreno (`buildTerrain(…,false)`). Sus triángulos miden más de 100 m, y dentro de la zona cercana solo se hundía 8 m. Donde una colina linda con una zona allanada (el Capitolio junto al Foro allanado, con `rawH` de 60 y suelo a 0,6), la superficie entre vértices quedaba por encima del suelo real.
- **Arreglo:** dentro de la zona cercana, cada vértice de la malla lejana baja ahora 3 m por debajo del punto más bajo de `displayH` en un entorno de ±1 celda, muestreado en 9 × 9 puntos. Así ningún triángulo puede asomar por encima del suelo. Se conserva el −40 del Pireo.
- **Comprobación** (`t_buried.js`, barrido cada 40 m dentro de la malla cercana):
  - Roma: 0 puntos por encima del suelo.
  - Atenas: quedan 39, todos en la columna del borde (x = −1400) y en colinas, con menos de 1 m de diferencia.

### Novedades de la versión 107: la jornada romana (a partir de Carcopino)

Fuente: J. Carcopino, *Daily Life in Ancient Rome*, el EPUB que se subió, en la traducción inglesa. Los textos del juego resumen sus ideas con palabras propias y no reproducen el libro. Carcopino describe sobre todo la Roma de Trajano (h. 100-120); aquí solo entra lo que ya valía en el 80, y se avisa de lo que es posterior: la barba de Adriano, la separación de horarios en las termas.

Módulo «LA JORNADA ROMANA», solo en Roma (prefijo `jr:`, `jrSetup`, `jrAct`, `jrTick`; marca diaria en `state.jr.d`):
- **Barbería** (Ciro, `jr:tonsor`, en la Subura):
  - afeitado con el maestro lento: perfecto, pero se va una hora;
  - afeitado rápido en la esquina: 45 % de corte, curado con telarañas en aceite y vinagre (Plinio);
  - rumores del 80: el Coliseo, el incendio, el Vesubio, Agrícola, Domiciano, Berenice;
  - la *depositio barbae*.
  - Si juegas con un personaje femenino, en lugar del afeitado está la *ornatrix*, con el peinado flavio de rizos en torre y el maquillaje (aviso sobre el albayalde).
- **Termas de Tito** (Fortunato, `jr:termas`): abren de día; la entrada cuesta un cuadrante. Se recorre el apodyterium (con el *capsarius* y el riesgo de robo), la palestra (trigon, aro, lucha), el sudatorio y el caldarium (con el estrígilo) y el tepidarium y el frigidarium. Da +1 Areté una vez al día y avanza el reloj una hora.
- **Cena de clientes** (Sexto Nevio, `jr:cena`): de la hora nona a la noche. Nomenclátor, triclinio, lecho bajo, gustatio y mulsum. Al anfitrión le sirven mejor comida que a ti (la queja de Marcial). Puedes callar, hacer una broma (con Lógos ≥ 4 sale bien: +2 Lógos) o quejarte. Al final, postres, ofrenda a los Lares y las sobras en la servilleta.
- **Micatio** (Gavio, `jr:micatio`, en el Pórtico de Octavia): apuesta de 2 sestercios, hasta 3 partidas al día. Eliges los dedos que sacas y el total que cantas; si aciertas tú y él no, ganas 4. Explica que los dados estaban prohibidos fuera de las Saturnales.
- **El reloj de Augusto** (`jr:reloj`, en `ro_obelisco`): calcula cuánto duran ese día las horas de día y de noche según el mes (`jrDayLen`) y explica cómo era un día normal.
- **`horaRomana`**: la noche ya no sale como «de noche», sino por vigilias (prima, secunda, tertia y quarta).
- **Sucesos de la calle** (`jrTick`): cada 2-4 minutos, si vas a pie a menos de 1.100 m de los Rostra, aparece un aviso.
  - De día: orinales que caen de las ventanas, pregoneros, literas, obras tras el incendio, mendigos, ínsulas que crujen, maestros gritando.
  - De noche: carros (desde César solo podían circular de noche), patrullas de *vigiles*, borrachos.
- **Ensayo en la biblioteca:** «Un día en Roma» (`JR_ESSAY`), con la fuente y el aviso sobre las fechas.
- Prueba en `scratchpad/tools/t_jr.js`.

### Novedades de la versión 106: maestros de griego y de latín; las palabras aprendidas aparecen en el original

Módulo «VOCABULARIO» (prefijo `voc`). Una sola lista, `VOCAB`, con 36 palabras frecuentes en los diálogos del juego. Cada palabra tiene sus formas en español (singular, plural y femenino), el griego ático con su transliteración, el latín y una nota de etimología para cada lengua.
- **Maestros** (`VOC_T`, objetos `vc:0-2`, `vocAct`): tres en cada modo, con tres lecciones de cuatro palabras cada uno. Cada lección se abre al terminar la anterior.
  - Atenas: Dionisio, *grammatistés* en el Ágora; Sosias, pedagogo tracio en el Liceo; Mírrine, panadera del Ágora.
  - Roma: Lucio Verecundo, *ludi magister* junto a la Basílica Emilia; Eutico, *paedagogus* griego junto al templo de Cástor; Cecilia, panadera de la Subura.
  - Cada maestro tiene una nota histórica: el alfabeto jónico desde el 403; la Paz del Rey del 386; el Vesubio y el incendio del 80; el Templo de la Paz.
- **Lección:** se ven las cuatro palabras con su etimología y luego hay cuatro preguntas. Cada palabra acertada queda aprendida (`state.voc.w`) y da 1 moneda. Terminar una lección da +1 Sophía y +1 Lógos (`state.voc.l`).
- **Sustitución en los diálogos** (`vocWalk`):
  - Se aplica sobre `#dBody` justo antes del efecto de máquina de escribir, porque `twStart` está envuelto: así el efecto ya escribe el texto sustituido.
  - Respeta mayúsculas, número y género.
  - Se salta los botones, las etiquetas `.label` y todo lo que esté dentro de `.novoc` (las lecciones).
  - «casa» no se cambia detrás de «se/te/me…» (se casa). «vino» solo se cambia detrás de un determinante (el vino, de vino), no cuando es el verbo (vino ayer).
  - Cada palabra cambiada es un `span.voc`: al pasar el ratón o tocarla se ve «transliteración · significado».
- **Ajuste en el menú:** el botón `voc` guarda la preferencia en `localStorage` con la clave `nostos-voc`.
  - En Atenas va pasando por alfabeto griego → transliteradas → no.
  - En Roma, por sí → no.
- **Vocabulario latino del documento «Vocabulario latín»:** es una lista escolar con las definiciones en catalán; aquí van traducidas al español (`VOC_LAT_N`, `VOC_LAT_P`, `VOC_LAT_O`). En Roma hay 232 palabras en total; en Atenas siguen siendo 36.
  - Lo enseñan dos maestros nuevos, con secciones (`T.S`) y lecciones de 6 palabras que se generan solas con `vocSecLessons`:
    - Valerio Probo, *grammaticus* de Berito (en `ro_grammaticus`): sustantivos, nombres propios, adjetivos y pronombres. Va sin barba: en el 80 los romanos se afeitaban.
    - Quintiliano, *rhetor* (en `ro_paz`): verbos, adverbios, conjunciones y preposiciones.
  - Los sustantivos y los nombres propios se sustituyen en los diálogos (año → annus, Júpiter → Iuppiter). «ayuda» solo se cambia detrás de un determinante.
  - Las demás palabras llevan `nos:1`: se aprenden y se repasan, pero no se sustituyen, porque romperían las frases en español.
  - Cada palabra lleva su enunciado (`en`), y las 19 que ya estaban en la lista general también (`VOC_LAT_EN`).
  - Las preguntas dan 4 opciones: la buena y 3 más de la misma lección.
- Depuración: `__d.RWQ()` expone también `VOC`, `VOCAB`, `vocz`, `vocToggle` y `vocWalk`. Pruebas en `t_voc.js` y `t_voc2.js`. Prueba en `scratchpad/tools/t_voc.js`.

### Novedades de la versión 105: game feel de las recompensas

Módulo «GAME FEEL 3: RECOMPENSAS» (prefijo `rw`, estado en `RW`, tick `rwTick` dentro de `gfTick`). Sustituye el aviso anterior de monedas (`coinFly`, que ya no se usa).
- **Ganar monedas** (`rwObols` → `rwGain`): las monedas saltan desde el diálogo (o desde el centro de la pantalla), quedan un instante en el aire girando y vuelan al monedero. Cada una suena al llegar con una nota que sube por una escala pentatónica.
  - El contador rueda número a número (`rwRoll`, `RW.shown`).
  - El «+N» junto al contador suma las ganancias seguidas en lugar de apilar avisos.
  - Con 10 o más monedas, también brilla la pantalla y suena un acorde.
  - Las monedas son de plata con «ΑΘΕ» en Atenas (el óbolo ático era de plata, con la lechuza y la leyenda ΑΘΕ) y de oricalco dorado con «SC» en Roma (el sestercio de época flavia era de latón y llevaba S·C).
- **Gastar** (`rwSpend`): unas monedas saltan del monedero y caen, suenan unas notas que bajan y un golpe sordo, y aparece «−N» en rojo apagado.
- El tintineo genérico `sfxCoin` se calla cuando ya suenan las monedas, para no duplicar el sonido. El original queda en `sfxCoin0`.
- **Esferas del caballo** (envoltorio de `horseXP`):
  - imán: las esferas a menos de 10 m se acercan al jinete (`rwMagnet`);
  - estallido de chispas y anillo en 3D (`rwBurst`/`rwParts`, que heredan la velocidad del caballo);
  - campana que sube de tono con la racha (5 s entre esferas) y aviso «✦ +1 · racha ×N»;
  - acelerón (`RW.dash`, multiplica la velocidad a caballo) con un golpe de campo de visión (`RW.fov`);
  - barra de experiencia dentro del indicador del caballo (`--hx`);
  - al subir de nivel: fanfarria, relincho, brillo y un gran estallido.
- **Lugar descubierto** (`rwDiscover`): un rótulo grande en el centro, con una línea que se despliega y tres notas de lira. Sustituye al aviso pequeño.
- **Subida de nivel de cualidad**: fanfarria de lira (`rwFanfare`), más larga al nivel 10; el número entra rebotando y un brillo cruza la tarjeta.
- Con «reducir movimiento» del sistema no hay partículas ni acelerón: solo el contador, el aviso y el sonido.
- Depuración: `__d.RWQ()` expone `RW`, `MOUNT`, `HORBS`, `hz`, `horseXP` y `rwDiscover`. Prueba en `scratchpad/tools/t_rw.js`.

### Novedades de la versión 104: progresión por niveles en las cinco cualidades

- **Pantalla de subida de nivel** (`lvlUpShow`/`lvlUpNext`, cola `LVQ`): al ganar un nivel aparece la cualidad, el nivel nuevo, el título, lo que se desbloquea y lo que traerá el siguiente nivel. Si se ganan varios niveles de golpe, salen uno tras otro.
- **Un título por nivel** (`QPROG`, masculino/femenino; `QPROG_R` da el título romano del nivel 10). Se ve en el menú y, con Kléos 2, el nombre del jugador sale en el HUD.
- **Un desbloqueo en cada nivel de cada cualidad** (`qUnlock`), entre otros:
  - Sophía: contador de estelas, transliteración del griego, huellas de Ovidio en el plano, dar clase, una moneda por estela nueva.
  - Lógos: cortesía (−10 % en la primera compra del día), regateo, Asamblea (Bema / Rostra), tribunal (kleroterion / Basílica Julia), simposio o cena.
  - Areté: salto, carga +2 bultos, caballo más rápido, pendientes, juegos de una fiesta y juegos de Olimpia (en Roma, los Sebastá de Nápoles).
  - Eusébeia: ayudar en los sacrificios, augurios de los dioses, oráculo gratis y siempre aceptado, visita a las Vestales en Roma.
  - Kléos: te saludan por la calle, fiado hasta −15, himation de color, busto y casa reconocida, niños que te siguen.
- **Figura del menú que evoluciona** (`progFigure`): crece con los niveles y, al llegar al máximo, se convierte en una estatua de bronce con tu nombre.
- **Cambios respecto a la propuesta:**
  - Eusébeia 4 es «ayudar en los sacrificios»: los particulares no entraban en la cella del templo.
  - Areté 3 es «+2 bultos» en lugar de nadar: el juego no tiene natación.
- **Pruebas** (`t_prog.js`, en Atenas y en Roma): pantalla de subida, todos los objetos `pg:`, las opciones nuevas de los personajes y de los dioses, el HUD y la figura del menú. Sin errores en ninguno de los dos modos.

### Novedades de la versión 103: pruebas completas (dos pasadas) y correcciones

- **Banco de pruebas automático,** en `scratchpad/tools`:
  - `t_qa.js` recorre todos los personajes y sus temas, las estelas, los dioses, los objetos (`EGX_OBJS`), las Musas, los ensayos, la llegada a cada destino, las esferas y los menús. Busca errores de programa, diálogos que no se ven, textos con `undefined`, `NaN` o `null`, identificadores repetidos y estelas superpuestas.
  - `t_story.js` juega el modo Historia entero; si falla una pregunta, prueba otra respuesta.
  - `t_mob.js` comprueba la interfaz en el móvil.
  - Usan `__d.QA()`, que da acceso a las tablas internas.
- **Primera pasada:**
  - Había un identificador de estela duplicado: `horos`. El mojón de hipoteca del campo se llama ahora `horos_hipoteca`, porque el capítulo 1 de la Historia y las curiosidades usan el del Ágora.
  - Las huellas de Ovidio de Delos, Creta, Lesbos y Troya no aparecían, porque esos destinos no tienen `town`. Ahora se colocan junto a `arrive` o al centro, buscando tierra firme.
- **Segunda pasada:**
  - Faltaba la etiqueta `<meta name="viewport">`. claude.ai la añade, pero hace falta para publicar el juego como web independiente.
  - En el móvil en horizontal, el diálogo pasaba 2 px de la pantalla (se arregla con `box-sizing:border-box`).
- **Resultado:** el modo Historia se completa en los dos modos (11 capítulos de Atenas y 11 de Roma) sin errores. En el modo libre no hay errores de programa ni textos rotos.
- **Avisos que no son fallos:** el sueño de Miseno, la boda y las salidas de la pirámide y del Faro abren directamente un minijuego, una escena o un viaje, sin diálogo. Delos, Creta, Lesbos y Troya tienen su propia forma de llegar, sin `arrive`.
- **No probado:** el modo en línea, porque necesita un servidor y otros jugadores.

### Novedades de la versión 102: las Metamorfosis completas (libros XI-XV)

- Se añaden 32 episodios de los libros XI a XV (`OVID.push` en el módulo de Ovidio). En total hay 104.
- Las huellas son ahora 40 en Atenas y 34 en Roma:
  - En Roma: la roca Tarpeya, la cabaña de Rómulo, la isla Tiberina (Esculapio), el templo del Divino Julio (César), la Porta Capena (Egeria), Cástor (Vertumno, en el Vico Tusco), Campania (la Sibila, Circe, Céix), Apulia (Diomedes), Etruria (Tages y Cipo), Regium (Escila, Galatea, Míscelo, Pitágoras) y Cartago.
  - En Atenas: Lesbos, Sardes (Midas), Traquis (junto a las Termópilas), Calcis (Áulide, Glauco), Salamina (Áyax), Delos (Anio), Samos (Pitágoras), Troya y Tesalia.
- El catálogo recoge los quince libros, y el ensayo tiene un párrafo nuevo sobre los últimos.
- **Ya no queda pendiente** ningún libro de las Metamorfosis.

### Novedades de la versión 101: las Metamorfosis de Ovidio (libros I-X)

Fuente: la edición de Gredos de J. C. Fernández Corte y J. Cantó Llorca (libros I-V, 2008; VI-X, 2012). Los resúmenes están escritos para el juego; no se copia la traducción. Todo está en el módulo «LAS METAMORFOSIS DE OVIDIO».

- **El catálogo:** `OVID` tiene 72 episodios de los libros I a X. Cada uno lleva libro (`l`), versos (`v`), título (`t`), en qué se transforma (`c`), un resumen (`s`) y dónde está su huella en cada modo: `A` en Atenas y `R` en Roma. La forma es `['p', estela, dx, dz]` o `['i', destino, dx, dz]`; en los destinos, el desplazamiento se multiplica por 2,4 alrededor de `town`.
- **El ensayo `OVID_ESSAY`:** se añade a la biblioteca en los dos modos. Habla de la vida de Ovidio, del poema, de su estilo, de su recepción (Bersuire, Tiziano, Bernini, el Siglo de Oro) y avisa del anacronismo en el modo Atenas.
- **Las huellas** (`ovidSetup`, `OVID_OBJS`): un pedestal con un rollo y una luz verde, con acción `ov:<id>`, que atiende `ovidAct`.
  - En Atenas hay 31 y en Roma 17, colocadas en lugares de mitos romanos: el Iseo, Apolo Palatino, Hércules Vencedor, el teatro de Marcelo (los Nióbidas), el Marsias del Foro, el Po, Nápoles y la Gran Madre.
  - Cada huella da +1 Sophía la primera vez y desde ella se puede abrir el catálogo (`ovidCatalog`).
  - Si se encuentran todas: título, +4 Sophía, +2 Kléos y 15 monedas. El progreso se guarda en `ovz()` (`state.ovid`).

### Novedades de la versión 100: urbanismo de Atenas y Roma

Los datos fijos están junto a `GATES` («el Pireo: marco de referencia…» y `ATH_DEMES`). Lo que se construye al empezar la partida está en el módulo «URBANISMO» (`urbSetup`, `pireoPlus`, `athUrbPlus`, `romaUrbPlus`, `urbTick`).

- **El terreno de Atenas, corregido:** antes nunca bajaba de la cota 0 (`rawH` acababa en `Math.max(h,a)`), así que el mar no se veía en la costa. Ahora puede quedar por debajo del mar solo mar adentro (s>0) o en las dársenas del Pireo (`pirWet`). La malla lejana se hunde 40 m en el Pireo (antes, 8) para que no asome sobre las dársenas.
- **El Pireo:**
  - Se ubica con `PIR0`, un punto de la costa en la línea de los Muros Largos, y `pirP(u,v)`: u a lo largo de la costa hacia el sureste, v tierra adentro.
  - Zea y Muniquia son dársenas excavadas (`PIR_BAYS`, `pirCarve`) con canal al mar. La colina de Muniquia se levanta en el terreno.
  - Edificios: muelles con torres en el Cántaro, cuatro pórticos del Emporio (con el Deigma) y la cuadrícula de Hipódamo, con manzanas de 2 × 2 casas y el ágora de Hipódamo con sus mojones. En Zea hay 13 cobertizos y una trirreme, y en Muniquia, 6 cobertizos. En la colina está el santuario de Bendis.
  - Estelas: el ágora, Zea, Muniquia, Bendis y las calles a cordel. La zona del puerto ahora es todo el Pireo (`pirIn`).
- **Los barrios de Atenas** (`ATH_DEMES`, `demeAt`): Melite, Coile, Colito, Cidateneo, Escambónidas, el Cerámico interior y Diomea.
  - En `buildHouses`, las casas de cada barrio se colocan en una cuadrícula con su propia orientación (a), su tamaño de casa (p), su proporción de casas de dos pisos (two) y una calleja cada blk casas y cada dos filas. Fuera de los barrios, siguen como antes.
  - Al entrar en cada barrio sale su nombre (zonas `demo_*` en `ZONES`), y cada uno tiene su estela.
- **Puertas y colinas de Atenas:** en `GATE_ANG` hay cuatro puertas nuevas: eria, diomea, halade y melitides. Las puertas que no son el Dípilon ni la Sagrada tienen estela con su nombre (`GATE_INFO`). Las colinas de las Musas y de las Ninfas también tienen estela.
- **Roma:**
  - El incendio del 80, en el templo de Júpiter, el Panteón, el templo de Isis y el teatro de Pompeyo: andamios, humo animado (`URB.smoke`), escombros, obreros y la estela `incendio80` (Dion Casio LXVI 24; Suetonio, Tito 8).
  - El templo de Vespasiano en obras, con una grúa de rueda, y obras en el Palatino.
  - Las Termas de Nerón, los arcos de los acueductos (la futura Porta Maggiore) y el campamento de los pretorianos. Antes de construir, `urbFree` comprueba que no choquen con otros edificios.
  - Puentes: se añade el puente Emilio (`bridge` en z=380), y los puentes Fabricio, Cestio, Emilio, Sublicio, de Agripa y de Nerón tienen estela con su nombre.
- En `__d` hay ahora funciones de prueba nuevas: `placeXZ`, `URB`, `PIR0`, `pirP`, `PIR_BAYS`, `ATH_DEMES`, `GATES`, `terrainH`, `floorAt`, `rawH`, `SEA_`, `TI` y `SC`.

### Novedades de la versión 99: artistas del 386 a.C. y del 80 d.C., con misiones de las cualidades

Todo está en el módulo «ARTISTAS DEL 386 a.C. Y DEL 80 d.C.». El estado se guarda en `artz()` (`state.art`), con las claves `st`, `ready`, `done` y `zeno`.

- **Cómo está montado:**
  - Los personajes se definen en `ART_A` y `ART_R`, y `artSetup()` los coloca: cerca de una estela con `artAnchor(id)` o de un destino con `artIsl(id)`.
  - Se habla con ellos a través de `egxObj`, con acciones que empiezan por `ar:` (Atenas) o `ro:` (Roma). Las atiende `artAct`, desde `egxAct0`.
  - Cada misión da puntos de una cualidad con `artMark(clave, cualidad, n)`, solo una vez. Los retos usan `finDuel`.
- **Atenas:**
  - Cefisodoto (en el Cerámico), con el niño Praxíteles y el boceto de la Eirene. Puedes posar para él (Areté 5 o más; +3 Areté) y encargarle tu estatua (60 óbolos, 3 días).
  - Parrasio (en la Stoa Pintada): un reto de ilusión pintada y Timantes (+3 Sophía).
  - Teodoto en Epidauro: la obra según las cuentas de IG IV² 1, 102 y los 900 dracmas de Timoteo (Lógos 4 o más; +3 Lógos y 10 óbolos).
  - Pánfilo de Sición, en Corinto: una lección de dibujo (+2 Sophía).
  - Un corego, junto al teatro: las Dionisias, solo en Elafebolión (se puede esperar a que llegue). Es el año 386, el de la primera reposición de una tragedia antigua (IG II² 2318) (+3 Kléos y +2 Eusébeia).
- **Roma:**
  - Un retratista en la Subura: las imágenes de los antepasados (Polibio VI 53; +2 Pietas) y un retrato pintado a la encáustica (80 sestercios).
  - Estacio, junto al templo de la Paz: una lectura pública (+3 Eloquentia).
  - Silio Itálico, en Campania: la tumba de Virgilio (+3 Pietas).
  - Un esclavo de Tito, junto a las termas de Tito: el Laocoonte, con una maqueta del grupo (Plinio XXXVI 37; +3 Sapientia).
  - Paris, junto al teatro de Pompeyo: adivinar mitos de pantomima (+2 Sapientia y +2 Fama).
  - Un pintor anciano, junto a la Casa Dorada: Fábulo y los grutescos (+2 Sapientia).
  - Un broncista, junto al Coloso: Zenodoro y el Mercurio de los arvernos. Hay que viajar a Lugdunum; lo detecta `artTick` (+2 Fama).
- **La obra encargada:** `artTick` comprueba si ya está hecha, y `artHouse()` la coloca en la casa: en Atenas, una estatua en el patio; en Roma, un retrato en la pared oeste.

### Novedades de la versión 98: misiones finales de todas las cualidades, carrera en 3D y recompensa de los sueños

El código está en los módulos «MISIONES FINALES DE LAS CUALIDADES» (`finz()`, que guarda en `state.fin`, y `FZ`) y «TODAS LAS ESFERAS DE SUEÑO».

- **Zonas especiales:** están en x 9500 y a 4200 m de altura. La pista de la carrera va en z 3000; el Telesterion (Atenas) y los Infiernos (Roma), en z 6000. `fzIn` las detecta y `finTick` ajusta la luz. `checkZone` y `regionName` las reconocen.
- **Carrera en 3D** (`race3d`, `raceTick`, `raceEnd`), en vez del minijuego en 2D:
  - Usa el mismo modelo de la carrera (`MG_ATAL.tick` y `MG_CAMILA.tick`), con 1 paso igual a 0,6 m.
  - Se corre solo: Mayús o W para esprintar, Espacio para lanzar una manzana. En pantalla táctil hay botones Esprint, Manzana y Abandonar.
  - Escenarios: en Atenas, un estadio con taludes, público y líneas de salida y llegada de piedra (balbís); en Roma, un trigal con un olivo en la meta.
  - El panel se llama `#race3d`; `MG.d` apunta a él para que funcione `mgSay`.
- **Lógos:**
  - Atenas: Gorgias en Larisa (`gorgiasAct` y `gorgiasDuel`). Cuatro temas y el reto del elogio de la sal: cuatro partes del discurso; con 6 puntos de 8 ganas. Solo se puede intentar una vez al día.
  - Roma: Quintiliano propone el juicio («¿Tienes un caso para mí?», `juicioAct`). Es una querella por un testamento ante los centúnviros, contra Régulo: cinco partes; con 8 puntos de 10 ganas.
- **Eusébeia:**
  - Atenas: los heraldos del Eleusinion (`eleusisAct`). Solo en el mes de Boedromión; se puede esperar hasta que llegue. La secuencia del 15 al 19 de Boedromión termina en un Telesterion en 3D (`telBuild`, `telAct`), con gradas, 42 columnas, el Anactoron y el hierofante. La revelación solo cuenta lo que se sabe.
  - Roma: el antro de la Sibila, junto a la ciudad de Latium et Campania (`sibilaAct`). Es un recorrido en 3D (`infBuild`, `infAct`): la rama dorada, el Averno, el vestíbulo, Caronte, Cerbero, Dido, el cruce, la puerta de Proserpina, los Elíseos con Anquises y las puertas del Sueño. El avance se guarda en `finz().sibSt`.
- **Kléos:**
  - Atenas: decreto de la Asamblea, que se pide al prítano Eucles (`decretoAct`). Concede proxenía, euergesía, énktesis y sítesis. Se coloca una estela en vivo, `decreto_pj`, junto al prítano, y se vuelve a crear al cargar la partida (`decretoStele`). `fDeeds()` resume tus hazañas.
  - Roma: Marcial lleva a los juegos inaugurales del Anfiteatro Flavio (`coliseoAct`): Carpóforo, Prisco y Vero, las bolas de madera de Tito y un epigrama con tu nombre.
- **Recompensas:**
  - Cada misión: +4 en su cualidad, +4 Kléos y unas 10-20 monedas.
  - La descripción de cada cualidad en el menú (`fx` de `QUAL`) dice ahora qué misión hay en el nivel 10.
- **Todas las esferas de sueño** (`dreamCheck`, `dreamFinale`, `dreamTick`):
  - Al completarlas aparece Hipnos en Atenas (Teogonía, Lemnos y las puertas de cuerno y de marfil) o la casa del Sueño de Ovidio en Roma (Somno, Morfeo, Fobétor y Fantaso).
  - Recompensa: 25 monedas, +3 Sophía y +3 Eusébeia. Además, cada mañana un sueño verdadero dice dónde está una persona que aún no conoces (`state.dreamGift`).
  - Las esferas con recompensa propia, como la boda, ahora también cuentan como vistas.
- **Corrección importante:** `egxAct` es ahora un envoltorio de `egxAct0` que muestra el diálogo si ha quedado abierto. Antes, los diálogos de la granja, el oráculo, la caverna y Atalanta podían abrirse sin verse en pantalla.
- **Aviso:** antes de añadir funciones de nivel superior, comprueba que el nombre no exista ya. `fNeed` ya existía, chocó y el juego dejó de cargar.

### Novedades de la versión 97: carrera contra Atalanta (Atenas) y Camila (Roma)

Todo está en el módulo «ATALANTA (Atenas) Y CAMILA (Roma)». El estado se guarda en `atz()` (`state.atal`).

- **Dónde están:** `atalSetup()` coloca a la heroína. Atalanta está junto al estadio de Olimpia, en la estela `estadio_olimpia`; Camila, junto a la ciudad de Latium et Campania. Se habla con ellas a través de un `egxObj` cuya acción es `at:atalanta`, y responde `atalAct`. Cada una tiene cuatro temas: Atalanta, la caza de Calidón, los pretendientes y las Hereas de Olimpia (Pausanias V 16); Camila, la *Eneida* VII y XI.
- **La carrera:** solo con Areté o Virtus 10. Es un minijuego del sistema MG, hecho con `atalRace(rival)`, que da `MG_ATAL` y `MG_CAMILA`. Se ve de lado, mide 420 pasos y hay que administrar el aliento: W para esprintar, Espacio para lanzar una manzana.
  - Ritmos de la rival: Atalanta, 10,8 (más 0,6 si vas por delante); Camila, 9,85 (más 0,3).
  - Simulado: a Atalanta no se le gana sin manzanas con ninguna estrategia. A Camila solo se le gana administrando bien el aliento.
  - Los datos de la carrera se llaman `G.pd` y `G.ad`. No hay que usar `G.d`, porque en el minijuego `G` es `MG` y `MG.d` es el elemento de la pantalla.
- **Las manzanas:**
  - Afrodita (`atalGodOpts`, dentro de `renderGodOpts`) da las tres manzanas de Támaso si tienes Areté 10 y Eusébeia 5. Solo hacen efecto si Atalanta está a menos de 16 pasos.
  - Si ganas usándolas, quedas en deuda: hay que darle las gracias a Afrodita. Si pasan 3 días sin hacerlo, `atalTick` aplica el castigo de Hipómenes en versión suave: −12 puntos de Eusébeia y un sueño de leones (Ovidio X 681-704).
- **Recompensas:** si ganas, corona y epigrama, +6 Kléos, +4 Areté y 10 monedas. Si pierdes, +3 Areté y +2 Kléos la primera vez.
- **Cambio en el sistema MG:** los minijuegos marcados con `own:true` no reciben la recompensa genérica de los sueños y usan sus propios textos en los botones («¡A correr!», «Repetir la carrera»).

### Novedades de la versión 96: la caverna de Platón y el Sueño de Escipión

Todo está en el módulo «LA CAVERNA DE PLATÓN (ATENAS) Y EL SUEÑO DE ESCIPIÓN (ROMA)». El estado se guarda en `CAV`, `cavz()` (`state.cav`) y `somz()` (`state.som`).

- **Dónde se construye:** solo cuando se entra (`buildCave`, `buildSomnium`), en x 9500, z −3000 y a 4200 m de altura, por encima de cualquier relieve. Los objetos con los que se interactúa son `egxObj`, con los prefijos `c:` y `sm:`, y los atiende `cavAct`. `cavTick`, dentro de `gfTick`, controla la luz: la caverna oscura con fuego, la subida que se aclara, el prado de día, las Ideas en blanco y, en Roma, el espacio estrellado sin mar. Al salir, `cavRestore` lo devuelve todo. `checkZone` y `regionName` reconocen las zonas nuevas.
- **Requisitos** (`cavReq`):
  - Atenas: Sophía 10, amistad íntima con Platón (afinidad 100) y haber terminado la Academia como discípulo.
  - Roma: Sapientia 10, amistad íntima con Epicteto y haber terminado la escuela de Musonio o la de Epicteto.
  - La opción aparece en el diálogo de Platón o de Epicteto (`cavOpts`), que explica lo que falta.
- **La caverna de Atenas** sigue la *República* VII y los cuatro grados de la «línea dividida» (VI 509d-511e):
  - Empiezas encadenado delante de la pared. Las sombras son las de figuras que pasan detrás de un murete, y tres de ellas llevan el nombre de personas que has conocido. Rompes las cadenas y te deslumbra el fuego.
  - Subes por una cuesta de 60 escalones que se va aclarando. Fuera, la luz te ciega. Hay que mirar el estanque de los reflejos y resolver el problema del *Menón* (el cuadrado doble se construye sobre la diagonal); entonces se abre la puerta de la luz.
  - En el mundo de las Ideas hay seis: el Caballo (con la burla de Antístenes), el Árbol (*Fedón*), lo Bello (*Banquete*), los cinco sólidos (*Timeo*), la ciudad justa (con las mujeres guardianas) y la llanura del Olvido (mito de Er, que enlaza con Mnemósine). Con cuatro de ellas puedes mirar el Sol, la Idea del Bien.
  - Al final hay que volver a bajar e intentar liberar a un prisionero. Funciona hacer preguntas, como Sócrates; con Lógos 6 el prisionero llega a girar la cabeza.
  - Recompensa: el título de philósophos, +4 Lógos, +5 Kléos, +2 Eusébeia y 10 óbolos.
- **Las anacronismos se avisan en el juego:** la *República*, el *Banquete* y el *Timeo* se escribieron después del 386.
- **Vínculos con el resto del juego:**
  - Delfos da una pista con Sophía 7 (`cavHint`, dentro de `oracAct`).
  - Antístenes, con «¿Qué piensas de las Ideas de Platón?», cuenta su burla de la caballeidad.
  - Aristóteles niño, cuando ya has terminado la caverna, propone que la forma está en las cosas.
- **El Sueño de Escipión en Roma** sigue a Cicerón, *República* VI 9-29:
  - Caminas por la Vía Láctea, rodeado de estrellas. Ves la Tierra con sus cinco zonas (el punto dorado es Roma) y las esferas que giran a su alrededor.
  - El Africano tiene cuatro temas, Paulo uno, y además está la música de las esferas, que suena de verdad (`cavMusic`).
  - Para despertar con recompensa hay que haber visto seis cosas. Recompensa: +4 Pietas, +3 Eloquentia y 10 sestercios.
- En `__d` hay ahora funciones de prueba nuevas: `cavEnter`, `cavz`, `somz`, `cavAct`, `CAV` y `cavIn`.

### Novedades de la versión 95: las cualidades tienen efectos claros

Los efectos están en el módulo de cualidades (`QUAL`, cuyo campo `fx` es el texto que se ve en el menú) y en los puntos donde se aplican. «Nivel − 1» significa que en el nivel 1 no hay ventaja.

- **Sophía / Sapientia:** como antes, más monedas por lección desde el nivel 3. Desde el nivel 4, en la pregunta de una lección aparece tachada y desactivada una respuesta falsa (`startQuiz`).
- **Lógos / Eloquentia:** el regateo. Rebaja un 2 % por cada nivel por encima del 1 lo que compras como mercader y sube un 2 % lo que vendes. El redondeo te favorece, y el motivo se lee junto al precio. Está en `comLogos`, que usan el `comPrice` de Atenas y el de Roma. También suben los precios de venta de la granja (`fPrice`).
- **Areté / Virtus:** un 2 % más de velocidad a pie por cada nivel por encima del 1 (antes era un 1 %). Las fuerzas máximas de la granja suben de 100 a 100 + 5 × (nivel − 1), con `fMax()`.
- **Eusébeia / Pietas:** como antes, una moneda más de los dioses y los sueños desde el nivel 3. En Delfos, la probabilidad de que el dios acepte la consulta es del 75 % + 2,5 % por cada nivel por encima del 1, con un máximo del 97 %. Desde el nivel 6, las primicias de la granja dan dos medidas de más en la cosecha en vez de una.
- **Kléos / Fama:** desde el nivel 3, la gente de la calle te reconoce, se vuelve hacia ti y te saluda por tu nombre (`qualGreet`, dentro de `qualTick`). Hay tres grupos de frases según el nivel (3-4, 5-7, 8-10), distintos en Atenas y en Roma. `klBonus()` da una moneda más por cada dos niveles por encima del 1 en los encargos de misiones y de los vecinos de la granja.
- En `__d` hay ahora funciones de prueba nuevas: `qualGreet`, `qLv`, `qAdd`, `fPrice`, `fMax`, `klBonus`, `startQuiz`, `openDialog`, `getS`, `getW`, `getP`, `getNPCS`, `setUi` y `comModeT`.

### Novedades de la versión 94: Delfos y las Termópilas, ampliados

Todo está en el módulo «DELFOS Y LAS TERMÓPILAS»: `delfosPlus`, `termoPlus`, `oracAct` y `delterTick`. Se llaman después de `farmSetup` en el arranque del mundo.

- **`placeLive`, función nueva:** crea al momento una estela (la añade a `PLACES` y a `signObjs`). `place()` solo apunta los datos en `PLACES`, y las estelas se dibujan una vez al construir el mundo, así que las que se añadían después no aparecían. Por eso no se veía la estela de la granja; ahora usan `placeLive` la granja, Delfos y las Termópilas.
- **Delfos** (Pausanias, libro X; Heródoto I; siempre con lo que ya existía en el 386):
  - La Vía Sacra en zigzag, empedrada, desde la puerta del recinto hasta el templo.
  - A la entrada, frente a frente: los almirantes de Lisandro (Egospótamos, 405) y el grupo de Maratón de Fidias.
  - Los tesoros de los sifnios (con dos cariátides), de los sicionios y de los corintios (el oro de Giges y Creso), además del de los atenienses.
  - La roca de la Sibila, la esfinge de los naxios sobre su columna y el altar negro de los quiotas.
  - El auriga de bronce (se cuenta su entierro en el 373), la lesche de los cnidios con las pinturas de Polignoto y las rocas Fedríades (Esopo).
  - Atenea Pronaia: el templo antiguo y el tolo, que empieza a construirse por estos años; los bloques esperan en el suelo.
  - Peregrinos con su cabra y un sacerdote. Un citaredo con su público, y se oye la lira al acercarse.
  - Una estela de los Juegos Píticos: en el 386 se celebran.
- **Consultar el oráculo** (`oracAct`, en la puerta del templo): se paga el pelanós (4 óbolos, según el acuerdo de Delfos con Fasélide) y se rocía la cabra con agua fría; si no tiembla, el dios no habla ese día (una probabilidad de un 25 %). Luego eliges entre tres preguntas. Las respuestas son inventadas y se avisa de ello; se añaden tres oráculos reales (Creso, el muro de madera, Sócrates). La primera consulta da +2 Eusébeia.
- **Termópilas** (Heródoto VII 175-233):
  - Un camino de tierra a lo largo del paso.
  - Paredes de roca del Calídromo junto al camino, más cerca en las tres «puertas» (occidental, del medio y oriental), cada una con sus pilares y su estela. Quedan huecos para Antela, las aguas calientes, el Colono y la senda de Anopea.
  - Bañistas en las aguas calientes, costras blancas de azufre y el altar de Heracles.
  - Un recorrido de la batalla en seis estelas: el primer día con los medos, los Inmortales, el segundo día, Megistias, el tercer día delante del muro, y los tespios y los tebanos.
  - El puesto de los focidios entre robles, en el monte (Heródoto VII 217-218).
  - La estela de los tres epigramas, con las cifras de Heródoto comparadas con las estimaciones actuales.
  - Viajeros con burros por el camino. En otoño, delegados de la Anfictionía en Antela.

### Novedades de la versión 93: el menú del juego (cualidades y opciones)

Todo está en el módulo «MENÚ DEL JUEGO», antes de `startGame`: `gmOpen`, `gmClose`, `gmRender` y `gmDo`.

- **Cómo se abre:** Tab, o Esc cuando el ratón no está capturado; el icono nuevo `bMenu`, el primero de la barra; o, en el móvil, el botón de menú, que antes abría la hoja `#mSheet`. Mientras está abierto, `ui` vale `'gmenu'` y se ocultan el HUD, los controles táctiles y los avisos.
- **Izquierda:** una figura humana en SVG (túnica y manto, el brazo levantado como un orador, una corona de laurel) con las cinco cualidades alrededor (`GM_POS`), cada una unida a una parte del cuerpo:
  - Sophía, a la cabeza.
  - Lógos, a la boca.
  - Eusébeia, al corazón.
  - Areté, al brazo.
  - Kléos, a la corona.
- **Cada tarjeta** muestra el nombre según el modo (griego o latino), la palabra griega, el nivel (`qLv`) y una barra con los puntos hasta el siguiente nivel (`QLV`). Al tocarla, abajo aparece qué es, cómo se sube y qué efecto tiene.
- **Tarjeta de resumen:** monedas, día y mes, lecciones aprendidas y lugares conocidos.
- **Derecha:** «Volver al juego» y una cuadrícula de botones con icono:
  - Diario, plano y biblioteca.
  - Pasar unas horas, vista, antorcha y caballo.
  - Sonido y balanceo de cámara, que muestran si están activados.
  - Pantalla completa y controles (este, solo en escritorio).
  - Guardar, cargar y cambiar de época.
- **Disposición:** en vertical, la figura queda arriba y los botones abajo; en horizontal bajo, las dos columnas, más compactas.

### Novedades de la versión 92: vecinos, fiestas del campo y la agricultura en la biblioteca

Todo está en el módulo «LA GRANJA 2», antes de `startGame`.

- **Vecinos** (`NBS`, `nbSpawn`, `nbTalk`; estado en `state.farm.nb`). Aparecen cuando la granja es tuya.
  - Atenas: Eufrósine (viuda, abejas y gallinas) y Cármides (viñas y un caballo). Roma: Fannia (flores y verduras de la vía Apia) y Sexto (liberto con un molino de mulas).
  - Cada uno hace encargos (`nbReq`): 2 o 3 unidades de un producto, en 7 días. Pagan el doble del precio más 2.
  - Cada encargo cumplido da +1 corazón, hasta 5.
  - Regalos a los 3 corazones: un perro guardián que pasea por la finca o una hoz de hierro (cosechar cuesta 5).
  - Regalos a los 5 corazones: colmenas, el buey de Cármides o el molino de Sexto (el trigo se vende un 50 % más caro).
  - Frases propias de cada vecino.
- **Fiestas del campo** (`FRUR`, `frurNow`, `frurDo`): se celebran una vez al año en el altar de la finca, y un aviso las anuncia al llegar el mes.
  - Atenas: Proerosia (arar cansa 3), Tesmoforias (semillas), Haloa (bendición de la cosecha) y Talisias (+1 corazón a los vecinos).
  - Roma: Sementivae (semillas), Cerealia, Robigalia y Ambarvalia (bendición), Vinalia rustica (+3 cestas de uva), Consualia (el grano vale más ese mes) y Saturnales (+1 corazón).
  - Cada fiesta lleva su texto y sus fuentes (Ovidio, Fastos; Catón 141; Teócrito VII; Varrón; Macrobio…).
- **Biblioteca:** el ensayo `agricultura` en `ESSAYS` (Atenas) y en `ROMA_ESSAYS` (Roma). Trata de cultivos, barbecho y rotación, aperos (arado, hoz, era, trillo, vallus, trapetum, prensa), almacenaje y calendario.
- **Libro de la finca:** ahora muestra los vecinos, sus encargos y las fiestas del mes.

### Novedades de la versión 91: la granja heredada (en los dos modos)

Todo está en el módulo «LA GRANJA», antes de `startGame`. El estado se guarda en `state.farm` (`farmz()`). La granja se monta con `farmSetup()` y `farmOfferSetup()`, que se llaman después de `m386Setup`. Los objetos son de tipo `egx`, con `act` que empieza por `f:`; `egxAct` los pasa a `farmAct` o, en el caso de la ofrenda, a `farmOffer`. `farmTick` se llama desde `gfTick`.

- **Lugar** (`farmFind`): una zona llana y libre fuera de la ciudad, buscada en anillos alrededor de la Academia (Atenas) o de la vía Apia (Roma). Una estela, `granja`, la marca en el plano, y al pasar a menos de 70 m sale un aviso.
- **Misión de amistad** (`farmerTalk`; estados de `f.q` del 0 al 5):
  1. Segar tres parcelas maduras del campesino.
  2. Llevar las primicias al Eleusinion (Atenas) o al templo de Saturno (Roma).
  3. Ganarse su amistad (`f.aff` hasta 5 corazones), charlando una vez al día o regalándole vino.
  4. Recibir la granja. En Atenas, un arriendo vitalicio a través del sobrino, porque un forastero no puede poseer tierra en el Ática. En Roma, un fideicomiso, porque un peregrino no puede recibir legados (Gayo II 285).
  - Los campesinos: Lamprias, del demo de Colono, cuyo hijo murió en la guerra de Corinto; y Ofelio, veterano de la Legión V, cuyo hijo murió en Judea.
- **Parcelas:** 8, y 12 con la mejora. Ciclo: sin arar, arada, sembrada y madura; tras cosechar vuelve a «sin arar».
  - `CROPS` según el modo, con los meses de siembra reales, los días que tardan, si necesitan riego y la cosecha.
  - De noviembre a marzo llueve (`farmRain`) y no hace falta regar.
  - Los cultivos con riego solo crecen los días en que se riegan.
- **Árboles:** aceitunas (noviembre a enero), uvas (agosto y septiembre) e higos (julio y agosto), una vez por temporada.
- **Animales:** gallinas (huevos por docenas), cabras (leche) y colmenas (miel cada tres días).
- **Cocina de la casa:** queso con 3 de leche; aceite con 3 aceitunas; mosto con 3 uvas, que en 5 días se hace vino.
- **Cansancio:** fuerzas 100. Arar cuesta 12 (5 con buey), sembrar 5, regar 4 y cosechar 8. Dormir en la casa avanza hasta las 6 de la mañana siguiente y las recupera.
- **Almacén:**
  - Vender todo, a un 50 % más los días de mercado (noumenia o nundinae).
  - Comprar semillas (1 cada saco).
  - Mejoras: buey (40), 4 parcelas más (30), colmenas (25), dos gallinas (8) y una cabra (12).
- **Altar:** ofrecer primicias da +1 de cosecha durante 15 días y Eusébeia.
- **Libro de la finca y consejo del mes** (`FMES`): Hesíodo, Trabajos y días, en Atenas; Catón, Varrón, Columela y Virgilio en Roma.

### Novedades de la versión 90: equivalentes romanos (año 80)

Todo está en el módulo «equivalentes romanos», antes de `startGame`. La época se elige después de cargar el código, así que lo que depende del modo se prepara al usarlo: `comMode()` cambia `COM`, `COM_EV` y `comPrice` la primera vez que se abre el comercio en Roma.

1. **Comercio desde el Emporio:**
   - Compras: trigo a Himilcón (Cartago), aceite de la Bética a Quinto Fulvio (Corduba), garum a Himilcón de Gades y plomo a Eros (Carthago Nova). Vendes a Tiberio Claudio Eutiques (`mercader`).
   - Estaciones: mar cerrado en invierno (trigo caro), flotas del trigo en verano, aceituna en invierno.
   - Noticias del puerto: la flota de Alejandría en Puteoli, los cien días de juegos de Tito, la reconstrucción tras el incendio del 80 (plomo), el garum de moda, piratas, el prefecto de la annona.
   - Textos según el modo con `comTxt()`: la annona; Josefo, sobre África y Egipto; Claudio, sobre los mercaderes; Vegecio, sobre el mar cerrado.
2. **Sueños jugables:**
   - `MG_CIRCO`, desde Félix (`auriga`): tres vueltas al Circo Máximo con cuatro facciones. Hay látigo con cansancio de los caballos, derrapes en las curvas por encima de 14, naufragium al chocar con la spina o el muro a más de 12, y delfines que cuentan las vueltas. El piloto de prueba gana más o menos la mitad de las veces.
   - `MG_MISENO`, desde Plinio: huir hacia el norte con tu madre de la mano, sacudiéndote la ceniza con Espacio, esquivando las piedras pómez y con una oscuridad creciente (Cartas VI 16 y 20).
3. **El debate de Claudio sobre los galos** (`CLAUDIO_R`, `claudioDlg`), desde Tácito (Anales XI 23-25; tabla de Lyon). Argumentos reales: Atta Clauso, los senadores de Vienne, los Balbos, Esparta y Atenas frente a Rómulo, los cien años de lealtad, el oro galo. Termina con «Todo lo que hoy se cree antiquísimo fue un día nuevo».
4. **Patrias** (`ORIG.roma`): Cartago, Gades, Lugdunum y Antioquía, con su estación y su paisano.
5. **Modo Historia, capítulo 11: «El pan de Roma»,** con Tercia. Recorrido: Emporio, Cartago (Himilcón), Alejandría (Herón) y vuelta. Tres preguntas: Josefo y los 8 meses; Egipto cerrado a los senadores; «pan y circo».
6. **Misiones** (`m386OptsR`, `m386SetupR`, `m386ActR`):
   - El tubo de plomo de las Termas de Tito, para Eros.
   - Las ánforas de los almacenes de Galba, para Quinto Fulvio; habla del monte Testaccio.
   - El oro de Las Médulas y el tesoro de Saturno, para Pintaio (Plinio XXXIII 78).

### Novedades de la versión 89: el game feel, también ajustado para Roma

- `gfInCity()` usa `romaInUrbs` en Roma e `insideWalls` en Atenas. Antes, en Roma se consideraba «fuera de la ciudad» todo el mapa: las cigarras y las luciérnagas salían en pleno Foro.
- En Roma, dentro de la Urbs, los pasos suenan a piedra (calles empedradas) y no se levanta polvo.
- Comprobado en el modo Roma: perros curiosos, gallinas, palomas, viento, diálogos que se escriben, monedas y la cinemática de la yegua con Félix.

### Novedades de la versión 88: game feel 2 (nueve ideas)

Todo está en el módulo «GAME FEEL 2», antes de `startGame`. `gf2Tick` se llama desde `gfTick`.

1. **Caballo vivo** (`horseAlive`):
   - Cuatro ritmos de cascos según la velocidad (`GAITS`: paso, trote, medio galope y galope), con salpicaduras en el agua y marcas en la arena.
   - En `audioTick` ya no suena `sfxHoof`.
   - La cola y la crin se mueven.
   - Parado, resopla y sacude la crin.
   - Al frenar de golpe a galope, derrapa con polvo y ruido.
2. **Animales que reaccionan** (`animalsReact`, `dovesTick`):
   - Gallinas, gallos, gansos, patos y codornices huyen aleteando y cacareando si corres hacia ellos o vas a caballo. Cabras, ovejas y cerdos se apartan.
   - Aparecen bandadas de palomas delante de ti, picoteando, y echan a volar al acercarte.
3. **Huellas** (`MARKS`, `footStep`): pisadas alternas en la arena (y en la tierra de los destinos) y marcas de cascos. Se borran a los 20-28 s; como máximo hay 140.
4. **Agua:**
   - Salpicaduras (`splash`, con partículas `PFX` y gravedad) y ondas que se abren (`ripple`) al andar o galopar por el agua.
   - Espuma en la orilla del mar (`foamTick`): busca la franja de terreno a la altura del mar, hasta 48 m de ti.
5. **Saludos** (`greetTick`): algunos paseantes levantan la mano y te saludan con un bocadillo de texto («¡Salud!», «¡Salve!»…), como mucho uno por persona cada minuto. Los vendedores del mercado levantan el brazo al pregonar.
6. **Viento** (`windMat`, `windTick`): las copas de los árboles (papel `foliage`, piezas `T_*`) se mecen en la GPU con rachas. Se inyecta en `placeModules`. Con la tecla K (balanceo desactivado), el viento es más suave.
7. **Diálogos que se escriben** (`TW`, un `MutationObserver` sobre `#dBody`):
   - Unos 110 caracteres por segundo en tiempo real; tocar el texto lo completa.
   - Respeta las etiquetas del texto (glosario, cursivas), y con el balanceo desactivado no se usa.
   - Nota de lira al abrir cada diálogo.
8. **Monedas que vuelan** (`coinFly`): de 1 a 6 monedas viajan hasta el contador de óbolos, que late al recibirlas.
9. **Noche y verano** (`nightTick`):
   - Luciérnagas que parpadean en las noches de verano (meses 4-7, es decir, de Targelión a Metagitnión), fuera de la ciudad.
   - Humo de los hogares por la mañana (6-9 h) y al atardecer (18-20:30 h), saliendo de algunas casas. Las casas griegas no tenían chimenea: el humo salía por el tejado.

### Novedades de la versión 87: polvo y la cinemática de la yegua

- **Polvo** (`DUST`, `dustPuff`, `dustGame`, llamado desde `gfTick`):
  - Nubecillas que salen de detrás de los cascos al galopar (a más de 7 de velocidad) sobre tierra o arena. En arena y desierto son más claras. No salen sobre pavimento, agua ni campos verdes.
  - Al correr a pie por la arena, una nubecilla de vez en cuando.
  - Se reutilizan 70 sprites como máximo.
- **Cinemática de la yegua** (`mareCine`, `cineTick` y `cineEnd`, sustituyen a la desaparición al atraparla):
  - Bandas negras y subtítulos. La yegua (montada con `mareRig`, que tiene un pivote en las patas traseras) se encabrita y patea con las manos mientras relincha (`sfxNeigh`), cae con un golpe y una nube de polvo (`sfxHoofThud`), se calma, se gira hacia su dueño y se va trotando, levantando polvo.
  - La cámara la toma de perfil y luego la sigue desde detrás de quien juega.
  - Dura unos 7 s. Se salta con Esc, Enter, Espacio o tocando la pantalla.
- **Después:** la yegua se queda junto a Eudico o Félix (`mareShow` con `q='caught'`). El objetivo y el diálogo de entrega dicen que volvió sola.

### Novedades de la versión 86: interfaz para móvil (vertical y horizontal)

Todo funciona con `body.tm`, que se activa si hay pantalla táctil (`isTouch`). El código está en el módulo «modo táctil», antes de `startGame`; `tmTick` se llama desde `gfTick`.

- **Pantalla limpia:**
  - Fuera la barra de iconos, la tarjeta de teclas, el glosario y el aviso «E…».
  - El panel de arriba a la izquierda es más compacto: el objetivo cabe en una línea y se despliega al tocarlo.
  - Minimapa pequeño: al tocarlo se abre el plano.
- **Menú (`#tMenu`, arriba a la derecha):** abre una hoja inferior (`#mSheet`) con iconos grandes y su nombre: diario, plano, biblioteca, hora, vista, antorcha, caballo, sonido, balanceo de cámara, pantalla completa y época. Arriba de la hoja va la fecha.
- **Joystick flotante:** aparece donde pones el pulgar en la mitad izquierda (`#joyZone`). Llevándolo al borde se corre (`keys.run`).
- **Botón de acción contextual (`#tTalk`):** un círculo naranja que solo sale cuando hay algo con lo que interactuar. Su icono depende de lo que sea (hablar, leer, mirar, esfera, mano, caballo) y encima aparece el nombre (`#tAName`).
- **Otros botones:**
  - Saltar; volando, se mantiene pulsado para subir, y aparece un botón para bajar.
  - Accesos rápidos que solo salen cuando sirven: caballo, si es tuyo; alas, si las tienes; antorcha, de noche.
- **Diálogos y ventanas:**
  - Los controles se ocultan en cuanto no estás jugando (`#touch.off`).
  - En vertical, el diálogo es una hoja inferior con las opciones en una columna de botones altos.
  - En horizontal (`max-height:520px`), el diálogo es un panel a la derecha con las opciones en dos columnas.
  - El diario, el plano y la biblioteca ocupan toda la pantalla, y sus pestañas se desplazan de lado.
- **Textos:** la pantalla de inicio muestra instrucciones táctiles (`.ctrT`) en lugar de las de teclado. El tutorial y los avisos ya no nombran botones que no existen.
- **Pruebas:** `scratchpad/tools/mob.js` emula un móvil, con `hasTouch` y `isMobile`, de 390×844 o 844×390.

### Novedades de la versión 85: perros callejeros curiosos (en los dos modos)

- **Qué perros son:** los 18 perros que deambulan por la ciudad y los de los diez destinos llevan `F.stray`.
- **Cómo se comportan** (`dogCurious`, enganchada al principio del bucle de `faunaTick`):
  - Si estás a menos de 14 m y vas a pie, a veces uno se acerca trotando: ladra (`sfxBark`), se sienta a tu lado mirándote, ladea la cabeza, mueve la cola y gime (`sfxWhine`).
  - Te sigue entre 18 y 35 s y luego se va. No vuelve hasta pasados entre 70 y 140 s.
  - Como mucho, dos perros a la vez.
  - Si montas a caballo, vuelas o te alejas, se van; ante el caballo, ladran.
- **Si pulsas E** con uno cerca (`dogTalk`, desde `faunaTalk`):
  - Dejar que te huela: se hace tu amigo y te sigue unos 2,5 minutos. La primera vez da +1 Eusébeia. Sale el perro Argos de la Odisea en el modo Atenas, y los perros fieles de Plinio y Columela en el de Roma.
  - Darle unas palmadas.
  - Apartarlo.
  - Saber qué raza es.

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
