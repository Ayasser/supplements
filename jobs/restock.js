const Stock = require('../models/stock')
const _ = require('lodash')

const reStockSupplement = async (req, res) => {
  const stocks = await Stock.find({ quantity: { $lte: 100 } }).sort({ quantity: 1 }).populate('supplement').lean()
  if (!_.isNil(stocks)) {
    for (let i = 0; i < stocks.length; i++) {
    //   call thirdparty  get return quantity of restock
      const restockQuantity = 10 // this value of stock order from 3rd party
      const updatedQuantity = stocks[i].quantity + restockQuantity
      await Stock.findByIdAndUpdate(stocks[i]._id, { can_order: true, quantity: updatedQuantity })
    }
  }
}

module.exports = {
  reStockSupplement
}
