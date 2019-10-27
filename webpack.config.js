// const webpack = require("webpack")
const merge = require("webpack-merge");
// const { Buffer } = require("buffer");
const path = require("path");
const LoadablePlugin = require("@loadable/webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { promisify } = require("util");
const mkdirp = promisify(require("mkdirp"));

const { paths } = require("./config");

const liveReload = process.env.NODE_ENV === "development";
const mode =
  process.env.NODE_ENV === "development" ? "development" : "production";

const usingFileSystem = mode === "production";

const domain = "http://localhost:8080";
const liveReloadEntry = `${require.resolve(
  "webpack-dev-server/client/"
)}?${domain}`;

if (usingFileSystem) {
  mkdirp(path.dirname(paths.clientStatsLocation));
}
const common = {
  mode,
  output: {
    publicPath: "/static/",
  },
  resolve: {
    alias: { path: "path-browserify" },
    extensions: [".mjs", ".js", ".json", ".ts", ".tsx"],
  },
  // Webpack 5 Optimization
  // optimization: {
  //   chunkIds: "deterministic",
  //   moduleIds: "deterministic",
  // },
  module: {
    rules: [
      {
        test: /\.m?(j|t)sx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(jpg|png|ico)?$/,
        use: {
          loader: "file-loader",
        },
      },
    ],
  },
};
module.exports = [
  merge(common, {
    output: {
      path: paths.browserOutput,
      filename: "[name]-[contenthash].js",
    },
    devtool: mode === "production" ? "source-map" : "inline-source-map",
    optimization: {
      runtimeChunk: {
        name: "runtime",
      },
      splitChunks: {
        cacheGroups: {
          react: {
            priority: 2,
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "react",
            chunks: "all",
          },
          apollo: {
            priority: 2,
            test: /[\\/]node_modules[\\/](apollo.+|@apollo\/.+|graphql\/.+)[\\/]/,
            name: "apollo",
            chunks: "all",
          },
          modules: {
            priority: 1,
            test: /[\\/]node_modules[\\/]/,
            name: "modules",
            chunks: "all",
          },
        },
      },
    },
    name: "client",
    target: "web",
    entry: {
      main: paths.clientEntry,
      ...(liveReload ? { devServerOnly: liveReloadEntry } : {}),
    },
    plugins: [
      new LoadablePlugin({
        writeToDisk: usingFileSystem
          ? { filename: path.dirname(paths.clientStatsLocation) }
          : false,
        filename: path.basename(paths.clientStatsLocation),
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        reportFilename: paths.reportLocation,
        openAnalyzer: false,
      }),
    ],
  }),
  merge(common, {
    dependencies: ["client"],
    output: {
      path: paths.nodeOutput,
      libraryExport: "default",
      library: "static",
      // libraryTarget: "umd2",
      // libraryTarget: "commonjs2",
      libraryTarget: "umd2",
      filename: "[name].js",
    },
    name: "server",
    target: "node",
    entry: { server: paths.serverEntry, render: paths.renderEntry },
  }),
];
