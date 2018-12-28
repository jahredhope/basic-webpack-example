// const webpack = require("webpack")
const printStats = require("./PrintStatsPlugin/printWebpackStats")

const chalk = require("chalk")
const rimraf = require("rimraf")
// const PrintStatsPlugin = require("./PrintStatsPlugin")
const getCompiler = require("./getCompiler")

async function onBuild(err, res) {
  if (err) {
    console.error(chalk.red("Error during build:"), err)
    return
  }
  console.log({ res })
  printStats(res)
}

const compiler = getCompiler({ liveReload: false, mode: "production" })

// compiler.apply(
//   new webpack.ProgressPlugin({
//     profile: false,
//   })
// )
// compiler.apply(new PrintStatsPlugin())
rimraf("dist/*", () => {
  compiler.run(onBuild)
})
