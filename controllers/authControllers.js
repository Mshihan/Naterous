const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.signup = catchAsync(async (req, res, next) => {
  console.log("signup working");
  const newUser = await User.create(req.body);
  console.log(newUser);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });

  next();
});
