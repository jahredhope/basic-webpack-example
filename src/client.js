import React from "react"
import { hydrate } from "react-dom"
import Loadable from "react-loadable"
import "regenerator-runtime/runtime"

import App from "./App"

async function clientRender() {
  await Loadable.preloadReady()
  hydrate(<App />, document.getElementById("root"))
}

clientRender()
