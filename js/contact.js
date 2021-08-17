import * as Utils from "./utils.js";
import * as Be from "./be.js";

const contactForm = document.querySelector("#contact--form");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const subject = document.querySelector("#subject");
const message = document.querySelector("#message");
const submitBtn = document.querySelector("#contact--form button");
const log = document.querySelector("#log-error");

let userReady = false;
let emailReady = false;
let subReady = false;
let messageReady = false;

Be.checkIfLoggedIn(document.querySelector(".account-image"));

// fill the fields if user is logged in
if ((sessionStorage.getItem(Be.USER_TOKEN) || "").length > 10) {
  username.value =
    sessionStorage.getItem(Be.USER_FIRST_NAME) +
    " " +
    sessionStorage.getItem(Be.USER_LAST_NAME);
  email.value = sessionStorage.getItem(Be.USER_EMAIL);
  userReady = true;
  emailReady = true;
}

username.addEventListener("blur", e => {
  // min 5 chars
  if (username.value.length < 5) {
    Utils.showError(username, "Minimum 5 characters");
    userReady = false;
  } else {
    Utils.hideError(username);
    userReady = true;
  }
  Utils.checkForm(submitBtn, userReady, emailReady, subReady, messageReady);
});

email.addEventListener("blur", e => {
  // valid email address
  if (!Utils.regexEmail.test(email.value.toLowerCase())) {
    Utils.showError(email, "Enter a valid email address");
    emailReady = false;
  } else {
    Utils.hideError(email);
    emailReady = true;
  }
  Utils.checkForm(submitBtn, userReady, emailReady, subReady, messageReady);
});

subject.addEventListener("blur", e => {
  // min 15 chars
  if (subject.value.length < 15) {
    Utils.showError(subject, "Minimum 15 characters");
    subReady = false;
  } else {
    Utils.hideError(subject);
    subReady = true;
  }
  Utils.checkForm(submitBtn, userReady, emailReady, subReady, messageReady);
});

message.addEventListener("input", e => {
  // min 25 chars
  if (message.value.length < 25) {
    Utils.showError(message, "Minimum 25 characters");
    messageReady = false;
  } else {
    Utils.hideError(message);
    messageReady = true;
  }
  Utils.checkForm(submitBtn, userReady, emailReady, subReady, messageReady);
});

contactForm.addEventListener("submit", e => {
  e.preventDefault();
  Be.sendMessage(username.value, email.value, subject.value, message.value)
    .then(res => {
      if (res.ok) {
        Utils.posFeedback(log, res.data.message);
        contactForm.reset();
      } else {
        Utils.negFeedback(log, res.data.message);
      }
    })
    .catch(e => {
      console.log(e);
      Utils.showToastMsg("We are sorry something went wrong", Utils.TOAST_ERROR);
    });
});
