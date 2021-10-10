const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    
    player: {
        type: Schema.Types.ObjectId,
        ref: 'players'
    },
    finalScore: {
        type: Number,
        required: true,
    },
    multiplier: {
        type: Number
    },
    level: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('score', scoreSchema);