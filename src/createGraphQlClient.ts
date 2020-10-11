import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

export default () => {
  return new ApolloClient({
    cache:
      typeof window !== "undefined" &&
      document.getElementById("__APOLLO_STATE__")
        ? new InMemoryCache().restore(
            JSON.parse(document.getElementById("__APOLLO_STATE__").textContent)
          )
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
        fetch: (...params: unknown[]) => {
          console.log("FETCH", params);
          // @ts-expect-error TODO correctly type
          return fetch(...params);
        },
        uri:
          typeof window !== "undefined"
            ? "/api/countries"
            : "https://countries.trevorblades.com/",
      }),
    ]),
  });
};
