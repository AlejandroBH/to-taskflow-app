const express = require("express");
const router = express.Router();
const {
  addComment,
  getComments,
} = require("../controllers/comment.controller");
const { protect } = require("../middleware/auth");

router.post("/", protect, addComment);
router.get("/:taskId", protect, getComments);

module.exports = router;
