const webpack = require("webpack")

const chalk = require("chalk")
const PrintStatsPlugin = require("./PrintStatsPlugin")
const getCompiler = require("./getCompiler")

async function onBuild(err) {
  if (err) {
    console.error(chalk.red("Error during build:"), err)
    return
  }
}

const compiler = getCompiler({ liveReload: false })

compiler.apply(
  new webpack.ProgressPlugin({
    profile: false,
  })
)
compiler.apply(new PrintStatsPlugin())
const runType = "run"
if (runType === "watch") {
  compiler.watch({}, onBuild)
} else if (runType === "run") {
  compiler.run(onBuild)
}
