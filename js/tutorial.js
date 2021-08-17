import {
  getPostWithId,
  checkIfLoggedIn,
  USER_TOKEN,
  getCommentsForBlogPost,
  postComment,
  getUserDetails2
} from "./be.js";
import {
  regexHTML,
  showError,
  hideError,
  posFeedback,
  negFeedback,
  TOAST_MESSAGE,
  TOAST_ERROR,
  showToastMsg,
} from "./utils.js";

const tutorialTitle = document.querySelector(".tutorial-title");
const tutorial = document.querySelector(".tutorial");
const modalWindow = document.querySelector(".modal-window");
const modalWindowImg = document.querySelector(".modal-window--img");
const closetBtn = document.querySelector(".close--btn");
const figCaption = document.querySelector(".modal-window--figcaption");
const backTitleCont = document.querySelector(".back-container a");
const logWarn = document.querySelector("#login-warning");
const comForm = document.querySelector("#comment--form");
const comText = document.querySelector("#comment");
const comBtn = document.querySelector("#comment--form button");
const comFeedback = document.querySelector("#com-feedback");
const commentLit = document.querySelector("#comment-list");
const author = document.querySelector('.author');
const authorImg = document.querySelector('.author--img');
const time = document.querySelector('#date')

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let authorID = 0;
let postDate;

// check the referrer and change the back link title
const referrer = document.referrer;
let backTitle = "";
backTitleCont.setAttribute("href", referrer);
if (referrer.includes("search")) backTitle = "Search";
else if (referrer.includes("tutorial")) backTitle = "Tutorials";
else backTitle = "Home";
backTitleCont.innerHTML =
  '<img src="/images/arrow-left.png" alt="back to tutorials" />' + backTitle;

closetBtn.addEventListener("click", () => {
  modalWindow.classList.remove("modal-window-show");
});

checkIfLoggedIn(document.querySelector(".account-image"));

// show the login warning and the text area for post
if ((sessionStorage.getItem(USER_TOKEN) || "").length > 10) {
  logWarn.style.display = "none";
  comForm.style.display = "block";
} else {
  logWarn.style.display = "block";
  comForm.style.display = "none";
}

fillThePage();
getComments();

async function fillThePage() {
  try {
    const post = await getPostWithId(id);
    const title = post.title.rendered;
    const text = post.content.rendered;
    const imgUrl = post.featured_media_src_url;

    postDate = post.date.replace("T", " ");
    time.innerHTML = " on " +postDate;
    authorID = post.author;

    // set document title
    document.title = "JS World | Tutorial | " + title;

    // fix and set document description
    const shortDesc = text.substring(0, 100);

    const cleanShortDesc = shortDesc.replace(regexHTML, "") + "...";
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", cleanShortDesc);

    // show the article/post
    tutorialTitle.innerHTML = title;
    tutorial.innerHTML = `
    <div class="img-container">
      <img src="${imgUrl}" alt="${title}" class="tutorial--img"> 
    </div>
    <div class="tutorial-content">
    <p>${text}</p>
    </div>
    `;
    modalWindowImg.setAttribute("src", imgUrl);
    modalWindowImg.setAttribute("alt", title);
    figCaption.innerHTML = title;

    const img = document.querySelector(".tutorial--img");
    img.addEventListener("click", () => {
      modalWindow.classList.add("modal-window-show");
    });

    getAuthor();
  } catch (e) {
    console.log(e);
    showToastMsg("We are sorry something went wrong", TOAST_ERROR);
  }
}

comText.addEventListener("input", e => {
  if (comText.value.length < 10) {
    showError(comText, "Minimum 10 characters");
    comBtn.disabled = true;
  } else {
    hideError(comText);
    comBtn.disabled = false;
  }
});

// post comment
comForm.addEventListener("submit", e => {
  e.preventDefault();
  postComment(sessionStorage.getItem(USER_TOKEN), id, comText.value).then(res => {
    if (res.ok) {
      console.log(res);
      posFeedback(comFeedback, "Your comment has been posted.");
      getComments();
      comForm.reset();
      comBtn.disabled = true;
    } else negFeedback(comFeedback, res.data.message);
  });
});

// get the comments for the post
function getComments() {
  commentLit.innerHTML = "";
  getCommentsForBlogPost(id)
    .then(res => {
      if (res.ok) {
        const comments = res.data;
        if (comments.length > 0) {
          // print the posts
          comments.forEach(comment => {
            commentLit.innerHTML += `<div class="comment-container" id="comment${
              comment.id
            }">
        <img src="${comment.author_avatar_urls["48"]}" alt="${comment.author_name}">
        <div class="comment-text">
          ${comment.content.rendered}
          <div>
            <span class="comment-author">${comment.author_name}</span>
            <span class="comment-date">${comment.date.replace("T", "  ")}</span>
          </div>
        </div>
        </div>`;
          });
        } else {
          // show an message
          commentLit.innerHTML = "<span class='msg-nothing'>No comments found</span>";
        }
      } else {
        r;
        // something went bad
      }
    })
    .catch(e => {
      console.log(e);
      showToastMsg("We are sorry something went wrong", TOAST_ERROR);
    });
}


// get author details
function getAuthor(){
  getUserDetails2( authorID)
  .then(res => {
    if (res.ok){
      authorImg.src = res.data.avatar_urls["48"];
      authorImg.setAttribute("alt", res.data.name);
      author.innerHTML = res.data.name
    }
  }) 
  .catch(e => {
    console.log(e)
    showToastMsg("Show went wrong", TOAST_ERROR);
  })
}