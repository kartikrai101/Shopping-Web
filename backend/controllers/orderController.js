const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');


// Create new Order
exports.newOrder = catchAsyncErrors( async (req, res, next) => {

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(200).json({
        success: true,
        order,
    })
});


// Get single order (order details)
exports.getSingleOrder = catchAsyncErrors( async(req, res, next) =>{

    const order = await Order.findById(req.params.id).populate("user", "name email");
    // ye upar wali line mein basically kya hoga k woh particular order khojenge jo user
    // ko detail mein dekhna hai aur fir uss order mein ja kr jo 'user' field hai usme
    // filhal 'ObjectId' stored hai aur hum usey populate kr k user ki jagah name aur email
    // fields la denge from the users database.

    if(!order){
        return next( new ErrorHandler( "Order not found for this id!", 404 ));
    }

    res.status(200).json({
        success: true,
        order,
    });
});


// Get logged in user's orders 
exports.myOrders = catchAsyncErrors( async(req, res, next) =>{

    const orders = await Order.find({user: req.user._id});

    res.status(200).json({
        success: true,
        orders,
    });
});

// Get all orders 
exports.getAllOrders = catchAsyncErrors( async(req, res, next) =>{

    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        orders,
        totalAmount
    });
});

// Update Order Status --Admin 
exports.updateOrder = catchAsyncErrors( async(req, res, next) =>{

    const order = await Order.findById(req.params.id);

    if(order.orderStatus === "Delivered"){ // so if the product has already been delivered, the admin won't have the permission to change anything in the order detail
        return next( new ErrorHandler("You have already delivered this product", 400));
    }

    order.orderItems.forEach(async (order) => {
        await updateStock(order.product, order.quantity); // basically we are updating the stock of the seller after the product has been delivered, so we will check which product it is and then decrease it's value in the stock by 'order.quantity' value
    });

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now(); // setting the order delivery date to the current date if we get the req from admin that the order has been delivered
    }

    await order.save({
        validateBeforeSave: false, 
    })

    res.status(200).json({
        success: true,
    });
});

async function updateStock(id, quantity){
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
};


// Delete order --Admin
exports.deleteOrder = catchAsyncErrors( async(req, res, next) =>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next( new ErrorHandler("Order not found!", 404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
        message: "Order removed Successfully!"
    });
});