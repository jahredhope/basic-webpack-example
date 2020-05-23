import { Switch, Route } from "react-router-dom";
import loadable from "@loadable/component";
import React from "react";
import styled from "@emotion/styled";

import { useLogMount } from "src/common-hooks";
import Card from "src/components/Card";
import DebugInfo from "src/components/DebugInfo";
import Loader from "src/components/Loader";
import logoSrc from "src/soccer.png";
import Text from "src/components/Text";
import TextLink from "src/components/TextLink";
import Header from "./components/Header";
import { usePageName } from "./components/usePageName";
import GlobalCss from "./GlobalCss";

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

const TabItem = styled(TextLink)`
  padding: var(--space-small) var(--space-small) var(--space-xsmall);
  ${({ active }) =>
    active ? `border-bottom: 2px solid var(--color-link);` : ""}
`;

const Tabs = styled("div")`
  grid-area: links;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

if (!logoSrc) {
  throw new Error(`"Missing logoSrc", ${logoSrc}`);
}

const PageGrid = styled("div")`
  margin-bottom: 30px;
  display: grid;
  row-gap: var(--space-xsmall);
  column-gap: var(--space-medium);
  grid-template-columns: 1fr;
  max-width: 100%;

  grid-template-areas:
    "header"
    "links"
    "content"
    "meta";
  @media only screen and (min-width: 1200px) {
    grid-template-columns: 180px auto 180px;
    grid-template-areas:
      "header header header"
      "links links links"
      ". content meta";
  }
`;

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
  const pageName = usePageName();
  if (!logoSrc) {
    throw new Error(`"Missing logoSrc", ${logoSrc}`);
  }
  useLogMount("App");

  return (
    <div>
      <PageGrid>
        <GlobalCss />
        <Header />
        <Tabs>
          <TabItem
            href="/"
            active={pageName === "Page A"}
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
            active={pageName === "Page B"}
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
            active={pageName === "Page C"}
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
          <Switch>
            <Route exact path="/">
              <PageA />
            </Route>
            <Route path="/a">
              <PageA />
            </Route>
            <Route path="/error/offline">
              <Card>
                <Text>
                  Looks like you are offline. Please check your internet
                  connection and try again.
                </Text>
              </Card>
            </Route>
            <Route path="/b">
              <PageB />
            </Route>
            <Route path="/c">
              <PageC />
            </Route>
            <Route>
              <Card>
                <Text>Page not found</Text>
              </Card>
            </Route>
          </Switch>
        )}
        <DebugInfo />
      </PageGrid>
    </div>
  );
}
export default addErrorBoundary(App);
