const webpack = require("webpack");
const createPlugin = require("./StaticAndServerRendererPlugin/StaticAndServerRendererPlugin");
const getConfig = require("./webpack.config");
const {
  staticRoutes,
  serverRoutes,
  rendererUrl,
  rendererHealthcheck,
} = require("./config");

const { clientPlugin, nodePlugin } = createPlugin({
  runDevServer: false,
  healthCheckEndpoint: rendererHealthcheck,
  rendererUrl,
  serverRoutes,
  staticRoutes,
});
const compiler = webpack(getConfig({ clientPlugin, nodePlugin }));

compiler.run();
