const debug = require("debug");
const proxy = require("express-http-proxy");
const bodyParser = require("body-parser");
const querystring = require("querystring");
const configs = require("./webpack.config");
const {
  staticRoutes,
  serverRoutes,
  rendererUrl,
  rendererHealthcheck,
} = require("./config");
const startDevServer = require("./build-scripts/start");

const staticRegex = /^\/static/i;
const apiRegex = /^\/api/i;

const onStartup = app => {
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

startDevServer({
  routeNotFound: "/error/404",
  onStartup,
  staticRoutes,
  serverRoutes,
  rendererUrl,
  rendererHealthcheck,
  configs,
});
