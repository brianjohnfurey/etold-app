const CACHE_NAME = 'etold-final-v17-18';
const PRECACHE = [
  "./",
  "index.html",
  "app-loader.js",
  "manifest.json",
  "service-worker.js",
  "offline.html",
  "assets/lion.png",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "code/app.part1.txt",
  "code/app.part2.txt",
  "code/app.part3.txt",
  "code/app.part4.txt",
  "code/app.part5.txt",
  "code/app.part6.txt",
  "code/app.part7.txt",
  "code/app.part8.txt"
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
      return resp;
    }).catch(() => caches.match('offline.html')))
  );
});
