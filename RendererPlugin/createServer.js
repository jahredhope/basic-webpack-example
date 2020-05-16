const path = require("path");
const cluster = require("cluster");
const debug = require("debug");

module.exports = function createMaster({ onReady }) {
  let currentWorker;

  cluster.setupMaster({
    exec: path.join(__dirname, "serverWorker.js"),
    silent: false,
  });

  const killIfNotDead = () => {
    if (
      currentWorker &&
      currentWorker.isConnected() &&
      !currentWorker.isDead()
    ) {
      currentWorker.kill();
      currentWorker = null;
    }
  };

  async function pushNewServer(params) {
    debug("render:server:master")("createWorker");
    killIfNotDead();
    debug("render:server:master")(cluster.workers);
    const worker = cluster.fork();

    worker.on("message", function (msg) {
      if (msg.error) {
        debug("render:server:master")("Error from worker:", msg.error);
        onReady(msg.error);
      } else if (msg && msg.status === "finished") {
        debug("render:server:master")("Worker finished");
        onReady();
      } else {
        debug("render:server:master")("Message from worker", msg);
      }
    });

    worker.on("exit", (code, signal) => {
      currentWorker = null;
      if (code) {
        console.error("Worker exited with:", { code, signal });
      }
    });

    worker.on("online", () => {
      debug("render:server:master")(`Worker Online. ID: ${worker.id}.`);
      currentWorker = worker;
      worker.send(params); //Send the code to run for the worker
    });
  }

  return { pushNewServer, onKillServer: killIfNotDead };
};