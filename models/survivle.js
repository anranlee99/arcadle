const mongoose = require('mongoose')
const Schema = mongoose.Schema

const survivleSchema = new Schema({
    gameRefs: [{type: Schema.Types.ObjectId, ref:'GameState'}]
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})