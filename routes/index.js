const express = require("express");
const router = express.Router();
const leagueController = require("../controllers/leagueController");
const teamController = require("../controllers/teamController");

// leagues routes
router.post("/leagues/create", leagueController.createLeague);
router.post("/leagues/idview", leagueController.viewLeagueByID);
router.post("/leagues/nameview", leagueController.viewLeagueByName);

// Teams Routes
router.post("/teams/create", teamController.createTeam);
router.post("/teams/idview", teamController.viewTeamByID);
router.post("/teams/nameandleagueview", teamController.viewTeamByNameAndLeague);

// Export the router
module.exports = router;
