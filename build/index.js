console.log("build", "start");

const useMemoryFs = false;

const MemoryFS = require("memory-fs");
const webpack = require("webpack");
const path = require("path");
const rimraf = require("rimraf");

const config = require("./webpack.config");
const printWebpackStats = require("./printWebpackStats");
const renderHtml = require("./renderHtml");

const compiler = webpack(config);

const fs = useMemoryFs ? new MemoryFS() : require("fs");
if (useMemoryFs) {
  compiler.outputFileSystem = fs;
}

const cwd = process.cwd();
const distDirectory = path.join(cwd, "dist");
console.log("Rendering", distDirectory);
let clientStats = null;
let renderStats = null;
if (!useMemoryFs) {
  rimraf.sync(`${distDirectory}/*.js`);
}

async function onBuild(err, stats) {
  const statsLength = stats.stats.length;
  if (statsLength !== 2) {
    console.error(`Watch failed to send all stats. Only sent ${statsLength}`);
  }
  printWebpackStats(stats);
  clientStats =
    stats.stats.find(stat => stat.compilation.name === "client") || clientStats;
  renderStats =
    stats.stats.find(stat => stat.compilation.name === "render") || renderStats;
  const assetsDirectory = distDirectory;
  const renderDirectory = distDirectory;
  await renderHtml({
    clientStats,
    renderStats,
    assetsDirectory,
    renderDirectory,
    fs
  });
}

const watch = true;
if (watch) {
  compiler.watch({}, onBuild);
} else {
  compiler.run(onBuild);
}

console.log("build", "end");
