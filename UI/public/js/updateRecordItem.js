/* Authors and Group: Theresa Quach and Lianghui Wang - Group 29
Course: CS340
Project Name: Project Library
Citation(s): 
    Scope: Function
    Date: 3/3/24
    Adapted from the starter code template from the github Nodejs starter app guide provided by Professor Curry and Professor Safonte from Oregon State University.
    Specifically, code to get data from our form fields and set up the AJAX request was taken from the guide, with appropriate variables changed for updateRecordItem function.
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

    Function to refresh the page after update is our own work.
*/

// Get objects we need to modify
let updateRecordItemForm = document.getElementById('updateRecordItemForm');

// Modify objects we need
updateRecordItemForm.addEventListener("submit", function (e) {
    // Prevent form from submitting
    e.preventDefault();

    //Get form fields we need to get data from
    let inputRecordID = document.getElementById("selectBRIRecordID");
    let inputBookID = document.getElementById("selectBRIBookID");
    let inputNewBookID = document.getElementById("selectnewBRIBookID");

    // Get values from the form fields
    let recordIDValue = inputRecordID.value;
    let bookIDValue = inputBookID.value;
    let newBookIDValue = inputNewBookID.value;

    // Input validation - no field can be empty/null, so prevent submission
    if (isNaN(recordIDValue)) {
        console.log("No record ID entered.")
        return;
    }
    if (isNaN(bookIDValue)) {
        console.log("No book ID entered.")
        return;
    }
    if (newBookIDValue === null || newBookIDValue === "") {
        console.log("No new book ID input found.")
        return;
    }
    
    // Put data to send in js object
    let data = {
        recordID: recordIDValue,
        bookID: bookIDValue,
        newBookID: newBookIDValue
    }

    // Set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-record-item", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update row on table
            updateRow(xhttp.response, recordIDValue, bookIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input");
        }
    }
    // Send request and wait for response
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, recordID, bookID) {
/*    let parsedData = JSON.parse(data);
    let table = document.getElementById("borrowingRecordItemsTable");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate through rows and update row with matching recordID AND matching bookID with new input
        if (table.rows[i].getAttribute("data-record") == recordID && table.rows[i].getAttribute("data-book") == bookID) {
            
            // Get location of row where we found the matching authorID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of record ID
            let tdRecordID = updateRowIndex.getElementsByTagName("td")[0]
            // Get td of book ID
            let tdBookID = updateRowIndex.getElementsByTagName("td")[1]

            // Reassign all entered values
            tdRecordID.innerHTML = parsedData[0].recordID;
            tdBookID.innerHTML = parsedData[0].bookID;
        }
    }
*/
    // reloads page to display updated information on table
    location.reload();
}