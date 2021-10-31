const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");

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
    role: req.body.role,
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
    return next(
      new AppError("Please provide email and password", 400)
    );
  }

  // 2) check if the user exists & password is correct
  const user = await User.findOne({ email }).select(
    "+password"
  );

  if (
    !user ||
    !(await user.correctPassword(password, user.password))
  ) {
    return next(
      new AppError("Incorrect email or password", 401)
    );
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
  const decode = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // Check if the user is exists
  const currentUser = await User.findById(decode.id);

  // Check if the user exists
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to the token does not exist",
        401
      )
    );
  }

  // Check if the password is changed by the user
  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError(
        "User recently changed the password. Please login again",
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You don't have permission to perform this acction",
          403
        )
      );
    }
    next();
  };
};

exports.forgetPassword = catchAsync(
  async (req, res, next) => {
    // 1) Check if the email address exists
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return next(
        new AppError(
          "There is no user with this email address. Please enter a valid email",
          404
        )
      );
    }
    // 2) Creating a password reset token
    const resetToken =
      await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) send it to user's email
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and password confirm to : ${resetUrl}.\nIf you didn't forget your password, Please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject:
          "Your password reset token (valid for 10 min)",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save({ validateBeforeSave: false });

      next(
        new AppError(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }
  }
);

exports.resetPassword = (req, res, next) => {};
