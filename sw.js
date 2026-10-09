/* HabHab Ta Bai! | service worker
   - Caches the whole site on first visit so it opens offline.
   - Serves the saved copy instantly, then quietly refreshes it in the background,
     so price or menu changes show up on the next visit.
   - When you publish changes, raise the number in VERSION to clear old files. */
const VERSION = 'habhab-v3';

const CORE = [
  './',
  'index.html',
  'css/style.css',
  'js/config.js',
  'js/main.js',
  'manifest.webmanifest',
  'images/logo-640.webp',
  'images/favicon.png',
  'images/apple-touch-icon.png',
  'images/icon-192.png',
  'images/icon-512.png',
  'images/icon-maskable-512.png',
  'images/pares.webp',
  'images/pares-egg.webp',
  'images/pares-overload.webp',
  'images/mami.webp',
  'images/mami-egg.webp',
  'images/mami-overload.webp',
  'images/pastil.webp',
  'images/pastil-egg.webp',
  'images/siomai.webp',
  'images/siomai-rice.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!sameOrigin && !isFont) return;

  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const cached = await cache.match(req, { ignoreSearch: sameOrigin });
    const refresh = fetch(req).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    }).catch(() => null);

    if (cached) { event.waitUntil(refresh); return cached; }

    const res = await refresh;
    if (res) return res;

    if (req.mode === 'navigate') {
      const page = (await cache.match('index.html')) || (await cache.match('./'));
      if (page) return page;
    }
    return new Response('You are offline.', { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/plain' } });
  })());
});
