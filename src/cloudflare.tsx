/* eslint-disable @typescript-eslint/camelcase */
// import render from "./cloud/render";
import render from "./render";
import { State } from "./store";
import mime from "mime/lite";

// const webpackStatsFromCopy = {};
// @ts-ignore
const webpackStats = {
  errors: [],
  warnings: [],
  version: "4.43.0",
  hash: "ee73bf7ecd6ecdc82144",
  publicPath: "/static/",
  outputPath: "/Users/jhope/code/basic-webpack/dist/browser",
  assetsByChunkName: {
    modules: [
      "modules-ee73bf7ecd6ecdc82144.js",
      "modules-ee73bf7ecd6ecdc82144.js.map",
    ],
    apollo: [
      "apollo-ee73bf7ecd6ecdc82144.js",
      "apollo-ee73bf7ecd6ecdc82144.js.map",
    ],
    main: ["main-ee73bf7ecd6ecdc82144.js", "main-ee73bf7ecd6ecdc82144.js.map"],
    "page-PageA": [
      "page-PageA-ee73bf7ecd6ecdc82144.js",
      "page-PageA-ee73bf7ecd6ecdc82144.js.map",
    ],
    "page-PageB": [
      "page-PageB-ee73bf7ecd6ecdc82144.js",
      "page-PageB-ee73bf7ecd6ecdc82144.js.map",
    ],
    "page-PageC": [
      "page-PageC-ee73bf7ecd6ecdc82144.js",
      "page-PageC-ee73bf7ecd6ecdc82144.js.map",
    ],
    react: [
      "react-ee73bf7ecd6ecdc82144.js",
      "react-ee73bf7ecd6ecdc82144.js.map",
    ],
    runtime: [
      "runtime-ee73bf7ecd6ecdc82144.js",
      "runtime-ee73bf7ecd6ecdc82144.js.map",
    ],
  },
  assets: [
    {
      name: "09a1a1112c577c2794359715edfcb5ac.png",
      size: 78117,
      chunks: [],
      chunkNames: [],
      info: {},
      emitted: false,
    },
    {
      name: "6a9fc10215ff67576aac7a50a320a19e.png",
      size: 2423,
      chunks: [],
      chunkNames: [],
      info: {},
      emitted: false,
    },
    {
      name: "8fe41361dff57e3f6c2ea48c69731f0a.png",
      size: 18488,
      chunks: [],
      chunkNames: [],
      info: {},
      emitted: false,
    },
    {
      name: "apollo-ee73bf7ecd6ecdc82144.js",
      size: 133369,
      chunks: [1],
      chunkNames: ["apollo"],
      info: {
        immutable: true,
      },
      emitted: false,
    },
    {
      name: "apollo-ee73bf7ecd6ecdc82144.js.map",
      size: 186280,
      chunks: [1],
      chunkNames: ["apollo"],
      info: {
        development: true,
      },
      emitted: false,
    },
    {
      name: "ce9f4e02c1faf3dd7bac4cd53f5bfc36.png",
      size: 117020,
      chunks: [],
      chunkNames: [],
      info: {},
      emitted: false,
    },
    {
      name: "e7c5171d414020397499aab81029f8ce.png",
      size: 423805,
      chunks: [],
      chunkNames: [],
      info: {},
      emitted: false,
    },
    {
      name: "f3c24928a22036e4eb2de967f1baf227.png",
      size: 14594,
      chunks: [],
      chunkNames: [],
      info: {},
      emitted: false,
    },
    {
      name: "main-ee73bf7ecd6ecdc82144.js",
      size: 110024,
      chunks: [2],
      chunkNames: ["main"],
      info: {
        immutable: true,
      },
      emitted: false,
    },
    {
      name: "main-ee73bf7ecd6ecdc82144.js.map",
      size: 154885,
      chunks: [2],
      chunkNames: ["main"],
      info: {
        development: true,
      },
      emitted: false,
    },
    {
      name: "modules-ee73bf7ecd6ecdc82144.js",
      size: 122489,
      chunks: [0],
      chunkNames: ["modules"],
      info: {
        immutable: true,
      },
      emitted: false,
    },
    {
      name: "modules-ee73bf7ecd6ecdc82144.js.map",
      size: 175342,
      chunks: [0],
      chunkNames: ["modules"],
      info: {
        development: true,
      },
      emitted: false,
    },
    {
      name: "page-PageA-ee73bf7ecd6ecdc82144.js",
      size: 5316,
      chunks: [3],
      chunkNames: ["page-PageA"],
      info: {
        immutable: true,
      },
      emitted: false,
    },
    {
      name: "page-PageA-ee73bf7ecd6ecdc82144.js.map",
      size: 4142,
      chunks: [3],
      chunkNames: ["page-PageA"],
      info: {
        development: true,
      },
      emitted: false,
    },
    {
      name: "page-PageB-ee73bf7ecd6ecdc82144.js",
      size: 3303,
      chunks: [4],
      chunkNames: ["page-PageB"],
      info: {
        immutable: true,
      },
      emitted: false,
    },
    {
      name: "page-PageB-ee73bf7ecd6ecdc82144.js.map",
      size: 5108,
      chunks: [4],
      chunkNames: ["page-PageB"],
      info: {
        development: true,
      },
      emitted: false,
    },
    {
      name: "page-PageC-ee73bf7ecd6ecdc82144.js",
      size: 1666,
      chunks: [5],
      chunkNames: ["page-PageC"],
      info: {
        immutable: true,
      },
      emitted: false,
    },
    {
      name: "page-PageC-ee73bf7ecd6ecdc82144.js.map",
      size: 3294,
      chunks: [5],
      chunkNames: ["page-PageC"],
      info: {
        development: true,
      },
      emitted: false,
    },
    {
      name: "react-ee73bf7ecd6ecdc82144.js",
      size: 123799,
      chunks: [6],
      chunkNames: ["react"],
      info: {
        immutable: true,
      },
      emitted: false,
    },
    {
      name: "react-ee73bf7ecd6ecdc82144.js.map",
      size: 168040,
      chunks: [6],
      chunkNames: ["react"],
      info: {
        development: true,
      },
      emitted: false,
    },
    {
      name: "runtime-ee73bf7ecd6ecdc82144.js",
      size: 2425,
      chunks: [7],
      chunkNames: ["runtime"],
      info: {
        immutable: true,
      },
      emitted: false,
    },
    {
      name: "runtime-ee73bf7ecd6ecdc82144.js.map",
      size: 12582,
      chunks: [7],
      chunkNames: ["runtime"],
      info: {
        development: true,
      },
      emitted: false,
    },
  ],
  filteredAssets: 0,
  entrypoints: {
    main: {
      chunks: [7, 1, 6, 2],
      assets: [
        "runtime-ee73bf7ecd6ecdc82144.js",
        "runtime-ee73bf7ecd6ecdc82144.js.map",
        "apollo-ee73bf7ecd6ecdc82144.js",
        "apollo-ee73bf7ecd6ecdc82144.js.map",
        "react-ee73bf7ecd6ecdc82144.js",
        "react-ee73bf7ecd6ecdc82144.js.map",
        "main-ee73bf7ecd6ecdc82144.js",
        "main-ee73bf7ecd6ecdc82144.js.map",
      ],
      children: {},
      childAssets: {},
    },
  },
  namedChunkGroups: {
    main: {
      chunks: [7, 1, 6, 2],
      assets: [
        "runtime-ee73bf7ecd6ecdc82144.js",
        "runtime-ee73bf7ecd6ecdc82144.js.map",
        "apollo-ee73bf7ecd6ecdc82144.js",
        "apollo-ee73bf7ecd6ecdc82144.js.map",
        "react-ee73bf7ecd6ecdc82144.js",
        "react-ee73bf7ecd6ecdc82144.js.map",
        "main-ee73bf7ecd6ecdc82144.js",
        "main-ee73bf7ecd6ecdc82144.js.map",
      ],
      children: {},
      childAssets: {},
    },
    "page-PageA": {
      chunks: [0, 3],
      assets: [
        "modules-ee73bf7ecd6ecdc82144.js",
        "modules-ee73bf7ecd6ecdc82144.js.map",
        "page-PageA-ee73bf7ecd6ecdc82144.js",
        "page-PageA-ee73bf7ecd6ecdc82144.js.map",
      ],
      children: {},
      childAssets: {},
    },
    "page-PageB": {
      chunks: [1, 0, 4],
      assets: [
        "apollo-ee73bf7ecd6ecdc82144.js",
        "apollo-ee73bf7ecd6ecdc82144.js.map",
        "modules-ee73bf7ecd6ecdc82144.js",
        "modules-ee73bf7ecd6ecdc82144.js.map",
        "page-PageB-ee73bf7ecd6ecdc82144.js",
        "page-PageB-ee73bf7ecd6ecdc82144.js.map",
      ],
      children: {},
      childAssets: {},
    },
    "page-PageC": {
      chunks: [0, 5],
      assets: [
        "modules-ee73bf7ecd6ecdc82144.js",
        "modules-ee73bf7ecd6ecdc82144.js.map",
        "page-PageC-ee73bf7ecd6ecdc82144.js",
        "page-PageC-ee73bf7ecd6ecdc82144.js.map",
      ],
      children: {},
      childAssets: {},
    },
  },
  logging: {
    "webpack.buildChunkGraph.visitModules": {
      entries: [],
      filteredEntries: 5,
      debug: false,
    },
  },
  children: [],
};

let requestCounter = 0;

async function handleRequest(request: Request) {
  const url = new URL(request.url);
  if (url.pathname.match(/^\/static\//)) {
    const key = url.pathname.replace("/static/", "");
    const contentType = mime.getType(key);
    console.log("Proxy to", key, contentType);
    // @ts-ignore: Known undeclared global
    return new Response(await BASIC_WEBPACK.get(key, "stream"), {
      headers: { "Content-Type": contentType },
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

  const t0 = Date.now();
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
  const t1 = Date.now();
  console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");

  if (content) {
    console.log("Content for ", url.pathname);
    return new Response(content, {
      status: 200,
      headers: { "content-type": "text/html; charset=UTF-8" },
    });
  }
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
