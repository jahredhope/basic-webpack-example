const path = require("path");
const evaluate = require("eval");
const log = require("debug")("render:evaluate");

function getFromSourceModules(specifier, sourceModules) {
  const sourceModuleSpecifier = specifier.replace(/^\.\//, "");
  return sourceModules[sourceModuleSpecifier];
}

function evalutateFromSource(specifier, sourceModules, extraModules) {
  log("Evaluating source for", specifier);
  let source;
  try {
    source = getFromSourceModules(specifier, sourceModules);
  } catch (error) {
    throw new Error(`Error reading "${specifier}". Error: ${error}`);
  }
  return evaluate(
    source,
    /* filename: */ specifier,
    /* scope: */ {
      require: createLinker(specifier, sourceModules, extraModules),
      console,
      process,
      Buffer,
    },
    /* includeGlobals: */ true
  );
}

function createLinker(parentModulePath, sourceModules, extraModules) {
  log("Creating linker for", parentModulePath);
  return function linker(specifier) {
    if (extraModules && extraModules[specifier]) {
      log(`Using custom module for ${specifier} from ${parentModulePath}`);
      return extraModules[specifier];
    }
    const absPath = path.join(path.dirname(parentModulePath), specifier);
    if (!getFromSourceModules(specifier, sourceModules)) {
      log(`Using external require for ${specifier} from ${parentModulePath}`);
      return require(specifier);
    }
    log(`Linking ${parentModulePath} to asset ${specifier}`);
    return evalutateFromSource(absPath, sourceModules);
  };
}

module.exports = evalutateFromSource;
