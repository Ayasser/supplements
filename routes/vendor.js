const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const { paginatorMiddleware } = require('../middleware/paginator')
const vendorController = require('../controllers/vendors')

router.get('/', auth, paginatorMiddleware, vendorController.list)
router.get('/:id', auth, vendorController.detail)
router.post('/', auth, vendorController.create)
router.delete('/:id', auth, vendorController.delete)
router.post('/:id/update_name', auth, vendorController.updateName)
router.post('/:id/update_phone', auth, vendorController.updatePhone)
router.post('/:id/update_address', auth, vendorController.updateAddress)

module.exports = router
