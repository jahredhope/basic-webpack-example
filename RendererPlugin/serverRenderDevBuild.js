const MultiStats = require("webpack/lib/MultiStats");
const express = require("express");
const proxy = require("express-http-proxy");
const waitOn = require("wait-on");
const debug = require("debug");
const fs = require("fs");

const createServer = require("./createServer");

const log = debug("RenderPlugin");

const PLUGIN_NAME = "server-render";

function getSourceFromCompilation(compilation) {
  const files = {};
  Object.entries(compilation.assets).forEach(([assetName, asset]) => {
    files[assetName] = asset.source();
  });
  return files;
}

module.exports = ({
  useDevServer,
  healthCheckEndpoint,
  filename,
  rendererUrl,
  routes,
}) => {
  // let browserBuildReady = false;
  let nodeBuildReady = false;
  let rendererReady = false;
  let rendererError = null;
  const clientCompilations = [];
  let nodeCompilation = null;
  const renderCallbacks = [];

  const { pushNewServer, onKillServer } = createServer({
    onReady: async (error) => {
      if (error) {
        debug("RenderPlugin:server:master")("Error from worker:", error);
      } else {
        await waitOnServer();
        debug("RenderPlugin:server")(
          "Healthcheck passed. Marking renderer ready"
        );
      }
      rendererError = error;
      rendererReady = true;
      flushQueuedRequests();
    },
  });

  const getClientStats = () => {
    const clientStats = (clientCompilations.length === 1
      ? clientCompilations[0].compilation.getStats()
      : new MultiStats(
          clientCompilations
            .map((compilationStatus) => compilationStatus.compilation)
            .filter(Boolean)
            .map((compilation) => compilation.getStats())
        )
    ).toJson({
      hash: true,
      publicPath: true,
      assets: true,
      chunks: false,
      modules: false,
      source: false,
      errorDetails: false,
      timings: false,
    });

    return clientStats;
  };
  const isBuildReady = () => {
    return (
      clientCompilations.every((c, i) => {
        if (!c.compilation) {
          log("isReady", `No compilation for config index ${i}`);
          return false;
        }
        if (!c.isReady) {
          log("isReady", `${c.compilation.name} not ready`);
          return false;
        }
        return true;
      }) && nodeBuildReady
    );
  };
  const isRendererReady = () => isBuildReady() && rendererReady;

  const startServerIfReady = async () => {
    if (!isBuildReady()) {
      log("startServerIfReady", "server not ready");
      return;
    }
    log("startServerIfReady", "server ready");
    const files = getSourceFromCompilation(nodeCompilation);

    files["client-stats.json"] = `module.exports = ${JSON.stringify(
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
      debug("RenderPlugin:server")("Still waiting. Taking a while");
    }, 4000);
    await waitOn({
      interval: 500,
      timeout: 60000,
      resources: [healthCheckEndpoint],
    });
    clearTimeout(timeoutId);
  };

  const clientPlugin = (browserCompiler) => {
    const compilationStatus = {
      compilation: null,
      isReady: false,
    };

    browserCompiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
      compilationStatus.isReady = false;
    });

    browserCompiler.hooks.afterEmit.tap(PLUGIN_NAME, async (compilation) => {
      compilationStatus.compilation = compilation;
      compilationStatus.isReady = true;
      if (useDevServer) {
        startServerIfReady();
        flushQueuedRequests();
      } else {
        log("browser compiler", "afterEmit");
        if (clientCompilations.every((c) => c.isReady)) {
          log("browser compiler", "afterEmit", "ready", filename);
          const content = JSON.stringify(getClientStats(), null, 2);
          fs.writeFileSync(filename, content);
        }
      }
    });
    clientCompilations.push(compilationStatus);
  };

  const nodePlugin = (nodeCompiler) => {
    nodeCompiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
      nodeBuildReady = false;
      rendererReady = false;
      rendererError = null;
    });

    nodeCompiler.hooks.emit.tap(PLUGIN_NAME, (compilation) => {
      nodeCompilation = compilation;
      nodeBuildReady = true;
      if (useDevServer) {
        startServerIfReady();
        flushQueuedRequests();
      } else {
        const statsString = JSON.stringify(getClientStats());
        log("Generate client-stats.json of length:", statsString.length);
        compilation.assets["client-stats.json"] = {
          source: () => {
            return statsString;
          },
          size: () => {
            return statsString.length;
          },
        };
      }
    });

    nodeCompiler.hooks.beforeCompile.tap(PLUGIN_NAME, onKillServer);
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
