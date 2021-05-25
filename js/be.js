const BE_URL = "https://jsw.kandz.me/wp-json";
const BE_POSTS = "/wp/v2/posts";
const BE_MEDIA = "/wp/v2/media/";
const BE_SEARCH = "/wp/v2/search?search=";
const BE_TOKEN = "/jwt-auth/v1/token";
const BE_USERS = "/wp/v2/users";
const BE_CONTACT = "/contact-form-7/v1/contact-forms/44/feedback";
const BE_COMMENT = "/wp/v2/comments?post=";
const BE_COMMENTS = "/wp/v2/comments";

export const USER_TOKEN = "user-token";
export const USER_EMAIL = "user-email";
export const USER_ID = "user-id";
export const USER_AVATAR = "user-avatar";
export const USER_FIRST_NAME = "user-first-name";
export const USER_LAST_NAME = "user-last-name";
export const USER_DISPLAY_NAME = "user-display-name";
export const USER_LOGIN = "user-login";

// This is user can only create users. Nothing else!!!
export const RE_USERNAME = "registration";
export const RE_PASSWORD = "123456";

/**
 * check if user is logged in and change the icon
 * @param {object} el element to be changed
 */
export function checkIfLoggedIn(el) {
  if ((sessionStorage.getItem(USER_TOKEN) || "").length > 10) {
    el.src = "/images/account-in.png";
  } else {
    el.src = "/images/account.png";
  }
}

/**
 * deletes a comment
 * @param {string} token 
 * @param {int} comID comment id
 * @returns object
 */
export async function deleteComment(token, comID) {
  try {
    const res = await fetch(BE_URL + BE_COMMENTS + "/" + comID, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
      redirect: "follow",
    });
    return createReturnFeed(res.ok, await res.json());
  } catch (e) {
    console.log(e);
  }
}

/**
 * get the comments by user
 * @param {string} token
 * @param {id} author user id
 * @returns an object with filtered results by author
 */
export async function getCommentsByAuthor(token, author) {
  try {
    const res = await fetch(BE_URL + BE_COMMENTS + "?per_page=100", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
      redirect: "follow",
    });
    let json = await res.json();
    let filtered = json.filter(com => com.author == author);
    return createReturnFeed(res.ok, filtered);
  } catch (e) {
    console.log(e);
  }
}

/**
 * get the comments for a post
 * @param {int} postID
 * @returns data object
 */
export async function getCommentsForBlogPost(postID) {
  try {
    const res = await fetch(BE_URL + BE_COMMENT + postID, {
      method: "GET",
      redirect: "follow",
    });
    return createReturnFeed(res.ok, await res.json());
  } catch (e) {
    console.log(e);
  }
}

/**
 * post a comment to a blog post
 * @param {string} token
 * @param {int} postID  post id
 * @param {string} comment
 * @returns return data object
 */
export async function postComment(token, postID, comment) {
  try {
    const res = await fetch(BE_URL + BE_COMMENT + postID, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify({
        content: comment,
      }),
    });
    return createReturnFeed(res.ok, await res.json());
  } catch (e) {
    console.log(e);
  }
}

export async function getUserDetails2(id) {
  try {
    const res = await fetch(BE_URL + BE_USERS + `/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
      redirect: "follow",
    });
    return createReturnFeed(res.ok, await res.json());
  } catch (e) {
    console.log(e);
  }
}

/**
 * get user info
 * @param {string} token
 * @param {int} id user id
 * @returns an object with status and data from the fetch
 */
export async function getUserDetails(token, id) {
  try {
    const res = await fetch(BE_URL + BE_USERS + `/${id}?context=edit`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      redirect: "follow",
    });
    return createReturnFeed(res.ok, await res.json());
  } catch (e) {
    console.log(e);
  }
}

/**
 * Because I got tired to repeat this process with every fetch
 * I decided to do this function. I hope I will remember to
 * change all the fetch functions
 * @param {boolean} status the status of fetch
 * @param {json} data the data in json
 * @returns an object with the results
 */
function createReturnFeed(status, data) {
  return {
    ok: status,
    data: data,
  };
}

/**
 * update user password
 * @param {string} token
 * @param {int} id user id
 * @param {string} password new password
 * @returns an object with the result
 */
export async function updatePassword(token, id, password) {
  try {
    const res = await fetch(BE_URL + BE_USERS + `/${id}?password=${password}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
    });
    return createReturnFeed(res.ok, await res.json());
  } catch (e) {
    console.log(e);
  }
}

/**
 * send message to BE
 * @param {string} name
 * @param {string} email
 * @param {string} subject
 * @param {string} msg
 * @returns object with the results
 */
export async function sendMessage(name, email, subject, msg) {
  try {
    var data = new FormData();
    data.append("your-name", name);
    data.append("your-email", email);
    data.append("your-subject", subject);
    data.append("your-message", msg);
    const res = await fetch(BE_URL + BE_CONTACT, {
      method: "POST",
      body: data,
      redirect: "follow",
    });
    return createReturnFeed(res.ok, await res.json());
  } catch (e) {
    console.log(e);
  }
}

/**
 * Update a user
 * @param {string} token
 * @param {object} user
 */
export async function updateUser(token, user) {
  try {
    const res = await fetch(BE_URL + BE_USERS + `/${user.id}?context=edit`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        first_name: user.firstName,
        last_name: user.lastName,
        nickname: user.nickname,
        url: user.url,
        description: user.extraInfo,
      }),
      redirect: "follow",
    });
    const feed = {};
    feed.ok = res.ok;
    feed.data = await res.json();
    return feed;
  } catch (e) {
    console.log(e);
  }
}

/**
 * register a new user
 * @param {string} token important, without it no transaction
 * @param {string} username
 * @param {string} email
 * @param {string} password
 */
export async function register(token, username, email, password) {
  try {
    const res = await fetch(BE_URL + BE_USERS, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
      redirect: "follow",
    });
    const feed = {};
    feed.ok = res.ok;
    feed.data = await res.json();
    return feed;
  } catch (err) {
    console.log(err);
  }
}

/**
 * logout by deleting the session storage items
 */
export function logout() {
  sessionStorage.removeItem(USER_TOKEN);
  sessionStorage.removeItem(USER_EMAIL);
  sessionStorage.removeItem(USER_ID);
  sessionStorage.removeItem(USER_AVATAR);
  sessionStorage.removeItem(USER_FIRST_NAME);
  sessionStorage.removeItem(USER_LAST_NAME);
  sessionStorage.removeItem(USER_DISPLAY_NAME);
  sessionStorage.removeItem(USER_LOGIN);
}

/**
 * login to wp and set to session storage all the user info
 * @param {string} username
 * @param {string} password
 * @returns an object
 */
export async function login(username, password) {
  sessionStorage.removeItem(USER_TOKEN);
  sessionStorage.removeItem(USER_EMAIL);
  sessionStorage.removeItem(USER_ID);
  sessionStorage.removeItem(USER_AVATAR);
  sessionStorage.removeItem(USER_FIRST_NAME);
  sessionStorage.removeItem(USER_LAST_NAME);
  sessionStorage.removeItem(USER_DISPLAY_NAME);
  sessionStorage.removeItem(USER_LOGIN);

  try {
    const res = await fetch(BE_URL + BE_TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
      redirect: "follow",
    });
    const json = await res.json();
    const feed = {};
    feed.ok = res.ok;
    feed.data = json;
    if (res.ok) {
      sessionStorage.setItem(USER_TOKEN, json.token);
      sessionStorage.setItem(USER_EMAIL, json.user_email);
      sessionStorage.setItem(USER_ID, json.user_id);
      sessionStorage.setItem(USER_AVATAR, json.user_avatar_url);
      sessionStorage.setItem(USER_FIRST_NAME, json.user_first_name);
      sessionStorage.setItem(USER_LAST_NAME, json.user_last_name);
      sessionStorage.setItem(USER_DISPLAY_NAME, json.user_display_name);
      sessionStorage.setItem(USER_LOGIN, json.user_login);
    }
    return feed;
  } catch (e) {
    console.log(e);
  }
}

/**
 * search for a term in the posts
 * @param {string} search the term to search for
 * @param {string} order asc | desc
 * @param {int} page the page to fetch
 * @param {int} amount the amount per page to fetch
 * @returns a promise with the results
 */
export async function searchPostsWithTotal(search, order, page, amount) {
  const url =
    BE_URL +
    BE_SEARCH +
    `${search}&order=${order}&per_page=${amount}&page=${page}&context=view`;
  const res = await fetch(url);
  return res;
}

/**
 * get a product with product id
 * @param {int} id Post id
 * @returns a json with the product details
 */
export async function getPostWithId(id) {
  const res = await fetch(BE_URL + BE_POSTS + "/" + id);
  const json = await res.json();
  return json;
}

/**
 *
 * @returns promise with the results
 */
export async function getPostsWithTotal(order, page, amount = 10) {
  const url = BE_URL + BE_POSTS + `?order=${order}&per_page=${amount}&page=${page}`;
  const res = await fetch(url);
  return res;
}

/**
 * gets the last 12 posts
 * @param {string} order asc|desc
 * @returns json with the posts
 */
export async function fetchAllPosts(amount, order) {
  const res = await fetch(BE_URL + BE_POSTS + "?per_page=" + amount + "&order=" + order);
  const json = await res.json();
  return json;
}

/**
 * gets the media for one post
 * @param {int} id post id
 */
export async function fetchMediaForPost(id) {
  const res = await fetch(BE_URL + BE_MEDIA + id);
  const json = await res.json();
  return json();
}

/**
 * get the media with a media url
 * @param {string} url the media url of specific post
 * @returns json with the media
 */
export async function fetchMediaWithUrl(url) {
  const res = await fetch(url);
  const json = await res.json();
  return json;
}
