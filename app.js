'use strict'

const express = require('express');
const app = express();

const team_routes = require('./routes/team');
const auth = require('./routes/auth');
const scorer = require('./routes/scorer')

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/players', scorer);
app.use('/api',team_routes);
app.use('',auth);

module.exports = app;