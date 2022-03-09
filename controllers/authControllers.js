const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const Email = require("../utils/email");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendCreateToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieObj = {
    expires: new Date(
      Date.now() +
        process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieObj.secure = true;
  }

  res.cookie("jwt", token, cookieObj);

  // Remove password field from the user object
  user.password = undefined;
  user.active = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
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
  const url = 0;
  await Email(newUser, url).sendWelcome();
  sendCreateToken(newUser, 200, res);
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
  const user = await User.findOne({ email }).select("+password");

  if (
    !user ||
    !(await user.correctPassword(password, user.password))
  ) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) if everything is ok, send the json web token

  sendCreateToken(user, 200, res);
});

exports.protected = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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
  res.locals.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
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

exports.forgetPassword = catchAsync(async (req, res, next) => {
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
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to user's email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and password confirm to : ${resetUrl}.\nIf you didn't forget your password, Please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
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
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // 3) Update changedPasswordAt property for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4) Log the user in, send JWT
  sendCreateToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user._id).select("+password");

  // 2) Check if POSTed current password is correct

  if (
    !(await user.correctPassword(
      req.body.passwordCurrent,
      user.password
    ))
  ) {
    return next(
      new AppError(
        "Your current password is not matched. Please provide the correct password",
        401
      )
    );
  }
  //3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, send JWT token
  sendCreateToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res
    .status(200)
    .set(
      "Content-Security-Policy",
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .json({ status: "success" });
};
