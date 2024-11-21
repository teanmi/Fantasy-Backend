const db = require("../config/db");

exports.findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM Users WHERE username = ?",
      [username],
      (error, results) => {
        if (error) {
          return reject(error); // Reject the promise with the error
        }
        resolve(results[0]); // Resolve the promise with the user object
      }
    );
  });
};

exports.findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM Users WHERE email = ?",
      [email],
      (error, results) => {
        if (error) {
          return reject(error); // Reject the promise with the error
        }
        resolve(results[0]); // Resolve the promise with the user object
      }
    );
  });
};

exports.createUser = async (username, email, password) => {
  return new Promise((resolve, reject) => {
    const query = 
      "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";

    const values = [username, email, password];

    db.query(query, values, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve({ UserID: result.insertId });
    });
  });
};
