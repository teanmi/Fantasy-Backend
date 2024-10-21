const db = require("../config/db");

exports.createTeam = (teamName, leagueID, callback) => {
    const query = `
      INSERT INTO Teams (teamName, leagueID)
      VALUES (?, ?);
    `;
  
    const values = [teamName, leagueID];
  
    db.query(query, values, (err, result) => {
      callback(err, result);
    });
};
