const express = require("express");
const userControllers = require("../controllers/userControllers");
const authControllers = require("../controllers/authControllers");

// =================================
// Separate Routes accordingly
// =================================

const router = express.Router();

router.route("/signup").post(authControllers.signup);

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
