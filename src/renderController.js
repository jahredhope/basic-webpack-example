import React from "react"
import Loadable from "react-loadable"
import { renderToString } from "react-dom/server"
import { ServerLocation } from "@reach/router"
import { getBundles } from "@jahredhope/react-loadable-webpack-plugin"
require("regenerator-runtime/runtime")

import { renderStylesToString } from "emotion-server"
import App from "./App"

export function renderShell({ head = "", body = "" }) {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${head}
    </head>
    <body>
      ${body}
    </body>
  </html>`
}

export default async function render(params) {
  const { route, moduleManifest } = params

  await Loadable.preloadAll()
  const modules = []
  const appHtml = renderStylesToString(
    renderToString(
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <ServerLocation url={route}>
          <App />
        </ServerLocation>
      </Loadable.Capture>
    )
  )
  const bundles = getBundles(moduleManifest, modules)
  return { html: appHtml, bundles }
}
