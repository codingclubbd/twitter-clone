// selection
const tweetContentTextArea = document.querySelector("textarea#tweetContent");
const tweetBtn = document.querySelector("button.create_tweet_btn");
const postImageInput = document.querySelector("input#postImage");
const imgContainer = document.querySelector(".img_container");
const tweetContainer = document.querySelector(".tweetContainer");

let postImages = [];

// creating new tweetHtml
function createTweet(data) {
  let newData = data;

  let reTweetedHTML = "";

  if (data.postData) {
    newData = data.postData;
    reTweetedHTML =
      data.tweetedBy.username === user.username
        ? `<p class='retweet_display'>
      <i class="fas fa-retweet"></i> You Retweeted
      </p>`
        : `<p class='retweet_display'>
      <i class="fas fa-retweet"></i> Retweeted by @<a href='/profile/${data.tweetedBy.username}'>${data.tweetedBy.username}</a>
      </p>`;
  }

  const {
    likes,
    _id: postId,
    content,
    images: tweetImages,
    retweetUsers,
    tweetedBy: { _id, username, firstName, lastName, avatarProfile },
    createdAt,
  } = newData;

  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return "Just now";
  }

  const time = timeSince(new Date(createdAt).getTime());

  const div = document.createElement("div");

  div.innerHTML = `
  ${reTweetedHTML}
  <div class='tweet'>
  <div class="avatar_area">
    <div class="img">
      <img src="${
        window.location.origin
      }/uploads/profile/${avatarProfile}" alt="avatar" class="avatar" />
    </div>
  </div>
  <div class="tweet_body">
    <div class="header">
      <a href="/profile/${username}" class="displayName">${
    firstName + " " + lastName
  }</a>
      <span class="username">@${username}</span> . 
      <div class="date">${time}</div>
    </div>
    <div class="content">${content}</div>
    <div class="images"></div>
    <div class="footer">
      <button class="replay">
        <i class="fas fa-comment"></i>
        <span>50</span>
      </button>
      <button onclick="retweetHandler(event, '${postId}')" class="retweet ${
    retweetUsers.includes(user._id) ? "active" : ""
  }">
        <i class="fas fa-retweet"></i>
        <span>${retweetUsers.length || ""}</span>
      </button>
      <button  onclick="likeHandler(event, '${postId}')" class="like ${
    user.likes.includes(postId) ? "active" : ""
  }">
        <i class="fas fa-heart"></i>
        <span>${likes.length ? likes.length : ""}</span>
      </button>
    </div>
  </div>
  </div>
  `;

  const imageContainer = div.querySelector("div.images");

  tweetImages?.forEach((img) => {
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("img");
    imgDiv.innerHTML = `<img src="${window.location.origin}/uploads/${_id}/tweets/${img}" alt="" />`;
    imageContainer.appendChild(imgDiv);
  });

  return div;
}

const loadPosts = async () => {
  // http://localhost:3001/posts
  try {
    const result = await fetch(`${window.location.origin}/posts`);
    const posts = await result.json();

    if (!posts.length) {
      return (tweetContainer.innerHTML = `<h4 class="nothing">Nothing to Show</h4>`);
    }

    posts.forEach((post) => {
      const tweetEl = createTweet(post);
      tweetContainer.insertAdjacentElement("afterBegin", tweetEl);
    });
  } catch (error) {}
};

loadPosts();

// submitting the post tweet
tweetBtn.addEventListener("click", function () {
  const content = tweetContentTextArea.value;

  if (!(postImages.length || content)) return;

  const formData = new FormData();
  formData.append("content", content);

  postImages.forEach((file) => {
    formData.append(file.name, file);
  });

  const url = `${window.location.origin}/posts`;
  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((r) => r.json())
    .then((data) => {
      console.log(data);
      const postEl = createTweet(data);
      tweetContainer.insertAdjacentElement("afterbegin", postEl);
      imgContainer.innerHTML = "";
      tweetContentTextArea.value = "";
      tweetBtn.setAttribute("disabled", "");
      tweetBtn.style.background = "#8ecaf3";
      postImages = [];
    })
    .catch((err) => {
      console.log(err);
    });
});

tweetBtn.style.background = "#8ecaf3";
tweetContentTextArea.addEventListener("input", function (e) {
  const val = this.value.trim();

  if (val) {
    tweetBtn.removeAttribute("disabled");
    tweetBtn.style.background = "#1d9bf0";
  } else {
    tweetBtn.setAttribute("disabled", "");
    tweetBtn.style.background = "#8ecaf3";
  }
});

// handle image uploading

postImageInput.addEventListener("change", function (e) {
  const files = this.files;

  [...files].forEach((file) => {
    if (!["image/jpg", "image/png", "image/jpeg"].includes(file.type)) return;

    tweetBtn.removeAttribute("disabled");
    tweetBtn.style.background = "#1d9bf0";
    postImages.push(file);

    const fr = new FileReader();
    fr.onload = function () {
      const htmlElement = document.createElement("div");
      htmlElement.classList.add("img");
      htmlElement.dataset.name = file.name;
      htmlElement.innerHTML = `<span id="cross_btn">
                                    <i class="fas fa-times"></i>
                                  </span><img>`;
      const img = htmlElement.querySelector("img");
      img.src = fr.result;
      imgContainer.appendChild(htmlElement);
    };
    fr.readAsDataURL(file);
  });
});

imgContainer.addEventListener("click", function (e) {
  const crossBtn = e.target.id === "cross_btn" ? e.target : null;
  if (!crossBtn) return;
  const imgEl = crossBtn.parentElement;
  const fileName = imgEl.dataset.name;

  postImages.forEach((file, i) => {
    if (fileName === file.name) {
      console.log(postImages);
      postImages.splice(i, 1);
      imgEl.remove();

      if (!postImages.length && !tweetContentTextArea?.value?.trim()) {
        tweetBtn.setAttribute("disabled", "");
        tweetBtn.style.background = "#8ecaf3";
      }
    }
  });
});

// like handler

function likeHandler(event, postId) {
  const likeBtn = event.target;
  const span = likeBtn.querySelector("span");

  const url = `${window.location.origin}/posts/like/${postId}`;
  fetch(url, {
    method: "PUT",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.likes.includes(user._id)) {
        likeBtn.classList.add("active");
      } else {
        likeBtn.classList.remove("active");
      }
      span.innerText = data.likes.length ? data.likes.length : "";
    });
}

// retweet handler

function retweetHandler(event, postId) {
  const retweetBtn = event.target;
  const span = retweetBtn.querySelector("span");

  const url = `${window.location.origin}/posts/retweet/${postId}`;
  fetch(url, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.retweetUsers.includes(user._id)) {
        retweetBtn.classList.add("active");
      } else {
        retweetBtn.classList.remove("active");
      }
      span.innerText = data.retweetUsers.length || "";
    });
}
