
//Add id to this URL to get a single user
const URL = "https://jsonplaceholder.typicode.com/users/"

export async function initFindUser(match) {
  document.getElementById("btn-fetch-user").onclick = fetchUserData
  if (match?.params?.id) {
    const id = match.params.id
    try {
      renderUser(id)
    } catch (err) {
      document.getElementById("error").innerText = "Could not find user: " + id
    }
  }
}

const navigoRoute = "find-user"

async function fetchUserData() {
  document.getElementById("error").innerText = ""
  const id = document.getElementById("user-id-input").value
  if (!id) {
    document.getElementById("error").innerText = "Please provide an id"
    return
  }
  try {
    renderUser(id)
    const queryString = "?id=" + id
    //@ts-ignore  
    window.router.navigate(`/${navigoRoute}${queryString}`, { callHandler: false, updateBrowserURL: true })
  } catch (err) {
    console.log("UPS " + err.message)
  }
}

async function renderUser(id) {
  try {
    const user = await fetch(URL + id).then(res => res.json())
    document.getElementById("user-id-input").value = ""

    //jsonplaceholder returns an empty object for users not found, NOT an error
    if (Object.keys(user).length === 0) {  //checks for an empty object = {}
      throw new Error("No user found for id:" + id)
    }

    document.getElementById("id").innerText = user.id;
    document.getElementById("name").innerText = user.name;
    document.getElementById("email").innerText = user.email;
    document.getElementById("phone").innerText = user.phone;
    document.getElementById("street").innerText = user.address.street;
    document.getElementById("city").innerText = user.address.city;

  } catch (err) {
    document.getElementById("error").innerText = err
  }
}