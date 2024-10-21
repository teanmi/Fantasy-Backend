const express = require("express");
const router = express.Router();
const leagueController = require("../controllers/leagueController");
const teamController = require("../controllers/teamController");

// leagues routes
router.post("/leagues/create", leagueController.createLeague);
router.post("/leagues/idview", leagueController.viewLeagueByID);
router.post("/leagues/nameview", leagueController.viewLeagueByName);
router.post("/teams/create", teamController.createTeam);

// Export the router
module.exports = router;
