const fs = require("fs")
const path = require("path")
const url = require("url")
const RawSource = require("webpack-sources/lib/RawSource")

function buildManifest(compiler, compilation) {
  const context = compiler.options.context
  const manifest = {}

  compilation.chunks.forEach(chunk => {
    chunk.files.forEach(file => {
      chunk.forEachModule(module => {
        const id = module.id
        const name =
          typeof module.libIdent === "function"
            ? module.libIdent({ context })
            : null
        const publicPath = url.resolve(
          compilation.outputOptions.publicPath || "",
          file
        )

        let currentModule = module
        if (module.constructor.name === "ConcatenatedModule") {
          currentModule = module.rootModule
        }
        console.log("buildManifest", { a: { b: { currentModule } } })
        if (!manifest[currentModule.rawRequest]) {
          manifest[currentModule.rawRequest] = []
        }

        manifest[currentModule.rawRequest].push({ id, name, file, publicPath })
      })
    })
  })

  return manifest
}

class ReactLoadablePlugin {
  constructor(opts = {}) {
    this.writeToDisk = opts.writeToDisk === true
    this.emitAssets = opts.emitAssets !== false
    this.filename = opts.filename
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      const manifest = buildManifest(compiler, compilation)
      const json = JSON.stringify(manifest, null, 2)

      if (this.writeToDisk) {
        const outputDirectory = path.dirname(this.filename)
        try {
          fs.mkdirSync(outputDirectory)
        } catch (err) {
          if (err.code !== "EEXIST") {
            throw err
          }
        }
        fs.writeFileSync(this.filename, json)
      }

      if (this.emitAssets) {
        compilation.assets[this.filename] = new RawSource(json)
      }

      callback()
    })
  }
}

function getBundles(manifest, moduleIds) {
  console.log("getBundles", { moduleIds })
  return moduleIds.reduce(
    (bundles, moduleId) => bundles.concat(manifest[moduleId]),
    []
  )
}

exports.ReactLoadablePlugin = ReactLoadablePlugin
exports.getBundles = getBundles
