// ==============================
// Get request to send all tours
// ==============================

const Tour = require("../models/tourModel");
const ApiFeatures = require("./../utils/apiFeatures");

exports.getTours = async (req, res) => {
  try {
    // Execute Query
    const features = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .fieldLimit()
      .pagination();
    const result = await features.query;

    res.status(200).json({
      status: "success",
      results: result.length,
      data: {
        result,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

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
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
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
  const tour = await Tour.findByIdAndDelete(req.params.id);
  res.status(200).json({ status: "success", data: tour });
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

exports.getTourStats = async (req, res, next) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
      // {
      //   $limit: 5,
      // },
    ]);

    res.status(200).json({
      status: "success",
      results: plan.length,
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};
