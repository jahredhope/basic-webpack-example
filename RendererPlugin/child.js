const path = require("path");
const evaluate = require("eval");
const exceptionFormatter = require("exception-formatter");

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

function createRenderer({ fileName, sourceModules }) {
  if (!fileName) {
    throw new Error("Missing filename");
  }
  if (!sourceModules) {
    throw new Error("Missing sourceModules");
  }
  return evalutateFromSource(fileName, sourceModules);
}

process.on("message", function({ entry, sourceModules }) {
  log("Message recieved");
  if (!sourceModules[entry]) {
    throw new Error(
      `Unable to find entry "${entry}" in source modules. Valid options are ${Object.keys(
        sourceModules
      )
        .map(v => `"${v}"`)
        .join(", ")}.`
    );
  }
  let error;
  try {
    createRenderer({ fileName: entry, sourceModules });
  } catch (err) {
    log("Erroreed", err);
    error = err;
  }

  log("Finished");

  if (error) {
    process.send({
      status: "finished with error",
      error: exceptionFormatter(error || {}, {
        format: "html",
        inlineStyle: true,
        basepath: "webpack://static/./",
      }),
    }); // Send the finished message to the parent process
    throw error;
  } else {
    process.send({
      status: "finished",
    }); // Send the finished message to the parent process
  }
});
