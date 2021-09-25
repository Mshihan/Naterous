const express = require("express");
const fs = require("fs");
const app = express();

// app.get("/", (req, res) => {
//   res.status(200).json({ message: "This is a post request", app: "Naterous" });
// });

// app.post("/", (req, res) => {
//   res.send("This is a post request");
// });

const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json"));
console.log(tours);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}......`);
});
