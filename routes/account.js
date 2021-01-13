const express = require("express");
const router = express.Router();

const balanceController = require("../controllers/accountController");

router.post("/load", balanceController.create);
router.get("/accounts", balanceController.grouped);
router.get("/", balanceController.accounts);
// router.get("/vault", balanceController.vault);
// router.get("/cashier", balanceController.cashier);

module.exports = router;
