const Tour = require("../models/tourModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const FactoryHandler = require("./factoryHandler");

exports.getTours = FactoryHandler.getAll(Tour);
exports.getTour = FactoryHandler.getOne(Tour, {
  path: "reviews",
});
exports.createTour = FactoryHandler.createOne(Tour);
exports.updateTour = FactoryHandler.updateOne(Tour);
exports.deleteTour = FactoryHandler.deleteOne(Tour);

// /tours-within/:distance/center/:latlng/unit/:unit
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng",
        400
      )
    );
  }
  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      data: tours,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { minPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numOfTours: { $sum: 1 },

        tours: { $push: "$name" },
      },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: {
        numOfTours: -1,
      },
    },
    {
      $addFields: {
        months: "$_id",
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: plan.length,
    data: {
      plan,
    },
  });
});

exports.getDistances = catchAsync(async (req, res) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng",
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: 0.0001,
      },
    },
    {
      $project: { distance: 1, name: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      data: distances,
    },
  });
});

// =============================================
// Quering functionality of the api (Long form)
// =============================================
// Build Query
// 1) Filtering
// const queryObj = {
//   ...req.query,
// };
// const excludedFields = ["page", "sort", "limit", "field"];
// excludedFields.forEach((el) => delete queryObj[el]);

// // 2) Advanced Filtering
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

// let tours = Tour.find(JSON.parse(queryStr));

// 3) Sortings
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(",").join(" ");
//   tours = tours.sort(sortBy);
// } else {
//   tours = tours.sort("-createdAt");
// }

// 4) Field Limiting
// if (req.query.fields) {
//   const fields = req.query.fields.split(",").join(" ");
//   tours = tours.select(fields);
// } else {
//   tours = tours.select("-__v");
// }

// 5) Paging and Limiting
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;

// tours = tours.skip(skip).limit(limit);

// if (req.query.page) {
//   const numTours = new Tour.countDocuments();
//   if (skip >= numTours) throw new Error("This page does not exist");
// }

// ======================================
// Get request to get a individual tour
// ======================================

// const id = req.params.id * 1;
// const tour = tours.find((el) => el.id === id);
// if (!tour) {
//   return res.status(404).send("Tour not found");
// }

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
