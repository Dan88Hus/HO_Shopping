const mongoose = require("mongoose")

const {ObjectId} = mongoose.Schema

const subSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: [3,"Too short"],
    },
    slug: {
         type: String,
         unique: true,
         lowercase: true,
         index: true,

    },
    parent: {
      type: ObjectId, 
      ref: "Category",
      required: true,
    }
},{timestamps: true})

module.exports = mongoose.model('Sub', subSchema)