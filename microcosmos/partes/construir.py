# Une las partes en microcosmos.html. Se ejecuta con: python microcosmos/partes/construir.py
import pathlib
d = pathlib.Path(__file__).resolve().parent
parts = ['datos.js', 'datos_extra.js', 'eventos.js', 'coleccion.js', 'tardio.js', 'idiomas_codigo.js', 'idiomas_ui.js', 'idiomas_ui2.js', 'idiomas_ui3.js', 'idiomas_ui4.js', 'idiomas_ui5.js', 'idiomas_ui6.js', 'idiomas_ui7.js', 'idiomas_datos.js', 'idiomas_datos2.js', 'estado.js', 'sonido.js', 'escena.js', 'combate.js', 'interfaz.js', 'interfaz2.js', 'arranque.js']
js = "(function(){\n'use strict';\nconst $ = s => document.querySelector(s);\nconst rnd = (a, b) => a + Math.random()*(b - a);\nconst clamp = (v, a, b) => Math.max(a, Math.min(b, v));\n\n"
js += ''.join((d / p).read_text(encoding='utf-8') for p in parts) + '})();\n'
html = (d / 'cabecera.html').read_text(encoding='utf-8')
html += '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n<script>\n' + js + '</script>\n'
(d.parent / 'microcosmos.html').write_text(html, encoding='utf-8')
print(f'microcosmos.html: {len(html.encode("utf-8"))/1e3:.0f} KB')

# versión app (PWA) en /docs
import sys; sys.path.insert(0, str(d))
import construir_pwa; construir_pwa.build(html, d)
