const URL = "https://jsonplaceholder.typicode.com/users/"
import { sanitizeStringWithTableRows } from "../../utils.js"


export function initUsersModal() {
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
    <button id="row-btn_details_${user.id}" type="button"  class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button> 
    <button id="row-btn_delete_${user.id}" type="button"  class="btn btn-sm btn-danger">Delete</button> 
    </td>      
  </tr>`)

  const tableRowsString = tableRowsArray.join("\n")
  document.getElementById("tbl-body").innerHTML = sanitizeStringWithTableRows(tableRowsString)
}

async function showUserDetails(evt) {
  const target = evt.target
  if (!target.id.startsWith("row-btn_")) {
    return
  }
  
  const parts = target.id.split("_");
  const id = parts[2]
  const btnAction = parts[1]
    if (btnAction === "details") {
      document.getElementById("exampleModalLabel").innerText = "Details for user "+id
      const user = await fetch(URL + id).then(res => res.json())
      document.getElementById("modal-body").innerText = 
      JSON.stringify(user,null,2)
      
    } 
    else 
    if (btnAction === "delete")  {
        alert("Here you can DELETE user with id: " + id )
    }
    
}
