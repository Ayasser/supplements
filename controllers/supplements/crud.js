const Boom = require('@hapi/boom')
const _ = require('lodash')
const Supplement = require('../../models/supplement')
const SupplementType = require('../../models/supplement_types')
const Manufacturer = require('../../models/manufacturer')

const { filters } = require('../../lib/filters')
const { isObjectId } = require('../../lib/utils')

const listAsync = async (req, res) => {
  const query = filters(req.query, [
    { type: 'string', field: 'name' },
    { type: 'int', field: 'price' },
    { type: 'id', field: 'manufacturer' },
    { type: 'id', field: 'supplement_type' }
  ])

  const { limit, from, sort } = req.parsed.paginator

  const [supplements, total] = await Promise.all([
    Supplement.find(query)
      .sort(sort || 'createdAt').limit(limit).skip(from).lean(),
    Supplement.count(query)
  ])

  res.send({
    type: 'supplement',
    total,
    hits: supplements.map(supplement => ({ _id: supplement._id, _source: supplement }))
  })
}

const detailAsync = async (req, res) => {
  const supplementId = req.params.id
  if (!isObjectId(supplementId)) throw Boom.notFound('invalid supplement id')

  const supplement = await Supplement.findById(supplementId)
  if (!supplement) throw Boom.notFound('supplement not found')
  res.status(200).send(supplement)
}

const createAsync = async (req, res) => {
  const { name, typeId, manufacturerId, price } = req.body
  if (!name) throw Boom.badRequest('missing name', { field: 'name' })
  if (!typeId) throw Boom.badRequest('missing supplement Type', { field: 'supplementtype' })
  if (!manufacturerId) throw Boom.badRequest('missing manufacturer', { field: 'manufacturer' })
  if (!price) throw Boom.badRequest('missing price', { field: 'price' })

  const supplementType = await SupplementType.findById(typeId)
  if (_.isNil(supplementType)) throw Boom.badRequest('supplement Type Not found', { field: 'supplement' })
  const manufacturer = await Manufacturer.findById(manufacturerId)
  if (_.isNil(manufacturer)) throw Boom.badRequest('manufacturer Not found', { field: 'manufacturer' })

  const supplement = new Supplement({
    name: name,
    supplement_type: supplementType,
    manufacturer: manufacturer,
    price: price
  })

  await supplement.save()
  res.send(supplement)
}

const removeAsync = async (req, res) => {
  const supplementId = req.params.id
  if (!isObjectId(supplementId)) throw Boom.notFound('invalid supplement id')

  const supplement = await Supplement.findById(supplementId)
  if (!supplement) throw Boom.notFound('supplement not found')

  await supplement.delete()
  res.send('Deleted')
}

const updateName = async (req, res) => {
  const supplementId = req.params.id
  let name = req.body.name
  if (!isObjectId(supplementId)) throw Boom.notFound('invalid supplement id')
  if (!name) throw Boom.badRequest('missing name', { field: 'name' })

  name = name.trim()
  if (!name.length) throw Boom.badRequest('invalid name', { field: 'name' })

  const supplement = await Supplement.findById(supplementId)
  if (!supplement) throw Boom.notFound('supplement not found')
  if (supplement.name === name) throw Boom.badRequest('same name', { field: 'name' })

  supplement.name = name
  await supplement.save()

  res.send(supplement)
}

const updatePrice = async (req, res) => {
  const supplementId = req.params.id
  let price = req.body.price
  if (!isObjectId(supplementId)) throw Boom.notFound('invalid supplement id')
  if (!price) throw Boom.badRequest('missing price', { field: 'price' })
  price = parseFloat(price)
  const supplement = await Supplement.findById(supplementId)
  if (!supplement) throw Boom.notFound('supplement not found')
  if (supplement.price === price) throw Boom.badRequest('same price', { field: 'price' })

  supplement.price = price
  await supplement.save()

  res.send(supplement)
}
module.exports = {
  list: listAsync,
  detail: detailAsync,
  create: createAsync,
  remove: removeAsync,
  updateName: updateName,
  updatePrice: updatePrice
}
