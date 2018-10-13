const path = require("path")
const evaluate = require("eval")

module.exports = function createRenderer({ fileName, outputFileSystem }) {
  function evalutateFromSource(specifier) {
    let source
    try {
      source = outputFileSystem.readFileSync(specifier, "utf8")
    } catch (error) {
      throw new Error(`Error reading ${specifier}. Error: ${error}`)
    }
    return evaluate(
      source,
      /* filename: */ specifier,
      /* scope: */ { require: createLinker(specifier), console },
      /* includeGlobals: */ true
    )
  }

  function existsSync(path) {
    try {
      outputFileSystem.readFileSync(path)
    } catch (error) {
      return false
    }
    return true
  }

  function createLinker(parentModulePath) {
    return function linker(specifier) {
      const absPath = path.join(path.dirname(parentModulePath), specifier)
      if (!existsSync(absPath)) {
        return require(specifier)
      }
      return evalutateFromSource(absPath)
    }
  }
  const entryFilePath = path.join(fileName)
  return evalutateFromSource(entryFilePath)
}
