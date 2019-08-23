const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')

router.get('/current', auth, userController.getCurrentUser)

router.post('/signup', userController.singup)

router.post('/signin', userController.singin)

module.exports = router
