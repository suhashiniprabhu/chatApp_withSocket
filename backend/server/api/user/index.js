'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/getallUser',auth.isAuthenticated(), controller.getallUser); // To get all users
router.post('/', controller.create); // To add user

module.exports = router;
