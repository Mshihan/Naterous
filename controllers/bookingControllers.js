const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Tour = require("../models/tourModel");
const Booking = require("../models/bookingModel");
const FactoryHandler = require("./factoryHandler");
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51Kc5qYGmocYmPMrXCTyZKnZOTcR70z5MpPqgQeGr2csLgu8iU1gJr0eb7lWA4jZCmuHV1h8m2K11oQHm68NiB2Km00h3uKqTMQ"
);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  //   2) create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/my-tours`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${
      tour.slug
    }`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get("host")}/img/tours/${
            tour.imageCover
          }`,
        ],
        amount: tour.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    message: "Success",
    session,
  });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // Not secure and  [Temporary]
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();

//   await Booking.create({ tour, user, price });

//   res.redirect(req.originalUrl.split("?")[0]);
// });

exports.getAllBooking = FactoryHandler.getAll(Booking);
exports.getBooking = FactoryHandler.getOne(Booking);
exports.updateBooking = FactoryHandler.updateOne(Booking);
exports.createBooking = FactoryHandler.createOne(Booking);
exports.deleteBooking = FactoryHandler.deleteOne(Booking);
