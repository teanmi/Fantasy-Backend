const Team = require("../models/teamModel");
const League = require("../models/leagueModel");

exports.createTeam = (req, res) => {
  const { teamName, leagueID } = req.body;

  if (!teamName || !leagueID) {
    return res
      .status(400)
      .json({ message: "Team name and league ID are required" });
  }

  League.getTeamCountAndMax(leagueID, (err, leagueData) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    const { current_team_count, team_count } = leagueData;

    // Check if the league is full
    if (current_team_count >= team_count) {
      return res.status(400).json({
        message: "The league is full. Cannot create more teams.",
      });
    }

    // Create the team
    Team.createTeam(teamName, leagueID, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      const newTeamID = result.insertId;

      // Update the league's current_team_count by 1
      League.incrementTeamCount(leagueID, (err) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to update league's team count",
            error: err,
          });
        }

        // Send success response
        res.status(201).json({
          message: "Team created successfully!",
          teamId: newTeamID,
        });
      });
    });
  });
};

exports.viewTeamByNameAndLeague = (req, res) => {
  const { teamName, leagueID } = req.params;

  if (!teamName || !leagueID) {
    return res
      .status(400)
      .json({ message: "Team name and league ID are required" });
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

exports.getTeamsByLeagueID = (req, res) => {
  const { leagueID } = req.params; // Get the leagueID from the URL

  if (!leagueID) {
    return res.status(400).json({ message: "League ID is required" });
  }

  Team.getTeamsByLeagueID(leagueID, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No teams found for this league" });
    }

    res.status(200).json({
      message: "Teams retrieved successfully!",
      teams: result,
    });
  });
};
