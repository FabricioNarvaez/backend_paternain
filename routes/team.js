'use strict'

const express = require('express');
const TeamController = require('../controllers/team');

var router = express.Router();

router.get('/test', TeamController.test);
router.post('/save', TeamController.save);
router.get('/teams', TeamController.getTeams);
router.put('/team/:id', TeamController.update);
router.delete('/team/:id', TeamController.delete);

module.exports = router;