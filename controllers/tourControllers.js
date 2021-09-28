const fs = require("fs");

// ==============================
// Json file read to sync
// ==============================
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`
  )
);

// ==============================
// Check the body of the request
// ==============================
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Missing name or price",
    });
  }
  next();
};

// exports.checkDoubt = (req, res, next) => {
//   console.log("This is doubt log 🤔");
//   next();
// };

// ==============================
// Check id in the middleware Fn
// ==============================
exports.checkID = (req, res, next, value) => {
  console.log(`The id is: ${value}`);
  if (value > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }
  next();
};

// ==============================
// Get request to send all tours
// ==============================
exports.getTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

// ======================================
// Get request to get a individual tour
// ======================================
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).send("Tour not found");
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

// ===============================
// Post request to create tours
// ===============================

exports.createTour = (req, res) => {
  const tourId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: tourId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    "./dev-data/data/tours-simple.json",
    JSON.stringify(tours),
    (err) => {
      // console.log(err);
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      newTour,
    },
  });
};

// =================================
// Patch request to update the tours
// =================================
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: "<Updated tour details here>",
  });
};

// =================================
// Patch request to update the tours
// =================================
exports.deleteTour = (req, res) => {
  const tourId = req.params.id;
  if (tourId > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }
  res.status(204).json({ status: "success", data: null });
};
