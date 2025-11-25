importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

// =====================================
// CONTROL INMEDIATO DEL SW
// =====================================
workbox.core.skipWaiting();
workbox.core.clientsClaim();

// =====================================
// PRECACHE ESTÁTICO
// =====================================
workbox.precaching.precacheAndRoute([
  { url: "/pages/deslinde.html", revision: "1" },
  
  { url: "/pages/nosotros.html", revision: "1" },
  { url: "/pages/contacto.html", revision: "1" },
  { url: "/pages/politicas.html", revision: "1" },
  { url: "/pages/terminos.html", revision: "1" },
  { url: "/pages/ubicacion.html", revision: "1" },
  { url: "/offline.html", revision: "1" }
]);

// =====================================
// ARCHIVOS ESTÁTICOS (CSS / JS)
// =====================================
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "worker",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "static-resources",
  })
);

// =====================================
// IMÁGENES CLOUDINARY
// =====================================
workbox.routing.registerRoute(
  ({ url }) => url.origin === "https://res.cloudinary.com",
  new workbox.strategies.CacheFirst({
    cacheName: "cloudinary-images",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 80,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// =====================================
// ARCHIVOS DE NEXT (si usas Next.js)
// =====================================
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("/_next/static/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "next-static",
  })
);

// =====================================
// API PRODUCTOS
// =====================================
workbox.routing.registerRoute(
  ({ url }) =>
    url.href.startsWith("http://localhost:4000/api/productos"),
  new workbox.strategies.NetworkFirst({
    cacheName: "api-productos",
    networkTimeoutSeconds: 4,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// =====================================
// FALLBACK GLOBAL
// =====================================
workbox.routing.setCatchHandler(async ({ event, request }) => {
  if (request && request.destination === "document") {
    const cache = await caches.open(workbox.core.cacheNames.precache);
    const offlinePage = await cache.match("/offline.html");
    return offlinePage || new Response("<h1>Offline</h1>", {
      headers: { "Content-Type": "text/html" }
    });
  }
  return Response.error();
});
