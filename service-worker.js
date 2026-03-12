const CACHE_NAME = 'etold-cache-v10-3-0';
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./app-loader.js",
  "./manifest.json",
  "./offline.html",
  "./assets/lion.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-1024.png",
  "./icons/apple-touch-icon.png",
  "./code/overrides.js",
  "./code/script0.part1.txt",
  "./code/script0.part2.txt",
  "./code/script0.part3.txt",
  "./code/script1.txt",
  "./code/script2.txt",
  "./code/script3.txt",
  "./code/script4.txt"
];
self.addEventListener('install', event => {
  event.waitUntil((async()=>{
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()));
    self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async()=>{
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req, {ignoreSearch:true});
    if (cached) return cached;
    try {
      const resp = await fetch(req);
      if (req.method === 'GET' && resp && resp.status === 200) cache.put(req, resp.clone());
      return resp;
    } catch (e) {
      return (await cache.match('./offline.html')) || new Response('Offline', {status:503, headers:{'Content-Type':'text/plain'}});
    }
  })());
});
