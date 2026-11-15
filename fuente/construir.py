# Construye atenas.html: une la plantilla fuente/atenas.src.html con los módulos de fuente/codigo/, incrusta en fuente/atenas.src.html, en base64, modelos/atenas_modelos.glb (marcador @@GLB@@)
# y la imagen de «La escuela de Atenas» de Rafael (marcador @@RAFAEL@@); i18n.py añade las traducciones al catalán y al inglés
import base64, pathlib, sys, hashlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import i18n
raiz = pathlib.Path(__file__).resolve().parent.parent
src = (raiz / 'fuente' / 'atenas.src.html').read_text(encoding='utf-8')
# el código está repartido en módulos (fuente/codigo/NNN_nombre.js); se unen en orden en el marcador @@CODIGO@@
mods = sorted((raiz / 'fuente' / 'codigo').glob('*.js'))
assert mods, 'no hay módulos en fuente/codigo'
assert src.count('@@CODIGO@@') == 1, 'falta el marcador @@CODIGO@@'
src = src.replace('@@CODIGO@@', ''.join(m.read_text(encoding='utf-8') for m in mods))
glb = (raiz / 'modelos' / 'atenas_modelos.glb').read_bytes()
glb2 = (raiz / 'modelos' / 'animales.glb').read_bytes()   # animales (modelos/animales.blend)
img = (raiz / 'modelos' / 'escuela_de_atenas.jpg').read_bytes()
assert src.count('@@GLB@@') == 1, 'falta el marcador @@GLB@@'
assert src.count('@@GLB2@@') == 1, 'falta el marcador @@GLB2@@'
assert src.count('@@RAFAEL@@') == 1, 'falta el marcador @@RAFAEL@@'
src, n_tr = i18n.build(src)
lupa_p = raiz / 'modelos' / 'vesubio_noche.jpg'   # cuadro del Vesubio en erupción de noche: imagen de la presentación de Roma
lupa = lupa_p.read_bytes() if lupa_p.exists() else b''
assert src.count('@@LOBA@@') == 1, 'falta el marcador @@LOBA@@ (imagen de Roma)'
out = src.replace('@@LOBA@@', base64.b64encode(lupa).decode('ascii')).replace('@@GLB@@', base64.b64encode(glb).decode('ascii')).replace('@@GLB2@@', base64.b64encode(glb2).decode('ascii')).replace('@@RAFAEL@@', base64.b64encode(img).decode('ascii'))
ver = hashlib.sha1(out.encode('utf-8')).hexdigest()[:12]   # versión: huella del contenido (para el aviso de versión nueva en la web)
assert out.count('@@VER@@') == 1, 'falta el marcador @@VER@@'
out = out.replace('@@VER@@', ver)
(raiz / 'atenas.html').write_text(out, encoding='utf-8')
(raiz / 'version.json').write_text(json.dumps({'v': ver}), encoding='utf-8')
try:
    import runpy; runpy.run_path(str(raiz / 'herramientas' / 'indice_modulos.py'))   # índice de módulos al día
except Exception as e:
    print('aviso: no se pudo escribir el índice de módulos:', e)
print(f'atenas.html: {len(out.encode("utf-8"))/1e6:.2f} MB (GLB {len(glb)/1e3:.0f} KB + animales {len(glb2)/1e3:.0f} KB, imagen {len(img)/1e3:.0f} KB, {n_tr} textos traducibles)')
