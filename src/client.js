import React from "react"
import { hydrate } from "react-dom"
import { loadableReady } from "@loadable/component"
import "regenerator-runtime/runtime"

import App from "./App"

loadableReady(() => {
  hydrate(<App />, document.getElementById("root"))
})
