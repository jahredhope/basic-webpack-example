const express = require("express");
const debug = require("debug");
const exceptionFormatter = require("exception-formatter");

const createRenderer = require("./createRenderer");

const PLUGIN_NAME = "static-render";

module.exports = ({ routes }) => {
  let browserBuildReady = false;
  let nodeBuildReady = false;
  let browserCompilation = null;
  let nodeCompilation = null;
  const staticRenderCallbacks = [];
  let staticRenderer;

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
  const isStaticRenderReady = () => isBuildReady() && staticRenderer;

  const createRendererIfReady = () => {
    if (!isBuildReady()) {
      return;
    }
    staticRenderer = createRenderer({
      fileName: "render.js",
      compilation: nodeCompilation,
    });
  };

  const flushQueuedRequests = () => {
    if (isStaticRenderReady() && staticRenderCallbacks.length > 0) {
      staticRenderCallbacks.shift()();
      flushQueuedRequests();
    }
  };

  const renderWhenStaticRenderReady = cb => {
    if (isStaticRenderReady()) {
      cb();
    } else {
      staticRenderCallbacks.push(cb);
    }
  };
  const clientPlugin = browserCompiler => {
    browserCompiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
      browserBuildReady = false;
    });
    browserCompiler.hooks.done.tap(PLUGIN_NAME, () => {
      browserBuildReady = true;
      createRendererIfReady();
      flushQueuedRequests();
    });

    browserCompiler.hooks.afterEmit.tap(PLUGIN_NAME, async compilation => {
      browserCompilation = compilation;
    });
  };

  const nodePlugin = nodeCompiler => {
    nodeCompiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
      nodeBuildReady = false;
    });

    nodeCompiler.hooks.done.tap(PLUGIN_NAME, () => {
      nodeBuildReady = true;
      createRendererIfReady();
      flushQueuedRequests();
    });

    nodeCompiler.hooks.afterEmit.tap(PLUGIN_NAME, compilation => {
      nodeCompilation = compilation;
    });
  };

  const devServerRouter = express.Router();

  const formatErrorResponse = error => {
    let devServerScripts = [];
    const webpackStats = getClientStats();
    try {
      const devServerAssets = webpackStats.entrypoints.devServerOnly.assets;

      devServerScripts = devServerAssets.map(
        asset => `<script src="${webpackStats.publicPath}${asset}"></script>`
      );
    } catch (err) {
      console.error("Unable to load Dev Server Scripts. Error: ", err);
    }

    return [error, ...devServerScripts].join("\n");
  };

  routes.forEach(route => {
    devServerRouter.get(route, async (req, res) => {
      renderWhenStaticRenderReady(async () => {
        debug("app:start:response")(
          `Static render for ${route} from ${req.path}`
        );
        try {
          res.send(
            await staticRenderer({ route, clientStats: getClientStats() })
          );
        } catch (error) {
          res.status(500).send(
            formatErrorResponse(
              exceptionFormatter(error, {
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
