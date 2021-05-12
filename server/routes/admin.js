const express = require('express')
// const { auth } = require("../firebase/firebase");

// app.get oldugu gibi router.get simdi 

const router = express.Router()

//middlewares 
const {authCheck, adminCheck} = require('../middlewares/auth')

//import controllers
const {orders, orderStatus} = require('../controllers/admin')


//

router.get('/admin/orders', authCheck, adminCheck, orders);


router.put('/admin/order-status', authCheck, adminCheck, orderStatus);




module.exports = router