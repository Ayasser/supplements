const {
  list,
  detail,
  create,
  remove,
  updateName
} = require('./crud')

module.exports = {
  list,
  detail,
  create,
  delete: remove,
  updateName
}
