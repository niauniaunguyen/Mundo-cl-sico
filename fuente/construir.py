# Construye atenas.html: incrusta en fuente/atenas.src.html, en base64, modelos/atenas_modelos.glb (marcador @@GLB@@)
# y la imagen de «La escuela de Atenas» de Rafael (marcador @@RAFAEL@@)
import base64, pathlib
raiz = pathlib.Path(__file__).resolve().parent.parent
src = (raiz / 'fuente' / 'atenas.src.html').read_text(encoding='utf-8')
glb = (raiz / 'modelos' / 'atenas_modelos.glb').read_bytes()
img = (raiz / 'modelos' / 'escuela_de_atenas.jpg').read_bytes()
assert src.count('@@GLB@@') == 1, 'falta el marcador @@GLB@@'
assert src.count('@@RAFAEL@@') == 1, 'falta el marcador @@RAFAEL@@'
out = src.replace('@@GLB@@', base64.b64encode(glb).decode('ascii')).replace('@@RAFAEL@@', base64.b64encode(img).decode('ascii'))
(raiz / 'atenas.html').write_text(out, encoding='utf-8')
print(f'atenas.html: {len(out.encode("utf-8"))/1e6:.2f} MB (GLB {len(glb)/1e3:.0f} KB, imagen {len(img)/1e3:.0f} KB)')
