const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

PlayerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('players', PlayerSchema);