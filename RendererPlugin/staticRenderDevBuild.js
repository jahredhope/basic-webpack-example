const express = require("express");
const debug = require("debug");
const exceptionFormatter = require("exception-formatter");

const createRenderer = require("./createRenderer");

const PLUGIN_NAME = "static-render";

function getSourceFromCompilation(compilation) {
  const files = {};
  Object.entries(compilation.assets).forEach(([assetName, asset]) => {
    files[assetName] = asset.source();
  });
  return files;
}

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
      source: getSourceFromCompilation(nodeCompilation),
    });
    flushQueuedRequests();
  };

  const flushQueuedRequests = () => {
    if (isStaticRenderReady() && staticRenderCallbacks.length > 0) {
      staticRenderCallbacks.shift()(staticRenderer);
      flushQueuedRequests();
    }
  };

  const onRendererReady = (cb) => {
    if (isStaticRenderReady()) {
      cb(staticRenderer);
    } else {
      staticRenderCallbacks.push(cb);
    }
  };
  const clientPlugin = (browserCompiler) => {
    browserCompiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
      browserBuildReady = false;
    });
    browserCompiler.hooks.done.tap(PLUGIN_NAME, () => {
      browserBuildReady = true;
      createRendererIfReady();
    });

    browserCompiler.hooks.afterEmit.tap(PLUGIN_NAME, async (compilation) => {
      browserCompilation = compilation;
    });
  };

  const nodePlugin = (nodeCompiler) => {
    nodeCompiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
      nodeBuildReady = false;
    });

    nodeCompiler.hooks.done.tap(PLUGIN_NAME, () => {
      nodeBuildReady = true;
      createRendererIfReady();
    });

    nodeCompiler.hooks.afterEmit.tap(PLUGIN_NAME, (compilation) => {
      nodeCompilation = compilation;
    });
  };

  const formatErrorResponse = (error) => {
    let devServerScripts = [];
    const webpackStats = getClientStats();
    try {
      const devServerAssets = webpackStats.entrypoints.main.assets;

      devServerScripts = devServerAssets.map(
        (asset) => `<script src="${webpackStats.publicPath}${asset}"></script>`
      );
    } catch (err) {
      console.error("Unable to load Dev Server Scripts. Error: ", err);
    }

    return [error, ...devServerScripts].join("\n");
  };

  const devServerRouter = express.Router();

  routes.forEach((route) => {
    devServerRouter.get(route, async (req, res) => {
      onRendererReady(async (renderer) => {
        debug("render:static:response")(
          `Static render for ${route} from ${req.path}`
        );
        try {
          res.send(await renderer({ route, clientStats: getClientStats() }));
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
    devServerRouter,
    nodePlugin,
    onRendererReady,
  };
};
