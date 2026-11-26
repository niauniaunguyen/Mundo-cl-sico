// Service worker de Microcosmos: guarda el juego para jugar sin conexión.
// La versión cambia con cada compilación: al publicar una nueva, el móvil la descarga solo.
const CACHE = 'microcosmos-a25a408f92';
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
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); return res; })));
  }
});
