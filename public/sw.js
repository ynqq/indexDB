const CACHE_NAME = "ynqqDemo";
const CACHE_VER = "0.0.1";

const getCatchName = () => {
  return `${CACHE_NAME}-${CACHE_VER}`;
};

self.addEventListener("install", (e) => {
  console.log("install", getCatchName(), e);
  e.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(getCatchName());
        cache.addAll([]);
      } catch (error) {
        console.log(error);
      }
    })()
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const cache = await caches.open(getCatchName());
      const res = await cache.match(e.request);
      if (res) {
        return res;
      }
      console.log("refetch", e.request.url);
      if (e.request.url.includes("indexDB")) {
        const fetchRes = await fetch(e.request);
        cache.put(e.request, fetchRes.clone());
        return fetchRes;
      }
    })()
  );
});

self.addEventListener("activate", (e) => {
  console.log("activate", getCatchName(), e);
  e.waitUntil(
    caches.open(getCatchName()).then((cache) => {
      cache.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== getCatchName()) {
              return caches.delete(cacheName);
            }
          })
        );
      });
    })
  );
});
