const express = require("express");
const viewController = require("./../controllers/viewControllers");
const authController = require("./../controllers/authControllers");
const bookingController = require("./../controllers/bookingControllers");

const router = express.Router();

// router.use(authController.isLoggedIn);

router.get(
  "/",
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
router.get("/login", viewController.getLogin);
router.get(
  "/tours/:slug",
  authController.isLoggedIn,
  viewController.getTour
);
router.get(
  "/me",
  authController.protected,
  viewController.getAccount
);

router
  .route("/my-tours")
  .get(authController.protected, viewController.getMyTour);

module.exports = router;
