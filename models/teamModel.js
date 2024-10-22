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

exports.viewTeamByID = (teamID, callback) => {
  const query = `
      SELECT * FROM Teams
      WHERE teamID = ?;
    `;

  const values = [teamID];

  db.query(query, values, (err, result) => {
    callback(err, result);
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
