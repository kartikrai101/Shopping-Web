const ErrorHandler = require('../utils/errorHandler'); // importing the error handler class

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong Mongodb Id error
    if(err.name === "CastError"){
        const message = `Resource Not Found! Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Mongoose duplicate key error
    if(err.code == 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400)
    };

    // wrong JWT error
    if(err.code == "JsonWebTokenError"){
        const message = `Json Web Token is invalid, try again.`;
        err = new ErrorHandler(message, 400)
    };

    // JWT expire error
    if(err.code == "TokenExpiredError"){
        const message = `Json Web Token is Expired, try again.`;
        err = new ErrorHandler(message, 400)
    };

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });


};