const isObjectId = (s) => {
  return s && s.length === 24 && /^[0-9a-f]+$/.test(s)
}
module.exports = {
  isObjectId
}
