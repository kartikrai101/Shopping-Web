const express = require('express');
const router = express.Router(); // importing the router method
const {registerUser, loginUser} = require('../controllers/userController'); // importing from the userController function as a named import 

router.route("/register").post(registerUser); // for registering a user
router.route("/login").post(loginUser); // for logging in the user

module.exports = router;