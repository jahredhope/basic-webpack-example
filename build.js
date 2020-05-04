const webpack = require("webpack");
const createServerRendererPlugin = require("./RendererPlugin/ServerRendererPlugin");
const HtmlRenderPlugin = require("html-render-webpack-plugin");
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
const htmlRenderPlugin = new HtmlRenderPlugin({
  renderDirectory: "dist/document",
  renderEntry: "render",
  routes: staticRoutes,
});

const compiler = webpack(getConfig({ serverRendererPlugin, htmlRenderPlugin }));

compiler.run((err) => {
  if (err) {
    console.error("Building finished with err", err);
  }
});
