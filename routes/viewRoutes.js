const express = require("express");
const viewController = require("./../controllers/viewControllers");
const authController = require("./../controllers/authControllers");

const router = express.Router();

// router.use(authController.isLoggedIn);

router.get("/", authController.isLoggedIn, viewController.getOverview);
router.get("/login", viewController.getLogin);
router.get("/tours/:slug", authController.isLoggedIn, viewController.getTour);
router.get("/me", authController.protected, viewController.getAccount);

module.exports = router;
