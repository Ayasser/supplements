const express = require('express')
const router = express.Router()
const metricsController = require('../controllers/metrics/metrics')

router.get('/getmonth', metricsController.metricsOverMonth)

module.exports = router
