import loadable from "@loadable/component";
import { Router } from "@reach/router";
import React from "react";
import Loader from "./Loader";

import Text from "./components/Text";
import TextLink from "./components/TextLink";

import theme from "./theme";

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
import styled from "@emotion/styled";

const BannerHeading = styled(Text)`
  align-self: flex-end;
`;

const Banner = styled("div")`
  display: flex;
  flex-direction: row;
  width: 100vw;
  padding: 12px 18px;
  margin-bottom: 12px;
  background-color: ${theme.colors.fill.secondary};
`;

const TabItem = styled(TextLink)`
  padding: 0 12px 12px 0;
  :last-child {
    padding-right: 0;
  }
`;

const Tabs = styled("div")`
  padding: 0 18px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

import logoSrc from "./soccer.png";

const Logo = styled("img")`
  margin: 0 18px 0 0;
  height: 60px;
`;
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
            background-color: ${theme.colors.fill.standard};
          }
          a,
          a:visited {
            text-decoration: inherit;
          }

          a:hover,
          a:active {
            color: inherit;
          }
        `}
      />
      <Banner>
        <Logo src={logoSrc} />
        <BannerHeading heading primary>
          App Content: {count}
        </BannerHeading>
      </Banner>
      <Tabs>
        <TabItem href="/">Page A</TabItem>
        <TabItem href="/b">Page B</TabItem>
        <TabItem href="/c">Page C</TabItem>
      </Tabs>
      <Router>
        <PageA path="/" />
        <PageA path="/a" />
        <PageB path="/b" />
        <PageC path="/c" />
      </Router>
    </div>
  );
}
