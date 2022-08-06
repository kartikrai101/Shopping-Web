// in the controller functions we simply write the function that we want to run when a 
// request hits a particular route in the routes folder
const { findByIdAndUpdate } = require('../models/productModel');
const Product = require('../models/productModel'); // impoting the product model that we made in the models folder

// Create Product -- ADMIN (POST request)

exports.createProduct = async (req, res, next) => { // see that we are exporting this function that simply creates a product by taking in the request body from the request that was made to this 

    const product = await Product.create(req.body); // creating a product based on the model that we imported from the productModel.js file

    res.status(201).json({
        success: true,
        product
    })
};


// GET all the products
exports.getAllProducts = async (req, res) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })
};


// UPDATE product -- Admin

exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);  // finding the individual product

    if(!product){
        res.status(500).json({
            success: false,
            message: "Product not found!"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
};

// DELETE Product 

exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        res.status(500).json({
            success: false,
            message: "Product not found!"
        })
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product removed successfully!"
    })
};


// GET Product Details

exports.getProductDetails = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        res.status(500).json({
            success: false,
            message: "Product not found!"
        })
    }

    res.status(200).json({
        success: true,
        product
    })
}