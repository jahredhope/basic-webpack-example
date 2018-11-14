const fs = require("fs")
const path = require("path")
const webpack = require("webpack")
const getConfig = require("./webpack.config")
const RenderStaticPlugin = require("html-render-webpack-plugin")

module.exports = function getCompiler({ liveReload, mode }) {
  const compiler = webpack(getConfig({ liveReload, mode }))

  const cwd = process.cwd()
  const distDirectory = path.join(cwd, "dist")

  const routes = [
    "",
    { route: "b", val: "more" },
    "a",
    "c",
    "about",
    "home",
    "contact/us",
  ]
  compiler.apply(
    new RenderStaticPlugin({
      routes,
      mapStatsToParams: ({ clientStats }) => {
        const fileSystem = compiler.compilers[0].outputFileSystem.readFileSync
          ? compiler.compilers[0].outputFileSystem
          : fs
        return {
          clientStats,
          reactLoadableManifest: JSON.parse(
            fileSystem.readFileSync(
              path.join(clientStats.outputPath, "react-loadable-manifest.json"),
              "utf8"
            )
          ),
        }
      },
      renderDirectory: distDirectory,
      // fs,
      verbose: true,
    })
  )

  return compiler
}
