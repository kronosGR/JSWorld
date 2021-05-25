import { searchPostsWithTotal, getPostWithId, checkIfLoggedIn } from "./be.js";
import { showPaging, TOAST_ERROR, TOAST_MESSAGE, showToastMsg } from "./utils.js";

const tutorialsPaging = document.querySelector("#tutorials-paging");
const searchList = document.querySelector(".search-list");
const pageHeading = document.querySelector("main > h1");

const params = new URLSearchParams(window.location.search);
const searchFor = params.get("searchFor") || "";

let page = params.get("page") || 1;
let totalPages = 0;
let pageSize = 10;

pageHeading.innerHTML = "Results for " + searchFor;
document.title += " | " + searchFor;
document
  .querySelector("meta[name='description']")
  .setAttribute("content", "Search results for " + searchFor);

fillResults();

checkIfLoggedIn(document.querySelector(".account-image"));

async function fillResults() {
  searchPostsWithTotal(searchFor, "desc", page, pageSize)
    .then(res => {
      totalPages = Number(res.headers.get("x-wp-totalPages"));
      if (totalPages == 0) page = 0;
      showPaging(tutorialsPaging, page, totalPages, "search.html");
      return res.json();
    })
    .then(json => {
      if (json.length > 0) {
        console.log(json)
        getMedia(json).then(res => {
          res.forEach(post => {
            const searItem = document.createElement("div");
            searItem.classList.add("search-item");

            searItem.innerHTML = `
            <div class="search-item-container">
            <img src="${post.thumb}" alt=${post.title}" class="search--thumb">
            <h3>${post.title}</h3>
            </div>
            <a href="tutorial.html?id=${post.id}" class="cta2">Read</a>
            `;

            searchList.appendChild(searItem);
          });
        });
      } else {
        searchList.innerHTML = `
         <span class='msg-nothing'>No items found</span>
        `;
      }
    })
    .catch(e => {
      console.log(e);
      showToastMsg("We are sorry something went wrong", TOAST_ERROR);
    })
}

/**
 * Gets media for the posts
 * @returns An array
 */
async function getMedia(res) {
  let results = res.map(post => {
    return getPostWithId(post.id).then(pos => {
      const thumb = pos.featured_media_src_url;
      const title = pos.title.rendered;
      const postId = pos.id;
      return { title: title, thumb: thumb, id: postId };
    });
  });
  return Promise.all(results);
}
