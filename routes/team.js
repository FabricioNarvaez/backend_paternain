'use strict'

const express = require('express');
const TeamController = require('../controllers/team');

var router = express.Router();

router.get('/test', TeamController.test);
router.post('/save', TeamController.save);
router.get('/teams', TeamController.getTeams);

module.exports = router;