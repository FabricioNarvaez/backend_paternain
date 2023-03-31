'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    team: String,
    PG: Number,
    PE: Number,
    PP: Number,
    GF: Number,
    GC: Number,
});

module.exports = mongoose.model('Team', TeamSchema);