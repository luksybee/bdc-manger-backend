const express = require("express");
const router = express.Router();

const bankController = require("../controllers/bankController");
const balanceController = require("../controllers/accountController");

// router.get("/sub/", balanceController.bankSpecific);
router.get("/sub/sub1/", balanceController.bankSub);

router.get("/", bankController.banks);
// router.get("/sub", bankController.bankSpecific);

router.get("/:id", bankController.show);
router.post("/", bankController.store);
router.patch("/:id", bankController.update);
router.delete("/:id", bankController.delete);

module.exports = router;
