'use strict';

var express = require('express');
var controller = require('./message.controller');
var auth = require('../../auth/auth.service')
var router = express.Router();

router.get('/getMessages/:id', auth.isAuthenticated(), controller.getMessages); // To get chat data 
router.post('/', auth.isAuthenticated(), controller.create); // To send message

module.exports = router;