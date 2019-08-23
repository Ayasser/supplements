const Boom = require('@hapi/boom')
const _ = require('lodash')
const Token = require('../../models/token')

const { filters } = require('../../lib/filters')
const { isObjectId } = require('../../lib/utils')

const listAsync = async (req, res) => {
  const query = filters(req.query, [
    { type: 'boolean', field: 'is_blocked' },
    { type: 'id', field: 'owner' },
    { type: 'string', field: 'type' }
  ])

  const { limit, from, sort } = req.parsed.paginator

  const [tokens, total] = await Promise.all([
    Token.find(query)
      .sort(sort || 'createdAt').limit(limit).skip(from).lean(),
    Token.count(query)
  ])

  res.send({
    type: 'token',
    total,
    hits: tokens.map(token => ({ _id: token._id, _source: token }))
  })
}

const detailAsync = async (req, res) => {
  const tokenId = req.params.id
  if (!isObjectId(tokenId)) throw Boom.notFound('invalid token id')

  const token = await Token.findById(tokenId)
  if (!token) throw Boom.notFound('token not found')
  res.status(200).send(token)
}

const removeAsync = async (req, res) => {
  const tokenId = req.params.id
  if (!isObjectId(tokenId)) throw Boom.notFound('invalid token id')

  const token = await Token.findById(tokenId)
  if (!token) throw Boom.notFound('token not found')

  await token.delete()
  res.send('Deleted')
}

const updateIsBlocked = async (req, res) => {
  const tokenId = req.params.id
  let isBlocked = req.body.is_blocked
  if (!isObjectId(tokenId)) throw Boom.notFound('invalid token id')
  if (_.isNil(isBlocked)) throw Boom.badRequest('missing isBlock', { field: 'isBlock' })

  const token = await Token.findById(tokenId)
  if (!token) throw Boom.notFound('token not found')
  token.is_blocked = isBlocked
  await token.save()

  res.send(token)
}
module.exports = {
  list: listAsync,
  detail: detailAsync,
  remove: removeAsync,
  updateIsBlocked: updateIsBlocked
}
