// const webpack = require("webpack")
const merge = require("webpack-merge");
const path = require("path");
const LoadablePlugin = require("@loadable/webpack-plugin");
const HtmlRenderPlugin = require("html-render-webpack-plugin");
const TreatPlugin = require("treat/webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const cwd = process.cwd();
const srcPath = path.resolve(cwd, "src");
const paths = {
  renderEntry: path.resolve(srcPath, "render.tsx"),
  clientEntry: path.resolve(srcPath, "client.tsx"),
};

const reportBundlePath = path.resolve(__dirname, "report", "bundle.html");

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

const renderPlugin = new HtmlRenderPlugin({
  extraGlobals: {
    Buffer: require("buffer").Buffer,
  },
  routes,
  renderEntry: "main",
  mapStatsToParams: ({ webpackStats }) => {
    const clientStats = webpackStats
      .toJson({})
      .children.find(({ name }) => name === "client");
    return {
      clientStats,
    };
  },
  renderDirectory: distDirectory,
  verbose: true,
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
    plugins: [
      new LoadablePlugin(),
      new TreatPlugin({
        outputLoaders: [MiniCssExtractPlugin.loader],
      }),
      new MiniCssExtractPlugin(),
      renderPlugin,
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        openAnalyzer: false,
        reportFilename: reportBundlePath,
      }),
    ],
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
    plugins: [
      new TreatPlugin({
        outputCSS: false,
      }),
      new MiniCssExtractPlugin(),
      renderPlugin.render(),
    ],
  }),
];
