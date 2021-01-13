const express = require("express");
const router = express.Router();

const customer_accountController = require("../controllers/customer_accountController");

router.get("/", customer_accountController.index);

router.get("/:id", customer_accountController.show);
router.post("/", customer_accountController.store
);
router.patch("/:id", customer_accountController.update);
router.delete("/:id", customer_accountController.delete);

module.exports = router;