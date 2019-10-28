const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const debug = require("debug");
const createServerRendererPlugin = require("./RendererPlugin/ServerRendererPlugin");
const createStaticRendererPlugin = require("./RendererPlugin/StaticRendererPlugin");
const proxy = require("express-http-proxy");
const bodyParser = require("body-parser");
const querystring = require("querystring");
const getConfig = require("./webpack.config");
const {
  staticRoutes,
  serverRoutes,
  rendererUrl,
  rendererHealthcheck,
} = require("./config");

const staticRegex = /^\/static/i;
const apiRegex = /^\/api/i;

const afterWebpackDevServer = app => {
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
};

const serverRendererPlugin = createServerRendererPlugin({
  useDevServer: true,
  healthCheckEndpoint: rendererHealthcheck,
  rendererUrl,
  routes: serverRoutes,
});
const staticRendererPlugin = createStaticRendererPlugin({
  useDevServer: true,
  routes: staticRoutes,
});
const compiler = webpack(
  getConfig({ serverRendererPlugin, staticRendererPlugin })
);

const webpackDevServer = new WebpackDevServer(compiler, {
  publicPath: "/static/",
  serveIndex: false,
  disableHostCheck: true,
  after: afterWebpackDevServer,
});

webpackDevServer.use(serverRendererPlugin.devServerRouter);
webpackDevServer.use(staticRendererPlugin.devServerRouter);

webpackDevServer.app.disable("x-powered-by");

webpackDevServer.listen(8080, error => {
  if (error) {
    console.error(error);
    throw error;
  }
  debug("app:start")("Done");
});
