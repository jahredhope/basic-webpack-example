const path = require("path");
const _mkdirp = require("mkdirp");
const { RawSource } = require("webpack-sources");

const createRenderer = require("./createRenderer");

const PLUGIN_NAME = "browser-loadable-status";

const noop = () => {};

async function emitAsset(fileSystem, dir, content) {
  const mkdirp =
    fileSystem.mkdirp ||
    ((directory, cb) => _mkdirp(directory, { fs: fileSystem }, cb));
  await new Promise((resolve, reject) =>
    mkdirp(path.dirname(dir), error => {
      if (error) {
        reject(error);
      }
      resolve();
    })
  );
  return new Promise((resolve, reject) =>
    fileSystem.writeFile(dir, content, error => {
      if (error) {
        reject(error);
      }

      resolve();
    })
  );
}

module.exports = ({ routes, emitAssetsToCompilation }) => {
  let browserCompilation = null;
  let nodeCompilation = null;

  const renderWhenReady = lastCompilation => {
    if (!browserCompilation || !nodeCompilation) {
      return;
    }

    const clientStats = browserCompilation.getStats().toJson({
      hash: true,
      publicPath: true,
      assets: true,
      chunks: false,
      modules: false,
      source: false,
      errorDetails: false,
      timings: false,
    });

    const renderer = createRenderer({
      fileName: "render.js",
      compilation: nodeCompilation,
    });

    const baseDir = path.isAbsolute(htmlOutputDir)
      ? path.resolve(htmlOutputDir)
      : htmlOutputDir;

    const routeToFilePath = route => {
      path.join(...route.split("/").filter(Boolean), "index.html");
    };

    const htmlOutputDir = "/Users/jhope/code/basic-webpack/dist/document";

    routes.forEach(async route => {
      const content = await renderer({ clientStats, route });
      const filePath = path.join(htmlOutputDir, routeToFilePath(route));
      if (emitAssetsToCompilation) {
        lastCompilation.assets[filePath] = new RawSource(content);
      } else {
        emitAsset(
          browserCompilation.compiler.outputFileSystem,
          filePath,
          content
        );
      }
    });
    return;
  };

  const clientPlugin = browserCompiler => {
    browserCompiler.hooks.emit.tapPromise(PLUGIN_NAME, async compilation => {
      browserCompilation = compilation;
      renderWhenReady(compilation);
    });
  };
  const nodePlugin = nodeCompiler => {
    nodeCompiler.hooks.emit.tapPromise(PLUGIN_NAME, async compilation => {
      nodeCompilation = compilation;
      renderWhenReady(compilation);
    });
  };
  return {
    clientPlugin,
    nodePlugin,
    devServerRouter: noop,
  };
};
