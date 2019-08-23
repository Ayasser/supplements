const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const { paginatorMiddleware } = require('../middleware/paginator')
const ingredientController = require('../controllers/ingredients')

router.get('/', auth, paginatorMiddleware, ingredientController.list)
router.post('/:id/update_name', auth, ingredientController.updateName)
router.get('/:id', auth, ingredientController.detail)
router.post('/', auth, ingredientController.create)
router.delete('/:id', auth, ingredientController.delete)

module.exports = router
