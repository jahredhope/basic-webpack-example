import React, { useEffect, useState } from "react";
import Button from "src/components/Button";
import Text from "src/components/Text";
import { useSelector } from "src/store";
import {
  loadPosts,
  Post,
  selectSubPosts,
  useSetSubredditPosts,
} from "src/store/posts";
import Link from "./Link";
import Stack from "./Stack";
import Box from "./Box";

const useTopRedditPosts = (subreddit: string) => {
  const setSubredditPosts = useSetSubredditPosts();
  const posts = useSelector((state) => selectSubPosts(state, subreddit));
  useEffect(() => {
    const promise: any = loadPosts(subreddit).then((newPosts: Post[]) =>
      setSubredditPosts(subreddit, newPosts)
    );
    return promise.cancel;
  }, [subreddit]);
  return posts;
};

const RedditPosts = () => {
  const [subreddit, setSubreddit] = useState("reactjs");
  const posts = useTopRedditPosts(subreddit);

  return (
    <Stack space="small">
      <Text size="large">Reddit {subreddit} Posts</Text>
      <Box inline="xsmall">
        <Button onClick={() => setSubreddit("reactjs")}>React JS</Button>
        <Button onClick={() => setSubreddit("webpack")}>Webpack</Button>
      </Box>

      {posts ? (
        <Stack as="ul" space="xsmall">
          {posts.map((post: any) => (
            <li key={post.id}>
              <Text tone="link">
                <Link href={`https://reddit.com${post.permalink}`}>
                  {post.title.substr(0, 100)}
                </Link>
              </Text>
            </li>
          ))}
        </Stack>
      ) : (
        <Stack as="ul" space="xsmall">
          <li>
            <Text>&nbsp;</Text>
          </li>
          <li>
            <Text>&nbsp;</Text>
          </li>
          <li>
            <Text>&nbsp;</Text>
          </li>
          <li>
            <Text>&nbsp;</Text>
          </li>
          <li>
            <Text>&nbsp;</Text>
          </li>
        </Stack>
      )}
    </Stack>
  );
};

export default RedditPosts;
