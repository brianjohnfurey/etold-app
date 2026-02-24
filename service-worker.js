/* E-TOLD PWA service worker */
const CACHE_NAME = 'etold-cache-v2-v6b';
const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './etold-data.js',
  './app.js',
  './manifest.json',
  './offline.html',
  './assets/lion_3bd99eef8ac1.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/icon-1024.png',
];

// Install: cache core
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    self.skipWaiting();
  })());
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME) ? caches.delete(k) : Promise.resolve()));
    self.clients.claim();
  })());
});

// Fetch: cache-first for same-origin requests
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET
  if (req.method !== 'GET') return;

  // Only same-origin (avoid caching google fonts etc.)
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    if (cached) return cached;

    try {
      const fresh = await fetch(req);
      // Cache a copy (best effort)
      cache.put(req, fresh.clone()).catch(() => {});
      return fresh;
    } catch (e) {
      // Navigation fallback
      if (req.mode === 'navigate') {
        return cache.match('./offline.html');
      }
      throw e;
    }
  })());
});
