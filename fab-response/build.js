module.exports.build = (args, proto_fab) => {
  const webpackStats = require("../dist/node/loadable-stats.json");
  proto_fab.metadata.webpackStats = webpackStats;
};
