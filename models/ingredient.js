const mongoose = require('mongoose')

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  }
}, { timestamps: true })

module.exports = mongoose.model('Ingredient', ingredientSchema)
