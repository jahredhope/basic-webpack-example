const fs = require("fs")
const path = require("path")
const webpack = require("webpack")
const getConfig = require("./webpack.config")
const RenderStaticPlugin = require("multi-static-render-webpack-plugin")

module.exports = function getCompiler({ liveReload, mode }) {
  const compiler = webpack(getConfig({ liveReload, mode }))

  const cwd = process.cwd()
  const distDirectory = path.join(cwd, "dist")

  const paths = ["", "b", "a", "about", "home", "contact/us"]
  compiler.apply(
    new RenderStaticPlugin({
      paths,
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
      fs,
      verbose: true,
    })
  )

  return compiler
}
