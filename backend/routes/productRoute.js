const express = require("express"); // importing the express package
const { getAllProducts } = require("../controllers/productController");

const router = express.Router(); // setting up the router method from the express library


router.route("/products").get(getAllProducts);

module.exports = router;
