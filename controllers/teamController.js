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

exports.getTeamByID = (req, res) => {
  const { teamID } = req.params;

  if (!teamID) {
    return res.status(400).json({ message: "Team ID is required" });
  }

  Team.getTeamByID(teamID, (err, result) => {
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

exports.getPlayersByTeamID = async (req, res) => {
  const { teamID } = req.params; // Team ID from the route parameter
  const { leagueID } = req.query; // League ID from the query parameter

  if (!teamID || !leagueID) {
    return res
      .status(400)
      .json({ message: "Both teamID and leagueID are required" });
  }

  try {
    // Call the model to get the team and players data
    const teamData = await Team.getPlayersByTeamID(teamID, leagueID);

    res.status(200).json(teamData);
  } catch (error) {
    console.error("Error fetching team and players:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch team and players", error });
  }
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

exports.linkUserToTeam = (req, res) => {
  const { userID, teamID, leagueID } = req.body;

  if (!userID || !teamID || !leagueID) {
    return res.status(400).json({ message: "userID, teamID, and leagueID are required" });
  }

  Team.doesUserHaveTeam(userID, leagueID, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "User already has a team in this league" });
    }

    Team.linkUserToTeam(userID, teamID, leagueID, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Failed to link user to team", error: err });
      }

      res.status(201).json({
        message: "User successfully linked to team",
        linkID: result.insertId,
      });
    });
  });
};

exports.getUserTeam = (req, res) => {
  const { userID, leagueID } = req.body;

  Team.getUserTeam(userID, leagueID, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching user team", error: err });
    }

    if (!result) {
      return res.status(404).json({ message: "User does not have a team in this league" });
    }

    res.status(200).json({ teamID: result.teamID });
  });
};

