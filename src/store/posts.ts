import { createSelector } from "reselect";
import { State, useAction, useSelector } from ".";

export interface Post {
  id: string;
  title: string;
  permalink: string;
}

export interface Posts {
  [id: string]: Post;
}

export interface PostsState {
  lists: { [subreddit: string]: string[] };
  posts: Posts;
}

export const setSubredditPosts = (
  state: State,
  subreddit: string,
  posts: Post[]
): Partial<State> => ({
  lists: {
    ...state.lists,
    [subreddit]: posts.map((post) => post.id),
  },
  posts: {
    ...state.posts,
    ...Object.fromEntries(posts.map((post) => [post.id, post])),
  },
});
export const useSetSubredditPosts = () => useAction(setSubredditPosts);

export const selectSubPosts = (state: State, subreddit: string) =>
  state.lists && state.lists[subreddit]
    ? state.lists[subreddit].map((id: string) => state.posts[id])
    : null;

const selectPostsObj = (state: State) => state.posts;
const selectPosts = createSelector(selectPostsObj, (posts) =>
  Object.values(posts)
);

export const useSelectPosts = () => useSelector(selectPosts);

const postsCache: Record<string, Promise<Post[]>> = {};
export const loadPosts = (subreddit: string): Promise<Post[]> => {
  if (postsCache[subreddit]) {
    return postsCache[subreddit];
  }
  let controller: AbortController;
  let signal: AbortSignal;
  if (typeof AbortController !== undefined) {
    const controller = new AbortController();
    signal = controller.signal;
  }
  const host = typeof window === "undefined" ? "http://localhost:8080" : "";
  const timeoutTimer = setTimeout(() => {
    console.error("PostsClient: Request timed out");
    if (controller) {
      controller.abort();
    } else {
      console.error("Unable to abort");
    }
  }, 2000);
  const promise: any = fetch(`${host}/api/reddit/r/${subreddit}?limit=5`, {
    signal,
  })
    .then((v) => {
      clearTimeout(timeoutTimer);
      console.log("Response from reddit");
      return v;
    })
    .then((res: Response) => res.json())
    .then((res) => res.data.children)
    .then((data) => data.map((v: any) => v.data))
    .then((data) => data.slice(0, 5))
    .then((data) =>
      data.map((post: Post) => ({
        id: post.id,
        permalink: post.permalink,
        title: post.title,
      }))
    )
    .catch((err: DOMException | Error) => {
      delete postsCache.subreddit;
      if (err.name !== "AbortError") {
        console.error("An error occured fetching posts", err);
      }
    });
  promise.cancel = () => {
    if (controller) controller.abort();
  };
  postsCache[subreddit] = promise;
  return promise;
};
