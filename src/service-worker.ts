/// <reference lib="webworker" />

import createDebug from "debug";

let firstVersion: string | null = null;
const versions = new Set<string>();

const log = createDebug("app:service-worker");

log("Service worker: start");

self.addEventListener("install", (event: ExtendableEvent) => {
  log("Service worker: install");
  const offlineRequest = new Request("/error/offline/");
  event.waitUntil(
    fetch(offlineRequest).then((response) => {
      return caches.open("offline").then(function (cache) {
        log("[oninstall] Cached offline page", response.url);
        return cache.put(offlineRequest, response);
      });
    })
  );
});

self.addEventListener("fetch", (event: FetchEvent) => {
  const request = event.request;
  log("Service worker: fetch. Url:", request.url);
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
