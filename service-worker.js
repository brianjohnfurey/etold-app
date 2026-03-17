
const CACHE_NAME='etold-preserve-v1';
const PRECACHE=["./", "./index.html", "./app-loader.js", "./manifest.json", "./offline.html", "./assets/lion.png", "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png", "./code/html-manifest.json", "./code/html.part1.txt", "./code/html.part2.txt", "./code/html.part3.txt", "./code/html.part4.txt", "./code/html.part5.txt", "./code/html.part6.txt", "./code/html.part7.txt", "./code/html.part8.txt"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):Promise.resolve()))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy)).catch(()=>{});return resp;}).catch(()=>caches.match('./offline.html'))));
});
