const mongoose = require('mongoose');
const validator = require('validator'); // importing validator for email id validation
const bcrypt = require('bcryptjs'); // for encrypting the user's password before saving to db
const jwt = require('jsonwebtoken'); // for generating tokens to store in cookies

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

userSchema.pre("save", async function(next){   // this is the middleware function that will run before saving 

    if(!this.isModified("password")){
        next(); // i.e., if the user has not modified/updated the password then do not encrypt the currently encrypted password
    }

    this.password = await bcrypt.hash(this.password, 10); // the password that we are passing in the argument to hash function is the one that is entered by the user
})


// JWT TOKEN (basically we will generate a token for the user when they register and store that token in the cookie, so that when the user has registered, we do not send them to the login page after registering and simply direct them to the welcome page of our application)
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {  // basically we are generating tokens with the unique user id of each user and then we are creating a key that is a secret key to for the tokens and then finally we are giving an expiration time
        expiresIn: process.env.JWT_EXPIRE
    });
};


// making a compare function to check if the entered password is correct of not
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);  // remember that the model's name must begin with an uppercase letter and it should not have any breaks