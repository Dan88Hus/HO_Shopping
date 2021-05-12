const Coupon = require("../models/coupon")

exports.create = async(req,res)=>{
  try {
    const { name, expiry, discount } = req.body.coupon
    res.json(await new Coupon({ name, expiry, discount}).save())
  } catch (error) {
    console.log("Error from backend Coupon",error.message)
  }
}

exports.remove = async(req,res)=>{
  try {
    res.json(await Coupon.findByIdAndDelete(req.params.couponId).exec())
  } catch (error) {
    console.log("Error from backend Coupon",error.message)
  }
}

exports.list = async(req,res)=>{
  try {
    let coupons = await Coupon.find({}).sort({createdAt: -1}).exec()
    // console.log("copons from server",coupons)
    res.json(coupons)
  } catch (error) {   
    console.log("Error from backend Coupon",error.message)
  }
}