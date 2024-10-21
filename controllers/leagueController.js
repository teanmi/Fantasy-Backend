const League = require("../models/leagueModel");

exports.createLeague = (req, res) => {
  const { leagueName, numTeams } = req.body;

  if (!leagueName || !numTeams) {
    return res.status(400).json({ message: "All fields are required" });
  }

  League.createLeague(leagueName, numTeams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({
      message: "League created successfully!",
      leagueId: result.insertId,
    });
  });
};

exports.viewLeagueByName = (req, res) => {
  const { leagueName } = req.params;
  
  if (!leagueName) {
    return res.status(400).json({ message: "League name is required" });
  }

  League.viewLeagueByName(leagueName, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: "League not found" });
    }

    res.status(200).json({
      message: "League retrieved successfully!",
      league: result[0],
    });
  });
};

exports.viewLeagueByID = (req, res) => {
  const { leagueID } = req.params;
  
  if (!leagueID) {
    return res.status(400).json({ message: "League ID is required" });
  }

  League.viewLeague(leagueID, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: "League not found" });
    }

    res.status(200).json({
      message: "League retrieved successfully!",
      league: result[0],
    });
  });
};