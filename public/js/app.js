let ioConnected = false;
const socket = io("http://localhost:3002");

socket.emit("setup", user);
socket.on("connected", () => {
  ioConnected = true;
});

function logoutToggle() {
  let logoutContainer = document.querySelector(".logoutContainer");
  if (logoutContainer.hidden) {
    logoutContainer.hidden = false;
  } else {
    logoutContainer.hidden = true;
  }
}

function deletePost(postId) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const url = `${window.location.origin}/posts/${postId}`;
      fetch(url, {
        method: "DELETE",
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?._id) {
            location.reload();
          } else {
            location.href = "/";
          }
        });
    }
  });
}

function pinPost(postId, pinned) {
  Swal.fire({
    title: "Are you sure?",
    text: pinned
      ? "You are going to unpin the post!"
      : "You can pin only one post!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: pinned ? "Yes, unpin it!" : "Yes, pin it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const url = `${window.location.origin}/posts/${postId}/pin`;
      fetch(url, {
        method: "put",
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?._id) {
            location.reload();
          } else {
            location.href = "/";
          }
        });
    }
  });
}

// creating new tweetHtml
function createTweet(data, pinned) {
  let newData = data;

  let reTweetedHTML = "";
  let replayTo = "";
  let deleteBtn = "";

  if (data?.postData) {
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

  if (data?.replayTo?.tweetedBy?.username) {
    replayTo = `<div class='replayFlag'>
        <p>Replying to @<a href="/profile/${data.replayTo.tweetedBy.username}">${data.replayTo.tweetedBy.username}</a>
      </div>`;
  }

  const {
    likes,
    _id: postId,
    content,
    images: tweetImages,
    retweetUsers,
    replayedPosts,
    tweetedBy: { _id, username, firstName, lastName, avatarProfile },
    createdAt,
    tweetedBy,
  } = newData;

  if (data?.tweetedBy?._id === user._id) {
    let pinBtn = "";
    if (
      window.location.pathname.split("/").includes("profile") &&
      !data.replayTo
    ) {
      pinBtn = `
    <button style='margin-right:10px' onclick="pinPost('${data._id}', ${
        data.pinned
      })" class="deleteBtn ${data.pinned ? "active" : ""}">
    <i class="fas fa-thumbtack"></i>
    </button>
    `;
    }
    deleteBtn = `
    ${pinBtn}
    <button onclick="deletePost('${data._id}')" class="deleteBtn">
        <i class="fas fa-times"></i>
    </button>
    `;
  }

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

  const avatarSrc = avatarProfile
    ? `/uploads/${_id}/profile/${avatarProfile}`
    : `/uploads/profile/avatar.png`;

  let pinFlag = "";

  if (pinned) {
    div.classList.add("pinPost");
    pinFlag = `<div class='pinPostFlag'>
               <i class="fas fa-thumbtack"></i> Pin post
             </div>`;
  }

  let activeTxt = tweetedBy?.activeStatus
    ? "Active Now"
    : new Date(tweetedBy?.lastSeen)?.toLocaleString() != "Invalid Date"
    ? "Last seen: " + new Date(tweetedBy?.lastSeen)?.toLocaleString()
    : "Not recently seen";

  const isActive =
    tweetedBy._id.toString() == user._id.toString() ||
    activeTxt == "Active Now";

  activeTxt = isActive ? "Active now" : activeTxt;

  div.innerHTML = `
    ${reTweetedHTML}
   ${pinFlag}
    <div onclick='openTweet(event,"${postId}")' class='tweet'>
    <div class="avatar_area">
      <div class="img">
        <div class='activeStatus tweetActiveStatus ${
          isActive && "active"
        }' data-activeStatus="${activeTxt}"> </div>
        <img src="${avatarSrc}" alt="avatar" class="avatar" />
      </div>
    </div>
    
    <div class="tweet_body">
      <div class="header">
        <a href="/profile/${username}" class="displayName">${
    firstName + " " + lastName
  }</a>
        <span class="username">@${username}</span> . 
        <div style='flex:1' class="date">${time}</div>
        ${deleteBtn}
      </div>
      ${replayTo}
      <div class="content">${content}</div>
      <div class="images"></div>
      <div class="footer">
        <button data-post='${JSON.stringify(
          data
        )}' onclick="replyBtn(event, '${postId}')" class="replay replay_btn">
          <i class="fas fa-comment"></i>
          <span>${replayedPosts.length || ""}</span>
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

function createFollowElement(data, hideFollowBtn) {
  const name = data.firstName + " " + data.lastName;
  const isFollowing = data?.followers?.includes(user._id);

  let followDiv = "";

  if (data._id !== user._id) {
    followDiv = `
    <button class="follow ${
      isFollowing ? "active" : ""
    }" id="followBtn" onclick="followHandler(event, '${data._id}')">
    ${isFollowing ? "Following" : "Follow"}</button>`;
  }
  const avatarSrc = data.avatarProfile
    ? `/uploads/${data._id}/profile/${data.avatarProfile}`
    : `/uploads/profile/avatar.png`;

  console.log(data.avatarProfile);

  const div = document.createElement("div");
  div.classList.add("follow");

  let activeTxt = data?.activeStatus
    ? "Active Now"
    : new Date(data?.lastSeen)?.toLocaleString() != "Invalid Date"
    ? "Last seen: " + new Date(data?.lastSeen)?.toLocaleString()
    : "Not recently seen";

  const isActive =
    data._id.toString() == user._id.toString() || activeTxt == "Active Now";

  activeTxt = isActive ? "Active now" : activeTxt;

  div.innerHTML = `<div class='avatar'>
                      <div class='activeStatus tweetActiveStatus ${
                        isActive && "active"
                      }' data-activeStatus="${activeTxt}"> </div>
                        <img src="${avatarSrc}">
                    </div>
                    <div class='displayName'>
                        <a href="/profile/${data.username}">
                            <h5>${name}</h5>
                        </a>
                        <span>@${data.username}</span>
                    </div>
                    <div class='followBtn'>
                    ${hideFollowBtn ? "" : followDiv}
                    </div>
                    `;

  return div;
}

function followHandler(e, userId) {
  const url = `${window.location.origin}/profile/${userId}/follow`;
  fetch(url, {
    method: "PUT",
  })
    .then((r) => r.json())
    .then((data) => {
      const followBtn = e.target; // document.querySelector("#followBtn");
      const isFollowing = data.followers.includes(user._id);

      const following = document.querySelector("a.following .value");
      const followers = document.querySelector("a.follower .value");

      if (isFollowing) {
        if (profileUser?._id === user._id) {
          following.textContent = parseInt(following.textContent) + 1;
        }

        followBtn.classList.add("active");
        followBtn.textContent = "Following";
      } else {
        if (profileUser?._id === user._id) {
          following.textContent = parseInt(following.textContent) - 1;
        }

        followBtn.classList.remove("active");
        followBtn.textContent = "Follow";
      }

      if (data._id === profileUser?._id) {
        following.textContent = data.following.length;
        followers.textContent = data.followers.length;
      }
    });
}

function getChatName(users) {
  let chatName = users.map((user) => user.firstName + " " + user.lastName);

  chatName = chatName.join(", ");

  return chatName;
}
