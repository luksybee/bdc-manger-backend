const express = require("express");
const router = express.Router();

const customer_transcController = require("../controllers/customer_transcController");

router.get("/", customer_transcController.all);
router.get("/:id", customer_transcController.show);
router.get("/pending/recieve", customer_transcController.pendingRecieve);
router.get("/pending/give", customer_transcController.pendingGive);
router.get("/completed", customer_transcController.completed);
router.post("/", customer_transcController.store);
router.get("/pending/:id", customer_transcController.show);
router.patch("/:id", customer_transcController.update);
router.delete("/:id", customer_transcController.delete);

module.exports = router;
