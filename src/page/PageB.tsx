import React, { memo } from "react";
import { Helmet } from "react-helmet";

import { useTrackPageView } from "src/analytics";
import { useLogMount } from "src/common-hooks";
import Card from "src/components/Card";
import Continents from "src/components/Continents";
import RedditPosts from "src/components/RedditPosts";
import Text from "src/components/Text";
import { State } from "src/store";
import { loadPosts, setSubredditPosts } from "src/store/posts";

export default memo(function PageB() {
  useLogMount("PageB");
  useTrackPageView("PageB");

  return (
    <>
      <Helmet>
        <title>Page B - Dynamic content</title>
      </Helmet>
      <Card>
        <Text heading>Page B</Text>
        <Text>
          This page contains a mix of server-or-client side content and
          client-only side content.
        </Text>
      </Card>
      <Card>
        <Continents />
      </Card>
      <Card>
        <RedditPosts />
      </Card>
    </>
  );
});

export const onServerRender = async (state: State): Promise<State> => {
  const posts = await loadPosts("reactjs");
  return { ...state, ...setSubredditPosts(state, "reactjs", posts) };
};
