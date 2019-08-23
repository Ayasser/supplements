const jwt = require('jsonwebtoken')
const config = require('config')
const Boom = require('@hapi/boom')
const Token = require('../models/token')

module.exports = async function (req, res, next) {
  // get the token from the header if present
  const token = req.headers['x-access-token'] || req.headers['authorization']
  // if no token found, return response (without going to the next middelware)
  if (!token) throw Boom.unauthorized('Access denied. No token provided.')

  try {
    // if can verify the token, set req.user and pass to next middleware
    jwt.verify(token, config.get('myprivatekey'), async function (err, decoded) {
      if (err) {
        req.authenticated = false
        req.decoded = null
        req.err_name = err.name
        throw Boom.unauthorized('invalid token')
      } else {
        const savedToken = await Token.findOne({ jwt_token: token })
        if (savedToken.is_blocked) throw Boom.unauthorized('blocked token')
        if (decoded.role !== 'admin') throw Boom.unauthorized('invalid token')

        req.user = decoded
        req.authenticated = true
        next()
      }
    })
  } catch (ex) {
    // if invalid token
    throw Boom.unauthorized('invalid token')
  }
}
