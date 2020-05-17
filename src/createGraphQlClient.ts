import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";

export default () => {
  return new ApolloClient({
    cache:
      typeof window !== "undefined" && (window as any).__APOLLO_STATE__
        ? new InMemoryCache().restore((window as any).__APOLLO_STATE__)
        : new InMemoryCache(),
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        }
        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      }),
      new HttpLink({
        // HACK: Disabled credentials as this causes issues with CloudFlare workers
        // credentials: "same-origin",

        uri:
          typeof window !== "undefined"
            ? "/api/countries"
            : "https://countries.trevorblades.com/",
      }),
    ]),
  });
};
