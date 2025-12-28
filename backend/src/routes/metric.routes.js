const express = require("express");
const router = express.Router();
const { getMetrics } = require("../controllers/metric.controller");
const { protect } = require("../middleware/auth");

router.get("/", protect, getMetrics);

module.exports = router;
