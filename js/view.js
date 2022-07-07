import { combine } from './lib/state.js'
import { posts, postId } from './model.js'
const mainContainer = document.querySelector('.main__container')
const pagination_element = document.querySelector('.pagination')
// const deletePost = (id) => {
//   const filteredItems = posts.value.filter((item) => item.id !== id)
//   posts.setValue(filteredItems)
// }

let currentPage = 1;
let rows = 5;

export const renderPosts = (list, rowsPerPage, page) => {
  page--;
  let start = rowsPerPage * page;
	let end = start + rowsPerPage;
	let paginatedItems = list.slice(start, end);
  mainContainer.innerHTML = list.slice(0, 6)
    .map(
      (post, i) => `
        <div class="post">
          <h2>${post.id} ${post.title}</h2>
          <ul>
            <li>User Id: ${post.userId}</li>
            <li>${post.body}</li>
          </ul>
          <span onclick='postId.setValue(${post.id})'>Delete post</span>
        </div>
  `
    )
    .join('')
}





// function setupPagination (items, rows_per_page) {
// 	mainContainer.innerHTML = "";

// 	let page_count = Math.ceil(items.length / rows_per_page);
// 	for (let i = 1; i < page_count + 1; i++) {
// 		let btn = paginationButton(i, items);
// 		mainContainer.appendChild(btn);
// 	}
// }

// function paginationButton (page, items) {
// 	let button = document.createElement('button');
// 	button.innerText = page;

// 	if (current_page == page) button.classList.add('active');

// 	button.addEventListener('click', function () {
// 		current_page = page;
// 		renderPosts(items, rows, current_page);

// 		let current_btn = document.querySelector('.pagenumbers button.active');
// 		current_btn.classList.remove('active');

// 		button.classList.add('active');
// 	});

// 	return button;
// }

// displayPagination(posts.value, rows, current_page);
// setupPagination(posts.value, rows);
