const CACHE='noah-english-shell-v02';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('noah-english-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 const url=new URL(event.request.url);const allowed=ASSETS.map(p=>new URL(p,self.registration.scope).href);
 if(event.request.mode==='navigate'){
 event.respondWith(fetch(event.request).then(r=>r.ok?r:caches.match('./index.html')).catch(()=>caches.match('./index.html')));return;
 }
 if(!allowed.includes(url.href))return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
