const C='sonora-20261122-2130';const ASSETS=['./','./index.html','./fingering.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./noxun_egg2.webp','./noxun_baby2.webp','./noxun_growing2.webp','./noxun_adult2.webp','./bg_santorini.jpg','./bg_iceland.jpg','./bg_desert.jpg','./bg_seaside.jpg'];
/* mp/ (bundled MediaPipe: bundle + wasm + face model, ~23MB) is deliberately NOT
   precached: the generic fetch handler below runtime-caches it on first
   EMBOUCHURE use, so install and normal startup stay light. The same
   applies to the BUILD 16:00 embouchure model photos (emb_*.jpg, ~310KB
   total): runtime-cached by the generic handler on first EMBOUCHURE
   view, so they display offline from the second visit on. */
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 if(e.request.mode==='navigate'||e.request.destination==='document'){
  /* HTML documents are network-first: a new build reaches the
     device on the next load instead of the old page being served
     from cache forever. The cached copy keeps it openable offline. */
  e.respondWith(fetch(e.request).then(res=>{
   const cp=res.clone(),cp2=res.clone();
   caches.open(C).then(c=>{c.put(e.request,cp);c.put('./index.html',cp2)});
   return res;
  }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
  return;
 }
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res})));
});
