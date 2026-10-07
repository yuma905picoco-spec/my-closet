const CACHE_NAME="my-closet-v1.3";
const APP_SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.svg","./icon-512.svg"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  const url=new URL(event.request.url);
  if(url.hostname.includes("open-meteo.com")) return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(res=>{
    const copy=res.clone();
    if(event.request.method==="GET" && url.origin===location.origin) caches.open(CACHE_NAME).then(c=>c.put(event.request,copy));
    return res;
  }).catch(()=>cached)));
});