declare const VERSION: string;

import { ApolloProvider } from "@apollo/react-hooks";
import { getDataFromTree } from "@apollo/react-ssr";
import { ChunkExtractor } from "@loadable/server";
import { StaticRouter as Router } from "react-router-dom";
import debug from "debug";
import { renderStylesToString } from "emotion-server";
import React from "react";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";

import { createStore, Provider } from "src/store";

import createGraphQlClient from "./createGraphQlClient";

import App from "./App";

const log = debug("app:renderer");

import favicon16 from "./assets/favicon-16x16.png";
import favicon32 from "./assets/favicon-32x32.png";
// @ts-ignore: non-ts file
import favicon from "./assets/favicon.ico";
import { Stats } from "webpack";

function renderShell({ head = "", body = "" }) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <link rel="shortcut icon" href="${favicon}" type="image/x-icon" />
      <link rel="icon" type="image/png" sizes="32x32" href="${favicon32}">
      <link rel="icon" type="image/png" sizes="16x16" href="${favicon16}">
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${head}
    </head>
    <body>
      ${body}
    </body>
  </html>`;
}

const client = createGraphQlClient();

export default async function render(params: any) {
  const {
    route,
    clientStats,
    clientStatsFile,
    state,
    serviceWorkerStats,
  } = params;
  if (state) {
    log("Rendering with state");
  } else {
    log("Rendering with no state");
  }
  if (typeof route !== "string") {
    throw new Error(`Missing route during render`);
  }
  if (!clientStats && !clientStatsFile) {
    throw new Error(`Missing clientStats or clientStatsFile during render`);
  }
  const extractor = new ChunkExtractor({
    entrypoints: ["main"],
    stats: clientStats,
    statsFile: clientStatsFile,
  });
  const publicPath = (extractor as any).stats.publicPath;
  const manifestFileName = ((extractor as any)
    .stats as Stats.ToJsonOutput).assets.find((v) =>
    v.name.match(/manifest\.[^.]+\.json/i)
  )?.name;
  if (!manifestFileName) {
    throw new Error("Unable to determin manifestFileName");
  }
  const store = createStore({
    ...state,
    version: VERSION,
    initialRoute: route,
    user: {
      firstName: "Fred",
      lastName: "Jones",
    },
  });
  log({ route });

  const routerContext = {};

  const WrappedApp = (
    <ApolloProvider client={client}>
      <Provider value={store}>
        <Router location={route} context={routerContext}>
          <App />
        </Router>
      </Provider>
    </ApolloProvider>
  );

  await getDataFromTree(WrappedApp).catch((error) =>
    console.error("An error occured prefetching data for render. Error:", error)
  );
  const appHtml = renderStylesToString(
    renderToString(extractor.collectChunks(WrappedApp))
  );
  const helmet = Helmet.renderStatic();

  return renderShell({
    body: `
    <div id="root">${appHtml}</div>
    ${
      serviceWorkerStats
        ? `
        <script type="plain/text" id="serviceWorkerPath">${
          serviceWorkerStats.publicPath +
          (Array.isArray(serviceWorkerStats.assetsByChunkName.main)
            ? serviceWorkerStats.assetsByChunkName.main[0]
            : serviceWorkerStats.assetsByChunkName.main)
        }</script>`
        : ""
    }
    <script type="plain/text" id="initialRoute">${route}</script>
    <script type="application/json" id="initialState">${JSON.stringify(
      store.getState()
    )}</script>
    <script type="application/json" id="__APOLLO_STATE__">${JSON.stringify(
      client.extract()
    )}</script>
    ${extractor.getScriptTags()}
    `,
    head: `<meta name="theme-color" content="#21728c" />
      <meta name="description" content="A project for testing web application patterns starting from a basic web application" />
      <link rel="manifest" href="${(publicPath || "") + manifestFileName}" />
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${extractor.getLinkTags()}
          `,
  });
}

console.log("render.tsx");
if (module.hot) {
  console.log("render.tsx", "Module is HOT");
  module.hot.accept("./App", () => {
    console.log("Accepting ./App");
    // render();
  });
} else {
  console.log("render.tsx", "Module is COLD");
}
