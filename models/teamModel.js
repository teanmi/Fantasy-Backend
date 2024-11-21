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

exports.viewTeamByNameAndLeague = (teamName, leagueID, callback) => {
  const query = `
      SELECT * FROM Teams
      WHERE teamName = ? AND leagueID = ?;
    `;

  const values = [teamName, leagueID];

  db.query(query, values, (err, result) => {
    callback(err, result);
  });
};

exports.getTeamByID = (teamID, callback) => {
  const query = `
      SELECT * FROM Teams
      WHERE teamID = ?;
    `;

  const values = [teamID];

  db.query(query, values, (err, result) => {
    callback(err, result);
  });
};

exports.getPlayersByTeamID = (teamID, leagueID) => {
    return new Promise((resolve, reject) => {
      // SQL query to fetch team info and players in that team for a specific league
      const query = `
        SELECT  
          P.playerID, 
          P.name, 
          P.position
        FROM Teams T
        LEFT JOIN PlayerTeam PT ON T.teamID = PT.teamID AND PT.leagueID = ?
        LEFT JOIN Players P ON PT.playerID = P.playerID
        WHERE T.teamID = ?
      `;
  
      db.query(query, [leagueID, teamID], (err, result) => {
        if (err) {
          reject(err);
        } else {
          // Format the data, team and players will be nested
          if (result.length === 0) {
            return reject(new Error("Team not found"));
          }
  
          const teamData = {
            teamID: result[0].teamID,
            teamName: result[0].teamName,
            players: result.map((row) => ({
              playerID: row.playerID,
              name: row.name,
              position: row.position,
              injured: row.injured,
              claimed: row.claimedByTeam ? true : false,
            })),
          };
          resolve(teamData);
        }
      });
    });
  };

exports.getTeamsByLeagueID = (leagueID, callback) => {
    const query = `
      SELECT * FROM Teams WHERE leagueID = ?;
    `;
  
    db.query(query, [leagueID], (err, result) => {
      callback(err, result);
    });
  };

  exports.linkUserToTeam = (userID, teamID, leagueID, callback) => {
    const query = `
      INSERT INTO TeamUser (userID, teamID, leagueID)
      VALUES (?, ?, ?);
    `;
    db.query(query, [userID, teamID, leagueID], (err, result) => {
      callback(err, result);
    });
  };
  
  exports.doesUserHaveTeam = (userID, leagueID, callback) => {
    const query = `
      SELECT * FROM TeamUser 
      WHERE userID = ? AND leagueID = ?;
    `;
  
    db.query(query, [userID, leagueID], (err, result) => {
      callback(err, result);
    });
  };

  exports.getUserTeam = (userID, leagueID, callback) => {
    const query = `
      SELECT teamID
      FROM TeamUser
      WHERE userID = ? AND leagueID = ?;
    `;
    
    db.query(query, [userID, leagueID], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        if (result.length > 0) {
          callback(null, result[0]);
        } else {
          callback(null, null);
        }
      }
    });
  };
  