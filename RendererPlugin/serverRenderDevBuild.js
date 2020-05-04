const express = require("express");
const proxy = require("express-http-proxy");
const waitOn = require("wait-on");
const debug = require("debug");

const createServer = require("./createServer");

const PLUGIN_NAME = "server-render";

function getSourceFromCompilation(compilation) {
  const files = {};
  Object.entries(compilation.assets).forEach(([assetName, asset]) => {
    files[assetName] = asset.source();
  });
  return files;
}

module.exports = ({ healthCheckEndpoint, rendererUrl, routes }) => {
  let browserBuildReady = false;
  let nodeBuildReady = false;
  let rendererReady = false;
  let rendererError = null;
  let browserCompilation = null;
  let nodeCompilation = null;
  const renderCallbacks = [];

  const { pushNewServer, onKillServer } = createServer({
    onReady: async (error) => {
      if (error) {
        debug("render:server:master")("Error from worker:", error);
      } else {
        await waitOnServer();
        debug("render:server")("Healthcheck passed. Marking renderer ready");
      }
      rendererError = error;
      rendererReady = true;
      flushQueuedRequests();
    },
  });

  const getClientStats = () =>
    browserCompilation
      ? browserCompilation.getStats().toJson({
          hash: true,
          publicPath: true,
          assets: true,
          chunks: false,
          modules: false,
          source: false,
          errorDetails: false,
          timings: false,
        })
      : null;
  const isBuildReady = () => browserBuildReady && nodeBuildReady;
  const isRendererReady = () => isBuildReady() && rendererReady;

  const startServerIfReady = async () => {
    if (!isBuildReady()) {
      return;
    }
    const files = getSourceFromCompilation(nodeCompilation);

    files["loadable-stats.json"] = `module.exports = ${JSON.stringify(
      getClientStats(),
      null,
      2
    )}`;
    await pushNewServer({ entry: "server.js", sourceModules: files });
  };

  const flushQueuedRequests = () => {
    if (isRendererReady() && renderCallbacks.length > 0) {
      renderCallbacks.shift()();
      flushQueuedRequests();
    }
  };
  const renderWhenReady = (cb) => {
    if (isRendererReady()) {
      cb();
    } else {
      renderCallbacks.push(cb);
    }
  };

  const waitOnServer = async () => {
    const timeoutId = setTimeout(() => {
      debug("render:server")("Still waiting. Taking a while");
    }, 4000);
    await waitOn({
      interval: 500,
      timeout: 60000,
      resources: [healthCheckEndpoint],
    });
    clearTimeout(timeoutId);
  };

  const clientPlugin = (browserCompiler) => {
    browserCompiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
      browserBuildReady = false;
    });
    browserCompiler.hooks.done.tap(PLUGIN_NAME, () => {
      browserBuildReady = true;
      startServerIfReady();
      flushQueuedRequests();
    });

    browserCompiler.hooks.afterEmit.tap(PLUGIN_NAME, async (compilation) => {
      browserCompilation = compilation;
    });
  };

  const nodePlugin = (nodeCompiler) => {
    nodeCompiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
      nodeBuildReady = false;
      rendererReady = false;
      rendererError = null;
    });

    nodeCompiler.hooks.done.tap(PLUGIN_NAME, () => {
      nodeBuildReady = true;
      startServerIfReady();
      flushQueuedRequests();
    });

    nodeCompiler.hooks.beforeCompile.tap(PLUGIN_NAME, onKillServer);

    nodeCompiler.hooks.afterEmit.tap(PLUGIN_NAME, (compilation) => {
      nodeCompilation = compilation;
    });
  };

  const devServerRouter = express.Router();

  const formatErrorResponse = (error) => {
    let devServerScripts = [];
    const webpackStats = getClientStats();
    try {
      const devServerAssets = webpackStats.entrypoints.devServerOnly.assets;

      devServerScripts = devServerAssets.map(
        (asset) => `<script src="${webpackStats.publicPath}${asset}"></script>`
      );
    } catch (err) {
      console.error("Unable to load Dev Server Scripts. Error: ", err);
    }

    return [error, ...devServerScripts].join("\n");
  };

  const handleProxy = proxy(rendererUrl, {
    proxyReqPathResolver: (req) => req.originalUrl,
  });

  routes.forEach((route) => {
    devServerRouter.use(route, async (req, res, next) => {
      renderWhenReady(() => {
        if (rendererError) {
          res.status(500).send(formatErrorResponse(rendererError));
          return;
        }

        handleProxy(req, res, next);
      });
    });
  });

  return {
    clientPlugin,
    nodePlugin,
    devServerRouter,
  };
};
