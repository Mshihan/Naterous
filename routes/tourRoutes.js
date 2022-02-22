const express = require("express");
const tourRoutes = require("../controllers/tourControllers");
const authRoutes = require("./../controllers/authControllers");
const reviewRouter = require("./../routes/reviewRoutes");
const router = express.Router();

// router.param("id", tourRoutes.checkID);
router.route("/get-stats").get(tourRoutes.getTourStats);

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/monthly-plan/:year")
  .get(
    authRoutes.protected,
    authRoutes.restrictTo("admin", "lead-guide"),
    tourRoutes.getMonthlyPlan
  );

router
  .route("/")
  .get(tourRoutes.getTours)
  .post(
    authRoutes.protected,
    authRoutes.restrictTo("admin", "lead-guide"),
    tourRoutes.createTour
  );
router
  .route("/:id")
  .get(tourRoutes.getTour)
  .patch(
    authRoutes.protected,
    authRoutes.restrictTo("admin", "lead-guide"),
    tourRoutes.updateTour
  )
  .delete(
    authRoutes.protected,
    authRoutes.restrictTo("admin", "lead-guide"),
    tourRoutes.deleteTour
  );

// router
//   .route("/:tourId/reviews")
//   .post(
//     authRoutes.protected,
//     authRoutes.restrictTo("user"),
//     reviewRoutes.createReview
//   );

module.exports = router;
