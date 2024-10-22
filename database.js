const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'AveryNew',              // New username
    password: 'twistedSkull30$',   // The same password you set
    database: 'your_database_name', // Ensure this matches your database
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL!');
});

module.exports = connection;
