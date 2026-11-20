# El cielo de pesadilla de los portales de leyenda: un cielo real de Poly Haven (CC0), retocado → modelos/cielo_tormenta.jpg
#   /opt/bvenv/bin/python -I herramientas/blender/cielo_tormenta.py -- <kloppenheim_07_puresky_2k.hdr> [hdri distinto]
# Origen: «Kloppenheim 07 (Pure Sky)», Greg Zaal y Jarod Guest, https://polyhaven.com/a/kloppenheim_07_puresky (CC0).
# Retoque: exposición y curva (Reinhard), menos color, más contraste en las nubes, tono verdoso y violeta (como un sueño malo),
# más oscuro hacia arriba; el horizonte se funde con la niebla del juego. Equirectangular 2048 x 1024.
import bpy, sys, os, numpy as np
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
SRC = args[0]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'modelos', 'cielo_tormenta.jpg')
im = bpy.data.images.load(SRC); W, H = im.size
A = np.array(im.pixels[:], dtype=np.float32).reshape(H, W, 4)[::-1, :, :3]   # filas de arriba abajo
L = A @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
k = 0.42 / max(1e-4, float(np.exp(np.log(L + 1e-4).mean())))        # exposición: luminancia media → 0,42
X = A * k; X = X / (1 + X)                                            # Reinhard
g = X @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
X = X * 0.35 + g[..., None] * 0.65                                    # menos color
X = np.clip((X - 0.5) * 1.35 + 0.47, 0, 1)                            # contraste en las nubes
v = (np.arange(H) / (H - 1))[:, None, None]                           # 0 arriba, 1 abajo
tint = np.array([0.80, 0.92, 0.82]) * (1 - v) + np.array([0.86, 0.80, 0.95]) * v   # verdoso arriba, violeta cerca del horizonte
X = X * tint * (0.62 + 0.38 * np.clip(v * 2, 0, 1))                  # más oscuro hacia el cenit
fog = np.array([0.30, 0.31, 0.33]); hz = np.clip((v - 0.47) / 0.08, 0, 1)
X = X * (1 - hz) + fog * hz                                           # por debajo del horizonte, el color de la niebla
X = np.clip(X ** (1 / 1.0), 0, 1)
img = bpy.data.images.new('cielo', W, H, alpha=False)
img.pixels.foreach_set(np.concatenate([X[::-1], np.ones((H, W, 1))], -1).astype(np.float32).ravel())
if W > 2048: img.scale(2048, 1024)
img.filepath_raw = OUT; img.file_format = 'JPEG'; bpy.context.scene.render.image_settings.quality = 82; img.save()
print('CIELO', OUT, os.path.getsize(OUT), W, H)
