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
import { Stats } from "webpack";

import appleIcon57 from "src/manifest/apple-icon-57x57.png";
import appleIcon60 from "src/manifest/apple-icon-60x60.png";
import appleIcon72 from "src/manifest/apple-icon-72x72.png";
import appleIcon76 from "src/manifest/apple-icon-76x76.png";
import appleIcon114 from "src/manifest/apple-icon-114x114.png";
import appleIcon120 from "src/manifest/apple-icon-120x120.png";
import appleIcon144 from "src/manifest/apple-icon-144x144.png";
import appleIcon152 from "src/manifest/apple-icon-152x152.png";
import appleIcon180 from "src/manifest/apple-icon-180x180.png";
import androidIcon192 from "src/manifest/android-icon-192x192.png";
import favicon32 from "src/manifest/favicon-32x32.png";
import favicon96 from "src/manifest/favicon-96x96.png";
import favicon16 from "src/manifest/favicon-16x16.png";

function renderShell({ head = "", body = "" }) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <link rel="apple-touch-icon" sizes="57x57" href="${appleIcon57}">
      <link rel="apple-touch-icon" sizes="60x60" href="${appleIcon60}">
      <link rel="apple-touch-icon" sizes="72x72" href="${appleIcon72}">
      <link rel="apple-touch-icon" sizes="76x76" href="${appleIcon76}">
      <link rel="apple-touch-icon" sizes="114x114" href="${appleIcon114}">
      <link rel="apple-touch-icon" sizes="120x120" href="${appleIcon120}">
      <link rel="apple-touch-icon" sizes="144x144" href="${appleIcon144}">
      <link rel="apple-touch-icon" sizes="152x152" href="${appleIcon152}">
      <link rel="apple-touch-icon" sizes="180x180" href="${appleIcon180}">
      <link rel="icon" type="image/png" sizes="192x192"  href="${androidIcon192}">
      <link rel="icon" type="image/png" sizes="32x32" href="${favicon32}">
      <link rel="icon" type="image/png" sizes="96x96" href="${favicon96}">
      <link rel="icon" type="image/png" sizes="16x16" href="${favicon16}">
      <meta name="msapplication-TileColor" content="#21728c">
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
      <meta name="theme-color" content="#21728c">
      <meta name="description" content="A project for testing web application patterns starting from a basic web application" />
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
  const { route, webpackStats, clientStatsFile, state } = params;
  if (state) {
    log("Rendering with state");
  } else {
    log("Rendering with no state");
  }
  if (typeof route !== "string") {
    throw new Error(`Missing route during render`);
  }
  if (!webpackStats) {
    console.log("Params passed:", Object.keys(params));
    console.log(Object.entries(params));
    throw new Error(`Missing webpackStats during render`);
  }
  console.log({ webpackStats });

  const serviceWorkerStats: Stats.ToJsonOutput = webpackStats.children.find(
    (s) => s.name === "service-worker"
  );
  const clientStats: Stats.ToJsonOutput = webpackStats.children.find(
    (s) => s.name === "client"
  );
  if (!clientStats && !clientStatsFile) {
    console.log({ params });
    throw new Error(`Missing clientStats or clientStatsFile during render`);
  }
  const extractor = new ChunkExtractor({
    entrypoints: ["main"],
    stats: clientStats,
    statsFile: clientStatsFile,
  });
  const publicPath = (extractor as any).stats.publicPath;
  const manifestFileName = clientStats.assets.find((v) =>
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
    head: `<link rel="manifest" href="${
      (publicPath || "") + manifestFileName
    }" scope="/" />
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${extractor.getLinkTags()}`,
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
