const webpack = require("webpack")

const chalk = require("chalk")
const rimraf = require("rimraf")
const PrintStatsPlugin = require("./PrintStatsPlugin")
const getCompiler = require("./getCompiler")

async function onBuild(err) {
  if (err) {
    console.error(chalk.red("Error during build:"), err)
    return
  }
}

const compiler = getCompiler({ liveReload: false, mode: "production" })

compiler.apply(
  new webpack.ProgressPlugin({
    profile: false,
  })
)
compiler.apply(new PrintStatsPlugin())
rimraf("dist/*", () => {
  compiler.run(onBuild)
})
