const CACHE_NAME = 'etold-v14-23';
const PRECACHE = [
  "./",
  "index.html",
  "app-loader.js",
  "manifest.json",
  "offline.html",
  "assets/lion.png",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "code/loader-manifest.json",
  "code/script0.part1.txt",
  "code/script0.part2.txt",
  "code/script0.part3.txt",
  "code/script0.part4.txt",
  "code/script0.part5.txt",
  "code/script0.part6.txt",
  "code/script1.part1.txt",
  "code/script1.part2.txt",
  "code/script2.part1.txt",
  "code/script3.part1.txt",
  "code/script4.part1.txt",
  "code/script5.part1.txt",
  "code/script6.part1.txt"
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
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(()=>{});
      return resp;
    }).catch(() => caches.match('offline.html')))
  );
});
