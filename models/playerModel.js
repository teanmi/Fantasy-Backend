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
          Teams t ON pt.teamID = t.teamID
      `;

    const queryParams = [leagueID];

    // Add filtering by position if it's provided
    if (position) {
      query += " WHERE p.position = ?";
      queryParams.push(position);
    }

    db.query(query, queryParams, (err, results) => {
      if (err) {
        return reject(err); // Handle any errors
      }
      console.log(results);
      resolve(results); // Return the results
    });
  });
};
