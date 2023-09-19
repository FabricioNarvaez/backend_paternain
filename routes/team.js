'use strict'

const express = require('express');
const TeamController = require('../controllers/team');
const { checkAuth } = require('../middleware/auth');

var router = express.Router();

router.get('/test', checkAuth, TeamController.test);
router.post('/save', TeamController.save);
router.get('/teams', TeamController.getTeams);
router.get('/team/:group/:id', TeamController.getTeam);
router.put('/team/:group/:id', TeamController.update);
router.put('/update', TeamController.updateMatchData);
router.delete('/team/:group/:id', TeamController.delete);

module.exports = router;