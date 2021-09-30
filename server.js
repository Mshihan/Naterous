const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("Successfuly connected to database.....");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}......`);
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
