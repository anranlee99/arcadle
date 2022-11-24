const express = require('express');
const router = express.Router();
const gameStateCtrl = require('../../controllers/api/gameState');


router.get('/current', gameStateCtrl.gameState);

module.exports = router;