const Boom = require('@hapi/boom')
const mongoose = require('mongoose')
const { isObjectId } = require('./utils')

const filters = (params, fields) => {
  const query = {}

  for (const { type, field, from, start, end } of fields || []) {
    if (type === 'string') {
      const key = from || field
      const value = params[key]
      if (value) {
        query[field] = value instanceof Array ? { $in: value } : value
      }
    } else if (type === 'id') {
      const key = from || field
      const value = params[key]
      if (value) {
        if (value instanceof Array) {
          if (value.some(id => !isObjectId(id))) throw Boom.badRequest(`invalid ${key} id`)
          query[field] = { $in: value.map(id => mongoose.Types.ObjectId(id)) }
        } else {
          if (!isObjectId(value)) throw Boom.badRequest(`invalid ${key} id`)
          query[field] = mongoose.Types.ObjectId(value)
        }
      }
    } else if (type === 'boolean') {
      const key = from || field
      const value = params[key]
      if (value === true || value === 'true') query[field] = true
      if (value === false || value === 'false') query[field] = false
    } else if (type === 'int') {
      const key = from || field
      const value = parseInt(params[key])
      if (!isNaN(value)) query[field] = value
    } else if (type === 'date') {
      const startKey = start || field
      const endKey = end || startKey
      const addDay = startKey === endKey

      const startDate = new Date(params[startKey])
      const endDate = new Date(params[endKey])
      if (addDay) endDate.setDate(endDate.getDate() + 1)

      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        query[field] = { $gte: startDate, $lt: endDate }
      }
    } else {
      throw Boom.badImplementation('invalid filter type')
    }
  }

  return query
}
module.exports = { filters }
