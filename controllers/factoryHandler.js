const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(
        new AppError("Undable to find the document id", 404)
      );
    }
    res.status(200).json({ status: "success", data: doc });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!tour) {
      return next(
        new AppError("Unable to find the tour id", 404)
      );
    }
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
