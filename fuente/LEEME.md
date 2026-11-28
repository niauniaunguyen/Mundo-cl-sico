# Cómo está hecho Nóstos (guía para quien toque el código)

## Dónde está cada cosa

| Ruta | Qué es |
|---|---|
| `fuente/atenas.src.html` | Plantilla: HTML, CSS y la interfaz. El código va en el marcador `@@CODIGO@@`. |
| `fuente/codigo/NNN_nombre.js` | El código del juego, en módulos. Se unen **en orden alfabético** dentro de un único `<script>`. |
| `fuente/codigo/INDICE.md` | Índice de módulos y de sus secciones (se regenera solo al construir). |
| `fuente/codigo/ENVOLTURAS.md` | Qué funciones amplían otros módulos y en qué orden (también se regenera al construir). Míralo antes de tocar una función: puede que otros cinco módulos la amplíen. |
| `fuente/construir.py` | Une plantilla y módulos, aplica las traducciones (`i18n.py`), incrusta modelos e imagen y escribe `atenas.html` y `version.json`. |
| `fuente/i18n/`, `fuente/i18n.py` | Traducciones al catalán y al inglés. |
| `modelos/` | Modelos de Blender (`.glb`) e imagen de Rafael. **No sobrescribir `atenas_modelos.blend`.** |
| `herramientas/pruebas/` | Pruebas: rápidas (`comprobar.js`) y en el navegador (`todo.sh --navegador`). |
| `herramientas/qa_visual/` | Barridos visuales (objetos que flotan, caminos cortados…). Ver su `LEEME.md`. |
| `TRASPASO.md` | Una nota por versión: qué se hizo y con qué nombres. Léela antes de tocar algo. |

## Construir y probar

```bash
python3 fuente/construir.py                   # escribe atenas.html
node herramientas/pruebas/comprobar.js        # siempre, tras cada cambio (unos segundos)
herramientas/pruebas/todo.sh --navegador      # antes de publicar (varios minutos)
```

`comprobar.js` construye y revisa: sintaxis, funciones declaradas dos veces, funciones del bucle que no existen, envolturas
(`{const f=X;X=function(…){f(…);…}}`) sobre algo que no es una función reasignable o que no llaman a la original, textos
traducidos pegados a la palabra anterior (`return_t(…)`), marcadores sin sustituir y tamaño. Si una envoltura sustituye a
propósito a la función, escríbelo sin la variable (`X=function…`) y con un comentario. `todo.sh --navegador --recorridos` añade además los **recorridos a pie** (`recorridos.js`: desde la salida explora la ciudad con `tryMove`, como el jugador, y lista personajes, estelas, dioses y objetos inaccesibles; tarda 5-12 min por ciudad). `todo.sh --navegador` añade, en Atenas y en Roma, la **prueba de humo** (abre todos los diálogos,
estelas, dioses, objetos…) y la **huella del mundo** (ver «El generador aleatorio»). Para las del navegador hace falta
Chromium con Playwright y `cd herramientas/qa_visual && npm install` (three.js r128 servido en local).

## Reglas que no hay que romper

1. **Un solo ámbito.** Todos los módulos viven dentro de la misma función (`(function(){ "use strict"; … })()`, que abre
   `000_inicio.js` y cierra `900_creta_y_arranque.js`). Las funciones se ven entre módulos; los `const` y `let` solo
   desde que se ejecuta su línea. Un `const` usado antes de su línea da un error de «TDZ» al cargar.
2. **El orden importa.** El código suelto de cada módulo se ejecuta al cargar, en orden. Los módulos nuevos van **antes de
   `900_creta_y_arranque.js`** (que arranca el juego y define `__d`): usa números libres entre 136 y 899.
3. **Nombres únicos.** Dos `function x()` con el mismo nombre no dan error: la segunda pisa a la primera en todo el juego
   (pasó con `wseg` y rompió colisiones de Atenas). `comprobar.js` lo detecta. Antes de nombrar algo, búscalo.
4. **Envolver, no reescribir.** Para añadir comportamiento a una función de otro módulo se envuelve:
   `{const f0=f;f=function(...a){const r=f0.apply(this,a);/* lo nuevo */return r;};}`. Así se apilan capas sin tocar el
   original. Al buscar puntos de anclaje en textos largos, ojo con las subcadenas (`gsTick(dt);` está dentro de `wingsTick(dt);`).
5. **El generador aleatorio del mundo.** `R()` (en `000_inicio.js`) es una secuencia fija: casas, árboles y gente salen de
   ella en orden. Si código nuevo llama a `R()` **durante la construcción**, todo lo que viene después cambia de sitio
   (ha metido a una estatua dentro de una casa). Código nuevo: `forRng(semilla)` para algo fijo y reproducible, o
   `Math.random()` si da igual. La prueba `huella.js` avisa si la huella del mundo cambia.
6. **El bucle.** Lo que se actualiza cada imagen se añade a la cadena de `gfTick` (`062_game_feel.js`) o al bucle
   principal. Que sea barato: trabajo solo cerca del jugador y repartido en el tiempo. Con `?prof` o `#debug`,
   `__d.profReport()` dice qué tarda.
7. **Textos.** `i18n.py` envuelve los literales traducibles al construir: no partas frases con `+` innecesarios. Todo
   texto histórico con su fuente, y los anacronismos marcados («Teofrasto, que aún no ha nacido…»).
8. **Depuración.** Con `#debug` en la URL existe `window.__d` (en `900_creta_y_arranque.js`): estado, teletransporte,
   funciones internas. Las pruebas lo usan; si añades algo que quieras probar, expónlo ahí.

## Al terminar un cambio

`comprobar.js` en verde → (si toca el mundo o es grande) `todo.sh --navegador` → nota en `TRASPASO.md` → commit.
