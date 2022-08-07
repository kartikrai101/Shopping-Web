const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel'); // importing the user model 
const sendToken = require('../utils/jwtTokens'); // importing the sendToken function so that we can directly send some data to this function and get the token stored in cookie and the token info in return 

// Register a user
exports.registerUser = catchAsyncErrors( async (req, res, next) => {

    const {name, email, password} = req.body;

    const user = await User.create({  // creating a new user
        name, email, password,
        avatar: {
            public_id: "This is a sample id",
            url: "profilePicUrl"
        }
    });

    // const token = user.getJWTToken(); // creating a token for the user after registering them

    // res.status(201).json({
    //     success: true,
    //     token
    // });

    sendToken(user, 201, res);
});


//Login a user
exports.loginUser = catchAsyncErrors( async(req, res, next) => {

    const {email, password} = req.body;

    //checking if the user has given both, the email and the password
    if(!email || !password){
        return next(new ErrorHandler("Please enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password"); // here we cannot simply pass the password like email because in the model we have set the select property on password to false

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    const isPasswordMatched = user.comparePassword(password); // we have created this function in the user model so that we can compare the password entered by the user with the encrypted password that we have stored for every user in our database

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    // const token = user.getJWTToken(); 

    // res.status(200).json({
    //     success: true,
    //     token
    // });

    sendToken(user, 200, res); // this code is enough at the place of the above commented out code
})