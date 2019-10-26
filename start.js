const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const express = require("express");
const proxy = require("express-http-proxy");
const waitOn = require("wait-on");
const pathToRegexp = require("path-to-regexp");
const cluster = require("cluster");
const debug = require("debug");
const exceptionFormatter = require("exception-formatter");
const bodyParser = require("body-parser");
const querystring = require("querystring");

const createRenderer = require("./createRenderer");
const [browserConfig, nodeConfig] = require("./webpack.config");
const {
  staticRoutes,
  serverRoutes,
  rendererUrl,
  rendererHealthcheck,
} = require("./config");

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

const browserCompiler = webpack(browserConfig);
const nodeCompiler = webpack(nodeConfig);
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
  exec: "child.js",
  silent: false,
});

let renderServerReady = false;
let workerErrored = false;
let workerError = "";

const waitForRenderServerReady = async () => {
  if (renderServerReady) {
    return;
  }
  debug("app:start")("Waiting till server ready");
  const timeoutId = setTimeout(() => {
    debug("app:start")("Still waiting. Taking a while");
  }, 4000);
  if (workerErrored) {
    throw new Error("Server in errored state: " + workerError);
  }
  await waitOn({
    interval: 500,
    timeout: 60000,
    resources: [rendererHealthcheck],
  });
  clearTimeout(timeoutId);
  debug("app:start")("Server ready");
  // eslint-disable-next-line require-atomic-updates
  renderServerReady = true;
};

async function createWorker(params) {
  debug("app:start:master")("createWorker");
  if (currentWorker && currentWorker.isConnected() && !currentWorker.isDead()) {
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
      workerError = msg.error;
      debug("app:start:master")("Error from worker:", msg.error);
    } else if (msg && msg.status === "finished") {
      debug("app:start:master")("Worker finished");
    } else {
      debug("app:start:master")("Message from worker", msg);
    }
  });

  worker.on("exit", (code, signal) => {
    renderServerReady = false;
    currentWorker = null;
    if (code) {
      console.error("Worker exited with:", { code, signal });
      workerErrored = true;
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

browserCompiler.hooks.afterEmit.tapPromise(
  "browser-loadable-status",
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

function getServerFiles(compilation) {
  const files = {};
  Object.entries(compilation.assets).forEach(([assetName, asset]) => {
    files[assetName] = asset.source();
  });
  return files;
}

const renderCallbacks = [];
function flushQueuedRequests() {
  if (renderCallbacks.length > 0) {
    renderCallbacks.shift()();
    flushQueuedRequests();
  }
}

nodeCompiler.hooks.beforeCompile.tap("server-start-server-killer", () => {
  workerErrored = false;
  if (currentWorker && currentWorker.isConnected()) {
    currentWorker.kill();
  }
});

nodeCompiler.hooks.afterEmit.tapPromise(
  "server-start-server",
  async compilation => {
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
    try {
      await waitForRenderServerReady();
      await flushQueuedRequests();
    } catch (error) {
      console.error("Error creating worker");
    }
  }
);

const staticRegex = /^\/static/i;
const apiRegex = /^\/api/i;

const webpackDevServer = new WebpackDevServer(browserCompiler, {
  publicPath: "/static/",
  serveIndex: false,
  disableHostCheck: true,
});
nodeCompiler.watch({}, done);

router.use((req, res, next) => {
  if (
    req.url.substr(-1) !== "/" &&
    !req.url.match(staticRegex) &&
    !req.url.match(apiRegex)
  ) {
    debug("app:start:response")("REDIRECTING", req.url);
    res.redirect(301, req.url + "/");
  } else {
    next();
  }
});

serverRoutes.forEach(route => {
  router.use(route, async (req, res, next) => {
    try {
      await waitForRenderServerReady();
    } catch (err) {
      res.status(500).send(exceptionFormatter(err || {}, { format: "html" }));
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
//
// TODO: Move this
router.use("/api/reddit/", proxy("https://api.reddit.com/"));
router.use("/api/countries/", proxy("https://countries.trevorblades.com/"));
router.use("/events/", bodyParser.text());
router.post("/events/", (req, res) => {
  console.log("/events/", { ...querystring.parse(req.body) });
  res.sendStatus(204);
});
//

router.get("*", async (req, res, next) => {
  if (!staticRenderer) {
    debug("app:start:response")("Delaying due no staticRenderer");
    await new Promise(resolve => {
      renderCallbacks.push(resolve);
    });
    debug("app:start:response")("Continuing after delay");
  }
  if (serverRoutes.find(route => pathToRegexp(route).exec(req.path))) {
    debug("app:start:response")("got a server rendered route", req.path);
    next();
  }
  const route = staticRoutes.find(route => pathToRegexp(route).exec(req.path));
  if (!route) {
    debug("app:start:response")("No route for", req.path);
    res.status(404).send(`Nothing here for ${req.path}`);
    return;
  }
  if (route) {
    debug("app:start:response")(`Static render for ${route} from ${req.path}`);
    try {
      res.send(await staticRenderer({ route, clientStats: latestClientStats }));
    } catch (err) {
      res.status(500).send(exceptionFormatter(err || {}, { format: "html" }));
    }
  }
});

webpackDevServer.use(router);

webpackDevServer.app.disable("x-powered-by");

webpackDevServer.listen(8080, done);
