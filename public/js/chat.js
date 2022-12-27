const chatImageEl = document.querySelector(".chatImage");
const chatName = document.querySelector(".chatName");

const url = `${location.origin}/chat/${chatId}`;

fetch(url)
  .then((r) => r.json())
  .then((chatData) => {
    if (!chatData._id) {
      const chatHeader = document.querySelector(".chatHeader");
      return (chatHeader.innerHTML = `<h4>${chatData.error}</4>`);
    }

    const otherUsers = chatData.users.filter((u) => u._id !== user._id);

    let chatNameStr = chatData.chatName;
    chatNameStr = chatNameStr ? chatNameStr : getChatName(otherUsers);

    let remainingUsers = "";

    remainingUsers =
      otherUsers.length === 2
        ? ""
        : `<span style='width:40px;height:40px'>${
            otherUsers.length - 2
          }+</span>`;

    let chatImage = chatData.chatImage;
    chatImage = chatImage
      ? `<img style='width:40px;height:40px;display:block' src='${chatImage}' alt='Avatar'>`
      : otherUsers.length === 1
      ? `<img style='width:40px;height:40px;display:block' src='${
          otherUsers[0].avatarProfile
            ? "/uploads/" +
              otherUsers[0]._id +
              "/profile/" +
              otherUsers[0].avatarProfile
            : "/uploads/profile/avatar.png"
        }'>`
      : `<img style='width:40px;height:40px;display:block' src='${
          otherUsers[0].avatarProfile
            ? "/uploads/" +
              otherUsers[0]._id +
              "/profile/" +
              otherUsers[0].avatarProfile
            : "/uploads/profile/avatar.png"
        }'> <img style='width:40px;height:40px;display:block' src='${
          otherUsers[otherUsers.length - 1].avatarProfile
            ? "/uploads/" +
              otherUsers[otherUsers.length - 1]._id +
              "/profile/" +
              otherUsers[otherUsers.length - 1].avatarProfile
            : "/uploads/profile/avatar.png"
        }'>
        ${remainingUsers}`;

    chatName.innerHTML = `<h4 class='chatName'>${chatNameStr}</h4>`;
    chatImageEl.innerHTML = chatImage;
  });
