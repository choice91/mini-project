const express = require("express");

// Controllers
const {
  getUserProfile,
  changePassword,
} = require("../controllers/userController");

// Middlewares
const { isAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// /user
router.get("/profile", isAuth, getUserProfile);
router.post("/changePwd", isAuth, changePassword);

module.exports = router;