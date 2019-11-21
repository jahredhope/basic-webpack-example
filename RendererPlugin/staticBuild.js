const path = require("path");
const _mkdirp = require("mkdirp");

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

module.exports = ({ routes, renderDirectory }) => {
  let browserCompilation = null;
  let nodeCompilation = null;

  const renderWhenReady = () => {
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

    const transformFilePath = route => {
      path.join(...route.split("/").filter(Boolean), "index.html");
    };

    routes.forEach(async route => {
      const content = await renderer({ clientStats, route });

      const filePath = path.join(renderDirectory, transformFilePath(route));

      emitAsset(
        browserCompilation.compiler.outputFileSystem,
        filePath,
        content
      );
    });
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
