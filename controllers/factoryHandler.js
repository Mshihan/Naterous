const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const ApiFeatures = require("./../utils/apiFeatures");

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
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!doc) {
      return next(
        new AppError("Unable to find the document id", 404)
      );
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
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

exports.getOne = (Model, PopOptions) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (PopOptions) query.populate(PopOptions);
    const doc = await query;

    if (!doc) {
      return next(
        new AppError("Undable to find the document id", 404)
      );
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // Execute Query
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fieldLimit()
      .pagination();
    // const result = await features.query.explain();
    const result = await features.query;

    res.status(200).json({
      status: "success",
      results: result.length,
      data: {
        result,
      },
    });
  });
