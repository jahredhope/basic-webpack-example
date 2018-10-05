const webpack = require("webpack")
const merge = require("webpack-merge")
const path = require("path")
const { ReactLoadablePlugin } = require("./react-loadable-plugin")

const cwd = process.cwd()
const srcPath = path.resolve(cwd, "./src")
const paths = {
  renderEntry: path.resolve(srcPath, "render.js"),
  clientEntry: path.resolve(srcPath, "client.js"),
}

const common = {
  mode: "development",
  output: {
    publicPath: "/",
  },
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

module.exports = ({ productionise }) => [
  merge(common, {
    mode: productionise ? "production" : "development",
    output: {
      filename: "client-[name]-[contenthash].js",
    },
    optimization: {
      runtimeChunk: {
        name: "manifest",
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
    entry: { client: paths.clientEntry },
    plugins: [
      new ReactLoadablePlugin({
        filename: "react-loadable-manifest.json",
      }),
      new webpack.HashedModuleIdsPlugin(),
    ],
  }),
  merge(common, {
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
    entry: { render: paths.renderEntry },
  }),
]
