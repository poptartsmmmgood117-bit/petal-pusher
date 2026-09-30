// Keep this explicit list in sync with index.html, including exact ?v= query strings.
// Bump VERSION whenever any cached file changes, even if its URL stays the same.
const VERSION = 'v2';
const CACHE_PREFIX = 'petal-pusher:' + self.registration.scope + ':';
const CACHE_NAME = CACHE_PREFIX + VERSION;
const FILES = [
  './', './index.html', './manifest.webmanifest',
  './icon-180.png', './icon-192.png', './icon-512.png',
  './lib/phaser.min.js', './src/home.css?v=1',
  './src/art.js?v=2', './src/art2.js?v=2', './src/art3.js?v=2',
  './src/scene-art.js?v=2', './src/sfx.js?v=3', './src/music.js?v=2', './src/levels.js?v=2',
  './src/play.js?v=2', './src/fx.js?v=2', './src/shelf.js?v=3',
  './src/coach.js?v=2', './src/daily.js?v=1', './src/cozy.js?v=1',
  './src/transfer.js?v=2', './src/home-ui.js?v=2',
  './src/game.js?v=2', './src/offline.js?v=1',
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(FILES.map(url => new Request(new URL(url, self.registration.scope), { cache: 'reload' })));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Create the lifetime promise during dispatch, not after an awaited network response.
  const response = (async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const fresh = await fetch(request, { cache: 'no-store' });
      if (fresh.ok) {
        try { await cache.put(request, fresh.clone()); } catch (e) { /* storage full: still serve online */ }
        return fresh;
      }
      const cached = await cache.match(request);
      if (cached) return cached;
      return fresh;
    } catch (e) {
      const cached = await cache.match(request);
      if (cached) return cached;
      const start = new URL('./', self.registration.scope);
      if (request.mode === 'navigate' && (url.pathname === start.pathname || url.pathname === start.pathname + 'index.html')) {
        const shell = await cache.match(start.href);
        if (shell) return shell;
      }
      return Response.error();
    }
  })();
  event.respondWith(response);
  event.waitUntil(response.then(() => {}));
});
