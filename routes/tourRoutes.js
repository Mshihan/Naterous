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
  .get(tourRoutes.getMonthlyPlan);

router
  .route("/")
  .get(authRoutes.protected, tourRoutes.getTours)
  .post(tourRoutes.createTour);
router
  .route("/:id")
  .get(tourRoutes.getTour)
  .patch(tourRoutes.updateTour)
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
