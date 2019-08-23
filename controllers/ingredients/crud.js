const Boom = require('@hapi/boom')

const Ingredient = require('../../models/ingredient')
const { filters } = require('../../lib/filters')
const { isObjectId } = require('../../lib/utils')

const listAsync = async (req, res) => {
  const query = filters(req.query, [
    { type: 'string', field: 'name' }
  ])

  const { limit, from, sort } = req.parsed.paginator

  const [ ingredients, total ] = await Promise.all([
    Ingredient.find(query)
      .sort(sort || 'createdAt').limit(limit).skip(from).lean(),
    Ingredient.count(query)
  ])
  res.send({
    type: 'ingredient',
    total,
    hits: ingredients.map(ingredient => ({ _id: ingredient._id, _source: ingredient }))
  })
}

const detailAsync = async (req, res) => {
  const ingredientId = req.params.id
  if (!isObjectId(ingredientId)) throw Boom.notFound('invalid ingredient id')

  const ingredient = await Ingredient.findById(ingredientId)
  if (!ingredient) throw Boom.notFound('ingredient not found')
  res.status(200).send(ingredient)
}

const createAsync = async (req, res) => {
  const { name } = req.body
  if (!name) throw Boom.badRequest('missing name', { field: 'name' })

  const ingredient = new Ingredient({ name })

  await ingredient.save()

  res.send(ingredient)
}

const removeAsync = async (req, res) => {
  const ingredientId = req.params.id
  if (!isObjectId(ingredientId)) throw Boom.notFound('invalid ingredient id')

  const ingredient = await Ingredient.findById(ingredientId)
  if (!ingredient) throw Boom.notFound('ingredient not found')

  await ingredient.delete()
  res.send('Deleted')
}

const updateName = async (req, res) => {
  const ingredientId = req.params.id
  let name = req.body.name
  if (!isObjectId(ingredientId)) throw Boom.notFound('invalid ingredient id')
  if (!name) throw Boom.badRequest('missing name', { field: 'name' })

  name = name.trim()
  if (!name.length) throw Boom.badRequest('invalid name', { field: 'name' })

  const ingredient = await Ingredient.findById(ingredientId)
  if (!ingredient) throw Boom.notFound('ingredient not found')
  if (ingredient.name === name) throw Boom.badRequest('same name', { field: 'name' })

  ingredient.name = name
  await ingredient.save()

  res.send(ingredient)
}

module.exports = {
  list: listAsync,
  detail: detailAsync,
  create: createAsync,
  remove: removeAsync,
  updateName: updateName
}
