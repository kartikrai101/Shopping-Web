const express = require('express');
const router = express.Router(); // importing the router method
const {registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails} = require('../controllers/userController'); // importing from the userController function as a named import 
const {isAuthenticatedUser} = require('../middleware/auth'); // for using the authentication middlewares

router.route("/register").post(registerUser); // for registering a user
router.route("/login").post(loginUser); // for logging in the user
router.route("/logout").get(logout); // for logging out the user
router.route("/password/forgot").post(forgotPassword); // to get the reset password link
router.route("/password/reset/:token").put(resetPassword); // reset password
router.route("/me").get(isAuthenticatedUser, getUserDetails); // route to get the details of a user

module.exports = router;
