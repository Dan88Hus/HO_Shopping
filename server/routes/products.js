const express = require('express')


// app.get oldugu gibi router.get simdi 

const router = express.Router()

//middlewares 
const {authCheck, adminCheck} = require('../middlewares/auth')

//import controllers
// const {create, read, update, remove, list} = require('../controllers/category')
// const {create, read} = require('../controllers/product') this also going to be changed for listAll
const {create, listAll, 
  remove, read, update, list, 
  productsCount, productStar, listRelated, searchFilters} = require('../controllers/product')
//

router.post('/product', authCheck, adminCheck, create);
// router.get('/products', read); this will change for pagination as below
router.get('/products/total', productsCount) // to find total products for pagination
router.get('/products/:count', listAll);
router.delete('/product/:slug', authCheck, adminCheck, remove);
router.get('/product/:slug', read);
router.put('/product/:slug', authCheck, adminCheck, update);
router.post('/products', list) //for Home product to list

//rating
router.put('/product/star/:productId', authCheck, adminCheck, productStar );

// related
router.get("/product/related/:productId", listRelated);
//search end points, 8 farkli filitre icin tek router kullanacagiz ondan post method , cunku bazen slug gonderecegiz

router.post('/search/filters', searchFilters)






module.exports = router