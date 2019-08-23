const Boom = require('@hapi/boom')

const Manufacturer = require('../../models/manufacturer')
const { filters } = require('../../lib/filters')
const { isObjectId } = require('../../lib/utils')

const listAsync = async (req, res) => {
  const query = filters(req.query, [
    { type: 'string', field: 'name' },
    { type: 'string', field: 'phone' }

  ])

  const { limit, from, sort } = req.parsed.paginator

  const [ manufacturers, total ] = await Promise.all([
    Manufacturer.find(query)
      .sort(sort || 'createdAt').limit(limit).skip(from).lean(),
    Manufacturer.count(query)
  ])

  res.send({
    type: 'manufacturer',
    total,
    hits: manufacturers.map(manufacturer => ({ _id: manufacturer._id, _source: manufacturer }))
  })
}

const detailAsync = async (req, res) => {
  const manufacturerId = req.params.id
  if (!isObjectId(manufacturerId)) throw Boom.notFound('invalid manufacturer id')

  const manufacturer = await Manufacturer.findById(manufacturerId)
  if (!manufacturer) throw Boom.notFound('manufacturer not found')
  res.status(200).send(manufacturer)
}

const createAsync = async (req, res) => {
  const { name, address, phone } = req.body

  if (!name) throw Boom.badRequest('missing name', { field: 'name' })
  if (!address) throw Boom.badRequest('missing address', { field: 'address' })
  if (!phone) throw Boom.badRequest('missing phone', { field: 'phone' })

  const manufacturer = new Manufacturer({
    name: name,
    address: address,
    phone: phone
  })

  await manufacturer.save()

  res.send(manufacturer)
}

const removeAsync = async (req, res) => {
  const manufacturerId = req.params.id
  if (!isObjectId(manufacturerId)) throw Boom.notFound('invalid manufacturer id')

  const manufacturer = await Manufacturer.findById(manufacturerId)
  if (!manufacturer) throw Boom.notFound('manufacturer not found')

  await manufacturer.delete()
  res.send('Deleted')
}

const updateName = async (req, res) => {
  const manufacturerId = req.params.id
  let name = req.body.name
  if (!isObjectId(manufacturerId)) throw Boom.notFound('invalid manufacturer id')
  if (!name) throw Boom.badRequest('missing name', { field: 'name' })

  name = name.trim()
  if (!name.length) throw Boom.badRequest('invalid name', { field: 'name' })

  const manufacturer = await Manufacturer.findById(manufacturerId)
  if (!manufacturer) throw Boom.notFound('manufacturer not found')
  if (manufacturer.name === name) throw Boom.badRequest('same name', { field: 'name' })

  manufacturer.name = name
  await manufacturer.save()

  res.send(manufacturer)
}

const updatePhone = async (req, res) => {
  const manufacturerId = req.params.id
  let phone = req.body.phone
  if (!isObjectId(manufacturerId)) throw Boom.notFound('invalid manufacturer id')
  if (!phone) throw Boom.badRequest('missing phone', { field: 'phone' })

  phone = phone.trim()
  if (!phone.length) throw Boom.badRequest('invalid phone', { field: 'phone' })

  const manufacturer = await Manufacturer.findById(manufacturerId)
  if (!manufacturer) throw Boom.notFound('manufacturer not found')
  if (manufacturer.phone === phone) throw Boom.badRequest('same phone', { field: 'phone' })

  manufacturer.phone = phone
  await manufacturer.save()

  res.send(manufacturer)
}

const updateAddress = async (req, res) => {
  const manufacturerId = req.params.id
  let address = req.body.address
  if (!isObjectId(manufacturerId)) throw Boom.notFound('invalid manufacturer id')
  if (!address) throw Boom.badRequest('missing address', { field: 'address' })

  address = address.trim()
  if (!address.length) throw Boom.badRequest('invalid address', { field: 'address' })

  const manufacturer = await Manufacturer.findById(manufacturerId)
  if (!manufacturer) throw Boom.notFound('manufacturer not found')
  if (manufacturer.address === address) throw Boom.badRequest('same address', { field: 'address' })

  manufacturer.address = address
  await manufacturer.save()

  res.send(manufacturer)
}
module.exports = {
  list: listAsync,
  detail: detailAsync,
  create: createAsync,
  remove: removeAsync,
  updateName: updateName,
  updatePhone: updatePhone,
  updateAddress: updateAddress
}
