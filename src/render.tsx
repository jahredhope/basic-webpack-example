import "core-js/stable";
import "isomorphic-fetch";
import "regenerator-runtime/runtime";

import { ChunkExtractor } from "@loadable/server";
import { ServerLocation } from "@reach/router";
import debug from "debug";
import { renderStylesToString } from "emotion-server";
import React from "react";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import { createStore, Provider } from "src/store";

import App from "./App";

const log = debug("app:renderer");

import favicon16 from "./assets/favicon-16x16.png";
import favicon32 from "./assets/favicon-32x32.png";
// @ts-ignore: non-ts file
import favicon from "./assets/favicon.ico";

function renderShell({ head = "", body = "" }) {
  return `<!DOCTYPE html>
  <html>
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

export default async function render(params: any) {
  const { route, clientStats, clientStatsFile, state } = params;
  if (state) {
    log("Rendering with state:", state);
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
  const initialState = {
    ...state,
    items: {
      "1": {
        id: "1",
        name: "First",
      },
      "2": {
        id: "2",
        name: "Second",
      },
    },
    user: {
      firstName: "Fred",
      lastName: "Jones",
    },
  };
  const store = createStore(initialState);
  log({ route });
  const appHtml = renderStylesToString(
    renderToString(
      extractor.collectChunks(
        <Provider value={store}>
          <ServerLocation url={route}>
            <App />
          </ServerLocation>
        </Provider>
      )
    )
  );
  const helmet = Helmet.renderStatic();

  return renderShell({
    body: `
    <div id="root">${appHtml}</div>
    <script>window.initialRoute = "${route}";</script>
    <script>window.initialState = ${JSON.stringify(initialState)};</script>
    ${extractor.getScriptTags()}
    `,
    head: `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${extractor.getLinkTags()}
          `,
  });
}
