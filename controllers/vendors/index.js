const {
  list,
  detail,
  create,
  remove,
  updateName,
  updatePhone,
  updateAddress
} = require('./crud')

module.exports = {
  list,
  detail,
  create,
  delete: remove,
  updateName,
  updatePhone,
  updateAddress
}
