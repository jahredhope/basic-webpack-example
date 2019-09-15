const fs = require("fs").promises;
const path = require("path");
const renderer = require("./dist/render");
const { promisify } = require("util");
const mkdirp = promisify(require("mkdirp"));

const pathFromRoute = route => path.join(...route.split("/"), "index.html");

async function render({ route, clientStats }) {
  const html = await renderer({
    route: route,
    clientStats,
  });
  const outputDir = "dist/html";
  const filePath = path.join(outputDir, pathFromRoute(route));
  await mkdirp(path.dirname(filePath));
  await fs.writeFile(filePath, html);
}

async function run() {
  const routes = ["/", "/a", "/b", "/c", "/notfound"];
  const clientStats = require("./dist/loadable-stats.json");

  for (const route of routes) {
    await render({
      route,
      clientStats,
    });
  }
}

run()
  .then(() => {
    console.log("Done");
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
