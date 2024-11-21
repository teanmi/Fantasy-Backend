const League = require("../models/leagueModel");

exports.createLeague = (req, res) => {
  const { leagueName, numTeams } = req.body;

  if (!leagueName || !numTeams) {
    return res.status(400).json({ message: "All fields are required" });
  }

  League.createLeague(leagueName, numTeams, (err, leagueID) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(201).json({
      message: "League created successfully!",
      leagueID: leagueID,
    });
  });
};

exports.viewLeagueByID = (req, res) => {
  const { leagueID } = req.params; // Get the dynamic leagueID from the URL

  if (!leagueID) {
    return res.status(400).json({ message: "League ID is required" });
  }

  League.viewLeagueByID(leagueID, (err, result) => {
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

exports.validateLeagueCode = (req, res) => {
  const { leagueID } = req.params;

  if (!leagueID) {
    return res.status(400).json({ message: "League ID is required" });
  }

  League.validateLeagueCode(leagueID, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "League not found" });
    }

    // check if league is full
    if (result[0].current_team_count >= result[0].team_count) {
      return res.status(400).json({ message: "League is full" });
    }

    res.status(200).json({
      message: "League code validated successfully!",
      leagueCode: result[0].leagueCode,
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

exports.linkUserToLeague = (req, res) => {
  const { userID, leagueID } = req.body;

  if (!userID || !leagueID) {
    return res.status(400).json({ message: "User ID and League ID are required" });
  }

  League.isUserInLeague(userID, leagueID, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "User is already in this league" });
    }

    League.linkUserToLeague(userID, leagueID, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Failed to link user to league", error: err });
      }

      res.status(201).json({ message: "User successfully linked to league", linkID: result.insertId });
    });
  });
};

