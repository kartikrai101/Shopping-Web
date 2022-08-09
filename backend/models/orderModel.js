const mongoose = require("mongoose");



// Remember that the order model is basically a model that will be generated for every order
// that exists out there. Thus, an order document will be made for every user that exists
// and it will become live as soon as a user places their own order




const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pinCode: { type: Number, required: true},
        phoneNo: { type: Number, required: true }
    },
    orderItems: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true } // here we are basically giving a field that will contain the ObjectId of the Product that the user is ordering and to make it an ObjectId of type that is stored in the Product model, we need to reference it with ProductModel

        }
    ],
    user: {
        type: mongoose.Schema.ObjectId, ref: "User", required: true,
    },
    paymentInfo: {
        id: { type: String, required: true },
        status: { type: String, required: true }
    },
    paidAt: {
        type: Date,
        required: true
    },
    itemsPrice: {
        type: Number,
        default: 0,
        required: true
    },
    taxPrice: {
        type: Number,
        default: 0,
        required: true
    },
    shippingPrice: {
        type: Number,
        default: 0,
        required: true
    },
    totalPrice: {
        type: Number,
        default: 0,
        required: true
    },

    orderStatus: {
        type: String,
        default: "Processing",
        required: true
    },
    deliveredAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Order", orderSchema); // you will use the name Order to create a model of 