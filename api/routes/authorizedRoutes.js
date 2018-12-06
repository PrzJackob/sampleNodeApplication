// core
var express = require('express');
var router = express.Router();

//controllers
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

// middleware
const authorize = require('./../middleware/authorize');

//consts
const userConsts = require('./../../domain/models/user/userConsts');


router.get('/show-tokens', authController.showMyTokens);
router.get('/show-users', authorize([userConsts.roles.ADMIN]), userController.getUsers);
router.put('/add-me-role', userController.addRoleToMe);

module.exports = router;
