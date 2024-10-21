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
