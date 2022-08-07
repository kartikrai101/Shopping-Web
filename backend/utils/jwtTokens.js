// creating token and saving it in a cookie

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    //options for cookie
    const options = {
        httpOnly: true,
        expires: new Date(  // this will be a date object that will have the time in which the time in which the cookie will expire in miliseconds
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 
        )
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user, 
        token
    })
};

module.exports = sendToken;