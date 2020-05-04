const resp = require("../dist/runtime/response");
import { match } from "path-to-regexp";

const matches = {
  reddit: match("/api/reddit", { end: false }),
  countries: match("/api/countries", { end: false }),
  events: match("/events", { end: false }),
};

export const runtime = (args, metadata) => {
  const srcCodeCallback = resp.runtime(args, metadata);
  return async ({ request, settings, url }) => {
    if (matches.reddit(url.pathname)) {
      const newUrl = new URL("https://api.reddit.com/");
      newUrl.pathname = url.pathname.replace(/\/api\/reddit\//i, "");
      newUrl.search = url.search;
      const content = await fetch(newUrl.toString());
      return content;
    }
    if (matches.countries(url.pathname)) {
      const newUrl = new URL("https://countries.trevorblades.com/");
      newUrl.pathname = url.pathname.replace(/\/api\/countries\//i, "");
      newUrl.search = url.search;

      const content = await fetch(newUrl.toString(), {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: request.body.toString(),
      });
      return content;
    }
    if (matches.events(url.pathname)) {
      console.log("/events/", request.body.toString());
      return new Response("", { status: 204 });
    }
    return srcCodeCallback({ request, settings, url });
  };
};
