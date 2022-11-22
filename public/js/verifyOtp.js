const countDown = document.getElementById("countDown");
const countTimer = document.querySelector("#countDown span");
let minutes = 1;
let seconds = 59;

const timer = setInterval(() => {
  // if seconds and minutes will not be equal 0
  if (!(minutes === 0 && seconds === 0)) {
    seconds--;
  } else {
    // if seconds and minutes will be equal 0, then clear the interval and show "OTP Expired!" and make the text color red
    clearInterval(timer);
    countDown.innerHTML = "OTP Expired!";
    countDown.style.setProperty("color", "#f33838", "important");
  }

  if (seconds === 0) {
    if (!(minutes === 0 && seconds === 0)) {
      seconds = 59;
      minutes = 0;
    }
  }

  if (!(minutes === 0 && seconds === 0)) {
    countTimer.textContent =
      "0" +
      minutes +
      ":" +
      (seconds.toString().length === 1 ? "0" + seconds : seconds);
  }
}, 1000);
