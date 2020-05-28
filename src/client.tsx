import { ApolloProvider } from "@apollo/react-hooks";
import { loadableReady } from "@loadable/component";
import React from "react";
import ReactDOM from "react-dom";
import "regenerator-runtime/runtime";
import devtools from "unistore/devtools";
import { BrowserRouter as Router } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

import { createStore, Provider, State } from "src/store";
import App from "./App";
import createGraphQlClient from "./createGraphQlClient";

import debug from "debug";

const log = debug("app:client");

const initialState = JSON.parse(
  document.getElementById("initialState")?.textContent || null
) as State;
if (!initialState) {
  throw new Error("Missing initialState");
}

const store =
  initialState.environment === "production"
    ? createStore(initialState)
    : devtools(createStore(initialState));

// Uncomment to test State Updates
// setInterval(() => {
//   store.setState({ val: store.getState().val ? store.getState().val + 1 : 1 });
//   log("State Update to", store.getState().val);
// }, 250);

const client = createGraphQlClient();

const render = () => {
  loadableReady(() => {
    ReactDOM.hydrate(
      <Router>
        <ApolloProvider client={client}>
          <Provider value={store}>
            <App />
          </Provider>
        </ApolloProvider>
      </Router>,
      document.getElementById("root")
    );
  });
};

render();

let visitorId = Cookies.get("visitor-id");
if (!visitorId) {
  visitorId = uuidv4();
  document.cookie = `visitor-id=${visitorId}`;
}
if (store.getState().visitorId && store.getState().visitorId !== visitorId) {
  console.error("Mismatch of visitor id. Something may have gone wrong.");
  console.error("Cookie", Cookies.get("visitor-id"));
  console.error("State", store.getState().visitorId);
}
store.setState({ visitorId });

// @ts-ignore: TODO add hot optional value to NodeModule
if (module.hot) {
  log("client.tsx", "Module is HOT");
  // @ts-ignore: TODO add hot optional value to NodeModule
  module.hot.accept("./App", () => {
    log("Accepting ./App");
    render();
  });
} else {
  log("client.tsx", "Module is COLD");
}

async function loadServiceWorker() {
  const serviceWorkerScript = document.getElementById("serviceWorkerPath")
    ?.textContent;
  if (serviceWorkerScript) {
    // Check for existing service worker
    if (navigator.serviceWorker.controller) {
      const installedScriptName = navigator.serviceWorker.controller.scriptURL.match(
        /\/([^/]*\.js)$/
      )[1];
      const newScriptName = serviceWorkerScript.match(/\/([^/]*\.js)$/)[1];
      log(
        navigator.serviceWorker.controller.scriptURL + " (onload)",
        "controller"
      );
      if (newScriptName === installedScriptName) {
        log(
          `An active service worker controller with same name (${newScriptName}) was found, no need to register`
        );
      } else {
        log(
          `Old service worker found. Replacing ${installedScriptName} with ${newScriptName}`
        );
      }
    }

    // Register the ServiceWorker
    await navigator.serviceWorker
      .register(serviceWorkerScript, {
        scope: "/",
      })
      .then((reg) => {
        log(reg.scope, "register");
        log("Service worker change, registered the service worker");
      });
  }
}

loadServiceWorker()
  .then(() => {
    log("Registering for events from service worker");
    navigator.serviceWorker.addEventListener("message", (event) => {
      // @ts-ignore
      log(...event.data);
    });
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage([
        "version-check",
        initialState.version,
      ]);
      navigator.serviceWorker.controller.postMessage([
        "setDebug",
        localStorage.debug,
      ]);
    }
  })
  .catch((error) =>
    log("An error occurred loading service worker. Error: ", error)
  );
