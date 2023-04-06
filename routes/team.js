'use strict'

const express = require('express');
const TeamController = require('../controllers/team');

var router = express.Router();

router.post('/save', TeamController.save);
router.get('/teams', TeamController.getTeams);
router.get('/team/:group/:id', TeamController.getTeam);
router.put('/team/:group/:id', TeamController.update);
router.delete('/team/:id', TeamController.delete);

module.exports = router;