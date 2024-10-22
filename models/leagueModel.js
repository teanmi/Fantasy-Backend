const db = require("../config/db"); // MySQL connection setup

// Model method to create a new league
exports.createLeague = (leagueName, numTeams, callback) => {
  const query = `
        INSERT INTO Leagues (
            reg_season_count, 
            team_count, 
            playoff_team_count, 
            Name, 
            tie_rule, 
            playoff_tie_rule, 
            playoff_seed_tie_rule, 
            playoff_matchup_period_length, 
            faab, 
            scoringID
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    
  // Setting optional fields to null (or default values)
  const values = [
    14, // default
    numTeams,
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
    callback(err, result); // Call the provided callback with the error or result
  });
};

exports.viewLeagueByName = (leagueName, callback) => {
  const query = `
    SELECT 
      reg_season_count, 
      team_count, 
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

exports.viewLeagueByID = (leagueID, callback) => {
  const query = `
    SELECT 
      reg_season_count, 
      team_count, 
      playoff_team_count, 
      Name, 
      tie_rule, 
      playoff_tie_rule, 
      playoff_seed_tie_rule, 
      playoff_matchup_period_length, 
      faab, 
      scoringID
    FROM Leagues
    WHERE leagueID = ?;
  `;

  const values = [leagueID];

  db.query(query, values, (err, result) => {
    callback(err, result);
  });
};
