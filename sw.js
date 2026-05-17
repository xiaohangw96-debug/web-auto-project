const CACHE = 'clauses-v4';

// install — 不预缓存任何文件，全部走运行时缓存
self.addEventListener('install', () => {
  self.skipWaiting();
});

// activate — 清空所有旧缓存，立即接管所有页面
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  e.waitUntil(self.clients.claim());
});

// 运行时缓存：网络优先，失败再读缓存
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(response => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
      }
      return response;
    }).catch(() => caches.match(e.request))
  );
});
