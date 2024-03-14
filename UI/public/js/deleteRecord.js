/* Authors and Group: Theresa Quach and Lianghui Wang - Group 29
Course: CS340
Project Name: Project Library
Citation(s): 
    Scope: Function
    Date: 3/3/24
    Based on the starter code template from the github Nodejs starter app guide provided by Professor Curry and Professor Safonte from Oregon State University.
    Specifically, code to set up the AJAX request was taken from the guide, with appropriate variables changed for deleteRecord function.
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

    Function to refresh the page after deletion is our own work.
*/

function deleteRecord(recordID) {

    if (confirm("Are you sure you want to delete this record?")) {
        // Put data we want to send in a javascript object
        let data = { id: recordID };

        // Set up AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", "/delete-record-form", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 204) {
                // Delete data from the table
                deleteRow(recordID);
            }
            else if (HTMLOutputElement.readyState == 4 && xhttp.status != 204) {
                console.log("There was an error with the input");
            }
        }
        // Send the request and wait for response
        xhttp.send(JSON.stringify(data));
    }
    else {
        alert('Record not deleted.');
    }
}

function deleteRow(recordID) {
/*    let table = document.getElementById("borrowingRecordsTable");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // Iterate through rows, which are accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == recordID) {
            table.deleteRow(i);
            break;
        }
    }
*/
    // reloads page to display updated information on table
    location.reload();
}