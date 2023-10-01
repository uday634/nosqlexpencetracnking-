const express = require('express')
const forgotpassword = require('../controllers/Forgotpassword')

router = express()


router.post('/forgotpassword', forgotpassword.forgotpasswordData )
router.get('/resetpassword/:uuid', forgotpassword.resetpassword)
router.post('/newpassword', forgotpassword.newpassword)

module.exports = router