const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "tour",
    required: [true, "Booking must belong to a user"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "Booking must belong to a user"],
  },
  price: {
    type: number,
    required: [true, "Booking must have a price"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });
});

const Booking = mongoose.Model("Booking", bookingSchema);

module.exports = Booking;
