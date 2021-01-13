const express = require("express");
const router = express.Router();

const cashierController = require("../controllers/cashierController");

router.get("/", cashierController.cashier);
// router.get("/bank", balanceController.banks);
// router.get("/bank/one", balanceController.bankSpecific);
// router.get("/vault", balanceController.vault);
// router.get("/cashier", balanceController.cashier);

module.exports = router;
