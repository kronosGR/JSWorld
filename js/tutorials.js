import { getPostsWithTotal, checkIfLoggedIn } from "./be.js";
import { showPaging, TOAST_ERROR, TOAST_MESSAGE, showToastMsg } from "./utils.js";

const tutorialsList = document.querySelector(".tutorials-list");
const tutorialsPaging = document.querySelector("#tutorials-paging");
const sortBy= document.querySelector("#sort-by");
const filterBy = document.querySelector("#filter");

const params = new URLSearchParams(window.location.search);
let page = Number(params.get("page")) || 1;
let totalPages = 0;
let pageSize = 10;

// backup the items
let tutorialItems;

checkIfLoggedIn(document.querySelector(".account-image"));

showPage();

function showPage() {
  const sortBy = sessionStorage.getItem("sortBy") || "date";
  const order = sessionStorage.getItem("order") || "asc";
  fillTutorials(sortBy,order);
  setSelect(sortBy, order);
}

sortBy.addEventListener("change",(e)=>{
  const selected = e.target.value;
  switch (selected) {
    case "date-az":
      sessionStorage.setItem("sortBy","date");
      sessionStorage.setItem("order", "asc");
      fillTutorials("date","asc");
      break;
    case "date-za":
      sessionStorage.setItem("sortBy","date");
      sessionStorage.setItem("order", "desc");
      fillTutorials("date","desc");
      break;
    case "title-za":
      sessionStorage.setItem("sortBy","title");
      sessionStorage.setItem("order", "desc");
      fillTutorials("title","desc");
      break;
    case "title-az":
      sessionStorage.setItem("sortBy","title");
      sessionStorage.setItem("order", "asc");
      fillTutorials("title","asc");
      break;
  }
})

function setSelect(sortBy, order){  
  if (sortBy == "date" && order=="asc")
    document.querySelector("option[value=date-za]").setAttribute("selected", "selected");
  else if (sortBy == "date" && order=="desc")
    document.querySelector("option[value=date-az]").setAttribute("selected", "selected");
  else if (sortBy == "title" && order=="asc")
    document.querySelector("option[value=title-az]").setAttribute("selected", "selected");
  else if (sortBy == "title" && order=="desc")
    document.querySelector("option[value=date-za]").setAttribute("selected", "selected");
}

filterBy.addEventListener("keyup", (e)=>{
  const word = e.target.value;
  const items =  tutorialItems;
  items.forEach(item => {
    if (!item.innerHTML.includes(word)) item.innerHTML ="";
  })
})

/**
 * Shows the tutorial list
 */
async function fillTutorials(sortBy, order) {
  getPostsWithTotal(sortBy, order, page, pageSize)
    .then(res => {
      totalPages = Number(res.headers.get("x-wp-totalPages"));
      showPaging(tutorialsPaging, page, totalPages, "tutorials.html");
      return res.json();
    })
    .then(json => {
      tutorialsList.innerHTML="";
      json.forEach(post => {
        const tutItem = document.createElement("div");
        tutItem.classList.add("tutorial-item");

        let shortDesc = post.content.rendered.substring(0, 200) + "...";
        tutItem.innerHTML = `
        <img src="${post.featured_media_src_url}" alt="${post.title.rendered}">
        <div>
         <h3>${post.title.rendered}</h3>
         <p>${shortDesc}</p>
         <p class="date">${post.date.replace("T"," ")}</p><br><br>
        </div>
        <a href="tutorial.html?id=${post.id}" class="cta">Read</a>
        `;

        tutorialsList.appendChild(tutItem);
      });
      tutorialItems = document.querySelectorAll(".tutorial-item");
    })
    .catch(e => {
      console.log(e);
      showToastMsg("We are sorry something went wrong", TOAST_ERROR);
    });
}
