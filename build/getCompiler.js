const webpack = require("webpack")
const path = require("path")
const rimraf = require("rimraf")
const mkdirp = require("mkdirp")

const getConfig = require("./webpack.config")
const RenderStaticPlugin = require("./RenderStaticPlugin")
const PrintStatsPlugin = require("./PrintStatsPlugin")

module.exports = function getCompiler({ fs }) {
  const compiler = webpack(getConfig({ productionise: true }))
  // compiler.outputFileSystem = fs

  const cwd = process.cwd()
  const distDirectory = path.join(cwd, "dist")

  rimraf.sync(`${distDirectory}/**/*`, fs)
  mkdirp.sync(path.join(cwd, distDirectory), { fs })

  compiler.apply(
    new webpack.ProgressPlugin({
      profile: false,
    })
  )

  compiler.apply(
    new RenderStaticPlugin({
      mapStatsToParams: ({ clientStats }) => ({
        clientStats,
        reactLoadableManifest: JSON.parse(
          fs.readFileSync(
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

  compiler.apply(new PrintStatsPlugin())
  return compiler
}
