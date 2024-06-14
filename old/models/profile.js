const mongoose = require('mongoose')
const Schema = mongoose.Schema

const profileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: {type: Number, default: 0},
    currency: {type: Number, default: 1}
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})

profileSchema.methods.setScore = async function (newScore, newCurrency){
    this.score = newScore;
    this.currency = newCurrency;
    await this.save();
}
module.exports = mongoose.model('Profile', profileSchema)