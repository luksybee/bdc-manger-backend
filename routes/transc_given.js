const express = require("express");
const router = express.Router();

const transc_givenController = require("../controllers/transc_givenController");

router.get("/", transc_givenController.index);

router.get("/:id", transc_givenController.show);
router.post("/", transc_givenController.store);
router.put("/:id", transc_givenController.update);
router.delete("/:id", transc_givenController.delete);

module.exports = router;