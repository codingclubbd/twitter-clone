function followHandler(e, userId) {
  const url = `${window.location.origin}/profile/${userId}/follow`;
  fetch(url, {
    method: "PUT",
  })
    .then((r) => r.json())
    .then((data) => {
      console.log(data);
      const followBtn = e.target; // document.querySelector("#followBtn");
      const isFollowing = data.followers.includes(user._id);

      const following = document.querySelector("a.following .value");
      const followers = document.querySelector("a.follower .value");

      if (isFollowing) {
        if (profileUser._id === user._id) {
          following.textContent = parseInt(following.textContent) + 1;
        }

        followBtn.classList.add("active");
        followBtn.textContent = "Following";
      } else {
        if (profileUser._id === user._id) {
          following.textContent = parseInt(following.textContent) - 1;
        }

        followBtn.classList.remove("active");
        followBtn.textContent = "Follow";
      }

      if (data._id === profileUser._id) {
        following.textContent = data.following.length;
        followers.textContent = data.followers.length;
      }
    });
}

const followers = (profileUser && profileUser.followers) || [];
const following = (profileUser && profileUser.following) || [];

const followContainer = document.querySelector(".followContainer");

if (tab === "followers") {
  followers.forEach((follower) => {
    const html = createFollowElement(follower);
    followContainer.appendChild(html);
  });
} else {
  following.forEach((followingUser) => {
    const html = createFollowElement(followingUser);
    followContainer.appendChild(html);
  });
}

function createFollowElement(data) {
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
    ? `/uploads/${data._id}/profile/${user.avatarProfile}`
    : `/uploads/profile/avatar.png`;

  const div = document.createElement("div");
  div.classList.add("follow");
  div.innerHTML = `<div class='avatar'>
                        <img src="${avatarSrc}">
                    </div>
                    <div class='displayName'>
                        <a href="/profile/${data.username}">
                            <h5>${name}</h5>
                        </a>
                        <span>@${data.username}</span>
                    </div>
                    <div class='followBtn'>
                    ${followDiv}
                    </div>
                    `;

  return div;
}
