const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const { paginatorMiddleware } = require('../middleware/paginator')
const supplementTypesController = require('../controllers/supplement_types')

router.get('/', auth, paginatorMiddleware, supplementTypesController.list)
router.get('/:id', auth, supplementTypesController.detail)
router.post('/', auth, supplementTypesController.create)
router.delete('/:id', auth, supplementTypesController.delete)
router.post('/:id/update_name', auth, supplementTypesController.updateName)

module.exports = router
