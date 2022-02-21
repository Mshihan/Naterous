const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const FactoryHandler = require("./factoryHandler");

exports.getTourUserId = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
});

exports.getReviews = catchAsync(async (req, res) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const review = await Review.find(filter)
    .populate({
      path: "user",
      select: "name photo",
    })
    .populate({
      path: "tour",
      select: "name",
    });

  if (!review) {
    return next(new AppError("Unable to find the review"));
  }

  res.status(200).json({
    status: "success",
    length: review.length,
    data: {
      review,
    },
  });
});

exports.createReview = FactoryHandler.createOne(Review);
exports.updateReview = FactoryHandler.updateOne(Review);
exports.deleteReview = FactoryHandler.deleteOne(Review);
