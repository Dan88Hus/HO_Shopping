const express = require("express")

const router = express.Router()


//middlewares 
const {authCheck} = require('../middlewares/auth')

//controllers
const {userCart, getUserCart, saveAddress,
  applyCouponToUserCart, createOrder, emptyUserCart,
  orders, addToWishlist, wishlist, removeFromWishlist} = require("../controllers/user")

router.post("/user/cart", authCheck, userCart )
router.get("/user/cart", authCheck, getUserCart)
router.post("/user/address", authCheck, saveAddress)
//empty cart
router.delete("/user/emptycart", authCheck, emptyUserCart)
//coupon
router.post("/user/cart/coupon", authCheck, applyCouponToUserCart)

// Orders
router.post("/user/order", authCheck, createOrder)
router.get("/user/orders", authCheck, orders)
// wishlist
router.post("/user/wishlist", authCheck, addToWishlist);
router.get("/user/wishlist", authCheck, wishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

module.exports = router