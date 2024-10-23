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
