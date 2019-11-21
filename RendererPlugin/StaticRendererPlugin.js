const staticBuild = require("./staticBuild");
const staticRenderDevBuild = require("./staticRenderDevBuild");

module.exports = function createStaticRendererPlugin({
  useDevServer,
  routes,
  renderDirectory = "dist",
}) {
  if (!useDevServer) {
    return staticBuild({
      routes,
      renderDirectory,
    });
  }
  return staticRenderDevBuild({
    routes,
  });
};
