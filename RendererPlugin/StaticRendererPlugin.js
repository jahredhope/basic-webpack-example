const staticBuild = require("./staticBuild");
const staticRenderDevBuild = require("./staticRenderDevBuild");

module.exports = function createStaticRendererPlugin({
  useDevServer,
  routes,
  emitAssetsToCompilation = false,
}) {
  if (!useDevServer) {
    return staticBuild({
      routes,
      emitAssetsToCompilation,
    });
  }
  return staticRenderDevBuild({
    routes,
  });
};
