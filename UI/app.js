/* Authors and Group: Theresa Quach and Lianghui Wang - Group 29
Course: CS340
Project Name: Project Library - App.js
Citation(s): 
    Starter Code from the github Nodejs starter app guide used to set up the body of the app.js file and to use handlebar templates (https://github.com/osu-cs340-ecampus/nodejs-starter-app)
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
// Browse Authors Table
app.get('/authors.html', function(req, res) {                              // This is the basic syntax for what is called a 'route'
    // Query 1 to populate authors table
    let queryBrowseAuthors = "SELECT * FROM Authors;";                                  // Browse query for Authors
    //Query 2 to populate dynamic drop down of author names
    let queryDropdownAuthors = "SELECT authorID, CONCAT(firstName, ' ', lastName) AS fullAuthorName, birthdate FROM Authors;";

    db.pool.query(queryBrowseAuthors, function(error, rows, fields) {
        // Save the authors
        let authors = rows;

        db.pool.query(queryDropdownAuthors, function(error, rows, fields){
            // Save shorthand of authors
            let shortenedAuthors = rows;
            return res.render('Authors', {data: authors, authors: shortenedAuthors});                                // Render the Authors.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
        })
        
    })        
});

// Add Author
app.post('/add-author', function(req, res){
    let data = req.body;
    queryAddAuthor = `INSERT INTO Authors (firstName, lastName, nationality, birthdate) VALUES ('${data['newAuthorFirst']}','${data['newAuthorLast']}', '${data['newNationality']}', '${data['newBirthdate']}');`;
    db.pool.query(queryAddAuthor, function(error, rows, fields) {
        if(error){
            res.sendStatus(500).send({ error: 'Something failed!' });
        } else {
            res.redirect('/authors.html');
        }
    });
});

// Update Author
app.put('/update-author/', function(req, res) {
    let data = req.body;
    let authorID = req.params.id;
    let query = "UPDATE Authors SET firstName = ?, lastName = ?, nationality = ?, birthdate = ? WHERE authorID = ?";
    db.pool.query(query, [data.firstName, data.lastName, data.nationality, data.birthdate, authorID], function(error, results, fields) {
        if (error) {
            res.status(500).send({ error: 'Something failed!' });
        }
        res.status(200).send({ success: 'Author updated' });
    });
});

app.post('/delete-author', function(req, res){
    let data = req.body;
    let authorID = req.params.id;
    let query = "DELETE FROM Authors WHERE authorID = ?";
    db.pool.query(query, [data.authorID], function(error, results){
        if(error){
            res.sendStatus(500);
        } else {
            res.redirect('/authors.html');
        }
    });
});


/* Books Page */
// Browse Books
app.get('/books.html', function(req, res)                                                       
    {
        // Query to populate books table
        let queryBrowseBooks = "SELECT bookID, title, CONCAT(Authors.firstName, ' ', Authors.lastName) AS authorName, isbn, Publishers.name AS publisher, genre\
                    FROM Books\
                    INNER JOIN Authors ON Books.authorID = Authors.authorID\
                    LEFT OUTER JOIN Publishers ON Publishers.publisherID = Books.publisherID\
                    ORDER BY Books.bookID;";                                                                                                        // Browse query for Books
        // Query to dynamically populate Authors dropdown menu
        let queryDropdownAuthors = "SELECT authorID, CONCAT(firstName, ' ', lastName) AS fullAuthorName, birthdate FROM Authors;";
        //Query to dynamically populate Authors dropdown menu
        let queryDropdownPubs = "SELECT publisherID, name FROM Publishers;";

        // 1st Query
        db.pool.query(queryBrowseBooks, function(error, rows, fields) {
            let allBooks = rows;
            // 2nd Query
            db.pool.query(queryDropdownAuthors, function(error, rows, fields) {
                let authors = rows;
                // 3rd Query
                db.pool.query(queryDropdownPubs, function(error, rows, fields){
                    let publishers = rows;
                    return res.render('Books', {data: allBooks, authors: authors, publishers: publishers});                                          // Render the Books.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
                })
            })            
        })        
});

// Add Books
app.post('/add-book', function(req, res){
    let data = req.body;
    
    // Capture NULL values from Publisher field
    let publisher = parseInt(data.newBookPub);
    if (isNaN(publisher)) {
        publisher = 'NULL';
    }

    let queryAddBook = `INSERT INTO Books (title, authorID, isbn, publisherID, genre) VALUES ('${data['newTitle']}', '${data['newBookAuthor']}', '${data['newIsbn']}', ${publisher}, '${data['newBookGenre']}')`;
    db.pool.query(queryAddBook, function(error, rows, fields){
        if(error){
            res.sendStatus(500).send({ error: 'Something failed!' });
        } else {
            res.redirect('/books.html');
        }
    });
});

// Update Books
app.post('/update-book', function(req, res){
    let data = req.body;
    let query = "UPDATE Books SET title = ?, authorID = ?, isbn = ?, publisherID = ?, genre = ? WHERE bookID = ?";
    db.pool.query(query, [data.title, data.authorID, data.isbn, data.publisherID, data.genre, data.bookID], function(error, results){
        if(error){
            res.sendStatus(500).send({ error: 'Something failed!' });
        } else {
            res.redirect('/books.html');
        }
    });
});

// Delete Book
app.post('/delete-book', function(req, res){
    let data = req.body;
    let query = "DELETE FROM Books WHERE bookID = ?";
    db.pool.query(query, [data.bookID], function(error, results){
        if(error){
            res.sendStatus(500).send({ error: 'Something failed!' });
        } else {
            res.redirect('/books.html');
        }
    });
});


/* Borrowers Page */
// Browse Borrowers
app.get('/borrowers.html', function(req, res)                                                   // This is the basic syntax for what is called a 'route'
    {
        let query1 = "SELECT * FROM Borrowers;";                                                // Browse query for Borrowers
        db.pool.query(query1, function(error, rows, fields) {
            res.render('Borrowers', {data: rows});                                              // Render the Borrowers.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
        })        
});

// Add Borrowers
app.post('/add-borrower', function(req, res){
    let data = req.body;
    let queryAddBorrower = `INSERT INTO Borrowers (firstName, lastName, email, phoneNum) VALUES ('${data['newBorrowerFirst']}', '${data['newBorrowerLast']}', '${data['newBorrowerEmail']}', '${data['newBorrowerPhone']}')`;
    db.pool.query(queryAddBorrower, function(error, rows, fields){
        if(error){
            res.sendStatus(500).send({ error: 'Something failed!' });
        } else {
            res.redirect('/borrowers.html');
        }
    });
});

// Update Borrowers
app.put('/update-borrower', function(req, res){
    let data = req.body;
    let query = "UPDATE Borrowers SET firstName = ?, lastName = ?, email = ?, phoneNum = ? WHERE borrowerID = ?";
    db.pool.query(query, [data.firstName, data.lastName, data.email, data.phoneNum, data.borrowerID], function(error, results, fields){
        if(error){
            res.status(500).send({ error: 'Something failed!' });
        } else {
            res.redirect('/borrowers.html');
        }
    });
});

// Delete Borrowers
app.delete('/delete-borrower', function(req, res){
    let data = req.body;
    let query = "DELETE FROM Borrowers WHERE borrowerID = ?";
    db.pool.query(query, [data.borrowerID], function(error, results, fields){
        if(error){
            res.status(500).send({ error: 'Something failed!' });
        } else {
            res.redirect('/borrowers.html');
        }
    });
});


/* Borrowing Records Page */
//Browse Records
app.get('/borrowingrecords.html', function(req, res){                                                    // This is the basic syntax for what is called a 'route'
    // Query 1 to populate Browse table
    let query1 = "SELECT BorrowingRecords.recordID, CONCAT(Borrowers.firstName, ' ', Borrowers.lastName) AS fullName, BorrowingRecords.borrowDate, BorrowingRecords.returnDate\
                FROM BorrowingRecords\
                INNER JOIN Borrowers ON BorrowingRecords.borrowerID=Borrowers.borrowerID\
                ORDER BY BorrowingRecords.recordID;";                                                // Browse query for Borrowing Records; Order By is needed to sort table by RecordID, otherwise it sorts by the borrowerID.
    
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

// Add Records
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
            INNER JOIN Borrowers ON BorrowingRecords.borrowerID=Borrowers.borrowerID;" 
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
// Browse Record Items
app.get('/borrowingrecorditems.html', function(req, res)                                                                // This is the basic syntax for what is called a 'route'
    {
        // First query to populate BorrowingRecordItems table
        let queryShowAllRecordItems = "SELECT BorrowingRecordItems.recordID, BorrowingRecordItems.bookID, Books.title AS title,\
                                        CONCAT(Borrowers.firstName, ' ', Borrowers.lastName) AS borrowerName\
                                        FROM BorrowingRecordItems\
                                        INNER JOIN Books ON BorrowingRecordItems.bookID = Books.bookID\
                                        INNER JOIN BorrowingRecords ON BorrowingRecordItems.recordID = BorrowingRecords.recordID\
                                        INNER JOIN Borrowers ON BorrowingRecords.borrowerID = Borrowers.borrowerID\
                                        ORDER BY BorrowingRecordItems.recordID;";                                       // Browse query for Publishers
        
        // Second query to populate dynamic dropdown for RecordIDs
        let queryAllRecordIDs = "SELECT * FROM BorrowingRecords;";

        // Third query to populate dynamic dropdown for Book item
        let queryAllBookItems = "SELECT * FROM Books;";

        // Run first query and save data to populate table
        db.pool.query(queryShowAllRecordItems, function(error, rows, fields) {
            let recordsAndItems = rows;

            //Run second query and save the record IDs
            db.pool.query(queryAllRecordIDs, function(error, rows, fields){
                let records = rows;

                //run third query and save book item IDs
                db.pool.query(queryAllBookItems, function(error, rows, fields) {
                    let items = rows;
                    return res.render('BorrowingRecordItems', {data: recordsAndItems, records: records, items: items});      // Render the Publishers.hbs file, and also send the renderer an object where 'data' is 
                })                                                                                                          // equal to the 'rows' we received back from the query
            })
        })        
});

// Add record item
app.post('/add-record-item-form', function(req, res){
    //Capture incoming data and parse it back to a JS object
    let data = req.body;

    //Create the query and run it on the database
    queryAddRecordItem = `INSERT INTO BorrowingRecordItems (recordID, bookID) VALUES ('${data['recordID']}', '${data['itemID']}');`;
    db.pool.query(queryAddRecordItem, function(error, rows, fields){
        //Check for errors
        if (error) {
            //Log error to terminal and set response 400 to indicate bad request
            console.log(error);
            res.sendStatus(400);

        }
        else {
            queryRefreshAdd = "SELECT BorrowingRecordItems.recordID, BorrowingRecordItems.bookID, Books.title AS title,\
                    CONCAT(Borrowers.firstName, ' ', Borrowers.lastName) AS borrowerName\
                    FROM BorrowingRecordItems\
                    INNER JOIN Books ON BorrowingRecordItems.bookID = Books.bookID\
                    INNER JOIN BorrowingRecords ON BorrowingRecordItems.recordID = BorrowingRecords.recordID\
                    INNER JOIN Borrowers ON BorrowingRecords.borrowerID = Borrowers.borrowerID;";
            db.pool.query(queryRefreshAdd, function(error, rows, fields){
                if(error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    res.redirect('/borrowingrecorditems.html');
                }
            })
        }
    })
});

// Delete record item
app.delete('/delete-record-item', function(req, res, next){
    let data = req.body;
    let recordID = parseInt(data.recordID);
    let bookID = parseInt(data.bookID);

    let queryDeleteRecordItem = "DELETE FROM BorrowingRecordItems WHERE recordID = ? AND bookID = ?;";

    // Run the query
    db.pool.query(queryDeleteRecordItem, [recordID, bookID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
})
             

/* Publishers */
// Browse Publishers
app.get('/publishers.html', function(req, res)                                                   // This is the basic syntax for what is called a 'route'
    {
        let query1 = "SELECT * FROM Publishers;";                                                // Browse query for Publishers
        db.pool.query(query1, function(error, rows, fields) {
            res.render('Publishers', {data: rows});                                              // Render the Publishers.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
        })        
});

// Add Publishers
app.post('/add-publisher', function(req, res){
    let data = req.body;
    let queryAddPublisher = `INSERT INTO Publishers (name, address, contact) VALUES ('${data['newPubName']}', '${data['newPubAddress']}', '${data['newPubContact']}');`;

    db.pool.query(queryAddPublisher, function(error, rows, fields) {
        if(error){
            res.status(500).send({ error: 'Something failed!' });
        } else {
            res.redirect('/publishers.html');
        }
    });
});

// Update Publishers
app.put('/update-publisher', function(req, res){
    let data = req.body;
    let query = "UPDATE Publishers SET name = ?, address = ?, contact = ? WHERE publisherID = ?";
    db.pool.query(query, [data.name, data.address, data.contact, data.publisherID], function(error, results, fields){
        if(error){
            res.status(500).send({ error: 'Something failed!' });
        } else {
            res.redirect('/publishers.html');
        }
    });
});

// Delete Publishers
app.delete('/delete-publisher', function(req, res){
    let data = req.body;
    let query = `DELETE FROM Publishers WHERE publisherID = ${data['publisherID']};`;
    db.pool.query(query, function(error, results, fields){
        if(error){
            res.status(500).send({ error: 'Something failed!' });
        } else {
            res.redirect('/publishers.html');
        }
    });
});


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});