# Revisión de la Roma del juego con la *Forma Urbis Romae* de Lanciani

Fuente: R. Lanciani, *Forma Urbis Romae* (1893-1901; reimpresión de Quasar, Roma, 1990). Se ha usado el cuadro de ensamblaje (*Synopsis XLVI tabularum*) para la disposición general y las láminas 30 (Coliseo, Ludus Magnus, Termas de Tito y templo de Claudio) y 35 (Circo Máximo y Puerta Capena) para el detalle.

## Método

1. Se tomaron del juego las coordenadas de las plantas de los grandes edificios (no las de sus estelas, que pueden estar a un lado).
2. Se marcó la posición de esos mismos edificios, dibujados, en la *Synopsis* escaneada.
3. Se ajustó una transformación de semejanza (escala, giro y traslación) entre los dos conjuntos de puntos y se midió cuánto se aleja cada edificio de donde debería estar.
4. Como la Roma del juego está a escala real en el centro y comprimida en las afueras (decisión anterior, comprobada con latitud y longitud), el ajuste se hizo **por zonas**: el centro y el Campo de Marte por separado.

El margen de lectura de la *Synopsis* es de unos ±10 píxeles, es decir, de unos 25-30 m: diferencias menores no significan nada.

## Resultados

**Campo de Marte** (escala 2,57 m/px, giro −1,7°):

| Edificio | Desviación |
|---|---|
| Teatro de Pompeyo | 30 m |
| Mausoleo de Augusto | 50 m |
| Obelisco del reloj solar | 52 m |
| Panteón | 63 m |
| Ara Pacis | 101 m (ya se había colocado según su posición real; la diferencia viene de leer en la *Synopsis* la etiqueta y no el monumento) |

**Centro** (plantas del juego; escala 3,0 m/px, giro −9,8°):

| Edificio | Desviación |
|---|---|
| Foro (Curia) | 17 m |
| Teatro de Marcelo | 21 m |
| Anfiteatro Flavio | 43 m |
| Isla Tiberina | 77 m |
| Templo de Claudio | 87 m |
| Templo de Júpiter Capitolino | 96 m (lectura dudosa en la *Synopsis*) |
| Circo Máximo, centro | 150 m, y sobre todo **mal orientado** |

## Lo que se ha corregido

- **El Circo Máximo** estaba orientado exactamente de este a oeste. En Lanciani (lámina 35) corre en diagonal, del Foro Boario al noroeste hacia la Puerta Capena al sureste. Se ha girado unos 20° respecto al eje del juego (`CIRC_A`): las gradas, el muro exterior, la espina con sus metas y el obelisco, las cárceres, las colisiones, el público, la zona allanada del terreno y el recorrido de las cuadrigas. Ahora su extremo curvo mira a la Puerta Capena. Se comprobó que no quedan casas ni calzadas dentro de su planta.

## Lo que no se ha cambiado, y por qué

- **El giro general de unos 10°** del centro del juego respecto al norte: corregirlo obligaría a rehacer toda la ciudad. No afecta a la relación entre edificios vecinos.
- **El centro del Circo, unos 150 m más al norte** de lo que le correspondería: moverlo hacia el sur lo metería en el Aventino del juego, que está comprimido hacia el norte por el trazado del río (ya anotado en la revisión anterior).
- **Las Termas de Tito**: la etiqueta «Th. Titi» de la *Synopsis* no está sobre el edificio; en la lámina 30 las termas quedan al norte y algo al este del Coliseo, como en el juego.

## Pendiente

Una revisión lámina a lámina (46 láminas a escala 1:1000) permitiría comprobar calles, manzanas y edificios menores. Las láminas del EPUB tienen una resolución de 1020 × 680 píxeles, suficiente para los edificios grandes pero justa para las calles.
