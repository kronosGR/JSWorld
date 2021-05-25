import * as Be from "./be.js";
import * as Utils from "./utils.js";

const regForm = document.querySelector("#registration--form");
const regEmail = document.querySelector("#reg-email");
const regUsername = document.querySelector("#reg-username");
const regPassword = document.querySelector("#reg-password");
const regPassword2 = document.querySelector("#reg-password2");
const regError = document.querySelector("#reg-error");
const regButton = document.querySelector("#registration--form button");
const logForm = document.querySelector("#login--form");
const logUsername = document.querySelector("#log-username");
const logPassword = document.querySelector("#log-password");
const logError = document.querySelector("#log-error");
const page2 = document.querySelector("#page2");

let regUsernameReady = false;
let regEmailReady = false;
let regPassReady = false;
let regPass2Ready = false;

if (sessionStorage.getItem(Be.USER_TOKEN)) {
  window.location.href = "account-details.html";
}

Be.checkIfLoggedIn(document.querySelector(".account-image"));

// login ------->
logForm.addEventListener("submit", e => {
  e.preventDefault();

  Be.login(logUsername.value, logPassword.value).then(res => {
    if (res.ok) window.location.href = "account-details.html";
    else {
      logError.innerHTML = res.data.message.replace(Utils.regexAnchor, "");
      console.log(res.data);
    }
  })
  .catch(e => {
    console.log(e);
    Utils.showToastMsg("We are sorry something went wrong", Utils.TOAST_ERROR);
  })
});

// <------- end of login

// registration ------->
regUsername.addEventListener("blur", e => {
  if (regUsername.value.length < 3) {
    Utils.showError(regUsername, "Minimum 3 characters");
    regUsernameReady = false;
  } else {
    Utils.hideError(regUsername);
    regUsernameReady = true;
  }
  Utils.checkForm(
    regButton,
    regUsernameReady,
    regEmailReady,
    regPassReady,
    regPass2Ready
  );
});

regEmail.addEventListener("blur", e => {
  if (!Utils.regexEmail.test(regEmail.value.toLowerCase())) {
    Utils.showError(regEmail, "Enter a valid email address");
    regEmailReady = false;
  } else {
    Utils.hideError(regEmail);
    regEmailReady = true;
  }
  Utils.checkForm(
    regButton,
    regUsernameReady,
    regEmailReady,
    regPassReady,
    regPass2Ready
  );
});

regPassword.addEventListener("blur", e => {
  if (regPassword.value.length < 6) {
    regPassReady = false;
    Utils.showError(regPassword, "Minimum 6 characters");
  } else {
    Utils.hideError(regPassword);
    regPassReady = true;
  }
  Utils.checkForm(
    regButton,
    regUsernameReady,
    regEmailReady,
    regPassReady,
    regPass2Ready
  );
});

regPassword2.addEventListener("input", e => {
  if (regPassword2.value != regPassword.value) {
    Utils.showError(regPassword2, "The passwords are not the same");
    regPass2Ready = false;
  } else {
    if (regPassword.value != "") {
      Utils.hideError(regPassword2);
      regPass2Ready = true;
    } else {
      Utils.showError(regPassword2, "Passwords do not the match");
      regPass2Ready = false;
    }
  }
  Utils.checkForm(
    regButton,
    regUsernameReady,
    regEmailReady,
    regPassReady,
    regPass2Ready
  );
});

regForm.addEventListener("submit", e => {
  e.preventDefault();

  // login so it can create a user
  // the user can do only one thing, create accounts
  Be.login(Be.RE_USERNAME, Be.RE_PASSWORD)
    .then(res => {
      if (res.ok) {
        //return 200 if login successful
        const token = window.sessionStorage.getItem(Be.USER_TOKEN);
        Be.register(token, regUsername.value, regEmail.value, regPassword.value).then(
          res => {
            if (res.ok) {
              // login to user already created and redirect to
              Be.login(regUsername.value, regPassword.value).then(res => {
                if (res.ok) {
                  // redirect to account-details.page
                  window.location.href = "account-details.html";
                } else {
                  // something went wrong
                  console.log(res.data.message);
                }
              });
            } else {
              // appear the message to the screen
              console.log(res);
              regError.innerHTML = res.data.message;
            }
          }
        );
      } else {
        console.log(res.data.message);
      }
    })
    .catch(err => {
      console.log(err);
      Utils.showToastMsg("We are sorry something went wrong", Utils.TOAST_ERROR);
    });
});
// <------- end of registration
