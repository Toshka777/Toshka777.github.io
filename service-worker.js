const CACHE_NAME = 'my-app-cache-v17';
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
    caches.match(event.request).then(response => {
      if (response) {
        return response; // إرجاع الاستجابة من الكاش إذا كانت موجودة
      }
      return fetch(event.request).then(fetchResponse => {
        // التحقق من أن الاستجابة ليست جزئية (Partial Response)
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse;
        }
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});


