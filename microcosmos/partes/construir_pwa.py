# Versión app (PWA) en /docs, para GitHub Pages: Three.js local, manifiesto, iconos y service worker.
# La llama construir.py después de generar microcosmos.html.
import hashlib, json, pathlib, shutil

CDN = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'
FILES = ['three.min.js', 'three-LICENSE.txt', 'icono.svg', 'icono-192.png', 'icono-512.png', 'icono-maskable-512.png', 'apple-touch-icon.png']

HEAD = """<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#03070c">
<meta name="description" content="Microcosmos: un RPG incremental de biología celular. Vence a bacterias, virus y otros organismos aprovechando sus características.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icono.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Microcosmos">
<script>
// guarda el aviso de instalación para el botón de Ajustes y registra el service worker (juego sin conexión)
window.__bip = null;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); window.__bip = e; });
if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
</script>
<style>html,body{margin:0;height:100%;background:#03070c;overscroll-behavior:none}body{touch-action:manipulation}</style>
"""

SW = """// Service worker de Microcosmos: guarda el juego para jugar sin conexión.
// La versión cambia con cada compilación: al publicar una nueva, el móvil la descarga solo.
const CACHE = 'microcosmos-%s';
const APP = ['./', 'index.html', 'three.min.js', 'manifest.webmanifest', 'icono.svg', 'icono-192.png', 'icono-512.png', 'icono-maskable-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const url = new URL(r.url);
  // el juego: primero la red (para tener la última versión); sin conexión, la copia guardada
  if (url.origin === location.origin){
    e.respondWith(fetch(r).then(res => { if (res.ok){ const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })
      .catch(() => caches.match(r, {ignoreSearch:true}).then(m => m || caches.match('index.html'))));
    return;
  }
  // las fuentes de Google: la copia guardada si existe; si no, se descargan y se guardan
  if (/fonts\\.(googleapis|gstatic)\\.com$/.test(url.hostname)){
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); return res; })));
  }
});
"""

def build(html, base):
    root = base.parent.parent / 'docs'; pwa = base.parent / 'pwa'
    root.mkdir(exist_ok=True)
    for f in FILES: shutil.copy(pwa / f, root / f)
    assert CDN in html, 'no se encuentra la etiqueta de Three.js'
    app = html.replace(CDN, '<script src="three.min.js"></script>').replace('<meta charset="utf-8">\n', '', 1)
    page = HEAD + app
    (root / 'index.html').write_text(page, encoding='utf-8')
    manifest = {"name":"Microcosmos", "short_name":"Microcosmos", "description":"Un RPG incremental de biología celular.", "lang":"es",
      "start_url":"./", "scope":"./", "display":"standalone", "orientation":"any", "background_color":"#03070c", "theme_color":"#03070c", "categories":["education", "games"],
      "icons":[{"src":"icono-192.png", "sizes":"192x192", "type":"image/png"}, {"src":"icono-512.png", "sizes":"512x512", "type":"image/png"},
               {"src":"icono-maskable-512.png", "sizes":"512x512", "type":"image/png", "purpose":"maskable"}, {"src":"icono.svg", "sizes":"any", "type":"image/svg+xml"}]}
    (root / 'manifest.webmanifest').write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding='utf-8')
    ver = hashlib.sha1(page.encode('utf-8')).hexdigest()[:10]
    (root / 'sw.js').write_text(SW % ver, encoding='utf-8')
    print(f'docs/ (PWA {ver}): index.html {len(page.encode("utf-8"))/1e3:.0f} KB')
