const mongoose = require('mongoose')
const Schema = mongoose.Schema

const survivleSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gameRefs: [{type: Schema.Types.ObjectId, ref:'GameState'}]
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})

module.exports = mongoose.model('Survivle', survivleSchema)