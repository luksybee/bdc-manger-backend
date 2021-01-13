const express = require("express");
const router = express.Router();

const transc_recievedController = require("../controllers/transc_recievedController");

router.get("/", transc_recievedController.index);

router.get("/:id", transc_recievedController.show);
router.post("/", transc_recievedController.store);
// router.put("/", transc_recievedController.update);
router.delete("/:id", transc_recievedController.delete);

module.exports = router;
