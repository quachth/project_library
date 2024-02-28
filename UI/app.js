/* Authors and Group: Theresa Quach and Lianghui Wang - Group 29
Course: CS340
Project Name: Project Library
Citation(s): 
    Date: 2/28/24
    Adapted from the starter code template from the github Nodejs starter app guide provided by Professor Curry and Professor Safonte from Oregon State University.
    Appropriate variables were changed for app.js
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

/*
    SETUP
*/
// Express
var express = require('express');                   // We are using the express library for the web server
var app     = express();                            // We need to instantiate an express object to interact with the server in our code
PORT        = 23459;                                // Set a port number at the top so it's easy to change in the future
//app.js
const{engine} = require('express-handlebars');
var exphbs = require('express-handlebars');                                 // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs", defaultLayout: false}));        // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                                             // Tell express to use the handlebars engine whenever it encounters a *.hbs file. 
app.use(express.json());
app.use(express.urlencoded({exnteded: true}));
app.use(express.static('public'));

//Database
var db = require('../database/db-connector');



/*
    ROUTES
*/

/* Public */
app.use(express.static('public'));

/* Index/Homepage */
app.get('/index.html', function(req, res){
    res.sendFile(__dirname + '/pages/index.html');
});

/* Authors Page */
app.get('/authors.html', function(req, res)                              // This is the basic syntax for what is called a 'route'
    {
        let query1 = "SELECT * FROM Authors;";                           // Browse query for Authors
        db.pool.query(query1, function(error, rows, fields) {
            res.render('Authors', {data: rows});                        // Render the Authors.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
            
        })        
});

/* Books Page */
app.get('/books.html', function(req, res)                                                       // This is the basic syntax for what is called a 'route'
    {
        let query1 = "SELECT bookID, title, CONCAT(Authors.firstName, ' ', Authors.lastName) AS authorName, isbn, Publishers.name AS publisher, genre\
                    FROM Books\
                    INNER JOIN Authors ON Books.authorID = Authors.authorID\
                    INNER JOIN Publishers ON Publishers.publisherID = Books.publisherID;";      // Browse query for Books
        db.pool.query(query1, function(error, rows, fields) {
            res.render('Books', {data: rows});                                                  // Render the Books.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
            
        })        
});

/* Borrowers Page */
app.get('/borrowers.html', function(req, res)                                                   // This is the basic syntax for what is called a 'route'
    {
        let query1 = "SELECT * FROM Borrowers;";                                                // Browse query for Borrowers
        db.pool.query(query1, function(error, rows, fields) {
            res.render('Borrowers', {data: rows});                                              // Render the Borrowers.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
        })        
});

/* Borrowing Records Page */
// Browse/Select
app.get('/borrowingrecords.html', function(req, res)                                                    // This is the basic syntax for what is called a 'route'
    {
        // Query 1 to populate Browse table
        let query1 = "SELECT BorrowingRecords.recordID, CONCAT(Borrowers.firstName, ' ', Borrowers.lastName) AS fullName, BorrowingRecords.borrowDate, BorrowingRecords.returnDate\
                    FROM BorrowingRecords\
                    INNER JOIN Borrowers ON BorrowingRecords.borrowerID = Borrowers.borrowerID\
                    ORDER BY BorrowingRecords.recordID;";         // Browse query for Borrowing Records
        
        // Query 2 to populate dynamic drop down menu/search for Borrower names
        let query2 = "SELECT borrowerID, CONCAT(firstName, ' ', lastName) AS fullName, email FROM Borrowers;";

        db.pool.query(query1, function(error, rows, fields) {

            //Save the records
            let records = rows;

            //Run second query
            db.pool.query(query2, (error, rows, fields) => {
                //Save the borrowers
                let borrowers = rows;
                
                // Render the BorrowingRecords.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
                return res.render('BorrowingRecords', {data: records, borrowers: borrowers});
            })
        })
        

});
// Add record
app.post('/add-record-form', function(req, res){
    //Capture incoming data and parse it back to a JS object
    let data = req.body;

    //Create the query and run it on the database
    query1 = `INSERT INTO BorrowingRecords (borrowerID, borrowDate, returnDate) VALUES ('${data['inputBorrower']}', '${data['newBorrowDate']}', '${data['newReturnDate']}')`;
    db.pool.query(query1, function(error, rows, fields){
        //Check for errors
        if (error) {
            //Log error to terminal and set response 400 to indicate bad request
            console.log(error);
            res.sendStatus(400);
        }
        else {
            query2 = "SELECT BorrowingRecords.recordID, CONCAT(Borrowers.firstName, ' ', Borrowers.lastName) AS fullName, BorrowingRecords.borrowDate, BorrowingRecords.returnDate\
            FROM BorrowingRecords\
            INNER JOIN Borrowers ON BorrowingRecords.borrowerID=Borrowers.borrowerID"; 
            db.pool.query(query2, function(error, rows, fields){
                if(error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    res.redirect('/borrowingrecords.html');
                }
            })
        }
    })
});
// Delete record
app.delete('/delete-record-form', function(req, res, next){

    let data = req.body;
    let recordID = parseInt(data.id);
    let deleteBorrowingRecord = "DELETE FROM BorrowingRecords WHERE recordID = ?";
    let deleteBorrowingRecordItems = "DELETE FROM BorrowingRecordItems WHERE recordID = ?";


    // Run query - deletion will cascade on intersection table
    db.pool.query(deleteBorrowingRecord, [recordID], function(error, rows, fields){
        if (error){
            // Log error to terminal and send visitor and HTTP response 400 indicating a bad request
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
});
// Update Record
app.put('/update-record-form', function(req, res, next){
    let data = req.body;
    let recordID = parseInt(data.recordID);

    let queryUpdateReturnDate = "UPDATE BorrowingRecords SET returnDate = CURDATE() WHERE BorrowingRecords.recordID = ?";
    let queryShowUpdate = "SELECT * FROM BorrowingRecords WHERE recordID = ?";

    // Run query
    db.pool.query(queryUpdateReturnDate, [recordID], function(error, rows, fields){
        if (error) {
            // Log error to terminal and send back HTTP response 400
            console.log(error);
            res.sendStatus(400);
        }
        else {
            // If no error, run second query to update table on the front end
            db.pool.query(queryShowUpdate, [recordID], function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
});

/* Borrowing Record Items Page */
app.get('/borrowingrecorditems.html', function(req, res)                                                   // This is the basic syntax for what is called a 'route'
    {
        let query1 = "SELECT BorrowingRecordItems.recordID, BorrowingRecordItems.bookID, Books.title AS title,\
                        CONCAT(Borrowers.firstName, ' ', Borrowers.lastName) AS borrowerName\
                    FROM BorrowingRecordItems\
                    INNER JOIN Books ON BorrowingRecordItems.bookID = Books.bookID\
                    INNER JOIN BorrowingRecords ON BorrowingRecordItems.recordID = BorrowingRecords.recordID\
                    INNER JOIN Borrowers ON BorrowingRecords.borrowerID = Borrowers.borrowerID;";                      // Browse query for Publishers
        db.pool.query(query1, function(error, rows, fields) {
            res.render('BorrowingRecordItems', {data: rows});                                                        // Render the Publishers.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
        })        
});
             
/* Publishers */
app.get('/publishers.html', function(req, res)                                                   // This is the basic syntax for what is called a 'route'
    {
        let query1 = "SELECT * FROM Publishers;";                                                // Browse query for Publishers
        db.pool.query(query1, function(error, rows, fields) {
            res.render('Publishers', {data: rows});                                              // Render the Publishers.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
        })        
});


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});