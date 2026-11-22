// Offline support: caches the app shell. Bump VERSION whenever you change a file: the new version is fetched in the
// background and used from the next launch (the app never waits on the network to open, even on a bad connection).
const VERSION = "hellofox-v26";
const SHELL = [
  "./", "index.html", "styles.css", "app.js", "lessons.js", "level2.js", "missions.js", "i18n.js", "art.js", "art2.js", "manifest.webmanifest",
  "fonts/fonts.css", "fonts/fredoka-latin-600-normal.woff2", "fonts/fredoka-latin-700-normal.woff2",
  "fonts/nunito-latin-600-normal.woff2", "fonts/nunito-latin-700-normal.woff2", "fonts/nunito-latin-800-normal.woff2",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Same-origin GET only; third-party requests (YouTube) are never touched or cached.
// Cached copy first, so the app opens at once, offline or on a weak connection. The network copy is fetched in the
// background and stored for next time, but only when it is a real success: an error page is never cached.
// Offline with nothing cached: a page load gets the app shell; anything else (an image, a font) just fails.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  e.respondWith(
    caches.open(VERSION).then(async (c) => {
      const cached = await c.match(e.request);
      const fresh = fetch(e.request).then((res) => { if (res.ok) c.put(e.request, res.clone()); return res; }).catch(() => null);
      if (cached) { e.waitUntil(fresh); return cached; }
      const res = await fresh;
      if (res) return res;
      if (e.request.mode === "navigate") { const shell = await c.match("index.html"); if (shell) return shell; }
      return Response.error();
    })
  );
});
