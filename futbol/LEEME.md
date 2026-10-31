# Del Barrio a las Estrellas

Juego de fútbol 11 contra 11 para el navegador, en español, ambientado en el año 2187. Fundas un club humano en la Liga de Barrio y lo subes hasta la Copa Galáctica jugando contra equipos de humanos, alienígenas y robots en seis planetas.

- **Archivo jugable:** `futbol/futbol.html`. Es un solo archivo, sin dependencias salvo las fuentes de Google.
- **Planetas** (`PLANETS`): cada estadio tiene su gravedad (`g`), su frenado del aire (`drag`), el rozamiento del suelo (`mu`), el rebote, el agarre de las botas (`trac`), la velocidad punta, el gasto de energía y el viento. `planetPhys()` deriva el resto: la frenada del balón en el suelo, el umbral de rebote, la altura de salto y el bote de los jugadores al correr.
  - Tierra: condiciones normales.
  - Luna (0,17 g, sin aire): los balones altos flotan y los jugadores cabecean a unos 4 m.
  - Marte (0,38 g): tormentas de viento que desvían el balón en el aire.
  - Europa: campo de hielo, el balón casi no frena y los jugadores patinan.
  - Titán: aire muy denso que frena el balón.
  - Kepler-442b (1,8 g, estimado): el balón pesa, se corre más despacio y el cansancio llega antes.
- **Pases y tiros:** `sim()` reproduce la física del balón del planeta, y `groundShot`, `lobShot` y `shotVz` buscan por bisección la velocidad necesaria para que el pase llegue o el tiro vaya a la altura deseada. Así la IA y el jugador apuntan bien en cualquier gravedad.
- **Especies** (`SPECIES`, campo `sp` de cada jugador):
  - Humanos: recuperan energía antes y corren un 4 % más desde el minuto 75.
  - Alienígenas: aceleran y saltan más, y sus porteros llegan más lejos.
  - Robots: no se cansan, pasan y tiran con más precisión y cuesta quitarles el balón, pero aceleran y giran más despacio.
  - En el mercado hay jugadores de las tres especies.
- **Liga:** cinco divisiones (Liga de Barrio, Orbital, Interplanetaria, del Sistema Solar y Copa Galáctica) de 8 equipos y 14 jornadas. Se juega en el planeta del equipo local, y el estadio del club propio se elige al fundarlo o en Ajustes.
- **Controles:** WASD o flechas, Mayús para correr, J o Espacio para el pase, L para el pase alto, K (mantener y soltar) para el tiro o la entrada, Q para cambiar de jugador y Esc para la pausa. En el móvil, joystick y botones.
- **Guardado:** `localStorage`, clave `del-barrio-a-la-gloria-v1`. Las partidas de la versión anterior se convierten solas (`migrate`).
- Equipos, jugadores y competiciones son inventados.
