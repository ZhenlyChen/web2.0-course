const express = require('express')
const router = express.Router()
const userCtrl = require('../controller/user')

router.get('/', userCtrl.logicPage)
router.get('/regist', userCtrl.registerPage)

router.post('/api/login', userCtrl.login)
router.get('/api/logout', userCtrl.logout)
router.post('/api/register', userCtrl.register)

module.exports = router
