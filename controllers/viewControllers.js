const catchAsync = require("../utils/catchAsync");
const Tour = require("./../models/tourModel");
const AppError = require("../utils/appError");

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res
    .status(200)
    .set(
      "Content-Security-Policy",
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render("overview", {
      title: "All Tours",
      tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "name photo",
  });

  if (!tour) {
    return next(new AppError("There is no tour with that name", 404));
  }
  // .populate({
  //   path: "user",
  //   fields: "name photo",
  // });

  // console.log(tour);
  res
    .status(200)
    .set(
      "Content-Security-Policy",
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render("tour", {
      title: `${tour.name} tour`,
      tour,
    });
});

exports.getLogin = catchAsync(async (req, res) => {
  res
    .status(200)
    .set(
      "Content-Security-Policy",
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render("login", {
      title: "Log into your account",
    });
});

exports.getAccount = catchAsync(async (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
});
