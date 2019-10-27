const path = require("path");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const express = require("express");
const proxy = require("express-http-proxy");
const waitOn = require("wait-on");
const pathToRegexp = require("path-to-regexp");
const cluster = require("cluster");
const debug = require("debug");
const exceptionFormatter = require("exception-formatter");

const createRenderer = require("./createRenderer");

module.exports = function start({
  routeNotFound,
  onStartup,
  staticRoutes,
  serverRoutes,
  rendererUrl,
  rendererHealthcheck,
  configs,
}) {
  const router = express.Router();
  const workers = [];

  const trackWorkerStatus = false;
  if (trackWorkerStatus) {
    setInterval(() => {
      debug("app:worker:status")(
        workers.length,
        workers.map(worker => ({
          id: worker.id,
          con: worker.isConnected(),
          dead: worker.isDead(),
        }))
      );
    }, 5000);
  }

  const parentCompiler = webpack(configs);

  const browserCompiler = parentCompiler.compilers.find(
    c => c.name === "client"
  );
  const nodeCompiler = parentCompiler.compilers.find(c => c.name === "server");

  const done = error => {
    if (error) {
      console.error(error);
      throw error;
    }
    debug("app:start")("Done");
  };

  let latestClientStats;
  let staticRenderer;

  let currentWorker;
  cluster.setupMaster({
    exec: path.join(__dirname, "child.js"),
    silent: false,
  });

  let browserBuildReady = false;
  let nodeBuildReady = false;
  let serverRendererReady = false;

  let serverRendererError = null;

  const renderCallbacks = [];

  const flushQueuedRequests = () => {
    if (isReady() && renderCallbacks.length > 0) {
      renderCallbacks.shift()();
      flushQueuedRequests();
    }
  };

  const isReady = () =>
    browserBuildReady && nodeBuildReady && serverRendererReady;

  const renderWhenReady = cb => {
    if (isReady()) {
      cb({ latestClientStats, staticRenderer });
    } else {
      renderCallbacks.push(cb);
    }
  };

  const waitOnServer = async () => {
    const timeoutId = setTimeout(() => {
      debug("app:start")("Still waiting. Taking a while");
    }, 4000);
    await waitOn({
      interval: 500,
      timeout: 60000,
      resources: [rendererHealthcheck],
    });
    clearTimeout(timeoutId);
  };

  async function createWorker(params) {
    debug("app:start:master")("createWorker");
    if (
      currentWorker &&
      currentWorker.isConnected() &&
      !currentWorker.isDead()
    ) {
      const waitTillChildIsDead = new Promise(resolve =>
        currentWorker.on("kill", resolve)
      );
      debug("app:start:master")("Waiting for current worker to end");
      currentWorker.kill();
      await waitTillChildIsDead;
      debug("app:start:master")("Continuing worker creation");
    }
    debug("app:start:master")(cluster.workers);
    const worker = cluster.fork();

    worker.on("message", function(msg) {
      if (msg.error) {
        serverRendererError = msg.error;
        console.log("msg.error AS", msg.error);
        debug("app:start:master")("Error from worker:", msg.error);
        serverRendererReady = true;
        flushQueuedRequests();
      } else if (msg && msg.status === "finished") {
        debug("app:start:master")("Worker finished");
        waitOnServer();
        debug("app:start")("Healthcheck passed. Marking renderer ready");
        serverRendererReady = true;
        flushQueuedRequests();
      } else {
        debug("app:start:master")("Message from worker", msg);
      }
    });

    worker.on("exit", (code, signal) => {
      currentWorker = null;
      if (code) {
        console.error("Worker exited with:", { code, signal });
        // throw new Error(`Worker exited with code "${code}".`);
      }
    });

    worker.on("online", () => {
      debug("app:start:master")(`Worker Online. ID: ${worker.id}.`);
      currentWorker = worker;
      workers.push(worker);
      worker.send(params); //Send the code to run for the worker
    });
  }

  const PLUGIN_NAME = "browser-loadable-status";

  browserCompiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
    browserBuildReady = false;
  });
  nodeCompiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
    nodeBuildReady = false;
    serverRendererReady = false;
    serverRendererError = null;
  });
  browserCompiler.hooks.done.tap(PLUGIN_NAME, () => {
    browserBuildReady = true;
    flushQueuedRequests();
  });
  nodeCompiler.hooks.done.tap(PLUGIN_NAME, () => {
    nodeBuildReady = true;
    flushQueuedRequests();
  });

  browserCompiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, async compilation => {
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
  });

  nodeCompiler.hooks.beforeCompile.tap(PLUGIN_NAME, () => {
    if (currentWorker && currentWorker.isConnected()) {
      currentWorker.kill();
    }
  });

  nodeCompiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, async compilation => {
    staticRenderer = createRenderer({
      fileName: "render.js",
      compilation: compilation,
    });

    const files = getServerFiles(compilation);

    files["loadable-stats.json"] = `module.exports = ${JSON.stringify(
      latestClientStats,
      null,
      2
    )}`;

    await createWorker({ entry: "server.js", sourceModules: files });
  });

  function getServerFiles(compilation) {
    const files = {};
    Object.entries(compilation.assets).forEach(([assetName, asset]) => {
      files[assetName] = asset.source();
    });
    return files;
  }

  const webpackDevServer = new WebpackDevServer(parentCompiler, {
    publicPath: "/static/",
    serveIndex: false,
    disableHostCheck: true,
  });

  onStartup(router);

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
    router.use(route, async (req, res, next) => {
      await new Promise(resolve => renderWhenReady(resolve));

      if (serverRendererError) {
        res.status(500).send(formatErrorResponse(serverRendererError));
        return;
      }
      next();
    });
    router.use(
      route,
      proxy(rendererUrl, {
        proxyReqPathResolver: req => req.originalUrl,
      })
    );
  });

  // Static Rendering
  router.get("*", async (req, res) => {
    const route =
      staticRoutes.find(route => pathToRegexp(route).exec(req.path)) ||
      routeNotFound;
    if (!route) {
      debug("app:start:response")("No route for", req.path);
      res.status(404).send(`Nothing here for ${req.path}`);
      return;
    }
    renderWhenReady(async () => {
      if (!staticRenderer) {
        await new Promise(resolve => {
          renderCallbacks.push(resolve);
        });
      }
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

  webpackDevServer.use(router);

  webpackDevServer.app.disable("x-powered-by");

  webpackDevServer.listen(8080, done);
};
