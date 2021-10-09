const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// ==============================
// Express middleware layer
// ==============================

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  //   console.log(process.env.NODE_ENV);
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// =================================
// Routes
// =================================

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  res.status(200).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on the server`,
  });
  next();
});

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
