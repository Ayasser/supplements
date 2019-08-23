const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  supplement: [{
    supplement: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Supplement'
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  total_price: {
    type: Number,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)
