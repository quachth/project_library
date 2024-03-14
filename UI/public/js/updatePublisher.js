/* Authors and Group: Theresa Quach and Lianghui Wang - Group 29
Course: CS340
Project Name: Project Library
Citation(s): 
    Scope: Function
    Date: 3/3/24
    Adapted from the starter code template from the github Nodejs starter app guide provided by Professor Curry and Professor Safonte from Oregon State University.
    Specifically, code to get data from our form fields and set up the AJAX request was taken from the guide, with appropriate variables changed for updatePublisher function.
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

    Function to refresh the page after update is our own work.
*/

// Get objects we need to modify
let updatePublisherForm = document.getElementById('updatePublisherForm');

// Modify objects we need
updatePublisherForm.addEventListener("submit", function (e) {
    // Prevent form from submitting
    e.preventDefault();

    //Get form fields we need to get data from
    let inputPublisherID = document.getElementById("selectPublisher");
    let inputPublisherName = document.getElementById("updatePubName");
    let inputPublisherAddress = document.getElementById("updatePubAddress");
    let inputPublisherContact = document.getElementById("updatePubContact");

    // Get values from the form fields
    let pubIDValue = inputPublisherID.value;
    let pubNameValue = inputPublisherName.value;
    let pubAddressValue = inputPublisherAddress.value;
    let pubContactValue = inputPublisherContact.value;

    // Input validation - no field can be empty/null, so prevent submission
    if (isNaN(pubIDValue)) {
        console.log("No ID found.")
        return;
    }
    if (pubNameValue === null || pubNameValue === "") {
        console.log("No name input found.")
        return;
    }
    if (pubAddressValue === null || pubAddressValue === "") {
        console.log("No address input found.")
        return;
    }
    if (pubContactValue === null || pubContactValue === "") {
        console.log("No contact information input found.")
        return;
    }
    
    // Put data to send in js object
    let data = {
        publisherID: pubIDValue,
        name: pubNameValue,
        address: pubAddressValue,
        contact: pubContactValue,
    }

    // Set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-publisher", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update row on table
            updateRow(xhttp.response, pubIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input");
        }
    }
    // Send request and wait for response
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, publisherID) {
/*    let parsedData = JSON.parse(data);
    let table = document.getElementById("publishersTable");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate through rows and update row with matching publisherID with new input
        if (table.rows[i].getAttribute("data-value") == publisherID) {
            
            // Get location of row where we found the matching publisherID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of publisher's name
            let tdName = updateRowIndex.getElementsByTagName("td")[1];
            // Get td of publisher's address
            let tdAddress = updateRowIndex.getElementsByTagName("td")[2];
            // Get td of publisher's contact information
            let tdContact = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign all entered values
            tdName.innerHTML = parsedData[0].name;
            tdAddress.innerHTML = parsedData[0].address;
            tdContact.innerHTML = parsedData[0].contact;
        }
    }
*/
    // reloads page to display updated information on table
    location.reload();
}