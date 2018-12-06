// core
var express = require('express');
var router = express.Router();

// controllers
const authController = require('./../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
