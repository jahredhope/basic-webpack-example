const path = require("path")
const evaluate = require("eval")

module.exports = function createRenderer({ fileName, fs }) {
  function evalutateFromSource(specifier) {
    const source = fs.readFileSync(specifier, "utf8")
    return evaluate(
      source,
      /* filename: */ specifier,
      /* scope: */ { require: createLinker(specifier), console },
      /* includeGlobals: */ true
    )
  }

  function createLinker(parentModulePath) {
    return function linker(specifier) {
      const absPath = path.join(path.dirname(parentModulePath), specifier)
      if (!fs.existsSync(absPath)) {
        return require(specifier)
      }
      return evalutateFromSource(absPath)
    }
  }
  const entryFilePath = path.join(fileName)
  return evalutateFromSource(entryFilePath)
}
