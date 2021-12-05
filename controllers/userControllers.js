const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// =================================
// User handling controllers
// =================================

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "This route is not defined yet",
  });
};
exports.createUser = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "This route is not defined yet",
  });
};
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "This route is not defined yet",
  });
};
exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "This route is not defined yet",
  });
};
