const mongoose = require("mongoose")

// const {ObjectId} = mongoose.Schema

const categorySchema = new mongoose.Schema({
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

    }
},{timestamps: true})

module.exports = mongoose.model('Category', categorySchema)