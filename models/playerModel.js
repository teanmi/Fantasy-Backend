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

exports.getEligibleSlots = (playerID, callback) => {
  const query = `
    SELECT eligible_slots
    FROM Players
    WHERE playerID = ?;
  `;

  db.query(query, [playerID], (err, result) => {
    if (err) {
      return callback(err, null);
    }

    if (result.length > 0) {
      callback(null, result[0].eligible_slots);
    } else {
      callback(null, null);
    }
  });
};

exports.updatePlayerSlot = (playerID, teamID, leagueID, newSlot, callback) => {
  const query = `
    UPDATE PlayerTeam
    SET slot = ?
    WHERE playerID = ? AND teamID = ? AND leagueID = ?;
  `;

  db.query(query, [newSlot, playerID, teamID, leagueID], (err, result) => {
    if (err) {
      return callback(err, null);
    }

    if (result.affectedRows === 0) {
      return callback(null, { message: "Player slot update failed. Ensure the player is in the team." });
    }

    callback(null, { message: "Player slot updated successfully" });
  });
};

exports.getPlayerSlot = (playerID, teamID, leagueID, callback) => {
  const query = `
    SELECT slot
    FROM PlayerTeam
    WHERE playerID = ? AND teamID = ? AND leagueID = ?
  `;

  db.query(query, [playerID, teamID, leagueID], (err, result) => {
    if (err) {
      return callback(err, null);
    }

    if (result.length === 0) {
      return callback(null, { message: "Player not found in this team" });
    }

    callback(null, result[0].slot);
  });
};
