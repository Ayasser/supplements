const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const { paginatorMiddleware } = require('../middleware/paginator')
const supplementController = require('../controllers/supplements')

router.get('/', auth, paginatorMiddleware, supplementController.list)
router.get('/:id', auth, supplementController.detail)
router.post('/', auth, supplementController.create)
router.delete('/:id', auth, supplementController.delete)
router.post('/:id/update_name', auth, supplementController.updateName)
router.post('/:id/update_price', auth, supplementController.updatePrice)

module.exports = router
