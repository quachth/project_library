/* Authors and Group: Theresa Quach and Lianghui Wang - Group 29
Course: CS340
Project Name: Project Library
Citation(s): 
    Code dump from MySQL Workbench was then altered and cleaned for importability. Process to create dump file was explained in the
    Project Step 2 Draft: Normalized Schema + DDL instructions on forward engineering a scheme in MySQL Workbench 
    (https://canvas.oregonstate.edu/courses/1946034/assignments/9456214?module_item_id=23809320)
*/


-- MariaDB dump 10.19  Distrib 10.5.22-MariaDB, for Linux (x86_64)
--
-- Host: classmysql.engr.oregonstate.edu    Database: CS340
-- ------------------------------------------------------
-- Server version	10.6.16-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


--
-- Disabling commits and foreign key checks
--
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

--
-- Create 'Authors' table
--
DROP TABLE IF EXISTS `Authors`;
CREATE TABLE `Authors` (
  `authorID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(55) NOT NULL,
  `lastName` varchar(55) NOT NULL,
  `nationality` varchar(55) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  PRIMARY KEY (`authorID`),
  UNIQUE KEY `authorID_UNIQUE` (`authorID`)
);

--
-- Dumping/Insert data for table `Authors`
--
LOCK TABLES `Authors` WRITE;
INSERT INTO  Authors (firstName, lastName, nationality, birthdate) VALUES
('Kiera', 'Cass', 'American', '1981-05-19'),
('Alexandre', 'Dumas', 'French', '1802-7-24'),
('Alexandre', 'Dumas', 'French', '1824-7-27');
UNLOCK TABLES;

--
-- Create `Publishers` table
--
DROP TABLE IF EXISTS `Publishers`;
CREATE TABLE `Publishers` (
  `publisherID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(145) NOT NULL,
  `address` varchar(256) DEFAULT NULL,
  `contact` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`publisherID`),
  UNIQUE KEY `publisherID_UNIQUE` (`publisherID`)
);

--
-- Dumping/Insert data for table `Publishers`
--
LOCK TABLES `Publishers` WRITE;
INSERT INTO Publishers (name, address, contact) VALUES
('HarperCollins Publishers', '195 Broadway, New York, NY 10007', '1-800-242-7737'),
('Penguin Classics', '1325 4th Ave, Suite 1025, Seattle, WA 98101', 'penguinrandomhouse@penguinrandomhouse.com'),
('Dover Publications', '1325 Franklin Ave, Ste 250, Garden City, NY 11530', '1-516-742-5049');
UNLOCK TABLES;

--
-- Create `Books` table
--
DROP TABLE IF EXISTS `Books`;
CREATE TABLE `Books` (
  `bookID` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(256) NOT NULL,
  `authorID` int(11) NOT NULL,
  `isbn` varchar(14) NOT NULL,
  `publisherID` int(11),
  `genre` varchar(55) NOT NULL,
  PRIMARY KEY (`bookID`),
  UNIQUE KEY `bookID_UNIQUE` (`bookID`),
  UNIQUE KEY `isbn_UNIQUE` (`isbn`),
  KEY `fk_Books_Authors_idx` (`authorID`),
  KEY `fk_Books_Publishers1_idx` (`publisherID`),
  CONSTRAINT `fk_Books_Authors` FOREIGN KEY (`authorID`) REFERENCES `Authors` (`authorID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Books_Publishers1` FOREIGN KEY (`publisherID`) REFERENCES `Publishers` (`publisherID`) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Dumping/Insert data for table `Books`
--
LOCK TABLES `Books` WRITE;
INSERT INTO Books (title, authorID, isbn, publisherID, genre) VALUES
('The Selection', 1, '978-0062059949', 1, 'fantasy'),
('The Count of Monte Cristo', 2, '978-0486456430', 3, 'adventure'),
('The Lady of the Camellias', 3, '978-0143107026', 2, 'romance');
UNLOCK TABLES;

--
-- Create `Borrowers` table
--
DROP TABLE IF EXISTS `Borrowers`;
CREATE TABLE `Borrowers` (
  `borrowerID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(55) NOT NULL,
  `lastName` varchar(55) NOT NULL,
  `email` varchar(145) NOT NULL,
  `phoneNum` varchar(15) NOT NULL,
  PRIMARY KEY (`borrowerID`),
  UNIQUE KEY `borrowerID_UNIQUE` (`borrowerID`),
  UNIQUE KEY `email_UNIQUE` (`email`)
);

--
-- Dumping/Insert data for table `Borrowers`
--
LOCK TABLES `Borrowers` WRITE;
INSERT INTO Borrowers (firstName, lastName, email, phoneNum) VALUES
('Celeste','Newsome', 'cnewsome@tmail.com', '111-222-3344'),
('Max', 'Smith', 'maxsmith1@omail.com', '555-777-9900'),
('Lianghui', 'Wang', 'wangl9@oregonstate.edu', '666-888-6688');
UNLOCK TABLES;

--
-- Create `BorrowingRecords` table
--
DROP TABLE IF EXISTS `BorrowingRecords`;

CREATE TABLE `BorrowingRecords` (
  `recordID` int(11) NOT NULL AUTO_INCREMENT,
  `borrowerID` int(11) NOT NULL,
  `borrowDate` date NOT NULL,
  `returnDate` date NOT NULL,
  PRIMARY KEY (`recordID`),
  UNIQUE KEY `recordID_UNIQUE` (`recordID`),
  KEY `fk_BorrowingRecords_Borrowers1_idx` (`borrowerID`),
  CONSTRAINT `fk_BorrowingRecords_Borrowers1` FOREIGN KEY (`borrowerID`) REFERENCES `Borrowers` (`borrowerID`) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Dumping/Insert data for table `BorrowingRecords`
--
LOCK TABLES `BorrowingRecords` WRITE;
INSERT INTO BorrowingRecords (borrowerID, borrowDate, returnDate) VALUES
(1, '2024-02-06', '2024-02-13'),
(3, '2023-11-02', '2024-01-10'),
(2, '2024-01-01', '2024-02-01');
UNLOCK TABLES;

--
-- Create `BorrowingRecordItems` table
--
DROP TABLE IF EXISTS `BorrowingRecordItems`;
CREATE TABLE `BorrowingRecordItems` (
  `recordID` int(11) NOT NULL,
  `bookID` int(11) NOT NULL,
  PRIMARY KEY (recordID, bookID),
  KEY `fk_BorrowingRecordItems_Books1_idx` (`bookID`),
  KEY `fk_BorrowingRecordItems_BorrowingRecords1_idx` (`recordID`),
  CONSTRAINT `fk_BorrowingRecordItems_Books1` FOREIGN KEY (`bookID`) REFERENCES `Books` (`bookID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_BorrowingRecordItems_BorrowingRecords1` FOREIGN KEY (`recordID`) REFERENCES `BorrowingRecords` (`recordID`) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Dumping/Insert data for table `BorrowingRecordItems`
--
LOCK TABLES `BorrowingRecordItems` WRITE;
INSERT INTO BorrowingRecordItems (recordID, bookID) VALUES
(1, 2),
(2, 3),
(3, 2);
UNLOCK TABLES;

-- 
-- Renable commits and foreign key checks
--
SET FOREIGN_KEY_CHECKS=1;
COMMIT;



/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-05 23:15:55
