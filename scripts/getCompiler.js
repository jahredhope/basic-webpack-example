const webpack = require("webpack")
const getConfig = require("./webpack.config")

module.exports = function getCompiler(options) {
  const compiler = webpack(getConfig(options))

  // rendererPlugin.apply(compiler)

  return compiler
}
