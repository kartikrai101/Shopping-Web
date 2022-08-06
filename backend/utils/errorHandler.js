// this is the file where we will make a class for handling errors

class ErrorHandler extends Error{ // inheriting from "Error" class that is present in Node by default 
    constructor(message, statusCode){
        super(message),
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor);
    }
};

module.exports = ErrorHandler;

// now after you are done making this error handler class, we need to make a middleware now