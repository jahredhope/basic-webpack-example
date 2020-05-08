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
    <>
      <Text heading>Reddit ReactJS Posts</Text>
      <Button onClick={() => setSubreddit("reactjs")}>React JS</Button>
      <Button onClick={() => setSubreddit("webpack")}>Webpack</Button>

      {posts ? (
        <ul>
          {posts.map((post: any) => (
            <li key={post.id}>
              <Text>
                <a href={`https://reddit.com${post.permalink}`}>
                  {post.title.substr(0, 100)}
                </a>
              </Text>
            </li>
          ))}
        </ul>
      ) : (
        <ul>
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
        </ul>
      )}
    </>
  );
};

export default RedditPosts;
