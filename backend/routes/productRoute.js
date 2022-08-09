const express = require("express"); // importing the express package
const { route } = require("express/lib/application");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, getProductReviews, deleteReview } = require("../controllers/productController");
const { createProductReview } = require("../controllers/productController");
const {isAuthenticatedUser, authorizeRoles} = require('../middleware/auth'); 

const router = express.Router(); // setting up the router method from the express library


router.route("/products").get(getAllProducts);  // GET 

router
    .route("/products/new")
    .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);  // for admin to create a product

router
    .route("/product/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct) // for the admin to update the products
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct) // for the admin to delete the products
    .get(getProductDetails);  // to get the details of a product

router.route("/review").put(isAuthenticatedUser, createProductReview); // to create a review for a product

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview); // for getting all the reviews of a product and for deleting the user's review that has logged in


module.exports = router;
