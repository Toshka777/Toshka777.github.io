const CACHE_NAME = 'my-app-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './questions.json',
  './exam.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        urlsToCache.map(url => 
          cache.add(url).catch(error => console.warn(`Failed to cache ${url}:`, error))
        )
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request);
      });
    })
  );
});


