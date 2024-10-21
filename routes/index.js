const express = require("express");
const router = express.Router();
const leagueController = require("../controllers/leagueController");

// leagues routes
router.post("/leagues/create", leagueController.createLeague);

// Export the router
module.exports = router;
