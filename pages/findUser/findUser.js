import { getSingleUserFromCache } from "../users-navigate/users.js"
//Add id to this URL to get a single user
const URL = "https://jsonplaceholder.typicode.com/users/"

let userDetails = null
let handlersInitialized = false

export async function initFindUser(match) {
  //Clear input field from previous runs
  document.getElementById("user-details").innerHTML = ""
  if (!handlersInitialized) {
    userDetails =document.getElementById("user-details")
    document.getElementById("btn-fetch-user").onclick = getUserFromUserInput
    handlersInitialized = true
  }
  //If ID is provided in the URL, fetch and render the user
  if (match?.params?.id) {
    const id = match.params.id
    const selectedUser = await getSingleUserFromCache(id)
    try {
      renderUser(id, selectedUser)
    } catch (err) {
      userDetails.innerHTML = ""
      appendP(userDetails,"Could not find user: " + id,"color:red")
    }
  }
}

const navigoRoute = "find-user"

//Get the user from the input field and render it
async function getUserFromUserInput() {
  const id = document.getElementById("user-id-input").value
  if (!id) {
    appendP(userDetails,"Please provide an id: " + id,"color:red")
    return
  }
  try {
    renderUser(id)
    //Update the URL in the browser, but do not call the handler (Remove if you don't want this)
    const queryString = "?id=" + id
    window.router.navigate(`/${navigoRoute}${queryString}`, { callHandler: false, updateBrowserURL: true })
  } catch (err) {
    console.log("UPS " + err.message)
  }
}

//Render the user, either using the provided user, or fetch  from the server
async function renderUser(id, selectedUser) {
  try {
    const user = selectedUser ? selectedUser : await fetch(URL + id).then(res => res.json())
    document.getElementById("user-id-input").value = ""
    //jsonplaceholder (the API we are using) returns an empty object for users not found, NOT an error
    if (Object.keys(user).length === 0) {  //checks for an empty object = {}
      throw new Error("No user found for id:" + id)
    }
    userDetails.innerHTML = ""
    //Build the DOM with the user details
    appendP(userDetails, "id: " + user.id)
    appendP(userDetails, "name: " + user.name)
    appendP(userDetails, "email: " + user.email)
    appendP(userDetails, "phone: " + user.phone)
    appendP(userDetails, "street: " + user.address.street)
    appendP(userDetails, "city: " + user.address.city)
    appendP(userDetails, "zipcode: " + user.address.zipcode)
  } catch (err) {
    userDetails.innerHTML = ""
    appendP(userDetails,"Could not find user: " + id,"color:red")
  }
}
//Helper function to append a p-tag to a given parent, with a given text and optional style
function appendP(outerElement, value, style) {
  let p = document.createElement("p");
  p.textContent = value;
  if (style) {
    p.style = style
  }
  outerElement.appendChild(p);
}