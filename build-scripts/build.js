const path = require("path");
const fs = require("fs").promises;
const webpack = require("webpack");
const { promisify } = require("util");
const mkdirp = promisify(require("mkdirp"));

module.exports = function build({
  configs,
  rendererLocation,
  clientStatsLocation,
  htmlOutputDir,
  staticRoutes,
}) {
  const compiler = webpack(configs);

  const routeToFilePath = route =>
    path.join(...route.split("/").filter(Boolean), "index.html");

  compiler.run(err => {
    if (err) {
      throw new Error(`An error occurred during compile. Error: ${err}`);
    }
    const renderer = rendererLocation;
    const clientStats = require(clientStatsLocation);
    Promise.all(
      staticRoutes.map(async route => {
        const content = await renderer({ clientStats, route });
        const filePath = path.join(htmlOutputDir, routeToFilePath(route));

        await mkdirp(path.dirname(filePath));
        await fs.writeFile(filePath, content);
      })
    );
  });
};
