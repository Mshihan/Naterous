const express = require("express");
const authRoutes = require("./../controllers/authControllers");
const bookingController = require("./../controllers/bookingControllers");

const router = express.Router();

router
  .route("/checkout-session/:tourId")
  .get(authRoutes.protected, bookingController.getCheckoutSession);

module.exports = router;
