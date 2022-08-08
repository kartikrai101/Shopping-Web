const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
        maxLength: [8, "You cannot exceed the limito of 8 characters"]
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url:{
                type: String,
                required: true
            } 
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter the product category!"]
    },
    stock: {
        type: Number,
        required: [true, "Please Enter Product Stock"],
        maxLength: [4, "Stock Cannot Exceed 4 Characters"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            review: {
                type: String,
                required: true
            }
        }
    ],

    user: {  // so that we can give a particular role to each and every user
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product", productSchema); //exporting this mongoose model