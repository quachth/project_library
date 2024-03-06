/* Authors and Group: Theresa Quach and Lianghui Wang - Group 29
Course: CS340
Project Name: Project Library
Citation(s): 
    Date: 3/3/24
    Adapted from the starter code template from the github Nodejs starter app guide provided by Professor Curry and Professor Safonte from Oregon State University.
    Appropriate variables were changed for updateBorrower.js function 
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
*/

// Get objects we need to modify
let updateBorrowerForm = document.getElementById('updateBorrowerForm');

// Modify objects we need
updateBorrowerForm.addEventListener("submit", function (e) {
    // Prevent form from submitting
    e.preventDefault();

    //Get form fields we need to get data from
    let inputBorrowerID = document.getElementById("selectBorrower");
    let inputBorrowerFirst = document.getElementById("updateBorrowerFirst");
    let inputBorrowerLast = document.getElementById("updateBorrowerLast");
    let inputEmail = document.getElementById("updateEmail");
    let inputPhone = document.getElementById("updatePhone");

    // Get values from the form fields
    let borrowerIDValue = inputBorrowerID.value;
    let borrowerFirstValue = inputBorrowerFirst.value;
    let borrowerLastValue = inputBorrowerLast.value;
    let borrowerEmailValue = inputEmail.value;
    let borrowerPhoneValue = inputPhone.value;

    // Input validation - no field can be empty/null, so prevent submission
    if (isNaN(borrowerIDValue)) {
        console.log("No ID found.")
        return;
    }
    if (borrowerFirstValue === null || borrowerFirstValue === "") {
        console.log("No first name input found.")
        return;
    }
    if (borrowerLastValue === null || borrowerLastValue === "") {
        console.log("No last name input found.")
        return;
    }
    if (borrowerEmailValue === null || borrowerEmailValue === "") {
        console.log("No email input found.")
        return;
    }
    if (borrowerPhoneValue === null || borrowerPhoneValue === "") {
        console.log("No phone number input found.")
        return;
    }
    
    // Put data to send in js object
    let data = {
        borrowerID: borrowerIDValue,
        firstName: borrowerFirstValue,
        lastName: borrowerLastValue,
        email: borrowerEmailValue,
        phoneNum: borrowerPhoneValue,
    }

    // Set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-borrower", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update row on table
            updateRow(xhttp.response, borrowerIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input");
        }
    }
    // Send request and wait for response
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, borrowerID) {
    let parsedData = JSON.parse(data);
    let table = document.getElementById("borrowersTable");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate through rows and update row with matching borrowerID with new input
        if (table.rows[i].getAttribute("data-value") == borrowerID) {
            
            // Get location of row where we found the matching borrowerID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of borrower's first name
            let tdFirst = updateRowIndex.getElementsByTagName("td")[1];
            // Get td of borrower's last name
            let tdLast = updateRowIndex.getElementsByTagName("td")[2];
            // Get td of borrower's email
            let tdEmail = updateRowIndex.getElementsByTagName("td")[3];
            // Get td of borrower's phone number
            let tdPhone = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign all entered values
            tdFirst.innerHTML = parsedData[0].firstName;
            tdLast.innerHTML = parsedData[0].lastName
            tdEmail.innerHTML = parsedData[0].email;
            tdPhone.innerHTML = parsedData[0].phoneNum;
        }
    }
}