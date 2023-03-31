'use strict'

const express = require('express');
const app = express();

const team_routes = require('./routes/team');

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use('/api',team_routes);

module.exports = app;