const express = require("express");
const authRoutes = require("./../controllers/authControllers");
const reviewController = require("./../controllers/reviewControllers");

const router = express.Router({ mergeParams: true });
router.use(authRoutes.protected);
router
  .route("/")
  .get(reviewController.getReviews)
  .post(
    authRoutes.protected,
    authRoutes.restrictTo("user"),
    reviewController.getTourUserId,
    reviewController.createReview
  );
router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(
    authRoutes.restrictTo("user", "admin"),
    reviewController.deleteReview
  )
  .patch(
    authRoutes.restrictTo("user", "admin"),
    reviewController.updateReview
  );

module.exports = router;
