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
