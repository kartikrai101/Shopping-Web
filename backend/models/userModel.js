const mongoose = require('mongoose');
const validator = require('validator'); // importing validator for email id validation

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed more than 30 characters"],
        minLength: [4, "Name should have more than 4 letters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your name"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your Password"],
        minLength: [8, "Password should be more than 8 letters"],
        select: false  // this means that whenever this document will be called by using find method or something, then this field will not be displayed in the returned document
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        } 
    },
    role: {
        type: String,
        default: "user"
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

});

module.exports = mongoose.model("User", userSchema);  // remember that the model's name must begin with an uppercase letter and it should not have any breaks