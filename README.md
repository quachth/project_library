CS340 Database Project
Authors: Theresa Quach and Lianghui Wang

Project Library is a simplified library database management system that is intended to be used primarily by the administrators of a small public library to track the books, authors, 
and publishers found within the library system, as well as the library's registered patrons and their borrowing records. As such, every page on this site (Authors, Publishers, Books, Borrowers, and Borrowing Record Items) contains functionality that will allow administrators to View, Add, Update, and Delete entries. The Project consists of a webpage UI built using HTML/CSS and Node.js with CRUD capabilities that allow the library administrative user to alter the information found on a MYSQL Database also created by our group to organize the data for the library.

Note: All HTML files found under UI/pages has been replaced with their respective handlebars found under UI/views.

To start, run 'npm install' on the package.json files found in both the UI and database folders.

Citations:

    app.js
    Scope: Module
    Date: 3/14/2024
    Use: All code found in app.js was adapted from the Starter Code from the github Node.js starter app
        More specifically, code to set up Node.js/Express, to connect our database, and to use handlebars were taken from the Node.js starter guide found in CS340's Week 7 Project Development module on Developing in Node.JS
        Additionally, the code to run SQL queries against the database using 'db.pool.query()' was also taken from the guide
    URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    The code for input validation in our entities is our own work.

    all .hbs handlebar files (main.hbs, Authors.hbs, Books.hbs, Borrowers.hbs, BorrowingRecords.hbs, BorrowingRecordItems.hbs, Publishers.hbs)
    Scope: Function
    Date: 3/3/2024
    Use: Adapted from the starter code template from the github Nodejs starter app guide provided by Professor Curry and Professor Safonte from Oregon State University.
        Code specifically adapted from the guide include portions containing {{handlebar expressions}} and id labels given to the table and forms.
    URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
            Other HTML, including grouping form elements and table elements, represents our own work.

    all public/js files (updateAuthor.js, deleteAuthor.js, updateBook.js, deleteBook.js, updateBorrower.js, deleteBorrower.js, updatePublisher.js, deletePublisher.js, 
                         updateRecord.js, deletedRecord.js, updateRecordItem.js, deleteRecordItem.js)
    Scope: Function
    Date: 3/3/2024
    Use: Adapted from the starter code template from the github Nodejs starter app guide provided by Professor Curry and Professor Safonte from Oregon State University.
        Specifically, code to get data from our form fields and set up the AJAX request was taken from the guide, with appropriate variables changed for each page's specific function.
    Update URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
    Delete URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

    Function to refresh the page after update or deletion within the same JS files is our own work.
