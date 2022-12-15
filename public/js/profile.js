const tweetContainer = document.querySelector(".tweetContainer");
const updateAvatarInput = document.querySelector("input#updateAvatarInput");
const updateCoverInput = document.querySelector("input#updateCoverInput");
const avatarPreview = document.querySelector("img#avatarPreview");
const coverPreview = document.querySelector("img#coverPreview");
const replayContentTextArea = document.querySelector("textarea#replayContent");
const replayBtn = document.querySelector("button.replayBtn");
const replayImageInput = document.querySelector("input#replayImages");
const replayImgContainer = document.querySelector(".replay_image_container ");
const uploadCoverImage = document.querySelector("button#uploadCoverImage");

let postImages = [];
let cropper;

replayContentTextArea.addEventListener("input", function (e) {
  const val = this.value.trim();

  if (val) {
    replayBtn.removeAttribute("disabled");
    replayBtn.style.background = "#1d9bf0";
  } else {
    replayBtn.setAttribute("disabled", "");
    replayBtn.style.background = "#8ecaf3";
  }
});

replayImageInput.addEventListener("change", function (e) {
  const files = this.files;

  postImages = [];
  [...files].forEach((file) => {
    if (!["image/jpg", "image/png", "image/jpeg"].includes(file.type)) return;

    replayBtn.removeAttribute("disabled");
    replayBtn.style.background = "#1d9bf0";
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
      replayImgContainer.appendChild(htmlElement);
    };
    fr.readAsDataURL(file);
  });
});

replayImgContainer.addEventListener("click", function (e) {
  const crossBtn = e.target.id === "cross_btn" ? e.target : null;
  if (!crossBtn) return;
  const imgEl = crossBtn.parentElement;
  const fileName = imgEl.dataset.name;

  postImages.forEach((file, i) => {
    if (fileName === file.name) {
      postImages.splice(i, 1);
      imgEl.remove();

      if (!postImages.length && !tweetContentTextArea?.value?.trim()) {
        replayBtn.setAttribute("disabled", "");
        replayBtn.style.background = "#8ecaf3";
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

// replay
function replyBtn(event, postId) {
  const replyBtnEl = event.target;
  const postData = JSON.parse(replyBtnEl.dataset.post);
  const modal = document.querySelector("#replayModal");
  const modalBody = modal.querySelector(".modal-body");
  modalBody.innerHTML = "";

  const tweetEl = createTweet(postData);
  modalBody.appendChild(tweetEl);

  replayBtn.addEventListener("click", function (e) {
    const content = replayContentTextArea.value;

    if (!(postImages.length || content)) return;

    const formData = new FormData();
    formData.append("content", content);
    formData.append("postId", postId);

    postImages.forEach((file) => {
      formData.append(file.name, file);
    });

    const url = `${window.location.origin}/posts/replay/${postId}`;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((r) => r.json())
      .then((data) => {
        window.location.reload();
        return console.log(data);
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

  $("#replayModal").modal("toggle");
}

function clearReplayData() {
  replayImgContainer.innerHTML = "";
  replayContentTextArea.value = "";
  replayBtn.setAttribute("disabled", "");
  replayBtn.style.background = "#8ecaf3";
}

function openTweet(event, postId) {
  const targetEl = event.target;
  if (targetEl.localName === "button") return;
  window.location.href = `${window.location.origin}/posts/${postId}`;
}

const loadPosts = async () => {
  // http://localhost:3001/posts
  try {
    const result = await fetch(
      `${window.location.origin}/posts?tweetedBy=${profileUser._id}&replyTo=${tab == "replies"}`
    );
    const posts = await result.json();

    if (!posts.length) {
      return (tweetContainer.innerHTML = `<h4 class="nothing">Nothing to Show</h4>`);
    }

    posts.forEach((post) => {
      const tweetEl = createTweet(post);
      tweetContainer.insertAdjacentElement("afterBegin", tweetEl);
    });

    if(tab=="posts"){

      const pinPostsResult = await fetch(
        `${window.location.origin}/posts?tweetedBy=${profileUser._id}&pinned=true`
      );
      const pinPosts = await pinPostsResult.json();
  
     pinPosts?.forEach((post) => {
      const tweetEl = createTweet(post, true);
      tweetContainer.insertAdjacentElement("afterBegin", tweetEl);
    });

    }




  } catch (error) {}
};

loadPosts();

function followHandler(e, userId) {
  const url = `${window.location.origin}/profile/${userId}/follow`;
  fetch(url, {
    method: "PUT",
  })
    .then((r) => r.json())
    .then((data) => {
      const followBtn = e.target; //document.querySelector("#followBtn");
      const isFollowing = data.followers.includes(user._id);

      const following = document.querySelector("a.following .value");
      const followers = document.querySelector("a.follower .value");

      if (isFollowing) {
        followBtn.classList.add("active");
        followBtn.textContent = "Following";
        following.textContent = data.following.length;
        followers.textContent = data.followers.length;
      } else {
        followBtn.classList.remove("active");
        followBtn.textContent = "Follow";
        following.textContent = data.following.length;
        followers.textContent = data.followers.length;
      }
    });
}






updateAvatarInput.addEventListener("change", function (e) {
  const files = this.files;
  if (files && files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      avatarPreview.src = e.target.result;

      cropper = new Cropper(avatarPreview, {
        aspectRatio: 1 / 1,
        background: false,
      });
    };
    reader.readAsDataURL(files[0]);
  } else {
    console.log("opps!");
  }
});

uploadAvatarImage.addEventListener("click", function (e) {
  const canvas = cropper?.getCroppedCanvas();
  if (canvas) {
    canvas.toBlob((blob) => {
      const fileName = updateAvatarInput?.files[0]?.name;
      const formData = new FormData();
      formData.append("avatar", blob, fileName);
      const url = `${window.location.origin}/profile/avatar`;
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((r) => r.json())
        .then((data) => {
          if (data._id) {
            location.reload();
          }
        });
    });
  } else {
    alert("Please select an image");
  }
});

updateCoverInput.addEventListener("change", function (e) {
  const files = this.files;
  if (files && files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      coverPreview.src = e.target.result;

      cropper = new Cropper(coverPreview, {
        aspectRatio: 16 / 9,
        background: false,
      });
    };
    reader.readAsDataURL(files[0]);
  } else {
    console.log("opps!");
  }
});

uploadCoverImage.addEventListener("click", function (e) {
  const canvas = cropper?.getCroppedCanvas();
  if (canvas) {
    canvas.toBlob((blob) => {
      const fileName = updateCoverInput?.files[0]?.name;
      const formData = new FormData();
      formData.append("avatar", blob, fileName);
      const url = `${window.location.origin}/profile/cover`;
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((r) => r.json())
        .then((data) => {
          if (data._id) {
            location.reload();
          }
        });
    });
  } else {
    alert("Please select an image");
  }
});
