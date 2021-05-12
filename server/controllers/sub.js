const Sub = require("../models/sub")
const Product  = require('../models/product')
const slugify = require('slugify')


exports.create = async (req, res) => {
  try {
      const { name, parent } = req.body.subb
    //   const category = await new Category({name, slug: slugify(name)}).save()
    //   res.json(category)
    console.log("Sub name and parent category:", name , parent)
    res.json(await new Sub({ name, parent, slug: slugify(name) }).save());
  } catch (error) {
      console.log(error)
      res.status(400).send('Create Sub Failed')
  }
}

exports.list = async(req, res) => {
    listproducts = await Sub.find({}).sort({createdAt: -1}).exec()
    res.json(listproducts)
}

exports.read = async(req, res) => {
   let sub = await Sub.findOne({slug: req.params.slug}).exec()
  //  res.json(sub)
  const products = await Product.find({ subs: sub })
  //we dont populate , optional
  .populate("category")
  .exec()
  res.json({
    sub,
    products
  })
  }

 exports.update = async(req, res) => {
     const { name, parent } = req.body
     try {
        const updated = await Sub.findOneAndUpdate
        ({slug: req.params.slug}, {name: name , parent,  slug: slugify(name)},
        {new: true})
        res.json(updated)
     } catch (error) {
        res.status(400).send("Sub Update Failed")
     }
  }

  exports.remove = async(req, res) => {
    try {
        const deleted = await Sub.findOneAndDelete({slug: req.params.slug})
        res.json(deleted)
    } catch (error) {
        res.status(400).send("Sub Delete Failed")
    }
  }
