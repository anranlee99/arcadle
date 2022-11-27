const express = require('express');
const router = express.Router();
const gameStateCtrl = require('../../controllers/api/gameState');


router.get('/current', gameStateCtrl.gameState);
router.post('/addGuess/:guess', gameStateCtrl.addGuess);

module.exports = router;