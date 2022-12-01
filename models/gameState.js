const mongoose = require('mongoose')
const Schema = mongoose.Schema
const utils = require('../util/game-utils/word-utils')

const gameStateSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gameType: {type: String, required: true},
    gameOver: {type: Boolean, required: true, default: false},
    victory: {type: Boolean, required: true, default: false},
    record:{
        answer: {type:String, required: true},
        numGuesses: {type: Number, default: 0},
        guesses:[String]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

gameStateSchema.statics.getGameState = async function(userId, type) {  
    const gameState = await this.findOne({user: userId, gameOver: false, gameType: type})
    if(gameState){
        return gameState
    } else {
        const newGameState = new this({
            user: userId,
            gameType: type,

            record:{answer: utils.getRandomWord(), numGuesses:6, guesses:[]}
        })
        await newGameState.save()
        return newGameState
    }
}



gameStateSchema.statics.saveGameState = async function(userId, type, gameOver, moves, victory){
    const gameState = await this.findOne({user: userId, gameOver: false, gameType: type})
   
    if(gameState){
        gameState.record.guesses = moves
        gameState.gameOver = gameOver
        gameState.victory = victory
        await gameState.updateOne(gameState)
    }
}

module.exports = mongoose.model('GameState', gameStateSchema)