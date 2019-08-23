const {
  list,
  detail,
  create,
  remove,
  updateName,
  updatePrice
} = require('./crud')

module.exports = {
  list,
  detail,
  create,
  delete: remove,
  updateName,
  updatePrice
}
