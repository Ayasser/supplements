const mongoose = require('mongoose')

const supplementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  supplement_type: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'SupplementTypes'
  },
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Manufacturer'
  },
  price: {
    type: Number,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Supplement', supplementSchema)
