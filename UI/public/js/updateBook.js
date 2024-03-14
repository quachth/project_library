/* Authors and Group: Theresa Quach and Lianghui Wang - Group 29
Course: CS340
Project Name: Project Library
Citation(s): 
    Scope: Function
    Date: 3/3/24
    Adapted from the starter code template from the github Nodejs starter app guide provided by Professor Curry and Professor Safonte from Oregon State University.
    Specifically, code to get data from our form fields and set up the AJAX request was taken from the guide, with appropriate variables changed for updateBook function.
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

    Function to refresh the page after update is our own work.
*/

// Get objects we need to modify
let updateBookForm = document.getElementById('updateBookForm');

// Modify objects we need
updateBookForm.addEventListener("submit", function (e) {
    // Prevent form from submitting
    e.preventDefault();

    //Get form fields we need to get data from
    let inputBookID = document.getElementById("selectBook");
    let inputTitle = document.getElementById("updateTitle");
    let inputAuthor = document.getElementById("selectBookAuthor");
    let inputISBN = document.getElementById("updateISBN");
    let inputPublisher = document.getElementById("selectBookPub");
    let inputGenre = document.getElementById("updateGenre")

    // Get values from the form fields
    let bookIDValue = inputBookID.value;
    let bookTitleValue = inputTitle.value;
    let bookAuthorValue = inputAuthor.value;
    let isbnValue = inputISBN.value;
    let bookPublisherValue = inputPublisher.value;
    let genreValue = inputGenre.value;

    // Input validation - only Publisher can be empty/null, so prevent submission of empty others
    if (isNaN(bookIDValue)) {
        console.log("No ID found.")
        return;
    }
    if (bookTitleValue === null || bookTitleValue === "") {
        console.log("No title input found.")
        return;
    }
    if (bookAuthorValue === null || bookAuthorValue === "") {
        console.log("No author input found.")
        return;
    }
    if (isbnValue === 'null' || isbnValue === "") {
        console.log("No isbn input found.")
        return;
    }
    if (bookPublisherValue === "NULL" || bookPublisherValue === "") {
        bookPublisherValue = "0";
    }
    if (genreValue === null || genreValue === "") {
        console.log("No genre input found.")
        return;
    }
    
    // Put data to send in js object
    let data = {
        bookID: bookIDValue,
        title: bookTitleValue,
        authorID: bookAuthorValue,
        isbn: isbnValue,
        publisherID: bookPublisherValue,
        genre: genreValue
    }

    // Set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-book", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update row on table
            updateRow(xhttp.response, bookIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input");
        }
    }
    // Send request and wait for response
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, bookID) {
/*    let parsedData = JSON.parse(data);
    let table = document.getElementById("booksTable");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate through rows and update row with matching bookID with new input
        if (table.rows[i].getAttribute("data-value") == bookID) {
            
            // Get location of row where we found the matching bookID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of author's first name
            let tdTitle = updateRowIndex.getElementsByTagName("td")[1];
            // Get td of Author
            let tdAuthor = updateRowIndex.getElementsByTagName("td")[2];
            // Get td of ISBN
            let tdISBN = updateRowIndex.getElementsByTagName("td")[3];
            // Get td of Publisher
            let tdPublisher = updateRowIndex.getElementsByTagName("td")[4];
            // Get td of Genre
            let tdGenre = updateRowIndex.getElementsByTagName("td")[5];

            // Reassign all entered values
            tdTitle.innerHTML = parsedData[0].title;
            tdAuthor.innerHTML = parsedData[0].authorID;
            tdISBN.innerHTML = parsedData[0].isbn;
            tdPublisher.innerHTML = parsedData[0].publisherID;
            tdGenre.innerHTML = parsedData[0].genre;
        }
    }
*/
    // reloads page to display updated information on table
    location.reload();
}