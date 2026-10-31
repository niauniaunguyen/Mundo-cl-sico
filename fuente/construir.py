# Construye atenas.html: incrusta en fuente/atenas.src.html, en base64, modelos/atenas_modelos.glb (marcador @@GLB@@)
# y la imagen de «La escuela de Atenas» de Rafael (marcador @@RAFAEL@@); i18n.py añade las traducciones al catalán y al inglés
import base64, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import i18n
raiz = pathlib.Path(__file__).resolve().parent.parent
src = (raiz / 'fuente' / 'atenas.src.html').read_text(encoding='utf-8')
glb = (raiz / 'modelos' / 'atenas_modelos.glb').read_bytes()
glb2 = (raiz / 'modelos' / 'animales.glb').read_bytes()   # animales (modelos/animales.blend)
img = (raiz / 'modelos' / 'escuela_de_atenas.jpg').read_bytes()
assert src.count('@@GLB@@') == 1, 'falta el marcador @@GLB@@'
assert src.count('@@GLB2@@') == 1, 'falta el marcador @@GLB2@@'
assert src.count('@@RAFAEL@@') == 1, 'falta el marcador @@RAFAEL@@'
src, n_tr = i18n.build(src)
out = src.replace('@@GLB@@', base64.b64encode(glb).decode('ascii')).replace('@@GLB2@@', base64.b64encode(glb2).decode('ascii')).replace('@@RAFAEL@@', base64.b64encode(img).decode('ascii'))
(raiz / 'atenas.html').write_text(out, encoding='utf-8')
print(f'atenas.html: {len(out.encode("utf-8"))/1e6:.2f} MB (GLB {len(glb)/1e3:.0f} KB + animales {len(glb2)/1e3:.0f} KB, imagen {len(img)/1e3:.0f} KB, {n_tr} textos traducibles)')
