const bcrypt = require('bcrypt')
const _ = require('lodash')
const Joi = require('joi')
const Boom = require('@hapi/boom')

const User = require('../../models/user')
const Token = require('../../models/token')

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.send(user)
}

const singup = async (req, res) => {
  // validate the request body first

  const { error } = validateUser(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // find an existing user
  let user = await User.findOne({ email: req.body.email })

  if (!_.isNil(user)) {
    return res.status(400).send(user)
  }
  user = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email
  })
  user.password = await bcrypt.hash(user.password, 10)
  await user.save()

  const token = user.generateAuthToken()
  const tokenObj = new Token({
    owner: user,
    type: user.role,
    jwt_token: token
  })
  await tokenObj.save()

  res.header('x-auth-token', token).send({
    _id: user._id,
    name: user.name,
    email: user.email
  })
}
const singin = async (req, res) => {
  const { email, password } = req.body

  if (!password) {
    throw Boom.badRequest('missing password')
  }
  if (!email) {
    throw Boom.badRequest('missing email')
  }

  let user = await User.findOne({ email: email })

  if (_.isNil(user)) {
    throw Boom.notFound('Email not found')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Boom.badRequest('wrong password')
  }
  const token = user.generateAuthToken()
  const tokenObj = new Token({
    owner: user,
    type: user.role,
    jwt_token: token
  })
  await tokenObj.save()
  res.header('x-auth-token', token).send({
    _id: user._id,
    name: user.name,
    email: user.email
  })
}

async function validateUser (user) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(255).required()
  }
  return Joi.validate(user, schema)
}

module.exports = {
  getCurrentUser: getCurrentUser,
  singup: singup,
  singin: singin
}
