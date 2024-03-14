/* Authors and Group: Theresa Quach and Lianghui Wang - Group 29
Course: CS340
Project Name: Project Library
Citation(s): 
    Date: 2/28/24
    Adapted from the starter code template from the github Nodejs starter app guide provided by Professor Curry and Professor Safonte from Oregon State University.
    Appropriate variables were changed for deleteRecordItem.js function 
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
*/

function deleteRecordItem(recordID, bookID) {

    // Confirm deletion
    if (confirm("Are you sure you want to delete this record item?")) {

        // Put the data to send into a JS object
        let data = {
            recordID: recordID,
            bookID: bookID
        };

        // Setup AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", "/delete-record-item", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        //Tell AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 204) {
                //Delete item from table
                deleteRowItem(recordID, bookID);
            }
            else if (xhttp.readyState == 4 && xhttp.status != 204) {
                console.log("There was an error with the input.");
            }
        }
        
        // Send request and wait for response
        xhttp.send(JSON.stringify(data));
    }
}

function deleteRowItem(recordID, bookID) {
/*    let table = document.getElementById("borrowingRecordItemsTable");

    for (let i=0, row; row = table.rows[i]; i++) {
        // Iterate through rows using row variable assigned in the for loop
        if (table.rows[i].getAttribute("data-record") == recordID && table.rows[i].getAttribute("data-book") == bookID){
            table.deleteRow(i);
            break;
        }
    }
*/
    // reloads page to display updated information on table
    location.reload();
}