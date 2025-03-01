const CACHE_NAME = 'my-app-cache-v4';
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
  self.skipWaiting(); // تفعيل الخدمة الجديدة فورًا
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // حذف الكاش القديم
          }
        })
      );
    })
  );
  self.clients.claim(); // جعل الخدمة الجديدة تتحكم في جميع العملاء فورًا
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


