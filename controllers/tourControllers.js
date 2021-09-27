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
      console.log(err);
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
  const tourId = req.params.id;
  if (tourId > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }
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
