exports.paginatorMiddleware = (req, res, next) => {
  if (req.method !== 'GET') return next()

  req.parsed = req.parsed || {}

  const page = parseInt(req.query.page || 1)
  const limit = parseInt(req.query.limit || 10)

  req.parsed.paginator = {
    page,
    limit,
    from: (page - 1) * limit,
    sort: req.query.sort
  }
  return next()
}
