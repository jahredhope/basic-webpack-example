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
import { useDisplayName } from "src/store/user";

export default memo(function PageB() {
  const displayName = useDisplayName();

  useLogMount("PageB");
  useTrackPageView("PageB");

  return (
    <div>
      <Helmet>
        <title>Page B</title>
      </Helmet>
      <Card>
        <Text heading>Page B - {displayName}</Text>
      </Card>
      <Card>
        <Continents />
      </Card>
      <RedditPosts />
    </div>
  );
});

export const onServerRender = async (state: State): Promise<State> => {
  const posts = await loadPosts("reactjs");
  return { ...state, ...setSubredditPosts(state, "reactjs", posts) };
};
