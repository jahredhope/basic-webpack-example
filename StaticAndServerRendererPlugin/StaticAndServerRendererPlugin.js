const standardBuild = require("./standardBuild");
const devServerBuild = require("./devServerBuild");

module.exports = function createStaticAndServerRendererPlugin({
  useDevServer,
  healthCheckEndpoint,
  rendererUrl,
  serverRoutes = [],
  staticRoutes = [],
  emitAssetsToCompilation = false,
}) {
  if (!useDevServer) {
    return standardBuild({
      staticRoutes,
      emitAssetsToCompilation,
    });
  }
  return devServerBuild({
    healthCheckEndpoint,
    rendererUrl,
    serverRoutes,
    staticRoutes,
  });
};
