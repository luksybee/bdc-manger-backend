const express = require("express");
const router = express.Router();

const lodgementController = require("../controllers/lodgementController");

router.get("/", lodgementController.show);
router.get("/:id", lodgementController.fetchById);

router.post("/", lodgementController.lodgement);
router.put("/", lodgementController.lodgementUpdate);
router.get("/pending", lodgementController.pending);

module.exports = router;
