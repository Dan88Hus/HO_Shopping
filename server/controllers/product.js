const Product = require("../models/product")
const User = require("../models/user")
const slugify = require('slugify')
const { populate } = require("../models/product")


exports.create = async (req, res) => {
  try {
    //   const category = await new Category({name, slug: slugify(name)}).save()
    //   res.json(category)
    console.log("product create body:", req.body)
    req.body.product.slug = slugify(req.body.product.title)
    console.log(req.body.product.slug)
    newProduct = await new Product(req.body.product).save()
    res.json(newProduct);
  } catch (error) {
      console.log(error)
      // res.status(400).send('Create Product Failed')
      res.status(400).json({ error: error.message})
  }
}

// exports.read = async(req, res) => { 
//     listproducts = await Product.find({}).sort({createdAt: -1}).exec()
//     res.json(listproducts)
// } this going to be changed for listAll (pagination)


exports.listAll = async(req, res) => {
  listproducts = await Product.find({})
  .limit(parseInt(req.params.count)) //route/product taki count, 
  .populate("category")
  .populate("subs") //model de ki category veya subs ile ayni olacak name ler
  .sort([["createdAt", "desc"]]) //sort takes an array, and array can take more than one argumant
  .exec()
  res.json(listproducts)
}


exports.read = async(req, res) => {
   let product = await Product.findOne({slug: req.params.slug})
   .populate("category")
   .populate("subs")
   .exec()
   res.json(product)
  }

exports.update = async(req, res) => {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title)
      }
      const updated = await Product.findOneAndUpdate
      ({slug: req.params.slug}, req.body,
      {new: true}).exec()
      res.json(updated)
    } catch (error) {
      console.log(error)
      res.status(400).send("Product Update Failed")
    }
}

exports.remove = async(req, res) => {
  try {
      const deleted = await Product.findOneAndRemove({slug: req.params.slug}).exec()
      res.json(deleted)
  } catch (error) {
    console.log("remove product",error)
      res.status(400).send("Product Delete Failed")
  }
}
// without pagination 
// exports.list = async (req, res) => {
//   try {
//     const { sort, order, limit} = req.body
//     console.log("list body", req.body)
//     const products = await Product.find({})
//     .populate("category")
//     .populate("subs")
//     .sort([[sort, order]])
//     .limit(limit)
//     .exec()
//     // console.log("products",products)
//     res.json(products)
  
//   } catch (error) {
//     console.log(error)
//   }
// }


//with pagination
exports.list = async (req, res) => {
  try {
    const { sort, order, page} = req.body
    const currentPage = page || 1
    const perPage = 3 // to show product in each page 

    console.log("list body", req.body)
    const products = await Product.find({})
    .skip((currentPage-1) * perPage)
    .populate("category")
    .populate("subs")
    .sort([[sort, order]])
    .limit(perPage)
    .exec()
    // console.log("products",products)
    res.json(products)
  
  } catch (error) {
    console.log(error)
  }
}

exports.productsCount = async (req,res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total)
}

exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec()
  // console.log("pRoducT",product)
  const user = await User.findOne({email: req.user.email}).exec()
  // need to check if user have already added rating to this product?
  //to update or to create new instance 
  const {star} = req.body
  let existingRatingObject = product.rating.find(
    (elem) => elem.postedBy.toString() === user._id.toString()
    );
    if (existingRatingObject === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { rating: { star, postedBy: user._id } },
        },
        { new: true }
      ).exec();
      console.log("ratingAdded", ratingAdded);
      res.json(ratingAdded);
    } else {
      // if user have already left rating, update it
      const ratingUpdated = await Product.updateOne(
        {
          rating: { $elemMatch: existingRatingObject },
        },
        { $set: { "rating.$.star": star } }, 
        { new: true }
      ).exec();
      console.log("ratingUpdated", ratingUpdated);
      res.json(ratingUpdated);
    }
}

exports.listRelated = async (req,res) => {
  const product = await Product.findById(req.params.productId).exec()
  const related = await Product.find({
    _id: {$ne: product._id}, category: product.category
  }).limit(3)
  .populate("category")
  .populate("subs")
  .populate("postedBy")
  .exec();
  res.json(related)
}

const handleQuery = async (req,res,query) => {
  const products = await Product.find({ $text: { $search: query }}) 
  // model productta text: true olunca text e gore arama yapabiliyoruz
    .populate("category", "_id name") // it populates _id and name
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec()
    // console.log("products", products)
  res.json(products)
  //reducers da searchReducer.jsx e bak front end de 

}

const handlePrice = async (req,res,price) => {
  try {
    const products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      }
    })
    .populate("category", "_id name") // it populates _id and name
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec()
    res.json(products)
  } catch (error) {
    console.log("Error handlePrice", error)
  }
}

const handleCategory = async (req,res,category) => {
  try {
    let products = await Product.find({category})
    .populate("category", "_id name") // it populates _id and name
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec()
    res.json(products)

  } catch (error) {
    console,log("ERROR in handle category", error)
  }
}

const handleStar = (req,res, stars) => {
  //burda aggregste kullanilacak cunku ratings model de array ve type objectID
  //so we need to create new project ( each document called project)
  Product.aggregate([
    {
      $project: {
         document: "$ROOT", // this gives access to entire project , if we will not use it then such as below
         // so we can add new field on the fly
         floorAverage: {
           $floor: { $avg: "$rating.star"} //floor is mathematical operation to round number
         }
        // title: "$title",
        // description: "$description",
        // this way we access field in model
        // averageRating: ....... // model has so many field so its not practical
      }
    }, { $match: {floorAverage: stars}} // this is second argument
  ]) .limit(12)
  .exec((err, aggregates)=> {
    //async await kullanmayinca exec() kullanabiliyoruz
    if (err) {
      console.log("aggregates error", err)
    }
    Product.find({_id: aggregates})
    .populate("category", "_id name") // it populates _id and name
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec((error, products)=> {
      if (error) {
        console.log("Products aggregate error", error)
      }
      res.json(products)
    })

  }) 
}

const handleSub = async (req,res, sub) => {
  const products = await Product.find({ subs: sub})
    .populate("category", "_id name") // it populates _id and name
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec()
    res.json(products)
}
const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping: shipping})
    .populate("category", "_id name") // it populates _id and name
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec()
    res.json(products)
}
const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
  .populate("category", "_id name") // it populates _id and name
  .populate("subs", "_id name")
  .populate("postedBy", "_id name")
  .exec()
  res.json(products)
}
const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
  .populate("category", "_id name") // it populates _id and name
  .populate("subs", "_id name")
  .populate("postedBy", "_id name")
  .exec()
  res.json(products)
}

exports.searchFilters = async (req,res) => {
  const {query, price, category, stars, sub, shipping,
          color, brand} = req.body
  console.log("query====>", query)
  console.log("price====>", price)
  console.log("category====>", category)
  console.log("stars====>", stars)
  console.log("sub====>", sub)
  console.log("shipping====>", shipping)
  console.log("color====>", color)
  console.log("brand====>", brand)



  if (query){ // her sorgu icin farkli helper function kullanacaz ondan ayriyetten yaziyoruz
    // bazen slug, bazen price 
    // console.log("query exist", query)
    await handleQuery(req, res, query)
  }
  // price will come as array [0, 200] gibi , min max ondan undefined 
  if (price !== undefined ){
    await handlePrice(req, res, price)
  }

  if (category){
    await handleCategory(req, res, category)
  }

  if (stars) {
    await handleStar(req, res, stars)
  }

  if (sub) {
    await handleSub (res,res, sub)
  }
  if (shipping) {
    await handleShipping(req, res, shipping)
  }
  if (color) {
    await handleColor(req, res, color)
  }
  if (brand) {
    await handleBrand(req, res, brand)
  }
}