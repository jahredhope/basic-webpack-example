const path = require("path")
const HtmlRenderPlugin = require("html-render-webpack-plugin")

module.exports = function() {
  const cwd = process.cwd()
  const distDirectory = path.join(cwd, "dist")

  const routes = [
    "/",
    { route: "/b", val: "more" },
    "/a",
    "/c",
    "/about",
    "/home",
    "/contact/us",
  ]

  console.log("Creating HtmlRenderPlugin")
  const rendererPlugin = new HtmlRenderPlugin({
    routes,
    renderEntry: "main",
    mapStatsToParams: ({ webpackStats }) => {
      const clientStats = webpackStats
        .toJson({
          hash: true,
          publicPath: true,
          assets: true,
          chunks: false,
          modules: false,
          source: false,
          errorDetails: false,
          timings: false,
        })
        .children.find(({ name }) => name === "client")
      return {
        clientStats,
      }
    },
    renderDirectory: distDirectory,
    verbose: true,
  })
  return rendererPlugin
}
