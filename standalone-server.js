const proxy = require("express-http-proxy");
const express = require("express");
const bodyParser = require("body-parser");
const querystring = require("querystring");

const { serverRoutes, rendererUrl, ports } = require("./config");

const app = express();

app.disable("x-powered-by");

app.use("/static", express.static("./dist/browser"));
app.use("/api/reddit/", proxy("https://api.reddit.com/"));
app.use("/api/countries/", proxy("https://countries.trevorblades.com/"));
app.use("/api", proxy("http://localhost:8081"));
app.use("/events/", bodyParser.text());
app.post("/events/", (req, res) => {
  console.log("/events/", { ...querystring.parse(req.body) });
  res.sendStatus(204);
});

app.use((req, res, next) => {
  if (req.url.substr(-1) !== "/") {
    console.log("REDIRECTING", req.url);
    res.redirect(301, req.url + "/");
  } else {
    next();
  }
});

serverRoutes.forEach((route) => {
  app.use(
    route,
    proxy(rendererUrl, {
      proxyReqPathResolver: (req) => req.originalUrl,
    })
  );
});

app.use((req, res, next) => {
  req.url = req.url + "/index.html";
  next();
});
app.use(express.static("dist/document"));

app.listen(ports.devServer, () => {
  console.log("Proxy server started on", ports.devServer);
});
