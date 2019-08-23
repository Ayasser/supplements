const Boom = require('@hapi/boom')
const _ = require('lodash')

const Order = require('../../models/order')
const Supplement = require('../../models/supplement')
const User = require('../../models/user')
const Stock = require('../../models/stock')

const { filters } = require('../../lib/filters')
const { isObjectId } = require('../../lib/utils')

const listAsync = async (req, res) => {
  const query = filters(req.query, [
    { type: 'int', field: 'total_price' },
    { type: 'id', field: 'user' }
  ])

  const { limit, from, sort } = req.parsed.paginator

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort(sort || 'createdAt').limit(limit).skip(from).lean(),
    Order.count(query)
  ])
  res.send({
    type: 'order',
    total,
    hits: orders.map(order => ({ _id: order._id, _source: order }))
  })
}

const detailAsync = async (req, res) => {
  const orderId = req.params.id
  if (!isObjectId(orderId)) throw Boom.notFound('invalid order id')

  const order = await Order.findById(orderId)
  if (!order) throw Boom.notFound('order not found')
  res.status(200).send(order)
}

const createAsync = async (req, res) => {
  const { supplements, totalPrice, user } = req.body
  if (!supplements) throw Boom.badRequest('missing supplements', { field: 'supplements' })
  if (!user) throw Boom.badRequest('missing user', { field: 'user' })
  if (!totalPrice) throw Boom.badRequest('missing total_price', { field: 'total_price' })
  const userObj = await User.findById(user)
  if (_.isNil(userObj)) {
    throw Boom.badRequest('user Not found', { field: 'user' })
  }
  let total = 0

  for (let j = 0; j < supplements.length; j++) {
    const supplementObj = await Supplement.findById(supplements[j].supplement)
    if (_.isNil(supplementObj)) {
      throw Boom.badRequest('supplement Not found', { field: 'supplement' })
    }
    const stock = await Stock.findOne({ supplement: supplements[j].supplement })
    if ((stock.quantity - supplements[j].quantity) >= 0) {
      throw Boom.badRequest('no engouh quantity', { field: 'supplement' })
    }
    total += supplementObj.price * parseInt(supplements[j].quantity)
  }
  const order = new Order({
    supplement: supplements,
    total_price: total,
    user: userObj
  })
  await order.save()

  for (let j = 0; j < order.supplement.length; j++) {
    const stock = await Stock.findOne({ supplement: order.supplement[j].supplement })
    const quantity = stock.quantity - order.supplement[j].quantity
    await Stock.findByIdAndUpdate(stock._id, { quantity: quantity })
  }

  res.send(order)
}

const removeAsync = async (req, res) => {
  const orderId = req.params.id
  if (!isObjectId(orderId)) throw Boom.notFound('invalid order id')

  const order = await Order.findById(orderId)
  if (!order) throw Boom.notFound('order not found')

  await order.delete()
  res.send('Deleted')
}

module.exports = {
  list: listAsync,
  detail: detailAsync,
  create: createAsync,
  remove: removeAsync
}
