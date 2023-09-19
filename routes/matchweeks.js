'use strict'

const express = require('express');
const matchweeksController = require('../controllers/matchweeks');

var router = express.Router();

router.get('/getAll', matchweeksController.getMatchWeeks);

module.exports = router;