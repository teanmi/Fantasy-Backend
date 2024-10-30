const db = require("../config/db");

exports.findUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Users WHERE username = ?', [username], (error, results) => {
            if (error) {
                return reject(error); // Reject the promise with the error
            }
            resolve(results[0]); // Resolve the promise with the user object
        });
    });
};
