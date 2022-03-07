const express = require("express");
const userControllers = require("../controllers/userControllers");
const authControllers = require("../controllers/authControllers");

// =================================
// Separate Routes accordingly
// =================================

const router = express.Router();

router.route("/signup").post(authControllers.signup);
router.route("/login").post(authControllers.login);
router.route("/logout").get(authControllers.logout);
router.route("/forgetPassword").post(authControllers.forgetPassword);
router
  .route("/resetPassword/:token")
  .patch(authControllers.resetPassword);

router.use(authControllers.protected);

router
  .route("/updateMyPassword")
  .patch(authControllers.updatePassword);

router.patch(
  "/updateMe",
  userControllers.uploadPhoto,
  userControllers.updateMe
);
router.delete("/deleteMe", userControllers.deleteMe);
router.get("/Me", userControllers.getMe, userControllers.getUser);
router.use(authControllers.restrictTo("admin"));

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
