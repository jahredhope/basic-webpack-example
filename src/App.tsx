import loadable from "@loadable/component";
import { Router } from "@reach/router";
import React, { Fragment } from "react";
import Loader from "./components/Loader";

import Text from "./components/Text";
import TextLink from "./components/TextLink";
import { useSelector } from "./store/index";

import theme from "./theme";

const PageA = loadable(() => import("./page/PageA"), {
  fallback: <Loader />,
});
import PageB from "./page/PageB";
// const PageB = loadable(() => import("./page/PageB"), {
//   fallback: <Loader />,
// });
const PageC = loadable(() => import("./page/PageC"), {
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

if (!logoSrc) {
  throw new Error(`"Missing logoSrc", ${logoSrc}`);
}

const Logo = styled("img")`
  margin: 0 18px 0 0;
  height: 60px;
  width: 60px;
`;
import {
  useIncrementalTimer,
  useIncrementer,
  useLogMount,
} from "src/common-hooks";
import Card from "./components/Card";
const RoutePageA = (_: any) => (
  <Fragment>
    <PageA />
  </Fragment>
);
const RoutePageB = (_: any) => (
  <Fragment>
    <PageB />
  </Fragment>
);
const RoutePageC = (_: any) => (
  <Fragment>
    <PageC />
  </Fragment>
);
const RouteNotFound = (_: any) => (
  <Fragment>
    <Card>
      <Text>Page not found</Text>
    </Card>
  </Fragment>
);

const ServerRenderedStatus = () => {
  const requestId = useSelector((state) => state.requestId);
  const requestCounter = useSelector((state) => state.requestCounter);

  if (!requestId && !requestCounter) {
    return null;
  }
  return (
    <Card>
      <Text>
        This page was server rendered (ID: {requestId}, Count: {requestCounter})
      </Text>
    </Card>
  );
};

const addErrorBoundary = (Child: any) =>
  class ErrorCatcher extends React.Component<any, any> {
    public static getDerivedStateFromError(error: any) {
      return { error };
    }
    constructor(props: any) {
      super(props);
      this.state = { error: null };
    }
    public render() {
      return <Child {...this.props} error={this.state.error} />;
    }
  };

function App({ error }: any) {
  if (!logoSrc) {
    throw new Error(`"Missing logoSrc", ${logoSrc}`);
  }
  const [count, incrementCount] = useIncrementer(1);
  useIncrementalTimer(incrementCount, 3000);
  useLogMount("App");

  return (
    <div>
      <Global
        styles={css`
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              Helvetica, Arial, sans-serif, "Apple Color Emoji",
              "Segoe UI Emoji", "Segoe UI Symbol";
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
      />{" "}
      <Banner>
        <Logo src={logoSrc} />
        <BannerHeading heading primary>
          Appss Content: {count}
        </BannerHeading>
      </Banner>
      <Tabs>
        <TabItem
          href="/"
          data-analytics="header-page-a"
          name="header-page-a"
          onMouseOver={() => {
            PageA.preload();
          }}
        >
          Page A
        </TabItem>
        <TabItem
          href="/b/"
          data-analytics="header-page-b"
          name="header-page-b"
          onMouseOver={() => {
            PageB.preload();
          }}
        >
          Page B
        </TabItem>
        <TabItem
          href="/c/"
          data-analytics="header-page-c"
          name="header-page-c"
          onMouseOver={() => {
            PageC.preload();
          }}
        >
          Page C
        </TabItem>
      </Tabs>
      {error ? (
        <Card>
          <Text>Unable to render. {error.toString()}</Text>
        </Card>
      ) : (
        <Router>
          <RoutePageA path="/" />
          <RoutePageA path="/a" />
          <RoutePageB path="/b" />
          <RoutePageC path="/c" />
          <RouteNotFound default />
        </Router>
      )}
      <ServerRenderedStatus />
    </div>
  );
}
export default addErrorBoundary(App);
