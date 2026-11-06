"use strict";

/*
 * Re-Late · Service Worker
 *
 * Archivos principales:
 *   index.html
 *   manifest.json
 *
 * Chart.js y los iconos son opcionales para la instalación
 * sin conexión, pero deben estar disponibles para una
 * experiencia completa.
 */

const CACHE_PREFIX = "relate-offline-";
const CACHE_NAME = `${CACHE_PREFIX}v4.1.2`;


const REQUIRED = [
  "./index.html",
  "./manifest.json"
];

const OPTIONAL = [
  "./favicon.ico",
  "./icon.svg",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js"
];

/*
 * Instalación:
 * los archivos esenciales deben descargarse correctamente.
 */
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    await cache.addAll(REQUIRED);

    await Promise.all(
      OPTIONAL.map(async url => {
        try {
          const response = await fetch(url);

          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (error) {
          console.warn("Recurso opcional no disponible:", url);
        }
      })
    );
  })());
});

/*
 * Activación:
 * únicamente se eliminan cachés anteriores de esta familia.
 */
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    await Promise.all(
      keys
        .filter(key => {
          return (
            key.startsWith(CACHE_PREFIX) &&
            key !== CACHE_NAME
          );
        })
        .map(key => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

/*
 * El index original puede enviar SKIP_WAITING al actualizar.
 */
self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/*
 * Navegación:
 * se intenta la red y, si no está disponible, se usa
 * el index precargado.
 */
self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        return await fetch(request);
      } catch (error) {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match("./index.html");

        if (cached) {
          return cached;
        }

        return new Response(
          "La aplicación no está disponible sin conexión.",
          {
            status: 503,
            headers: {
              "Content-Type": "text/plain; charset=utf-8"
            }
          }
        );
      }
    })());

    return;
  }

  const chartUrl =
    "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js";

  const isLocal = url.origin === self.location.origin;
  const isChart = url.href === chartUrl;

  if (!isLocal && !isChart) {
    return;
  }

  /*
   * Recursos locales y Chart.js:
   * primero la caché de esta versión y después la red.
   */
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    try {
      return await fetch(request);
    } catch (error) {
      return new Response("", {
        status: 503,
        statusText: "Sin conexión"
      });
    }
  })());
});

/*
 * Al pulsar una notificación, se intenta abrir Salud.
 */
self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil((async () => {
    const destination = new URL(
      "./index.html#salud",
      self.registration.scope
    ).href;

    const clients = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    /*
     * Solo reutilizar una ventana que pertenezca al ámbito
     * de esta aplicación.
     */
    const appClient = clients.find(client => {
      return client.url.startsWith(self.registration.scope);
    });

    if (appClient) {
      const navigated = await appClient.navigate(destination);

      if (navigated) {
        await navigated.focus();
      }

      return;
    }

    await self.clients.openWindow(destination);
  })());
});
