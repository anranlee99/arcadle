const GameState = require('../../models/gameState')

module.exports = {
    gameState,
    saveGame,
}
async function saveGame(req,res){
    await GameState.saveGameState(req.user._id,req.body.gameOver, req.body.moves, req.body.victory)
    res.json({})
}
async function gameState(req, res){
    const gameState = await GameState.getGameState(req.user._id)
    res.json(gameState)
}




