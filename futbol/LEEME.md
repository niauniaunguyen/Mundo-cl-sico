# Del Barrio a la Gloria

Juego de fútbol 11 contra 11 para el navegador, en español. Fundas un club en la Liga de Barrio y lo subes, temporada a temporada, hasta la Gran Liga.

- **Archivo jugable:** `futbol/futbol.html`. Es un solo archivo, sin dependencias salvo las fuentes de Google. Se abre directamente en el navegador.
- **Partido:** vista lateral inclinada sobre un canvas 2D. El campo mide 105 × 68 m, con física del balón (altura, botes, palos y larguero), porteros que se lanzan, entradas, entradas en plancha, cabezazos, saques de banda, córners y saques de puerta. Se elige la duración (2, 4, 6 u 8 minutos) y la dificultad.
- **Controles:** WASD o flechas para mover, Mayús para correr, J o Espacio para el pase (con Mayús, al hueco), L para el pase alto, K (mantener y soltar) para el tiro o la entrada, Q para cambiar de jugador y Esc para la pausa. En el móvil hay un joystick y botones táctiles.
- **Club:** nombre, colores y escudo. Plantilla de 18 jugadores con seis atributos (velocidad, tiro, pase, defensa, físico y portería), cuatro formaciones, fichajes, ventas y entrenamiento con monedas.
- **Liga:** 5 divisiones de 8 equipos y 14 jornadas. Suben los dos primeros y bajan los dos últimos. Los demás partidos de la jornada se simulan según la media de cada equipo.
- **Guardado:** `localStorage`, clave `del-barrio-a-la-gloria-v1`.
- Equipos, jugadores y competiciones son inventados.
