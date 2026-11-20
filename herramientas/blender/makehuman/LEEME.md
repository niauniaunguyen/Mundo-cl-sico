# Cabeza de MakeHuman (CC0)

`cabeza_mh.npz` contiene la cabeza y el cuello de la malla base de MakeHuman (hm08) y algunas de sus deformaciones
(sexo, edad, origen y rasgos sueltos de nariz, mentón, boca, pómulos, cejas, cráneo y frente). Lo genera
`../makehuman_extraer.py` y lo usa `../personajes.py` para las caras de los personajes.

Licencia: la malla base y las deformaciones de MakeHuman se publicaron con licencia **CC0 1.0** (dominio público)
en septiembre de 2020, según la cabecera de los propios archivos («This asset was explicitly released as CC0 in september 2020»).
Titulares en el momento de la cesión: Data Collection AB, Joel Palmius y Jonas Hauquier; deformaciones originales de Manuel Bastioni.
No hace falta atribución, pero la dejamos aquí: http://www.makehumancommunity.org

Origen:
- `base.obj`: github.com/makehumancommunity/makehuman, `makehuman/data/3dobjs/base.obj`
- `targets.npz`: paquete de PyPI `makehuman` 1.3.2, `makehuman/data/targets.npz`

## Cuerpo completo (prototipo)

`base.obj` (malla base hm08), `esqueleto_default.mhskel` y `pesos_default.mhw` (esqueleto «default» de 163 huesos y sus pesos),
de github.com/makehumancommunity/makehuman (`makehuman/data/3dobjs` y `makehuman/data/rigs`), CC0 (el archivo de pesos lo dice en
su cabecera: «license: CC0»). `cuerpo_targets.npz`: las deformaciones de hombre joven (caucásico, musculatura media y máxima) sacadas
de `targets.npz`. Los usa `../prototipo_mh.py`, que hace un personaje de prueba con este cuerpo y las animaciones de Quaternius.
