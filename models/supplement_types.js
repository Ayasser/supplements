const mongoose = require('mongoose')

const supplementTypesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  }
}, { timestamps: true })

module.exports = mongoose.model('SupplementTypes', supplementTypesSchema)
