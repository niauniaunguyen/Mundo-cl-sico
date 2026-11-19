# Microcosmos — documento de traspaso

RPG incremental de biología celular con combates por turnos en 3D, en español. El jugador es un **macrófago** que se enfrenta a bacterias, virus, hongos, protozoos, células tumorales y priones. Para vencerlos tiene que aprovechar sus características: la penicilina rompe el peptidoglucano, pero un virus no tiene pared; el agua destilada revienta a una célula sin pared, pero no a una vegetal.

- **Archivo jugable:** `microcosmos/microcosmos.html`: un solo archivo con HTML, CSS y JS. No hace falta compilarlo. Se abre directamente en el navegador.
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
