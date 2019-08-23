const Order = require('../../models/order')
const _ = require('lodash')

const metricsOverMonth = async (req, res) => {
  const date = new Date()
  let startDay
  let endDay
  if (_.isNil(req.params.start_date)) {
    startDay = new Date(date.getFullYear(), date.getMonth(), 1)
  } else {
    startDay = req.params.start_date
  }
  if (_.isNil(req.params.end_day)) {
    endDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  } else {
    endDay = req.params.end_day
  }

  const orders = await Order.find({ createdAt: { $gte: startDay, $lte: endDay } }).populate({
    path: 'supplement.supplement',
    select: 'name'
  }).lean()

  let supplements = {}
  let totalQuantity = 0
  for (let i = 0; i < orders.length; i++) {
    for (let j = 0; j < orders[i].supplement.length; j++) {
      if (orders[i].supplement[j].supplement.name in supplements) {
        supplements[orders[i].supplement[j].supplement.name] += orders[i].supplement[j].quantity
      } else {
        supplements[orders[i].supplement[j].supplement.name] = orders[i].supplement[j].quantity
      }
      totalQuantity += orders[i].supplement[j].quantity
    }
  }

  res.status(200).send({
    supplements: supplements,
    totalQuantity: totalQuantity
  })
}

module.exports = {
  metricsOverMonth
}
