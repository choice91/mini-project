const express = require("express");

// Controllers
const { getUserProfile } = require("../controllers/userController");

// Middlewares
const { isAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// /user
router.get("/profile", isAuth, getUserProfile);

module.exports = router;
