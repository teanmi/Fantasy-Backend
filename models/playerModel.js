const db = require("../config/db");

exports.getPlayersWithTeams = (position, leagueID) => {
  return new Promise((resolve, reject) => {
    let query = `
        SELECT 
          p.playerID, 
          p.name AS playerName, 
          p.position, 
          IFNULL(t.teamName, NULL) AS teamName
        FROM 
          Players p
        LEFT JOIN 
          PlayerTeam pt ON p.playerID = pt.playerID AND pt.leagueID = ?
        LEFT JOIN 
          Teams t ON pt.teamID = t.teamID AND t.leagueID = ?
      `;

    const queryParams = [leagueID, leagueID];

    // Add filtering by position if it's provided
    if (position) {
      query += " WHERE p.position = ?";
      queryParams.push(position);
    }

    db.query(query, queryParams, (err, results) => {
      if (err) {
        return reject(err); // Handle any errors
      }

      resolve(results); // Return the results
    });
  });
};

exports.claimPlayer = (playerID, teamID, leagueID, callback) => {
  const query = `
      INSERT INTO PlayerTeam (playerID, teamID, leagueID)
      VALUES (?, ?, ?);
    `;

  const values = [playerID, teamID, leagueID];

  db.query(query, values, (err, result) => {
    callback(err, result);
  });
};
