/* Authors and Group: Theresa Quach and Lianghui Wang - Group 29
Course: CS340
Project Name: Project Library - db-connector.js
Citation(s): 
    Code from CS340 Week 1 Activity 2: Connect webapp to database (https://canvas.oregonstate.edu/courses/1946034/assignments/9456203?module_item_id=23809270)
*/

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_quachth',
    password        : '1570',
    database        : 'cs340_quachth'
})

// Export it for use in our application
module.exports.pool = pool;