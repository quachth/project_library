// Get objects we need to modify
let updateAuthorForm = document.getElementById('updateAuthorForm');

// Modify objects we need
updateAuthorForm.addEventListener("submit", function (e) {
    // Prevent form from submitting
    e.preventDefault();

    //Get form fields we need to get data from
    let inputAuthorID = document.getElementById("selectAuthorToUpdate");
    let inputAuthorFirst = document.getElementById("updateAuthorFirst");
    let inputAuthorLast = document.getElementById("updateAuthorLast");
    let inputAuthorNationality = document.getElementById("updateNationality");
    let inputAuthorBirthdate = document.getElementById("updateBirthdate");

    // Get values from the form fields
    let authorIDValue = inputAuthorID.value;
    let authorFirstValue = inputAuthorFirst.value;
    let authorLastValue = inputAuthorLast.value;
    let authorNationalityValue = inputAuthorNationality.value;
    let authorBirthdateValue = inputAuthorBirthdate.value;

    // Input validation - no field can be empty/null, so prevent submission
    if (isNaN(authorIDValue)) {
        console.log("No ID found.")
        return;
    }
    if (authorFirstValue === null || authorFirstValue === "") {
        console.log("No first name input found.")
        return;
    }
    if (authorLastValue === null || authorLastValue === "") {
        console.log("No last name input found.")
        return;
    }
    if (authorNationalityValue === null || authorNationalityValue === "") {
        console.log("No nationality input found.")
        return;
    }
    if (authorBirthdateValue === null || authorBirthdateValue === "") {
        console.log("No birthdate input found.")
        return;
    }
    
    // Put data to send in js object
    let data = {
        authorID: authorIDValue,
        firstName: authorFirstValue,
        lastName: authorLastValue,
        nationality: authorNationalityValue,
        birthdate: authorBirthdateValue
    }

    // Set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-author", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update row on table
            updateRow(xhttp.response, authorIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input");
        }
    }
    // Send request and wait for response
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, authorID) {
    let parsedData = JSON.parse(data);
    let table = document.getElementById("authorsTable");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate through rows and update row with matching authorID with new input
        if (table.rows[i].getAttribute("data-value") == authorID) {
            
            // Get location of row where we found the matching authorID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of author's first name
            let tdFirst = updateRowIndex.getElementsByTagName("td")[1];
            // Get td of author's last name
            let tdLast = updateRowIndex.getElementsByTagName("td")[2];
            // Get td of author's nationality
            let tdNation = updateRowIndex.getElementsByTagName("td")[3];
            // Get td of author's birthdate
            let tdBirth = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign all entered values
            tdFirst.innerHTML = parsedData[0].firstName;
            tdLast.innerHTML = parsedData[0].lastName;
            tdNation.innerHTML = parsedData[0].nationality;
            tdBirth.innerHTML = parsedData[0].birthdate;
        }
    }
}