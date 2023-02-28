const URL = "https://jsonplaceholder.typicode.com/users/"
import { sanitizeStringWithTableRows } from "../../utils.js"


export function initUsers() {
  document.getElementById("tbl-body").onclick = showUserDetails
  getAllUsers()
}

export async function getAllUsers() {
  try {
    const usersFromServer = await fetch(URL).then(res => res.json())
    showAllData(usersFromServer)
  }
  catch (err) {
    console.error("UPPPPPS: " + err) //This can be done better - do it
  }
}

function showAllData(data) {
  const tableRowsArray = data.map(user => `
  <tr>                                
    <td>${user.id} </td>              
    <td>${user.name} </td>                     
    <td>${user.address.street} </td>  
    <td>${user.address.city} </td>
    <td>
    <button id="row-btn_${user.id}" type="button"  class="btn btn-sm btn-secondary">Details</button> </td>      
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
  window.router.navigate("find-user?id=" + id)
}
