import loadable from "@loadable/component";
import { Link, Router } from "@reach/router";
import React from "react";
import Loader from "./Loader";

import Text from "./Text";

const PageA: any = loadable(() => import("./page/PageA"), {
  fallback: <Loader />,
});
const PageB: any = loadable(() => import("./page/PageB"), {
  fallback: <Loader />,
});
const PageC: any = loadable(() => import("./page/PageC"), {
  fallback: <Loader />,
});

import { css, Global } from "@emotion/core";

import { useIncrementalTimer, useIncrementer } from "src/common-hooks";

export default function App() {
  const [count, incrementCount] = useIncrementer(1);
  useIncrementalTimer(incrementCount, 3000);
  return (
    <div>
      <Global
        styles={css`
          body {
            padding: 0;
            margin: 0;
          }
        `}
      />
      <Text>Has been edited: 1</Text>
      <Text>App content: {count}</Text>
      <Link to="/">Page A</Link>
      <Link to="/b">Page B</Link>
      <Link to="/c">Page C</Link>
      <Router>
        <PageA path="/" />
        <PageA path="/a" />
        <PageB path="/b" />
        <PageC path="/c" />
      </Router>
    </div>
  );
}
