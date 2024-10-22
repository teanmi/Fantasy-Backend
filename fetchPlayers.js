const axios = require('axios');
const mysql = require('mysql');

// Set up MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'your_password', // Replace with your MySQL password
    database: 'your_database_name', // Replace with your MySQL database name
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Fetch quarterback data from the ESPN API
async function fetchQuarterbacks() {
    try {
        const response = await axios.get('https://fantasy.espn.com/apis/v3/games/ffl/players?seasonId=2024&position=QB');
        const players = response.data.players;

        // Prepare SQL statement
        const sql = 'INSERT INTO players (name, position, team, stats) VALUES ?';
        const values = players.map(player => [
            player.player.firstName + ' ' + player.player.lastName, // Full name
            'QB', // Position
            player.player.proTeam, // Team
            JSON.stringify(player.player.stats) // Player stats in JSON format
        ]);

        // Insert data into the database
        connection.query(sql, [values], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
            } else {
                console.log('Players inserted:', result.affectedRows);
            }
            connection.end(); // Close the database connection
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the function to fetch quarterbacks
fetchQuarterbacks();
