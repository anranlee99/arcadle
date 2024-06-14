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
        guesses:[String]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

gameStateSchema.statics.getGameState = async function(userId, type, guessLength) {  
    const gameState = await this.findOne({user: userId, gameOver: false, gameType: type})
    if(gameState){
        return gameState
    } else {
        let newGameState 
        if(type==='Gamble'){
            console.log('handleGamble', {guessLength})
            newGameState= new this({
                user: userId,
                gameType: type,
    
                record:{answer: utils.getRandomWord(), guesses:[]}
            })
            await newGameState.save()
            return newGameState
        } else {
            newGameState= new this({
                user: userId,
                gameType: type,
    
                record:{answer: utils.getRandomWord(), guesses:[]}
            })
            await newGameState.save()
            return newGameState
        }
        
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