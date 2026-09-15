// Habesha Health Guide — Service Worker
// Caches all core assets for full offline use

const CACHE_NAME = 'habesha-health-guide-v1';
const OFFLINE_URL = '/';

const PRE_CACHE_URLS = [
  '/',
  '/symptom-checker',
  '/education',
  '/community-guide',
  '/insights',
  '/feedback',
  '/manifest.json',
];

const CACHE_DOMAINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'unpkg.com',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // This app has no backend API anymore — everything is local. Nothing to skip here,
  // but keep this in place in case you add a real API later.
  if (url.pathname.startsWith('/api/')) return;

  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          return cached || new Response('', { status: 503 });
        }
      })
    );
    return;
  }

  if (CACHE_DOMAINS.some((d) => url.hostname.includes(d))) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        return cache.match(OFFLINE_URL);
      }
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-logs') {
    console.log('[SW] Background sync triggered');
  }
});
