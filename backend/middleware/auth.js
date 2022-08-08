const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // importing the user model

exports.isAuthenticatedUser = catchAsyncErrors( async (req, res, next) => {
    const { token } = req.cookies; // getting the token stored in the cookies

    if(!token){
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET); // this will give you the tokenId, the time in expiration and the iat number of that token

    req.user = await User.findById(decodedData.id);

    next();
});

// authorizing the requests based on the roles assigned to the users
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if(!roles.includes(req.user.role)){   // remmeber that we have saved all the data of the user in req.user in line 15 of this file and then we are simply accessing the 'role' field of a single user's document
            return next (new ErrorHandler(
                `Role: ${req.user.role} is not allowed to access this resource`,
                403
            )
            );
        }
        
        next(); // ie, if the role of the user is present in the roles array then simply send the control to the next middleware
    }
}