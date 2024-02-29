/* Authors and Group: Theresa Quach and Lianghui Wang - Group 29
Course: CS340
Project Name: Project Library - App.js
Citation(s): 
    Starter Code from the github Nodejs starter app guide used to set up the body of the app.js file (https://github.com/osu-cs340-ecampus/nodejs-starter-app)
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

/* Index/Homepage */
app.get('/index.html', function(req, res){
    res.sendFile(__dirname + '/pages/index.html');
});

/* Authors Page */
app.post('/add-author', function(req, res){
    let data = req.body;
    let query = "INSERT INTO Authors (firstName, lastName, nationality, birthdate) VALUES (?, ?, ?, ?)";
    db.pool.query(query, [data.firstName, data.lastName, data.nationality, data.birthdate], function(error, results){
        if(error){
            res.sendStatus(500).send({ error: 'Something failed!' });
        } else {
            res.redirect('/authors.html');
        }
    });
});

app.get('/authors.html', function(req, res)                              // This is the basic syntax for what is called a 'route'
    {
        let query1 = "SELECT * FROM Authors;";                           // Browse query for Authors
        db.pool.query(query1, function(error, rows, fields) {
            res.render('Authors', {data: rows});                        // Render the Authors.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
            
        })        
});

app.put('/update-author/:id', function(req, res) {
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

app.post('/add-book', function(req, res){
    let data = req.body;
    let query = "INSERT INTO Books (title, authorID, isbn, publisherID, genre) VALUES (?, ?, ?, ?, ?)";
    db.pool.query(query, [data.title, data.authorID, data.isbn, data.publisherID, data.genre], function(error, results){
        if(error){
            res.sendStatus(500).send({ error: 'Something failed!' });
        } else {
            res.redirect('/books.html');
        }
    });
});


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

app.post('/add-borrower', function(req, res){
    let data = req.body;
    let query = "INSERT INTO Borrowers (firstName, lastName, email, phoneNum) VALUES (?, ?, ?, ?)";
    db.pool.query(query, [data.firstName, data.lastName, data.email, data.phoneNum], function(error, results){
        if(error){
            res.sendStatus(500).send({ error: 'Something failed!' });
        } else {
            res.redirect('/borrowers.html');
        }
    });
});


app.get('/borrowers.html', function(req, res)                                                   // This is the basic syntax for what is called a 'route'
    {
        let query1 = "SELECT * FROM Borrowers;";                                                // Browse query for Borrowers
        db.pool.query(query1, function(error, rows, fields) {
            res.render('Borrowers', {data: rows});                                              // Render the Borrowers.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
        })        
});

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
app.get('/borrowingrecords.html', function(req, res)                                                    // This is the basic syntax for what is called a 'route'
    {
        // Query 1 to populate Browse table
        let query1 = "SELECT BorrowingRecords.recordID, CONCAT(Borrowers.firstName, ' ', Borrowers.lastName) AS fullName, BorrowingRecords.borrowDate, BorrowingRecords.returnDate\
                    FROM BorrowingRecords\
                    INNER JOIN Borrowers ON BorrowingRecords.borrowerID=Borrowers.borrowerID;";         // Browse query for Borrowing Records
        
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

app.post('/add-publisher', function(req, res){
    let data = req.body;
    let query = "INSERT INTO Publishers (name, address, contact) VALUES (?, ?, ?)";
    db.pool.query(query, [data.name, data.address, data.contact], function(error, results, fields){
        if(error){
            res.status(500).send({ error: 'Something failed!' });
        } else {
            res.redirect('/publishers.html');
        }
    });
});


app.get('/publishers.html', function(req, res)                                                   // This is the basic syntax for what is called a 'route'
    {
        let query1 = "SELECT * FROM Publishers;";                                                // Browse query for Publishers
        db.pool.query(query1, function(error, rows, fields) {
            res.render('Publishers', {data: rows});                                              // Render the Publishers.hbs file, and also send the renderer an object where 'data' is equal to the 'rows' we received back from the query
        })        
});

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

app.delete('/delete-publisher', function(req, res){
    let data = req.body;
    let query = "DELETE FROM Publishers WHERE publisherID = ?";
    db.pool.query(query, [data.publisherID], function(error, results, fields){
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