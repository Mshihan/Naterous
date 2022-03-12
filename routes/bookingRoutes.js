const express = require("express");
const authRoutes = require("./../controllers/authControllers");
const bookingController = require("./../controllers/bookingControllers");

const router = express.Router();

router.use(authRoutes.protected);

router
  .route("/checkout-session/:tourId")
  .get(bookingController.getCheckoutSession);

router.use(authRoutes.restrictTo("admin", "lead-guide"));

router
  .route("/")
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
