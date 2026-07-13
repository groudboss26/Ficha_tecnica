const CACHE_NAME = 'receitas-verdemar-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon.svg',
  './icon.png',
  './bg.png'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Cache strategy: cache-first / stale-while-revalidate for local assets and Google Fonts
  const isGoogleFont = url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');
  const isLocalAsset = ASSETS.some(asset => e.request.url.includes(asset.replace('./', '')));

  if (isLocalAsset || isGoogleFont) {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch new version in background to update cache
          fetch(e.request).then((networkResponse) => {
            if (networkResponse.status === 200 || networkResponse.type === 'opaque') {
              caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
            }
          }).catch(() => {/* Silently fail network error when offline */});
          
          return cachedResponse;
        }

        return fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200 || networkResponse.type === 'opaque') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
          }
          return networkResponse;
        });
      })
    );
  } else {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  }
});
