const webpack = require("webpack");
const createServerRendererPlugin = require("./RendererPlugin/ServerRendererPlugin");
const createStaticRendererPlugin = require("./RendererPlugin/StaticRendererPlugin");
const getConfig = require("./webpack.config");
const {
  staticRoutes,
  serverRoutes,
  rendererUrl,
  rendererHealthcheck,
} = require("./config");

const serverRendererPlugin = createServerRendererPlugin({
  useDevServer: false,
  healthCheckEndpoint: rendererHealthcheck,
  rendererUrl,
  routes: serverRoutes,
});
const staticRendererPlugin = createStaticRendererPlugin({
  useDevServer: false,
  healthCheckEndpoint: rendererHealthcheck,
  rendererUrl,
  routes: staticRoutes,
});

const compiler = webpack(
  getConfig({ serverRendererPlugin, staticRendererPlugin })
);

compiler.run(err => {
  if (err) {
    console.error("Building finished with err", err);
  }
});
