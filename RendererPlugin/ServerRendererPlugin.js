// const standardBuild = require("./standardBuild");
const serverRenderDevBuild = require("./serverRenderDevBuild");

const noop = () => {};

module.exports = function createServerRendererPlugin({
  useDevServer,
  healthCheckEndpoint,
  rendererUrl,
  routes,
}) {
  if (!useDevServer) {
    return {
      nodePlugin: noop,
      clientPlugin: noop,
      devServerRouter: noop,
    };
  }
  return serverRenderDevBuild({
    healthCheckEndpoint,
    rendererUrl,
    routes,
  });
};
