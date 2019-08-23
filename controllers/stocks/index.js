const {
  list,
  detail,
  create,
  remove,
  updateCanOrder,
  updateQuantity
} = require('./crud')

module.exports = {
  list,
  detail,
  create,
  delete: remove,
  updateCanOrder,
  updateQuantity
}
