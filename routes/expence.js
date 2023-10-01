const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const sequelize = require('../util/sqlconfig')
const expence = require('../models/Expense')
const expenceController = require('../controllers/expence')
const userautheincation = require('../middleware/auth')

const router = express.Router();


router.post('/addExpence', userautheincation.authenticate, expenceController.exportData)

router.get('/getExpence',userautheincation.authenticate, expenceController.sendData)

router.get('/download', userautheincation.authenticate, expenceController.downloadExpence)

router.delete('/deleteExpence/:id',userautheincation.authenticate , expenceController.deleteData);

router.get('/allExpences',userautheincation.authenticate, expenceController.getfilehistory )

module.exports = router