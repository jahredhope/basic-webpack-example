const printWebpackStats = require("./printWebpackStats")

module.exports = class PrintStatsPlugin {
  constructor() {}
  apply(compiler) {
    const hookOptions = { name: "PrintStatsPlugin" }

    compiler.hooks.done.tap(hookOptions, stats => printWebpackStats(stats))
  }
}
