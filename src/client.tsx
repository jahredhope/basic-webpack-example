import React from "react";
import ReactDOM from "react-dom";
import { createStore, Provider, State } from "src/store";
import devtools from "unistore/devtools";

import { loadableReady } from "@loadable/component";
import "regenerator-runtime/runtime";

import App from "./App";

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

loadableReady(() => {
  ReactDOM.hydrate(
    <Provider value={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
});
