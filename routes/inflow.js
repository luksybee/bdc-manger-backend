const express = require("express");
const router = express.Router();

const inflowController = require("../controllers/inflowController");

router.post("/", inflowController.add);

// router.get("/:id", balanceController.show);
// router.post("/send", lodgementController.recieve);
// router.patch("/:id", balanceController.update);
// router.delete("/:id", balanceController.delete);

module.exports = router;
