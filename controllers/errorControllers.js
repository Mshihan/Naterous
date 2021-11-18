const AppError = require("../utils/AppError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateNameErrorDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: "${value}". Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(
    (el) => el.message
  );

  return new AppError(
    `Validation data error. ${errors.join(", ")}`,
    400
  );
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const handleWebTokenExpiredError = (error) => {
  const message = "Token Expired. Please login again.";
  return new AppError(message, 401);
};

const handleWebTokenError = (error) => {
  const message =
    "Invalid web token. Please login and retry";
  return new AppError(message, 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    statusCode: err.statusCode,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateNameErrorDB(error);
    }
    if (err._message === "Validation failed") {
      error = handleValidationErrorDB(error);
    }
    if (err.name === "JsonWebTokenError") {
      error = handleWebTokenError(error);
    }
    if (err.name === "TokenExpiredError") {
      error = handleWebTokenExpiredError(error);
    }
    sendErrorProd(error, res);
  } else if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }
  next();
};
