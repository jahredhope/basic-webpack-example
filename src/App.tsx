import loadable from "@loadable/component";
import { Router, useLocation } from "@reach/router";
import React, { Fragment } from "react";

import Loader from "./components/Loader";
import Card from "./components/Card";
import Text from "./components/Text";
import TextLink from "./components/TextLink";

import theme from "./theme";

// import PageA from "./page/PageA";
const PageA = loadable(() => import("./page/PageA"), {
  fallback: <Loader />,
});
// import PageB from "./page/PageB";
const PageB = loadable(() => import("./page/PageB"), {
  fallback: <Loader />,
});
// import PageC from "./page/PageC";
const PageC = loadable(() => import("./page/PageC"), {
  fallback: <Loader />,
});

import { css, Global } from "@emotion/core";
import styled from "@emotion/styled";

const BannerHeading = styled(Text)`
  align-self: flex-end;
`;

const Banner = styled("div")`
  display: grid;
  grid-area: header;
  gap: 15px;
  grid-template-columns: 1fr max-content 1fr;
  grid-auto-columns: minmax(min-content, max-content);
  grid-auto-flow: column;
  justify-content: space-between;
  width: 100vw;
  box-sizing: border-box;
  padding: 12px 18px;
  align-items: flex-end;
  background-color: ${theme.colors.fill.secondary};
`;

const TabItem = styled(TextLink)`
  padding: 0 12px 0 0;
  :last-child {
    padding-right: 0;
  }
`;

const Tabs = styled("div")`
  grid-area: links;
  padding: 10px 18px;
  background-color: var(--color-orange);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

import logoSrc from "./soccer.png";

if (!logoSrc) {
  throw new Error(`"Missing logoSrc", ${logoSrc}`);
}

const PageGrid = styled("div")`
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 1fr;
  max-width: 100%;
  grid-template-areas:
    "header"
    "links"
    "meta"
    ".";
  @media only screen and (min-width: 600px) {
    grid-template-columns: auto 200px;
    grid-template-areas:
      "header header"
      "links links"
      ". meta";
  }
`;

import { useLogMount } from "src/common-hooks";
import PageDetails from "./components/PageDetails";
import { pathToRegexp } from "path-to-regexp";
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

const getIsPageA = pathToRegexp("/a/");
const getIsPageB = pathToRegexp("/b/");
const getIsPageC = pathToRegexp("/c/");

function usePageName() {
  const location = useLocation();
  if (location.pathname.match(getIsPageA)) return "Page A";
  if (location.pathname.match(getIsPageB)) return "Page B";
  if (location.pathname.match(getIsPageC)) return "Page C";
  return "Page A";
}

function App({ error }: any) {
  if (!logoSrc) {
    throw new Error(`"Missing logoSrc", ${logoSrc}`);
  }
  useLogMount("App");

  const pageName = usePageName();

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
            max-width: 100vw;
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
      <PageGrid>
        <Banner>
          <div />
          <BannerHeading heading>
            Basic Webpack Example - {pageName}
          </BannerHeading>
          <div />
        </Banner>
        <Tabs>
          <TabItem
            href="/"
            data-analytics="header-page-a"
            name="header-page-a"
            onMouseOver={() => {
              // PageA.preload();
            }}
          >
            Page A
          </TabItem>
          <TabItem
            href="/b/"
            data-analytics="header-page-b"
            name="header-page-b"
            onMouseOver={() => {
              // PageB.preload();
            }}
          >
            Page B
          </TabItem>
          <TabItem
            href="/c/"
            data-analytics="header-page-c"
            name="header-page-c"
            onMouseOver={() => {
              // PageC.preload();
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
        <PageDetails />
      </PageGrid>
    </div>
  );
}
export default addErrorBoundary(App);
