const mongoose = require('mongoose')
const Schema = mongoose.Schema
const utils = require('../util/game-utils/word-utils')

const gameStateSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gameType: {type: String, required: true},
    gameOver: {type: Boolean, required: true, default: false},
    currentGame:{type:Boolean, required:true, default:true},
    record:{
        answer: {type:String, required: true, default: utils.getRandomWord()},
        numGuesses: {type: Number, default: 0},
        guesses:[String]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

gameStateSchema.statics.getGameState = async function(userId) {  
    const gameState = await this.findOne({user: userId, currentGame: true})
    console.log('in getGameState',gameState)
    if(gameState){
        console.log('gamestate exists')
        return gameState
    } else {
        const newGameState = new this({
            user: userId,
            currentGame: true,
            gameType: 'Wordle',
            record:{answer: utils.getRandomWord(), numGuesses:0, guesses:[]}
        })
        await newGameState.save()
        return newGameState
    }
}

gameStateSchema.methods.computeGuess = function(){
    const currentGuess = this.record.guesses[this.record.guesses.length-1]
    if(currentGuess === this.record.answer){
        this.gameOver = true;
    }
    return utils.computeGuess(currentGuess, this.record.answer)
}

gameStateSchema.methods.newGame = async function(){
    console.log('in new game model method')
    this.currentGame = false;
    await this.save();
}

gameStateSchema.methods.addGuess = function(guess){
    console.log('in addGuess Static',this, guess)
    const gameState = this

    gameState.record.guesses.push(guess)
    gameState.computeGuess();
    console.log('this after push ', this)
    // return this.update(this)
    return gameState.save()
}

module.exports = mongoose.model('GameState', gameStateSchema)