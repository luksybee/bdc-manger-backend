const express = require("express");
const router = express.Router();

const lodgementController = require("../controllers/lodgementController");

router.post("/", lodgementController.lodgement);
router.put("/", lodgementController.lodgementUpdate);
router.get("/pending", lodgementController.pending);

module.exports = router;
