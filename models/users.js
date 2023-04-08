'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
});

const usersModel = mongoose.model('users', userSchema);

module.exports = { usersModel };