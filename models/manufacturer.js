const mongoose = require('mongoose')

const manufacturerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  phone: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Manufacturer', manufacturerSchema)
