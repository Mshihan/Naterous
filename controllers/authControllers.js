const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
  });
});

// Can't execute the next method after sending the response.
// next();;

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if the email & password exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2) check if the user exists & password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) if everything is ok, send the json web token
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protected = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in. Please log in to access this route",
        401
      )
    );
  }

  // Verification token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if the user is exists
  const freshUser = await User.findById(decode.id);

  // Check if the user exists
  if (!freshUser) {
    return next(
      new AppError("The user belonging to the token does not exist", 401)
    );
  }

  // Check if the password is changed by the user
  if (freshUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError(
        "User recently changed the password. Please login again",
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});
