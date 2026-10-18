const CACHE='noah-english-shell-v13';
const CORE=['./','./index.html'];
const EXTRA=['./manifest.webmanifest','./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(async cache=>{await cache.addAll(CORE);await Promise.all(EXTRA.map(u=>cache.add(u).catch(()=>{})));}).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('noah-english-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 const url=new URL(event.request.url);const allowed=[...CORE,...EXTRA].map(p=>new URL(p,self.registration.scope).href);
 if(event.request.mode==='navigate'){
  // Online immer die neueste Fassung holen und für offline merken; offline die gemerkte nehmen.
  event.respondWith(fetch(event.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return r;}return caches.match('./index.html').then(c=>c||r);}).catch(()=>caches.match('./index.html')));return;
 }
 if(!allowed.includes(url.href))return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
