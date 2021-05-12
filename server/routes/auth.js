const express = require('express')


// app.get oldugu gibi router.get simdi 

const router = express.Router()

//middlewares 
const {authCheck, adminCheck} = require('../middlewares/auth')

//import controllers
const {createOrUpdateUser, currentUser} = require('../controllers/auth')


//

router.post('/create-or-update-user', authCheck, createOrUpdateUser);
router.post('/current-user', authCheck, currentUser);
router.post('/current-admin', authCheck, adminCheck, currentUser);


module.exports = router