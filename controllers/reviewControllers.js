const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.createReview = catchAsync(async (req, res) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newReview,
    },
  });
});

exports.getReviews = catchAsync(async (req, res) => {
  const review = await Review.find()
    .populate({
      path: "user",
      select: "name photo",
    })
    .populate({
      path: "tour",
      select: "name ",
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
