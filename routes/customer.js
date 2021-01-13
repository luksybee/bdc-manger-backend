const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");

router.get("/", customerController.index);

router.get("/info/:phone", customerController.show);
router.post("/", customerController.store
);
router.patch("/:id", customerController.update);
router.delete("/:id", customerController.delete);

module.exports = router;