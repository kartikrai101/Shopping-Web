const express = require("express"); // importing the express package
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const {isAuthenticatedUser, authorizeRoles} = require('../middleware/auth'); 

const router = express.Router(); // setting up the router method from the express library


router.route("/products").get(getAllProducts);  // GET 

router
    .route("/products/new")
    .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);  // POST

router
    .route("/product/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
    .get(getProductDetails);  // PUT & DELETE & GET


module.exports = router;
