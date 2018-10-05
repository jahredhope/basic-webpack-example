const renderHtml = require("./renderHtml")

module.exports = class RenderStaticPlugin {
  constructor(opts) {
    this.assetsDirectory = opts.assetsDirectory
    this.renderDirectory = opts.renderDirectory
    this.fs = opts.fs || require("fs")
    this.onDone = this.onDone.bind(this)
  }
  async onDone(stats) {
    const statsLength = stats.stats.length
    if (statsLength !== 2) {
      console.warn(`Watch failed to send two stats. Only sent ${statsLength}`)
    }
    const clientStats = stats.stats.find(
      stat => stat.compilation.name === "client"
    )
    if (!clientStats) {
      throw new Error(`Unable to find compilation with client`)
    }
    const renderStats = stats.stats.find(
      stat => stat.compilation.name === "render"
    )
    if (!renderStats) {
      throw new Error(`Unable to find compilation with render`)
    }
    await renderHtml({
      clientStats: clientStats.toJson(),
      renderStats: renderStats.toJson(),
      assetsDirectory: this.assetsDirectory,
      renderDirectory: this.renderDirectory,
      fs: this.fs,
    })
  }
  apply(compiler) {
    const hookOptions = { name: "static-renderer" }

    compiler.hooks.done.tap(hookOptions, this.onDone)

    // Multi-compiler hooks
    // compiler.hooks.run.tap(hookOptions, () => hookLog("run"))
    // compiler.hooks.watchRun.tap(hookOptions, () => hookLog("watchRun"))
    // compiler.hooks.done.tap(hookOptions, () => hookLog("done"))
    // compiler.hooks.invalid.tap(hookOptions, () => hookLog("invalid"))
    // compiler.hooks.watchClose.tap(hookOptions, () => hookLog("watchClose"))
  }
}
