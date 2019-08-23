const express = require('express')
const router = express.Router()
const dropboxController = require('../controllers/dropbox')
const stockjob = require('../jobs/stock')
const restockjob = require('../jobs/restock')

router.get('/dropbox', dropboxController.getCode)
router.get('/dropbox/connect', dropboxController.dropboxUpload)

router.get('/stock', stockjob.checkSupplementStock)

router.get('/restock', restockjob.reStockSupplement)

module.exports = router
