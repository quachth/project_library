/* Authors and Group: Theresa Quach and Lianghui Wang - Group 29
Course: CS340
Project Name: Project Library
Citation(s): 
    Date: 2/28/24
    Adapted from the starter code template from the github Nodejs starter app guide provided by Professor Curry and Professor Safonte from Oregon State University.
    Appropriate variables were changed for updateRecord.js function 
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get objects to modify
let updateRecordForm = document.getElementById('updateRecordForm');

// Modify objects we need
updateRecordForm.addEventListener("submit", function (e) {
    if (confirm("Confirm Item(s) return?")) {
        // Prevent form from submitting
        e.preventDefault();

        // Get form fields we need to get data from
        let inputRecordId = document.getElementById("recordReturnId")

        // Get values from form fields
        let recordIdValue = inputRecordId.value;

        // Put data we want to send in js object
        let data = { recordID: recordIdValue };

        // Set up AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/update-record-form", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        // Tell AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                // Add new data to table
                updateRow(xhttp.response, recordIdValue);
                alert("Items have been returned");
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input")
            }  
        } 
        // Send request and wait for response
        xhttp.send(JSON.stringify(data));
    }
})

function updateRow(data, recordID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("borrowingRecordsTable");

    for (let i=0, row; row = table.rows[i]; i++) {
        // Iterate through rows accessed using row variable assigned in for loop
        if (table.rows[i].getAttribute("data-value") == recordID) {
            // Get location of the row where we found matching record ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Get td of return date value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign return date to current date from query
            td.innerHTML = parsedData[0].returnDate;
        }
    }
}