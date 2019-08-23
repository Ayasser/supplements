const {
  list,
  detail,
  create,
  remove
} = require('./crud')

module.exports = {
  list,
  detail,
  create,
  delete: remove
}
