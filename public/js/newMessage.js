const userSearch = document.querySelector("input#userSearch");
const userContainer = document.querySelector(".followContainer");
const selectedUsersContainer = document.querySelector("#selectedUsers");
const createChat = document.querySelector("button#createChat");

let timer;
let selectedUsers = [];

userContainer.innerHTML = `<h4 class="nothing">Please, Search with a keyword</h4>`;

userSearch.addEventListener("input", function (e) {
  clearTimeout(timer);
  const searchText = this.value.trim();
  if (searchText) {
    timer = setTimeout(() => {
      const url = `${window.location.origin}/users?searchText=${searchText}`;
      userContainer.innerHTML = `<div style='margin-top:15px;display:flex;justify-content:center'><div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div></div>`;
      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          userContainer.innerHTML = "";
          if (!data.length) {
            return (userContainer.innerHTML = `<h4 class="nothing">NO RESULT FOUND😭, Search Again</h4>`);
          }

          data.forEach((userData) => {
            if (
              selectedUsers.some(
                (selectedUser) => selectedUser._id === userData._id
              ) ||
              userData._id === user._id
            ) {
              return;
            }
            const html = createFollowElement(userData, true);
            html.addEventListener("click", function () {
              selectedUsers.push(userData);
              html.remove();
              userSearch.value = "";
              userSearch.focus();
              userContainer.innerHTML = "";
              displaySelectedUsers(selectedUsers);
            });
            userContainer.appendChild(html);
          });
        });
    }, 1000);
  }
});

function displaySelectedUsers(selectedUsers) {
  if (selectedUsers.length) {
    createChat.disabled = false;
  } else {
    createChat.disabled = true;
  }
  selectedUsersContainer.innerHTML = "";

  selectedUsers.forEach((selectedUser) => {
    const fullName = selectedUser.firstName + " " + selectedUser.lastName;

    const avatarSrc = selectedUser.avatarProfile
      ? `/uploads/${selectedUser._id}/profile/${selectedUser.avatarProfile}`
      : `/uploads/profile/avatar.png`;

    const div = document.createElement("div");
    div.classList.add("selectedUser");

    div.innerHTML = `<img src=${avatarSrc} alt='avatar'>
                        <span>${fullName}</span>
                        <button onclick='deselectUser(event, "${selectedUser._id}")'><i class="fas fa-times"></i></button>`;

    selectedUsersContainer.appendChild(div);
  });
}

function deselectUser(event, userId) {
  selectedUsers = selectedUsers.filter(
    (selectedUser) => selectedUser._id !== userId
  );

  displaySelectedUsers(selectedUsers);

  event.target.remove();
}

createChat.addEventListener("click", function (e) {
  const url = `${location.origin}/chat`;
  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(selectedUsers),
  })
    .then((r) => r.json())
    .then((data) => {
      if (data._id) {
        location.href = `${location.origin}/messages/${data._id}`;
      } else {
        alert("Something went wrong!");
      }
    });
});
