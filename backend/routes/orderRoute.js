const express = require('express');
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController');
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.route("/order/new").post(isAuthenticatedUser, newOrder); // ordering a new product by the logged in user

router.route("/order/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleOrder);// kewal admin hi dekh sakta hai kisi bhi user k orders

router.route("/orders/me").get(isAuthenticatedUser, myOrders); // getting the orders of the logged in user

router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders); // for the admin to get all the orders

router
    .route("/admin/order/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder) // for updating order by the admin
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;