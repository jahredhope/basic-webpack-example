import cookieParser from "cookie-parser";
import createDebug from "debug";
import exceptionFormatter from "exception-formatter";
import express from "express";
import expressPino from "express-pino-logger";
// import { pathToRegexp } from "path-to-regexp";
import pino from "pino";
import { v4 as uuidv4 } from "uuid";

// import { onServerRender } from "src/page/PageB";
import render from "./render";
import { State } from "./store";

const debug = createDebug("app:server");

const RENDER_SERVER_PORT = 3001;
const clientStatsFile = "./client-stats.json";
const workerStatsFile = "./worker-stats.json";

const LOG_TO_CONSOLE = false;

const app = express();
app.use(cookieParser());
if (LOG_TO_CONSOLE) {
  app.use(expressPino({ logger: pino({ prettyPrint: true, level: "info" }) }));
}
app.disable("x-powered-by");

app.get("/healthcheck", (req, res) => {
  debug("healthcheck", req.url);
  res.status(200).send("Healthy");
});

app.get("/ping", (req, res) => {
  debug("ping", req.url);
  res.status(200).send("pong");
});

let renderFunction = render;
let requestCounter = 0;
// const pageBRegex = pathToRegexp("/b");

app.get("*", async (req, res) => {
  requestCounter++;
  const requestId = uuidv4();
  debug("render", req.url);

  const visitorId = req.cookies["visitor-id"] || uuidv4();
  res.cookie("visitor-id", visitorId, {
    maxAge: 3.154e7,
  });

  const state: State = {
    environment: "development",
    initialRoute: req.url,
    lists: {},
    posts: {},
    requestCounter,
    requestId,
    visitorId,
  };
  // if (pageBRegex.exec(req.url)) {
  //   state = await onServerRender(state);
  // }
  try {
    res.send(
      await renderFunction({
        // HACK: Access file at server runtime
        webpackStats: eval("require")(clientStatsFile),
        route: req.url,
        state,
      }).catch((err) => {
        console.error("Caught an error");
        throw err;
      })
    );
  } catch (err) {
    res
      .status(500)
      .send(
        exceptionFormatter(err || {}, { format: "html", inlineStyle: true })
      );
  }
});

app.listen(RENDER_SERVER_PORT, () => {
  console.log("Listening on", RENDER_SERVER_PORT);
});

console.log("server.tsx");
if (module.hot) {
  console.log("server.tsx", "Module is HOT");
  module.hot.accept("./render", () => {
    console.log("Accepting ./render");
    renderFunction = render;
  });
} else {
  console.log("server.tsx", "Module is COLD");
}
