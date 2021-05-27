'use strict';

const VERSION = '1';
const CACHE_NAME = 'offline-demo-' + VERSION;
const OFFLINE_URL = 'offline_page.html';

self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll([
        './styles.css',
        './images/offline_img.png',
        'favicon.ico',
        // Alternatively we can inline all resources needed by the offline page
        // making it self-contained
        'auto_reload.js',
        OFFLINE_URL
      ]);
    })()
  );
});

self.addEventListener('activate', event => {
  // Here we typically cleanup old caches if needed...
  event.waitUntil(
    (async () => {
      const keyList = await caches.keys();
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('SW: Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })()
  );
});

this.addEventListener('fetch', event => {
  // Navigate request is created while navigating between pages
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(event.request);

        // We are online
        return networkResponse;
      } catch (error) {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })()
    );
  }
  else {
    event.respondWith((async () => {
      // Cache first strategy, fallback to network
      const cachedAssets = await caches.match(event.request);
      return cachedAssets || fetch(event.request);
    })()
    );
  }
});