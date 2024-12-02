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

exports.getFantasyPoints = (playerID, week, callback) => {
  const query = `
    SELECT fantasy_points
    FROM PlayerStatistics
    WHERE playerID = ? AND week = ?
  `;

  db.query(query, [playerID, week], (err, result) => {
    if (err) {
      return callback(err, null); // Pass error to the callback
    }

    if (result.length === 0) {
      return callback(null, { message: "No fantasy points found for the given player and week" }); // No data found
    }

    callback(null, result[0].fantasy_points); // Return fantasy points
  });
};

exports.getProjectedFantasyPoints = (playerID, week, callback) => {
  const query = `
    SELECT fantasy_points
    FROM ProjectedPlayerStatistics
    WHERE playerID = ? AND week = ?
  `;

  db.query(query, [playerID, week], (err, result) => {
    if (err) {
      return callback(err, null); // Pass the error to the callback
    }

    if (result.length === 0) {
      return callback(null, { message: "No projected fantasy points found for the given player and week" }); // No data found
    }

    callback(null, result[0].fantasy_points); // Return the projected fantasy points
  });
};

exports.fetchProTeamsByUserID = (userID, callback) => {
  // Step 1: Get the teamIDs from the TeamUser table for the given userID
  const getTeamIDsQuery = `
    SELECT tu.teamID
    FROM TeamUser tu
    WHERE tu.userID = ?
  `;

  db.query(getTeamIDsQuery, [userID], (err, teamResults) => {
    if (err) {
      return callback(err, null); // Pass the error to the callback
    }

    if (teamResults.length === 0) {
      return callback(null, []); // No teams found for the user, return an empty array
    }

    // Step 2: Extract teamIDs from the result
    const teamIDs = teamResults.map(row => row.teamID);

    // Step 3: Get the playerIDs from the PlayerTeam table based on the teamIDs
    const getPlayerIDsQuery = `
      SELECT pt.playerID
      FROM PlayerTeam pt
      WHERE pt.teamID IN (?) 
    `;

    db.query(getPlayerIDsQuery, [teamIDs], (err, playerResults) => {
      if (err) {
        return callback(err, null); // Pass the error to the callback
      }

      if (playerResults.length === 0) {
        return callback(null, []); // No players found for the teams, return an empty array
      }

      // Step 4: Extract playerIDs from the result
      const playerIDs = playerResults.map(row => row.playerID);

      // Step 5: Get the proTeam from the Players table for the playerIDs
      const getProTeamsQuery = `
        SELECT DISTINCT p.proTeam
        FROM Players p
        WHERE p.playerID IN (?)
      `;

      db.query(getProTeamsQuery, [playerIDs], (err, proTeamResults) => {
        if (err) {
          return callback(err, null); // Pass the error to the callback
        }

        if (proTeamResults.length === 0) {
          return callback(null, []); // No proTeams found for the players, return an empty array
        }

        // Step 6: Extract the proTeams from the result
        const proTeams = proTeamResults.map(row => row.proTeam);
        callback(null, proTeams); // Return the list of pro teams
      });
    });
  });
};


