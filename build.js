const path = require("path");
const fs = require("fs").promises;
const webpack = require("webpack");
const { promisify } = require("util");
const mkdirp = promisify(require("mkdirp"));

const configs = require("./webpack.config");
const { staticRoutes, paths } = require("./config");

const compiler = webpack(configs);

const routeToFilePath = route =>
  path.join(...route.split("/").filter(Boolean), "index.html");

compiler.run(err => {
  if (err) {
    throw new Error("err");
  }
  const renderer = require(path.join(paths.nodeOutput, "render"));
  const clientStats = require(paths.clientStatsLocation);
  Promise.all(
    staticRoutes.map(async route => {
      const content = await renderer({ clientStats, route });
      const filePath = path.join(paths.htmlOutput, routeToFilePath(route));

      await mkdirp(path.dirname(filePath));
      await fs.writeFile(filePath, content);
    })
  );
});
