const GameState = require('../../models/gameState')
const Survivle = require('../../models/survivle')

module.exports = {
    gameState,
    saveGame,
    saveSurvivle
}
async function saveGame(req,res){
    await GameState.saveGameState(req.user._id, req.body.gameType, req.body.gameOver, req.body.moves, req.body.victory)
    res.json({})
}


async function saveSurvivle(req,res){
    const newGame = new Survivle({user:req.user._id, gameRefs:req.body.gameRecord});
    await newGame.save();
    res.json({})
}
async function gameState(req, res){
    const gameState = await GameState.getGameState(req.user._id, req.query.gameType)
    res.json(gameState)
}




