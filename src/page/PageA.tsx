import React, { memo } from "react";
import { Helmet } from "react-helmet";
import styled from "@emotion/styled";

import { useTrackPageView } from "src/analytics";
import { useLogMount } from "src/common-hooks";
import Text from "src/components/Text";
import Card from "src/components/Card";
import TextLink from "src/components/TextLink";
import Stack from "src/components/Stack";
import Page from "src/components/page";
import { css } from "@emotion/core";
import Box from "src/components/Box";

// const PageDescriptions = styled("div")({
//   display: "grid",
//   maxWidth: "100%",
//   gap: "var(--space-xlarge)",
//   gridAutoColumns: "minmax(0, 1fr)",
//   gridAutoFlow: "column",
//   justifyItems: "stretch",
//   alignItems: "stretch",
// });

const Features = styled("div")({
  display: "grid",
  gap: "var(--space-medium)",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  // gridTemplateRows: "repeat(3, 1fr)",
  // gridAutoRows: "60px",
  maxWidth: "100%",
});
const FeatureCard = styled("div")({
  display: "grid",
  textAlign: "center",
});

// const PageDescription = styled(Link)({
//   cursor: "pointer",
//   display: "grid",
//   gap: "20px",
//   padding: "10px",
//   backgroundColor: "var(--color-brand-light)",
// });

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
          <Text size="hero" center>
            Basic
          </Text>
          <Text as="blockquote" center emphasis>
            Start simple, go from there
          </Text>
        </Stack>
        <Box paddingX="small">
          <Text center>
            This application is a demo ground for testing web application
            patterns. It contains a few basic things, like multiple pages, some
            static content and some dynamic content.
          </Text>
        </Box>
        {/* <Card>
          <PageDescriptions>
            <PageDescription href="/a/">
              <Text center>Page A</Text>
              <Text center>Statically rendered page</Text>
            </PageDescription>
            <PageDescription href="/b/">
              <Text center>Page B</Text>
              <Text center>Server rendered page</Text>
            </PageDescription>
            <PageDescription href="/c/">
              <Text center>Page C</Text>
              <Text center>Client-side page</Text>
            </PageDescription>
          </PageDescriptions>
        </Card> */}
        <Stack space="xlarge" paddingX="small">
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
                Statically renders multiple routes with{" "}
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
                state management with{" "}
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
              <Text>
                Loading static content from Markdown (.md) files with{" "}
                <TextLink
                  inline
                  href="https://github.com/peerigon/markdown-loader"
                >
                  markdown-loader
                </TextLink>
              </Text>
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
