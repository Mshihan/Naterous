const express = require("express");
const authRoutes = require("./../controllers/authControllers");
const reviewController = require("./../controllers/reviewControllers");

const router = express.Router({ mergeParams: true });
router
  .route("/")
  .get(reviewController.getReviews)
  .post(
    authRoutes.protected,
    authRoutes.restrictTo("user"),
    reviewController.getTourUserId,
    reviewController.createReview
  );
router.route("/:id").delete(reviewController.deleteReview);

module.exports = router;
