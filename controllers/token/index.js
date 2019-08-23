const {
  list,
  detail,
  remove,
  updateIsBlocked
} = require('./crud')

module.exports = {
  list,
  detail,
  delete: remove,
  updateIsBlocked
}
