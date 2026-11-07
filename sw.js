const CACHE_NAME = "free27-shell-v3";
const APP_BASE = self.registration.scope;
const appUrl = (path) => new URL(path, APP_BASE).toString();
const APP_INDEX = appUrl("index.html");
const APP_SHELL = [
  "",
  "index.html",
  "app.js",
  "assets/style.css",
  "assets/inter-cyrillic-ext-wght-normal.woff2",
  "assets/inter-cyrillic-wght-normal.woff2",
  "assets/inter-latin-ext-wght-normal.woff2",
  "assets/inter-latin-wght-normal.woff2",
  "manifest.webmanifest",
  "icon.svg",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
].map(appUrl);

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match(APP_INDEX)))
  );
});
