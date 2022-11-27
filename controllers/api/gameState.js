const GameState = require('../../models/gameState')

module.exports = {
    gameState,
    addGuess,
    newGame
}

async function gameState(req, res){
    const gameState = await GameState.getGameState(req.user._id)
    res.json(gameState)
}

async function addGuess(req, res){
    console.log('add Guess')
    const gameState = await GameState.getGameState(req.user._id)
    await gameState.addGuess(req.params.guess)
    res.json(gameState)
}

async function newGame(req,res){
    console.log('new game ctrl')
    const gameState = await GameState.getGameState(req.user._id)
    await gameState.newGame()
    res.json(gameState)
}
