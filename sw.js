/* Estrella del Balón · service worker: el juego funciona sin conexión y carga más rápido.
   - Páginas: primero la red (para recibir versiones nuevas) y, sin conexión, la copia guardada.
   - Scripts, estilos, gráficos y tipografías: primero la copia guardada (llevan ?v= y cambian de nombre en cada versión).
   Al cambiar VERSION se borran las copias de versiones anteriores. */
var VERSION='20261127g',CACHE='estrella-'+VERSION;
self.addEventListener('install',function(e){
 e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(['./','./index.html','./manifest.webmanifest','./iconos-app/icono-192.png']).catch(function(){});}));
 self.skipWaiting();
});
self.addEventListener('activate',function(e){
 e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('estrella-')===0&&k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
 var r=e.request;if(r.method!=='GET')return;
 var u=new URL(r.url),same=u.origin===self.location.origin,font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
 if(!same&&!font)return;
 if(r.mode==='navigate'){
  e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp);});return res;})
   .catch(function(){return caches.match(r).then(function(m){return m||caches.match('./index.html');});}));
  return;
 }
 e.respondWith(caches.match(r).then(function(m){
  if(m)return m;
  return fetch(r).then(function(res){if(res&&(res.ok||res.type==='opaque')){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp);});}return res;});
 }));
});
