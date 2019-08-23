const Stock = require('../models/stock')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const _ = require('lodash')
const dropbox = require('../controllers/dropbox')
const checkSupplementStock = async (req, res) => {
  const stocks = await Stock.find({ quantity: { $lte: 100 } }).sort({ quantity: 1 }).populate('supplement').lean()
  if (!_.isNil(stocks)) {
    let records = []
    let stock
    for (let i = 0; i < stocks.length; i++) {
      stock = {}
      stock['supplement'] = stocks[i].supplement.name
      stock['quantity'] = stocks[i].quantity

      await Stock.findByIdAndUpdate(stocks[i]._id, { can_order: false })
      records.push(stock)
    }

    const csvWriter = createCsvWriter({
      path: './static/low_stocks.csv',
      header: [
        { id: 'supplement', title: 'Supplement' },
        { id: 'quantity', title: 'Quantity' }
      ]
    })

    csvWriter.writeRecords(records)       // returns a promise
      .then(() => {
        dropbox.dropboxUpload()
      })
  }
}
module.exports = {
  checkSupplementStock
}
