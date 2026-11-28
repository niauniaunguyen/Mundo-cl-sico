# Texturas del suelo a partir de escaneos reales de Poly Haven (CC0, https://polyhaven.com) → modelos/suelo_*.jpg
#   python3 -I herramientas/texturas/suelo_polyhaven.py <carpeta con las descargas *_diff_1k.jpg y *_ao_1k.jpg>
# El terreno del juego (fuente/codigo/036_acabado.js, terrainMat) tiñe estas texturas con el color de cada sitio (los colores de
# los vértices: tierra del Ática, campos verdes, terra rossa…). Por eso aquí se convierten en texturas «de detalle»: se multiplica el
# color por la oclusión (AO), se divide por su color medio (queda un gris cálido de media 0,85) y se conserva solo un poco de su color.
#   roca    ← rocky_terrain_02  (laderas empinadas)
#   tierra  ← dirt_floor        (el suelo de siempre: tierra apisonada lisa, con alguna piedrecita)
#   hierba  ← grass_ground      (donde el sitio es verde)
#   grava   ← rocky_trail_02    (manchas de grava y caminos)
#   grietas ← dry_mud_field_001 (barro seco suave, a manchas)
import sys, os, numpy as np
from PIL import Image
SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'modelos')
T = {'roca': ('rocky_terrain_02', 0.35), 'tierra': ('dirt_floor', 0.25), 'hierba': ('grass_ground', 0.3), 'grava': ('rocky_trail_02', 0.25), 'grietas': ('dry_mud_field_001', 0.15)}
for k, (name, chroma) in T.items():
    d = np.asarray(Image.open(os.path.join(SRC, name + '_diff_1k.jpg')).convert('RGB'), dtype=np.float32) / 255
    try: ao = np.asarray(Image.open(os.path.join(SRC, name + '_ao_1k.jpg')).convert('L'), dtype=np.float32)[..., None] / 255
    except Exception: ao = 1.0
    x = d * (0.35 + 0.65 * ao)                         # con la oclusión (en los mismos valores que las texturas del juego)
    m = x.reshape(-1, 3).mean(0); lum = (x @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32))[..., None]
    ml = float(lum.mean()); grey = lum / ml; col = x / m
    y = (grey * (1 - chroma) + col * chroma) * 0.85      # media 0,85; un poco de su color
    K = {'roca': 0.8}.get(k, 0.55)                       # contraste suave: la textura da detalle, no manchas (la roca, algo más)
    y = np.clip((y - 0.85) * K + 0.85, 0, 1.0)
    im = Image.fromarray((y * 255 + 0.5).astype(np.uint8)); f = os.path.join(OUT, 'suelo_%s.jpg' % k); im.save(f, quality=82, optimize=True)
    print('SUELO', k, name, im.size, os.path.getsize(f))
