const express = require("express");
const router = express.Router();
const { personnelController } = require("../controllers");

router.post("/", personnelController.createNewPersonnel);

module.exports = router;
