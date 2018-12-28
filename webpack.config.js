// const webpack = require("webpack")
const merge = require("webpack-merge")
const path = require("path")
const LoadablePlugin = require("@loadable/webpack-plugin")
const HtmlRenderPlugin = require("html-render-webpack-plugin")

const cwd = process.cwd()
const srcPath = path.resolve(cwd, "src")
const paths = {
  renderEntry: path.resolve(srcPath, "render.js"),
  clientEntry: path.resolve(srcPath, "client.js"),
}

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

const renderPlugin = new HtmlRenderPlugin({
  routes,
  renderEntry: "main",
  mapStatsToParams: ({ webpackStats }) => {
    const clientStats = webpackStats
      .toJson({})
      .children.find(({ name }) => name === "client")
    return {
      clientStats,
    }
  },
  renderDirectory: distDirectory,
  verbose: true,
})

const liveReload = process.env.NODE_ENV === "development"
const mode =
  process.env.NODE_ENV === "development" ? "development" : "production"

const domain = "http://localhost:8080"
const liveReloadEntry = `${require.resolve(
  "webpack-dev-server/client/"
)}?${domain}`

const common = {
  mode,
  output: {
    publicPath: "/",
  },
  resolve: { alias: { path: "path-browserify" } },

  // Webpack 5 Optimization
  // optimization: {
  //   chunkIds: "deterministic",
  //   moduleIds: "deterministic",
  // },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
}
// Apply Live Reload only to the client entry
const clientEntry = liveReload
  ? [liveReloadEntry, paths.clientEntry]
  : paths.clientEntry
module.exports = [
  merge(common, {
    output: {
      filename: "client-[name]-[contenthash].js",
    },
    optimization: {
      runtimeChunk: {
        name: "runtime",
      },
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "vendor",
            chunks: "all",
          },
        },
      },
    },
    name: "client",
    target: "web",
    entry: clientEntry,
    plugins: [new LoadablePlugin(), renderPlugin],
  }),
  merge(common, {
    dependencies: ["client"],
    output: {
      libraryExport: "default",
      library: "static",
      // libraryTarget: "umd2",
      // libraryTarget: "commonjs2",
      libraryTarget: "umd2",
      filename: "render-[name]-[contenthash].js",
    },
    name: "render",
    target: "node",
    entry: paths.renderEntry,
    plugins: [renderPlugin.render()],
  }),
]
