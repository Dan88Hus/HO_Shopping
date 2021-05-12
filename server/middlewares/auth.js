const admin = require('../firebase/firebase')
const User = require('../models/user')

exports.authCheck = async (req,res, next) => {
  if(req.headers.authtoken) {
    console.log("Middleware header token exist")
  }else{
    console.log("Middleware header token DOESNOT exist")

  }

  try {
    const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);
    // console.log('Firebase user is granted by authcheck server', firebaseUser)
    req.user = firebaseUser
    next()
  } catch (error) {
    res.status(401).json({
      err:"Invalid or expired token, msg coming from backend",
    })
  }
  
}

exports.adminCheck = async (req,res, next) => {
  // console.log(req.headers.authtoken)
  const {email} = req.user
    const adminUser = await User.findOne({email})
    if (adminUser.role !== "admin") {
      res.status(403).json({
        err: "Access Denied"
      })
    }else {
      next()
    }
  
}