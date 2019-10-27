import cookieParser from "cookie-parser";
import createDebug from "debug";
import exceptionFormatter from "exception-formatter";
import express from "express";
import expressPino from "express-pino-logger";
import pathToRegexp from "path-to-regexp";
import pino from "pino";
import uuidv4 from "uuid/v4";

import { onServerRender } from "src/page/PageB";
import render from "./render";
import { State } from "./store";

const debug = createDebug("app:server");

const RENDER_SERVER_PORT = 3001;
const clientStatsFile = "./loadable-stats.json";

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

let requestCounter = 0;
const pageBRegex = pathToRegexp("/b");

app.get("*", async (req, res) => {
  requestCounter++;
  const requestId = uuidv4();
  debug("render", req.url);

  let state: State = {
    environment: "development",
    items: {},
    lists: {},
    posts: {},
    requestCounter,
    requestId,
    user: null,
    username: req.cookies.username,
  };
  if (pageBRegex.exec(req.url)) {
    state = await onServerRender(state);
  }
  try {
    res.send(
      await render({
        clientStatsFile,
        route: req.url,
        state,
      }).catch(err => {
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
