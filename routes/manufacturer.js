const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const { paginatorMiddleware } = require('../middleware/paginator')
const manufacturerController = require('../controllers/manufacturers')

router.get('/', auth, paginatorMiddleware, manufacturerController.list)
router.post('/:id/update_name', auth, manufacturerController.updateName)
router.post('/:id/update_address', auth, manufacturerController.updateAddress)
router.post('/:id/update_phone', auth, manufacturerController.updatePhone)
router.get('/:id', auth, manufacturerController.detail)
router.post('/', auth, manufacturerController.create)
router.delete('/:id', auth, manufacturerController.delete)

module.exports = router
