const Boom = require('@hapi/boom')
const _ = require('lodash')
const Stock = require('../../models/stock')
const Supplement = require('../../models/supplement')

const { filters } = require('../../lib/filters')
const { isObjectId } = require('../../lib/utils')

const listAsync = async (req, res) => {
  const query = filters(req.query, [
    { type: 'int', field: 'quantity' }
  ])

  const { limit, from, sort } = req.parsed.paginator

  const [stocks, total] = await Promise.all([
    Stock.find(query)
      .sort(sort || 'createdAt').limit(limit).skip(from).lean(),
    Stock.count(query)
  ])

  res.send({
    type: 'stock',
    total,
    hits: stocks.map(stock => ({ _id: stock._id, _source: stock }))
  })
}

const detailAsync = async (req, res) => {
  const stockId = req.params.id
  if (!isObjectId(stockId)) throw Boom.notFound('invalid stock id')

  const stock = await Stock.findById(stockId)
  if (!stock) throw Boom.notFound('stock not found')
  res.status(200).send(stock)
}

const createAsync = async (req, res) => {
  const { quantity, supplementId } = req.body

  if (!quantity) throw Boom.badRequest('missing quantity', { field: 'quantity' })
  if (!supplementId) throw Boom.badRequest('missing supplement', { field: 'supplement' })
  const supplement = await Supplement.findById(supplementId)
  if (_.isNil(supplement)) throw Boom.badRequest('no supplement', { field: 'supplement' })
  const stock = new Stock({
    quantity: quantity,
    supplement: supplement
  })

  await stock.save()
  res.send(stock)
}

const removeAsync = async (req, res) => {
  const stockId = req.params.id
  if (!isObjectId(stockId)) throw Boom.notFound('invalid stock id')

  const stock = await Stock.findById(stockId)
  if (!stock) throw Boom.notFound('stock not found')

  await stock.delete()
  res.send('Deleted')
}

const updateQuantity = async (req, res) => {
  const stockId = req.params.id
  let quantity = parseInt(req.body.quantity)
  if (!isObjectId(stockId)) throw Boom.notFound('invalid stock id')
  if (!quantity) throw Boom.badRequest('missing quantity', { field: 'quantity' })

  const stock = await Stock.findById(stockId)
  if (!stock) throw Boom.notFound('stock not found')
  if (stock.quantity === quantity) throw Boom.badRequest('same quantity', { field: 'quantity' })

  stock.quantity = quantity
  await stock.save()

  res.send(stock)
}

const updateCanOrder = async (req, res) => {
  const stockId = req.params.id
  let canOrder = req.body.can_order
  if (!isObjectId(stockId)) throw Boom.notFound('invalid stock id')
  if (canOrder) throw Boom.badRequest('missing canOrder', { field: 'canOrder' })

  const stock = await Stock.findById(stockId)
  if (!stock) throw Boom.notFound('stock not found')
  if (stock.can_order === canOrder) throw Boom.badRequest('same can Order', { field: 'canOrder' })

  stock.can_order = canOrder
  await stock.save()

  res.send(stock)
}
module.exports = {
  list: listAsync,
  detail: detailAsync,
  create: createAsync,
  remove: removeAsync,
  updateCanOrder: updateCanOrder,
  updateQuantity: updateQuantity
}
