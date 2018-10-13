const renderHtml = require("./renderHtml")
const chalk = require("chalk")

const returnEmptyObject = () => ({})
module.exports = class RenderStaticPlugin {
  constructor(opts) {
    this.log = (...args) =>
      (opts.log || console.log)(chalk.blue("RenderStaticPlugin"), ...args)
    this.paths = opts.paths
    this.verbose = opts.verbose || false
    this.mapStatsToFilesToRead = opts.files || returnEmptyObject
    this.mapStatsToParams = opts.mapStatsToParams || returnEmptyObject
    this.renderDirectory = opts.renderDirectory
    this.fs = opts.fs || require("fs")
    this.onDone = this.onDone.bind(this)
  }
  async onDone(stats) {
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
        paths: this.paths,
        clientCompiler: this.clientCompiler,
        renderCompiler: this.renderCompiler,
        clientStats: clientStats.toJson(),
        renderStats: renderStats.toJson(),
        renderDirectory: this.renderDirectory,
        fs: this.fs,
        getCompiler: this.getCompiler,
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
    this.clientCompiler = compiler.compilers.find(
      childCompiler => childCompiler.name === "client"
    )
    if (!this.clientCompiler) {
      throw new Error(`Unable to find compilation with client`)
    }
    this.renderCompiler = compiler.compilers.find(
      childCompiler => childCompiler.name === "render"
    )
    if (!this.renderCompiler) {
      throw new Error(`Unable to find compilation with render`)
    }
    const hookOptions = { name: "RenderStaticPlugin" }

    compiler.hooks.done.tap(hookOptions, this.onDone)
  }
}
