const evalutateFromSource = require("./evalutateFromSource");

module.exports = function createRenderer({ fileName, source, extraModules }) {
  if (!fileName) {
    throw new Error("Missing filename");
  }
  if (!source) {
    throw new Error("Missing source");
  }
  return evalutateFromSource(fileName, source, extraModules);
};
