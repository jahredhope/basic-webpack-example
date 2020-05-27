import React, { memo } from "react";
import { Helmet } from "react-helmet";
import styled from "@emotion/styled";

import { useTrackPageView } from "src/analytics";
import { useLogMount } from "src/common-hooks";
import Text from "src/components/Text";
import TextLink from "src/components/TextLink";
import Stack from "src/components/Stack";
import Page from "src/components/page";
import Box from "src/components/Box";

const Features = styled("div")({
  display: "grid",
  columnGap: "var(--space-medium)",
  rowGap: "var(--space-large)",
  gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
  // gridTemplateRows: "repeat(3, 1fr)",
  // gridAutoRows: "60px",
  maxWidth: "100%",
  "@media only screen and (min-width: 650px)": {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
});
const FeatureCard = styled("div")({
  display: "grid",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  borderRadius: "3px",
  minHeight: "60px",
  padding: "var(--space-medium) var(--space-medium)",
  backgroundColor: "var(--color-white)",
  boxShadow: "var(--box-shadow)",
});

export default memo(function PageA() {
  useLogMount("PageA");
  useTrackPageView("PageA");

  return (
    <>
      <Helmet>
        <title>Page A - Static content</title>
      </Helmet>
      <Page extended>
        <Stack space="medium" inset>
          <Text size="hero" center tone="primary">
            Basic
          </Text>
          <Text as="blockquote" center emphasis>
            Start simple, go from there
          </Text>
        </Stack>
        <Box paddingX="medium">
          <Text center>
            This application is a demo ground for testing web application
            patterns. It contains a few basic things, like multiple pages, some
            static content and some dynamic content.
          </Text>
        </Box>
        <Stack space="xlarge" paddingX="medium">
          <Text size="hero" center>
            Features
          </Text>
          <Features>
            <FeatureCard>
              <Text>
                Multi page application with{" "}
                <TextLink inline href="https://reacttraining.com/react-router/">
                  React Router
                </TextLink>
              </Text>
            </FeatureCard>
            <FeatureCard>
              <Text>
                Pre-render multiple routes with{" "}
                <TextLink
                  inline
                  href="https://github.com/jahredhope/html-render-webpack-plugin"
                >
                  html-render-webpack-plugin
                </TextLink>
              </Text>
            </FeatureCard>
            <FeatureCard>
              <Text>
                Code splitting per route with{" "}
                <TextLink
                  inline
                  href="https://github.com/smooth-code/loadable-components"
                >
                  loadable-components
                </TextLink>
              </Text>
            </FeatureCard>
            <FeatureCard>
              <Text>
                Dynamic code loading with{" "}
                <TextLink
                  inline
                  href="https://github.com/smooth-code/loadable-components"
                >
                  loadable-components
                </TextLink>
              </Text>
            </FeatureCard>
            <FeatureCard>
              <Text>
                <TextLink
                  inline
                  href="https://www.typescriptlang.org/docs/handbook/react-&-webpack.html"
                >
                  Typescript
                </TextLink>{" "}
                with{" "}
                <TextLink inline href="https://reactjs.org/">
                  React
                </TextLink>
              </Text>
            </FeatureCard>
            <FeatureCard>
              <Text>
                CSS in JS with{" "}
                <TextLink inline href="https://github.com/emotion-js/emotion">
                  Emotion JS
                </TextLink>
              </Text>
            </FeatureCard>
            <FeatureCard>
              <Text>
                Portable bundles with{" "}
                <TextLink inline href="https://github.com/fab-spec/fab">
                  FAB spec
                </TextLink>
              </Text>
            </FeatureCard>
            <FeatureCard>
              <Text>
                Sharing state with{" "}
                <TextLink inline href="https://github.com/developit/unistore">
                  Unistore
                </TextLink>{" "}
                and{" "}
                <TextLink
                  inline
                  href="https://github.com/jahredhope/react-unistore"
                >
                  {" "}
                  React Hooks API
                </TextLink>
              </Text>
            </FeatureCard>
            <FeatureCard>
              <Text>
                Testing in the browser with{" "}
                <TextLink
                  inline
                  href="https://github.com/GoogleChrome/puppeteer"
                >
                  Puppeteer
                </TextLink>{" "}
                and{" "}
                <TextLink inline href="https://jestjs.io/">
                  Jest
                </TextLink>
              </Text>
            </FeatureCard>
            <FeatureCard>
              <Text>
                Server and Static rendering with production-like dev
                environments
              </Text>
            </FeatureCard>
            <FeatureCard>
              <Text>Same-domain enabled development</Text>
            </FeatureCard>
            <FeatureCard>
              <Text>“Every environment, every build” version switching</Text>
            </FeatureCard>
          </Features>
        </Stack>
      </Page>
    </>
  );
});
