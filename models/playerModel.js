const db = require("../config/db");

exports.viewAllPlayers = (callback) => {
    const query = `
      SELECT 
        playerID, 
        name, 
        position, 
        teamID, 
        injured, 
        posRank, 
        average_points, 
        eligible_slots 
      FROM Players;
    `;
  
    db.query(query, (err, result) => {
      callback(err, result);
    });
};