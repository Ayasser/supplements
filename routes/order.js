const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const { paginatorMiddleware } = require('../middleware/paginator')
const orderController = require('../controllers/orders')

router.get('/', auth, paginatorMiddleware, orderController.list)
router.get('/:id', auth, orderController.detail)
router.post('/', auth, orderController.create)
router.delete('/:id', auth, orderController.delete)

module.exports = router
