const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log(err.name + " - " + err.message);
  process.exit();
});

const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose.connect(DB).then(() => {
  console.log("Successfuly connected to database.....");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}......`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name + " - " + err.message);
  server.close(() => {
    process.exit(1);
  });
});

// const testTour = new Tour({
//   name: "The Forest figter",
//   rating: 4.8,
//   price: 450,
// });

// testTour
//   .save()
//   .then((instence) => {
//     console.log("Successfuly saved");
//     console.log(instence);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
