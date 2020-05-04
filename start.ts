import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import debug from "debug";
import createServerRendererPlugin from "./RendererPlugin/ServerRendererPlugin";
// import createStaticRendererPlugin from "./RendererPlugin/StaticRendererPlugin"
import HtmlRenderPlugin from "html-render-webpack-plugin";
import proxy from "express-http-proxy";
import bodyParser from "body-parser";
import querystring from "querystring";
import getConfig from "./webpack.config";
// import Buffer from "buffer";
import {
  staticRoutes,
  serverRoutes,
  rendererUrl,
  rendererHealthcheck,
} from "./config";

const staticRegex = /^\/static/i;
const apiRegex = /^\/api/i;

const serverRendererPlugin = createServerRendererPlugin({
  healthCheckEndpoint: rendererHealthcheck,
  rendererUrl,
  routes: serverRoutes,
  useDevServer: true,
});
const htmlRenderPlugin = new HtmlRenderPlugin({
  renderEntry: "render",
  routes: staticRoutes,
  skipAssets: true,
  extraGlobals: { Buffer },
});

const afterWebpackDevServer = (app) => {
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
};

const compiler = webpack(getConfig({ serverRendererPlugin, htmlRenderPlugin }));

const webpackDevServer = new WebpackDevServer(compiler, {
  before: (app) => {
    app.disable("x-powered-by");
  },
  after: afterWebpackDevServer,
  disableHostCheck: true,
  hot: true,
  writeToDisk: true,
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
