import { uuid as uuidv4 } from "@cfworker/uuid";
import mime from "mime/lite";
// import { Stats } from "webpack";
import webpackStats from "../dist/node/client-stats.json";
import render from "./render";
import { State } from "./store";

declare const VERSION: string;
declare const BASIC_WEBPACK: KVNamespace;

// declare const WEBPACK_STATS: Stats.ToJsonOutput;
// const webpackStats = WEBPACK_STATS;

if (!webpackStats) {
  console.error("Recieved Webpack Stats of", { webpackStats });
  throw new Error("Missing webpackStats");
}

let requestCounter = 0;

function getCookie(request: Request, name: string) {
  let result: string | null = null;
  const cookieString = request.headers.get("Cookie");
  if (cookieString) {
    const cookies = cookieString.split(";");
    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      if (cookieName === name) {
        const cookieVal = cookie.split("=")[1];
        result = cookieVal;
      }
    });
  }
  return result;
}

async function handleStatic(url: URL) {
  console.log("handleStatic", url);
  const key = url.pathname.replace("/static/", "static/");
  const contentType = mime.getType(key);
  console.log("Proxy to", key, contentType);

  const value = await BASIC_WEBPACK.get(key, "stream");

  if (value === null) {
    return new Response("404 - Asset not found", { status: 404 });
  }
  return new Response(value, {
    headers: {
      "Service-Worker-Allowed": "/",
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}

function handleApi(url: URL, request: Request) {
  console.log("handleApi", url);
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

async function handleServerRender(url: URL, request: Request) {
  console.log("handleServerRender", url);
  console.log("Rendering for ", url.pathname);

  const visitorId = getCookie(request, "visitor-id") || uuidv4();

  const state: State = {
    environment: "development",
    initialRoute: url.pathname,
    lists: {},
    posts: {},
    version: VERSION,
    visitorId,
    requestCounter: ++requestCounter,
    requestId: Math.floor(Math.random() * 1000000).toString(10),
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
      headers: {
        "Set-Cookie": `visitor-id=${visitorId}; path=/`,
        "content-type": "text/html; charset=UTF-8",
      },
    });
  }
}
async function handleDocument(url: URL, requestedVersion: string) {
  console.log("handleDocument", url);
  const version = requestedVersion || VERSION;
  const key = `document/${version}/${url.pathname
    .replace(/\/?$/, "/index.html")
    .replace(/^\/?/, "")}`;
  const contentType = mime.getType(key);
  console.log("Proxy to", key, contentType);

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

async function handleRequest(request: Request) {
  const url = new URL(request.url);
  if (url.pathname.match(/^\/static\//)) {
    return handleStatic(url);
  }
  if (url.pathname.match(/^\/api\//)) {
    return handleApi(url, request);
  }
  if (url.pathname.match(/^\/events\//)) {
    return new Response(null, { status: 204 });
  }

  const requestedVersion = url.searchParams.get("version");
  // Unable to use server-rendering on custom versions
  if (!requestedVersion && url.pathname.match(/\/b\//i)) {
    return handleServerRender(url, request);
  }
  return handleDocument(url, requestedVersion);
}

addEventListener("fetch", (event: any) => {
  const request = event.request;
  const promise = handleRequest(request).catch((error) => {
    console.error("An error occurred handling request", error);
    throw error;
  });
  event.respondWith(promise);
});
