const Boom = require('@hapi/boom')

const Vendor = require('../../models/vendor')
const { filters } = require('../../lib/filters')
const { isObjectId } = require('../../lib/utils')

const listAsync = async (req, res) => {
  const query = filters(req.query, [
    { type: 'string', field: 'name' },
    { type: 'string', field: 'phone' }
  ])

  const { limit, from, sort } = req.parsed.paginator

  const [ vendors, total ] = await Promise.all([
    Vendor.find(query)
      .sort(sort || 'createdAt').limit(limit).skip(from).lean(),
    Vendor.count(query)
  ])

  res.send({
    type: 'vendor',
    total,
    hits: vendors.map(vendor => ({ _id: vendor._id, _source: vendor }))
  })
}

const detailAsync = async (req, res) => {
  const vendorId = req.params.id
  if (!isObjectId(vendorId)) throw Boom.notFound('invalid vendor id')

  const vendor = await Vendor.findById(vendorId)
  if (!vendor) throw Boom.notFound('vendor not found')
  res.status(200).send(vendor)
}

const createAsync = async (req, res) => {
  const { name, address, phone } = req.body

  if (!name) throw Boom.badRequest('missing name', { field: 'name' })
  if (!address) throw Boom.badRequest('missing address', { field: 'address' })
  if (!phone) throw Boom.badRequest('missing phone', { field: 'phone' })

  const vendor = new Vendor({
    name: name,
    address: address,
    phone: phone
  })

  await vendor.save()

  res.send(vendor)
}

const removeAsync = async (req, res) => {
  const vendorId = req.params.id
  if (!isObjectId(vendorId)) throw Boom.notFound('invalid vendor id')

  const vendor = await Vendor.findById(vendorId)
  if (!vendor) throw Boom.notFound('vendor not found')

  await vendor.delete()
  res.send('Deleted')
}

const updateName = async (req, res) => {
  const vendorId = req.params.id
  let name = req.body.name
  if (!isObjectId(vendorId)) throw Boom.notFound('invalid vendor id')
  if (!name) throw Boom.badRequest('missing name', { field: 'name' })

  name = name.trim()
  if (!name.length) throw Boom.badRequest('invalid name', { field: 'name' })

  const vendor = await Vendor.findById(vendorId)
  if (!vendor) throw Boom.notFound('vendor not found')
  if (vendor.name === name) throw Boom.badRequest('same name', { field: 'name' })

  vendor.name = name
  await vendor.save()

  res.send(vendor)
}

const updatePhone = async (req, res) => {
  const vendorId = req.params.id
  let phone = req.body.phone
  if (!isObjectId(vendorId)) throw Boom.notFound('invalid vendor id')
  if (!phone) throw Boom.badRequest('missing phone', { field: 'phone' })

  phone = phone.trim()
  if (!phone.length) throw Boom.badRequest('invalid phone', { field: 'phone' })

  const vendor = await Vendor.findById(vendorId)
  if (!vendor) throw Boom.notFound('vendor not found')
  if (vendor.phone === phone) throw Boom.badRequest('same phone', { field: 'phone' })

  vendor.phone = phone
  await vendor.save()

  res.send(vendor)
}

const updateAddress = async (req, res) => {
  const vendorId = req.params.id
  let address = req.body.address
  if (!isObjectId(vendorId)) throw Boom.notFound('invalid vendor id')
  if (!address) throw Boom.badRequest('missing address', { field: 'address' })

  address = address.trim()
  if (!address.length) throw Boom.badRequest('invalid address', { field: 'address' })

  const vendor = await Vendor.findById(vendorId)
  if (!vendor) throw Boom.notFound('vendor not found')
  if (vendor.address === address) throw Boom.badRequest('same address', { field: 'address' })

  vendor.address = address
  await vendor.save()

  res.send(vendor)
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
