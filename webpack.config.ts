import webpack from "webpack";
import merge from "webpack-merge";
import { Buffer } from "buffer";
import path from "path";
import LoadablePlugin from "@loadable/webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import mkdirp from "mkdirp";
import createServerRendererPlugin from "./RendererPlugin/ServerRendererPlugin";
// import createStaticRendererPlugin from "./RendererPlugin/StaticRendererPlugin"
import HtmlRenderPlugin from "html-render-webpack-plugin";

import { paths } from "./config";

import {
  staticRoutes,
  serverRoutes,
  rendererUrl,
  rendererHealthcheck,
} from "./config";

const domain = "http://localhost:8080";
const liveReloadEntry = `${require.resolve(
  "webpack-dev-server/client/"
)}?${domain}`;

export default async function getConfig({ buildType }): Promise<any> {
  const liveReload = buildType === "start";
  const mode =
    process.env.NODE_ENV === "development" ? "development" : "production";

  const usingFileSystem = buildType === "build";

  const serverRendererPlugin = createServerRendererPlugin({
    useDevServer: buildType === "start",
    healthCheckEndpoint: rendererHealthcheck,
    rendererUrl,
    routes: serverRoutes,
  });

  // TODO: Some tooling is doesn't currently support documents being anywhere but relative to root
  const hackForceToRoot = true;
  const htmlRenderPlugin = new HtmlRenderPlugin({
    renderEntry: "render",
    routes: staticRoutes,
    renderDirectory: hackForceToRoot ? paths.distPath : paths.documentOutput,
    skipAssets: buildType === "start",
    extraGlobals: { Buffer },
  });

  if (usingFileSystem) {
    const dir = path.dirname(paths.clientStatsLocation);
    try {
      await mkdirp(dir);
    } catch (error) {
      console.error(
        "Error creating clientStats Location. Location: ",
        dir,
        "Error: ",
        error
      );
    }
  }
  console.log({ htmlRenderPlugin });
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
  };
  const configs: any = [
    merge(common, {
      output: {
        path: hackForceToRoot ? paths.distPath : paths.browserOutput,
        filename: "[name]-[hash].js",
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
      name: "client",
      target: "web",
      entry: {
        main: paths.clientEntry,
        ...(liveReload ? { devServerOnly: liveReloadEntry } : {}),
      },
      plugins: [
        serverRendererPlugin.clientPlugin,
        htmlRenderPlugin.statsCollectorPlugin,
        new LoadablePlugin({
          writeToDisk: usingFileSystem
            ? { filename: path.dirname(paths.clientStatsLocation) }
            : false,
          outputAsset: false,
        }),
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          reportFilename: paths.reportLocation,
          openAnalyzer: false,
        }),
      ],
    }),
    merge(common, {
      output: {
        path: paths.nodeOutput,
        libraryExport: "default",
        library: "static",
        // libraryTarget: "umd2",
        // libraryTarget: "commonjs2",
        libraryTarget: "umd2",
        filename: "[name].js",
      },
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
              options: {
                emitFile: false,
              },
            },
          },
        ],
      },
      name: "server",
      target: "node",
      entry: { server: paths.serverEntry, render: paths.renderEntry },
      plugins: [
        serverRendererPlugin.nodePlugin,
        htmlRenderPlugin.rendererPlugin,
      ],
    }),
    merge(common, {
      output: {
        path: paths.runtimeOutput,
        // libraryExport: "default",
        // library: "static",
        // libraryTarget: "umd2",
        // libraryTarget: "commonjs2",
        libraryTarget: "commonjs2",
        filename: "[name].js",
      },
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
              options: {
                emitFile: false,
              },
            },
          },
        ],
      },
      name: "runtime",
      target: "webworker",
      resolve: {
        alias: { fs: path.resolve(__dirname, "mocked-fs.js") },
        aliasFields: ["main"],
        // mainFields: ["module", "main"],
      },
      entry: { response: paths.runtimeEntry },
      plugins: [
        /**
         * This build is currently targetted at a webworker but actually runs inside a V8 Isolate
         * V8 Isolate doesn't have a notion of 'self', so this hacks around this
         */
        new webpack.BannerPlugin({
          banner: "let self = global;\n",
          raw: true,
        }),
      ],
    }),
  ];

  configs.htmlRenderPlugin = htmlRenderPlugin;
  configs.serverRendererPlugin = serverRendererPlugin;
  return configs;
}
