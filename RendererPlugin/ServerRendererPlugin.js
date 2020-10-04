// const standardBuild = require("./standardBuild");
const serverRenderDevBuild = require("./serverRenderDevBuild");

module.exports = function createServerRendererPlugin({
  useDevServer,
  filename,
  healthCheckEndpoint,
  rendererUrl,
  routes,
}) {
  return serverRenderDevBuild({
    filename,
    useDevServer,
    healthCheckEndpoint,
    rendererUrl,
    routes,
  });
};
