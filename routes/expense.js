const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expenseController");

router.post("/", expenseController.add);

// router.get("/:id", balanceController.show);
// router.post("/send", lodgementController.recieve);
// router.patch("/:id", balanceController.update);
// router.delete("/:id", balanceController.delete);

module.exports = router;
