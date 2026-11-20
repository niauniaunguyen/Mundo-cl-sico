# Microcosmos — documento de traspaso

RPG incremental de biología celular con combates por turnos en 3D, en español. El jugador es un **macrófago** que se enfrenta a bacterias, virus, hongos, protozoos, células tumorales y priones. Para vencerlos tiene que aprovechar sus características: la penicilina rompe el peptidoglucano, pero un virus no tiene pared; el agua destilada revienta a una célula sin pared, pero no a una vegetal.

- **Archivo jugable:** `microcosmos/microcosmos.html`: un solo archivo que se abre directamente en el navegador.
- **Código fuente:** `microcosmos/partes/`. **Se edita siempre ahí** y luego se ejecuta `python microcosmos/partes/construir.py`, que une las partes en `microcosmos.html`. Las partes son:
  - `cabecera.html`: CSS y HTML.
  - `datos.js`: la biología, en español.
  - `idiomas_*.js`: las traducciones.
  - `estado.js`: guardado, fórmulas, retos y logros.
  - `sonido.js`.
  - `escena.js`: Three.js.
  - `combate.js`.
  - `interfaz.js`: interfaz y bucle principal.
  - `arranque.js`.
- **Motor:** Three.js r128 (UMD desde cdnjs). Todos los modelos son procedurales: no hay GLB.
- **Guardado:** `localStorage`, clave `microcosmos.v1`. Hay progreso sin conexión (las mitocondrias producen ATP, como máximo 8 horas).

## Bucle de juego
- Cada **nivel** tiene 5 combates normales y un **jefe**. Si vences al jefe, subes de nivel. Si el jefe te vence, se desactiva «Avanzar» y te quedas reuniendo ATP. Si te vence un enemigo normal, bajas un nivel.
- Cada victoria da **ATP**, que se gasta en el Laboratorio:
  - **Orgánulos** (`UPG`): enzimas lisosomales (ataque), membrana (vida), citoesqueleto (defensa), ribosomas (ATP por victoria), mitocondrias (ATP por segundo) y señalización (velocidad del modo automático).
  - **Herramientas** (`TOOLS`).
- **Memoria inmunitaria** (50 ATP) desbloquea el modo **Auto**. Solo usa herramientas que el jugador ya ha probado contra ese organismo (`S.known`). Así, aprender es lo que permite automatizar.
- **Evolución** (prestigio), desde el nivel 10: se vuelve al nivel 1 y se reciben (nivel máximo ÷ 5)² puntos de **ADN**. Cada punto da +10 % de ataque, vida y ATP. Se conservan las herramientas, el Atlas y la memoria inmunitaria.

## Datos (todo en el `<script>`)
- `TYPES`: los 11 organismos, con nombre, especie, nivel de aparición (`min`), rasgos, descripción, esquiva y número de ataques. Sus habilidades por turno están en `enemyTurn`: fisión binaria, gemación, el virus que se esconde, fotosíntesis, mitosis, esporulación y el prion que crece.
- `TOOLS`: las 12 herramientas, con potencia, recarga y coste.
- `EFF[herramienta][organismo] = [multiplicador, explicación]`: la tabla que da sentido biológico al juego. `eff()` añade los estados: el virus escondido (solo lo alcanza el linfocito T) y la endospora (solo la destruye el autoclave).
- `BUILD`: un constructor 3D por organismo. Devuelve `{g, up(t, e)}`.

## Equilibrio
- Enemigos: vida 30·1,25^(N−1), ataque 4·1,2^(N−1). El jefe tiene ×4 de vida y ×1,4 de ataque.
- Recompensa: 5·1,2^(N−1), ×6 si es jefe.
- Una simulación con juego óptimo da este ritmo: la primera partida se estanca hacia el nivel 25 (unos 50 minutos), y cada evolución permite llegar más lejos.

## Dirección artística (versión 2)
- **Escena:** campo oscuro de microscopio de fluorescencia. El fondo es plasma sanguíneo con eritrocitos, plaquetas, anticuerpos libres, hebras de fibrina y haces de luz del condensador. Encima hay una viñeta de ocular (`#scope`).
- **Material de membrana** (`mem()`): un `MeshStandardMaterial` con un borde de Fresnel añadido en `onBeforeCompile`. Las membranas brillan en el contorno y son translúcidas por dentro. Las texturas son procedurales y se generan en un canvas: relieve, cromatina, crestas mitocondriales y tilacoides.
- **Modelos** (`BUILD`, `buildMacrophage`): usan una semilla fija (`SEED`), así que cada organismo sale siempre igual. Algunos detalles:
  - **Macrófago:** núcleo arriñonado, Golgi, RER con ribosomas, mitocondrias, lisosomas, filopodios y un pseudópodo que se estira al fagocitar.
  - **E. coli:** doble membrana, nucleoide, fimbrias y flagelos perítricos.
  - **Gripe:** hemaglutinina y neuraminidasa, y los 8 segmentos de ARN.
  - **Célula vegetal:** grana y ciclosis.
  - **Paramecio:** surco oral, unos 900 cilios con onda metacrónica y vacuolas contráctiles en estrella.
  - **Tumor:** mitosis anómala y angiogénesis.
  - **Bacillus:** endospora con núcleo, córtex y cubierta.
  - **Prion:** fibrilla amiloide de láminas β que recluta PrP sana.
- **Interfaz:**
  - Las tarjetas tienen doble membrana. Los separadores son una bicapa de fosfolípidos (máscara SVG `--bilayer`) y los paneles llevan un patrón de tejido (`--tissue`).
  - Las herramientas y los orgánulos van dentro de vesículas con iconos SVG propios (`IC`).
  - La ficha del enemigo es una preparación, con su técnica de tinción y su tamaño real (`LAB`).
  - El Atlas es una caja de preparaciones con miniaturas en un campo circular. Las miniaturas se generan con `thumb()`, que usa un segundo renderizador.
  - La pestaña Evolución dibuja el árbol del linaje desde LUCA.

## Versión 3: mejoras y mecánicas nuevas
- **Combinaciones** (`COMBOS`): una herramienta usada justo después de otra con efecto multiplica su eficacia. Son cinco: lisozima → choque osmótico (protoplasto), anticuerpos → fagocitosis (opsonización), celulasa → osmótico, anfotericina → osmótico y taxol → linfocito T. Se descubren jugando.
- **Resistencia:** cada uso de penicilina sube la presión selectiva (`S.press`) y aumenta la probabilidad de que aparezca un estafilococo SARM, contra el que la penicilina vale ×0,1. Vencer bacterias sin antibióticos hace bajar la presión.
- **Cambios durante el combate:**
  - La gripe sufre deriva antigénica cada 4 turnos, y los anticuerpos pierden eficacia.
  - Estafilococos y E. coli forman biopelícula en el turno 6 (×0,6, salvo el autoclave).
- **Eventos** (`EVENTS`, 15 % de los combates desde el nivel 3): fiebre, antibiótico en sangre, vacuna, inflamación e hipoxia.
- **Jefes especiales** cada 10 niveles (`SPECIAL`): sepsis, gripe pandémica, tumor maligno y placa amiloide. Tienen dos fases, una presentación cinematográfica (`cinematic`, `CINE`) y música sintetizada.
- **Células aliadas** (`CELLS`): se desbloquean al evolucionar. Son el neutrófilo (núcleo multilobulado), el linfocito NK (alcanza al virus escondido) y el eosinófilo. Cada una tiene su propio modelo.
- **Colores de proteínas fluorescentes** (`SKINS`): se desbloquean con evoluciones, retos y logros. Además, el linaje gana filopodios con cada evolución.
- **Mapa** (`ZONES`): sangre, pulmones, intestino, piel, cerebro y charca. Cada zona filtra los organismos y tiñe el fondo.
- **Retos diarios** (`DAILY`): dos al día, elegidos según la fecha; cada uno da +1 ADN.
- **Logros** (`ACH`): 18, cada uno con un dato curioso real.
- **Aprendizaje:**
  - Cuestionario al descubrir un organismo.
  - Los rasgos que explican cada resultado se resaltan (`KEYTRAIT`).
  - Fuentes y licencias del juego al final del Atlas.
- **Aula:**
  - Modo clase: todas las herramientas, sin ATP ni mejoras, estadísticas según el nivel y práctica libre con cualquier organismo desde el Atlas.
  - Informe para el profesor, copiable.
- **Ajustes:**
  - Idioma: español, català o English (`tr()` para la interfaz, `applyData()` para los datos).
  - Texto grande y opción para reducir efectos.
  - Calidad gráfica automática, alta, media o baja; la automática baja sola si el juego va lento.
  - Código de partida para exportar e importar.
  - Datos de partida (`S.stats`) para ajustar el equilibrio.
- **Accesibilidad:** la eficacia se indica también con símbolos (▲▲ ● ▼ ✕) y las pestañas se recorren con las flechas.
- **Modo automático:** muestra su velocidad y un registro de los últimos combates.

## Versión 4
- **Partes nuevas del código fuente:**
  - `datos_extra.js`: efectos secundarios, árbol, historia, partes del microscopio, diagnóstico y narradora.
  - `interfaz2.js`: la interfaz de todo lo anterior.
  - `idiomas_ui2.js` e `idiomas_datos2.js`: sus traducciones.
  - Los textos nuevos se marcan con `T_('…')` y se traducen con `tr()`, usando como clave el texto en español.
- **Modo historia** (`STORY`, botón del libro): cinco capítulos (herida, inflamación, presentación de antígenos, anticuerpos y sepsis) y un epílogo sobre la memoria inmunitaria. Cada capítulo fija la célula, la zona, el nivel y las herramientas disponibles (`storyCh()`, `effLevel()`). Completarlo da +3 ADN y +1 punto del árbol.
- **Segundo acto:** cuatro organismos nuevos con modelo 3D y mecánica propia:
  - Tuberculosis (nivel 33): pared cérea; solo ataca un turno de cada dos.
  - Malaria (nivel 36): se esconde en los eritrocitos y tiene accesos de fiebre.
  - VIH (nivel 39): destruye tus linfocitos CD4 y entra en latencia.
  - Tenia (nivel 42): regenera proglótides.
  - También hay cuatro herramientas nuevas: isoniazida, artemisinina, antirretrovirales y praziquantel. Y un quinto jefe especial: malaria cerebral.
- **Efectos secundarios** (`SIDE`): algunas herramientas te restan una parte de tu vida.
- **Árbol inmunitario** (`TREE`): tres ramas (innata, humoral y celular) de cuatro nodos cada una. Los puntos (`S.lpts`) se ganan así: 2 por evolución, 1 por jefe especial y 1 por completar la historia.
- **Microscopio interactivo** (`openScope`, `PARTS`): segundo renderizador, rotación, zoom y puntos sobre las partes de cada modelo.
- **Laboratorio de diagnóstico** (pestaña Diagnóstico; `DIAG_TESTS`, `DIAG_KEY`): una muestra desconocida, ocho pruebas reales y hasta tres por caso.
- **Tablón de la clase:**
  - Capacidad `db` de la página publicada: colección `board`, un documento por persona (`board/<id de usuario>`).
  - Reglas: todos leen; cada uno escribe solo su fila; la propietaria puede moderar.
  - Se guarda: nivel máximo, victorias, logros, aciertos del cuestionario y del diagnóstico, si ha completado la historia y el reto semanal de la clase (`wkNoAb`).
  - Los nombres se resuelven con la capacidad `user` y nunca se guardan.
  - Fuera de la página publicada, el tablón se desactiva solo.
- **Narradora** (`NARR`, `narr()`): la doctora Olmo, un personaje inventado. Puede leer en voz alta con la capacidad `tts`; si no está disponible, usa la voz del navegador (`speechSynthesis`).
- **Sonido:**
  - Paisaje sonoro generativo por zona (`ambient()`): latido, respiración, borborigmos, aire, pulsos neuronales o burbujas.
  - Un sonido propio para cada herramienta (`TOOL_SFX`).
- **Publicación:** al republicar el artefacto, mantener `capabilities: {db:{rules:[{path:"board",read:"view",write:"owner"},{path:"board/{self}",read:"view",write:"interact"}]}, user:{scopes:["profile"]}, tts:{}}`.

## Versión 5: claridad
- **Eventos** (`EVENT_UI`):
  - Banda «Evento del combate» dentro de la ficha del organismo (`#fEvt`), con el efecto concreto en una línea; al pulsarla se ve la explicación.
  - Color de ambiente en la escena (clases `ev-*` en `#app`) y números flotantes con su causa («+6 % · inflamación»).
  - Cada golpe afectado indica el modificador.
  - La narradora explica cada tipo de evento la primera vez que aparece.
- **Jerarquía del HUD:**
  - Laboratorio es el botón principal: relleno ámbar, con el ATP dentro y un punto verde cuando puedes comprar algo.
  - Historia y Mapa son botones secundarios con contorno.
  - Auto, Avanzar y Sonido forman un grupo discreto de iconos (`.quiet`).
  - Se ha quitado el texto de recarga de los botones de herramientas.
- **Logros:**
  - El aviso dice por qué lo has conseguido (`ACH_WHY`) y cuánto ATP ganas.
  - Al pulsarlo se abre la curiosidad ganada.
  - Si no se pulsa, queda pendiente en Retos (punto en la pestaña, `S.achSeen`).
  - Los logros bloqueados explican cómo conseguirlos (`ACH_GOAL`).
- **La narradora** (`#narr`) va dentro de la tarjeta de mensajes (`#msg`), no flota sobre la escena. Cuando habla, la tarjeta crece y la cámara se reencuadra con suavidad (`CAMT`/`CAMC`, `stepCam`); si cambia el tamaño de la ventana, el reencuadre es inmediato.

## Versión 8: tejidos profundos, interfaz más ligera y orgánulos visibles
- **Hito del nivel 30** (`milestone()`, `MILESTONE`, `S.miles`): la primera vez da +8 ADN, +3 puntos del árbol y desbloquea los orgánulos avanzados. Cada 10 niveles más da +3 ADN y +1 punto.
- **Salto de dificultad desde el nivel 31:**
  - Vida de los enemigos: ×3,5·1,15^(N−31) (`deepHp`).
  - Ataque de los enemigos: ×2·1,1^(N−31) (`deepAtk`).
  - Recompensas ×1,5.
- **Orgánulos avanzados** (`UPG2`, en `S.upg`, se reinician al evolucionar; disponibles si `S.best ≥ 30`):
  - Núcleo activo: ataque ×1,12 por nivel.
  - Retículo liso: vida ×1,12 por nivel.
  - Golgi: daño automático cada turno.
  - Peroxisomas: curación cada turno.
  - Centrosoma: probabilidad de que una herramienta no gaste recarga.
  - Según la simulación, sin ellos la partida se estanca hacia el nivel 38–40; con ellos se sigue avanzando.
- **Orgánulos visibles** (`buildMacrophage(…, U)`): el número y el brillo de lisosomas, mitocondrias, ribosomas, actina, peroxisomas, Golgi, núcleo, retículo liso, centrosoma y membrana dependen de su nivel.
- **Efectos animados de los orgánulos:**
  - Las mitocondrias sueltan chispas de ATP.
  - La señalización emite ondas en el modo automático.
  - El Golgi dispara vesículas cada turno.
  - Los peroxisomas producen un destello verde al curarte.
- **Al comprar una mejora:** destello y pulso de la célula (`organelleFx`). En el móvil se reproducen al cerrar el Laboratorio.
- **Interfaz:**
  - Herramientas en una sola fila deslizable.
  - Tu vida es una barra fina en lugar de una tarjeta.
  - El mensaje del combate se pliega a una línea a los 5 s; al pulsarlo se despliega.
  - Los rasgos del organismo van en una fila deslizable.
  - Botón con forma de ojo para el modo «ver la batalla» (`S.focus`): oculta rasgos, mensajes y eventos.

## Versión 9: eventos especiales y organismos variantes
- **El modo historia pasa a ser un evento.** El botón «Eventos» abre `showEvents()`; cada evento tiene capítulos con combates fijos y una recompensa la primera vez que se completa (`S.evDone`).
  - Estado: `S.story = {ev, ch, step}`. Las partidas antiguas sin `ev` se convierten a `'inf'`, y `storyDone` pasa a `evDone.inf`.
  - Datos en `partes/eventos.js`: `EXPED` (eventos) y `VARIANTS` (organismos variantes).
- **Eventos:**

  | Evento | Se desbloquea | Recompensa |
  |---|---|---|
  | Una infección de principio a fin (el antiguo modo historia) | Desde el principio | +3 ADN y +1 punto del árbol |
  | Bacterias del revés | Nivel 3 | +2 ADN, +1 punto del árbol y el color mNeonGreen |
  | Clones a medio hacer | Nivel 6 | +2 ADN, +1 punto del árbol y el color tdTomato |
  | Expedición a Xenón b | Nivel 10 | +2 ADN, +1 punto del árbol y el color Xenofluorina (inventada) |

- **Variantes:** cada una es un organismo conocido (`base`) con algunas características cambiadas.
  - En el combate llevan `e.var`.
  - `TY(e)` devuelve la ficha de la variante mezclada con la del original.
  - `eff` aplica primero las eficacias propias de la variante.
  - El conocimiento de cada herramienta se guarda aparte para la variante (`knowKey`).
  - Campos opcionales:
    - `dodge`: probabilidad de esquivar.
    - `markStops`: los anticuerpos impiden esquivar.
    - `atkK` y `hpK`: multiplican el ataque y la vida.
    - `vul`: más daño recibido.
    - `regen`: se cura cada turno.
    - `uvStall`: la UV detiene la regeneración.
    - `qbest`: respuesta correcta de la pregunta.
- **La primera vez que aparece una variante** sale `showVariant()`:
  - el original y la variante, uno al lado del otro;
  - los rasgos cambiados, marcados con ✦;
  - qué ha cambiado;
  - una pregunta sobre qué herramienta funcionará mejor;
  - una curiosidad real.
- **Aspecto 3D** (`variantLook`): `tint`, `shell` (capa extra), `spikes` (flagelos), `dots` (cloroplastos o ribosomas), `ghost`, `soft` (se deforma), `mirror` (reflejada) y `model` (usar el modelo de otro organismo).
- **Textos:** catalán e inglés en `idiomas_ui5.js`; los colores nuevos, en `idiomas_datos2.js`.
