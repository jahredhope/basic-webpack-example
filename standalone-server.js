const proxy = require("express-http-proxy");
const express = require("express");

const { serverRoutes, rendererUrl, ports } = require("./config");

const app = express();

app.disable("x-powered-by");

app.use("/static", express.static("./dist/browser"));
app.use("/api/reddit/", proxy("https://api.reddit.com/"));
app.use("/api", proxy("http://localhost:8081"));

app.use((req, res, next) => {
  if (req.url.substr(-1) !== "/") {
    console.log("REDIRECTING", req.url);
    res.redirect(301, req.url + "/");
  } else {
    next();
  }
});

serverRoutes.forEach(route => {
  app.use(
    route,
    proxy(rendererUrl, {
      proxyReqPathResolver: req => req.originalUrl,
    })
  );
});

app.use((req, res, next) => {
  req.url = req.url + "/index.html";
  next();
});
app.use(express.static("dist/html"));

app.listen(ports.devServer, () => {
  console.log("Proxy server started on", ports.devServer);
});
