const express = require("express");
const router = express.Router();
const { uploadFile, getFiles } = require("../controllers/file.controller");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", protect, upload.single("file"), uploadFile);
router.get("/:taskId", protect, getFiles);

module.exports = router;
