const express = require("express");
const router = express.Router();

const outflowController = require("../controllers/outflowController");

router.post("/", outflowController.add);

// router.get("/:id", balanceController.show);
// router.post("/send", lodgementController.recieve);
// router.patch("/:id", balanceController.update);
// router.delete("/:id", balanceController.delete);

module.exports = router;
