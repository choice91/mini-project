const express = require("express");

// Controllers
const {
  getUserProfile,
  changePassword,
  changeProfile,
} = require("../controllers/userController");

// Middlewares
const { isAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// /user
router.get("/profile", isAuth, getUserProfile);
router.post("/changePwd", isAuth, changePassword);
router.post("/changeProfile", isAuth, changeProfile);

module.exports = router;
