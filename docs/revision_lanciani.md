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

## Segunda revisión: láminas sueltas

Con el EPUB completo se georreferenció cada lámina por separado (cada una con sus propios puntos de anclaje, porque las láminas se solapan y están desplazadas) y se superpusieron encima el río, las calles y las plantas del juego. Además, 14 edificios del Foro y del Capitolio, cuya posición real es segura, dieron un ajuste de conjunto (escala 0,77, giro −12,8°) que sirve para distinguir **compresión deliberada** de **error local**.

**Bien situados** (10–48 m de desviación respecto al ajuste): Basílica Emilia, Templo de Marte Vengador, Tabulario, Concordia, Juno Moneta, Curia, Anfiteatro Flavio, Júpiter Capitolino, Vesta, Cástor, Basílica Julia, Saturno, Teatro de Marcelo y Esculapio en la isla. En la lámina 29 el Foro y el Anfiteatro coinciden, y las calles siguen los valles.

**Corregido ahora:**

- **El Pórtico de Octavia** (con los templos de Juno Reina y Júpiter Estátor) estaba unos 140 m al norte, separado del Teatro de Marcelo por varias manzanas. En Lanciani (lám. 21) está pegado al noroeste del teatro. Se ha movido allí, y su patio queda libre de casas (antes había casas dentro del pórtico).
- **El Templo de Hércules Vencedor** estaba frente a la punta norte de la isla, al lado del teatro. En Lanciani (lám. 28) está frente a la mitad sur de la isla, cerca de la Porta Trigemina; su nombre antiguo era precisamente *Hercules Victor ad Portam Trigeminam*. Se ha llevado allí, con una plaza abierta alrededor, y se ha ampliado hacia el sur la explanada del Foro Boario.
- **Nuevo: el Templo de Portuno**, el templo jónico rectangular que está al lado del de Hércules junto al puerto fluvial. No estaba en el juego. Tiene su cartel.

**Comprobado y no cambiado:**

- **El Palatino es demasiado estrecho** de norte a sur (58 m de semieje). Por eso el palacio de Domiciano queda unos 75 m al oeste en la lámina 29 y, en el ajuste de conjunto, la Casa de Augusto y el centro del Circo quedan a 100–150 m. Arreglarlo es rehacer el Palatino, el Circo y el Aventino a la vez: queda como propuesta aparte.
- **El río al sur de la isla** debería torcer hacia el este, hasta pasar junto al Foro Boario y el Aventino. En el juego baja más recto, con la orilla oriental unos 120–180 m al oeste. Corregirlo obliga a mover la muralla de la Porta Trigemina, la calle del Velabro y el puente Sublicio; se deja anotado. Las posiciones relativas sí se han conservado: teatro → isla → Foro Boario → Porta Trigemina → cárceres del Circo.
- **El Campo de Marte** está desplazado en bloque unos 150–190 m hacia el norte, y el Emporio y la Pirámide están comprimidos. Es compresión deliberada para que el mapa sea recorrible.
- Para el Templo de Claudio, la Domus Aurea, la Puerta Capena y las Termas de Tito, las coordenadas reales del ajuste no eran fiables; en las láminas 30, 35 y 36 su posición respecto a sus vecinos es aceptable (el de Claudio, algo al suroeste).

## Pendiente

Quedan por comprobar las calles y manzanas menores de cada lámina (46 láminas a escala 1:1000), y las dos reordenaciones grandes descritas arriba (el Palatino con el Circo y el río al sur de la isla). Las láminas del EPUB tienen una resolución de 1020 × 680 píxeles, suficiente para los edificios grandes pero justa para las calles.
