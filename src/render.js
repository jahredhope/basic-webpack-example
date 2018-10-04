console.log("hello from render");

import "./app";

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

function renderScriptTag(src) {
  return `<script src="${src}" type="application/javascript"></script>`;
}

export default function render({ clientStats }) {
  return renderShell({
    body: `
<h1>External</h1>
${renderScriptTag(clientStats.assetsByChunkName.manifest)}
${renderScriptTag(clientStats.assetsByChunkName.client)}
`
  });
}
