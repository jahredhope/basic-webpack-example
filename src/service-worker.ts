/// <reference lib="webworker" />

import createDebug from "debug";

let firstVersion: string | null = null;
const versions = new Set<string>();

createDebug.enable("*");
const log = createDebug("app:service-worker");
const logFetch = createDebug("app:service-worker:fetch");

log("Service worker: start");

function updateOfflineCache() {
  log("Updating offline cache");
  const offlineRequest = new Request("/error/offline/");
  return fetch(offlineRequest).then((response) => {
    return caches.open("offline").then(function (cache) {
      log("[oninstall] Cached offline page", response.url);
      return cache.put(offlineRequest, response);
    });
  });
}

self.addEventListener("install", (event: ExtendableEvent) => {
  log("Event: install");
  event.waitUntil(updateOfflineCache());
});

self.addEventListener("activate", () => {
  log("Event: activate");
  updateOfflineCache();
});

self.addEventListener("fetch", (event: FetchEvent) => {
  const request = event.request;
  logFetch("Event: fetch. Url:", request.url);
  if (request.method === "GET") {
    event.respondWith(
      fetch(request).catch((error) => {
        log("[onfetch] Failed. Serving cached offline fallback " + error);
        return caches.open("offline").then(function (cache) {
          return cache.match("/error/offline/");
        });
      })
    );
  }
});

self.onmessage = async (e: MessageEvent) => {
  if (Array.isArray(e.data)) {
    log("Event: message", e.data);
    const [eventName, payload] = e.data;
    if (eventName === "setDebug") {
      log("Recieved setDebug", payload);
      createDebug.enable(payload);
    }
    if (eventName === "version-check") {
      log("Recieved version-check", payload);
      if (!firstVersion) {
        firstVersion = payload;
      }
      versions.add(payload);
      // @ts-ignore
      const clients = await (self.clients as Clients).matchAll();
      for (const client of clients) {
        client.postMessage([
          "worker-version",
          { first: firstVersion, versions: Array.from(versions) },
        ]);
      }
    }
  }
};
