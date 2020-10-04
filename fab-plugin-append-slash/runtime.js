const staticRegex = /^\/static/i;
const apiRegex = /^\/api/i;

export const runtime = (_args, _metadata) => {
  return async ({ _request, _settings, url }) => {
    if (
      url.pathname.substr(-1) !== "/" &&
      !url.pathname.match(staticRegex) &&
      !url.pathname.match(apiRegex)
    ) {
      const newUrl = new URL(url);
      newUrl.pathname += "/";
      console.log(`Redirecting from ${url.toString()} to ${newUrl.toString()}`);
      return new Response("", {
        status: 301,
        headers: { location: newUrl.toString() },
      });
    } else {
      console.log("No need to redirect", url.toString());
    }
  };
};
