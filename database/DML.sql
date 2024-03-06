/* Authors and Group: Theresa Quach and Lianghui Wang - Group 29
Course: CS340
Project Name: Project Library - Data Manipulation Queries
*/

/* Dropdown Menus */
-- get all Author IDs, Names, and Birthdates to populate the Authors dropdown
SELECT authorID, CONCAT(firstName, ' ', lastName) AS fullAuthorName, birthdate FROM Authors;

-- get all Publisher IDs and Names to populate the Publishers dropdown
SELECT publisherID, name FROM Publishers ORDER BY name;

-- get all Book IDs and Names to populate the Books dropdown
SELECT bookID, title FROM Books ORDER BY title;

-- get all Borrower IDs and Names to populate the Borrowers dropdown
SELECT borrowerID, CONCAT(firstName, ' ', lastName) AS fullName, email FROM Borrowers ORDER BY lastName, firstName;

-- Fill the dropdown menu for BorrowingRecordItems to select specific borrowing records and books
SELECT * FROM BorrowingRecords;


/*Authors*/
-- get all Authors to populate Authors table
SELECT * from Authors;

-- add new author
INSERT INTO Authors (firstName, lastName, nationality, birthdate) 
VALUES (:firstName, :lastName, :nationality, :birthdate);

-- update authors information
UPDATE Authors 
SET firstName = :firstName, lastName = :lastName, nationality = :nationality, birthdate = :birthdate 
WHERE authorID = :authorID;

-- delete author
DELETE FROM Authors WHERE authorID = :authorID;


/*Publisher*/
-- get all Publishers to populate Publisher table
SELECT * from Publishers

-- add new publisher
INSERT INTO Publishers (name, address, contact) 
VALUES (:name, :address, :contact);

-- update publisher information
UPDATE Publishers 
SET name = :name, address = :address, contact = :contact 
WHERE publisherID = :publisherID;

-- delete publisher
DELETE FROM Publishers WHERE publisherID = :publisherID;


/*Books*/
-- get all books and their author and publisher information
SELECT
    bookID,
    title, 
    CONCAT(Authors.firstName, ' ', Authors.lastName) AS authorName,
    isbn,
    Publishers.name AS publisher,
    genre
FROM 
    Books
INNER JOIN Authors ON Books.authorID = Authors.authorID
LEFT OUTER JOIN Publishers ON Publishers.publisherID = Books.publisherID
ORDER BY Books.bookID;

-- add new book
INSERT INTO Books (title, authorID, isbn, publisherID, genre) 
VALUES (:title, :authorID, :isbn, :publisherID, :genre);

-- update book imformation
UPDATE Books 
SET title = :title, authorID = :authorID, isbn = :isbn, publisherID = :publisherID, genre = :genre 
WHERE bookID = :bookID;

-- delete book
DELETE FROM Books WHERE bookID = :bookID;


/*Borrowers*/
-- display all borrowers on table
SELECT * from Borrowers;

-- add a borrower
INSERT INTO Borrowers (firstName, lastName, email, phoneNum)
VALUES(:firstName, :lastName, :email, :phoneNum)

-- update a borrower
UPDATE Borrowers
SET firstname = :firstName, lastName = :lastName, email = :email, phoneNum = :phoneNum
WHERE borrowerID = :borrowerID;

-- delete a borrower
DELETE FROM Borrowers WHERE borrowerID = :borrowerID;


/*BorrowingRecords*/
-- display borrowing record information on UI table
SELECT BorrowingRecords.recordID, CONCAT(Borrowers.firstName, ' ', Borrowers.lastName) AS fullName,  BorrowingRecords.borrowDate, BorrowingRecords.returnDate
FROM BorrowingRecords
INNER JOIN Borrowers ON BorrowingRecords.borrowerID=Borrowers.borrowerID
ORDER BY BorrowingRecords.recordID;

-- add a borrowing record
INSERT INTO BorrowingRecords (borrowerID, borrowDate, returnDate) 
VALUES (:borrowerID, :borrowDate, :returnDate);

-- update the status of the borrowing record
UPDATE BorrowingRecords
SET returnDate = CURDATE()
WHERE recordID = :recordID;

-- delete a borrowing record
DELETE FROM BorrowingRecords WHERE recordID = :recordID;


/* BorrowingRecordItems*/
-- Display all record items including recordID, bookID, book title, and borrower the record belongs to
SELECT 
    BorrowingRecordItems.recordID, 
    BorrowingRecordItems.bookID, 
    Books.title AS title, 
    CONCAT(Borrowers.firstName, ' ', Borrowers.lastName) AS borrowerName
FROM 
    BorrowingRecordItems
INNER JOIN 
    Books ON BorrowingRecordItems.bookID = Books.bookID
INNER JOIN 
    BorrowingRecords ON BorrowingRecordItems.recordID = BorrowingRecords.recordID
INNER JOIN 
    Borrowers ON BorrowingRecords.borrowerID = Borrowers.borrowerID
ORDER BY 
    BorrowingRecordItems.recordID;

-- adds an item to a borrowing record
INSERT INTO BorrowingRecordItems (recordID, bookID)
VALUES (
    SELECT recordID FROM BorrowingRecords WHERE recordID = :recordID, 
    SELECT bookID FROM Books WHERE bookID = :bookID
);

-- delete an item to a borrowing record
DELETE FROM BorrowingRecordItems WHERE recordID = :recordID AND bookID = :bookID



/*Currently unused queries on UI*/
-- get the details of a single book for updating the form
SELECT 
    title, authorID, isbn, publisherID, genre 
FROM 
    Books 
WHERE 
    bookID = :bookID;

-- find all records from a borrower
SELECT * from BorrowingRecords WHERE borrowerID = :borrowerID;

-- find all books by a particular author
SELECT Books.title, Publishers.name AS PublisherName
FROM Books
JOIN Authors ON Books.authorID = Authors.authorID
JOIN Publishers ON Books.publisherID = Publishers.publisherID
WHERE CONCAT(Authors.firstName, ' ', Authors.lastName) = :authorName
ORDER BY Books.title;

-- find all borrowers of a book
SELECT Borrowers.firstName, Borrowers.lastName, BorrowingRecords.borrowDate
FROM Borrowers
JOIN BorrowingRecords ON Borrowers.borrowerID = BorrowingRecords.borrowerID
JOIN BorrowingRecordItems ON BorrowingRecords.recordID = BorrowingRecordItems.recordID
WHERE BorrowingRecordItems.bookID = :bookID
ORDER BY BorrowingRecords.borrowDate DESC;

-- delete all books from a particular publisher
DELETE FROM Books
WHERE publisherID = (SELECT publisherID FROM Publishers WHERE name = :publisherName);








-- -- some example of using real data
-- --
-- -- For 'Authors' table
-- --

-- -- SELECT
-- SELECT * FROM Authors WHERE lastName = 'Dumas';

-- -- UPDATE
-- UPDATE Authors SET birthdate = '1802-07-24' WHERE authorID = 2;

-- -- DELETE
-- DELETE FROM Authors WHERE lastName = 'Cass';

-- -- INSERT
-- INSERT INTO Authors (firstName, lastName, nationality, birthdate) VALUES 
-- ('Leo', 'Tolstoy', 'Russian', '1828-09-09');


-- --
-- -- For `Publishers` table
-- --


-- -- SELECT
-- SELECT * FROM Publishers WHERE name LIKE '%Classics%';

-- -- UPDATE
-- UPDATE Publishers SET address = '195 Broadway, New York, NY 10007, USA' WHERE name = 'HarperCollins Publishers';

-- -- DELETE
-- DELETE FROM Publishers WHERE name = 'Dover Publications';

-- -- INSERT
-- INSERT INTO Publishers (name, address, contact) VALUES ('Vintage Books', '123 Publishing Ave, Booktown, BK 10101', 'contact@vintagebooks.com');

-- --
-- -- For `Books` table
-- --


-- -- SELECT
-- SELECT * FROM Books WHERE genre = 'novel';

-- -- UPDATE
-- UPDATE Books SET genre = 'historical novel' WHERE title = 'The Count of Monte Cristo';

-- -- DELETE
-- DELETE FROM Books WHERE title = 'The Selection';

-- -- INSERT
-- INSERT INTO Books (title, authorID, isbn, publisherID, genre) VALUES ('War and Peace', 4, '978-0345472403', 4, 'novel');

-- --
-- -- For `Borrowers` table
-- --


-- -- SELECT
-- SELECT * FROM Borrowers WHERE lastName = 'Smith';

-- -- UPDATE
-- UPDATE Borrowers SET email = 'maxsmith1@email.com' WHERE lastName = 'Smith';

-- -- DELETE
-- DELETE FROM Borrowers WHERE firstName = 'Max';

-- -- INSERT
-- INSERT INTO Borrowers (firstName, lastName, email, phoneNum) VALUES ('Jane', 'Doe', 'janedoe@email.com', '999-888-7777');

-- --
-- -- For `BorrowingRecords` table
-- --

-- -- SELECT
-- SELECT * FROM BorrowingRecords WHERE borrowerID = 1;

-- -- UPDATE
-- UPDATE BorrowingRecords SET returnDate = '2024-02-14' WHERE recordID = 1;

-- -- DELETE
-- DELETE FROM BorrowingRecords WHERE recordID = 2;

-- -- INSERT
-- INSERT INTO BorrowingRecords (borrowerID, borrowDate, returnDate) VALUES (2, '2024-03-01', '2024-03-15');

-- --
-- -- For `BorrowingRecordItems` table
-- --


-- -- SELECT
-- SELECT * FROM BorrowingRecordItems WHERE recordID = 3;

-- -- UPDATE
-- UPDATE BorrowingRecordItems SET bookID = 1 WHERE recordItemsID = 2;

-- -- DELETE
-- DELETE FROM BorrowingRecordItems WHERE recordItemsID = 3;

-- -- INSERT
-- INSERT INTO BorrowingRecordItems (recordID, bookID) VALUES (1, 1);



-- -- Find detailed information about all books and their authors and publishers:
-- SELECT 
--     Books.title AS BookTitle, 
--     Authors.firstName AS AuthorFirstName, 
--     Authors.lastName AS AuthorLastName, 
--     Publishers.name AS PublisherName,
--     Books.genre AS BookGenre
-- FROM 
--     Books
-- INNER JOIN Authors ON Books.authorID = Authors.authorID
-- INNER JOIN Publishers ON Books.publisherID = Publishers.publisherID
-- ORDER BY 
--     Books.title;

-- -- Find all loan records, including borrower information and the corresponding book title
-- SELECT 
--     Borrowers.firstName AS BorrowerFirstName, 
--     Borrowers.lastName AS BorrowerLastName, 
--     Books.title AS BookTitle, 
--     BorrowingRecords.borrowDate, 
--     BorrowingRecords.returnDate
-- FROM 
--     BorrowingRecords
-- INNER JOIN Borrowers ON BorrowingRecords.borrowerID = Borrowers.borrowerID
-- INNER JOIN BorrowingRecordItems ON BorrowingRecords.recordID = BorrowingRecordItems.recordID
-- INNER JOIN Books ON BorrowingRecordItems.bookID = Books.bookID
-- ORDER BY 
--     BorrowingRecords.borrowDate DESC;

-- -- Find all borrowers for each book
-- SELECT 
--     Books.title AS BookTitle,
--     GROUP_CONCAT(DISTINCT Borrowers.firstName, ' ', Borrowers.lastName ORDER BY Borrowers.firstName SEPARATOR ', ') AS BorrowersList
-- FROM 
--     Books
-- INNER JOIN BorrowingRecordItems ON Books.bookID = BorrowingRecordItems.bookID
-- INNER JOIN BorrowingRecords ON BorrowingRecordItems.recordID = BorrowingRecords.recordID
-- INNER JOIN Borrowers ON BorrowingRecords.borrowerID = Borrowers.borrowerID
-- GROUP BY 
--     Books.bookID
-- ORDER BY 
--     BookTitle;


