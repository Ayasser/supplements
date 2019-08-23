const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cron = require('node-cron')
const app = express()

const usersRoute = require('./routes/user')
const ingredientsRoute = require('./routes/ingredient')
const manufacturersRoute = require('./routes/manufacturer')
const stocksRoute = require('./routes/stock')
const dropboxRoute = require('./routes/dropbox')
const vendorRoute = require('./routes/vendor')
const ordersRoute = require('./routes/order')
const supplementsRoute = require('./routes/supplement')
const supplementtypesRoute = require('./routes/supplement_types')
const tokensRoute = require('./routes/token')

const jobs = require('./jobs/stock')

const metricsRoute = require('./routes/metrices')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose
  .connect('mongodb://localhost:27017/supplements', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB...')
    cron.schedule('0 0 * * *', () => {
      jobs.checkSupplementStock()
    })
    app.listen(8080)
  })
  .catch(err => console.error('Could not connect to MongoDB...', err))
mongoose.set('useCreateIndex', true)

app.use('/api/users', usersRoute)
app.use('/api/ingredient', ingredientsRoute)
app.use('/api/manufacturer', manufacturersRoute)
app.use('/api/order', ordersRoute)
app.use('/api/stock', stocksRoute)
app.use('/api/supplement', supplementsRoute)
app.use('/api/supplementtypes', supplementtypesRoute)
app.use('/api/token', tokensRoute)
app.use('/api/vendor', vendorRoute)

app.use('/api/', dropboxRoute)

app.use('/api/metrics', metricsRoute)
