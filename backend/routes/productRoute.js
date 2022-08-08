const express = require("express"); // importing the express package
<<<<<<< HEAD
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const {isAuthenticatedUser, authorizeRoles} = require('../middleware/auth'); 
=======
const { getAllProducts } = require("../controllers/productController");
>>>>>>> beab038e6e40d39546b45af4d0b76a23722a830b

const router = express.Router(); // setting up the router method from the express library


<<<<<<< HEAD
router.route("/products").get(getAllProducts);  // GET 

router
    .route("/products/new")
    .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);  // POST

router
    .route("/product/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
    .get(getProductDetails);  // PUT & DELETE & GET

=======
router.route("/products").get(getAllProducts);
>>>>>>> beab038e6e40d39546b45af4d0b76a23722a830b

module.exports = router;
