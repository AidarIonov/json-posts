import { createState, combine } from "./lib/state.js"
import { renderPosts } from "./view.js";
export const query = createState(null);
export const posts = createState([]);
export const userId = createState(null);
export const currentPage = createState(1);
export const rowsPerPage = createState(8);


export const filteredPosts = combine(
  { posts, query, userId, rowsPerPage },
  ({ posts, query, userId, rowsPerPage }) => {
    return posts
      .filter((post) => {
        if (query && !(post.body + post.title).toLowerCase().includes(query))
          return false;

        if (userId && post.userId !== userId) return false;

        return true;
      })
      .slice(0, rowsPerPage);
  }
);
