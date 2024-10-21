const Team = require("../models/teamModel");

exports.createTeam = (req, res) => {
    const { teamName, leagueID } = req.body;
  
    if (!teamName || !leagueID) {
      return res.status(400).json({ message: "Team name and league ID are required" });
    }
  
    Team.createTeam(teamName, leagueID, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
  
      res.status(201).json({
        message: "Team created successfully!",
        teamId: result.insertId,
      });
    });
};

exports.viewTeamByNameAndLeague = (req, res) => {
    const { teamName, leagueID } = req.params;
  
    if (!teamName || !leagueID) {
      return res.status(400).json({ message: "Team name and league ID are required" });
    }
  
    Team.viewTeamByNameAndLeague(teamName, leagueID, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: "Team not found" });
      }
  
      res.status(200).json({
        message: "Team retrieved successfully",
        team: result[0], 
      });
    });
};

exports.viewTeamByID = (req, res) => {
    const { teamID } = req.params;
  
    if (!teamID) {
      return res.status(400).json({ message: "Team ID is required" });
    }
  
    Team.viewTeamByID(teamID, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: "Team not found" });
      }
  
      res.status(200).json({
        message: "Team retrieved successfully",
        team: result[0],
      });
    });
};
