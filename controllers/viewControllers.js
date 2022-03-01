const catchAsync = require("../utils/catchAsync");
const Tour = require("./../models/tourModel");

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "name photo",
  });
  // .populate({
  //   path: "user",
  //   fields: "name photo",
  // });

  // console.log(tour);
  res.status(200).render("tour", {
    title: `${tour.name} tour`,
    tour,
  });
});
