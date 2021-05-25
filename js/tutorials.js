import { getPostsWithTotal, checkIfLoggedIn } from "./be.js";
import { showPaging, TOAST_ERROR, TOAST_MESSAGE, showToastMsg } from "./utils.js";

const tutorialsList = document.querySelector(".tutorials-list");
const tutorialsPaging = document.querySelector("#tutorials-paging");

const params = new URLSearchParams(window.location.search);
let page = Number(params.get("page")) || 1;
let totalPages = 0;
let pageSize = 10;

checkIfLoggedIn(document.querySelector(".account-image"));

showPage();

function showPage() {
  fillTutorials();
}

/**
 * Shows the tutorial list
 */
async function fillTutorials() {
  getPostsWithTotal("asc", page, pageSize)
    .then(res => {
      totalPages = Number(res.headers.get("x-wp-totalPages"));
      showPaging(tutorialsPaging, page, totalPages, "tutorials.html");
      return res.json();
    })
    .then(json => {
      json.forEach(post => {
        const tutItem = document.createElement("div");
        tutItem.classList.add("tutorial-item");

        let shortDesc = post.content.rendered.substring(0, 200) + "...";
        tutItem.innerHTML = `
        <img src="${post.featured_media_src_url}" alt="${post.title.rendered}">
        <div>
         <h3>${post.title.rendered}</h3>
         <p>${shortDesc}</p><br><br>
        </div>
        <a href="tutorial.html?id=${post.id}" class="cta">Read</a>
        `;

        tutorialsList.appendChild(tutItem);
      });
    })
    .catch(e => {
      console.log(e);
      showToastMsg("We are sorry something went wrong", TOAST_ERROR);
    });
}
