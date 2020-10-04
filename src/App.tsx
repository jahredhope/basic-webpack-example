import styled from "@emotion/styled";
import loadable from "@loadable/component";
import React from "react";
import { Route, Switch } from "react-router-dom";

import GlobalCss from "./GlobalCss";
import Page from "./components/Page";
import { useLogMount } from "src/common-hooks";
import DebugInfo from "src/components/DebugInfo";
import Header from "src/components/Header";
import Loader from "src/components/Loader";
import Text from "src/components/Text";
import logoSrc from "src/soccer.png";

// import PageA from "./page/PageA";
export const PageA = loadable(() => import("./page/PageA"), {
  fallback: (
    <Page>
      <Loader />
    </Page>
  ),
});
// import PageB from "./page/PageB";
export const PageB = loadable(() => import("./page/PageB"), {
  fallback: (
    <Page>
      <Loader />
    </Page>
  ),
});
// import PageC from "./page/PageC";
export const PageC = loadable(() => import("./page/PageC"), {
  fallback: (
    <Page>
      <Loader />
    </Page>
  ),
});

if (!logoSrc) {
  throw new Error(`"Missing logoSrc", ${logoSrc}`);
}

const PageGrid = styled("div")`
  margin-bottom: 30px;
  display: grid;
  row-gap: var(--space-large);
  column-gap: var(--space-medium);
  grid-template-columns: 1fr;
  max-width: 100%;
  justify-content: space-between;

  grid-template-areas:
    "header"
    "content"
    "meta";
  @media only screen and (min-width: 1200px) {
    grid-template-columns: 180px minmax(0, 950px) 180px;
    grid-template-areas:
      "header header header"
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
  if (!logoSrc) {
    throw new Error(`"Missing logoSrc", ${logoSrc}`);
  }
  useLogMount("App");

  return (
    <div>
      <PageGrid>
        <GlobalCss />
        <Header />
        {error ? (
          <Page>
            <Text center>Unable to render. {error.toString()}</Text>
          </Page>
        ) : (
          <Switch>
            <Route exact path="/">
              <PageA />
            </Route>
            <Route path="/a">
              <PageA />
            </Route>
            <Route path="/error/offline">
              <Page>
                <Text center>
                  Looks like you are offline. Please check your internet
                  connection and try again.
                </Text>
              </Page>
            </Route>
            <Route path="/b">
              <PageB />
            </Route>
            <Route path="/c">
              <PageC />
            </Route>
            <Route>
              <Page>
                <Text center>Page not found</Text>
              </Page>
            </Route>
          </Switch>
        )}
        <DebugInfo />
      </PageGrid>
    </div>
  );
}
export default addErrorBoundary(App);
