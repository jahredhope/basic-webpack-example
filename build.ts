import webpack from "webpack";
import getConfig from "./webpack.config";

async function run() {
  const configs = await getConfig({ buildType: "build" });
  const clientCompiler = webpack(configs.find((c) => c.name === "client"));
  const renderCompilers = webpack(configs.filter((c) => c.name !== "client"));

  clientCompiler.run((err, stats) => {
    if (err) {
      console.error("Client: Building finished with err", err);
    }
    if (stats.hasErrors()) {
      console.error("Errors occurred during build");
      const info = stats.toJson();
      console.error(info.errors);
    }
    renderCompilers.run((err, stats) => {
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
