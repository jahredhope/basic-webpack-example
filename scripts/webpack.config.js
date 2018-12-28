// const webpack = require("webpack")
const merge = require("webpack-merge")
const path = require("path")
const LoadablePlugin = require("@loadable/webpack-plugin")

const getRenderPlugin = require("./getRenderPlugin")

const cwd = process.cwd()
const srcPath = path.resolve(cwd, "./src")
const paths = {
  renderEntry: path.resolve(srcPath, "render.js"),
  clientEntry: path.resolve(srcPath, "client.js"),
}

const renderPlugin = getRenderPlugin()

module.exports = ({ liveReload, mode }) => {
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
  const clientEntry = liveReload
    ? [liveReloadEntry, paths.clientEntry]
    : paths.clientEntry
  return [
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
}