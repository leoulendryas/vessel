const CACHE_NAME = 'vessel-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/stats.html',
  '/style.css',
  '/data.js',
  '/app.js',
  '/stats.js',
  '/config.js',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
