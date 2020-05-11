const path = require("path");

const cwd = process.cwd();
const rootPath = cwd;
const srcPath = path.resolve(cwd, "src");
const distPath = path.resolve(cwd, "dist");
const nodeOutput = path.resolve(distPath, "node");
const runtimeOutput = path.resolve(distPath, "runtime");

const ports = {
  devServer: 8080,
  renderer: 3001,
};

const rendererUrl = `http://localhost:${ports.renderer}`;
const config = {
  ports,
  paths: {
    distPath,
    nodeOutput,
    runtimeOutput,
    reportLocation: path.resolve(rootPath, "report", "client.html"),
    clientStatsLocation: path.resolve(nodeOutput, "loadable-stats.json"),
    browserOutput: path.resolve(distPath, "browser"),
    documentOutput: path.resolve(distPath, "document"),
    htmlOutput: path.resolve(distPath, "html"),
    cloudflareOutput: path.resolve(distPath, "cloudflare"),
    cloudflareEntry: path.resolve(srcPath, "cloudflare.tsx"),
    runtimeEntry: path.resolve(srcPath, "runtime.tsx"),
    renderEntry: path.resolve(srcPath, "render.tsx"),
    serverEntry: path.resolve(srcPath, "server.tsx"),
    clientEntry: path.resolve(srcPath, "client.tsx"),
  },

  staticRoutes: ["/", "/a/", "/b/", "/c/", "/error/404"],
  serverRoutes: ["/b/"],
  rendererUrl,
  rendererHealthcheck: `${rendererUrl}/healthcheck`,
};

module.exports = config;
