const express = require('express');
const router = express.Router();
const gameStateCtrl = require('../../controllers/api/gameState');


router.get('/current', gameStateCtrl.gameState);
router.post('/survivle/save', gameStateCtrl.saveSurvivle);
router.post('/saveGame', gameStateCtrl.saveGame);

module.exports = router;