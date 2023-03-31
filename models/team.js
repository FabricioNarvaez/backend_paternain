'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    team: String,
    PG: Int32Array,
    PE: Int32Array,
    PP: Int32Array,
    GF: Int32Array,
    GC: Int32Array,
});

module.exports = mongoose.model('Team', TeamSchema);