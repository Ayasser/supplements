const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['admin', 'customer'],
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  jwt_token: {
    type: String,
    unique: true
  },
  expiry_date: {
    type: Date,
    default: () => {
      var date = new Date().getTime()
      date += 3600000
      return new Date(date)
    }
  },
  is_blocked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model('Token', tokenSchema)
