const express = require('express')


// app.get oldugu gibi router.get simdi 

const router = express.Router()

//middlewares 
const {authCheck, adminCheck} = require('../middlewares/auth')

//import controllers
const {create, read, update, remove, list} = require('../controllers/sub')


//

router.post('/sub', authCheck, adminCheck, create);
router.get('/subs', list);
router.get('/sub/:slug', read);
router.put('/sub/:slug', authCheck, adminCheck, update);
router.delete('/sub/:slug', authCheck, adminCheck, remove);



module.exports = router