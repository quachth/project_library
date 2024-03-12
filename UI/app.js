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
app.use(express.urlencoded({extended: true}));
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

    // Validate input
    if (data.newAuthorFirst === null || data.newAuthorFirst === ""){
        console.log('No first name entered.');
        return res.redirect('/authors.html');
    }
    if (data.newAuthorLast === null || data.newAuthorLast === ""){
        console.log('No last name entered.');
        return res.redirect('/authors.html');
    }
    if (data.newNationality === null || data.newNationality === ""){
        console.log('No nationality entered.');
        return res.redirect('/authors.html');
    }
    if (data.newBirthdate === null || data.newBirthdate === ""){
        console.log('No birthdate entered.');
        return res.redirect('/authors.html');
    }


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
app.put('/update-author', function(req, res, next) {
    let data = req.body;

    let authorID = parseInt(data.authorID);
    let firstName = data.firstName;
    let lastName = data.lastName;
    let nationality = data.nationality;
    let birthdate = new Date(data.birthdate);

    let queryUpdateAuthor = `UPDATE Authors SET firstName = ?, lastName= ?, nationality = ?, birthdate = ? WHERE Authors.authorID = ?;`;
    let queryShowUpdate = `SELECT * FROM Authors WHERE Authors.authorID = ?;`;

    // 1st Query
    db.pool.query(queryUpdateAuthor, [firstName, lastName, nationality, birthdate, authorID], function(error, rows, fields) {
        if (error) {
            res.status(500).send({ error: 'Something failed!' });
        }
        else {
            // 2nd Query to send updated rows
            db.pool.query(queryShowUpdate, [authorID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    });
});

// Delete Author
app.delete('/delete-author', function(req, res, next){
    let data = req.body;
    let authorID = parseInt(data.authorID);
    let queryDeleteAuthor = "DELETE FROM Authors WHERE authorID = ?";
    db.pool.query(queryDeleteAuthor, [data.authorID], function(error, rows, fields){
        if(error){
            console.log(error);
            res.sendStatus(500);
        } else {
            res.sendStatus(204);
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
        let queryDropdownPubs = "SELECT publisherID, name FROM Publishers ORDER BY name;";

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
    
    // Input validation - no null/undefined attributes
    if (data.newTitle === null || data.newTitle === "") {
        console.log('No title given.');
        return res.redirect('/books.html');
    }
    if (data.newIsbn === null || data.newIsbn === "") {
        console.log('No ISBN given.');
        return res.redirect('/books.html');
    }
    if (data.newBookGenre === null || data.newBookGenre === "") {
        console.log('No genre given.');
        return res.redirect('/books.html');
    }

    // Capture NULL values from Publisher field
    let publisher = parseInt(data.newBookPub);
    if (isNaN(publisher)) {
        publisher = null;
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
app.put('/update-book', function(req, res, next) {
    let data = req.body;

    let bookID = parseInt(data.bookID);
    let authorID = parseInt(data.authorID);
    let publisherID = parseInt(data.publisherID);
    
    // Change 0 publisherID to null for database
    if (publisherID == 0) {
        publisherID = null;
    };

    let queryUpdateBook = `UPDATE Books SET title = ?, authorID = ?, isbn = ?, publisherID = ?, genre = ? WHERE bookID = ?;`;
    let queryShowUpdate = `SELECT * FROM Books WHERE Books.bookID = ?;`;
    
    // 1st query for update
    db.pool.query(queryUpdateBook, [data.title, authorID, data.isbn, publisherID, data.genre, bookID], function(error, rows, fields) {
        if(error){
            res.sendStatus(500).send({ error: 'Something failed!' });
        } else {
            // 2nd query to send updated row
            db.pool.query(queryShowUpdate, [bookID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    res.send(rows);
                }
            })
        }
    });
});

// Delete Book
app.delete('/delete-book', function(req, res, next){
    let data = req.body;
    let bookID = parseInt(data.bookID);
    let queryDeleteBook = "DELETE FROM Books WHERE bookID = ?";
    db.pool.query(queryDeleteBook, [bookID], function(error, rows, fields){
        if(error){
            console.log(error);
            res.sendStatus(500).send({ error: 'Something failed!' });
        } else {
            res.sendStatus(204);
        }
    });
});


/* Borrowers Page */
// Browse Borrowers
app.get('/borrowers.html', function(req, res)                                                   // This is the basic syntax for what is called a 'route'
    {
        let queryBrowseBorrowers = "SELECT * FROM Borrowers;";                                                // Browse query for Borrowers
        db.pool.query(queryBrowseBorrowers, function(error, rows, fields) {
            res.render('Borrowers', {data: rows});                                              // Render the Borrowers.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
        })        
});

// Add Borrowers
app.post('/add-borrower', function(req, res){
    let data = req.body;

    // Input validation - no null/undefined attributes
    if (data.newBorrowerFirst === null || data.newBorrowerFirst === "") {
        console.log('No first name given.');
        return res.redirect('/borrowers.html');
    }
    if (data.newBorrowerLast === null || data.newBorrowerLast === "") {
        console.log('No last name given.');
        return res.redirect('/borrowers.html');
    }
    if (data.newBorrowerEmail === null || data.newBorrowerEmail === "") {
        console.log('No email given.');
        return res.redirect('/borrowers.html');
    }
    if (data.newBorrowerPhone === null || data.newBorrowerPhone === "") {
        console.log('No phone number given.');
        return res.redirect('/borrowers.html');
    }

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
app.put('/update-borrower', function(req, res, next){
    let data = req.body;

    let borrowerID = parseInt(data.borrowerID);

    let queryUpdateBorrower = `UPDATE Borrowers SET firstName = ?, lastName = ?, email = ?, phoneNum = ? WHERE borrowerID = ?;`;
    let queryShowUpdate = `SELECT * FROM Borrowers WHERE Borrowers.borrowerID = ?;`;
    
    // 1st query to update
    db.pool.query(queryUpdateBorrower, [data.firstName, data.lastName, data.email, data.phoneNum, borrowerID], function(error, rows, fields){
        if(error){
            res.status(500).send({ error: 'Something failed!' });
        } else {
            //2nd query to show update
            db.pool.query(queryShowUpdate, [borrowerID], function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    });
});

// Delete Borrowers
app.delete('/delete-borrower', function(req, res,next){
    let data = req.body;
    let borrowerID = parseInt(data.borrowerID);
    let queryDeleteBorrower = "DELETE FROM Borrowers WHERE borrowerID = ?";
    db.pool.query(queryDeleteBorrower, [borrowerID], function(error, rows, fields){
        if(error){
            console.log(error);
            res.status(500).send({ error: 'Something failed!' });
        } else {
            res.sendStatus(204);
        }
    });
});


/* Borrowing Records Page */
//Browse Records
app.get('/borrowingrecords.html', function(req, res){                                                    // This is the basic syntax for what is called a 'route'
    // Query 1 to populate Browse table
    let query1 = "SELECT BorrowingRecords.recordID, CONCAT(Borrowers.firstName, ' ', Borrowers.lastName) AS fullName,  BorrowingRecords.borrowDate, BorrowingRecords.returnDate\
                FROM BorrowingRecords\
                INNER JOIN Borrowers ON BorrowingRecords.borrowerID=Borrowers.borrowerID\
                ORDER BY BorrowingRecords.recordID;";                                                // Browse query for Borrowing Records; Order By is needed to sort table by RecordID, otherwise it sorts by the borrowerID.
    
    // Query 2 to populate dynamic drop down menu/search for Borrower names
    let query2 = "SELECT borrowerID, CONCAT(firstName, ' ', lastName) AS fullName, email FROM Borrowers ORDER BY lastName, firstName;";

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
    borrowerID = parseInt(data.inputBorrower);

    // Input validation for no null/undefined values
    if (borrowerID === null || borrowerID === 0) {
        console.log('No borrower selected.');
        return res.redirect('/borrowingrecords.html');
    }
    if (data.newBorrowDate === null || data.newBorrowDate === "") {
        console.log('No borrow date specified.');
        return res.redirect('/borrowingrecords.html');
    }
    if (data.newReturnDate === null || data.newReturnDate === "") {
        console.log('No return date specified.');
        return res.redirect('/borrowingrecords.html');
    }

    //Create the query and run it on the database
    queryAddRecord = `INSERT INTO BorrowingRecords (borrowerID, borrowDate, returnDate) VALUES ('${data['inputBorrower']}', '${data['newBorrowDate']}', '${data['newReturnDate']}');`;
    db.pool.query(queryAddRecord, function(error, rows, fields){
        //Check for errors
        if (error) {
            //Log error to terminal and set response 400 to indicate bad request
            console.log(error);
            res.sendStatus(400);
        }
        else {
            queryShowAdd = "SELECT BorrowingRecords.recordID, CONCAT(Borrowers.firstName, ' ', Borrowers.lastName) AS fullName, BorrowingRecords.borrowDate, BorrowingRecords.returnDate\
            FROM BorrowingRecords\
            INNER JOIN Borrowers ON BorrowingRecords.borrowerID=Borrowers.borrowerID;" 
            db.pool.query(queryShowAdd, function(error, rows, fields){
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
        // Browse query for Publishers
        let queryBrowsePublishers = "SELECT * FROM Publishers;";
        db.pool.query(queryBrowsePublishers, function(error, rows, fields) {
            res.render('Publishers', {data: rows});                                              // Render the Publishers.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
        })        
});

// Add Publishers
app.post('/add-publisher', function(req, res){
    let data = req.body;

    // Input validation - no null/undefined attributes
    if (data.newPubName === null || data.newPubName === "") {
        console.log('No name given.');
        return res.redirect('/publishers.html');
    }
    if (data.newPubAddress === null || data.newPubAddress === "") {
        console.log('No address given.');
        return res.redirect('/publishers.html');
    }
    if (data.newPubContact === null || data.newPubContact === "") {
        console.log('No contact information given.');
        return res.redirect('/publishers.html');
    }

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
app.put('/update-publisher', function(req, res, next){
    let data = req.body;

    let publisherID = parseInt(data.publisherID);
    let name = data.name;
    let address = data.address;
    let contact = data.contact;

    let queryUpdatePublisher = `UPDATE Publishers SET name = ?, address = ?, contact = ? WHERE publisherID = ?;`;
    let queryShowUpdate = `SELECT * FROM Publishers WHERE Publishers.publisherID = ?;`;

    // 1st Query
    db.pool.query(queryUpdatePublisher, [name, address, contact, publisherID], function(error, rows, fields){
        if(error){
            res.status(500).send({ error: 'Something failed!' });
        } else {
            // 2nd query to show update
            db.pool.query(queryShowUpdate, [publisherID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    });
});

// Delete Publishers
app.delete('/delete-publisher', function(req, res, next){
    let data = req.body;
    let publisherID = parseInt(data.publisherID);
    let queryDeletePublisher = "DELETE FROM Publishers WHERE publisherID = ? ";
    db.pool.query(queryDeletePublisher, [publisherID], function(error, results, fields){
        if(error){
            res.status(500).send({ error: 'Something failed!' });
        } else {
            res.sendStatus(204);
        }
    });
});


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});