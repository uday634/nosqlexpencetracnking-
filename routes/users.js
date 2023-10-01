const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const sequelize = require('../util/sqlconfig')
const signData = require('../models/User')
const userController = require('../controllers/user')
const userAthunctication = require('../middleware/auth')

const router = express.Router();

router.post('/sign-in', userController.signin)

router.post('/log-in', userController.login)

module.exports = router