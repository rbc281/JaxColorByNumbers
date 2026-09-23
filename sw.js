const CACHE="jax-colors-v4";
const ASSETS=["./","./index.html","./styles.css","./app.js","./manifest.webmanifest","./icon.svg"];

self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",event=>{
 event.waitUntil(
  caches.keys()
   .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
   .then(()=>self.clients.claim())
 );
});

self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const requestUrl=new URL(event.request.url);
 if(requestUrl.origin!==self.location.origin)return;

 event.respondWith(
  fetch(event.request)
   .then(response=>{
    if(!response.ok)return response;
    const copy=response.clone();
    return caches.open(CACHE).then(cache=>cache.put(event.request,copy)).then(()=>response);
   })
   .catch(()=>caches.match(event.request).then(cached=>{
    if(cached)return cached;
    if(event.request.mode==="navigate")return caches.match("./index.html");
    return Response.error();
   }))
 );
});
