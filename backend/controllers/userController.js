const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel'); // importing the user model 
const sendToken = require('../utils/jwtTokens'); // importing the sendToken function so that we can directly send some data to this function and get the token stored in cookie and the token info in return 
const sendEmail = require('../utils/sendEmail.js'); // importing the sendEmail function to send the password reset email to the user
const crypto = require('crypto'); // for hashing the token incoming via reset password link clicked by the user

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
});


//Logout a User
exports.logout = catchAsyncErrors( async (req, res, next) => {

    res.cookie("token", null, { // basically here we are simply setting the cookie's value to be a token that is going to be expired as soon as this function is invoked
        expires: new Date(Date.now()),
        httpOnly: true  // this enables the cookie to be seen only by the server side and not by the client
    })

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully!"
    })
});



// Forgot password handler function
exports.forgotPassword = catchAsyncErrors( async (req, res, next) => {

    const user = await User.findOne({email: req.body.email}); // so basically we will take the email from the user on which we will send the user the reset token so that they can just click on the link and the password will be reset 

    if(!user){
        return next( new ErrorHandler("No user found with that email", 404));
    }

    // Get reset password token
    const resetToken  = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false }); // after setting the reset password token in the userSchema after calling the getResetPasswordToken() function, we will now save this user in the database
    
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`; // this is the url that we will send to the user's email to reset the password

    const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\n If you have not requested this email, please ignore it.`;

    try{
        await sendEmail({  // we will create this sendEmail handler function in the userModel.js file
            email: user.email,
            subject: 'Password recovery',
            message,
        });

        res.status(201).json({
            sucess: true,
            message: `Email sent to ${user.email} successfully.`
        });

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined; 

        await user.save({ validateBeforeSave: false });

        return next( new ErrorHandler(error.message, 500)); 
    }
});


// controller function for resettign the password

exports.resetPassword = catchAsyncErrors( async (req, res, next) => {

    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user){
        return next( new ErrorHandler("Reset Password token is invalid or expired!", 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined; 

    await user.save();

    sendToken(user, 200, res); // so that we can simply login the user after they have changed their password
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors( async(req, res, next) => {
    
    const user = await User.findById(req.user.id); // since we will put the isAuthenticated middleware before this middleware, we will make sure the user is logged in before the user hits this path of watching his/her/their profile
    // therefore, req.user will always contain the user information when a req hits this route

    res.status(200).json({
        success: true,
        user,
    })

});