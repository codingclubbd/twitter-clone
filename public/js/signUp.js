const passwordEl = document.querySelector("#password");
const passwordEyeIcon = document.querySelector("#passwordEyeIcon");

const confirmPasswordEl = document.querySelector("#confirmPassword");
const confirmPasswordEyeIcon = document.querySelector(
  "#confirmPasswordEyeIcon"
);

const passErrors = document.querySelector(".passErrors");
passErrors.hidden = true;

// password show and hide handler

function passwordShowAndHide(handler, field) {
  handler.addEventListener("click", function (e) {
    const i = handler.querySelector("i");

    if (i.className === "fas fa-eye") {
      i.className = "fas fa-eye-slash";
      field.type = "text";
    } else {
      i.className = "fas fa-eye";
      field.type = "password";
    }
  });
}

// password
passwordShowAndHide(passwordEyeIcon, passwordEl);
// confirm password
passwordShowAndHide(confirmPasswordEyeIcon, confirmPasswordEl);

// password validator
function validate(p) {
  let errors = [];

  if (p.length < 8) {
    errors.push("8 characters");
  }
  if (p.search(/[a-z]/) < 0) {
    errors.push("1 lowercase letter");
  }
  if (p.search(/[A-Z]/) < 0) {
    errors.push("1 uppercase letter");
  }
  if (p.search(/[0-9]/) < 0) {
    errors.push("1 digit");
  }
  if (p.search(/[\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:\-]/) < 0) {
    errors.push("1 special character");
  }

  return errors;
}

// check password
const checkPassword = (password) => {
  let validationResult = [];
  if (password) {
    validationResult = validate(password);
  } else {
    return;
  }

  if (validationResult.length > 0) {
    const errorMsg =
      "Your password must contain at least " + validationResult.join(",");

    if (password) {
      passErrors.hidden = false;
      passErrors.textContent = errorMsg;
    } else {
      return;
    }
  } else {
    checkConfirmPassword();
  }
};

// checkConfirmPassword
function checkConfirmPassword() {
  if (!(passwordEl.value === confirmPasswordEl.value)) {
    passErrors.hidden = false;
    passErrors.textContent = "Password doesn't match";
  } else {
    checkPassword(passwordEl.value);
  }
}

let typingTimer;
const doneTypingInterval = 500;

passwordEl.addEventListener("keyup", function () {
  clearTimeout(typingTimer);
  passErrors.hidden = true;

  const passInp = passwordEl.value;
  if (passInp) {
    typingTimer = setTimeout(
      () => checkPassword(passwordEl.value),
      doneTypingInterval
    );
  }
});

//on keydown, clear the countdown
passwordEl.addEventListener("keydown", function () {
  clearTimeout(typingTimer);
});

//on keydown, clear the countdown
confirmPasswordEl.addEventListener("keydown", function () {
  clearTimeout(typingTimer);
});

//on keyup, start the countdown
confirmPasswordEl.addEventListener("keyup", function () {
  clearTimeout(typingTimer);
  // reset
  passErrors.hidden = true;

  if (confirmPasswordEl.value) {
    typingTimer = setTimeout(() => checkConfirmPassword(), doneTypingInterval);
  } else {
    return;
  }
});
