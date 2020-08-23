import webpack, { Configuration } from "webpack";
import getConfig from "./webpack.config";

const isBrowserCompiler = (c: Configuration) =>
  ["client", "service-worker"].includes(c.name);

async function run() {
  const { configs } = await getConfig({ buildType: "build" });
  const clientsBuild = webpack(
    configs.filter((c: Configuration) => isBrowserCompiler(c))
  );
  const renderBuilds = webpack(
    configs.filter((c: any) => !isBrowserCompiler(c))
  );

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
