'use strict';

const VERSION = '1';
const CACHE_NAME = 'offline-demo-' + VERSION;
const OFFLINE_URL = 'offline_page.html';

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      // PRE-CACHING step
      // We cache static files essential for our "app shell"
      .then(cache => cache.addAll([
        './styles.css',
        './images/offline_img.png',
        'favicon.ico',
        OFFLINE_URL
      ]))
  );
});

self.addEventListener('activate', (event) => {
  // Here we might get rid of old caches
});

this.addEventListener('fetch', event => {
  // Navigate request is created while navigating between site pages
  if (event.request.mode === 'navigate') {
    event.respondWith(
      // Fetch fails -> return offline page
      fetch(event.request.url)
      .catch(_ => {
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    event.respondWith(
      // cache first strategy, fallback to network
      caches.match(event.request)
        .then(function (response) {
          return response || fetch(event.request);
        })
    );
  }
});