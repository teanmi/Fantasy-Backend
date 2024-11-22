const Player = require("../models/playerModel");

exports.viewAllPlayers = async (req, res) => {
  const { position, leagueID } = req.query; // Get position and leagueID from query parameters

  try {
    const players = await Player.getPlayersWithTeams(position, leagueID); // Call the model function
    res.status(200).json(players); // Respond with the player data
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ message: "Failed to fetch players", error });
  }
};

exports.claimPlayer = (req, res) => {
  const { playerID } = req.params;
  const { teamID, leagueID } = req.body; // Assuming you pass the teamID of the team claiming the player

  if (!playerID || !teamID || !leagueID) {
    return res
      .status(400)
      .json({ message: "Player ID, team ID, and leagueID are required" });
  }

  Player.claimPlayer(playerID, teamID, leagueID, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json({
      message: "Player claimed successfully!",
    });
  });
};

exports.getEligibleSlots = (req, res) => {
  const { playerID } = req.params;

  Player.getEligibleSlots(playerID, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching eligible slots", error: err });
    }

    if (result === null) {
      return res.status(404).json({ message: "Player not found or no eligible slots available" });
    }

    res.status(200).json({ eligible_slots: result });
  });
};

exports.updateSlot = (req, res) => {
  const { playerID, teamID, leagueID, newSlot } = req.body;

  if (!newSlot || !['QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'D/ST', 'BE'].includes(newSlot)) {
    return res.status(400).json({ message: "Invalid slot value. Valid options are: QB, RB, WR, TE, FLEX, K, D/ST, BE" });
  }

  Player.updatePlayerSlot(playerID, teamID, leagueID, newSlot, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating player slot", error: err });
    }

    res.status(200).json(result);
  });
};

exports.getPlayerSlot = (req, res) => {
  const { playerID, teamID, leagueID } = req.params;

  Player.getPlayerSlot(playerID, teamID, leagueID, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching player slot", error: err });
    }

    if (result.message) {
      return res.status(404).json(result);
    }

    res.status(200).json({ slot: result });
  });
};
