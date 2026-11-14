# Barrido automático de errores visuales

Herramientas para buscar errores visuales sin mirar a ojo. Usan el Chromium y el Playwright del entorno y el objeto de depuración `window.__d` (se activa con `#debug` en la URL).

```bash
# 1. servir el juego
cd <repo> && python3 -m http.server 8386 &
# 2. barrido de una región: «ciudad» o ids de destinos separados por comas
cd herramientas/qa_visual
REG=ciudad node run.js '?modo=atenas#debug' barrido.js
REG=ciudad,samnium,etruria node run.js '?modo=roma#debug' barrido.js
# 3. capturas de los puntos sospechosos: nombre:x:z:distancia:altura[:ángulo]
LOOK="bema:-520:100:14:1.5:2.8" node run.js '?modo=atenas#debug' mirar.js
```

Qué mide `barrido.js` (las coordenadas que imprime son relativas al centro de la región):

| Prueba | Qué detecta | Ejemplo real encontrado |
|---|---|---|
| A · relieve | La malla visible no coincide con el suelo físico (montes sin colisión, agujeros) | Salidas de Roma tapadas por la malla lejana |
| B · objetos | Objetos que flotan sin nada debajo, o pequeños objetos medio enterrados | Bema de la Pnyx enterrado 5 m |
| C · vegetación | Árboles y plantas flotando o hundidos | — |
| D · personas | Paseantes y personajes por encima o por debajo del suelo | — |

Falsos positivos habituales: techos sobre muros (la Tholos), árboles sobre el túmulo del Mausoleo de Augusto, escenas subterráneas (cueva de Platón), muros de contención en laderas. Por eso cada candidato se confirma con una captura (`mirar.js`) antes de tocar nada.

La salida y las capturas van a `$SALIDA` (por defecto, el directorio temporal). El rendimiento en el navegador sin pantalla es muy bajo (~1 fps): no sirve para medir fps.

## Caminos cortados

`node run.js '?modo=atenas#debug' caminos.js` recorre cada camino de la ciudad cada 2 m y lista los tramos donde algo choca (con el edificio más cercano). Los cruces de las puertas (Dípilon) y la entrada a tu casa son normales.

## Personas en el suelo

En el juego, `sueloTick()` (módulo SUELO) se ejecuta antes de dibujar cada imagen y coloca a las personas cercanas sobre el suelo que se ve. En `#debug`: `__d.SUELO().fix` cuenta las correcciones y `__d.groundY(x,z)` da la altura correcta de un punto.

## Personas que atraviesan edificios

`SEG=60 ZONA=x,z node run.js '?modo=atenas#debug' atraviesan.js` observa durante SEG segundos a todo lo que se mueve (paseantes, personajes con horario, figuras de los sucesos) y lista a quien pisa dentro de una colisión, con su tipo y dónde. En el juego, `npcStep()` impide que ocurra: antes de cada paso comprueba que el sitio está libre, rodea el obstáculo si puede y, si no, cambia de destino.
