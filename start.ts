import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import debug from "debug";
import proxy from "express-http-proxy";
import bodyParser from "body-parser";
import querystring from "querystring";
import getConfig from "./webpack.config";
// import Buffer from "buffer";

const staticRegex = /^\/static/i;
const apiRegex = /^\/api/i;

process.env.VERSION = "dev";

async function run() {
  const {
    configs: webpackConfigs,
    serverRendererPlugin,
    htmlRenderPlugin,
  } = await getConfig({ buildType: "start" });
  const compiler = webpack(
    webpackConfigs.filter((c: any) => c.name !== "cloudflare")
  );

  new webpack.ProgressPlugin().apply((compiler as any) as webpack.Compiler);

  const webpackDevServer = new WebpackDevServer(compiler, {
    headers: {
      "Service-Worker-Allowed": "/",
    },
    before: (app) => {
      app.disable("x-powered-by");
    },
    after: (app) => {
      app.use("/api/reddit/", proxy("https://api.reddit.com/"));
      app.use("/api/countries/", proxy("https://countries.trevorblades.com/"));
      app.use("/events/", bodyParser.text());
      app.post("/events/", (req, res) => {
        console.log("/events/", { ...querystring.parse(req.body) });
        res.sendStatus(204);
      });

      app.use((req, res, next) => {
        const url = new URL(req.url, req.protocol + "://" + req.get("host"));
        if (
          url.pathname.substr(-1) !== "/" &&
          !url.pathname.match(staticRegex) &&
          !url.pathname.match(apiRegex)
        ) {
          debug("app:start:response")("REDIRECTING", req.url);
          url.pathname += "/";
          res.redirect(301, url.href);
        } else {
          next();
        }
      });

      app.use(serverRendererPlugin.devServerRouter);
      app.use(htmlRenderPlugin.createDevRouter());
    },
    disableHostCheck: true,
    hot: true,
    publicPath: "/static/",
    serveIndex: false,
  });

  webpackDevServer.listen(8080, (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
    debug("app:start")("Done");
  });
}

run();
