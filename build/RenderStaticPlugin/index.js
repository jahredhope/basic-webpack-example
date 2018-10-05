const renderHtml = require("./renderHtml")
const chalk = require("chalk")

const returnEmptyObject = () => ({})
module.exports = class RenderStaticPlugin {
  constructor(opts) {
    this.log = (...args) =>
      (opts.log || console.log)(chalk.blue("RenderStaticPlugin"), ...args)
    this.verbose = opts.verbose || false
    this.mapStatsToFilesToRead = opts.files || returnEmptyObject
    this.mapStatsToParams = opts.mapStatsToParams || returnEmptyObject
    this.renderDirectory = opts.renderDirectory
    this.fs = opts.fs || require("fs")
    this.onDone = this.onDone.bind(this)
  }
  async onDone(stats) {
    console.log({ stats: stats.toJson().children[0] })
    if (this.verbose) {
      this.log(`Recieved stats`)
    }
    const clientStats = stats.stats.find(
      stat => stat.compilation.name === "client"
    )
    if (!clientStats) {
      this.log(`Unable to find compilation with client`)
      throw new Error(`Unable to find compilation with client`)
    }
    const renderStats = stats.stats.find(
      stat => stat.compilation.name === "render"
    )
    if (!renderStats) {
      this.log(`Unable to find compilation with render`)
      throw new Error(`Unable to find compilation with render`)
    }
    try {
      await renderHtml({
        clientStats: clientStats.toJson(),
        renderStats: renderStats.toJson(),
        renderDirectory: this.renderDirectory,
        fs: this.fs,
        mapStatsToParams: this.mapStatsToParams,
        verbose: this.verbose,
        log: this.log,
      })
    } catch (error) {
      console.error("An error occured rendering HTML")
      console.error(error)
    }
  }
  apply(compiler) {
    const hookOptions = { name: "RenderStaticPlugin" }

    compiler.hooks.done.tap(hookOptions, this.onDone)
  }
}
