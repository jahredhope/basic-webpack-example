import { FABRuntime } from "@fab/core";
import resp from "../dist/runtime/response";

export default function ({ Router, Metadata }: FABRuntime) {
  const srcCodeCallback = resp.runtime(Metadata);
  Router.on("/api/reddit(.*)", async ({ url }) => {
    const newUrl = new URL("https://api.reddit.com/");
    newUrl.pathname = url.pathname.replace(/\/api\/reddit\//i, "");
    newUrl.search = url.search;
    const fetchResponse = await fetch(newUrl.toString());
    return fetchResponse;
  });
  Router.on("/api/countries(.*)", async ({ request, url }) => {
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
  });
  Router.on("/events(.*)", async ({ request }) => {
    console.log("/events/", request.body.toString());
    return new Response("", { status: 204 });
  });
  Router.onAll(({ request, settings, url }) => {
    return srcCodeCallback({ request, settings, url });
  });
}
