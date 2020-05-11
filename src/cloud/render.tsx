// import "core-js/stable";
// import "isomorphic-fetch";
// import "regenerator-runtime/runtime";

import { ApolloProvider } from "@apollo/react-hooks";
import { getDataFromTree } from "@apollo/react-ssr";
import { ChunkExtractor } from "@loadable/server";
import { ServerLocation } from "@reach/router";
import debug from "debug";
import { Helmet } from "react-helmet";

// import { createStore, Provider } from "src/store";

// import createGraphQlClient from "./createGraphQlClient";

import React from "react";
import { renderToString } from "react-dom/server";
import { renderStylesToString } from "emotion-server";

import styled from "@emotion/styled";

const RedSquare = styled("div")`
  background: red;
  padding: 10px;
`;

function Child({ children }: { children: any }) {
  return <li>{children}</li>;
}

function App() {
  return (
    <RedSquare>
      <Helmet>
        <title>Hello there from App - my</title>
      </Helmet>
      <h1>Hello there from App</h1>
      <ul>
        <Child>One</Child>
        <Child>Two</Child>
        <Child>Three</Child>
        <Child>Four</Child>
      </ul>
    </RedSquare>
  );
}

// const renderStylesToString = (v: any) => v;
// const renderToString = (_: any) => "<div>Hi</div>";

export default async function render(_: any) {
  const helmet = Helmet.renderStatic();
  const appHtml = renderStylesToString(renderToString(<App />));
  // const appHtml = renderToString(<App />);
  return `<html>${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}<body>${appHtml}</body></html>`;
}
