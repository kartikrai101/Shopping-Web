// in the controller functions we simply write the function that we want to run when a 
// request hits a particular route in the routes folder
const { findByIdAndUpdate } = require('../models/productModel');
const Product = require('../models/productModel'); // impoting the product model that we made in the models folder
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');

// Create Product -- ADMIN (POST request)

exports.createProduct = catchAsyncErrors (async (req, res, next) => { // see that we are exporting this function that simply creates a product by taking in the request body from the request that was made to this 

    req.body.user = req.user.id; // basically when a user logs in or registers, they get a user id, now when a user is trying to add a product we need to give that user a role of that admin,so basically we are assigning every created product with a user id that belongs to the user who created/added that product. This way we can later make sure that only this user gets to edit/delete the product information

    // now you also need to keep in mind that we already have the value of req.user
    // because this is the third middleware that is hit for this route, because before
    // this middleware, the middlewares isAuthenticated and authorizeRoles have already been
    //executed and therefore we have the value of req.user from the 1st middleware where we
    // extracted it.


    const product = await Product.create(req.body); // creating a product based on the model that we imported from the productModel.js file

    res.status(201).json({
        success: true,
        product
    })
});


// GET all the products
exports.getAllProducts = catchAsyncErrors( async (req, res) => {

    const resultPerPage = 5;
    const productCount = await Product.countDocuments(); // to keep a check of total number of products in our store

    const apiFeature = new ApiFeatures(Product.find(), req.query) //creating an object of the api features class so that we can access all of its methods
        .search()
        .filter()
        .pagination(resultPerPage); 
    
    const products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products,
        productCount
    })
});


// UPDATE product -- Admin

exports.updateProduct = catchAsyncErrors( async (req, res, next) => {
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
});

// DELETE Product 

exports.deleteProduct = catchAsyncErrors( async (req, res, next) => {
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
});


// GET Product Details

exports.getProductDetails = catchAsyncErrors( async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found", 404)); // creating an object
    }

    res.status(200).json({
        success: true,
        product
    })
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors( async (req, res, next) => {
    const {rating, comment, productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId); // getting the product for which the review is being given

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id);

    if(isReviewed){
        product.reviews.forEach((rev) => {
            if(rev.user.toString() === req.user._id){
                rev.rating = rating;
                rev.comment = comment;
            }
        })
        
    }
    else{
        product.reviews.push(review); // simply push this review in the reviews array of the product
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    const sum = product.reviews.forEach(rev => {
        avg += rev.rating;
    });

    product.ratings = avg/(product.reviews.length);
    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
    });

});


// Get all reviews of a product
exports.getProductReviews = catchAsyncErrors( async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if(!product){
        return next( new ErrorHandler( "Product not found", 400 ));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
});


// Delete Review
exports.deleteReview = catchAsyncErrors( async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next( new ErrorHandler( "Product not found", 400 ));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    ); // basically we are constructing an array that has all the reviews of the product except the one that we want to delete
    
    let avg = 0;
    const sum = reviews.forEach(rev => {
        avg += rev.rating;
    });

    const ratings = avg/(reviews.length);
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews,
    },
    {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    }); // updating the product's reviews stats after one review has been deleted

    res.status(200).json({
        success: true,
        message: "Review Deleted Successfully!",
    })
});