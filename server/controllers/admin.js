const Order = require("../models/order")


exports.orders = async (req, res) => {
  try {
    
    let allOrders = await Order.find({})
    .sort("-createdAt")
    .populate("products.product")
    .exec()
    res.json(allOrders)
  } catch (error) {
      console.log(error)
      res.status(400).send('fetching all order in admin side is FAILED')
  }
}

exports.orderStatus = async (req,res) => {
  const {orderId, orderStatus} = req.body 

  let updated = await Order.findByIdAndUpdate(
    orderId, {orderStatus: orderStatus }, {new: true}
  ).exec()
  res.json(updated)
}