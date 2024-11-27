const express = require("express");
const router = express.Router();
const { fetchAndSaveArticles, fetchArticlesFromDB } = require('../mongoose/index');


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

// Mongoose Routes and Controllers
router.get('/fetch-nfl-news', async (req, res) => {
    try {
        const result = await fetchAndSaveArticles();
        res.status(200).json({
            message: 'Articles fetched and saved successfully',
            savedArticles: result,
        });
    } catch (error) {
        console.error('Error in fetching and saving articles:', error);
        res.status(500).json({ message: 'Error in fetching and saving articles', error });
    }
});

router.get('/get-articles', async (req, res) => {
    const page = parseInt(req.query.page) || 1;  // Default to page 1 if not provided
    const limit = 10;  // Limit to 10 articles per page
  
    try {
      const articles = await fetchArticlesFromDB(page, limit);
      res.status(200).json({ articles });
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ message: 'Error fetching articles', error });
    }
  });

// Export the router
module.exports = router;
