const sendErrorProd = (err, res) => {
  console.log("error happens");
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("Something went wrong 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
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
    console.log("production error");
    sendErrorProd(err, res);
  } else if (process.env.NODE_ENV === "development") {
    console.log("development error");
    sendErrorDev(err, res);
  }
  next();
};
