const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
} = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/profile/avatar", protect, upload.single("file"), uploadAvatar);
router.get("/", protect, authorize("admin", "manager"), getUsers);
router.post("/", protect, authorize("admin"), createUser);
router.put("/:id", protect, authorize("admin"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
