const URL = "https://jsonplaceholder.typicode.com/users/"
import { sanitizeStringWithTableRows } from "../../utils.js"

//Used to cache data from server
let usersFromServer = []

export function initUsers() {
  document.getElementById("tbl-body").onclick = showUserDetails
  document.getElementById("btn-reload").onclick = reload
  getAndRenderUsers()
}
//Get a single user from the cache (load all users if not already done)
export async function getSingleUserFromCache(id){
  usersFromServer = await getAllUsers()
  return usersFromServer.find(user => user.id == id)
}

async function getAllUsers(){
  return usersFromServer.length > 0 ? usersFromServer : await fetch(URL).then(res => res.json())
}

//When User chooses to reload all users from the server
function reload() {
  usersFromServer = []
  getAndRenderUsers()
}

 //Get all users from the cache or the server is cache is empty, and render them in a table
 async function getAndRenderUsers() {
  try {
    usersFromServer = await getAllUsers();
    renderAllData(usersFromServer)
  }
  catch (err) {
    console.error("UPS: " + err) //This can be done better - do it
  }
}

function renderAllData(data) {
  const tableRowsArray = data.map(user => `
  <tr>                                
    <td>${user.id} </td>              
    <td>${user.name} </td>                     
    <td>${user.address.street} </td>  
    <td>${user.address.city} </td>
    <td>
    <button id="row-btn_${user.id}"  type="button"  class="btn btn-sm btn-secondary">Details</button> </td>      
  </tr>`)
  const tableRowsString = tableRowsArray.join("\n")
  document.getElementById("tbl-body").innerHTML = sanitizeStringWithTableRows(tableRowsString)
}

async function showUserDetails(evt) {
  const target = evt.target
  if (!target.id.startsWith("row-btn_")) {
    return
  }
  const id = target.id.replace("row-btn_", "")
  // @ts-ignore
  window.router.navigate("find-user?id=" + id)
}
