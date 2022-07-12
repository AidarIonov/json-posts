const blogContent = document.querySelector('.blogs-content'),
  modal = document.querySelector('.modal'),
  postForm = modal.querySelector('.edit-form'),
  submitBtn = modal.querySelector('.edit-form__submit'),
  title = modal.querySelector('#edit-title'),
  body = modal.querySelector('#edit-body'),
  contentHeader = document.querySelector('.blogs-header'),
  paginateBtn = document.querySelector('.paginate-btn'),
  queryField = document.getElementById('query'),
  userIdQuery = document.getElementById('userId');

const API_URL = 'https://jsonplaceholder.typicode.com';
let postsArray = [];
let rowsPerPage = 8;
let textToSearch = null;
let userId = null;

const fetchPosts = async () => {
  const res = await fetch(`${API_URL}/posts`);
  const posts = await res.json();
  localStorage.setItem('posts', JSON.stringify(posts));
};

fetchPosts();

const getLocalStorage = () => {
  const parsedPosts = JSON.parse(localStorage.getItem('posts'));
  if (!parsedPosts) {
    postsArray = [];
  } else {
    postsArray = parsedPosts;
  }
};

const updateLocalStorage = (arr) => {
  localStorage.setItem('posts', JSON.stringify(arr));
};

const renderPosts = () => {
  getLocalStorage();
  let filteredPosts = postsArray.filter((post) => {
    if (
      textToSearch &&
      !(post.body + post.title).toLowerCase().includes(textToSearch)
    ) {
      return false;
    }
    if (userId && post.userId !== userId) return false;
    return true;
  });
  if (!filteredPosts.length) {
    blogContent.innerHTML = '<h2>Posts not found!</h2>';
  } else {
    blogContent.innerHTML = filteredPosts
      .slice(0, rowsPerPage)
      .map(
        (post) =>
          `<div data-id='${post.id}' class="blog">
              <h3 class="blog__title">${post.id} ${post.title.substr(
            0,
            40
          )}</h3>
              <span>User Id: ${post.userId}</span>
              <p class="blog__text">${post.body.substr(0, 70)}</p>
              <div class="blog__btns">
              <button data-id="${
                post.id
              }" class="btn blog__readmore">Read more</button>
              <button data-id="${
                post.id
              }" class="btn blog__remove">Delete Post</button>
              </div>
              <img class='blog__edit' data-modal data-target='${
                post.id
              }' src="../img/pencil.svg" alt="Pencil" />
      </div>`
      )
      .join('');
  }

  const readMoreBtns = blogContent.querySelectorAll('.blog__readmore');
  const removeBtns = blogContent.querySelectorAll('.blog__remove');

  readMoreBtns.forEach((item) => {
    item.addEventListener('click', () => {
      fetchPostDetails(item);
      paginateBtn.style.display = 'none';
    });
  });

  removeBtns.forEach((item) => {
    item.addEventListener('click', () => {
      const postId = item.getAttribute('data-id');
      deletePost(postId);
    });
  });
};

renderPosts();

const fetchPostDetails = (target) => {
  contentHeader.style.display = 'none';
  blogContent.classList.add('none-grid');
  let postId = target.getAttribute('data-id');
  if (postId) {
    blogContent.classList.add('active');
    blogContent
      .querySelectorAll('.blog')
      .forEach((blog) => blog.classList.add('remove'));
    try {
      // const res = await fetch(`${API_URL}/posts/${postId}`);
      // const post = await res.json();
      const post = postsArray.find((item) => item.id === Number(postId));
      displayPostDetails(post);
    } catch (e) {
      console.log(e);
      blogContent.innerHTML = '<h2>Oop! Something went wrong</h2>';
    }
  }
};

const displayPostDetails = async (post) => {
  blogContent.innerHTML = `  <h3>Post Id ${post.id}</h3> 
                    <h3 class="title">${post.title}</h3>
                    <p class="single-post-desc">${post.body} post id ${post.id}</p>
                    <span>User Id: ${post.userId}</span>
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
};

const initializeEdit = (target) => {
  modal.classList.add('open');
  const id = target.getAttribute('data-id');
  const post = postsArray.find((item) => item.id === Number(id));
  title.value = post.title;
  body.value = post.body;
  submitBtn.setAttribute('data-ref-id', id);
};

const updatePost = () => {
  let postId = submitBtn.getAttribute('data-ref-id');

  for (item of postsArray) {
    if (item.id === Number(postId)) {
      item.title = title.value;
      item.body = body.value;
    }
  }
  updateLocalStorage(postsArray);
  renderPosts();
  modal.classList.remove('open');
};

const deletePost = (id) => {
  const filteredItems = postsArray.filter((item) => item.id !== Number(id));
  updateLocalStorage(filteredItems);
  renderPosts();
};

document.addEventListener('click', (e) => {
  if (e.target.dataset.close === '') {
    modal.classList.remove('open');
  }
});

postForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!title.value) {
    title.nextElementSibling.textContent = 'Title is required!';
  } else if (!body.value) {
    body.nextElementSibling.textContent = 'Body is required!';
  } else {
    updatePost();
    body.nextElementSibling.textContent = '';
    title.nextElementSibling.textContent = '';
  }
});

blogContent.addEventListener('click', (e) => {
  const targetPost = e.target.parentElement;

  if (e.target.classList.contains('blog__edit')) {
    initializeEdit(targetPost);
  }
});

queryField.addEventListener('input', (e) => {
  textToSearch = e.target.value.trim().toLowerCase() || null;
  renderPosts();
});

userIdQuery.addEventListener('input', (e) => {
  userId = e.target.valueAsNumber;
  renderPosts();
});

paginateBtn.addEventListener('click', () => {
  rowsPerPage += rowsPerPage;
  renderPosts();
});
