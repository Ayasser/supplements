const express = require('express')
const router = express.Router()

const authAdmin = require('../middleware/authadmin')
const { paginatorMiddleware } = require('../middleware/paginator')
const tokenController = require('../controllers/token')

router.get('/', authAdmin, paginatorMiddleware, tokenController.list)
router.get('/:id', authAdmin, tokenController.detail)
router.delete('/:id', authAdmin, tokenController.delete)
router.post('/:id/update_isblocked', authAdmin, tokenController.updateIsBlocked)

module.exports = router
