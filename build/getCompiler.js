const webpack = require("webpack")
const path = require("path")

const getConfig = require("./webpack.config")
const RenderStaticPlugin = require("./RenderStaticPlugin")

module.exports = function getCompiler({ fs, liveReload }) {
  const compiler = webpack(getConfig({ productionise: false, liveReload }))

  const cwd = process.cwd()
  const distDirectory = path.join(cwd, "dist")

  const paths = ["", "b", "a", "about", "home", "contact/us"]
  compiler.apply(
    new RenderStaticPlugin({
      paths,
      mapStatsToParams: ({ clientStats }) => ({
        clientStats,
        reactLoadableManifest: JSON.parse(
          compiler.compilers[0].outputFileSystem.readFileSync(
            path.join(clientStats.outputPath, "react-loadable-manifest.json"),
            "utf8"
          )
        ),
      }),
      renderDirectory: distDirectory,
      fs,
      verbose: true,
    })
  )

  return compiler
}
