/// <reference lib="webworker" />

self.addEventListener("install", (event) => {
  const offlineRequest = new Request("/offline/");
  event.waitUntil(
    fetch(offlineRequest).then((response) => {
      return caches.open("offline").then(function (cache) {
        console.log("[oninstall] Cached offline page", response.url);
        return cache.put(offlineRequest, response);
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method === "GET") {
    event.respondWith(
      fetch(request).catch((error) => {
        console.error(
          "[onfetch] Failed. Serving cached offline fallback " + error
        );
        return caches.open("offline").then(function (cache) {
          return cache.match("/offline/");
        });
      })
    );
  }
});
