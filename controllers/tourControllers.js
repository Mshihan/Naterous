// ==============================
// Get request to send all tours
// ==============================

const Tour = require("../models/tourModel");

exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid request data",
    });
  }
};

// ======================================
// Get request to get a individual tour
// ======================================

// const id = req.params.id * 1;
// const tour = tours.find((el) => el.id === id);
// if (!tour) {
//   return res.status(404).send("Tour not found");
// }

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.find({_id: req.params.id})
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid request data",
    });
  }
};

// ===============================
// Post request to create tours
// ===============================

// const tourId = tours[tours.length - 1].id + 1;
// const newTour = Object.assign(
//   { id: tourId },
//   ...req.body
// );
// tours.push(newTour);
// fs.writeFile(
//   "./dev-data/data/tours-simple.json",
//   JSON.stringify(tours),
//   (err) => {
//  console.log(err);
//   }
// );

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

// =================================
// Patch request to update the tours
// =================================
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Invalid request data",
    });
  }
};

// =================================
// Delete request to remove records
// =================================

// const tourId = req.params.id;
// if (tourId > tours.length) {
//   return res.status(404).json({
//     status: "fail",
//     message: "Tour not found",
//   });
// }

exports.deleteTour = async (req, res) => {
  res.status(200).json({ status: "success", data: null });
};

// const fs = require("fs");

// ==============================
// Json file read to sync
// ==============================
// const tours = JSON.parse(
//   fs.readFileSync(
//     `${__dirname}/../dev-data/data/tours-simple.json`
//   )
// );

// ==============================
// Check the body of the request
// ==============================
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Missing name or price",
//     });
//   }
//   next();
// };

// exports.checkDoubt = (req, res, next) => {
//   console.log("This is doubt log 🤔");
//   next();
// };

// ==============================
// Check id in the middleware Fn
// ==============================
// exports.checkID = (req, res, next, value) => {
//   console.log(`The id is: ${value}`);
// if (value > tours.length) {
//   return res.status(404).json({
//     status: "fail",
//     message: "Tour not found",
//   });
// }
//   next();
// };
