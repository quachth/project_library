/* Authors and Group: Theresa Quach and Lianghui Wang - Group 29
Course: CS340
Project Name: Project Library
Citation(s): 
    Date: 3/3/24
    Adapted from the starter code template from the github Nodejs starter app guide provided by Professor Curry and Professor Safonte from Oregon State University.
    Appropriate variables were changed for deleteAuthors.js function.
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
*/

function deleteAuthor(authorID) {
    // Put data to be sent in js object
    let data = {
        authorID: authorID
    };

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-author", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX req how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState  == 4 && xhttp.status == 204) {
            // Delete row from table
            deleteRow(authorID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input")
        }
    }
    // Send request and wait for response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(authorID) {
/*    let table = document.getElementById("authorsTable");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate through rows and delete the ones that match id
        if (table.rows[i].getAttribute("data-value") == authorID) {
            table.deleteRow(i);
            break;
        }
    }
*/
    // reloads page to display updated information on table
    location.reload();
}