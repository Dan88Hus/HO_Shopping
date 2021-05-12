const Category = require("../models/category")
const Product = require('../models/product')
const Sub = require('../models/sub')
const slugify = require('slugify')


exports.create = async (req, res) => {
  try {
      const { categoryy } = req.body
    //   const category = await new Category({name, slug: slugify(name)}).save()
    //   res.json(category)
    console.log("categoryy:", categoryy)
    res.json(await new Category({ name: categoryy, slug: slugify(categoryy) }).save());
  } catch (error) {
      console.log(error)
      res.status(400).send('Create Category Failed')
  }
}

exports.list = async(req, res) => {
    listproducts = await Category.find({}).sort({createdAt: -1}).exec()
    // console.log(listproducts)
    res.json(listproducts)
}

exports.read = async(req, res) => {
   let category = await Category.findOne({slug: req.params.slug}).exec()
  //  res.json(category)
  const products = await Product.find({category: category})
  .populate("category")
  // .populate("postedBy","_id name") modelde postedBy yok ondan comment
  .exec()
  res.json({
    products: products, category
  })
  }

 exports.update = async(req, res) => {
     const { name } = req.body
     try {
        const updated = await Category.findOneAndUpdate
        ({slug: req.params.slug}, {name: name , slug: slugify(name)},
        {new: true})
        res.json(updated)
     } catch (error) {
        res.status(400).send("Category Update Failed")
     }
  }

  exports.remove = async(req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({slug: req.params.slug})
        res.json(deleted)
    } catch (error) {
        res.status(400).send("Category Delete Failed")
    }
  }

  
//async olmadan 
exports.getSubs = (req,res) => {
  console.log("getSubs for product create form", req.params._id) 
  Sub.find({parent: req.params._id}).exec((err, subs)=> {
    if(err) console.log(err)
    // console.log(subs)
    res.json(subs)
  })

}
