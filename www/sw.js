const VER = 'atom-bills-cap-v1';
const ASSETS = [
  './',
  './index.html',
  './billing.html',
  './proprietor.html',
  './calculator.html',
  './accountant.html',
  './common.css',
  './common.js',
  './capacitor-bridge.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './logo.png',
  './logo-white.png',
  './sounds/beep.mp3'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VER).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VER).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const u = e.request.url;
  if (
    u.includes('.html') ||
    u.includes('.js') ||
    u.includes('.css') ||
    u.endsWith('/') ||
    u.includes('billing') ||
    u.includes('proprietor') ||
    u.includes('calculator') ||
    u.includes('accountant')
  ) {
    e.respondWith(
      fetch(e.request)
        .then((r) => {
          const c = r.clone();
          caches.open(VER).then((cache) => cache.put(e.request, c));
          return r;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then((c) => c || fetch(e.request)));
});
