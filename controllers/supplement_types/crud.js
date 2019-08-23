const Boom = require('@hapi/boom')

const SupplementType = require('../../models/supplement_types')
const { filters } = require('../../lib/filters')
const { isObjectId } = require('../../lib/utils')

const listAsync = async (req, res) => {
  const query = filters(req.query, [
    { type: 'string', field: 'name' }
  ])

  const { limit, from, sort } = req.parsed.paginator

  const [ supplementTypes, total ] = await Promise.all([
    SupplementType.find(query)
      .sort(sort || 'createdAt').limit(limit).skip(from).lean(),
    SupplementType.count(query)
  ])
  res.send({
    type: 'supplementType',
    total,
    hits: supplementTypes.map(supplementType => ({ _id: supplementType._id, _source: supplementType }))
  })
}

const detailAsync = async (req, res) => {
  const supplementTypeId = req.params.id
  if (!isObjectId(supplementTypeId)) throw Boom.notFound('invalid supplementType id')

  const supplementType = await SupplementType.findById(supplementTypeId)
  if (!supplementType) throw Boom.notFound('supplementType not found')
  res.status(200).send(supplementType)
}

const createAsync = async (req, res) => {
  const { name } = req.body
  if (!name) throw Boom.badRequest('missing name', { field: 'name' })

  const supplementType = new SupplementType({ name })

  await supplementType.save()

  res.send(supplementType)
}

const removeAsync = async (req, res) => {
  const supplementTypeId = req.params.id
  if (!isObjectId(supplementTypeId)) throw Boom.notFound('invalid supplementType id')

  const supplementType = await SupplementType.findById(supplementTypeId)
  if (!supplementType) throw Boom.notFound('supplementType not found')

  await supplementType.delete()
  res.send('Deleted')
}

const updateName = async (req, res) => {
  const supplementTypeId = req.params.id
  let name = req.body.name
  if (!isObjectId(supplementTypeId)) throw Boom.notFound('invalid supplementType id')
  if (!name) throw Boom.badRequest('missing name', { field: 'name' })

  name = name.trim()
  if (!name.length) throw Boom.badRequest('invalid name', { field: 'name' })

  const supplementType = await SupplementType.findById(supplementTypeId)
  if (!supplementType) throw Boom.notFound('supplementType not found')
  if (supplementType.name === name) throw Boom.badRequest('same name', { field: 'name' })

  supplementType.name = name
  await supplementType.save()

  res.send(supplementType)
}

module.exports = {
  list: listAsync,
  detail: detailAsync,
  create: createAsync,
  remove: removeAsync,
  updateName: updateName
}
