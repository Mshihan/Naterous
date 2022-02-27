const express = require("express");
const path = require("path");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const hpp = require("hpp");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitizer = require("express-mongo-sanitize");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const errorController = require("./controllers/errorControllers");
const userReviewRouter = require("./routes/reviewRoutes");
const app = express();

app.set("view engine", "pug"); //set the view engine to pug
app.set("views", path.join(__dirname, "views"));

// ==============================
// Express middleware layer
// ==============================

// Setting secure http headers
app.use(helmet());

// Check if the server is runing in development or production mode
// if (process.env.NODE_ENV === "development") {
app.use(morgan("dev"));
// }

//Limiting number of requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again in an hour",
});
app.use("/api/", limiter);

// Compress the file that returns from the server
app.use(compression());

// Body parser, Reading data from body => req.body
app.use(express.json({ limit: "10kb" }));

// Prevernt from No SQL Injections
app.use(mongoSanitizer());

// Prevent XSS attacks
app.use(xss());

// Preventing HTTP Parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// Serving static files from the server
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "public")));

// =================================
// Routes
// =================================

app.get("/", (req, res) => {
  res.status(200).render("base", {
    tour: "The Forest Hiker",
    user: "shihan",
  });
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", userReviewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`));
});

app.use(errorController);
module.exports = app;

// =================================
// Middleware defining
// =================================

// app.use((req, res, next) => {
//   console.log("This is a middleware 👋");
//   next();
// });

// =================================
// Routes defining
// =================================

// app.get("/api/v1/tours", getTours);

// =================================
// Routes advanced
// =================================

// app.route("/api/v1/tours").get(getTours).post(createTour);
// app
//   .route("/api/v1/tours/:id")
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// app.route("/api/v1/users").get(getUsers).post(createUser);
// app
//   .route("/api/v1/users/:id")
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

// =================================
// Conditional Middlewares
// =================================

// app.use((req, res, next) => {
// console.log("This is a middleware 👋, runs for some apiZ only 😘");
//   next();
// });

// ==============================
// API request tutorial
// ==============================

// app.get("/", (req, res) => {
//   res.status(200).json({ message: "This is a post request", app: "Naterous" });
// });
// app.post("/", (req, res) => {
//   res.send("This is a post request");
// });
