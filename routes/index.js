const express = require("express");
const router = express.Router();

// Controllers
const leagueController = require("../controllers/leagueController");
const teamController = require("../controllers/teamController");
const playerController = require("../controllers/playerController");
const authController = require("../controllers/authController");

// Leagues Routes
router.post("/league/create", leagueController.createLeague);
router.get("/league/:leagueID", leagueController.viewLeagueByID);
router.get("/league/:leagueID/validate-code" , leagueController.validateLeagueCode);
router.post("/league/user-link", leagueController.linkUserToLeague);
router.get("/user/:userID/leagues", leagueController.getLeaguesForUser);
router.get('/max-week', leagueController.getMaxWeek);
// router.post("/league/nameview", leagueController.viewLeagueByName); 

// Teams Routes
router.post("/league/:leagueID/create-team", teamController.createTeam);
router.get("/league/:leagueID/teams", teamController.getTeamsByLeagueID);
router.get("/teams/:teamID", teamController.getTeamByID);
router.get("/teams/:teamID/players", teamController.getPlayersByTeamID);
router.post("/teams/user-link", teamController.linkUserToTeam);
router.post('/teams/link', teamController.linkUserToTeam);
router.post('/user-team', teamController.getUserTeam);
// router.post("/teams/nameandleagueview", teamController.viewTeamByNameAndLeague);

// Player Routes
router.get("/players/viewall", playerController.viewAllPlayers);
router.post("/players/:playerID/claim", playerController.claimPlayer);
router.get('/players/:playerID/eligible-slots', playerController.getEligibleSlots);
router.put('/player-slot', playerController.updateSlot);
router.get('/players/:playerID/slot/:teamID/:leagueID', playerController.getPlayerSlot);
router.get("/fantasy-points", playerController.getFantasyPoints);
router.get("/projected-fantasy-points", playerController.getProjectedFantasyPoints);

// Auth Routes
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);

// Export the router
module.exports = router;
