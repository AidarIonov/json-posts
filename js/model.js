import { createState, combine } from "./lib/state.js"

export const posts = createState([])
export const postId = createState(null)
export const userId = createState(null)
export const query = createState(null)
console.log(postId.value);


export const filteredPosts = combine(
  { posts, userId, query },
  ({ posts, query, userId }) => {
    return posts.filter((post) => {
      if (query && !(post.body + post.title).toLowerCase().includes(query))
        return false

      if (userId && post.userId !== userId) return false

      return true
    })
  }
)