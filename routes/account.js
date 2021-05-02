const express = require("express");
const router = express.Router();

const balanceController = require("../controllers/accountController");

router.post("/", balanceController.create);
router.get("/accounts", balanceController.grouped);
router.get("/", balanceController.accounts);
router.delete("/:id", balanceController.delete);
router.get("/banks", balanceController.banks);

module.exports = router;
