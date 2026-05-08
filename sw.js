const CACHE_NAME = 'vessel-pwa-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/stats.html',
  '/style.css',
  '/app.js',
  '/stats.js',
  '/manifest.json',
  '/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(ASSETS.map(url => cache.add(url)));
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
