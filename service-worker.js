/* ============================================================
 Re-Late Ejercicio Saludable — SERVICE WORKER  v3.1.2
 ------------------------------------------------------------
 ⚠️ 1) VERSION debe coincidir SIEMPRE con APP_VERSION de index.html.
 ⚠️ 2) PRECACHE_CDN debe coincidir EXACTAMENTE con las URLs del <head>
       de index.html (Chart.js fijado a 4.4.1 y la hoja de Inter).
 ------------------------------------------------------------
 Estrategia por recurso:
   • index.html / navegación ......... red primero (4 s) → caché → "sin conexión"
   • Chart.js + Google Fonts ......... obsoleto-mientras-se-renueva (funciona offline)
   • iconos / manifest / estáticos ... caché primero
   • enlaces externos (FEC, Sanidad…) sin cachear (paso directo a la red)
 ============================================================ */
'use strict';

const VERSION = '3.1.2';
const CACHE   = 'relate-v' + VERSION;      // se purgan todas las demás al activar

/* --- App shell (archivos locales de la misma carpeta) --- */
const SHELL = [
'./',
'./index.html',
'./manifest.json',
'./icon.svg',
'./favicon.ico',
'./apple-touch-icon.png',
'./icon-192.png',
'./icon-512.png',
'./icon-maskable-512.png'
];

/* --- Externos que SÍ queremos tener offline (gráficas + tipografía) --- */
const PRECACHE_CDN = [
'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js',
'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];
const CDN_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

/* --- Pantalla de reserva si no hay red Y no hay nada cacheado --- */
const OFFLINE_HTML =
'<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">' +
'<meta name="viewport" content="width=device-width,initial-scale=1">' +
'<title>Re-Late · Sin conexión</title><style>body{font-family:system-ui,sans-serif;background:#eef3f8;' +
'color:#1f2430;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}' +
'.c{background:#fff;padding:28px 24px;border-radius:16px;box-shadow:0 10px 30px rgba(20,38,74,.12);max-width:340px}' +
'h1{font-size:19px;color:#1d3557;margin:0 0 8px}p{font-size:14px;color:#6c757d;margin:0 0 16px;line-height:1.5}' +
'b{font-size:44px;display:block;margin-bottom:10px}button{background:#2a9d8f;color:#fff;border:0;border-radius:10px;' +
'padding:12px 18px;font-size:14px;font-weight:700;cursor:pointer}</style></head><body>' +
'<div class="c"><b>❤️</b><h1>Sin conexión</h1>' +
'<p>No hay red y todavía no se ha guardado la app en este dispositivo.<br>Tus datos locales están a salvo.</p>' +
'<button onclick="location.reload()">Reintentar</button></div></body></html>';

/* ============================================================
 PRECARGA tolerante: si un archivo no existe (404 en GitHub
 Pages), NO debe romper la instalación. cache.addAll() fallaría
 entero; por eso se añade URL por URL con .catch().
 ============================================================ */
async function precargar() {
const cache = await caches.open(CACHE);
const tareas = SHELL.concat(PRECACHE_CDN).map((u) =>
  cache.add(new Request(u, { cache: 'reload' })).catch(() => {
    console.warn('[SW] no cacheable:', u);
  })
);
await Promise.all(tareas);
}

/* ============================================================
 INSTALL
 ============================================================ */
self.addEventListener('install', (event) => {
event.waitUntil((async () => {
  await precargar();
  /* Solo "saltamos la espera" si veníamos de una versión ANTERIOR.
     Así un usuario nuevo no sufre una recarga fantasma al primer
     acceso, pero las actualizaciones se aplican al instante. */
  if (self.registration && self.registration.active) self.skipWaiting();
})());
});

/* ============================================================
 ACTIVATE → purgar cachés de versiones antiguas
 ============================================================ */
self.addEventListener('activate', (event) => {
event.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
  console.log('%c❤️ [SW] Re-Late ' + VERSION + ' activo · caché ' + CACHE,
              'color:#2a9d8f;font-weight:bold');
})());
/* Sin clients.claim(): el control se toma en la siguiente navegación,
   que es justo lo que provoca el location.reload() del index.html. */
});

/* ============================================================
 MENSAJES del index.html
 ============================================================ */
self.addEventListener('message', (event) => {
const d = event.data;
if (d === 'SKIP_WAITING') { self.skipWaiting(); return; }
if (d === 'REPRECACHE')   { event.waitUntil(precargar()); return; }   // por si el botón "Actualizar app" vacía las cachés
if (d === 'GET_VERSION' && event.source) {
  event.source.postMessage({ type: 'SW_VERSION', VERSION, CACHE });
}
});

/* ============================================================
 HELPERS
 ============================================================ */
function conTimeout(req, ms) {
const ctl = new AbortController();
const id = setTimeout(() => ctl.abort(), ms);
return fetch(req, { signal: ctl.signal }).finally(() => clearTimeout(id));
}

async function guardar(cache, req, res) {
if (res && (res.ok || res.type === 'opaque')) {
  try { await cache.put(req, res.clone()); } catch (e) { /* cuota llena o response no cacheable */ }
}
}

/* Red primero, con tiempo límite (móviles en zona rural): si la red
 va lenta o no hay, se sirve la copia guardada de la app. */
async function networkFirst(req, ms) {
const cache = await caches.open(CACHE);
let copiaDeSeguridad = null;
if (req.mode === 'navigate') {
  copiaDeSeguridad = (await cache.match('./index.html')) || (await cache.match('./'));
}
try {
  const res = await conTimeout(req, ms);
  if (res && res.ok) await guardar(cache, req, res);
  return res;
} catch (e) {
  const hit = (await cache.match(req)) || copiaDeSeguridad;
  if (hit) return hit;
  return new Response(OFFLINE_HTML, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
}

/* Caché primero (iconos, manifest): instantáneo y offline. */
async function cacheFirst(req, event) {
const cache = await caches.open(CACHE);
const hit = await cache.match(req);
if (hit) return hit;
try {
  const res = await fetch(req);
  await guardar(cache, req, res);
  return res;
} catch (e) {
  return Response.error();
}
}

/* Obsoleto-mientras-se-renueva: responde al instante con la copia
 local y renueva en segundo plano (con waitUntil para que el navegador
 no mate el SW antes de terminar la descarga). */
async function staleWhileRevalidate(req, event) {
const cache = await caches.open(CACHE);
const hit = await cache.match(req);
const refresco = fetch(req)
  .then(async (res) => { await guardar(cache, req, res); return res; })
  .catch(() => null);
if (event) event.waitUntil(refresco);
return hit || (await refresco) || Response.error();
}

/* ============================================================
 FETCH → enrutado por tipo de recurso
 ============================================================ */
/* >>> RECONSTRUIDO (aquí se cortaba el archivo recibido): el listener
       de fetch sigue exactamente la estrategia documentada arriba. <<< */
self.addEventListener('fetch', (event) => {
const req = event.request;
if (req.method !== 'GET') return;

const url = new URL(req.url);

/* 1) Externos: CDN (Chart.js + fuentes) → stale-while-revalidate.
      Cualquier otro dominio (FEC, Sanidad, Mayo Clinic…) pasa directo
      a la red, sin cachear. */
if (url.origin !== self.location.origin) {
  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(req, event));
  }
  return;
}

/* 2) Navegaciones e index.html → red primero (4 s) con copia offline */
if (req.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname)) {
  event.respondWith(networkFirst(req, 4000));
  return;
}

/* 3) Estáticos locales (iconos, manifest, imágenes) → caché primero */
event.respondWith(cacheFirst(req, event));
});
