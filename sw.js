// Service Worker — Tarjeta Digital María Cristina Arteaga | Prosegur Tecnología
const CACHE_NAME = 'cristina-prosegur-v1';

const ASSETS = [
  '/cris.github.io/',
  '/cris.github.io/index.html',
  '/cris.github.io/manifest.json',
  '/cris.github.io/icon-180.png',
  '/cris.github.io/icon-192.png',
  '/cris.github.io/icon-512.png',
];

// Instalar: guardar todo en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activar: limpiar cachés viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Cache-first → si no hay red, sirve desde caché (funciona offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      }).catch(() => caches.match('/cris.github.io/index.html'));
    })
  );
});
