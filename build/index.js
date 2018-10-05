console.log("build", "start")

const WebpackDevServer = require("webpack-dev-server")
const useMemoryFs = false
const chalk = require("chalk")
const MemoryFS = require("memory-fs")
const webpack = require("webpack")
const path = require("path")
const rimraf = require("rimraf")
const mkdirP = require("mkdirP")

const getConfig = require("./webpack.config")
const printWebpackStats = require("./printWebpackStats")
const RenderStaticPlugin = require("./RenderStaticPlugin")

const fs = useMemoryFs ? new MemoryFS() : require("fs")
const compiler = webpack(getConfig({ productionise: true, fs }))
if (useMemoryFs) {
  console.log("using custom fs")
  compiler.outputFileSystem = fs
}

const cwd = process.cwd()
const distDirectory = path.join(cwd, "dist")

if (!useMemoryFs) {
  rimraf.sync(`${distDirectory}/*.js`)
}
mkdirP.sync(path.join(cwd, distDirectory), { fs })

// compiler.apply(
//   new webpack.ProgressPlugin({
//     profile: false,
//   })
// )

compiler.apply(
  new RenderStaticPlugin({
    assetsDirectory: distDirectory,
    renderDirectory: distDirectory,
    fs,
  })
)

async function onDone(stats) {
  // console.log({ fsdata: fs.data })
  // printWebpackStats(stats)
}

async function onBuild(err) {
  if (err) {
    console.error(chalk.red("Error during build:"), err)
    return
  }
}

const hookOptions = { name: "base" }

compiler.hooks.done.tap(hookOptions, onDone)

const runType = "run"
if (runType === "watch") {
  compiler.watch({}, onBuild)
} else if (runType === "run") {
  compiler.run(onBuild)
} else if (runType === "server") {
  const server = new WebpackDevServer(compiler, {})

  server.listen(8080, "127.0.0.1", () => {
    console.log("Starting server on http://localhost:8080")
  })
}
