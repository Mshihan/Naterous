const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const FactoryHandler = require("./factoryHandler");

// =================================
// User handling controllers
// =================================

const filterObj = (body, ...roles) => {
  const newObj = {};
  Object.keys(body).forEach((el) => {
    if (roles.includes(el)) {
      newObj[el] = body[el];
    }
  });
  return newObj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Error if the password update is exists
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }

  // 3) Filtered unwanted fields
  const filteredBody = filterObj(req.body, "name", "email");

  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
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

// Don't update the password.
exports.updateUser = FactoryHandler.updateOne(User);
exports.deleteUser = FactoryHandler.updateOne(User);
