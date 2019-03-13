import "@babel/polyfill";
import { ChunkExtractor } from "@loadable/server";
import { ServerLocation } from "@reach/router";
import { renderStylesToString } from "emotion-server";
import React from "react";
import { renderToString } from "react-dom/server";

import App from "./App";

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
  </html>`;
}

export default async function render(params: any) {
  const { route, clientStats } = params;
  console.log("Rendering ", route);
  if (typeof route !== "string") {
    throw new Error(`Missing route during render`);
  }
  if (!clientStats) {
    throw new Error(`Missing clientStats during render`);
  }
  const extractor = new ChunkExtractor({
    entrypoints: ["main"],
    stats: clientStats,
  });
  console.log({ route });
  const appHtml = renderStylesToString(
    renderToString(
      extractor.collectChunks(
        <ServerLocation url={route}>
          <App />
        </ServerLocation>
      )
    )
  );

  return renderShell({
    body: `
    <div id="root">${appHtml}</div>
    <script>window.initialRoute = "${route}";</script>
    ${extractor.getScriptTags()}
    `,
    head: `
      ${extractor.getLinkTags()}
          `,
  });
}
