// VectorLogix Service Worker — Cache Invalidation v6.0
const CACHE_NAME = 'vectorlogix-v6.0';

// All files the app needs to run fully offline
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './components.js',
  './data.js',
  './app.js',
  './manifest.json',
  './icon-512.png'
];

// Install: pre-cache all assets & force immediate activation
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching v6.0 assets...');
      return cache.addAll(ASSETS);
    })
  );
});

// Activate: delete all old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
