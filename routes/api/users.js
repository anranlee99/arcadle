const express = require('express')
const router = express.Router()
const usersCtrl = require('../../controllers/api/users')


router.post('/', usersCtrl.create)
router.post('/login', usersCtrl.login)
router.get('/check-token', usersCtrl.checkToken)
router.get('/profile', usersCtrl.getProfile)
router.post('/profile/update', usersCtrl.updateProfile)

module.exports = router