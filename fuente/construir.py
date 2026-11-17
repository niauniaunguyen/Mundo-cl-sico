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
import gzip
# personajes hechos en Blender (herramientas/blender/personajes.py), comprimidos con gzip: el juego los descomprime al cargar
PJ = ['ciudadano', 'hoplita', 'mujer', 'obrero', 'togado', 'romana', 'legionario']
pj_tags = ''.join('<script type="application/octet-stream" id="glbpj_%s">%s</script>\n' % (k, base64.b64encode(gzip.compress((raiz / 'modelos' / ('personaje_%s_juego.glb' % k)).read_bytes(), 9, mtime=0)).decode('ascii')) for k in PJ)
# copas de detalle de los árboles cercanos (herramientas/blender/plantas.py): se traen en segundo plano
_pl = raiz / 'modelos' / 'plantas_juego.glb'
if _pl.exists(): pj_tags += '<script type="application/octet-stream" id="glbpl" data-lazy="1">%s</script>\n' % base64.b64encode(gzip.compress(_pl.read_bytes(), 9, mtime=0)).decode('ascii')
_ar = raiz / 'modelos' / 'arquitectura_juego.glb'   # columnas de detalle (herramientas/blender/arquitectura.py), también en segundo plano
if _ar.exists(): pj_tags += '<script type="application/octet-stream" id="glbar" data-lazy="1">%s</script>\n' % base64.b64encode(gzip.compress(_ar.read_bytes(), 9, mtime=0)).decode('ascii')
# versión alta (personas cercanas): se carga en segundo plano tras arrancar (data-lazy: el cargador no la espera)
pj_tags += ''.join('<script type="application/octet-stream" id="glbpj_%s_alta" data-lazy="1">%s</script>\n' % (k, base64.b64encode(gzip.compress((raiz / 'modelos' / ('personaje_%s_alta.glb' % k)).read_bytes(), 9, mtime=0)).decode('ascii')) for k in PJ if (raiz / 'modelos' / ('personaje_%s_alta.glb' % k)).exists())
assert src.count('@@GLB@@') == 1, 'falta el marcador @@GLB@@'
assert src.count('@@GLB2@@') == 1, 'falta el marcador @@GLB2@@'
assert src.count('@@RAFAEL@@') == 1, 'falta el marcador @@RAFAEL@@'
src, n_tr = i18n.build(src)
lupa_p = raiz / 'modelos' / 'vesubio_noche.jpg'   # cuadro del Vesubio en erupción de noche: imagen de la presentación de Roma
lupa = lupa_p.read_bytes() if lupa_p.exists() else b''
assert src.count('@@LOBA@@') == 1, 'falta el marcador @@LOBA@@ (imagen de Roma)'
dem_p = raiz / 'modelos' / 'relieve_real.json'   # relieve real de los destinos (Copernicus GLO-30): herramientas/relieve_real/dem_todos.py
dem = dem_p.read_text(encoding='utf-8') if dem_p.exists() else '{}'
assert src.count('@@DEM@@') == 1, 'falta el marcador @@DEM@@ (relieve real)'
# un bloque por modo: cada partida solo trae el relieve de su época
_demj = json.loads(dem) if dem.strip() else {}
_dl = '<script type="application/json" id="demdata">@@DEM@@</script>'
assert src.count(_dl) == 1, 'el marcador @@DEM@@ debe ir en <script id="demdata">'
MODOS = ['atenas', 'roma']
src = src.replace(_dl, '\n'.join('<script type="application/json" id="demdata_%s">%s</script>' % (m, json.dumps({m: _demj.get(m, {})}, separators=(',', ':'))) for m in MODOS))
out = src.replace('@@LOBA@@', base64.b64encode(lupa).decode('ascii')).replace('@@GLB@@', base64.b64encode(glb).decode('ascii')).replace('@@GLB2@@', base64.b64encode(glb2).decode('ascii')).replace('@@RAFAEL@@', base64.b64encode(img).decode('ascii')).replace('@@GLBPJ@@', pj_tags)
# firma del relieve: solo el código de los módulos que definen o modifican las funciones de altura y color del terreno.
# La caché del relieve en el navegador (161_rendimiento.js) usa esta firma: sobrevive a las versiones que no tocan el terreno.
import re as _re
_TN = ['displayH','terrainH','terrainH0','islandH','islandBase','buildTerrain','buildIslandMesh','terrainMat','fieldAt','fieldType','flatAt','padIndex',
       'defineIslandLayout','defineMainlandLayout','demH','demGet','demGrid','demSea','demData','reliefPost','reliefLimit','reliefGully','reliefMask','RELIEF','islandOf','riverWater','GRASS_C','GREEN_C','SAND_C','ROCK_C','ISLANDS']
_tre = _re.compile(r'(?:function\s+(?:%s)\s*\(|(?<![\w$.])(?:%s)\s*=(?!=)|(?:const|let|var)\s+(?:%s)\s*=)' % (('|'.join(_TN),)*3))
_tmods = [m for m in mods if _tre.search(m.read_text(encoding='utf-8'))]
def _tpart(m):   # del arranque (900) y de la propia caché (161) solo cuentan las líneas que tocan el relieve: cambian a menudo por otras cosas
    t = m.read_text(encoding='utf-8')
    return '\n'.join(l for l in t.split('\n') if _tre.search(l)) if m.name[:3] in ('900', '161') else t
tsig = hashlib.sha1((''.join(m.name + _tpart(m) for m in _tmods) + hashlib.sha1(dem.encode('utf-8')).hexdigest()).encode('utf-8')).hexdigest()[:12]   # con los datos del relieve real
assert out.count('@@TSIG@@') == 1, 'falta el marcador @@TSIG@@'
out = out.replace('@@TSIG@@', tsig)
ver = hashlib.sha1(out.encode('utf-8')).hexdigest()[:12]   # versión: huella del contenido (para el aviso de versión nueva en la web)
assert out.count('@@VER@@') == 1, 'falta el marcador @@VER@@'
out = out.replace('@@VER@@', ver)
# Dos salidas:
#  · atenas_un_archivo.html: todo en un archivo, para abrirlo sin conexión con doble clic (no se publica en Claude: pasa de 16 MB);
#  · atenas.html + datos/: la página ligera con un cargador que trae el código (datos/juego.js) y los datos (modelos, imágenes,
#    relieve) antes de arrancar. Así ningún archivo pasa del límite de 16 MB de una página de Claude y el relieve real cabe.
#    Necesita servirse desde una web o un servidor (con doble clic, el navegador no deja leer datos/; para eso está el otro).
(raiz / 'atenas_un_archivo.html').write_text(out, encoding='utf-8')
datos = raiz / 'datos'; datos.mkdir(exist_ok=True)
for f in datos.glob('*'):
    if f.suffix in ('.txt', '.js'): f.unlink()
light = out
# Ninguno se espera para arrancar: el cargador solo espera al código (juego.js) y adelanta la descarga de los que sirven a las dos
# épocas (data-pre); el juego pide cada bloque cuando lo necesita (datoGet, 000_inicio.js): el relieve y los personajes de la época
# elegida al elegirla, las imágenes y las versiones altas cuando toca. Cada archivo lleva su propia huella (?v=): al publicar una
# versión nueva, el navegador solo vuelve a descargar los que han cambiado.
PRE = {'glb', 'glb2', 'rafaelimg', 'lobaimg'}
for idn in ['glb', 'glb2'] + ['glbpj_' + k for k in PJ] + ['glbpj_%s_alta' % k for k in PJ if (raiz / 'modelos' / ('personaje_%s_alta.glb' % k)).exists()] + (['glbpl'] if _pl.exists() else []) + (['glbar'] if _ar.exists() else []) + ['rafaelimg', 'lobaimg'] + ['demdata_' + m for m in MODOS]:
    m = _re.search(r'(<script[^>]*\bid="%s"[^>]*>)([\s\S]*?)(</script>)' % idn, light)
    assert m, 'no encuentro el bloque ' + idn
    (datos / (idn + '.txt')).write_text(m.group(2), encoding='utf-8')
    h = hashlib.sha1(m.group(2).encode('utf-8')).hexdigest()[:10]
    light = light[:m.start()] + m.group(1)[:-1] + ' data-src="datos/%s.txt?v=%s"%s>' % (idn, h, ' data-pre="1"' if idn in PRE else '') + m.group(3) + light[m.end():]
i = light.rfind('<script>'); j = light.rfind('</script>')
assert i > 0 and j > i
(datos / 'juego.js').write_text(light[i + 8:j], encoding='utf-8')
vj = hashlib.sha1(light[i + 8:j].encode('utf-8')).hexdigest()[:10]
BOOT = ('<script>/* cargador: trae el código del juego (datos/juego.js) y arranca; los datos los pide el juego cuando le hacen falta */(function(){var m=document.createElement("div");'
        'm.id="cargador";m.style.cssText="position:fixed;left:0;right:0;bottom:14px;text-align:center;font:15px Georgia,serif;color:#e8dcc0;text-shadow:0 1px 3px #000;z-index:9999;pointer-events:none";'
        'm.textContent="Cargando Nóstos…";document.body.appendChild(m);'
        'function f(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(u+" ("+r.status+")");return r.text();});}'
        'var PW=(location.protocol=="https:"||location.hostname=="localhost")&&"serviceWorker" in navigator&&(location.hash!="#debug"||/[?&]sw=1/.test(location.search));try{if(window.top!==window)PW=false;}catch(e){PW=false;}'
        'if(PW){var ml=document.createElement("link");ml.rel="manifest";ml.href="manifest.webmanifest";document.head.appendChild(ml);navigator.serviceWorker.register("sw.js").catch(function(){});}'
        'var P=window.__pre={};[].forEach.call(document.querySelectorAll("script[data-pre]"),function(e){P[e.id]=f(e.getAttribute("data-src"));P[e.id].catch(function(){});});'
        'fetch("datos/juego.js?v=%s").then(function(r){if(!r.ok)throw new Error("datos/juego.js ("+r.status+")");var L=+r.headers.get("content-length")||0;if(!L||r.headers.get("content-encoding")||!r.body||!window.TextDecoder)return r.text();'
        'var rd=r.body.getReader(),d=new TextDecoder(),s="",n=0;return(function g(){return rd.read().then(function(x){if(x.done)return s+d.decode();n+=x.value.length;s+=d.decode(x.value,{stream:true});m.textContent="Cargando Nóstos… "+Math.min(99,Math.round(100*n/L))+" %%";return g();});})();})'
        '.then(function(code){var s=document.createElement("script");s.textContent=code;document.body.appendChild(s);m.remove();'
        'if(PW)navigator.serviceWorker.ready.then(function(r){var L=[].map.call(document.querySelectorAll("script[data-src]"),function(e){return e.getAttribute("data-src");});L.push("datos/juego.js?v=%s",location.pathname);if(r.active)r.active.postMessage({datos:L});}).catch(function(){});})'
        '.catch(function(err){m.style.pointerEvents="auto";m.textContent="No se pudieron cargar los datos del juego: "+err.message+". Si lo has abierto con doble clic desde una carpeta, abre atenas_un_archivo.html.";});})();</script>') % (vj, vj)
light = light[:i] + BOOT + light[j + 9:]
(raiz / 'atenas.html').write_text(light, encoding='utf-8')
# juego instalable y sin conexión (fuente/pwa: service worker, manifiesto e iconos): se copian junto a atenas.html para servirlos desde la
# misma carpeta (la web de GitHub Pages los copia junto a index.html); no se guardan en git
import shutil
for _f in (raiz / 'fuente' / 'pwa').glob('*'): shutil.copy(_f, raiz / _f.name)
(raiz / 'version.json').write_text(json.dumps({'v': ver}), encoding='utf-8')
try:
    import runpy; runpy.run_path(str(raiz / 'herramientas' / 'indice_modulos.py'))   # índice de módulos al día
except Exception as e:
    print('aviso: no se pudo escribir el índice de módulos:', e)
print(f'atenas.html: {len(light.encode("utf-8"))/1e3:.0f} KB + datos/ {sum(f.stat().st_size for f in datos.glob("*"))/1e6:.2f} MB (juego.js {(datos/"juego.js").stat().st_size/1e6:.2f} MB) · atenas_un_archivo.html: {len(out.encode("utf-8"))/1e6:.2f} MB (GLB {len(glb)/1e3:.0f} KB + animales {len(glb2)/1e3:.0f} KB, imagen {len(img)/1e3:.0f} KB, {n_tr} textos traducibles)')
