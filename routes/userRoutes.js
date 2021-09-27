const express = require("express");

const userControllers = require("../controllers/userControllers");

// =================================
// Separate Routes accordingly
// =================================

const router = express.Router();

router
  .route("/")
  .get(userControllers.getUsers)
  .post(userControllers.createUser);
router
  .route("/:id")
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
