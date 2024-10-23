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
