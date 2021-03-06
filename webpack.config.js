// const webpack = require("webpack")
const merge = require("webpack-merge");
const { Buffer } = require("buffer");
const path = require("path");
const LoadablePlugin = require("@loadable/webpack-plugin");
const HtmlRenderPlugin = require("html-render-webpack-plugin");

const cwd = process.cwd();
const srcPath = path.resolve(cwd, "src");
const paths = {
  renderEntry: path.resolve(srcPath, "render.tsx"),
  clientEntry: path.resolve(srcPath, "client.tsx"),
};

const distDirectory = path.join(cwd, "dist");

const routes = [
  "/",
  { route: "/b", val: "more" },
  "/a",
  "/c",
  "/about",
  "/home",
  "/contact/us",
];

const htmlRenderPlugin = new HtmlRenderPlugin({
  routes,
  renderEntry: "main",
  extraGlobals: { Buffer },
  mapStatsToParams: ({ webpackStats }) => {
    const clientStats = webpackStats.toJson({});
    return {
      clientStats,
    };
  },
  renderDirectory: distDirectory,
});

const liveReload = process.env.NODE_ENV === "development";
const mode =
  process.env.NODE_ENV === "development" ? "development" : "production";

const domain = "http://localhost:8080";
const liveReloadEntry = `${require.resolve(
  "webpack-dev-server/client/"
)}?${domain}`;

const common = {
  mode,
  output: {
    publicPath: "/",
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
        test: /\.(jpg|png)?$/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "static",
          },
        },
      },
    ],
  },
};
// Apply Live Reload only to the client entry
const clientEntry = liveReload
  ? [liveReloadEntry, paths.clientEntry]
  : paths.clientEntry;
module.exports = [
  merge(common, {
    output: {
      filename: "static/client-[name]-[contenthash].js",
    },
    devtool: mode === "production" ? "source-map" : "inline-source-map",
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
    plugins: [new LoadablePlugin(), htmlRenderPlugin.statsCollectorPlugin],
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
    plugins: [htmlRenderPlugin.rendererPlugin],
  }),
];
