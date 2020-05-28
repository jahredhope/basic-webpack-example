import React, { memo } from "react";
import { Helmet } from "react-helmet";

import { useTrackPageView } from "src/analytics";
import { useLogMount } from "src/common-hooks";
import Continents from "src/components/Continents";
import RedditPosts from "src/components/RedditPosts";
import Text from "src/components/Text";
import Page from "src/components/page";
import Stack from "src/components/Stack";
import Box from "src/components/Box";

export default memo(function PageB() {
  useLogMount("PageB");
  useTrackPageView("PageB");

  return (
    <>
      <Helmet>
        <title>Page B - Dynamic content</title>
      </Helmet>
      <Page>
        <Stack space="medium" inset>
          <Text size="xlarge" tone="brand" center>
            Server-side content
          </Text>
          <Text center>
            This page contains a mix of server and non-server rendered content.
          </Text>
        </Stack>
        <Box inset>
          <Continents />
        </Box>
        <Box inset>
          <RedditPosts />
        </Box>
      </Page>
    </>
  );
});
