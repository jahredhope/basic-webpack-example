/* eslint-disable @typescript-eslint/camelcase */
// import cookieParser from "cookie-parser";
import createDebug from "debug";
// import exceptionFormatter from "exception-formatter";
// import express from "express";
// import expressPino from "express-pino-logger";
import { pathToRegexp } from "path-to-regexp";
import pino from "pino";
import { v4 as uuidv4 } from "uuid";

import { onServerRender } from "src/page/PageB";
import render from "./render";
import { State } from "./store";
import { match } from "path-to-regexp";
const debug = createDebug("app:server");

const healthCheckMatch = match("/healthcheck");
const pingMatch = match("/ping");

// const clientStatsFile = "./loadable-stats.json";
// const LOG_TO_CONSOLE = false;

let requestCounter = 0;

export const runtime = (args, metadata) => {
  debug({ args, metadata });
  return async ({ request, settings, url }) => {
    const webpackStats = metadata.webpackStats;
    debug({ request, settings, url });

    if (healthCheckMatch(url.pathname)) {
      debug("healthcheck", url);
      return new Response("Healthy", { status: 200 });
    }
    if (pingMatch(url.pathname)) {
      debug("ping", url);
      return new Response("pong", { status: 200 });
    }

    if (pingMatch(url.pathname)) {
      debug("ping", url);
      return new Response("pong", { status: 200 });
    }
    console.log("Checking for ", url.pathname);
    if (match("/b/")(url.pathname)) {
      console.log("Rendering for ", url.pathname);
      const state: State = {
        environment: "development",
        items: {},
        lists: {},
        posts: {},
        requestCounter: ++requestCounter,
        requestId: Math.floor(Math.random() * 1000000).toString(10),
        user: null,
        username: "my-username",
      };

      let content;

      try {
        content = await render({
          webpackStats,
          route: url.pathname,
          state,
        }).catch((err) => {
          console.error("Caught an error");
          throw err;
        });
      } catch (error) {
        console.error("Error occurred rendering", error);
      }

      if (content) {
        console.log("Content for ", url.pathname);
        return new Response(content, {
          status: 200,
          headers: { "content-type": "text/html; charset=UTF-8" },
        });
      }
    }

    // NOT IMPLEMENTED

    // const content = await render({ webpackStats });
    // console.log("Content", content);

    // requestCounter++;
    // const requestId = uuidv4();
    // debug("render", req.url);
    // const state: State = {
    //   environment: "development",
    //   items: {},
    //   lists: {},
    //   posts: {},
    //   requestCounter,
    //   requestId,
    //   user: null,
    //   username: req.cookies.username,
    // };
    // // if (pageBRegex.exec(req.url)) {
    // //   state = await onServerRender(state);
    // // }
    // try {
    //   return new Response(
    //     await render({
    //       clientStatsFile,
    //       route: req.url,
    //       state,
    //     }).catch((err) => {
    //       console.error("Caught an error");
    //       throw err;
    //     }),
    //     { status: 200 }
    //   );
    // } catch (err) {
    //   return new Response(
    //     exceptionFormatter(err || {}, { format: "html", inlineStyle: true }),
    //     { status: 500 }
    //   );
    // }
  };
};
