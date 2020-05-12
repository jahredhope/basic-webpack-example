/* eslint-disable @typescript-eslint/camelcase */
// import render from "./cloud/render";
import render from "./render";
import { State } from "./store";
import mime from "mime/lite";

import webpackStats from "./loadable-stats.json";

let requestCounter = 0;

async function handleRequest(request: Request) {
  const url = new URL(request.url);
  if (url.pathname.match(/^\/static\//)) {
    const key = url.pathname.replace("/static/", "static/");
    const contentType = mime.getType(key);
    console.log("Proxy to", key, contentType);

    // @ts-ignore: Known undeclared global
    const value = await BASIC_WEBPACK.get(key, "stream");

    if (value === null) {
      return new Response("404 - Asset not found", { status: 404 });
    }
    return new Response(value, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  }
  if (url.pathname.match(/^\/api\//)) {
    let match = url.pathname.match(/^\/api\/reddit\/(.*)/);
    if (match) {
      const redditUrl = `https://api.reddit.com/${match[1]}`;
      return fetch(redditUrl, {
        headers: { "user-agent": request.headers.get("user-agent") },
      });
    }
    match = url.pathname.match(/^\/api\/countries/);
    if (match) {
      return fetch("https://countries.trevorblades.com/", {
        method: request.method,
        headers: { "Content-Type": "application/json" },
        body: request.body,
      });
    }
    return new Response(`No API for ${url.pathname}`, { status: 404 });
  }
  if (url.pathname.match(/^\/events\//)) {
    return new Response("", { status: 204 });
  }
  if (url.pathname.match(/\/b\//i)) {
    console.log("Rendering for ", url.pathname);

    const state: State = {
      environment: "development",
      initialRoute: url.pathname,
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
        //   content = await render().catch((err) => {
        console.error("Caught an error when rendering. Error:", err);
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
  const key = `document/${url.pathname
    .replace(/\/?$/, "/index.html")
    .replace(/^\/?/, "")}`;
  const contentType = mime.getType(key);
  console.log("Proxy to", key, contentType);

  // @ts-ignore: Known undeclared global
  const value = await BASIC_WEBPACK.get(key, "stream");

  if (value === null) {
    return new Response(
      `404 - Document not found. Key: ${key}. Path: ${url.pathname}.`,
      { status: 404 }
    );
  }
  return new Response(value, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=60, immutable",
    },
  });
}

addEventListener("fetch", (event: any) => {
  const request = event.request;
  // const url = new URL(request.url);
  // if (url.protocol === "https:") {
  const promise = handleRequest(request);
  event.respondWith(promise);
  // } else {
  //   url.protocol = "https:";
  //   event.respondWith(
  //     new Response("Redirecting to https", {
  //       status: 301,
  //       headers: {
  //         location: url.href,
  //       },
  //     })
  //   );
  // }
});
