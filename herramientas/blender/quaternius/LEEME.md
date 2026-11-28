# Universal Animation Library (Quaternius, CC0)

`ual_standard.glb`: la versión estándar (46 animaciones, esqueleto humano tipo Rigify), descargada de OpenGameArt
(https://opengameart.org/content/universal-animation-library). Licencia CC0: `LICENCIA_UAL.txt`.

`../ual_retarget.py` pasa estas animaciones al esqueleto de `personajes.py`. Se activa con `NOSTOS_UAL=1`:

    NOSTOS_UAL=1 /opt/bvenv/bin/python herramientas/blender/personajes.py [-- tipos]

Sin la variable, los personajes llevan las animaciones hechas a mano de siempre (andar y quieto).
