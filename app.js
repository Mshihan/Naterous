const express = require("express");
const path = require("path");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const mongoSanitizer = require("express-mongo-sanitize");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const errorController = require("./controllers/errorControllers");
const userReviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const app = express();

app.enable("trust proxy");

app.set("view engine", "pug"); //set the view engine to pug
app.set("views", path.join(__dirname, "views"));

// ==============================
// Express middleware layer
// ==============================

app.use(cors());


// Setting secure http headers
app.use(helmet());
app.options("*", cors());


// Check if the server is runing in development or production mode
// if (process.env.NODE_ENV === "development") {
app.use(morgan("dev"));
// }

//Limiting number of requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    "Too many requests from this IP. Please try again in an hour",
});
app.use("/api/", limiter);

// Compress the file that returns from the server
app.use(compression());

// Body parser, Reading data from body => req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  next();
});

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

// Controlling the localhost and 127.0.0.1 issue
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "http://localhost:3000"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "http://127.0.0.1:3000"
//   );

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });

// =================================
// Routes
// =================================

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", userReviewRouter);
app.use("/api/v1/bookings", bookingRouter);

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
