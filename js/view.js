import { API_URL, isLoading, loadMoreBtn } from './index.js';
import { posts } from './model.js';

const blogContent = document.querySelector('.blogs-content');

export const renderPosts = (list) => {
  if (isLoading) {
    blogContent.innerHTML = '<h2>Loading...</h2>';
  } else if (!list.length) {
    blogContent.innerHTML = '<h2>Posts not found!</h2>';
  } else {
    blogContent.innerHTML = list
      .map(
        (post) =>
          `<div class="blog">
            <div class="blog__details">
            <img class='blog__edit' src="../img/pencil.svg" alt="Pencil" />
            <div>
            <h3 class="blog__title">${post.id} ${post.title.substr(0, 40)}</h3>
            <span>User Id: ${post.userId}</span>
            </div>
            <p class="blog__text">${post.body.substr(0, 70)}</p>
            <div className="blog__btns">
            <button data-id="${
              post.id
            }" class="btn blog__readmore">Read more</button>
            <button data-id="${
              post.id
            }" class="btn blog__remove">Delete Post</button>
            </div>
        </div>
    </div>`
      )
      .join('');
  }
  const readMoreBtns = blogContent.querySelectorAll('.blog__readmore');
  const removeBtns = blogContent.querySelectorAll('.blog__remove');
  readMoreBtns.forEach((item) => {
    item.addEventListener('click', () => {
      fetchPostDetails(item);
      loadMoreBtn.style.display = 'none';
    });
  });
  removeBtns.forEach((item) => {
    item.addEventListener('click', () => {
      const postId = item.getAttribute('data-id');
      deletePost(postId);
    });
  });
};

const deletePost = (id) => {
  fetch(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
  });
  const filteredItems = posts.value.filter((item) => item.id !== Number(id));
  posts.setValue(filteredItems);
};

async function fetchPostDetails(target) {
  blogContent.classList.add('none-grid');
  let postId = target.getAttribute('data-id');
  if (postId) {
    blogContent.classList.add('active');
    blogContent
      .querySelectorAll('.blog')
      .forEach((blog) => blog.classList.add('remove'));
    try {
      const res = await fetch(`${API_URL}/posts/${postId}`);
      const post = await res.json();
      displayPostDetails(post);
    } catch (e) {
      console.log(e);
      blogContent.innerHTML = '<h2>Oop! Something went wrong</h2>';
    }
  }
}

async function displayPostDetails(post) {
  blogContent.innerHTML = `  <h3>Post Id ${post.id}</h3> 
                    <h3 class="title">${post.title}</h3>
                    <p class="single-post-desc">${post.body} post id ${post.id}</p>
                    <h2>Comments:</h2>`;

  try {
    const res = await fetch(`${API_URL}/posts/${post.id}/comments`);
    const comments = await res.json();
    comments.map(
      (comment) =>
        (blogContent.innerHTML += `<div class="comment">
                                 <div class="comment-header">
                                     <div class="avatar">${
                                       comment.email.split('')[0]
                                     }</div>
                                    <div class="username">${comment.email}</div>
                                </div>
                                <div class="comment-body">
                                    <strong class="title">${
                                      comment.name
                                    }</strong>
                                    <p class="text">${comment.body}</p>
                                </div>
                            </div>`)
    );
  } catch (e) {
    blogContent.innerHTML = '<h2>Oop! Something went wrong</h2>';
  }
}
