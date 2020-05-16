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
      output: {
        path: hackForceToRoot ? paths.distPath : paths.browserOutput,
        filename: "[name]-[contenthash].js",
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
