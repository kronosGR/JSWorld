// html regex
export const regexHTML = /(<([^>]+)>)/gi;

// email regex
export const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// anchor regex
export const regexAnchor = /<a[^>]*>(.*?)<\/a>/g;

// url regex
export const regexUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

// constants for the shotToastMsg
export const TOAST_ERROR = 0;
export const TOAST_MESSAGE = 1;
/**
 * shows a toast message at the bottom of the screen and disappears after
 * 3 secs. Better than having a div for feedback on every page
 * @param {string} msg message
 */
export function showToastMsg(msg, type) {
  let color;
  if (type == 0) color = "red";
  if (type == 1) color = "var(--blue)";
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.style.cssText = `
    box-sizing: border-box;
    position: fixed;
    width: 100%;
    height: auto;
    bottom: 0;
    left:0;
    padding: 20px;
    background-color: ${color};
    color: white;
    text-align: center;
    overflow-wrap: break-word; 
    z-index:100;
  `;
  toast.innerHTML = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    const tst = document.querySelector(".toast");
    tst.parentNode.removeChild(tst);
  }, 3000);
}

/**
 * checks if all true and enables the element
 * @param {object} element element to be enabled|disabled
 * @param  {...any} bools the values to be checked
 */
export function checkForm(element, ...bools) {
  let statusTrue = false;
  let statusFalse = false;
  for (let bool of bools) {
    if (!bool) {
      statusFalse = true;
    } else {
      statusTrue = true;
    }
  }
  if (statusTrue && !statusFalse) element.disabled = false;
  else element.disabled = true;
}

/**
 * print and changes the style for negative feedback
 * @param {object} el element to change
 * @param {string} msg message to be printed
 */
export function negFeedback(el, msg) {
  el.style.color = "red";
  el.style.fontStyle = "italic";
  el.innerHTML = msg;
}

/**
 * print and changes the style for positive feedback
 * @param {object} el element to change
 * @param {string} msg message to be printed
 */
export function posFeedback(el, msg) {
  el.style.color = "green";
  el.style.fontStyle = "italic";
  el.innerHTML = msg;
}

/**
 * hide the error message
 * @param {object} el the element to be changed
 */
export function hideError(el) {
  if (el.parentNode.contains(el.parentNode.querySelector("span")))
    el.parentNode.removeChild(el.previousSibling);
}

/**
 * Show an error message
 * @param {object} el the element to be changed
 */
export function showError(el, msg) {
  if (!el.parentNode.contains(el.parentNode.querySelector("span"))) {
    const error = document.createElement("span");
    error.innerHTML = msg;
    error.classList.add("error");
    el.parentNode.insertBefore(error, el);
  }
}

/**
 * Show the paging
 * @param {DOM element} element that will be changed
 * @param {int} page current page
 * @param {int} totalPages total pages
 */
export function showPaging(element, page, totalPages, url) {
  if (page > 1) {
    element.innerHTML = `
    <a href="${url}?page=${
      page - 1
    }" ><img src="/images/arrow-left.png" class="arrow-left"></a>
    `;
  } else {
    element.innerHTML = `
    <a href="javascript: void(0)" class="disabled"><img src="/images/arrow-left.png" class="arrow-left"></a>
    `;
  }
  element.innerHTML += `
  <span class="page-number">Page ${page} / ${totalPages}</span>
  `;

  if (page < totalPages) {
    element.innerHTML += `
    <a href="${url}?page=${
      page + 1
    }" ><img src="/images/arrow-right.png" class="arrow-right"></a>
    `;
  } else {
    element.innerHTML += `
    <a href="javascript: void(0)" class="disabled"><img src="/images/arrow-right.png" class="arrow-right"></a>
    `;
  }
}
