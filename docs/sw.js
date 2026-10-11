const PREFIX = `lianji-${encodeURIComponent(new URL(self.registration.scope).pathname)}-`;
const CACHE = `${PREFIX}v2.0.2`;
const url = file => new URL(file, self.registration.scope).href;
const CORE = ['index.html', 'style.css', 'app.js', 'catalog.js'].map(url);
const OPTIONAL = ['manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'].map(url);
const ASSETS = new Set([...CORE, ...OPTIONAL]);

async function cacheOptional(cache, href) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch(href, { cache: 'reload', signal: controller.signal });
    if (response.ok) await cache.put(href, response);
  } finally { clearTimeout(timer); }
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // A failed core download leaves the previous worker and its cache intact.
    await cache.addAll(CORE.map(href => new Request(href, { cache: 'reload' })));
    await Promise.allSettled(OPTIONAL.map(href => cacheOptional(cache, href)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestURL = new URL(event.request.url);
  const scope = new URL(self.registration.scope);
  if (requestURL.origin !== scope.origin) return;
  requestURL.search = '';
  requestURL.hash = '';
  // Both the home URL and index.html share one cached shell, including query links.
  const canonical = requestURL.href === scope.href ? url('index.html') : requestURL.href;
  if (!ASSETS.has(canonical)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(canonical);
    if (hit) return hit;
    const response = await fetch(new Request(canonical, { cache: 'reload' }));
    if (response.ok) {
      try { await cache.put(canonical, response.clone()); } catch { /* Keep an online response usable if storage is full. */ }
    }
    return response;
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type !== 'OFFLINE_STATUS' || !event.ports[0]) return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const hits = await Promise.all(CORE.map(href => cache.match(href)));
    event.ports[0].postMessage({ ready: hits.every(Boolean) });
  })());
});
