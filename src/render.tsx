import React from "react";
import { ServerLocation } from "@reach/router";
import { renderToString } from "react-dom/server";
import { renderStylesToString } from "emotion-server";
import { ChunkExtractor } from "@loadable/server";
import "@babel/polyfill";

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
    stats: clientStats,
    entrypoints: ["main"],
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
    head: `
      ${extractor.getLinkTags()}
          `,
    body: `
  <h1>External</h1>
  <div id="root">${appHtml}</div>
  ${extractor.getScriptTags()}
  `,
  });
}
