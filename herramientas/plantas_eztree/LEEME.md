# Arbustos de detalle (EZ-Tree)

Genera `modelos/arbustos.glb` (y, compactado, `modelos/arbustos_juego.glb` → `datos/glbab.txt`): cinco arbustos del matorral
mediterráneo (lentisco, mirto, adelfa, coscoja y retama), con dos variantes de cada uno, para `fuente/codigo/203_arbustos_de_detalle.js`.

- Ramas y colocación de las hojas: [EZ-Tree](https://github.com/dgreenheck/ez-tree), de Daniel Greenheck, licencia MIT.
- Las texturas de hojas son propias (`hojas.js`, pintadas con canvas); no se usan las de la aplicación de EZ-Tree.

Se buscaron también paquetes CC0 en GitHub (por ejemplo flo-bit/low-poly-asset-packs), pero sus matas eran demasiado sencillas para el juego.

```
cd herramientas/plantas_eztree
npm i --ignore-scripts
git clone --depth 1 https://github.com/dgreenheck/ez-tree ez-tree-src
node generar.mjs vista.png
python3 ../blender/compactar_glb.py ../../modelos/arbustos.glb ../../modelos/arbustos_juego.glb
python3 ../../fuente/construir.py
```
