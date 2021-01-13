const express = require("express");
const router = express.Router();

const vaultController = require("../controllers/vaultController");

router.get("/", vaultController.vaults);
// router.get("/bank", balanceController.banks);
// router.get("/bank/one", balanceController.bankSpecific);
// router.get("/vault", balanceController.vault);
// router.get("/cashier", balanceController.cashier);

router.post("/load", vaultController.load);

module.exports = router;
