const User = require("../models/user")
const Cart = require("../models/cart")
const Product = require("../models/product")
const Coupon = require("../models/coupon")
const stripe = require("stripe")(process.env.STRIPE_SECRET)

exports.createPaymentIntent = async (req,res) => {

  const {couponApplied} = req.body
  console.log("couponApplied------------->", couponApplied)

  let user = await User.findOne({email: req.user.email}).exec()

  const {cartTotal, tolalAfterDiscount} = await Cart.findOne({orderdBy : user._id}).exec()
  console.log("CartTotal :", cartTotal, "tolalAfterDiscount:", tolalAfterDiscount)

  let finalAmount = 0
  if (couponApplied && tolalAfterDiscount){
    finalAmount = Math.round(tolalAfterDiscount*100)
  } else {
    finalAmount = Math.round(cartTotal*100)
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "usd"
  })
  res.send({
    clientSecret: paymentIntent.client_secret,
    //stripe docs, for widget to get card number, this send   secret key to front end
    cartTotal,
    tolalAfterDiscount,
    payable: finalAmount,
  })

}

