const GameState = require('../../models/gameState')

module.exports = {
    gameState,
}

async function gameState(req, res){
    console.log('in controller')
    const gameState = await GameState.getGameState(req.user._id)
    res.json(gameState)
}