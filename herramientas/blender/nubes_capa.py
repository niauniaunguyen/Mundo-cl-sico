# La capa de nubes del cielo del juego, sacada de un cielo real de Poly Haven (CC0) → modelos/nubes.jpg
#   /opt/bvenv/bin/python -I herramientas/blender/nubes_capa.py -- <kloofendal_48d_partly_cloudy_puresky_2k.hdr>
# Origen: «Kloofendal 48d Partly Cloudy (Pure Sky)», Greg Zaal y Jarod Guest, https://polyhaven.com (CC0).
# Solo la mitad de arriba (el cielo). Canal rojo: cuánta nube hay (0 = cielo azul, 1 = nube densa), sacado de lo poco azul y lo
# claro que es cada punto. Canal verde: el sombreado de la nube (claro arriba, gris en la panza). El juego (212) tiñe las nubes
# con el color de la hora y del tiempo, y las mueve despacio: así no traen otro sol pintado ni otra hora.
import bpy, sys, os, numpy as np
SRC = sys.argv[sys.argv.index('--') + 1]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'modelos', 'nubes.jpg')
im = bpy.data.images.load(SRC); W, H = im.size
A = np.array(im.pixels[:], dtype=np.float32).reshape(H, W, 4)[::-1, :, :3][:H // 2]
L = A @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
X = A / (np.percentile(L, 99.5) + 1e-4); X = np.clip(X, 0, 4); X = X / (1 + X) * 1.6
l = X.mean(-1); sat = (X[..., 2] - X[..., 0]) / (X[..., 2] + 1e-3)          # el azul del cielo: mucho más azul que rojo
cov = np.clip((0.42 - sat) / 0.32, 0, 1) * np.clip((l - 0.18) / 0.25, 0, 1)
cov = cov ** 1.2
v = (np.arange(H // 2) / (H // 2 - 1))[:, None]
cov *= np.clip((1 - v) / 0.08, 0, 1) * 0 + 1                                   # (hasta el horizonte)
shade = np.clip((l - l.min()) / (np.percentile(l, 99) - l.min() + 1e-4), 0, 1)
out = np.stack([cov, shade, np.zeros_like(cov)], -1)
img = bpy.data.images.new('nubes', W, H // 2, alpha=False)
img.pixels.foreach_set(np.concatenate([out[::-1], np.ones((H // 2, W, 1))], -1).astype(np.float32).ravel())
img.filepath_raw = OUT; img.file_format = 'JPEG'; bpy.context.scene.render.image_settings.quality = 85; img.save()
print('NUBES', OUT, os.path.getsize(OUT), W, H // 2, 'cobertura media %.2f' % float(cov.mean()))
