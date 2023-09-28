const express = require("express");
const router = express.Router();
const { bandController } = require("../controllers");

router.get("/", bandController.getAllBands);
router.get("/:band_id", bandController.getDetailsBand);
router.post("/", bandController.createNewBand);
router.put("/:band_id", bandController.updateBandInfo);
router.patch("/personnel", bandController.addPersonnelToBand);

module.exports = router;
