const db = require("../config/db"); // MySQL connection setup

// Model method to create a new league
exports.createLeague = (leagueName, numTeams, callback) => {
  const query = `
        INSERT INTO Leagues (
            reg_season_count, 
            team_count, 
            current_team_count,
            playoff_team_count, 
            Name, 
            tie_rule, 
            playoff_tie_rule, 
            playoff_seed_tie_rule, 
            playoff_matchup_period_length, 
            faab, 
            scoringID
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

  // Setting optional fields to null (or default values)
  const values = [
    14, // default
    numTeams,
    0, // default
    numTeams / 2, // default
    leagueName,
    null, // tie_rule (optional)
    null, // playoff_tie_rule (optional)
    null, // playoff_seed_tie_rule (optional)
    null, // playoff_matchup_period_length (optional)
    false, // faab (default to false)
    null, // scoringID (optional)
  ];

  db.query(query, values, (err, result) => {
    console.log(err)
    callback(err, result.insertId); // Call the provided callback with the error or result
  });
};

exports.getTeamCountAndMax = (leagueID, callback) => {
  const query = `
      SELECT current_team_count, team_count 
      FROM Leagues 
      WHERE leagueID = ?;
    `;

  db.query(query, [leagueID], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result[0]); // Assuming only one result is returned
    }
  });
};

exports.incrementTeamCount = (leagueID, callback) => {
  const query = `
      UPDATE Leagues 
      SET current_team_count = current_team_count + 1
      WHERE leagueID = ?;
    `;

  db.query(query, [leagueID], (err, result) => {
    callback(err, result);
  });
};

exports.viewLeagueByName = (leagueName, callback) => {
  const query = `
    SELECT 
      reg_season_count, 
      team_count, 
      current_team_count,
      playoff_team_count, 
      Name, 
      tie_rule, 
      playoff_tie_rule, 
      playoff_seed_tie_rule, 
      playoff_matchup_period_length, 
      faab, 
      scoringID
    FROM Leagues
    WHERE Name = ?;
  `;

  const values = [leagueName];

  db.query(query, values, (err, result) => {
    callback(err, result);
  });
};

exports.validateLeagueCode = (leagueID, callback) => {
  const query = `
        SELECT current_team_count, team_count 
        FROM Leagues 
        WHERE leagueID = ?;
        `;

  db.query(query, [leagueID], (err, result) => {
    callback(err, result);
  });
};

exports.viewLeagueByID = (leagueID, callback) => {
  const query = "SELECT * FROM Leagues WHERE leagueID = ?";

  db.query(query, [leagueID], (err, result) => {
    callback(err, result); // Return the result or error
  });
};
