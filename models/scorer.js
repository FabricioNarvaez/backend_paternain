'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scorerSchema = new Schema({
    name: String,
    team: String,
    goals: Number
});

const scorerModel = mongoose.model('scorer', scorerSchema);

module.exports = { scorerModel };