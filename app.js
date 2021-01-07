const mysql = require('mysql');
const inquirer = require('inquirer');
const consTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employeeTrackerDB'
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });

connection.query('SELECT * FROM employeeTrackerDB.department', function (error, results, fields) {
    if (error) throw error;
    console.table(results);
  });
   
  connection.end();