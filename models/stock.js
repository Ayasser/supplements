const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
  supplement: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Supplement'
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  can_order: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })
module.exports = mongoose.model('Stock', stockSchema)
