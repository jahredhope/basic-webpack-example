/* eslint-disable @typescript-eslint/camelcase */
// import render from "./cloud/render";
import render from "./render";
import { State } from "./store";

// const webpackStatsFromCopy = {};
// @ts-ignore
const webpackStats = {
  errors: [],
  warnings: [],
  version: "4.43.0",
  hash: "18a724b44a5f2ad61954",
  publicPath: "/",
  outputPath: "/Users/jhope/code/basic-webpack/dist",
  assetsByChunkName: {
    apollo: [
      "apollo-18a724b44a5f2ad61954.js",
      "apollo-18a724b44a5f2ad61954.js.map",
    ],
    main: ["main-18a724b44a5f2ad61954.js", "main-18a724b44a5f2ad61954.js.map"],
    react: [
      "react-18a724b44a5f2ad61954.js",
      "react-18a724b44a5f2ad61954.js.map",
    ],
    runtime: [
      "runtime-18a724b44a5f2ad61954.js",
      "runtime-18a724b44a5f2ad61954.js.map",
    ],
  },
  assets: [
    {
      name: "6a9fc10215ff67576aac7a50a320a19e.png",
      size: 2423,
      chunks: [],
      chunkNames: [],
      info: {},
      emitted: false,
    },
    {
      name: "apollo-18a724b44a5f2ad61954.js",
      size: 133362,
      chunks: [0],
      chunkNames: ["apollo"],
      info: {
        immutable: true,
      },
      emitted: false,
    },
    {
      name: "apollo-18a724b44a5f2ad61954.js.map",
      size: 186446,
      chunks: [0],
      chunkNames: ["apollo"],
      info: {
        development: true,
      },
      emitted: false,
    },
    {
      name: "main-18a724b44a5f2ad61954.js",
      size: 133655,
      chunks: [1],
      chunkNames: ["main"],
      info: {
        immutable: true,
      },
      emitted: false,
    },
    {
      name: "main-18a724b44a5f2ad61954.js.map",
      size: 576379,
      chunks: [1],
      chunkNames: ["main"],
      info: {
        development: true,
      },
      emitted: false,
    },
    {
      name: "react-18a724b44a5f2ad61954.js",
      size: 123799,
      chunks: [2],
      chunkNames: ["react"],
      info: {
        immutable: true,
      },
      emitted: false,
    },
    {
      name: "react-18a724b44a5f2ad61954.js.map",
      size: 168039,
      chunks: [2],
      chunkNames: ["react"],
      info: {
        development: true,
      },
      emitted: false,
    },
    {
      name: "runtime-18a724b44a5f2ad61954.js",
      size: 1578,
      chunks: [3],
      chunkNames: ["runtime"],
      info: {
        immutable: true,
      },
      emitted: false,
    },
    {
      name: "runtime-18a724b44a5f2ad61954.js.map",
      size: 2981,
      chunks: [3],
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
      chunks: [3, 0, 2, 1],
      assets: [
        "runtime-18a724b44a5f2ad61954.js",
        "runtime-18a724b44a5f2ad61954.js.map",
        "apollo-18a724b44a5f2ad61954.js",
        "apollo-18a724b44a5f2ad61954.js.map",
        "react-18a724b44a5f2ad61954.js",
        "react-18a724b44a5f2ad61954.js.map",
        "main-18a724b44a5f2ad61954.js",
        "main-18a724b44a5f2ad61954.js.map",
      ],
      children: {},
      childAssets: {},
    },
  },
  namedChunkGroups: {
    main: {
      chunks: [3, 0, 2, 1],
      assets: [
        "runtime-18a724b44a5f2ad61954.js",
        "runtime-18a724b44a5f2ad61954.js.map",
        "apollo-18a724b44a5f2ad61954.js",
        "apollo-18a724b44a5f2ad61954.js.map",
        "react-18a724b44a5f2ad61954.js",
        "react-18a724b44a5f2ad61954.js.map",
        "main-18a724b44a5f2ad61954.js",
        "main-18a724b44a5f2ad61954.js.map",
      ],
      children: {},
      childAssets: {},
    },
  },
  logging: {
    "webpack.buildChunkGraph.visitModules": {
      entries: [],
      filteredEntries: 2,
      debug: false,
    },
  },
  children: [],
};

let requestCounter = 0;

async function handleRequest(request: Request) {
  const url = new URL(request.url);

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
