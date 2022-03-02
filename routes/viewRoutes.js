const express = require("express");
const viewController = require("./../controllers/viewControllers");
const authController = require("./../controllers/authControllers");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/login", viewController.getLogin);

router.get("/", viewController.getOverview);
router.get("/tours/:slug", viewController.getTour);

module.exports = router;
