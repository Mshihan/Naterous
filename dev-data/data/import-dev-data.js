const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Tour = require("../../models/tourModel");
const Review = require("../../models/reviewModel");
const User = require("../../models/userModel");

dotenv.config({ path: `./config.env` });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("Successfuly connected to database.....");

  if (process.argv[2] === "--import") {
    importData();
  } else if (process.argv[2] === "--delete") {
    deleteData();
  }
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, "utf-8")
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, "utf-8")
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await Review.create(reviews);
    await User.create(users);

    console.log("Importing data is success");
    // process.exit();
  } catch (err) {
    console.log(err);
    console.log("Importing is failed");
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Deleting data is success");
    // process.exit();
  } catch (err) {
    console.log("Deleting is failed");
  }
};
