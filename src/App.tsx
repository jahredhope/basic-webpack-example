import loadable from "@loadable/component";
import { Router } from "@reach/router";
import React, { Fragment } from "react";

import Loader from "./components/Loader";
import Card from "./components/Card";
import Text from "./components/Text";
import TextLink from "./components/TextLink";

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
  display: grid;
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

const Logo = styled("img")`
  margin: 0 18px 0 0;
  height: 60px;
  width: 60px;
`;
import { useLogMount } from "src/common-hooks";
import PageDetails from "./components/PageDetails";
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

function App({ error }: any) {
  if (!logoSrc) {
    throw new Error(`"Missing logoSrc", ${logoSrc}`);
  }
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
        <BannerHeading heading>Basic Webpack Example</BannerHeading>
        <div />
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
      <PageDetails />
    </div>
  );
}
export default addErrorBoundary(App);
