const express = require("express");
const fs = require("fs");
const app = express();

// ==============================
// API request tutorial
// ==============================
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "This is a post request", app: "Naterous" });
// });
// app.post("/", (req, res) => {
//   res.send("This is a post request");
// });

// ==============================
// Express middleware layer
// ==============================
app.use(express.json());

// ==============================
// Json file read to sync
// ==============================
const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json"));

// ==============================
// Get request to send all tours
// ==============================
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

// ======================================
// Get request to get a individual tour
// ======================================
app.get("/api/v1/tours/:id", (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  console.log(tour);
  if (!tour) {
    return res.status(404).send("Tour not found");
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

// ===============================
// Post request to send all tours
// ===============================
app.post("/api/v1/tours", (req, res) => {
  const tourId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: tourId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    "./dev-data/data/tours-simple.json",
    JSON.stringify(tours),
    (err) => {
      console.log(err);
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      newTour,
    },
  });
});

// =================================
// Patch request to update the tours
// =================================
app.patch("/api/v1/tours/:id", (req, res) => {
  const tourId = req.params.id;

  if (tourId > tours.length) {
    return res.status(404).json({ status: "fail", message: "Tour not found" });
  }

  res
    .status(200)
    .json({ status: "success", data: "<Updated tour details here>" });
});

// =================================
// Patch request to update the tours
// =================================
app.delete("/api/v1/tours/:id", (req, res) => {
  const tourId = req.params.id;

  if (tourId > tours.length) {
    return res.status(404).json({ status: "fail", message: "Tour not found" });
  }

  res.status(204).json({ status: "success", data: null });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}......`);
});
