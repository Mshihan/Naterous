const express = require("express");
const viewController = require("./../controllers/viewControllers");

const router = express.Router();

router.get("/", viewController.getOverview);

router.get("/tours/:slug", viewController.getTour);
router.get("/login", viewController.getLogin);

module.exports = router;
