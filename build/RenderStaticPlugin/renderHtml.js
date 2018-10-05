const chalk = require("chalk")
const mkdirP = require("mkdirP")
const vm = require("vm")
require("regenerator-runtime/runtime")
const cwd = process.cwd()

const path = require("path")
module.exports = async function renderHtml({
  renderStats,
  clientStats,
  assetsDirectory,
  renderDirectory,
  fs,
}) {
  const contextifiedSandbox = vm.createContext({ global: {} })
  const renderFile = renderStats.assetsByChunkName.render
  console.log("Render file:", { renderFile })
  // if (fs.data) {
  // console.log({ fsData: fs.data.Users.jhope.code["basic-webpack"].dist })
  // }
  // throw new Error("bad")
  const reactLoadableManifest = JSON.parse(
    fs.readFileSync(path.resolve(cwd, "dist/react-loadable.json"), "utf8")
  )

  let renderResult
  let renderFunc

  try {
    console.log("Creating linker")
    async function linker(specifier, referencingModule) {
      console.log("linker", { specifier, referencingModule })
      if (specifier !== "foo") {
        const moduleCode = fs.readFileSync(specifier, "utf8")
        console.log({ moduleCode })
        return new vm.SourceTextModule(
          `
          const exports = {};
          const module = {exports: {}};
          ${moduleCode}
          export default module.exports;
          `,
          {
            context: referencingModule.context,
          }
        )

        // Using `contextifiedSandbox` instead of `referencingModule.context`
        // here would work as well.
      }
      throw new Error(`Unable to resolve dependency: ${specifier}`)
    }
    const absoluteRenderFilePath = path.join(assetsDirectory, renderFile)
    console.log("Absolute path", { absoluteRenderFilePath })
    // const moduleCode = fs.readFileSync(absoluteRenderFilePath, "utf8")

    // console.log("waiting for modify")
    // await new Promise(resolve => setTimeout(resolve, 10000))
    const bar = new vm.SourceTextModule(
      `
      import render from "${absoluteRenderFilePath}";
      render;
    `,
      {
        context: contextifiedSandbox,
      }
    )
    console.log("Created module", bar)
    await bar.link(linker)
    console.log("Linked module")
    bar.instantiate()
    console.log("instantiate module")
    const { result } = await bar.evaluate()
    console.log("returned resu", result)
    renderFunc = result
  } catch (error) {
    console.error("Error creating module", error)
    throw error
  }
  // const renderModule = require(path.join(assetsDirectory, renderFile))
  async function render(url) {
    console.log(chalk.blue("Starting render:"), { url })
    try {
      renderResult = await renderFunc({
        url,
        reactLoadableManifest,
        clientStats,
        renderStats,
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
