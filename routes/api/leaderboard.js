const express = require('express');
const router = express.Router();
const leaderboardCtrl = require('../../controllers/api/leaderboard');

router.get("/", leaderboardCtrl.getAll)
module.exports = router;