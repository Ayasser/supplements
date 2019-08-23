const config = require('config')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer'
  }
}, { timestamps: true })

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role: this.role }, config.get('myprivatekey'), {
    expiresIn: '1h'
  })
  // get the private key from the config file -> environment variable
  return token
}
module.exports = mongoose.model('User', userSchema)
