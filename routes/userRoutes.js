const express = require("express");
const userControllers = require("/app/controllers/userControllers");
const authControllers = require("/app/controllers/authControllers");

// =================================
// Separate Routes accordingly
// =================================

const router = express.Router();

router.route("/signup").post(authControllers.signup);
router.route("/login").post(authControllers.login);
router
  .route("/forgetPassword")
  .post(authControllers.forgetPassword);
router
  .route("/resetPassword/:token")
  .patch(authControllers.resetPassword);

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
