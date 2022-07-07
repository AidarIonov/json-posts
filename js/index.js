import { renderPosts } from './view.js'
import { createState, combine } from './lib/state.js'
// import { filteredPosts } from "./model.js"
// import { userId, posts, query } from "./model.js"
const API_URL = 'https://jsonplaceholder.typicode.com'
const mainContainer = document.querySelector('.main__container')

export const posts = createState([])
export const userId = createState(null)
export const query = createState(null)
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

async function fetchPosts() {
  const res = await fetch(`${API_URL}/posts`)
  const data = await res.json()
  posts.setValue(data)
}

fetchPosts()

document.querySelector('#title').addEventListener('input', (e) => {
  query.setValue(e.target.value.trim().toLowerCase() || null)
})

document.querySelector('#userId').addEventListener('input', (e) => {
  userId.setValue(e.target.valueAsNumber)
})

filteredPosts.watch(renderPosts)
