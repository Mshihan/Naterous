const express = require("express");
const userControllers = require("../controllers/userControllers");
const authControllers = require("../controllers/authControllers");

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
  .route("/updateMyPassword")
  .patch(
    authControllers.protected,
    authControllers.updatePassword
  );

router.patch(
  "/updateMe",
  authControllers.protected,
  userControllers.updateMe
);
router.delete(
  "/deleteMe",
  authControllers.protected,
  userControllers.deleteMe
);

router
  .route("/")
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);
router
  .route("/:id")
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
