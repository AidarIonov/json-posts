import { filteredPosts, posts, query, rowsPerPage, userId } from './model.js';
import { renderPosts } from './view.js';
const queryField = document.getElementById('query');
const userIdQuery = document.getElementById('userId');
export const loadMoreBtn = document.querySelector('.paginate-btn');

export const API_URL = 'https://jsonplaceholder.typicode.com';

export let isLoading = true;

loadMoreBtn.addEventListener('click', () => {
  rowsPerPage.setValue(rowsPerPage.value + rowsPerPage.value);
});

queryField.addEventListener('input', (e) => {
  query.setValue(e.target.value.trim().toLowerCase() || null);
});
userIdQuery.addEventListener('input', (e) => {
  userId.setValue(e.target.valueAsNumber);
});

filteredPosts.watch(renderPosts);

async function displayPosts() {
  const res = await fetch(`${API_URL}/posts`);
  const data = await res.json();
  isLoading = false;
  posts.setValue(data);
}
displayPosts();
