import webpack from "webpack";
import getConfig from "./webpack.config";

async function run() {
  const compiler = webpack(await getConfig({ buildType: "build" }));

  compiler.run((err, stats) => {
    if (err) {
      console.error("Building finished with err", err);
    }
    if (stats.hasErrors()) {
      console.error("Errors occurred during build");
      const info = stats.toJson();
      console.error(info.errors);
    }
  });
}

run();
