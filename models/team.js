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
    logo: String,
    players: Array,
});
const TeamModelA = mongoose.model('TeamA', TeamSchema, 'grupoA');
const TeamModelB = mongoose.model('TeamB', TeamSchema, 'grupoB');

module.exports = { TeamModelA, TeamModelB };