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
        guesses:{type: [String]}
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

gameStateSchema.statics.getGameState = function(userId) {
    console.log('in static method')
    
    return this.findOneAndUpdate(
        { user: userId, currentGame: true},
        { user: userId},
        { upsert: true, new: true }
    )
}

module.exports = mongoose.model('GameState', gameStateSchema)