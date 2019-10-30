const exceptionFormatter = require("exception-formatter");

const evalutateFromSource = require("./evalutateFromSource");

const log = require("debug")("render:server:worker");

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
