const express = require("express");
const router = express.Router();
const leagueController = require("../controllers/leagueController");

// leagues routes
router.post("/leagues/create", leagueController.createLeague);
router.post("/leagues/idview", leagueController.viewLeagueByID);
router.post("/leagues/nameview", leagueController.viewLeagueByName);

// Export the router
module.exports = router;
