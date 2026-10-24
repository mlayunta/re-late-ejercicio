/* Re-Late · Service Worker — VERSION debe cambiar con APP_VERSION de index.html */
const VERSION = 'relate-v4.0.0';
const CORE = ['./','./index.html','./manifest.json','./favicon.ico','./icon.svg',
              './apple-touch-icon.png','./icon-192.png','./icon-512.png'];
const PRECACHE_CDN = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js'
];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(VERSION).then(async c=>{
      await Promise.all(CORE.map(u=>c.add(u).catch(()=>{})));   // ignora iconos inexistentes
      await Promise.all(PRECACHE_CDN.map(u=>fetch(u,{mode:'cors'}).then(r=>c.put(u,r)).catch(()=>{})));
      return self.skipWaiting();
    })
  );
});
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k))))
        .then(()=>self.clients.claim())
  );
});
self.addEventListener('message', e=>{ if(e.data==='SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);

  if(req.mode==='navigate'){                       // red primero, offline fallback
    e.respondWith(fetch(req).then(res=>{
      const cp=res.clone(); caches.open(VERSION).then(c=>c.put('./index.html',cp)); return res;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  if(PRECACHE_CDN.some(u=>url.href.startsWith(u))){ // CDN: cache-first
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{
      const cp=res.clone(); caches.open(VERSION).then(c=>c.put(req,cp)); return res;
    })));
    return;
  }
  if(url.origin===location.origin){                 // ficheros locales: stale-while-revalidate
    e.respondWith(caches.match(req).then(cached=>{
      const net=fetch(req).then(res=>{ const cp=res.clone();
        caches.open(VERSION).then(c=>c.put(req,cp)); return res; }).catch(()=>cached);
      return cached||net;
    }));
  }
});

/* Notificaciones de recordatorios: al pulsarlas abre la pestaña de Alertas */
self.addEventListener('notificationclick', e=>{
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window'}).then(cs=>{
    if(cs.length){ cs[0].focus(); cs[0].navigate('./index.html#alertas'); }
    else return self.clients.openWindow('./index.html#alertas');
  }));
});
