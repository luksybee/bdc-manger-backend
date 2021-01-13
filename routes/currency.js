const express = require("express");
const router = express.Router();

const currencyController = require("../controllers/currencyController");

router.get("/", currencyController.index);

// router.get("/:id", currencyController.show);
router.post("/", currencyController.store);
router.patch("/:id", currencyController.update);
router.delete("/:id", currencyController.delete);

router.get("/exchange", currencyController.getExchange);
router.post("/exchange", currencyController.exchanges);

module.exports = router;