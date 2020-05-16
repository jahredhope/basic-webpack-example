import { ApolloProvider } from "@apollo/react-hooks";
import { loadableReady } from "@loadable/component";
import React from "react";
import ReactDOM from "react-dom";
import "regenerator-runtime/runtime";
import devtools from "unistore/devtools";
import { LocationProvider } from "@reach/router";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

import { createStore, Provider, State } from "src/store";
import App from "./App";
import createGraphQlClient from "./createGraphQlClient";

const initialState = (window as any).initialState as State;
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
//   console.log("State Update to", store.getState().val);
// }, 250);

const client = createGraphQlClient();

const render = () => {
  loadableReady(() => {
    ReactDOM.hydrate(
      <LocationProvider>
        <ApolloProvider client={client}>
          <Provider value={store}>
            <App />
          </Provider>
        </ApolloProvider>
      </LocationProvider>,
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

console.log("client.tsx");
if (module.hot) {
  console.log("client.tsx", "Module is HOT");
  module.hot.accept("./App", () => {
    console.log("Accepting ./App");
    render();
  });
} else {
  console.log("client.tsx", "Module is COLD");
}
