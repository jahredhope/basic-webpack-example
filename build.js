const path = require("path");
const configs = require("./webpack.config");
const { staticRoutes, paths } = require("./config");

const build = require("./build-scripts/build");

build({
  staticRoutes,
  rendererLocation: require(path.join(paths.nodeOutput, "render")),
  clientStatsLocation: paths.clientStatsLocation,
  htmlOutputDir: paths.htmlOutput,
  configs,
});
