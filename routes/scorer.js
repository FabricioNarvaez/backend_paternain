'use strict'

const express = require('express');
const scorerController = require('../controllers/scorer');

var router = express.Router();

router.get('/scorers', scorerController.getTeams);

module.exports = router;