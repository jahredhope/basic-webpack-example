const path = require("path")
const chalk = require("chalk")
const mkdirP = require("mkdirP")
const createRenderer = require("./createRenderer")

module.exports = async function renderHtml({
  renderStats,
  clientStats,
  renderDirectory,
  mapStatsToParams,
  fs,
  verbose,
  log,
}) {
  const renderFile = renderStats.assetsByChunkName.render
  if (verbose) {
    log("Render file:", { renderFile })
  }

  const renderFunc = createRenderer({
    fs,
    fileName: path.join(renderStats.outputPath, renderFile),
  })
  if (typeof renderFunc !== "function") {
    throw new Error(
      `Unable to find render function. File ${renderFile}. Recieved ${typeof renderFunc}.`
    )
  }
  if (verbose) {
    log(`Renderer craeted`)
  }

  async function render(url) {
    if (verbose) {
      log(`Starting render`, { url })
    }
    let renderResult
    try {
      renderResult = await renderFunc({
        url,
        ...mapStatsToParams({
          clientStats,
          renderStats,
        }),
      })
    } catch (error) {
      console.error(
        `🚨 ${chalk.red("An error occured rending:")} ${chalk.blue(
          renderFile
        )}. See below error.`
      )
      console.error(error)
      fs.writeFileSync(
        path.join(renderDirectory, "index.html"),
        error.toString()
      )
      return
    }

    if (typeof renderResult !== "string") {
      throw new Error(
        `Render must return a string. Recieved ${typeof renderResult}.`
      )
    }
    const newFilePath = path.join(renderDirectory, url, "index.html")
    const newFileDir = path.dirname(newFilePath)

    if (!fs.existsSync(newFileDir)) {
      mkdirP.sync(newFileDir, { fs })
    }
    fs.writeFileSync(newFilePath, renderResult)
  }
  const paths = ["", "b", "a", "about", "home", "contact/us"]
  paths.forEach(render)
}
