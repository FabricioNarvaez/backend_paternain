const express = require('express');
const router = express.Router();

const {loginCtrl, registerCtrl, checkAuth} = require('../controllers/auth');

router.post('/login', loginCtrl);
router.post('/token', checkAuth)
router.post('/register', registerCtrl);

module.exports = router;