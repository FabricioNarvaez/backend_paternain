'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchWeeksSchema = new Schema({
    matchWeek: String,
    date: String,
    matches: Array
});

const matchWeeksModel = mongoose.model('matchweeks', matchWeeksSchema, 'matchweeks');

module.exports = { matchWeeksModel };