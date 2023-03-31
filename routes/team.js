'use strict'

const express = require('express');
const TeamController = require('../controllers/team');

var router = express.Router();

router.get('/test', TeamController.test);
router.post('/save', TeamController.save);

module.exports = router;