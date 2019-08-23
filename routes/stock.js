const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const { paginatorMiddleware } = require('../middleware/paginator')
const stockController = require('../controllers/stocks')

router.get('/', auth, paginatorMiddleware, stockController.list)
router.post('/:id/update_quantity', auth, stockController.updateQuantity)
router.post('/:id/update_can_order', auth, stockController.updateCanOrder)
router.get('/:id', auth, stockController.detail)
router.post('/', auth, stockController.create)
router.delete('/:id', auth, stockController.delete)

module.exports = router
