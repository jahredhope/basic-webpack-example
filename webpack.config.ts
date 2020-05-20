/* eslint-disable @typescript-eslint/camelcase */
import webpack from "webpack";
import merge from "webpack-merge";
import { Buffer } from "buffer";
import path from "path";
import LoadablePlugin from "@loadable/webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import mkdirp from "mkdirp";
import createServerRendererPlugin from "./RendererPlugin/ServerRendererPlugin";
import HtmlRenderPlugin from "html-render-webpack-plugin";
import WebpackPwaManifest from "webpack-pwa-manifest";

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
  if (!process.env.VERSION) {
    throw new Error(
      "Unable to create Webpack config without VERSION env variable"
    );
  }
  const defineVersionPlugin = new webpack.DefinePlugin({
    VERSION: `"${process.env.VERSION}"`,
  });

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

  // TODO: Some tooling doesn't currently support documents being anywhere but relative to root
  const hackForceToRoot = false;
  const htmlRenderPlugin = new HtmlRenderPlugin({
    renderEntry: "render",
    routes: staticRoutes,
    mapStatsToParams: ({ webpackStats }) => {
      return {
        clientStats: webpackStats.stats
          .find((v) => v.compilation.name === "client")
          .toJson(),
        serviceWorkerStats: webpackStats.stats
          .find((v) => v.compilation.name === "service-worker")
          .toJson(),
      };
    },
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
  const common = {
    mode,
    output: {
      publicPath: hackForceToRoot ? "/" : "/static/",
    },
    resolve: {
      alias: { path: "path-browserify" },
      extensions: [".mjs", ".js", ".json", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.md$/,
          use: [
            {
              loader: "raw-loader",
            },
            {
              loader: "markdown-loader",
              options: {},
            },
          ],
        },
      ],
    },
    // Webpack 5 Optimization
    // optimization: {
    //   chunkIds: "deterministic",
    //   moduleIds: "deterministic",
    // },
  };

  const configs: any = [
    merge(common, {
      name: "service-worker",
      target: "webworker",
      output: {
        chunkFilename: "[name]-[contenthash].js",
        path: hackForceToRoot ? paths.distPath : paths.browserOutput,
        filename: "[name]-[hash].js",
      },
      entry: {
        main: paths.serviceWorkerEntry,
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
        ],
      },
      plugins: [
        new LoadablePlugin({
          filename: path.basename(paths.workerStatsLocation),
          writeToDisk: usingFileSystem
            ? { filename: path.dirname(paths.workerStatsLocation) }
            : false,
          outputAsset: false,
        }),
        htmlRenderPlugin.statsCollectorPlugin,
      ],
    }),
    merge(common, {
      output: {
        chunkFilename: "[name]-[contenthash].js",
        path: hackForceToRoot ? paths.distPath : paths.browserOutput,
        filename: "[name]-[hash].js",
      },
      devtool: mode === "production" ? "source-map" : "cheap-module-source-map",
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
        new WebpackPwaManifest({
          name: "Basic webpack exmaple",
          short_name: "Basic",
          start_url: "/",
          description:
            "A project for testing web application patterns starting from a basic web application.",
          background_color: "#fefbfb",
          theme_color: "#21728c",
          // crossorigin: "use-credentials", //can be null, use-credentials or anonymous
          icons: [
            {
              src: path.resolve("src/manifest/icon_512-basic.png"),
              sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
            },
            {
              src: path.resolve("src/manifest/icon_512-basic.png"),
              size: "1024x1024", // you can also use the specifications pattern
            },
            {
              src: path.resolve("src/manifest/icon_512-basic.png"),
              size: "1024x1024",
            },
          ],
        }),
        new LoadablePlugin({
          filename: path.basename(paths.clientStatsLocation),
          writeToDisk: usingFileSystem
            ? { filename: path.dirname(paths.clientStatsLocation) }
            : false,
          outputAsset: false,
        }),
        serverRendererPlugin.clientPlugin,
        htmlRenderPlugin.statsCollectorPlugin,
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
      entry: {
        server: [
          "core-js/stable",
          "isomorphic-fetch",
          "regenerator-runtime/runtime",
          paths.serverEntry,
        ],
        render: [
          "core-js/stable",
          "isomorphic-fetch",
          "regenerator-runtime/runtime",
          paths.renderEntry,
        ],
      },
      plugins: [
        defineVersionPlugin,
        serverRendererPlugin.nodePlugin,
        htmlRenderPlugin.rendererPlugin,
      ],
    }),
    merge(common, {
      node: {
        // Buffer: false,
        // process: false,
      },
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
        mainFields: ["module", "main"],
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
    merge(common, {
      node: {
        // Buffer: false,
        // process: false,
      },
      optimization: {
        // We no not want to minimize our code.
        minimize: false,
        splitChunks: {
          // chunks(chunk) {
          //   console.log("CHUNKEYYY2", chunk.name, chunk);
          //   // exclude `my-excluded-chunk`
          //   return chunk.name === "response";
          // },
        },
      },
      output: {
        path: paths.cloudflareOutput,
        // libraryExport: "default",
        // library: "static",
        // libraryTarget: "umd2",
        // libraryTarget: "commonjs2",
        // libraryTarget: "commonjs2",
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
      name: "cloudflare",
      target: "webworker",
      resolve: {
        alias: { fs: path.resolve(__dirname, "mocked-fs.js") },
        aliasFields: ["main"],
        mainFields: ["module", "main"],
      },

      entry: { response: paths.cloudflareEntry },
      plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
        defineVersionPlugin,
      ],
    }),
  ];

  configs.htmlRenderPlugin = htmlRenderPlugin;
  configs.serverRendererPlugin = serverRendererPlugin;
  return configs;
}
