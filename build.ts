import webpack, { Compiler } from "webpack";
import getConfig from "./webpack.config";

const isBrowserCompiler = (c: Compiler) =>
  ["client", "service-worker"].includes(c.name);

async function run() {
  const configs = await getConfig({ buildType: "build" });
  const clientsBuild = webpack(configs.filter((c) => isBrowserCompiler(c)));
  const renderBuilds = webpack(configs.filter((c) => !isBrowserCompiler(c)));

  clientsBuild.run(async (err, stats) => {
    if (err) {
      console.error("Client: Building finished with err", err);
    }
    if (stats.hasErrors()) {
      console.error("Errors occurred during build");
      const info = stats.toJson();
      console.error(info.errors);
    }
    renderBuilds.run((err, stats) => {
      if (err) {
        console.error("Non-Clients: Building finished with err", err);
      }
      if (stats.hasErrors()) {
        console.error("Errors occurred during build");
        const info = stats.toJson();
        console.error(info.errors);
      }
    });
  });
}

run();
