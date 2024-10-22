const Team = require("../models/playerModel");

exports.viewAllPlayers = (req, res) => {
    Player.viewAllPlayers((err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: "No players found" });
      }
  
      res.status(200).json({
        message: "Players retrieved successfully",
        players: result,
      });
    });
  };