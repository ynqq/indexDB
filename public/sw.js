self.addEventListener("install", (e) => {
  console.log("install", e);
  e.waitUntil(
    (async () => {
      try {
        const cache = await caches.open("demo1");
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
      const cache = await caches.open("demo1");
      const res = await cache.match(e.request);
      if (res) {
        console.log(res, "---");
        return res;
      }
      console.log("refetch", e.request.url);
      const fetchRes = await fetch(e.request);
      cache.put(e.request, fetchRes.clone());
      return fetchRes;
    })()
  );
});
