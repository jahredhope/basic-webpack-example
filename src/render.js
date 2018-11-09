import Loadable from "react-loadable"
import React from "react"
import { ServerLocation } from "@reach/router"
import { renderToString } from "react-dom/server"
import { getBundles } from "@jahredhope/react-loadable-webpack-plugin"
import { renderStylesToString } from "emotion-server"
require("regenerator-runtime/runtime")

import App from "./App"

function renderShell({ head = "", body = "" }) {
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

function renderScriptTag(src) {
  return `<script src="${src}" type="application/javascript"></script>`
}

function renderScriptPreloadTag(src) {
  return `<link rel="preload" href=${src} as="script" />`
}

export default async function render(params) {
  const { route, clientStats, reactLoadableManifest } = params
  console.log("Rendering ", route)
  if (typeof route !== "string") {
    throw new Error(`Missing route during render`)
  }
  if (!reactLoadableManifest) {
    throw new Error(`Missing reactLoadableManifest during render`)
  }
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
  const bundles = getBundles(reactLoadableManifest, modules)
  const publicPath = clientStats.publicPath

  const scripts = []
  scripts.push(publicPath + clientStats.assetsByChunkName.manifest)
  scripts.push(...bundles.map(bundle => bundle.publicPath))
  scripts.push(publicPath + clientStats.assetsByChunkName.client)
  scripts.push(publicPath + clientStats.assetsByChunkName.vendor)

  // console.log("Waiting for", route)
  // await new Promise(resolve => setTimeout(resolve, 10000))
  // console.log("Okay continuing", route)

  return renderShell({
    head: `
    ${scripts.map(renderScriptPreloadTag).join("\n")}
        `,
    body: `
<h1>External</h1>
<div id="root">${appHtml}</div>
${scripts.map(renderScriptTag).join("\n")}
`,
  })
}
