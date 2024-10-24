const express = require("express");
const router = express.Router();

// Controllers
const leagueController = require("../controllers/leagueController");
const teamController = require("../controllers/teamController");
const playerController = require("../controllers/playerController");

// Leagues Routes
router.post("/league/create", leagueController.createLeague);
router.get("/league/:leagueID", leagueController.viewLeagueByID);
router.get("/league/:leagueID/validate-code" , leagueController.validateLeagueCode);
// router.post("/league/nameview", leagueController.viewLeagueByName); 

// Teams Routes
router.post("/league/:leagueID/create-team", teamController.createTeam);
router.get("/league/:leagueID/teams", teamController.getTeamsByLeagueID);
router.get("/teams/:teamID", teamController.getTeamByID);
router.get("/teams/:teamID/players", teamController.getPlayersByTeamID);
// router.post("/teams/nameandleagueview", teamController.viewTeamByNameAndLeague);

// Player Routes
router.get("/players/viewall", playerController.viewAllPlayers);

// Export the router
module.exports = router;
