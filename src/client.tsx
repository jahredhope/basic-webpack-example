import { ApolloProvider } from "@apollo/react-hooks";
import { loadableReady } from "@loadable/component";
import React from "react";
import ReactDOM from "react-dom";
import "regenerator-runtime/runtime";
import devtools from "unistore/devtools";

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
loadableReady(() => {
  ReactDOM.hydrate(
    <ApolloProvider client={client}>
      <Provider value={store}>
        <App />
      </Provider>
    </ApolloProvider>,
    document.getElementById("root")
  );
});
