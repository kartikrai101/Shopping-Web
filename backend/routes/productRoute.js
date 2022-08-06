const express = require("express"); // importing the express package
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");

const router = express.Router(); // setting up the router method from the express library


router.route("/products").get(getAllProducts);  // GET 
router.route("/products/new").post(createProduct);  // POST
router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails);  // PUT & DELETE & GET


module.exports = router;
