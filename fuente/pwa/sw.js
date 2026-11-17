// Nóstos sin conexión (service worker). Lo registra el cargador de atenas.html (index.html en la web) cuando se sirve por https
// y no va dentro de un marco (en Claude no se usa).
//  · datos/*?v=<huella>: primero la caché. Cada archivo lleva la huella de su contenido, así que una copia guardada nunca queda vieja;
//    cuando cambia, la dirección es otra y se descarga una sola vez.
//  · la página, version.json, el manifiesto y los iconos: primero la red (para ver enseguida las versiones nuevas) y, sin conexión, la copia.
//  · three.js (CDN): primero la caché.
// La página, al arrancar, manda la lista completa de sus datos (también los que se traen más tarde) para guardarlos en segundo plano,
// y se borran las copias de datos que ya no están en la lista.
const C='nostos-v1';
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(['./','manifest.webmanifest','icono-192.png','icono-512.png',...CDN].map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
const cacheFirst=async req=>{const c=await caches.open(C);const hit=await c.match(req);if(hit)return hit;const r=await fetch(req);if(r.ok||r.type==='opaque')c.put(req,r.clone());return r;};
const netFirst=async req=>{const c=await caches.open(C);try{const r=await fetch(req);if(r.ok)c.put(req,r.clone());return r;}catch(e){const hit=await c.match(req,{ignoreSearch:true});if(hit)return hit;throw e;}};
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const u=new URL(req.url);
  if(u.origin===location.origin&&/\/datos\//.test(u.pathname))e.respondWith(cacheFirst(req));
  else if(CDN.includes(u.href))e.respondWith(cacheFirst(req));
  else if(u.origin===location.origin)e.respondWith(netFirst(req));});
self.addEventListener('message',e=>{const L=e.data&&e.data.datos;if(!Array.isArray(L))return;
  const want=new Set(L.map(x=>new URL(x,self.registration.scope).href));
  e.waitUntil(caches.open(C).then(async c=>{
    for(const k of await c.keys())if(/\/datos\//.test(k.url)&&!want.has(k.url))await c.delete(k);   // versiones viejas
    for(const u of want)if(!/\/datos\//.test(u)){try{const r=await fetch(u);if(r.ok)await c.put(u,r);}catch(err){}}   // la propia página (la primera vez llega antes que el service worker), siempre la última
    for(const u of want)if(!(await c.match(u))){try{const r=await fetch(u);if(r.ok)await c.put(u,r);}catch(err){}}   // las que faltan (también las que se traen más tarde)
  }));});
