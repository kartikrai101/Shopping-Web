const express = require('express');
const router = express.Router(); // importing the router method
const {registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateUserProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser} = require('../controllers/userController'); // importing from the userController function as a named import 
const {isAuthenticatedUser, authorizeRoles} = require('../middleware/auth'); // for using the authentication middlewares

router.route("/register").post(registerUser); // for registering a user

router.route("/login").post(loginUser); // for logging in the user

router.route("/logout").get(logout); // for logging out the user

router.route("/password/forgot").post(forgotPassword); // to get the reset password link

router.route("/password/reset/:token").put(resetPassword); // reset password

router.route("/me").get(isAuthenticatedUser, getUserDetails); // route to get the details of a user

router.route("/password/update").put(isAuthenticatedUser, updatePassword); // for updating the password after authenticating the user

router.route("/me/update").put(isAuthenticatedUser, updateUserProfile); // for updating the user info after authenticating the user

router
    .route("/admin/users")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers); // for the admin to get all the users registered on the website

router
    .route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser) // for admin to get a single specific user
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);


module.exports = router;
