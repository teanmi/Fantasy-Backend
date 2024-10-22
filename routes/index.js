const express = require("express");
const router = express.Router();

// Controllers
const leagueController = require("../controllers/leagueController");
const teamController = require("../controllers/teamController");
const playerController = require("../controllers/playerController");

// Leagues Routes
router.post("/leagues/create", leagueController.createLeague);
router.post("/leagues/idview", leagueController.viewLeagueByID);
router.post("/leagues/nameview", leagueController.viewLeagueByName);

// Teams Routes
router.post("/teams/create", teamController.createTeam);
router.post("/teams/idview", teamController.viewTeamByID);
router.post("/teams/nameandleagueview", teamController.viewTeamByNameAndLeague);

// Player Routes
router.post("/players/viewall", playerController.viewAllPlayers);

// Export the router
module.exports = router;
