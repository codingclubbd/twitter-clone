const searchField = document.querySelector("input#searchInput");
const userContainer = document.querySelector(".followContainer");
const tweetContainer = document.querySelector(".tweetContainer");

let timer;
tweetContainer.innerHTML = `<h4 class="nothing">Please, Search with a keyword</h4>`;

searchField.addEventListener("input", function (e) {
  clearTimeout(timer);
  const searchText = this.value.trim();
  if (searchText) {
    timer = setTimeout(() => {
      const url = `${window.location.origin}/${tab}?searchText=${searchText}`;
      tweetContainer.innerHTML = `<div style='margin-top:15px;display:flex;justify-content:center'><div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div></div>`;
      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          tweetContainer.innerHTML = "";
          userContainer.innerHTML = "";
          if (tab == "posts") {
            if (!data.length) {
              return (tweetContainer.innerHTML = `<h4 class="nothing">NO RESULT FOUND😭, Search Again</h4>`);
            }

            data.forEach((post) => {
              const tweetEl = createTweet(post);
              tweetContainer.insertAdjacentElement("afterBegin", tweetEl);
            });
          } else {
            if (!data.length) {
              return (tweetContainer.innerHTML = `<h4 class="nothing">NO RESULT FOUND😭, Search Again</h4>`);
            }
            data.forEach((user) => {
              const html = createFollowElement(user);
              userContainer.appendChild(html);
            });
          }
        });
    }, 1000);
  }
});

function displayContent(data, container) {}
