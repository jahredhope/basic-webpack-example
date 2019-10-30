const path = require("path");
const evaluate = require("eval");
const log = require("debug")("render:server:worker");

function getFromSourceModules(specifier, sourceModules) {
  const sourceModuleSpecifier = specifier.replace(/^\.\//, "");
  const source = sourceModules[sourceModuleSpecifier];
  return source;
}

function evalutateFromSource(specifier, sourceModules) {
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
      require: createLinker(specifier, sourceModules),
      console,
      process,
      Buffer,
    },
    /* includeGlobals: */ true
  );
}

function createLinker(parentModulePath, sourceModules) {
  log("Creating linker for", parentModulePath);
  return function linker(specifier) {
    const absPath = path.join(path.dirname(parentModulePath), specifier);
    if (!getFromSourceModules(specifier, sourceModules)) {
      return require(specifier);
    }
    return evalutateFromSource(absPath, sourceModules);
  };
}
