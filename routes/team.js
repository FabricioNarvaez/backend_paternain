'use strict'

const express = require('express');
const TeamController = require('../controllers/team');

var router = express.Router();

router.get('/test', TeamController.test);

module.exports = router;