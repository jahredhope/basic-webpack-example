const express = require("express");
const proxy = require("express-http-proxy");
const waitOn = require("wait-on");
const debug = require("debug");
const exceptionFormatter = require("exception-formatter");

const createServer = require("./createServer");

const createRenderer = require("./createRenderer");

function getServerFiles(compilation) {
  const files = {};
  Object.entries(compilation.assets).forEach(([assetName, asset]) => {
    files[assetName] = asset.source();
  });
  return files;
}

const PLUGIN_NAME = "browser-loadable-status";

module.exports = ({
  healthCheckEndpoint,
  rendererUrl,
  serverRoutes,
  staticRoutes,
}) => {
  let browserBuildReady = false;
  let nodeBuildReady = false;
  let serverRendererReady = false;
  let serverRendererError = null;
  // let browserCompilation = null;
  let nodeCompilation = null;
  const staticRenderCallbacks = [];
  const serverRenderCallbacks = [];
  let latestClientStats;
  let staticRenderer;

  const enableStaticRenderer = staticRoutes.length > 0;
  const enableServerRenderer = serverRoutes.length > 0;

  const { pushNewServer, onKillServer } = createServer({
    onReady: async error => {
      if (error) {
        debug("app:start:master")("Error from worker:", error);
      } else {
        await waitOnServer();
        debug("app:start")("Healthcheck passed. Marking renderer ready");
      }
      serverRendererError = error;
      serverRendererReady = true;
      flushQueuedRequests();
    },
  });

  const isBuildReady = () => browserBuildReady && nodeBuildReady;
  const isStaticRenderReady = () => isBuildReady() && staticRenderer;
  const isServerRenderReady = () => isBuildReady() && serverRendererReady;

  const startServerIfReady = async () => {
    if (!isBuildReady() || !enableServerRenderer) {
      return;
    }
    const files = getServerFiles(nodeCompilation);

    files["loadable-stats.json"] = `module.exports = ${JSON.stringify(
      latestClientStats,
      null,
      2
    )}`;
    await pushNewServer({ entry: "server.js", sourceModules: files });
  };

  const flushQueuedRequests = () => {
    if (isStaticRenderReady() && staticRenderCallbacks.length > 0) {
      staticRenderCallbacks.shift()();
      flushQueuedRequests();
    } else if (isServerRenderReady() && serverRenderCallbacks.length > 0) {
      serverRenderCallbacks.shift()();
      flushQueuedRequests();
    }
  };

  const renderWhenStaticRenderReady = cb => {
    if (isStaticRenderReady()) {
      cb({ latestClientStats, staticRenderer });
    } else {
      staticRenderCallbacks.push(cb);
    }
  };
  const renderWhenServerRenderReady = cb => {
    if (isServerRenderReady()) {
      cb({ latestClientStats, staticRenderer });
    } else {
      serverRenderCallbacks.push(cb);
    }
  };

  const waitOnServer = async () => {
    const timeoutId = setTimeout(() => {
      debug("app:start")("Still waiting. Taking a while");
    }, 4000);
    await waitOn({
      interval: 500,
      timeout: 60000,
      resources: [healthCheckEndpoint],
    });
    clearTimeout(timeoutId);
  };

  const clientPlugin = browserCompiler => {
    browserCompiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
      browserBuildReady = false;
    });
    browserCompiler.hooks.done.tap(PLUGIN_NAME, () => {
      browserBuildReady = true;
      startServerIfReady();
      flushQueuedRequests();
    });

    browserCompiler.hooks.afterEmit.tapPromise(
      PLUGIN_NAME,
      async compilation => {
        latestClientStats = compilation.getStats().toJson({
          hash: true,
          publicPath: true,
          assets: true,
          chunks: false,
          modules: false,
          source: false,
          errorDetails: false,
          timings: false,
        });
      }
    );
  };

  const nodePlugin = nodeCompiler => {
    nodeCompiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
      nodeBuildReady = false;
      serverRendererReady = false;
      serverRendererError = null;
    });

    nodeCompiler.hooks.done.tap(PLUGIN_NAME, () => {
      nodeBuildReady = true;
      startServerIfReady();
      flushQueuedRequests();
    });

    nodeCompiler.hooks.beforeCompile.tap(PLUGIN_NAME, onKillServer);

    nodeCompiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, async compilation => {
      if (enableStaticRenderer) {
        staticRenderer = createRenderer({
          fileName: "render.js",
          compilation: compilation,
        });
        flushQueuedRequests();
      }

      nodeCompilation = compilation;
    });
  };

  const devServerRouter = express.Router();

  const formatErrorResponse = error => {
    let devServerScripts = [];
    try {
      const devServerAssets =
        latestClientStats.entrypoints.devServerOnly.assets;

      devServerScripts = devServerAssets.map(
        asset =>
          `<script src="${latestClientStats.publicPath}${asset}"></script>`
      );
    } catch (err) {
      console.error("Unable to load Dev Server Scripts. Error: ", err);
    }

    return [error, ...devServerScripts].join("\n");
  };

  serverRoutes.forEach(route => {
    devServerRouter.use(route, async (req, res, next) => {
      await new Promise(resolve => renderWhenServerRenderReady(resolve));

      if (serverRendererError) {
        res.status(500).send(formatErrorResponse(serverRendererError));
        return;
      }
      next();
    });
    devServerRouter.use(
      route,
      proxy(rendererUrl, {
        proxyReqPathResolver: req => req.originalUrl,
      })
    );
  });

  staticRoutes.forEach(route => {
    devServerRouter.get(route, async (req, res) => {
      renderWhenStaticRenderReady(async () => {
        debug("app:start:response")(
          `Static render for ${route} from ${req.path}`
        );
        try {
          res.send(
            await staticRenderer({ route, clientStats: latestClientStats })
          );
        } catch (err) {
          res.status(500).send(
            formatErrorResponse(
              exceptionFormatter(err, {
                format: "html",
                inlineStyle: true,
                basepath: "webpack://static/./",
              })
            )
          );
        }
      });
    });
  });

  return {
    clientPlugin,
    nodePlugin,
    devServerRouter,
  };
};
