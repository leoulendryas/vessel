const CACHE_NAME = 'vessel-pwa-v19';
const ASSETS = [
  './',
  'index.html',
  'stats.html',
  'style.css',
  'app.js',
  'stats.js',
  'manifest.json',
  'alarm.mp3',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'screenshots/mobile.png',
  'screenshots/desktop.png'
];

// 1. Force the new service worker to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(ASSETS.map(url => cache.add(url)));
    })
  );
});

// 2. Take control of all pages immediately and cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
