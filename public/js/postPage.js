const tweetContainer = document.querySelector(".tweetContainer");
const replayContentTextArea = document.querySelector("textarea#replayContent");
const replayBtn = document.querySelector("button.replayBtn");
const replayImageInput = document.querySelector("input#replayImages");
const replayImgContainer = document.querySelector(".replay_image_container ");

let postImages = [];

const loadPosts = async () => {
  try {
    const result = await fetch(
      `${window.location.origin}/posts/single/${postId}`
    );
    const postData = await result.json();

    if (!postData._id) {
      return (tweetContainer.innerHTML = `<h4 class="nothing">Nothing to Show</h4>`);
    }

    const tweetEl = createTweet(postData);
    tweetContainer.insertAdjacentElement("afterBegin", tweetEl);

    if (postData?.replayedPosts?.length) {
      postData?.replayedPosts?.forEach(async (postId) => {
        const result = await fetch(
          `${window.location.origin}/posts/single/${postId}`
        );
        const postData = await result.json();

        const tweetEl = createTweet(postData);
        tweetContainer.appendChild(tweetEl);
      });
    }
  } catch (error) {}
};

loadPosts();

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
