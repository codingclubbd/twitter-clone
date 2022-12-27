const chatContainer = document.querySelector(".chatContainer");

const loadMessages = async () => {
  const url = `${location.origin}/chat`;
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      if (data.length) {
        data.forEach((chat) => {
          const chatItem = createChatHtml(chat);
          chatContainer.appendChild(chatItem);
        });
      } else {
        chatContainer.innerHTML = `<h4 class="nothing">NO RESULT FOUND😭</h4>`;
      }
    });
};

loadMessages();

function createChatHtml(chatData) {
  const otherUsers = chatData.users.filter((u) => u._id !== user._id);

  let chatName = chatData.chatName;
  chatName = chatName ? chatName : getChatName(otherUsers);

  let chatImage = chatData.chatImage;
  chatImage = chatImage
    ? `<img style='width:100%' src='${chatImage}' alt='Avatar'>`
    : otherUsers.length === 1
    ? `<img style='width:100%' src='${
        otherUsers[0].avatarProfile
          ? "/uploads/" +
            otherUsers[0]._id +
            "/profile/" +
            otherUsers[0].avatarProfile
          : "/uploads/profile/avatar.png"
      }'>`
    : `<img src='${
        otherUsers[0].avatarProfile
          ? "/uploads/" +
            otherUsers[0]._id +
            "/profile/" +
            otherUsers[0].avatarProfile
          : "/uploads/profile/avatar.png"
      }'> <img src='${
        otherUsers[otherUsers.length - 1].avatarProfile
          ? "/uploads/" +
            otherUsers[otherUsers.length - 1]._id +
            "/profile/" +
            otherUsers[otherUsers.length - 1].avatarProfile
          : "/uploads/profile/avatar.png"
      }'>`;

  let latestMessage =
    "<b>Md. Rokibul Hasan:</b> Bangladesh, to the east of India on the Bay of Bengal, is a South Asian country marked by lush greenery and many waterways. Its Padma (Ganges), Meghna and Jamuna rivers create fertile plains, and travel by boat is common. On the southern coast, the Sundarbans, an enormous mangrove forest shared with Eastern India, is home to the royal Bengal tiger. ";

  let isActive = otherUsers.some((otherUser) => otherUser.activeStatus);
  let activeTxt;

  let isGroupChat = chatData.isGroupChat;

  if (!isGroupChat) {
    activeTxt = isActive
      ? "Active Now"
      : new Date(otherUsers[0]?.lastSeen)?.toLocaleString() != "Invalid Date"
      ? "Last seen: " + new Date(otherUsers[0]?.lastSeen)?.toLocaleString()
      : "Not recently seen";
  } else {
    activeTxt = isActive ? "Active Now" : "Away";
  }

  const a = document.createElement("a");
  a.href = `/messages/${chatData._id}`;

  a.innerHTML = `
        <div class='chatItem'>
            <div class='chatImage'>
              <div data-activeStatus="${activeTxt}" class='activeStatus tweetActiveStatus ${
    isActive && "active"
  }'></div>
              ${chatImage}
            </div>
        
        <div class='chatDetails'>
            <h4 class='title'>${chatName}</h4>
            <div class='subText'>
                <p >${latestMessage}</p>
                <span class='time'>06:15PM</span>
            </div>
            
        </div>
        </div>`;

  return a;
}
