const express = require("express");
const fs = require("fs");
const tourRoutes = require("../controllers/tourControllers");

// ==============================
// Json file read to sync
// ==============================
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const router = express.Router();

router.route("/").get(tourRoutes.getTours).post(tourRoutes.createTour);
router
  .route("/:id")
  .get(tourRoutes.getTour)
  .patch(tourRoutes.updateTour)
  .delete(tourRoutes.deleteTour);

module.exports = router;
